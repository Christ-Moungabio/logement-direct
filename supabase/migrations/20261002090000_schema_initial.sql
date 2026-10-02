-- Schéma initial de Logement Direct pour Supabase.

create type public.account_role as enum ('tenant', 'owner', 'admin');
create type public.account_status as enum ('active', 'suspended');
create type public.listing_status as enum ('draft', 'scheduled', 'published', 'closed', 'hidden');
create type public.availability_status as enum ('available', 'available_soon');
create type public.utility_status as enum ('individual', 'shared', 'none');
create type public.close_reason as enum ('rented', 'withdrawn');
create type public.visit_status as enum ('pending', 'confirmed', 'refused', 'expired', 'cancelled', 'completed');
create type public.report_status as enum ('pending', 'resolved', 'rejected');
create type public.report_reason as enum ('false_information', 'already_rented', 'scam', 'other');
create type public.review_status as enum ('published', 'disputed', 'removed');

create table public.property_types (
    id smallint generated always as identity primary key,
    name text not null unique
);

insert into public.property_types (name) values
    ('studio'),
    ('chambre'),
    ('appartement'),
    ('maison'),
    ('villa'),
    ('local commercial');

create table public.cities (
    id uuid primary key default gen_random_uuid(),
    name text not null unique
);

create table public.neighborhoods (
    id uuid primary key default gen_random_uuid(),
    city_id uuid not null references public.cities(id) on delete restrict,
    name text not null,
    unique (city_id, name),
    unique (id, city_id)
);

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    whatsapp_number text not null unique
        check (whatsapp_number ~ '^\+242[0-9]{9}$'),
    email text,
    city_id uuid references public.cities(id) on delete set null,
    role public.account_role not null default 'tenant',
    status public.account_status not null default 'active',
    terms_accepted_at timestamptz not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles
        where id = (select auth.uid())
          and role = 'admin'
          and status = 'active'
    );
$$;

create function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.role is distinct from old.role
       and (select auth.uid()) is not null
       and not public.is_admin() then
        raise exception 'Only an administrator can change an account role';
    end if;

    return new;
end;
$$;

create trigger profiles_protect_role
before update of role on public.profiles
for each row execute function public.protect_profile_role();

create table public.listings (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.profiles(id) on delete restrict,
    property_type_id smallint not null references public.property_types(id) on delete restrict,
    city_id uuid not null references public.cities(id) on delete restrict,
    neighborhood_id uuid not null,
    monthly_rent integer not null check (monthly_rent > 0),
    advance_months smallint not null check (advance_months between 1 and 6),
    description text not null,
    water public.utility_status not null,
    electricity public.utility_status not null,
    doors_count smallint check (doors_count is null or doors_count >= 0),
    availability public.availability_status not null,
    available_from date,
    status public.listing_status not null default 'draft',
    visible_from timestamptz,
    close_reason public.close_reason,
    hidden_reason text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint listings_neighborhood_matches_city
        foreign key (neighborhood_id, city_id)
        references public.neighborhoods(id, city_id) on delete restrict,
    constraint listings_availability_date
        check (
            (availability = 'available' and available_from is null)
            or
            (availability = 'available_soon' and available_from is not null)
        ),
    constraint listings_close_reason
        check ((status = 'closed') = (close_reason is not null)),
    constraint listings_hidden_reason
        check (
            (status = 'hidden' and hidden_reason is not null and length(trim(hidden_reason)) >= 10)
            or
            (status <> 'hidden' and hidden_reason is null)
        ),
    constraint listings_visible_from
        check (
            (status in ('scheduled', 'published') and visible_from is not null)
            or
            (status not in ('scheduled', 'published') and visible_from is null)
        )
);

create function public.guard_listing_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if tg_op = 'INSERT' then
        if new.status <> 'draft' then
            raise exception 'New listings must start as drafts';
        end if;
        return new;
    end if;

    if (select auth.uid()) = old.owner_id and not public.is_admin() then
        if new.owner_id is distinct from old.owner_id then
            raise exception 'A listing owner cannot be changed';
        end if;

        if new.status is distinct from old.status
           and not (
               (old.status = 'draft' and new.status = 'scheduled')
               or (
                   old.status = 'scheduled'
                   and new.status = 'draft'
                   and old.visible_from > now()
               )
               or (old.status = 'published' and new.status = 'closed')
               or (
                   old.status = 'scheduled'
                   and new.status = 'closed'
                   and old.visible_from <= now()
               )
           ) then
            raise exception 'This listing status change is not allowed';
        end if;

        if new.status = 'scheduled' and old.status = 'draft' then
            if new.property_type_id is null
               or new.city_id is null
               or new.neighborhood_id is null
               or new.monthly_rent is null
               or new.advance_months is null
               or nullif(trim(new.description), '') is null
               or new.water is null
               or new.electricity is null
               or new.availability is null
               or (new.availability = 'available_soon' and new.available_from <= current_date)
               or not exists (
                   select 1 from public.listing_photos where listing_id = old.id
               ) then
                raise exception 'Complete the listing details and add a photo before publishing';
            end if;

            new.visible_from := now() + interval '5 minutes';
        elsif new.status = 'draft' and old.status = 'scheduled' then
            new.visible_from := null;
        elsif new.status = 'closed' and old.status = 'published' then
            new.visible_from := null;
        elsif new.status = 'hidden' then
            new.visible_from := null;
        elsif old.status = 'hidden' and new.status = 'published' then
            new.visible_from := now();
        elsif new.visible_from is distinct from old.visible_from then
            raise exception 'The publication time cannot be changed directly';
        end if;

        if new.status = 'closed' and new.close_reason is null then
            raise exception 'A close reason is required';
        end if;
    end if;

    if new.status in ('draft', 'closed', 'hidden') then
        new.visible_from := null;
    elsif old.status = 'hidden' and new.status = 'published' then
        new.visible_from := now();
    end if;

    new.updated_at := now();
    return new;
end;
$$;

create trigger listings_guard_changes
before insert or update on public.listings
for each row execute function public.guard_listing_changes();

create index listings_public_search
    on public.listings (city_id, property_type_id, monthly_rent, visible_from desc)
    where status in ('scheduled', 'published');
create index listings_owner_status on public.listings (owner_id, status);

create table public.listing_photos (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    storage_path text not null unique,
    mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
    file_size_bytes integer not null check (file_size_bytes between 1 and 5242880),
    sort_order smallint not null check (sort_order between 1 and 8),
    is_primary boolean not null default false,
    created_at timestamptz not null default now(),
    unique (listing_id, sort_order)
);

create unique index listing_one_primary_photo
    on public.listing_photos (listing_id)
    where is_primary;

create function public.limit_listing_photos()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    photo_count integer;
begin
    perform 1 from public.listings where id = new.listing_id for update;

    select count(*) into photo_count
    from public.listing_photos
    where listing_id = new.listing_id
      and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

    if photo_count >= 8 then
        raise exception 'A listing can have at most 8 photos';
    end if;

    return new;
end;
$$;

create trigger listing_photos_limit
before insert or update of listing_id on public.listing_photos
for each row execute function public.limit_listing_photos();

create table public.reports (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    reporter_id uuid not null references public.profiles(id) on delete restrict,
    reason public.report_reason not null,
    comment text,
    status public.report_status not null default 'pending',
    handled_by uuid references public.profiles(id) on delete set null,
    handled_at timestamptz,
    created_at timestamptz not null default now(),
    unique (listing_id, reporter_id),
    check ((status = 'pending') = (handled_at is null))
);

create index reports_status_created on public.reports (status, created_at);

create table public.visit_schedules (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    weekday smallint not null check (weekday between 0 and 6),
    starts_at time not null,
    ends_at time not null,
    created_at timestamptz not null default now(),
    check (ends_at > starts_at),
    unique (listing_id, weekday, starts_at, ends_at)
);

create table public.visits (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete restrict,
    tenant_id uuid not null references public.profiles(id) on delete restrict,
    starts_at timestamptz not null,
    ends_at timestamptz not null,
    status public.visit_status not null default 'pending',
    cancellation_reason text,
    requested_at timestamptz not null default now(),
    expires_at timestamptz not null default (now() + interval '48 hours'),
    created_at timestamptz not null default now(),
    check (ends_at = starts_at + interval '30 minutes'),
    check (expires_at > requested_at),
    check (
        (status = 'cancelled' and (cancellation_reason is null or nullif(trim(cancellation_reason), '') is not null))
        or (status <> 'cancelled' and cancellation_reason is null)
    )
);

create unique index visits_one_active_booking_per_slot
    on public.visits (listing_id, starts_at)
    where status in ('pending', 'confirmed');
create index visits_tenant_status on public.visits (tenant_id, status, starts_at);
create index visits_listing_status on public.visits (listing_id, status, starts_at);

create table public.reviews (
    id uuid primary key default gen_random_uuid(),
    visit_id uuid not null unique references public.visits(id) on delete restrict,
    rating smallint not null check (rating between 1 and 5),
    comment text check (comment is null or length(comment) <= 500),
    status public.review_status not null default 'published',
    dispute_reason text,
    decided_by uuid references public.profiles(id) on delete set null,
    decided_at timestamptz,
    created_at timestamptz not null default now(),
    check (status <> 'disputed' or dispute_reason is not null)
);

create index reviews_status_created on public.reviews (status, created_at);

create function public.guard_visit_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    listing_owner uuid;
begin
    if new.listing_id is distinct from old.listing_id
       or new.tenant_id is distinct from old.tenant_id
       or new.starts_at is distinct from old.starts_at
       or new.ends_at is distinct from old.ends_at
       or new.requested_at is distinct from old.requested_at
       or new.expires_at is distinct from old.expires_at then
        raise exception 'Visit participants and time cannot be changed';
    end if;

    select owner_id into listing_owner
    from public.listings
    where id = old.listing_id;

    if (select auth.uid()) = listing_owner and not public.is_admin() then
        if not (
            (old.status = 'pending' and new.status in ('confirmed', 'refused', 'cancelled'))
            or (old.status = 'confirmed' and new.status = 'cancelled')
        ) then
            raise exception 'This visit status change is not allowed';
        end if;

        if new.status = 'cancelled'
           and nullif(trim(new.cancellation_reason), '') is null then
            raise exception 'A cancellation reason is required';
        end if;
    elsif (select auth.uid()) = old.tenant_id and not public.is_admin() then
        if old.status <> 'confirmed'
           or new.status <> 'cancelled'
           or old.starts_at < now() + interval '24 hours' then
            raise exception 'A tenant can cancel a confirmed visit up to 24 hours beforehand';
        end if;
        if new.cancellation_reason is not null then
            raise exception 'Tenants do not need to provide a cancellation reason';
        end if;
    elsif (select auth.uid()) is not null and not public.is_admin() then
        raise exception 'Only the tenant or listing owner can update a visit';
    end if;

    return new;
end;
$$;

create trigger visits_guard_changes
before update on public.visits
for each row execute function public.guard_visit_changes();

create function public.guard_review_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    visit_tenant uuid;
    listing_owner uuid;
begin
    if new.visit_id is distinct from old.visit_id
       or new.rating is distinct from old.rating
       or new.comment is distinct from old.comment then
        raise exception 'Review content cannot be changed after submission';
    end if;

    select v.tenant_id, l.owner_id
    into visit_tenant, listing_owner
    from public.visits v
    join public.listings l on l.id = v.listing_id
    where v.id = old.visit_id;

    if (select auth.uid()) = listing_owner and not public.is_admin() then
        if old.status <> 'published'
           or new.status <> 'disputed'
           or nullif(trim(new.dispute_reason), '') is null then
            raise exception 'A listing owner can only dispute a published review';
        end if;
        if new.decided_by is distinct from old.decided_by
           or new.decided_at is distinct from old.decided_at then
            raise exception 'Only an administrator can decide a review dispute';
        end if;
    elsif public.is_admin() then
        if old.status <> 'disputed' or new.status not in ('published', 'removed') then
            raise exception 'An administrator can only resolve a disputed review';
        end if;

        new.decided_by := (select auth.uid());
        new.decided_at := now();
        new.dispute_reason := old.dispute_reason;
    elsif (select auth.uid()) = visit_tenant then
        raise exception 'A tenant cannot update a submitted review';
    elsif (select auth.uid()) is not null then
        raise exception 'Only the listing owner or an administrator can update a review';
    end if;

    return new;
end;
$$;

create trigger reviews_guard_changes
before update on public.reviews
for each row execute function public.guard_review_changes();

create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    recipient_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    message text not null,
    link text,
    read_at timestamptz,
    created_at timestamptz not null default now()
);

create index notifications_unread
    on public.notifications (recipient_id, created_at desc)
    where read_at is null;

create function public.guard_notification_updates()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.recipient_id is distinct from old.recipient_id
       or new.title is distinct from old.title
       or new.message is distinct from old.message
       or new.link is distinct from old.link
       or new.created_at is distinct from old.created_at
       or (old.read_at is not null and new.read_at is distinct from old.read_at) then
        raise exception 'A notification can only be marked as read';
    end if;

    return new;
end;
$$;

create trigger notifications_guard_updates
before update on public.notifications
for each row execute function public.guard_notification_updates();

create function public.cancel_visits_for_closed_listing()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    with cancelled_visits as (
        update public.visits
        set status = 'cancelled',
            cancellation_reason = 'Annonce fermée : ' || new.close_reason::text
        where listing_id = new.id
          and status in ('pending', 'confirmed')
          and starts_at > now()
        returning tenant_id, listing_id
    )
    insert into public.notifications (recipient_id, title, message, link)
    select
        tenant_id,
        'Visite annulée',
        'La visite est annulée car l’annonce a été fermée.',
        '/visites'
    from cancelled_visits;

    return new;
end;
$$;

create trigger listings_cancel_future_visits
after update of status on public.listings
for each row
when (old.status is distinct from 'closed' and new.status = 'closed')
execute function public.cancel_visits_for_closed_listing();

create function public.refresh_due_visits()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    expired_visits record;
begin
    for expired_visits in
        with expired as (
            update public.visits
            set status = 'expired'
            where status = 'pending'
              and expires_at <= now()
            returning tenant_id, listing_id
        )
        select e.tenant_id, l.owner_id, e.listing_id
        from expired e
        join public.listings l on l.id = e.listing_id
    loop
        insert into public.notifications (recipient_id, title, message, link)
        values
            (expired_visits.tenant_id, 'Demande expirée', 'La demande de visite a expiré.', '/visites'),
            (expired_visits.owner_id, 'Demande expirée', 'Une demande de visite a expiré.', '/visites');
    end loop;

    update public.visits
    set status = 'completed'
    where status = 'confirmed'
      and ends_at <= now();
end;
$$;

create function public.refresh_due_availability()
returns void
language sql
security definer
set search_path = ''
as $$
    update public.listings
    set availability = 'available',
        available_from = null,
        updated_at = now()
    where availability = 'available_soon'
      and available_from <= current_date;
$$;

create function public.publish_due_listings()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
    updated_count integer;
begin
    update public.listings
    set status = 'published',
        updated_at = now()
    where status = 'scheduled'
      and visible_from <= now();

    get diagnostics updated_count = row_count;
    return updated_count;
end;
$$;

revoke all on function public.publish_due_listings() from public, anon, authenticated;
grant execute on function public.publish_due_listings() to service_role;
revoke all on function public.refresh_due_visits() from public, anon, authenticated;
revoke all on function public.refresh_due_availability() from public, anon, authenticated;
grant execute on function public.refresh_due_visits(), public.refresh_due_availability() to service_role;

create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
    'publish-due-listings',
    '* * * * *',
    'select public.publish_due_listings()'
);
select cron.schedule(
    'refresh-due-visits',
    '* * * * *',
    'select public.refresh_due_visits()'
);
select cron.schedule(
    'refresh-due-availability',
    '*/15 * * * *',
    'select public.refresh_due_availability()'
);

-- Les vues publiques ne renvoient jamais le numéro du propriétaire.
create view public.public_listings
with (security_invoker = true)
as
select
    l.id,
    l.owner_id,
    l.property_type_id,
    l.city_id,
    l.neighborhood_id,
    l.monthly_rent,
    l.advance_months,
    l.description,
    l.water,
    l.electricity,
    l.doors_count,
    l.availability,
    l.available_from,
    l.visible_from as published_at,
    l.updated_at
from public.listings l
where l.status in ('scheduled', 'published')
  and l.visible_from <= now()
  and exists (
      select 1 from public.profiles p
      where p.id = l.owner_id and p.status = 'active'
  );

create function public.get_listing_contact(p_listing_id uuid)
returns table (owner_name text, whatsapp_number text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    if (select auth.uid()) is null then
        raise exception 'Sign in to view the owner contact';
    end if;

    if not exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and status = 'active'
    ) then
        raise exception 'An active account is required to view the owner contact';
    end if;

    return query
    select p.full_name, p.whatsapp_number
    from public.listings l
    join public.profiles p on p.id = l.owner_id
    where l.id = p_listing_id
      and l.owner_id <> (select auth.uid())
      and l.status in ('scheduled', 'published')
      and l.visible_from <= now()
      and p.status = 'active';
end;
$$;

revoke all on function public.get_listing_contact(uuid) from public, anon;
grant execute on function public.get_listing_contact(uuid) to authenticated;

alter table public.property_types enable row level security;
alter table public.cities enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.reports enable row level security;
alter table public.visit_schedules enable row level security;
alter table public.visits enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

create policy "Property types are readable"
    on public.property_types for select to anon, authenticated
    using (true);
create policy "Admins manage property types"
    on public.property_types for all to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Cities are readable"
    on public.cities for select to anon, authenticated
    using (true);
create policy "Admins manage cities"
    on public.cities for all to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Neighborhoods are readable"
    on public.neighborhoods for select to anon, authenticated
    using (true);
create policy "Admins manage neighborhoods"
    on public.neighborhoods for all to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Users read their own profile"
    on public.profiles for select to authenticated
    using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Users create their own profile"
    on public.profiles for insert to authenticated
    with check (
        id = (select auth.uid())
        and role in ('tenant', 'owner')
        and status = 'active'
    );
create policy "Users update their own profile"
    on public.profiles for update to authenticated
    using (id = (select auth.uid()) or (select public.is_admin()))
    with check (
        (id = (select auth.uid()) and role in ('tenant', 'owner') and status = 'active')
        or (select public.is_admin())
    );

create policy "Published listings are readable"
    on public.listings for select to anon, authenticated
    using (
        (
            status in ('scheduled', 'published')
            and visible_from <= now()
            and exists (
                select 1 from public.profiles p
                where p.id = owner_id and p.status = 'active'
            )
        )
        or owner_id = (select auth.uid())
        or (select public.is_admin())
    );
create policy "Owners create listings"
    on public.listings for insert to authenticated
    with check (
        owner_id = (select auth.uid())
        and status = 'draft'
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'owner' and status = 'active'
        )
    );
create policy "Owners update their listings"
    on public.listings for update to authenticated
    using (
        owner_id = (select auth.uid())
        and status <> 'hidden'
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'owner' and status = 'active'
        )
    )
    with check (owner_id = (select auth.uid()));
create policy "Owners delete drafts and closed listings"
    on public.listings for delete to authenticated
    using (
        owner_id = (select auth.uid())
        and status in ('draft', 'closed')
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'owner' and status = 'active'
        )
    );
create policy "Admins manage listings"
    on public.listings for all to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Listing photos follow listing access"
    on public.listing_photos for select to anon, authenticated
    using (
        exists (
            select 1 from public.listings l
            where l.id = listing_id
              and (
                  (
                      l.status in ('scheduled', 'published')
                      and l.visible_from <= now()
                      and exists (
                          select 1 from public.profiles p
                          where p.id = l.owner_id and p.status = 'active'
                      )
                  )
                  or l.owner_id = (select auth.uid())
                  or (select public.is_admin())
              )
        )
    );
create policy "Owners manage their listing photos"
    on public.listing_photos for all to authenticated
    using (
        exists (
            select 1 from public.listings l
            where l.id = listing_id and l.owner_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.listings l
            where l.id = listing_id
              and l.owner_id = (select auth.uid())
              and l.status <> 'hidden'
        )
    );
create policy "Admins manage listing photos"
    on public.listing_photos for all to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Reporters and admins read reports"
    on public.reports for select to authenticated
    using (reporter_id = (select auth.uid()) or (select public.is_admin()));
create policy "Tenants report published listings"
    on public.reports for insert to authenticated
    with check (
        reporter_id = (select auth.uid())
        and status = 'pending'
        and handled_by is null
        and handled_at is null
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'tenant' and status = 'active'
        )
        and exists (
            select 1 from public.listings l
            where l.id = listing_id
              and l.owner_id <> (select auth.uid())
              and l.status in ('scheduled', 'published')
              and l.visible_from <= now()
              and exists (
                  select 1 from public.profiles p
                  where p.id = l.owner_id and p.status = 'active'
              )
        )
    );
create policy "Admins handle reports"
    on public.reports for update to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Owners manage visit schedules"
    on public.visit_schedules for all to authenticated
    using (
        exists (
            select 1 from public.listings l
            where l.id = listing_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    )
    with check (
        exists (
            select 1 from public.listings l
            where l.id = listing_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    );

create policy "Tenants and owners read their visits"
    on public.visits for select to authenticated
    using (
        tenant_id = (select auth.uid())
        or exists (
            select 1 from public.listings l
            where l.id = listing_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    );
create policy "Tenants request visits"
    on public.visits for insert to authenticated
    with check (
        tenant_id = (select auth.uid())
        and status = 'pending'
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'tenant' and status = 'active'
        )
        and exists (
            select 1 from public.listings l
            where l.id = listing_id
              and l.status in ('scheduled', 'published')
              and l.visible_from <= now()
              and exists (
                  select 1 from public.profiles p
                  where p.id = l.owner_id and p.status = 'active'
              )
        )
    );
create policy "Owners manage visits for their listings"
    on public.visits for update to authenticated
    using (
        exists (
            select 1 from public.listings l
            where l.id = listing_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    )
    with check (
        exists (
            select 1 from public.listings l
            where l.id = listing_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    );
create policy "Tenants cancel their visits"
    on public.visits for update to authenticated
    using (tenant_id = (select auth.uid()))
    with check (tenant_id = (select auth.uid()) and status = 'cancelled');

create policy "Published reviews are readable"
    on public.reviews for select to anon, authenticated
    using (
        status = 'published'
        or (select public.is_admin())
        or exists (
            select 1
            from public.visits v
            join public.listings l on l.id = v.listing_id
            where v.id = visit_id
              and (v.tenant_id = (select auth.uid()) or l.owner_id = (select auth.uid()))
        )
    );
create policy "Tenants review completed visits"
    on public.reviews for insert to authenticated
    with check (
        status = 'published'
        and exists (
            select 1 from public.visits v
            where v.id = visit_id
              and v.tenant_id = (select auth.uid())
              and v.status = 'completed'
        )
    );
create policy "Owners dispute reviews"
    on public.reviews for update to authenticated
    using (
        exists (
            select 1
            from public.visits v
            join public.listings l on l.id = v.listing_id
            where v.id = visit_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    )
    with check (
        exists (
            select 1
            from public.visits v
            join public.listings l on l.id = v.listing_id
            where v.id = visit_id and l.owner_id = (select auth.uid())
        )
        or (select public.is_admin())
    );

create policy "Users read their notifications"
    on public.notifications for select to authenticated
    using (recipient_id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins create notifications"
    on public.notifications for insert to authenticated
    with check ((select public.is_admin()));
create policy "Users mark their notifications read"
    on public.notifications for update to authenticated
    using (recipient_id = (select auth.uid()))
    with check (recipient_id = (select auth.uid()));

grant select on public.property_types, public.cities, public.neighborhoods to anon, authenticated;
grant select on public.public_listings to anon, authenticated;
grant select on public.listings, public.listing_photos to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete on public.listing_photos to authenticated;
grant select, insert, update on public.reports to authenticated;
grant select, insert, update, delete on public.visit_schedules to authenticated;
grant select, insert, update on public.visits to authenticated;
grant select, insert, update on public.reviews to authenticated;
grant select, insert, update on public.notifications to authenticated;

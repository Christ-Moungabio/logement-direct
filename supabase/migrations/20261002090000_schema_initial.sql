-- Schéma de départ pour les fonctionnalités Must du MVP.
-- Les tables liées aux visites, aux avis et aux notifications viendront plus tard.

create type public.account_role as enum ('tenant', 'owner', 'admin');
create type public.listing_status as enum ('draft', 'scheduled', 'published', 'closed', 'hidden');
create type public.availability_status as enum ('available', 'available_soon');
create type public.utility_status as enum ('individual', 'shared', 'none');
create type public.close_reason as enum ('rented', 'withdrawn');
create type public.report_status as enum ('pending', 'resolved', 'rejected');
create type public.report_reason as enum ('false_information', 'already_rented', 'scam', 'other');

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

-- Données de départ : V1 limitée à Brazzaville.
insert into public.cities (name) values ('Brazzaville');

insert into public.neighborhoods (city_id, name)
select c.id, n.name
from public.cities c
cross join (values
    ('Makélékélé'),
    ('Bacongo'),
    ('Poto-Poto'),
    ('Moungali'),
    ('Ouenzé'),
    ('Talangaï'),
    ('Mfilou'),
    ('Madibou'),
    ('Djiri')
) as n(name)
where c.name = 'Brazzaville';

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    whatsapp_number text not null unique
        check (whatsapp_number ~ '^\+242[0-9]{9}$'),
    email text,
    city_id uuid references public.cities(id) on delete set null,
    role public.account_role not null,
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
        raise exception 'Seul un administrateur peut modifier le rôle d’un compte.';
    end if;

    new.updated_at := now();
    return new;
end;
$$;

create trigger profiles_protect_role
before update on public.profiles
for each row execute function public.protect_profile_role();

create function public.brazzaville_today()
returns date
language sql
stable
set search_path = ''
as $$
    select (now() at time zone 'Africa/Brazzaville')::date;
$$;

-- Champs nullables pour les brouillons, obligatoires dès la publication.
create table public.listings (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.profiles(id) on delete restrict,
    property_type_id smallint references public.property_types(id) on delete restrict,
    city_id uuid references public.cities(id) on delete restrict,
    neighborhood_id uuid,
    monthly_rent integer check (monthly_rent > 0),
    advance_months smallint check (advance_months between 1 and 6),
    description text check (length(trim(description)) > 0),
    water public.utility_status,
    electricity public.utility_status,
    doors_count smallint check (doors_count is null or doors_count >= 0),
    availability public.availability_status,
    available_from date,
    status public.listing_status not null default 'draft',
    visible_from timestamptz,
    published_at timestamptz,
    close_reason public.close_reason,
    hidden_reason text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint listings_neighborhood_matches_city
        foreign key (neighborhood_id, city_id)
        references public.neighborhoods(id, city_id) on delete restrict,
    constraint listings_complete_unless_draft
        check (
            status = 'draft'
            or (
                property_type_id is not null
                and city_id is not null
                and neighborhood_id is not null
                and monthly_rent is not null
                and advance_months is not null
                and description is not null
                and water is not null
                and electricity is not null
                and availability is not null
            )
        ),
    constraint listings_availability_date
        check (
            (availability is null and available_from is null)
            or (availability = 'available' and available_from is null)
            or (availability = 'available_soon' and available_from is not null)
        ),
    constraint listings_published_at
        check ((status = 'draft') = (published_at is null)),
    constraint listings_close_reason
        check ((status = 'closed') = (close_reason is not null)),
    constraint listings_hidden_reason
        check (
            (status = 'hidden' and hidden_reason is not null and length(trim(hidden_reason)) >= 10)
            or (status <> 'hidden' and hidden_reason is null)
        ),
    constraint listings_visible_from
        check (
            (status in ('scheduled', 'published') and visible_from is not null)
            or (status not in ('scheduled', 'published') and visible_from is null)
        )
);

create table public.listing_photos (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    storage_path text not null unique,
    mime_type text not null
        check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
    file_size_bytes integer not null check (file_size_bytes between 1 and 5242880),
    sort_order smallint not null check (sort_order between 1 and 8),
    is_primary boolean not null default false,
    created_at timestamptz not null default now(),
    constraint listing_photos_order
        unique (listing_id, sort_order) deferrable initially deferred
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
    primary_photo_count integer;
begin
    perform 1 from public.listings where id = new.listing_id for update;

    select count(*) into photo_count
    from public.listing_photos
    where listing_id = new.listing_id
      and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

    if photo_count >= 8 then
        raise exception 'Une annonce ne peut pas contenir plus de 8 photos.';
    end if;

    select count(*) into primary_photo_count
    from public.listing_photos
    where listing_id = new.listing_id
      and is_primary;

    if primary_photo_count = 0 then
        new.is_primary := true;
    end if;

    return new;
end;
$$;

create trigger listing_photos_limit
before insert or update of listing_id on public.listing_photos
for each row execute function public.limit_listing_photos();

create function public.reassign_primary_photo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if old.is_primary then
        update public.listing_photos
        set is_primary = true
        where id = (
            select id
            from public.listing_photos
            where listing_id = old.listing_id
            order by sort_order
            limit 1
        );
    end if;

    return null;
end;
$$;

create trigger listing_photos_reassign_primary
after delete on public.listing_photos
for each row execute function public.reassign_primary_photo();

create function public.guard_listing_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.availability = 'available_soon'
       and (tg_op = 'INSERT' or new.available_from is distinct from old.available_from)
       and new.available_from <= public.brazzaville_today() then
        raise exception 'La date de disponibilité doit être dans le futur.';
    end if;

    if tg_op = 'INSERT' then
        if new.status <> 'draft' then
            raise exception 'Une annonce doit être créée en brouillon.';
        end if;
        return new;
    end if;

    new.updated_at := old.updated_at;
    new.published_at := old.published_at;

    if (select auth.uid()) = old.owner_id and not public.is_admin() then
        if (
            new.property_type_id, new.city_id, new.neighborhood_id, new.monthly_rent,
            new.advance_months, new.description, new.water, new.electricity,
            new.doors_count, new.availability, new.available_from
        ) is distinct from (
            old.property_type_id, old.city_id, old.neighborhood_id, old.monthly_rent,
            old.advance_months, old.description, old.water, old.electricity,
            old.doors_count, old.availability, old.available_from
        ) then
            new.updated_at := now();
        end if;

        if new.owner_id is distinct from old.owner_id then
            raise exception 'Le propriétaire d’une annonce ne peut pas être modifié.';
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
            raise exception 'Ce changement de statut n’est pas autorisé.';
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
               or not exists (
                   select 1 from public.listing_photos where listing_id = old.id
               ) then
                raise exception 'Complétez les informations et ajoutez au moins une photo avant de publier.';
            end if;

            if new.availability = 'available_soon'
               and new.available_from <= public.brazzaville_today() then
                raise exception 'La date de disponibilité doit être dans le futur.';
            end if;

            new.visible_from := now() + interval '5 minutes';
            new.published_at := new.visible_from;
        elsif new.visible_from is distinct from old.visible_from then
            raise exception 'La date de mise en ligne ne peut pas être modifiée directement.';
        end if;

        if old.status = 'scheduled' and new.status = 'draft' then
            new.published_at := null;
        end if;

        if new.status = 'closed' and new.close_reason is null then
            raise exception 'Choisissez un motif pour fermer l’annonce.';
        end if;
    elsif public.is_admin() then
        if new.owner_id is distinct from old.owner_id
           or new.property_type_id is distinct from old.property_type_id
           or new.city_id is distinct from old.city_id
           or new.neighborhood_id is distinct from old.neighborhood_id
           or new.monthly_rent is distinct from old.monthly_rent
           or new.advance_months is distinct from old.advance_months
           or new.description is distinct from old.description
           or new.water is distinct from old.water
           or new.electricity is distinct from old.electricity
           or new.doors_count is distinct from old.doors_count
           or new.availability is distinct from old.availability
           or new.available_from is distinct from old.available_from
           or new.close_reason is distinct from old.close_reason then
            raise exception 'Un administrateur peut uniquement modérer une annonce.';
        end if;

        if new.status is distinct from old.status
           and not (
               (old.status = 'published' and new.status = 'hidden')
               or (
                   old.status = 'scheduled'
                   and new.status = 'hidden'
                   and old.visible_from <= now()
               )
               or (old.status = 'hidden' and new.status = 'published')
           ) then
            raise exception 'Ce changement de statut n’est pas autorisé.';
        end if;

        if old.status = 'hidden' and new.status = 'published' then
            new.visible_from := new.published_at;
            new.hidden_reason := null;
        elsif new.status = 'hidden' and old.status <> 'hidden' then
            new.visible_from := null;
        elsif new.visible_from is distinct from old.visible_from then
            raise exception 'La date de mise en ligne ne peut pas être modifiée directement.';
        end if;
    end if;

    if new.status in ('draft', 'closed', 'hidden') then
        new.visible_from := null;
    end if;

    return new;
end;
$$;

create trigger listings_guard_changes
before insert or update on public.listings
for each row execute function public.guard_listing_changes();

create index listings_public_search
    on public.listings (city_id, property_type_id, monthly_rent, published_at desc)
    where status in ('scheduled', 'published');
create index listings_owner_status on public.listings (owner_id, status);

create table public.reports (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid references public.listings(id) on delete set null,
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

create function public.refresh_listing_states()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
    updated_count integer;
begin
    update public.listings
    set availability = 'available',
        available_from = null
    where availability = 'available_soon'
      and available_from <= public.brazzaville_today();

    update public.listings
    set status = 'published'
    where status = 'scheduled'
      and visible_from <= now();

    get diagnostics updated_count = row_count;

    return updated_count;
end;
$$;

revoke all on function public.refresh_listing_states() from public, anon, authenticated;
grant execute on function public.refresh_listing_states() to service_role;

create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
    'actualiser-et-publier-les-annonces',
    '* * * * *',
    'select public.refresh_listing_states()'
);

-- Cette vue publique ne contient jamais le numéro du propriétaire.
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
    l.published_at,
    l.updated_at
from public.listings l
where l.status in ('scheduled', 'published')
  and l.visible_from <= now();

create function public.get_listing_contact(p_listing_id uuid)
returns table (owner_name text, whatsapp_number text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    if (select auth.uid()) is null then
        raise exception 'Connectez-vous pour voir les coordonnées du propriétaire.';
    end if;

    if not exists (
        select 1 from public.profiles
        where id = (select auth.uid())
    ) then
        raise exception 'Un compte connecté est nécessaire pour voir ces coordonnées.';
    end if;

    return query
    select p.full_name, p.whatsapp_number
    from public.listings l
    join public.profiles p on p.id = l.owner_id
    where l.id = p_listing_id
      and l.owner_id <> (select auth.uid())
      and l.status in ('scheduled', 'published')
      and l.visible_from <= now();
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

create policy "Les types de logement sont consultables"
    on public.property_types for select to anon, authenticated
    using (true);
create policy "Les villes sont consultables"
    on public.cities for select to anon, authenticated
    using (true);
create policy "Les quartiers sont consultables"
    on public.neighborhoods for select to anon, authenticated
    using (true);
create policy "Les utilisateurs consultent leur profil"
    on public.profiles for select to authenticated
    using (id = (select auth.uid()));
create policy "Les administrateurs consultent les profils"
    on public.profiles for select to authenticated
    using ((select public.is_admin()));
create policy "Les utilisateurs créent leur profil"
    on public.profiles for insert to authenticated
    with check (
        id = (select auth.uid())
        and role in ('tenant', 'owner')
    );
create policy "Les utilisateurs modifient leur profil"
    on public.profiles for update to authenticated
    using (id = (select auth.uid()))
    with check (
        (id = (select auth.uid()) and role in ('tenant', 'owner'))
    );

create policy "Les annonces publiées sont consultables"
    on public.listings for select to anon, authenticated
    using (
        (
            status in ('scheduled', 'published')
            and visible_from <= now()
        )
        or owner_id = (select auth.uid())
        or (select public.is_admin())
    );
create policy "Les propriétaires créent leurs annonces"
    on public.listings for insert to authenticated
    with check (
        owner_id = (select auth.uid())
        and status = 'draft'
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'owner'
        )
    );
create policy "Les propriétaires modifient leurs annonces"
    on public.listings for update to authenticated
    using (
        owner_id = (select auth.uid())
        and status <> 'hidden'
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'owner'
        )
    )
    with check (owner_id = (select auth.uid()));
create policy "Les propriétaires suppriment leurs brouillons et annonces fermées"
    on public.listings for delete to authenticated
    using (
        owner_id = (select auth.uid())
        and status in ('draft', 'closed')
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'owner'
        )
    );
create policy "Les administrateurs gèrent les annonces"
    on public.listings for update to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Les photos suivent la visibilité de l’annonce"
    on public.listing_photos for select to anon, authenticated
    using (
        exists (
            select 1 from public.listings l
            where l.id = listing_id
              and (
                  (
                      l.status in ('scheduled', 'published')
                      and l.visible_from <= now()
                  )
                  or l.owner_id = (select auth.uid())
                  or (select public.is_admin())
              )
        )
    );
create policy "Les propriétaires gèrent les photos de leurs annonces"
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
create policy "Les utilisateurs consultent leurs signalements"
    on public.reports for select to authenticated
    using (reporter_id = (select auth.uid()) or (select public.is_admin()));
create policy "Les locataires signalent une annonce publiée"
    on public.reports for insert to authenticated
    with check (
        reporter_id = (select auth.uid())
        and status = 'pending'
        and handled_by is null
        and handled_at is null
        and exists (
            select 1 from public.profiles
            where id = (select auth.uid()) and role = 'tenant'
        )
        and exists (
            select 1 from public.listings l
            where l.id = listing_id
              and l.owner_id <> (select auth.uid())
              and l.status in ('scheduled', 'published')
              and l.visible_from <= now()
        )
    );
create policy "Les administrateurs traitent les signalements"
    on public.reports for update to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

grant select on public.property_types, public.cities, public.neighborhoods to anon, authenticated;
grant select on public.public_listings to anon, authenticated;
grant select on public.listings, public.listing_photos to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete on public.listing_photos to authenticated;
grant select, insert, update on public.reports to authenticated;

-- Bucket public des photos, chemin attendu : <listing_id>/<fichier>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'listing-photos',
    'listing-photos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Les propriétaires ajoutent des photos à leurs annonces"
    on storage.objects for insert to authenticated
    with check (
        bucket_id = 'listing-photos'
        and exists (
            select 1 from public.listings l
            where l.id::text = (storage.foldername(name))[1]
              and l.owner_id = (select auth.uid())
              and l.status <> 'hidden'
        )
    );
create policy "Les propriétaires modifient les photos de leurs annonces"
    on storage.objects for update to authenticated
    using (
        bucket_id = 'listing-photos'
        and exists (
            select 1 from public.listings l
            where l.id::text = (storage.foldername(name))[1]
              and l.owner_id = (select auth.uid())
              and l.status <> 'hidden'
        )
    );
create policy "Les propriétaires suppriment les photos de leurs annonces"
    on storage.objects for delete to authenticated
    using (
        bucket_id = 'listing-photos'
        and exists (
            select 1 from public.listings l
            where l.id::text = (storage.foldername(name))[1]
              and l.owner_id = (select auth.uid())
        )
    );
create policy "Les photos suivent la visibilité de l’annonce dans le stockage"
    on storage.objects for select to anon, authenticated
    using (
        bucket_id = 'listing-photos'
        and exists (
            select 1 from public.listings l
            where l.id::text = (storage.foldername(name))[1]
              and (
                  (
                      l.status in ('scheduled', 'published')
                      and l.visible_from <= now()
                  )
                  or l.owner_id = (select auth.uid())
                  or (select public.is_admin())
              )
        )
    );

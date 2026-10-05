create function public.hide_listing_and_resolve_reports(p_listing_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not public.is_admin() then
        raise exception 'Seul un administrateur peut masquer une annonce.';
    end if;

    update public.listings
    set status = 'hidden', hidden_reason = p_reason
    where id = p_listing_id
      and status in ('published', 'scheduled');

    if not found then
        raise exception 'Cette annonce ne peut pas être masquée.';
    end if;

    update public.reports
    set status = 'resolved', handled_by = (select auth.uid()), handled_at = now()
    where listing_id = p_listing_id
      and status = 'pending';
end;
$$;

grant execute on function public.hide_listing_and_resolve_reports(uuid, text) to authenticated;

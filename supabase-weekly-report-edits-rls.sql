begin;

alter table public.weekly_report_edits enable row level security;

drop policy if exists "weekly_report_edits_public_select" on public.weekly_report_edits;
drop policy if exists "weekly_report_edits_public_insert" on public.weekly_report_edits;
drop policy if exists "weekly_report_edits_public_update" on public.weekly_report_edits;

create policy "weekly_report_edits_public_select"
on public.weekly_report_edits
for select
to anon, authenticated
using (true);

create policy "weekly_report_edits_public_insert"
on public.weekly_report_edits
for insert
to anon, authenticated
with check (true);

create policy "weekly_report_edits_public_update"
on public.weekly_report_edits
for update
to anon, authenticated
using (true)
with check (true);

commit;

-- Run this in Supabase SQL Editor AFTER the main schema.sql
-- Sets up the review-photos storage bucket

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict do nothing;

create policy "Anyone can view review photos"
  on storage.objects for select
  using (bucket_id = 'review-photos');

create policy "Authenticated users can upload review photos"
  on storage.objects for insert
  with check (
    bucket_id = 'review-photos'
    and auth.role() = 'authenticated'
  );

create policy "Users can delete their own review photos"
  on storage.objects for delete
  using (
    bucket_id = 'review-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

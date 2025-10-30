-- Credits table for monetization
-- Run this in your Supabase SQL editor.

create table if not exists public.credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.credits enable row level security;

-- Policy: users can select their own credits row
create policy "Users can read own credits"
  on public.credits for select
  using (auth.uid() = user_id);

-- Policy: users can update their own credits via RPC only (optional). If you want direct updates:
create policy "Users can update own credits"
  on public.credits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RPC to safely increment/decrement credits to avoid race conditions
create or replace function public.adjust_credits(delta integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.credits
  set balance = greatest(0, balance + delta),
      updated_at = now()
  where user_id = auth.uid();
  if not found then
    insert into public.credits(user_id, balance)
    values (auth.uid(), greatest(0, delta));
  end if;
end;
$$;

grant execute on function public.adjust_credits(integer) to authenticated;
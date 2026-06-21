create table if not exists public.game_play_counts (
  kid text not null,
  game_id text not null,
  play_count bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (kid, game_id)
);

create or replace function public.increment_play_count(
  target_kid text,
  target_game_id text
)
returns bigint
language plpgsql
security definer
as $$
declare
  new_count bigint;
begin
  insert into public.game_play_counts (kid, game_id, play_count)
  values (target_kid, target_game_id, 1)
  on conflict (kid, game_id)
  do update set
    play_count = public.game_play_counts.play_count + 1,
    updated_at = now()
  returning play_count into new_count;

  return new_count;
end;
$$;

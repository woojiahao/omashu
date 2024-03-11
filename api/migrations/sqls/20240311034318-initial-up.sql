-- TODO: Add check for emails
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    password_hash text,
    username text
);

create unique index users_username on users (lower(username));

create table if not exists book_clubs (
    id uuid primary key default gen_random_uuid(),
    name text not null
);

create type book_club_user_status as enum ('INVITE_SENT', 'INVITE_REJECTED', 'INVITE_RESCINDED', 'JOINED');

create table if not exists book_club_users (
    user_id uuid not null,
    book_club_id uuid not null,
    joined_at timestamptz,
    status book_club_user_status not null default 'INVITE_SENT',
    primary key (user_id, book_club_id),
    check (status <> 'JOINED' or (status = 'JOINED' and joined_at is not null))
);
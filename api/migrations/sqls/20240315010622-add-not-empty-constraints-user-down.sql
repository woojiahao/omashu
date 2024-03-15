alter table users
drop constraint users_email_not_empty_check;

alter table users
drop constraint users_password_hash_not_empty_check;

alter table users
drop constraint users_username_not_empty_check;
alter table users
add constraint users_email_not_empty_check
check (trim(email) <> '');

alter table users
add constraint users_password_hash_not_empty_check
check (trim(password_hash) <> '');

alter table users
add constraint users_username_not_empty_check
check (trim(username) <> '');
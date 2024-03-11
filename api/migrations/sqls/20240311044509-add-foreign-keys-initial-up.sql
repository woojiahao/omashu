alter table book_club_users
add constraint book_club_user_users_fk
foreign key (user_id)
references users (id);

alter table book_club_users
add constraint book_club_user_book_club_fk
foreign key (book_club_id)
references book_clubs (id);
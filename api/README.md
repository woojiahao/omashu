# Omashu API

## Starting the server

Start the server in development mode using the following.

```
yarn start:dev
```

## Environment variables

All can be found in `.env.example`.

1. `DATABASE_URL`: PostgreSQL connection string
2. `JWT_SECRET`: custom JWT secret

## Database migrations

Perform database migrations on the specified `DATABASE_URL` with

```
yarn migrate:up
```

Rollback latest migration with

```
yarn migrate:down
```

Create new migration with

```
yarn migrate:new
```

\* Note that migrations use raw SQL over Javascript to aid in ease of readability and modification.
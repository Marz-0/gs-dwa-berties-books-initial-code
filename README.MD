# Berties Books

A sample application built for the **Dynamic Web Applications** module.

Powered by **Node.js**, **Express**, and **EJS**.

------------------------------------------------------------------------

## Setup & Installation

### 1. Install dependencies

``` bash
npm install
```

### 2. Prepare the MySQL database

Start MySQL:

``` bash
mysql -u root -p
```

Run the setup script:

``` sql
SOURCE create_db.sql;
```

The provided `create_db.sql` in this repo creates the `berties_books` database and the following tables:

- `books`
- `users` (columns include `id, username, first, last, email, password`)
- `login_audit` (columns: `id, identifier, success, reason, ip, created_at`)

If you prefer, you can run the SQL statements manually instead of sourcing the file.

### 3. (Optional) Insert sample data

``` sql
SOURCE insert_test_data.sql;
```

### 4. Configuration / Environment variables

Create a `.env` file:

    BB_USER=berties_books_app
    BB_PASSWORD=qwertyuiop
    BB_DATABASE=berties_books

`.env` is git-ignored for security.

### 5. Start the server

``` bash
npm start
```

The application will be available at `http://localhost:8000` unless you change the port.

------------------------------------------------------------------------

## Features

### Books Module

- Search for books by title
- View all books
- Add new book entries
- View bargain books (under £20)

### User Accounts

- User registration with bcrypt password hashing
- Login system with authentication
- View all registered users (`/users/list`)

### Login Audit Logging

Login attempts (successful and failed) are recorded to the `login_audit` table. Current implementation details:

- Table: `login_audit` with columns: `identifier` (username/email submitted), `success` (1/0), `reason` (text), `ip`, `created_at` (timestamp).
- Logging is implemented in `routes/users.js` via a helper that inserts a row for every login attempt.
- The audit history is exposed at `/users/audit` and rendered by `views/users_audit.ejs`.

Failure reasons currently include: missing credentials, user not found, no password stored, incorrect password.

------------------------------------------------------------------------

## Notes about column names and conventions

- The codebase currently uses a mix of password column names in different places (`password`, `hashedPassword`). The `create_db.sql` in this repo creates a `users.password` column; registration code inserts a hashed password into a column named `hashedPassword` in some places — you may want to standardize this to `password` (or update the SQL) for consistency.
- The audit table is named `login_audit` in the repository (not `login_attempts`) — the README and any external documentation should reference `login_audit`.

------------------------------------------------------------------------

## Testing the app

1. Ensure the DB schema is created (run `create_db.sql`).
2. Start the app:

```powershell
node index.js
```

3. Useful URLs:

- Register: `http://localhost:8000/users/register`
- Login: `http://localhost:8000/users/login`
- Users list: `http://localhost:8000/users/list`
- Audit: `http://localhost:8000/users/audit`

4. Try successful and failed logins and then view the audit page to verify entries appear.

------------------------------------------------------------------------
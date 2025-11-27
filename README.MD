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

    BB_HOST='localhost'
    BB_USER='berties_books_app'
    BB_PASSWORD='qwertyuiop'
    BB_DATABASE='berties_books'

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

### Access control
- log in and log out system
- stop users from accessing certain parts of the website, e.g user lists and adding a book without having an account. Users need to log in first to access these links/pages.

### Login Audit Logging

Login attempts (successful and failed) are recorded to the `login_audit` table. Current implementation details:

- Table: `login_audit` with columns: `identifier` (username/email submitted), `success` (1/0), `reason` (text), `ip`, `created_at` (timestamp).
- Logging is implemented in `routes/users.js` via a helper that inserts a row for every login attempt.
- The audit history is exposed at `/users/audit` and rendered by `views/users_audit.ejs`.

Failure reasons currently include: missing credentials, user not found, no password stored, incorrect password.


## Validation

Validation has been added in text boxes where uses must enter text or information to add to the database. We use the express-validator module to validate fields. This is done using "checks" based on each feild.
In my code, I have added validation to:

- The register page checks for:
    - If the email is valid
    - if the username is at least 5 charcters long, with a max of 20 characters
    - if the password is at least 8 characters long
    - if the first name has any input in (not empty)
    - if the last name has any input in (not empty)

- The search page check for: 
    - If the input is has input in (not empty)

- The add books page checks for:
    - If the book name is has input (not empty)
    - If the price has any input (not empty)


## Sanitation

sanitation has been added in text boxes to prevent users from any Cross-Site Scripting (XSS) attacks. 

We use the express-sanitizer module to sanitise our fields. This is done by wraping any request body with req.sanitize. This prevents any XSS attacks in our website. 

The following pages have been sanitized:

- The register page:
    - First name
    - Fast name
    - Email
    - Hashed password 

As these are output onto the page once users have registered

- The add books page: 
    - Book name
    - Price (Although this is not needed, as it forces users to only input a number)



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
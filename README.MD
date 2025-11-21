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

You can also manually run the SQL commands to create:

-   `berties_books` database\
-   `books` table\
-   `users` table (optional)\
-   `login_attempts` table for login auditing\
-   MySQL user `berties_books_app` with correct privileges

### 3. (Optional) Insert sample data

``` sql
SOURCE insert_test_data.sql;
```

### 4. Configure environment variables

Create a `.env` file:

    BB_USER=berties_books_app
    BB_PASSWORD=qwertyuiop
    BB_DATABASE=berties_books

`.env` is git-ignored for security.

### 5. Start the server

``` bash
npm start
```

The application will be available at:

    http://localhost:8000

------------------------------------------------------------------------

## Features

### Books Module

-   Search for books by title\
-   View all books\
-   Add new book entries\
-   View bargain books (under £20)

### User Accounts

-   User registration with bcrypt password hashing\
-   Login system with authentication\
-   View all registered users

### Login Audit Logging

All login attempts (successful or failed) are stored in the
`login_attempts` table.

Logged details include:

-   Username\
-   Success or failure\
-   Reason for failure\
-   Timestamp

Access the audit page at:

    /users/audit

Failure reasons tracked: - Missing credentials\
- Unknown user\
- Incorrect password

------------------------------------------------------------------------

## Environment Variables (dotenv)

The project uses the `dotenv` package to load sensitive configuration:

-   Loaded via `require('dotenv').config()` in `index.js`
-   Variables: `BB_USER`, `BB_PASSWORD`, `BB_DATABASE`
-   Used to configure the MySQL connection pool
-   `.env` is ignored by Git for security

------------------------------------------------------------------------
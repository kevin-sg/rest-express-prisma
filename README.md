# REST API Example

This example shows how to implement a REST API using `Express` and `Prisma Client`. It uses a SQLite database file with some initial dummy data which you can find at `./prisma/dev.db`.

### Getting started

### 1. Install dependencies

Clone this repository:

```shell
git clone https://github.com/kevin-sg/rest-express-prisma.git
```

Install pnpm dependencies:

```shell
cd rest-express-prisma
pnpm install
```

### 2. Create and seed the database

Database environment variables `.env`:

```
# default SQLite
DATABASE_URL = file:./dev.db
```

The seed file in `prisma/seed.ts` will be executed and your database will be populated with the sample data.
Execute seed command:

```shell
pnpm prisma:seed
```

<details><summary><strong>Optional:</strong> Seed the database with endpoint</summary>

This request will reset the database and populate the database with data:

```shell
curl http://localhost:8080/seed
```

</details>

### 3. Start the REST API server

```shell
pnpm dev
```

The server is now running on `http://localhost:8080`.

## Explore the data in Prisma Studio.

Prisma comes with a built-in GUI to view and edit the data in your database. You can open it using the following command:

```shell
pnpm prisma:studio
```

## Reset the database

- Drop the database
- Create a new database
- Apply migrations
- Seed the database with data

```shell
pnpm prisma:reset
```

### Environment example

Create a new `.env`:

```shell
# default PORT
PORT = 8080

# prefix
GLOBAL_PREFIX = /api

# db connection
DATABASE_URL = file:./dev.db

# JWT
JWT_PRIVATE_KEY = secretOrPrivateKey
JWT_TIME_EXPIRATION = 24h

# cookie
COOKIE_NAME = access_token
COOKIE_PRIVATE_KEY  = cookieOrPrivateKey
```

## Using the REST API

You can access the REST API of the server using the following endpoints:

Global prefix of environment:
`GLOBAL_PREFIX = /api`

### `auth`:

- `GET`

  - `/auth/revalidate` Request and revalidate new `token`
  - `/auth/logout` Close session and `cookie` cleaning

- `POST`:
  - `/auth/login` Login and user authentication
    - Body:
      - `email: String` (required): The email of user
      - `password: String` (required): The password of user

### `user`:

- `GET`

  - `/user` Fetch all active user and requires authentication
  - `/user/:id` Fetch a single user by `id` and requires authentication

- `POST`:

  - `/user` Fetch a create to user
    - Body:
      - `name: String` (required): The name of user
      - `lastName: String` (optional): The last name of user
      - `email: String` (required): The email of user
      - `password: String` (required): The password of user

- `PUT`:

  - `/user` Update user and requires authentication
    - Body:
      - `name: String` (optional): The name of user
      - `lastName: String` (optional): The last name of user
      - `email: String` (optional): The email of user
      - `password: String` (optional): The password of user

- `DELETE`:
  - `/user` Disable a user and requires authentication

### `post`:

- `GET`

  - `/post` Fetch all published post and requires authentication
  - `/post/:id` Fetch a single post by `id`, returns all posts and requires authentication

- `POST`:

  - `/post` Create a new post and requires authentication
    - Body:
      - `title: String` (required): The unique name of the post
      - `content: String` (optional): The content of post
      - `published: Boolean` (optional): The status of the post and the default is `true`
      - `userId: String` (optional): The `userId` is provided automatically by the user

- `PUT`:

  - `/post/:id` Update post by `id` and requires authentication
    - Body:
      - `title: String` (optional): The unique name of the post
      - `content: String` (optional): The content of post
      - `published: Boolean` (optional): The status of the post and the default is `true`
      - `userId: String` (optional): The `userId` is provided automatically by the user

- `DELETE`:
  - `/post` Delete active post and require authentication

### Demo account

When executing the seed command, two demo accounts are generated:

```
# demo 1
email: tom@prisma.io
password: @Demo123

# demo 2
email: bob@express.com
password: @Demo123
```

### Switch to another database (e.g. PostgreSQL, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the the database connection in `prisma/schema.prisma` by reconfiguring the `datasource` block.

Learn more about the different connection configurations in the [docs](https://www.prisma.io/docs/reference/database-reference/connection-urls).

<details><summary>Expand for an overview of example configurations with different databases</summary>

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
}
```

### MongoDB

Here is an example connection string with a local MongoDB database:

```prisma
datasource db {
  provider = "mongodb"
  url      = "mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
}
```

</details>

### Project structure and files

```
rest-express-prisma
├── README.md
├── package.json
├── pnpm-lock.yaml
├── prisma
│   ├── dev.db
│   ├── migrations
│   │   ├── 20230522152146_initial
│   │   │   └── migration.sql
│   │   ├── 20230522172659_second
│   │   │   └── migration.sql
│   │   ├── 20230522203222_third
│   │   │   └── migration.sql
│   │   ├── 20230523224611_fourth
│   │   │   └── migration.sql
│   │   ├── 20230524163001_fifth
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── prisma-client.ts
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── controllers
│   │   ├── abs.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── index.ts
│   │   ├── post.controller.ts
│   │   ├── seed.controller.ts
│   │   └── user.controller.ts
│   ├── dto
│   │   ├── index.ts
│   │   ├── post
│   │   │   ├── create-post.dto.ts
│   │   │   ├── index.ts
│   │   │   └── update-post.dto.ts
│   │   └── user
│   │       ├── create-user.dto.ts
│   │       ├── index.ts
│   │       ├── login-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── index.ts
│   ├── middleware
│   │   ├── authenticate.middleware.ts
│   │   ├── index.ts
│   │   └── validation.middleware.ts
│   ├── models
│   │   ├── http-exception.model.ts
│   │   ├── index.ts
│   │   ├── post.model.ts
│   │   └── user.model.ts
│   ├── routers
│   │   ├── auth.router.ts
│   │   ├── constant.ts
│   │   ├── index.ts
│   │   ├── post.router.ts
│   │   ├── seed.router.ts
│   │   └── user.router.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── index.ts
│   │   ├── post.service.ts
│   │   ├── seed.service.ts
│   │   └── user.service.ts
│   └── utils
│       ├── cookie.util.ts
│       ├── error-handler.util.ts
│       ├── http-status.util.ts
│       ├── index.ts
│       ├── jwt.util.ts
│       └── logger.util.ts
├── tsconfig.json
└── types
    ├── environment.d.ts
    ├── express.d.ts
    └── jwt.d.ts
```

### Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs/getting-started)
- Guide for new user of [pnpm docs](https://pnpm.io/es/cli/add)
- Create issues and ask questions on [Kevin S.](https://github.com/kevin-sg/rest-express-prisma.git)

**Author**: [Kevin S.](https://github.com/kevin-sg)

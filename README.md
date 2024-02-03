<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation with Docker

### Development

#### Environment variables

Create **.env** file in the root directory and add the following environment variables:

```env
NODE_ENV="development"
PORT=3621

POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="database"
DATABASE_URL=`postgresql://user:password@db:5432/database?schema=public`

JWT_ACCESS_SECRET='my_secret_key'
JWT_REFRESH_SECRET='my_secret_key'

API_URL=`http://localhost:${PORT}/api`

# Resend
RESEND_API_KEY='your_api_key'
RESEND_FROM_ADDRESS='Display Name <address@email.com>'
```

#### Build the image and run the container

```bash
# Execute docker-compose.yml file.
$ docker-compose up --build
```

### Production

#### Environment variables

Create **.env** file in the root directory and add the following environment variables:

```env
NODE_ENV="production"
PORT=3926

POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="database"
DATABASE_URL=`postgresql://user:password@db:5432/database?schema=public`

JWT_ACCESS_SECRET='my_secret_key'
JWT_REFRESH_SECRET='my_secret_key'

API_URL=`http://localhost:${PORT}/api`

# Resend
RESEND_API_KEY='your_api_key'
RESEND_FROM_ADDRESS='Display Name <address@email.com>'
```

#### Build the image and run the container

```bash
# Execute docker-compose.yml file.
$ docker-compose -f docker-compose.prod.yml up --build
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

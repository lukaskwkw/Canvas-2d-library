# Wrepp

Simple boilerplate that include all good stuff - webpack, react, eslint, prettier and pre-hooks

## Prerequisites:

[NodeJS v12.2.0](https://nodejs.org/en/)

## Installation

```sh
npm install
```

Running development server:

```sh
npm start
```

Open webrowser on [localhost:8080](localhost:8080)

## Building

```sh
npm run build:production
```

Move dist files to your server

#

## Docker

### Prerequisites:

[Docker](https://docs.docker.com/install/)

### One command for build and run

```sh
npm run docker:deploy $CONTAINER_NAME
```

Open webrowser on [localhost:8112](localhost:8112)

### Building:

```sh
npm run docker:build
```

### Running

```sh
npm run docker:run $CONTAINER_NAME
```

Open webrowser on [localhost:8112](localhost:8112)

or

```sh
npm run docker:run:port $CONTAINER_NAME $PORT
```

Where:

**\$CONTAINER_NAME** = your new conatiner desired name

**\$PORT** is a port to access your container

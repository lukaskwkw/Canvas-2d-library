# Canvas-2d-library
Canvas 2d library with support of physic (gravity, spring, orbiting). 
This library is a ongoing result of "Coding Math" youtube series. 
Project is based on my [boirelplate](https://github.com/lukaskwkw/wrepp-boilerplate/) with addition of typescript support


## Current status:
* Support of plane boundaries crossing: (bouncingBoundires, moveToOtherSide, emmitter, removeDeadParticles).
* Basic particle physics (gravity, spring, orbiting).
* Particle basic movements, acceleration, rotation.
* Reimplemation of default bezier functions - quadric, bezier (additional - multiquadric), 
with new functions you can iterate through steps (move objects along the bezier line)
* Support many customable rendeners with animations i.e. pulse, alpha, lissajous curves


## Prerequisites:

[NodeJS v12.2.0](https://nodejs.org/en/)

## Installation

```sh
npm install
```

## Running

Start development server:

```sh
npm run start:dev
```

Open webrowser at [localhost:8080](localhost:8080)


Start production server:

```sh
npm run start
```

with pre-build

```sh
npm run build-and-run
```


Open webrowser at [localhost:3000](localhost:3000)

## Building

client

```sh
npm run build-client
```

server

```sh
npm run build-server
```

## To-do:
* Particle collision support
* Drag and drop particles
* Dockerize

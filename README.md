[![Build Status](https://travis-ci.com/proSingularity/destrobot.svg?branch=master)](https://travis-ci.com/proSingularity/destrobot)
[![codecov](https://codecov.io/gh/proSingularity/destrobot/branch/master/graph/badge.svg)](https://codecov.io/gh/proSingularity/destrobot)

# DestroBot

**Play now at [prosingularity.github.io/destrobot/](https://prosingularity.github.io/destrobot/).**

A phaser3 survival top-down shooter game in TypeScript - WITH ROBOTS!

## Getting started

### Installing

Assumes you have globally installed

- git
- node.js

Clone the git repository

```bash
git clone https://github.com/proSingularity/destrobot.git
```

Install, test and start:

```bash
npm run sanity-check
```

### Building and Running

Perform a quick build (bundle.js) and start server:

```bash
npm run dev
```

### Running with Docker

```bash
# Assumes local installation of Docker.
npm run build && docker-compose up
```

In your browser, navigate to [localhost:8080](http://localhost:8080).

## Debugging

```bash
npm run dev
# STEP: you can close the window that opens automatically
# STEP: Set a breakpoint in VS CODE
# STEP: Start 'Chrome' debug config in VS Code
# STEP: Maybe reload the window
# STEP: Trigger the breakpoint
```

Check out this cool [how-to](https://github.com/samme/phaser3-faq/wiki#how-do-i-fixdebug-my-game).

## Deployment

Continuous deployment to github pages [https://prosingularity.github.io/destrobot/](https://prosingularity.github.io/destrobot/) is performed on each push to `master`.

At the same time, a new Docker image is published to [DestroBot's Docker Hub repository](https://cloud.docker.com/u/nonbiri/repository/docker/nonbiri/destrobot).

Every branch is automatically deployed to [destrobot-game.herokuapp.com](https://destrobot-game.herokuapp.com).

See [.travis.yml](.travis.yml).

## External Resources

- [Phaser 3 Framework](https://github.com/photonstorm/phaser)
- [Phaser 3 Docs with TypeScript Definition File](https://github.com/photonstorm/phaser3-docs)
- [Phaser 3 Online Docs](https://photonstorm.github.io/phaser3-docs/index.html)
- [Phaser 3 Official Examples](https://github.com/photonstorm/phaser3-examples)
- [Cheat sheets](https://github.com/digitsensitive/phaser3-typescript/blob/master/cheatsheets)
- [Template Project - Phaser3 with TypeScript](https://github.com/digitsensitive/phaser3-typescript)

## Helpful tools

- [Pixel Art Maker](http://pixelartmaker.com/)
- [Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool)
- [Littera](http://kvazars.com/littera)
- [MagicTools](https://github.com/ellisonleao/magictools)
- [Tiled](https://www.mapeditor.org)
- [Favicon Generator](https://favicon.io/favicon-generator/)
- [Aspire](https://www.aseprite.org/)
- [Aspire - How to](https://www.youtube.com/watch?v=Md6W79jtLJM)
- [Awesome Github Actions](https://github.com/sdras/awesome-actions)
- [Inofficial Phaser Plugins](https://phaserplugins.com/)
- [Phaser3 Nineslice Plugin](https://github.com/jdotrjs/phaser3-nineslice)
- [Phaser3 Debug Plugin](https://github.com/samme/phaser-plugin-debug-draw)
- [Custom Cursor Creator](https://www.cursor.cc/)

### Generating favicon.ico

Thanks to [Favicon Generator](https://favicon.io/favicon-generator/) for allowing us to easily create a nice favicon.
We used the following settings:

- Text: Des
- Background: circle
- Font family: Roboto Condensed
- Font size: 75
- Font color: #FFFFFF
- Background color: #3A3D3C

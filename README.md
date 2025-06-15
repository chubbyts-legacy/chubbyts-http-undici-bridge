# chubbyts-http-undici-bridge

[![CI](https://github.com/chubbyts/chubbyts-http-undici-bridge/actions/workflows/ci.yml/badge.svg)](https://github.com/chubbyts/chubbyts-http-undici-bridge/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-http-undici-bridge/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-http-undici-bridge?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-http-undici-bridge%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-http-undici-bridge/master)
[![npm-version](https://img.shields.io/npm/v/@chubbyts/chubbyts-http-undici-bridge.svg)](https://www.npmjs.com/package/@chubbyts/chubbyts-http-undici-bridge)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-http-undici-bridge&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-http-undici-bridge)

## Description

A undici req/res http bridge.

## Requirements

 * node: 18
 * [@chubbyts/chubbyts-http-types][2]: ^3.0.0
 * [undici][3]:^7.10.0

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-http-undici-bridge][1].

```ts
npm i @chubbyts/chubbyts-http-undici-bridge@^2.0.0
```

## Usage

```ts
import {
  createServerRequestFactory,
  createUriFactory,
} from '@chubbyts/chubbyts-http/dist/message-factory';
import { createUndiciToServerRequestFactory, createResponseToUndiciFactory } from '@chubbyts/chubbyts-http-undici-bridge/dist/undici-http';

const app = ...;

const undiciToServerRequestFactory = createUndiciToServerRequestFactory(
  createUriFactory(),
  createServerRequestFactory(),
);

const responseToUndiciFactory = createResponseToUndiciFactory();

const res = responseToUndiciFactory(await app(undiciToServerRequestFactory(req)));
```

## Copyright

2025 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-undici-bridge
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-types
[3]: https://www.npmjs.com/package/undici

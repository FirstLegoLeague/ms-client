[![npm](https://img.shields.io/npm/v/@first-lego-league/ms-client.svg)](https://www.npmjs.com/package/@first-lego-league/ms-client)
[![codecov](https://codecov.io/gh/FirstLegoLeague/ms-client/branch/master/graph/badge.svg)](https://codecov.io/gh/FirstLegoLeague/ms-client)
[![Build status](https://ci.appveyor.com/api/projects/status/65scfycp2uyg83ri/branch/master?svg=true)](https://ci.appveyor.com/project/2roy999/ms-client/branch/master)
[![GitHub](https://img.shields.io/github/license/FirstLegoLeague/ms-client.svg)](https://github.com/FirstLegoLeague/ms-client/blob/master/LICENSE)

[![David Dependency Status](https://david-dm.org/FirstLegoLeague/ms-client.svg)](https://david-dm.org/FirstLegoLeague/ms-client)
[![David Dev Dependency Status](https://david-dm.org/FirstLegoLeague/ms-client/dev-status.svg)](https://david-dm.org/FirstLegoLeague/ms-client#info=devDependencies)
[![David Peer Dependencies Status](https://david-dm.org/FirstLegoLeague/ms-client/peer-status.svg)](https://david-dm.org/FirstLegoLeague/ms-client?type=peer)

# FIRST LEGO Legaue HTTP client
A HTTP client package, wraping [axios](https://www.npmjs.com/package/axios), working according to the _FIRST_ LEGO League TMS [Module Standard HTTP requests section](https://github.com/FirstLegoLeague/architecture/blob/master/module-standard/v1.0-SNAPSHOT.md#http-requests).

## Logic
This package was meant to serve as an extendable client which already works by the Module Standard and allows you to easily make requests.
It gives you all the functionality needed for a HTTP client running in node or in browser.

### In node
The client givven in node is fully [correlated](https://github.com/FirstLegoLeague/architecture/blob/master/module-standard/v1.0-SNAPSHOT.md#cross-module-correlations) and logged using [ms-client](https://www.npmjs.com/package/@first-lego-league/ms-client). It also has a client-id which recognizes it against other clients, and is sent in the headers for recognition.

### In browser
In broswer many of these feature are not required or needed. So the client only has a client-id, and isn't correlated or logged.

### Independence
All clients have the ability to be independent. This means that when they send a request and it comes back to them after failing, they will save it and retry it every givven interval.

## Techincal Details
The package is an NPM package meant to be used by node servers and javascript clients. It uses axios as an engine and as a peer dependency.

## Usage
You need to have axios as a dependency, then you can use the client by requiring it:
```javascript
const { createClient } = require('@first-lego-league/ms-client')
const client = createClient(options)
client.get('http://some-url')
```

### Options
The client can recieve options in order to upgrade it.

| **option** | **meaning** | **options** | **default** |
|--|--|--|--|
| logging | The logging options object. It has two fields, `requestLogLevel` and `responseLogLevel` | Each of the two fields can be any log level (`debug`, `info`, `warn`, `error`, `fatal`) | `{ requestLogLevel: 'info', responseLogLevel: 'debug' }` |
| independent | Weather or not to use the independce feature | Boolean | `false` |
| axiosOptions | Options object to pass to axios constructor | See [axios documentation](https://www.npmjs.com/package/axios) | `undefined` |
| clientId | An ID for the client which you can specify if you want to control it | String | Random base64 string |
| promise | A promise class to use | Any Promise class | A global promise class. The program will fail if there is no global promise class. |

## Contribution
To contribute to this repository, simply create a PR and set one of the Code Owners to be a reviewer.
Please notice the linting and UT, because they block merge.
Keep the package lightweight and easy to use.
Thank you for contributing!

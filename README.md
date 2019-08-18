## FIRST LEGO Legaue client
A HTTP client wraping axios working by the _FIRST_ LEGO League TMS [Module Standard](https://github.com/FirstLegoLeagueIL/architecture/blob/master/module-standard/v1.0-SNAPSHOT.md#log-messages).

### Usage
You need to have axios as a dependency, then you can use the client by requiring it:
```javascript
const { Client } = require('@first-lego-league/ms-client')

// create a new client
const client = Client()

// axios-like interface
client.get('http://some-url')
```

#### Options
The client can recieve options in order to upgrade it.
```json
{
  // An object to pass to `axios.create`
  "axiosOptions": { },
  // Wether to use an independence feature: save every failing request and retry later.
  // When independence is enabled, it will save every failing request in the localstorage,
  // It will retry all requests in the localstorage every five seconds,
  // and on every successful request.
  "independent": false
}
```

### Contribution
To contribute to this repository, simply create a PR and set one of the Code Owners to be a reviewer.
Please notice the linting and UT, because they block merge.
Keep the package lightweight and easy to use.
Thank you for contributing!
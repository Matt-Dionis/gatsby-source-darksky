# gatsby-source-darksky

This source plugin for Gatsby will make weather information from [Dark Sky](https://darksky.net/) available in GraphQL queries.

## Installation

```sh
# Install the plugin
yarn add gatsby-source-darksky
```

In `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-darksky',
      options: {
        key: 'YOUR_DARK_SKY_API_KEY',
        latitude: 'YOUR_LATITUDE',
        longitude: 'YOUR_LONGITUDE',
        exclude: ['DATA_BLOCKS_TO_EXCLUDE']
      },
    }
  ]
};
```

**NOTE:** To get a Dark Sky API key, [register for a Dark Sky dev account](https://darksky.net/dev). You can find your API key in the [“Your Secret Key” section of the Dark Sky dev console](https://darksky.net/dev/account).

## Configuration Options

The configuration options for this plugin mirror the [forecast request parameters](https://darksky.net/dev/docs). Please review those docs for more details. This plugin works well with [gatsby-source-googlemaps-geocoding](https://github.com/Matt-Dionis/gatsby-source-googlemaps-geocoding). If using these two plugins together, make sure that the `gatsby-source-darksky` entry appears first in the config. If so, and you omit `latitude` and `longitude` from this config, the weather information will be fetched for the location provided in the `gatsby-source-darksky` config.

| Option           | Default   | Description                                                                                                                                                                                                                                                                |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`            |           | **[required]** Your Dark Sky API key                                                                                                                                                                                                                                        |
| `latitude`       |           | The latitude of a location (in decimal degrees). Positive is north, negative is south. (optional if used with `gatsby-source-darksky`)                                                                                                                                             |
| `longitude`       |           | The longitude of a location (in decimal degrees). Positive is east, negative is west. (optional if used with `gatsby-source-darksky`)                                                                                                |
| `exclude`     |      | Exclude some number of data blocks from the API response. This is useful for reducing latency and saving cache space. The value blocks should be a comma-delimeted list (without spaces) of any of the following: "currently", "minutely", "hourly", "daily", "alerts", "flags"                                                                                                                                                                                 |

### Example Configuration

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-darksky',
      options: {
        key: process.env.DARK_SKY_API_KEY,
        latitude: `42.3411789`,
        longitude: `-71.7315589`,
        exclude: [`minutely`, `hourly`, `flags`]
      }
    }
  ]
};
```

## Querying Dark Sky weather information

Once the plugin is configured, one new query is available in GraphQL: `allWeatherData`.

Here’s an example query to load the current weather conditions along with the forecast for the next week:

```gql
query WeatherQuery {
  allWeatherData {
    edges {
      node {
        currently {
          time
          summary
          temperature
          windSpeed
          windBearing
        }
        daily {
          data {
            time
            summary
            temperatureMin
            temperatureMax
            windSpeed
            windBearing
          }
        }
      }
    }
  }
}
```

See the [Dark Sky API docs](https://darksky.net/dev/docs) or the GraphiQL UI for info on all returned fields.

const fetch = require('node-fetch');
const uuidv4 = require('uuid/v4');

const _createWeatherNode = async (
  latitude,
  longitude,
  createNodeId,
  createContentDigest,
  createNode,
  configOptions
) => {
  const _processWeather = (weather) => {
    const nodeId = createNodeId(`weather-data-${uuidv4()}`);
    const nodeContent = JSON.stringify(weather);
    const nodeData = Object.assign({}, weather, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'WeatherData',
        content: nodeContent,
        contentDigest: createContentDigest(weather)
      }
    });

    return nodeData;
  };

  let {key, exclude} = configOptions;
  exclude = exclude.join(',');

  const apiUrl = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}?exclude=${exclude}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  const nodeData = _processWeather(data);
  createNode(nodeData);
};

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}, configOptions) => {
  const {createNode} = actions;
  delete configOptions.plugins;

  if (configOptions.latitude) {
    let {latitude, longitude} = configOptions;
    await _createWeatherNode(latitude, longitude, createNodeId, createContentDigest, createNode, configOptions);
  } else {
    exports.onCreateNode = async ({node}) => {
      const parsedContent = JSON.parse(node.internal.content);
      const {lat: latitude, lng: longitude} = parsedContent.results[0].geometry.location;
      await _createWeatherNode(latitude, longitude, createNodeId, createContentDigest, createNode, configOptions);
    };
  }
};

const fetch = require('node-fetch');
const uuidv4 = require('uuid/v4');

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}, configOptions) => {
  const {createNode} = actions;

  delete configOptions.plugins;

  const processWeather = (weather) => {
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

  let {key, latitude, longitude, exclude} = configOptions;
  exclude = exclude.join(',');

  const apiUrl = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}?exclude=${exclude}`;

  const response = await fetch(apiUrl);
  const data = await response.json();
  const nodeData = processWeather(data);
  createNode(nodeData);
};

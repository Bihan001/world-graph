const osmread = require('osm-read');
const JsonStreamStringify = require('json-stream-stringify');
const fs = require('fs');

let graph = {};
let nodes = {};
let cnt = 1;

const degToRad = (deg) => (deg * Math.PI) / 180.0;

const calc_distance = (lat1, lon1, lat2, lon2) => {
  const R = 6373.0;
  lat1 = degToRad(+lat1);
  lon1 = degToRad(+lon1);
  lat2 = degToRad(+lat2);
  lon2 = degToRad(+lon2);
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000;
};

var parser = osmread.parse({
  filePath: './map-filter.xml',
  endDocument: function () {
    const writeStream = fs.createWriteStream('./graph.json', { flags: 'w' });
    const jsonStream = new JsonStreamStringify(Promise.resolve(Promise.resolve(graph)));
    jsonStream.pipe(writeStream);
    jsonStream.on('end', () => console.log('done '));
  },
  bounds: function (bounds) {
    console.log('bounds: ' + JSON.stringify(bounds));
  },
  node: function (node) {
    // console.log('node: ' + JSON.stringify(node));
    nodes[node.id] = cnt++;
    graph[nodes[node.id]] = { lat: node.lat, lon: node.lon, adj: [], w: [] };
  },
  way: function (way) {
    // console.log('way: ' + JSON.stringify(way));
    for (let i = 0; i < way.nodeRefs.length - 1; i++) {
      let u = nodes[way.nodeRefs[i]];
      let v = nodes[way.nodeRefs[i + 1]];
      const dist = +calc_distance(graph[u].lat, graph[u].lon, graph[v].lat, graph[v].lon).toFixed(5);
      graph[u].adj.push(v);
      graph[u].w.push(dist);
      graph[v].adj.push(u);
      graph[v].w.push(dist);
    }
  },
  relation: function (relation) {
    // console.log('relation: ' + JSON.stringify(relation));
  },
  error: function (msg) {
    console.log('error: ' + msg);
  },
});

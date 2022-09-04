const osmread = require('osm-read');

const nodes = {};
const graph = {};
let cnt = 1;
const args = process.argv.slice(2);
if (args.length < 1) throw new Error('Enter file path');
const parser = osmread.parse({
  filePath: args[0],
  endDocument: function () {
    // console.log(nodes);
    console.log(JSON.stringify(graph));
    // console.log('Document End');
  },
  bounds: function (bounds) {
    // console.log('Bounds: ' + JSON.stringify(bounds));
  },
  node: function (node) {
    // console.log('node: ' + JSON.stringify(node));
    if (nodes[node.id]) return;
    nodes[node.id] = cnt;
    graph[cnt] = { lat: node.lat, lon: node.lon, adj: [], w: [] };
    cnt++;
  },
  way: function (way) {
    // console.log('way: ' + JSON.stringify(way));
    if (way.nodeRefs.length < 2) return;
    for (let i = 0; i < way.nodeRefs.length - 1; i++) {
      let u = nodes[way.nodeRefs[i]];
      let v = nodes[way.nodeRefs[i + 1]];
      if (!u || !v || u == v) continue;
      const weight = calc_distance(graph[u].lat, graph[u].lon, graph[v].lat, graph[v].lon);
      if (graph[u].adj.indexOf(v) == -1) {
        graph[u].adj.push(v);
        graph[u].w.push(weight);
      }
      if (graph[v].adj.indexOf(u) == -1) {
        graph[v].adj.push(u);
        graph[v].w.push(weight);
      }
    }
  },
  relation: function (relation) {
    // console.log('relation: ' + JSON.stringify(relation));
  },
  error: function (msg) {
    console.log('error: ' + msg);
  },
});

function calc_distance(lat1, lon1, lat2, lon2) {
  const R = 6373.0; // km
  lat1 = (lat1 * Math.PI) / 180.0;
  lon1 = (lon1 * Math.PI) / 180.0;
  lat2 = (lat2 * Math.PI) / 180.0;
  lon2 = (lon2 * Math.PI) / 180.0;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return +(d * 1000).toFixed(5);
}

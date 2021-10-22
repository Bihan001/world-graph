const fs = require('fs');

console.log('Reading old graph...');
const oldGraph = JSON.parse(
  fs.readFileSync('/home/bihan/codes/mern/map-graph-project/kolkata-large.json', 'utf-8')
);
console.log('Finished reading old graph!');

console.log('Old graph data:', oldGraph['1']);

Object.keys(oldGraph).map((id) => {
  if (oldGraph[id].lat === 53.5715185) {
    console.log('53.5715185 data:', oldGraph[id]);
  }
});

const set = new Set();
const map = {};
const arr = [];

Object.keys(oldGraph).map((vertexId) => {
  oldGraph[vertexId].adj.map((adjId) => {
    set.add(+vertexId);
    set.add(+adjId);
  });
});

set.forEach((id) => {
  arr.push(+id);
});

arr.map((id, i) => {
  map[+id] = i + 1;
});

const newGraph = {};

Object.keys(oldGraph).map((vertexId) => {
  let lat = oldGraph[vertexId].lat;
  let lon = oldGraph[vertexId].lon;
  let adj = [];
  let w = [];
  oldGraph[vertexId].adj.map((adjId) => {
    adj.push(adjId);
  });
  adj = adj.map((id) => map[+id]);
  oldGraph[vertexId].w.map((weight) => {
    w.push(weight);
  });
  newGraph[map[+vertexId]] = { lat, lon, adj, w };
});

console.log('New graph data:', newGraph[1]);

Object.keys(newGraph).map((id) => {
  if (newGraph[id].lat === 53.5715185) {
    console.log('53.5715185 data:', newGraph[id]);
  }
});

console.log('Writing new file...');
fs.writeFileSync('/home/bihan/codes/mern/map-graph-project/backend/src/data/kolkata-large-filter.json', JSON.stringify(newGraph));
console.log('Finished writing to new file!');

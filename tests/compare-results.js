const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('/home/bihan/codes/MERN/map-graph-project/backend/logs/info.log'),
});

var arr = [];

lineReader.on('line', (line) => {
  arr.push(JSON.parse(line));
});

lineReader.on('close', () => {
  let bi = arr.filter((i) => i.algorithm === 'bidirectionalAStar').map((i) => i.execTime);
  let alt = arr.filter((i) => i.algorithm === 'bidirectionalAStarALT').map((i) => i.execTime);

  console.log('bi:', bi);
  console.log('alt:', alt);

  let diff = bi.map((i, j) => i - alt[j]);

  console.log('diff:', diff);

  console.log('Arr size:', arr.length);
  console.log('Min:', Math.min(...diff));
  console.log('Max:', Math.max(...diff));
  console.log('Positive count:', diff.filter((i) => i >= 0).length);
  console.log('Negative count:', diff.filter((i) => i < 0).length);
});

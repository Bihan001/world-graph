const osmread = require('osm-read');

const args = process.argv.slice(2);
if (args.length < 1) throw new Error('Enter file path');

osmread.parse({
  filePath: args[0],
  bounds: function (bounds) {
    // https://wiki.openstreetmap.org/wiki/Bounding_Box
    // bbox = left,bottom,right,top
    // bbox = min Longitude , min Latitude , max Longitude , max Latitude
    const arr = [bounds.minlon, bounds.minlat, bounds.maxlon, bounds.maxlat];
    console.log('Bounds: ' + JSON.stringify(arr));
  },
  error: function (msg) {
    console.log('error: ' + msg);
  },
});

import { RegionsData } from '../utils/interfaces/misc';

enum regionSizes {
  small = 'small',
  medium = 'medium',
  big = 'big',
  large = 'large',
}

export const regionsData: RegionsData = {
  // timeSquareLarge: {
  //   key: 'timeSquareLarge',
  //   displayName: 'Time Square(Large)',
  //   description: 'lorem ipsum',
  //   size: regionSizes.large,
  //   dataUrl: '/home/bihan/codes/osm_research/leaflet-algo-test/backend/src/data/timesquare-large.json',
  //   boundary: [53.8082, -112.9444, 53.2531, -114.0304],
  // },
  // timeSquareBig: {
  //   key: 'timeSquareBig',
  //   displayName: 'Time Square(Big)',
  //   description: 'lorem ipsum',
  //   size: regionSizes.big,
  //   dataUrl: '/home/bihan/Documents/codes/map-graph-finder/backend/src/data/timesquare_big.json',
  //   boundary: [-113.6666, 53.4243, -113.3322, 53.6536],
  //   // dataUrl: '/home/bihan/codes/MERN/map-graph-project/backend/src/data/timesquare-tiny-new.json',
  //   // boundary: [53.554, -113.4879, 53.5495, -113.4947],
  // },
  timeSquareSmall: {
    key: 'timeSquareSmall',
    displayName: 'Time Square(Small)',
    description: 'lorem ipsum',
    size: regionSizes.small,
    dataUrl: '/home/bihan/Documents/codes/map-graph-finder/backend/src/data/timesquare_small.json',
    boundary: [-113.5794, 53.4978, -113.4338, 53.5746],
    // dataUrl: '/home/bihan/codes/MERN/map-graph-project/backend/src/data/timesquare-tiny-new.json',
    // boundary: [53.554, -113.4879, 53.5495, -113.4947],
  },
  // washington: {
  //   key: 'washington',
  //   displayName: 'Washington(Large)',
  //   description: 'lorem ipsum',
  //   size: regionSizes.big,
  //   dataUrl: '/home/bihan/codes/osm_research/leaflet-algo-test/backend/src/data/washington.json',
  //   boundary: [39.0412, -76.8252, 38.7814, -77.2408],
  // },
};

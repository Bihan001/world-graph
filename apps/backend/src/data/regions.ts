import { RegionsData } from '../utils/interfaces/misc';

enum regionSizes {
  small = 'small',
  medium = 'medium',
  big = 'big',
  large = 'large',
}

export const regionsData: RegionsData = {
  timeSquareSmall: {
    key: 'timeSquareSmall',
    displayName: 'Time Square (Small)',
    description: 'lorem ipsum',
    size: regionSizes.small,
    dataUrl: 'timesquare_small.json',
    boundary: [-113.5794, 53.4978, -113.4338, 53.5746],
    contractionAvailable: true,
  },
  // kolkataSmall: {
  //   key: 'kolkataSmall',
  //   displayName: 'Kolkata (Small)',
  //   description: 'lorem ipsum',
  //   size: regionSizes.small,
  //   dataUrl: 'kolkata_small.json',
  //   boundary: [88.0746, 22.1136, 88.6954, 23.2767],
  //   contractionAvailable: false,
  // },
};

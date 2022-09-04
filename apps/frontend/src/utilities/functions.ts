export const getObjSize = (obj: Object) => {
  let size = 0;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

export const calcCrow = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  let R = 6371; // Earth's radius in km
  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

// Converts numeric degrees to radians
const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

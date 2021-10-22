const checkTime = (arr, n) => {
  let tmp = [];
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j = j * 2) {
      tmp.push(arr[i][j]);
    }
  }
  console.log('size', tmp.length);
};

let arr = [];
let n = 10000;
for (let i = 0; i < n; i++) {
  arr.push([]);
}
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    arr[i].push(j);
  }
}

const start = new Date();
checkTime(arr, n);
const end = new Date() - start;
console.info('Execution time: %dms', end);

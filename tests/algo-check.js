const axios = require('axios');

const fullTestData = {
  timeSquare: [
    {
      size: 'small',
      pointA: { lat: 53.6292278997755, lon: -113.49294095896316 },
      pointB: { lat: 53.59993621188117, lon: -113.51681157591268 },
    },
    {
      size: 'small',
      pointA: { lat: 53.6291465068362, lon: -113.44276115008464 },
      pointB: { lat: 53.64532051524089, lon: -113.55088300763013 },
    },
    // {
    //   size: 'small',
    //   pointA: { lat: 53.48529718088276, lon: -113.44311706320649 },
    //   pointB: { lat: 53.4535751818976, lon: -113.49273654363289 },
    // },
    {
      size: 'small',
      pointA: { lat: 53.45358654790923, lon: -113.49456885698615 },
      pointB: { lat: 53.4832632590155, lon: -113.46476540916886 },
    },
    {
      size: 'small',
      pointA: { lat: 53.512585731313685, lon: -113.6892155443276 },
      pointB: { lat: 53.49142894275463, lon: -113.60381226382817 },
    },
    {
      size: 'small',
      pointA: { lat: 53.41059801698315, lon: -113.44289220149408 },
      pointB: { lat: 53.4172406974411, lon: -113.53028290139707 },
    },
    {
      size: 'small',
      pointA: { lat: 53.51235797564712, lon: -113.67793110892887 },
      pointB: { lat: 53.46920871613189, lon: -113.63183061968907 },
    },
    {
      size: 'small',
      pointA: { lat: 53.6798360698559, lon: -113.66420195524664 },
      pointB: { lat: 53.63197183874757, lon: -113.6225182699451 },
    },
    {
      size: 'small',
      pointA: { lat: 53.62539896392917, lon: -113.39806111980089 },
      pointB: { lat: 53.6161588818039, lon: -113.46730307655544 },
    },
    {
      size: 'small',
      pointA: { lat: 53.541176612679074, lon: -113.41876875455117 },
      pointB: { lat: 53.549342404470295, lon: -113.45727085282267 },
    },
    {
      size: 'small',
      pointA: { lat: 53.546151712318704, lon: -113.53599235712865 },
      pointB: { lat: 53.542175755242866, lon: -113.4855892973762 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.57435625033217, lon: -113.66124234498771 },
      pointB: { lat: 53.52463059259165, lon: -113.54214504745666 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.570504082887226, lon: -113.34509883493459 },
      pointB: { lat: 53.51871524706461, lon: -113.48626174844917 },
    },
    // {
    //   size: 'medium',
    //   pointA: { lat: 53.36646723152844, lon: -113.24605823673282 },
    //   pointB: { lat: 53.45372666543301, lon: -113.43501081977274 },
    // },
    {
      size: 'medium',
      pointA: { lat: 53.45373108505773, lon: -113.43497192868655 },
      pointB: { lat: 53.366554590215785, lon: -113.2457807062747 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.37054705925914, lon: -113.75287167689497 },
      pointB: { lat: 53.455098642019735, lon: -113.68967465478626 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.69545677702563, lon: -113.2174984712716 },
      pointB: { lat: 53.581680032829816, lon: -113.41696970886824 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.57499768483313, lon: -113.61658983009949 },
      pointB: { lat: 53.518726197866485, lon: -113.44279801930055 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.63322908815965, lon: -113.3940264044123 },
      pointB: { lat: 53.58110964337065, lon: -113.55614050460423 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.45461618242417, lon: -113.3445678653707 },
      pointB: { lat: 53.48280385656083, lon: -113.51904660032302 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.5717376123012, lon: -113.766339295531 },
      pointB: { lat: 53.54075438547993, lon: -113.61315520933272 },
    },
    {
      size: 'medium',
      pointA: { lat: 53.57263416227901, lon: -113.24592553179295 },
      pointB: { lat: 53.484110661820246, lon: -113.34484260987614 },
    },
    {
      size: 'large',
      pointA: { lat: 53.69603567433254, lon: -113.21784388386709 },
      pointB: { lat: 53.33940687491139, lon: -113.73303699888373 },
    },
    {
      size: 'large',
      pointA: { lat: 53.71715931912177, lon: -113.6437368589475 },
      pointB: { lat: 53.44499409141063, lon: -113.24669469830802 },
    },
    {
      size: 'large',
      pointA: { lat: 53.71391021782266, lon: -113.81821559389982 },
      pointB: { lat: 53.36726148604939, lon: -113.24944239492143 },
    },
    {
      size: 'large',
      pointA: { lat: 53.71472251667562, lon: -113.63686761741394 },
      pointB: { lat: 53.34022638800789, lon: -113.7302893022703 },
    },
    {
      size: 'large',
      pointA: { lat: 53.57070117303054, lon: -113.24532085000132 },
      pointB: { lat: 53.34022638800789, lon: -113.54619362917103 },
    },
    {
      size: 'large',
      pointA: { lat: 53.71715931912177, lon: -113.32088250687042 },
      pointB: { lat: 53.363166361281436, lon: -113.73303699888373 },
    },
    {
      size: 'large',
      pointA: { lat: 53.445811574058936, lon: -113.24669469830802 },
      pointB: { lat: 53.571516234705, lon: -113.80585095913939 },
    },
    {
      size: 'large',
      pointA: { lat: 53.57233128066953, lon: -113.19036691773285 },
      pointB: { lat: 53.34186536695528, lon: -113.55168902239787 },
    },
    {
      size: 'large',
      pointA: { lat: 53.580480876296974, lon: -113.49948278674285 },
      pointB: { lat: 53.580480876296974, lon: -113.49948278674285 },
    },
    {
      size: 'large',
      pointA: { lat: 53.56907100255113, lon: -113.34286407977778 },
      pointB: { lat: 53.45480284496925, lon: -113.76326166163138 },
    },
  ],
};

const algorithms = ['bidirectionalAStar', 'bidirectionalAStarALT'];

let counter = 1;

algorithms.map((algorithm) => {
  Object.keys(fullTestData).map((region) => {
    const regionalTestData = fullTestData[region];
    regionalTestData.map(async (data) => {
      const body = {
        region,
        algorithm,
        pointA: data.pointA,
        pointB: data.pointB,
      };
      axios
        .post('http://localhost:5000/api/execAlgorithm', body, {
          headers: { contentType: 'application/json' },
        })
        .then((res) => console.log(counter++, res.data.message))
        .catch((err) => console.log(err.message));
    });
  });
});

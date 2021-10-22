import React, { useEffect, useState, useRef, memo } from 'react';
import { LatLngExpression, LeafletMouseEvent, Map as MapClass } from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, Rectangle, TileLayer, LayersControl, ZoomControl } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import { Vertex, Edge, LatLon } from '../../utilities/interfaces/graph';
import { Map as MapInterface } from '../../utilities/interfaces/map';
// import dfs from '../../algorithms/dfs';
import axios from 'axios';

// TODO -> To be deleted later(Test import)
// import testMarkers from '/home/bihan/codes/mern/map-graph-project/frontend/src/data/timesquare-tiny-new.json';

const mapHeight = '100%';
const backendUrl = 'http://localhost:5000/api';

const changeColor = (weight: number): string => {
  let ans = '#3bff0044';
  if (weight > 30) ans = '#00b6ff44';
  if (weight > 60) ans = '#ff610044';
  if (weight > 90) ans = '#ff210044';
  return ans;
};

const Map: React.FC<MapInterface> = (props) => {
  const {
    allEdgeList,
    edgeList,
    viewport,
    currentRegion,
    traceEdgeColor,
    mainEdgeColor,
    trafficData,
    showTraffic,
    targetMarkers,
    setTargetMarkers,
  } = props;

  const mapRef = useRef<MapClass | null>(null);

  const [landmarks, setLandmarks] = useState<{ id: string; lat: number; lon: number }[]>([]);

  useEffect(() => {
    fetchLandmarks();
    if (!currentRegion) return;
    const centerLat = currentRegion.boundary[3] + (currentRegion.boundary[1] - currentRegion.boundary[3]) / 2;
    const centerLon = currentRegion.boundary[2] + (currentRegion.boundary[0] - currentRegion.boundary[2]) / 2;
    handlePositionChange(centerLat, centerLon);
  }, [currentRegion]);

  const handlePositionChange = (lat: number, lon: number) => {
    setTimeout(() => {
      mapRef.current?.flyTo([lat, lon]);
    }, 500);
  };

  const fetchLandmarks = async () => {
    try {
      const res = await axios.get(backendUrl + '/getLandmarks/' + currentRegion.key);
      console.log(res.data.data.landmarks);
      setLandmarks(res.data.data.landmarks);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteLandmark = async (id: string) => {
    try {
      const res = await axios.post(
        backendUrl + '/deleteLandmark',
        { id, region: currentRegion.key },
        {
          headers: {
            contentType: 'application/json',
          },
        }
      );
      console.log(res.data);
      setLandmarks((landmarks) => landmarks.filter((landmark) => landmark.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const displayTargetMarkers = targetMarkers.map((coords: LatLon, idx: number) => {
    return (
      <Marker key={idx} position={[coords.lat, coords.lon]}>
        <Popup>
          {`Lat: ${coords.lat}, Lon: ${coords.lon}`}
          <br />
          Index: {idx}
          <br />
          ID: {idx}
        </Popup>
      </Marker>
    );
  });

  const displayLandmarks = landmarks.map((landmark, idx) => {
    return (
      <Marker
        key={idx}
        position={[landmark.lat, landmark.lon]}
        eventHandlers={{
          click: (e) => deleteLandmark(landmark.id),
        }}
      >
        <Popup>
          {`Lat: ${landmark.lat}, Lon: ${landmark.lon}`}
          <br />
          Index: {idx}
          <br />
          ID: {landmark.id}
        </Popup>
      </Marker>
    );
  });

  // const displayTestMarkers = Object.keys(testMarkers).map((id) => {
  //   // @ts-ignore
  //   const vertex = testMarkers[id];
  //   return +id >= 6 ? null : (
  //     <Marker key={id} position={[vertex.lat, vertex.lon]}>
  //       <Popup>
  //         {`Lat: ${vertex.lat}, Lon: ${vertex.lon}`}
  //         <br />
  //         ID: {id}
  //       </Popup>
  //     </Marker>
  //   );
  // });

  const addTargetMarker = (lat: number, lon: number) => {
    setTargetMarkers((markers) => (markers.length < 2 ? [...markers, { lat, lon }] : [{ lat, lon }]));
  };

  const { BaseLayer } = LayersControl;

  const handleMapOnCreation = (mapInstance: MapClass) => {
    mapRef.current = mapInstance;
    mapRef.current?.addEventListener('click', (e: LeafletMouseEvent) => {
      console.log(`lat: ${e.latlng.lat}, lon: ${e.latlng.lng}`);
      addTargetMarker(e.latlng.lat, e.latlng.lng);
    });
  };

  return (
    <MapContainer
      preferCanvas
      whenCreated={(mapInstance) => handleMapOnCreation(mapInstance)}
      center={[viewport.lat, viewport.lon]}
      zoom={viewport.zoom}
      style={{ height: mapHeight, width: '100%' }}
      zoomControl={false}
    >
      <LayersControl>
        <BaseLayer name='Dark view'>
          <TileLayer
            maxNativeZoom={19}
            maxZoom={25}
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
          />
        </BaseLayer>
        <BaseLayer name='Light view'>
          <TileLayer
            maxNativeZoom={19}
            maxZoom={25}
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
          />
        </BaseLayer>
        <BaseLayer checked name='Street view'>
          <TileLayer
            maxNativeZoom={19}
            maxZoom={25}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
        </BaseLayer>
        <BaseLayer name='Satellite View'>
          <ReactLeafletGoogleLayer maxNativeZoom={19} maxZoom={25} type='satellite' />
        </BaseLayer>
      </LayersControl>
      <ZoomControl position='topright' />
      <Rectangle
        bounds={[
          [currentRegion.boundary[1], currentRegion.boundary[0]],
          [currentRegion.boundary[3], currentRegion.boundary[2]],
        ]}
        pathOptions={{ color: '#000000dd' }}
      />
      {/* {markers} */}
      {/* {displayTestMarkers} */}
      {displayTargetMarkers}
      {displayLandmarks}
      {<AllEdgeList allEdgeList={allEdgeList} traceEdgeColor={traceEdgeColor} />}
      {<MainEdgeList mainEdgeList={edgeList} mainEdgeColor={mainEdgeColor} />}
      {showTraffic && <Traffic trafficData={trafficData} />}
    </MapContainer>
  );
};

export default Map;

const AllEdgeList = memo((props: any) => {
  const { allEdgeList, traceEdgeColor } = props;
  return allEdgeList.map((edge: Edge, idx: number) => (
    <Polyline
      className='animate'
      key={idx}
      weight={5}
      positions={[edge.src as LatLngExpression, edge.dest as LatLngExpression]}
      color={traceEdgeColor}
    ></Polyline>
  ));
});

const MainEdgeList = memo((props: any) => {
  const { mainEdgeList, mainEdgeColor } = props;
  return mainEdgeList.map((edge: Edge, idx: number) => (
    <Polyline
      className='animate'
      key={idx}
      weight={5}
      positions={[edge.src as LatLngExpression, edge.dest as LatLngExpression]}
      color={mainEdgeColor}
    >
      <Popup>
        {`Index: ${idx}`}
        <br />
        {`Src: Lat: ${edge.src[0]}, Lon: ${edge.src[1]}`}
        <br />
        {`Dest: Lat: ${edge.dest[0]}, Lon: ${edge.dest[1]}`}
        <br />
        {`Weight: ${edge.weight}`}
      </Popup>
    </Polyline>
  ));
});

const Traffic = memo((props: any) => {
  const { trafficData } = props;
  return trafficData.map((edgeStr: string, idx: number) => {
    const [srcKey, destKey, weight] = edgeStr.split('$');
    const [srcLat, srcLon] = srcKey.split('#');
    const [destLat, destLon] = destKey.split('#');
    return (
      <Polyline
        key={idx}
        weight={6}
        positions={[
          [+srcLat, +srcLon],
          [+destLat, +destLon],
        ]}
        color={changeColor(+weight)}
      ></Polyline>
    );
  });
});

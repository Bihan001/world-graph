import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edge, LatLon } from './utilities/interfaces/graph';
import { Viewport } from './utilities/interfaces/map';
import Map from './components/map';
import LocationSelect from './components/region-select';
import AlgorithmSelect from './components/algorithm-select';
import { Button, Checkbox, Typography } from 'antd';
import ColorPicker from './components/color-picker';
import { AlgorithmsData, Algorithm, Region, RegionsData } from './utilities/interfaces/misc';
import './app.css';
import { calcCrow } from './utilities/functions';
import About from './about';

const { Title } = Typography;

const backendUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

let allEdgesTimeouts: Array<NodeJS.Timeout> = [];
let edgesTimeouts: Array<NodeJS.Timeout> = [];
let finishAllEdgeTimeout: NodeJS.Timeout;

const Main: React.FC = () => {
  const [edgeList, setEdgeList] = useState<Edge[]>([]);
  const [allEdgeList, setAllEdgeList] = useState<Array<Edge>>([]);

  const [regions, setRegions] = useState<RegionsData>({});
  const [algorithms, setAlgorithms] = useState<AlgorithmsData>({});

  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(true);

  const [viewport] = useState<Viewport>({
    lat: 53.53847115373215,
    lon: -113.50679397583009,
    zoom: 15,
  });

  const [targetMarkers, setTargetMarkers] = useState<Array<LatLon>>([]);

  const [showAlgoTrace, setShowAlgoTrace] = useState(false);

  const [traceEdgeColor, setTraceEdgeColor] = useState('#ff003399');
  const [mainEdgeColor, setMainEdgeColor] = useState('#0099ff');

  const [estimatedTime, setEstimatedTime] = useState(0.0);

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    fetchRegionsData();
    fetchAlgorithmsData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };
  const fetchRegionsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/getAllRegions`);
      const fetchedRegions = res.data.data;
      console.log(fetchedRegions);
      setRegions(fetchedRegions);
      if (Object.keys(fetchedRegions).length > 0) {
        setCurrentRegion(fetchedRegions[Object.keys(fetchedRegions)[0]]);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const fetchAlgorithmsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/getAllAlgorithms`);
      console.log(res.data.data);
      setAlgorithms(res.data.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    let timer: any;
    if (estimatedTime > 0) setTimeout(() => setEstimatedTime((time) => (time - 1 <= 1 ? 0 : time - 1)), 1000);
    return () => clearTimeout(timer);
  }, [estimatedTime]);

  useEffect(() => {
    setEdgeList([]);
    setAllEdgeList([]);
    setTargetMarkers([]);
    setShowAlgoTrace(false);
  }, [currentRegion]);

  const changeRegion = (region: Region) => {
    setCurrentRegion(region);
  };

  const changeAlgorithm = (algorithm: Algorithm) => {
    setCurrentAlgorithm(algorithm);
  };

  const handleAlgoStart = async () => {
    try {
      setEdgeList([]);
      setAllEdgeList([]);
      clearTimeout(finishAllEdgeTimeout);
      allEdgesTimeouts.map((item) => clearTimeout(item));
      edgesTimeouts.map((item) => clearTimeout(item));
      if (!currentAlgorithm || !currentRegion) throw new Error('Select an algorithm');
      const body = {
        region: currentRegion.key,
        algorithm: currentAlgorithm.key,
        pointA: targetMarkers[0],
        pointB: targetMarkers[1],
      };
      const res = await axios.post(`${backendUrl}/execAlgorithm`, body, {
        headers: { contentType: 'application/json' },
      });
      const { allEdges, edges }: { allEdges: Array<Edge>; edges: Array<Edge> } = res.data.data;
      console.log('allEdges size:', allEdges.length, 'edges size:', edges.length);
      renderAlgoOutput(targetMarkers[0], targetMarkers[1], allEdges, edges);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const renderAlgoOutput = (start: LatLon, end: LatLon, allEdges: Array<Edge>, edges: Array<Edge>) => {
    let timeToFinishAllEdges = 0;

    const speed = 1920 / 10; //check css

    if (showAlgoTrace) {
      if (!showAnimation) {
        setAllEdgeList(allEdges);
      } else {
        for (let i = 1; i <= allEdges.length; i++) {
          const edge = allEdges[i - 1];
          const distance: number = calcCrow(edge.src[0], edge.src[1], edge.dest[0], edge.dest[1]); // km
          const time = (distance / speed) * 1000;
          timeToFinishAllEdges += time;
          allEdgesTimeouts.push(setTimeout(() => setAllEdgeList((edges) => [...edges, edge]), i * 100 + time));
        }
      }
    }

    timeToFinishAllEdges += allEdges.length * 100 + 500;
    console.log('time req', timeToFinishAllEdges);
    setEstimatedTime(Math.round(timeToFinishAllEdges / 1000));

    if (edges.length === 0) return console.log('No paths found');

    if (!showAnimation) {
      setEdgeList(edges);
    } else {
      finishAllEdgeTimeout = setTimeout(() => {
        for (let i = 1; i <= edges.length; i++) {
          const edge = edges[i - 1];
          const distance: number = calcCrow(edge.src[0], edge.src[1], edge.dest[0], edge.dest[1]); // km
          const time = (distance / speed) * 1000;
          edgesTimeouts.push(setTimeout(() => setEdgeList((edges) => [...edges, edge]), i * 50 + time));
        }
      }, timeToFinishAllEdges);
    }
  };

  return (
    <div className='App'>
      <About isModalVisible={isModalVisible} handleClose={handleClose} />
      <div className='options-box'>
        <LocationSelect currentRegion={currentRegion?.key} regions={regions} changeRegion={changeRegion} />
        <AlgorithmSelect algorithms={algorithms} changeAlgorithm={changeAlgorithm} />
        <Button onClick={(e) => handleAlgoStart()}>Start visualization</Button>
        <Checkbox style={{ color: 'white' }} onChange={(e) => setShowAlgoTrace(e.target.checked)}>
          Show visualization?
        </Checkbox>
        <Checkbox style={{ color: 'white' }} onChange={(e) => setShowAnimation(e.target.checked)}>
          Animate?
        </Checkbox>
        <ColorPicker color={traceEdgeColor} setColor={setTraceEdgeColor} text='Trace edge color' />
        <ColorPicker color={mainEdgeColor} setColor={setMainEdgeColor} text='Final edge color' />
        <Button onClick={showModal}>About This Project</Button>
        {showAlgoTrace && <Title level={4}>Estimated time: {estimatedTime}</Title>}
      </div>
      {currentRegion && (
        // <DeckTest />
        <Map
          allEdgeList={allEdgeList}
          edgeList={edgeList}
          viewport={viewport}
          currentRegion={currentRegion}
          traceEdgeColor={traceEdgeColor}
          mainEdgeColor={mainEdgeColor}
          targetMarkers={targetMarkers}
          setTargetMarkers={setTargetMarkers}
        />
      )}
    </div>
  );
};

export default Main;

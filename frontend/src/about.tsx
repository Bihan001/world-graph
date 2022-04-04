import { Button, Modal } from 'antd';

interface AboutInterface {
  isModalVisible: boolean;
  handleClose: () => void;
}

const About: React.FC<AboutInterface> = ({ isModalVisible, handleClose }) => {
  return (
    <Modal
      title='About this project'
      visible={isModalVisible}
      onOk={handleClose}
      footer={[
        <Button key='back' onClick={handleClose}>
          Close
        </Button>,
      ]}
    >
      <p>
        <b>Map Router</b> is a routing application utilizing open data from OpenStreetMap. It allows the user to visualize the shortest path
        between two points on a map. It's a personal project developed mainly to learn and implement graphs and various shortest path
        algorithms.
        <br /> The XML Data obtained from the OpenStreetMap API is parsed into an adjacency list which is then used to run the algorithms.
        <br />
        <b>Algorithms used: </b>(Ordered from fastest to slowest)
        <br />
        <ul style={{ listStyle: 'outside' }}>
          <li>Bidirectional Dijkstra's with Contraction Hierarchies.</li>
          <li>Bidirectional A-star with Landmarks</li>
          <li>Bidirectional and Unidirectional A-star</li>
          <li>Bidirectional and Unidirectional Dijkstra's</li>
          <li>Breadth First Search (BFS)</li>
        </ul>
        <b>Note: </b>Notice the variation in delay while visualizing the algorithms. Contraction Hierarchies are rendered almost instantly
        whereas Breadth First Takes can take upto a few seconds to render.
        <br />
        <b>Note: </b>I have excluded Bellmanford's and Flyod Warshall's algorithms due to it's high time complexities.
        <br />
        The algorithms are made to work with extremely large datasets. Due to hardware constraints in the deployment (Free Tier), only a
        selected section of the world map is available to test right now.
        <br />
      </p>
    </Modal>
  );
};

export default About;

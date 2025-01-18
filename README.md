
# World Graph

**World Graph** is a routing application utilizing open data from OpenStreetMap. It allows the user to visualize the shortest path between two points on a map. It's a personal project developed mainly to learn and implement graphs and various shortest path algorithms.
The XML Data obtained from the OpenStreetMap API is parsed into an adjacency list which is then used to run the algorithms.

Algorithms used: (Ordered from fastest to slowest)
- Bidirectional Dijkstra's with Contraction Hierarchies.
- Bidirectional A-star with Landmarks
- Bidirectional and Unidirectional A-star
- Bidirectional and Unidirectional Dijkstra's
- Breadth First Search (BFS)

**Note:** Notice the variation in delay while visualizing the algorithms. Contraction Hierarchies are rendered almost instantly whereas Breadth First Takes can take upto a few seconds to render.

**Note:** I have excluded Bellmanford's and Flyod Warshall's algorithms due to it's high time complexities.
The algorithms are made to work with extremely large datasets. Due to hardware constraints in the deployment (Free Tier), only a selected section of the world map is available to test right now.

![Screenshot of the application](docs/screenshot.png?raw=true)

## Authors

- [@Bihan001](https://www.github.com/Bihan001)


## Run Locally

1. Clone the repository
```bash
  git clone https://github.com/Bihan001/world-graph.git
```

2. Go to the project directory
```bash
  cd world-graph
```

3. Build the image
```shell
# Add --platform=linux/amd64 if building for linux through mac
docker build . -t world-graph:1.0
```

4. Spin up a docker container through the built image
```
docker run -d -e PORT=5000 -p 5000:5000 world-graph:1.0
```


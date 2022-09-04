
# World Graph

A web application that uses advanced Graph Algorithms to find the Shortest Path between two points on the World Map. User can also visualize the algorithm in action.



## Authors

- [@Bihan001](https://www.github.com/Bihan001)


## Deployment

To deploy this project run

```bash
  heroku login
  docker ps
  heroku container:login
  heroku container:push web -a world-graph
  heroku container:release web
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/Bihan001/world-graph.git
```

Go to the project directory

```bash
  cd world-graph
```

Install dependencies

```bash
  npm install
```

Start the backend and frontend servers

```bash
  npx turbo run dev
```


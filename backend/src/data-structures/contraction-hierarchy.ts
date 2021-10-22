import SortedSet from 'collections/sorted-set';
import { Edge } from '../utils/interfaces/graph';

interface Node {
  first: number;
  second: number;
}

const REGION = 'timeSquare';

const pairToStr = (a: any, b: any) => {
  return a.toString() + '#' + b.toString();
};

const backFromStr = (s: string) => {
  const [a, b] = s.split('#');
  return { first: +a, second: +b };
};

class ContractionHierarchy {
  private n = 0;
  private m = 0;
  private s = 0;
  private t = 0;
  private order = 0;
  private G: Array<Array<Array<Node>>> = []; // G[0] = Forward graph, G[1] = Reversed Graph
  private G_CH: Array<Array<Array<Node>>> = [];
  private dist: Array<Array<number>> = [];
  private parent: Array<{ [key: number]: number }> = [];
  private proc: Array<Set<number>> = [];
  private OparentMap: { [key: string]: number } = {};
  private dp: { [key: string]: Array<[number, number]> } = {};
  private edges: Edge[] = [];
  private allEdges: Edge[] = [];
  private pq: SortedSet<Node>[] = [];
  private imp_pq: SortedSet<Node> = new SortedSet<Node>(
    [],
    (a, b) => a.second === b.second && a.first === b.first,
    (a, b) => {
      if (a.first < b.first) return -1;
      if (a.first > b.first) return 1;
      if (a.second !== b.second) return -1;
      return 0;
    }
  );
  private contracted: Array<boolean> = [];
  private imp: Array<number> = [];
  private level: Array<number> = [];
  private contr_neighbours: Array<number> = [];

  private read() {
    console.log('Reading...');
    const adjacencyList = global.fullAdjacencyList[REGION];
    const adjacencyListArr = Object.keys(adjacencyList);
    this.n = adjacencyListArr.length;
    this.G.push([]);
    this.G.push([]);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.n + 1; j++) {
        this.G[i].push([]);
      }
    }
    let u = 0;
    let v = 0;
    let w = 0;
    Object.keys(adjacencyList).map((vertexId) => {
      const vertex = adjacencyList[vertexId];
      vertex.adj.map((neighbourId, idx) => {
        u = +vertexId;
        v = neighbourId;
        w = vertex.w[idx];
        if (u !== v) {
          this.connect(this.G[0][u], v, w);
          this.connect(this.G[1][v], u, w);
        }
      });
    });
  }

  private connect(E: Node[], v: number, w: number) {
    for (let p of E) {
      if (p.first === v) {
        p.second = Math.min(p.second, w);
        return;
      }
    }
    const newVal: Node = { first: v, second: w } as Node;
    E.push(newVal);
  }

  private preprocess() {
    this.setOrder();
    this.build_G_CH();
  }

  private setOrder() {
    for (let i = 0; i <= this.n; i++) {
      this.contracted.push(false);
      this.imp.push(0);
      this.level.push(0);
      this.contr_neighbours.push(0);
    }
    for (let i = 1; i <= this.n; i++) {
      this.imp_pq.add({ first: -this.n, second: i });
    }
    let currentNode = 0;
    let newImp = 0;
    this.order = 1;
    while (this.imp_pq.length > 0) {
      let currNodeObj = this.imp_pq.min();
      if (!currNodeObj) break;
      currentNode = currNodeObj.second;
      this.imp_pq.delete(currNodeObj);
      newImp = this.getImportance(currentNode);
      currNodeObj = this.imp_pq.min();
      if (!currNodeObj || newImp - currNodeObj.first <= 10) {
        this.imp[currentNode] = this.order++;
        this.contracted[currentNode] = true;
        this.contractNode(currentNode);
      } else {
        this.imp_pq.add({ first: newImp, second: currentNode });
      }
    }
  }

  private getImportance(x: number): number {
    let u = 0;
    let v = 0;
    let shortcuts = 0;
    let inOut = 0;
    for (let i = 0; i < 2; i++) {
      for (let p of this.G[i][x]) {
        if (!this.contracted[p.first]) {
          inOut += 1;
        }
      }
    }
    for (let p1 of this.G[1][x]) {
      for (let p2 of this.G[0][x]) {
        u = p1.first;
        v = p2.first;
        if (!this.contracted[u] && !this.contracted[v]) {
          shortcuts += 1;
        }
      }
    }
    const edgeDiff = shortcuts - inOut;
    return edgeDiff + 2 * this.contr_neighbours[x] + this.level[x];
  }

  private contractNode(x: number) {
    let u = 0;
    let w = 0;
    let mx = this.getMaxEdge(x);
    // outEdges => pair<int, int> => stringify => firstVal#secondVal
    const outEdges: Set<string> = new Set();
    for (let p of this.G[0][x]) {
      if (!this.contracted[p.first]) {
        outEdges.add(pairToStr(p.first, p.second));
      }
    }
    for (let p of this.G[1][x]) {
      u = p.first;
      if (!this.contracted[u]) {
        w = p.second;
        // x -> first, u -> second
        this.checkWitness(u, x, w, mx, outEdges, false);
      }
    }
    for (let i = 0; i < 2; i++) {
      for (let p of this.G[i][x]) {
        this.contr_neighbours[p.first] += 1;
        this.level[p.first] = Math.max(this.level[p.first], this.level[x] + 1);
      }
    }
  }

  private getMaxEdge(x: number): number {
    let ret = 0;
    for (let p1 of this.G[1][x]) {
      for (let p2 of this.G[0][x]) {
        if (p1.first !== p2.first && !this.contracted[p1.first] && !this.contracted[p2.first]) {
          ret = Math.max(ret, p1.second + p2.second);
        }
      }
    }
    return ret;
  }

  private checkWitness(u: number, x: number, w: number, mx: number, outEdges: Set<string>, type: boolean): number {
    let a = 0;
    let b = 0;
    let currDist = 0;
    let newDist = 0;
    const D_pq: SortedSet<Node> = new SortedSet<Node>(
      [],
      (a, b) => a.second === b.second && a.first === b.first,
      (a, b) => {
        if (a.first < b.first) return -1;
        if (a.first > b.first) return 1;
        if (a.second !== b.second) return -1;
        return 0;
      }
    );
    const D_dist: { [key: number]: number } = {};
    D_pq.add({ first: 0, second: u });
    D_dist[u] = 0;
    let iter = (250 * (this.n - this.order)) / this.n;
    while (D_pq.length > 0 && iter > 0) {
      iter -= 1;
      let currentDistObj = D_pq.min();
      if (!currentDistObj) break;
      currDist = currentDistObj.first;
      a = currentDistObj.second;
      D_pq.delete(currentDistObj);
      if (currDist <= D_dist[a]) {
        for (let p of this.G[0][a]) {
          newDist = p.second + currDist;
          b = p.first;
          // this.OparentMap[`${x}@${b}`] = a;
          // this.OparentMap[`${b}@${x}`] = a;
          if (b !== x && !this.contracted[b]) {
            if (isNaN(D_dist[b]) || D_dist[b] > newDist) {
              if (isNaN(D_dist[b]) || D_dist[b] < mx) {
                D_dist[b] = newDist;
                D_pq.add({ first: newDist, second: b });
                // this.OparentMap[`${x}@${b}`] = a;
                // this.OparentMap[`${b}@${x}`] = a;
              }
            }
          }
        }
      }
    }
    let v = 0;
    let ret = 0;
    let new_w = 0;
    for (let pTmp of outEdges) {
      let p = backFromStr(pTmp);
      v = p.first;
      new_w = w + p.second;
      if (isNaN(D_dist[v]) || D_dist[v] > new_w) {
        ret += 1;
        if (!type && u !== v) {
          this.connect(this.G[0][u], v, new_w);
          this.connect(this.G[1][v], u, new_w);
          this.OparentMap[`${u}@${v}`] = x;
          this.OparentMap[`${v}@${u}`] = x;
        }
      }
    }
    return ret;
  }

  private build_G_CH() {
    this.G_CH.push([]);
    this.G_CH.push([]);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.n + 1; j++) {
        this.G_CH[i].push([]);
      }
    }
    let v = 0;
    let w = 0;
    for (let u = 1; u <= this.n; u++) {
      for (let p of this.G[0][u]) {
        v = p.first;
        w = p.second;
        if (this.imp[v] > this.imp[u]) {
          this.G_CH[0][u].push({ first: v, second: w });
        } else {
          this.G_CH[1][v].push({ first: u, second: w });
        }
      }
    }
  }

  private getDistance(): number {
    this.dist[0][this.s] = 0;
    this.dist[1][this.t] = 0;
    this.parent[0][this.s] = this.s;
    this.parent[1][this.t] = this.t;
    let SP = Infinity;
    this.pq[0].add({ first: 0, second: this.s });
    this.pq[1].add({ first: 0, second: this.t });
    let front: Node | undefined = { first: 0, second: 0 };
    let currentNode = 0;
    let currentDist = 0;
    while (this.pq[0].length > 0 || this.pq[1].length > 0) {
      if (this.pq[0].length > 0) {
        front = this.pq[0].min();
        if (!front) break;
        this.pq[0].delete(front);
        currentNode = front.second;
        currentDist = front.first;
        if (SP >= currentDist) {
          this.relaxNodeEdges(currentNode, 0);
        }
        this.proc[0].add(currentNode);
        if (this.proc[1].has(currentNode) && this.dist[0][currentNode] + this.dist[1][currentNode] < SP) {
          SP = this.dist[0][currentNode] + this.dist[1][currentNode];
        }
        // SP = Math.min(SP, this.dist[0][currentNode] + this.dist[1][currentNode]);
        // this.allEdges.push({
        //   src: [adjL[this.parent[0][currentNode]].lat, adjL[this.parent[0][currentNode]].lon],
        //   dest: [adjL[currentNode].lat, adjL[currentNode].lon],
        //   weight: 0,
        // });
      }
      if (this.pq[1].length > 0) {
        let front = this.pq[1].min();
        if (!front) break;
        this.pq[1].delete(front);
        currentNode = front.second;
        currentDist = front.first;
        if (SP >= currentDist) {
          this.relaxNodeEdges(currentNode, 1);
        }
        this.proc[1].add(currentNode);
        if (this.proc[0].has(currentDist) && this.dist[0][currentNode] + this.dist[1][currentNode] < SP) {
          SP = this.dist[0][currentNode] + this.dist[1][currentNode];
        }
        // SP = Math.min(SP, this.dist[0][currentNode] + this.dist[1][currentNode]);
        // this.allEdges.push({
        //   src: [adjL[this.parent[1][currentNode]].lat, adjL[this.parent[1][currentNode]].lon],
        //   dest: [adjL[currentNode].lat, adjL[currentNode].lon],
        //   weight: 0,
        // });
      }
    }
    if (SP === Infinity) {
      return -1;
    }
    return SP;
  }

  private relaxNodeEdges(u: number, g: number) {
    let v = 0;
    let w = 0;
    for (let p of this.G_CH[g][u]) {
      v = p.first;
      w = p.second;
      if (this.dist[g][v] > this.dist[g][u] + w) {
        this.dist[g][v] = this.dist[g][u] + w;
        this.pq[g].add({ first: this.dist[g][v], second: v });
        // this.addAllEdge(u, v, 'allEdges');
        this.parent[g][v] = u;
      }
    }
  }

  private addAllEdge(u: number, v: number, type: string): Array<[number, number]> {
    const s = `${u}@${v}`;
    const adjL = global.fullAdjacencyList[REGION];
    const x = this.OparentMap[s];

    // Base case
    if (!x) {
      if (type === 'edges') {
        this.edges.push({
          src: [adjL[u].lat, adjL[u].lon],
          dest: [adjL[v].lat, adjL[v].lon],
          weight: 0,
        });
      } else if (type === 'allEdges') {
        this.allEdges.push({
          src: [adjL[u].lat, adjL[u].lon],
          dest: [adjL[v].lat, adjL[v].lon],
          weight: 0,
        });
      }
      return [[u, v]];
    }

    // Memoized case
    if (this.dp[s]) {
      let arr = this.dp[s];
      arr.map((el) => {
        if (type === 'edges') {
          this.edges.push({
            src: [adjL[el[0]].lat, adjL[el[0]].lon],
            dest: [adjL[el[1]].lat, adjL[el[1]].lon],
            weight: 0,
          });
        } else if (type === 'allEdges') {
          this.allEdges.push({
            src: [adjL[el[0]].lat, adjL[el[0]].lon],
            dest: [adjL[el[1]].lat, adjL[el[1]].lon],
            weight: 0,
          });
        }
      });
      return arr;
    }

    let arr: Array<[number, number]> = [];
    arr = [...arr, ...this.addAllEdge(u, x, type)];
    arr = [...arr, ...this.addAllEdge(x, v, type)];
    this.dp[s] = arr;
    return arr;
  }

  constructor() {
    console.log('Preprocessing...');
    this.read();
    this.preprocess();
    console.log('Preprocessing done!');
    let cnt = 0;
    for (let i of this.contracted) {
      if (i) cnt += 1;
    }
    console.log('Contracted', cnt, 'nodes');
  }

  public query(_s: number, _t: number): { allEdges: Edge[]; edges: Edge[] } {
    this.s = _s;
    this.t = _t;
    this.allEdges = [];
    this.edges = [];
    if (this.proc.length === 2 && (this.proc[0].size > 0 || this.proc[1].size > 0)) {
      this.proc[0].forEach((id) => (this.dist[0][id] = Infinity));
      this.proc[1].forEach((id) => (this.dist[1][id] = Infinity));
    } else {
      this.dist = [];
      this.dist.push([]);
      this.dist.push([]);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < this.n + 1; j++) {
          this.dist[i].push(Infinity);
        }
      }
    }
    this.parent = [];
    this.parent.push({});
    this.parent.push({});
    this.proc = [];
    this.proc.push(new Set());
    this.proc.push(new Set());
    this.pq = [];
    for (let i = 0; i < 2; i++) {
      this.pq.push(
        new SortedSet<Node>(
          [],
          (a, b) => a.second === b.second && a.first === b.first,
          (a, b) => {
            if (a.first < b.first) return -1;
            if (a.first > b.first) return 1;
            if (a.second !== b.second) return -1;
            return 0;
          }
        )
      );
    }
    const distance = this.getDistance();
    console.log('CH query distance:', distance);
    let distEstimate: number = Infinity;
    let currBest: number = 0;

    this.proc[0].forEach((vId) => {
      if (this.dist[0][vId] + this.dist[1][vId] < distEstimate) {
        distEstimate = this.dist[0][vId] + this.dist[1][vId];
        currBest = vId;
      }
    });

    this.proc[1].forEach((vId) => {
      if (this.dist[0][vId] + this.dist[1][vId] < distEstimate) {
        distEstimate = this.dist[0][vId] + this.dist[1][vId];
        currBest = vId;
      }
    });

    let last = currBest;

    console.log(distance, distEstimate, this.dist[0][last] + this.dist[1][last]);

    if (!this.parent[0][last] || !this.parent[1][last]) {
      console.log('No parent found WTF', last, this.parent[0][last], this.parent[1][last]);
      return { allEdges: this.allEdges, edges: this.edges };
    }

    while (last !== this.s) {
      this.addAllEdge(this.parent[0][last], last, 'edges');
      last = this.parent[0][last];
    }

    this.edges.reverse();

    last = currBest;

    while (last !== this.t) {
      this.addAllEdge(this.parent[1][last], last, 'edges');
      last = this.parent[1][last];
    }

    return { allEdges: [], edges: this.edges };
  }
}

export default ContractionHierarchy;

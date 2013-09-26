/*
     Path-finding algorithm Dijkstra
   - worst-case running time is O( |E| + |V| · log |V| ) thus better than
   Bellman-Ford, but cannot handle negative edge weights
   */

function dijkstra(g, source){

  // initially, all distances are infinite and all predecessors are null
	//   for(var i=0; i< g.length; i++){
    for (var i in g){
      g[i].distance = Infinity;
      g[i].optimized=false;
      g[i].indx = +i;
    }

	 // console.log(g[0].distance);
	//  console.log(g[2]);

    g[source].distance = 0;
    var counter = 0;

  // set of unoptimized nodes, sorted by their distance
  var q = new BinaryMinHeap(g, "distance");

  var node;
  /* get the node with the smallest distance */
  /* as long as we have unoptimized nodes */
  while(q.min() != undefined) {

    /* remove the latest */
    node = q.extractMin();
    node.optimized = true;

    /* no nodes accessible from this one */
    if(node.distance == Infinity) return;

    //throw "Orphaned node!";

    /* for each neighbor of node */
    for(var e=0; e< node.length; e++ ) {

      if(g[node[e]].optimized) continue;

      /* look for an alternative route */
      var alt = node.distance + 1;//node.weight[e];

      /* update distance and route if a better one has been found */
      if (alt < g[node[e]].distance) {

        /* update distance of neighbour */
        g[node[e]].distance = alt;

        /* update priority queue */
        q.heapify();

        /* update path */
        g[node[e]].predecessor = node.indx;

      }
    }
  }
}


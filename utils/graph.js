/*
 *
 * File  : graph.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Graph using adjacency list representation
 *
 * 	Example:
 *
 * Date    : Sun Jun  2 22:55:36 2013
 * Modified: $Id$
 *
 */
function Graph(file){

  this.a_={};
  this.readIn(file);

}


Graph.prototype.readIn = function(file) {

  var oReq = new XMLHttpRequest();
  oReq.open("GET", file, true);
  oReq.responseType = "arraybuffer";
  var a = this.a_;

  oReq.onload = function (oEvent) {

    var arrayBuffer = oReq.response; // Note: not oReq.responseText

    //console.log(arrayBuffer);
    if (arrayBuffer) {

      var byteArray = new Uint16Array(arrayBuffer), n, neigh;

	// console.log("byteArray.length", byteArray.length);

      for (var i = 0; i < byteArray.length; i+=(byteArray[i+1]+2)){
        n=byteArray[i+1];
        neigh = [];
        for (var j = 0; j < n; j++) neigh.push(byteArray[i+j+2]);
        a[byteArray[i]] = neigh;
      }
      dijkstra(a,0);
    }
  };
  oReq.send(null);
};

Graph.prototype.getNeighbors = function(i) {
  return this.a_[i];
};



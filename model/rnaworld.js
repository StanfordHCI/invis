/*
 *
 * File  : rnaworld.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Container of rna populations.
 *
 * 	Example:
 *
 * Date    : Wed Apr 24 02:36:03 2013
 * Modified: $Id$
 *
 */
function RNAWorld(fname)
{
  this.refseq_      = [];  // wild type
  this.refcoords_   = [];  // wild type coordinates
  this.frame_       = null;//
  this.pops_        = [];  // population
  this.bbox_        = {};

  this.graph_       = null; // represents the epsilon graph
                            // with epsilon   = 1 used to compute
                            // shortest paths

  this.cumIndx_     = [];

  this.stats_=[]; //stats w/ respect to the reference rna

  var thisRNAWorld =this;

  //read in meta data ** synchronous **
  d3.jsons(fname, function(json) {
    thisRNAWorld.meta_ =json;
    thisRNAWorld.init();
   });

}

RNAWorld.prototype.init = function() {

  this.readInPopulations();
  this.readInFrame();
  this.readInRefseq();
  this.computeBBox();
  this.computeCumIndx();
  this.graph_ = new Graph(this.meta_.adj);


};

//
//read populations sequences and their projected coords
//need to this !!!
//
RNAWorld.prototype.readInPopulations = function() {
 var i=0, n=this.meta_.numOfPopulations, p=this.meta_.populations;
 for(; i< n; this.pops_.push(new RNAPop(p[i])), i++);
};

//read in the coordinate frame
RNAWorld.prototype.readInFrame = function() {
  var f = this.meta_.frame;
  this.frame_= new Frame(f);
};


//read in the ref (wildtype) seq
//its coords
RNAWorld.prototype.readInRefseq = function () {

  var thisRNAWorld = this;

  d3.texts(this.meta_.refseq, function(textseq){

    thisRNAWorld.refseq_ = (textseq.trim().split('\n')
    .map(function(d){ return d.split(',');})
    .map(function(d){ return d.map(function(d){
      return (+d);
    })}))[0];
	//     thisRNAWorld.refseq_ = d3.csv.parseRows(textseq);
  });

  d3.texts(this.meta_.refcoords, function(textcoords){
    thisRNAWorld.refcoords_= textcoords.trim().split('\n')
    .map(function(d){ return d.split(',');})
    .map(function(d){ return d.map(function(d){
      return (+d);
    })});
	//     thisRNAWorld.refcoords_ = d3.csv.parseRows(textcoords);
  });
};


RNAWorld.prototype.computeBBox = function(){

  var n=this.meta_.numOfPopulations;

  if(n==0) return;
  var pops = this.pops_;
  var minX=pops[0].bbox_.minX,
      minY=pops[0].bbox_.minY,
      maxX=pops[0].bbox_.maxX,
      maxY=pops[0].bbox_.maxY ;

  var i=1, v;
  for(; i< n; i++){

    v=pops[i].bbox_.minX;
    minX = minX>v?v:minX;

    v=pops[i].bbox_.minY;
    minY = minY>v?v:minY;

    v=pops[i].bbox_.maxX;
    maxX = maxX<v?v:maxX;

    v=pops[i].bbox_.maxY;
    maxY = maxY<v?v:maxY;
  }

  this.bbox_.minX=minX;
  this.bbox_.minY=minY;
  this.bbox_.maxX=maxX;
  this.bbox_.maxY=maxY;
};

RNAWorld.prototype.log=function(){
	//   console.log(this.meta_);
};



//
//computes the local (in-population) index of a given
//world indx of a sequence.
//
RNAWorld.prototype.localIndx=function(i){

 var j=0, I=this.cumIndx_;
 for(var k=0; k< I.length; k++){
   if(i>=j && i<I[k])
     return {indx:i-j, id:k-1}; // id for the ref seq =-1
   j = I[k];
 }

};

//
// computes the global index of a given
// world indx of a sequence.
//
RNAWorld.prototype.globalIndx=function(i,j){

  var I=this.cumIndx_;
  return(j==-1)?i:(I[j]+i);

};

//
// cumulative sum of  the number of sequences from each population
// the ref seq is a population with one member
//
RNAWorld.prototype.computeCumIndx = function(){

  var p = this.pops_, ci=this.cumIndx_;

  this.cumIndx_.push(1);

  for(var i=0; i< p.length; i++)
    ci.push(p[i].seqs_.length +ci[ci.length-1]);

	// console.log("cumIndx:", this.cumIndx_);
}


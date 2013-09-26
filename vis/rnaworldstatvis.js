/*
 *
 * File  : rnaworldstatvis.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Visualization for  population stats using
 *         stackedbars.
 *
 * 	Example:
 *
 * Date    : Tue Apr 30 22:39:20 2013
 * Modified: $Id$
 *
 */
function RNAWorldStatvis(rnaworld, divnode, opts)
{
  this.divRoot_     = divnode;
  this.rnaWorld_    = rnaworld;
  this.stackedbars_ = [];  //one for each population
  this.opts_        = (opts==undefined)?{ }:opts;
  this.setDefaultOpts();

	//console.log(this.opts_);

  this.create();
}


RNAWorldStatvis.prototype.create = function() {

  var numPops = this.rnaWorld_.pops_.length, 
            p = this.rnaWorld_.pops_,
            o = this.opts_, 
          div = this.divRoot_;

  o.size.h=60; // XXX fix this 

  for(var i=0; i< numPops; i++){
    this.stackedbars_.push(new RNAPopStackedbar(p[i], div, o));
    o.pos.y += 60;
  }
};

//TBI - no, it doesn't stand for Traumatic Brain Injury here.
RNAWorldStatvis.prototype.update = function() {

};

//TBI
RNAWorldStatvis.prototype.remove = function() {

};

RNAWorldStatvis.prototype.setDefaultOpts = function() {

  var o   = this.opts_, div=this.divRoot_;
  o.color = o.color==undefined?d3.scale.category10():o.color;
  o.pos   = (o.pos==undefined)?{x:0,y:0}:o.pos;
  o.size  = (o.size!=undefined)?o.size:{
    w:parseInt(div.style("width")),
      h:parseInt(div.style("height"))};


};


RNAWorldStatvis.prototype.labels= function () {

  var meta = this.rnaWorld_.meta_;
  var n    = meta.numOfPopulations;

  if (this.labels_== undefined){
    this.labels_ = [];
    for(var i=0; i< n; this.labels_.push(meta.populations[i++].name));
  }
  return this.labels_;
};


//TBI
RNAWorldStatvis.prototype.hide = function (i) {
  this.stackedbars_[i].hide();
};

//TBI
RNAWorldStatvis.prototype.show = function (i) {
  this.stackedbars_[i].show();
};

/*
 *
 * File  : rnaworldscatterplot.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Mon Apr 29 00:23:15 2013
 * Modified: $Id$
 *
 */
function RNAWorldScatterplot(rnaworld, divnode, opts){

  this.divRoot_      = divnode;
  this.rnaWorld_     = rnaworld;
  this.scatterplots_ = [];  //one for each population
  this.paths_        = [];

  this.nodeSelection_ = new Collection(rnaworld.pops_, rnaworld.refseq_);

  this.opts_        = (opts == undefined)?{}:opts;
  this.setDefaultOpts();

  this.initScale(rnaworld.bbox_);

  this.create();
  this.addTooltips();
}


RNAWorldScatterplot.prototype.create= function() {
  var n = this.rnaWorld_.pops_.length, p = this.rnaWorld_.pops_;
  var o = this.opts_, div = this.divRoot_;

   this.svgRoot_= div.append("svg")
     .attr("id", "scatterplot")
	     .attr("width", o.size.w)
	     .attr("height",o.size.h)
	     .style("position","absolute")
	     .style("left", o.pos.x+"px")
	     .style("top",  o.pos.y+"px");

   this.dropShadow_ = new DropShadow(this.svgRoot_, "dropShadow");

   this.brush_= this.svgRoot_.append("g").attr("class", "brush"); //place holder

   var opts ={size:o.size, scale:o.scale, color:o.color(0)};
   for(var i=0; i< n; i++){
     opts.color=o.color(i);
     this.scatterplots_.push(
         new Scatterplot(p[i].coords_, div, this.svgRoot_, i, opts));;
     this.scatterplots_[i].color_=o.color(i);
   }

   //---------- **** -----------------
   //
   //

   //add the node representing the reference
   //
   //
	//     .style("background-color","white")
	//     .style("border","1px solid #cc9")
	//     .style("padding","1px")
	//     .style("font-size", "10px")
	//     .style("-mox-box-shadow","2px 2px 11px #666")
	//     .style("-webkit-box-shadow","2px 2px 11px #666");


var tooltip = d3.select("body").append("div")
    .attr("class", "scatterplot-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color","white")
    .style("border","1px solid #cc9")
    .style("padding","1px")
    .style("font-size", "10px")
    .style("-mox-box-shadow","2px 2px 11px #666")
    .style("-webkit-box-shadow","2px 2px 11px #666");

   this.refCircle_=
     this.svgRoot_
     .append("circle")
     .attr("id", "ref-circle")
     .attr("class", "circle")
     .attr("cx",o.scale.x(this.rnaWorld_.refcoords_[0][0]))
     .attr("cy",o.scale.y(this.rnaWorld_.refcoords_[0][1]))
     .attr("r", 7)
     .attr("shape-rendering", "optimizeSpeed")
	// .attr("filter", "url(#dropShadow)")
     .style("stroke", "black")
     .style("stroke-width", 4)
     .style("fill","white")
     .style("visibility","hidden")
     .on("mouseover",function(d,j){
       tooltip.style("visibility", "visible").text("reference (wild type)");
     })
   .on("mousemove", function() {
     tooltip.style("top", (event.pageY+5)+"px").style("left",(event.pageX+8)+"px")
   })
  .on("mouseout",function(){
    tooltip.style("visibility", "hidden");
  });


   //----------------------------
}

//TBI - no, it doesn't stand for Traumatic Brain Injury here.
RNAWorldScatterplot.prototype.update = function() {

};

//TBI
RNAWorldScatterplot.prototype.remove = function() {

};



RNAWorldScatterplot.prototype.epsilonFilter= function(t) {

  var n  = this.scatterplots_.length, pops=this.rnaWorld_.pops_;
  for(var i=0; i< n; this.scatterplots_[i].recolor(pops[i].enets_[t]),i++);

};


RNAWorldScatterplot.prototype.filter= function(t) {
  var n  = this.scatterplots_.length, pops=this.rnaWorld_.pops_;
  //console.log(t);
  //fades away the nodes whose data value is bigger
  //than t. ;
  for(var i=0; i< n; this.scatterplots_[i].fade(t, pops[i].refdist_),i++);
};


RNAWorldScatterplot.prototype.updateLinkToHeatmap = function(vis) {

  this.heatmap_ = vis; // hack

  var n  = this.scatterplots_.length,pops=this.rnaWorld_.pops_;

  for(var i=0; i< n;
      this.scatterplots_[i].updateLinkToHeatmap(vis, pops[i]),i++);
}


RNAWorldScatterplot.prototype.linkToHeatmap= function(vis) {


  var n  = this.scatterplots_.length,pops=this.rnaWorld_.pops_;

  for(var i=0; i< n;
      this.scatterplots_[i].linkToHeatmap(vis, pops[i].seqs_),i++);

}


RNAWorldScatterplot.prototype.removeHighlight= function() {

  var n  = this.scatterplots_.length;
  for(var i=0; i< n; this.scatterplots_[i].removeHighlight(),i++);

}

RNAWorldScatterplot.prototype.addTooltips = function() {

  var n  = this.scatterplots_.length, pops=this.rnaWorld_.pops_;
  for(var i=0; i< n; this.scatterplots_[i].addTooltip(pops[i].meta_.name),i++);

}


RNAWorldScatterplot.prototype.selectRegion= function(e) {
  var  sp = this.scatterplots_, n  = sp.length, ns=this.nodeSelection_;
  for(var i=0; i< n; sp[i].selectRegion(ns,e),i++);

}

RNAWorldScatterplot.prototype.highlight = function(d,j) {

  var n  = this.scatterplots_.length, pops=this.rnaWorld_.pops_;
  for(var i=0; i< n; this.scatterplots_[i].highlight(d,j,pops[i].seqs_),i++);

}
//clears selection
//TODO cycle through only the current selection, instead of all nodes
//
RNAWorldScatterplot.prototype.deselectAll = function() {

  var s = this.scatterplots_,
      n = s.length,
      p = this.paths_;

    for(var i=0; i<n; s[i].deselect(), i++);

    var m = p.length;
    for(i=0; i< m; p[i].deselect(), i++);

    this.nodeSelection_.removeAll();

};


RNAWorldScatterplot.prototype.addMouseClick= function() {

  var s = this.scatterplots_,
      n = this.scatterplots_.length,
      p = this.paths_;

  //------- on ----------
  for(var i=0; i< n; s[i].addMouseClick(this.nodeSelection_), i++);

  //------- off ----------
  //background mouse click
  this.svgRoot_.on("click", this.deselectAll);

};



RNAWorldScatterplot.prototype.addBrush = function() {

  var thisWorld = this,
      sp = this.scatterplots_,
      ns = this.nodeSelection_;

  function brushstart(){

    //	vis.classed("selecting", true);

  }

  function brushend()
  {
    var f=!d3.event.target.empty();
    if(f){

      //     ns.and();
      //     sp[0].vis_.update(ns.result());
      //     sp[0].vis_.updateRowLabels(["aggregated (AND)"]);

    }else{

      thisWorld.deselectAll();

    }

    //vis.classed("selecting", f);
    //vis.classed("spathselecting",false);

  }

function brushmove(){

  var e = d3.event.target.extent();
  thisWorld.selectRegion(e);
  if(ns.num_> 0 && ns.aggregate!=null){
    ns.aggregate();
    sp[0].vis_.update(ns.result());
    sp[0].vis_.updateRowLabels([ns.aggregateLabel_]);
  }
}

//"aggregated (AND)"
  var o = this.opts_;
  this.brush_.style("stroke", "#fff")
  .style("fill-opacity",.125)
  .style("shape-rendering","crispEdges")
.call(d3.svg.brush().x(o.scale.x).y(o.scale.y)
    .on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend));

};

/*
RNAWorldScatterplot.prototype.addPath = function(node) {

  if(this.nodeSelection_.length<2) return; //at least two points are
  var o   = newOpts();
  o.scale = this.opts_.scale;
  var path=new Path(this.nodeSelection_, this.svgRoot_, o);
  path.addMouseClick();
  this.paths_.push(path);
};
*/

RNAWorldScatterplot.prototype.setDefaultOpts = function() {
  var o   = this.opts_,
      div = this.divRoot_;

  o.color = o.color==undefined?d3.scale.category10():o.color;
  o.pos   = (o.pos==undefined)?{x:0,y:0}:o.pos;
  o.size  = (o.size!=undefined)?o.size:{
    w:parseInt(div.style("width")),
      h:parseInt(div.style("height"))};
};


//sets up view scale
RNAWorldScatterplot.prototype.initScale = function (bbox){

  var o = this.opts_;
  o.scale = {x: d3.scale.linear()
    .domain([bbox.minX, +bbox.maxX])
      .range([10, o.size.w-10]),
      y: d3.scale.linear()
        .domain([+bbox.minY, +bbox.maxY])
        .range([10, o.size.h-10])};

};


RNAWorldScatterplot.prototype.labelColors= function () {
return undefined;
};

RNAWorldScatterplot.prototype.labels= function () {

  var meta = this.rnaWorld_.meta_;
  var n    = meta.numOfPopulations;

  if (this.labels_== undefined){
    this.labels_ = [];
    for(var i=0; i< n; this.labels_.push(meta.populations[i++].name));
  }

  return this.labels_;

};

RNAWorldScatterplot.prototype.hide = function (i) {
  this.scatterplots_[i].hide();
};

RNAWorldScatterplot.prototype.show = function (i) {
  this.scatterplots_[i].show();
};

RNAWorldScatterplot.prototype.showRefseq = function () {
  this.refCircle_.style("visibility", "visible");

};

RNAWorldScatterplot.prototype.hideRefseq = function () {
  this.refCircle_.style("visibility", "hidden");
};



//
// shortest path between the reference sequence and given target
// sequence
//
RNAWorldScatterplot.prototype.shortestPath = function (){

  var       ns = this.nodeSelection_;

  //TODO what happes if the selection has more than one nodes?
  //     a) do nothing & return -- current implementation
  //     b) compute shortest to the first element in the collection
  //     c) compute shortest paths to all elements in the collection
  //

	//   console.log("ns.num_:",ns.num_);

  if(ns.num_!=1) return console.log("multiple selections");

  // get the target node
  for (var key in ns.list_)
    if(ns.list_.hasOwnProperty(key)) break;

  var G  = this.rnaWorld_.graph_.a_,
      rw = this.rnaWorld_,
      s  = ns.list_[key],
      t  = rw.globalIndx(s.indx, s.id);


  if(G[t]==undefined ||
      !isFinite(G[t].distance)) return console.log("not connected");

  //not connected

  //
  // ---- unroll the path ----
  var shortest= [],
      pops    = rw.pops_;

  shortest.push(s);
	//   shortestNodes.push(s);

  var p = G[t].predecessor;

  while(p!=0) {
    s = rw.localIndx(p);
    s.coord = pops[s.id].coords_[s.indx];
    shortest.push(s);
    this.scatterplots_[s.id].bringFront(s.indx);
    p=G[p].predecessor;
  }
  shortest.push({id:-1,indx:0, coord:rw.refcoords_[0]});
  //---------------------------

  var o                = newOpts();
  o.scale              = this.opts_.scale;
  var path             = new Path(shortest, this.svgRoot_, o);

  this.playButton_ = d3.select("body").append("button")
    .attr("id", "play-button")
    .attr("type", "button")
    .style("position", "absolute")
    .style("z-index", "9")
    .style("visibility", "hidden")
    .style("margin","0px 0px 0px 0px")
    //.style("background-color", "white")
    //.style("border", "1px solid #cc9")
    .style("padding", "1px")
    .style("font-size", "10px")
    .style("-mox-box-shadow","2px 2px 11px #666")
    .style("-webkit-box-shadow","2px 2px 11px #666")
    .text("▶");
	//.text("♬");

  this.playButtonMusic_ = d3.select("body").append("button")
    .attr("id", "play-button-music")
    .attr("type", "button")
    .style("position", "absolute")
    .style("z-index", "9")
    .style("visibility", "hidden")
    .style("margin","0px 0px 0px 0px")
    .style("padding", "1px")
    .style("font-size", "10px")
    .style("-mox-box-shadow","2px 2px 11px #666")
    .style("-webkit-box-shadow","2px 2px 11px #666")
	.text("♬");

  path.addMouseClick();
  var that=this;

  path.addPlayButton(function(data){
    that.animateNodes(data); });

  this.paths_.push(path);

};


// animate the list of nodes by highlighting them
RNAWorldScatterplot.prototype.animateNodes= function (list,duration){

 if(list.length==0) return;

 if(!duration) duration=700*list.length;

 //bring up the heatmap first
var o   = this.opts_,
  //pos = {x:s.x(list[0].coord[0]), y:s.y(list[0].coord[1])};
    pos = {x:0, y:10-o.size.h+o.scale.y(list[0].coord[1])};


this.heatmap_.translate(pos,1000);

//animate the nodes
 var pops = this.rnaWorld_.pops_,
     h = this.heatmap_,
     sp = this.scatterplots_,
     delta=duration/(list.length-1),
     i=list.length-1;

var anim = this.svgRoot_.append("svg");

 function selectNode(){
   if(list[i].id!=-1) {
     //sp[list[i].id].select(list[i].indx);
     anim.append("circle")
      .attr("cx",o.scale.x(list[i].coord[0]))
      .attr("cy",o.scale.y(list[i].coord[1]))
      .attr("r", 7)
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", 4);

     h.update(pops[list[i].id].seqs_[list[i].indx]);
     h.updateRowLabels([pops[list[i].id].meta_.name+":"+i]);
   }
   i--;
   if(i>=0){
     setTimeout(selectNode, delta)
   } else {
     h.translate({x:0,y:0},2000,4000);
     anim.transition().style("opacity",0.1).duration(4000).remove();
   }
 }
 setTimeout(selectNode,0);
};

//aggregation
RNAWorldScatterplot.prototype.aggregation = function (f, type) {

  this.nodeSelection_.aggregation(f,type);

};



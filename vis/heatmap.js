/*
 *
 * File  : heatmap.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Creates a heatmap.
 *
 * 	Example:
 *
 * Date    : Thu Apr 25 16:10:41 2013
 * Modified: $Id$
 *
 */
function Heatmap(data, divnode, opts)
{
  this.d_ = ((data[0].length==1)||(data[0].length==undefined))?[data]:data;
  this.divRoot_  = divnode;
  this.opts_     = (opts==undefined)?{}:opts;
  this.setDefaultOpts();

  this.opts_.color=d3.scale
    .ordinal()
    .domain(d3.range(6))
    .range(["#7f7f7f", "#2ca02c","#000000", "#d62728","#1f77b4", "white"]);


  this.create();
  this.createTooltip();
}


Heatmap.prototype.create= function () {

  var o = this.opts_, div = this.divRoot_;

  this.svgRoot_ = div.append("svg")
    .attr("id", "heatmap")
    .attr("width", o.size.w+o.pad.left)
    .attr("height",o.size.h)
    .style("position","absolute")
    .style("left", o.pos.x+"px")
    .style("top", o.pos.y+"px");


  var thisHeatmap= this;

  this.row_= this.svgRoot_.selectAll(".row")
    .data(this.d_)
    .enter()
    .append("g") //don't have x, y attributes
    .attr("class", "row")
    .attr("transform", function(d,i) {
      return "translate("+(o.pad.left)+","+o.scale.y(i)+")"; })
    .each(row);

  function row(rowdata,k)
  {
    thisHeatmap.cells_ = d3.select(this).selectAll(".cell")
      .data(function(d){ return d; })
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", function(d,i) {return o.scale.x(i); })
      .attr("width", function(d) {return o.scale.x.rangeBand(); })
      .attr("height", function(d) {return o.scale.y.rangeBand(); })
      .style("fill-opacity", 0.8)
      .style("fill", o.color)
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .style("stroke-opacity",0.5)
      .style("shape-rendering", "crisp-edges")
      .on("mouseover.tip",function(d,j){
        var b = ["-", "A", "G", "T", "C"];
        thisHeatmap.tooltip_.style("visibility", "visible").text(b[d]+","+j);
      })
    .on("mousemove.tip", function() {
      thisHeatmap.tooltip_.style("top", (event.pageY+5)+"px").style("left",(event.pageX+8)+"px");
    })
    .on("mouseout.tip",function(){
      thisHeatmap.tooltip_.style("visibility", "hidden");
    });
  }
};


Heatmap.prototype.update = function (seq){

  var thisHeatmap =  this;
  seq=((seq[0].length==1)||(seq[0].length==undefined))?[seq]:seq;
  //
  // console.log("updating heatmap data");
  //
  this.row_.data(seq).each(row);
  function row(rowdata,k){
    thisHeatmap.cells_ = d3.select(this).selectAll(".cell")
      .data(function(d){ return d; })
      .style("fill", thisHeatmap.opts_.color);
  }
}


Heatmap.prototype.remove = function () {
  //XXX --TBI
};

Heatmap.prototype.removeHighlight = function () {

  this.cells_.classed("highlighted", function(){

    var node= d3.select(this);

    if(node.classed("highlighted")==true)
    node.style("stroke-width", 1).style("stroke", "white");
    return false;
  });

};


Heatmap.prototype.colorScale= function(){

return this.opts_.color;

}


Heatmap.prototype.labels = function(){
	// return this.labels_;
  //
 return  ["A", "C", "T","G","-"];
}


Heatmap.prototype.setLabels= function(l){
  this.labels_=l
}

Heatmap.prototype.labelColors = function(){

  // color ordering changed to match w/ labels()
   //["A", "C", "T", "G", "-"];
 return d3.scale
    .ordinal()
    .domain(d3.range(5))
    .range(["#2ca02c","#1f77b4","#d62728","#000000","#7f7f7f"]);


}




Heatmap.prototype.createTooltip =  function(){

  this.tooltip_ = d3.select("body").append("div")
    .attr("class", "heatmap-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color","#ffa")
    .style("border","1px solid #cc9")
    .style("padding","1;px")
    .style("font-size", "10px")
    .style("-mox-box-shadow","2px 2px 11px #666")
    .style("-webkit-box-shadow","2px 2px 11px #666");
}


Heatmap.prototype.highlight = function (d) {

	//   var playChannel = function (id) {
	//     var note = notes[id];
	//     if (!note) return;
	//     var nid = (channel_nid + 1) % channels.length;
	//     var time = (new Date()).getTime();
	//     var audio = channels[nid];
	//     channel_map[note.id] = audio;
	//     audio.src = MIDI.Soundfont[note.id];
	//     audio.volume = volume;
	//     audio.play();
	//     channel_nid = nid;
	//   };

  this.cells_.classed("highlighted", function(dd,i){

    var ret=false, node = d3.select(this);

    if(ret=(d[i] != dd))
    node.style("stroke-width", 2).style("stroke","black");

  return ret;
  });
};

  Heatmap.prototype.linkToScatterplot= function (vis) {

    this.cells_.on("mouseover", function(d,i){vis.highlight(d,i); })
    .on("mouseout", function(d,i){ vis.removeHighlight(); });

  /*
     vis.classed("selecting", true);
     node.classed("selected", function(dd,j){

     return (D[0][i]!= R[j][i]);
     });
     if(k==0){
     var b = ["-", "A",  "T", "G", "C"];
     return tooltip.style("visibility", "visible").text(b[+d]);
     } else {
     return tooltip.style("visibility", "visible").text(+d);
     }
     })
     .on("mouseout", function(){
     vis.classed("selecting", false);
     tooltip.style("visibility", "hidden");
     })
     .on("mousemove", function() {
     return tooltip.style("top", (event.pageY+5)+"px").style("left",(event.pageX+8)+"px");
     */

  };


Heatmap.prototype.svgRoot = function () {
  return this.svgRoot_;
};


Heatmap.prototype.hide = function () {
  this.svgRoot_.attr("visibility", "hidden");
};

Heatmap.prototype.show= function (){
  this.svgRoot_.attr("visibility", "visible");
};



Heatmap.prototype.updateRowLabels= function(labels) {
  var o =this.opts_;
  this.rowLabel_.text(function(d, i){return labels[i];});
};


Heatmap.prototype.addRowLabels = function(labels) {

  var o =this.opts_;
 this.rowLabel_ = this.row_.append("text")
    .attr("x",-2)
    .attr("y",function(d,i){return ~~(0.75*o.scale.y.rangeBand());})
    .attr("text-anchor", "end")
    .attr("font-size", 11)
    .attr("fill","black")
    .text(function(d, i){return labels[i];});

};


Heatmap.prototype.addColumnLabels= function (labels) {

  this.colLabel_=this.row_.append("text")
    .attr("x", -2)
    .attr("y",~~(0.5*t.rangeBand()))
    .attr("dy",~~(0.5*t.rangeBand()))
    .attr("text-anchor", "end")
    .attr("font-size", 8)
    .text(function(d, i) {return labels[i]; });

};


Heatmap.prototype.setDefaultOpts = function() {

  var o   = this.opts_, div=this.divRoot_, data = this.d_;

  o.pos      = (o.pos==undefined)?{x:0,y:0}:o.pos;
  o.size  = (o.size!=undefined)?o.size:{
    w:parseInt(div.style("width")),
      h:parseInt(div.style("height"))};

  // XXX make the default pad a function of the size
  o.pad = (o.pad==undefined)?{left:0,right:0,top:0,bottom:0}:o.pad;

  o.color = (o.color==undefined)?d3.scale.category10():o.color;

  //rows & cols
  o.numRows   = data.length;
  o.numColumns= data[0].length;

  o.scale = {
    x: d3.scale
      .ordinal()
      .domain(d3.range(o.numColumns))
      .rangeBands([0, o.size.w]),
    y: d3.scale
      .ordinal()
      .domain(d3.range(o.numRows))
      .rangeBands([0, o.size.h]) };


};

Heatmap.prototype.translate = function(pos, duration, delay){

  if(!delay) delay=0;

  if(duration){

  //animated translation
  this.svgRoot_.transition()
    .style("left", pos.x+"px")
    .style("top", pos.y+"px")
    .delay(delay)
    .duration(duration);

}else{
  //translation
  this.svgRoot_.style("left", pos.x+"px").style("top", pos.y+"px");
}
}

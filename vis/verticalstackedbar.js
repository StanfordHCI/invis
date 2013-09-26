/*
 *
 * File  : verticalstackedbar.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 *
 *
 * Date    : Fri Apr 26 22:53:58 2013
 * Modified: $Id$
 *
 */
function VerticalStackedbar(data, divnode, opts)
{
  this.d_    = data; // XXX fix this hack
                     // data.x = category labels
                     // data.y = normalized frequencies
  this.opts_ = (opts==undefined)?{}:opts;
  this.setDefaultOpts();

  this.opts_.color = d3.scale.ordinal().domain(d3.range(5)).range(["#7f7f7f", "#2ca02c","#0000000", "#d62728","#1f77b4"]);

  this.divRoot_=divnode;

  cumsum(this.d_.y); // cumulative sum of cols

  this.create();
}

VerticalStackedbar.prototype.create  = function () {

  var data = this.d_, o=this.opts_, div=this.divRoot_, thisSB=this;

	  this.svgRoot_ = div.append("svg")
    .attr("id", "popstackedbar")
    .attr("width",o.size.w+o.pad.left)
    .attr("height",o.size.h)
    .style("position","absolute")
    .style("left", o.pos.x+"px")
    .style("top", o.pos.y+"px");
    //.style("background-color", "gray");


  if(data.y[0].length==undefined){
    this.column_ = this.svgRoot_.selectAll(".col")
      .data(data.y)
      .enter().append("g")
      .attr("class","col")
      .attr("transform", function(d,i){
        return "translate("+(o.pad.left+o.scale.x(i))+",0)";})
      .each(col1d);
  } else {
    this.column_ = this.svgRoot_.selectAll(".col")
      .data(data.y)
      .enter().append("g")
      .attr("class","col")
      .attr("transform", function(d,i){
        return "translate("+(o.pad.left+o.scale.x(i))+",0)";})
      .each(col);
  }

  function col1d(coldata,i) {

    d3.select(this).selectAll(".stacked")
      .data(function(d){return [d];})
      .enter()
      .append("rect")
      .attr("class", "stacked")
      .attr("y", function(d,j){
        return o.size.h*((o.type==0)?(1-d):(j==0)?0:coldata[j-1]);
      })
    .attr("width", o.scale.x.rangeBand())
      .attr("height", function(d,j){return o.size.h*(j==0?d:d-coldata[j-1]); })
      .style("fill", function(d,j){
        return o.color(data.x[i]);})
      .style("fill-opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .style("stroke-opacity", 0.3);

  }

  function col(coldata,i) {
    d3.select(this).selectAll(".stacked")
      .data(function(d){return d;})
      .enter()
      .append("rect")
      .attr("class", "stacked")
      .attr("y", function(d,j){
        //console.log(j);
        return o.size.h*((o.type==0)?(1-d):(j==0)?0:coldata[j-1]);
      })
    .attr("width", o.scale.x.rangeBand())
      .attr("height", function(d,j){return o.size.h*(j==0?d:d-coldata[j-1]); })
      .style("fill", function(d,j){
	 //       console.log("***"+i+" "+j);
	//         console.log(data.x[i][j]);
        //console.log(data.x);
        //         console.log(o.color);
  //
        return o.color((data.x[i])[j]); })
      .style("fill-opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .style("stroke-opacity", 0.3);
  }


	//	 this.createTooltip();


};

VerticalStackedbar.prototype.hide = function(){

  this.svgRoot_.attr("visibility", "hidden");
};

VerticalStackedbar.prototype.show = function() {
  this.svgRoot_.attr("visibility", "visible");
};


VerticalStackedbar.prototype.createTooltip =  function(){

  this.tooltip_ = this.divRoot_
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  var thisSB = this; ;

  function col(coldata,i,thisSB){
    d3.select(this)
      .selectAll(".stacked")
      .on("mouseover",function(d,j){
        var b = ["-", "A", "G", "C", "T"];
        return thisSB.tooltip_.style("visibility", "visible").text(b[+d]);
      });
  }

  this.column_.each(function(d,i){
    col(d,i,thisSB);
  });


}


VerticalStackedbar.prototype.setDefaultOpts = function() {

  var o   = this.opts_, div=this.divRoot_, data = this.d_;

  o.pos   = (o.pos==undefined)?{x:0,y:0}:o.pos;
  o.size  = (o.size!=undefined)?o.size:{
    w:parseInt(div.style("width")),
    h:parseInt(div.style("height"))};

  // XXX make the default pad a function of the size
  o.pad = (o.pad==undefined)?{left:0,right:0,top:0,bottom:0}:o.pad;
  o.color = (o.color==undefined)?d3.scale.category10():o.color;

    //rows & cols
  o.numColumns = data.y.length==1?data.y.length[0]:data.y.length;
  o.scale = (o.scale!=undefined)?o.scale:{
    x: d3.scale
      .ordinal()
      .domain(d3.range(o.numColumns))
      .rangeBands([0, o.size.w])};

  //type
  o.type = (o.type==undefined)?0:o.type;

};

VerticalStackedbar.prototype.addLabel = function(label){
  this.label_ = this.svgRoot_
    .append("text")
    .attr("x", -2)
    .attr("y",this.opts_.pos.y)
	  .attr("text-anchor", "end")
    .attr("font-size", 10)
    .attr("fill","black")
    .text(label);

};



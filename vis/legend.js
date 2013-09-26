/*
 *
 * File  : legend.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Simple, interactive, svg-based legend.
 *         Legends can be seen as  visualizations
 *         augmenting visualizations.
 *
 *
 *
 * 	Example:
 *
 * Date    : Tue Apr 30 02:14:38 2013
 * Modified: $Id$
 *
 */
function Legend(vis, divnode, opts)
{
  this.vis_     = vis;
  this.divRoot_ = divnode;
  this.opts_    = (opts==undefined)?{}:opts;
  this.opts_.color=vis.labelColors();
  this.setDefaultOpts();
  this.labels_  = vis.labels();

  this.create();
}


Legend.prototype.create = function() {

  var o = this.opts_, div = this.divRoot_;

  this.svgRoot_= div.append("svg")
    .attr("id", "legend")
    .attr("width", o.size.w)
    .attr("height",o.size.h)
    .style("position","absolute")
    .style("left", o.pos.x+"px")
    .style("top",  o.pos.y+"px");

  var labels = this.labels_;
  var data = d3.range(labels.length);

	this.legend_ = this.svgRoot_.selectAll(".legend")
	.data(data)
	.enter()
  .append("g")
	.attr("class", "legend");

 if(o.type==1) //vertical
   this.legend_.attr("transform", function(d,i){return "translate(0," + i * 22 + ")"; });
 else //horizontal
   this.legend_.attr("transform", function(d,i){ return "translate("+ i * 22 + ",0)";});

  this.marks_ = this.legend_.append("rect")
    .attr("width", o.icon.w)
    .attr("height",o.icon.h)
    .style("fill", o.color)
    .style("stroke", "black")
    .style("stroke-width",2)
    .style("shape-rendering","crispEdges");

	  this.legend_.append("text")
      .attr("x", (4/3)*o.icon.w)
      .attr("y", (3/4)*o.icon.h)
      .style("font-size", "12px")
      .style("text-anchor","start")
      .text(function(d,i){return labels[i];});
}

//default is simple show/hide
Legend.prototype.addToggleInteraction= function() {

  //all legend marks are "on" initially
  this.clicked_ =  this.labels_.map(function(x){return true;});
  this.marks_.on("click", handleClick);

  var  c = this.clicked_, vis=this.vis_;

  function handleClick(d){
    d3.event.stopPropagation();
    var s=d3.select(this);
    if(c[d]){
      c[d]=false;
      s.style("stroke-width",0);
      vis.hide(d);
    }else {
      c[d]=true;
      s.style("stroke-width",2);
      vis.show(d);
    }
  }

};


Legend.prototype.setDefaultOpts = function() {

  var o=this.opts_, div=this.divRoot_, data = this.d_, visopts=this.vis_.opts_;

  o.color = (o.color==undefined)?visopts.color:o.color;
  o.pos   = (o.pos==undefined)?{x:0,y:0}:o.pos;
  o.size  = (o.size!=undefined)?o.size:{
    w:parseInt(div.style("width")),
    h:parseInt(div.style("height"))};
  o.icon =(o.icon==undefined)?{w:17, h:17}:o.icon;
  o.type= (o.type==undefined)?1:o.type; //vertical
};


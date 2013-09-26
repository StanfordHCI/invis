/* File  : path.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Sat Apr 27 23:39:29 2013
 * Modified: $Id$
 *
 */
function Path(data,node,opts){
  this.d_ = data;
  this.opts_        = (opts==undefined)?newOpts():opts;
  this.strokeWidth_ = 6;
  this.c_           = d3.scale.category10(); //move this into opts

  this.selected_    = false;

  //XXX fix this now using opts obj
	//   this.size_= size==undefined?{w:"100%",h:"100%"}:size;
  //   this.pos_ = pos==undefined?{x:0, y:0}:pos;

  //XXX -- fix it for different possible svg nodes
  this.svgRoot_=(node.property("tagName")=="svg")?node:this.createSvgRoot(node);

  this.create();

}

Path.prototype.create= function(){

  var s = this.opts_.scale;

   var lineFunction= d3.svg.line()
      .x(function(d) { return s.x(d.coord[0]); })
      .y(function(d) { return s.y(d.coord[1]); });
   // .interpolate("linear");

   this.path_ = this.svgRoot_.append("path")
     .attr("d",lineFunction(this.d_))
     .style("stroke-width",this.strokeWidth_)
     .style("stroke","darkseagreen")//this.c_(1))
     .style("fill", "none");
};


//mouse selection
Path.prototype.addMouseClick = function() {

  var thisPath = this;

  this.path_.on("click", function(){
    console.log("selecting the path...");
    thisPath.select(); });
}



//mouse selection
Path.prototype.addPlayButton = function(callback) {

  var pb = d3.select("#play-button"),
      pbm = d3.select("#play-button-music");

	//   this.path_.on("mouseover",function(d,j){
	//     pb.style("visibility", "visible");
	//     pbm.style("visibility", "visible");
	//   })
	//   .on("mousemove", function() {
	//      if(d3.select(this).classed("clicked")==false){
	//      pb.style("top", (event.pageY-25)+"px").style("left",(event.pageX)+"px");
	//      pbm.style("top", (event.pageY-25)+"px").style("left",(event.pageX+15)+"px");
	//      }
	//    })
	//   .on("mouseout",function(){
	//
	//     if(d3.select(this).classed("clicked")==false){
	//       pb.style("visibility", "hidden");
	//       pbm.style("visibility", "hidden");
	//     }
	//   });
  var thisPath = this;
  pb.on("click", function(){
    console.log("playing...");
    callback(thisPath.d_);
  });

}

Path.prototype.createSvgRoot= function(node){

  var o = this.opts_;
  return  node.append("svg")
     .attr("id", "path")
     .attr("width", o.size.w+o.pad.left)
     .attr("height",o.size.h)
     .style("position","absolute")
     .style("left",o.pos.x+"px")
     .style("top",o.pos.y+"px");

}

Path.prototype.hide= function (){
  this.svgRoot_.attr("visibility","hidden")
};

Path.prototype.show= function (){
  this.svgRoot_.attr("visibility","visible");
};


Path.prototype.bringFront= function() {

  var n = this.path_[0][0];
  n.parentNode.appendChild(n);

}

Path.prototype.select = function() {

  this.path_.classed("selected",true)
    .style("stroke","red");
  this.selected_=true;
  this.bringFront();
  d3.event.stopPropagation();

  var pb = d3.select("#play-button"),
      pbm = d3.select("#play-button-music");

  pb.style("visibility", "visible")
    .style("top", (event.pageY-25)+"px").style("left",(event.pageX)+"px");

  pbm.style("visibility", "visible")
    .style("top", (event.pageY-25)+"px").style("left",(event.pageX+15)+"px");

};

Path.prototype.deselect = function (){

  var c = this.c_;
  this.path_.classed("selected", false)
    .style("stroke", "darkseagreen");//c(1));

  this.selected_=false;

  var pb = d3.select("#play-button"),
      pbm = d3.select("#play-button-music");

  pb.style("visibility", "hidden");
  pbm.style("visibility", "hidden");

};

//
// reads data from a file
//
Path.prototype.readData= function (){
//TBI
}


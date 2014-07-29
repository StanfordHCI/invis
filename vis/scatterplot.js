/*
 *
 * File  : scatterplot.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Two dimensional scatterplot rendered using
 *         circles.
 *
 * 	Example:
 *
 * Date    : Sat Apr 27 23:35:05 2013
 * Modified: $Id$
 *
 */
function Scatterplot(data, divnode, svgroot, id, opts) {
  this.divRoot_ = divnode;
  this.svgRoot_ = svgroot;
  this.d_       = data;
  this.opts_    = (opts==undefined)?{}:opts;
  this.setDefaultOpts();
  this.id_=id;
  this.color_=null;

  //append to the doc
  this.create();
}

Scatterplot.prototype.create = function() {
  var o = this.opts_, div = this.divRoot_;

  this.g_ = this.svgRoot_
    .append("g")
    .attr("id", "g"+this.id_)
    .attr("shape-rendering", "optimizeSpeed");

  var thissp=this;
  this.circles_ =this.g_.selectAll(".circle")
    .data(this.d_)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("id", function(d,i){return thissp.id_+"c"+i;})
    .attr("cx", function(d){return o.scale.x(d[0]);})
    .attr("cy", function(d){return o.scale.y(d[1]);})
    .attr("r", o.r)
    .attr("shape-rendering", "optimizeSpeed")
    .style("fill", o.color)
    .style("opacity",0.8)
    .style("stroke", d3.rgb(o.color).darker(2))
    .style("stroke-width", 1);
}

Scatterplot.prototype.svgRoot = function() {
  return this.svgRoot_;
}

Scatterplot.prototype.addTooltip = function(tag) {
  this.tooltip_ = d3.select("body").append("div")
    .attr("class", "scatterplot-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color","#ffa")
    .style("border","1px solid #cc9")
    .style("padding","1px")
    .style("font-size", "10px")
    .style("-mox-box-shadow","2px 2px 11px #666")
    .style("-webkit-box-shadow","2px 2px 11px #666");

  var thisSP = this;
  this.circles_.on("mouseover.tip", function(d,j) {
    thisSP.tooltip_.style("visibility", "visible").text(tag+":"+j);
  })
  .on("mousemove.tip", function() {
    thisSP.tooltip_.style("top", (event.pageY+5)+"px").style("left",(event.pageX+8)+"px");
  })
  .on("mouseout.tip",function(){
    thisSP.tooltip_.style("visibility", "hidden");
  });
}


Scatterplot.prototype.select = function(i) {
  var n = this.circles_[0][i];
  d3.select(n).style("stroke-width",4);
  n.parentNode.appendChild(n);
}

Scatterplot.prototype.highlight = function(d, j, seq) {
  var r = this.opts_.r;
  this.circles_.classed("highlighted", function(dd,i){
    var ret=false;
    if(ret=(seq[i][j]!=d))
      d3.select(this).style("opacity",1/16);
    else
      d3.select(this).style("opacity",1);
  return ret;
  });
};

Scatterplot.prototype.removeHighlight = function () {
  var sp = this;
  this.circles_.classed("highlighted", function(d,i) {
    var node= d3.select(this);
    node.style("opacity", 0.8);
    return false;
  });
};

Scatterplot.prototype.setNodeToDefault = function(node) {
  var o = this.opts_;
  var j = this.id_;
  var c = d3.scale.category10();
  node.attr("r", o.r).style("fill", function(){ return c(j); });
}

//recolor nodes using new indexes in cc (e.g. connected component id)
Scatterplot.prototype.recolor = function(cc) {
  var c  = d3.scale.category10();
  this.circles_.style("fill", function(d,i) {
    return cc[i] == -1 ? "lightgray" : c(cc[i]);
  })
  .style("visibility", function(d,i) {
    return cc[i] == -1 ? "hidden": "visible";
  });
};

//fades nodes in/out
//TODO generalize it to different binary operators
Scatterplot.prototype.fade = function(t, refdist) {
  var f = function(d,i) {
    var node = d3.select(this);
    var oval = d3.select(this).style("opacity");
    if (refdist[i] > t)
      node.style("visibility", "hidden");
    else
      node.style("visibility", "visible");
  }
  this.circles_.each(f)
};

Scatterplot.prototype.hide = function() {
  this.g_.attr("visibility", "hidden");
};

Scatterplot.prototype.show = function() {
  this.g_.attr("visibility", "visible");
};

Scatterplot.prototype.update = function() {};
Scatterplot.prototype.remove = function() {};


Scatterplot.prototype.updateLinkToHeatmap = function(vis, pop) {
  this.vis_ = vis;  //XXX
  this.circles_.on("mouseover.up", function(d,i) {
    vis.update(pop.seqs_[i]);
    vis.updateRowLabels([pop.meta_.name + ":" + i]);
  })
  .on("mouseout.up", function(d,i) {});
}

//XXX fix this
Scatterplot.prototype.linkToHeatmap = function(vis, seq) {
  this.circles_
    .on("mouseover", function(d,i) { vis.highlight(seq[i]); })
    .on("mouseout", function() { vis.removeHighlight(); });
};

// selects the nodes within a given box region e
Scatterplot.prototype.selectRegion = function(ns, e) {
  if (this.g_.attr("visibility") == "hidden") return;
  var sp = this;
  this.circles_.classed("clicked", function(d,i) {
    var f = ((e[0][0] <= d[0]) && (d[0] <= e[1][0])
            && (e[0][1] <= d[1]) && (d[1] <= e[1][1]));

    if (f) {
      d3.select(this).style("stroke-width", 4);
      ns.add({id: sp.id_, indx: i, coord: sp.d_[i]});

       //TODO if a new point selected
       // and a logical operator is
       // active then update the current
       // selection heatmap w/ the result of the
       // operation

       //    ns.and();
       //    sp.vis_.update(ns.result());
       //    sp.vis_.updateRowLabels(["aggregated (AND)"]);
    } else {
      var key = sp.id_ + "" + i;
      ns.remove(key);
      d3.select(this).style("stroke-width", 1);
    }
    return f;
  });
};

// TODO(hammer): Allow points to be deselected on click
Scatterplot.prototype.addMouseClick = function(ns) {
  var sp = this;
  this.circles_.on("click", function(d, i) {
    d3.select(this).classed("clicked", true);
    d3.event.stopPropagation();
    d3.select(this).style("stroke-width", 4);
    ns.add({id: sp.id_, indx: i, coord: sp.d_[i]});
    // if a new point selected
    // and a logical operator is
    // active then update the current
    // selection heatmap w/ the result of the
    // operation
    // 	  if(f) {;
    if((ns.num_ > 0) && (ns.aggregate != null)) {
      ns.aggregate();
      sp.vis_.update(ns.result());
      sp.vis_.updateRowLabels([ns.aggregateLabel_]);
    }
  });
};

Scatterplot.prototype.deselect = function() {
  this.circles_.classed("clicked", function(d,i) {
    d3.select(this).style("stroke-width", 1);
    return false;
  });
}

Scatterplot.prototype.bringFront = function(i) {
  var n = this.circles_[0][i];
  n.parentNode.appendChild(n);
}

Scatterplot.prototype.setDefaultOpts = function() {
  var o = this.opts_;
  var div = this.divRoot_;
  var data = this.d_;

  o.color = (o.color == undefined) ? "red" : o.color;
  o.pos = (o.pos == undefined) ? {x: 0, y: 0} : o.pos;
  o.size = (o.size != undefined) ? o.size: {
    w: parseInt(div.style("width")),
    h: parseInt(div.style("height"))
  };

  o.scale = (o.scale != undefined) ? o.scale: {
    x: d3.scale.linear()
         .domain([d3.min(function(d){return d[0];}),
                  d3.max(data, function(d) { return d[0]; })])
         .range([0, o.size.w]),
    y: d3.scale.linear()
         .domain([d3.min(data, function(d) { return d[1]; }),
                  d3.max(data, function(d) { return d[1]; })])
         .range([0, o.size.h])};

  //circle radius
  o.r = 6;
};

//
// reads data from a file
//
Scatterplot.prototype.readData = function() {};

/*
 *
 * File  : rnaStack.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Creates a stackbar for an rna world stats. 
 *         RNA worlds come with collections of populations 
 *         as well as a reference sequence. 
 *
 * 	Example:
 *
 * Date    : Tue Apr  2 14:53:13 2013
 * Modified: $Id$
 *
 */
function rnaStack(w,divnode,size,pos)
{
  //  ---------
  // | |       |  = 
  // |||       |  
  // ------------ ref 
  // |||       |
  // ||        |  X 
  //  ---------
  this.name_       = w.name_;
  this.leftPad_    = 40;
  var D            = w.stat_;
  var numOfColumns = D.length;

  var t = d3.scale.ordinal()
    .domain(d3.range(0, numOfColumns, 1))
    .rangeBands([0, size.w]);

  //this assumes 4 nucleotide bases and possible gaps: 4+1 = 5 states.  
  var c = d3.scale.ordinal()
    .domain(d3.range(0,5))
    .range(["#ff7a00", "#03899C", "#730055", "#719D00", "#000000"]);

  this.rootSvg_= divnode.append("svg")
    .attr("id", "heatmap")
    .attr("width",size.w+this.leftPad_)
    .attr("height",siz.h)
    .style("position","absolute")
    .style("left", (pos.x-this.leftPad_)+"px");

    this.column_ = this.rootSvg_.selectAll(".col")
      .data(D)
      .enter().append("g")
      .attr("class","col")
      .attr("transform", function(d,i){
        return "translate("+t(i)+",0)";
      })
    .each(col);

    function col(coldata,i)
    {
      var cell = d3.select(this).selectAll(".column")
        .data(function(d){ return d; })
        .enter()
        .append("rect")
        .attr("class", "column")
        .attr("y", function(d,j){return ((j==0?0:bar.h*coldata[j-1])); })
        .attr("width", function(d,j){return t.rangeBand(); })
        .attr("height", function(d,j){return size.h*(j==0?d:d-coldata[j-1]); })
        .style("fill", function(d,j){return c(j); })
        .style("fill-opacity", 0.8)
        .style("stroke", "#fff")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.3)
    }
}


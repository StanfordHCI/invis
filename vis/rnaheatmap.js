/*
 *
 * Creates a heatmap for a given rna population
 *
 */
function rnaHeatmap(prefix)
{
  d3.text("data/"+prefix+"s.txt", function(txtsequence){
    var R = d3.csv.parseRows(txtsequence);
    d3.text("data/"+prefix+".hmp", function(txtarray){

      var D= d3.csv.parseRows(txtarray);
      var colorScale =
      d3.scale.ordinal().domain(d3.range(0,5,1)).range(["#000000", "#ff7a00", "#730055", "#719D00", "#03899C"]);

    var colorScale2 =
      d3.scale.linear().domain(d3.range(0,1,0.1)).range(colorbrewer.Greys[9]);

    var numOfColumns= D[0].length, numOfRows = D.length,
        width  = 1280;

    var t = d3.scale.ordinal().domain(d3.range(0, numOfColumns, 1));
    t.rangeBands([0, width]);

    var cellSize = t.rangeBand();
    var height = numOfRows * cellSize;

    var svg = d3.select("#heatmap").append("svg")
      .attr("width",  width)
      .attr("height", height);

    svg.append("rect")
      .attr("class", "background")
      .attr("width",  width)
      .attr("height", height)
      .style("fille", "#AAA");

    var row = svg.selectAll(".row")
      .data(D)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) {
        return "translate(0," + t(i) + ")";
      })
    .each(row);

    row.append("text")
      .attr("x", -2)
      .attr("y",~~(0.5*t.rangeBand()))
	    .attr("dy",~~(0.5*t.rangeBand()))
      .attr("text-anchor", "end")
      .attr("font-size", 8)
      .text(function(d, i) { return i==0?"reference":i==1?"ratio":"entropy";});

    // stacked bar
    var args = {h:128, w:width, div:"stackbar", y:svg.attr("y")+height, d:prefix};
    rnaStack(args);

    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");


    function row(rowdata,k)
    {
      var cell = d3.select(this).selectAll(".cell")
        .data(function(d){ return d; })
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", function(d,i)   { return t(i); })
        .attr("width", function(d) { return t.rangeBand(); })
        .attr("height", function(d){ return t.rangeBand(); })
        .style("fill", function(d) { return (k==0)?colorScale(d):colorScale2(d); })
        .style("fill-opacity", 0.8)
        .style("stroke", "#fff")
        .style("stroke-width", 1)
        .style("stroke-opacity",0.5)
        .style("shape-rendering", "crisp-edges")
        .on("mouseover", function(d,i) {
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
      }
      );
    }
    });
  });

}

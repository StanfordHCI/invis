invisLayout();

//load the rna world
var rnaworld = new RNAWorld("data/invisdemo.json");

//create views & visualizations for the rna world
var canvas = d3.select("#canvas");
var vis1   = new RNAWorldScatterplot(rnaworld,canvas);
var legend = new Legend(vis1, d3.select("#panel-right"));

//add interactions
legend.addToggleInteraction();

//mouse
vis1.addMouseClick();

//brush
vis1.addBrush();

d3.select("#refseq-button")
  .on("click", function() {
    if (d3.select(this).classed("active")) {
      vis1.hideRefseq();
      d3.select(this).classed("active", false);
    } else {
      d3.select(this).classed("active", true);
      vis1.showRefseq();
    }
  });

d3.select("#path-button")
  .on("click", function() {
    vis1.shortestPath();
  });

//filter
d3.select("#filter")
  .on("change", function(d) {
    d3.select("#filter-label")
      .text("refseq:"+this.value);
    vis1.filter(this.value);
  });

//filter
d3.select("#enet")
  .on("change", function(d) {
                  d3.select("#enet-label").text("enet:" + this.value);
                  vis1.epsilonFilter(this.value);
                });

var aggregateAND = d3.select("#aggregate-and");
var aggregateOR  = d3.select("#aggregate-or");
var  aggregateNOT = d3.select("#aggregate-not");

aggregateAND.on("change", function() { vis1.aggregation(true,"and"); });
aggregateOR.on("change", function() { vis1.aggregation(true,"or"); });


//aggregation
d3.select("#aggregate-reset")
  .on("click", function() {
                 vis1.aggregation(false);
               });

var bp = d3.select("#panel-bottom");
var lp = d3.select("#panel-left");

var opts = newOpts();
opts.pad.left = parseFloat(canvas.style("left"));
opts.size.w = parseFloat(canvas.style("width"));
opts.size.h = 16;

var seq = d3.range(rnaworld.refseq_.length);
var vis2 = new Heatmap(seq, bp, opts);
vis2.addRowLabels([" "]);

var pb = d3.select("#panel-bottom");
var lopts = newOpts();
lopts.pos.x = opts.pad.left+opts.size.w+5;
lopts.pos.y = opts.pos.y;
lopts.size.h = 8 * opts.size.h;
lopts.size.w = parseInt(d3.select("#panel-right").style("width"));
lopts.icon = {w:6, h:16};
lopts.type = 0;

var legend2 = new Legend(vis2, pb, lopts);
legend2.marks_.style("stroke", "none");
legend2.marks_.style("font-size", "4px");
opts.pos.y = 16;

var vis3 = new Heatmap(rnaworld.refseq_, bp, opts);
vis3.addRowLabels(["reference"]);
vis3.linkToScatterplot(vis1);
vis1.updateLinkToHeatmap(vis2);

opts.pos.y = 60;
opts.pos.x = 0;
var vis4 = new RNAWorldStatvis(rnaworld,bp,opts)

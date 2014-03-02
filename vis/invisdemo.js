$(document).ready(function() {
  invisLayout();

  // Shared state
  var rnaworld = new RNAWorld("data/invisdemo.json");
  var canvas = d3.select("#canvas");
  var pb = d3.select("#panel-bottom");
  var pr = d3.select("#panel-right")

  // Vis 1: RNAWorldScatterplot, a 2-dimensional embedding of RNA sequences
  var vis1   = new RNAWorldScatterplot(rnaworld, canvas);
  var legend = new Legend(vis1, pr);

  // Vis 2: Heatmap of moused-over RNA
  var opts = newOpts();
  opts.pad.left = parseFloat(canvas.style("left"));
  opts.size.w = parseFloat(canvas.style("width"));
  opts.size.h = 16;

  var seq = d3.range(rnaworld.refseq_.length);
  var vis2 = new Heatmap(seq, pb, opts);
  vis2.addRowLabels([" "]);

  var lopts = newOpts();
  lopts.pos.x = opts.pad.left+opts.size.w + 5;
  lopts.pos.y = opts.pos.y;
  lopts.size.h = 8 * opts.size.h;
  lopts.size.w = parseInt(pr.style("width"));
  lopts.icon = {w: 6, h: 16};
  lopts.type = 0;

  var legend2 = new Legend(vis2, pb, lopts);
  legend2.marks_.style("stroke", "none");
  legend2.marks_.style("font-size", "4px");

  // Vis 3: Heatmap of reference
  opts.pos.y = 16;
  var vis3 = new Heatmap(rnaworld.refseq_, pb, opts);
  vis3.addRowLabels(["reference"]);

  // Vis 4: RNAPopStackedBar for each experiment
  opts.pos.y = 60;
  opts.pos.x = 0;
  var vis4 = new RNAWorldStatvis(rnaworld, pb, opts)

  /**************
   * INTERACTIONS
  ***************/
  legend.addToggleInteraction();

  vis1.addMouseClick();
  vis1.addBrush();
  vis1.updateLinkToHeatmap(vis2);
  $("button#export").click(function(event) { $("#file-browse").click(); });
  $("#refseq-button").click(function() {
    $(this).hasClass("active") ? vis1.hideRefseq() : vis1.showRefseq();
    $(this).toggleClass("active");
  });
  $("#path-button").click(function() { vis1.shortestPath(); });
  $("#filter").change(function() {
    $("#filter-label").text("refseq:" + this.value);
    vis1.filter(this.value);
  });
  $("#enet").change(function() {
    $("#enet-label").text("enet:" + this.value);
    vis1.epsilonFilter(this.value);
  });
  // TODO(hammer): fix the logic for this form
  $("#aggregate-and").change(function() { vis1.aggregation(true, "and"); });
  $("#aggregate-or").change(function() { vis1.aggregation(true, "or"); });
  $("#aggregate-reset").click(function() { vis1.aggregation(false); });

  vis3.linkToScatterplot(vis1);
});

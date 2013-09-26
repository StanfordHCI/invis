/*
 *
 * File  : rnapopstackedbar.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Wed May  1 01:38:55 2013
 * Modified: $Id$
 *
 */
function RNAPopStackedbar(rnapop, divnode, opts){

  this.d_ = rnapop.stats_;
  this.pop_ = rnapop;
  this.divRoot_=divnode;
  this.opts_ = opts;
  this.create();
}

RNAPopStackedbar.prototype.create = function() {

 var o = this.opts_, div = this.divRoot_, stats= this.d_;

 //rna colors
 var c= undefined;//XXX fix it

 var refbar = newOpts();
 refbar.pos.x = o.pos.x;
 refbar.pos.y = o.pos.y;
 refbar.pad = o.pad;
 refbar.size.h=(o.size.h*0.5);
 refbar.size.w=o.size.w;
 refbar.scale=undefined;
 refbar.color=c;
 this.top_ = new VerticalStackedbar(stats.same,div,refbar);//bottom up

 var pts =[{coord:[refbar.pos.x+refbar.pad.left, refbar.size.h]},
     {coord:[refbar.pos.x+refbar.pad.left+refbar.size.w, refbar.size.h]}];


	// this.addLabel(this.pop_.meta_.name, refbar.pad.left-2, o.pos.y+refbar.size.h);

	 	 this.addLabel(this.pop_.meta_.name, refbar.pad.left-2, 0.75*refbar.size.h);

     var seqbar = newOpts();
     seqbar.pos.y = (o.pos.y+(o.size.h*0.5));
     seqbar.pos.x = o.pos.x;
     seqbar.pad = o.pad;
     seqbar.size.h=30;
     seqbar.size.w=o.size.w;
     seqbar.scale=undefined;
     seqbar.type=1;
     seqbar.color=c;
     this.bottom_= new VerticalStackedbar(stats.diff,div,seqbar);//top-down
};

RNAPopStackedbar.prototype.addLabel = function(label,x,y) {

	// if(this.svgLabel_ == undefined)
	//   this.svgLabel_ = this.divRoot_.append("svg").style("position", "absolute");

  this.top_.svgRoot_.append("text")
    .attr("x", x)
    .attr("y", y)
    .attr("text-anchor", "end")
    .attr("font-size",11)
    .text(label);
}


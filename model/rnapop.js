/*
 *
 * File  : rnapop.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Wed Apr 24 02:01:35 2013
 * Modified: $Id$
 *
 */
function RNAPop(pop)
{
  this.meta_    = pop;
  this.coords_  = [];
  this.seqs_    = [];
  this.refdist_ = [];
  this.enets_   = [];
  this.num_     = -1;
  this.stats_   = {same:{x: null, y: null},diff:{x: null, y: null }};
  this.bbox_    = {};
  this.init();
}




RNAPop.prototype.init = function(){

  this.readInSeqs();
  this.readInCoords();
  this.readInStats();
  this.readInRefdists();
  this.readInEnets();
};

// reads in pop asychronous
RNAPop.prototype.readInSeqs= function(){

  var thisRNAPop = this, meta = this.meta_;

  d3.texts(meta.file, function(text){
    //parse
    thisRNAPop.seqs_ = text.trim().split('\n')
    .map(function(d){ return d.split(',');})
    .map(function(d){ return d.map(function(d){
      return (+d);
    })});
	// thisRNAPop.seqs_=d3.csv.parseRows(text);
	// console.log(thisRNAPop.seqs_.length);
	// console.log(thisRNAPop.seqs_[2].length);

  thisRNAPop.num_ = thisRNAPop.length;
  });

};


// "  coords
RNAPop.prototype.readInCoords= function(){

  var thisRNAPop=this;
  d3.texts(this.meta_.coordsFile, function(text){
    thisRNAPop.coords_=d3.csvs.parseRows(text);

    thisRNAPop.computeBBox(); //now coordinates are ready

  });
};

// " stats

RNAPop.prototype.readInStats= function(){

  var thisRNAPop=this;

  d3.texts(this.meta_.statsFile, function(text){

    //parse
    var  p = text.trim().split('\n')
    .map(function(d){ return d.split(',');})
    .map(function(d){ return d.map(function(d){
      return (+d);
    })});

  var i = ~~(0.5*(p.length));

  thisRNAPop.stats_.same.x=(p.slice(0,1))[0]; // 1d
  thisRNAPop.stats_.same.y=(p.slice(i,i+1))[0];

  thisRNAPop.stats_.diff.x=d3.transpose(p.slice(1,i));
  thisRNAPop.stats_.diff.y=d3.transpose(p.slice(i+1,2*i));

  });
};


// reads in pop asychronous
RNAPop.prototype.readInRefdists= function(){

  var thisRNAPop = this, meta = this.meta_;

  d3.texts(meta.refdist, function(text){

    //parse
    thisRNAPop.refdist_= text.trim().split('\n')
    .map(function(d){ return d.split(',');})
    .map(function(d){ return d.map(function(d){
      return (+d);
    })});
  thisRNAPop.refdist_=thisRNAPop.refdist_[0]; // only 1 row expected

//  thisRNAPop.refdist_=d3.csv.parseRows(text);
  });

};

// reads epsilon nets
RNAPop.prototype.readInEnets= function(){

  var thisRNAPop = this, meta = this.meta_;

	//   console.log(meta.enet);
  d3.texts(meta.enet, function(text){
    //parse
    thisRNAPop.enets_= text.trim().split('\n')
    .map(function(d){ return d.split(',');})
    .map(function(d){ return d.map(function(d){
      return (+d);
    })});

  //thisRNAPop.enets_=d3.csv.parseRows(text);
	//   console.log(thisRNAPop.enets_);

  });

};



// XXX make it into a separate func
// bounding box of the coordinates
RNAPop.prototype.computeBBox= function() {

  var coords = this.coords_, n=this.coords_.length;
  var i=1,
      minX=+coords[0][0],
      maxX=+coords[0][0],
      minY=+coords[0][1],
      maxY=+coords[0][1];

  var x1,x2,y1,y2,m=~~(0.5*n);

	//   console.log(n);

  for(;i<m; i++){

    x1 = +coords[2*i-1][0];
    x2 = +coords[2*i][0];

    if(x1<x2){
      minX= minX>x1?x1:minX;
      maxX= maxX<x2?x2:maxX;
    } else{
      minX= minX>x2?x2:minX;
      maxX= maxX<x1?x1:maxX;
    }

    y1 = +coords[2*i-1][1];
    y2 = +coords[2*i][1];
    if(y1<x2){
      minY= minY>y1?y1:minY;
      maxY= maxY<y2?y2:maxY;
    } else{
      minY= minY>y2?y2:minY;
      maxY= maxY<y1?y1:maxY;
    }

  }

  var x,y;
  if((n*2==m)){
    x=coords[m-1][0], y=coords[m-1][1];
    minX=minX>x?x:minX;
    minY=minY>y?y:minY;
    maxX=maxX<x?x:maxX;
    maxY=maxY<y?y:maxY;
  }

  this.bbox_.minX= minX; //-17; //minX;
  this.bbox_.minY= minY; //-6; //minY;
  this.bbox_.maxX= maxX; //4;
  this.bbox_.maxY= maxY; //14;

	//   console.log(this.bbox_);
};


RNAPop.prototype.hasCoord = function(){
  return (!(this.coords_.length==0));
};


// projects rna data on a given coordinate frame
RNAPop.prototype.projectOnto = function(frame){


  var x,y,i,j,sx,sy,t;
  var num=this.num_,
      seqs=this.seqs_,
      coords=this.coords_,
      dim=frame.e0_.length;

    for(i=0; i< num_; i++){
      s0=0; s1=0;
      for(j=0; j< dim; j++){
        t=(seqs[i][j]-frame.center_[j]);
        s0+=t*frame.e0_[i];
        s1+=t*frame.e1_[i];
      }
      coords[i]=[s0,s1];
    }
};


// projects rna data on a given world
RNAPop.prototype.projectOnto = function(world){

  var frame=world.frame_;
  var ref = world.ref_;
  var x,y,i,j,sx,sy,t;

  if(world.isBinary()){

  for(i=0; i< num_; i++){
    s0=0; s1=0;
    for(j=0; j< frame.e0_.length;j++){

      t=(members_[i][j]!=ref[j])-frame.center_[j];
      s0+=t*frame.e0_[i];
      s1+=t*frame.e1_[i];
    }
    coords_[i]=[s0,s1];
  }

  } else {
    //TODO
  }

};




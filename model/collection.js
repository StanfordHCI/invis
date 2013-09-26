/*
 *
 * File  : collection.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Subset container for sequences (reads) to perform
 *         algebra and statistics on them.
 *
 * Date    : Mon May 13 17:36:37 2013
 * Modified: $Id$
 *
 */
function Collection(pops, ref){

  this.pops_     = pops;
  this.ref_      = ref;
  this.list_     = {};
  this.r_        = [];
  this.r_.length = pops[0].seqs_[0].length;
  this.num_      = 0;
  this.noval_    = 5;
  this.initKey_  = null;

  this.aggregators_ = {
     and:this.and,
      or:this.or,
    nand:this.nand,
     nor:this.nor
  };

}


//initializes the result w/ the first sequence in the set
Collection.prototype.initResult = function () {

  console.log("initializing aggregation register...");

  var list = this.list_;

  for (var key in list)
    if(list.hasOwnProperty(key)) break;

  this.initKey_=key;

  var c = this.list_[key],
      i = c.id,
      j = c.indx,
      s = this.pops_[i].seqs_[j],
    ref = this.ref_
      v = this.noval_;

  for(var k=0; k< s.length; this.r_[k]=((s[k]==ref[k])?v:s[k]),k++);
};


Collection.prototype.remove = function (key) {
 if(this.list_[key]){
   delete(this.list_[key]);
   --this.num_;
 }
 if(this.num_==0) this.initKey_= null;
};

Collection.prototype.removeAll= function () {
  this.list_={};
  this.num_=0;
  this.initKey_= null;
};

Collection.prototype.result= function () {

  return this.r_;

};

Collection.prototype.add = function (s) {

  var r=false, key=s.id+""+s.indx;

  if(!this.list_[key]){

    this.list_[key]=s;
    ++this.num_;
    r =true;
  }

  return r;

};


Collection.prototype.aggregation = function (f, op){

  console.log("setting aggregation to:"+op);

  this.aggregate = f ? this.aggregators_[op] : null;
  this.aggregateLabel_= f ? "aggregated ("+op+")" : null;

};

Collection.prototype.aggregate = null;


Collection.prototype.and = function (){

  console.log("ANDing...");
  var num = this.num_,
      list    = this.list_;

  if (this.initKey_ == null ||
      list[this.initKey_] == undefined) this.initResult();

  if (num < 2) return;

  var r       = this.r_,
      n       = this.r_.length,
      pops    = this.pops_,
      v       = this.noval_,
      initKey = this.initKey_,
      j=0, k=0, key;

  for (var key in list) {

    if (key == initKey) continue;

    if (list.hasOwnProperty(key)) {

      j=list[key].id;
      k=list[key].indx;
      s=pops[j].seqs_[k];

      for(var l=0; l< n; l++)
        r[l]=(r[l] == s[l]?r[l]:v);  //v==5 is encoded w/ white in heatmaps
    }
  }
};


Collection.prototype.or = function () {

  console.log("ORing...");

  var num  = this.num_,
      list = this.list_;


  if (this.initKey_ == null ||
      list[this.initKey_] == undefined) this.initResult();

  if (num < 2) return;

  var r       = this.r_,
      ref     = this.ref_,
      n       = this.r_.length,
      pops    = this.pops_,
      v       = this.noval_,
      list    = this.list_,
      initKey = this.initKey_,
      j=0, k=0, key;

  for (var key in list){

    if (key == initKey) continue;

    if (list.hasOwnProperty(key)) {

      j = list[key].id;
      k = list[key].indx;
      s = pops[j].seqs_[k];

      for(var l=0; l< n; l++)
        r[l]=(ref[l] != s[l])?s[l]:(r[l]==v? v:r[l]);// 5 is enconded w/ white in heatmaps
    }
  }
};

//'not' applies to the current result of collection
Collection.prototype.not= function () {
  /*
  var i=0, n=this.r_.length;
  for (; i<n; ~this.r_[i],i++);
  */
};


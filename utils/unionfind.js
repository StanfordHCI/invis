
/*
 *
 *  Union-find data structure for connected component computation
 *
 */

function UnionFind(N)
{
  this.id_ = new Array(N);
  this.sz_ = new Array(N);
  this.cnt_ = N;

  for (var i = 0; i < N; i++){

    this.id_[i] = i;
    this.sz_[i] = 1;
    this.cnt_ = N;

  }

}


UnionFind.prototype.find = function(i)
{
    while (i != this.id_[i]){
      this.id_[i] = this.id_[this.id_[i]]; // keep the tree flat
      i = this.id_[i];
    }
    return i;
}

UnionFind.prototype.cnt= function()
{
 return this.cnt_;
}

UnionFind.prototype.connected= function(p, q)
{
  return this.find(p) == this.find(q);
}

UnionFind.prototype.union= function(p, q)
{
  var i= this.find(p);
  var j= this.find(q);

	// console.log("i:",i, "j:",j);
  if (i==j) return;

  if(this.sz_[i]< this.sz_[j]){
    this.id_[i]  = j;
    this.sz_[j] += this.sz_[i];
  }else{
    this.id_[j]  = i;
    this.sz_[i] += this.sz_[j];
  }
  --this.cnt_;

}



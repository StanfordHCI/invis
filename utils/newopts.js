/*
 *
 * File  : newopts.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Wed May  1 23:38:26 2013
 * Modified: $Id$
 *
 */
function newOpts(){

  return  {
    scale:
    {
      x: function(x){ return x;},
      y: function(y){ return y;}
    },
    size:
    {
      h:0,
      w:0
    },
    pos:
    {
      x:0,
      y:0
    },
    pad:
    {
      left:0,
      right:0,
      top:0,
      bottom:0
    },
    type:0
  };

  /*
 if(o == undefined) {
   console.log("o is undefined!!!!");
   return opts;
 } else {
   // XXX fix -- check if all opts exist, etc.
   opts.pad = o.pad;
   opts.size= o.size;
   opts.pos = o.pos;
   opts.scale = o.scale;
   opts.type = o.type;
 }
 */
}


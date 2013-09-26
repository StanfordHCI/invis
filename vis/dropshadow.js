/*
 *
 * File  : dropShadow.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Tue May 21 19:18:45 2013
 * Modified: $Id$
 *
 */
function DropShadow(svgroot, id)
{
  this.dropShadow_ = svgroot.append("filter")
   .attr("id", id);
   this.dropShadow_.append("feGaussianBlur")
   .attr("in", "SourceAlpha")
   .attr("stdDeviation", 0.5);
   this.dropShadow_.append("feOffset")
   .attr("dx", 1).attr("dy",1);

   var m=this.dropShadow_.append("feMerge");
   m.append("feMergeNode");
   m.append("feMergeNode")
   .attr("in", "SourceGraphic");

}





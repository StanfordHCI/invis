/*
 *
 * File  : frame.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Two dimensional coordinate frame.
 * 	Example:
 *
 * Date    : Wed Apr 24 02:42:54 2013
 * Modified: $Id$
 *
 */

function Frame(frame)
{
  this.meta_= frame;
  this.e0_=[];
  this.e1_=[];
  this.center_=[];

  this.readIn(frame);

}

//Assumes the coord frame is stored in a txt file
//where the first and second lines are the first
//and second bases, respectively. And third line is
//the center (origin) of the coordinate frame.
Frame.prototype.readIn = function(frame) {

  var thisFrame= this;
  d3.texts(frame.file, function(text){

    var rowarray=  d3.csv.parseRows(text);

    thisFrame.e0_=rowarray[0];
    thisFrame.e1_=rowarray[1];
    thisFrame.center_=rowarray[2];
  });
}


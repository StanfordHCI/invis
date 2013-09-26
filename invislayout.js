/*
 *
 * File  : invislayout.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Sets up the layout of invis
 *
 *
 * 	Example:
 *
 * Date    : Tue Apr 23 22:04:50 2013
 * Modified: $Id$
 *
 */

function invisLayout(){

 //------  workspace --------

  //default full-screen size on macpro notebook
  var width=1440,
      height=900,
      bgColor="#888";

  var workspace =d3.select("#workspace")
    .style("width",width+"px")
    .style("height",height+"px")
    .style("background-color", bgColor);


  //-------  top panel --------
  var panelTopWidth=width,
      panelTopHeight=~~(height/18), //~~ floors towards zero
      bgPanelTop="white";
      //bgPanelTop="#888";

   var panelTop=d3.select("#panel-top")
     .style("width",panelTopWidth+"px")
     .style("height",panelTopHeight+"px")
     .style("background-color",bgPanelTop);



   //-------  left panel --------
   var panelLeftWidth =~~(width/15),
       panelLeftHeight=14*panelTopHeight,
       bgPanelLeft="white";

   var panelLeft=d3.select("#panel-left")
     .style("width",panelLeftWidth+"px")
     .style("height",panelLeftHeight+"px")
     .style("position", "absolute")
     .style("top", (panelTopHeight)+"px")
     .style("background-color",bgPanelLeft);


   //------  canvas ---------
   var canvasWidth = 13*panelLeftWidth,
       canvasHeight = panelLeftHeight,
       bgCanvas = "white";

   var canvas=d3.select("#canvas")
     .style("width",canvasWidth+"px")
     .style("height",canvasHeight+"px")
     .style("position", "absolute")
     .style("left", (panelLeftWidth)+"px")
     .style("top", (panelTopHeight)+"px")
	// 	   .style("-webkit-box-shadow","0 0 30px 5px #999")
     .style("background-color",bgCanvas);

   var bgPanelRight="white";
   //------  right panel--------
   var panelRight=d3.select("#panel-right")
     .style("width",panelLeftWidth+"px")
     .style("height",panelLeftHeight+"px")
     .style("position", "absolute")
     .style("left",(panelLeftWidth+canvasWidth)+"px")
     .style("top", panelTopHeight+"px")
     .style("background-color",bgPanelRight);

   //------  bottom panel ---------
   var panelBottomWidth=panelTopWidth,
       panelBottomHeight=5*panelTopHeight,
       bgPanelBottom = "white";

   var panelTop=d3.select("#panel-bottom")
     .style("width",panelBottomWidth+"px")
     .style("height",panelBottomHeight+"px")
     .style("position", "absolute")
     .style("top", (panelTopHeight+canvasHeight)+"px")
     .style("background-color",bgPanelBottom);

}

/*
 *
 * File  : transpose.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  :
 *
 * 	Example:
 *
 * Date    : Thu May  2 00:20:06 2013
 * Modified: $Id$
 *
 */
function transpose(A)
{

 if (!(A instanceof Array)) return;

 var m=A.length, n=A[0].length;

 if(n == undefined) return;

 var B=[];
 var i=0,j=0;
 for(;i<n; i++){
   var b=[];
   for(;j<m; j++)
     b[j]=A[i][j];
   B[i]=b;
 }
 return B;
}





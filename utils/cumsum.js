/*
 *
 * File  : cumsum.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Row-wise, cumulative sum of 2d array values
 *
 * 	Example:
 *
 * Date    : Sat Apr 27 16:13:51 2013
 * Modified: $Id$
 *
 */
function cumsum(A)
{
  if (!(A instanceof Array)) return;


  var i=1,j=1;
  var m=A.length, n=A[0].length;

  if(n==1){

    if(m==1) return;//1 x 1 array

    //1d array
    for(;i<m; A[i]+=A[i++-1]);

  }else{
	//     console.log("cumsumming a 2d  array" );
	//     console.log(m);
	//     console.log(n);
    for(i=0;i<m;i++)
      for(j=1; j<n; A[i][j]+=A[i][j++-1]); 
  }

  return;
}

/*
 *
 * File  : normalize.js
 * Author: Cagatay Demiralp (cagatay)
 * Desc  : Normalizes each row of an array w/ the max of the
 *         corresponding row.
 *
 * 	Example:;
 *
 * Date    : Sat Apr 27 16:49:38 2013
 * Modified: $Id$
 *
 */
function normalize(A)
{
  if (!(A instanceof Array)) return;

  var i=1,j=1, max=A[0];
  var m=A.length, n=A[0].length;

  console.log(m);
  console.log(n);

  if(n==1){
    if(m==1) return;//1 x 1 array

    //1d array
    for(;i<m; max=(A[i]>max)?A[i]:max,i++);

    if(max!=0)
      for(;i>=0;A[--i]=A[i]/max);
    else
      console.log("cannot normalize with 0!");
  }else{
    //2d array
    for(i=0;i<m;i++){
      max=A[i][0];
      for(j=1;j<n; max=(A[i][j]>max)?A[i][j]:max,j++);
      console.log(max);
      if(max!=0)
        for(--j;j>=0;A[i][j--]/=max);
      else
        console.log("row"+i+":cannot normalize with 0!");
    }
  }
}


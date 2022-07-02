/* This is LIBERTY, a Go program. LIBERTY is descended from Gnugo 1.2,
   written by Man Lung Li and published by the Free Software Foundation.
   Extensive revisions were made by Daniel Bump (bump@math.stanford.edu) 
   resulting in this program LIBERTY.                              

   This program is free software; you can redistribute it and/or modify it
   under the terms of the GNU General Public License as published by the Free
   Software Foundation - version 2.

   This program is distributed in the hope that it will be useful, but WITHOUT
   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
   FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License in
   file COPYING for more details.

   You should have received a copy of the GNU General Public License along
   with this program; if not, write to the Free Software Foundation, Inc., 59
   Temple Place - Suite 330, Boston, MA 02111, USA 
*/

#include <stdio.h>
#include <stdlib.h>
#include "liberty.h"

#define MAXTRY 400

void genmove(int *i,
             int *j)
/* generate computer move */
{
   int ti, tj, tval;
   char a;
   char movename[3];
   int ii, m, n, val;
   int try = 0;
   int stones = 0;

   *i = -1;  *j = -1;  val = -1;

   if (attacker(&ti, &tj, &tval))
       if (tval > val)
	 {
	   asciimov(ti,tj,movename);
	   if (verbose) fprintf(stderr,"Attacker likes %s with value %d\n",movename,tval);
	   val = tval;
	   *i = ti;
	   *j = tj;
	}

/* save any piece if threaten */
   eval(mymove);
   if (defender(&ti, &tj, &tval))
       if ((tval > val)||((tval==val)&&(rand()%2)))
	 {
	   asciimov(ti,tj,movename);
	   if (verbose) fprintf(stderr,"Defender likes %s with value %d\n",movename,tval);
	   val = tval;
	   *i = ti;
	   *j = tj;
	}

/* try match local play pattern for new move */
   if (shapes(&ti, &tj, &tval))
       if ((tval > val)||((tval==val)&&(rand()%2)))
	 {
	   asciimov(ti,tj,movename);
	   if (verbose) fprintf(stderr,"Shape Seer likes %s with value %d\n",movename,tval);
	   val = tval;
	   *i = ti;
	   *j = tj;
	 }

/* modified: play atrandom if stones on board less than 2. (because at small board, human plays tengen at first, liberty will pass. (open region not exist.)) **/
   for (ti = 0; ti < board_size; ti++) {
     for (tj = 0; tj < board_size; tj++) {
       if (p[ti][tj] != EMPTY) {
         stones++;
         if (stones >= 2) {
           /* break all loops **/
           ti = tj = board_size;
         }
       }
     }
   }
   
   if (stones < 2 && board_size > 5) {
     do {
       ti = rand() % (board_size - 4) + 2;
       tj = rand() % (board_size - 4) + 2;
     }
     while (p[ti][tj] != EMPTY);
     tval = 1;
     
     if ((tval > val)||((tval==val)&&(rand()%2))) {
       asciimov(ti, tj, movename);
       if (verbose) fprintf(stderr,"first play likes %s with value %d\n",movename,tval);
       val = tval;
       *i = ti;
       *j = tj;
     }
   }

/* no move found then pass */
   if (val < 0)
     {
       pass++;
       /* fprintf(stderr,"I pass.\n"); */
       printf("\n%s (%s) move : PASS!\n", 
              (mymove == BLACK) ? "black" : "white",
              (mymove == BLACK) ? "X" : "o");
       *i = -1;
     }
   /* find valid move. (copied from GnuGo1.2 genmove()) **/
   else {
      printf("\n%s (%s) move ", 
             (mymove == BLACK) ? "black" : "white",
             (mymove == BLACK) ? "X" : "o");
      
      if (*j < 8)
        a = *j + 65;
      else
        a = *j + 66;
      printf("%c", a);
      ii = board_size - *i;
      if (ii < 10)
        printf("%1d\n", ii);
      else
        printf("%2d\n", ii);
   }
}  /* end genmove */


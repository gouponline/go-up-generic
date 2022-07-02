/*
                 GNUGO - the game of Go (Wei-Chi)
                Version 1.2   last revised 10-31-95
           Copyright (C) Free Software Foundation, Inc.
                      written by Man L. Li
                      modified by Wayne Iba
        modified by Frank Pursel <fpp%minor.UUCP@dragon.com>
                    documented by Bob Webber
*/
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation - version 2.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License in file COPYING for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

Please report any bug/fix, modification, suggestion to

           manli@cs.uh.edu
*/

/*------------------------------------------
  findcolr.c -- Find color of empty location
------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */

unsigned int findcolor(int i,   /* row number 0 to 18 */
                       int j)   /* column number 0 to 18 */
/* find color for empty piece */
{
   int k, result, color[4];

/*
 * return color if all four neighbors are the same or empty
 */

if (p[i][j] != EMPTY) return p[i][j];


/* check North neighbor */
   if (i>0) {  /* The if prevents reading off edge of board. */
     k = i;
     do --k;
     while ((p[k][j] == EMPTY) && (k > 0));
     color[0] = p[k][j];
   }
   else color[0] = p[i][j];

/* check South neighbor */
   
   if (i<sz-1) {
     k = i;
     do ++k;
     while ((p[k][j] == EMPTY) && (k < sz - 1));
     color[1] = p[k][j];
   }
   else color[1] = p[i][j];

/* check West neighbor */
   if (j>0) {
     k = j;
     do --k;
     while ((p[i][k] == EMPTY) && (k > 0));
     color[2] = p[i][k];
   }
   else color[2] = p[i][j];

/* check East neighbor */
   if (j<sz-1) {
     k = j;
     do ++k;
     while ((p[i][k] == EMPTY) && (k < sz - 1));
     color[3] = p[i][k];
   }
   else color[3] = p[i][j];

/* Any nonEMPTY color is what we want */

   for (k=0;k<4;k++) {
     if (color[k] == EMPTY) continue;
        else {
          result = color[k];
          break;
        }
   }

/* We know the right color.  Now cross check it.*/
/* If we find an error then all the dead pieces were not taken 
   from the board and we need to prompt the players to fix this. */

  for (k=0;k<4;k++) {
/* If this next test fails, results are inconsistent.  Problem. */
     if ((color[k] != EMPTY) && (color[k] != result)) return 0;
  }

/* If we get to this point everything checks out OK.  Report results. */

   return result;
}  /* end findcolor */


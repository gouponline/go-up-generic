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
/*-----------------------------------
  matchpat.c -- Match pattern moves
-----------------------------------*/

#include "gnugo.h"
#include "patterns.h"

#define abs(x) ((x) < 0 ? -(x) : (x))
#define line(x) (abs(x - sz/2))

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern int mymove, umove;         /* computer color, opponent color */
extern int lib;                   /* current stone liberty */

int matchpat(int m,     /* row origin */
             int n,     /* column origin */
             int *i,    /* row number of next move */
             int *j,    /* column number of next move */
             int *val)  /* next move value */
/* match pattern and get next move */
{
/* transformation matrice */
 static int trf [8][2][2] = {
   {{1, 0}, {0, 1}},   /* linear transfomation matrix */
   {{1, 0}, {0, -1}},  /* invert */
   {{0, 1}, {-1, 0}},  /* rotate 90 */
   {{0, -1}, {-1, 0}}, /* rotate 90 and invert */
   {{-1, 0}, {0, 1}},  /* flip left */
   {{-1, 0}, {0, -1}}, /* flip left and invert */
   {{0, 1}, {1, 0}},   /* rotate 90 and flip left */
   {{0, -1}, {1, 0}}   /* rotate 90, flip left and invert */
 };
 int k, my, nx, ll, r, cont;
 int ti, tj, tval;

 *i = -1;   *j = -1;   *val = -1;
 for (r = 0; r < PATNO; r++)
/* try each pattern */
    for (ll = 0; ll < pat[r].trfno; ll++)
/* try each orientation transformation */
      {
       k = 0;  cont = 1;
       while ((k != pat[r].patlen) && cont)
/* match each point */
	 {
/* transform pattern real coordinate */
	  nx = n + trf[ll][0][0] * pat[r].patn[k].x
		 + trf[ll][0][1] * pat[r].patn[k].y;
	  my = m + trf[ll][1][0] * pat[r].patn[k].x
		 + trf[ll][1][1] * pat[r].patn[k].y;

/* outside the board */
	  if ((my < 0) || ( my > sz-1) || (nx < 0) || (nx > sz-1))
	    {
	     cont = 0;
	     break;
	   }
	  switch (pat[r].patn[k].att) {
	  case 0 : if (p[my][nx] == EMPTY)	/* open */
		      break;
		   else
		     {
		      cont = 0;
		      break;
		    }
	  case 1 : if (p[my][nx] == umove)  /* your piece */
		      break;
		   else
		     {
		      cont = 0;
		      break;
		    }
	  case 2 : if (p[my][nx] == mymove)  /* my piece */
		      break;
		   else
		     {
		      cont = 0;
		      break;
		    }
	  case 3 : if (p[my][nx] == EMPTY)	/* open for new move */
		    {
		     lib = 0;
		     countlib(my, nx, mymove);	/* check liberty */
		     if (lib > 1)  /* move o.k. */
		       {
			ti = my;
			tj = nx;
			break;
		       }
		     else
		       {
			cont = 0;
			break;
		      }
		     }
		   else
		     {
		      cont = 0;
		      break;
		    }
	  case 4 : if ((p[my][nx] == EMPTY)  /* open on edge */
		       && ((my == 0) || (my == sz-1) || (nx == 0) || (nx == sz-1)))
		      break;
		   else
		     {
		      cont = 0;
		      break;
		    }
	  case 5 : if ((p[my][nx] == umove)  /* your piece on edge */
		       && ((my == 0) || (my == sz-1) || (nx == 0) || (nx == sz-1)))
		      break;
		   else
		     {
		      cont = 0;
		      break;
		    }
	  case 6 : if ((p[my][nx] == mymove)  /* my piece on edge */
		       && ((my == 0) || (my == sz-1) || (nx == 0) || (nx == sz-1)))
		      break;
		   else
		     {
		      cont = 0;
		      break;
		    }
		 }
	  ++k;
	 }
	 if (cont)   /* match pattern */
	   {
	    tval = pat[r].patwt;
	    if ((r >= 8) && (r <= 13))	/* patterns for expand region */
	      {
	       if (line(ti) > sz/2 - 2)  /* penalty on line 1, 2 */ /* 7 in board19 **/
		  tval--;
	       else
		  if ((line(ti) == sz/2 - 3) || (line(ti) == sz/2 - 2))
		     tval++;	/* reward on line 3, 4 */

	       if (line(tj) > sz/2 - 2)  /* penalty on line 1, 2 */
		  tval--;
	       else
		  if ((line(tj) == sz/2 - 3) || (line(tj) == sz/2 - 2))
		     tval++;	/* reward on line 3, 4 */
	     }
	    if (tval > *val)
	      {
	       *val = tval;
	       *i = ti;
	       *j = tj;
	     }
	  }
      }
 if (*val > 0)	/* pattern matched */
    return 1;
 else  /* match failed */
    return 0;
}  /* end matchpat */

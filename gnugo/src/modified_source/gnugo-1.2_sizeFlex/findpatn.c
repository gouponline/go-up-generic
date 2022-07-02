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

/*----------------------------------------------------------------
  findpatn.c -- Find computer move from opening moves and patterns
----------------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern int mymove, umove;         /* computer color, opponent color */
extern int opn[9];   /* opening moves indicator */

int findpatn(int *i,    /* row number of next move */
             int *j,    /* column number of next move */
             int *val)  /* value of next move */
/* find pattern to match for next move */
{
 int m, n;
 int ti, tj, tval;
 static int cnd, mtype;  /* game tree node number, move type */
/* mtype = 0, basic; 1, inverted; 2, reflected; 3, inverted & reflected */
 
 /* calc region boundary from boardsize **/
 int low_edge = 0;                   /* north and west edge :  0 in board19 **/
 int hi_edge  = sz - 1;              /* south and east edge : 18 in board19 **/
 int low_bndry = 5;                  /* north and west boundary :  5 in board19 **/
 int hi_bndry = sz - low_bndry - 1;  /* north and west boundary : 13 in board19 **/

/* open game then occupy corners */
 if (opn[4])   /* continue last move */
   {
    opn[4] = 0;  /* clear flag */
    if (opening(i, j, &cnd, mtype)) opn[4] = 1; /* more move then reset flag */
    if (p[*i][*j] == EMPTY)  /* valid move */
      {
       *val = 80;
       return 1;
     }
    else
      opn[4] = 0;
  }

 if (opn[0])   /* Northwest corner */
   {
    opn[0] = 0;  /* clear flag */
    if (openregion(low_edge, low_edge, low_bndry, low_bndry))
      {
       cnd = 0;
       mtype = 0;
       opening(i, j, &cnd, mtype);  /* get new node for next move */
       if (opening(i, j, &cnd, mtype)) opn[4] = 1;
       *val = 80;
       return 1;
     }
 }

 if (opn[1])   /* Southwest corner */
   {
    opn[1] = 0;
    if (openregion(hi_bndry, low_edge, hi_edge, low_bndry))
      {
       cnd = 0;
       mtype = 1;
       opening(i, j, &cnd, mtype);  /* get new node for next move */
       if (opening(i, j, &cnd, mtype)) opn[4] = 1;
       *val = 80;
       return 1;
     }
  }

 if (opn[2])   /* Northeast corner */
   {
    opn[2] = 0;
    if (openregion(low_edge, hi_bndry, low_bndry, hi_edge))
      {
       cnd = 0;
       mtype = 2;
       opening(i, j, &cnd, mtype);  /* get new node for next move */
       if (opening(i, j, &cnd, mtype)) opn[4] = 1;
       *val = 80;
       return 1;
     }
  }

 if (opn[3])   /* Northeast corner */
   {
    opn[3] = 0;
    if (openregion(hi_bndry, hi_bndry, hi_edge, hi_edge))
      {
       cnd = 0;
       mtype = 3;
       opening(i, j, &cnd, mtype);  /* get new node for next move */
       if (opening(i, j, &cnd, mtype)) opn[4] = 1;
       *val = 80;
       return 1;
     }
  }

 int p1 = low_bndry - 1;     /* ??? :  4 in board19 **/
 int p2 = low_bndry + 1;     /* ??? :  6 in board19 **/
 int p3 = hi_bndry - 2;      /* ??? : 11 in board19 (note: it was wrong because asynmetrical; 12 in board19 is correct?) **/
 int p4 = hi_bndry + 1;      /* ??? : 14 in board19 **/

 int low_star = 3;                   /* north and west star :  3 in board19 **/
 int mid_star = sz / 2;              /* center         star :  9 in board19 **/
 int hi_star = sz - low_star - 1;    /* south and east star : 15 in board19 **/

/* occupy edges */
 if (opn[5])   /* North edge */
   {
    opn[5] = 0;
    if (openregion(low_edge, p2, p1, p3))
      {
       *i = low_star;
       *j = mid_star;
       *val = 80;
       return 1;
     }
  }

 if (opn[6])   /* South edge */
   {
    opn[6] = 0;
    if (openregion(hi_edge, p2, p4, p3))
      {
       *i = hi_star;
       *j = mid_star;
       *val = 80;
       return 1;
     }
  }

 if (opn[7])   /* West edge */
   {
    opn[7] = 0;
    if (openregion(p2, low_edge, p3, p1))
      {
       *i = mid_star;
       *j = low_star;
       *val = 80;
       return 1;
     }
  }

 if (opn[8])   /* East edge */
   {
    opn[8] = 0;
    if (openregion(p2, hi_edge, p3, p4))
      {
       *i = mid_star;
       *j = hi_star;
       *val = 80;
       return 1;
     }
  }

 *i = -1;
 *j = -1;
 *val = -1;

/* find local pattern */
 for (m = 0; m < sz; m++)
   for (n = 0; n < sz; n++)
     if ((p[m][n] == mymove) &&
         (matchpat(m, n, &ti, &tj, &tval) && (tval > *val)))
       {
        *val = tval;
        *i = ti;
        *j = tj;
      }
 if (*val > 0)  /* pattern found */
    return 1;
 else  /* no match found */
    return 0;
}  /* end findpatn */

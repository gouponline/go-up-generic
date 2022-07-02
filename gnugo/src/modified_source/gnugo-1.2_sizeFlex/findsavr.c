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
/*------------------------------------------------------------------
  findsavr.c -- Find computer next move to defend stones from attack
------------------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **l;   /* liberty of current color */
extern int mymove;                /* computer color */

int findsaver(int *i,    /* row number of next move */
              int *j,    /* column number of next move */
              int *val)  /* value of next move */
/* find move if any pieces is threaten */
{
   int m, n, minlib;
   int ti, tj, tval;

   *i = -1;   *j = -1;	 *val = -1;
   for (minlib = 1; minlib < 4; minlib++)
      {
/* count piece with minimum liberty */
       for (m = 0; m < sz; m++)
	 for (n = 0; n < sz; n++)
	   if ((p[m][n] == mymove) && (l[m][n] == minlib))
/* find move to save pieces */
	     {
	      initmark();
	      if (findnextmove(m, n, &ti, &tj, &tval, minlib) && (tval > *val))
		{
		 *val = tval;
		 *i = ti;
		 *j = tj;
	       }
	     }
     }
    if (*val > 0)   /* find move */
       return 1;
    else	    /* move not found */
       return 0;
 }  /* findsaver */

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

/*-------------------------------------------------------
  findopen.c -- Find possible moves from current location
-------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **ma;  /* working matrix for marking */
extern int mik, mjk;  /* location of computer stone captured */

int findopen(int m,      /* current row number 0 to 18 */
             int n,      /* current column number 0 to 18 */
             int i[],    /* row array for possible moves */
             int j[],    /* column array for possible moves */
             int color,  /* BLACK or WHITE */
             int minlib, /* current liberty */
             int *ct)    /* number of possible moves */
/* find all open spaces i, j from m, n */
{
/* mark this one */
 ma[m][n] = 1;

/* check North neighbor */
 if (m != 0)
   {
    if ((p[m - 1][n] == EMPTY) && (((m - 1) != mik) || (n != mjk)))
      {
       i[*ct] = m - 1;
       j[*ct] = n;
       ++*ct;
       if (*ct == minlib) return 1;
     }
    else
      if ((p[m - 1][n] == color) && !ma[m - 1][n])
	 if (findopen(m - 1, n, i, j, color, minlib, ct) && (*ct == minlib))
	    return 1;
  }

/* check South neighbor */
 if (m != sz - 1)
   {
    if ((p[m + 1][n] == EMPTY) && (((m + 1) != mik) || (n != mjk)))
      {
       i[*ct] = m + 1;
       j[*ct] = n;
       ++*ct;
       if (*ct == minlib) return 1;
     }
    else
      if ((p[m + 1][n] == color) && !ma[m + 1][n])
	 if (findopen(m + 1, n, i, j, color, minlib, ct) && (*ct == minlib))
	    return 1;
  }

/* check West neighbor */
 if (n != 0)
   {
    if ((p[m][n - 1] == EMPTY) && ((m != mik) || ((n - 1) != mjk)))
      {
       i[*ct] = m;
       j[*ct] = n - 1;
       ++*ct;
       if (*ct == minlib) return 1;
     }
    else
      if ((p[m][n - 1] == color) && !ma[m][n - 1])
	 if (findopen(m, n - 1, i, j, color, minlib, ct) && (*ct == minlib))
	    return 1;
  }

/* check East neighbor */
 if (n != sz - 1)
   {
    if ((p[m][n + 1] == EMPTY) && ((m != mik) || ((n + 1) != mjk)))
      {
       i[*ct] = m;
       j[*ct] = n + 1;
       ++*ct;
       if (*ct == minlib) return 1;
     }
    else
      if ((p[m][n + 1] == color) && !ma[m][n + 1])
	 if (findopen(m, n + 1, i, j, color, minlib, ct) && (*ct == minlib))
	    return 1;
  }

/* fail to find open space */
 return 0;
}  /* end findopen */

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

/*-----------------------------------------------------------------
  findnext.c -- Find next computer move related to current location
-----------------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **ma;  /* working matrix for marking */
extern int mymove;                /* computer color */
extern int lib;                   /* liberty of current stone */

static int fval(int newlib, int minlib);

int findnextmove(int m,       /* current stone row number */
                 int n,       /* current stone column number */
                 int *i,      /* next move row number */
                 int *j,      /* next move column number */
                 int *val,    /* next move value */
                 int minlib)  /* current stone liberty */
/* find new move i, j from group containing m, n */
 {
  int ti, tj, tval;
  int found = 0;

  *i = -1;   *j = -1;	*val = -1;
/* mark current position */
  ma[m][n] = 1;

/* check North neighbor */
  if (m != 0)
     if (p[m - 1][n] == EMPTY)
      {
       ti = m - 1;
       tj = n;
       lib = 0;
       countlib(ti, tj, mymove);
       tval = fval(lib, minlib);
       found = 1;
      }
     else
       if ((p[m - 1][n] == mymove) && !ma[m - 1][n])
	 if (findnextmove(m - 1, n, &ti, &tj, &tval, minlib))
	    found = 1;

  if (found)
    {
     found = 0;
     if (tval > *val && fioe(ti, tj) != 1)
       {
	*val = tval;
	*i = ti;
	*j = tj;
      }
   }

/* check South neighbor */
  if (m != sz - 1)
     if (p[m + 1][n] == EMPTY)
      {
       ti = m + 1;
       tj = n;
       lib = 0;
       countlib(ti, tj, mymove);
       tval = fval(lib, minlib);
       found = 1;
      }
     else
       if ((p[m + 1][n] == mymove) && !ma[m + 1][n])
	  if (findnextmove(m + 1, n, &ti, &tj, &tval, minlib))
	     found = 1;

  if (found)
    {
     found = 0;
     if (tval > *val && fioe(ti, tj) != 1)
       {
	*val = tval;
	*i = ti;
	*j = tj;
      }
   }

/* check West neighbor */
  if (n != 0)
     if (p[m][n - 1] == EMPTY)
      {
       ti = m;
       tj = n - 1;
       lib = 0;
       countlib(ti, tj, mymove);
       tval = fval(lib, minlib);
       found = 1;
      }
     else
       if ((p[m][n - 1] == mymove) && !ma[m][n - 1])
	  if (findnextmove(m, n - 1, &ti, &tj, &tval, minlib))
	      found = 1;

  if (found)
    {
     found = 0;
     if (tval > *val && fioe(ti, tj) != 1)
       {
	*val = tval;
	*i = ti;
	*j = tj;
      }
   }

/* check East neighbor */
  if (n != sz - 1)
     if (p[m][n + 1] == EMPTY)
      {
       ti = m;
       tj = n + 1;
       lib = 0;
       countlib(ti, tj, mymove);
       tval = fval(lib, minlib);
       found = 1;
      }
     else
       if ((p[m][n + 1] == mymove) && !ma[m][n + 1])
	  if (findnextmove(m, n + 1, &ti, &tj, &tval, minlib))
	      found = 1;

  if (found)
    {
     found = 0;
     if (tval > *val && fioe(ti, tj) != 1)
       {
	*val = tval;
	*i = ti;
	*j = tj;
      }
   }

 if (*val > 0)	/* found next move */
    return 1;
 else	/* next move failed */
    return 0;
}  /* end findnextmove */

int fval(int newlib,   /* new liberty */
         int minlib)   /* current liberty */
/* evaluate function for new move */
{
 int k, val;

 if (newlib <= minlib)
    val = -1;
 else
   {
    k = newlib - minlib;
    val = 40 + (k - 1) * 50 / (minlib * minlib * minlib);
  }
 return val;
}  /* end fval */

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
/*---------------------------------------------------------------
  findwinr.c -- Find computer next move to attack opponent stones
---------------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **l;   /* liberty of current color */
extern int mymove, umove;         /* computer color, opponent color */
extern int lib;                   /* current stone liberty */

int findwinner(int *i,    /* row number of next move */
               int *j,    /* column number of next move */
               int *val)  /* value of next move */
/* find opponent piece to capture or attack */
{
 int m, n, ti[3], tj[3], tval, ct, u, v, lib1;

 *i = -1;   *j = -1;   *val = -1;

/* find opponent with liberty less than four */
 for (m = 0; m < sz; m++)
   for (n = 0; n < sz; n++)
     if ((p[m][n] == umove) && (l[m][n] < 4))
       {
	ct = 0;
	initmark();
	if (findopen(m, n, ti, tj, umove, l[m][n], &ct))
	  {
	   if (l[m][n] == 1)
	     {
	      if (*val < 120)
		{
		 *val = 120;
		 *i = ti[0];
		 *j = tj[0];
	       }
	    }
	   else
	     for (u = 0; u < (int)l[m][n]; u++)
	       for (v = 0; v < (int)l[m][n]; v++)
		  if (u != v)
		    {
		     lib = 0;
		     countlib(ti[u], tj[u], mymove);
		     if (lib > 0) /* valid move */
		       {
                        lib1 = lib;
			p[ti[u]][tj[u]] = mymove;
		    /* look ahead opponent move */
			lib = 0;
			countlib(ti[v], tj[v], umove);
			if ((lib1 == 1) && (lib > 0))
                          tval = 0;
                        else
                          tval = 120 - 20 * lib;
			if (*val < tval)
			  {
			   *val = tval;
			   *i = ti[u];
			   *j = tj[u];
			 }
			p[ti[u]][tj[u]] = EMPTY;
		      }
		   }
	 }
      }
 if (*val > 0)	/* find move */
    return 1;
 else  /* fail to find winner */
    return 0;
}  /* end findwinner */

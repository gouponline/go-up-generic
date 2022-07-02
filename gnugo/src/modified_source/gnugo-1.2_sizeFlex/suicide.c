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
/*----------------------------------------------
  suicide.c -- Check for opponent illegal move
----------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;  /* go board */
extern unsigned char **l;  /* liberty of current color */
extern int mymove, umove;        /* computer color, opponent color */
extern int lib;                  /* current stone liberty */
extern int uik, ujk;             /* location of opponent stone captured */

int suicide(int i,
            int j)
/* check for suicide move of opponent at p[i][j] */
{
 int m, n, k;

/* check liberty of new move */
 lib = 0;
 countlib(i, j, umove);
 if (lib == 0)
/* new move is suicide then check if kill my pieces and Ko possibility */
   {
/* assume alive */
    p[i][j] = umove;

/* check my pieces */
    eval(mymove);
    k = 0;

    for (m = 0; m < sz; m++)
      for (n = 0; n < sz; n++)
/* count pieces will be killed */
	if ((p[m][n] == mymove) && !l[m][n]) ++k;

    if ((k == 0) || (k == 1 && ((i == uik) && (j == ujk))))
/* either no effect on my pieces or an illegal Ko take back */
      {
       p[i][j] = EMPTY;   /* restore to open */
       return 1;
      }
    else
/* good move */
      return 0;
   }
 else
/* valid move */
   return 0;
}  /* end suicide */


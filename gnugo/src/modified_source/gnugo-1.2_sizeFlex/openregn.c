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
/*--------------------------------------------------
  openregn.c -- Check if rectangular region is open
---------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */

int openregion(int i1,
               int j1,
               int i2,
               int j2)
/* check if region from i1, j1 to i2, j2 is open */
{
 int minx, maxx, miny, maxy, x, y;

/* exchange upper and lower limits */

 if (i1 < i2)
   {
    miny = i1;
    maxy = i2;
  }
 else
   {
    miny = i2;
    maxy = i1;
  }

 if (j1 < j2)
   {
    minx = j1;
    maxx = j2;
  }
 else
   {
    minx = j2;
    maxx = j1;
  }

/* check for empty region */
 for (y = miny; y <= maxy; y++)
   for (x = minx; x <= maxx; x++)
     if (p[y][x] != EMPTY) return 0;
 return 1;
}  /* end openregion */

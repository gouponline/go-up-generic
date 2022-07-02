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

/*------------------------------------------------------
  eval.c -- Evaluate liberty of stones in the same color
------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **l;   /* liberty of current color */
extern int lib;                   /* current stone liberty */

void eval(int color)  /* BLACK or WHITE */
/* evaluate liberty of color pieces */
 {
  int i, j;

/* find liberty of each piece */
  for (i = 0; i < sz; i++)
    for (j = 0; j < sz; j++)
      if (p[i][j] == color)
	{
	 lib = 0;
	 countlib(i, j, color);
	 l[i][j] = lib;
      }
}  /* end eval */

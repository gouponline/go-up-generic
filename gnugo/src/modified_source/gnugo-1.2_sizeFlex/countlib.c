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

/*--------------------------------------------
  countlib.c -- Count liberty for single stone
--------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **ml;  /* working matrix for marking */

void countlib(int m,     /* row number 0 to 18 */
              int n,     /* column number 0 to 18 */
              int color) /* BLACK or WHITE */
/* count liberty of color piece at m, n */
{
 int i, j;

/* set all piece as unmarked */
 for (i = 0; i < sz; i++)
   for (j = 0; j < sz; j++)
     ml[i][j] = 1;

/* count liberty of current piece */
 count(m, n, color);
}  /* end countlib */


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

/*-------------------------------------
  count.c -- Count liberty around stone
-------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **ml;  /* working matrix for marking */
extern int lib;                   /* current stone liberty */

void count(int i,     /* row number 0 to 18 */
           int j,     /* column number 0 to 18 */
           int color) /* BLACK or WHITE */
/* count liberty of color piece at location i, j
   and return value in lib */
{
/* set current piece as marked */
 ml[i][j] = EMPTY;

/* check North neighbor */
 if (i != EMPTY)
   {
    if ((p[i - 1][j] == EMPTY) && ml[i - 1][j])
      {
       ++lib;
       ml[i - 1][j] = EMPTY;
     }
    else
       if ((p[i - 1][j] == color) && ml[i - 1][j])
	  count(i - 1, j, color);
  }
/* check South neighbor */
 if (i != sz - 1)
   {
    if ((p[i + 1][j] == EMPTY) && ml[i + 1][j])
      {
       ++lib;
       ml[i + 1][j] = EMPTY;
     }
    else
       if ((p[i + 1][j] == color) && ml[i + 1][j])
	  count(i + 1, j, color);
  }
/* check West neighbor */
 if (j != EMPTY)
   {
    if ((p[i][j - 1] == EMPTY) && ml[i][j - 1])
      {
       ++lib;
       ml[i][j - 1] = EMPTY;
     }
    else
       if ((p[i][j - 1] == color) && ml[i][j - 1])
	  count(i, j - 1, color);
  }
/* check East neighbor */
 if (j != sz - 1)
   {
    if ((p[i][j + 1] == EMPTY) && ml[i][j + 1])
      {
       ++lib;
       ml[i][j + 1] = EMPTY;
     }
    else
       if ((p[i][j + 1] == color) && ml[i][j + 1])
	  count(i, j + 1, color);
  }
}  /* end count */

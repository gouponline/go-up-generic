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
  fioe.c -- Check if current location is own eye
----------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern int mymove;                /* computer color */

int fioe(int i,   /* stone row number 0 to 18 */
         int j)   /* stone column number 0 to 18 */
{
/* check top edge */
 if (i == 0)
   {
    if ((j == 0) && ((p[1][0] == mymove) && (p[0][1] == mymove))) return 1;
    if ((j == sz-1) && ((p[1][sz-1] == mymove) && (p[0][sz-2] == mymove))) return 1;
    if ((p[1][j] == mymove) &&
	((p[0][j - 1] == mymove) && (p[0][j + 1] == mymove))) return 1;
    else
       return 0;
  }
/* check bottom edge */
 if (i == sz-1)
   {
    if ((j == 0) && ((p[sz-2][0] == mymove) && (p[sz-1][1] == mymove))) return 1;
    if ((j == sz-1) && ((p[sz-2][sz-1] == mymove) && (p[sz-1][sz-2] == mymove))) return 1;
    if ((p[sz-2][j] == mymove) &&
	((p[sz-1][j - 1] == mymove) && (p[sz-1][j + 1] == mymove)))
       return 1;
    else
       return 0;
  }
/* check left edge */
 if (j == 0)
    if ((p[i][1] == mymove) &&
	((p[i - 1] [0] == mymove) && (p[i + 1][0] == mymove)))
       return 1;
    else
       return 0;
/* check right edge */
 if (j == sz-1)
    if ((p[i][sz-2] == mymove) &&
	((p[i - 1] [sz-1] == mymove) && (p[i + 1][sz-1] == mymove)))
       return 1;
    else
       return 0;
/* check center pieces */
 if (((p[i][j - 1] == mymove) && (p[i][j + 1] == mymove)) &&
     ((p[i - 1][j] == mymove) && (p[i + 1][j] == mymove)))
    return 1;
 else
    return 0;
}  /* fioe */

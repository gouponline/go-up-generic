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
/*-------------------------------------------
  getij.c -- Get row column from input string
-------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;

int getij(char move[],   /* move string */
          int *i,        /* move row number */
          int *j)        /* move column number */
/* convert string input to i, j coordinate */
{
 int k;

 if ((move[0] >= 'A') && (move[0] <= 'H'))
    *j = move[0] - 'A';
 else
    if ((move[0] >= 'J') && (move[0] <= 'T'))
       *j = move[0] - 'B';
    else
       if ((move[0] >= 'a') && (move[0] <= 'h'))
	  *j = move[0] - 'a';
       else
	  if ((move[0] >= 'j') && (move[0] <= 't'))
	     *j = move[0] - 'b';
	  else
	     return 0;
 k = move[1] - '0';
 if (move[2]) k = k * 10 + move[2] - '0';
 *i = sz - k;
 if ((*i >= 0) && (*i <= sz-1))
    return 1;
 else
    return 0;
}  /* end getij */

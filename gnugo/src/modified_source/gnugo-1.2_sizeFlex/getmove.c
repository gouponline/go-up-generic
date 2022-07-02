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
/*---------------------------------------
  getmove.c -- Get opponent input command
---------------------------------------*/

#include <stdio.h>
#include <string.h>
#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;  /* go board */
extern int mymove, umove;        /* computer color, opponent color */
extern int play;                 /* game state */
extern int pass;                 /* pass indicator */
extern int mk, uk;	         /* piece captured */
extern int opn[9];               /* opening moves indicator */

void getmove(char move[],  /* move string */
             int *i,       /* row number of next move */
             int *j)       /* column number of next move */
/* interpret response of human move to board position */
{
   FILE *fp;
   int m, n;

   if (strcmp(move, "stop") == 0)
/* stop game */
      play = 0;
   else
     {
      if (strcmp(move, "save") == 0)
/* save data and stop game */
	{
	 fp = fopen("gnugo.dat", "w");
/* save board configuration */
	 for (m = 0; m < sz; m++)
	   for (n = 0; n < sz; n++)
	       fprintf(fp, "%c", p[m][n]);
/* my color, pieces captured */
         fprintf(fp, "%d %d %d ", mymove, mk, uk);
/* opening pattern flags */
         for (m = 0; m < 9; m++)
           fprintf(fp, "%d ", opn[m]);

	 fclose(fp);
	 play = -1;
       }
      else
	{
	 if (strcmp(move, "pass") == 0)
/* human pass */
	   {
	    pass++;
	    *i = -1;   /* signal pass */
	  }
	 else
	   {
	    pass = 0;
/* move[0] from A to T, move[1] move[2] from 1 to 19 */
/* convert move to coordinate */
	    if (!getij(move, i, j) || (p[*i][*j] != EMPTY) || suicide(*i, *j))
	      {
	       printf("illegal move !\n");
	       printf("your move? ");
	       scanf("%s", move);
	       getmove(move, i, j);
	     }
	 }
       }
    }
}  /* end getmove */

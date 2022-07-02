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
/*----------------------------------------
  genmove.c -- Generate computer next move
----------------------------------------*/

#include <stdio.h>
#include <stdlib.h>
#include "gnugo.h"

#define MAXTRY 400

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern int mymove, umove;         /* computer color, opponent color */
extern int lib;                   /* current stone liberty */
extern int pass;                  /* pass indicator */

void genmove(int *i,
             int *j)
/* generate computer move */
{
   int ti, tj, tval;
   char a;
   int ii, m, n, val;
   int try = 0;   /* number of try */

/* initialize move and value */
   *i = -1;  *j = -1;  val = -1;

/* re-evaluate liberty of opponent pieces */
   eval(umove);

/* find opponent piece to capture or attack */
   if (findwinner(&ti, &tj, &tval))
       if (tval > val)
	 {
	  val = tval;
	  *i = ti;
	  *j = tj;
	}

/* save any piece if threaten */
   if (findsaver(&ti, &tj, &tval))
       if (tval > val)
	 {
	  val = tval;
	  *i = ti;
	  *j = tj;
	}

/* try match local play pattern for new move */
   if (findpatn(&ti, &tj, &tval))
       if (tval > val)
	 {
	  val = tval;
	  *i = ti;
	  *j = tj;
	}

/* no urgent move then do random move */
   if (val < 0)
       do {
	   *i = rand() % sz;

/* avoid low line  and center region */
	   if ((*i < 2) || (*i > sz-3) || ((*i > 5) && (*i < sz-6)))
	     {
	      *i = rand() % sz;
	      if ((*i < 2) || (*i > sz-3))
                *i = rand() % sz;
	    }

           *j = rand() % sz;

/* avoid low line and center region */
	   if ((*j < 2) || (*j > sz-3) || ((*j > 5) && (*j < sz-6)))
	     {
              *j = rand() % sz;

	      if ((*j < 2) || (*j > sz-3))
                *j = rand() % sz;

	    }
	    lib = 0;
	    countlib(*i, *j, mymove);
       }
/* avoid illegal move, liberty one or suicide, fill in own eye */
       while ((++try < MAXTRY)
	      && ((p[*i][*j] != EMPTY) || (lib < 2) || fioe(*i, *j)));

/* change output format. (similar to gnugo 2.6 ascii mode) **/
   if (try >= MAXTRY)  /* computer pass */
     {
      pass++;
      /* printf("I pass.\n"); **/
      printf("\n%s (%s) move : PASS!\n", 
             (mymove == BLACK) ? "black" : "white",
             (mymove == BLACK) ? "X" : "o");
      *i = -1;
    }
   else   /* find valid move */
     {
      pass = 0;      
      /* printf("my move: "); **/
      printf("\n%s (%s) move ", 
             (mymove == BLACK) ? "black" : "white",
             (mymove == BLACK) ? "X" : "o");
      
      if (*j < 8)
	 a = *j + 65;
      else
	 a = *j + 66;
      printf("%c", a);
      ii = sz - *i;
      if (ii < 10)
	 printf("%1d\n", ii);
      else
	 printf("%2d\n", ii);
    }
}  /* end genmove */

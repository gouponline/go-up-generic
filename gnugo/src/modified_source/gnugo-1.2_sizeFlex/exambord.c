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

/*--------------------------------------------------------------------
  exambord.c -- Examine board liberty for one color and update results
--------------------------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern unsigned char **l;   /* liberty of current color */
extern int mymove;                /* computer color */
extern int mik, mjk;  /* location of computer stone captured */
extern int uik, ujk;  /* location of opponent stone captured */
extern int mk, uk;    /* no. of stones captured by computer and opponent */

void examboard(int color) /* BLACK or WHITE */
/* examine pieces */
{
   int i, j, n;

/* find liberty of each piece */
   eval(color);

/* initialize piece captured */
   if (color == mymove)
     {
      mik = -1;
      mjk = -1;
    }
   else
     {
      uik = -1;
      ujk = -1;
    }
   n = 0; /* The number of captures this move for Ko purposes */

/* remove all piece of zero liberty */
   for (i = 0; i < sz; i++)
     for (j = 0; j < sz; j++)
       if ((p[i][j] == color) && (l[i][j] == 0))
	 {
	  p[i][j] = EMPTY;
/* record piece captured */
	  if (color == mymove)
	    {
	     mik = i;
	     mjk = j;
	     ++mk;
	   }
	  else
	    {
	     uik = i;
	     ujk = j;
	     ++uk;
	   }
	  ++n;  /* increment number of captures on this move */
	}
/* reset to -1 if more than one stone captured since  no Ko possible */
   if (color == mymove && n > 1)
     {
       mik = -1;   
       mjk = -1;
     }
   else if ( n > 1 )
     {
       uik = -1;
       ujk = -1;
     }
}  /* end examboard */

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
/*---------------------------------------------------
  sethand.c -- Set up handicap pieces for black side
----------------------------------------------------*/

#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */

void sethand(int i)
/* set up handicap pieces */
{
 if (i > 0)
   {
    p[3][3] = BLACK;
    if (i > 1)
      {
       p[sz-3-1][sz-3-1] = BLACK;
       if (i > 2)
	 {
	  p[3][sz-3-1] = BLACK;
	  if (i > 3)
	    {
	     p[sz-3-1][3] = BLACK;
	     if (i == 5)
		p[sz/2][sz/2] = BLACK;
	     else
		if (i > 5)
		  {
		   p[sz/2][sz-3-1] = BLACK;
		   p[sz/2][3] = BLACK;
		   if (i == 7)
		      p[sz/2][sz/2] = BLACK;
		   else
		      if (i > 7)
			{
			 p[sz-3-1][sz/2] = BLACK;
			 p[3][sz/2] = BLACK;
			 if (i > 8)
			 p[sz/2][sz/2] = BLACK;
 			 if (i > 9)
 			   {p[2][2] = 2;
 			    if (i > 10)
 			      {p[sz-3][sz-3] = 2;
 			       if (i > 11)
 				 {p[2][sz-3] = 2;
 				  if (i > 12)
 				    {p[sz-3][2] = 2;
 				     if (i > 13)
 				       {p[6][6] = 2;
 					if (i > 14)
 					  {p[sz-3][sz-3] = 2;
 					   if (i > 15)
 					     {p[6][sz-3] = 2;
 					      if (i > 16)
 						p[sz-3][6] = 2;
 					    }
 					 }
 				      }
 				   }
 				}
 			     }
 			  }
		       }
		 }
	   }
	}
     }
  }
}  /* end sethand */

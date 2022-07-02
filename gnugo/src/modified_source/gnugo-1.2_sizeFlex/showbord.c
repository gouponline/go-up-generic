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
/*-------------------------------------------------------------
  showbord.c -- Show current go board and playing information
-------------------------------------------------------------*/

#include <stdio.h>
#include "gnugo.h"

extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern int mymove, umove;         /* computer color, opponent color */
extern int mk, uk;    /* no. of stones captured by computer and oppoent */

void showboard(void)
/* show go board */
{
   int i, j, ii;

/* p = 0 for empty ,p = 1 for white piece, p = 2 for black piece */
   printf("   A B C D E F G H J K L M N O P Q R S T\n");
/* row 19 to 17 */
/* for simplify, logic for drawing stars are omitted. **/
   for (i = 0; i < sz; i++)
     {
      ii = sz - i;
      printf("%2d",ii);

      for (j = 0; j < sz; j++)
	if (p[i][j] == EMPTY)
	   printf(" -");
	else if (p[i][j] == WHITE)
		printf(" O");
	     else printf(" X");

      printf("%2d",ii);
      printf("\n");
     }
/* for simplify, logic for drawing stars are omitted. **/
#if 0
/* row 16 */
   printf("16");

   for (j = 0; j < 3; j++)
     if (p[3][j] == EMPTY)
	printf(" -");
     else if (p[3][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[3][3] == 0)
      printf(" +");
   else if (p[3][3] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 4; j < 9; j++)
     if (p[3][j] == EMPTY)
	printf(" -");
     else if (p[3][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[3][9] == EMPTY)
      printf(" +");
   else if (p[3][9] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 10; j < 15; j++)
     if (p[3][j] == EMPTY)
	printf(" -");
     else if (p[3][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[3][15] == EMPTY)
      printf(" +");
   else if (p[3][15] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 16; j < 19; j++)
     if (p[3][j] == EMPTY)
	printf(" -");
     else if (p[3][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   printf("16");
   if (umove == 1)
      printf("     Your color: White O\n");
   else
      if (umove == 2)
	 printf("     Your color: Black X\n");
      else
	 printf("\n");
/* row 15 to 11 */
   for (i = 4; i < 9; i++)
     {
      ii = 19 - i;
      printf("%2d",ii);

      for (j = 0; j < 19; j++)
	if (p[i][j] == EMPTY)
	   printf(" -");
	else if (p[i][j] == WHITE)
		printf(" O");
	     else printf(" X");

      printf("%2d",ii);
      if (i == 4)
	{
	 if (mymove == 1)
	    printf("     My color:   White O\n");
	 else
	    if (mymove == 2)
	       printf("     My color:   Black X\n");
	    else
	       printf("\n");
       }
      else
	 if (i != 8)
	    printf("\n");
	 else
	    printf("     You have captured %d pieces\n", mk);
     }
/* row 10 */
   printf("10");

   for (j = 0; j < 3; j++)
     if (p[9][j] == EMPTY)
	printf(" -");
     else if (p[9][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[9][3] == EMPTY)
      printf(" +");
   else if (p[9][3] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 4; j < 9; j++)
     if (p[9][j] == EMPTY)
	printf(" -");
     else if (p[9][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[9][9] == EMPTY)
      printf(" +");
   else if (p[9][9] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 10; j < 15; j++)
     if (p[9][j] == EMPTY)
	printf(" -");
     else if (p[9][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[9][15] == EMPTY)
      printf(" +");
   else if (p[9][15] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 16; j < 19; j++)
     if (p[9][j] == EMPTY)
	printf(" -");
     else if (p[9][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   printf("10");
   printf("     I have captured %d pieces\n", uk);
/* row 9 to 5 */
   for (i = 10; i < 15; i++)
     {
      ii = 19 - i;
      printf("%2d",ii);

      for (j = 0; j < 19; j++)
	if (p[i][j] == EMPTY)
	   printf(" -");
	else if (p[i][j] == WHITE)
		printf(" O");
	     else printf(" X");

      printf("%2d",ii);
      printf("\n");
     }
/* row 4 */
   printf(" 4");

   for (j = 0; j < 3; j++)
     if (p[15][j] == EMPTY)
	printf(" -");
     else if (p[15][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[15][3] == EMPTY)
      printf(" +");
   else if (p[15][3] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 4; j < 9; j++)
     if (p[15][j] == EMPTY)
	printf(" -");
     else if (p[15][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[15][9] == EMPTY)
      printf(" +");
   else if (p[15][9] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 10; j < 15; j++)
     if (p[15][j] == EMPTY)
	printf(" -");
     else if (p[15][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   if (p[15][15] == EMPTY)
      printf(" +");
   else if (p[15][15] == WHITE)
	   printf(" O");
	else printf(" X");

   for (j = 16; j < 19; j++)
     if (p[15][j] == EMPTY)
	printf(" -");
     else if (p[15][j] == WHITE)
	     printf(" O");
	  else printf(" X");

   printf(" 4");
   printf("\n");
/* row 3 to 1 */
   for (i = 16; i < 19; i++)
     {
      ii = 19 - i;
      printf("%2d",ii);

      for (j = 0; j < 19; j++)
	if (p[i][j] == EMPTY)
	   printf(" -");
	else if (p[i][j] == WHITE)
		printf(" O");
	     else printf(" X");

      printf("%2d",ii);
      printf("\n");
     }
#endif
   printf("   A B C D E F G H J K L M N O P Q R S T\n\n");
 }  /* end showboard */

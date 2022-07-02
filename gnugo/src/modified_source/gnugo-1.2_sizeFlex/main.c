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
/*------------------------------
  main.c -- gnugo main program
------------------------------*/

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "gnugo.h"

unsigned int sz = 9;  /* board size **/

unsigned char **p;  /* go board */
unsigned char **l;  /* liberty of current color */
unsigned char **ma; /* working matrix for marking */
unsigned char **ml; /* working matrix for marking */
int mymove, umove;        /* computer color, opponent color */
int lib;                  /* current stone liberty */
int play;                 /* game state */
int pass;                 /* pass indicator */
int mik, mjk;             /* location of computer stone captured */
int uik, ujk;             /* location of opponent stone captured */
int mk, uk;               /* no. of stones captured by computer and oppoent */
int opn[9];               /* opening pattern flag */

static int load_sgf(char *file, char *untilstr);

/* allocate arrays dynamic **/
void allocateArrays(int size) {
  int i;

  p = (unsigned char **)calloc(size, sizeof(char*));
  l = (unsigned char **)calloc(size, sizeof(char*));
  ma = (unsigned char **)calloc(size, sizeof(char*));
  ml = (unsigned char **)calloc(size, sizeof(char*));
  for (i = 0; i < size; i++) {
    p[i] = (unsigned char *)calloc(size, sizeof(char));
    l[i] = (unsigned char *)calloc(size, sizeof(char));
    ma[i] = (unsigned char *)calloc(size, sizeof(char));
    ml[i] = (unsigned char *)calloc(size, sizeof(char));
  }
  
  return;
}

int main(int argc,
         char *argv[])
  {
   FILE *fp;
   int i, j;
   char move[10], ans[5];
   int cont = 0;
   int contSgf = 0;  /* flag : continue from sgf **/
   time_t tm;
   
   /* allocate arrays dynamic **/
   allocateArrays(sz);

/* show instruction */ /* only if arguments are not supplied **/
   if (argc == 1)
     showinst();

   if ((fp = fopen("gnugo.dat", "r")) != NULL)  /* continue old game */
     {
      cont = 1;

/* read board configuration */
      for (i = 0; i < sz; i++)
        for (j = 0; j < sz; j++)
          fscanf(fp, "%c", &p[i][j]);

/* read my color, pieces captured */
      fscanf(fp, "%d %d %d ", &mymove, &mk, &uk);
/* read opening pattern flags */
      for (i = 0; i < 9; i++)
        fscanf(fp, "%d ", &opn[i]);

      fclose(fp);
      umove = 3 - mymove;

/* delete file */
      remove("gnugo.dat");
    }
   /* read SGF file (option -l) **/
   else if (argc == 3 && strcmp(argv[1], "-l") == 0) {
     /* at first pass, read mymove. **/
     mymove = load_sgf(argv[2], NULL);
     umove = 3 - mymove;
     
     /* reset game state. (because at first pass, mymove/umove value was wrong, so game state is also wrong.) **/
     mk = 0;  uk = 0;
     play = 1;
     pass = 0;
     mik = -1; mjk = -1;
     uik = -1; ujk = -1;
     srand((unsigned)time(&tm));  /* start random number seed */
     
     /* second pass, read and set game state **/
     load_sgf(argv[2], NULL);
     
     contSgf = 1;
   }
   else
     {
/* init opening pattern numbers to search */
      for (i = 0; i < 9; i++)
        opn[i] = 1;
      opn[4] = 0;

/* init board */
      for (i = 0; i < sz; i++)
        for (j = 0; j < sz; j++)
          p[i][j] = EMPTY;
/* init global variables */
      mk = 0;  uk = 0;
    }

/* init global variables */ /* if not continue from sgf. **/
   if (!contSgf) {
     play = 1;
     pass = 0;
     mik = -1; mjk = -1;
     uik = -1; ujk = -1;
     srand((unsigned)time(&tm));	/* start random number seed */
   }

   if (!cont && !contSgf)  /* new game */
     {
/* ask for handicap */
      printf("Number of handicap for black (0 to 17)? ");
      scanf("%d", &i);
      getchar();
      sethand(i);

/* display game board */
      showboard();

/* choose color */
      printf("\nChoose side(b or w)? ");
      scanf("%c",ans);
      if (ans[0] == 'b')
        {
         mymove = 1;   /* computer white */
         umove = 2;   /* human black */
         if (i)
	   {
            genmove(&i, &j);   /* computer move */
            p[i][j] = mymove;
          }
       }
      else
        {
         mymove = 2;   /* computer black */
         umove = 1;   /* human white */
         if (i == 0)
	   {
            genmove(&i, &j);   /* computer move */
            p[i][j] = mymove;
          }
       }
    }

   /* if sgf was suplied (option -l), 
      gnugo returns next move, and quit. **/
   if (contSgf) {
     genmove(&i, &j);   /* computer move */
     return;
   }

   showboard();

/* main loop */
   while (play > 0)
     {
      printf("your move? ");
      scanf("%s", move);
      getmove(move, &i, &j);   /* read human move */
      if (play > 0)
	{
	 if (i >= 0)   /* not pass */
	   {
	    p[i][j] = umove;
	    examboard(mymove);	 /* remove my dead pieces */
	  }
	 if (pass != 2)
	   {
	    genmove(&i, &j);   /* computer move */
	    if (i >= 0)   /* not pass */
	      {
	       p[i][j] = mymove;
	       examboard(umove);   /* remove your dead pieces */
	     }
	  }
	 showboard();
       }
      if (pass == 2) play = 0;	/* both pass then stop game */
    }

 if (play == 0)
   {
/* finish game and count pieces */
    getchar();
    printf("Do you want to count score (y or n)? ");
    scanf("%c",ans);
    if (ans[0] == 'y') endgame();
  }

 return 0;
 }  /* end main */


/* === Below section copied from gnugo 2.0 =================================== **/

#define OTHER_COLOR(color)  (WHITE+BLACK-(color))


/* load an sgf file
 * sgf file is a sequence of  <;>CMD[param]
 * where interesting commands are
 *   ;W[xx] : white move at xx - x=a-s, or tt=pass
 *   ;B[xx] : black move at xx
 *   AB[xx][yy][zz]....  add black stones
 *   AW[xx][yy][zz]....  add white stones
 *   HA[n]               handicap
 *   SZ[n]               board size
 *   
 */

/* returns color of next move : BLACK or WHITE
 * file is the filename. until is an optional string of the form
 * either 'L12' or '120' which tells it to stop loading at that move
 * or move-number - when debugging, this
 * will be a particularly bad move, and we want to know why
 */

/* modification: commented out DEBUG() function call. **/
/* modification: declare gnugo 2.0 global variables **/
/* modification: update gnugo 1.2 global variables (sz, p[][], etc.) **/
/* modification: support PASS expression like B[]/W[] (cf: B[tt]/W[tt]) **/
/* modification: commented out sgf_move_made() function call. (for -o option) **/

static int load_sgf(char *file, char *untilstr)
{
  /* use a simple state engine : 

  * 0=skipping junk, looking for ';' or 'H'
  * 1=seen ';'  - looking for A or B/W.  A=>stays in state 1
  * 2=seen B/W, looking for [
  * 3=skip until ], then return to 1  (eg for PW, see P, skip to the ],  then state 1)
  * 4=seen 'H', looking for A
  * 5=seen 'S', looking for Z
  */

  int state=0;
  int nextstate=0;  /* if we see AB[], we need to return to state 1, else state 0 */
  int color=0;
  int c,n,m;

  int untilm = -1, untiln = -1;
  int until = 9999;
  
  /* declare gnugo 2.0 global variables **/
  int board_size = sz;       /* board size */
  int movenum;               /* movenumber */
  FILE *sgfout;  /* NULL, or file handle of sgf output file */ /* always NULL. **/


  FILE *input = fopen(file, "r");
  if (!input)
  {
    perror("Cannot open sgf file");
    exit(1);
  }

reparse_untilstr:

  if (untilstr)
  {
    if (*untilstr > '0' && *untilstr <= '9')
    {
      until = atoi(untilstr);
      /* DEBUG(DEBUG_LOADSGF, "Loading until move %d\n", until); **/
    }
    else
    {
      untiln = *untilstr - 'A';
      if (*untilstr >= 'I')
	--untiln;

      untilm = board_size - atoi(untilstr+1);
      /* DEBUG(DEBUG_LOADSGF,"Loading until move at %d,%d (%m)\n", untilm, untiln, untilm, untiln); **/
    }
  }


  while (((c=getc(input))!=EOF)) {

    switch (state) {
    case 0:
      if (c==';') state=1;
      if (c=='H') state=4;
      if (c=='S') state=5;
      break;

    case 1:
        if (c=='P' || c=='C' || c=='G' || c == 'H' || c=='F' || c=='S' || c=='K' || c=='D' || c=='T') state=3;
	else if (c=='A') nextstate=1;
	else if ((c=='B')||(c=='W')) {
	  if (c=='B') color=BLACK;
	  if (c=='W') color=WHITE;
	  state=2;
	}
	break;

    case 2:
      if (c=='L') state=0;
      else if (c=='[') {
	n=getc(input)-'a';
	m=getc(input)-'a';
	
	/* modification: support PASS expression like B[];/W[]; (cf: B[tt]/W[tt]) **/
	if (n == ']' - 'a') {
	  ungetc(m + 'a', input);
	  ungetc(n + 'a', input);
	  n = sz;
	  m = sz;
	  examboard(OTHER_COLOR(color));
	}

	/* DEBUG(DEBUG_LOADSGF,"load_sgf : Adding [%c%c]=%m\n", 'a'+n, 'a'+m, m,n); **/

	if (movenum == until || (m == untilm && n == untiln))
	{
	  /* DEBUG(DEBUG_LOADSGF, "Move specified by -L reached\n"); **/
	  fclose(input);
	  return color;
	}

	if (n<board_size && m<board_size)
	{
	  /* commented out sgf_move_made() function call. (for -o option) **/
	  /* sgf_move_made(m, n, color, 0); **/ /* in case we are recording with -o */ 
	  
	  /* updateboard(m, n, color); **/
	  p[m][n] = color;
	  examboard(OTHER_COLOR(color));
	}

	movenum++;
	state=nextstate;
	nextstate=0;
      }
      else {
	fprintf(stderr,"analyze: error parsing sgf file - state=2, (c='%c'\n", c);
	exit(1);
      }
      break;

    case 3:
      if (c == ']') state=1;
      else state=0;
      break;

    case 4:
      if (c == 'A') {
	if ((c=getc(input)) != '[') {
	  fprintf(stderr,"error parsing sgf file - state = 4, c='%c'\n", c);
	  abort();
	}
	n=getc(input)-'0'; /* handicap game */
	/* DEBUG(DEBUG_LOADSGF,"load_sgf : Handicap %d\n", n); **/
	sethand(n);
	if (sgfout) fprintf(sgfout,"HA[%d]",n);
      }
      state=0;
      break;

    case 5:
      if (c == 'Z') {
	if ((c=getc(input)) != '[') {
	  fprintf(stderr,"error parsing sgf file - state = 4, c='%c'\n", c);
	  abort();
	}
	n=getc(input)-'0';
	if (n==1)
	  n=10+getc(input)-'0';
	board_size=n;
	sz = n;
	
	/* re-allocate arrays dynamic **/
	allocateArrays(sz);

	/* DEBUG(DEBUG_LOADSGF,"load_sgf : Board size %d\n", n); **/
	if (sgfout) fprintf(sgfout,"SZ[%d]",n);
	/* an "until" move was parsed assuming board size 19. Reparse */
	goto reparse_untilstr;  /* crude, but effective ! */
      }
      state=0;
      break;
    }
  }

  /* DEBUG(DEBUG_LOADSGF, "\n\n\nEnd of load_sgf\n\n\n"); **/

  fclose(input);

  return OTHER_COLOR(color);
}







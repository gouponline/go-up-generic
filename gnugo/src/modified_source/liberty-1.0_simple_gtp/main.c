/* This is LIBERTY, a Go program. LIBERTY is descended from Gnugo 1.2,
   written by Man Lung Li and published by the Free Software Foundation.
   Revisions were made by Daniel Bump (bump@math.stanford.edu) resulting 
   in this program LIBERTY.

   This program is free software; you can redistribute it and/or modify it
   under the terms of the GNU General Public License as published by the Free
   Software Foundation - version 2.

   This program is distributed in the hope that it will be useful, but WITHOUT
   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
   FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License in
   file COPYING for more details.

   You should have received a copy of the GNU General Public License along
   with this program; if not, write to the Free Software Foundation, Inc., 59
   Temple Place - Suite 330, Boston, MA 02111, USA */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "liberty.h"
#include "gmp.h"
#include "interface.h"

static int load_sgf(char *file, char *untilstr);

int main(int argc,
         char *argv[])
  {
   FILE *fp;
   Gmp  *ge;
   int i, j, m, n;
   char move[10], ans[5];
   time_t tm;
   int seed;
   GmpResult  message;
   const char  *error;
   char movename[3];

   int contSgf = 0;  /* flag : continue from sgf **/

   verbose=0;  /* change this to 0 to turn off the yakkity-yak */
   showstack=0;

/* turn off message. **/
#if 0
   fprintf(stderr, "\n\
\n\
                   This is LIBERTY, a Go program\n\
\n\
  Gnugo 1.2 was written by Man Li (manli@cs.uh.edu) and copyrighted\n\
  by the Free Software Foundation. Extensive changes have been made\n\
  by Daniel Bump (bump@math.stanford.edu) resulting in this program\n\
  LIBERTY.\n\
\n\
  This program has ABSOLUTELY NO WARRANTY.  See COPYING for detail.  \n\
  This is free software and you are welcome to redistribute it; see \n\
  COPYING for copying conditions. \n\
\n\
");
#endif

#if 0
   ge = gmp_create(0, 1);
   gmp_startGame(ge, -1, -1, 5.5, -1, -1);
   do  {
     message = gmp_check(ge, 1, NULL, NULL, &error);
   } while ((message == gmp_nothing) || (message == gmp_reset));
   if (message == gmp_err)  {
     fprintf(stderr, "gnugo-gmp: Error \"%s\" occurred.\n", error);
     exit(1);
   } else if (message != gmp_newGame)  {
     fprintf(stderr, "gnugo-gmp: Expecting a newGame, got %s\n",
	     gmp_resultString(message));
     exit(1);
   }
#endif

/* init opening pattern numbers to search */

   for (i = 0; i < 9; i++)
     opn[i] = 1;
   opn[4] = 0;

   /* read SGF file (option -l) **/
   if (argc == 3 && strcmp(argv[1], "-l") == 0) {
     /* at first pass, read mymove. **/
     mymove = load_sgf(argv[2], NULL);
     umove = OTHER_COLOR(mymove);
     
     /* reset game state. (because at first pass, mymove/umove value was wrong, so game state is also wrong.) **/
     for (i = 0; i < board_size; i++)
       for (j = 0; j < board_size; j++)
         p[i][j] = EMPTY;
     mk = 0;  uk = 0;
     play = 1;
     pass = 0;
     mik = -1; mjk = -1;
     uik = -1; ujk = -1;
     srand(time (0));  /* start random number seed */
     
     /* second pass, read and set game state **/
     load_sgf(argv[2], NULL);
     
     contSgf = 1;
   }
   else {
  /* init board */
     for (i = 0; i < board_size; i++)
       for (j = 0; j < board_size; j++)
         p[i][j] = EMPTY;
  /* init global variables */
     mk = 0;  uk = 0;
  
  
  /* init global variables */
     play = 1;
     pass = 0;
     mik = -1; mjk = -1;
     uik = -1; ujk = -1;
  
     board_size = DEFAULT_BOARD_SIZE;
  
  /* start random number seed */
     srand(time (0));
   }

   /* if sgf was suplied (option -l), 
      gnugo returns next move, and quit. **/
   if (contSgf) {
     genmove(&i, &j);   /* computer move */
     return;
   }

   play_gtp();
   return 0;

   i=gmp_handicap(ge);
   if (verbose) fprintf(stderr,"handicap=%d\n",i);
   sethand(i);
   if (gmp_iAmWhite(ge))
     {
       mymove = 1;   /* computer white */
       umove = 2;   /* human black */
       if (i)
	 {
	   genmove(&i, &j); 
	   gmp_sendMove(ge, j, i);
	   
	   p[i][j] = mymove;
	   asciimov(i,j,movename);
	   if (verbose)
	     fprintf(stderr,"\nmy move: %s\n\n",movename);
	 }
     }
   else
     {
       mymove = 2;   /* computer black */
       umove = 1;   /* human white */
       if (i == 0)
	 {
	   genmove(&i, &j); 
	   gmp_sendMove(ge, j, i);
	   p[i][j] = mymove;
	   asciimov(i,j,movename);
	   if (verbose)
	     fprintf(stderr,"\nmy move: %s\n\n",movename);
	 }
     }
   
   if (verbose) showboard(); /* display board after computer's move  only */

/* main loop */
   while (play > 0)
     {
       for (m=0;m<board_size;m++)
	 for (n=0;n<board_size;n++)
	   plast[m][n][mymove-1]=p[m][n];   /* save position to recognize ko */
       
       message = gmp_check(ge, 1, &j, &i, &error);
       
       if (play > 0)
	 {
	   if (message!=gmp_pass)   /* not pass */
	     {
	       asciimov(i,j,movename);
	       if (verbose) 
		     fprintf(stderr,"\nyour move: %s\n\n",movename);
	       p[i][j] = umove;
	       examboard(mymove);	 /* remove my dead pieces */
	       if (verbose) showboard(); /* display board after opponent's move*/
	     }
	   if (pass != 2)
	     {
	       genmove(&i, &j);  
	       
	       if (i >= 0)   /* not pass */
		 {
		   for (m=0;m<board_size;m++)
		     for (n=0;n<board_size;n++)
		       plast[m][n][umove-1]=p[m][n];   /* save position to recognize ko */
		   gmp_sendMove(ge, j, i);
		   p[i][j] = mymove;
		   asciimov(i,j,movename);
		   if (verbose)
		     fprintf(stderr,"\nmy move: %s\n\n",movename);
		   examboard(umove);   /* remove your dead pieces */
		 } else {
		   gmp_sendPass(ge);   /* pass */
		 }
	     }
	   showboard();
	 }
       if (pass == 2) {
	 play = 0;	/* both pass then stop game */
	 gmp_sendPass(ge);   /* pass  */
	 message = gmp_check(ge, 1, &j, &i, &error);
	 gmp_sendPass(ge);   /* pass again */
       }
     }
   fprintf(stderr,"Thank you for the game!\n");
   return 0;
  }  /* end main */

/* === Below section copied from gnugo 2.0 =================================== **/

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
  int c,n,m,nn,mm;

  int untilm = -1, untiln = -1;
  int until = 9999;
  
  /* declare gnugo 2.0 global variables **/
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
	  n = board_size;
	  m = board_size;
	  examboard(OTHER_COLOR(color));
          for (mm=0;mm<board_size;mm++)
            for (nn=0;nn<board_size;nn++)
              plast[mm][nn][color-1]=p[mm][nn];   /* save position to recognize ko */
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
          for (mm=0;mm<board_size;mm++)
            for (nn=0;nn<board_size;nn++)
              plast[mm][nn][color-1]=p[mm][nn];   /* save position to recognize ko */
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



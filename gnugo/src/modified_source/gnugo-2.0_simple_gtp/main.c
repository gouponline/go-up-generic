/* This is GNU GO 2.0, a Go program. GNU GO 2.0 is descended from GNU GO 1.2,
   written by Man Lung Li and published by the Free Software Foundation.
   Authors of GNU Go 2.0 are Daniel Bump (bump@math.stanford.edu) and
   David Denholm (daved@ctxuk.citrix.com). 

   Copyright 1999 by the Free Software Foundation.

   This program is free software; you can redistribute it and/or modify it
   under the terms of the GNU General Public License as published by the Free
   Software Foundation - version 2.

   This program is distributed in the hope that it will be useful, but WITHOUT
   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
   FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License in
   file COPYING for more details.

   You should have received a copy of the GNU General Public License along
   with this program; if not, write to the Free Software Foundation, Inc., 59
   Temple Place - Suite 330, Boston, MA 02111, USA 
*/

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <unistd.h>
#include <time.h>
#include <signal.h>

#include "liberty.h"
#include "patterns.h"
#include "gmp.h"
#include "interface.h"

#define USAGE "\n\
Usage : gnugo [-opts]\n\
  options : -a = test all patterns\n\
            -v = print version number\n\
            -t = verbose tracing (use twice or more to trace reading)\n\
            -T = show board each move\n\
            -d [level] = debugging output (see liberty.h for bits)\n\
            -D [depth] = deep reading cutoff (higher=stronger and slower)\n\
            -w = worm debugging\n\
            -b num = benchmarking mode - can be used with -l\n\
            -g = play a game using go-modem-protocol (default if stdin not terminal)\n\
            -l [file] = load name sgf file\n\
            -L [move] = stop loading just before move is played (eg L10)\n\
            -o [file] = write sgf output to file\n\
            -r [random seed] = set random number seed\n\
            -s stack trace (for debugging purposes)\n\n\
"


#define COPYRIGHT "\n\
                   This is GNU Go 2.0, a Go program\n\
\n\
   This program is free software; you can redistribute it and/or modify it\n\
   under the terms of the GNU General Public License as published by the Free\n\
   Software Foundation - version 2.\n\
\n\
   This program is distributed in the hope that it will be useful, but WITHOUT\n\
   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n\
   FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License in\n\
   file COPYING for more details.\n\
\n\
   You should have received a copy of the GNU General Public License along\n\
   with this program; if not, write to the Free Software Foundation, Inc., 59\n\
   Temple Place - Suite 330, Boston, MA 02111, USA\n\n\
"



/* create globals
 * FIXME : perhaps distribute these as appropriate among the source files,
 * rather than shoving them all in here ?
 */

board_t p[MAX_BOARD][MAX_BOARD];  /* go board */
board_t plast[2][MAX_BOARD][MAX_BOARD];      /* position before last move for ko */
static int mymove, umove;        /* computer color, opponent color FIXME : obsolete */
int black_captured, white_captured;        /* num. of black and white stones captured */
int lib;                  /* current stone liberty FIXME : written by count() */
int libi[MAXLIBS], libj[MAXLIBS];     /* array of liberties found : filled by count() */
int size;                  /* cardinality of a group : written by count() */

int stackp;                /* stack pointer */
int movenum;               /* movenumber */
int depth;                 /* deep reading cuttoff */

int showstack;             /* debug stack pointer */
int allpats;               /* generate all patterns, even small ones */
int printworms;            /* print full data on each string */
int printboard;            /* print board each move */
int board_size=19;         /* board size */

struct worm_data worm[MAX_BOARD][MAX_BOARD];
struct dragon_data dragon[MAX_BOARD][MAX_BOARD];
struct half_eye_data half_eye[MAX_BOARD][MAX_BOARD];

int distance_to_black[MAX_BOARD][MAX_BOARD];
int distance_to_white[MAX_BOARD][MAX_BOARD];
int strategic_distance_to_black[MAX_BOARD][MAX_BOARD];
int strategic_distance_to_white[MAX_BOARD][MAX_BOARD];

int debug=0;
int verbose=0;     /* trace level                                           */
int showstack=0;   /* print the stack pointer (for debugging)               */
int printworms=0;  /* print full data about each string on the board        */
int allpats=0;     /* compute and print value of patterns, even small ones  */
int sacrifice=0;
int abort_too_deep_stack=0;

static int seed=0;     /* If seed is zero, GNU Go will play a different game 
			  each time. If it is set using -r, GNU Go will play the
			  same game each time. (Change seed to get a different
			  game). */

static FILE *sgfout;  /* NULL, or file handle of sgf output file */



/* cgoban sends us a sigterm when it wants us to die. But it doesn't
 * close the pipe, so we cannot rely on gmp to pick up an error.
 * We want to keep control so we can close the output sgf file
 * properly, so we trap the signal.
 */

static volatile int time_to_die = 0;   /* set by signal handlers */

static void sigterm_handler(int sig)
{
  time_to_die = 1;

  write(2, "*SIGTERM*\n", 10);  /* bad to use stdio in a signal handler */

  close(0);  /* this sure forces gmp.c to return an gmp_err  !!! */

  /* I thought signal handlers were one-shot, yet on my linux box it is kept.
   * Restore the default behaviour so that a second signal has the
   * original effect - in case we really are stuck in a loop
   */

  signal(sig, SIG_DFL);

  /* schedule a SIGALRM in 5 seconds, in case we haven't cleaned up by then
   * - cgoban sends the SIGTERM only once 
   */

  alarm(5);
}


static void sigint_handler(int sig)
{
  time_to_die = 1;
  write(2, "*SIGINT*\n", 9);  /* bad to use stdio in a signal handler */
  signal(sig, SIG_DFL);

  /* don't bother with an alarm - user can just press ^c a second time */
}


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
      DEBUG(DEBUG_LOADSGF, "Loading until move %d\n", until);
    }
    else
    {
      untiln = *untilstr - 'A';
      if (*untilstr >= 'I')
	--untiln;

      untilm = board_size - atoi(untilstr+1);
      DEBUG(DEBUG_LOADSGF,"Loading until move at %d,%d (%m)\n", untilm, untiln, untilm, untiln);
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

	DEBUG(DEBUG_LOADSGF,"load_sgf : Adding [%c%c]=%m\n", 'a'+n, 'a'+m, m,n);

	/* modification: support PASS expression like B[];/W[]; (cf: B[tt]/W[tt]) **/
	if (n == ']' - 'a') {
	  ungetc(m + 'a', input);
	  ungetc(n + 'a', input);
	  n = board_size;
	  m = board_size;
	}

	if (movenum == until || (m == untilm && n == untiln))
	{
	  DEBUG(DEBUG_LOADSGF, "Move specified by -L reached\n");
	  fclose(input);
	  return color;
	}

	if (n<board_size && m<board_size)
	{
	  sgf_move_made(m, n, color, 0); /* in case we are recording with -o */
	  updateboard(m, n, color);
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
	DEBUG(DEBUG_LOADSGF,"load_sgf : Handicap %d\n", n);
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
	DEBUG(DEBUG_LOADSGF,"load_sgf : Board size %d\n", n);
	if (sgfout) fprintf(sgfout,"SZ[%d]",n);
	/* an "until" move was parsed assuming board size 19. Reparse */
	goto reparse_untilstr;  /* crude, but effective ! */
      }
      state=0;
      break;
    }
  }

  DEBUG(DEBUG_LOADSGF, "\n\n\nEnd of load_sgf\n\n\n");

  fclose(input);

  return OTHER_COLOR(color);
}


/* highest label so far at each point */
static unsigned char potential_moves[MAX_BOARD][MAX_BOARD];

/* this is called for each move which has been considered */
void sgf_move_considered(int i, int j, int val)
{
  DEBUG(DEBUG_SAVESGF, "sgf_move_considered : %m scores %d\n", i,j, val);

  if (sgfout && (val > potential_moves[i][j]))
  {
    potential_moves[i][j] = val;
    fprintf(sgfout, "LB[%c%c:%d]\n", 'a'+j, 'a'+i, val);
  }
}


/* and for each move actually made - 19,19 is pass */
void sgf_move_made(int i, int j, int who, int value)
{
  // よく分からないが、範囲外座標が返されたらパスと見なす。(19路以外だとおかしくなる？)
  if (!(i >= 0 && j >= 0 && i <= 19 && j <= 19)) {
    // fprintf(stderr,"i = %d, j = %d\n", i, j);
    i = 19;
    j = 19;
  }
  // assert(i >= 0 && j >= 0 && i <= 19 && j <= 19);
  if (sgfout) {
    if (value)
      fprintf(sgfout, "C[Value of move: %d\n]", value);
    fprintf(sgfout, ";%c[%c%c]\n", who==WHITE ? 'W' : 'B', 'a'+j, 'a'+i);
  }
  memset(potential_moves, 0, sizeof(potential_moves));
}  


void sgf_dragon_status(int i, int j, int status)
{
  if (sgfout)
  {
    switch(status)
    {
      case DEAD:
	fprintf(sgfout, "LB[%c%c:X]\n", 'a'+j, 'a'+i);
	break;
      case CRITICAL:
	fprintf(sgfout, "LB[%c%c:!]\n", 'a'+j, 'a'+i);
	break;
    }
  }
}


static void load_and_analyse_sgf_file(char *file, char *until, int benchmark)
{
  int i,j;
  int next = load_sgf(file, until);

  /* at this point, either we read a size, or it is still initial value 19 */

  fixup_patterns_for_board_size(pat);
  fixup_patterns_for_board_size(hey);

  if (benchmark)
  {
    int z;
    for (z=0; z < benchmark; ++z)
    {
      genmove(&i, &j, next);
      next = OTHER_COLOR(next);
    }
  }
  else
  {
    /* bodge to get the board displayed correctly */

    mymove=next;
    umove=OTHER_COLOR(next);

    genmove(&i, &j, next);

    if (i != -1)
      gprintf("%s move %m\n", next == WHITE ? "white (o)" : "black (X)", i,j);
    else
      gprintf("%s move : PASS!\n", next == WHITE ? "white (o)" : "black (X)");

  }
}


static void play_gmp(void)
{
  /* play a game agaist a go-modem-protocol client */
   Gmp  *ge;
   GmpResult  message;
   const char  *error;

   int i, j;
   int moval;
   int pass=0;  /* two passes and its over */
   int who;  /* who's turn is next ? */

   /* if we are trying to record the game to a file,
    * trap cgoban's rather rude attempt to kill us,
    * and schedule a clean shutdown
    */

   if (sgfout)
     signal(SIGTERM, sigterm_handler);


   ge = gmp_create(0, 1);
   TRACE("board size=%d\n",board_size);

   gmp_startGame(ge, -1, -1, 5.5, 0, -1);
   do  {
     message = gmp_check(ge, 1, NULL, NULL, &error);
   } while (!time_to_die && ((message == gmp_nothing) || (message == gmp_reset)));

   if (message == gmp_err)  {
     fprintf(stderr, "gnugo-gmp: Error \"%s\" occurred.\n", error);
     exit(1);
   } else if (message != gmp_newGame)  {
     fprintf(stderr, "gnugo-gmp: Expecting a newGame, got %s\n",
	     gmp_resultString(message));
     exit(1);
   }

   i=gmp_handicap(ge);
   board_size=gmp_size(ge);

   TRACE("size=%d, handicap=%d\n",board_size, i);

   fixup_patterns_for_board_size(pat);
   fixup_patterns_for_board_size(hey);

   sethand(i);

   if (i)
     who = WHITE;
   else
     who = BLACK;

   /* FIXME : if sgfout, need to write AB[] commands */

   if (sgfout)
     fprintf(sgfout, "(;GM[1]FF[3]RU[Japanese]SZ[%d]\n", board_size);

   if (gmp_iAmWhite(ge))
   {
     mymove = WHITE;   /* computer white */
     umove = BLACK;   /* human black */
     if (sgfout) {
       fprintf(sgfout, "PW[GNU Go %s]PB[gmp]HA[%d]KM[%d.5]GN[seed %d]\n", VERSION, i, i==0?5:0, seed);
     }
   }
   else
   {
     mymove = BLACK;
     umove = WHITE;
     if (sgfout) {
       fprintf(sgfout, "PB[GNU Go %s]PW[gmp]HA[%d]KM[%d.5]GN[seed %d]\n", VERSION, i, i==0?5:0, seed);
     }
   }




/* main loop */
   while (pass < 2 && !time_to_die)
   {
     if (who == umove)
     {
       moval=0;

       /* get opponents move from gmp client */


       message = gmp_check(ge, 1, &j, &i, &error);

       if (message == gmp_err)
       {
	 fprintf(stderr, "Sorry, error from gmp client\n");
	 return;
       }

       if (message==gmp_pass)
       {
	 ++pass;
	 sgf_move_made(19, 19, who, moval);
       }
       else /* not pass */
       {
	 pass=0;
	 movenum++;

	 TRACE("\nyour move: %m\n\n", i, j);
	 updateboard(i, j, umove);
	 sgf_move_made(i, j, who, moval);
       }
     }
     else
     {
       /* generate my next move */

       moval=genmove(&i, &j, mymove);  
       movenum++;
	 
       if (i >= 0)   /* not pass */
       {
	 gmp_sendMove(ge, j, i);
	 updateboard(i, j, mymove);
	 sgf_move_made(i, j, who, moval);
	 pass = 0;
	 movenum++;
	 TRACE("\nmy move: %m\n\n", i, j);
       } else {
	 gmp_sendPass(ge);   /* pass */
	 sgf_move_made(19, 19, who, moval);
	 ++pass;
       }

     }

     who = OTHER_COLOR(who);

     if (sgfout) fflush(sgfout);  /* in case cgoban terminates us without notice */
   }

   /* two passes : game over */
   gmp_sendPass(ge);   /* send another pass - indicate 'done' removing stones ?  */

#if 0
   message = gmp_check(ge, 1, &j, &i, &error);
   gmp_sendPass(ge);   /* pass again */
#endif

   /* We hang around here until cgoban asks us to go, since
    * sometimes cgoban crashes if we exit first
    */

   fprintf(stderr, "Game over - waiting for cgoban to shut us down\n");

   while(!time_to_die)
   {
     message = gmp_check(ge, 1, &j, &i, &error);
     fprintf(stderr, "Message %d from gmp\n", message);
     if (message == gmp_err)
       break;
   }

}



/* for benchmark/profile/stress purposes, play both sides of
 * a full game, or at least up to "moves" moves. (-b moves)
 */

static void play_solo(int moves)
{
  int pass=0; /* num. consecutive passes */
  int who=BLACK;
  int moval;

  if (sgfout)
    signal(SIGINT, sigint_handler);

  /* at this point, either we read a size, or it is still initial value 19 */

  fixup_patterns_for_board_size(pat);
  fixup_patterns_for_board_size(hey);

  mymove=BLACK;
  umove=WHITE;

  if (sgfout) {
     fprintf(sgfout, "(;GM[1]FF[3]RU[Japanese]SZ[%d]\n", board_size);
    fprintf(sgfout, "PW[GNU Go]PB[GNU Go]HA[0]KM[0.5]GN[GNU Go %s solo game : seed %d]\n", VERSION, seed);
  }
  
  /* It tends not to be very imaginative in the opening,
   * so we scatter a few stones randomly to start with.
   * We add two random numbers to reduce the probability
   * of playing stones near the edge.
   */

  {
    int n = 6 + 2*rand()%5;
    int i,j;

    do {

      do {
	i = (rand() % 4) + (rand() % (board_size-4));
	j = (rand() % 4) + (rand() % (board_size-4));
      } while (p[i][j] != EMPTY);

      updateboard(i,j,who);

      if (sgfout)
	fprintf(sgfout, "A%c[%c%c]", who==WHITE ? 'W' : 'B', 'a'+j, 'a'+i);

      who = OTHER_COLOR(who);
    } while (--n > 0);

    if (sgfout)
      putc('\n', sgfout);
  }      

  while (pass < 2 && --moves >= 0 && !time_to_die)
  {
    int i,j;
    moval=genmove(&i, &j, who);
    if (i>=0)
    {
      pass=0;
      updateboard(i,j,who);
      ++movenum;

      sgf_move_made(i, j, who, moval);

      gprintf("%s plays %m\n", who==BLACK ? "black" : "white", i,j);

    }
    else
    {
      ++pass;

      sgf_move_made(19, 19, who, moval);

      printf("%s passes\n", who==BLACK ? "black" : "white");

    }

    who=OTHER_COLOR(who);

  }

  /* two passes and it's over */

  if (printboard)
  {
    make_worms();
    make_dragons();
    showboard();
  }
}


int main(int argc, char *argv[])
  {

   int i, j;

   char *sgf_file = NULL;
   char *until = NULL;

   int benchmark = 0;  /* benchmarking mode (-b) */

//   int gmp = !isatty(0);  /* default to gmp unless stdin is a terminal */
   int gmp = 0;  /* force ascii mode if gnugo is called from php process. (modified by curren) */

   fputs(COPYRIGHT, stderr);



/* init board */
   memset(p, EMPTY, sizeof(p));
   depth=DEPTH;

   /* parse command-line args */

   for (j=1; j<argc; j++) {
     if (strcmp(argv[j],"--help")==0) {
       fputs(USAGE, stderr);
       return (EXIT_SUCCESS);
     }
     if (strcmp(argv[j],"--version")==0) {
       fprintf(stderr, "\nThis is GNU Go version %s\n\n", VERSION);
       return (EXIT_SUCCESS);
     }
   }

   while ( (i=getopt(argc, argv, "?ab:d:D:ghl:L:o:r:stTvw")) != EOF)
     {
       switch(i)
	 {
	 case 'g' : gmp = 1; break;
	 case 'T' : printboard = 1; break;
	 case 't' : ++verbose; break;
         case 'v' : 
	   fprintf(stderr, "\nThis is GNU Go version %s\n\n", VERSION);
	   return (EXIT_SUCCESS);
	   break;
	 case 'a' : allpats = 1; break;
	 case 'l' : sgf_file = optarg; break;
	 case 'L' : until = optarg; break;
	 case 'b' : benchmark = atoi(optarg); break;
	 case 'r' : seed = atoi(optarg); break;
	 case 's' : showstack = 1; break;
	 case 'w' : printworms = 1; break;
	 case 'd' :
	   debug = strtol(optarg, NULL, 0);  /* allows 0x... */
	   if (debug == 0)
	   {
	     /* remind user that -d now takes a numeric option */
	     fprintf(stderr, "Error : -d expects a non-zero flags option\n");
	     exit(EXIT_FAILURE);
	   }
		     
	   break;
	 case 'D' : depth=atoi(optarg); break;
	 case 'o' :

	   sgfout = fopen(optarg, "w");
	   if (!sgfout)
	     fprintf(stderr, "Warning : could not write '%s'\n", optarg);
	   /* but carry on anyway */
	   break;
	 case 'h' :
	 case '?' :
	 default :
	   fputs(USAGE, stderr);
	   exit(EXIT_FAILURE);
	 }
     }

   
   /* start random number seed */
   if (!seed) seed=time(0);
   fprintf(stderr,"RANDOM SEED=%d\n",seed);
   srand(seed);
   if (gmp)
     play_gtp();
/*     play_gmp(); */
   else if (sgf_file)
     load_and_analyse_sgf_file(sgf_file, until, benchmark);
   else if (benchmark)
     play_solo(benchmark);
   else
     puts("Need to supply an sgf file, or invoke using a gmp client");

   if (sgfout)
   {
     fprintf(sgfout, ")\n");
     fclose(sgfout);
   }

   return 0;
  }  /* end main */


/*
 * Local Variables:
 * tab-width: 8
 * c-basic-offset: 2
 * End:
 */

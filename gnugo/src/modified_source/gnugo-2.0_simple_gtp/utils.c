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

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdarg.h>
#include <assert.h>
#include "liberty.h"

static board_t stack[MAXSTACK][MAX_BOARD][MAX_BOARD]; /* stack */
static int stacki[MAXSTACK];  /* list of trial moves to get to current position */
static int stackj[MAXSTACK];  /* position and which color made them. Perhaps */
static int move_color[MAXSTACK];  /* this should be one array of a structure */
static int stackbc[MAXSTACK], stackwc[MAXSTACK]; /* b and w captured stones */


/* pushgo pushes the position onto the stack. */

int pushgo()
{
  if (showstack)
    gprintf("        *** STACK before push: %d\n", stackp); 
  memcpy(stack[stackp], p, sizeof(p));
  stackbc[stackp]=black_captured;
  stackwc[stackp]=white_captured;
  stackp++;
  return(stackp);
}

/* popgo pops the position from the stack. */

int popgo()
{
  stackp--;
  if (showstack)
    gprintf("<=    *** STACK  after pop: %d\n", stackp);
   
  memcpy(p, stack[stackp], sizeof(p) );
  black_captured=stackbc[stackp];
  white_captured=stackwc[stackp];
  return (stackp);
}


/* trymove pushes the position onto the stack, and makes a move
at (i, j) of color. Returns zero if the move is not legal. The
stack pointer is only incremented if the move is legal. So the
way to use this is:

   if (trymove(i, j, color)) {
        ...
        popgo();
   }   

*/

int trymove(int i, int j, int color)
{
  /* we could call legal() here, but that has to do
   * and then un-do all the stuff we want to re-do here.
   * (pushgo, updateboard, ...)  So we replicate its functionality
   * inline.
   * FIXME : perhaps we should just get rid of legal() : can replace
   * calls to legal()  with a call to trymove() and popgo() if necessary.
   */

  assert(i>=0 && i<board_size && j>=0 && j<board_size);
  if(abort_too_deep_stack) return(0);

  if (p[i][j]!=EMPTY) return(0);

  stacki[stackp]=i;
  stackj[stackp]=j;
  move_color[stackp]=color;

  /* we check for stack overflow */

  if (stackp >= MAXSTACK-2) {
    fprintf(stderr, "gnugo: Truncating search. This is beyond my reading ability!\n");
    abort_too_deep_stack = 1;
    return (0);
  }

  pushgo();
  if (verbose==4)
    dump_stack();

  if (updateboard(i,j,color) == 0)
  {
    /* no trivial liberties : we need to run approxlib to
     * make sure we do actually have some liberties !
     */

    if (approxlib(i,j,color,1) == 0)
    {
      RTRACE("%m would be suicide\n", i, j);
      goto pop_and_return;
    }
  }


  /* we check for ko violation */

  {
    int legit;
    if (stackp>1)
      legit = memcmp(stack[stackp-2], p, sizeof(p));
    else
      legit =  memcmp(plast[OTHER_COLOR(color)-1], p, sizeof(p));  /* 0 means same => not legit */
    if (!legit)
    {
      RTRACE("%m would violate the ko rule\n", i, j);
      goto pop_and_return;
    }
  }


  return(1);

pop_and_return:
  popgo();
  return 0;
}  

/* dump_stack() for use under gdb prints the move stack. */

void
dump_stack(void)
{
  int n;

  for (n=0; n<stackp; n++) {
    TRACE("%o%s:%m ", move_color[n] == BLACK ? "B" : "W", stacki[n], stackj[n]);
  }
  TRACE("=\n");
}


/* this fn underpins all the TRACE and DEBUG stuff.
 *  Accepts %c, %d and %s as usual. But it
 * also accepts %m, which takes TWO integers and writes a move
 * Nasty bodge : %o at start means outdent (ie cancel indent)
 */

static void 
vgprintf(const char *fmt, va_list ap)
{
  if (fmt[0] == '%' && fmt[1] == 'o')
    fmt +=2;  /* cancel indent */
  else if (stackp > 0)
    fprintf(stderr, "%.*s", stackp*2, "                                ");  /* "  " x (stackp * 2) */

  for ( ; *fmt ; ++fmt )
  {
    if (*fmt == '%')
    {
      switch(*++fmt)
      {
      case 'c':
      {
	int c = va_arg(ap, int);  /* rules of promotion => passed as int, not char */
	putc(c, stderr);
	break;
      }
      case 'd':
      {
	int d = va_arg(ap, int);
	fprintf(stderr, "%d", d);
	break;
      }
      case 's':
      {
	char *s = va_arg(ap, char*);
	assert( (int)s >= board_size );  /* in case %s used in place of %m */
	fputs(s, stderr);
	break;
      }
      case 'm':
      {
	char movename[4];
	int m = va_arg(ap, int);
	int n = va_arg(ap, int);
	assert( (m < board_size && n < board_size));
	if ((m<0) || (n<0))
	  fputs("??",stderr);
	else {                       /* generate the move name */
	  if (n<8)
	    movename[0]=n+65;
	  else
	    movename[0]=n+66;
	  sprintf(movename+1, "%d", board_size-m);
	}
	fputs(movename, stderr);
	break;
      }
      default:
	fprintf(stderr, "\n\nUnknown format character '%c'\n", *fmt);
	break;
      }
    }
    else
      putc(*fmt, stderr);
  }
}



/* required wrapper around vgprintf */
void 
gprintf(const char *fmt, ...)
{
  va_list ap;
  va_start(ap, fmt);
  vgprintf(fmt, ap);
  va_end(ap);
}



#ifndef __GNUC__  /* gnuc has macro vsns of these */
void 
TRACE(const char *fmt, ...)
{
  va_list ap;

  if (!verbose)
    return;

  va_start(ap, fmt);
  vgprintf(fmt, ap);
  va_end(ap);
}

void 
VTRACE(const char *fmt, ...)
{
  va_list ap;

  if (verbose < 3)
    return;

  va_start(ap, fmt);
  vgprintf(fmt, ap);
  va_end(ap);
}

void 
RTRACE(const char *fmt, ...)
{
  va_list ap;

  if (verbose < 2)
    return;

  va_start(ap, fmt);
  vgprintf(fmt, ap);
  va_end(ap);
}

void 
DEBUG(int level, const char *fmt, ...)
{
  va_list ap;

  if (!(debug & level))
    return;

  va_start(ap, fmt);
  vgprintf(fmt, ap);
  va_end(ap);
}
#endif





/* if chain at m,n has no liberties, remove it from
 * the board. Return the number of stones captured.
 */

static int check_for_capture(int m, int n, int color)
{
  char mx[MAX_BOARD][MAX_BOARD];
  int i,j;
  int captured=0; /* number captured */

  ASSERT(p[m][n] == color, m,n);

  DEBUG(DEBUG_COUNT,"Checking %m for capture\n", m,n);

  memset(mx,1,sizeof(mx));

  if (count(m,n,color,mx,1) > 0)
    return 0;

  /* remove all the stones with mx[i][j] == 0,
   *  (since these are the ones count() touched)
   * - count also marks EMPTY stones, but there's
   * no harm in resetting them to EMPTY
   */

  for (i=0; i<board_size; ++i)
    for (j=0; j<board_size; ++j)
      if (mx[i][j] == 0)
      {
	p[i][j] = EMPTY;
	++captured;
      }

  if (color == WHITE)
    white_captured += captured;
  else
    black_captured += captured;

  return captured;
}

/* legal(i, j, color) determines whether the move (color) at (i, j) is legal */

int legal(int i, int j, int color)
{
  int legit=0;

  assert(i>=0 && i<board_size && j>=0 && j<board_size);

  if (p[i][j]!=EMPTY) return(0);

  if (stackp >= MAXSTACK-2) {
    fprintf(stderr, "gnugo: Truncating search. This is beyond my reading ability!\n");
    return (0);
  }

  pushgo();
  updateboard(i, j, color);

  if (stackp>1)
    legit = memcmp(stack[stackp-2], p, sizeof(p));
  else
    legit =  memcmp(plast[OTHER_COLOR(color)-1], p, sizeof(p));  /* 0 means same => not legit */
  if (!legit)
    RTRACE("%m would violate the ko rule\n", i, j);
  if (legit) {
    approxlib(i, j, color, 1);  /* only care about 0 or >=1 */
    if (lib==0) {
      RTRACE("%m would be suicide\n", i, j);
      legit=0;
    }
  }
  popgo();
  return(legit);
}



/* a wrapper around abort() which shows the state variables at the time of the problem
 * i, j are typically a related move, or -1, -1
 *
 * FIXME : other state can be added later
 */

void 
abortgo(const char *file, int line, const char *msg, int x, int y)
{
  int i=0;

  verbose=1;
  gprintf( "%o\n\n***assertion failure :\n%s:%d - %s near %m***\n\n",  file, line, msg, x, y);

  showboard();
  while (stackp > 0)
  {
    /* FIXME : possibly destructive, since info lost from core file */
    popgo();
    showboard();
  }


  RTRACE( "lib=%d\nliberties:", lib);
  for (i=0; i<lib; ++i)
    RTRACE( "%m\n", libi[i], libj[i]);

  fprintf(stderr,"\n\
gnugo: You stepped on a bug.\n\
Please save this game as an sgf file and mail to gnugo@gnu.org\n\n");
  
  abort();  /* cause core dump */
}




/*
 * Place a "color" on the board at i,j, and remove
 * any captured stones.
 *
 * If stackp == 0, copies the previous position to plast[],
 * as part of the ko-rule test.
 *
 * Assumes that the only stones which can be captured are
 * those immediately adjacent to the piece just played.
 *
 * Returns non-zero if there are any "trivial" liberties, ie if
 * we capture any stones or there are any adjacent liberties.
 * A return value of 0 does not mean that the placed stone has no
 * liberties, though a return of >0 means it definately does.
 * (ie return of >0 is sufficient, though not necessary, test
 * for move not being a suicide.)
 *
 *  Globals affected : uses count(), so anything it affects
 */

int updateboard(int i, int j, int color)
{
  int other = OTHER_COLOR(color);
  int obvious_liberties=0;

  // 19路未満のパスが引っかかってしまうためコメントアウト
  // assert(i>=0 && i<board_size && j>=0 && j<board_size);
  
  // 盤面範囲外になる場合は処理打ち切る
  if (!(i>=0 && i<board_size && j>=0 && j<board_size)) {
    return obvious_liberties;
  }
  
  ASSERT( p[i][j] == EMPTY, i, j);

  if (stackp==0)
    memcpy(plast[color-1], p, sizeof(p));


  p[i][j] = color;

  DEBUG(DEBUG_BOARD, "Update board : %m = %d\n", i,j, color);

  if (i>0)
  {
    if (p[i-1][j] == other)
      obvious_liberties += check_for_capture(i-1, j, other);
    else if (p[i-1][j] == EMPTY)
      ++obvious_liberties;
  }

  if (i<board_size-1)
  {
    if (p[i+1][j]==other)
      obvious_liberties += check_for_capture(i+1, j, other);
    else if (p[i+1][j] == EMPTY)
      ++obvious_liberties;
  }


  if (j>0)
  {
    if (p[i][j-1]==other)
      obvious_liberties += check_for_capture(i, j-1, other);
    else if (p[i][j-1]==EMPTY)
      ++obvious_liberties;
  }

  if (j<board_size-1)
  {
    if (p[i][j+1]==other)
      obvious_liberties += check_for_capture(i, j+1, other);
    else if (p[i][j+1]==EMPTY)
      ++obvious_liberties;
  }

  return obvious_liberties;

}


/* count (minimum) liberty of color piece at m, n
 * m,n may contain either that color, or be empty, in which
 * case we get what the liberties would be if we were to place
 * a piece there.
 * If the caller only cares about a minimum liberty count, it
 * should pass that minimum in, and then we *may* stop counting
 * if/when we reach that number. (but we may still return a larger
 * number if we feel like it
 *
 * Note that countlib(i,j,c) is defined as approxlib(i,j,c,99999)
 */

int approxlib(int m,     /* row number 0 to board_size-1 */
              int n,     /* column number 0 to board_size-1 */
              int color, /* BLACK or WHITE */
	      int maxlib /* count might stop when it reaches this */
             )
{
 int i;
 char ml[MAX_BOARD][MAX_BOARD];

 ASSERT(m>=0 && m < board_size && n >= 0 && n < board_size,m,n);
 ASSERT(color != EMPTY,m,n);

 ASSERT(p[m][n] != OTHER_COLOR(color), m,n);


/* set all piece as unmarked */
 memset(ml,1,sizeof(ml));

 lib=0;
 size=0;
/* count liberty of current piece */
 i=count(m,n,color,ml, maxlib);

 /* trying to get rid of globals... */
 assert(i == lib);  /* return value should match global in this case */

 DEBUG(DEBUG_COUNT, "approxlib(%m,%d) returns %d\n", m,n,maxlib,i);

 return(i);
}  /* end countlib */






/* count (minimum) liberty of color piece at location i, j
   and return value in global variable lib. Return size of
   connected component in size.

   No check is made on entry that that square is occupied
   by that color : it is valid to use this to count the
   liberties that there would be if color was put into
   empty square at i,j.

   if k<lib, then libi[k],libj[k] points to one of the
   liberties of the string.

  ENTRY : mx[][] contains 1 for stones uncounted, 0 for stones
          previously counted

          maxlib : typically, it is not necessary to get the
          exact number of liberties : we can stop when it
          reaches some threshold (often 1 !). It is not an
          error for this to be < 1 on entry : because this is
          recursive, we might end up passing in < 1 for
          convenience.

          Globals lib and size are not reset : caller
          must reset them before first call if required.

  RETURNS : number of liberties found by this recursion.
            useful for stopping the recursion when we reach
            maxlib

  EXIT :  return num of liberties in global "lib"

          return group size in global "size"

          updates mx[][], putting 0 at all stones visited

	  EITHER : return < maxlib, and mx[][] and l[][] fully updated
	  OR     : return >= maxlib, and mx[][] and l[][] partially updated

  NOTE : intended as an internal helper for countlib, but
         is exported as a general (though complex) function
         for efficiency.
*/

int count(int i,     /* row number 0 to board_size-1 */
           int j,     /* column number 0 to board_size-1 */
           int color, /* BLACK or WHITE */
	   char mx[MAX_BOARD][MAX_BOARD],  /* workspace : mx[][]=0 means stone already visited */
	   int maxlib       /* often, we only care if liberties > some minimum (usually 1) */
         )
{
  int this = 0;  /* how many have we found ? */
  int save_j=j;  /* for tracing */

  if (maxlib < 1)
    return 0;  /* we are done */


  /* we could just keep things simple and recurse in all four
   * directions, but since that would be tail-recursion,
   * we can change that into an iteration. ie this function
   * iterates eastwards, recursing to examine north,south and
   * west.
   * FIXME : seems daft to have to look west when we are marching
   * eastwards. I think pair of mutually recursive fns would fix
   * this, but it is probably minor. Alternatively, an extra parameter
   * to say which direction we came in on, and so not to bother
   * checking back that way.
   */


  do {
    mx[i][j] = 0;         /* Moved into loop per drd's email 1/25/99 */
    size++;               /* Ditto                                   */
    DEBUG(DEBUG_COUNT,"...counting at %m : this=%d so far ; maxlib=%d\n", i,j, this, maxlib);
    /* check North neighbor */
    if (i != 0 && mx[i-1][j])
    {
      if (p[i - 1][j] == EMPTY)
      {
	/* found one liberty */
	if (lib<MAXLIBS) {
	  libi[lib]=i-1;
	  libj[lib]=j;
	}
	++lib;
	++this;
	mx[i - 1][j] = 0;
      } 
      else if (p[i - 1][j] == color) {
	this += count(i - 1, j, color, mx, maxlib);
      } 
    }

    /* check South neighbor */
    if (this < maxlib && i != board_size-1 && mx[i + 1][j])
    {
      if (p[i + 1][j] == EMPTY) 
      {
	if (lib<MAXLIBS) {
	  libi[lib]=i+1;
	  libj[lib]=j;
	}
	++lib;
	++this;
	mx[i + 1][j] = 0;
      }
      else if (p[i + 1][j] == color) {
	this += count(i + 1, j, color,mx, maxlib-this);
      }
    }

    /* check West neighbor */
    if (this < maxlib && j != 0 && mx[i][j - 1])
    {
      if (p[i][j - 1] == EMPTY)
      {
	if (lib<MAXLIBS) {
	  libi[lib]=i;
	  libj[lib]=j-1;
	}
	++lib;
	++this;
	mx[i][j - 1] = 0;
      }
      else if (p[i][j - 1] == color) {
	this += count(i, j - 1, color,mx, maxlib-this);
      }
    }


    /* now step east and prepare to do it all again */

    if (++j == board_size || !mx[i][j] )
      break; /* reached right edge of board, or have already been here */

    if (p[i][j] == EMPTY) 
    {
      if (lib<MAXLIBS) {
	libi[lib]=i;
	libj[lib]=j;
      }
      ++lib;
      ++this;
      mx[i][j] = 0;  /* mark it : we are done, but one of the other recursive chains might come by here */
      break;
    }
    else if (p[i][j] != color) {
      /* not a liberty : just stop this chain */
      break;
    }

    /* get here => it's another of ours : we can just step round the loop once more */

  } while (this < maxlib);

  DEBUG(DEBUG_COUNT, "count(%s,%d) returns %d\n", i,save_j, maxlib,this);

  return this;
}  /* end count */

/* see DRAGON for the definition of strategic_distance */

int 
strategic_distance_to(int color, int i, int j)
{
  if (color==BLACK)
    return (strategic_distance_to_black[i][j]);
  else if (color==WHITE)
    return (strategic_distance_to_white[i][j]);    
  else return (0);
}

/* see DRAGON for the definition of distance */

int 
distance_to(int color, int i, int j)
{
  if (color==BLACK)
    return (strategic_distance_to_black[i][j]);
  else if (color==WHITE)
    return (strategic_distance_to_white[i][j]);    
  else return (0);
}



/*
 * Local Variables:
 * tab-width: 8
 * c-basic-offset: 2
 * End:
 */

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

/*-----------------------
 endgame.c -- end of game
-----------------------*/

#include <stdio.h>
#include <string.h>
#include "gnugo.h"

#define BSIZE 19            /* use variable "sz" instead **/
#define NODES BSIZE*BSIZE   /* use variable "sz" instead **/
#define ENDLIST 1000
#define QSIZE 150
#define GREY  3


extern unsigned int sz;
extern unsigned char **p;   /* go board */
extern int mymove, umove;         /* computer color, opponent color */
extern int mk, uk;    /* no. of stones captured by computer and oppoent */

int que[QSIZE],*color,*listpt;
int *pe, *pstart;
int endq=0;
int queinit=0;
int size=0;

void node2ij(int node,
             int *i,
             int *j)
/* Converts a node number back to an i,j pair. */
{
   *i = node/sz;
   *j = node%sz;
}

int node(int i,
         int j)
{
  return i*sz+j;
}

void createlist(int color,
                int movelist[][5])
/* Create an adjacency list, movelist, for a particular
   color of piece.
*/
{
  int i, j, k, m;

  for (i=0;i<sz;i++) {
   for (j=0;j<sz;j++) {
     k=0;
     if (p[i][j]==color) {
     /* check up */
       if ( i > 0 ) {
         if (p[i-1][j]==color) {
           movelist[node(i,j)][k]=node(i-1,j);
           k++;
         }
       }
       /* check right */ 
       if ( j < ( sz -1 ) ) { 
         if ( p[i][j+1] == color ) {
           movelist[node(i,j)][k]=node(i,j+1);
           k++;
         }
       }
       /* check down */
       if ( i < ( sz - 1) ) {
         if ( p[i+1][j] == color ) {
           movelist[node(i,j)][k]=node(i+1,j);
           k++;
         }
       }
       /* check left */
       if ( j > 0 ) {
         if ( p[i][j-1]==color ) {
           movelist[node(i,j)][k]=node(i,j-1);
           k++;
         }
       }
     } /* end if for color */
     /* Mark end of adjacency list for this node. */
     movelist[node(i,j)][k]=ENDLIST;
   } /* End j loop */
  } /* End i loop */
}

void enqueue(int *v)
{
  if (queinit == 0)
  {
   pe = que;
   pstart = que;
  }
  *pe = *v;
  pe++;
  size++;
  if ( pe > (que + (QSIZE - 1))) pe = que;
  if (queinit == 0) queinit++;
}

void dequeue(void)
{
 pstart++;
 size--;
 if (pstart > (que + (QSIZE - 1))) pstart = que;
}

int  bfslist(int i,
             int j,
             int movelist[][5],
             int list[])
/* Using the adjacency list, movelist, for pieces of one color
   find all connected points.  
   Starting point is defined by i and j.  Output is
   the number of points found and an array of their 
   locations.
*/
{ 
  int k,u,v;
  int w=0;

  for (k=0;k<(sz*sz);k++) color[k]=WHITE; /* initialization */
  color[node(i,j)] = GREY;
  u=node(i,j);
  enqueue(&u);
#ifdef DEBUG 
printf("Survived first enqueue in bfslist.\n");
#endif
  while (size != 0) {
    k = 0;
    u=*pstart;
    while ((v = movelist[u][k]) != ENDLIST) {    
      if (color[v] == WHITE) {
        color[v] = GREY;
        enqueue(&v);
      }
      k++;
    }
#ifdef DEBUG 
printf("Just prior to first dequeue!.\n");
#endif
    dequeue();
    color[u]=BLACK;
    *(listpt + w) = u;
    w++;
  }
return w;
}

void endgame(void)
/* count pieces and announce the winner */
{
  char an[10];
  int i, j, k, N, mtot, utot, cont;
  int **mymovelist;
  int **umovelist;
  
  color = (int *)calloc(sizeof(int), sz*sz);
  listpt = (int *)calloc(sizeof(int), sz*sz);
  mymovelist = (int **)calloc(sizeof(int), sz*sz*5);
  umovelist = (int **)calloc(sizeof(int), sz*sz*5);

  printf("\nTo count score, we need the following steps:\n");
  printf("First, I need you to remove all dead pieces on the board.\n");
  printf("Second, I need you to fill in neutral territories with ");
  printf("pieces.\n");
  printf("Last, I will fill in all pieces and announce the winner.\n");

/* remove dead pieces */
  printf("\nFirst, you should enter the dead pieces (black and white) to");
  printf(" be removed.  Enter\n");
  printf(" 'stop' when you have finished.\n");

/* Create an adjacency list for the game board. */
/* First a list for the computer's moves */
  createlist(mymove, mymovelist);

/* Then a list for our opponent's moves */
  createlist(umove, umovelist);

  cont = 1;
  do {
      printf("Dead piece? ");
      scanf("%s", an);
      if (strcmp(an, "stop"))
        {
  	 getij(an, &i, &j);
 	 if (p[i][j] == mymove)
 	   {
#ifdef DEBUG 
printf("Just before bfslist.\n");
#endif
 	    N = bfslist(i, j, mymovelist, listpt);
#ifdef DEBUG 
printf("Survived first bfslist.\n");
#endif
 	    for (k=0;k<N;k++)
               {
                node2ij(listpt[k], &i, &j);
                p[i][j] = EMPTY;
                mk++;
               }
 	 }
 	else
 	   if (p[i][j] == umove)
 	     {
#ifdef DEBUG 
printf("Just before second bfslist.\n");
#endif
              N = bfslist(i, j, umovelist, listpt);
              for (k=0;k<N;k++)
                 {
                  node2ij(listpt[k], &i, &j);
                  p[i][j] = EMPTY;
                  uk++;
                 }
       	    }
           showboard();
       }
     else
        cont = 0;
    }
  while (cont);

/* fill in neutral */
  printf("Next, you need to fill in pieces (black and white) in all neutral");
  printf(" territories.\n");
  printf("Enter your and my pieces alternately and");
  printf(" enter 'stop' when finish\n");
  cont = 1;
  N = 0;

  do {
    if ( (N%2) == 0 ) 
     {
      printf("Your piece? ");
      scanf("%s", an);
      if (strcmp(an, "stop"))
        {
 	getij(an, &i, &j);
 	p[i][j] = umove;
 	showboard();
       }
      else
 	cont = 0;
     }
     else
     {
      printf("My piece? ");
      scanf("%s", an);
      if (strcmp(an, "stop"))
        {
 	getij(an, &i, &j);
 	p[i][j] = mymove;
 	showboard();
        }
      else
 	cont = 0;
     }
     N++;
    }
   while (cont);

/* set empty to side they belong to */
   for (i = 0; i < sz; i++)
      for (j = 0; j < sz; j++)
 	if (p[i][j] == EMPTY)
 	   p[i][j] = findcolor(i, j);

/* count total */
  mtot = 0;  utot = 0;
  for (i = 0; i < sz; i++)
     for (j = 0; j < sz; j++)
	if (p[i][j] == mymove)
	  ++mtot;
	else
	   if (p[i][j] == umove)
	     ++utot;

  showboard();
  printf("Your total number of pieces %d\n", utot);
  printf("My total number of pieces %d\n", mtot);

}  /* end endgame */


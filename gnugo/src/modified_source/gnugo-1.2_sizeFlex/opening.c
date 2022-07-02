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
/*-----------------------------------
  opening.c -- Select opening moves
-----------------------------------*/

#include <stdlib.h>
#include "gnugo.h"

extern unsigned int sz;

int opening(int *i,
            int *j,
            int *cnd,
            int type)
/* get move for opening from game tree */
{
 struct tnode {
   int i, j, ndct, next[8];
  };

 static struct tnode tree[] = {
  {-1, -1, 8, { 1, 2, 3, 4, 5, 6, 7, 20}},	/* 0 */
  {2, 3, 2, { 8, 9}},
  {2, 4, 1, {10}},
  {3, 2, 2, {11, 12}},
  {3, 3, 6, {14, 15, 16, 17, 18, 19}},
  {3, 4, 1, {10}},  /* 5 */
  {4, 2, 1, {13}},
  {4, 3, 1, {13}},
  {4, 2, 0},
  {4, 3, 0},
  {3, 2, 0},  /* 10 */
  {2, 4, 0},
  {3, 4, 0},
  {2, 3, 0},
  {2, 5, 1, {10}},
  {2, 6, 1, {10}},  /* 15 */
  {3, 5, 1, {10}},
  {5, 2, 1, {13}},
  {5, 3, 1, {13}},
  {6, 2, 1, {13}},
  {2, 2, 0}  /* 20 */
};
int m;

/* get i, j */
 if ((type == 1) || (type == 3))
    *i = sz-1 - tree[*cnd].i;   /* inverted */
 else
    *i = tree[*cnd].i;
 if ((type == 2) || (type == 3))
    *j = sz-1 - tree[*cnd].j;   /* reflected */
 else
    *j = tree[*cnd].j;
 if (tree[*cnd].ndct)  /* more move */
   {
    m = rand() % tree[*cnd].ndct;  /* select move */
    *cnd = tree[*cnd].next[m];	/* new	current node */
    return 1;
  }
 else
    return 0;
}  /* end opening */

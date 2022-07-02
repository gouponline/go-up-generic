/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This is GNU Go, a Go program. Contact gnugo@gnu.org, or see       *
 * http://www.gnu.org/software/gnugo/ for more information.          *
 *                                                                   *
 * Copyright 1999, 2000, 2001, 2002 and 2003                         *
 * by the Free Software Foundation.                                  *
 *                                                                   *
 * This program is free software; you can redistribute it and/or     *
 * modify it under the terms of the GNU General Public License as    *
 * published by the Free Software Foundation - version 2             *
 *                                                                   *
 * This program is distributed in the hope that it will be useful,   *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of    *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the     *
 * GNU General Public License in file COPYING for more details.      *
 *                                                                   *
 * You should have received a copy of the GNU General Public         *
 * License along with this program; if not, write to the Free        *
 * Software Foundation, Inc., 59 Temple Place - Suite 330,           *
 * Boston, MA 02111, USA.                                            *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

#include <stdio.h> /* for NULL */
#include "liberty.h"
#include "patterns.h"

static struct patval read_defend0[] = {
  {684,1},	{721,0}
};

static struct patval read_defend1[] = {
  {684,2},	{721,0}
};

static struct patval read_defend2[] = {
  {684,2},	{721,0},	{758,0}
};

static struct patval read_defend3[] = {
  {684,2},	{758,2},	{721,0},	{795,0}
};

static struct patval read_defend4[] = {
  {757,1},	{720,2},	{684,2},	{758,2},
  {721,0}
};

static struct patval read_defend5[] = {
  {684,1},	{722,1},	{685,4},	{721,0}
};

static struct patval read_defend6[] = {
  {684,1},	{759,1},	{721,4},	{685,0},
  {722,0},	{758,0}
};

static struct patval read_defend7[] = {
  {720,1},	{684,1},	{758,2},	{721,0},
  {757,0}
};

static struct patval read_defend8[] = {
  {721,1},	{684,2},	{722,0}
};

static struct patval read_defend9[] = {
  {684,1},	{721,2},	{758,0}
};

static struct patval read_defend10[] = {
  {684,1},	{758,2},	{721,0},	{795,0}
};

static struct patval read_defend11[] = {
  {684,1},	{721,0}
};

static struct patval read_defend12[] = {
  {684,1},	{721,0},	{758,0}
};

static struct patval read_defend13[] = {
  {684,1},	{721,0},	{722,0}
};

static int autohelperread_defend0(int trans, int move, int color, int action);
static int autohelperread_defend1(int trans, int move, int color, int action);
static int autohelperread_defend2(int trans, int move, int color, int action);
static int autohelperread_defend3(int trans, int move, int color, int action);
static int autohelperread_defend4(int trans, int move, int color, int action);
static int autohelperread_defend5(int trans, int move, int color, int action);
static int autohelperread_defend6(int trans, int move, int color, int action);
static int autohelperread_defend7(int trans, int move, int color, int action);
static int autohelperread_defend8(int trans, int move, int color, int action);
static int autohelperread_defend9(int trans, int move, int color, int action);
static int autohelperread_defend10(int trans, int move, int color, int action);
static int autohelperread_defend11(int trans, int move, int color, int action);
static int autohelperread_defend12(int trans, int move, int color, int action);
static int autohelperread_defend13(int trans, int move, int color, int action);

/* extern struct pattern read_defend[]; */
static struct pattern read_defend[] = {
  {read_defend0,2,8, "RD000a",0,0,0,1,0,1,0x0,721,
    { 0x003c0000, 0x00303000, 0x00f00000, 0x30300000, 0x30300000, 0x003c0000, 0x00303000, 0x00f00000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x3000040,0.000000,98.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_defend0,3,0.000000},
  {read_defend1,2,8, "RD101",0,0,0,1,0,1,0x0,721,
    { 0x003c0000, 0x00303000, 0x00f00000, 0x30300000, 0x30300000, 0x003c0000, 0x00303000, 0x00f00000},
    { 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000}
   , 0x3000040,0.000000,65.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_defend1,0,0.034000},
  {read_defend2,3,8, "RD102",0,0,0,2,0,2,0x0,758,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000}
   , 0x1000040,30.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend2,0,0.083600},
  {read_defend3,4,8, "RD104",0,0,0,3,0,3,0x0,795,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00110000, 0x00100010, 0x00100000, 0x00100000, 0x00100000, 0x00110000, 0x00100010, 0x00100000}
   , 0x1000040,7.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend3,0,0.034000},
  {read_defend4,5,8, "RD105",-1,0,0,2,1,2,0x0,721,
    { 0x0f3f0000, 0x00303c3c, 0x00f0c000, 0xf0300000, 0x3c300000, 0x003f0f00, 0x0030f0f0, 0xc0f00000},
    { 0x06110000, 0x00100418, 0x00104000, 0x40100000, 0x04100000, 0x00110600, 0x00104090, 0x40100000}
   , 0x1000040,31.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend4,0,0.040000},
  {read_defend5,4,8, "RD200",0,0,1,1,1,1,0x0,721,
    { 0x003c2c00, 0x00b0f000, 0xe0f00000, 0x3c380000, 0xf0b00000, 0x2c3c0000, 0x00383c00, 0x00f0e000},
    { 0x00200800, 0x00208000, 0x80200000, 0x08200000, 0x80200000, 0x08200000, 0x00200800, 0x00208000}
   , 0x1000040,80.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend5,3,0.056000},
  {read_defend6,6,8, "RD202",0,0,1,2,1,2,0x0,722,
    { 0x003b3f00, 0x00f0e0f0, 0xf0b00000, 0x2c3c0000, 0xe0f00000, 0x3f3b0000, 0x003c2c3c, 0x00b0f000},
    { 0x00200200, 0x00200080, 0x00200000, 0x00200000, 0x00200000, 0x02200000, 0x00200008, 0x00200000}
   , 0x1000040,70.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend6,3,0.030400},
  {read_defend7,5,8, "RD204",-1,0,0,2,1,2,0x0,757,
    { 0x0f3f0000, 0x00303c3c, 0x00f0c000, 0xf0300000, 0x3c300000, 0x003f0f00, 0x0030f0f0, 0xc0f00000},
    { 0x08210000, 0x00200810, 0x00208000, 0x80200000, 0x08200000, 0x00210800, 0x00208010, 0x80200000}
   , 0x1000040,66.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend7,3,0.056000},
  {read_defend8,3,8, "RD300",0,0,1,1,1,1,0x0,722,
    { 0x003c0c00, 0x0030f000, 0xc0f00000, 0x3c300000, 0xf0300000, 0x0c3c0000, 0x00303c00, 0x00f0c000},
    { 0x00180000, 0x00102000, 0x00900000, 0x20100000, 0x20100000, 0x00180000, 0x00102000, 0x00900000}
   , 0x1000040,50.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend8,0,0.040000},
  {read_defend9,3,8, "RD302",0,0,0,2,0,2,0x0,758,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00240000, 0x00201000, 0x00600000, 0x10200000, 0x10200000, 0x00240000, 0x00201000, 0x00600000}
   , 0x3000040,40.000000,65.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_defend9,3,0.040000},
  {read_defend10,4,8, "RD303",0,0,0,3,0,3,0x0,795,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00210000, 0x00200010, 0x00200000, 0x00200000, 0x00200000, 0x00210000, 0x00200010, 0x00200000}
   , 0x1000040,40.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend10,3,0.040000},
  {read_defend11,2,8, "RD304",0,0,0,1,0,1,0x0,721,
    { 0x003c0000, 0x00303000, 0x00f00000, 0x30300000, 0x30300000, 0x003c0000, 0x00303000, 0x00f00000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x1000040,10.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend11,3,0.040000},
  {read_defend12,3,8, "RD400",0,0,0,2,0,2,0x0,758,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x1000040,41.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend12,3,0.050000},
  {read_defend13,3,8, "RD400a",0,0,1,1,1,1,0x0,722,
    { 0x003c0c00, 0x0030f000, 0xc0f00000, 0x3c300000, 0xf0300000, 0x0c3c0000, 0x00303c00, 0x00f0c000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x1000040,41.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_defend13,3,0.050000},
  {NULL, 0,0,NULL,0,0,0,0,0,0,0,0,{0,0,0,0,0,0,0,0},{0,0,0,0,0,0,0,0},0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0,NULL,NULL,0,0.0}
};

static int
autohelperread_defend0(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);

  a = AFFINE_TRANSFORM(647, trans, move);

  if (!action)
    return  rgoal[a] == 1;
   { int ostar = accuratelib(move, color, MAX_LIBERTIES, NULL); int xstar = accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL); if (countlib(a) == 2 && xstar > 2 && xstar > ostar)   ((read_defend + 0)->value) = 75; else if (countlib(a) == 2 && xstar > 2)   ((read_defend + 0)->value) = 70; else if (countlib(a) > xstar)   ((read_defend + 0)->value) = 0; else   ((read_defend + 0)->value) = 50;};

  return 0;
}

static int
autohelperread_defend1(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);

  a = AFFINE_TRANSFORM(647, trans, move);

  if (!action)
    return  countlib(a) <= goallib + 2 && (accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 1);
   { int ostar = accuratelib(move, color, MAX_LIBERTIES, NULL); int xstar = accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL); if (countlib(a) > 3)   ((read_defend + 1)->value) = 10; else if (countlib(a) == 1)   ((read_defend + 1)->value) = 65; else if (countlib(a) <= 3 && ostar > countlib(a) && xstar >= countlib(a))   ((read_defend + 1)->value) = 55; else   ((read_defend + 1)->value) = 30; };

  return 0;
}

static int
autohelperread_defend2(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);
  b = AFFINE_TRANSFORM(610, trans, move);

  return  accuratelib(a, OTHER_COLOR(color), MAX_LIBERTIES, NULL) == 1 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 1 && countlib(b) < 4;
}

static int
autohelperread_defend3(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(573, trans, move);
  b = AFFINE_TRANSFORM(647, trans, move);

  return  countlib(a) < 4 && countlib(b) == 2 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 1;
}

static int
autohelperread_defend4(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(721, trans, move);

  return  countlib(a) == 1 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) == 1;
}

static int
autohelperread_defend5(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);

  return  rgoal[a] == 1 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > goallib;
}

static int
autohelperread_defend6(int trans, int move, int color, int action)
{
  int a, b, c, d;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(646, trans, move);
  b = AFFINE_TRANSFORM(647, trans, move);
  c = AFFINE_TRANSFORM(721, trans, move);
  d = AFFINE_TRANSFORM(683, trans, move);

  return  rgoal[a] == 1 && countlib(c) >= goallib && (!somewhere(color, 0, 1, d) || accuratelib(b, color, MAX_LIBERTIES, NULL) <= 2);
}

static int
autohelperread_defend7(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(611, trans, move);
  b = AFFINE_TRANSFORM(648, trans, move);

  return  rgoal[a] == 1 && accuratelib(b, color, MAX_LIBERTIES, NULL) > 1 && countlib(a) == 2;
}

static int
autohelperread_defend8(int trans, int move, int color, int action)
{
  int b;
  UNUSED(color);
  UNUSED(action);

  b = AFFINE_TRANSFORM(683, trans, move);

  return  countlib(b) == 1 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 1;
}

static int
autohelperread_defend9(int trans, int move, int color, int action)
{
  int b;
  UNUSED(color);

  b = AFFINE_TRANSFORM(647, trans, move);

  if (!action)
    return  countlib(b) < 4  && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 1;
   if (countlib(b) == 2)   ((read_defend + 9)->value) = 65; else   ((read_defend + 9)->value) = 40;;

  return 0;
}

static int
autohelperread_defend10(int trans, int move, int color, int action)
{
  int b;
  UNUSED(color);
  UNUSED(action);

  b = AFFINE_TRANSFORM(647, trans, move);

  return  countlib(b) < 4  && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 1;
}

static int
autohelperread_defend11(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);

  return  rgoal[a] == 3 && countlib(a) <= accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL);
}

static int
autohelperread_defend12(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);

  return   accuratelib(a, color, MAX_LIBERTIES, NULL) <= 2;
}

static int
autohelperread_defend13(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(683, trans, move);

  return   accuratelib(a, color, MAX_LIBERTIES, NULL) <= 2;
}


struct pattern_db read_defend_db = {
  -1,
  0,
  read_defend
 , NULL
};

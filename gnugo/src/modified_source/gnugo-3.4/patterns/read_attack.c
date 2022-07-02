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

static struct patval read_attack0[] = {
  {685,1},	{684,1},	{723,2},	{646,2},
  {648,0},	{649,0},	{686,0},	{647,0}
};

static struct patval read_attack1[] = {
  {684,1},	{721,0}
};

static struct patval read_attack2[] = {
  {684,1},	{720,3},	{722,3},	{758,3},
  {721,0}
};

static struct patval read_attack3[] = {
  {684,1},	{647,1},	{720,1},	{683,0},
  {646,0}
};

static struct patval read_attack4[] = {
  {684,1},	{685,1},	{721,0},	{722,0}
};

static struct patval read_attack5[] = {
  {684,1},	{685,1},	{721,0},	{722,0}
};

static struct patval read_attack6[] = {
  {647,1},	{684,2},	{648,0}
};

static struct patval read_attack7[] = {
  {647,1},	{684,2},	{610,0}
};

static struct patval read_attack8[] = {
  {684,2},	{721,0}
};

static struct patval read_attack9[] = {
  {647,1},	{684,1},	{721,2},	{685,2},
  {648,0},	{722,0}
};

static struct patval read_attack10[] = {
  {684,1},	{721,2},	{685,2},	{722,0}
};

static struct patval read_attack11[] = {
  {721,1},	{684,2},	{758,0}
};

static struct patval read_attack12[] = {
  {721,1},	{684,2},	{722,0}
};

static struct patval read_attack13[] = {
  {684,1},	{758,2},	{721,0},	{795,0}
};

static struct patval read_attack14[] = {
  {684,1},	{758,2},	{721,0},	{759,0}
};

static struct patval read_attack15[] = {
  {647,1},	{684,2},	{648,0},	{685,0}
};

static struct patval read_attack16[] = {
  {647,1},	{684,2},	{610,0}
};

static struct patval read_attack17[] = {
  {648,1},	{647,1},	{684,2},	{610,2},
  {611,0},	{685,0}
};

static struct patval read_attack18[] = {
  {684,1},	{646,1},	{647,0},	{609,0}
};

static struct patval read_attack19[] = {
  {721,1},	{684,2},	{720,0},	{683,0}
};

static struct patval read_attack20[] = {
  {684,1},	{647,0}
};

static struct patval read_attack21[] = {
  {684,1},	{685,1},	{721,0},	{722,0}
};

static struct patval read_attack22[] = {
  {684,1},	{683,2},	{647,0},	{646,0}
};

static struct patval read_attack23[] = {
  {684,1},	{721,0},	{758,0}
};

static struct patval read_attack24[] = {
  {684,1},	{721,0},	{722,0}
};

static struct patval read_attack25[] = {
  {684,1},	{721,0},	{685,0},	{722,0}
};

static int autohelperread_attack0(int trans, int move, int color, int action);
static int autohelperread_attack1(int trans, int move, int color, int action);
static int autohelperread_attack2(int trans, int move, int color, int action);
static int autohelperread_attack3(int trans, int move, int color, int action);
static int autohelperread_attack4(int trans, int move, int color, int action);
static int autohelperread_attack5(int trans, int move, int color, int action);
static int autohelperread_attack6(int trans, int move, int color, int action);
static int autohelperread_attack7(int trans, int move, int color, int action);
static int autohelperread_attack8(int trans, int move, int color, int action);
static int autohelperread_attack9(int trans, int move, int color, int action);
static int autohelperread_attack10(int trans, int move, int color, int action);
static int autohelperread_attack11(int trans, int move, int color, int action);
static int autohelperread_attack12(int trans, int move, int color, int action);
static int autohelperread_attack13(int trans, int move, int color, int action);
static int autohelperread_attack14(int trans, int move, int color, int action);
static int autohelperread_attack15(int trans, int move, int color, int action);
static int autohelperread_attack16(int trans, int move, int color, int action);
static int autohelperread_attack17(int trans, int move, int color, int action);
static int autohelperread_attack18(int trans, int move, int color, int action);
static int autohelperread_attack19(int trans, int move, int color, int action);
static int autohelperread_attack20(int trans, int move, int color, int action);
static int autohelperread_attack21(int trans, int move, int color, int action);
static int autohelperread_attack22(int trans, int move, int color, int action);
static int autohelperread_attack23(int trans, int move, int color, int action);
static int autohelperread_attack24(int trans, int move, int color, int action);
static int autohelperread_attack25(int trans, int move, int color, int action);

/* extern struct pattern read_attack[]; */
static struct pattern read_attack[] = {
  {read_attack0,8,8, "RA000",-1,-1,2,1,3,2,0x0,649,
    { 0xc0f0f0fc, 0xfcf00000, 0x3c3c0c00, 0x033fff00, 0x00f0fc00, 0xf0f0c000, 0xff3f0300, 0x0c3c3cfc},
    { 0x40202004, 0x04a00000, 0x20200400, 0x01284000, 0x00a00400, 0x20204000, 0x40280100, 0x04202040}
   , 0x1000400,80.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack0,3,0.010000},
  {read_attack1,2,4, "RA000a",0,0,0,1,0,1,0x0,721,
    { 0x003c0000, 0x00303000, 0x00f00000, 0x30300000, 0x30300000, 0x003c0000, 0x00303000, 0x00f00000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x3000400,1.000000,100.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack1,3,0.000000},
  {read_attack2,5,8, "RA001",-1,0,1,2,2,2,0x0,721,
    { 0x043d0400, 0x00307410, 0x40f04000, 0x74300000, 0x74300000, 0x043d0400, 0x00307410, 0x40f04000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x1000400,45.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack2,3,0.050000},
  {read_attack3,5,8, "RA002",-1,-1,0,1,1,2,0x0,683,
    { 0xfcf00000, 0x3c3c0c00, 0x003cfc00, 0xc0f0f000, 0x0c3c3c00, 0x00f0fc00, 0xf0f0c000, 0xfc3c0000},
    { 0x08a00000, 0x20200800, 0x00288000, 0x80202000, 0x08202000, 0x00a00800, 0x20208000, 0x80280000}
   , 0x1000400,71.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack3,3,0.101456},
  {read_attack4,4,8, "RA007",0,0,1,1,1,1,0x0,721,
    { 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000},
    { 0x00202000, 0x00a00000, 0x20200000, 0x00280000, 0x00a00000, 0x20200000, 0x00280000, 0x00202000}
   , 0x3000400,55.000000,71.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack4,3,0.050000},
  {read_attack5,4,8, "RA008",0,0,1,1,1,1,0x0,721,
    { 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000},
    { 0x00202000, 0x00a00000, 0x20200000, 0x00280000, 0x00a00000, 0x20200000, 0x00280000, 0x00202000}
   , 0x1000400,68.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack5,3,0.080000},
  {read_attack6,3,8, "RA101",0,-1,1,0,1,1,0x0,648,
    { 0x00f0c000, 0xf0300000, 0x0c3c0000, 0x00303c00, 0x0030f000, 0xc0f00000, 0x3c300000, 0x003c0c00},
    { 0x00900000, 0x20100000, 0x00180000, 0x00102000, 0x00102000, 0x00900000, 0x20100000, 0x00180000}
   , 0x3000400,10.000000,73.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack6,0,0.016000},
  {read_attack7,3,8, "RA101a",0,-2,0,0,0,2,0x0,610,
    { 0x00f00000, 0x30300000, 0x003f0000, 0x00303030, 0x00303030, 0x00f00000, 0x30300000, 0x003f0000},
    { 0x00900000, 0x20100000, 0x00180000, 0x00102000, 0x00102000, 0x00900000, 0x20100000, 0x00180000}
   , 0x3000400,10.000000,72.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack7,0,0.016000},
  {read_attack8,2,4, "RA102",0,0,0,1,0,1,0x0,721,
    { 0x003c0000, 0x00303000, 0x00f00000, 0x30300000, 0x30300000, 0x003c0000, 0x00303000, 0x00f00000},
    { 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000, 0x00100000}
   , 0x3000400,0.000000,77.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack8,0,0.050000},
  {read_attack9,6,8, "RA200",0,-1,1,1,1,2,0x0,722,
    { 0x00fcfc00, 0xf0f0f000, 0xfcfc0000, 0x3c3c3c00, 0xf0f0f000, 0xfcfc0000, 0x3c3c3c00, 0x00fcfc00},
    { 0x00a41000, 0x20601000, 0x10680000, 0x10242000, 0x10602000, 0x10a40000, 0x20241000, 0x00681000}
   , 0x1000400,14.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack9,3,0.050000},
  {read_attack10,4,8, "RA201",0,0,1,1,1,1,0x0,722,
    { 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000},
    { 0x00241000, 0x00601000, 0x10600000, 0x10240000, 0x10600000, 0x10240000, 0x00241000, 0x00601000}
   , 0x1000400,13.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack10,3,0.061456},
  {read_attack11,3,4, "RA202",0,0,0,2,0,2,0x0,758,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00180000, 0x00102000, 0x00900000, 0x20100000, 0x20100000, 0x00180000, 0x00102000, 0x00900000}
   , 0x1000400,50.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack11,0,0.028240},
  {read_attack12,3,8, "RA202a",0,0,1,1,1,1,0x0,722,
    { 0x003c0c00, 0x0030f000, 0xc0f00000, 0x3c300000, 0xf0300000, 0x0c3c0000, 0x00303c00, 0x00f0c000},
    { 0x00180000, 0x00102000, 0x00900000, 0x20100000, 0x20100000, 0x00180000, 0x00102000, 0x00900000}
   , 0x1000400,50.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack12,0,0.028240},
  {read_attack13,4,4, "RA203",0,0,0,3,0,3,0x0,795,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00210000, 0x00200010, 0x00200000, 0x00200000, 0x00200000, 0x00210000, 0x00200010, 0x00200000}
   , 0x1000400,50.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack13,3,0.060160},
  {read_attack14,4,8, "RA203a",0,0,1,2,1,2,0x0,759,
    { 0x003f0300, 0x003030f0, 0x00f00000, 0x30300000, 0x30300000, 0x033f0000, 0x0030303c, 0x00f00000},
    { 0x00210000, 0x00200010, 0x00200000, 0x00200000, 0x00200000, 0x00210000, 0x00200010, 0x00200000}
   , 0x1000400,48.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack14,3,0.060160},
  {read_attack15,4,8, "RA205",0,-1,1,0,1,1,0x0,648,
    { 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0x003c3c00},
    { 0x00900000, 0x20100000, 0x00180000, 0x00102000, 0x00102000, 0x00900000, 0x20100000, 0x00180000}
   , 0x1000400,35.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack15,0,0.029018},
  {read_attack16,3,8, "RA205a",0,-2,0,0,0,2,0x0,610,
    { 0x00f00000, 0x30300000, 0x003f0000, 0x00303030, 0x00303030, 0x00f00000, 0x30300000, 0x003f0000},
    { 0x00900000, 0x20100000, 0x00180000, 0x00102000, 0x00102000, 0x00900000, 0x20100000, 0x00180000}
   , 0x1000400,36.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack16,0,0.029018},
  {read_attack17,6,8, "RA205b",0,-2,1,0,1,2,0x0,611,
    { 0x00f0f000, 0xf0f00000, 0x3f3f0000, 0x003c3c3c, 0x00f0f0f0, 0xf0f00000, 0x3c3c0000, 0x003f3f00},
    { 0x00908000, 0xa0100000, 0x08190000, 0x00102810, 0x0010a010, 0x80900000, 0x28100000, 0x00190800}
   , 0x1000400,30.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack17,0,0.029018},
  {read_attack18,4,8, "RA300",-1,-2,0,0,1,2,0x0,609,
    { 0xc0f00000, 0x3c300000, 0x003c0f00, 0x0030f0c0, 0x00303c0c, 0x00f0c000, 0xf0300000, 0x0f3c0000},
    { 0x80200000, 0x08200000, 0x00200800, 0x00208000, 0x00200800, 0x00208000, 0x80200000, 0x08200000}
   , 0x1000400,59.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack18,3,0.040000},
  {read_attack19,4,8, "RA301",-1,0,0,1,1,1,0x0,683,
    { 0x3c3c0000, 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000, 0xf0f00000},
    { 0x00180000, 0x00102000, 0x00900000, 0x20100000, 0x20100000, 0x00180000, 0x00102000, 0x00900000}
   , 0x1000400,58.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack19,0,0.080000},
  {read_attack20,2,8, "RA302",0,-1,0,0,0,1,0x0,647,
    { 0x00f00000, 0x30300000, 0x003c0000, 0x00303000, 0x00303000, 0x00f00000, 0x30300000, 0x003c0000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x2000400,0.000000,79.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack20,3,0.040000},
  {read_attack21,4,8, "RA303",0,0,1,1,1,1,0x0,721,
    { 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000},
    { 0x00202000, 0x00a00000, 0x20200000, 0x00280000, 0x00a00000, 0x20200000, 0x00280000, 0x00202000}
   , 0x1000400,50.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack21,3,0.036880},
  {read_attack22,4,8, "RA401",-1,-1,0,0,1,1,0x0,646,
    { 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000, 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000},
    { 0x10200000, 0x00240000, 0x00201000, 0x00600000, 0x00240000, 0x00201000, 0x00600000, 0x10200000}
   , 0x1000400,49.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack22,3,0.058000},
  {read_attack23,3,4, "RA997",0,0,0,2,0,2,0x0,758,
    { 0x003f0000, 0x00303030, 0x00f00000, 0x30300000, 0x30300000, 0x003f0000, 0x00303030, 0x00f00000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x3000400,9.000000,49.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack23,3,0.010000},
  {read_attack24,3,8, "RA998",0,0,1,1,1,1,0x0,722,
    { 0x003c0c00, 0x0030f000, 0xc0f00000, 0x3c300000, 0xf0300000, 0x0c3c0000, 0x00303c00, 0x00f0c000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x3000400,9.000000,49.000000,0.000000,0.000000,0.000000,0.000000,0.000000,3,NULL,autohelperread_attack24,3,0.000000},
  {read_attack25,4,8, "RA999",0,0,1,1,1,1,0x0,722,
    { 0x003c3c00, 0x00f0f000, 0xf0f00000, 0x3c3c0000, 0xf0f00000, 0x3c3c0000, 0x003c3c00, 0x00f0f000},
    { 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000, 0x00200000}
   , 0x1000400,25.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1,NULL,autohelperread_attack25,3,0.000000},
  {NULL, 0,0,NULL,0,0,0,0,0,0,0,0,{0,0,0,0,0,0,0,0},{0,0,0,0,0,0,0,0},0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0,NULL,NULL,0,0.0}
};

static int
autohelperread_attack0(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(720, trans, move);

  return  rgoal[a] == 1 &&  countlib(a) == 3;
}

static int
autohelperread_attack1(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);

  a = AFFINE_TRANSFORM(647, trans, move);

  if (!action)
    return  rgoal[a] == 1;
   { int ostar = accuratelib(move, color, MAX_LIBERTIES, NULL); int xstar = accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL); if (countlib(a) == 2 && ostar > 1 && xstar >=4)   ((read_attack + 1)->value) = 80; else if (countlib(a) == 2 && ostar > 1 && xstar > 2)   ((read_attack + 1)->value) = 72; else if (countlib(a) == 2 && ostar > 1)   ((read_attack + 1)->value) = 70; else if ((countlib(a) == 1 || xstar > countlib(a)+4))   ((read_attack + 1)->value) = 97; else if (xstar > countlib(a)+3 && ostar > 1)   ((read_attack + 1)->value) = 96; else if (xstar > countlib(a)+2 && ostar > 1)   ((read_attack + 1)->value) = 95; else if (xstar > countlib(a)+1 && ostar > 2)   ((read_attack + 1)->value) = 64; else if (xstar > countlib(a)+1 && ostar > 1)   ((read_attack + 1)->value) = 63; else if (xstar > countlib(a)+1  && ostar > 1)   ((read_attack + 1)->value) = 62; else if (xstar > countlib(a) && ostar > 2)   ((read_attack + 1)->value) = 61; else if (xstar > countlib(a) && ostar > 1)   ((read_attack + 1)->value) = 60; else if (xstar == countlib(a)	   && ostar > 1          && (ostar == xstar || ostar >= countlib(a)))   ((read_attack + 1)->value) = 60; else if (countlib(a) == 3 && ostar >= 5)   ((read_attack + 1)->value) = 53; else if (countlib(a) == 3 && ostar >= 4)   ((read_attack + 1)->value) = 52; else if (countlib(a) == 3 && ostar >= 3)   ((read_attack + 1)->value) = 51; else if (xstar >= countlib(a) && ostar > 1)   ((read_attack + 1)->value) = 15; else   ((read_attack + 1)->value) = 2;};

  return 0;
}

static int
autohelperread_attack2(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);

  return  rgoal[a] == 1 && accuratelib(move, color, MAX_LIBERTIES, NULL) == 1;
}

static int
autohelperread_attack3(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(685, trans, move);
  b = AFFINE_TRANSFORM(647, trans, move);

  return  rgoal[a] == 1 && accuratelib(move, color, MAX_LIBERTIES, NULL) == 1 && accuratelib(b, color, MAX_LIBERTIES, NULL) == 2 && accuratelib(b, OTHER_COLOR(color), MAX_LIBERTIES, NULL) <= countlib(a) && countlib(a) == 2;
}

static int
autohelperread_attack4(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);

  a = AFFINE_TRANSFORM(647, trans, move);
  b = AFFINE_TRANSFORM(685, trans, move);

  if (!action)
    return  rgoal[a] == 1 && accuratelib(b, OTHER_COLOR(color), MAX_LIBERTIES, NULL)==1;
   if (goallib == 2)   ((read_attack + 4)->value) = 71; else   ((read_attack + 4)->value) = 55;;

  return 0;
}

static int
autohelperread_attack5(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);
  b = AFFINE_TRANSFORM(685, trans, move);

  return  0 && rgoal[a] == 1 && accuratelib(b, OTHER_COLOR(color), MAX_LIBERTIES, NULL) <= 2 && accuratelib(move, color, MAX_LIBERTIES, NULL) > 1;
}

static int
autohelperread_attack6(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);

  a = AFFINE_TRANSFORM(683, trans, move);
  b = AFFINE_TRANSFORM(720, trans, move);

  if (!action)
    return  countlib(a) == 1  && countlib(b) <=2;
   if (goallib <= countlib(b))   ((read_attack + 6)->value) = 10; else if (!is_ko_point(move))   ((read_attack + 6)->value) = 73; else   ((read_attack + 6)->value) = 10;;

  return 0;
}

static int
autohelperread_attack7(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);

  a = AFFINE_TRANSFORM(721, trans, move);
  b = AFFINE_TRANSFORM(758, trans, move);

  if (!action)
    return  countlib(a) == 1  && countlib(b) <=2;
   if (is_ko_point(move))   ((read_attack + 7)->value) = 10; if (countlib(b) >= goallib)   ((read_attack + 7)->value) = 60; else if (countlib(b) == 1)   ((read_attack + 7)->value) = 76; else   ((read_attack + 7)->value) = 72;;

  return 0;
}

static int
autohelperread_attack8(int trans, int move, int color, int action)
{
  int A;
  UNUSED(color);

  A = AFFINE_TRANSFORM(647, trans, move);

  if (!action)
    return  accuratelib(move, color, MAX_LIBERTIES, NULL) > 1;
   { int ostar = accuratelib(move, color, MAX_LIBERTIES, NULL); if (countlib(A) == 1 && ostar >= 3)   ((read_attack + 8)->value) = 78; else if (countlib(A) == 1)   ((read_attack + 8)->value) = 72; else if (countlib(A) == 2 && ostar > 2)   /* FIXME: i.e. backfill hack; causes explosion; see reading:35*/   ((read_attack + 8)->value) = 10; else   ((read_attack + 8)->value) = 0;};

  return 0;
}

static int
autohelperread_attack9(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(610, trans, move);

  return accuratelib(a, color, MAX_LIBERTIES, NULL) == 1;
}

static int
autohelperread_attack10(int trans, int move, int color, int action)
{
  int a, B;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(646, trans, move);
  B = AFFINE_TRANSFORM(647, trans, move);

  return rgoal[a] == 1 && countlib(B) == 2 && accuratelib(move, color, MAX_LIBERTIES, NULL) >= 2 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) >= 2&& ((goallib == 3 && stackp <= backfill2_depth)    || (goallib == 2 && stackp <= backfill_depth));
}

static int
autohelperread_attack11(int trans, int move, int color, int action)
{
  int a, B;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(647, trans, move);
  B = AFFINE_TRANSFORM(610, trans, move);

  return  0 && rgoal[B] == 2 && countlib(a) <= 2 && countlib(B) <= goallib && (is_ko_point(move) || accuratelib(move, color, MAX_LIBERTIES, NULL) > 1);
}

static int
autohelperread_attack12(int trans, int move, int color, int action)
{
  int a, B;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(683, trans, move);
  B = AFFINE_TRANSFORM(646, trans, move);

  return  0 && rgoal[B] == 2 && countlib(a) <= 2 && countlib(B) <= goallib && (is_ko_point(move) || accuratelib(move, color, MAX_LIBERTIES, NULL) > 1);
}

static int
autohelperread_attack13(int trans, int move, int color, int action)
{
  int a, c, B;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(573, trans, move);
  c = AFFINE_TRANSFORM(610, trans, move);
  B = AFFINE_TRANSFORM(647, trans, move);

  return  rgoal[a] == 1 && countlib(a) >= accuratelib(c, color, MAX_LIBERTIES, NULL) && accuratelib(move, color, MAX_LIBERTIES, NULL) > countlib(B);
}

static int
autohelperread_attack14(int trans, int move, int color, int action)
{
  int a, c, B;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(609, trans, move);
  c = AFFINE_TRANSFORM(646, trans, move);
  B = AFFINE_TRANSFORM(683, trans, move);

  return  rgoal[a] == 1 && countlib(a) >= accuratelib(c, color, MAX_LIBERTIES, NULL) && accuratelib(move, color, MAX_LIBERTIES, NULL) > countlib(B);
}

static int
autohelperread_attack15(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(683, trans, move);
  b = AFFINE_TRANSFORM(720, trans, move);

  return  countlib(b) < goallib && countlib(a) == countlib(b) && accuratelib(move, color, MAX_LIBERTIES, NULL) >= countlib(b);
}

static int
autohelperread_attack16(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(721, trans, move);
  b = AFFINE_TRANSFORM(758, trans, move);

  return  countlib(b) < goallib && countlib(a) == countlib(b) && accuratelib(move, color, MAX_LIBERTIES, NULL) >= countlib(b);
}

static int
autohelperread_attack17(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(720, trans, move);
  b = AFFINE_TRANSFORM(757, trans, move);

  return  countlib(b) < goallib && countlib(a) == countlib(b) && accuratelib(move, color, MAX_LIBERTIES, NULL) >= countlib(b);
}

static int
autohelperread_attack18(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(721, trans, move);

  return countlib(a) == 2 && accuratelib(move, color, MAX_LIBERTIES, NULL) > 1;
}

static int
autohelperread_attack19(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(722, trans, move);
  b = AFFINE_TRANSFORM(721, trans, move);

  return  rgoal[a] == 3 && accuratelib(b, color, MAX_LIBERTIES, NULL) <= 1  && accuratelib(move, color, MAX_LIBERTIES, NULL) > 2;
}

static int
autohelperread_attack20(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);

  a = AFFINE_TRANSFORM(721, trans, move);

  if (!action)
    return  (countlib(a) <= 3 && accuratelib(move, color, MAX_LIBERTIES, NULL) >= 2);
   if (countlib(a) == 2)   ((read_attack + 20)->value) = 49; else if (countlib(a) == 1 && countstones(a) > 1)   ((read_attack + 20)->value) = 79; else if (countlib(a) == 1)   ((read_attack + 20)->value) = 48; else if (stackp <= backfill_depth          && stackp <= superstring_depth /* || !atari_possible*/)   ((read_attack + 20)->value) = 12; else   ((read_attack + 20)->value) = 0;;

  return 0;
}

static int
autohelperread_attack21(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(648, trans, move);
  b = AFFINE_TRANSFORM(685, trans, move);

  return  goallib < countlib(a) && countlib(a) <=3 && accuratelib(move, color, MAX_LIBERTIES, NULL) >= 2 && accuratelib(b, OTHER_COLOR(color), MAX_LIBERTIES, NULL) <= 4;
}

static int
autohelperread_attack22(int trans, int move, int color, int action)
{
  int b, A;
  UNUSED(color);
  UNUSED(action);

  b = AFFINE_TRANSFORM(685, trans, move);
  A = AFFINE_TRANSFORM(721, trans, move);

  return countlib(A) <= 3 && accuratelib(b, color, MAX_LIBERTIES, NULL) <= 3 && accuratelib(move, OTHER_COLOR(color), MAX_LIBERTIES, NULL) > 2;
}

static int
autohelperread_attack23(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);

  a = AFFINE_TRANSFORM(610, trans, move);
  b = AFFINE_TRANSFORM(647, trans, move);

  if (!action)
    return  rgoal[a] == 1 && goallib < 3;
   if (accuratelib(b, color, MAX_LIBERTIES, NULL) <= 1)   ((read_attack + 23)->value) = 49; else   ((read_attack + 23)->value) = 9;;

  return 0;
}

static int
autohelperread_attack24(int trans, int move, int color, int action)
{
  int a, b;
  UNUSED(color);

  a = AFFINE_TRANSFORM(646, trans, move);
  b = AFFINE_TRANSFORM(683, trans, move);

  if (!action)
    return  rgoal[a] == 1;
   if (accuratelib(b, color, MAX_LIBERTIES, NULL) <= 1)   ((read_attack + 24)->value) = 49; else   ((read_attack + 24)->value) = 0;;

  return 0;
}

static int
autohelperread_attack25(int trans, int move, int color, int action)
{
  int a;
  UNUSED(color);
  UNUSED(action);

  a = AFFINE_TRANSFORM(646, trans, move);

  return  rgoal[a] == 1;
}


struct pattern_db read_attack_db = {
  -1,
  0,
  read_attack
 , NULL
};

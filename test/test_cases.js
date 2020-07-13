exports.test_cases = [
  {
    stmt:":H/0.707",
    id:"1",
    expect:"[] H [\n" + 
      "1  1\n" + 
      "1 -1]\n"
  },
  {
    stmt:":C02:C02",
    id:"2",
    expect:"[] C02 C02 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1]\n"
  },
  {
    stmt:":H",
    id:"3",
    expect:"[] H [\n" + 
      "0.707  0.707\n" + 
      "0.707 -0.707]\n"
  },
  {
    stmt:":H2",
    id:"4",
    expect:"[] H2 [\n" + 
      "0.5  0.5  0.5  0.5\n" + 
      "0.5 -0.5  0.5 -0.5\n" + 
      "0.5  0.5 -0.5 -0.5\n" + 
      "0.5 -0.5 -0.5  0.5]\n"
  },
  {
    stmt:":H3",
    id:"5",
    expect:"[] H3 [\n" + 
      "0.354  0.354  0.354  0.354  0.354  0.354  0.354  0.354\n" + 
      "0.354 -0.354  0.354 -0.354  0.354 -0.354  0.354 -0.354\n" + 
      "0.354  0.354 -0.354 -0.354  0.354  0.354 -0.354 -0.354\n" + 
      "0.354 -0.354 -0.354  0.354  0.354 -0.354 -0.354  0.354\n" + 
      "0.354  0.354  0.354  0.354 -0.354 -0.354 -0.354 -0.354\n" + 
      "0.354 -0.354  0.354 -0.354 -0.354  0.354 -0.354  0.354\n" + 
      "0.354  0.354 -0.354 -0.354 -0.354 -0.354  0.354  0.354\n" + 
      "0.354 -0.354 -0.354  0.354 -0.354  0.354  0.354 -0.354]\n"
  },
  {
    stmt:":H3:iiX",
    id:"6",
    expect:"[] H3 iiX [\n" + 
      "0.354 -0.354  0.354 -0.354  0.354 -0.354  0.354 -0.354\n" + 
      "0.354  0.354  0.354  0.354  0.354  0.354  0.354  0.354\n" + 
      "0.354 -0.354 -0.354  0.354  0.354 -0.354 -0.354  0.354\n" + 
      "0.354  0.354 -0.354 -0.354  0.354  0.354 -0.354 -0.354\n" + 
      "0.354 -0.354  0.354 -0.354 -0.354  0.354 -0.354  0.354\n" + 
      "0.354  0.354  0.354  0.354 -0.354 -0.354 -0.354 -0.354\n" + 
      "0.354 -0.354 -0.354  0.354 -0.354  0.354  0.354 -0.354\n" + 
      "0.354  0.354 -0.354 -0.354 -0.354 -0.354  0.354  0.354]\n"
  },
  {
    stmt:":HHH:iiX",
    id:"7",
    expect:"[] HHH iiX [\n" + 
      "0.354 -0.354  0.354 -0.354  0.354 -0.354  0.354 -0.354\n" + 
      "0.354  0.354  0.354  0.354  0.354  0.354  0.354  0.354\n" + 
      "0.354 -0.354 -0.354  0.354  0.354 -0.354 -0.354  0.354\n" + 
      "0.354  0.354 -0.354 -0.354  0.354  0.354 -0.354 -0.354\n" + 
      "0.354 -0.354  0.354 -0.354 -0.354  0.354 -0.354  0.354\n" + 
      "0.354  0.354  0.354  0.354 -0.354 -0.354 -0.354 -0.354\n" + 
      "0.354 -0.354 -0.354  0.354 -0.354  0.354  0.354 -0.354\n" + 
      "0.354  0.354 -0.354 -0.354 -0.354 -0.354  0.354  0.354]\n"
  },
  {
    stmt:"0.707|10>-0.707|0>",
    id:"8",
    expect:"[-0.707 0 0.707 0]  [-0.707 0 0.707 0]\n"
  },
  {
    stmt:"(0.707|10>-0.707|0>)(0.707|10>-0.707|0>)",
    id:"9",
    expect:"[-0.707 0 0.707 0]  [0.5 0 -0.5 0 0 0 0 0 -0.5 0 0.5 0 0 0 0 0]\n"
  },
  {
    stmt:"(|00>)(|1>):H2i:iiX",
    id:"10",
    expect:"[1 0 0 0]  H2i iiX [0.5 0 0.5 0 0.5 0 0.5 0]\n"
  },
  {
    stmt:"1.0|0>",
    id:"11",
    expect:"[1 0]  [1 0]\n"
  },
  {
    stmt:"-1.0|10>",
    id:"12",
    expect:"[0 0 -1 0]  [0 0 -1 0]\n"
  },
  {
    stmt:"-|10>",
    id:"13",
    expect:"[0 0 -1 0]  [0 0 -1 0]\n"
  },
  {
    stmt:"(1.0|0>)",
    id:"14",
    expect:"[1 0]  [1 0]\n"
  },
  {
    stmt:"(-1.0|0>)",
    id:"15",
    expect:"[-1 0]  [-1 0]\n"
  },
  {
    stmt:"(|01>)(|10>)",
    id:"16",
    expect:"[0 1 0 0]  [0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"(|01>)(|10>):H4",
    id:"17",
    expect:"[0 1 0 0]  H4 [0.25 0.25 -0.25 -0.25 -0.25 -0.25 0.25 0.25 0.25 0.25 -0.25 -0.25 -0.25 -0.25 0.25 0.25]\n"
  },
  {
    stmt:".57735|0>+.81650|1>:M",
    id:"18",
    expect:"  M1={0:0.333, 1:0.667}\n" + 
      "[0.577 0.817]  [0.577 0.817]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/1.0",
    id:"19",
    expect:"[] Si iH C01 iH iS [\n" + 
      "1 0  0  0\n" + 
      "0 1i 0  0\n" + 
      "0 0  1i 0\n" + 
      "0 0  0  1]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/1.0i",
    id:"20",
    expect:"[] Si iH C01 iH iS [\n" + 
      "-1i 0 0  0 \n" + 
      " 0  1 0  0 \n" + 
      " 0  0 1  0 \n" + 
      " 0  0 0 -1i]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/-1.0",
    id:"21",
    expect:"[] Si iH C01 iH iS [\n" + 
      "-1  0   0   0\n" + 
      " 0 -1i  0   0\n" + 
      " 0  0  -1i  0\n" + 
      " 0  0   0  -1]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/0.0-1.0i",
    id:"22",
    expect:"[] Si iH C01 iH iS [\n" + 
      "1i  0  0 0 \n" + 
      "0  -1  0 0 \n" + 
      "0   0 -1 0 \n" + 
      "0   0  0 1i]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/0.0+1.0i",
    id:"23",
    expect:"[] Si iH C01 iH iS [\n" + 
      "-1i 0 0  0 \n" + 
      " 0  1 0  0 \n" + 
      " 0  0 1  0 \n" + 
      " 0  0 0 -1i]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/1.0-0.0i",
    id:"24",
    expect:"[] Si iH C01 iH iS [\n" + 
      "1 0  0  0\n" + 
      "0 1i 0  0\n" + 
      "0 0  1i 0\n" + 
      "0 0  0  1]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/1.0+0.0i",
    id:"25",
    expect:"[] Si iH C01 iH iS [\n" + 
      "1 0  0  0\n" + 
      "0 1i 0  0\n" + 
      "0 0  1i 0\n" + 
      "0 0  0  1]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/-1.0+1.0i",
    id:"26",
    expect:"[] Si iH C01 iH iS [\n" + 
      "-0.5+0.5i  0         0         0       \n" + 
      " 0        -0.5-0.5i  0         0       \n" + 
      " 0         0        -0.5-0.5i  0       \n" + 
      " 0         0         0        -0.5+0.5i]\n"
  },
  {
    stmt:":Si:iH:C01:iH:iS/-1.0-1.0i",
    id:"27",
    expect:"[] Si iH C01 iH iS [\n" + 
      "-0.5-0.5i 0        0         0       \n" + 
      " 0        0.5-0.5i 0         0       \n" + 
      " 0        0        0.5-0.5i  0       \n" + 
      " 0        0        0        -0.5-0.5i]\n"
  },
  {
    stmt:":iH:is:Cx:iH:iT:Cx:iT:iH:iS:iX:Si/0.707+0.707i",
    id:"28",
    expect:"[] iH is Cx iH iT Cx iT iH iS iX Si [\n" + 
      "1 0 0      0    \n" + 
      "0 1 0      0    \n" + 
      "0 0 0.707  0.707\n" + 
      "0 0 0.707 -0.707]\n"
  },
  {
    stmt:"-1i|0>:M",
    id:"29",
    expect:"  M1={0:1, 1:0}\n" + 
      "[i 0]  [i 0]\n"
  },
  {
    stmt:"-1i|01>:M2",
    id:"30",
    expect:"  M1={00:0, 01:1, 10:0, 11:0}\n" + 
      "[0 i 0 0]  [0 i 0 0]\n"
  },
  {
    stmt:"1i|10>:M2",
    id:"31",
    expect:"  M1={00:0, 01:0, 10:1, 11:0}\n" + 
      "[0 0 i 0]  [0 0 i 0]\n"
  },
  {
    stmt:"(1i|0>)(-1i|1>)",
    id:"32",
    expect:"[i 0]  [0 -1 0 0]\n"
  },
  {
    stmt:"(1i|1>)(1i|0>)",
    id:"33",
    expect:"[0 i]  [0 0 -1 0]\n"
  },
  {
    stmt:"(1i|0>)(-1i|1>):H2:M2",
    id:"34",
    expect:"  M1={00:0.25, 01:0.25, 10:0.25, 11:0.25}\n" + 
      "[i 0]  H2 [-0.5 0.5 -0.5 0.5]\n"
  },
  {
    stmt:":S",
    id:"35",
    expect:"[] S [\n" + 
      "1 0\n" + 
      "0 i]\n"
  },
  {
    stmt:":S01",
    id:"36",
    expect:"[] S01 [\n" + 
      "1 0 0 0\n" + 
      "0 1 0 0\n" + 
      "0 0 1 0\n" + 
      "0 0 0 i]\n"
  },
  {
    stmt:":T10",
    id:"37",
    expect:"[] T10 [\n" + 
      "1 0 0 0           \n" + 
      "0 1 0 0           \n" + 
      "0 0 1 0           \n" + 
      "0 0 0 0.707+0.707i]\n"
  },
  {
    stmt:":H01",
    id:"38",
    expect:"[] H01 [\n" + 
      "1 0 0      0    \n" + 
      "0 1 0      0    \n" + 
      "0 0 0.707  0.707\n" + 
      "0 0 0.707 -0.707]\n"
  },
  {
    stmt:":H10",
    id:"39",
    expect:"[] H10 [\n" + 
      "1 0     0  0    \n" + 
      "0 0.707 0  0.707\n" + 
      "0 0     1  0    \n" + 
      "0 0.707 0 -0.707]\n"
  },
  {
    stmt:":S02",
    id:"40",
    expect:"[] S02 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 i 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 i]\n"
  },
  {
    stmt:":S20",
    id:"41",
    expect:"[] S20 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 i 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 i]\n"
  },
  {
    stmt:":iX,I,X",
    id:"42",
    expect:"[] iX,I,X [\n" + 
      "0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0]\n"
  },
  {
    stmt:":X,I,Xi",
    id:"43",
    expect:"[] X,I,Xi [\n" + 
      "0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0\n" + 
      "0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:":X,I,X",
    id:"44",
    expect:"[] X,I,X [\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0]\n"
  },
  {
    stmt:":C01",
    id:"45",
    expect:"[] C01 [\n" + 
      "1 0 0 0\n" + 
      "0 1 0 0\n" + 
      "0 0 0 1\n" + 
      "0 0 1 0]\n"
  },
  {
    stmt:"|10>:C01:C10:C01",
    id:"46",
    expect:"[0 0 1 0]  C01 C10 C01 [0 1 0 0]\n"
  },
  {
    stmt:"|100>:C02:C20:C02",
    id:"47",
    expect:"[0 0 0 0 1 0 0 0]  C02 C20 C02 [0 1 0 0 0 0 0 0]\n"
  },
  {
    stmt:":Hii:S10i:T20:iHi:iS10:iiH:C02:C20:C02",
    id:"48",
    expect:"[] Hii S10i T20 iHi iS10 iiH C02 C20 C02 [\n" + 
      "0.354  0.354       0.354   0.354       0.354  0.354       0.354   0.354     \n" + 
      "0.354  0.25+0.25i  0.354i -0.25+0.25i -0.354 -0.25-0.25i -0.354i  0.25-0.25i\n" + 
      "0.354  0.354i     -0.354  -0.354i      0.354  0.354i     -0.354  -0.354i    \n" + 
      "0.354 -0.25+0.25i -0.354i  0.25+0.25i -0.354  0.25-0.25i  0.354i -0.25-0.25i\n" + 
      "0.354 -0.354       0.354  -0.354       0.354 -0.354       0.354  -0.354     \n" + 
      "0.354 -0.25-0.25i  0.354i  0.25-0.25i -0.354  0.25+0.25i -0.354i -0.25+0.25i\n" + 
      "0.354 -0.354i     -0.354   0.354i      0.354 -0.354i     -0.354   0.354i    \n" + 
      "0.354  0.25-0.25i -0.354i -0.25-0.25i -0.354 -0.25+0.25i  0.354i  0.25+0.25i]\n"
  },
  {
    stmt:"ss:Sw03:Sw01ii:iSw01i",
    id:"49",
    expect:"[] Sw03 Sw01ii iSw01i [\n" + 
      "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]\n"
  },
  {
    stmt:"|0001>:ss",
    id:"50",
    expect:"[0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0]  ss [0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|0010>:ss",
    id:"51",
    expect:"[0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0]  ss [0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|0011>:ss",
    id:"52",
    expect:"[0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0]  ss [0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|0100>:ss",
    id:"53",
    expect:"[0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0]  ss [0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|0101>:ss",
    id:"54",
    expect:"[0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0]  ss [0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0]\n"
  },
  {
    stmt:"|0110>:ss",
    id:"55",
    expect:"[0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0]  ss [0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"|0111>:ss",
    id:"56",
    expect:"[0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0]  ss [0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0]\n"
  },
  {
    stmt:"|1000>:ss",
    id:"57",
    expect:"[0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0]  ss [0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|1001>:ss",
    id:"58",
    expect:"[0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0]  ss [0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|1010>:ss",
    id:"59",
    expect:"[0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0]  ss [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|1011>:ss",
    id:"60",
    expect:"[0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0]  ss [0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|1100>:ss",
    id:"61",
    expect:"[0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0]  ss [0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|1101>:ss",
    id:"62",
    expect:"[0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]  ss [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0]\n"
  },
  {
    stmt:"|1110>:ss",
    id:"63",
    expect:"[0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0]  ss [0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]\n"
  },
  {
    stmt:"|00000>:iC10ii:iX,H,S,Y:iiT,Zi:iit,Zi:iX,H,s,Y:iC10ii:M5",
    id:"64",
    expect:"  M1={00000:1, 00001:0, 00010:0, 00011:0, 00100:0, 00101:0, 00110:0, 00111:0, 01000:0, 01001:0, 01010:0, 01011:0, 01100:0, 01101:0, 01110:0, 01111:0, 10000:0, 10001:0, 10010:0, 10011:0, 10100:0, 10101:0, 10110:0, 10111:0, 11000:0, 11001:0, 11010:0, 11011:0, 11100:0, 11101:0, 11110:0, 11111:0}\n" + 
      "[1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]  iC10ii iX,H,S,Y iiT,Zi iit,Zi iX,H,s,Y iC10ii [1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|00000>:iiXii:iHiii:isiii:iC10ii:iHiii:iTiii:iC10ii:iTiii:iHiii:iSiii:iXiii:iiSii:iMiii",
    id:"65",
    expect:"  M1={0:0.5, 1:0.5}\n" + 
      "[1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]  iiXii iHiii isiii iC10ii iHiii iTiii iC10ii iTiii iHiii iSiii iXiii iiSii [0 0 0 0 0.5+0.5i 0 0 0 0 0 0 0 0.5+0.5i 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:":X2:iH:C01:iH:X2",
    id:"66",
    expect:"[] X2 iH C01 iH X2 [\n" + 
      "-1 0 0 0\n" + 
      " 0 1 0 0\n" + 
      " 0 0 1 0\n" + 
      " 0 0 0 1]\n"
  },
  {
    stmt:":S20",
    id:"67",
    expect:"[] S20 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 i 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 i]\n"
  },
  {
    stmt:":Sii",
    id:"68",
    expect:"[] Sii [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 i 0 0 0\n" + 
      "0 0 0 0 0 i 0 0\n" + 
      "0 0 0 0 0 0 i 0\n" + 
      "0 0 0 0 0 0 0 i]\n"
  },
  {
    stmt:"enc:C01i:C02",
    id:"69",
    expect:"[] C01i C02 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"dec:C01i:C02:Tf210",
    id:"70",
    expect:"[] C01i C02 Tf210 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 1 0 0 0 0]\n"
  },
  {
    stmt:"noerr:I3",
    id:"71",
    expect:"[] I3 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1]\n"
  },
  {
    stmt:"err11x:iiX",
    id:"72",
    expect:"[] iiX [\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0]\n"
  },
  {
    stmt:"err12x:iXi",
    id:"73",
    expect:"[] iXi [\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 1 0 0]\n"
  },
  {
    stmt:"err13x:Xii",
    id:"74",
    expect:"[] Xii [\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0]\n"
  },
  {
    stmt:"err21x:iX2",
    id:"75",
    expect:"[] iX2 [\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"err22x:X,I,X",
    id:"76",
    expect:"[] X,I,X [\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0]\n"
  },
  {
    stmt:"err23x:X2i",
    id:"77",
    expect:"[] X2i [\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0]\n"
  },
  {
    stmt:"err3x:X3",
    id:"78",
    expect:"[] X3 [\n" + 
      "0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "1 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|000>:enc:noerr:C01i:C02:Tf210",
    id:"79",
    expect:"[1 0 0 0 0 0 0 0]  enc noerr C01i C02 Tf210 [1 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|000>:enc:err11x:C01i:C02:Tf210",
    id:"80",
    expect:"[1 0 0 0 0 0 0 0]  enc err11x C01i C02 Tf210 [0 1 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|000>:enc:err12x:C01i:C02:Tf210",
    id:"81",
    expect:"[1 0 0 0 0 0 0 0]  enc err12x C01i C02 Tf210 [0 0 1 0 0 0 0 0]\n"
  },
  {
    stmt:"|000>:enc:err13x:C01i:C02:Tf210",
    id:"82",
    expect:"[1 0 0 0 0 0 0 0]  enc err13x C01i C02 Tf210 [0 0 0 1 0 0 0 0]\n"
  },
  {
    stmt:"|000>:enc:err21x:C01i:C02:Tf210",
    id:"83",
    expect:"[1 0 0 0 0 0 0 0]  enc err21x C01i C02 Tf210 [0 0 0 0 0 0 0 1]\n"
  },
  {
    stmt:"|000>:enc:err22x:C01i:C02:Tf210",
    id:"84",
    expect:"[1 0 0 0 0 0 0 0]  enc err22x C01i C02 Tf210 [0 0 0 0 0 0 1 0]\n"
  },
  {
    stmt:"|000>:enc:err23x:C01i:C02:Tf210",
    id:"85",
    expect:"[1 0 0 0 0 0 0 0]  enc err23x C01i C02 Tf210 [0 0 0 0 0 1 0 0]\n"
  },
  {
    stmt:"|000>:enc:err3x:C01i:C02:Tf210",
    id:"86",
    expect:"[1 0 0 0 0 0 0 0]  enc err3x C01i C02 Tf210 [0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"|100>:enc:noerr:C01i:C02:Tf210",
    id:"87",
    expect:"[0 0 0 0 1 0 0 0]  enc noerr C01i C02 Tf210 [0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"|100>:enc:err11x:C01i:C02:Tf210",
    id:"88",
    expect:"[0 0 0 0 1 0 0 0]  enc err11x C01i C02 Tf210 [0 0 0 0 0 1 0 0]\n"
  },
  {
    stmt:"|100>:enc:err12x:C01i:C02:Tf210",
    id:"89",
    expect:"[0 0 0 0 1 0 0 0]  enc err12x C01i C02 Tf210 [0 0 0 0 0 0 1 0]\n"
  },
  {
    stmt:"|100>:enc:err13x:C01i:C02:Tf210",
    id:"90",
    expect:"[0 0 0 0 1 0 0 0]  enc err13x C01i C02 Tf210 [0 0 0 0 0 0 0 1]\n"
  },
  {
    stmt:"|100>:enc:err21x:C01i:C02:Tf210",
    id:"91",
    expect:"[0 0 0 0 1 0 0 0]  enc err21x C01i C02 Tf210 [0 0 0 1 0 0 0 0]\n"
  },
  {
    stmt:"|100>:enc:err22x:C01i:C02:Tf210",
    id:"92",
    expect:"[0 0 0 0 1 0 0 0]  enc err22x C01i C02 Tf210 [0 0 1 0 0 0 0 0]\n"
  },
  {
    stmt:"|100>:enc:err23x:C01i:C02:Tf210",
    id:"93",
    expect:"[0 0 0 0 1 0 0 0]  enc err23x C01i C02 Tf210 [0 1 0 0 0 0 0 0]\n"
  },
  {
    stmt:"|100>:enc:err3x:C01i:C02:Tf210",
    id:"94",
    expect:"[0 0 0 0 1 0 0 0]  enc err3x C01i C02 Tf210 [1 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:"CRY:iTf012:iC01i:Tf023",
    id:"95",
    expect:"[] iTf012 iC01i Tf023 [\n" + 
      "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"ICY:Tf023:iC01i:iTf012",
    id:"96",
    expect:"[] Tf023 iC01i iTf012 [\n" + 
      "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0]\n"
  },
  {
    stmt:"SUM:iC01:C02",
    id:"97",
    expect:"[] iC01 C02 [\n" + 
      "1 0 0 0 0 0 0 0\n" + 
      "0 1 0 0 0 0 0 0\n" + 
      "0 0 0 1 0 0 0 0\n" + 
      "0 0 1 0 0 0 0 0\n" + 
      "0 0 0 0 0 1 0 0\n" + 
      "0 0 0 0 1 0 0 0\n" + 
      "0 0 0 0 0 0 1 0\n" + 
      "0 0 0 0 0 0 0 1]\n"
  },
  {
    stmt:"CRYa:CRYiiiiii",
    id:"98",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"ICYa:ICYiiiiii",
    id:"99",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"CRYb:iiiCRYiii",
    id:"100",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"ICYb:iiiICYiii",
    id:"101",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"CRYc:iiiiiiCRY",
    id:"102",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"ICYc:iiiiiiICY",
    id:"103",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"SUMa:SUMiiiiiii",
    id:"104",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"SUMb:iiiSUMiiii",
    id:"105",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"SUMc:iiiiiiSUMi",
    id:"106",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"COUT:iiiiiiiC01i",
    id:"107",
    expect:"large 1024x1024 matrix display suppressed\n"
  },
  {
    stmt:"|0110000000>:CRYa:CRYb:CRYc:COUT:SUMc:ICYb:SUMb:ICYa:SUMa",
    id:"108",
    expect:"[0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]  CRYa CRYb CRYc COUT SUMc ICYb SUMb ICYa SUMa [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]\n"
  },
  {
    stmt:":Y/1i",
    id:"108",
    flags:{all:true},
    expect:"Y=\n0 -i\ni  0\n[] Y [\n0 -1\n1  0]\n"
  },
  ];

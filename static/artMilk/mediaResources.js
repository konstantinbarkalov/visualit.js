cursorPolys = [
  [
    new Point3D(-20, 0 ,0),
    new Point3D(20, 0 ,0),
  ],
  [
    new Point3D(0, 20, 0),
    new Point3D(0, -20, 0),
  ],
  [
    new Point3D(0, 0, -20),
    new Point3D(0, 0, 20),
  ],
]


////////////

playerColorWhite = {r: 255, g: 255, b: 255};

//
//       ()
//      `  `
//     (    )
//   (  )  (  )
//  ()  (  )  ()
//      ( )
//       ()
const playerSpheres = [
  new PlayerSphere(new Point3D(  0,  -8,   0),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,   0,   0),  16, playerColorWhite),

  new PlayerSphere(new Point3D(  8,   4,   0),  7, 'primaryA'),
  new PlayerSphere(new Point3D( -8,   4,   0),  7, 'primaryA'),

  new PlayerSphere(new Point3D(  9,   8,   0),  8, 'primaryA'),
  new PlayerSphere(new Point3D( -9,   8,   0),  8, 'primaryA'),

  new PlayerSphere(new Point3D( 10,  12,   0),  8, 'primaryA'),
  new PlayerSphere(new Point3D(-10,  12,   0),  8, 'primaryA'),


  new PlayerSphere(new Point3D(  12,  10,  0),  6, 'primaryA'),
  new PlayerSphere(new Point3D( -12,  10,  0),  6, 'primaryA'),

  new PlayerSphere(new Point3D(  14,  14,  0),  6, 'primaryA'),
  new PlayerSphere(new Point3D( -14,  14,  0),  6, 'primaryA'),


  new PlayerSphere(new Point3D(  14,  12,  0),  4, 'primaryA'),
  new PlayerSphere(new Point3D( -14,  12,  0),  4, 'primaryA'),

  new PlayerSphere(new Point3D(  16,  14,  0),  4, 'primaryA'),
  new PlayerSphere(new Point3D( -16,  14,  0),  4, 'primaryA'),

  new PlayerSphere(new Point3D(  18,  16,  0),  4, 'primaryA'),
  new PlayerSphere(new Point3D( -18,  16,  0),  4, 'primaryA'),


  new PlayerSphere(new Point3D(  0,   4,   8),  7, 'primaryB'),
  new PlayerSphere(new Point3D(  0,   4,  -8),  7, 'primaryB'),

  new PlayerSphere(new Point3D(  0,   8,   9),  8, 'primaryB'),
  new PlayerSphere(new Point3D(  0,   8,  -9),  8, 'primaryB'),

  new PlayerSphere(new Point3D(  0,  12,  10),  8, 'primaryB'),
  new PlayerSphere(new Point3D(  0,  12, -10),  8, 'primaryB'),


  new PlayerSphere(new Point3D(  0,  10,  12),  6, 'primaryB'),
  new PlayerSphere(new Point3D(  0,  10, -12),  6, 'primaryB'),

  new PlayerSphere(new Point3D(  0,  14,  14),  6, 'primaryB'),
  new PlayerSphere(new Point3D(  0,  14, -14),  6, 'primaryB'),


  new PlayerSphere(new Point3D(  0,  12,  14),  4, 'primaryB'),
  new PlayerSphere(new Point3D(  0,  12, -14),  4, 'primaryB'),

  new PlayerSphere(new Point3D(  0,  14,  16),  4, 'primaryB'),
  new PlayerSphere(new Point3D(  0,  14, -16),  4, 'primaryB'),

  new PlayerSphere(new Point3D(  0,  16,  18),  4, 'primaryB'),
  new PlayerSphere(new Point3D(  0,  16, -18),  4, 'primaryB'),


  new PlayerSphere(new Point3D( 12,  16,   0),  4, playerColorWhite),
  new PlayerSphere(new Point3D(-12,  16,   0),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,  16,  12),  4, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  16, -12),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,   8,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  12,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  16,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  20,   0), 8, playerColorWhite),


  // new PlayerSphere(new Point3D( 32,  32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32,  32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D( 32, -32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32, -32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D( 32,  32, -32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32,  32, -32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D( 32, -32, -32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32, -32, -32),  8, playerColorWhite),

]


/////////

const idealZodiacPolys = [
  [
    new Point3D( 50, 0, 0 ),
    new Point3D( 100, 0, 0 ),
    new Point3D( 100, 100, 0 ),
    new Point3D( 0, 100, 0 ),
    new Point3D( 0, 0, 0 ),
    new Point3D( 50, 0, 0 ),
  ],
  [
    new Point3D( 50, -50, 0 ),
    new Point3D( 50, 0, 0 ),
  ],
  [
    new Point3D( 0, -50, 0 ),
    new Point3D( 50, -50, 0 ),
    new Point3D( 100, -50, 0 ),
  ],
  [
    new Point3D( 0, 250, 0 ),
    new Point3D( 50, 150, 0 ),
    new Point3D( 100, 250, 0 ),
  ],
  [
    new Point3D( 0, 300, 0 ),
    new Point3D( 100, 300, 0 ),
    new Point3D( 100, 400, 0 ),
    new Point3D( 0, 400, 0 ),
    new Point3D( 0, 300, 0 ),
  ],
  [
    new Point3D( 100, 450, 0 ),
    new Point3D( 100, 400, 0 ),
    new Point3D( 0, 450, 0 ),
  ],
  [ // п
    new Point3D( 150, 100, 0 ),
    new Point3D( 150, 0, 0 ),
    new Point3D( 250, 0, 0 ),
    new Point3D( 250, 100, 0 ),
  ],
  [ // р
    new Point3D( 150, 300, 0 ),
    new Point3D( 150, 250, 0 ),
    new Point3D( 150, 150, 0 ),
    new Point3D( 250, 150, 0 ),
    new Point3D( 250, 250, 0 ),
    new Point3D( 150, 250, 0 ),
  ],
  [ // и1
    new Point3D( 150, 350, 0 ),
    new Point3D( 150, 400, 0 ),
    new Point3D( 250, 350, 0 ),
  ],
  [ // и2
    new Point3D( 250, 400, 0 ),
    new Point3D( 250, 350, 0 ),
    new Point3D( 250, 300, 0 ),

  ],
  [ // в1
    new Point3D( 300, 0, 0 ),
    new Point3D( 400, 0, 0 ),
    new Point3D( 400, 100, 0 ),
    new Point3D( 300, 100, 0 ),
    new Point3D( 300, 0, 0 ),
  ],
  [ // в2
    new Point3D( 300, 0, 0 ),
    new Point3D( 300, -50, 0 ),
    new Point3D( 400, -50, 0 ),
    new Point3D( 300, 0, 0 ),
  ],
  [ // е1
    new Point3D( 400, 150, 0 ),
    new Point3D( 300, 150, 0 ),
    new Point3D( 300, 200, 0 ),
    new Point3D( 300, 250, 0 ),
    new Point3D( 400, 250, 0 ),
  ],
  [ // е2
    new Point3D( 300, 200, 0 ),
    new Point3D( 350, 200, 0 ),
  ],
  [ // т1
    new Point3D( 300, 300, 0 ),
    new Point3D( 350, 300, 0 ),
    new Point3D( 400, 300, 0 ),
  ],
  [ // т2
    new Point3D( 350, 300, 0 ),
    new Point3D( 350, 450, 0 ),
  ],

]
const zodiacPolysHeight = 400;
const zodiacPolysWidth = 400;

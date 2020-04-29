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
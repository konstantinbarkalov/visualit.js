'use strict';

let randomStars = null;
let zodiacStars = null;
let extraZodiacStars = null;
let stars = null;
let dusts = null;
let zodiacLanes = null;
let extraZodiacLanes = null;
let lanes = null;


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
let zodiacPolys = null;
const zodiacPolysHeight = 400;
const zodiacPolysWidth = 400;

const unsafeMargin = 200;
const overscan = 1800;
let fieldWidth = null;
let fieldHeight = null;
let fieldDepth = null;
let fieldCenter = null;
let screenCenter = null;


let extraZodiacPolys = [ // debug TODO: remove
  // [
  //   new Point3D( 0, 0, 0 ),
  //   new Point3D( 400, 0, 0 ),
  //   new Point3D( 0, 400, 0 ),
  // ],
  // [
  //   new Point3D( 0, basic.input.h, 0 ),
  //   new Point3D( 400, basic.input.h, 0 ),
  //   new Point3D( 0, basic.input.h - 400, 0 ),
  // ],
]



let camera = null;
let smoothInput = null;
let cursorProjector = null;
let dustPool = null;
let starPool = null;
let sparclePool = null;
let cubusPool = null;
let playerPool = null;
let starlanePool = null;
let axisDisplay = null;

function artMilkInit() {


  fieldWidth = basic.input.w + overscan + unsafeMargin * 2;
  fieldHeight = basic.input.h;
  fieldDepth = 1000;
  fieldCenter = new Point3D(fieldWidth / 2, fieldHeight / 2, 0);
  screenCenter = new Point2D(basic.input.w / 2, basic.input.h / 2);

  zodiacPolys = shiftPolys(idealZodiacPolys, 0, 0, 0.0);
  zodiacPolys = shiftPolys(zodiacPolys, (fieldWidth - zodiacPolysWidth) / 2, (fieldHeight - zodiacPolysHeight) / 2, 0);
  zodiacPolys = ditherPolys(zodiacPolys);

  zodiacStars = generateZodiacStarsFromPolys(zodiacPolys);
  extraZodiacStars = generateZodiacStarsFromPolys(extraZodiacPolys); // debug TODO: remove

  zodiacLanes = generateZodiacLanesFromPolys(zodiacPolys);
  extraZodiacLanes = generateZodiacLanesFromPolys(extraZodiacPolys); // debug TODO: remove
  lanes = zodiacLanes.concat(extraZodiacLanes);

  camera = new Camera();
  smoothInput = new SmoothInput();
  cursorProjector = new CursorProjector();

  dustPool = new DustPool();
  starPool = new StarPool();
  sparclePool = new SparclePool();
  cubusPool = new CubusPool();
  playerPool = new PlayerPool();
  starlanePool = new StarlanePool();
  axisDisplay = new AxisDisplay();


  for (let i = 0; i < 300; i++) {
    starPool.addRandom();
  }
  starPool.stars = starPool.stars.concat(zodiacStars);
  starPool.stars = starPool.stars.concat(extraZodiacStars);

  for (let i = 0; i < 1000; i++) {
    dustPool.addRandom();
  }

  for (let i = 0; i < 25; i++) {
    //cubusPool.addRandom();
    //sparclePool.addRandom();
    //playerPool.addRandom();
  }

}
function artMilkIteration(t, dt) {
  //t /= 3;
  //dt /= 3;
  smoothInput.iteration(dt);
  const epsilon = 0.001;
  const minDolly = 500;
  const correction = minDolly - minDolly / (1 + epsilon); // to ingnore epsilon influesnce of ratio = 1, to stick exactly to minDolly
  camera.dolly = minDolly / (smoothInput.scrollShiftRatio + epsilon) + correction;
  camera.scale = Math.pow(2, smoothInput.scrollAltRatio - 0.5);
  //camera.unitPlanePosition.coords.z = smoothInput.scrollRatio * 1 - 0.5;
  camera.unitPlanePosition.coords.x = - smoothInput.xRatio * 800 + 400;

  basic.pie.main.cls();
  basic.pie.extra.cls();
  basic.pie.main.setLineWidth(1);

  for (let lineId = 0; lineId < lanes.length; lineId++) {
    const line = lanes[lineId];
    drawLine(line, t);
  }
  if (basic.input.isPrimaryPressed) {
    for (let j = 0; j < 1; j++) {
      const randomStarId = Math.floor(Math.random() * starPool.stars.length);
      const randomStar = starPool.stars[randomStarId];
      //sparclePool.addRandomAtPos(randomstar.pos.clone());
      //cubusPool.addRandomAtPos(randomstar.pos.clone());

      playerPool.addRandomAtPos(cursorProjector.pos.clone());
    }
  }
  starPool.iteration(t, dt);
  starPool.draw(t, dt);

  dustPool.iteration(t, dt);
  dustPool.draw(t, dt);

  sparclePool.iteration(t, dt);
  sparclePool.draw(t, dt);

  cubusPool.iteration(t, dt);
  cubusPool.draw(t, dt);

  playerPool.iteration(t, dt);
  playerPool.draw(t, dt);

  starlanePool.iteration(t, dt);
  starlanePool.draw(t, dt);

  axisDisplay.iteration(t, dt);
  axisDisplay.draw(t, dt);

}

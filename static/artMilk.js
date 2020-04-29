'use strict';

let zodiacPolys = null;
let zodiacStars = null;
let zodiacLanes = null;

const unsafeMargin = 200;
const overscan = 1800;

let fieldWidth = null;
let fieldHeight = null;
let fieldDepth = null;
let fieldCenter = null;
let screenCenter = null;

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

  const zodiacStarsAndLanes = generateZodiacStarsAndLanesFromPolys(zodiacPolys);
  zodiacStars = zodiacStarsAndLanes.stars;
  zodiacLanes = zodiacStarsAndLanes.starlanes;


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
  starlanePool.staticStarlanes = starlanePool.staticStarlanes.concat(zodiacLanes);

  for (let i = 0; i < 1000; i++) {
    dustPool.addRandom();
  }

  for (let i = 0; i < 2; i++) {
    cubusPool.addRandom();
    //sparclePool.addRandom();
    //playerPool.addRandom();
  }

}
function artMilkIteration(t, dt) {
  basic.pie.main.cls();
  basic.pie.extra.cls();

  smoothInput.phisicIteration(dt);

  const epsilon = 0.001;
  const minDolly = 500;
  const correction = minDolly - minDolly / (1 + epsilon); // to ingnore epsilon influesnce of ratio = 1, to stick exactly to minDolly
  camera.dolly = minDolly / (smoothInput.scrollShiftRatio + epsilon) + correction;
  camera.scale = Math.pow(2, smoothInput.scrollAltRatio - 0.5);
  //camera.unitPlanePosition.coords.z = smoothInput.scrollRatio * 1 - 0.5;
  camera.unitPlanePosition.coords.x = - smoothInput.xRatio * 800 + 400;


  if (basic.input.isPrimaryPressed) {
    for (let j = 0; j < 1; j++) {
      const randomStarId = Math.floor(Math.random() * starPool.stars.length);
      const randomStar = starPool.stars[randomStarId];
      //sparclePool.addRandomAtPos(randomstar.pos.clone());
      //cubusPool.addRandomAtPos(randomstar.pos.clone());

      if (playerPool.players.length === 0) {
        playerPool.addRandomAtPos(cursorProjector.pos.clone());
      };
    }
  }

  starPool.phisicIteration(t, dt);
  starPool.drawIteration(t, dt);

  dustPool.phisicIteration(t, dt);
  dustPool.drawIteration(t, dt);

  sparclePool.phisicIteration(t, dt);
  sparclePool.drawIteration(t, dt);

  cubusPool.phisicIteration(t, dt);
  cubusPool.drawIteration(t, dt);

  playerPool.phisicIteration(t, dt);
  playerPool.drawIteration(t, dt);

  starlanePool.phisicIteration(t, dt);
  starlanePool.drawIteration(t, dt);

  axisDisplay.phisicIteration(t, dt);
  axisDisplay.drawIteration(t, dt);

  cursorProjector.phisicIteration(t, dt);
  cursorProjector.drawIteration(t, dt);

}

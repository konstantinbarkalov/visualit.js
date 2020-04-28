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



const camera = new Camera();
const smoothInput = new SmoothInput();
let sparclePool = null;
let cubusPool = null;
let playerPool = null;


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

  dustPool = new DustPool();
  starPool = new StarPool();
  sparclePool = new SparclePool();
  cubusPool = new CubusPool();
  playerPool = new PlayerPool();


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
  camera.dolly = 500 / (smoothInput.scrollShiftRatio + 0.001);
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
      playerPool.addRandomAtPos(randomStar.pos.clone());
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

}

function gappedSinRatio(input, everyNth = 2) {
  const isPulse = (Math.floor(input) % everyNth === 0);
  if (isPulse) {
    return Math.sin(input * Math.PI * 2) / 2 + 0.5;
  } else {
    return 0;
  }
}



function ditherPolys(polys) {
  const uniquePolys = new UniquePolys();
  polys.forEach((poly) => {
    poly.forEach((point) => {
      uniquePolys.addValue(point, point);
    });
  });
  uniquePolys.dictionary = Object.fromEntries(Object.entries(uniquePolys.dictionary).map(([uid, point]) => {
    return [uid, point.add(new Point3D(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 400 - 200,
    ))];
  }));

  const newPolys = polys.map((poly) => {
    const newPoly = poly.map((point) => {
      return uniquePolys.getValue(point);
    });
    return newPoly;
  });
  return newPolys;
}
function shiftPolys(polys, dX, dY, dZ) {
  const newPolys = polys.map((poly) => {
    const newPoly = poly.map((point) => {
      return point.add(new Point3D(dX, dY, dZ));
    });
    return newPoly;
  });
  return newPolys;
}
function generateZodiacLanesFromPolys(polys) {
  let lanes = [];
  polys.forEach((poly) => {
    let prevPoint = poly[0];
    for (let polyId = 1; polyId < poly.length; polyId++) {
      const currentPoint = poly[polyId];
      lanes.push({
        from: prevPoint,
        to: currentPoint,
      });
      prevPoint = currentPoint;
    }
  });
  return lanes;
}
function generateZodiacStarsFromPolys(polys) {
  const uniquePolys = new UniquePolys();
  polys.forEach((poly) => {
    poly.forEach((point) => {
      uniquePolys.addValue(point, point);
    });
  });
  const stars = Object.values(uniquePolys.dictionary).map((point) => {
    const star = new Star();
    star.pos.coords.x = point.coords.x;
    star.pos.coords.y = point.coords.y;
    star.pos.coords.z = point.coords.z;
    star.style.intense = 2 + Math.random(),
    star.style.entropy.burnWave = {
      amount: 1,
      phaseShift: 0,
    }
    return star;
  });
  return stars;
}


function sampleBurnWaveRatio(t, x, y, phaseShift, q) {
  const xRatio = x / basic.input.w;
  const yRatio = y / basic.input.h;
  const azaza = Math.sin(yRatio * Math.PI * 2 * 1) / 5;
  const gappedSinParam =
    0.5 +
    -t / 3 +
    xRatio +
    azaza +
    phaseShift;

  let burnWaveRatio = gappedSinRatio(gappedSinParam, 3);
  burnWaveRatio = Math.pow(burnWaveRatio, q);
  return burnWaveRatio;
}
function sampleBlinkRatio(t, freq, phaseShift) {
  const blinkSinParam = Math.PI * 2 * (t * freq + phaseShift);
  const blinkRatio = Math.sin(blinkSinParam) / 2 + 0.5;
  return blinkRatio;
}

function fillStarShape(x, y, exSize, plusSize) {
  basic.pie.main.fillPolygon([
    {
      x: x + exSize,
      y: y,
    },
    {
      x: x + plusSize,
      y: y + plusSize,
    },
    {
      x: x,
      y: y + exSize,
    },
    {
      x: x - plusSize,
      y: y + plusSize,
    },
    {
      x: x - exSize,
      y: y,
    },
    {
      x: x - plusSize,
      y: y - plusSize,
    },
    {
      x: x,
      y: y - exSize,
    },
    {
      x: x + plusSize,
      y: y - plusSize,
    },
  ]);
}
function timeshift(point, t) {
  let timeshiftedX = (point.coords.x - t * 100 * 0);
  //timeshiftedX %= fieldWidth;
  //timeshiftedX += fieldWidth;
  //timeshiftedX %= fieldWidth;
  const timeshiftedPoint = new Point3D(timeshiftedX, point.coords.y, point.coords.z);
  return timeshiftedPoint;
}


function drawLine(line, t) {
  const timeshiftedPointFrom = timeshift(line.from, t);
  const screenPointFrom = camera.mapToScreen(timeshiftedPointFrom);

  const timeshiftedPointTo = timeshift(line.to, t);
  const screenPointTo = camera.mapToScreen(timeshiftedPointTo);

  let burnWaveRatioFrom = sampleBurnWaveRatio(t, timeshiftedPointFrom.coords.x, timeshiftedPointFrom.coords.y, 0, 3);
  let burnWaveRatioTo = sampleBurnWaveRatio(t, timeshiftedPointTo.coords.x, timeshiftedPointTo.coords.y, 0, 3);
  let burnWaveRatio = Math.max(burnWaveRatioFrom, burnWaveRatioTo);

  //let intense = 0.4 * star.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 1 * burnWaveRatio
    + 0.2;

  const tweakedIntense = Math.pow(intense, 1);

  let wrapMarginRatioFrom = Math.max(
    Math.max(0, (100 - screenPointFrom.coords.x) / 100),
    Math.max(0, (screenPointFrom.coords.x - basic.input.w + 100) / 100),
  );
  let wrapMarginRatioTo = Math.max(
      Math.max(0, (100 - screenPointTo.coords.x) / 100),
      Math.max(0, (screenPointTo.coords.x - basic.input.w + 100) / 100),
    );
  let wrapMarginRatio = Math.max(wrapMarginRatioFrom, wrapMarginRatioTo);

  basic.pie.main.setAlpha(tweakedIntense - wrapMarginRatio);
  basic.pie.main.setPlotColor(255, 255, 255);
  basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
}

function isInField(point) {
  return point.coords.x >= 0 &&
         point.coords.x < fieldWidth &&
         point.coords.y >= 0 &&
         point.coords.y < fieldHeight &&
         point.coords.z >= -fieldDepth / 2 &&
         point.coords.z < fieldDepth / 2;
}

function isInSafeWidthZone(point) {
  return point.coords.x >= unsafeMargin &&
         point.coords.x < fieldWidth - unsafeMargin;
}

function isInSafeField(point) {
  return point.coords.x >= unsafeMargin &&
         point.coords.x < fieldWidth - unsafeMargin &&
         point.coords.y >= 0 &&
         point.coords.y < fieldHeight &&
         point.coords.z >= -fieldDepth / 2 &&
         point.coords.z < fieldDepth / 2;
}

function isInTube(point) {
  return point.coords.y >= 0 &&
         point.coords.y < fieldHeight &&
         point.coords.z >= -fieldDepth / 2 &&
         point.coords.z < fieldDepth / 2;
}

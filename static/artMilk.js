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

const overscan = 800;
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

  fieldWidth = basic.input.w + overscan;
  fieldHeight = basic.input.h;
  fieldDepth = 1000;
  fieldCenter = new Point3D(fieldWidth / 2, fieldHeight / 2, 0);
  screenCenter = new Point2D(basic.input.w / 2, basic.input.h / 2);

  zodiacPolys = shiftPolys(idealZodiacPolys, 0, 0, 0.0);
  zodiacPolys = shiftPolys(zodiacPolys, (fieldWidth - zodiacPolysWidth) / 2, (fieldHeight - zodiacPolysHeight) / 2, 0);
  zodiacPolys = ditherPolys(zodiacPolys);

  randomStars = generateStars(300);
  zodiacStars = generateZodiacStarsFromPolys(zodiacPolys);
  extraZodiacStars = generateZodiacStarsFromPolys(extraZodiacPolys); // debug TODO: remove
  stars = randomStars.concat(zodiacStars).concat(extraZodiacStars);
  dusts = generateStars(1000);
  zodiacLanes = generateZodiacLanesFromPolys(zodiacPolys);
  extraZodiacLanes = generateZodiacLanesFromPolys(extraZodiacPolys); // debug TODO: remove
  lanes = zodiacLanes.concat(extraZodiacLanes);

  sparclePool = new SparclePool();
  cubusPool = new CubusPool();
  playerPool = new PlayerPool();
  for (let i = 0; i < 25; i++) {
    //cubusPool.addRandom();
    //sparclePool.addRandom();
    playerPool.addRandom();
  }

}
function artMilkIteration(t, dt) {
  smoothInput.iteration(dt);
  camera.dolly = 500 / (smoothInput.yRatio + 0.001);
  camera.scale = Math.pow(2, smoothInput.scrollRatio - 0.5);
  //camera.unitPlanePosition.coords.z = smoothInput.scrollRatio * 1 - 0.5;
  camera.unitPlanePosition.coords.x = - smoothInput.xRatio * 800 + 400;

  basic.pie.main.cls();
  basic.pie.extra.cls();
  basic.pie.main.setLineWidth(1);
  for (let starId = 0; starId < stars.length; starId++) {
    const star = stars[starId];
    drawStar(star, t);
  }
  for (let dustId = 0; dustId < dusts.length; dustId++) {
    const dust = dusts[dustId];
    drawDust(dust, t);
  }
  for (let lineId = 0; lineId < lanes.length; lineId++) {
    const line = lanes[lineId];
    drawLine(line, t);
  }
  if (basic.input.isPrimaryPressed) {
    for (let j = 0; j < 1; j++) {
      const randomStarId = Math.floor(Math.random() * stars.length);
      const randomStar = stars[randomStarId];
      sparclePool.addRandomAtPos(randomStar.point.clone());
      cubusPool.addRandomAtPos(randomStar.point.clone());
      playerPool.addRandomAtPos(randomStar.point.clone());
    }
  }
  sparclePool.iteration(t, dt);
  sparclePool.draw(t, dt);

  cubusPool.iteration(t, dt);
  cubusPool.draw(t, dt);

  playerPool.iteration(t, dt);
  playerPool.draw(t, dt);

  basic.pie.main.setAlpha(1);
  basic.pie.main.setFillColor(255, 255, 255);
  basic.pie.main.print(10, basic.input.h - 10, t.toFixed(2));

}

function gappedSinRatio(input, everyNth = 2) {
  const isPulse = (Math.floor(input) % everyNth === 0);
  if (isPulse) {
    return Math.sin(input * Math.PI * 2) / 2 + 0.5;
  } else {
    return 0;
  }
}

function generateStars(starsCount) {
  let stars = [];
  for (let starId = 0; starId < starsCount; starId++) {
    const star = new Star();
    star.point.coords.x = Math.random() * fieldWidth;
    star.point.coords.y = Math.random() * fieldHeight,
    star.point.coords.z = (Math.random() - 0.5) * fieldDepth,
    stars[starId] = star;
  }
  return stars;
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
      Math.random() * !0 - 5,
      Math.random() * 10 - 5,
      Math.random() * 0.4 - 0.2,
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
    star.point.coords.x = point.coords.x;
    star.point.coords.y = point.coords.y;
    star.point.coords.z = point.coords.z;
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
  let timeshiftedX = (point.coords.x - t * 100);
  timeshiftedX %= fieldWidth;
  timeshiftedX += fieldWidth;
  timeshiftedX %= fieldWidth;
  const timeshiftedPoint = new Point3D(timeshiftedX, point.coords.y, point.coords.z);
  return timeshiftedPoint;
}
function drawStar(star, t) {
  const timeshiftedPoint = timeshift(star.point, t);
  const blinkRatio = sampleBlinkRatio(t, star.style.entropy.blink.freq, star.style.entropy.blink.phaseShift);
  let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, star.style.entropy.burnWave.phaseShift, 50);
  burnWaveRatio *= star.style.entropy.burnWave.amount;

  const screenPoint = camera.mapToScreen(timeshiftedPoint);

  //let intense = 0.4 * star.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 0.5 * star.style.intense
    + 0.5 * blinkRatio
    + 2 * burnWaveRatio;
  const tweakedIntense1 = Math.pow(intense, 1/2);
  const tweakedIntense2 = Math.pow(intense, 2);
  const exSize = tweakedIntense2 * 4 * screenPoint.zScale;
  const plusSize = tweakedIntense1 * 1 * screenPoint.zScale;
  const alpha = tweakedIntense1 * 1;
  basic.pie.main.setAlpha(alpha);

  for (let layerId = 0; layerId < intense; layerId++) {
    const factor = layerId + 1;
    basic.pie.main.setFillColor(star.style.color.r * factor, star.style.color.g * factor, star.style.color.b * factor);
    fillStarShape(screenPoint.coords.x, screenPoint.coords.y, exSize / factor, plusSize / factor);
  }
}
function drawDust(star, t) {
  const timeshiftedPoint = timeshift(star.point, t);

  const blinkRatio = sampleBlinkRatio(t, star.style.entropy.blink.freq, star.style.entropy.blink.phaseShift);
  let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, star.style.entropy.burnWave.phaseShift - 0.1, 2);
  //burnWaveRatio *= star.style.entropy.burnWave.amount;

  const screenPoint = camera.mapToScreen(timeshiftedPoint);




  //let intense = 0.4 * star.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 0.5 * star.style.intense
    + 0.5 * blinkRatio
    + 2 * burnWaveRatio
    - 1.1;

  if (intense > 0) {
    const tweakedIntense = Math.pow(intense, 1/2);
    const plusSize = tweakedIntense / screenPoint.zScale * 1.5;
    basic.pie.main.setAlpha(tweakedIntense);
    basic.pie.main.setPlotColor(star.style.color.r, star.style.color.g, star.style.color.b);
    basic.pie.main.plotLine(screenPoint.coords.x, screenPoint.coords.y - plusSize, screenPoint.coords.x, screenPoint.coords.y + plusSize);
    basic.pie.main.plotLine(screenPoint.coords.x - plusSize, screenPoint.coords.y, screenPoint.coords.x + plusSize, screenPoint.coords.y);
  }

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


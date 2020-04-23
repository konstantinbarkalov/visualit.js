
class UniquePolys {
  dictionary = {};
  getUid(point) {
    return JSON.stringify(point.coords);
  }
  addValue(point, obj) {
    const uid = this.getUid(point);
    this.dictionary[uid] = obj;
  }
  getValue(point) {
    const uid = this.getUid(point);
    return this.dictionary[uid];
  }

}
class Point {
  everyCoord(callbackFn) {
    const clone = this.clone();
    clone.coords = Object.fromEntries(Object.entries(clone.coords).map(([coordKey, coordValue]) => {
      return [coordKey, callbackFn(coordValue, coordKey)];
    }));
    return clone;
  }
  subtract(point) {
    return this.everyCoord((coordValue, coordKey)=>{
      return coordValue - point.coords[coordKey];
    })
  }
  add(point) {
    return this.everyCoord((coordValue, coordKey)=>{
      return coordValue + point.coords[coordKey];
    })
  }
  multiply(point) {
    return this.everyCoord((coordValue, coordKey)=>{
      return coordValue * point.coords[coordKey];
    })
  }
}
class Point2D extends Point {
  coords = {
    x: 0,
    y: 0,
  }
  zLog = 1;
  constructor(x = 0, y = 0, zLog = 1) {
    super();
    this.coords.x = x;
    this.coords.y = y;
    this.zLog = zLog;
  }
  clone() {
    return new Point2D(this.coords.x, this.coords.y);
  }
}
class Point3D extends Point {
  coords = {
    x: 0,
    y: 0,
    z: 0,
  }
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.coords.x = x;
    this.coords.y = y;
    this.coords.z = z;
  }
  clone() {
    return new Point3D(this.coords.x, this.coords.y, this.coords.z);
  }
  getZLog(zLogBase) {
    return Math.pow(zLogBase, -this.coords.z);
  }
}
class Camera {
  position = new Point3D();
  zLogBase = 1;
  mapToScreen(point3D) {
    const relativeToCamera = point3D.subtract(this.position);
    const relativeToCameraCenter = relativeToCamera.subtract(fieldCenter);
    const zLog = relativeToCameraCenter.getZLog(this.zLogBase + basic.input.yRatio);
    const onScreenCenter = new Point2D(relativeToCameraCenter.coords.x * zLog, relativeToCameraCenter.coords.y * zLog, zLog);
    const onScreen = onScreenCenter.add(screenCenter);
    return onScreen;
  }
}

async function art() {
  await artStars();
}
function gappedSinRatio(input, everyNth = 2) {
  const isPulse = (Math.floor(input) % everyNth === 0);
  if (isPulse) {
    return Math.sin(input * Math.PI * 2) / 2 + 0.5;
  } else {
    return 0;
  }
}
class Star {
  point = new Point3D();
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
    intense: Math.random(),
    entropy: {
      blink: {
        phase: Math.random(),
        freq: Math.random() * 1,
      },
      burnWave: {
        amount: Math.random(),
        phaseShift: (Math.random() - 0.5) / 4,
      }
    }
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
function sampleBlinkRatio(t, freq, phase) {
  const blinkSinParam = Math.PI * 2 * (t * freq + phase);
  const blinkRatio = Math.sin(blinkSinParam) / 2 + 0.5;
  return blinkRatio;
}
async function artStars() {
  const randomStars = generateStars(300);
  const zodiacStars = generateZodiacStarsFromPolys(zodiacPolys);
  const stars = randomStars.concat(zodiacStars);
  const dusts = generateStars(1000);
  const lanes = generateZodiacLanesFromPolys(zodiacPolys);
  const dt = 1 / 30;
  let t = 0;
  while(true) {
    basic.pie.main.cls();
    t += dt;
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
    basic.pie.main.setAlpha(1);
    basic.pie.main.setColor(255, 255, 255);
    basic.pie.main.print(10, basic.input.h - 10, t.toFixed(2));
    await basic.pause(dt * 1000);
  }

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
  const timeshiftedX = (point.coords.x + t * 100) % (fieldWidth);
  const timeshiftedPoint = new Point3D(timeshiftedX, point.coords.y, point.coords.z);
  return timeshiftedPoint;
}
function drawStar(star, t) {
  const timeshiftedPoint = timeshift(star.point, t);
  const screenPoint = camera.mapToScreen(timeshiftedPoint);

  const blinkRatio = sampleBlinkRatio(t, star.style.entropy.blink.freq, star.style.entropy.blink.phase);

  let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, star.style.entropy.burnWave.phaseShift, 50);
  burnWaveRatio *= star.style.entropy.burnWave.amount;

  //let intense = 0.4 * star.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 0.5 * star.style.intense
    + 0.5 * blinkRatio
    + 2 * burnWaveRatio;
  const tweakedIntense1 = Math.pow(intense, 1/2);
  const tweakedIntense2 = Math.pow(intense, 2);
  const exSize = tweakedIntense2 * 4 * screenPoint.zLog;
  const plusSize = tweakedIntense1 * 1 * screenPoint.zLog;
  const alpha = tweakedIntense1 * 1;
  basic.pie.main.setAlpha(alpha);

  for (let layerId = 0; layerId < intense; layerId++) {
    const factor = layerId + 1;
    basic.pie.main.setColor(star.style.color.r * factor, star.style.color.g * factor, star.style.color.b * factor);
    fillStarShape(screenPoint.coords.x, screenPoint.coords.y, exSize / factor, plusSize / factor);
  }
}
function drawDust(star, t) {
  const timeshiftedPoint = timeshift(star.point, t);
  const screenPoint = camera.mapToScreen(timeshiftedPoint);

  const blinkRatio = sampleBlinkRatio(t, star.style.entropy.blink.freq, star.style.entropy.blink.phase);

  let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, star.style.entropy.burnWave.phaseShift - 0.1, 2);
  //burnWaveRatio *= star.style.entropy.burnWave.amount;

  //let intense = 0.4 * star.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 0.5 * star.style.intense
    + 0.5 * blinkRatio
    + 2 * burnWaveRatio
    - 1.1;

  if (intense > 0) {
    const tweakedIntense = Math.pow(intense, 1/2);
    const plusSize = tweakedIntense / screenPoint.zLog * 1.5;
    basic.pie.main.setAlpha(tweakedIntense);
    basic.pie.main.setColor(star.style.color.r, star.style.color.g, star.style.color.b);
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
  basic.pie.main.setColor(255, 255, 255);
  basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
}

let zodiacPolys = [
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

const overscan = 800;
const fieldWidth = basic.input.w + overscan;
const fieldHeight = basic.input.h;
const fieldDepth = 2;
const fieldCenter = new Point3D(fieldWidth / 2, fieldHeight / 2, 0);
const screenCenter = new Point2D(basic.input.w / 2, basic.input.h / 2, 0);



const polysHeight = 500;
const polysWidth = 500;
zodiacPolys = shiftPolys(zodiacPolys, 0, 0, 0.0);
zodiacPolys = shiftPolys(zodiacPolys, (fieldWidth - polysHeight), (fieldHeight - polysHeight) / 2, 0);
zodiacPolys = ditherPolys(zodiacPolys);

const camera = new Camera();
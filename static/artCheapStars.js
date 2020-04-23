const overscan = 800;
class UniquePolys {
  dictionary = {};
  getUid(point) {
    return JSON.stringify(point);
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
      return coordValue + point.coords[coordKey];
    })
  }
}
class Point2D extends Point {
  coords = {
    x: 0,
    y: 0,
  }
  constructor(x, y) {
    this.coords.x = x;
    this.coords.y = y;
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
  constructor(x, y, z) {
    this.coords.x = x;
    this.coords.y = y;
    this.coords.z = z;
  }
  clone() {
    return new Point3D(this.coords.x, this.coords.y, this.coords.z);
  }
  getZLogE() {
    return Math.log(this.z);
  }
  static relativeTo(origin, point) {
    return origin.subtract(point);
  }
}
class Camera {
  position = new Point3D();
  zLogFactor = 1 / Math.log(2);
  mapToScreen(point3D) {
    const relativeToCamera = Point3D.relativeTo(position, point3D);
    const zLog = relativeToCamera.getZLogE() * zLogFactor;
    return new Point2D(relativeToCamera.coords.x * zLog, relativeToCamera.coords.y * zLog);
  }
}
async function art() {
  await artCheapStars();
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
    stars[starId] = {
      x: Math.random() * (basic.input.w + overscan),
      y: Math.random() * basic.input.h,
      zLog: Math.random() * 0.5 + 0.5,
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
    return [uid, {
      x: point.x + Math.random() * 20,
      y: point.y + Math.random() * 20,
      zLog: point.zLog + Math.random() * 0.05,
    }]
  }));

  const newPolys = polys.map((poly) => {
    const newPoly = poly.map((point) => {
      return uniquePolys.getValue(point);
    });
    return newPoly;
  });
  return newPolys;
}
function shiftPolys(polys, dX, dY, fZLog) {
  const newPolys = polys.map((poly) => {
    const newPoly = poly.map((point) => {
      return {
        x: point.x + dX,
        y: point.y + dY,
        zLog: point.zLog * fZLog,
      }
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
  let stars = [];
  const uniquePolys = new UniquePolys();
  polys.forEach((poly) => {
    poly.forEach((point) => {
      uniquePolys.addValue(point, point);
    });
  });
  Object.values(uniquePolys.dictionary).forEach((point) => {
    stars.push({
      x: point.x,
      y: point.y,
      zLog: point.zLog,
      color: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
      intense: 2 + Math.random(),
      entropy: {
        blink: {
          phase: Math.random(),
          freq: Math.random() * 1,
        },
        burnWave: {
          amount: 1,
          phaseShift: 0,
        }
      }
    });
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
async function artCheapStars() {
  const randomStars = generateStars(300);
  const zodiacStars = generateZodiacStarsFromPolys(zodiacPolys);
  const stars = randomStars.concat(zodiacStars);
  const dusts = generateStars(1000);
  const lanes = generateZodiacLanesFromPolys(zodiacPolys);
  const dt = 1 / 30;
  let t = 0;
  while(true) {
    //basic.pie.main.setAlpha(0.1);
    basic.pie.main.cls();
    //basic.pie.main.setAlpha(1);
    t += dt;
    for (let starId = 0; starId < stars.length; starId++) {
      const star = stars[starId];
      drawCheapStar(star, t);
    }
    for (let dustId = 0; dustId < dusts.length; dustId++) {
      const dust = dusts[dustId];
      drawCheapDust(dust, t);
    }
    for (let lineId = 0; lineId < lanes.length; lineId++) {
      const line = lanes[lineId];
      drawCheapLine(line, t);
    }
    basic.pie.main.setAlpha(1);
    basic.pie.main.setColor(255, 255, 255);
    basic.pie.main.print(10, basic.input.h - 10, t.toFixed(2));
    await basic.pause(dt * 1000);
  }

}
function fillCheapStarShape(x, y, exSize, plusSize) {
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
function drawCheapStar(star, t) {
  const blinkRatio = sampleBlinkRatio(t, star.entropy.blink.freq, star.entropy.blink.phase);

  let burnWaveRatio = sampleBurnWaveRatio(t, star.x, star.y, star.entropy.burnWave.phaseShift, 50);
  burnWaveRatio *= star.entropy.burnWave.amount;

  //let intense = 0.4 * star.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 0.5 * star.intense
    + 0.5 * blinkRatio
    + 2 * burnWaveRatio;

  const tweakedIntense1 = Math.pow(intense, 1/2);
  const tweakedIntense2 = Math.pow(intense, 2);
  const exSize = tweakedIntense2 * 4 * star.zLog;
  const plusSize = tweakedIntense1 * 1 * star.zLog;
  const alpha = tweakedIntense1 * 1;
  basic.pie.main.setAlpha(alpha);
  const twX = (star.x + t * 100) % (basic.input.w + overscan);
  const screenPos = {
    x: twX * star.zLog,
    y: star.y * star.zLog,
  }
  for (let layerId = 0; layerId < intense; layerId++) {
    const factor = layerId + 1;
    basic.pie.main.setColor(star.color.r * factor, star.color.g * factor, star.color.b * factor);
    fillCheapStarShape(screenPos.x, screenPos.y, exSize / factor, plusSize / factor);
  }
}
function drawCheapDust(star, t) {
  const blinkRatio = sampleBlinkRatio(t, star.entropy.blink.freq, star.entropy.blink.phase);


  let burnWaveRatio = sampleBurnWaveRatio(t, star.x, star.y, star.entropy.burnWave.phaseShift - 0.1, 2);
  //burnWaveRatio *= star.entropy.burnWave.amount;

  //let intense = 0.4 * star.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 0.5 * star.intense
    + 0.5 * blinkRatio
    + 2 * burnWaveRatio
    - 1.1;

  if (intense > 0) {
    const tweakedIntense = Math.pow(intense, 1/2);
    const twX = (star.x + t * 100) % (basic.input.w + overscan);
    const screenPos = {
      x: twX * star.zLog,
      y: star.y * star.zLog,
    }
    const plusSize = tweakedIntense / star.zLog * 1.5;
    basic.pie.main.setAlpha(tweakedIntense);
    basic.pie.main.setColor(star.color.r, star.color.g, star.color.b);
    basic.pie.main.plotLine(screenPos.x, screenPos.y - plusSize, screenPos.x, screenPos.y + plusSize);
    basic.pie.main.plotLine(screenPos.x - plusSize, screenPos.y, screenPos.x + plusSize, screenPos.y);
  }

}

function drawCheapLine(line, t) {
  let burnWaveRatioFrom = sampleBurnWaveRatio(t, line.from.x, line.from.y, 0, 3);
  let burnWaveRatioTo = sampleBurnWaveRatio(t, line.to.x, line.to.y, 0, 3);
  let burnWaveRatio = Math.max(burnWaveRatioFrom, burnWaveRatioTo);

  //let intense = 0.4 * star.intense + blinkRatio * 0.4 + Math.random() * 0.2;
  let intense =
    + 1 * burnWaveRatio
    + 0.2;

  const tweakedIntense = Math.pow(intense, 1);
  const twXFrom = (line.from.x + t * 100) % (basic.input.w + overscan);
  const twXTo = (line.to.x + t * 100) % (basic.input.w + overscan);

  const screenPos = {
    from: {
      x: twXFrom * line.from.zLog,
      y: line.from.y * line.from.zLog,
    },
    to: {
      x: twXTo * line.to.zLog,
      y: line.to.y * line.to.zLog,
    }
  }
  let wrapMarginRatioFrom = Math.max(
    Math.max(0, (100 - screenPos.from.x) / 100),
    Math.max(0, (screenPos.from.x - basic.input.w + 100) / 100),
  );
  let wrapMarginRatioTo = Math.max(
      Math.max(0, (100 - screenPos.to.x) / 100),
      Math.max(0, (screenPos.to.x - basic.input.w + 100) / 100),
    );
  let wrapMarginRatio = Math.max(wrapMarginRatioFrom, wrapMarginRatioTo);

  basic.pie.main.setAlpha(tweakedIntense - wrapMarginRatio);
  basic.pie.main.setColor(255, 255, 255);
  basic.pie.main.plotLine(screenPos.from.x, screenPos.from.y, screenPos.to.x, screenPos.to.y);
}

let zodiacPolys = [
  [
    {
      x: 50,
      y: 0,
      zLog: 1
    },
    {
      x: 100,
      y: 0,
      zLog: 1
    },
    {
      x: 100,
      y: 100,
      zLog: 1
    },
    {
      x: 0,
      y: 100,
      zLog: 1
    },
    {
      x: 0,
      y: 0,
      zLog: 1
    },
    {
      x: 50,
      y: 0,
      zLog: 1
    }
  ],
  [
    {
      x: 50,
      y: -50,
      zLog: 1
    },
    {
      x: 50,
      y: 0,
      zLog: 1
    }
  ],
  [
    {
      x: 0,
      y: -50,
      zLog: 1
    },
    {
      x: 50,
      y: -50,
      zLog: 1
    },
    {
      x: 100,
      y: -50,
      zLog: 1
    }
  ],
  [
    {
      x: 0,
      y: 250,
      zLog: 1
    },
    {
      x: 50,
      y: 150,
      zLog: 1
    },
    {
      x: 100,
      y: 250,
      zLog: 1
    }
  ],
  [
    {
      x: 0,
      y: 300,
      zLog: 1
    },
    {
      x: 100,
      y: 300,
      zLog: 1
    },
    {
      x: 100,
      y: 400,
      zLog: 1
    },
    {
      x: 0,
      y: 400,
      zLog: 1
    },
    {
      x: 0,
      y: 300,
      zLog: 1
    }
  ],
  [
    {
      x: 100,
      y: 450,
      zLog: 1
    },
    {
      x: 100,
      y: 400,
      zLog: 1
    },
    {
      x: 0,
      y: 450,
      zLog: 1
    }
  ],
  [ // п
    {
      x: 150,
      y: 100,
      zLog: 1
    },
    {
      x: 150,
      y: 0,
      zLog: 1
    },
    {
      x: 250,
      y: 0,
      zLog: 1
    },
    {
      x: 250,
      y: 100,
      zLog: 1
    }
  ],
  [ // р
    {
      x: 150,
      y: 300,
      zLog: 1
    },
    {
      x: 150,
      y: 250,
      zLog: 1
    },
    {
      x: 150,
      y: 150,
      zLog: 1
    },
    {
      x: 250,
      y: 150,
      zLog: 1
    },
    {
      x: 250,
      y: 250,
      zLog: 1
    },
    {
      x: 150,
      y: 250,
      zLog: 1
    }
  ],
  [ // и1
    {
      x: 150,
      y: 350,
      zLog: 1
    },
    {
      x: 150,
      y: 400,
      zLog: 1
    },
    {
      x: 250,
      y: 350,
      zLog: 1
    },
  ],
  [ // и2
    {
      x: 250,
      y: 400,
      zLog: 1
    },
    {
      x: 250,
      y: 350,
      zLog: 1
    },
    {
      x: 250,
      y: 300,
      zLog: 1
    },

  ],
  [ // в1
    {
      x: 300,
      y: 0,
      zLog: 1
    },
    {
      x: 400,
      y: 0,
      zLog: 1
    },
    {
      x: 400,
      y: 100,
      zLog: 1
    },
    {
      x: 300,
      y: 100,
      zLog: 1
    },
    {
      x: 300,
      y: 0,
      zLog: 1
    },
  ],
  [ // в2
    {
      x: 300,
      y: 0,
      zLog: 1
    },
    {
      x: 300,
      y: -50,
      zLog: 1
    },
    {
      x: 400,
      y: -50,
      zLog: 1
    },
    {
      x: 300,
      y: 0,
      zLog: 1
    },
  ],
  [ // е1
    {
      x: 400,
      y: 150,
      zLog: 1
    },
    {
      x: 300,
      y: 150,
      zLog: 1
    },
    {
      x: 300,
      y: 200,
      zLog: 1
    },
    {
      x: 300,
      y: 250,
      zLog: 1
    },
    {
      x: 400,
      y: 250,
      zLog: 1
    },
  ],
  [ // е2
    {
      x: 300,
      y: 200,
      zLog: 1
    },
    {
      x: 350,
      y: 200,
      zLog: 1
    },
  ],
  [ // т1
    {
      x: 300,
      y: 300,
      zLog: 1
    },
    {
      x: 350,
      y: 300,
      zLog: 1
    },
    {
      x: 400,
      y: 300,
      zLog: 1
    },
  ],
  [ // т2
    {
      x: 350,
      y: 300,
      zLog: 1
    },
    {
      x: 350,
      y: 450,
      zLog: 1
    },
  ],

]

const polysHeight = 400;
zodiacPolys = shiftPolys(zodiacPolys, 0, 0, 0.8);
zodiacPolys = shiftPolys(zodiacPolys, 0, (basic.input.h - polysHeight) / 2, 1);
zodiacPolys = ditherPolys(zodiacPolys);
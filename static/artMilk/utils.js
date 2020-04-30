
function splitArray(array, partSize, overlap = 0) {
  const slices = [];
  const remains = array.slice();
  while (remains.length > 0) {
    slices.push(remains.slice(0, partSize));
    remains.splice(0, partSize - overlap);
  }
  return slices;
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

function generateZodiacStarsAndLanesFromPolys(polys) {
  const uniqueStars = new UniquePolys();
  polys.forEach((poly) => {
    poly.forEach((point) => {
      const star = new Star();
      star.pos.coords.x = point.coords.x;
      star.pos.coords.y = point.coords.y;
      star.pos.coords.z = point.coords.z;
      star.style.intense = 2 + Math.random(),
      star.style.entropy.burnWave = {
        amount: 1,
        phaseShift: 0,
      }
      uniqueStars.addValue(point, star);
    });
  });
  const stars = Object.values(uniqueStars.dictionary);

  const starlanes = polys.map((poly) => {
    const laneStars = poly.map((point) => {
      return uniqueStars.getValue(point);
    });
    const starlane =  new StaticStarlane(laneStars);
    starlane.style.color = {r: 255, g: 255, b: 255};
    return starlane;
  });
  return {stars, starlanes};
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
  // obsolete, do nothing really TODO: remove
  //let timeshiftedX = (point.coords.x - t * 100);
  let timeshiftedX = (point.coords.x - t * 100 * 0);
  //let timeshiftedX = (point.coords.x - Math.sin(t / 3) * 100);
  //timeshiftedX %= fieldWidth;
  //timeshiftedX += fieldWidth;
  //timeshiftedX %= fieldWidth;
  const timeshiftedPoint = new Point3D(timeshiftedX, point.coords.y, point.coords.z);
  return timeshiftedPoint;
}

function isInField(point) {
  return point.coords.x >= -fieldWidth / 2 &&
         point.coords.x < fieldWidth / 2 &&
         point.coords.y >= -fieldHeight / 2 &&
         point.coords.y < fieldHeight / 2 &&
         point.coords.z >= -fieldDepth / 2 &&
         point.coords.z < fieldDepth / 2;
}

function isInSafeWidthZone(point) {
  return point.coords.x >= -fieldWidth / 2 + unsafeMargin &&
         point.coords.x < fieldWidth / 2 - unsafeMargin;
}

function isInSafeField(point) {
  return point.coords.x >= -fieldWidth / 2 + unsafeMargin &&
         point.coords.x < fieldWidth / 2 - unsafeMargin &&
         point.coords.y >= -fieldHeight / 2 &&
         point.coords.y < fieldHeight / 2 &&
         point.coords.z >= -fieldDepth / 2 &&
         point.coords.z < fieldDepth / 2;
}

function isInTube(point) {
  return point.coords.y >= -fieldHeight / 2 &&
         point.coords.y < fieldHeight / 2 &&
         point.coords.z >= -fieldDepth / 2 &&
         point.coords.z < fieldDepth / 2;

}


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

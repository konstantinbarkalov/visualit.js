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
  // everyCoord(callbackFn) {
  //   const clone = this.clone();
  //   clone.coords = Object.fromEntries(Object.entries(clone.coords).map(([coordKey, coordValue]) => {
  //     return [coordKey, callbackFn(coordValue, coordKey)];
  //   }));
  //   return clone;
  // }
  everyCoord(callbackFn) {
    const clone = this.clone();
    clone.coords.x = callbackFn(this.coords.x, 'x');
    clone.coords.y = callbackFn(this.coords.y, 'y');
    clone.coords.z = callbackFn(this.coords.z, 'z');
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
  constructor(x = 0, y = 0, zScale = 1) {
    super();
    this.coords = {
      x: x,
      y: y,
      z: 0,
    }
    this.zScale = zScale;
  }
  clone() {
    return new Point2D(this.coords.x, this.coords.y, this.zScale);
  }
}
class Point3D extends Point {
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.coords = {
      x: x,
      y: y,
      z: z,
    }
  }
  clone() {
    return new Point3D(this.coords.x, this.coords.y, this.coords.z);
  }
  getZScale(zScaleBase) {
    //    |
    //    |
    //    |     /       / x5
    //    |    /        / x4
    //    |   /         / x3
    //    |__/ ________ / x2
    //    |_/ _________ / x1 - unit z = 0    ^ zScaleBase
    //    |/___________ / x0 - camera        V
    //    |

    return zScaleBase / (zScaleBase - this.coords.z);
  }
}
class Camera {
  unitPlanePosition = new Point3D(0,0,0);
  dolly = 1;
  scale = 1;
  mapToScreen(point3D) {
    const scale3D = new Point3D(this.scale, this.scale, 1);
    const relativeToCamera = point3D.add(this.unitPlanePosition);
    const relativeToCameraCenter = relativeToCamera.subtract(fieldCenter);
    const relativeToCameraCenterScaled = relativeToCameraCenter.multiply(scale3D);
    const zScale = relativeToCameraCenterScaled.getZScale(this.dolly);
    const onScreenCenter = new Point2D(relativeToCameraCenterScaled.coords.x * zScale, relativeToCameraCenterScaled.coords.y * zScale, zScale);
    const onScreen = onScreenCenter.add(screenCenter);
    return onScreen;
  }
  mapToWorld(point2D, z) {
    const scale3DInv = new Point3D(1 / this.scale, 1 / this.scale, 1);
    const onScreenCenter = point2D.subtract(screenCenter);
    const zScale = this.dolly / (this.dolly - z);
    const onScreenCenter3D = new Point3D(onScreenCenter.coords.x / zScale, onScreenCenter.coords.y / zScale, z);
    const onScreenCenter3DScaled = onScreenCenter3D.multiply(scale3DInv);
    const relToCam = onScreenCenter3DScaled.add(fieldCenter);
    const worldPoint = relToCam.subtract(this.unitPlanePosition);
    return worldPoint;
  }
}
class SmoothInput {
  decayPerSec = 0.8;
  scrollBound = 1000;
  xRatio = 0.5;
  yRatio = 0.5;
  scrollAltShiftRatio = 0.5;
  scrollAltRatio = 0.5;
  scrollShiftRatio = 0.5;
  scrollRatio = 0.5;
  constructor(decayPerSec = this.decayPerSec) {
    this.decayPerSec = decayPerSec;
  }
  iteration(dt) {
    const remainsPerSec = 1 - this.decayPerSec;
    const remainsFactor = Math.pow(remainsPerSec, dt);
    const decayFactor = 1 - remainsFactor;
    this.xRatio = this.xRatio * remainsFactor + basic.input.xRatio * decayFactor;
    this.yRatio = this.yRatio * remainsFactor + basic.input.yRatio * decayFactor;

    const scrollAltShiftBounded = Math.min(this.scrollBound, Math.max( - this.scrollBound, basic.input.scrollAltShift ));
    basic.input.scrollAltShift = scrollAltShiftBounded; //send back
    const currentAltShiftScrollRatio = scrollAltShiftBounded / this.scrollBound / 2 + 0.5;
    this.scrollAltShiftRatio = this.scrollAltShiftRatio * remainsFactor + currentAltShiftScrollRatio * decayFactor;

    const scrollAltBounded = Math.min(this.scrollBound, Math.max( - this.scrollBound, basic.input.scrollAlt ));
    basic.input.scrollAlt = scrollAltBounded; //send back
    const currentAltScrollRatio = scrollAltBounded / this.scrollBound / 2 + 0.5;
    this.scrollAltRatio = this.scrollAltRatio * remainsFactor + currentAltScrollRatio * decayFactor;

    const scrollShiftBounded = Math.min(this.scrollBound, Math.max( - this.scrollBound, basic.input.scrollShift ));
    basic.input.scrollShift = scrollShiftBounded; //send back
    const currentShiftScrollRatio = scrollShiftBounded / this.scrollBound / 2 + 0.5;
    this.scrollShiftRatio = this.scrollShiftRatio * remainsFactor + currentShiftScrollRatio * decayFactor;

    const scrollBounded = Math.min(this.scrollBound, Math.max( - this.scrollBound, basic.input.scroll ));
    basic.input.scroll = scrollBounded; //send back
    const currentScrollRatio = scrollBounded / this.scrollBound / 2 + 0.5;
    this.scrollRatio = this.scrollRatio * remainsFactor + currentScrollRatio * decayFactor;
  }
}

class Sparcle {
  constructor(
    pos = new Point3D(),
    vel = new Point3D(),
    acc = new Point3D()
  ) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
  };
  ttl = 5;
  maxTtl = 5;
  trail = [];
  maxTrailLength = 150;
  iteration(t, dt) {
    this.ttl -= dt;
    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;

    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;
    this.trail.unshift(this.pos.clone());
    this.trail.splice(this.maxTrailLength);
  }
}
class SparclePool {
  sparcles = [];
  iteration(t, dt) {
    this.sparcles.forEach((sparcle) => {
      sparcle.iteration(t, dt);
    });
    this.sparcles = this.sparcles.filter((sparcle) => {
      return sparcle.ttl > 0;
    });
  }
  add(pos, vel, acc) {
    this.sparcles.push(new Sparcle(pos, vel, acc));
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    this.add(pos, vel, acc);
  }
  addRandomAtPos(pos) {
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    this.add(pos, vel, acc);
  }
  draw(t, dt) {
    //basic.pie.main.setPlotColor(0,128,255);
    basic.pie.main.setPlotColor(255, 0, 0);
    //basic.pie.main.setAlpha(0.25);




    this.sparcles.forEach((sparcle) => {
      const trailScreenPoints = sparcle.trail.map((worldCoords, worldCoordsId)=>{
        let timeshiftedPoint = timeshift(worldCoords, t);
        const screenPoint = camera.mapToScreen(timeshiftedPoint);
        return screenPoint;
      });
      if (trailScreenPoints.length > 0) {
        let prevCoords = trailScreenPoints[0].coords;
        if (trailScreenPoints.every((point) => { // TODO: check just boundary
          const simpleDistance = Math.abs(prevCoords.x - point.coords.x) +
                                 Math.abs(prevCoords.y - point.coords.y) +
                                 Math.abs(prevCoords.z - point.coords.z);

          const isNoTooLong = simpleDistance < 800;
          prevCoords = point.coords;
          return isNoTooLong;
        })) {
          splitArray(trailScreenPoints, 5).forEach((slice, sliceId)=>{
            basic.pie.main.setAlpha((20 - sliceId) / 20 * sparcle.ttl / 5);
            basic.pie.main.setLineWidth((sliceId + 1) * 1 * slice[0].zScale);
            basic.pie.main.plotPolyline(slice.map(point => point.coords));
          })
        }
      }
    });
  }
}
function splitArray(array, step) {
  const slices = [];
  while (array.length > 0) {
    slices.push(array.slice(0, step + 1));
    array.splice(0, step);
  }
  return slices;
}


class Cubus {
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
    entropy: {
      blink: {
        freq: 3 + Math.random() * 3,
      },
    }
  }
  blinkPhase = 0;
  constructor(
    pos = new Point3D(),
    vel = new Point3D(),
    acc = new Point3D(),
    size = new Point3D(),
  ) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.size = size;
  };
  ttl = 2;
  maxTtl = 2;
  iteration(t, dt) {
    this.ttl -= dt;
    const ttlRatio = this.ttl / this.maxTtl;
    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;

    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;

    this.blinkPhase += this.style.entropy.blink.freq * dt * ttlRatio;
  }
}
class CubusPool {
  cubuses = [];
  iteration(t, dt) {
    this.cubuses.forEach((cubus) => {
      cubus.iteration(t, dt);
    });
    this.cubuses = this.cubuses.filter((cubus) => {
      return cubus.ttl > 0;
    });
  }
  add(pos, vel, acc, size) {
    this.cubuses.push(new Cubus(pos, vel, acc, size));
  }
  addRandom() {
    const size = new Point3D(100,100,100);
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    //const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const vel = new Point3D();
    const acc = new Point3D();
    this.add(pos, vel, acc, size);
  }
  addRandomAtPos(pos) {
    const size = new Point3D(100,100,100);
    //const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const vel = new Point3D();
    const acc = new Point3D();
    this.add(pos, vel, acc, size);
  }
  draw(t, dt) {
    basic.pie.extra.setLineWidth(2);
    this.cubuses.forEach((cubus) => {
      const timeshiftedCenterPoint = timeshift(cubus.pos, t);
      const wordVertices = [
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, +cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, -cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, -cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, +cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, +cubus.size.coords.y, -cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, -cubus.size.coords.y, -cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, -cubus.size.coords.y, -cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, +cubus.size.coords.y, -cubus.size.coords.z)),
      ]
      const poligonsVertexIds = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [1, 2, 6, 5],
        [3, 0, 4, 7],
      ]

      const screenVertices = wordVertices.map((vertex) => {
        const screenPoint = camera.mapToScreen(vertex);
        return screenPoint;
      });
      const screenPoligons = poligonsVertexIds.map((poligonVertexIds)=>{
        return poligonVertexIds.map((poligonVertexId)=>{
          return screenVertices[poligonVertexId].coords;
        });
      });

      basic.pie.extra.setFillColor(cubus.style.color.r, cubus.style.color.g, cubus.style.color.b);
      basic.pie.extra.setPlotColor(cubus.style.color.r, cubus.style.color.g, cubus.style.color.b);

      const blinkRatio = Math.sin(cubus.blinkPhase * Math.PI * 2) / 2 + 0.5;
      const ttlRatio = cubus.ttl / cubus.maxTtl;
      basic.pie.extra.setAlpha(0.1 * ttlRatio);
      screenPoligons.forEach((screenPoligon)=>{
        basic.pie.extra.fillPolygon(screenPoligon);
      })
      basic.pie.extra.setAlpha((0.5 + blinkRatio * 0.5) * ttlRatio);

      screenPoligons.forEach((screenPoligon)=>{
        basic.pie.extra.plotPolyline(screenPoligon, true);
      });

    });
  }
}


class Star {
  constructor(pos = new Point3D(), intense = Math.random()) {
    this.pos = pos;
    this.style.intense = intense;
  }
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
    intense: Math.random(),
    entropy: {
      blink: {
        phaseShift: Math.random(),
        freq: Math.random() * 1,
      },
      burnWave: {
        amount: Math.random(),
        phaseShift: (Math.random() - 0.5) / 4,
      }
    }
  }
}
class StarPool {
  stars = [];
  iteration(t, dt) {
    // this.stars.forEach((star) => {
    //   star.iteration(t, dt);
    // });
    // this.stars = this.stars.filter((star) => {
    //   return star.ttl > 0;
    // });
  }
  add(pos, intense) {
    this.stars.push(new Star(pos, intense));
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const intense = Math.random();
    this.add(pos, intense);
  }
  addRandomAtPos(pos) {
    const intense = Math.random();
    this.add(pos, intense);
  }
  draw(t, dt) {
    this.stars.forEach((star) => {
      const timeshiftedPoint = timeshift(star.pos, t);
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
    });
  }
}

class Dust {
  constructor(pos = new Point3D(), intense = Math.random()) {
    this.pos = pos;
    this.style.intense = intense;
  }
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
    intense: Math.random(),
    entropy: {
      blink: {
        phaseShift: Math.random(),
        freq: Math.random() * 1,
      },
      burnWave: {
        // amount: Math.random(),
        phaseShift: (Math.random() - 0.5) / 4,
      }
    }
  }
}

class DustPool {
  dusts = [];
  iteration(t, dt) {
    // this.dusts.forEach((dust) => {
    //   dust.iteration(t, dt);
    // });
    // this.dusts = this.dusts.filter((dust) => {
    //   return dust.ttl > 0;
    // });
  }
  add(pos, intense) {
    this.dusts.push(new Dust(pos, intense));
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const intense = Math.random();
    this.add(pos, intense);
  }
  addRandomAtPos(pos) {
    const intense = Math.random();
    this.add(pos, intense);
  }
  draw(t, dt) {
    this.dusts.forEach((dust) => {
      const timeshiftedPoint = timeshift(dust.pos, t);

      const blinkRatio = sampleBlinkRatio(t, dust.style.entropy.blink.freq, dust.style.entropy.blink.phaseShift);
      let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, dust.style.entropy.burnWave.phaseShift - 0.1, 2);
      //burnWaveRatio *= dust.style.entropy.burnWave.amount;

      const screenPoint = camera.mapToScreen(timeshiftedPoint);




      //let intense = 0.4 * dust.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
      let intense =
        + 0.5 * dust.style.intense
        + 0.5 * blinkRatio
        + 2 * burnWaveRatio
        - 1.1;

      if (intense > 0) {
        const tweakedIntense = Math.pow(intense, 1/2);
        const plusSize = tweakedIntense / screenPoint.zScale * 1.5;
        basic.pie.main.setAlpha(tweakedIntense);
        basic.pie.main.setPlotColor(dust.style.color.r, dust.style.color.g, dust.style.color.b);
        basic.pie.main.plotLine(screenPoint.coords.x, screenPoint.coords.y - plusSize, screenPoint.coords.x, screenPoint.coords.y + plusSize);
        basic.pie.main.plotLine(screenPoint.coords.x - plusSize, screenPoint.coords.y, screenPoint.coords.x + plusSize, screenPoint.coords.y);
      }
    });
  }
}
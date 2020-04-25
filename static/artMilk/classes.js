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
    return new Point2D(this.coords.x, this.coords.y);
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
}
class SmoothInput {
  decayPerSec = 0.8;
  scrollBound = 1000;
  xRatio = 0.5;
  yRatio = 0.5;
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

    const scrollBounded = Math.min(this.scrollBound, Math.max( - this.scrollBound, basic.input.scroll ));
    basic.input.scroll = scrollBounded; //send back
    const currentScrollRatio = scrollBounded / this.scrollBound / 2 + 0.5;
    this.scrollRatio = this.scrollRatio * remainsFactor + currentScrollRatio * decayFactor;
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
    basic.pie.main.setPlotColor(0,128,255);
    //basic.pie.main.setAlpha(0.25);
    this.sparcles.forEach((sparcle) => {
      const trailScreenCoords = sparcle.trail.map((worldCoords)=>{
        const timeshiftedPoint = timeshift(worldCoords, t);
        const screenPoint = camera.mapToScreen(timeshiftedPoint);
        return screenPoint.coords;
      });
      if (trailScreenCoords.length > 0) {
        let prevCoords = trailScreenCoords[0];
        if (trailScreenCoords.every((coords) => { // TODO: check just boundary
          const simpleDistance = Math.abs(prevCoords.x - coords.x) +
                                 Math.abs(prevCoords.y - coords.y) +
                                 Math.abs(prevCoords.z - coords.z);

          const isNoTooLong = simpleDistance < 800;
          prevCoords = coords;
          return isNoTooLong;
        })) {
          splitArray(trailScreenCoords, 5).forEach((sliceCoords, sliceId)=>{
            basic.pie.main.setAlpha((20 - sliceId) / 20 * sparcle.ttl / 5);
            basic.pie.main.setLineWidth((sliceId + 1) * 1);
            basic.pie.main.plotPolyline(sliceCoords);
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
        freq: Math.random() * 3,
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
  ttl = 10;
  maxTtl = 10;
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

      basic.pie.extra.setAlpha(0 + blinkRatio * 0.2);
      screenPoligons.forEach((screenPoligon)=>{
        basic.pie.extra.fillPolygon(screenPoligon);
      })
      basic.pie.extra.setAlpha(0.5);
      screenPoligons.forEach((screenPoligon)=>{
        basic.pie.extra.plotPolyline(screenPoligon, true);
      });

    });
  }
}
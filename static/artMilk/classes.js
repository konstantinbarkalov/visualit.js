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
  ttl = 2;
  trail = [];
  maxTrailLength = 10;
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
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 0.1);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 0.1);
    this.add(pos, vel, acc);
  }
  addRandomAtPos(pos) {
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 0.1);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 0.1);
    this.add(pos, vel, acc);
  }
  draw(t, dt) {
    basic.pie.main.setPlotColor(255,0,0);
    basic.pie.main.setAlpha(1);
    basic.pie.main.setLineWidth(3);
    this.sparcles.forEach((sparcle) => {
      const trailScreenCoords = sparcle.trail.map((worldCoords)=>{
        const timeshiftedPoint = timeshift(worldCoords, t);
        const screenPoint = camera.mapToScreen(timeshiftedPoint);
        return screenPoint.coords;
      });

      //basic.pie.main.plotDot(screenPoint.coords.x, screenPoint.coords.y);
      basic.pie.main.plotPolyline(trailScreenCoords);
    });
  }
}

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
    });
  }
  add(point) {
    return this.everyCoord((coordValue, coordKey)=>{
      return coordValue + point.coords[coordKey];
    });
  }
  multiply(point) {
    return this.everyCoord((coordValue, coordKey)=>{
      return coordValue * point.coords[coordKey];
    });
  }
  len() {
    let magnitude = 0;
    this.everyCoord((coordValue)=>{
      magnitude += coordValue ** 2;
    });
    return Math.sqrt(magnitude);
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
  rotateX(angleDelta) {
    const posRotated = this.clone();
    posRotated.coords.y = Math.cos(angleDelta) * this.coords.y - Math.sin(angleDelta) * this.coords.z;
    posRotated.coords.z = Math.sin(angleDelta) * this.coords.y + Math.cos(angleDelta) * this.coords.z;
    return posRotated;
  }
  rotateY(angleDelta) {
    const posRotated = this.clone();
    posRotated.coords.x = Math.cos(angleDelta) * this.coords.x - Math.sin(angleDelta) * this.coords.z;
    posRotated.coords.z = Math.sin(angleDelta) * this.coords.x + Math.cos(angleDelta) * this.coords.z;
    return posRotated;
  }
  rotateZ(angleDelta) {
    const posRotated = this.clone();
    posRotated.coords.x = Math.cos(angleDelta) * this.coords.x - Math.sin(angleDelta) * this.coords.y;
    posRotated.coords.y = Math.sin(angleDelta) * this.coords.x + Math.cos(angleDelta) * this.coords.y;
    return posRotated;
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
  scrollBound = 1500;
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







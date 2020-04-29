class AbstactPoint {
  // everyCoord(callbackFn) {
  //   throw new Error('Unimplemented');
  // }
  // everyCoordForEach(callbackFn) {
  //   throw new Error('Unimplemented');
  // }
  // everyCoordForPoint(point, callbackFn) {
  //   throw new Error('Unimplemented');
  // }
  // clone() {
  //   throw new Error('Unimplemented');
  // }
  subtract(point) {
    return this.everyCoordForPoint(point, (a, b) => {
      return a - b;
    });
  }
  add(point) {
    return this.everyCoordForPoint(point, (a, b) => {
      return a + b;
    });
  }
  multiply(point) {
    return this.everyCoordForPoint(point, (a, b) => {
      return a * b;
    });
  }
  len() {
    return Math.sqrt(this.mag());
  }
  mag() {
    let magnitude = 0;
    this.everyCoordForEach((coordValue) => {
      magnitude += coordValue ** 2;
    });
    return magnitude;
  }
}
class Point2D extends AbstactPoint {
  constructor(x = 0, y = 0, zScale = 1) {
    super();
    this.coords = {
      x: x,
      y: y,
    }
    this.zScale = zScale;
  }
  clone() {
    return new Point2D(this.coords.x, this.coords.y, this.zScale);
  }
  everyCoord(callbackFn) {
    const clone = this.clone();
    clone.coords.x = callbackFn(this.coords.x, 'x');
    clone.coords.y = callbackFn(this.coords.y, 'y');
    return clone;
  }
  everyCoordForEach(callbackFn) {
    callbackFn(this.coords.x, 'x');
    callbackFn(this.coords.y, 'y');
  }
  everyCoordForPoint(point, callbackFn) {
    const clone = this.clone();
    clone.coords.x = callbackFn(this.coords.x, point.coords.x, 'x');
    clone.coords.y = callbackFn(this.coords.y, point.coords.y, 'y');
    return clone;
  }
}
class Point3D extends AbstactPoint {
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
  everyCoord(callbackFn) {
    const clone = this.clone();
    clone.coords.x = callbackFn(this.coords.x, 'x');
    clone.coords.y = callbackFn(this.coords.y, 'y');
    clone.coords.z = callbackFn(this.coords.z, 'z');
    return clone;
  }
  everyCoordForEach(callbackFn) {
    callbackFn(this.coords.x, 'x');
    callbackFn(this.coords.y, 'y');
    callbackFn(this.coords.z, 'z');
  }
  everyCoordForPoint(point, callbackFn) {
    const clone = this.clone();
    clone.coords.x = callbackFn(this.coords.x, point.coords.x, 'x');
    clone.coords.y = callbackFn(this.coords.y, point.coords.y, 'y');
    clone.coords.z = callbackFn(this.coords.z, point.coords.z, 'z');
    return clone;
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
class AngularPoint2D {
  constructor(r = 0, a = 0, zScale = 1) {
    this.coords = {
      r: r,
      a: a,
    }
    this.zScale = zScale;
  }
  clone() {
    return new AngularPoint2D(this.coords.r, this.coords.a, this.zScale);
  }
  toCartesian() {
    const r = this.coords.r;
    const a = this.coords.a;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    return new Point2D(x, y, this.zScale);
  }
  static fromCartesian(cartesianPoint2D) {
    const x = cartesianPoint2D.coords.x;
    const y = cartesianPoint2D.coords.y;
    const r = Math.sqrt(x**2 + y**2);
    const a = Math.atan2(y, x);
    return new AngularPoint2D(r, a, this.zScale);
  }
}
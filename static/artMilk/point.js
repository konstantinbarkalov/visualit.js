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
    return this.everyCoord((coordValue, coordKey) => {
      return coordValue - point.coords[coordKey];
    });
  }
  add(point) {
    return this.everyCoord((coordValue, coordKey) => {
      return coordValue + point.coords[coordKey];
    });
  }
  multiply(point) {
    return this.everyCoord((coordValue, coordKey) => {
      return coordValue * point.coords[coordKey];
    });
  }
  len() {
    let magnitude = 0;
    this.everyCoord((coordValue) => {
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
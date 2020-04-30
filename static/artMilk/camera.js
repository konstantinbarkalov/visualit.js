class Camera {
  unitPlanePosition = new Point3D(0, 0, 0);
  dolly = 1;
  scale3D = 1;
  scale2D = 1;
  pitch = 0;
  yaw = 0;
  roll = 0;
  mapToScreen(point3D) {
    const scale3D = new Point3D(this.scale3D, this.scale3D, this.scale3D);
    const scale2D = new Point2D(this.scale2D, this.scale2D);
    const orientedPoint = point3D.rotateX(this.pitch).rotateY(this.yaw).rotateZ(this.roll);
    const relativeToCameraPlane = orientedPoint.subtract(this.unitPlanePosition);
    const relativeToCameraPlaneScaled = relativeToCameraPlane.multiply(scale3D);
    const zScale = relativeToCameraPlaneScaled.getZScale(this.dolly);
    const onScreenCenter = new Point2D(relativeToCameraPlaneScaled.coords.x * zScale, relativeToCameraPlaneScaled.coords.y * zScale, zScale);
    const onScreenCenterScaled = onScreenCenter.multiply(scale2D);
    onScreenCenterScaled.zScale *= this.scale2D;
    const onScreen = onScreenCenterScaled.add(screenCenter);
    return onScreen;
  }
  mapToWorld(point2D, z) {
    const scale3DInv = new Point3D(1 / this.scale3D, 1 / this.scale3D, 1 / this.scale3D);
    const scale2DInv = new Point2D(1 / this.scale2D, 1 / this.scale2D);
    const onScreenCenter = point2D.subtract(screenCenter);
    const onScreenCenterDescaled = onScreenCenter.multiply(scale2DInv);
    const zScale = this.dolly / (this.dolly - z);
    const onScreenCenter3D = new Point3D(onScreenCenterDescaled.coords.x / zScale, onScreenCenterDescaled.coords.y / zScale, z);
    const onScreenCenter3DDescaled = onScreenCenter3D.multiply(scale3DInv);
    const worldPoint = onScreenCenter3DDescaled.add(this.unitPlanePosition);
    return worldPoint;
  }
}

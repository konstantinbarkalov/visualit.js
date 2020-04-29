class Camera {
  unitPlanePosition = new Point3D(0, 0, 0);
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

class CursorProjector {
  pos = new Point3D();
  targetZ = 500;
  iteration(t, dt) {
    const screenPoint = new Point2D(basic.input.x, basic.input.y);
    this.pos = camera.mapToWorld(screenPoint, this.targetZ);
    this.targetZ = basic.input.scroll / 2;
  }
  draw(t, dt) {
    basic.pie.main.setAlpha(1);
    basic.pie.main.setPlotColor(255, 128, 255);
    basic.pie.main.setLineWidth(2);
    //const timeshiftedCenterPoint = timeshift(player.pos, t);
    cursorPolys.forEach(cursorPoly => {
        const screenPointsCoords = cursorPoly.map(point => {
          const worldPoint = point.add(this.pos);
          const screenPoint = camera.mapToScreen(worldPoint);
          return screenPoint.coords;
        });
        basic.pie.main.plotPolyline(screenPointsCoords);
      });




  }
}
cursorPolys = [
  [
    new Point3D(-20, 0 ,0),
    new Point3D(20, 0 ,0),
  ],
  [
    new Point3D(0, 20, 0),
    new Point3D(0, -20, 0),
  ],
  [
    new Point3D(0, 0, -20),
    new Point3D(0, 0, 20),
  ],
]
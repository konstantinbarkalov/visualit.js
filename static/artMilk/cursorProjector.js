class CursorProjector {
  pos = new Point3D();
  targetZ = 500;
  phisicIteration(t, dt) {
    const screenPoint = new Point2D(basic.input.x, basic.input.y);
    this.pos = camera.mapToWorld(screenPoint, this.targetZ);
    this.targetZ = (smoothInput.scrollRatio - 0.5) * fieldDepth * -1;
  }
  drawIteration(t, dt) {
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

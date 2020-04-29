class AxisDisplay {
  stars = [];
  phisicIteration(t, dt) {
  }

  drawIteration(t, dt) {
    const margin = 10;
    const axisScreenBoundScreenUpLeft = new Point2D(margin, margin);
    const axisScreenBoundScreenDownRight = new Point2D(basic.input.w - margin, basic.input.h - margin);
    const axisScreenBoundWorldUpLeft = camera.mapToWorld(axisScreenBoundScreenUpLeft, fieldDepth / 2);
    const axisScreenBoundWorldDownRight = camera.mapToWorld(axisScreenBoundScreenDownRight, fieldDepth / 2);

    const axisScreenBoxPolys = this.generateBoxPolys(axisScreenBoundWorldUpLeft, axisScreenBoundWorldDownRight);

    axisScreenBoxPolys.forEach((axisPoly) => {
      const timeshiftedAxisPoly = axisPoly.map((point)=>{
        return timeshift(point, t);
      })
      const screenAxisPoly = timeshiftedAxisPoly.map((point)=>{
        return camera.mapToScreen(point);
      })
      const screenAxisPolyCoords = screenAxisPoly.map(point => point.coords);
      basic.pie.main.setAlpha(0.1);
      basic.pie.main.setColor(255, 255, 255);
      basic.pie.main.setLineWidth(1);
      basic.pie.main.plotPolyline(screenAxisPolyCoords);
    });

    const axisScreenSideRollerPolys = this.generateSideRollerPolys(axisScreenBoundWorldUpLeft, axisScreenBoundWorldDownRight);

    axisScreenSideRollerPolys.forEach((axisPoly) => {
      const timeshiftedAxisPoly = axisPoly.map((point)=>{
        return timeshift(point, t);
      })
      const screenAxisPoly = timeshiftedAxisPoly.map((point)=>{
        return camera.mapToScreen(point);
      })
      const screenAxisPolyCoords = screenAxisPoly.map(point => point.coords);
      basic.pie.main.setAlpha(0.5);
      basic.pie.main.setColor(255, 255, 255);
      basic.pie.main.setLineWidth(1);
      basic.pie.main.plotPolyline(screenAxisPolyCoords);
    });

    const axisScreenCrossPolys = this.generateCrossPolys(axisScreenBoundWorldUpLeft, axisScreenBoundWorldDownRight);

    axisScreenCrossPolys.forEach((axisPoly) => {
      const timeshiftedAxisPoly = axisPoly.map((point)=>{
        return timeshift(point, t);
      })
      const screenAxisPoly = timeshiftedAxisPoly.map((point)=>{
        return camera.mapToScreen(point);
      })
      const screenAxisPolyCoords = screenAxisPoly.map(point => point.coords);
      basic.pie.main.setAlpha(1);
      basic.pie.main.setColor(255, 255, 255);
      basic.pie.main.setLineWidth(0.5);
      basic.pie.main.plotPolyline(screenAxisPolyCoords);
    });
    if (!isInField(cursorProjector.pos)) {

      const axisFieldBoundWorldUpLeft = new Point2D();
      const axisFieldBoundWorldDownRight = new Point2D(fieldWidth, fieldHeight);

      const axisFieldBoxPolys = this.generateBoxPolys(axisFieldBoundWorldUpLeft, axisFieldBoundWorldDownRight);

      axisFieldBoxPolys.forEach((axisPoly) => {
        const timeshiftedAxisPoly = axisPoly.map((point)=>{
          return timeshift(point, t);
        })
        const screenAxisPoly = timeshiftedAxisPoly.map((point)=>{
          return camera.mapToScreen(point);
        })
        const screenAxisPolyCoords = screenAxisPoly.map(point => point.coords);
        basic.pie.main.setAlpha(1);
        basic.pie.main.setColor(255, 0, 0);
        basic.pie.main.setLineWidth(1);
        basic.pie.main.plotPolyline(screenAxisPolyCoords);
      });

      const axisFieldSideRollerPolys = this.generateSideRollerPolys(axisFieldBoundWorldUpLeft, axisFieldBoundWorldDownRight);

      axisFieldSideRollerPolys.forEach((axisPoly) => {
        const timeshiftedAxisPoly = axisPoly.map((point)=>{
          return timeshift(point, t);
        })
        const screenAxisPoly = timeshiftedAxisPoly.map((point)=>{
          return camera.mapToScreen(point);
        })
        const screenAxisPolyCoords = screenAxisPoly.map(point => point.coords);
        basic.pie.main.setAlpha(1);
        basic.pie.main.setColor(255, 0, 0);
        basic.pie.main.setLineWidth(1);
        basic.pie.main.plotPolyline(screenAxisPolyCoords);
      });

    }

    basic.pie.main.setAlpha(0.5);
    basic.pie.main.setLineWidth(1);

    starPool.stars.forEach(star => {
      const maxZDist = 50;
      const zDiff = star.pos.coords.z - cursorProjector.pos.coords.z;
      const zDist = Math.abs(zDiff);
      const sliceRadius = maxZDist - zDist;
      if (sliceRadius > 0) {
        const timeShiftedWorldPoint = timeshift(star.pos, t);
        const screenPoint = camera.mapToScreen(timeShiftedWorldPoint);
        basic.pie.main.setColor(star.style.color.r, star.style.color.g, star.style.color.b);
        basic.pie.main.plotCircle(screenPoint.coords.x, screenPoint.coords.y, sliceRadius * screenPoint.zScale);
      };
    });
    cubusPool.cubuses.forEach(cubus => {
      const axisScreenCubusSideShadowPolys = this.generateCubusSideShadowPolys(axisScreenBoundWorldUpLeft, axisScreenBoundWorldDownRight, cubus);
      axisScreenCubusSideShadowPolys.forEach((axisPoly) => {
        const timeshiftedAxisPoly = axisPoly.map((point)=>{
          return timeshift(point, t);
        })
        const screenAxisPoly = timeshiftedAxisPoly.map((point)=>{
          return camera.mapToScreen(point);
        })
        const screenAxisPolyCoords = screenAxisPoly.map(point => point.coords);
        basic.pie.main.setAlpha(1);
        basic.pie.main.setColor(cubus.style.color.r, cubus.style.color.g, cubus.style.color.b);
        basic.pie.main.setLineWidth(1);
        basic.pie.main.plotPolyline(screenAxisPolyCoords);
      });
    });
  }
  generateSideRollerPolys(upLeftPoint2D, downRightPoint2D) {
    return [
      [ // z-roller left side
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, cursorProjector.pos.coords.z),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, cursorProjector.pos.coords.z),
      ],
      [ // y-roller left side
        new Point3D(upLeftPoint2D.coords.x, cursorProjector.pos.coords.y, -fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, cursorProjector.pos.coords.y, fieldDepth / 2),
      ],
      [ // z-roller up side
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, cursorProjector.pos.coords.z),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, cursorProjector.pos.coords.z),
      ],
      [ // x-roller up side
        new Point3D(cursorProjector.pos.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(cursorProjector.pos.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
      ],
      [ // z-roller right side
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, cursorProjector.pos.coords.z),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, cursorProjector.pos.coords.z),
      ],
      [ // y-roller right side
        new Point3D(downRightPoint2D.coords.x, cursorProjector.pos.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, cursorProjector.pos.coords.y, fieldDepth / 2),
      ],
      [ // z-roller down side
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, cursorProjector.pos.coords.z),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, cursorProjector.pos.coords.z),
      ],
      [ // x-roller down side
        new Point3D(cursorProjector.pos.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(cursorProjector.pos.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
      ],
    ]

  }
  generateCrossPolys(upLeftPoint2D, downRightPoint2D) {
    return  [
      [ // x-cross
        new Point3D(cursorProjector.pos.coords.x, upLeftPoint2D.coords.y, cursorProjector.pos.coords.z),
        new Point3D(cursorProjector.pos.coords.x, downRightPoint2D.coords.y, cursorProjector.pos.coords.z),
      ],
      [ // y-cross
        new Point3D(upLeftPoint2D.coords.x, cursorProjector.pos.coords.y, cursorProjector.pos.coords.z),
        new Point3D(downRightPoint2D.coords.x, cursorProjector.pos.coords.y, cursorProjector.pos.coords.z),
      ],
    ];
  }
  generateBoxPolys(upLeftPoint2D, downRightPoint2D) {
    return [
      [ // box bottom side
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
      ],
      [ // box top side
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
      ],
      [ // box left side
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
      ],
      [ // box up side
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
      ],
      [ // box right side
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, upLeftPoint2D.coords.y, -fieldDepth / 2),
      ],
      [ // box down side
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
        new Point3D(downRightPoint2D.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, fieldDepth / 2),
        new Point3D(upLeftPoint2D.coords.x, downRightPoint2D.coords.y, -fieldDepth / 2),
      ],
    ];
  }
  generateCubusSideShadowPolys(upLeftPoint2D, downRightPoint2D, cubus) {
    return [
      // [ // box bottom side
      //   new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, cubus.pos.coords.y - cubus.size.coords.y / 2, -fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, cubus.pos.coords.y - cubus.size.coords.y / 2, -fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, cubus.pos.coords.y + cubus.size.coords.y / 2, -fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, cubus.pos.coords.y + cubus.size.coords.y / 2, -fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, cubus.pos.coords.y - cubus.size.coords.y / 2, -fieldDepth / 2),
      // ],
      // [ // box top side
      //   new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, cubus.pos.coords.y - cubus.size.coords.y / 2, fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, cubus.pos.coords.y - cubus.size.coords.y / 2, fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, cubus.pos.coords.y + cubus.size.coords.y / 2, fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, cubus.pos.coords.y + cubus.size.coords.y / 2, fieldDepth / 2),
      //   new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, cubus.pos.coords.y - cubus.size.coords.y / 2, fieldDepth / 2),
      // ],
      [ // box left side
        new Point3D(upLeftPoint2D.coords.x, cubus.pos.coords.y - cubus.size.coords.y / 2, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(upLeftPoint2D.coords.x, cubus.pos.coords.y - cubus.size.coords.y / 2, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(upLeftPoint2D.coords.x, cubus.pos.coords.y + cubus.size.coords.y / 2, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(upLeftPoint2D.coords.x, cubus.pos.coords.y + cubus.size.coords.y / 2, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(upLeftPoint2D.coords.x, cubus.pos.coords.y - cubus.size.coords.y / 2, cubus.pos.coords.z - cubus.size.coords.z / 2),
      ],
      [ // box up side
        new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, upLeftPoint2D.coords.y, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, upLeftPoint2D.coords.y, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, upLeftPoint2D.coords.y, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, upLeftPoint2D.coords.y, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, upLeftPoint2D.coords.y, cubus.pos.coords.z - cubus.size.coords.z / 2),
      ],
      [ // box right side
        new Point3D(downRightPoint2D.coords.x, cubus.pos.coords.y - cubus.size.coords.y / 2, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(downRightPoint2D.coords.x, cubus.pos.coords.y - cubus.size.coords.y / 2, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(downRightPoint2D.coords.x, cubus.pos.coords.y + cubus.size.coords.y / 2, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(downRightPoint2D.coords.x, cubus.pos.coords.y + cubus.size.coords.y / 2, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(downRightPoint2D.coords.x, cubus.pos.coords.y - cubus.size.coords.y / 2, cubus.pos.coords.z - cubus.size.coords.z / 2),
      ],
      [ // box down side
        new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, downRightPoint2D.coords.y, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, downRightPoint2D.coords.y, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, downRightPoint2D.coords.y, cubus.pos.coords.z + cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x + cubus.size.coords.x / 2, downRightPoint2D.coords.y, cubus.pos.coords.z - cubus.size.coords.z / 2),
        new Point3D(cubus.pos.coords.x - cubus.size.coords.x / 2, downRightPoint2D.coords.y, cubus.pos.coords.z - cubus.size.coords.z / 2),
      ],
    ];
  }
}



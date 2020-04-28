async function art() {
  artInit();
  let t = 0;
  const idealFps = 30;
  const idealDt = 1 / idealFps;
  let prevIterationStartSysTime = Date.now() / 1000;
  let prevDutyRatio = 0.5;
  while(true) {
    const iterationStartSysTime = Date.now() / 1000;
    const dt = iterationStartSysTime - prevIterationStartSysTime;
    t = t + dt;

    artIteration(t, dt);
    artDrawStatistic(t, dt, prevDutyRatio);

    const iterationEndSysTime = Date.now() / 1000;
    const dutyDt = iterationEndSysTime - iterationStartSysTime;
    prevDutyRatio = dutyDt / idealDt;
    const pauseDt = Math.max(0, (idealDt - dutyDt));
    prevIterationStartSysTime = iterationStartSysTime;
    await basic.pause(pauseDt * 1000);
  }
}
function artInit() {
  //artOriginalInit();
  //artJuliaInit();
  artMilkInit();
}
function artIteration(t, dt) {
  //artOriginalIteration(t, dt);
  //artJuliaIteration(t, dt);
  artMilkIteration(t, dt);
}
function artDrawStatistic(t, dt, dutyRatio) {
  const tiemString = t.toFixed(2) + ' sec';
  const dutyString = (dutyRatio * 100).toFixed(0).padStart(2,'0') + '%';
  const fpsString = (1 / dt).toFixed(0) + ' fps';
  const cursorCoordString = '[' + basic.input.x + ', ' + basic.input.y + ']';
  const statString = tiemString + ' ' + dutyString + ' ' + fpsString + ' ' + cursorCoordString;
  //
  //  cornerPoint1
  //   v_______________________
  //   |  v                    |
  //   |  .TEXT HERE           |
  //   |__|____________________|
  //      |                    ^
  //      |               cornerPoint2
  //   textPoint

  const cornerPoint1 = {
    x: 10,
    y: basic.input.h - 30
  }
  const cornerPoint2 = {
    x: cornerPoint1.x + 120,
    y: cornerPoint1.y + 14
  }
  const textPoint = {
    x: cornerPoint1.x + 4,
    y: cornerPoint1.y + 10
  }

  basic.pie.main.setAlpha(1);
  basic.pie.main.setColor(0, 0, 0);
  basic.pie.main.fillRect(cornerPoint1.x, cornerPoint1.y, cornerPoint2.x, cornerPoint2.y);
  basic.pie.main.setColor(255, 255, 255);
  basic.pie.main.print(textPoint.x, textPoint.y, statString);
}
async function art() {
  artInit();
  let t = 0;
  const idealFps = 30;
  const idealDt = 1 / idealFps;
  let prevIterationStartSysTime = Date.now() / 1000;
  while(true) {
    const iterationStartSysTime = Date.now() / 1000;
    const dt = iterationStartSysTime - prevIterationStartSysTime;
    t = t + dt;

    artIteration(t, dt);

    const iterationEndSysTime = Date.now() / 1000;
    const dutyDt = iterationEndSysTime - iterationStartSysTime;
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
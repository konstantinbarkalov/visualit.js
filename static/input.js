class VisualitInput {
  constructor (containerDom) {
    this.containerDom = containerDom;
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.containerDom.addEventListener('mousemove', (e) => {
      this.onMouseMove(e.offsetX, e.offsetY);
    });
    this.containerDom.addEventListener('mousewheel', (e) => {
      this.onMouseScroll(e.wheelDelta);
    });
    document.addEventListener('keydown', (e) => {
      if (e.which >= 16 && e.which <= 18) {
        e.preventDefault();
        this.onModificatorKeyChange(e.shiftKey, e.altKey, e.ctrlKey);
      }
      if (e.which === 32) {
        e.preventDefault();
        this.onPrimaryKeyChange(true);
      } else if (e.which === 13) {
        e.preventDefault();
        this.onSecondaryKeyChange(true);
      } else if (e.which === 90) {
        e.preventDefault();
        this.onAKeyChange(true);
      } else if (e.which === 88) {
        e.preventDefault();
        this.onBKeyChange(true);
      } else if (e.which === 67) {
        e.preventDefault();
        this.onCKeyChange(true);
      } else if (e.which === 38) {
        e.preventDefault();
        this.onUpKeyChange(true);
      } else if (e.which === 40) {
        e.preventDefault();
        this.onDownKeyChange(true);
      } else if (e.which === 37) {
        e.preventDefault();
        this.onLeftKeyChange(true);
      } else if (e.which === 39) {
        e.preventDefault();
        this.onRightKeyChange(true);
      }

    });
    document.addEventListener('keyup', (e) => {
      if (e.which >= 16 && e.which <= 18) {
        this.onModificatorKeyChange(e.shiftKey, e.altKey, e.ctrlKey);
      }
      if (e.which === 32) {
        this.onPrimaryKeyChange(false);
      } else if (e.which === 13) {
        this.onSecondaryKeyChange(false);
      } else if (e.which === 90) {
        this.onAKeyChange(false);
      } else if (e.which === 88) {
        this.onBKeyChange(false);
      } else if (e.which === 67) {
        this.onCKeyChange(false);
      } else if (e.which === 38) {
        this.onUpKeyChange(false);
      } else if (e.which === 40) {
        this.onDownKeyChange(false);
      } else if (e.which === 37) {
        this.onLeftKeyChange(false);
      } else if (e.which === 39) {
        this.onRightKeyChange(false);
      }
    });
    document.addEventListener('mousedown', (e) => {
      if (e.which === 1)  {
        e.preventDefault();
        this.onPrimaryKeyChange(true);
      } else if (e.which === 3) {
        e.preventDefault();
        this.onSecondaryKeyChange(true);
      }
    });
    document.addEventListener('mouseup', (e) => {
      if (e.which === 1)  {
        this.onPrimaryKeyChange(false);
      } else if (e.which === 3) {
        this.onSecondaryKeyChange(false);
      }
    });
    this.onResize();
    this.onMouseMove(this.basic.w / 2, this.basic.h / 2);
    this.onMouseScrollReset();
    this.onPrimaryKeyChange(false);
    this.onSecondaryKeyChange(false);
    this.onAKeyChange(false);
    this.onBKeyChange(false);
    this.onCKeyChange(false);
    this.onUpKeyChange(false);
    this.onDownKeyChange(false);
    this.onLeftKeyChange(false);
    this.onRightKeyChange(false);
  }
  basic = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    scroll: 0,
    scrollAlt: 0,
    scrollShift: 0,
    scrollAltShift: 0,
    xRatio: 0,
    yRatio: 0,
    isPrimaryPressed: false,
    isSecondaryPressed: false,
    isAPressed: false,
    isBPressed: false,
    isCPressed: false,
    isUpPressed: false,
    isDownPressed: false,
    isLeftPressed: false,
    isRightPressed: false,
    isShiftPressed: false,
    isAltPressed: false,
    isCtrlPressed: false,
  }
  onResize() {
    this.basic.w = this.containerDom.clientWidth;
    this.basic.h = this.containerDom.clientHeight;
    this.updateRatios();
  }
  onMouseMove(x, y) {
    this.basic.x = x;
    this.basic.y = y;
    this.updateRatios();
  }
  onMouseScroll(delta) {
    if (this.basic.isAltPressed && this.basic.isShiftPressed) {
      this.basic.scrollAltShift += delta;
    } else if (this.basic.isAltPressed) {
      this.basic.scrollAlt += delta;
    } else if (this.basic.isShiftPressed) {
      this.basic.scrollShift += delta;
    } else {
      this.basic.scroll += delta;
    }
  }
  onMouseScrollReset() {
    this.basic.scrollAltShift = 0;
    this.basic.scrollAlt = 0;
    this.basic.scrollShift = 0;
    this.basic.scroll = 0;
  }
  onPrimaryKeyChange(isPressed) {
    this.basic.isPrimaryPressed = isPressed;
    if (this.onPrimaryKeyChangeChallback) {
      this.onPrimaryKeyChangeChallback();
    }
  }
  onSecondaryKeyChange(isPressed) {
    this.basic.isSecondaryPressed = isPressed;
    if (this.onSecondaryKeyChangeChallback) {
      this.onSecondaryKeyChangeChallback();
    }
  }
  onAKeyChange(isPressed) {
    this.basic.isAPressed = isPressed;
    if (this.onAKeyChangeChallback) {
      this.onAKeyChangeChallback();
    }
  }
  onBKeyChange(isPressed) {
    this.basic.isBPressed = isPressed;
    if (this.onBKeyChangeChallback) {
      this.onBKeyChangeChallback();
    }
  }
  onCKeyChange(isPressed) {
    this.basic.isCPressed = isPressed;
    if (this.onCKeyChangeChallback) {
      this.onCKeyChangeChallback();
    }
  }
  onUpKeyChange(isPressed) {
    this.basic.isUpPressed = isPressed;
    if (this.onUpKeyChangeChallback) {
      this.onUpKeyChangeChallback();
    }
  }
  onDownKeyChange(isPressed) {
    this.basic.isDownPressed = isPressed;
    if (this.onDownKeyChangeChallback) {
      this.onDownKeyChangeChallback();
    }
  }
  onLeftKeyChange(isPressed) {
    this.basic.isLeftPressed = isPressed;
    if (this.onLeftKeyChangeChallback) {
      this.onLeftKeyChangeChallback();
    }
  }
  onRightKeyChange(isPressed) {
    this.basic.isRightPressed = isPressed;
    if (this.onRightKeyChangeChallback) {
      this.onRightKeyChangeChallback();
    }
  }
  onModificatorKeyChange(isShiftPressed, isAltPressed, isCtrlPressed) {
    this.basic.isShiftPressed = isShiftPressed;
    this.basic.isAltPressed = isAltPressed;
    this.basic.isCtrlPressed = isCtrlPressed;
    if (this.onModificatorKeyChangeChallback) {
      this.onModificatorKeyChangeChallback();
    }
  }
  updateRatios() {
    this.basic.xRatio = this.basic.x / this.basic.w;
    this.basic.yRatio = this.basic.y / this.basic.h;
  }
}
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']);

/**
 * Input collection for first-person movement. It deliberately has no knowledge
 * of the scene or collision world: callers read `movement` and apply it.
 */
export class FirstPersonInput {
  constructor(canvas, { camera, onLook, onPause, onActivity, onLockDenied } = {}) {
    this.canvas = canvas;
    this.onLook = onLook;
    this.onPause = onPause;
    this.onActivity = onActivity;
    this.onLockDenied = onLockDenied;
    this.enabled = false;
    this.keys = new Set();
    this.moveStick = { x: 0, y: 0 };
    this.lookStick = { x: 0, y: 0 };
    this.dragPointer = null;
    this.lastDrag = null;
    this.stickPointers = new Map();
    this.isCoarse = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    this.controls = camera ? new PointerLockControls(camera, canvas) : null;
    if (this.controls) {
      this.controls.minPolarAngle = Math.PI * .03;
      this.controls.maxPolarAngle = Math.PI * .97;
      this.controls.enabled = false;
    }

    this.moveElement = document.getElementById('fp-move-stick');
    this.lookElement = document.getElementById('fp-look-stick');
    this.moveThumb = this.moveElement?.querySelector('.stick-thumb');
    this.lookThumb = this.lookElement?.querySelector('.stick-thumb');

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handleOrientation = this.handleOrientation.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleLockChange = this.handleLockChange.bind(this);
    this.handleLockError = this.handleLockError.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('orientationchange', this.handleOrientation);
    document.addEventListener('visibilitychange', this.handleVisibility);
    document.addEventListener('pointerlockchange', this.handleLockChange);
    document.addEventListener('pointerlockerror', this.handleLockError);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerUp);
    canvas.addEventListener('lostpointercapture', this.handlePointerUp);
    this.moveElement?.addEventListener('pointerdown', this.handlePointerDown);
    this.lookElement?.addEventListener('pointerdown', this.handlePointerDown);
    this.moveElement?.addEventListener('pointermove', this.handlePointerMove);
    this.lookElement?.addEventListener('pointermove', this.handlePointerMove);
    this.moveElement?.addEventListener('pointerup', this.handlePointerUp);
    this.lookElement?.addEventListener('pointerup', this.handlePointerUp);
    this.moveElement?.addEventListener('pointercancel', this.handlePointerUp);
    this.moveElement?.addEventListener('lostpointercapture', this.handlePointerUp);
    this.lookElement?.addEventListener('pointercancel', this.handlePointerUp);
    this.lookElement?.addEventListener('lostpointercapture', this.handlePointerUp);
  }

  get locked() { return !!this.controls?.isLocked; }

  get movement() {
    let x = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0) + this.moveStick.x;
    let z = (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0) - (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0) - this.moveStick.y;
    const length = Math.hypot(x, z);
    if (length > 1) { x /= length; z /= length; }
    return { x, z };
  }

  setEnabled(enabled) { this.enabled = enabled; if (this.controls) this.controls.enabled = enabled; if (!enabled) this.clear(); }

  requestLock() {
    if (!this.enabled || this.isCoarse || !this.canvas?.requestPointerLock) return;
    try {
      // Calling the DOM API directly lets modern browsers return a rejection
      // promise; PointerLockControls still observes the resulting lock event.
      const request = this.canvas.requestPointerLock({ unadjustedMovement: false });
      Promise.resolve(request).catch(() => this.onLockDenied?.());
    } catch { this.onLockDenied?.(); }
  }

  clear() {
    this.keys.clear();
    this.moveStick.x = this.moveStick.y = this.lookStick.x = this.lookStick.y = 0;
    this.dragPointer = null;
    this.lastDrag = null;
    this.stickPointers.clear();
    this.setThumb(this.moveThumb, 0, 0);
    this.setThumb(this.lookThumb, 0, 0);
  }

  update(dt) {
    if (!this.enabled || !this.isCoarse || (!this.lookStick.x && !this.lookStick.y)) return;
    // A stick represents a rate, unlike mouse pixels which represent a delta.
    this.onLook?.(this.lookStick.x * 2.35 * dt, this.lookStick.y * 1.8 * dt);
  }

  isTypingTarget(target) {
    return !!target?.closest?.('input, textarea, select, [contenteditable="true"], dialog[open]');
  }
  handleKeyDown(event) {
    if (this.enabled && event.code === 'Escape' && !this.isTypingTarget(event.target)) { this.clear(); this.onPause?.('escape'); return; }
    if (this.isTypingTarget(event.target)) return;
    if (!this.enabled || !MOVE_KEYS.has(event.code)) return;
    this.keys.add(event.code); event.preventDefault(); this.onActivity?.();
  }
  handleKeyUp(event) { if (MOVE_KEYS.has(event.code)) this.keys.delete(event.code); }
  handleBlur() { this.clear(); this.onPause?.('blur'); }
  handleVisibility() { if (document.hidden) { this.clear(); this.onPause?.('hidden'); } }
  handleOrientation() { this.clear(); }
  handleLockChange() {
    if (this.enabled && !this.locked && !this.isCoarse) { this.clear(); this.onPause?.('unlock'); }
  }
  handleLockError() { if (this.enabled) this.onLockDenied?.(); }

  handlePointerDown(event) {
    if (!this.enabled || event.button !== 0) return;
    const target = event.currentTarget;
    if (target === this.moveElement || target === this.lookElement) {
      const type = target === this.moveElement ? 'move' : 'look';
      if ([...this.stickPointers.values()].includes(type)) return;
      event.preventDefault(); target.setPointerCapture?.(event.pointerId);
      this.stickPointers.set(event.pointerId, type);
      this.updateStick(event, type, target);
      this.onActivity?.(); return;
    }
    if (target === this.canvas && !this.locked && event.pointerType !== 'touch') {
      this.dragPointer = event.pointerId; this.lastDrag = { x: event.clientX, y: event.clientY };
      this.canvas.setPointerCapture?.(event.pointerId); this.onActivity?.();
    }
  }
  handlePointerMove(event) {
    const stick = this.stickPointers.get(event.pointerId);
    if (stick) { this.updateStick(event, stick, stick === 'move' ? this.moveElement : this.lookElement); return; }
    if (this.dragPointer !== event.pointerId || this.locked || !this.lastDrag) return;
    const dx = event.clientX - this.lastDrag.x, dy = event.clientY - this.lastDrag.y;
    this.lastDrag = { x: event.clientX, y: event.clientY };
    this.onLook?.(dx * 0.0025, dy * 0.0025);
  }
  handlePointerUp(event) {
    const stick = this.stickPointers.get(event.pointerId);
    if (stick) { this.stickPointers.delete(event.pointerId); if (stick === 'move') { this.moveStick.x = this.moveStick.y = 0; this.setThumb(this.moveThumb, 0, 0); } else { this.lookStick.x = this.lookStick.y = 0; this.setThumb(this.lookThumb, 0, 0); } }
    if (this.dragPointer === event.pointerId) { this.dragPointer = null; this.lastDrag = null; }
  }
  updateStick(event, type, element) {
    if (!element) return;
    const bounds = element.getBoundingClientRect(), radius = Math.max(1, Math.min(bounds.width, bounds.height) * 0.34);
    let x = (event.clientX - (bounds.left + bounds.width / 2)) / radius;
    let y = (event.clientY - (bounds.top + bounds.height / 2)) / radius;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    if (Math.hypot(x, y) < .12) x = y = 0;
    if (type === 'move') { this.moveStick.x = x; this.moveStick.y = y; this.setThumb(this.moveThumb, x, y); }
    else { this.lookStick.x = x; this.lookStick.y = y; this.setThumb(this.lookThumb, x, y); }
  }
  setThumb(thumb, x, y) { if (thumb) thumb.style.transform = `translate(${x * 72}%, ${y * 72}%)`; }

  dispose() {
    this.clear(); this.controls?.unlock?.();
    window.removeEventListener('keydown', this.handleKeyDown); window.removeEventListener('keyup', this.handleKeyUp); window.removeEventListener('blur', this.handleBlur); window.removeEventListener('orientationchange', this.handleOrientation);
    document.removeEventListener('visibilitychange', this.handleVisibility); document.removeEventListener('pointerlockchange', this.handleLockChange); document.removeEventListener('pointerlockerror', this.handleLockError);
    for (const element of [this.canvas, this.moveElement, this.lookElement]) {
      element?.removeEventListener('pointerdown', this.handlePointerDown);
      element?.removeEventListener('pointermove', this.handlePointerMove);
      element?.removeEventListener('pointerup', this.handlePointerUp);
      element?.removeEventListener('pointercancel', this.handlePointerUp);
      element?.removeEventListener('lostpointercapture', this.handlePointerUp);
    }
    this.controls?.dispose?.();
  }
}

export default FirstPersonInput;

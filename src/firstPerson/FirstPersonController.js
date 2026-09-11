import { Euler, PerspectiveCamera, Vector3 } from 'three';
import { FirstPersonInput } from './FirstPersonInput.js';

const DEFAULTS = { spawn: new Vector3(), yaw: 0, floorHeight: 0, eyeHeight: 1.68, walkSpeed: 2.2, sprintSpeed: 5.4 };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
// Cosmetic hop: eye height only, navigation stays 2D so railings still block mid-air.
const GRAVITY = 9.8, JUMP_HEIGHT = .9; // ~3 ft peak, below railing height

export class FirstPersonController {
  constructor({ scene, domElement, navigationWorld, config = {}, onStateChange, requestRender, avatar } = {}) {
    this.scene = scene; this.domElement = domElement; this.navigationWorld = navigationWorld;
    this.config = { ...DEFAULTS, ...config, spawn: config.spawn?.clone?.() || new Vector3().copy(config.spawn || DEFAULTS.spawn) };
    this.onStateChange = onStateChange; this.requestRender = requestRender;
    this.camera = new PerspectiveCamera(68, 1, .05, 500);
    this._position = this.config.spawn.clone(); this.yaw = this.config.yaw; this.pitch = 0;
    this._active = false; this._paused = false; this.avatar = null;
    this.motionSpeed = 0; this.walkPhase = 0; this.jumpY = 0; this.jumpV = 0;
    this.euler = new Euler(0, 0, 0, 'YXZ');
    this.input = new FirstPersonInput(domElement, { camera: this.camera, onLook: (x, y) => this.look(x, y), onPause: () => this.pause(), onJump: () => this.jump(), onActivity: () => this.requestRender?.(), onLockDenied: () => this.requestRender?.() });
    this.handlePointerLockLook = () => {
      if (!this._active || this._paused || !this.input.locked) return;
      this.euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
      this.yaw = this.euler.y; this.pitch = this.euler.x;
      this.requestRender?.();
    };
    this.input.controls?.addEventListener('change', this.handlePointerLockLook);
    this.attachAvatar(avatar);
    this.syncCamera();
  }
  get active() { return this._active; }
  get paused() { return this._paused; }
  get position() { return this._position.clone(); }

  attachAvatar(avatar) {
    if (this.avatar?.root?.parent) this.avatar.root.parent.remove(this.avatar.root);
    this.avatar = avatar || null;
    if (avatar?.root && this.scene && !avatar.root.parent) this.scene.add(avatar.root);
    if (avatar?.root) avatar.root.visible = this._active;
    return this;
  }
  enter() {
    if (this._active) { this.resume(); return; }
    this._active = true; this._paused = false; this.jumpY = this.jumpV = 0; this._position.copy(this.config.spawn); this.yaw = this.config.yaw; this.pitch = 0; this.motionSpeed = 0;
    this.input.setEnabled(true); if (this.avatar?.root) this.avatar.root.visible = true;
    this.syncCamera(); this.emit(); this.input.requestLock(); this.requestRender?.();
  }
  exit() {
    if (!this._active) return;
    this.input.clear(); this.input.setEnabled(false); this.input.controls?.unlock?.();
    this._active = false; this._paused = false; this.motionSpeed = 0; if (this.avatar?.root) this.avatar.root.visible = false;
    this.emit(); this.requestRender?.();
  }
  pause() {
    if (!this._active || this._paused) return;
    this._paused = true; this.motionSpeed = 0; this.input.setEnabled(false); this.input.controls?.unlock?.(); this.syncCamera(); this.emit(); this.requestRender?.();
  }
  resume() {
    if (!this._active) return this.enter();
    this._paused = false; this.input.setEnabled(true); this.emit(); this.input.requestLock(); this.requestRender?.();
  }
  jump() {
    if (!this._active || this._paused || this.jumpY || this.jumpV) return;
    this.jumpV = Math.sqrt(2 * GRAVITY * JUMP_HEIGHT); this.requestRender?.();
  }
  look(deltaYaw, deltaPitch) {
    if (!this._active || this._paused) return;
    this.yaw -= deltaYaw; this.pitch = clamp(this.pitch - deltaPitch, -Math.PI * .47, Math.PI * .47);
    this.syncCamera(); this.requestRender?.();
  }
  update(dt) {
    if (!this._active) return false;
    dt = Math.min(Math.max(dt || 0, 0), .1);
    if (this._paused) { this.avatar?.update?.(dt, { position: new Vector3(0, this.jumpY, 0).add(this._position), yaw: this.yaw, moving: false, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }); return false; }
    this.input.update(dt);
    if (this.jumpY || this.jumpV) { this.jumpV -= GRAVITY * dt; this.jumpY = Math.max(0, this.jumpY + this.jumpV * dt); if (!this.jumpY && this.jumpV < 0) this.jumpV = 0; }
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const move = this.input.movement, intended = Math.hypot(move.x, move.z) > .001;
    // Held Shift runs at sprintSpeed without touching the chosen walkSpeed setting.
    const targetSpeed = intended ? (this.input.sprint ? this.config.sprintSpeed : this.config.walkSpeed) : 0;
    this.motionSpeed += (targetSpeed - this.motionSpeed) * Math.min(1, dt * 10);
    let moving = false;
    if (this.motionSpeed > .001 && intended) {
      const forward = new Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      const right = new Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      const delta = forward.multiplyScalar(move.z).addScaledVector(right, move.x).multiplyScalar(this.motionSpeed * dt);
      const previous = this._position.clone();
      const safe = this.navigationWorld?.move?.(this._position, delta);
      if (safe?.isVector3) this._position.copy(safe); else this._position.add(delta);
      moving = this._position.distanceToSquared(previous) > 1e-8;
      // Do not animate a walk cycle into a wall; build speed back up only after
      // navigation permits movement again.
      if (!moving) this.motionSpeed = 0;
    }
    if (moving && !reduceMotion) this.walkPhase += dt * (7 + this.motionSpeed * 2);
    this.syncCamera();
    if (moving && !reduceMotion) this.camera.position.y += Math.sin(this.walkPhase) * .018;
    this.avatar?.update?.(dt, { position: new Vector3(0, this.jumpY, 0).add(this._position), yaw: this.yaw, moving, reducedMotion: reduceMotion });
    if (moving) this.requestRender?.();
    return moving;
  }
  resize(width, height) {
    this.camera.aspect = width / Math.max(1, height); this.camera.updateProjectionMatrix();
  }
  syncCamera() {
    this.camera.position.copy(this._position); this.camera.position.y = this.config.floorHeight + this.config.eyeHeight + this.jumpY;
    this.euler.set(this.pitch, this.yaw, 0, 'YXZ'); this.camera.quaternion.setFromEuler(this.euler);
  }
  reset() { this._position.copy(this.config.spawn); this.jumpY = this.jumpV = 0; this.yaw = this.config.yaw; this.pitch = 0; this.motionSpeed = 0; this.syncCamera(); this.emit(); this.requestRender?.(); }
  emit() { this.onStateChange?.({ active: this._active, paused: this._paused, position: this.position, yaw: this.yaw, camera: this.camera }); }
  dispose() { this.exit(); this.input.controls?.removeEventListener('change', this.handlePointerLockLook); this.input.dispose(); this.navigationWorld?.dispose?.(); this.avatar?.dispose?.(); if (this.avatar?.root?.parent) this.avatar.root.parent.remove(this.avatar.root); }
}

export default FirstPersonController;

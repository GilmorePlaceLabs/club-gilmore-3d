import * as THREE from 'three';

// A deliberately small, camera-facing body.  The origin is at the player's
// feet so the navigation code can move the avatar without knowing its size.
const palette = {
  pants: 0x3f4851,
  pantsLight: 0x505a64,
  shirt: 0x66717a,
  shoe: 0x252b31,
  sole: 0x171b1f,
  skin: 0xb9876d,
  cuff: 0x4c5861,
};

function material(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0 });
}

function segment(parent, a, b, radius, mat, radialSegments = 6) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const delta = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.94, radius, delta.length(), radialSegments),
    mat,
  );
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function box(parent, size, position, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function hand(parent, side, mat) {
  const palm = new THREE.Mesh(new THREE.IcosahedronGeometry(0.095, 1), mat);
  palm.scale.set(0.78, 1.2, 0.7);
  palm.castShadow = true;
  palm.position.set(side * 0.22, -0.51, -0.31);
  parent.add(palm);
  // A small thumb and two tucked finger facets keep the hand legible at a
  // distance without turning it into a detailed character model.
  const thumb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.055, 1), mat);
  thumb.scale.set(0.8, 1.1, 0.8);
  thumb.position.set(side * 0.285, -0.49, -0.285);
  thumb.castShadow = true;
  parent.add(thumb);
  for (const offset of [-0.035, 0.035]) {
    const finger = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 1), mat);
    finger.scale.set(0.7, 1.15, 0.7);
    finger.position.set(side * (0.22 + offset), -0.575, -0.345);
    finger.castShadow = true;
    parent.add(finger);
  }
  return palm;
}

export class FirstPersonAvatar {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'FirstPersonAvatar';
    this._phase = 0;
    this._legs = [];
    this._arms = [];

    const pants = material(palette.pants);
    const pantsLight = material(palette.pantsLight);
    const shirt = material(palette.shirt);
    const shoe = material(palette.shoe);
    const sole = material(palette.sole);
    const skin = material(palette.skin);
    const cuff = material(palette.cuff);

    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      // Keep the pelvis/torso out of the steep look-down frustum; the two
      // trouser legs should be the first body shape the player reads.
      leg.position.set(side * 0.155, 0.88, -0.11);
      leg.userData.baseX = side;
      this.root.add(leg);
      // One gently tapered 10-sided trouser leg avoids the hard hexagonal
      // knee cap that reads as a detached stump in a steep look-down view.
      segment(leg, [0, 0, 0], [0, -0.78, -0.10], 0.115, pantsLight, 10);
      // The leg pivot is at y=.88; these centers put the shoe and its sole
      // exactly on the avatar's y=0 feet plane (even before skinning/swing).
      const shoeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 6), shoe);
      shoeMesh.scale.set(0.90, 0.38, 1.25);
      shoeMesh.position.set(0, -0.8115, -0.38);
      shoeMesh.castShadow = true;
      leg.add(shoeMesh);
      box(leg, [0.205, 0.045, 0.40], [0, -0.8575, -0.38], sole);
      this._legs.push(leg);

      // Arms are intentionally kept in the lower peripheral view, with the
      // palms turned inward as they would be while walking naturally.
      const arm = new THREE.Group();
      arm.position.set(side * 0.32, 0.99, -0.06);
      arm.userData.baseX = side;
      this.root.add(arm);
      segment(arm, [0, 0, 0], [side * 0.20, -0.34, -0.27], 0.065, shirt, 10);
      segment(arm, [side * 0.20, -0.33, -0.27], [side * 0.22, -0.48, -0.31], 0.052, cuff, 8);
      hand(arm, side, skin);
      this._arms.push(arm);
    }
  }

  update(dt = 0, { position, yaw = 0, moving = false, reducedMotion = false } = {}) {
    if (position) {
      if (position.isVector3) this.root.position.copy(position);
      else if (Array.isArray(position)) this.root.position.set(position[0] || 0, position[1] || 0, position[2] || 0);
      else this.root.position.set(position.x || 0, position.y || 0, position.z || 0);
    }
    this.root.rotation.y = Number.isFinite(yaw) ? yaw : 0;

    const active = moving && !reducedMotion;
    if (active) this._phase += Math.max(0, dt) * 8.2;
    const swing = active ? Math.sin(this._phase) * 0.16 : 0;
    this._legs[0].rotation.x = swing;
    this._legs[1].rotation.x = -swing;
    this._arms[0].rotation.x = -swing * 0.72;
    this._arms[1].rotation.x = swing * 0.72;
  }

  dispose() {
    const geometries = new Set();
    const materials = new Set();
    this.root.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) {
        if (Array.isArray(object.material)) object.material.forEach((m) => materials.add(m));
        else materials.add(object.material);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((mat) => mat.dispose());
    this.root.clear();
    this._legs.length = 0;
    this._arms.length = 0;
  }
}

export default FirstPersonAvatar;

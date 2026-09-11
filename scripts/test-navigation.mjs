import * as THREE from 'three';
import { createLevel6Navigation, NavigationWorld } from '../src/firstPerson/NavigationWorld.js';

const trace = (x, z) => new THREE.Vector3((x - 910) * 0.065, 0.08, (z - 670) * 0.065);
const assert = (condition, label) => {
  if (!condition) throw new Error(`Navigation regression: ${label}`);
  console.log(`ok - ${label}`);
};
const box = (root, position, size, { rotation = 0, transparent = false } = {}) => {
  const material = new THREE.MeshBasicMaterial({ transparent, opacity: transparent ? 0.25 : 1 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.copy(position); mesh.rotation.y = rotation; root.add(mesh);
  return mesh;
};

const config = createLevel6Navigation();
assert(config.yaw === Math.PI / 2, 'north bridge yaw faces west');
assert(config.walkablePolygons.length > 0 && config.blockedPolygons.length > 0, 'polygon metadata is exposed');

const empty = new NavigationWorld(null, config);
assert(empty.isSafe(config.spawn), 'north bridge spawn is safe');
assert(empty.isSafe(trace(1080, 250)), 'actual bridge slab is safe');
const joinStart = trace(680, 260);
const joinEnd = empty.move(joinStart, new THREE.Vector3(0, 0, 30 * .065));
assert(joinEnd.distanceTo(trace(680, 290)) < .001, 'north and main deck slabs remain connected');
assert(!empty.isSafe(trace(1197, 224)), 'exposed bridge edge is radius inset');
assert(!empty.isSafe(trace(400, 760)), 'pool water is unsafe');

const root = new THREE.Group();
box(root, trace(1180, 250).setY(.5), [.45, 1, .45]);
box(root, trace(1145, 250).setY(.5), [2.5, 1, .08], { rotation: .72 });
box(root, trace(1165, 250).setY(.5), [1.1, 1, .06], { transparent: true });
box(root, trace(1205, 250).setY(.14), [1, .12, .12]);
const nav = new NavigationWorld({ root }, config);
assert(!nav.isSafe(trace(1180, 250)), 'axis-aligned furniture collision');
assert(!nav.isSafe(trace(1145, 250)), 'rotated wall collision');
assert(!nav.isSafe(trace(1165, 250)), 'transparent glass railing collision');
assert(nav.isSafe(trace(1205, 250)), 'shallow curb is a walkable threshold');

const before = trace(1212, 250);
const after = nav.move(before, new THREE.Vector3(-5, 0, 0));
assert(after.x > trace(1165, 250).x, 'large movement cannot tunnel through an intervening wall');

console.log('Navigation regression suite passed.');

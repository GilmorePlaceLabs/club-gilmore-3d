import * as THREE from 'three';

// These are deliberately authored from the Level 6 slab outlines, rather than
// inferred from the room hit areas.  Coordinates below are trace coordinates.
// Must match U in level6.js (2026-09-12 measured deck scale).
const SCALE = 0.06;
const traceToWorld = ([x, z]) => new THREE.Vector2((x - 910) * SCALE, (z - 670) * SCALE);
const polygon = points => points.map(traceToWorld);
const rectangle = (x, z, width, depth) => polygon([[x, z], [x + width, z], [x + width, z + depth], [x, z + depth]]);

const WALKABLE = [
  polygon([[590,55],[858,30],[930,103],[936,227],[1080,227],[1080,222],[1221,222],[1221,274],[933,274],[933,275],[660,275],[660,110],[590,94]]),
  rectangle(40,596,620,305),
  polygon([[660,275],[932,275],[932,1128],[691,1312],[636,1265],[636,901],[660,901]]),
  polygon([[1037,259],[1193,259],[1193,471],[1352,471],[1352,488],[1539,488],[1539,470],[1619,470],[1648,444],[1706,444],[1728,425],[1728,371],[1795,439],[1779,460],[1156,1028],[1037,867]]),
  // South bridge. Starts at x=932, not the slab's 933, to close the same
  // one-unit seam as the north connector below; without it the join was
  // impassable from both sides (IMG_4055, September 10, 2026).
  rectangle(932,638,105,35),
  polygon([[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]]),
  // The bridge lands on the main slab at trace x=933 while that slab ends at
  // x=932.  This one-trace-unit (0.06m) connector closes only that authored
  // drafting seam; it does not span either light well.
  polygon([[932,274],[933,274],[933,276],[932,276]]),
];

// Water is not represented by a solid mesh, so it must be explicitly unsafe.
// The planted beds used to be copied in here as well and went stale whenever one
// moved (2026-09-12: a bed shifted off the timber walk kept blocking it). The
// model now registers every bed it builds through navigation.blockedPolygons,
// and the remaining planters and all furniture come from scene geometry below.
const BLOCKED = [
  rectangle(237,719,322,100), rectangle(132,719,79,100), rectangle(156,713.5,31,6), // hot tub's north bay
];

const pointInPolygon = (point, points) => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
};

const distanceToSegmentSquared = (point, a, b) => {
  const dx = b.x - a.x, dz = b.y - a.y;
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared === 0) return point.distanceToSquared(a);
  const t = THREE.MathUtils.clamp(((point.x - a.x) * dx + (point.y - a.y) * dz) / lengthSquared, 0, 1);
  const x = a.x + dx * t, z = a.y + dz * t;
  return (point.x - x) ** 2 + (point.y - z) ** 2;
};

const pointInTriangle = (point, a, b, c) => {
  const cross = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  if (Math.abs(cross(a, b, c)) < 1e-8) return false;
  const ab = cross(a, b, point), bc = cross(b, c, point), ca = cross(c, a, point);
  return (ab >= 0 && bc >= 0 && ca >= 0) || (ab <= 0 && bc <= 0 && ca <= 0);
};

// Scene triangles are indexed by their 2-D bounds, then tested precisely here.
// Vertical box faces project to line segments, while rotated faces retain their
// triangular footprint, so neither is inflated into a long axis-aligned wall.
const circleHitsTriangle = (point, radius, triangle) => pointInTriangle(point, triangle.a, triangle.b, triangle.c)
  || distanceToSegmentSquared(point, triangle.a, triangle.b) < radius * radius
  || distanceToSegmentSquared(point, triangle.b, triangle.c) < radius * radius
  || distanceToSegmentSquared(point, triangle.c, triangle.a) < radius * radius;

/** Level-6 metadata consumed by FirstPersonController. */
export function createLevel6Navigation(model) { // model is accepted for the shared level capability interface.
  // [1197, 250] is the approximate north-bridge spawn.  In Three's conventional
  // camera yaw +PI/2 rotates Three's default -z view toward west (-x).
  const spawn = traceToWorld([1197, 250]);
  return {
    spawn: new THREE.Vector3(spawn.x, 0.08, spawn.y),
    yaw: Math.PI / 2,
    floorHeight: 0.08,
    // 5 ft 10 in (1.778 m) tall; the eyes sit ~.11 m below the crown.
    eyeHeight: 1.664,
    radius: 0.30,
    walkSpeed: 2.2,
    walkablePolygons: WALKABLE.map(poly => poly.map(point => point.clone())),
    blockedPolygons: BLOCKED.map(poly => poly.map(point => point.clone())),
  };
}

export class NavigationWorld {
  constructor(model, config = createLevel6Navigation()) {
    this.config = config;
    this.radius = config.radius;
    this.walkable = config.walkablePolygons || WALKABLE;
    this.blocked = config.blockedPolygons || BLOCKED;
    this.cellSize = 1.25;
    this.cells = new Map();
    this.lastSafe = config.spawn.clone();
    this._buildStaticCollision(model?.root);
  }

  _key(x, z) { return `${x},${z}`; }

  _addTriangle(triangle) {
    const startX = Math.floor(triangle.minX / this.cellSize), endX = Math.floor(triangle.maxX / this.cellSize);
    const startZ = Math.floor(triangle.minZ / this.cellSize), endZ = Math.floor(triangle.maxZ / this.cellSize);
    for (let x = startX; x <= endX; x++) for (let z = startZ; z <= endZ; z++) {
      const key = this._key(x, z);
      const list = this.cells.get(key) || [];
      list.push(triangle); this.cells.set(key, list);
    }
  }

  _buildStaticCollision(root) {
    if (!root) return;
    root.updateMatrixWorld(true);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    root.traverse(object => {
      // Merging drops mesh userData, so non-solid materials (foliage) carry the flag too.
      if (!object.isMesh || object.userData.collision === false || object.material?.userData?.collision === false || !object.geometry?.attributes?.position) return;
      const position = object.geometry.attributes.position;
      const index = object.geometry.index;
      const triangleCount = index ? index.count / 3 : position.count / 3;
      const vertex = (target, n) => target.fromBufferAttribute(position, index ? index.getX(n) : n).applyMatrix4(object.matrixWorld);
      for (let t = 0; t < triangleCount; t++) {
        vertex(a, t * 3); vertex(b, t * 3 + 1); vertex(c, t * 3 + 2);
        const minY = Math.min(a.y, b.y, c.y), maxY = Math.max(a.y, b.y, c.y);
        // Ignore deck undersides/floors and high-only geometry.  This retains
        // railings, planters, walls, furniture, play equipment and tree trunks.
        if (maxY <= this.config.floorHeight + 0.20 || minY > configTop(this.config) || maxY - minY < 0.20) continue;
        const triangle = {
          a: new THREE.Vector2(a.x, a.z), b: new THREE.Vector2(b.x, b.z), c: new THREE.Vector2(c.x, c.z),
          minX: Math.min(a.x, b.x, c.x), maxX: Math.max(a.x, b.x, c.x),
          minZ: Math.min(a.z, b.z, c.z), maxZ: Math.max(a.z, b.z, c.z),
        };
        this._addTriangle(triangle);
      }
    });
  }

  _nearby(position) {
    const out = [], seen = new Set(), r = this.radius + this.cellSize;
    const minX = Math.floor((position.x - r) / this.cellSize), maxX = Math.floor((position.x + r) / this.cellSize);
    const minZ = Math.floor((position.z - r) / this.cellSize), maxZ = Math.floor((position.z + r) / this.cellSize);
    for (let x = minX; x <= maxX; x++) for (let z = minZ; z <= maxZ; z++) for (const box of this.cells.get(this._key(x, z)) || []) {
      if (!seen.has(box)) { seen.add(box); out.push(box); }
    }
    return out;
  }

  _onWalkable(point) { return this.walkable.some(poly => pointInPolygon(point, poly)); }

  isSafe(position) {
    const p = new THREE.Vector2(position.x, position.z);
    if (this.blocked.some(poly => pointInPolygon(p, poly))) return false;
    // Test the circumference against the UNION, not each polygon independently.
    // Therefore a player can cross a shared slab edge while exposed edges are
    // inset by the configured player radius.
    if (!this._onWalkable(p)) return false;
    for (let i = 0; i < 16; i++) {
      const angle = i * Math.PI * 2 / 16;
      const edge = new THREE.Vector2(p.x + Math.cos(angle) * this.radius, p.y + Math.sin(angle) * this.radius);
      if (!this._onWalkable(edge) || this.blocked.some(poly => pointInPolygon(edge, poly))) return false;
    }
    return !this._nearby(position).some(triangle => circleHitsTriangle(p, this.radius, triangle));
  }

  move(position, delta) {
    // A short swept solve avoids tunnelling through furniture at normal speed.
    const distance = Math.hypot(delta.x, delta.z);
    const steps = Math.max(1, Math.ceil(distance / (this.radius * 0.5)));
    let current = position.clone(); current.y = this.config.floorHeight;
    const stepDelta = new THREE.Vector3(delta.x / steps, 0, delta.z / steps);
    for (let step = 0; step < steps; step++) {
      // Advance from the resolved point.  Reconstructing from the original
      // position after a slide can skip an intervening obstacle on a long move.
      const next = current.clone().add(stepDelta); next.y = this.config.floorHeight;
      if (this.isSafe(next)) { current.copy(next); continue; }
      // Attempt axis-separated movement for natural wall/furniture sliding.
      const xSlide = new THREE.Vector3(next.x, this.config.floorHeight, current.z);
      const zSlide = new THREE.Vector3(current.x, this.config.floorHeight, next.z);
      if (this.isSafe(xSlide)) current.copy(xSlide);
      else if (this.isSafe(zSlide)) current.copy(zSlide);
    }
    if (this.isSafe(current)) this.lastSafe.copy(current);
    return this.lastSafe.clone();
  }

  dispose() { this.cells.clear(); this.walkable = []; this.blocked = []; }
}

const configTop = config => config.floorHeight + config.eyeHeight;

import * as T from 'three';
import {box,cyl,rod,mesh,makeGroup,canvasTexture} from './model.js';

// The positions below are proportional readings of the supplied overhead crop.
// They intentionally stay in the Level 6 trace coordinate system so the fit-out
// can be compared directly with the 1855 x 1344 reference render.
const rect=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d]];

export function buildChangeRoom({parent,walls,B,surface,world,mats,M,fenceGlass,gates=[],tall=new T.Group()}){
 const stoneMap=canvasTexture((c,n)=>{
  c.fillStyle='#55595b';c.fillRect(0,0,n,n);
  for(let y=0;y<n;y+=64)for(let x=0;x<n;x+=128){
   const offset=(y/64%2)*64;
   c.fillStyle=((x+y)/64)%3?'#5b5f61':'#505456';
   c.fillRect((x+offset)%n+2,y+2,124,60);
  }
  let seed=29;
  for(let i=0;i<4200;i++){
   seed=(seed*1664525+1013904223)>>>0;const x=seed%n;
   seed=(seed*1664525+1013904223)>>>0;const y=seed%n;
   c.fillStyle=i%2?'rgba(255,255,255,.035)':'rgba(0,0,0,.04)';c.fillRect(x,y,1,1);
  }
 });
 stoneMap.repeat.set(3,2);
 const facade=new T.MeshStandardMaterial({color:'#ffffff',map:stoneMap,roughness:.82});
 const partition=M('#d9dcda',.48),partitionTop=M('#f1f1ec',.38);
 const timber=M('#8d6846',.7),timberDark=M('#68482f',.74);
 const fixture=M('#f3f2eb',.3),steel=M('#aeb8ba',.24),dark=M('#252b2e',.48);
 const mirror=M('#b7d4d6',.15),orange=M('#ee6731',.55);
 const wetFloor=mats.tilefloor.clone();wetFloor.color.set('#c8d4d2');
 const steamFloor=mats.tilefloor.clone();steamFloor.color.set('#b8c2c0');
 const grout=M('#3d4244',.85),red=M('#c74438',.62),sign=M('#dedbd0',.75);

 walls.name='Full-height change-room shell and pool facade';
 const interior=new T.Group();interior.name='Change-room interior fit-out';parent.add(interior);

 // Small fixture builders use metres after translating their trace anchor.
 const toilet=(p,x,z,rotation=0)=>{
  const [wx,wz]=world([x,z]),g=makeGroup(p,wx,wz,rotation);g.name='Toilet';
  box(g,0,.47,-.22,.44,.56,.18,fixture);
  const bowl=mesh(g,new T.CylinderGeometry(.22,.18,.3,18),fixture,0,.28,.08);
  bowl.scale.z=1.35;
  box(g,0,.43,.08,.38,.06,.47,fixture);
 };
 const floorDrain=(p,x,z)=>{
  const [wx,wz]=world([x,z]);cyl(p,wx,.095,wz,.095,.018,steel);
 };
 const showerHead=(p,x,z,face='south')=>{
  const [wx,wz]=world([x,z]),dz=face==='south'?.27:-.27;
  rod(p,[wx,1.64,wz],[wx,1.85,wz],.025,steel);
  rod(p,[wx,1.85,wz],[wx,1.85,wz+dz],.025,steel);
  const head=mesh(p,new T.CylinderGeometry(.105,.105,.025,18),steel,wx,1.83,wz+dz);
  head.rotation.x=Math.PI/2;
  box(p,wx,1.06,wz+.012,.12,.18,.05,dark);
 };
 const basin=(p,x,z)=>{
  const [wx,wz]=world([x,z]);
  const rim=mesh(p,new T.TorusGeometry(.19,.035,8,18),steel,wx,.92,wz);
  rim.rotation.x=Math.PI/2;
  cyl(p,wx,.89,wz,.15,.035,fixture);
  rod(p,[wx,.94,wz-.13],[wx,.94,wz-.28],.025,steel);
 };
 // `tall` holds each partition's extension to the 3 m shell height. It is only
 // shown in first person, so the orbit cutaway stays low but the walker cannot
 // see over the walls.
 const partitionWall=(x,z,w,d,h=1.55)=>{
  B(x,z,w,d,h,partition,0,interior);B(x,z,w+.5,d+.5,.035,partitionTop,h,interior);
  B(x,z,w,d,3-h,partition,h,tall);
 };
 // Door leaves get the same first-person extension to 3 m.
 const leaf=(x,z,w,d,h,mat,r=0)=>{B(x,z,w,d,h,mat,0,interior).rotation.y=r;B(x,z,w,d,3-h,mat,h,tall).rotation.y=r;};

 // Pale tiled floors identify the wet zones without covering the common route.
 surface(rect(284,428,60,35),wetFloor,.072,0,interior);
 surface(rect(344,429,83,34),mats.tilefloor,.073,0,interior);
 surface(rect(335,485,95,30),wetFloor,.074,0,interior);
 surface(rect(341,522,21,30),wetFloor,.075,0,interior);
 surface(rect(363,526,66,26),mats.tilefloor,.074,0,interior);
 surface(rect(396,553,43,48),steamFloor,.075,0,interior);

 // Full roofless perimeter follows the stepped trace. The south side is split
 // around the recessed pool-entry court and the separate storage door.
 for(const [x,z,w,d] of [
  [275,456,16,3],[283,441.5,3,29],[356,427,146,3],[429,439.5,3,25],
  [445,452,32,3],[463,531.5,4,159],[267,533.5,3,155],
  [311,610,88,3],[422.5,610,31,3],[462,610,6,3]
 ])B(x,z,w,d,3,facade,0,walls);

 // Northwest accessible shower and washroom. A wide south opening preserves
 // the turning circle visible in the render; shower, fold seat and WC remain
 // distinct objects rather than symbolic blocks.
 partitionWall(344,445.5,2,35);
 partitionWall(330,463,28,2);
 B(297,442,14,4,.42,timber,.3,interior);
 floorDrain(interior,302,454);showerHead(interior,299,429,'south');
 toilet(interior,334,439,Math.PI);
 B(338,457,8,5,.76,fixture,0,interior);
 for(const [x,z,w,d] of [[291,436,15,1],[288,442,1,16],[327,447,12,1]])B(x,z,w,d,.05,steel,1.05,interior);

 // Five north bathroom cubicles, matching the annotated row and the visible
 // angled doors. Each stall gets a recognisable toilet and a low privacy panel.
 const northXs=[344,360.6,377.2,393.8,410.4,427];
 partitionWall(385.5,463,83,2);
 for(const x of northXs)partitionWall(x,446,2,34);
 for(let i=0;i<5;i++){
  const cx=(northXs[i]+northXs[i+1])/2;
  toilet(interior,cx,437,0);
  const door=B(cx+4.8,461,10.5,1.4,1.38,partition,0,interior);door.rotation.y=-.48;
 }

 // Six timber change cubicles open toward the central aisle on the west wall.
 // Their benches and coat hooks make the use clear in both plan and 3D views.
 const changeZ=[459,473.5,488,502.5,517,531.5,546];
 for(const z of changeZ)partitionWall(290.5,z,45,1.7,1.4);
 for(let i=0;i<6;i++){
  const cz=(changeZ[i]+changeZ[i+1])/2;
  B(278.5,cz,18,5,.42,timber,.12,interior);
  B(275,cz-4.8,1.2,1.2,.09,steel,1.2,interior);
  B(275,cz,1.2,1.2,.09,steel,1.2,interior);
 }

 // Four individual shower rooms span the middle. The rain head and drain sit at
 // the closed north end; the timber dry bench sits by the door at the south.
 const showerXs=[335,358.75,382.5,406.25,430];
 partitionWall(382.5,485,95,2);
 partitionWall(382.5,515,95,2);
 for(const x of showerXs)partitionWall(x,500,2,30);
 for(let i=0;i<4;i++){
  const cx=(showerXs[i]+showerXs[i+1])/2;
  B(cx,508,16,5,.4,timber,.12,interior);
  showerHead(interior,cx,486,'south');floorDrain(interior,cx,490);
  B(cx+6.6,513,10,1.2,1.28,fenceGlass,0,interior).rotation.y=-.5;
 }

 // The annotation points specifically to this separate two-head standing-shower
 // bay below and left of the enclosed showers.
 partitionWall(341,537,2,30);partitionWall(362,537,2,30);partitionWall(351.5,552,21,2);
 showerHead(interior,360.5,528,'south');showerHead(interior,360.5,543,'south');
 floorDrain(interior,351,528);floorDrain(interior,351,543);

 // Five lower-right toilet cubicles: tanks sit against the south back wall,
 // bowls face north and the access doors are on the north edge.
 const lowerXs=[363,376.2,389.4,402.6,415.8,429];
 partitionWall(396,552,66,2);
 for(const x of lowerXs)partitionWall(x,539,2,26,1.4);
 for(let i=0;i<5;i++){
  const cx=(lowerXs[i]+lowerXs[i+1])/2;
  toilet(interior,cx,546,Math.PI);
  const door=B(cx+3.8,528,6.8,1.2,1.22,partition,0,interior);door.rotation.y=.52;
 }

 // Three-basin vanity along the east wall, with one continuous counter and
 // individual mirrors and taps.
 B(455.5,513.5,11,39,.86,dark,.05,interior);
 for(const z of [500,513.5,527]){
  basin(interior,456,z);
  B(462, z,1,11,.72,mirror,1.03,interior);
 }

 // Southeast steam room. Its glass door and L-shaped tiled benches distinguish
 // it from the neighbouring secondary cubicles.
 partitionWall(417.5,553,43,2,1.75);
 partitionWall(396,570.5,2,35,1.75);
 // The south wall stops short of the new east entry so the glazed side door
 // opens directly into a clear steam-room approach.
 partitionWall(429.5,601,19,2,1.75);
 B(439,577,3,48,1.75,partition,0,interior);
 B(432,577,11,40,.48,fixture,.08,interior);

 // A short service-alcove wall follows the visible lower-left jog while leaving
 // the central route from the recessed pool entrance open.
 partitionWall(315,564,2,36,1.35);
 partitionWall(334,582,38,2,1.35);
 B(329,576,24,6,.42,timberDark,.1,interior);

 // Pool-facing elevation: the central entrance court is recessed about 3.7 metres
 // into the building. Its three entries are in the side walls; the
 // front mouth stays open for circulation rather than becoming a front double
 // door.  The former glazed rear door is removed so it cannot read as that
 // incorrect front-door condition.
 const entranceGlass=M('#98b9c0',.16);entranceGlass.name='Recessed entry door glass';entranceGlass.transparent=true;entranceGlass.opacity=.48;entranceGlass.depthWrite=false;
 const sideGlassDoor=(x,z,name,material=entranceGlass)=>{
  // Closed and flush in the orbit view. User request, September 10, 2026: they
  // swing open for the walk. The frame stays in the merged walls; only the leaf
  // and handle hang from a hinge at the north jamb, opposite the handle, and
  // turn 90 degrees west: left doors into rooms, steam door into the court
  // so its leaf cannot trap the user against the steam-room south partition.
  const [wx,wz]=world([x,z]),f=makeGroup(walls,wx,wz),west=x<381;
  // Dark jamb, head and sill frame a full-height glazed leaf.  The outer frame
  // overlaps its masonry opening by a few centimetres as a normal stop frame.
  for(const dz of [-.45,.45])box(f,0,1.16,dz,.082,2.34,.052,dark);
  box(f,0,2.3,0,.082,.06,.95,dark);box(f,0,.03,0,.082,.06,.95,dark);
  const g=makeGroup(walls,wx,wz-.44);
  g.name=name;
  box(g,0,1.16,.44,.052,2.28,.88,material);
  rod(g,[west?-.055:.055,.72,.66],[west?-.055:.055,1.32,.66],.022,steel);
  g.userData.openYaw=-Math.PI/2;gates.push(g);
  return g;
 };
 // The side walls run from the new rear wall to the existing facade, with a
 // side opening near the mouth on each side.  A short south return preserves
 // the crisp outer facade edge around each hinge.
 // Deeper court: near left = storage, far left = changing facilities, right
 // = steam room. Build actual openings, not door meshes over solid walls.
 // Join the court's rear wall to the wet-block back wall (z=552) rather
 // than leaving an unusable strip between the two wall runs.
 const entryRear=553;
 const entryWall=(x,openings)=>{
  let edge=entryRear;
  for(const center of openings){
   const start=center-6.75,end=center+6.75;
   B(x,(edge+start)/2,3,start-edge,3,facade,0,walls);
   B(x,center,3,13.5,.66,facade,2.34,walls);
   edge=end;
  }
  B(x,(edge+611)/2,3,611-edge,3,facade,0,walls);
 };
 entryWall(356,[573,600]);entryWall(406,[573]);
 B(381,entryRear,50,3,3,facade,0,walls);
 sideGlassDoor(356,573,'Main change-room entry glass door');
 sideGlassDoor(356,600,'Interior southwest storage door',timberDark);
 sideGlassDoor(406,573,'East recessed-entry glass door');
 surface(rect(356,entryRear,51,611-entryRear),mats.tilefloor,.082,0,interior);

 // Three stainless outdoor shower panels west of the entry, each with a rain
 // head, controls and a hanging hand-shower line.
 for(const x of [292,315,338]){
  B(x,612.5,4.2,1.2,1.72,steel,.48,walls);
  const [wx,wz]=world([x,613.3]);
  rod(walls,[wx,1.96,wz],[wx,2.23,wz],.028,steel);
  rod(walls,[wx,2.23,wz],[wx,2.23,wz+.28],.028,steel);
  const rain=mesh(walls,new T.CylinderGeometry(.115,.115,.026,18),steel,wx,2.2,wz+.28);rain.rotation.x=Math.PI/2;
  box(walls,wx,1.45,wz+.04,.17,.19,.08,dark);
  rod(walls,[wx+.11,1.31,wz+.07],[wx+.18,.75,wz+.09],.018,steel);
  mesh(walls,new T.TorusGeometry(.18,.014,6,18,Math.PI),steel,wx+.03,.76,wz+.08);
 }

 // Life ring and safety placard between the showers and entry.
 const [ringX,ringZ]=world([350,613.4]);
 const ring=mesh(walls,new T.TorusGeometry(.25,.072,10,24),orange,ringX,1.33,ringZ);ring.name='Pool life ring';
 for(const angle of [0,Math.PI/2]){
  const strap=box(walls,ringX+Math.cos(angle)*.18,1.33+Math.sin(angle)*.18,ringZ+.015,.08,.12,.04,fixture,angle);
  strap.rotation.z=angle;
 }
 B(350,612.7,9,1,.05,dark,1.72,walls);

 // Dual-height stainless fountains and bottle filler to the right of the entry.
 for(const [x,y] of [[417,.72],[427,1.0]]){
  B(x,612.8,8,2,.48,steel,y-.3,walls);
  B(x,614.1,9,5,.09,steel,y+.19,walls);
  const [wx,wz]=world([x,614]);cyl(walls,wx,y+.27,wz,.16,.035,fixture);
  rod(walls,[wx+.05,y+.28,wz],[wx+.05,y+.38,wz],.02,steel);
 }
 B(427,612.7,10,1.8,.55,steel,1.35,walls);
 B(427,613.9,5,3,.08,dark,1.52,walls);

 // Frosted storage door, louvre and two-piece glass canopy at the east end.
 B(449,611,20,2.2,2.5,dark,0,walls);
 B(449,612.3,16,1.2,2.1,M('#93a9a8',.24),.08,walls);
 B(449,613.1,10,1,.12,sign,1.14,walls);
 B(449,611.8,19,1.6,.48,dark,2.48,walls);
 for(let y=2.53;y<=2.88;y+=.09)B(449,613,16,1,.045,steel,y,walls);
 B(449,616,23,8,.07,fenceGlass,2.83,walls);
 for(const x of [440,458]){
  const [wx,wz]=world([x,612]);rod(walls,[wx,2.45,wz],[wx,2.83,wz+.45],.035,dark);
 }

 // Tile joints, sconces and the small posted safety signs visible in both
 // exterior photographs. These are deliberately geometric rather than text.
 for(const x of [274,296,318,340,420,438,460])B(x,612,0.5,1,2.78,grout,.08,walls);
 for(const y of [.96,1.9,2.82])B(309,612.2,84,1,.025,grout,y,walls);
 for(const y of [.96,1.9,2.82])B(423,612.2,30,1,.025,grout,y,walls);
 for(const x of [282,412,436])B(x,613.1,3.2,1.8,.26,dark,1.66,walls);
 // The centre sconce and plaque now mount on the solid rear wall of the
 // deeper court rather than floating in its open pool-facing mouth.
 B(365,entryRear+1.7,3.2,.4,.26,dark,1.66,walls);
 for(const [x,z,y,w,h,mat] of [[302,613,2.5,22,.4,dark],[330,613,2.45,14,.55,dark],[389,entryRear+1.7,1.78,5,.38,sign],[409,613,2.0,9,.8,sign],[419,613,1.72,8,.42,red],[433,613,2.18,3,.32,red]])
  B(x,z,w,1,h,mat,y-h/2,walls);

 return interior;
}

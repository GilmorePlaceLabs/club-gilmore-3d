import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rooms, cores, slabOutline, METRES_PER_TRACE_UNIT as U, WALL_HEIGHT, POOL_LENGTH } from './rooms.js';

export const toWorld = ([x,z]) => [(x-900)*U,(z-1030)*U];
const boxGeo = new T.BoxGeometry(1,1,1);
const cylGeo = new T.CylinderGeometry(1,1,1,12);
const sphereGeo = new T.IcosahedronGeometry(1,1);
const mats = {};
const mat = (name,color,roughness=.7,metalness=0) => mats[name] = new T.MeshStandardMaterial({color,roughness,metalness});
mat('stone','#dfded4'); mat('wall','#e8e6dc'); mat('walltop','#f6f3e8');
mat('oak','#a17b53'); mat('oaklight','#c6a77b'); mat('walnut','#624b36');
mat('ivory','#e8e1d2'); mat('linen','#c2b9a4'); mat('blue','#526e7c'); mat('rust','#a96f4e');
mat('black','#282e33'); mat('rubber','#424b51'); mat('metal','#aab2b4',.3,.65);
mat('brass','#b69a56',.34,.45); mat('white','#f0efdf'); mat('green','#477c5b');
mat('leaf','#64834b'); mat('leaflight','#879b63'); mat('trunk','#76624b'); mat('clay','#ba9580');
mat('felt','#567d5a'); mat('water','#5fbbc6',.23,.18); mat('pooltile','#c7dedb',.42);
mat('red','#bc6550'); mat('yellow','#dbc77c'); mat('darkwood','#645341');
mat('glass','#a6cad0',.2,.05); mats.glass.transparent=true; mats.glass.opacity=.28; mats.glass.depthWrite=false;

function canvasTexture(draw,size=512) {
 const canvas=document.createElement('canvas'); canvas.width=canvas.height=size;
 draw(canvas.getContext('2d'),size);
 const tex=new T.CanvasTexture(canvas); tex.colorSpace=T.SRGBColorSpace;
 tex.wrapS=tex.wrapT=T.RepeatWrapping; tex.anisotropy=8; return tex;
}
function rng(seed=841) {return () => {seed=(seed*1664525+1013904223)>>>0; return seed/4294967296;};}
const random=rng();
const oakTexture=canvasTexture((c,s)=>{
 c.fillStyle='#c3aa85';c.fillRect(0,0,s,s);
 for(let row=0;row<16;row++) for(let col=-1;col<4;col++) {
  const x=col*170+(row%2)*85,y=row*32;
  c.fillStyle=`hsl(34,${22+random()*10}%,${61+random()*12}%)`;c.fillRect(x+1,y+1,168,30);
  for(let i=0;i<6;i++){c.strokeStyle=`rgba(80,52,24,${.025+random()*.035})`;c.beginPath();c.moveTo(x+2,y+3+i*4);c.lineTo(x+167,y+3+i*4+random()*2);c.stroke();}
 }
});
const tileTexture=canvasTexture((c,s)=>{
 c.fillStyle='#d9d9d1';c.fillRect(0,0,s,s);
 for(let y=0;y<s;y+=128)for(let x=0;x<s;x+=128){const v=207+random()*15;c.fillStyle=`rgb(${v},${v+1},${v-2})`;c.fillRect(x+1,y+1,126,126);}
});
const gymTexture=canvasTexture((c,s)=>{
 c.fillStyle='#60666a';c.fillRect(0,0,s,s);
 for(let y=0;y<s;y+=128)for(let x=0;x<s;x+=128){const v=119+random()*12;c.fillStyle=`rgb(${v},${v+3},${v+4})`;c.fillRect(x+2,y+2,124,124);}
 for(let i=0;i<7000;i++){c.fillStyle=random()>.5?'#92999b':'#646b70';c.fillRect(random()*s,random()*s,1,1);}
});
const turfTexture=canvasTexture((c,s)=>{
 c.fillStyle='#667d43';c.fillRect(0,0,s,s);
 for(let i=0;i<30000;i++){c.fillStyle=`rgba(${60+random()*55},${85+random()*60},${25+random()*35},.45)`;c.fillRect(random()*s,random()*s,1,2);}
});
mats.woodfloor=new T.MeshStandardMaterial({map:oakTexture,roughness:.76});
mats.tilefloor=new T.MeshStandardMaterial({map:tileTexture,roughness:.82});
mats.circulation=new T.MeshStandardMaterial({map:tileTexture,color:'#b6c2c5',roughness:.85});
mats.gymfloor=new T.MeshStandardMaterial({map:gymTexture,roughness:.9});
mats.turf=new T.MeshStandardMaterial({map:turfTexture,roughness:1});

function mesh(parent,geo,material,x,y,z,sx=1,sy=1,sz=1,rotation=0) {
 const m=new T.Mesh(geo,typeof material==='string'?mats[material]:material);
 m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.y=rotation;
 m.castShadow=material!=='glass';m.receiveShadow=true;parent.add(m);return m;
}
const box=(p,x,y,z,w,h,d,m='ivory',r=0)=>mesh(p,boxGeo,m,x,y,z,w,h,d,r);
const cyl=(p,x,y,z,r,h,m='metal')=>mesh(p,cylGeo,m,x,y,z,r,h,r);
function rod(p,a,b,r=.025,m='metal') {
 const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);
 const o=mesh(p,cylGeo,m,...av.clone().add(bv).multiplyScalar(.5).toArray(),r,delta.length(),r);
 o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;
}
function makeGroup(parent,x=0,z=0,rot=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rot;parent.add(g);return g;}
function shapeGeometry(points,depth=0) {
 const s=new T.Shape(); points.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
 const geo=depth?new T.ExtrudeGeometry(s,{depth,bevelEnabled:false}):new T.ShapeGeometry(s);
 geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position,uv=geo.attributes.uv;
 for(let i=0;i<pos.count;i++) uv.setXY(i,pos.getX(i)/3,pos.getZ(i)/3);
 return geo;
}
function inside(x,z,p) {let yes=false;for(let i=0,j=p.length-1;i<p.length;j=i++) {
 const [a,b]=p[i],[c,d]=p[j];if(((b>z)!==(d>z))&&(x<(c-a)*(z-b)/(d-b)+a))yes=!yes;
}return yes;}
function sofa(p,x,z,rot=0,color='ivory',size=2.25) {
 const g=makeGroup(p,x,z,rot);box(g,0,.22,0,size,.2,.91,'walnut');
 box(g,0,.62,-.36,size,.65,.19,color);box(g,-size/2+.1,.48,0,.2,.43,.86,color);box(g,size/2-.1,.48,0,.2,.43,.86,color);
 for(let i=0;i<3;i++){box(g,(i-1)*(size-.4)/3,.43,.04,(size-.46)/3,.24,.6,color);box(g,(i-1)*(size-.4)/3,.68,-.21,(size-.46)/3,.4,.13,color);}
 for(const a of [-1,1]) for(const b of [-1,1])box(g,a*(size/2-.2),.12,b*.3,.06,.18,.06,'black');
}
function chair(p,x,z,rot=0,color='linen') {
 const g=makeGroup(p,x,z,rot);box(g,0,.45,0,.48,.12,.5,color);box(g,0,.73,-.22,.48,.53,.09,color);
 for(const a of [-1,1])for(const b of [-1,1])rod(g,[a*.17,.02,b*.17],[a*.19,.42,b*.18],.023,'darkwood');
}
function table(p,x,z,rot=0,length=2.2,width=.95,seats=6) {
 const g=makeGroup(p,x,z,rot);box(g,0,.78,0,length,.09,width,'ivory');
 for(const a of [-1,1])box(g,a*(length/2-.28),.39,0,.14,.72,width*.6,'darkwood');
 const side=Math.floor(seats/2);for(let i=0;i<side;i++){const xx=(i-(side-1)/2)*(length/(side+.3));chair(g,xx,-width/2-.38,0);chair(g,xx,width/2+.38,Math.PI);}
}
function coffee(p,x,z){cyl(p,x,.38,z,.47,.06,'ivory');cyl(p,x,.19,z,.14,.34,'brass');}
function plant(p,x,z,rotation=0,large=false){cyl(p,x,.25,z,large?.36:.22,.5,'clay');rod(p,[x,.4,z],[x,large?1.9:1.25,z],.045,'trunk');
 for(let i=0;i<7;i++){const a=i*2.4;mesh(p,sphereGeo,i%2?'leaf':'leaflight',x+Math.cos(a)*.27,(large?1.3:.8)+(i%3)*.17,z+Math.sin(a)*.27,large?.43:.28,.23,large?.42:.28);}}
function tree(p,x,z,rotation=0,scale=1){cyl(p,x,.85*scale,z,.1*scale,1.7*scale,'trunk');for(let i=0;i<5;i++){const a=i*2.4;mesh(p,sphereGeo,i%2?'leaf':'leaflight',x+Math.cos(a)*.48*scale,(1.8+(i%2)*.35)*scale,z+Math.sin(a)*.48*scale,.75*scale,.75*scale,.7*scale);}}
function television(p,x,z,r=0){const g=makeGroup(p,x,z,r);box(g,0,.37,0,2.1,.65,.42,'walnut');box(g,0,1.21,-.13,1.9,1.05,.085,'black');box(g,0,1.22,-.079,1.77,.92,.006,'blue');}
function billiards(p,x,z,rot=0){const g=makeGroup(p,x,z,rot);box(g,0,.72,0,1.65,.32,2.9,'walnut');box(g,0,.91,0,1.45,.05,2.65,'felt');for(const a of [-1,1])for(const b of [-1,1])box(g,a*.55,.37,b*1.03,.16,.7,.16,'darkwood');
 for(const x1 of [-.69,.69])for(const z1 of [-1.28,0,1.28])cyl(g,x1,.95,z1,.08,.025,'black');
 for(let i=0;i<6;i++)mesh(g,sphereGeo,['white','red','yellow'][i%3],-.3+i*.12,.965,.1+(i%2)*.13,.035,.035,.035);rod(g,[.8,.95,-1.2],[.82,.95,1],.015,'oaklight');}
function kitchen(p,x,z,r=0,length=4){const g=makeGroup(p,x,z,r);box(g,0,.5,0,length,1,.62,'oak');box(g,0,1.035,0,length+.08,.07,.71,'ivory');
 for(let i=0;i<Math.floor(length/.6);i++){box(g,-length/2+.32+i*.6,.55,.318,.55,.81,.025,'oaklight');box(g,-length/2+.32+i*.6,.82,.341,.2,.02,.025,'brass');}
 box(g,-.65,1.08,0,.65,.025,.42,'metal');rod(g,[-.65,1.05,-.16],[-.65,1.34,-.16],.025);rod(g,[-.65,1.34,-.16],[-.65,1.34,.01],.025);
 box(g,.8,1.08,0,.64,.025,.43,'black');for(const a of [-1,1])for(const b of [-1,1])cyl(g,.8+a*.15,1.099,b*.1,.075,.01,'metal');}
function treadmill(p,x,z,r=0){const g=makeGroup(p,x,z,r);box(g,0,.2,0,.86,.27,1.95,'black');box(g,0,.347,.1,.65,.025,1.45,'rubber');
 for(const a of [-1,1]){rod(g,[a*.37,.22,-.66],[a*.37,1.23,-.7],.055,'black');rod(g,[a*.37,1.04,-.66],[a*.37,1.04,0],.04,'black');}
 box(g,0,1.24,-.72,.71,.31,.16,'black');box(g,0,1.27,-.625,.42,.16,.015,'blue');}
function bike(p,x,z,r=0){const g=makeGroup(p,x,z,r);box(g,0,.12,0,.52,.1,1.1,'black');
 const wheel=cyl(g,0,.44,-.23,.27,.12,'black');wheel.rotation.z=Math.PI/2;
 rod(g,[0,.17,.33],[0,.85,.19],.055,'black');box(g,0,.87,.21,.28,.08,.34,'black');rod(g,[0,.35,-.35],[0,1.12,-.45],.045,'metal');rod(g,[-.24,1.12,-.45],[.24,1.12,-.45],.045,'black');rod(g,[0,.24,.33],[0,.35,-.35],.065,'red');
 rod(g,[-.25,.28,.04],[.25,.28,.04],.025);}
function bench(p,x,z,r=0){const g=makeGroup(p,x,z,r);box(g,0,.53,0,.5,.17,1.5,'black');for(const a of [-1,1]){rod(g,[0,.47,a*.5],[0,.06,a*.6],.065,'metal');box(g,0,.07,a*.6,.65,.08,.13,'metal');}}
function rack(p,x,z,r=0){const g=makeGroup(p,x,z,r);for(const a of [-1,1])for(const b of [-1,1])box(g,a*.58,1.15,b*.56,.08,2.3,.08,'black');
 for(const a of [-1,1])rod(g,[-.58,2.26,a*.56],[.58,2.26,a*.56],.045,'black');
 rod(g,[-.82,1.38,0],[.82,1.38,0],.025,'metal');for(const a of [-1,1]){const w=cyl(g,a*.74,1.38,0,.24,.16,'black');w.rotation.z=Math.PI/2;}bench(g,0,.25);}
function dumbbells(p,x,z,r=0){const g=makeGroup(p,x,z,r);for(const yy of [.55,.95]){box(g,0,yy,0,2.6,.08,.48,'metal');for(let i=0;i<7;i++){const xx=-1.1+i*.35;rod(g,[xx,yy+.11,-.14],[xx,yy+.11,.14],.027);for(const zz of [-.15,.15]){const m=cyl(g,xx,yy+.11,zz,.10,.1,'black');m.rotation.x=Math.PI/2;}}}
 for(const a of [-1,1])box(g,a*1.15,.48,0,.07,.96,.6,'black');}
function loungeSet(p,x,z,rot=0,color='ivory'){const g=makeGroup(p,x,z,rot);sofa(g,0,-1.2,0,color);sofa(g,0,1.2,Math.PI,color);coffee(g,0,0);box(g,0,.045,0,2.7,.025,2.8,'linen');}
function desk(p,x,z,r=0){const g=makeGroup(p,x,z,r);box(g,0,.76,0,1.25,.07,.65,'oaklight');for(const a of [-1,1])box(g,a*.5,.37,0,.045,.74,.55,'black');chair(g,0,.65,Math.PI);}
function chaise(p,x,z,r=0){const g=makeGroup(p,x,z,r);box(g,0,.26,.15,.64,.12,1.3,'oaklight');const b=box(g,0,.45,-.68,.64,.11,.65,'ivory');b.rotation.x=-.5;box(g,0,.34,.18,.58,.09,1.24,'ivory');for(const a of [-1,1])box(g,0,.13,a*.54,.52,.22,.05,'oak');}
function floorLabel(p,text,x,z,w,d,color='#eee8d1') {
 const tex=canvasTexture((c,s)=>{c.clearRect(0,0,s,s);c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.font='500 130px Arial';c.fillText(text,s/2,s/2,s-12);});
 const m=new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false});const q=new T.Mesh(new T.PlaneGeometry(w,d),m);q.rotation.x=-Math.PI/2;q.position.set(x,.048,z);p.add(q);return q;
}
function line(p,points,color='white',radius=.022){for(let i=1;i<points.length;i++)rod(p,points[i-1],points[i],radius,color);}
function poolBasin(p,x,z,w,d,lanes=false){
 box(p,x,-.15,z,w+.42,.5,d+.42,'pooltile');box(p,x,.105,z,w+.32,.06,d+.32,'ivory');
 const water=box(p,x,.141,z,w,.035,d,'water');water.name=lanes?'20m lap pool water':'Hydrotherapy water';
 if(lanes){water.userData={lengthMetres:POOL_LENGTH,laneCount:4};for(let i=0;i<4;i++){const xx=x-w/2+w/8+i*w/4;box(p,xx,.163,z,.065,.005,d-.7,'blue');for(const s of [-1,1])box(p,xx,.163,z+s*(d/2-.5),.6,.005,.06,'blue');}}
 // Fine static caustic strokes make water legible without a constant render loop.
 const tex=canvasTexture((c,s)=>{c.clearRect(0,0,s,s);c.strokeStyle='rgba(233,255,250,.3)';c.lineWidth=1;for(let j=0;j<60;j++){c.beginPath();let yy=j*12;for(let xx=0;xx<=s;xx+=8){const y1=yy+Math.sin(xx*.04+j)*7;c.lineTo(xx,y1);}c.stroke();}});
 tex.repeat.set(w/3,d/3);const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.165,z);p.add(m);
 for(const a of [-1,1]){rod(p,[x-w/2+.4,.17,z-d/2+.4+a*.25],[x-w/2+.4,.72,z-d/2+.4+a*.25],.025);rod(p,[x-w/2+.4,.72,z-d/2+.4+a*.25],[x-w/2-.3,.72,z-d/2+.4+a*.25],.025);}
}

function furnish(room,group,worldPolygon){
 const xs=worldPolygon.map(p=>p[0]),zs=worldPolygon.map(p=>p[1]);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),w=maxX-minX,d=maxZ-minZ;
 const g=makeGroup(group,(minX+maxX)/2,(minZ+maxZ)/2);g.name='Furnishings';
 const at=(fx,fz)=>[(fx-.5)*w,(fz-.5)*d];
 const put=(fn,fx,fz,r=0,...args)=>{const [x,z]=at(fx,fz);if(inside(x+g.position.x,z+g.position.z,worldPolygon))fn(g,x,z,r,...args);};
 const kind=room.kind;
 if(['lounge','event','sports'].includes(kind)){
  put(loungeSet,.32,.37,0,kind==='sports'?'blue':'ivory');
  if(w>9)put(loungeSet,.74,.38,0,'linen');
  if(d>7){put(table,.35,.76,0,Math.min(3,w*.4),.95,6);if(w>13)put(table,.76,.76,0,2.4,.95,6);}
  put(kitchen,.5,.09,0,Math.min(4,w*.7));put(television,.5,.17);put(plant,.1,.13,0,true);put(plant,.91,.89,0,true);
 }else if(kind==='dining'){
  const count=Math.max(1,Math.floor(d/4));for(let i=0;i<count;i++)put(table,.52,(i+.6)/count,Math.PI/2,2.7,1,8);
  put(kitchen,.5,.07,0,Math.min(w*.8,3));
 }else if(['meeting','studySmall','office','treatment','study','craft'].includes(kind)){
  if(kind==='study'){for(let i=0;i<3;i++)put(table,.19+i*.3,.36,0,2,.9,4);put(sofa,.26,.82,Math.PI,'blue');put(plant,.91,.14,0,true);}
  else if(kind==='studySmall'||kind==='office'){put(desk,.5,.35);}
  else if(kind==='treatment'){put(bench,.5,.5);put(desk,.5,.15);}
  else {put(table,.5,.5,d>w?Math.PI/2:0,Math.min(Math.max(w,d)*.55,4),1,8);put(kitchen,.5,.07,0,Math.min(w*.7,3));}
 }else if(kind==='kitchen'){put(kitchen,.5,.1,0,w*.85);put(kitchen,.5,.78,Math.PI,w*.65);}
 else if(kind==='billiards'){put(billiards,.5,.25);put(billiards,.5,.74);put(coffee,.18,.5);put(chair,.22,.43);put(chair,.22,.59,Math.PI);}
 else if(kind==='golf'){
  put(loungeSet,.25,.35,Math.PI/2,'blue');put(billiards,.67,.26,Math.PI/2);
  const [x,z]=at(.75,.74);box(g,x,.03,z,3.4,.03,3.4,'turf');box(g,x,1.35,z-1.8,3.6,2.7,.08,'black');box(g,x,1.36,z-1.74,3.2,2.28,.01,'ivory');
  put(sofa,.24,.8,Math.PI/2);put(coffee,.38,.8);
 }else if(kind==='gym'){
  for(let j=0;j<10;j++)put(treadmill,.89,.08+j*.088,Math.PI/2);
  for(let j=0;j<6;j++)put(bike,.74,.12+j*.14,Math.PI/2);
  for(let j=0;j<4;j++){put(rack,.2,.18+j*.19);put(bench,.46,.18+j*.19,Math.PI/2);put(dumbbells,.05,.18+j*.19,Math.PI/2);}
  for(let i=0;i<5;i++)put(bike,.12+i*.12,.055);
  for(let i=0;i<4;i++)put(dumbbells,.16+i*.19,.94);
  for(let i=0;i<4;i++){const [x,z]=at(.54,.15+i*.18);box(g,x,.23,z,.8,.46,.8,'oak');}
 }else if(kind==='cardio'){
  for(let j=0;j<5;j++){put(treadmill,.56,.13+j*.13);put(bike,.85,.13+j*.13,Math.PI/2);}
  for(let j=0;j<3;j++)put(bike,.13,.09+j*.14);
  // Indicative upper-level stair retained as a low open stair in the cutaway.
  for(let i=0;i<13;i++){const [x,z]=at(.82,.79);box(g,x,(i+1)*.105,z+i*.24,1.05,(i+1)*.21,.24,'stone');}
 }else if(kind==='yoga'||kind==='studio'){
  for(let j=0;j<2;j++)for(let i=0;i<5;i++){const [x,z]=at(.13+i*.18,.3+j*.4);box(g,x,.045,z,.62,.025,1.65,i%2?'linen':'blue');cyl(g,x,.2,z-.62,.11,.28,'clay');}
  put(plant,.95,.1,0,true);
 }else if(kind==='court'){
  const cw=w-1.5,cd=d-1.3;
  const tex=canvasTexture((c,s)=>{
   c.fillStyle='#c4a276';c.fillRect(0,0,s,s);for(let y=0;y<s;y+=9){c.strokeStyle='rgba(94,65,35,.17)';c.beginPath();c.moveTo(0,y);c.lineTo(s,y);c.stroke();}
   c.strokeStyle='#f6eee0';c.lineWidth=3;c.strokeRect(15,15,s-30,s-30);c.strokeRect(s/2-85,15,170,180);c.beginPath();c.arc(s/2,195,85,0,Math.PI);c.stroke();c.beginPath();c.arc(s/2,45,225,.05,Math.PI-.05);c.stroke();
   c.fillStyle='#65716c';c.textAlign='center';c.font='500 37px Arial';c.fillText('GILMORE',s/2,380);c.font='26px Arial';c.fillText('PLACE',s/2,417);
  });
  const q=new T.Mesh(new T.PlaneGeometry(cw,cd),new T.MeshStandardMaterial({map:tex,roughness:.65}));q.rotation.x=-Math.PI/2;q.position.set(0,.041,0);g.add(q);
  box(g,0,1.75,-cd/2+.4,.14,3.5,.14,'black');box(g,0,2.95,-cd/2+1,1.8,1.05,.09,'ivory');box(g,0,2.88,-cd/2+1.06,.61,.45,.01,'black');
  const tor=new T.Mesh(new T.TorusGeometry(.23,.025,6,24),mats.rust);tor.rotation.x=Math.PI/2;tor.position.set(0,2.62,-cd/2+1.39);g.add(tor);
 }else if(kind==='turf'){
  for(let j=0;j<29;j++){const [x,z]=at(.77,.035+j*.0325);box(g,x,.044,z,j%5===0?1.9:.8,.008,.065,'ivory');}
  for(let j=0;j<3;j++){const [x,z]=at(.38,.2+j*.29);floorLabel(g,String((3-j)*10),x,z,1.35,1.8);}
 }else if(kind==='bowling'){
  const laneLength=Math.min(18.3,d-6),start=-d/2+4.5;
  for(let i=0;i<3;i++){
   const xx=(i-1)*1.65;box(g,xx,.07,start+laneLength/2,1.08,.09,laneLength,'oaklight');
   for(const s of [-1,1])box(g,xx+s*.65,.05,start+laneLength/2,.17,.08,laneLength,'darkwood');
   for(let j=0;j<4;j++)for(let k=0;k<=j;k++){const x1=xx+(k-j/2)*.22,z1=start+laneLength-.45-j*.23;cyl(g,x1,.16,z1,.06,.24,'white');cyl(g,x1,.27,z1,.07,.09,'white');}
   sofa(g,xx,start-2.2,0,'blue',1.4);box(g,xx,1.5,start-.6,.85,.45,.06,'black');
   for(let k=0;k<3;k++)mesh(g,sphereGeo,k%2?'blue':'red',xx-.25+k*.23,.2,start-1,.12,.12,.12);
  }
  put(kitchen,.5,.94,0,w*.75);
 }else if(kind==='pool'){
  const x=minX-g.position.x+w*.72,z=minZ-g.position.z+POOL_LENGTH/2+2.1;
  poolBasin(g,x,z,6.096,POOL_LENGTH,true);
  const left=minX-g.position.x+3.05,top=minZ-g.position.z;
  poolBasin(g,left,top+6.1,3.5,7.3);
  poolBasin(g,left,top+13.5,3.5,4.7);
  poolBasin(g,left,top+18,3.5,2.2);
  for(let i=0;i<7;i++)put(chaise,.93,.12+i*.08,Math.PI/2);
  for(let i=0;i<5;i++)put(chaise,.25+i*.13,.81,Math.PI);
  for(let i=0;i<3;i++){put(chaise,.06,.12+i*.15,-Math.PI/2);}
 }else if(kind==='sauna'||kind==='steam'){
  box(g,0,.43,-d/2+.38,w-.3,.3,.6,kind==='sauna'?'oaklight':'ivory');box(g,-w/2+.4,.43,0,.65,.3,d-.4,kind==='sauna'?'oaklight':'ivory');
  if(kind==='sauna'){box(g,w/2-.48,.35,d/2-.5,.52,.65,.52,'black');for(let i=0;i<6;i++)mesh(g,sphereGeo,'stone',w/2-.64+(i%3)*.15,.74,d/2-.63+Math.floor(i/3)*.17,.09,.07,.09);}
 }else if(kind==='theatre'){
  for(let row=0;row<4;row++){box(g,0,row*.12,-d/2+2+row*1.4,w-.5,.1,1.3,'darkwood');for(let col=0;col<4;col++){const gg=makeGroup(g,(col-1.5)*.9,-d/2+2+row*1.4,0);gg.position.y=row*.12;sofa(gg,0,0,0,'blue',.78);}}
  box(g,0,1.4,-d/2+.2,w*.75,2.1,.08,'black');box(g,0,1.4,-d/2+.25,w*.70,1.86,.01,'linen');
 }else if(kind==='kids'){
  const [x,z]=at(.5,.5);cyl(g,x,.04,z,Math.min(w,d)*.32,.02,'linen');
  for(let i=0;i<8;i++){const a=i*2.4;cyl(g,x+Math.cos(a)*1.7,.2,z+Math.sin(a)*1.4,.27,.4,['blue','green','rust','yellow'][i%4]);}
  box(g,-w*.24,.8,-d*.27,1.65,1.6,1.4,'oaklight');const roof=new T.Mesh(new T.ConeGeometry(1.25,.9,4),mats.green);roof.rotation.y=Math.PI/4;roof.position.set(-w*.24,2,-d*.27);g.add(roof);
  put(table,.7,.23,0,1.5,.7,4);put(sofa,.5,.89,Math.PI,'linen');
 }else if(kind==='music'){
  box(g,0,.82,-.45,1.6,.11,.8,'black');box(g,0,1.15,-.79,1.6,.63,.18,'black');box(g,0,.79,-.02,1.5,.08,.25,'ivory');
  for(let i=0;i<18;i++)box(g,-.68+i*.076,.843,-.08,.035,.035,.13,'black');bench(g,0,.65,Math.PI/2);
 }else if(kind==='workshop'){put(kitchen,.5,.12,0,w*.8);for(let i=0;i<3;i++)put(bike,.5,.35+i*.22,Math.PI/2);}
 else if(kind==='change'){
  for(let j=0;j<8;j++){const [x,z]=at(.16,.06+j*.12);box(g,x,.95,z,.52,1.9,.6,'oaklight');box(g,x+.27,1,z,.02,.12,.05,'black');}
  for(let j=0;j<4;j++){put(bench,.62,.14+j*.23);}
 }else if(kind==='guest'){
  for(let i=0;i<5;i++){const xx=-w/2+2.2+i*2.3,zz=d/2-2-i*1.7;if(!inside(xx+g.position.x,zz+g.position.z,worldPolygon))continue;
   const gg=makeGroup(g,xx,zz,-Math.PI/4);box(gg,0,.24,0,1.7,.4,2.1,'oak');box(gg,0,.53,0,1.63,.2,2,'ivory');box(gg,0,.67,-.69,1.35,.12,.44,'white');box(gg,0,.67,.55,1.65,.06,.72,'blue');box(gg,0,.8,-1.02,1.75,1.4,.1,'linen');}
 }else if(kind==='terrace'){
  const count=Math.max(1,Math.floor(Math.max(w,d)/4));for(let i=0;i<count;i++){const fx=w>d?(i+.5)/count:.5,fz=w>d?.5:(i+.5)/count;put(coffee,fx,fz);put(chair,fx,fz-.04);put(chair,fx,fz+.04,Math.PI);}
  for(let i=0;i<4;i++)put(plant,.15+i*.23,.12,0,true);
 }else if(kind==='dog'){
  // Park is a detached diagrammatic island, matching the user's source layout.
  for(let i=0;i<8;i++)put(tree,.13,.13+i*.10,0,1);
  for(let i=0;i<7;i++)put(tree,.23+i*.09,.12,0,1);
  for(let i=0;i<3;i++)put(bench,.42+i*.14,.36+i*.13,Math.PI/4);
  const [x,z]=at(.48,.65);const hoop=new T.Mesh(new T.TorusGeometry(.6,.04,6,24),mats.brass);hoop.position.set(x,.85,z);g.add(hoop);rod(g,[x-.6,0,z],[x-.6,.85,z],.04,'brass');rod(g,[x+.6,0,z],[x+.6,.85,z],.04,'brass');
 }
 return g;
}

function mergeRoomGeometry(group){
 const buckets=new Map();group.updateMatrixWorld(true);
 const inverse=new T.Matrix4().copy(group.matrixWorld).invert(),old=[];
 group.traverse(o=>{if(!o.isMesh||o.material.transparent||o.userData.lengthMetres)return;const key=o.material.uuid;if(!buckets.has(key))buckets.set(key,{material:o.material,geos:[]});
  const geo=o.geometry.clone();geo.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));if(geo.index) {const flat=geo.toNonIndexed();geo.dispose();buckets.get(key).geos.push(flat);}else buckets.get(key).geos.push(geo);old.push(o);
 });
 old.forEach(o=>o.removeFromParent());
 for(const {material,geos} of buckets.values()){const geo=mergeGeometries(geos);if(geo){const m=new T.Mesh(geo,material);m.castShadow=true;m.receiveShadow=true;group.add(m);}geos.forEach(g=>g.dispose());}
}

export function createClubModel(){
 const root=new T.Group();root.name='Club Gilmore — Level 4';root.userData={units:'metres',poolLengthMetres:20,wallHeightMetres:WALL_HEIGHT,geometry:'Architectural-plan trace; representative furnishings and uniform heights'};
 const structure=new T.Group();structure.name='Building structure';root.add(structure);
 const base=new T.Mesh(shapeGeometry(slabOutline.map(toWorld),.38),mats.circulation);base.position.y=-.4;base.receiveShadow=true;structure.add(base);
 const outlines=[],roomGroups=new Map(),floorMeshes=[],wallGroups=[],columnGroups=[];
 for(const room of rooms){
  const poly=room.polygon.map(toWorld);const group=new T.Group();group.name=room.name;group.userData={roomId:room.id,category:room.category,bookingUrl:room.bookingUrl};root.add(group);
  let floorMaterial=['gym','cardio','studio','change'].includes(room.kind)?'gymfloor':['pool','steam','terrace','treatment'].includes(room.kind)?'tilefloor':['turf','dog'].includes(room.kind)?'turf':'woodfloor';
  if(room.detached){const b=new T.Mesh(shapeGeometry(poly,.38),mats.stone);b.position.y=-.4;structure.add(b);}
  const floor=new T.Mesh(shapeGeometry(poly),mats[floorMaterial].clone());floor.name=room.name+' floor';floor.position.y=.02;floor.receiveShadow=true;floor.userData={roomId:room.id};group.add(floor);floorMeshes.push(floor);
  const wall=new T.Group();wall.name='Cutaway walls';group.add(wall);wallGroups.push(wall);
  if(!['turf','terrace','pool'].includes(room.kind)){
   for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),rot=-Math.atan2(dz,dx),cx=(a[0]+b[0])/2,cz=(a[1]+b[1])/2;
    const outdoor=room.kind==='dog',glassEdge=!outdoor&&(i===0||(['gym','cardio','yoga','court'].includes(room.kind)&&i===1));
    const h=outdoor?1.15:WALL_HEIGHT;
    // One real opening per enclosed room; no sealed floor-polygons pretending to be doors.
    const door=(i===poly.length-2&&length>2.5)?1.05:0;
    const segment=(offset,l)=>{
     const xx=cx+Math.cos(-rot)*offset,zz=cz+Math.sin(-rot)*offset;
     box(wall,xx,h/2,zz,l,h,outdoor?.075:.16,glassEdge?'glass':'wall',rot);
     box(wall,xx,h+.015,zz,l,.035,outdoor?.1:.18,glassEdge?'metal':'walltop',rot);
     if(glassEdge){const count=Math.max(1,Math.ceil(l/1.7));for(let j=0;j<=count;j++){const t=(j/count-.5)*l;box(wall,xx+Math.cos(-rot)*t,h/2,zz+Math.sin(-rot)*t,.045,h,.045,'metal');}box(wall,xx,.12,zz,l,.24,.08,'black',rot);}
    };
    if(door){const l=(length-door)/2;segment(-(door+l)/2,l);segment((door+l)/2,l);}
    else segment(0,length);
   }
  }
  mergeRoomGeometry(wall);
  const props=furnish(room,group,poly);mergeRoomGeometry(props);
  const center=new T.Box3().setFromPoints(poly.map(([x,z])=>new T.Vector3(x,0,z))).getCenter(new T.Vector3());
  const lineGeo=new T.BufferGeometry().setFromPoints([...poly,poly[0]].map(([x,z])=>new T.Vector3(x,.075,z)));
  const outline=new T.Line(lineGeo,new T.LineBasicMaterial({color:0xc8ad63,transparent:true,opacity:.95,depthTest:false}));outline.visible=false;outline.renderOrder=5;group.add(outline);outlines.push(outline);
  roomGroups.set(room.id,{group,floor,wall,props,center,poly,outline});
 }
 for(const core of cores){const g=new T.Group();g.name=core.name;structure.add(g);const [x,z,w,d]=core.rect;const [cx,cz]=toWorld([x+w/2,z+d/2]);
  box(g,cx,.012,cz,w*U,.025,d*U,'tilefloor');
  const shell=new T.Group();g.add(shell);wallGroups.push(shell);
  for(const side of [-1,1]){box(shell,cx+side*w*U/2,1.5,cz,.22,3,d*U,'wall');box(shell,cx,1.5,cz+side*d*U/2,w*U,3,.22,'wall');}
  if(core.lifts){for(let j=0;j<2;j++)for(let i=0;i<3;i++){const lx=cx+(i-1)*2.5,lz=cz+(j?1:-1)*d*U*.25;
   box(g,lx,.055,lz,2,.075,2,'rubber');for(const side of [-1,1]){box(shell,lx+side*1.04,1.5,lz,.13,3,2.2,'wall');box(shell,lx,1.5,lz+side*1.04,2.2,3,.13,'wall');}
   box(shell,lx,1.0,lz+(j?-1:1)*1.12,1.1,2,.025,'metal');
  }
  for(let i=0;i<14;i++)box(g,cx-w*U*.39,.045+i*.027,cz-d*U*.44+i*.13,.8,.06+i*.054,.13,'stone');
  }else{for(let i=0;i<3;i++)box(g,cx-w*U*.25+i*w*U*.25,.55,cz,1,1.1,1.4,'metal');}
  mergeRoomGeometry(shell);
 }
 const cols=new T.Group();cols.name='Structural columns';structure.add(cols);columnGroups.push(cols);
 for(const xx of [838,976,1113])for(const zz of [496,618,748,891]) {const [x,z]=toWorld([xx,zz]);box(cols,x,WALL_HEIGHT/2,z,.67,WALL_HEIGHT,.67,'wall');box(cols,x,WALL_HEIGHT+.02,z,.71,.04,.71,'walltop');}
 mergeRoomGeometry(cols);
 // Pool columns maintain the architectural rhythm while leaving the basins visible.
 const pc=new T.Group();structure.add(pc);columnGroups.push(pc);for(const xx of [838,1113])for(const zz of [1010,1140,1270]){const [x,z]=toWorld([xx,zz]);box(pc,x,1.5,z,.66,3,.66,'wall');}mergeRoomGeometry(pc);
 root.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(root);
 return {root,roomGroups,floorMeshes,wallGroups,columnGroups,bounds,mats};
}

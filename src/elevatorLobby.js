import * as T from 'three';
import {box, cyl, mesh, canvasTexture} from './model.js';

// IMG_4068-4072: inferred interior proportions within the existing pavilion.
// Local origin is the elevator/exit-wall corner; the bridge entrance faces +Z.
export function buildElevatorLobby(parent, x, z) {
 const g=new T.Group();g.name='Elevator lobby';g.position.set(x,.1,z);parent.add(g);
 const material=(color,roughness=.7,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const wall=material('#dcded8'),tile=material('#c6c6bf'),grout=material('#e0dfd7');
 const black=material('#202423'),steel=material('#b4bab8',.3,.72),grey=material('#858983');
 const white=material('#eeeee8'),red=material('#b8272b'),base=material('#a4a69f');
 const W=2.82,D=2.94,H=3.34;
 const b=(x,y,z,w,h,d,m)=>box(g,x,y,z,w,h,d,m);
 const face=(x,y,z,w,h,m,rot=0)=>mesh(g,new T.PlaneGeometry(w,h),m,x,y,z,1,1,1,rot);
 // Full-height painted partitions enclose the compact vestibule inside the shell.
 b(-.045,H/2,D/2,.09,H,D,wall);b(W/2,H/2,-.045,W,H,.09,wall);
 b(W-.015,H/2,.24,.03,H,.48,wall);
 b(W/2,H-.025,D/2,W,.05,D,white);
 b(W/2,.012,D/2,W,.024,D,tile);
 for(let q=.6;q<W;q+=.6)b(q,.026,D/2,.003,.002,D,grout);
 for(let q=.6;q<D;q+=.6)b(W/2,.026,q,W,.002,.003,grout);
 b(W/2,.065,.012,W,.13,.024,base);
 b(W-.025,.065,.25,.03,.13,.5,base);
 // Large square tiles stop at the elevator head. The adjacent exit wall is paint.
 for(const [start,end] of [[0,.72],[1.92,D]]){
  b(.017,1.12,(start+end)/2,.034,2.24,end-start,tile);
  for(let y=.56;y<2.24;y+=.56)b(.036,y,(start+end)/2,.003,.003,end-start,grout);
  for(let q=start+.6;q<end;q+=.6)b(.036,1.12,q,.003,2.24,.003,grout);
 }
 b(.02,2.245,D/2,.04,.014,D,grout);
 // Recessed split elevator leaves, separate jambs and a very narrow centre seam.
 b(.045,1.1,1.32,.06,2.2,1.2,black);
 for(const q of [.755,1.885])b(.087,1.1,q,.075,2.2,.065,steel);
 b(.087,2.175,1.32,.075,.05,1.2,steel);
 const brushed=canvasTexture((c,n)=>{
  const band=c.createLinearGradient(0,0,0,n);
  [[0,'#a4abaa'],[.2,'#d4d9d6'],[.45,'#919995'],[.72,'#c9ceca'],[1,'#a5aca9']].forEach(([p,v])=>band.addColorStop(p,v));
  c.fillStyle=band;c.fillRect(0,0,n,n);
  for(let i=0;i<n;i++){c.fillStyle=`rgba(40,48,45,${.005+(i*17%13)/1000})`;c.fillRect(0,i,n,1);}
 });
 const leaf=new T.MeshStandardMaterial({map:brushed,roughness:.38,metalness:.55});
 for(const q of [1.056,1.584])face(.084,1.085,q,.523,2.08,leaf,Math.PI/2);
 b(.09,.035,1.32,.3,.025,1.2,steel);
 b(.11,1.08,2.2,.025,.21,.15,black);
 const button=cyl(g,.132,1.075,2.2,.023,.012,steel);button.rotation.z=Math.PI/2;
 // Draw in the plaque's physical aspect ratio so the lettering is not stretched.
 const plate=canvasTexture((c,n)=>{
  c.scale(n/180,n/500);c.fillStyle='#151918';c.fillRect(0,0,180,500);
  c.fillStyle='#f2f3e9';c.textAlign='center';c.textBaseline='middle';
  c.font='500 23px sans-serif';c.fillText('ELEVATOR',90,58);
  c.font='500 128px sans-serif';c.fillText('23',90,206);c.fillText('6',90,381);
 });
 face(.13,1.43,.775,.09,.25,new T.MeshStandardMaterial({map:plate}),Math.PI/2);
 // Thin rubber edging and a fine, deterministic woven surface keep the mat flush.
 b(1.21,.035,1.83,1.99,.018,1.87,black);
 const weave=canvasTexture((c,n)=>{c.fillStyle='#292b29';c.fillRect(0,0,n,n);let seed=4069;for(let y=0;y<n;y+=2)for(let x=0;x<n;x+=2){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=30+seed%25;c.fillStyle=`rgb(${v},${v+1},${v})`;c.fillRect(x,y,1,2);}});
 face(1.21,.046,1.83,1.95,1.83,new T.MeshStandardMaterial({map:weave,roughness:1})).rotation.x=-Math.PI/2;
 // Exit door and safety equipment occupy separate areas of the painted back wall.
 b(2.17,1.075,.023,1.03,2.15,.045,black);
 b(2.17,1.045,.049,.91,2.07,.025,grey);
 for(const q of [1.675,2.665])b(q,1.075,.065,.045,2.15,.075,base);
 b(2.17,2.135,.065,1.03,.045,.075,base);
 for(const q of [1.82,2.51])b(q,.96,.105,.065,.14,.085,steel);
 b(2.165,.96,.158,.76,.035,.04,steel);
 b(2.17,.13,.068,.85,.22,.008,steel);
 b(2.17,1.55,.069,.19,.25,.004,white);
 b(1.91,1.68,.071,.075,.38,.004,material('#b7ccca'));
 const exitTexture=canvasTexture((c,n)=>{
  c.scale(n/350,n/180);c.fillStyle='#087c79';c.fillRect(0,0,350,180);
  c.fillStyle='#f7ffed';c.textAlign='center';c.textBaseline='middle';
  c.font='bold 104px sans-serif';c.fillText('EXIT',175,96);
 });
 const exit=new T.MeshStandardMaterial({map:exitTexture,emissiveMap:exitTexture,emissive:'#ffffff',emissiveIntensity:.6});
 b(2.17,2.37,.068,.4,.23,.085,white);face(2.17,2.37,.113,.35,.18,exit);
 b(.62,1.24,.052,.27,.52,.09,white);b(.62,1.24,.101,.205,.44,.012,black);
 cyl(g,.62,1.19,.15,.055,.27,red);b(.62,1.2,.2,.09,.12,.008,white);b(.62,1.36,.15,.08,.025,.05,black);
 b(1.02,1.46,.048,.28,.38,.07,red);b(.94,1.46,.087,.025,.26,.01,black);
 for(let y=1.38;y<1.57;y+=.045)b(.94,y,.094,.012,.01,.003,white);
 b(1.37,1.46,.031,.38,.34,.034,base);
 // The reference's posted plan is represented as linework, not invented text.
 const plan=canvasTexture((c,n)=>{c.fillStyle='#dcddd5';c.fillRect(0,0,n,n);c.strokeStyle='#727970';c.lineWidth=3;for(const [x,y,w,h] of [[35,50,220,260],[70,85,80,90],[160,85,60,150],[70,190,80,85],[275,50,195,330]])c.strokeRect(x,y,w,h);for(let y=80;y<350;y+=22){c.beginPath();c.moveTo(295,y);c.lineTo(450,y);c.stroke();}});
 face(1.37,1.46,.05,.35,.3,new T.MeshStandardMaterial({map:plan}));
 b(1.43,1.08,.064,.13,.17,.065,red);b(1.43,1.12,.103,.1,.027,.015,white);
 b(.42,.29,.018,.07,.12,.025,white);
 for(const q of [-.012,.012])b(.42+q,.29,.032,.006,.026,.004,black);
 mesh(g,new T.SphereGeometry(.075,20,12),white,.2,2.52,.042,1,1,.5);
 mesh(g,new T.SphereGeometry(.045,20,12),black,.2,2.515,.077,1,1,.55);
 const diffuser=new T.MeshStandardMaterial({color:'#fffdf2',emissive:'#fff3d8',emissiveIntensity:1.4,roughness:.5});
 for(const lx of [.68,2.07])for(const lz of [.65,2.17]){
  cyl(g,lx,H-.065,lz,.18,.026,base);cyl(g,lx,H-.085,lz,.162,.018,diffuser);
 }
 // One local fill avoids four extra per-fragment lights across the entire deck.
 const light=new T.PointLight(0xfff7e7,9,5,2);light.position.set(1.4,2.8,1.4);g.add(light);
 return {glass:new T.MeshStandardMaterial({color:'#b5cdd0',roughness:.16,metalness:.05,transparent:true,opacity:.26,depthWrite:false,side:T.DoubleSide}),exit};
}

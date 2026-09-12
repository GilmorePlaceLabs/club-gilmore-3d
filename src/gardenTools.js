import * as T from 'three';
import {box,cyl,mesh,rod} from './model.js';

export function buildGardenTools(bench,z0){
 const g=new T.Group();g.name='Potting bench garden tools';bench.add(g);
 const steel=new T.MeshStandardMaterial({color:'#b9c4c5',metalness:.65,roughness:.33});
 const green=new T.MeshStandardMaterial({color:'#477d68',roughness:.6});
 const orange=new T.MeshStandardMaterial({color:'#da7540',roughness:.7});
 const dark=new T.MeshStandardMaterial({color:'#303a3a',roughness:.7});
 const wood=new T.MeshStandardMaterial({color:'#b99564',roughness:.8});
 const ring=(parent,x,y,z,r,t,material)=>mesh(parent,new T.TorusGeometry(r,t,8,24),material,x,y,z);
 // Open bucket on the lower shelf, with a wire bail and a visible interior.
 const bucket=new T.Group();bucket.name='Garden bucket';bucket.position.set(-.48,.402,z0);g.add(bucket);
 const bucketWall=green.clone();bucketWall.side=T.DoubleSide;
 mesh(bucket,new T.CylinderGeometry(.17,.13,.28,24,1,true),bucketWall,0,.14,0);
 cyl(bucket,0,.012,0,.13,.024,green);
 ring(bucket,0,.28,0,.17,.012,steel).rotation.x=Math.PI/2;
 mesh(bucket,new T.TorusGeometry(.18,.009,6,24,Math.PI),steel,0,.28,0);
 // Watering can on the worktop: long spout, rose and a loop handle.
 const can=new T.Group();can.name='Watering can';can.position.set(-.59,.95,z0);g.add(can);
 cyl(can,0,.14,0,.15,.28,green);
 cyl(can,0,.285,0,.075,.008,dark);
 ring(can,0,.29,0,.08,.014,green).rotation.x=Math.PI/2;
 rod(can,[.11,.08,0],[.36,.3,0],.035,green);
 const rose=cyl(can,.37,.31,0,.07,.025,steel);rose.rotation.z=-Math.PI/4;
 ring(can,-.16,.16,0,.115,.018,green).scale.x=.72;
 // Pruning scissors laid flat, with two orange finger loops and crossed blades.
 const scissors=new T.Group();scissors.name='Garden scissors';scissors.position.set(-.08,.957,z0+.12);scissors.rotation.y=.35;g.add(scissors);
 for(const s of [-1,1]){
  const loop=ring(scissors,s*.043,.008,.085,.037,.009,orange);loop.rotation.x=-Math.PI/2;loop.scale.y=1.3;
  rod(scissors,[s*.036,.009,.052],[0,.012,-.01],.011,orange);
  rod(scissors,[0,.014,-.01],[s*.044,.014,-.14],.012,steel);
 }
 cyl(scissors,0,.018,-.01,.018,.012,steel);
 // Hand trowel and fork on the other half of the work surface.
 for(const [i,x] of [.28,.59].entries()){
  const tool=new T.Group();tool.name=i?'Hand garden fork':'Hand trowel';tool.position.set(x,.965,z0);tool.rotation.y=i?-.2:.25;g.add(tool);
  rod(tool,[0,0,.14],[0,0,0],.026,wood);rod(tool,[0,0,0],[0,0,-.085],.009,steel);
  if(i){
   box(tool,0,0,-.085,.115,.015,.022,steel);
   for(const xx of [-.046,0,.046])rod(tool,[xx,0,-.085],[xx,-.008,-.2],.007,steel);
  }else{
   mesh(tool,new T.SphereGeometry(1,12,8),steel,0,0,-.15,.052,.012,.09);
  }
 }
 // Full-size shovel rests behind the bench, clear of the walking aisle.
 const shovel=new T.Group();shovel.name='Garden shovel';shovel.position.set(.68,.075,z0-.44);shovel.rotation.x=-.12;g.add(shovel);
 mesh(shovel,new T.SphereGeometry(1,12,8),steel,0,.17,0,.13,.17,.022);
 rod(shovel,[0,.27,0],[0,1.27,0],.022,wood);
 for(const s of [-1,1])rod(shovel,[0,1.25,0],[s*.075,1.4,0],.017,dark);
 rod(shovel,[-.075,1.4,0],[.075,1.4,0],.023,orange);
}

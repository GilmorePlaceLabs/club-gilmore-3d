import * as T from 'three';
import {box,cyl,mesh,rod,canvasTexture} from './model.js';

export function createGardenPlanterBuilder(){
 const mat=(color)=>new T.MeshStandardMaterial({color,roughness:.85});
 const frame=mat('#303b38'),rim=mat('#56615a'),green=mat('#39733d'),leaf=mat('#589345');
 const yellow=mat('#f4c32f'),centre=mat('#533820'),red=mat('#cf392a'),stake=mat('#ae9470');
 const flowers=['#e994bc','#a897d6','#f3eee3'].map(mat);
 const soilMap=canvasTexture((c,n)=>{c.fillStyle='#49372a';c.fillRect(0,0,n,n);let s=91;for(let i=0;i<9000;i++){s=(Math.imul(s,1664525)+1013904223)>>>0;const x=s%n;s=(Math.imul(s,1664525)+1013904223)>>>0;const y=s%n;c.fillStyle=i%3?'#594331':'#30281f';c.fillRect(x,y,2,2);}});
 const soil=new T.MeshStandardMaterial({map:soilMap,roughness:1});
 const sphere=new T.IcosahedronGeometry(1,1),petal=new T.SphereGeometry(1,8,6);
 return (parent,x,z,length,rotation,index)=>{
  const g=new T.Group();g.name='Raised garden planter '+(index+1);g.position.set(x,.075,z);g.rotation.y=rotation;parent.add(g);
  const width=.64,top=.59;
  box(g,0,.26,0,length,.52,width,frame);
  box(g,0,.525,0,length-.1,.03,width-.1,soil);
  for(const s of [-1,1]){
   box(g,0,.56,s*(width/2-.025),length,.09,.05,rim);
   box(g,s*(length/2-.025),.56,0,.05,.09,width,rim);
  }
  const leaves=(px,py,pz)=>{
   for(const s of [-1,1]){const m=mesh(g,sphere,leaf,px+s*.075,py,pz,.13,.035,.07);m.rotation.z=s*.45;}
  };
  const plantCount=Math.max(2,Math.min(6,Math.floor(length/.45)));
  for(let j=0;j<plantCount;j++){
   const px=-length/2+.28+j*(length-.56)/(plantCount-1),pz=(j%2?1:-1)*.09,type=(j+index)%3;
   if(type===0){
    const h=.82+(j%2)*.18;
    rod(g,[px,top,pz],[px,top+h,pz],.014,green);leaves(px,top+.25,pz);leaves(px,top+.49,pz);
    for(let k=0;k<12;k++){const a=k*Math.PI/6,m=mesh(g,petal,yellow,px+Math.sin(a)*.12,top+h+Math.cos(a)*.12,pz,.05,.11,.025);m.rotation.z=-a;}
    mesh(g,sphere,centre,px,top+h,pz+.03,.09,.09,.035);
   }else if(type===1){
    rod(g,[px+.035,top,pz],[px+.035,top+.87,pz],.012,stake);
    rod(g,[px,top,pz],[px,top+.72,pz],.015,green);
    for(let k=0;k<4;k++){
     const side=k%2?1:-1,yy=top+.18+k*.13;
     rod(g,[px,yy,pz],[px+side*.15,yy+.09,pz],.01,green);leaves(px+side*.12,yy+.1,pz);
     mesh(g,sphere,k===3?leaf:red,px+side*.13,yy+.025,pz+.06,.055,.06,.055);
    }
   }else{
    for(let k=0;k<3;k++){
     const xx=px+(k-1)*.1,yy=top+.28+k*.06;
     rod(g,[xx,top,pz],[xx,yy,pz],.008,green);leaves(xx,top+.1,pz);
     for(let p=0;p<6;p++){const a=p*Math.PI/3;mesh(g,petal,flowers[(index+k)%3],xx+Math.cos(a)*.055,yy,pz+Math.sin(a)*.055,.045,.025,.045);}
     mesh(g,sphere,yellow,xx,yy+.012,pz,.023,.023,.023);
    }
   }
  }
 };
}

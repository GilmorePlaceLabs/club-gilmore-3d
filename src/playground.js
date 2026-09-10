import * as T from 'three';
import {box,cyl,rod,mesh,makeGroup,mats} from './model.js';

// Built equipment interpreted from the user's ground-level and aerial photographs.
export function buildPlayground(parent,x,z,podX,podZ){
 const g=makeGroup(parent,x,z);g.name='Playground — curved slides and climbing frame';g.position.y=.17;
 const blue=new T.MeshStandardMaterial({color:'#168eae',roughness:.36,metalness:.08});
 const posts=new T.MeshStandardMaterial({color:'#316479',roughness:.46,metalness:.25});
 const steel=mats.metal;
 const deck=new T.MeshStandardMaterial({color:'#727e83',roughness:.86});
 const tube=(points,r=.035,material=steel,p=g)=>{const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));const m=new T.Mesh(new T.TubeGeometry(curve,48,r,8,false),material);m.castShadow=m.receiveShadow=true;p.add(m);return m;};
 // Continuous moulded chute: a concave riding surface, high rolled sides and a thin underside.
 function slide(points,width){
  const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),pos=[],uv=[],indices=[];
  const rows=80,cols=20;
  for(let layer=0;layer<2;layer++)for(let i=0;i<=rows;i++){
   const t=i/rows,c=curve.getPoint(t),v=curve.getTangent(t),side=new T.Vector3(v.z,0,-v.x).normalize();
   for(let j=0;j<=cols;j++){const u=j/cols*2-1,lip=Math.pow(Math.abs(u),5)*.24;const p=c.clone().addScaledVector(side,u*width/2);p.y+=lip-layer*.065;pos.push(p.x,p.y,p.z);uv.push(j/cols,t);}
  }
  const stride=cols+1,offset=(rows+1)*stride;
  for(let layer=0;layer<2;layer++)for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const a=layer*offset+i*stride+j,b=a+stride;if(layer)indices.push(a,a+1,b,a+1,b+1,b);else indices.push(a,b,a+1,a+1,b,b+1);}
  for(const j of [0,cols])for(let i=0;i<rows;i++){const a=i*stride+j,b=a+stride;indices.push(a,a+offset,b,b,a+offset,b+offset);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
  const m=new T.Mesh(geo,blue);m.material.side=T.DoubleSide;m.castShadow=m.receiveShadow=true;g.add(m);
  for(const sign of [-1,1]){const rim=[];for(let i=0;i<=40;i++){const t=i/40,c=curve.getPoint(t),v=curve.getTangent(t);c.addScaledVector(new T.Vector3(v.z,0,-v.x).normalize(),sign*width/2);c.y+=.24;rim.push(c.toArray());}tube(rim,.045,blue);}
 }
 // Six-sided raised platform; segmented vertical-bar guards leave slide and stair openings.
 mesh(g,new T.CylinderGeometry(1.04,1.04,.14,6),deck,0,1.63,0);
 const ring=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;ring.push([Math.cos(a),Math.sin(a)]);cyl(g,Math.cos(a),1.58,Math.sin(a),.065,3.16,posts);mesh(g,new T.SphereGeometry(.07,12,8),posts,Math.cos(a),3.17,Math.sin(a));}
 for(const i of [0,2,3]){const a=ring[i],b=ring[(i+1)%6];rod(g,[a[0],2.83,a[1]],[b[0],2.83,b[1]],.04,steel);for(let k=1;k<8;k++){const t=k/8;rod(g,[T.MathUtils.lerp(a[0],b[0],t),1.72,T.MathUtils.lerp(a[1],b[1],t)],[T.MathUtils.lerp(a[0],b[0],t),2.8,T.MathUtils.lerp(a[1],b[1],t)],.017,steel);}}
 // Large S-shaped slide and adjacent two-lane straight slide.
 slide([[.53,1.7,.78],[.85,1.62,1.2],[.98,1.1,1.95],[.58,.58,2.65],[.76,.2,3.4],[1.23,.11,3.83]],.83);
 for(const dx of [-.22,.22])slide([[-.6+dx,1.64,.68],[-1.02+dx,1.5,1.05],[-1.5+dx,.83,1.9],[-1.97+dx,.18,2.8],[-2.1+dx,.1,3.13]],.44);
 // Blue arch at the high slide entrance.
 tube([[.13,1.72,.79],[.13,2.38,.79],[.28,2.67,.79],[.58,2.74,.79],[.88,2.63,.79],[.98,2.37,.79],[.98,1.74,.79]],.105,blue);
 // Curved climbing cage beside the platform: bowed uprights with horizontal rungs.
 const arc=(t,zz)=>[1.0+Math.sin(t*Math.PI)*1.18,.12+t*2.75,zz];
 for(const zz of [-.67,-.23,.23,.67])tube(Array.from({length:21},(_,i)=>arc(i/20,zz)),.032,steel);
 for(let i=0;i<11;i++){const t=i/10;rod(g,arc(t,-.67),arc(t,.67),.026,steel);}
 // Access stairs and tubular handrails at the rear.
 for(let i=0;i<8;i++){box(g,-.3,.12+i*.2,-2.3+i*.19,.8,.1,.25,deck);}
 for(const xx of [-.75,.15]){tube([[xx,.65,-2.45],[xx,1.1,-1.9],[xx,2.3,-.92]],.033,steel);rod(g,[xx,0,-2.35],[xx,.8,-2.35],.03,steel);}
 // Curved overhead traverse bar, end post and small stepping platforms.
 tube([[-1,1.85,0],[-1.7,1.87,-.1],[-2.55,1.84,.18],[-3.1,1.8,.62]],.037,steel);
 cyl(g,-3.1,1.02,.62,.065,2.05,posts);
 for(let i=0;i<6;i++){const t=i/5;rod(g,[-1.15-t*1.8,1.85,.05+t*.4],[-1.15-t*1.8,1.85,.5+t*.4],.023,steel);}
 for(const [xx,zz] of [[-3.1,.62],[.1,1.8]])cyl(g,xx,.32,zz,.23,.07,deck);
 // Connected, multicoloured pentagonal climbing modules with inset panels and climbing holds.
 const pods=makeGroup(parent,podX,podZ);pods.name='Connected pentagonal climbing pods';pods.position.y=.17;
 const palette=['#aeb6b6','#c7cecb','#283f5b','#dc8650','#899ba6'].map(c=>new T.Color(c));
 const podMaterial=new T.MeshStandardMaterial({vertexColors:true,roughness:.73});
 for(const [cx,cy,cz,r] of [[-1.35,.85,.35,.94],[0,.92,0,1],[1.35,.9,.35,.96],[1.25,2.14,.22,1.02]]){
  let geo=new T.DodecahedronGeometry(r,0);if(geo.index)geo=geo.toNonIndexed();const p=geo.attributes.position,colors=[],faceNormals=new Map();
  for(let i=0;i<p.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2),n=b.clone().sub(a).cross(c.clone().sub(a)).normalize(),key=n.toArray().map(v=>Math.round(v*1000)).join(',');if(!faceNormals.has(key))faceNormals.set(key,{normal:n,vertices:[],color:palette[faceNormals.size%5]});const f=faceNormals.get(key);f.vertices.push(a,b,c);for(let j=0;j<3;j++)colors.push(f.color.r,f.color.g,f.color.b);}
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));const m=new T.Mesh(geo,podMaterial);m.position.set(cx,cy,cz);m.castShadow=m.receiveShadow=true;pods.add(m);
  for(const {normal:n,vertices} of faceNormals.values()){const center=vertices.reduce((v,a)=>v.add(a),new T.Vector3()).divideScalar(vertices.length);if(n.y<-.65)continue;for(let k=0;k<3;k++){const v=vertices[(k*2)%vertices.length].clone().lerp(center,.45).addScaledVector(n,.025);mesh(pods,new T.IcosahedronGeometry(.047,0),k%2?'green':'black',cx+v.x,cy+v.y,cz+v.z);}}
  const edges=new T.LineSegments(new T.EdgesGeometry(geo,20),new T.LineBasicMaterial({color:'#677779'}));edges.position.copy(m.position);pods.add(edges);
 }
 // Small oval playground information marker, visible in the supplied photo.
 const sign=makeGroup(g,2.7,2.2);cyl(sign,0,.65,0,.035,1.3,posts);const face=mesh(sign,new T.SphereGeometry(1,20,12),deck,0,1.33,0,.24,.37,.035);face.rotation.y=-.3;
 return g;
}

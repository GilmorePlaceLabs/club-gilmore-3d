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
 // Six-sided raised platform. The plate is turned 30 degrees so its corners sit
 // on the six posts, and each piece of equipment takes one whole edge. Edge k runs
 // from post k to post k+1 and faces 60k+30 degrees; frame(k,u,w,y) is u metres
 // out from that edge's centre and w along it, positive towards post k+1.
 mesh(g,new T.CylinderGeometry(1.04,1.04,.14,6),deck,0,1.63,0).rotation.y=Math.PI/6;
 const frame=(k,u,w,y)=>{const a=(k*60+30)*Math.PI/180,r=.866+u;return [Math.cos(a)*r-Math.sin(a)*w,y,Math.sin(a)*r+Math.cos(a)*w];};
 // A point d metres to the side of curve c at t, on the same side convention as slide().
 const offsetAt=(c,t,d)=>{const p=c.getPointAt(t),v=c.getTangentAt(t);return p.addScaledVector(new T.Vector3(v.z,0,-v.x).normalize(),d).toArray();};
 const ring=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;ring.push([Math.cos(a),Math.sin(a)]);cyl(g,Math.cos(a),1.58,Math.sin(a),.065,3.16,posts);mesh(g,new T.SphereGeometry(.07,12,8),posts,Math.cos(a),3.17,Math.sin(a));}
 // Guard on edge 3 only. Edges 0, 1, 2, 4 and 5 are open for the S-slide, the
 // two-lane slide, the monkey bars, the stairs and the cage.
 for(const i of [3]){const a=ring[i],b=ring[(i+1)%6];rod(g,[a[0],2.83,a[1]],[b[0],2.83,b[1]],.04,steel);for(let k=1;k<8;k++){const t=k/8;rod(g,[T.MathUtils.lerp(a[0],b[0],t),1.72,T.MathUtils.lerp(a[1],b[1],t)],[T.MathUtils.lerp(a[0],b[0],t),2.8,T.MathUtils.lerp(a[1],b[1],t)],.017,steel);}}
 // Large S-slide out of edge 0 and the two-lane slide out of edge 1. Each leaves
 // square to its edge and fits between that edge's posts (inner faces at +-.435)
 // before it turns; the lanes are offset along the curve so they stay side by side.
 slide([frame(0,.03,0,1.7),frame(0,.3,0,1.64),[1.3,1.25,1.05],[1.25,.82,1.75],[.95,.48,2.45],[1.05,.2,3.15],[1.5,.11,3.55]],.76);
 const lanes=new T.CatmullRomCurve3([frame(1,.03,0,1.64),frame(1,.28,0,1.6),frame(1,.7,.35,1.3),frame(1,1.3,.9,.78),frame(1,2.05,1.35,.18),frame(1,2.35,1.45,.1)].map(v=>new T.Vector3(...v)));
 for(const d of [-.19,.19])slide(Array.from({length:16},(_,i)=>offsetAt(lanes,i/15,d)),.38);
 // Blue hoop over the S-slide entrance, springing from edge 0's two posts.
 tube([.5,.47,.3,0,-.3,-.47,-.5].map((w,i)=>frame(0,0,w,[2.25,2.55,2.72,2.77,2.72,2.55,2.25][i])),.105,blue);
 // Curved climbing cage on edge 5: bowed uprights with horizontal rungs.
 const arc=(t,w)=>frame(5,.03+Math.sin(t*Math.PI)*1.18,w,.12+t*2.75);
 for(const w of [-.39,-.13,.13,.39])tube(Array.from({length:21},(_,i)=>arc(i/20,w)),.032,steel);
 for(let i=0;i<11;i++){const t=i/10;rod(g,arc(t,-.39),arc(t,.39),.026,steel);}
 // Access stairs on edge 4, centred between its posts. Each handrail starts on top
 // of its newel post, runs up just outside the tread edge parallel to the pitch,
 // and ends in that side's platform post (ring 4 or 5).
 for(let i=0;i<8;i++){box(g,0,.12+i*.2,-2.36+i*.19,.8,.1,.25,deck);}
 for(const s of [-1,1]){const xx=s*.45;tube([[xx,.85,-2.41],[xx,1.71,-1.6],[xx,2.3,-1.05],[s*.5,2.45,-.866]],.033,steel);rod(g,[xx,0,-2.41],[xx,.85,-2.41],.03,steel);}
 // Curved overhead traverse bar, end posts and small stepping platforms.
 // User correction: this was one rail with rungs laid on a separate straight line,
 // so their far ends hung in the air, and a stepping disc with nothing under it.
 // Two rails .46 m apart leave square out of edge 2's opening, so the bars start
 // at the deck rather than at a guarded corner. A mounting bar between edge 2's
 // posts carries their deck ends, rungs span between them (the last between the
 // two end posts), and each disc stands on a post.
 const traverse=new T.CatmullRomCurve3([frame(2,0,0,1.85),frame(2,.45,0,1.86),[-2,1.84,.8],[-2.6,1.82,.75],[-3.1,1.8,.62]].map(v=>new T.Vector3(...v)));
 const railAt=(t,s)=>offsetAt(traverse,t,s*.23);
 for(const s of [-1,1]){tube(Array.from({length:25},(_,i)=>railAt(i/24,s)),.037,steel);const [px,py,pz]=railAt(1,s);cyl(g,px,py/2,pz,.06,py,posts);}
 rod(g,[ring[2][0],1.85,ring[2][1]],[ring[3][0],1.85,ring[3][1]],.03,steel);
 for(let i=1;i<=7;i++){const t=i/7;rod(g,railAt(t,-1),railAt(t,1),.023,steel);}
 cyl(g,-3.1,.32,.62,.3,.07,deck);
 cyl(g,.3,.32,1.85,.23,.07,deck);cyl(g,.3,.145,1.85,.07,.29,posts);
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

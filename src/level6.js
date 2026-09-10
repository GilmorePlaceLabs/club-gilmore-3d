import * as T from 'three';
import {buildPlayground} from './playground.js';
import {buildChangeRoom} from './changeRoom.js';
import {box,cyl,rod,mesh,makeGroup,shapeGeometry,sofa,chair,table,tree,mergeRoomGeometry,mats,canvasTexture} from './model.js';
// Trace coordinates correspond to the supplied overhead render at 1855 × 1344.
// Scale is illustrative: no measured Level 6 survey was supplied.
const U=.065;
const world=([x,z])=>[(x-910)*U,(z-670)*U];
const rect=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
const aerial='amenity-deck-aerial.jpg',terrace='bbq-firepit-terrace.jpg';
const site=n=>`site-${n}.jpg`;
const room=(id,name,polygon,photos,description,category='Outdoor',extra={})=>({id:`L6-${id}`,name,polygon,photos,description,category,kind:id,bookingUrl:null,...extra});
export const level6Rooms=[
 room('pool','Outdoor pool',rect(236,714,329,111),[site(4026),site(3983),site(3986),'outdoor-pool.jpg','outdoor-pool-sun-deck.jpg'],'Swim outdoors between the residential towers. The long rectangular pool has stone coping, stainless-steel entry rails and depth markings. Sun loungers line its north edge; the whole deck sits inside a glass safety enclosure.','Wellness'),
 room('hot-tub','Hot tub',rect(128,714,87,111),[site(3983),site(4026),'outdoor-pool-sun-deck.jpg','outdoor-pool.jpg'],'The separate hot tub sits at the west end of the pool, beside the daybeds and landscaped pool perimeter. The pool-deck photographs show its surrounding setting.','Wellness'),
 room('sun-deck','Pool sun deck',[[40,596],[265,596],[265,611],[465,611],[465,596],[660,596],[660,901],[40,901]],[site(4035),site(4026),site(4025),site(3983),'outdoor-pool-sun-deck.jpg','outdoor-pool.jpg'],'A paved pool terrace enclosed by a frameless glass safety fence on slim black posts, entered through a gated opening where the timber walkway meets the deck. The south and east strips hold timber-framed striped modular sectionals around teak coffee tables. Reclining loungers, rolled towels, two open slatted pergolas and circular daybeds remain along the north edge and the planted western edge.'),
 room('lounge','Outdoor fireplace & lounge',rect(695,280,215,358),[site(3990),site(3979),site(3978)],'A double-sided dark stone fireplace separates two intimate seating groups. Each side has two facing grey sofas with timber frames, a lounge chair and small round wooden tables. Four picnic tables and two planted islands flank the seating; paired grills sit at the ends of the terrace.','Social'),
 room('bocce','Bocce lawn',[[698,769],[909,769],[909,875],[772,972],[698,884]],[site(3980),site(3983),'bocce-court.jpg','bocce-court-and-pool.jpg'],'Two adjacent green bocce strips sit south of the lounge. Pale boundary lines, low concrete planter walls, timber benches and overhead string lights follow the actual court photographs.'),
 room('play','Children’s play area',[[1170,515],[1220,487],[1453,499],[1519,562],[1300,778],[1170,638]],['childrens-playground.jpg',site(3981),site(3982)],'A blue rubber play surface and adjoining tan climbing area are set into the eastern garden. A curved blue slide and adjacent double slide descend from a guarded hexagonal platform. A bowed climbing cage, access stairs and overhead traverse bar connect the play equipment. Linked grey, navy and orange pentagonal climbing pods occupy the tan surface.'),
 room('garden','Urban garden plots',[[1110,968],[1718,412],[1769,423],[1140,1012]],[site(3982),site(3981),aerial],'A long diagonal garden walk follows the eastern terrace edge, with repeated raised planting plots, flowering borders and a pergola. Your September aerial photographs show the long raised beds, flowering borders and tree spacing.'),
 room('fire','Fire pit terrace',[[1037,674],[1160,674],[1298,788],[1138,962],[1037,867]],[site(3989),site(3988),site(3980),site(3981),terrace],'Two groups of striped modular sofas sit around low grey fire bowls on the long paved terrace. A curved timber round table separates the lounges, with a second table beyond the far seating group. The playground-side edge has three connected open pergola bays, a long planted island, three timber dining tables with dark individual chairs, and two grills on the lounge-facing edge.','Social'),
 room('bbq-north','North terrace & playhouse',[[660,110],[858,38],[916,102],[932,244],[698,244],[698,278],[660,278]],[site(3985),site(3984),site(3978)],'A small timber playhouse with blue panels sits on a circular tan play surface set into green turf. The adjoining dark-clad stair pavilion has a gravel roof, two rooftop vents and a glazed bridge entrance. A picnic table sits beside the pavilion; pale paving and timber-look bands follow the actual terrace.','Social'),
 room('bbq-central','Bocce-side fireplace lounges',rect(690,653,225,113),[site(3992),site(3979),site(3983)],'Two dark stone fireplaces anchor the ends of this terrace beside the bocce lawn. Each lounge has facing grey sofas, two striped armchairs and a low white round table. A dark slatted dining table and six striped chairs sit between the lounges.','Social'),
 room('bbq-east','East BBQ terrace',rect(1038,274,122,390),[site(4007),site(4042),'stairs-aerial.jpg',site(3996),site(3981),site(3978),terrace],'A broad wood-look tiled walkway connects the north pavilion to the eastern terrace. A dark taupe emergency-stair enclosure follows the east side of the light well, with two solid push-bar doors, small canopies, wall sconces and roof service pipes. A timber picnic table sits in its paved forecourt. The nearby three-bay pergola has timber dining tables and individual chairs.','Social'),
 room('bbq-south','South garden & round tables',[[660,891],[696,891],[911,1114],[777,1227],[665,1260],[639,1244],[639,987]],[site(3980),site(3986),aerial],'An angled walkway separates planted garden wedges at the southern tip. A slatted pergola shelters two round timber tables with curved seating beside the bocce lawn, with a small fire pit seating area near the end.','Social'),
 room('change','Pool change rooms',[[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]],[site(4029),site(4034),site(4028),aerial],'The change-room block opens onto the north side of the sun deck below Tower 2. Its dark stone south elevation carries three stainless outdoor shower columns, a life ring, a bottle filler and a canopied storage door either side of the recessed entry. Inside are timber change cubicles down the west wall, an accessible shower and washroom, a row of washroom stalls, enclosed individual showers, open standing showers, a three-basin vanity and a steam room.','Wellness'),
];
export const level6Labels=['pool','hot-tub','lounge','bocce','play','garden','fire','bbq-north','bbq-south','change'].map(id=>`L6-${id}`);
export function createLevel6Model(){
 const root=new T.Group();root.name='Club Gilmore — Level 6';root.userData={level:6,units:'metres',scale:'Approximate; traced from undimensioned supplied render',source:'User floor plan, overhead render and actual amenity photos'};
 const props=new T.Group();root.add(props);
 const roomGroups=new Map(),floorMeshes=[],wallGroups=[],columnGroups=[];
 const M=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
 const stone=M('#cbc9c0'),wood=M('#b79a82'),soil=M('#464735'),grass=mats.turf,metal=M('#3b4243'),blue=M('#2787a5'),rubber=M('#527f89'),tan=M('#a78765');
 const gravel=M('#a9aaa6');gravel.map=canvasTexture((c,n)=>{c.fillStyle='#919590';c.fillRect(0,0,n,n);let seed=83;for(let i=0;i<22000;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%n;seed=(seed*1664525+1013904223)>>>0;const y=seed%n;c.fillStyle=['#dadbd5','#575d58','#bfc2bc'][i%3];c.fillRect(x,y,2,2);}});
 const stripe=M('#d0d0c8');stripe.map=canvasTexture((c,n)=>{c.fillStyle='#d4d4cb';c.fillRect(0,0,n,n);for(let x=0;x<n;x+=24){c.fillStyle='#626a6d';c.fillRect(x,0,11,n);c.fillStyle='#9dabae';c.fillRect(x+13,0,3,n);}});mats.l6stripe=stripe;
 const flower=M('#d5ac25'),lavender=M('#a19aa7');
 const water=new T.MeshStandardMaterial({color:'#68c3d0',roughness:.19,metalness:.2,map:canvasTexture((c,s)=>{c.fillStyle='#8ddae0';c.fillRect(0,0,s,s);for(let i=0;i<180;i++){c.strokeStyle='rgba(255,255,255,.22)';c.beginPath();const x=(i*79)%s,y=(i*137)%s;c.ellipse(x,y,18,8,i,0,7);c.stroke();}})});
 const surface=(poly,material,y=0,depth=0,parent=props)=>{const o=new T.Mesh(shapeGeometry(poly.map(world),depth),material);o.position.y=y;o.receiveShadow=true;parent.add(o);return o;};
 const B=(x,z,w,d,h,material=stone,y=0,parent=props)=>{const [a,b]=world([x,z]);return box(parent,a,y+h/2,b,w*U,h,d*U,material);};
 const line=(a,b,height=.6,material=stone,width=.16,y=0)=>{const [x,z]=world(a),[xx,zz]=world(b),length=Math.hypot(xx-x,zz-z);return box(props,(x+xx)/2,y+height/2,(z+zz)/2,length,height,width,material,-Math.atan2(zz-z,xx-x));};
 const edge=(poly,h=.35,material=stone)=>poly.forEach((p,i)=>line(p,poly[(i+1)%poly.length],h,material));
 const slab=poly=>{surface(poly,stone,-.38,.36);edge(poly,.23);};
 // The two long rectangular gaps remain open, connected only by the two bridges.
 const northSlab=[[590,55],[858,30],[930,103],[936,227],[1080,227],[1080,222],[1221,222],[1221,274],[933,274],[933,275],[660,275],[660,110],[590,94]];
 surface(northSlab,stone,-.38,.36);
 // No curb across the open connection from the bridge into the BBQ terrace.
 for(let i=0;i<northSlab.length;i++){
  const a=northSlab[i],b=northSlab[(i+1)%northSlab.length];
  if(a[1]===274&&b[1]===274){line([933,274],[1037,274],.23);continue;}
  line(a,b,.23);
 }
 slab(rect(933,638,104,35));
 slab([[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]]);
 // Individual slabs avoid filling the central light wells with a single polygon.
 surface(rect(40,596,620,305),stone,-.36,.34);
 surface([[660,275],[932,275],[932,1128],[691,1312],[636,1265],[636,901],[660,901]],stone,-.36,.34);
 surface([[1037,259],[1193,259],[1193,471],[1352,471],[1352,488],[1539,488],[1539,470],[1619,470],[1648,444],[1706,444],[1728,425],[1728,371],[1780,423],[1140,1012],[1037,867]],stone,-.36,.34);
 // Fine paving modules and warm timber circulation bands.
 surface(rect(663,239,270,35),mats.woodfloor,.01);
 // IMG_3996: wood-look rectangular pavers span the full bridge and terrace landing.
 surface([[933,228],[1080,228],[1080,223],[1221,223],[1221,274],[933,274]],wood,.012);
 for(let x=934;x<1221;x+=15)for(let z=224;z<274;z+=8){
  const left=x,right=Math.min(x+14.7,1220),top=Math.max(z,x<1080?228:223),bottom=Math.min(z+7.7,273.8);
  if(bottom>top)surface(rect(left,top,right-left,bottom-top),mats.woodfloor,.025);
 }
 // Narrow metal threshold at the pavilion doorway.
 B(936,251,1.7,45,.035,mats.metal,.035);surface(rect(660,637,377,36),wood,.015);
 surface([[660,672],[697,672],[697,882],[911,1113],[883,1134],[660,893]],wood,.015);
 surface([[1120,975],[1735,416],[1750,430],[1135,995]],wood,.02);
 for(const r of level6Rooms){const group=new T.Group();group.name=r.name;group.userData={roomId:r.id,level:6,description:r.description};root.add(group);
 // The bocce selection polygon extends into the irregular south garden. Keep
 // its pickable underlay neutral; the exact lawn polygons are drawn below.
 const floorMaterial=(r.kind==='bocce'?stone:mats.tilefloor).clone();
 const poly=r.polygon.map(world),floor=surface(r.polygon,floorMaterial,r.kind==='sun-deck'?.025:.045,0,group);floor.userData.roomId=r.id;floorMeshes.push(floor);
 const outline=new T.Line(new T.BufferGeometry().setFromPoints([...poly,poly[0]].map(([x,z])=>new T.Vector3(x,.12,z))),new T.LineBasicMaterial({color:'#d1b674',depthTest:false}));outline.visible=false;outline.renderOrder=5;group.add(outline);
 const center=new T.Box3().setFromPoints(poly.map(([x,z])=>new T.Vector3(x,0,z))).getCenter(new T.Vector3());roomGroups.set(r.id,{group,floor,outline,center,poly});}
 for(let z=315;z<600;z+=48){surface(rect(733,z,174,23),mats.circulation,.06);surface(rect(1038,z,105,23),mats.circulation,.06);}
 // Pools, inset water, coping, stair treads and stainless-steel ladders.
 for(const [x,z,w,d] of [[242,724,312,90],[137,724,69,90]]){B(x+w/2,z+d/2,w+9,d+9,.16,mats.pooltile);B(x+w/2,z+d/2,w,d,.18,water);for(let i=0;i<4;i++)B(x+w-4-i*3,z+d/2,3,d-8,.2+i*.035,mats.pooltile);for(const zz of [z+9,z+d-9]){const [a,b]=world([x+w-9,zz]);for(const off of [-.35,.35]){rod(props,[a-.5,.16,b+off],[a-.5,.95,b+off],.035);rod(props,[a-.5,.95,b+off],[a+.55,.95,b+off],.035);rod(props,[a+.55,.95,b+off],[a+.55,.15,b+off],.035);}}}
 const lounger=(x,z,rot=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot);box(g,0,.28,0,.73,.12,1.9,'oak');box(g,0,.39,.24,.65,.14,1.3,'linen');const back=box(g,0,.68,-.64,.65,.13,.8,'linen');back.rotation.x=.68;for(const xx of [-.28,.28])for(const zz of [-.7,.7])box(g,xx,.14,zz,.055,.28,.06,'oak');cyl(g,0,.52,.7,.12,.55,'white').rotation.z=Math.PI/2;};
 for(let x=270;x<560;x+=21){lounger(x,699);}for(const x of [278,294,373,389,468,484,550,566])lounger(x,852,Math.PI);for(const x of [145,170,207,230]){lounger(x,698);lounger(x,852,Math.PI);}for(let x=250;x<560;x+=20)if(x<267||x>465)lounger(x,639);
 // IMG_4026/4035: the south and east deck strips are timber-framed striped
 // modular sectionals around teak coffee tables, not rows of sun loungers.
 // Sun loungers remain on the pool's north edge, as those photographs show.
 const teak=M('#96693f',.75);
 const deckSofa=(parent,x,z,rotation=0,modules=4)=>{
  const g=makeGroup(parent,x,z,rotation),width=modules*.78;g.name='Striped modular pool sofa';
  box(g,0,.21,0,width,.42,.95,teak);
  for(let i=0;i<6;i++){box(g,0,.09+i*.062,.478,width,.036,.02,'walnut');box(g,0,.09+i*.062,-.478,width,.036,.02,'walnut');}
  for(let i=0;i<modules;i++){
   const xx=(i-(modules-1)/2)*.78;
   box(g,xx,.52,.06,.71,.2,.74,stripe);
   const back=box(g,xx,.79,-.29,.72,.5,.16,stripe);back.rotation.x=-.1;
  }
  for(const side of [-1,1]){box(g,side*(width/2+.1),.39,0,.2,.78,.95,teak);
   for(let i=0;i<6;i++)box(g,side*(width/2+.205),.09+i*.062,0,.02,.036,.95,'walnut');}
 };
 const deckTable=(parent,x,z)=>{const g=makeGroup(parent,x,z);g.name='Teak coffee table';box(g,0,.42,0,1.55,.08,.8,teak);for(const xx of [-.64,.64])for(const zz of [-.31,.31])box(g,xx,.21,zz,.06,.42,.06,'walnut');};
 // Site aerial: four large sofas and two tables only — no single modules — and
 // the sofas are turned 90° so their length runs across the deck toward the pool.
 const deckPair=(x,z)=>{
  const [a,b]=world([x,z]),g=makeGroup(props,a,b,0);g.name='Pool deck lounge pair';
  deckSofa(g,0,-1.6,0,4);deckTable(g,0,0);deckSofa(g,0,1.6,Math.PI,4);
 };
 deckPair(610,700);deckPair(610,800);
 // IMG_4025/4026: a frameless glass safety fence encloses the pool deck along
 // the timber walkway, gated where that walkway meets the deck. Only this east
 // run is photographed; the remaining enclosure edges are not yet evidenced.
 const fencePost=M('#2f3438',.5);
 const fenceGlass=new T.MeshStandardMaterial({color:'#b9cdd2',roughness:.12,metalness:.05,transparent:true,opacity:.4,depthWrite:false});
 const poolFence=(a,b)=>{
  const n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/24));
  const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  for(let i=0;i<n;i++)line(at(i/n),at((i+1)/n),1.72,fenceGlass,.022,.1);
  for(let i=0;i<=n;i++){const [x,z]=at(i/n);B(x,z,1.5,1.5,1.86,fencePost);for(const y of [.3,.92,1.54])B(x,z,3.4,3.4,.11,fencePost,y);}
 };
 // The deck's north edge was an open slab edge and left the fence dead-ending
 // at a lone post. The aerial shows a solid concrete parapet there; closing it
 // also lands the glass run on a real corner.
 const parapet=M('#c9c6bd',.85);
 for(const [a,b] of [[[40,596],[265,596]],[[465,596],[660,596]]]){line(a,b,1.15,parapet,.34);line(a,b,.08,stone,.44,1.15);}
 poolFence([660,596],[660,644]);poolFence([660,668],[660,836]);poolFence([660,860],[660,901]);poolFence([660,901],[636,901]);
 const poolGate=z=>{
  const g=makeGroup(props,...world([660,z]),Math.PI/2);g.name='Pool enclosure gate';
  for(const side of [-1,1])box(g,side*.55,.95,0,.1,1.9,.1,fencePost);
  for(const y of [.14,1.8])box(g,0,y,0,1.1,.1,.1,fencePost);
  box(g,0,.97,0,1.02,1.56,.024,fenceGlass);
  cyl(g,.36,1,.08,.022,1.12,'metal');
 };
 poolGate(656);poolGate(848);
 const pergola=(x,z,w,d,rot=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot);for(const xx of [-1,1])for(const zz of [-1,1])box(g,xx*w*U/2,1.45,zz*d*U/2,.16,2.9,.16,metal);for(const zz of [-1,1])box(g,0,2.91,zz*d*U/2,w*U+.22,.2,.18,metal);for(let xx=-w*U/2;xx<=w*U/2;xx+=.23)box(g,xx,3.02,0,.085,.14,d*U+.25,metal);};
 pergola(209,641,106,42);pergola(520,641,98,42);pergola(1600,505,50,48,-.76);
 for(const z of [703,759,814]){const [a,b]=world([89,z]);cyl(props,a,.24,b,.85,.38,'oak');cyl(props,a,.47,b,.76,.17,'ivory');const canopy=new T.Mesh(new T.SphereGeometry(.88,16,10,0,Math.PI),mats.linen);canopy.position.set(a,.66,b);canopy.rotation.y=-Math.PI/2;props.add(canopy);}
 const planter=(poly,trees=true)=>{surface(poly,stone,.06,.58);surface(poly,soil,.66);const bounds=new T.Box2().setFromPoints(poly.map(p=>new T.Vector2(...p)));for(let x=bounds.min.x+10;x<bounds.max.x-4;x+=26)for(let z=bounds.min.y+10;z<bounds.max.y-4;z+=26){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [a,b]=poly[i],[c,d]=poly[j];if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)inside=!inside;}if(inside){const [a,b]=world([x,z]);if(trees){tree(props,a,b,0,.7+((x+z)%13)/32);for(let k=0;k<7;k++)mesh(props,new T.IcosahedronGeometry(.18,0),k%5?flower:lavender,a+Math.sin(k*2.4)*.6,.74,b+Math.cos(k*2.4)*.6,1,.6,1);}else{for(let k=0;k<3;k++)mesh(props,new T.IcosahedronGeometry(.32,0),k%2?'leaf':'leaflight',a+k*.2,.8,b,.8,.7,.8);}}}};
 for(const p of [rect(40,596,25,304),rect(65,879,570,22),rect(699,280,208,32),rect(699,600,208,34),rect(699,357,32,201),rect(795,353,28,51),rect(795,510,28,51),rect(699,733,208,36),rect(643,283,14,305),rect(1143,287,35,210),[[1168,501],[1220,481],[1491,500],[1440,535],[1212,562]]])planter(p);
 // Exact southern lawn and planter outlines traced from the authoritative
 // overhead. The neutral room-selection underlay remains available for picking,
 // while only these polygons receive grass.
 surface(rect(698,769,210,64),grass,.08);
 const southBocceLawn=[[698,834],[908,834],[908,856],[851,906],[871,928],[833,960],[784,908],[748,937],[698,881]];
 const southWestLawn=[[698,936],[698,1140],[772.4,1217.2],[881.1,1134.2]];
 surface(southBocceLawn,grass,.08);surface(southWestLawn,grass,.08);
 // A single 1.5-trace (about 0.10 m) pale divider follows the lawn's straight
 // shared edge with the timber walk. That edge is held parallel to the walk's
 // southwest side, so the pale margin stays one divider wide over its whole run.
 // The lawn's southeast edge is likewise held parallel to the slab edge
 // (932,1128)-(691,1312), 26 trace units in, matching the floor plan's wedge.
 line([698,936],[881.1,1134.2],.025,stone,.0975,.12);
 // IMG_3991: the open-turf tree planter is a true square whose sides run parallel
 // and square to the timber walk, not the lopsided quadrilateral traced before.
 const southBeds=[
  [[752,939],[784,912],[833,970],[802,997]],
  [[854,906],[908,857],[908,921],[870,929]],
  [[821,1034],[908,1019],[908,1115]],
  [[776.5,1024.2],[806.3,1056.5],[774,1086.3],[744.2,1054]],
  [[637,958],[651,960],[651,1243],[665,1260],[639,1244]]
 ];
 const insidePolygon=(x,z,poly)=>{let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const [ax,az]=poly[i],[bx,bz]=poly[j];
  if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;
 }return inside;};
 const southTreeAnchors=[
  [[792,963]],[[890,893]],[[875,1067]],[[777,1055]],
  [[644,995],[644,1072],[645,1150],[650,1225]]
 ];
 const southPlanter=(poly,treesAt=[])=>{
  surface(poly,stone,.06,.58);surface(poly,soil,.66);
  for(let i=0;i<poly.length;i++)line(poly[i],poly[(i+1)%poly.length],.2,stone,.18,.59);
  const bounds=new T.Box2().setFromPoints(poly.map(p=>new T.Vector2(...p)));
  const narrow=bounds.max.x-bounds.min.x<20,stepX=narrow?5:9,stepZ=narrow?12:9;
  for(let x=bounds.min.x+3;x<bounds.max.x-2;x+=stepX)for(let z=bounds.min.y+3;z<bounds.max.y-2;z+=stepZ)if(insidePolygon(x,z,poly)){
   const jitter=Math.sin(x*1.73+z*.91),[wx,wz]=world([x+jitter*1.2,z+Math.cos(x*.47-z)*1.2]);
   const material=(Math.round(x+z)%5===0)?flower:(Math.round(x*2+z)%7===0)?lavender:(Math.round(x+z)%2?'leaflight':'leaf');
   mesh(props,new T.IcosahedronGeometry(.13+(Math.abs(jitter)*.05),0),material,wx,.79+(Math.abs(jitter)*.06),wz,.9,.65,.9);
  }
  for(const [x,z] of treesAt){const [wx,wz]=world([x,z]);tree(props,wx,wz,0,.62);}
 };
 southBeds.forEach((bed,i)=>southPlanter(bed,southTreeAnchors[i]));
 // IMG_3991: the second user-marked object is a single black post light in
 // open turf, not another raised planter. Its shallow cap carries a downlight.
 {
  const [x,z]=world([706,1062]);
  cyl(props,x,1.32,z,.055,2.64,'black');
  box(props,x,2.67,z,.64,.1,.2,'black');
  box(props,x+.2,2.605,z,.16,.03,.12,'ivory');
 }
 // Repaint the existing diagonal route above the new lawn layers; no planting
 // sits on this circulation band.
 surface([[660,672],[697,672],[697,882],[911,1113],[883,1134],[660,893]],wood,.11);
 // The east-edge shelter is a clipped quadrilateral in the overhead. Every
 // rafter is clipped to the perimeter beams, and two crossbeams divide three
 // supported bays; no roof member stops in mid-air.
 const southPergola=[[802,1000],[908,921],[908,1019],[820,1034]];
 surface(southPergola,mats.tilefloor,.125);
 for(let i=0;i<4;i++)line(southPergola[i],southPergola[(i+1)%4],.18,metal,.18,2.82);
 const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
 const pergolaSupports=[...southPergola];
 for(const t of [1/3,2/3]){
  const a=lerp(southPergola[0],southPergola[1],t),b=lerp(southPergola[3],southPergola[2],t);
  line(a,b,.14,metal,.14,2.91);pergolaSupports.push(a,b);
 }
 for(const [x,z] of pergolaSupports){const [wx,wz]=world([x,z]);box(props,wx,1.45,wz,.16,2.9,.16,metal);}
 const rafterLength=Math.hypot(106,79),rafterDirection=[106/rafterLength,-79/rafterLength];
 const rafterNormal=[-rafterDirection[1],rafterDirection[0]];
 const projection=(p,axis)=>p[0]*axis[0]+p[1]*axis[1];
 const normalRange=southPergola.map(p=>projection(p,rafterNormal));
 for(let offset=Math.min(...normalRange)+2;offset<Math.max(...normalRange)-1;offset+=4){
  const hits=[];
  for(let i=0;i<southPergola.length;i++){
   const a=southPergola[i],b=southPergola[(i+1)%southPergola.length];
   const an=projection(a,rafterNormal),bn=projection(b,rafterNormal);
   if(Math.abs(bn-an)<1e-6||offset<Math.min(an,bn)-1e-6||offset>Math.max(an,bn)+1e-6)continue;
   const t=(offset-an)/(bn-an);
   if(t>=-1e-6&&t<=1+1e-6){const point=lerp(a,b,t),along=projection(point,rafterDirection);if(!hits.some(h=>Math.abs(h.along-along)<.01))hits.push({point,along});}
  }
  hits.sort((a,b)=>a.along-b.along);
  if(hits.length>1)line(hits[0].point,hits[hits.length-1].point,.075,metal,.075,2.99);
 }
 for(let i=0;i<23;i++){const x=1155+i*24,z=963-i*22;planter([[x,z],[x+18,z-17],[x+30,z-4],[x+12,z+13]],false);if(i%3===0){const [a,b]=world([x+10,z+2]);tree(props,a,b,0,1);}}
 const picnic=(x,z,rot=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot);box(g,0,.78,0,2.4,.09,.95,'oak');for(const xx of [-.8,.8])box(g,xx,.38,0,.18,.72,.65,metal);for(const zz of [-.8,.8]){box(g,0,.46,zz,2.5,.12,.35,'oak');for(const xx of [-.8,.8])box(g,xx,.23,zz,.1,.45,.28,metal);}};
 picnic(880,115,Math.PI/2);picnic(1600,505,-.76);
 // IMG_4010/4036/4037: the appliances are freestanding stainless carts on casters
 // standing against the front face of a monolithic dark stone counter, not units
 // dropped into it. The counter top is the same dark stone, not a pale slab.
 // The lounge terrace's two stations carry a pair of carts on a longer counter;
 // the east pergola bays keep the single cart their overhead close-up shows.
 const counterStone=M('#4a4e51',.6);
 const bbqUnit=(g,x)=>{
  box(g,x,.5,.62,1.02,1,.62,'metal');
  box(g,x,1.16,.62,1.06,.32,.66,'metal');
  cyl(g,x,1.32,.6,.28,1.06,'metal').rotation.z=Math.PI/2;
  box(g,x,1.07,.95,1.06,.16,.04,'black');
  for(let i=0;i<4;i++)cyl(g,x+(i-1.5)*.2,1.07,.99,.03,.05,'metal').rotation.x=Math.PI/2;
  for(const sx of [-1,1])rod(g,[x+sx*.6,1.02,.36],[x+sx*.6,1.02,.88],.03,'metal');
  for(const sx of [-1,1])for(const sz of [-1,1])cyl(g,x+sx*.42,.05,.62+sz*.22,.055,.1,'black');
 };
 const grill=(x,z,rot=0,units=1)=>{
  const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot),len=units>1?4.4:2.7;
  g.name=units>1?'BBQ counter with two grills':'BBQ counter with grill';
  box(g,0,.48,0,len,.94,.76,metal);box(g,0,.97,0,len+.1,.08,.83,counterStone);
  for(let i=0;i<units;i++)bbqUnit(g,(i-(units-1)/2)*2.3);
 };

 grill(820,327,0,2);grill(820,588,Math.PI,2);
 const fire=(x,z,round=true)=>{const [a,b]=world([x,z]);if(round){cyl(props,a,.3,b,.79,.55,'stone');cyl(props,a,.59,b,.53,.025,'black');}else{box(props,a,.28,b,.75,.5,2.1,'stone');box(props,a,.54,b,.4,.03,1.7,'black');}for(let i=0;i<7;i++){const flame=new T.Mesh(new T.ConeGeometry(.07,.18+(i%3)*.06,5),new T.MeshStandardMaterial({color:'#f2bd66',emissive:'#cc651d',emissiveIntensity:.6}));flame.position.set(a+(round?Math.sin(i)*.3:0),.66,b+(round?Math.cos(i)*.3:(i-3)*.2));props.add(flame);}};
 const seat=(x,z,r=0,size=2.25)=>{const [a,b]=world([x,z]);sofa(props,a,b,r,'blue',size);};
 // Four picnic tables flank two tree planters and the double-sided fireplace.
 for(const x of [751,858])for(const z of [378,536])picnic(x,z,Math.PI/2);
 // IMG_3990: the fireplace spans the terrace's long axis; the two lounges
 // sit toward the tower-side planter and the bridge-side edge, not at its ends.
 const centralStone=M('#3b3d3e',.62),centralFabric=M('#a4afb2');
 const [fx,fz]=world([809,458]);
 const fireplace=makeGroup(props,fx,fz);fireplace.name='Double-sided stone fireplace';
 const width=1.5,length=3.12,height=1.65;
 // Recessed openings on both x faces, with a shared mantle and end piers.
 box(fireplace,0,.19,0,width,.38,length,centralStone);
 box(fireplace,0,1.2,0,width,.9,length,centralStone);
 for(const end of [-1,1])box(fireplace,0,.56,end*1.25,width,.38,.62,centralStone);
 box(fireplace,0,.56,0,.28,.38,1.88,'black');
 for(const side of [-1,1]){
  box(fireplace,side*.55,.4,0,.42,.045,1.87,'metal');
  for(let i=0;i<10;i++)mesh(fireplace,new T.IcosahedronGeometry(.045,0),'stone',side*.53,.45,(i-4.5)*.17);
  box(fireplace,side*.76,.57,0,.025,.34,1.84,mats.glass);
  for(const y of [.3,.85,1.28])rod(fireplace,[side*.754,y,-1.54],[side*.754,y+.04,1.54],.004,'stone');
 }
 const centralSofa=(x,z,rotation)=>{
  const [a,b]=world([x,z]),g=makeGroup(props,a,b,rotation);g.name='Timber-framed grey lounge sofa';
  box(g,0,.29,0,2.26,.18,.88,'walnut');box(g,0,.72,-.37,2.24,.82,.12,'oak');
  for(const side of [-1,1]){box(g,side*1.08,.57,0,.1,.12,.9,'oak');for(const zz of [-.3,.3])box(g,side*.96,.15,zz,.07,.3,.07,'walnut');}
  for(const xx of [-.52,.52]){box(g,xx,.47,.035,.99,.2,.68,centralFabric);const back=box(g,xx,.78,-.23,.99,.55,.16,centralFabric);back.rotation.x=-.12;}
 };
 const centralChair=(x,z,rotation)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rotation);box(g,0,.29,0,.78,.16,.82,'walnut');box(g,0,.45,.02,.73,.18,.7,centralFabric);box(g,0,.73,-.3,.76,.52,.14,centralFabric);for(const xx of [-.34,.34])for(const zz of [-.3,.3])box(g,xx,.14,zz,.055,.28,.055,'walnut');};
 const sideTable=(x,z,r=.36,h=.4)=>{const [a,b]=world([x,z]);mesh(props,new T.CylinderGeometry(r,r,h,40),'walnut',a,h/2+.05,b);mesh(props,new T.CylinderGeometry(r+.025,r+.025,.045,40),'oak',a,h+.072,b);};
 for(const [cx,direction] of [[775,-1],[843,1]]){
  centralSofa(cx,441,0);centralSofa(cx,475,Math.PI);
  centralChair(cx+direction*25,458,direction<0?Math.PI/2:-Math.PI/2);
  sideTable(cx-direction*11,454,.39,.42);sideTable(cx,461,.33,.35);sideTable(cx+direction*11,454,.37,.39);
 }

 // IMG_3992: two fireplace lounges and a central dining group.
 const loungeGrey=M('#9da4a4'),fireStone=M('#343b40',.55);
 const armchair=(x,z,rotation=0)=>{
  const [a,b]=world([x,z]),g=makeGroup(props,a,b,rotation);
  g.name='Striped outdoor armchair';
  box(g,0,.35,0,.79,.1,.78,metal);box(g,0,.48,.025,.72,.2,.68,stripe);
  const back=box(g,0,.81,-.31,.73,.61,.15,stripe);back.rotation.x=-.1;
  for(const side of [-1,1]){box(g,side*.43,.65,0,.07,.08,.82,metal);for(const zz of [-.31,.31])box(g,side*.38,.29,zz,.045,.58,.045,metal);}
 };
 for(const [wallX,cx,direction] of [[703,738,1],[902,866,-1]]){
  B(wallX,704,12,64,2.15,fireStone);
  B(wallX+direction*6.1,704,.4,36,.54,mats.black,.42);
  B(wallX+direction*6.4,704,1.2,37,.07,mats.metal,.4);
  for(let i=0;i<8;i++)B(wallX+direction*6.5,690+i*4,1.4,1.5,.045,mats.stone,.49);
  for(const [z,rotation] of [[681,0],[727,Math.PI]]){
   const [a,b]=world([cx,z]);
   // Grey outdoor sofa with charcoal frame and loose back cushions.
   const g=makeGroup(props,a,b,rotation);box(g,0,.25,0,2.55,.18,.9,metal);
   box(g,0,.7,-.37,2.58,.8,.16,metal);
   for(const side of [-1,1])box(g,side*1.25,.51,0,.12,.6,.9,metal);
   for(let i=0;i<3;i++){box(g,(i-1)*.79,.46,.04,.76,.24,.71,loungeGrey);const cushion=box(g,(i-1)*.79,.82,-.24,.75,.55,.16,loungeGrey);cushion.rotation.x=-.13;}
   for(const xx of [-1.08,1.08])for(const zz of [-.3,.3])box(g,xx,.12,zz,.055,.24,.055,metal);
  }
  const [a,b]=world([cx,704]);mesh(props,new T.CylinderGeometry(.53,.46,.38,48),'white',a,.29,b);mesh(props,new T.CylinderGeometry(.61,.61,.07,48),'white',a,.5,b);
  const chairX=cx+direction*28;
  for(const z of [693,715])armchair(chairX,z,direction>0?-Math.PI/2:Math.PI/2);
 }
 const [dx,dz]=world([802,704]),dining=makeGroup(props,dx,dz);dining.name='Central six-seat slatted dining table';
 box(dining,0,.77,0,2.35,.08,1.32,metal);
 for(let x=-1.1;x<1.16;x+=.12)box(dining,x,.817,0,.075,.016,1.28,fireStone);
 for(const x of [-1.02,1.02])for(const z of [-.52,.52])box(dining,x,.38,z,.055,.76,.055,metal);
 for(const x of [787,802,817]){armchair(x,681,0);armchair(x,727,Math.PI);}

 // IMG_3989: this terrace is a run of individually framed striped sofas,
 // not boxed-in banquettes. The pale/charcoal paving bands stop at the
 // planted and glazed edge, while the adjacent pergola remains in place.
 const firePale=mats.tilefloor.clone(),fireCharcoal=mats.tilefloor.clone(),fireFrame=M('#30383b');
 firePale.color.set('#d6d4cc');fireCharcoal.color.set('#777b79');
 const fireTerrace=[[1039,676],[1158,676],[1294,788],[1138,958],[1039,866]];
 surface(fireTerrace,firePale,.065);
 surface([[1039,718],[1177,718],[1207,748],[1187,772],[1039,772]],fireCharcoal,.075);
 surface([[1039,811],[1171,811],[1143,858],[1039,858]],fireCharcoal,.075);
 const fireBowl=(x,z)=>{
  const [a,b]=world([x,z]);
  cyl(props,a,.28,b,.74,.5,'stone');cyl(props,a,.555,b,.56,.035,'black');
  for(let i=0;i<12;i++)mesh(props,new T.IcosahedronGeometry(.055,0),'black',a+Math.sin(i*2.4)*.3,.59,b+Math.cos(i*2.4)*.3,.72,.48,.72);
 };
 const terraceSofa=(x,z,rotation=0)=>{
  const [a,b]=world([x,z]),g=makeGroup(props,a,b,rotation);g.name='Striped modular fire-pit sofa';
  box(g,0,.2,0,2.23,.16,.92,fireFrame);
  for(const xx of [-.68,0,.68]){
   box(g,xx,.42,.04,.62,.24,.74,stripe);
   const back=box(g,xx,.74,-.34,.63,.58,.15,stripe);back.rotation.x=-.1;
  }
  for(const side of [-1,1]){box(g,side*1.04,.49,0,.1,.56,.92,fireFrame);for(const zz of [-.32,.32])box(g,side*.95,.12,zz,.055,.24,.055,fireFrame);}
 };
 const fireSideTable=(x,z)=>{const [a,b]=world([x,z]);cyl(props,a,.36,b,.29,.43,fireFrame);cyl(props,a,.45,b,.39,.045,'black');};
 const fireLounge=(x,z)=>{
  fireBowl(x,z);
  // The offset modules retain the open corners visible in the aerial.
  for(const [dx,dz,r] of [[0,-22,0],[-25,0,Math.PI/2],[25,0,-Math.PI/2],[0,22,Math.PI]])terraceSofa(x+dx,z+dz,r);
  fireSideTable(x-25,z-27);fireSideTable(x+25,z+27);
 };
 fireLounge(1086,712);fireLounge(1090,850);
 const roundTable=(x,z)=>{const [a,b]=world([x,z]);cyl(props,a,.76,b,.78,.09,'oak');cyl(props,a,.37,b,.13,.7,metal);for(let i=0;i<3;i++){const arc=new T.Mesh(new T.TorusGeometry(1.04,.16,4,24,1.7),mats.oak);arc.rotation.x=-Math.PI/2;arc.rotation.z=i*2.094;arc.scale.z=.4;arc.position.set(a,.43,b);props.add(arc);}};
 // One table bridges the two lounges; the second sits just beyond the far group.
 for(const [x,z] of [[1086,780],[1142,925]])roundTable(x,z);
 // IMG_4021: this pergola shelters three round dining tables, each with four
 // individual black chairs — teak tops on pale pedestals, not the curved-bench
 // picnic tables that belong on the fire-pit terrace. Placed on the bay axis.
 const cafeTable=(x,z)=>{
  const [a,b]=world([x,z]),g=makeGroup(props,a,b,.64);g.name='Round dining table and four chairs';
  cyl(g,0,.735,0,.46,.05,'oak');cyl(g,0,.765,0,.09,.02,'white');
  cyl(g,0,.36,0,.1,.7,'ivory');cyl(g,0,.045,0,.27,.09,'ivory');
  for(let i=0;i<4;i++){const t=i*Math.PI/2;chair(g,Math.sin(t)*.95,Math.cos(t)*.95,t+Math.PI,'black');}
 };
 for(const [x,z] of [[831.4,1014.4],[859.5,993.5],[887.6,972.6]])cafeTable(x,z);

 // User's overhead close-up: three lengthwise dining tables, each with its own
 // grill against the planted (east) edge. Table axes follow the three-bay run.
 for(const z of [331,392,453]){
  pergola(1086,z,80,58);
  const [tx,tz]=world([1074,z]),dining=makeGroup(props,tx,tz,Math.PI/2);
  dining.name='Pergola dining table and eight chairs';
  box(dining,0,.78,0,2.15,.09,.96,'oak');
  for(const xx of [-.76,.76])box(dining,xx,.38,0,.09,.72,.72,metal);
  for(let xx=-.98;xx<1.06;xx+=.18)box(dining,xx,.831,0,.012,.005,.94,'walnut');
  for(const xx of [-.7,0,.7]){chair(dining,xx,-.83,0,'linen');chair(dining,xx,.83,Math.PI,'linen');}
  chair(dining,-1.4,0,Math.PI/2,'linen');chair(dining,1.4,0,-Math.PI/2,'linen');
  grill(1120,z,-Math.PI/2);
 }
 // Authoritative overhead trace: the three connected bays run southeast along
 // the diagonal garden edge. The planted island is the clipped quadrilateral
 // between the pergola and the protected fire-pit seating.
 const pergolaCenter=[1208,769],pergolaAngle=-.79;
 const pergolaAt=(u,v=0)=>[pergolaCenter[0]+Math.cos(pergolaAngle)*u+Math.sin(pergolaAngle)*v,pergolaCenter[1]-Math.sin(pergolaAngle)*u+Math.cos(pergolaAngle)*v];
 const [pgx,pgz]=world(pergolaCenter),playPergola=makeGroup(props,pgx,pgz,pergolaAngle);playPergola.name='Three-bay playground-side dining pergola';
 for(const u of [-75,-25,25,75])for(const v of [-24,24])box(playPergola,u*U,1.45,v*U,.16,2.9,.16,metal);
 for(const v of [-24,24])box(playPergola,0,2.91,v*U,150*U+.22,.2,.18,metal);
 for(const u of [-75,-25,25,75])box(playPergola,u*U,2.91,0,.18,.2,48*U+.22,metal);
 for(const bay of [-50,0,50])for(let u=-20;u<=20;u+=4)box(playPergola,(bay+u)*U,3.02,0,.075,.14,48*U+.25,metal);
 const patioChair=(parent,x,z,rotation=0)=>{const g=makeGroup(parent,x,z,rotation);box(g,0,.43,0,.48,.1,.5,fireFrame);box(g,0,.72,-.22,.48,.52,.08,fireFrame);for(const sx of [-1,1])for(const sz of [-1,1])box(g,sx*.17,.18,sz*.17,.045,.35,.045,fireFrame);};
 // IMG_4009: each table sits across its bay, square to the three-bay run, not
 // end-to-end along it. The island planter's near edge cuts inside the pergola
 // footprint (v about 19 against a post line at 24), so the run is offset 10
 // trace units off that edge to keep the far end chairs clear of the planter.
 for(const u of [-50,0,50]){
  const [tx,tz]=world(pergolaAt(u,-10)),dining=makeGroup(props,tx,tz,pergolaAngle+Math.PI/2);dining.name='Timber dining table with individual dark chairs';
  box(dining,0,.77,0,2.1,.09,.9,'oak');for(const x of [-.78,.78])box(dining,x,.38,0,.09,.72,.68,metal);
  for(const x of [-.64,.64]){patioChair(dining,x,-.79,0);patioChair(dining,x,.79,Math.PI);}patioChair(dining,-1.34,0,Math.PI/2);patioChair(dining,1.34,0,-Math.PI/2);
 }
 const island=[[1151,741],[1239,827],[1185,873],[1150,839]];planter(island,false);
 // A continuous pale concrete rim follows the traced planter, enclosing the
 // dense low planting rather than leaving a bare soil wedge.
 for(let i=0;i<island.length;i++)line(island[i],island[(i+1)%island.length],.22,stone,.16,.64);
 const insideIsland=(x,z)=>{let inside=false;for(let i=0,j=island.length-1;i<island.length;j=i++){const [ax,az]=island[i],[bx,bz]=island[j];if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;}return inside;};
 for(let x=1155;x<1235;x+=7)for(let z=746;z<869;z+=7)if(insideIsland(x,z)){
  const [wx,wz]=world([x,z]);
  for(let i=0;i<4;i++){const a=i*1.57+x*.11+z*.07;mesh(props,new T.IcosahedronGeometry(.1+(i%2)*.055,0),i%3?'leaflight':flower,wx+Math.cos(a)*.19,.82+(i%2)*.06,wz+Math.sin(a)*.19,.75,.62,.75);}
 }
 const plantingClusters=[[1162,766],[1170,783],[1177,800],[1187,817],[1173,830],[1187,846]];
 for(const [px,pz] of plantingClusters){
  const [x,z]=world([px,pz]);
  for(let i=0;i<6;i++){const a=i*1.07+px*.09;mesh(props,new T.ConeGeometry(.045,.48+(i%3)*.08,5),i%3?'leaflight':flower,x+Math.cos(a)*.32,.9,z+Math.sin(a)*.26,.65,1,.65);}
  for(let i=0;i<3;i++){const a=i*2.1;mesh(props,new T.IcosahedronGeometry(.17+(i%2)*.07,0),i%2?flower:lavender,x+Math.cos(a)*.35,.88,z+Math.sin(a)*.28,.8,.75,.8);}
 }
 for(const [tx,tz] of [[1169,784],[1185,821]]){const [x,z]=world([tx,tz]);tree(props,x,z,0,.5);}
 const compactGrill=(x,z,rotation=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rotation);g.name='Compact freestanding hood BBQ';
  box(g,0,.275,0,1.15,.55,.65,fireFrame);box(g,0,.585,0,1.2,.07,.69,counterStone);
  box(g,0,.72,0,1,.2,.6,'metal');
  cyl(g,0,.86,-.02,.24,1,'metal').rotation.z=Math.PI/2;
  box(g,0,.68,.31,1,.13,.035,'black');
  for(let i=0;i<4;i++)cyl(g,(i-1.5)*.19,.68,.34,.026,.045,'metal').rotation.x=Math.PI/2;
  rod(g,[-.34,1.03,.15],[.34,1.03,.15],.03,'black');
  for(const sx of [-.46,.46])for(const sz of [-.24,.24])cyl(g,sx,.07,sz,.065,.14,'black');
 };
 compactGrill(1145,803,Math.PI/2);compactGrill(1165,852,pergolaAngle);
 // IMG_4007/4042: the long east light-well edge is an emergency-stair block,
 // with a centred picnic table instead of the previously inferred round table.
 const stairTaupe=M('#57524d',.72),stairDoor=M('#45423e',.66),stairTrim=M('#77716a',.58);
 const stairCenter=[1059,570.5];
 B(stairCenter[0],stairCenter[1],42,135,3.12,stairTaupe);
 // IMG_4010: these read as plain black boxes because the hood used the dark local
 // `metal`, not stainless. Rebuilt to the same idiom as the counter BBQs above —
 // stainless firebox and rounded lid, black fascia, steel knobs, dark cabinet.
 // Flat gravel roof sits inside a narrow, raised metal coping.
 B(stairCenter[0],stairCenter[1],44,137,.22,stairTrim,3.1);
 B(stairCenter[0],stairCenter[1],37,130,.09,gravel,3.29);
 // Fine recessed joints make the long playground-facing elevation read as
 // the taupe metal panel system visible in the actual door photograph.
 const panelJoint=M('#3e3b38',.74);
 for(const z of [516,543,570,597,624])B(1080.81,z,.055,.42,3.04,panelJoint,.04);
 for(const y of [1.1,2.1])B(1080.82,570.5,.06,134,.04,panelJoint,y);
 const emergencyDoor=(z)=>{
  B(1080.72,z,.1,20,2.25,stairDoor,.08);
  // Slim three-sided perimeter frame, independent of the shallow canopy.
  for(const edge of [-10.3,10.3])B(1080.84,z+edge,.08,.34,2.35,stairTrim,.05);
  B(1080.84,z,.08,20.9,.1,stairTrim,2.3);
  B(1081.3,z,6,23,.12,stairTrim,2.3);
  B(1081.04,z,.12,14,.09,mats.metal,1.1);
  // Green exit indicator, warm vertical sconce and red safety call point.
  B(1081.1,z-11,.12,4,.3,mats.green,2.15);
  B(1081.1,z+12,.12,2.2,.56,mats.white,1.24);
  B(1081.15,z+19,.12,2.4,.34,mats.red,1.04);
 };
 emergencyDoor(522);emergencyDoor(617);
 // The paired red fire-safety cabinet and extinguisher form the prominent
 // central safety cluster between the two emergency exits.
 B(1081.08,568,.14,4.6,.56,mats.red,1.2);
 B(1081.16,578,.16,2.4,.5,mats.red,1.18);
 {const [a,b]=world([1081.22,578]);cyl(props,a,1.43,b,.115,.52,mats.red);}
 // Small exposed pipes and a roof vent sit at the bridge end.
 for(const [px,pz] of [[1046,630],[1051,630],[1056,630],[1061,630]]){const [a,b]=world([px,pz]);cyl(props,a,3.5,b,.06,.34,mats.metal);rod(props,[a,3.67,b],[a+.13,3.67,b],.035,mats.metal);}
 B(1068,625,8,11,.32,stairTrim,3.31);
 picnic(1112,570,Math.PI/2);
 // Bocce lanes, low edging, benches, balls and festoon lighting.
 for(const z of [783,833])B(803,z,207,3,.03,mats.white,.08);for(const x of [727,802,876]){B(x,776,23,5,.08,mats.oak,.48);const [a,b]=world([x,819]);cyl(props,a,1.65,b,.035,3.3,metal);}for(let i=0;i<9;i++){const [a,b]=world([728+i*17,794+(i%3)*9]);mesh(props,new T.SphereGeometry(.085,8,6),i%2?'red':'green',a,.14,b);}for(let i=0;i<20;i++){const [a,b]=world([727+i*7.85,819]);cyl(props,a,3.2-Math.sin(i/19*Math.PI)*.3,b,.035,.06,'ivory');}line([727,819],[876,819],.015,metal,.012,3.24);
 // Playground follows the built photograph: twin slides and faceted climbing pods.
 surface([[1170,512],[1240,493],[1470,502],[1504,554],[1298,778],[1170,638]],grass,.08);
 const circle=(x,z,r,material,y=.11)=>{const [a,b]=world([x,z]);mesh(props,new T.CylinderGeometry(r*U,r*U,.04,64),material,a,y,b);};circle(1293,635,89,stone);circle(1293,635,86,rubber,.14);circle(1386,586,63,stone);circle(1386,586,60,tan,.17);
 const [px,pz]=world([1286,626]),[podX,podZ]=world([1386,586]);buildPlayground(props,px,pz,podX,podZ);
 // Change-room geometry is kept in its own module because the annotated fit-out
 // and photographed pool facade are substantially more detailed than this deck.
 const changeOutline=[[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]];
 surface(changeOutline,mats.tilefloor,.06);const walls=new T.Group();props.add(walls);
 buildChangeRoom({parent:props,walls,B,surface,world,mats,M,fenceGlass});
 // IMG_3984/3985: flat turf and tan play circle, with a timber toddler house.
 surface([[662,112],[858,42],[914,104],[930,238],[845,238],[845,157],[698,157],[698,238],[662,238]],mats.woodfloor,.075);for(let x=665;x<831;x+=45)surface(rect(x,109,22,22),mats.tilefloor,.08);
 surface(rect(696,130,146,108),grass,.08);
 const [nx,nz]=world([759,180]);mesh(props,new T.CylinderGeometry(3.05,3.05,.035,64),stone,nx,.11,nz);mesh(props,new T.CylinderGeometry(2.9,2.9,.035,64),tan,nx,.145,nz);
 const house=makeGroup(props,nx,nz);house.name='North toddler playhouse';
 // IMG_4038/4040: an open shelter on navy posts, not an enclosed blue box, and it
 // carries no chimney. A vertical timber chime wall and a graphic play panel run off
 // the north gable; the sheltered end holds a play counter and a steering-wheel panel.
 const navy=M('#26404f'),signRed=M('#b8352c');
 for(const x of [-.62,.62])for(const z of [-.58,.58])box(house,x,.66,z,.1,1.32,.1,navy);
 box(house,0,.42,.72,1.28,.62,.08,blue);box(house,-.05,.72,.4,.86,.06,.5,blue);
 box(house,.6,.66,-.15,.07,.46,.8,blue);
 for(const z of [-.36,.06])cyl(house,.64,.92,z,.13,.05,'black').rotation.z=Math.PI/2;
 for(let z=-.86;z>-1.5;z-=.11)box(house,0,.45,z,1.16,.9,.07,'oak');
 box(house,0,.5,-1.62,1.16,1,.07,blue);
 for(const [x,z] of [[-.35,1.1],[.3,1.15]])cyl(house,x,.08,z,.2,.08,blue);
 for(const side of [-1,1]){const roof=box(house,side*.38,1.51,0,.88,.08,1.65,'oak');roof.rotation.z=-side*.49;for(let z=-.74;z<.8;z+=.2){const slat=box(house,side*.38,1.565,z,.9,.025,.025,'walnut');slat.rotation.z=-side*.49;}}
 box(house,0,1.5,.83,.6,.15,.04,signRed);
 planter([[592,56],[856,31],[870,45],[660,104],[592,91]]);
 surface(rect(661,639,272,34),wood,.08);
 fire(691,1240);for(const [x,z,r] of [[673,1238,Math.PI/2],[694,1220,0],[710,1240,-Math.PI/2]]){const [a,b]=world([x,z]);chair(props,a,b,r,'linen');}
 // Full pavilion envelope, gravel roof and glazing visible in IMG_3984.
 // User red-arrow correction: entrance at the southeast, bridge-side corner.
 B(888,159,83,2,3.6,metal);B(847,199,2,82,3.6,metal);
 B(929,178,2,40,3.6,metal);B(868,239,44,2,3.6,metal);
 B(888,199,83,82,.16,metal,3.46);B(888,199,78,77,.12,gravel,3.62);
 B(888,199,79,78,.08,mats.tilefloor,.02);
 for(const [a,b] of [[[846,158],[930,158]],[[930,158],[930,240]],[[930,240],[846,240]],[[846,240],[846,158]]])line(a,b,.24,metal,.18,3.63);
 for(const [x,z,w,d] of [[907,220,18,16],[874,221,12,12]]){B(x,z,w,d,.42,mats.metal,3.76);B(x,z,w+2,d+2,.055,mats.white,4.18);}
 for(let i=0;i<10;i++){const [a,b]=world([851+i*5,159]);cyl(props,a,3.92,b,.075,.32,'white');}
 // Glazing wraps the bridge-side corner; the former west doorway is solid cladding.
 B(930,219,1,40,3.25,mats.glass,.12);
 for(const z of [199,212,225,239])B(930.5,z,1,1,3.4,metal);
 B(930.5,219,1,40,.07,metal,1.72);
 B(910,240,40,1,3.25,mats.glass,.12);
 for(const x of [890,903,916,930])B(x,240.5,1,1,3.4,metal);
 B(910,240.5,40,1,.07,metal,1.72);
 B(910,241,1,1,.55,mats.metal,.75);
 surface(rect(889,241,42,25),mats.woodfloor,.17);
 surface(rect(890,241,40,24),mats.glass,2.65);
 for(const x of [890,903,916,930])line([x,240],[x,265],.1,metal,.08,2.65);
 // Lower Level 4 glimpses keep the light wells open while matching the photographs.
 // IMG_4015/4016 and the IMG_3979 aerial: the turf does not stop at the bridge. It
 // carries a short distance into the south well as an end zone closed by a goal line.
 // The end of that turf is the user's line drawn on the render, trace z=730.
 surface(rect(934,276,102,454),grass,-4.5);surface(rect(934,730,102,120),mats.tilefloor,-4.5);
 for(const x of [934,1035])line([x,276],[x,850],4.4,metal,.18,-4.5);
 for(const [z,label] of [[348,'30'],[454,'20'],[560,'10']]){surface(rect(935,z,100,2),mats.white,-4.46);const tex=canvasTexture((c,n)=>{c.clearRect(0,0,n,n);c.fillStyle='#ffffff';c.font='bold 210px sans-serif';c.textAlign='center';c.fillText(label,n/2,340);});const material=new T.MeshStandardMaterial({map:tex,transparent:true,depthWrite:false});const [a,b]=world([964,z-19]);const m=new T.Mesh(new T.PlaneGeometry(3.2,3.2),material);m.rotation.x=-Math.PI/2;m.position.set(a,-4.44,b);props.add(m);}
 // Goal line closing the end zone, and the inboard hash row every yard. The 10-yard
 // spacing above is 106 trace units, so one yard is 10.6. The turf and its hash row
 // run unbroken beneath the bridge: the slab hides that stretch from directly above,
 // but an oblique view sees past it and a gap there reads as a black hole in the field.
 surface(rect(935,728,100,2.5),mats.white,-4.46);
 for(let z=286;z<726;z+=10.6)surface(rect(1004,z,18,1.6),mats.white,-4.46);
 // IMG_4015/4016: the seats wrap a low table in a square — a sofa across the head and
 // an armchair on each return, fourth side open — not rows of sofas facing each other.
 // One cluster, centred on the paving and opening back toward the numbered turf.
 const wellDark=M('#2a2e33',.7),wellCushion=M('#57525f',.8);
 const wellCluster=z=>{
  const [cx,cz]=world([984,z]);
  // IMG_4015 detail: each unit has a low back on its outer side, with its own
  // cushion leaning against it. bx/bz picks which side that back sits on.
  const seat=(dx,dz,w,d,bx,bz)=>{
   box(props,cx+dx,-4.3,cz+dz,w,.4,d,wellDark);
   box(props,cx+dx,-4.03,cz+dz,w-.25,.14,d-.25,wellCushion);
   const px=cx+dx+bx*(w/2-.08),pz=cz+dz+bz*(d/2-.08);
   box(props,px,-3.87,pz,bx?.16:w,.46,bz?.16:d,wellDark);
   box(props,px-bx*.15,-3.9,pz-bz*.15,bx?.14:w-.3,.36,bz?.14:d-.3,wellCushion);
  };
  seat(0,1.25,2.1,.85,0,1);seat(-1.2,-.1,.85,1.8,-1,0);seat(1.2,-.1,.85,1.8,1,0);
  box(props,cx,-4.34,cz,.9,.32,.9,wellDark);
 };
 wellCluster(790);
 // The Level 4 floor's open end takes the same glass railing as the deck edges above,
 // dropped to that level: glass panel, slim top rail, posts every 20 trace units.
 line([934,850],[1035,850],.95,mats.glass,.055,-4.26);
 line([934,850],[1035,850],.055,metal,.065,-3.32);
 for(let i=0;i<=5;i++)B(934+i*20.2,850,1,1,1.2,metal,-4.5);

 // Glass follows the exposed slab perimeter, including all three terrace returns.
 const railingSegments=[
  [[934,228],[1080,228]],[[1080,228],[1080,223]],[[1080,223],[1221,223]],
  [[934,274],[1037,274]],
  [[934,638],[1037,638]],[[934,672],[1037,672]],
  [[933,276],[933,637]],[[1037,276],[1037,637]],
  [[933,676],[932,1128]],[[1037,676],[1037,868]],
  // East fireplace terrace: close the angled corner before the diagonal garden edge.
  [[1037,868],[1140,1012]],[[1140,1012],[1780,423]],
  // South garden: wrap the pointed fire-pit terrace and its west return.
  [[932,1128],[691,1312]],[[691,1312],[636,1265]],
  [[636,1265],[636,900]],
  [[40,596],[40,900]],[[40,900],[636,900]],
  // North playhouse terrace: follow the planting edge and picnic-table corner.
  [[660,110],[590,94]],[[590,94],[590,55]],[[590,55],[858,30]],
  [[858,30],[930,103]],[[930,103],[934,228]],
 ];
 const railingPosts=new Set();
 for(const [a,b] of railingSegments){
  line(a,b,.95,mats.glass,.055,.24);line(a,b,.055,metal,.065,1.18);
  const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/25);
  for(let i=0;i<=n;i++){
   const x=a[0]+(b[0]-a[0])*i/n,z=a[1]+(b[1]-a[1])*i/n;
   const key=`${x.toFixed(3)},${z.toFixed(3)}`;
   if(!railingPosts.has(key)){B(x,z,1,1,1.2,metal);railingPosts.add(key);}
  }
 }

 mergeRoomGeometry(walls);walls.removeFromParent();mergeRoomGeometry(props);props.add(walls);
 root.updateMatrixWorld(true);return {root,roomGroups,floorMeshes,wallGroups,columnGroups,bounds:new T.Box3().setFromObject(root),mats};
}

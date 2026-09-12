import * as T from 'three';
import {buildPlayground} from './playground.js';
import {buildChangeRoom} from './changeRoom.js';
import {createLevel6Navigation} from './firstPerson/NavigationWorld.js';
import {box,cyl,rod,mesh,makeGroup,shapeGeometry,sofa,chair,table,tree,mergeRoomGeometry,mats,canvasTexture} from './model.js';
// Trace coordinates correspond to the supplied overhead render at 1855 × 1344.
// Scale is anchored on the user's 2026-09-12 tape measurements (MODEL-SOURCES.md):
// a BBQ bay is 15 ft × 150 in with a 100 in gazebo, and the render's three bay
// tables sit on a 68 px (65.7 trace unit) pitch, so one bay depth plus its gap
// fixes a trace unit at ~.06 m. Every other deck dimension follows from it.
const U=.06;
// Measured on site: gazebo overall height, bay footprint, pool glass height.
const PERGOLA_H=2.54,BAY_W=4.572/U,BAY_D=3.81/U,FENCE_H=2.032;
// Posts carry .19 m of beam and slat above them, so they stop short of 2.54.
const POST_H=PERGOLA_H-.19;
// IMG_4005/IMG_4036: the deck's maples stand two to three times the height of
// the .95 m BBQ counters in front of them, well clear of a walker's head. The
// shared tree() primitive is 2.9 m tall at scale 1, so planting is sized from a
// height in metres rather than an eyeballed scale.
const treeH=m=>m/2.9;
// Height comes from the species, spread from the bed: tree() carries a ~3.4 m
// crown at deck height, which a .9 m planter cannot hold without swallowing the
// walk beside it. Narrow beds keep the full height and squash the crown across
// the bed only, so the row reads as the tall green strip the render shows.
const CROWN=3.4;
const bedSpread=(widthTraceUnits,U)=>Math.max(.34,Math.min(1,(widthTraceUnits*U+.8)/CROWN));
const slimTree=(parent,x,z,metres,spread=1,acrossX=true)=>{
 const g=makeGroup(parent,x,z,0);tree(g,0,0,0,treeH(metres));
 if(acrossX)g.scale.x=spread;else g.scale.z=spread;return g;};
const world=([x,z])=>[(x-910)*U,(z-670)*U];
const rect=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
// The three BBQ bays are centred on the render's three bay tables (px y
// 333/401/469), one measured bay deep, leaving a .13 m gap between gazebos.
const bayZ=[321.7,387.4,453.1],bbqBay=z=>rect(1086-BAY_W/2,z-BAY_D/2,BAY_W,BAY_D);
const aerial='amenity-deck-aerial.jpg',terrace='bbq-firepit-terrace.jpg';
const site=n=>`site-${n}.jpg`;
const room=(id,name,polygon,photos,description,category='Outdoor',extra={})=>({id:`L6-${id}`,name,polygon,photos,description,category,kind:id,bookingUrl:null,...extra});
const bookingBase='https://clubgilmore.perfectmind.com/Contacts/BookMe4LandingPages/Facility';
const bookingQuery='widgetId=15f6af07-39c5-473e-b053-96653f77a406&calendarId=c82e88a4-5059-4c6e-bc5e-66f1a02d2d6a';
const bbqBooking=facilityId=>`${bookingBase}?facilityId=${facilityId}&${bookingQuery}`;
const bbqDescription=number=>`BBQ ${number} is a private pergola bay with a timber dining table, eight individual chairs and a freestanding stainless-steel grill beside the planted counter. Club Gilmore lists BBQ, table and chairs, shade gazebo, a maximum of eight people and a 2 hour 50 minute outdoor-seating reservation. Children are welcome above the stated eight-person limit.`;
export const level6Rooms=[
 room('pool','Outdoor pool',rect(236,714,329,111),[site(4026),site(3983),site(3986),'outdoor-pool.jpg','outdoor-pool-sun-deck.jpg'],'Swim outdoors between the residential towers. The long rectangular pool has stone coping, stainless-steel entry rails and depth markings. Sun loungers line its north edge; the whole deck sits inside a glass safety enclosure.','Wellness'),
 room('hot-tub','Hot tub',rect(128,714,87,111),[site(3983),site(4026),'outdoor-pool-sun-deck.jpg','outdoor-pool.jpg'],'The separate hot tub sits at the west end of the pool, beside the daybeds and landscaped pool perimeter. The pool-deck photographs show its surrounding setting.','Wellness'),
 room('sun-deck','Pool sun deck',[[40,596],[265,596],[265,611],[465,611],[465,596],[660,596],[660,901],[40,901]],[site(4035),site(4026),site(4025),site(3983),'outdoor-pool-sun-deck.jpg','outdoor-pool.jpg'],'A paved pool terrace enclosed by a frameless glass safety fence on slim black posts, entered through a gated opening where the timber walkway meets the deck. The south and east strips hold timber-framed striped modular sectionals around teak coffee tables. Reclining loungers, rolled towels, two open slatted pergolas and circular daybeds remain along the north edge and the planted western edge.'),
 room('lounge','Outdoor fireplace & lounge',rect(695,280,215,358),[site(4036),site(4037),site(4010),site(3990),site(3979),site(3978)],'A double-sided dark stone fireplace separates two intimate seating groups. Each side has two facing grey sofas with timber frames, a lounge chair and small round wooden tables. Four picnic tables and two planted islands flank the seating. A long dark stone BBQ counter closes each end of the terrace, each with two freestanding stainless grills standing against its front face.','Social'),
 room('bocce','Bocce lawn',[[698,769],[909,769],[909,875],[772,972],[698,884]],[site(3980),site(3983),'bocce-court.jpg','bocce-court-and-pool.jpg'],'Two adjacent green strips sit south of the lounge, laid in putting turf with three flush cups. Pale boundary lines, low concrete planter walls, cantilevered timber bench seats and overhead string lights follow the actual court photographs.'),
 room('play','Children’s play area',[[1170,515],[1220,487],[1453,499],[1519,562],[1300,778],[1170,638]],['childrens-playground.jpg',site(3981),site(3982)],'A blue rubber play surface and adjoining tan climbing area are set into the eastern garden. A curved blue slide and adjacent double slide descend from a guarded hexagonal platform. A bowed climbing cage, access stairs and overhead traverse bar connect the play equipment. Linked grey, navy and orange pentagonal climbing pods occupy the tan surface.'),
 room('garden','Urban garden plots',[[1110,968],[1672.2,444],[1706,444],[1728,425],[1728,392],[1795,439],[1156,1028]],[site(3982),site(3981),site(4047),site(4013),aerial],'A dark timber boardwalk runs the full southeast diagonal, from the fire terrace to a slatted pergola at the point. A raised bed behind a pale concrete retaining wall fills the strip between the walk and the glass-railed parapet, and a second runs flush along the playground side, its wall in line with the walk and its far edge stopping at the turf apron that rings the play surfaces. Dark bench blocks sit along both edges of the walk. The bed is massed with white flowering shrubs, rust and blue-grey accents and occasional small trees, and the whole tip beyond the pergola is planted. A potting bench with a galvanised work surface and an open slatted shelf stands under the pergola at the end of the walk.'),
 room('fire','Fire pit terrace',[[1037,674],[1160,674],[1298,788],[1138,962],[1037,867]],[site(3989),terrace,aerial],'An open paved terrace between the east pergola and the southern tip. Its north side has a striped modular fire-pit lounge and a curved timber picnic table, open for public use. The bookable P18 fire-pit, table and BBQ area occupies the terrace’s south end.','Social'),
 // User's red outline (2026-09-11): P18 is the south fire lounge, its round table and the grill on the planter's southwest rim.
 room('p18','P18 – Firepit, Table & BBQ',[[1037,815],[1150,815],[1150,839],[1193,882],[1203,891],[1138,962],[1037,867]],['fire-pit-booking-1.jpg','fire-pit-booking-2.jpg','fire-pit-booking-3.jpg','fire-pit-booking-4.jpg'],'P18 combines a fire-pit lounge and BBQ dining space at the south end of the fire pit terrace. Club Gilmore lists a BBQ, fire pit, patio couch and picnic table, with room for sixteen people total: eight in the BBQ space and eight in the fire-pit area. The reservation duration is 2 hours 50 minutes. Striped modular sofas surround a low round fire bowl, beside a curved timber picnic table and a compact stainless-steel grill against the planter.','Social',{bookingUrl:bbqBooking('c9efdb01-612b-46b3-b371-a161fc97bf6b')}),
 room('bbq-north','North terrace & playhouse',[[660,110],[858,38],[916,102],[932,244],[698,244],[698,278],[660,278]],[site(4038),site(4040),site(3985),site(3984),site(3978)],'An open timber play shelter on navy posts sits on a circular tan rubber pad ringed in pale concrete and set into green turf. A vertical timber chime wall and a teal graphic panel run off its gable, with a play counter, steering wheels and low disc seats under the roof. The adjoining dark-clad stair pavilion has a gravel roof, two rooftop vents and a glazed bridge entrance. A picnic table sits beside the pavilion; pale paving and timber-look bands follow the actual terrace.','Social'),
 room('bbq-central','Bocce-side fireplace lounges',rect(690,653,225,113),[site(3992),site(3979),site(3983)],'Two dark stone fireplaces anchor the ends of this terrace beside the bocce lawn. Each lounge has facing grey sofas, two striped armchairs and a low white round table. A dark slatted dining table and six striped chairs sit between the lounges.','Social'),
 room('bbq-1','BBQ 1 – Table & Gazebo',bbqBay(bayZ[0]),['bbq-1-1.jpg','bbq-1-2.jpg','bbq-1-3.jpg','bbq-1-4.png'],bbqDescription(1),'Social',{bookingUrl:bbqBooking('e19d55a9-ba84-4359-82d4-9bca2c23ee1c')}),
 room('bbq-2','BBQ 2 – Table & Gazebo',bbqBay(bayZ[1]),['bbq-2-1.jpg','bbq-2-2.jpg','bbq-2-3.png'],bbqDescription(2),'Social',{bookingUrl:bbqBooking('3807e29f-a39b-4a63-9ece-192a29076d3e')}),
 room('bbq-3','BBQ 3 – Table & Gazebo',bbqBay(bayZ[2]),['bbq-3-1.jpg','bbq-3-2.jpg','bbq-3-3.jpg','bbq-3-4.png'],bbqDescription(3),'Social',{bookingUrl:bbqBooking('2ab1b95c-49b4-4399-9444-db49f5deade3')}),
 room('bbq-south','South garden & round tables',[[660,891],[696,891],[911,1114],[777,1227],[665,1260],[639,1244],[639,987]],[site(4021),site(3991),site(3980),site(3986),aerial],'A broad continuous lawn follows the angled timber walk. Planted beds wrap the slatted pergola, which shelters three round dining tables, each with four individual black chairs. Beyond the walk, one raised square tree planter and a black downlight post stand in the open turf. Perimeter planting and the small fire pit seating area continue toward the southern tip.','Social'),
 room('change','Pool change rooms',[[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]],[site(4029),site(4034),site(4028),aerial],'The pool change rooms open onto the north side of the sun deck. Outside, the charcoal-tiled facade has a recessed centre entrance, three stainless shower panels, a life ring, dual-height drinking fountains and a frosted storage door beneath a glass canopy. The roofless interior shows an accessible northwest wet room, five north washroom stalls, five west changing cubicles, four central showers opening to the north aisle, a separate two-head standing-shower bay, a three-basin vanity on the east wall, a southeast steam room and an L-shaped southwest storage room with its own door.','Wellness'),
];
export const level6Labels=['pool','hot-tub','lounge','bocce','play','garden','fire','p18','bbq-north','bbq-south','change'].map(id=>`L6-${id}`);
export function createLevel6Model(){
 const root=new T.Group();root.name='Club Gilmore — Level 6';root.userData={level:6,units:'metres',scale:'1 trace unit = .06 m, from the 2026-09-12 on-site measurements',source:'User floor plan, overhead render and actual amenity photos'};
 const props=new T.Group();root.add(props);
 const walkModeGates=[];
 const roomGroups=new Map(),floorMeshes=[],wallGroups=[],columnGroups=[];
 const M=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
 const stone=M('#cbc9c0'),wood=M('#b79a82'),soil=M('#464735'),grass=mats.turf,metal=M('#3b4243'),blue=M('#2787a5'),rubber=M('#527f89'),tan=M('#a78765');
 const gravel=M('#a9aaa6');gravel.map=canvasTexture((c,n)=>{c.fillStyle='#919590';c.fillRect(0,0,n,n);let seed=83;for(let i=0;i<22000;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%n;seed=(seed*1664525+1013904223)>>>0;const y=seed%n;c.fillStyle=['#dadbd5','#575d58','#bfc2bc'][i%3];c.fillRect(x,y,2,2);}});
 const stripe=M('#d0d0c8');stripe.map=canvasTexture((c,n)=>{c.fillStyle='#d4d4cb';c.fillRect(0,0,n,n);for(let x=0;x<n;x+=24){c.fillStyle='#626a6d';c.fillRect(x,0,11,n);c.fillStyle='#9dabae';c.fillRect(x+13,0,3,n);}});mats.l6stripe=stripe;
 const flower=M('#d5ac25'),lavender=M('#a19aa7');
 // level-6-render.png southeast wedge: white flowering shrubs with rust and
 // blue-grey masses, over a dark timber boardwalk.
 const bloom=M('#e5e2d6'),rust=M('#a5442a'),sage=M('#8fa2ab');
 // User correction: the walk and the south light-well floor take the fire
 // terrace's charcoal paving grey rather than timber and pale tile, so the two
 // read as one material. This is the same #777b79 as fireCharcoal below.
 const paveGrey=mats.tilefloor.clone();paveGrey.color.set('#777b79');
 // Tree canopies hang from ~0.75 m; walkers brush through foliage, while trunks
 // and planter walls stay solid. Needed for the northeast planter walk (IMG_4005).
 mats.leaf.userData.collision=mats.leaflight.userData.collision=false;
 const water=new T.MeshStandardMaterial({color:'#68c3d0',roughness:.19,metalness:.2,map:canvasTexture((c,s)=>{c.fillStyle='#8ddae0';c.fillRect(0,0,s,s);for(let i=0;i<180;i++){c.strokeStyle='rgba(255,255,255,.22)';c.beginPath();const x=(i*79)%s,y=(i*137)%s;c.ellipse(x,y,18,8,i,0,7);c.stroke();}})});
 const surface=(poly,material,y=0,depth=0,parent=props)=>{const o=new T.Mesh(shapeGeometry(poly.map(world),depth),material);o.position.y=y;o.receiveShadow=true;parent.add(o);return o;};
 const B=(x,z,w,d,h,material=stone,y=0,parent=props)=>{const [a,b]=world([x,z]);return box(parent,a,y+h/2,b,w*U,h,d*U,material);};
 const line=(a,b,height=.6,material=stone,width=.16,y=0)=>{const [x,z]=world(a),[xx,zz]=world(b),length=Math.hypot(xx-x,zz-z);return box(props,(x+xx)/2,y+height/2,(z+zz)/2,length,height,width,material,-Math.atan2(zz-z,xx-x));};
 // The two long rectangular gaps remain open, connected only by the two bridges.
 // Curbs for the first three are drawn after insidePolygon below.
 const northSlab=[[590,55],[858,30],[930,103],[936,227],[1080,227],[1080,222],[1221,222],[1221,274],[933,274],[933,275],[660,275],[660,110],[590,94]];
 const southBridge=rect(933,638,104,35),forecourt=[[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]];
 for(const p of [northSlab,southBridge,forecourt])surface(p,stone,-.38,.36);
 // Individual slabs avoid filling the central light wells with a single polygon.
 const sunDeck=rect(40,596,620,305),westSlab=[[660,275],[932,275],[932,1128],[691,1312],[636,1265],[636,901],[660,901]];
 surface(sunDeck,stone,-.36,.34);surface(westSlab,stone,-.36,.34);
 const eastSlab=[[1037,259],[1193,259],[1193,471],[1352,471],[1352,488],[1539,488],[1539,470],[1619,470],[1648,444],[1706,444],[1728,425],[1728,371],[1795,439],[1779,460],[1156,1028],[1037,867]];
 surface(eastSlab,stone,-.36,.34);
 // Fine paving modules and warm timber circulation bands.
 // User request 2026-09-11: the timber walk runs flush to the slab edge (x=660,
 // z=275) and the turf (z=238), and sits above the North terrace room floor
 // (y=.045), which used to hide its west end.
 surface(rect(660,238,273,37),mats.woodfloor,.05);
 // IMG_3996: wood-look rectangular pavers span the full bridge and terrace landing.
 surface([[933,228],[1080,228],[1080,223],[1221,223],[1221,274],[933,274]],wood,.012);
 for(let x=934;x<1221;x+=15)for(let z=224;z<274;z+=8){
  const left=x,right=Math.min(x+14.7,1220),top=Math.max(z,x<1080?228:223),bottom=Math.min(z+7.7,273.8);
  if(bottom>top)surface(rect(left,top,right-left,bottom-top),mats.woodfloor,.025);
 }
 // Narrow metal threshold at the pavilion doorway.
 B(936,251,1.7,45,.035,mats.metal,.035);surface(rect(660,637,377,36),wood,.015);
 surface([[660,672],[697,672],[697,882],[911,1113],[883,1134],[660,893]],wood,.015);
 for(const r of level6Rooms){const group=new T.Group();group.name=r.name;group.userData={roomId:r.id,level:6,description:r.description};root.add(group);
 // The bocce selection polygon extends into the irregular south garden. Keep
 // its pickable underlay neutral; the exact lawn polygons are drawn below.
 const floorMaterial=(r.kind==='bocce'?stone:mats.tilefloor).clone();
 const poly=r.polygon.map(world),floor=surface(r.polygon,floorMaterial,r.kind==='sun-deck'?.025:r.kind==='p18'?.055:.045,0,group);floor.userData.roomId=r.id;floorMeshes.push(floor);
 const outline=new T.Line(new T.BufferGeometry().setFromPoints([...poly,poly[0]].map(([x,z])=>new T.Vector3(x,.12,z))),new T.LineBasicMaterial({color:'#d1b674',transparent:true,depthTest:false}));outline.visible=false;outline.renderOrder=5;group.add(outline);
 const center=new T.Box3().setFromPoints(poly.map(([x,z])=>new T.Vector3(x,0,z))).getCenter(new T.Vector3());roomGroups.set(r.id,{group,floor,outline,center,poly});}
 for(let z=315;z<600;z+=48){surface(rect(733,z,174,23),mats.circulation,.06);surface(rect(1038,z,105,23),mats.circulation,.06);}
 // Pools, inset water, coping, stair treads and stainless-steel ladders.
 for(const [x,z,w,d] of [[242,724,312,90],[137,724,69,90]]){B(x+w/2,z+d/2,w+9,d+9,.16,mats.pooltile);B(x+w/2,z+d/2,w,d,.18,water);}
 // Reference render: the hot tub's coping and water step out in a small centred
 // bay on its north edge. Both boxes abut, rather than overlap, the main ones.
 B(171.5,716.5,31,6,.16,mats.pooltile);B(171.5,721,22,6,.18,water);
 // IMG_4031: the hot tub is entered through that bay, not its east side.
 // Submerged steps fill the bay, and a stainless grab rail stands on the coping
 // either side of it, its top leaning in over the water.
 B(171.5,719.75,22,3.5,.195,mats.pooltile);B(171.5,723,22,3,.187,mats.pooltile);
 for(const x of [158.25,184.75]){const [a,b]=world([x,715]),[,c]=world([x,722]),i=x<171.5?.08:-.08;
  rod(props,[a,.16,b],[a,.95,b],.035);rod(props,[a,.95,b],[a+i,.95,c],.035);rod(props,[a+i,.95,c],[a,.16,c],.035);}
 // IMG_4028/4032 and the user's annotated plan: the main pool has three ladder
 // pairs of curved stainless rails, each rising from the deck and sloping down
 // to the coping. The pairs stand at the northwest corner (over a submerged
 // corner step), mid-way along the north edge, and on the south edge just short
 // of the southeast corner. (x,z) is the water edge; (dx,dz) points to the deck.
 // The deck foot sits 5.5 trace units (.33 m) off the water, not 8.5: at .51 m
 // the rails pinched the north walk shut between the loungers and the coping.
 const poolRail=(x,z,dx,dz)=>{const [a,b]=world([x+dx*5.5,z+dz*5.5]),[c,d]=world([x+dx*1.2,z+dz*1.2]);
  rod(props,[a,0,b],[a,.95,b],.035);rod(props,[a,.95,b],[c,.82,d],.035);rod(props,[c,.82,d],[c,.16,d],.035);};
 B(252,734,20,20,.186,mats.pooltile);B(249,731,14,14,.196,mats.pooltile);
 for(const z of [728,736.5])poolRail(242,z,-1,0);
 for(const x of [393.8,402.2])poolRail(x,724,0,-1);
 for(const x of [522.8,531.2])poolRail(x,814,0,1);
 const lounger=(x,z,rot=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot);box(g,0,.28,0,.73,.12,1.9,'oak');box(g,0,.39,.24,.65,.14,1.3,'linen');const back=box(g,0,.68,-.64,.65,.13,.8,'linen');back.rotation.x=.68;for(const xx of [-.28,.28])for(const zz of [-.7,.7])box(g,xx,.14,zz,.055,.28,.06,'oak');cyl(g,0,.52,.7,.12,.55,'white').rotation.z=Math.PI/2;};
 // User reports 2026-09-12. The band between the pergola posts (z=663.3) and the
 // coping (719.5) is 3.37 m; a 1.9 m lounger leaves 1.47 m, which is one usable
 // walk, not two — splitting it gave .73 m either side and the walker scraped
 // both. The render and IMG_4026 both put the beds hard against the coping with
 // the circulation behind them, so that is where the walk goes: 1.3 m clear.
 // Two beds are dropped for a 3 m aisle onto the change rooms' entry court,
 // whose south wall opens between x=355 and 407, so the pool edge, the ladder
 // and the change rooms all connect.
 for(let x=270;x<560;x+=21)if(x!==375&&x!==396)lounger(x,701);
 // South-side pairs, evenly spaced from the first (centre 286) so the last
 // bed's east side lines up with the pool's east coping edge (x=558.5).
 for(const c of [286,372.3,458.6,544.9])for(const d of [-8,8])lounger(c+d,859,Math.PI);for(const x of [145,198,249])lounger(x,701);for(const x of [145,170,207,230])lounger(x,859,Math.PI);
 // Pergola loungers on the north edge. User requests 2026-09-11: three added
 // beside the lone one under the west pergola; the east pergola's x=470 lounger
 // (hard against the change-room storage door) is removed. Each group centres
 // under its cover: west on x=209, east on x=520.
 for(const x of [179,199,219,239,490,510,530,550])lounger(x,639);
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
  deckSofa(g,0,-1.25,0,4);deckTable(g,0,0);deckSofa(g,0,1.25,Math.PI,4);
 };
 // User requests 2026-09-11: each pair tightens (sofas 1.25 m from the table,
 // .375 m legroom), and the gap between the pairs' back-to-back sofas is halved
 // from ~1.85 m to ~.93 m (centres 67.3 units apart about z=750). That clears
 // wide paths at both outer ends.
 deckPair(610,716.33);deckPair(610,783.67);
 // IMG_4025/4026: a frameless glass safety fence encloses the pool deck along
 // the timber walkway, gated where that walkway meets the deck. Only this east
 // run is photographed; the remaining enclosure edges are not yet evidenced.
 const fencePost=M('#2f3438',.5);
 const fenceGlass=new T.MeshStandardMaterial({color:'#b9cdd2',roughness:.12,metalness:.05,transparent:true,opacity:.4,depthWrite:false});
 const poolFence=(a,b)=>{
  const n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/24));
  const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  for(let i=0;i<n;i++)line(at(i/n),at((i+1)/n),1.9,fenceGlass,.022,.1);
  for(let i=0;i<=n;i++){const [x,z]=at(i/n);B(x,z,1.5,1.5,FENCE_H,fencePost);for(const y of [.33,1.02,1.71])B(x,z,3.4,3.4,.11,fencePost,y);}
 };
 // The deck's north edge was an open slab edge and left the fence dead-ending
 // at a lone post. The aerial shows a solid concrete parapet there; closing it
 // also lands the glass run on a real corner.
 const parapet=M('#c9c6bd',.85);
 for(const [a,b] of [[[40,596],[265,596]],[[465,596],[660,596]]]){line(a,b,1.15,parapet,.34);line(a,b,.08,stone,.44,1.15);}
 // User request 2026-09-11: each gate sits one 24-unit panel further inward.
 poolFence([660,596],[660,668]);poolFence([660,692],[660,812]);poolFence([660,836],[660,901]);poolFence([660,901],[636,901]);
 const poolGate=z=>{
  const g=makeGroup(props,...world([660,z]),Math.PI/2);g.name='Pool enclosure gate';
  walkModeGates.push(g);
  for(const side of [-1,1])box(g,side*.55,FENCE_H/2,0,.1,FENCE_H,.1,fencePost);
  for(const y of [.15,1.95])box(g,0,y,0,1.1,.1,.1,fencePost);
  box(g,0,1.06,0,1.02,1.72,.024,fenceGlass);
  cyl(g,.36,1.09,.08,.022,1.12,'metal');
 };
 poolGate(680);poolGate(824);
 const pergola=(x,z,w,d,rot=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot);for(const xx of [-1,1])for(const zz of [-1,1])box(g,xx*w*U/2,POST_H/2,zz*d*U/2,.16,POST_H,.16,metal);for(const zz of [-1,1])box(g,0,POST_H+.01,zz*d*U/2,w*U+.22,.2,.18,metal);for(let xx=-w*U/2;xx<=w*U/2;xx+=.23)box(g,xx,POST_H+.12,0,.085,.14,d*U+.25,metal);};
 pergola(209,641,106,42);pergola(520,641,98,42);
 // IMG_4030: a long black open-cubby unit (2 rows × 17 bays) on a stainless
 // base stands against the north parapet, between the west planter and the
 // west pergola, behind the pergola loungers.
 {const k=M('#1d2022',.62),s=M('#b8bfc1',.28),x0=68,len=82,n=17,z=602.5;
  B(x0+len/2,599.3,len,.6,.74,k,.14);
  for(const y of [.14,.5,.86])B(x0+len/2,z,len,7,.03,k,y);
  for(let i=0;i<=n;i++)B(x0+i*len/n,z,.5,7,.75,k,.14);
  B(x0+len/2,605.8,len,.4,.05,s,.06);
  for(let i=0;i<=4;i++)B(x0+1+i*(len-2)/4,z,.8,6,.14,s,0);}
 // User correction: the northeast pergola stands at the very end of the walk,
 // squared onto it. -.8321 is exactly perpendicular to the slab edge the walk
 // follows, atan2(-edgeDir[0],edgeDir[1]); the eyeballed -.76 sat 4 degrees out.
 // 38 across seats the posts at offsets 39.6 and 77.6, clear of the retaining
 // walls at 35 and 83; at 50 they landed inside both. 46 along keeps the rafter
 // overhang short of the tip bed.
 pergola(1634,513,38,46,-.8321);
 // IMG_4013: a potting bench stands against the pergola's northeast bay — a
 // galvanised work surface over a light timber apron and legs, with an open
 // slatted shelf beneath. Local z is the walk axis, negative toward the tip.
 {
  const [bx,bz]=world([1634,513]),bench=makeGroup(props,bx,bz,-.8321);bench.name='Gardening potting bench';
  const z0=-1.1;
  box(bench,0,.92,z0,1.85,.045,.72,'metal');
  box(bench,0,.85,z0,1.76,.1,.64,'oaklight');
  for(let i=0;i<4;i++)box(bench,0,.38,z0-.24+i*.16,1.68,.035,.12,'oak');
  for(const xx of [-.84,.84])for(const zz of [-.27,.27])box(bench,xx,.44,z0+zz,.085,.88,.085,'oaklight');
 }
 // Open fabric shells need an interior face when viewed from the pool or in
 // first person. Clone linen so other furniture keeps its existing material.
 const daybedCanopyMaterial=mats.linen.clone();
 daybedCanopyMaterial.name='Double-sided daybed canopy';
 daybedCanopyMaterial.side=T.DoubleSide;
 for(const z of [703,759,814]){
  const [a,b]=world([89,z]);
  cyl(props,a,.24,b,.85,.38,'oak');
  cyl(props,a,.47,b,.76,.17,'ivory');
  const canopy=new T.Mesh(new T.SphereGeometry(.88,16,10,0,Math.PI),daybedCanopyMaterial);
  canopy.position.set(a,.66,b);canopy.rotation.y=-Math.PI/2;
  props.add(canopy);
 }
 // dz nudges the planting anchor across a narrow bed; treeScale trims the crown
 // further, on top of the spread the bed's own width already sets.
 const planter=(poly,trees=true,dz=0,treeScale=1)=>{surface(poly,stone,.06,.58);surface(poly,soil,.66);const bounds=new T.Box2().setFromPoints(poly.map(p=>new T.Vector2(...p)));const bedW=bounds.max.x-bounds.min.x,bedD=bounds.max.y-bounds.min.y,spread=bedSpread(Math.min(bedW,bedD),U)*treeScale;for(let x=bounds.min.x+10;x<bounds.max.x-4;x+=26)for(let z=bounds.min.y+10;z<bounds.max.y-4;z+=26){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [a,b]=poly[i],[c,d]=poly[j];if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)inside=!inside;}if(inside){const [a,b]=world([x,z+dz]);if(trees){slimTree(props,a,b,3.5+((x+z)%13)/13,spread,bedW<bedD);for(let k=0;k<7;k++)mesh(props,new T.IcosahedronGeometry(.2,0),k%5?flower:lavender,a+Math.sin(k*2.4)*.6*(bedW<bedD?spread:1),.85,b+Math.cos(k*2.4)*.6*(bedW<bedD?1:spread),1,.6,1);}else{for(let k=0;k<3;k++)mesh(props,new T.IcosahedronGeometry(.4,0),k%2?'leaf':'leaflight',a+k*.2,.95,b,.8,.7,.8);}}}};
 for(const p of [rect(40,596,25,304),rect(65,879,570,22),rect(699,280,208,32),rect(699,600,208,34),rect(699,357,32,201),rect(795,353,28,51),rect(795,510,28,51)])planter(p);
 // IMG_4005/IMG_4057 and the render crop: behind the pergola grills a paved walk
 // runs between two raised tree planters. The west bed's wall stands at
 // x=1127.3, touching the pergola posts' east face (1127.23) and clear of the
 // grill backs (1126.4). User correction (IMG_4058): the 17.5-wide east bed is
 // pushed back to the deck edge at x=1193, widening the walk to 2.1 m; its south
 // end follows rearBed's diagonal (1168,501)-(1193,471), touching, not overlapping.
 // User correction: the west bed stops at the pergola's south corner post, whose
 // outer face is z=482+1.23=483.2, instead of running on to z=497.
 planter(rect(1127.3,287,15.7,196.2));planter([[1175.5,287],[1193,287],[1193,471],[1175.5,492]]);
 surface(rect(1143,287,32.5,210),mats.tilefloor,.05);
 for(let z=287;z<497;z+=18)surface(rect(1143,z,32.5,9),paveGrey,.06);
 // User correction: the bocce-side bed's single tree row sat hard against the lounge
 // and its canopies swallowed both terraces. Nudged toward the court and cut back.
 planter(rect(699,733,208,36),true,10,.74);
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
 // User correction, IMG_4055/4056: the 0.23 m curb stands only on exposed slab
 // edges (light wells, deck perimeter). Where two slabs meet the join is flush,
 // so each edge is sampled per trace unit and any run with another slab 2 units
 // to either side is left out. Supersedes the hand-cut north-slab exception.
 const decks=[northSlab,southBridge,forecourt,sunDeck,westSlab,eastSlab];
 for(const poly of [northSlab,southBridge,forecourt])poly.forEach((a,i)=>{
  const b=poly[(i+1)%poly.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(len),nx=(a[1]-b[1])/len*2,nz=(b[0]-a[0])/len*2;
  const at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];let s=null;
  for(let k=0;k<=n;k++){
   const [x,z]=at((k+.5)/n),open=k<n&&!decks.some(d=>d!==poly&&(insidePolygon(x+nx,z+nz,d)||insidePolygon(x-nx,z-nz,d)));
   if(open&&s===null)s=k;else if(!open&&s!==null){line(at(s/n),at(k/n),.23);s=null;}
  }
 });
 const southTreeAnchors=[
  [[792,963]],[[890,893]],[[875,1067]],[[777,1055]],
  [[644,995],[644,1072],[645,1150],[650,1225]]
 ];
 const southPlanter=(poly,treesAt=[],palette=null,step=0,clearance=null)=>{
  surface(poly,stone,.06,.58);surface(poly,soil,.66);
  for(let i=0;i<poly.length;i++)line(poly[i],poly[(i+1)%poly.length],.2,stone,.18,.59);
  const bounds=new T.Box2().setFromPoints(poly.map(p=>new T.Vector2(...p)));
  const bedW=bounds.max.x-bounds.min.x,bedD=bounds.max.y-bounds.min.y;
  const narrow=bedW<20,stepX=step||(narrow?5:9),stepZ=step||(narrow?12:9),spread=bedSpread(Math.min(bedW,bedD),U);
  for(let x=bounds.min.x+3;x<bounds.max.x-2;x+=stepX)for(let z=bounds.min.y+3;z<bounds.max.y-2;z+=stepZ)if(insidePolygon(x,z,poly)){
   const jitter=Math.sin(x*1.73+z*.91),[wx,wz]=world([x+jitter*1.2,z+Math.cos(x*.47-z)*1.2]);
   if(clearance&&!clearance(x+jitter*1.2,z+Math.cos(x*.47-z)*1.2))continue;
   const material=palette?palette[Math.round(x*2+z)%palette.length]:(Math.round(x+z)%5===0)?flower:(Math.round(x*2+z)%7===0)?lavender:(Math.round(x+z)%2?'leaflight':'leaf');
   mesh(props,new T.IcosahedronGeometry(.13+(Math.abs(jitter)*.05),0),material,wx,.79+(Math.abs(jitter)*.06),wz,.9,.65,.9);
  }
  for(const [x,z] of treesAt){const [wx,wz]=world([x,z]);slimTree(props,wx,wz,3.4,spread,bedW<bedD);}
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
 for(let i=0;i<4;i++)line(southPergola[i],southPergola[(i+1)%4],.18,metal,.18,POST_H-.08);
 const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
 const pergolaSupports=[...southPergola];
 for(const t of [1/3,2/3]){
  const a=lerp(southPergola[0],southPergola[1],t),b=lerp(southPergola[3],southPergola[2],t);
  line(a,b,.14,metal,.14,POST_H+.01);pergolaSupports.push(a,b);
 }
 for(const [x,z] of pergolaSupports){const [wx,wz]=world([x,z]);box(props,wx,POST_H/2,wz,.16,POST_H,.16,metal);}
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
  if(hits.length>1)line(hits[0].point,hits[hits.length-1].point,.075,metal,.075,POST_H+.09);
 }
 // level-6-render.png, southeast wedge: a dark timber boardwalk runs the whole
 // diagonal with two raised beds between it and the parapet and one more on the
 // playground side. Offsets below are perpendicular trace units inward from the
 // slab edge; the measured profile is recorded in MODEL-SOURCES.md. The walk
 // ends at the timber platform and everything past it is planting.
 const edgeA=[1156,1028],edgeB=[1779,460],edgeLen=Math.hypot(edgeB[0]-edgeA[0],edgeB[1]-edgeA[1]);
 const edgeDir=[(edgeB[0]-edgeA[0])/edgeLen,(edgeB[1]-edgeA[1])/edgeLen],edgeIn=[edgeDir[1],-edgeDir[0]];
 const at=(t,off)=>[edgeA[0]+edgeDir[0]*edgeLen*t+edgeIn[0]*off,edgeA[1]+edgeDir[1]*edgeLen*t+edgeIn[1]*off];
 const band=(t0,t1,o0,o1)=>[at(t0,o0),at(t1,o0),at(t1,o1),at(t0,o1)];
 const eastPalette=[bloom,bloom,'leaf',rust,bloom,'leaflight',bloom,rust,sage,bloom,'leaf',bloom,rust,bloom];
 const playZones=[[1293,635,89],[1386,586,63]];
 const playClearance=(x,z,envelope)=>Math.min(...playZones.map(([cx,cz,r])=>Math.hypot(x-cx,z-cz)-r-envelope));
 // User correction: there is no second deck-side bed. One raised bed against the
 // glass railing; the walk runs out to meet its wall. User requests 2026-09-11:
 // no cross-access cuts, and it is merged into the playground planter below
 // (its band(.012,.86,10,31) outline), so no wall divides the two at t=.86.
 // User's red outline (2026-09-10 23:02): fill the turf gap and hug the play
 // circles, matching the rear planter. Preserve the straight boardwalk edge
 // and the existing square southwest return at t=.427.
 const arcPoints=(cx,cz,r,start,end,count)=>Array.from({length:count},(_,i)=>{const a=start+(end-start)*i/(count-1);return [cx+Math.cos(a)*r,cz+Math.sin(a)*r];});
 // Exact southeast intersection of the two coping circles. This is the join
 // between their exposed arcs; it avoids drawing a wall through either pad.
 const circleJoin=[1380.9243555860023,648.7952054999636];
 const tanJoinAngle=Math.atan2(circleJoin[1]-586,circleJoin[0]-1386);
 const blueJoinAngle=Math.atan2(circleJoin[1]-635,circleJoin[0]-1293);
 const startOnWalk=at(.427,83),blueAlong=(1293-edgeA[0])*edgeDir[0]+(635-edgeA[1])*edgeDir[1];
 const startAlong=.427*edgeLen,blueAcross=(1293-edgeA[0])*edgeIn[0]+(635-edgeA[1])*edgeIn[1];
 const startAcross=blueAcross-Math.sqrt(89*89-(startAlong-blueAlong)**2);
 const blueStart=at(.427,startAcross),blueStartAngle=Math.atan2(blueStart[1]-635,blueStart[0]-1293);
 // One continuous bed wraps the playground and reaches the northeast tip.
 // Only its exterior gets a rim; the former front/rear/wedge joins disappear.
 // Southwest end follows the angled terrace railing [1037,868]–edgeA, 1.9 units
 // inside it: half a post (.5) plus the rim's half-width (.09 m) touch the
 // railing without overlapping it.
 const railN=[160,-119].map(v=>v/Math.hypot(119,160)),dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
 const railEnd=o=>at((1.9-o*dot(edgeIn,railN))/dot(edgeDir,railN)/edgeLen,o);
 // The railing side is inset the same 1.9 units all the way to the tip: corner
 // b sits d1/d2 inside edges a-b and b-c (railings run with the slab on the left).
 const unit=(a,b)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]);return [(b[0]-a[0])/l,(b[1]-a[1])/l];};
 const insetCorner=(a,b,c,d1=1.9,d2=d1)=>{const u=unit(a,b),v=unit(b,c),p=[b[0]+u[1]*d1,b[1]-u[0]*d1],q=[b[0]+v[1]*d2,b[1]-v[0]*d2],s=((q[0]-p[0])*v[1]-(q[1]-p[1])*v[0])/(u[0]*v[1]-u[1]*v[0]);return [p[0]+u[0]*s,p[1]+u[1]*s];};
 const playgroundPlanter=[
  startOnWalk,at(.86,83),at(.86,31),railEnd(31),railEnd(1.9),
  insetCorner(edgeA,[1779,460],[1795,439]),insetCorner([1779,460],[1795,439],[1728,371]),
  insetCorner([1795,439],[1728,371],[1728,425],1.9,0),[1728,425],[1706,444],[1648,444],[1619,470],[1539,470],
  [1539,488],[1352,488],[1352,471],[1193,471],[1175.5,492],
  [1175.5,554.9],[1190,574],
  ...arcPoints(1293,635,89,-2.53,-1.1254717806294259,32),
  ...arcPoints(1386,586,63,-2.6212915134338948,tanJoinAngle,92).slice(1),
  ...arcPoints(1293,635,89,blueJoinAngle,blueStartAngle,24).slice(1)
 ];
 const playgroundTrees=[[1210,520],[1270,510],[1330,515],[1415,520],[1505,525],[1690,470],[1745,432]]
  .filter(([x,z])=>playClearance(x,z,.76/U)>0);
 southPlanter(playgroundPlanter,playgroundTrees,eastPalette,5,(x,z)=>playClearance(x,z,.19/U)>0);
 // The render carries a few small trees in the parapet-side bed.
 for(const t of [.28,.55,.8]){const [x,z]=world(at(t,20));slimTree(props,x,z,3.2,.62);}
 surface(band(.012,.86,35,83),paveGrey,.075);
 // Dark bench blocks alternate along the walk. Blocks 0 and 2 are skipped: 0
 // landed inside the fire-terrace round table's curved benches, 2 against the
 // three-bay pergola's corner post. The rest keep their spacing.
 for(let i=0;i<10;i++){if(i===0||i===2)continue;const t=.05+i*.078,off=i%2?38:80;line(at(t,off),at(t+.028,off),.42,metal,.5,.075);}
 const picnic=(x,z,rot=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rot);box(g,0,.675,0,2.35,.09,.9,'oak');for(const xx of [-.78,.78])box(g,xx,.315,0,.18,.63,.6,metal);for(const zz of [-.7,.7]){box(g,0,.395,zz,2.45,.09,.35,'oak');for(const xx of [-.78,.78])box(g,xx,.175,zz,.1,.35,.28,metal);}};
 // User correction: nothing sits under the northeast pergola — the picnic table
 // that stood at the end of the walk is removed.
 picnic(880,115,Math.PI/2);
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
 for(const z of bayZ){
  pergola(1086,z,BAY_W,BAY_D);
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
 // User correction: the southeast end lines up with the walk and the island-side
 // posts sit against the rim without overlapping it. Both hold only because the
 // island's rim edge above was squared perpendicular to the walk first: -.832 is
 // that perpendicular, so v (across the frame) no longer changes distance from the
 // walk and both end posts share one offset. Measured on the built geometry: end
 // post faces at offset 83.04 against a walk edge of 83, island-side post faces
 // 1.28-1.36 from the rim's centre line against a rim half-width of 1.23.
 const pergolaCenter=[1216.18,763],pergolaAngle=-.832,PU=71,PV=24;
 const pergolaAt=(u,v=0)=>[pergolaCenter[0]+Math.cos(pergolaAngle)*u+Math.sin(pergolaAngle)*v,pergolaCenter[1]-Math.sin(pergolaAngle)*u+Math.cos(pergolaAngle)*v];
 const [pgx,pgz]=world(pergolaCenter),playPergola=makeGroup(props,pgx,pgz,pergolaAngle);playPergola.name='Three-bay playground-side dining pergola';
 for(const u of [-PU,-25,25,PU])for(const v of [-PV,PV])box(playPergola,u*U,POST_H/2,v*U,.16,POST_H,.16,metal);
 for(const v of [-PV,PV])box(playPergola,0,POST_H+.01,v*U,2*PU*U+.22,.2,.18,metal);
 for(const u of [-PU,-25,25,PU])box(playPergola,u*U,POST_H+.01,0,.18,.2,2*PV*U+.22,metal);
 for(const bay of [-50,0,50])for(let u=-20;u<=20;u+=4)box(playPergola,(bay+u)*U,POST_H+.12,0,.075,.14,2*PV*U+.25,metal);
 const patioChair=(parent,x,z,rotation=0)=>{const g=makeGroup(parent,x,z,rotation);box(g,0,.43,0,.48,.1,.5,fireFrame);box(g,0,.72,-.22,.48,.52,.08,fireFrame);for(const sx of [-1,1])for(const sz of [-1,1])box(g,sx*.17,.18,sz*.17,.045,.35,.045,fireFrame);};
 // IMG_4009: each table sits across its bay, square to the three-bay run, not
 // end-to-end along it. User correction: the wall-side end chair now meets the
 // island rim. Its back reaches 24.6 trace units off the table centre and the
 // rim's outer face sits at v = 25.23, so the run is centred at v = .61 rather
 // than the old -10 — which also centres it between the two post lines.
 for(const u of [-50,0,50]){
  const [tx,tz]=world(pergolaAt(u,.61)),dining=makeGroup(props,tx,tz,pergolaAngle+Math.PI/2);dining.name='Timber dining table with individual dark chairs';
  box(dining,0,.77,0,2.1,.09,.9,'oak');for(const x of [-.78,.78])box(dining,x,.38,0,.09,.72,.68,metal);
  for(const x of [-.64,.64]){patioChair(dining,x,-.79,0);patioChair(dining,x,.79,Math.PI);}patioChair(dining,-1.34,0,Math.PI/2);patioChair(dining,1.34,0,-Math.PI/2);
 }
 // User correction: the island's walk-facing edge stopped 10-12 trace units
 // short of the boardwalk and sloped away from it. Both corners now sit at
 // offset 83, the walk's inner face, so the edge runs parallel to it.
 // The pergola beside it must be square to the walk and flush to this rim at
 // once, which the old [1151,741] corner made impossible: it left this edge
 // 2.1 degrees off perpendicular to the walk. Corner squared, keeping [1245,834]
 // where it already meets the walk.
 const island=[[1155.9,736.3],[1245,834],[1193,882],[1150,839]];
 // planter()'s coarse .32-radius clumps sit up to .66 m off their anchor, which
 // hung them over the paving outside the rim. The island keeps only its own
 // dense scatter below, inset from every edge.
 surface(island,stone,.06,.58);surface(island,soil,.66);
 // A continuous pale concrete rim follows the traced planter, enclosing the
 // dense low planting rather than leaving a bare soil wedge.
 for(let i=0;i<island.length;i++)line(island[i],island[(i+1)%island.length],.22,stone,.16,.64);
 const insideIsland=(x,z)=>{let inside=false;for(let i=0,j=island.length-1;i<island.length;j=i++){const [ax,az]=island[i],[bx,bz]=island[j];if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;}return inside;};
 // 6 trace units clears the widest planting offset (.19 m plus a .12 m mesh).
 const islandInset=(x,z,m)=>{if(!insideIsland(x,z))return false;
  for(let i=0,j=island.length-1;i<island.length;j=i++){const [ax,az]=island[i],[bx,bz]=island[j],dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz;
   const t=l2?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/l2)):0;
   if(Math.hypot(x-ax-t*dx,z-az-t*dz)<m)return false;}
  return true;};
 for(let x=1150;x<1250;x+=7)for(let z=738;z<884;z+=7)if(islandInset(x,z,6)){
  const [wx,wz]=world([x,z]);
  for(let i=0;i<4;i++){const a=i*1.57+x*.11+z*.07;mesh(props,new T.IcosahedronGeometry(.1+(i%2)*.055,0),i%3?'leaflight':flower,wx+Math.cos(a)*.19,.82+(i%2)*.06,wz+Math.sin(a)*.19,.75,.62,.75);}
 }
 const plantingClusters=[[1162,766],[1170,783],[1177,800],[1187,817],[1173,830],[1187,846]];
 for(const [px,pz] of plantingClusters){
  const [x,z]=world([px,pz]);
  for(let i=0;i<6;i++){const a=i*1.07+px*.09;mesh(props,new T.ConeGeometry(.045,.48+(i%3)*.08,5),i%3?'leaflight':flower,x+Math.cos(a)*.32,.9,z+Math.sin(a)*.26,.65,1,.65);}
  for(let i=0;i<3;i++){const a=i*2.1;mesh(props,new T.IcosahedronGeometry(.17+(i%2)*.07,0),i%2?flower:lavender,x+Math.cos(a)*.35,.88,z+Math.sin(a)*.28,.8,.75,.8);}
 }
 for(const [tx,tz] of [[1169,784],[1185,821]]){const [x,z]=world([tx,tz]);slimTree(props,x,z,2.8,.7);}
 // IMG_4010: these read as plain black boxes because the hood used the dark local
 // `metal`, not stainless. Rebuilt to the same idiom as the counter BBQs above —
 // stainless firebox and rounded lid, black fascia, steel knobs, dark cabinet.
 const compactGrill=(x,z,rotation=0)=>{const [a,b]=world([x,z]),g=makeGroup(props,a,b,rotation);g.name='Compact freestanding hood BBQ';
  box(g,0,.275,0,1.15,.55,.65,fireFrame);box(g,0,.585,0,1.2,.07,.69,counterStone);
  box(g,0,.72,0,1,.2,.6,'metal');
  cyl(g,0,.86,-.02,.24,1,'metal').rotation.z=Math.PI/2;
  box(g,0,.68,.31,1,.13,.035,'black');
  for(let i=0;i<4;i++)cyl(g,(i-1.5)*.19,.68,.34,.026,.045,'metal').rotation.x=Math.PI/2;
  rod(g,[-.34,1.03,.15],[.34,1.03,.15],.03,'black');
  for(const sx of [-.46,.46])for(const sz of [-.24,.24])cyl(g,sx,.07,sz,.065,.14,'black');
 };
 // User correction: compactGrill's controls sit on its local +z face. At
 // Math.PI/2 the west grill faced into the island wall, so it is turned 180.
 // The second stood inside the rim; backed out onto the paving until its rear
 // face meets the rim's outer face, matching how the west grill sits.
 compactGrill(1145,803,-Math.PI/2);compactGrill(1160,857,pergolaAngle);
 // IMG_4007/4042: the long east light-well edge is an emergency-stair block,
 // with a centred picnic table instead of the previously inferred round table.
 const stairTaupe=M('#57524d',.72),stairDoor=M('#45423e',.66),stairTrim=M('#77716a',.58);
 const stairCenter=[1059,570.5];
 B(stairCenter[0],stairCenter[1],42,135,3.12,stairTaupe);
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
 // Bocce lanes, low edging, cantilevered wall benches and festoon lighting.
 // IMG: the plank seats spring from the planter wall on a pale steel bracket and
 // cantilever over the turf; they are not freestanding benches out on the lawn.
 for(const z of [783,833])B(803,z,207,3,.03,mats.white,.08);
 // IMG_4018: the turf is a putting green and carries flush cups — a pale collar ring
 // with a dark hole inside. Positions read off the user's marked overhead against the
 // bench line (x=727/802/876) and the two lane lines (z=783/833). The hole is a
 // regulation 108 mm across, so the cup reads small against everything else here.
 for(const [x,z] of [[716,801],[805,821],[898,804]]){const [a,b]=world([x,z]);
  cyl(props,a,.085,b,.08,.01,'white');cyl(props,a,.091,b,.054,.01,'black');}
 for(const x of [727,802,876]){B(x,771,17,4,.44,mats.white,.02);B(x,773,23,8,.08,mats.oak,.46);}
 // Festoon poles alternate sides of the court — two standing in the planted edge and
 // one out on the far turf — so the strings cross the lanes instead of running down
 // the middle of them. One continuous run links all three.
 const festoon=[[727,751],[802,852],[876,751]];
 for(const [x,z] of festoon){const [a,b]=world([x,z]);cyl(props,a,1.65,b,.035,3.3,metal);}
 for(let s=0;s<2;s++){const p=festoon[s],q=festoon[s+1];line(p,q,.015,metal,.012,3.24);
  for(let i=1;i<12;i++){const t=i/12,[a,b]=world([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);cyl(props,a,3.2-Math.sin(t*Math.PI)*.28,b,.035,.06,'ivory');}}
 // Playground follows the built photograph: twin slides and faceted climbing pods.
 // West edge cut from x=1170 to 1175.5 to follow the east planter wall's line (user correction).
 // User requests 2026-09-11: the turf runs right to the walkway edge (offset 83)
 // up to the planter's start at t=.427, and on its west side out to the dining
 // pergola, just clear of its turf-side post faces (v=-25.23), from the walk-end
 // post line (u=72.23) to where that line meets the x=1175.5 west edge (u≈-88.2).
 surface([[1175.5,510.5],[1240,493],[1470,502],[1504,554],at(.427,83),pergolaAt(72.23,-25.3),pergolaAt(-88.2,-25.3)],grass,.08);
 const circle=(x,z,r,material,y=.11)=>{const [a,b]=world([x,z]);mesh(props,new T.CylinderGeometry(r*U,r*U,.04,64),material,a,y,b);};circle(1293,635,89,stone);circle(1293,635,86,rubber,.14);circle(1386,586,63,stone);circle(1386,586,60,tan,.17);
 const [px,pz]=world([1286,626]),[podX,podZ]=world([1386,586]);buildPlayground(props,px,pz,podX,podZ);
 // Change-room geometry is kept in its own module because the annotated fit-out
 // and photographed pool facade are substantially more detailed than this deck.
 const changeOutline=[[267,456],[283,456],[283,427],[429,427],[429,452],[461,452],[465,611],[267,611]];
 surface(changeOutline,mats.tilefloor,.06);const walls=new T.Group();props.add(walls);
 const walkModeWalls=new T.Group();walkModeWalls.name='Walk-mode full-height partitions';walkModeWalls.visible=false;
 buildChangeRoom({parent:props,walls,B,surface,world,mats,M,fenceGlass,gates:walkModeGates,tall:walkModeWalls});
 // IMG_3984/3985: flat turf and tan play circle, with a timber toddler house.
 surface([[662,112],[858,42],[914,104],[930,238],[845,238],[845,157],[698,157],[698,238],[662,238]],mats.woodfloor,.075);
 surface(rect(696,130,146,108),grass,.08);
 const [nx,nz]=world([759,180]);mesh(props,new T.CylinderGeometry(3.05,3.05,.035,64),stone,nx,.11,nz);mesh(props,new T.CylinderGeometry(2.9,2.9,.035,64),tan,nx,.145,nz);
 const house=makeGroup(props,nx,nz);house.name='North toddler playhouse';
 // IMG_4038/4040 (re-read September 11, 2026): an open gable shelter on navy
 // posts, ridge east–west, a "KIDS ONLY" board on both gables. The north side
 // carries the play counter (west half: table and disc stools outside, bench
 // inside) and a stepped timber board wall (east half); a double-sided activity
 // panel continues that line east on its own post, steering wheels facing the
 // house and an airplane graphic facing north. The south side is open, with the
 // oval Welcome sign on the southeast post and a black stovepipe on the south slope.
 const navy=M('#26404f'),signRed=M('#b8352c'),playBlue=M('#5cb3d0',.55),benchBlue=M('#a9d4e1',.5),wheelGrey=M('#6b7176',.4),timber=M('#b3804f',.7),cream=M('#e9dfc8',.7);
 const roofMats=[M('#b8804d',.7),M('#8e8272',.72),M('#c9975f',.7)],pad=.16,eave=1.62,ridge=2.32;
 const a=Math.atan2(ridge-eave,.85),L=Math.hypot(.85,ridge-eave),rb=Math.atan2(ridge-eave,.55);
 for(const [x,z] of [[-.8,.55],[.8,.55],[-.8,-.55],[0,-.55],[.8,-.55]])box(house,x,(pad+eave)/2,z,.08,eave-pad,.08,navy);
 for(const z of [-.55,.55])box(house,0,eave,z,1.68,.08,.08,navy);
 // Five planks per slope run along the ridge in alternating stains, with barge boards.
 for(const s of [-1,1]){
  for(let i=0;i<5;i++){const d=.11+i*.225;box(house,0,ridge-d*Math.sin(a),s*d*Math.cos(a),2.2,.035,.2,roofMats[(i+(s>0?0:1))%3]).rotation.x=s*a;}
  for(const x of [-1.1,1.1])box(house,x,ridge-.35,s*.425,.04,.12,L,timber).rotation.x=s*a;
 }
 box(house,0,ridge+.02,0,2.24,.05,.1,timber);
 const kids=canvasTexture((c,n)=>{c.fillStyle='#e9dfc8';c.fillRect(0,0,n,n);c.fillStyle='#b8352c';c.font=`bold italic ${n*.15}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('KIDS ONLY',n/2,n/2);});
 kids.repeat.set(1,.25);kids.offset.set(0,.375);const kidsMat=new T.MeshStandardMaterial({map:kids,roughness:.7});
 for(const s of [-1,1]){const x=s*.8;
  box(house,x,eave+.04,0,.06,.1,1.2,timber);
  for(const z of [-1,1])box(house,x,(eave+ridge)/2,z*.275,.05,.08,Math.hypot(.55,ridge-eave),timber).rotation.x=z*rb;
  box(house,x,ridge-.34,0,.035,.13,.46,cream);
  mesh(house,new T.PlaneGeometry(.44,.11),kidsMat,x+s*.02,ridge-.34,0).rotation.y=s*Math.PI/2;
 }
 {const x=-.5,z=.3,y=ridge-z*Math.tan(a);rod(house,[x,y-.05,z],[x,y+.3,z],.045,'black');rod(house,[x,y+.3,z],[x,y+.38,z-.07],.045,'black');cyl(house,x,y+.42,z-.07,.075,.04,'black');}
 // Counter: teal panel with raised ends, bench inside, oval table and disc stools outside.
 box(house,-.4,pad+.3,-.55,.72,.6,.045,playBlue);
 for(const x of [-.72,-.08])box(house,x,pad+.7,-.55,.12,.2,.045,playBlue);
 box(house,-.42,pad+.18,-.4,.66,.04,.26,benchBlue);
 mesh(house,new T.CylinderGeometry(.45,.45,.04,28),navy,-.48,pad+.44,-.86,1.1,1,.58);
 box(house,-.48,pad+.21,-.7,.06,.42,.24,navy);
 for(const [x,z] of [[-.9,-1.28],[-.2,-1.24]])cyl(house,x,pad+.08,z,.17,.16,playBlue);
 // Stepped timber board wall between the middle and northeast posts.
 [.95,1.12,1,1.18,.9,1.06,.98].forEach((h,i)=>box(house,.09+i*.104,pad+.06+h/2,-.55,.088,h,.035,[timber,'walnut','oak'][i%3]));
 for(const y of [pad+.25,pad+.9])box(house,.4,y,-.53,.78,.035,.015,navy);
 // Activity panel on its own post: wheels and dial icons south, airplane north.
 box(house,1.8,pad+.55,-.55,.08,1.1,.08,navy);
 box(house,1.3,pad+.5,-.55,.92,.84,.04,playBlue);
 for(const x of [1.08,1.48]){mesh(house,new T.TorusGeometry(.11,.018,8,20),wheelGrey,x,pad+.72,-.5);box(house,x,pad+.72,-.5,.2,.02,.02,wheelGrey);box(house,x,pad+.72,-.5,.02,.2,.02,wheelGrey);cyl(house,x,pad+.72,-.515,.03,.04,wheelGrey).rotation.x=Math.PI/2;}
 const decal=(draw,z,rot)=>{const t=canvasTexture((c,n)=>{c.clearRect(0,0,n,n);draw(c,n);});mesh(house,new T.PlaneGeometry(.88,.8),new T.MeshStandardMaterial({map:t,transparent:true,depthWrite:false,roughness:.6}),1.3,pad+.5,z).rotation.y=rot;};
 decal((c,n)=>{c.strokeStyle=c.fillStyle='#1f3a4a';c.lineWidth=n*.012;for(const x of [.2,.5,.8]){c.beginPath();c.arc(x*n,.72*n,n*.07,0,7);c.stroke();}c.beginPath();c.arc(.5*n,.72*n,n*.025,0,7);c.fill();for(const x of [.3,.45,.6,.75]){c.fillRect(x*n,.84*n,n*.012,n*.1);c.fillRect(x*n-n*.02,(.86+x*.06)*n,n*.052,n*.02);}},-.528,0);
 decal((c,n)=>{c.strokeStyle='#ffffff';c.lineWidth=n*.02;c.lineJoin='round';const P=[[.2,.55],[.45,.5],[.62,.3],[.68,.33],[.58,.52],[.8,.5],[.86,.42],[.9,.44],[.86,.6],[.58,.62],[.66,.8],[.6,.82],[.44,.64],[.2,.62]];c.beginPath();P.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x*n,y*n));c.closePath();c.stroke();for(const [x,y,r] of [[.25,.2,.06],[.33,.18,.08],[.42,.21,.05],[.72,.85,.05],[.8,.83,.07]]){c.beginPath();c.arc(x*n,y*n,r*n,Math.PI,0);c.stroke();}},-.572,Math.PI);
 // Oval double-sided Welcome sign on the southeast post.
 {const oval=(r,h,m)=>{mesh(house,new T.CylinderGeometry(r,r,h,32),m,.8,1.2,.6,1,1,1.6).rotation.x=Math.PI/2;};oval(.17,.018,navy);oval(.155,.022,cream);
  const w=canvasTexture((c,n)=>{c.clearRect(0,0,n,n);c.translate(n/2,n/2);c.rotate(-Math.PI/2);c.fillStyle='#1f3a4a';c.font=`600 ${n*.16}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('Welcome',0,0);});
  const wm=new T.MeshStandardMaterial({map:w,transparent:true,depthWrite:false});
  for(const s of [1,-1])mesh(house,new T.PlaneGeometry(.26,.44),wm,.8,1.2,.6+s*.013).rotation.y=s>0?0:Math.PI;}
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
 surface(rect(934,276,102,454),grass,-4.5);surface(rect(934,730,102,120),paveGrey,-4.5);
 for(const x of [934,1035])line([x,276],[x,850],4.4,metal,.18,-4.5);
 // User request 2026-09-11: close the well's north end, where the turf stopped
 // against open void. The south end keeps its low post row.
 line([934,276],[1035,276],4.4,metal,.18,-4.5);
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
  [[1037,868],[1156,1028]],[[1156,1028],[1779,460]],
  [[1779,460],[1795,439]],[[1795,439],[1728,371]],
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

 // Keep gate geometry independent so the walking view can open the entrances.
 for(const gate of walkModeGates){mergeRoomGeometry(gate);gate.removeFromParent();}
 mergeRoomGeometry(walls);walls.removeFromParent();mergeRoomGeometry(walkModeWalls);mergeRoomGeometry(props);props.add(walls,walkModeWalls,...walkModeGates);
 const navigation=createLevel6Navigation();
 navigation.blockedPolygons.push(playgroundPlanter.map(p=>new T.Vector2(...world(p))));
 root.updateMatrixWorld(true);return {root,roomGroups,floorMeshes,wallGroups,columnGroups,bounds:new T.Box3().setFromObject(root),mats,navigation,walkModeGates,walkModeWalls};
}

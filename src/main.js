import './style.css';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createClubModel } from './model.js';
import { rooms,categories,majorLabels,WALL_HEIGHT } from './rooms.js';

const $=id=>document.getElementById(id);
const svg=(paths)=>`<svg class="room-symbol" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const icons={
 Fitness:svg('<path d="M3 9v6m3-8v10m12-10v10m3-8v6M6 12h12"/>'),
 Wellness:svg('<path d="M3 15q3-4 6 0t6 0t6 0M3 20q3-4 6 0t6 0t6 0M8 11V4a2 2 0 0 1 4 0m4 7V4a2 2 0 0 1 4 0"/>'),
 Social:svg('<path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M4 12H2v7h20v-7h-2v4H4Zm1 7v2m14-2v2"/>'),
 Outdoor:svg('<path d="M12 21v-8m0 3C2 16 2 6 3 3c6 0 9 5 9 10 0-5 3-8 9-8 0 7-3 11-9 11Z"/>'),
 'Guest suites':svg('<path d="M3 18V6m0 8h18v7M3 18h18M6 14V9h5v5m0-4h7a3 3 0 0 1 3 3v1"/>'),
 Support:svg('<path d="M4 20V4h16v16Zm5 0v-6h6v6"/>')
};
const arrow='<svg class="room-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
const descriptions={
 gym:'Explore the main fitness floor, with strength equipment, free weights and cardio stations.',
 cardio:'The cardio area sits across the outdoor training turf from the main gym.',
 pool:'A 20 m, four-lane swimming pool alongside the smaller fun and hydrotherapy pools.',
 bowling:'Three lanes, seating and the adjoining amenity spaces, shown in a roofless cutaway.',
 court:'The multi-purpose sports court is at the east end of the wellness area.',
 turf:'An open-air training strip between the two fitness areas.',
 dog:'The outdoor dog park is shown as a separate island for easier exploration.',
 theatre:'A dedicated screening room with tiered seating.',
 sauna:'A timber-lined sauna beside the pool and change-room facilities.',
 steam:'A steam room beside the pool facilities.',
 kids:'A space for play, with representative furniture based on the supplied photographs.',
 guest:'Guest accommodation along the angled southern edge of the amenity floor.',
 terrace:'Outdoor seating connected to the Level 4 amenity spaces.',
 studySmall:'A small enclosed study space within the study centre.',
 study:'Shared work tables and quieter study spaces in the north part of the clubhouse.',
 yoga:'An open studio for stretching and movement.',
 billiards:'Billiard tables and seating in the north games room.',
 music:'A dedicated room for music, shown with a representative piano and seating.',
 workshop:'The workshop sits beside the cardio gym and sports court.',
};
let selected=null,photoIndex=0,model,renderer,scene,camera,controls,renderPending=false,tween=null,planView=false,labelsVisible=true;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile=()=>innerWidth<=760;
let visibleRoomIds=new Set(rooms.map(r=>r.id));
const labels=new Map();
const buttons=new Map();
const ray=new T.Raycaster(),mouse=new T.Vector2();
let vw=0,vh=0,frustumHeight=140;

for(const c of categories){const o=document.createElement('option');o.value=c;o.textContent=c;$('category').append(o);}
function renderList(){
 const query=$('search').value.trim().toLowerCase(),category=$('category').value;
 const matching=rooms.filter(r=>r.category!=='Support'&&(category==='All spaces'||r.category===category)&&`${r.name} ${r.category} ${r.id}`.toLowerCase().includes(query));
 visibleRoomIds=new Set(matching.map(r=>r.id));buttons.clear();$('room-list').replaceChildren();
 for(const r of matching){const b=document.createElement('button');b.className='room-item';b.dataset.roomId=r.id;b.setAttribute('aria-pressed',String(selected===r.id));
  b.innerHTML=icons[r.category]+'<span></span>'+arrow;b.querySelector('span').textContent=r.name;b.addEventListener('click',()=>selectRoom(r.id,true));$('room-list').append(b);buttons.set(r.id,b);}
 $('result-count').textContent=`${matching.length} ${matching.length===1?'space':'spaces'}`;$('empty').hidden=matching.length>0;requestRender();
}
function setBrowser(open){$('room-browser').classList.toggle('collapsed',!open);$('browser-toggle').setAttribute('aria-expanded',String(open));document.body.classList.toggle('browser-open',open&&isMobile());}
$('browser-toggle').addEventListener('click',()=>setBrowser($('browser-toggle').getAttribute('aria-expanded')!=='true'));
$('search').addEventListener('input',renderList);$('category').addEventListener('change',renderList);
setBrowser(!isMobile());renderList();

function updatePhoto(){const r=rooms.find(r=>r.id===selected);if(!r)return;const has=r.photos.length>0;$('photo-wrap').hidden=!has;$('no-photo').hidden=has;
 if(has){$('room-photo').src=`${import.meta.env.BASE_URL}photos/${r.photos[photoIndex]}.webp`;$('room-photo').alt=`Club Gilmore photo reference for ${r.name}`;$('photo-count').textContent=`Photo reference ${photoIndex+1} / ${r.photos.length}`;$('previous-photo').disabled=r.photos.length<2;$('next-photo').disabled=r.photos.length<2;}}
function selectRoom(id,fromList=false){
 const r=rooms.find(r=>r.id===id);if(!r)return;selected=id;photoIndex=0;
 document.body.classList.add('has-detail');$('detail').hidden=false;$('detail-name').textContent=r.name;$('detail-category').textContent=r.category;
 $('detail-description').textContent=descriptions[r.kind]||`Explore ${r.name.toLowerCase()} and its position on the amenity floor.`;
 $('detail-measure').hidden=!r.measurement;$('detail-measure').textContent=r.measurement||'';
 const validUrl=r.bookingUrl&&/^https:\/\//.test(r.bookingUrl);$('booking-link').hidden=!validUrl;$('booking-note').hidden=!!validUrl;
 if(validUrl)$('booking-link').href=r.bookingUrl;else $('booking-link').removeAttribute('href');
 updatePhoto();setBrowser(!isMobile());$('detail').scrollTop=0;
 for(const [rid,b] of buttons)b.setAttribute('aria-pressed',String(rid===id));
 if(model){for(const [rid,entry] of model.roomGroups){entry.outline.visible=rid===id;entry.floor.material.emissive.set(rid===id?0x6c5526:0x000000);entry.floor.material.emissiveIntensity=rid===id?.3:0;}
  updateViewOffset();frameRoom(id);
 }
 $('announcement').textContent=`Selected ${r.name}. Room details and ${r.photos.length} photo references available.`;
 if(fromList)$('detail-name').focus({preventScroll:true});
 // Stable, namespaced event for a future host integration. No booking request is sent.
 window.dispatchEvent(new CustomEvent('club-gilmore:room-selected',{detail:{roomId:id,name:r.name,bookingUrl:r.bookingUrl}}));
 history.replaceState(null,'',`${location.pathname}${location.search}#${encodeURIComponent(id)}`);
}
function closeDetail(reset=false){const previous=selected;selected=null;document.body.classList.remove('has-detail');$('detail').hidden=true;
 for(const b of buttons.values())b.setAttribute('aria-pressed','false');if(model)for(const e of model.roomGroups.values()){e.outline.visible=false;e.floor.material.emissive.set(0);}
 history.replaceState(null,'',location.pathname+location.search);updateViewOffset();if(reset)home();else requestRender();if(isMobile())$('browser-toggle').focus({preventScroll:true});else buttons.get(previous)?.focus({preventScroll:true});}
$('close-detail').addEventListener('click',()=>closeDetail(false));$('show-whole').addEventListener('click',()=>closeDetail(true));
$('previous-photo').addEventListener('click',()=>{const r=rooms.find(r=>r.id===selected);photoIndex=(photoIndex-1+r.photos.length)%r.photos.length;updatePhoto();});
$('next-photo').addEventListener('click',()=>{const r=rooms.find(r=>r.id===selected);photoIndex=(photoIndex+1)%r.photos.length;updatePhoto();});
$('about-button').addEventListener('click',()=>$('about').showModal());$('close-about').addEventListener('click',()=>$('about').close());
$('about').addEventListener('click',e=>{if(e.target===$('about')){const b=$('about').getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)$('about').close();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected&&!$('about').open)closeDetail(false);});

function requestRender(){if(!renderer||renderPending)return;renderPending=true;requestAnimationFrame(render);}
function updateViewOffset(){if(!camera)return;
 const left=isMobile()?0:innerWidth<=1100?256:306,right=!isMobile()&&selected?(innerWidth<=1100?306:352):0;
 const top=isMobile()?92:85,bottom=isMobile()?(selected?vh*.51+30:150):88;
 camera.setViewOffset(vw,vh,-(left-right)/2,-(top-bottom)/2,vw,vh);camera.updateProjectionMatrix();
 return {width:Math.max(160,vw-left-right-65),height:Math.max(140,vh-top-bottom-30)};
}
function frameBounds(bounds,instant=false,actualPoints=null){if(!camera)return;const center=bounds.getCenter(new T.Vector3());center.y=0;
 const direction=planView?new T.Vector3(0,1,.0001):new T.Vector3(isMobile()?.13:.42,1.95,1).normalize();
 const to=center.clone().add(direction.multiplyScalar(170));
 const temp=new T.OrthographicCamera();temp.position.copy(to);temp.up.set(0,1,0);temp.lookAt(center);temp.updateMatrixWorld();
 const right=new T.Vector3().setFromMatrixColumn(temp.matrixWorld,0),up=new T.Vector3().setFromMatrixColumn(temp.matrixWorld,1);
 const corners=[];if(actualPoints){for(const [x,z] of actualPoints)for(const y of [0,3])corners.push(new T.Vector3(x,y,z).sub(center));}else for(const x of [bounds.min.x,bounds.max.x])for(const y of [0,3])for(const z of [bounds.min.z,bounds.max.z])corners.push(new T.Vector3(x,y,z).sub(center));
 const xp=corners.map(c=>c.dot(right)),yp=corners.map(c=>c.dot(up));const sx=Math.max(...xp)-Math.min(...xp),sy=Math.max(...yp)-Math.min(...yp);
 const horizontalShift=(Math.max(...xp)+Math.min(...xp))/2,verticalShift=(Math.max(...yp)+Math.min(...yp))/2;
 const shift=right.clone().multiplyScalar(horizontalShift).addScaledVector(up,verticalShift);center.add(shift);to.add(shift);
 const available=updateViewOffset();const zoom=Math.min((camera.right-camera.left)*available.width/vw/Math.max(sx*1.08,7),frustumHeight*available.height/vh/Math.max(sy*1.08,7));
 if(instant||reduceMotion){camera.position.copy(to);controls.target.copy(center);camera.zoom=T.MathUtils.clamp(zoom,.35,12);camera.updateProjectionMatrix();controls.update();requestRender();return;}
 tween={start:performance.now(),from:camera.position.clone(),to,fromTarget:controls.target.clone(),target:center,fromZoom:camera.zoom,zoom:T.MathUtils.clamp(zoom,.35,12)};requestRender();
}
function frameRoom(id,instant=false){const e=model.roomGroups.get(id);const b=new T.Box3().setFromPoints(e.poly.map(([x,z])=>new T.Vector3(x,0,z)));frameBounds(b,instant);}
function home(instant=false){if(!model)return;frameBounds(model.bounds,instant,[...model.roomGroups.values()].flatMap(e=>e.poly));}
function setView(plan){if(!controls)return;planView=plan;$('view-plan').setAttribute('aria-pressed',String(plan));$('view-3d').setAttribute('aria-pressed',String(!plan));controls.enableRotate=!plan;selected?frameRoom(selected):home();}
$('view-plan').addEventListener('click',()=>setView(true));$('view-3d').addEventListener('click',()=>setView(false));
$('reset').addEventListener('click',()=>{if(selected)closeDetail(false);home();});
function zoomBy(factor){if(!camera)return;tween=null;camera.zoom=T.MathUtils.clamp(camera.zoom*factor,.35,12);camera.updateProjectionMatrix();requestRender();}
$('zoom-in').addEventListener('click',()=>zoomBy(1.3));$('zoom-out').addEventListener('click',()=>zoomBy(1/1.3));
$('walls').addEventListener('click',()=>{if(!model)return;const full=$('walls').getAttribute('aria-pressed')!=='true';$('walls').setAttribute('aria-pressed',String(full));$('walls').setAttribute('aria-label',full?'Lower walls for cutaway view':'Raise walls to 3 metres');$('walls').title=full?'Lower walls':'Raise walls';[...model.wallGroups,...model.columnGroups].forEach(g=>g.scale.y=full?1:1.1/WALL_HEIGHT);requestRender();});
$('label-toggle').addEventListener('click',()=>{labelsVisible=!labelsVisible;$('label-toggle').setAttribute('aria-pressed',String(labelsVisible));$('label-toggle').setAttribute('aria-label',labelsVisible?'Hide room labels':'Show room labels');requestRender();});

function updateLabels(){if(!model)return;const placed=[];
 for(const [id,el] of labels){const entry=model.roomGroups.get(id),p=entry.center.clone();p.y=1.4;p.project(camera);const x=(p.x*.5+.5)*vw,y=(-p.y*.5+.5)*vh;
  const visible=labelsVisible&&visibleRoomIds.has(id)&&p.z>-1&&p.z<1&&x>20&&x<vw-20&&y>80&&y<vh-100&&(!selected||selected===id);
  const overlap=placed.some(([xx,yy])=>Math.abs(xx-x)<105&&Math.abs(yy-y)<27);el.hidden=!visible||overlap;
  if(!el.hidden){el.style.left=`${x}px`;el.style.top=`${y}px`;el.classList.toggle('selected',selected===id);placed.push([x,y]);}
 }
 const heading=controls.getAzimuthalAngle();$('compass-arrow').style.transform=`rotate(${-heading*180/Math.PI}deg)`;
 const pixelsPerMetre=vw*camera.zoom/(camera.right-camera.left);const scaleLength=[.5,1,2,5,10,20,50].filter(n=>n*pixelsPerMetre<=85).at(-1)||.5;
 $('scale-bar').style.width=`${scaleLength*pixelsPerMetre}px`;$('scale-distance').textContent=`${scaleLength} m`;
}
function render(time){renderPending=false;if(!renderer)return;
 if(tween){const t=Math.min(1,(time-tween.start)/650),e=1-Math.pow(1-t,4);camera.position.lerpVectors(tween.from,tween.to,e);controls.target.lerpVectors(tween.fromTarget,tween.target,e);camera.zoom=T.MathUtils.lerp(tween.fromZoom,tween.zoom,e);camera.updateProjectionMatrix();if(t===1)tween=null;else requestRender();}
 controls.update();renderer.render(scene,camera);updateLabels();
}
function resize(){if(!renderer)return;vw=$('viewport').clientWidth;vh=$('viewport').clientHeight;renderer.setSize(vw,vh);camera.left=-frustumHeight*vw/vh/2;camera.right=frustumHeight*vw/vh/2;camera.top=frustumHeight/2;camera.bottom=-frustumHeight/2;updateViewOffset();requestRender();}

async function initialize(){try{
 scene=new T.Scene();scene.background=new T.Color('#202c36');
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
 renderer.domElement.setAttribute('aria-label','3D model. Use the room list to select spaces, or arrow keys to pan.');renderer.domElement.tabIndex=0;$('scene').append(renderer.domElement);
 camera=new T.OrthographicCamera(-100,100,70,-70,.1,650);camera.position.set(70,140,100);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.13;controls.minZoom=.35;controls.maxZoom=12;controls.maxPolarAngle=Math.PI*.44;controls.minPolarAngle=.001;controls.target.set(0,0,0);controls.screenSpacePanning=true;controls.listenToKeyEvents(renderer.domElement);
 controls.addEventListener('change',requestRender);controls.addEventListener('start',()=>{tween=null;$('hover-label').hidden=true;});
 scene.add(new T.HemisphereLight('#e7f2ff','#a49a81',1.6));const sun=new T.DirectionalLight('#fff3d8',2.4);sun.position.set(-55,110,50);sun.castShadow=true;sun.shadow.mapSize.set(isMobile()?2048:4096,isMobile()?2048:4096);Object.assign(sun.shadow.camera,{left:-110,right:110,top:110,bottom:-110,near:1,far:250});sun.shadow.normalBias=.035;sun.shadow.bias=-.00008;sun.shadow.radius=3;scene.add(sun);
 const fill=new T.DirectionalLight('#d4e8f1',1.1);fill.position.set(80,60,-75);scene.add(fill);
 // Yield once so the loading state is visible during geometry creation.
 await new Promise(resolve=>requestAnimationFrame(resolve));
 model=createClubModel();scene.add(model.root);[...model.wallGroups,...model.columnGroups].forEach(g=>g.scale.y=1.1/WALL_HEIGHT);
 const ground=new T.Mesh(new T.PlaneGeometry(700,700),new T.MeshStandardMaterial({color:'#1b252e',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.43;ground.receiveShadow=true;scene.add(ground);
 for(const id of majorLabels){const r=rooms.find(r=>r.id===id),el=document.createElement('span');el.className='model-label';el.textContent=r.name==='Indoor pool & hydrotherapy'?'Indoor pools':r.name;$('labels').append(el);labels.set(id,el);}
 new ResizeObserver(resize).observe($('viewport'));resize();home(true);
 let down=null,pointerCount=0;
 renderer.domElement.addEventListener('pointerdown',e=>{pointerCount++;down=pointerCount===1?{x:e.clientX,y:e.clientY,id:e.pointerId}:null;});
 renderer.domElement.addEventListener('pointercancel',()=>{pointerCount=Math.max(0,pointerCount-1);down=null;});
 renderer.domElement.addEventListener('pointerup',e=>{pointerCount=Math.max(0,pointerCount-1);if(!down||e.pointerId!==down.id||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5||e.button!==0){down=null;return;}down=null;const hit=pick(e);if(hit)selectRoom(hit.object.userData.roomId);});
 function pick(e){const b=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(mouse,camera);return ray.intersectObjects(model.floorMeshes,false)[0];}
 renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||e.buttons){$('hover-label').hidden=true;return;}const hit=pick(e);renderer.domElement.style.cursor=hit?'pointer':'grab';if(hit){const r=rooms.find(r=>r.id===hit.object.userData.roomId);$('hover-label').textContent=r.name;const b=$('viewport').getBoundingClientRect();$('hover-label').style.left=`${Math.min(e.clientX-b.left+14,vw-210)}px`;$('hover-label').style.top=`${e.clientY-b.top+15}px`;$('hover-label').hidden=false;}else $('hover-label').hidden=true;});
 renderer.domElement.addEventListener('pointerleave',()=>{$('hover-label').hidden=true;});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('webgl-error').hidden=false;});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{$('webgl-error').hidden=true;requestRender();});
 $('loading').hidden=true;
 const initial=decodeURIComponent(location.hash.slice(1));if(rooms.some(r=>r.id===initial))selectRoom(initial);
 // Read-only evidence interface plus explicit actions for browser QA and export.
 window.clubGilmore={model,scene,camera,controls,renderer,rooms,selectRoom,home,requestRender,get selectedRoomId(){return selected;},get ready(){return true;}};
 requestRender();
 }catch(error){console.error(error);$('loading').hidden=true;$('webgl-error').hidden=false;for(const id of ['download','view-3d','view-plan','zoom-in','zoom-out','reset','walls','label-toggle'])$(id).disabled=true;}
}

$('download').addEventListener('click',async()=>{
 if(!model)return;const b=$('download');b.disabled=true;const old=b.innerHTML;b.textContent='Preparing model…';
 try{const exporter=new GLTFExporter();model.root.updateMatrixWorld(true);const result=await exporter.parseAsync(model.root,{binary:true,onlyVisible:true,maxTextureSize:1024});
  const url=URL.createObjectURL(new Blob([result],{type:'model/gltf-binary'})),a=document.createElement('a');a.href=url;a.download='Club-Gilmore-Level-4.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);$('announcement').textContent='3D model downloaded.';
 }catch(e){console.error(e);$('announcement').textContent='The model could not be exported. Please try again.';}finally{b.disabled=false;b.innerHTML=old;}
});
initialize();

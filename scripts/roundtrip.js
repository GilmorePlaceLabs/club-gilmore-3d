import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export async function checkExport(){
 const g=await new GLTFLoader().loadAsync('/Club-Gilmore-Level-4.glb');
 let water;g.scene.traverse(o=>{if(o.userData.lengthMetres===20)water=o;});
 return {children:g.scene.children.length,pool:water?new T.Box3().setFromObject(water).getSize(new T.Vector3()).toArray():null};
}

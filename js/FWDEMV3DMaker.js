/**
 * Easy 3D Model Viewer v:1.0
 * 3D Marker.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import * as THREE from 'three';
import FWDEMVEventDispather from "./FWDEMVEventDispather";

export default class FWDEMV3DMaker extends FWDEMVEventDispather{


     /**
     * Initialize
     */
     constructor(
        marker,
        scene
     ){
        super();

        this.id = marker.id;
        this.scene = scene;

        this.teweenScaleObj = {value:0};

        this.polygonOffsetAlpha = marker.markerPolygonOffsetAlpha;
       
        this.polygonOffsetUnits = marker.polygonOffsetUnits;
        this.marker3dPosition = marker.marker3dPosition;
        this.markerShowAndHideAnimationType = marker.markerShowAndHideAnimationType;
        this.markerScale = marker.markerScale;

        this.isPointer = marker.isPointer;

        this.borderTexture = marker.borderTexture;
        this.borderTexture.needsUpdate = true;

        this.backgroundTexture = marker.backgroundTexture;
        this.backgroundTexture.needsUpdate = true;

        this.iconTexture = marker.iconTexture;
        this.iconTexture.needsUpdate = true;

        this.rewindIconTexture = marker.rewindIconTexture;
        this.rewindIconTexture.needsUpdate = true;
        
        this.borderColor = new THREE.Color(marker.borderColor);
        this.borderSelctedColor = new THREE.Color(marker.borderSelctedColor);
        this.borderTweenColor = new THREE.Color();
        
        this.backgroundColor = new THREE.Color(marker.backgroundColor);
        this.backgroundSelectedColor = new THREE.Color(marker.backgroundSelectedColor);
        this.backgroundTweenColor = new THREE.Color();

        this.iconColor = new THREE.Color(marker.iconColor);
        this.iconSelectedColor = new THREE.Color(marker.iconSelectedColor);
        this.iconTweenColor = new THREE.Color();


        // Setup main containers.
        this.setupMainContainers();
        this.setNormalState();


        // Hide marker first time.
        this.meshesHolder.position.x = -200000;
        if(this.markerShowAndHideAnimationType == 'scale'){
            this.meshesHolder.scale.set(0, 0, 0);
        }else{
            this.backgroundMesh.material.opacity = 0;
            this.borderMesh.material.opacity = 0;
            this.iconMesh.material.opacity = 0;
        }

        setTimeout(()=>{
            this.iconWidth = marker.totalWidth;
            this.iconHeight = marker.totalHeight;
        }, 351);
     }

     setInitialPostionAndScale(rendererHeight){

        // Set postion.
        this.screen.position.copy(this.marker3dPosition);
       
        // Pointer
        let desiredWidth = 21; // 24px
        let desiredHeight = 21; // 24px

        if(this.isPointer){
            desiredWidth = 21; // 24px
            desiredHeight = 54; // 31px
        }

        // Convert the desired size from pixels to world space
        var worldSizeX = ((desiredWidth / 1) /rendererHeight) ;
        var worldSizeY = ((desiredHeight / 1) /rendererHeight) ;
      
        this.screen.scale.set(worldSizeX * this.markerScale, worldSizeY * this.markerScale, 1);

        setTimeout(()=>{
            this.initialScale = this.screen.scale.clone();  
            this.meshesHolder.position.x = 0;
        }, 10);
       
        this.setIntialScale = true;
     }

     updateScale(scaleOffset, cameraDistance){
     
        if(this.initialScale){
            this.screen.scale.set(this.initialScale.x * scaleOffset, this.initialScale.y * scaleOffset, 1);

            if(this.prevCameraDistance != cameraDistance){
              
                const polygonOffsetUnits = Math.round(this.polygonOffsetUnits * cameraDistance)
               
                this.backgroundMesh.material.polygonOffsetUnits = polygonOffsetUnits;
                this.borderMesh.material.polygonOffsetUnits = polygonOffsetUnits;
                this.iconMesh.material.polygonOffsetUnits = polygonOffsetUnits;
                this.rewindIconMesh.material.polygonOffsetUnits = polygonOffsetUnits;

                this.backgroundTransparentMesh.material.polygonOffsetUnits = polygonOffsetUnits;
                this.borderTransparentMesh.material.polygonOffsetUnits = polygonOffsetUnits;
                this.iconTransparentMesh.material.polygonOffsetUnits = polygonOffsetUnits;
                this.rewindIconTransparentMesh.material.polygonOffsetUnits = polygonOffsetUnits;
            }
           this.prevCameraDistance = cameraDistance;
        }
     }


     /**
      * Setup main containers.
      */
     setupMainContainers(){
        
        // Normal meshes.
        const backgroundMaterial = new THREE.SpriteMaterial({
            map: this.backgroundTexture,
            toneMapped: false,
            sizeAttenuation: false,
            alphaTest: 0.1,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits
        });
        this.backgroundMesh = new THREE.Sprite(backgroundMaterial);
        this.backgroundMesh.castShadow = false;
        this.backgroundMesh.recieveShadow = false;

        const borderMaterial = new THREE.SpriteMaterial({
            map: this.borderTexture,
            toneMapped: false,
            sizeAttenuation: false,
            alphaTest: 0.5,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
        });
        this.borderMesh = new THREE.Sprite(borderMaterial);
        this.borderMesh.castShadow = false;
        this.borderMesh.recieveShadow = false;

        const iconMaterial = new THREE.SpriteMaterial({
            map: this.iconTexture,
            toneMapped: false,
            sizeAttenuation: false,
            alphaTest: 0.5,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
        });
        this.iconMesh = new THREE.Sprite(iconMaterial);
        this.iconMesh.castShadow = false;
        this.iconMesh.recieveShadow = false;

        const rewindIconMaterial = new THREE.SpriteMaterial({
            map: this.rewindIconTexture,
            toneMapped: false,
            sizeAttenuation: false,
            alphaTest: 0.5,
            transparent: true,
            polygonOffset: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
            epthWrite: false
        });
        this.rewindIconMesh = new THREE.Sprite(rewindIconMaterial);
        this.rewindIconMesh.castShadow = false;
        this.rewindIconMesh.recieveShadow = false;
    

        // Transparent mesh.
        const backgroundTransparentMaterial = new THREE.SpriteMaterial ({
            map: this.backgroundTexture,
            toneMapped: false,
            sizeAttenuation: false,
            depthFunc: THREE.GreaterDepth,
            opacity: this.polygonOffsetAlpha,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
            depthWrite: false
        });
        this.backgroundTransparentMesh = new THREE.Sprite(backgroundTransparentMaterial);
        this.backgroundTransparentMesh.castShadow = false;
        this.backgroundTransparentMesh.recieveShadow = false;

        const borderTransparentMaterial = new THREE.SpriteMaterial({
            map: this.borderTexture,
            toneMapped: false,
            sizeAttenuation: false,
            depthFunc: THREE.GreaterDepth,
            opacity: this.polygonOffsetAlpha,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
            depthWrite: false
        });
        this.borderTransparentMesh = new THREE.Sprite(borderTransparentMaterial);
        this.borderTransparentMesh.castShadow = false;
        this.borderTransparentMesh.recieveShadow = false;

        const iconTransparentMaterial = new THREE.SpriteMaterial({
            map: this.iconTexture,
            toneMapped: false,
            sizeAttenuation: false,
            depthFunc: THREE.GreaterDepth,
            opacity: this.polygonOffsetAlpha,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
            depthWrite: false
        });
        this.iconTransparentMesh = new THREE.Sprite(iconTransparentMaterial);
        this.iconTransparentMesh.castShadow = false;
        this.iconTransparentMesh.recieveShadow = false;

        const rewindIconTransparentMaterial = new THREE.SpriteMaterial({
            map: this.rewindIconTexture,
            toneMapped: false,
            sizeAttenuation: false,
            depthFunc: THREE.GreaterDepth,
            opacity: .2,
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: this.polygonOffsetUnits,
            depthWrite: false
        });
        this.rewindIconTransparentMesh = new THREE.Sprite(rewindIconTransparentMaterial);
        this.rewindIconTransparentMesh.castShadow = false;
        this.rewindIconTransparentMesh.recieveShadow = false;


        // Create group holder and add meshes.
        this.screen = new THREE.Group();
        this.meshesHolder = new THREE.Group();

        this.meshesHolder.add(this.backgroundTransparentMesh);
        this.meshesHolder.add(this.borderTransparentMesh);
        this.meshesHolder.add(this.iconTransparentMesh);
        
        
        this.meshesHolder.add(this.backgroundMesh);
        this.meshesHolder.add(this.borderMesh);
        this.meshesHolder.add(this.iconMesh);
        
        this.screen.add(this.meshesHolder);
    }


    /**
     * Show/hide rewind.
     */
    showRewind(){
        this.meshesHolder.remove(this.iconTransparentMesh);
        this.meshesHolder.remove(this.iconMesh);

        this.meshesHolder.add(this.rewindIconTransparentMesh);
        this.meshesHolder.add(this.rewindIconMesh);
        this.hasRewind = true;
    }

    hideRewind(){
        this.meshesHolder.add(this.iconTransparentMesh);
        this.meshesHolder.add(this.iconMesh);

        this.meshesHolder.remove(this.rewindIconTransparentMesh);
        this.meshesHolder.remove(this.rewindIconMesh);
        this.hasRewind = false;
    }

    /**
     * Set normal/selected state.
     */
     setNormalState(animate){
        this.isSelected = false;
        let tweenDuration = .8;
        
        if(!animate){
            tweenDuration = 0.001;
        }

        FWDAnimation.killTweensOf(this.borderTweenColor);
        FWDAnimation.to(this.borderTweenColor, tweenDuration, {
            r: this.borderColor.r, 
            g: this.borderColor.g,
            b: this.borderColor.b,
            a: this.borderColor.a,
            ease:Quint.easeOut,
            onUpdate: () =>{
                this.borderMesh.material.color = this.borderTweenColor;
                this.borderTransparentMesh.material.color = this.borderTweenColor;
            }
        });
    
        FWDAnimation.killTweensOf(this.backgroundTweenColor);
        FWDAnimation.to(this.backgroundTweenColor, tweenDuration, {
            r: this.backgroundColor.r, 
            g: this.backgroundColor.g,
            b: this.backgroundColor.b,
            ease:Quint.easeOut,
            onUpdate: () =>{
                this.backgroundMesh.material.color = this.backgroundTweenColor;
                this.backgroundTransparentMesh.material.color = this.backgroundTweenColor;
            }
        });

        FWDAnimation.killTweensOf(this.iconTweenColor);
        FWDAnimation.to(this.iconTweenColor, tweenDuration, {
            r: this.iconColor.r, 
            g: this.iconColor.g,
            b: this.iconColor.b,
            ease:Quint.easeOut,
            onUpdate: () =>{
                this.iconMesh.material.color = this.iconTweenColor
                this.iconTransparentMesh.material.color = this.iconTweenColor;
                this.rewindIconMesh.material.color = this.iconTweenColor;
            }
        });
     }

     setSelectedState(animate){
        this.isSelected = true;
        let tweenDuration = .8;

        if(!animate){
            tweenDuration = 0.001;
        }

        FWDAnimation.killTweensOf(this.borderTweenColor);
        FWDAnimation.to(this.borderTweenColor, tweenDuration, {
            r: this.borderSelctedColor.r, 
            g: this.borderSelctedColor.g,
            b: this.borderSelctedColor.b,
            ease:Quint.easeOut,
            onUpdate: () =>{
                this.borderMesh.material.color = this.borderTweenColor;
                this.borderTransparentMesh.material.color = this.borderTweenColor;
            }
        });

        FWDAnimation.killTweensOf(this.backgroundTweenColor);
        FWDAnimation.to(this.backgroundTweenColor, tweenDuration, {
            r: this.backgroundSelectedColor.r, 
            g: this.backgroundSelectedColor.g,
            b: this.backgroundSelectedColor.b,
            ease:Quint.easeOut,
            onUpdate: () =>{
                this.backgroundMesh.material.color = this.backgroundTweenColor;
                this.backgroundTransparentMesh.material.color = this.backgroundTweenColor;
            }
        });

        FWDAnimation.killTweensOf(this.iconTweenColor);
        FWDAnimation.to(this.iconTweenColor, tweenDuration, {
            r: this.iconSelectedColor.r, 
            g: this.iconSelectedColor.g,
            b: this.iconSelectedColor.b,
            ease:Quint.easeOut,
            onUpdate: () =>{
                this.iconMesh.material.color = this.iconTweenColor;
                this.rewindIconMesh.material.color = this.iconTweenColor;
            }
        });
     }


    /**
     * Show/hide.
     */
    hide(){
        
        if(this.isShowed === false || !this.setIntialScale) return;
        this.isShowed = false;
       
        if(this.markerShowAndHideAnimationType == 'scale'){
            FWDAnimation.killTweensOf(this.teweenScaleObj);
            FWDAnimation.to(this.teweenScaleObj, .1, {value:0, ease: Quint.easeOut, onUpdate:()=>{
                this.meshesHolder.scale.set(this.teweenScaleObj.value, this.teweenScaleObj.value, this.teweenScaleObj.value);
            }});
        }else{
            FWDAnimation.to(this.backgroundMesh.material, .4, {opacity:0,  ease:Quint.easeOut});
            FWDAnimation.to(this.borderMesh.material, .4, {opacity:0,  ease:Quint.easeOut});
            FWDAnimation.to(this.iconMesh.material, .4, {opacity:0,  ease:Quint.easeOut});
        }
    }   

    show(){
        if(this.isShowed === true) return;
        this.isShowed = true;

        if(this.markerShowAndHideAnimationType == 'scale'){
            FWDAnimation.killTweensOf(this.teweenScaleObj);
            FWDAnimation.to(this.teweenScaleObj, .85, {value:1, delay: .1 + Math.random() * .2, ease:Elastic.easeOut, onUpdate:()=>{
                this.meshesHolder.scale.set(this.teweenScaleObj.value, this.teweenScaleObj.value, this.teweenScaleObj.value);
            }});
        }else{

            FWDAnimation.to(this.backgroundMesh.material, .9, {opacity: 1,  delay: .1 + Math.random() * .2, ease:Quint.easeOut});
            FWDAnimation.to(this.borderMesh.material, .9, {opacity: 1,  delay: .1 + Math.random() * .2, ease:Quint.easeOut});
            FWDAnimation.to(this.iconMesh.material, .9, {opacity: 1, delay: .1 + Math.random() * .2, ease:Quint.easeOut});
        }
    }   

    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;

        if(this.borderTweenColor){
            FWDAnimation.killTweensOf(this.borderTweenColor);
            FWDAnimation.killTweensOf(this.backgroundTweenColor);
            FWDAnimation.killTweensOf(this.iconTweenColor);
        }
        
        if(this.backgroundMesh){
            FWDAnimation.killTweensOf(this.backgroundMesh.material);
            FWDAnimation.killTweensOf(this.borderMesh.material);
            FWDAnimation.killTweensOf(this.iconMesh.material);
        }
    }
}

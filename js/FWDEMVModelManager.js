/**
 * Easy 3D Model Viewer v:1.0
 * Model manager.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import * as THREE from 'three';
import {
    AmbientLight,
    AnimationMixer,
    AxesHelper,
    Box3,
    DirectionalLight,
    GridHelper,
    LoadingManager,
    PMREMGenerator,
    PerspectiveCamera,
    Scene,
    SkeletonHelper,
    Vector3,
    WebGLRenderer,
} from 'three';

import {
    computeBoundsTree,
    disposeBoundsTree,
    acceleratedRaycast} from "three-mesh-bvh";
    
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { GUI } from "dat.gui";
import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVInfoWindow from "./FWDEMVInfoWindow";
import FWDEMVUtils from "./FWDEMVUtils";
import FWDEMVMarker from "./FWDEMVMarker";
import FWDEMVMarkerToolTip from './FWDEMVMarkerToolTip';
import FWDEMV3DMaker from './FWDEMV3DMaker';
import FWDEMVConsole from './FWDEMVConsole';

const DEFAULT_CAMERA = '[default]';

const MANAGER = new LoadingManager();
const DRACO_LOADER = new DRACOLoader(MANAGER).setDecoderPath('node_modules/three/examples/jsm/libs/draco/gltf/');
const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath('node_modules/three/examples/jsm/libs/basis/');


export default class FWDEMVModelManager extends FWDEMVDisplayObject{

    static ERROR = 'error';
    static START_TO_LOAD = 'startToLoad';
    static LOAD_PROGRESS = 'loadProgress;'
    static LOAD_COOMPLETE = 'loadComplete';
    static FIRST_IMAGE_LOADED = 'firstImageLoaded';
    static TEXTURES_LOADED = 'texturesLoaded';
    static ANIMATION_START = 'animationStart';
    static ANIMATION_FINISHED = 'animationFinised';
    static PAUSE_AUTO_ROTATE = 'pauseAutoRotate';
    static PLAY_AUTO_ROTATE = 'playAutoRotate';
    static SET_CAMERA_POSITION = 'setCameraPOsition';
    static SET_MARKER_OR_CAMERA_POSITION = 'getMarkerOrCameraPosition';
    static SHOW_INFO_WINDOW = 'showInfoWindow';


    /*
     * Initialize
     */
    constructor(prt){
        
        super();

        THREE.ColorManagement.enabled = true;

        this.prt = prt;
        this.data = this.prt.data;
        this.width = this.prt.width;
        this.height = this.prt.height;
        this.backgroundColor = this.data.backgroundColor;
        this.showAnimationIntro = this.data.showAnimationIntro;
        this.cameraPositionStartX = this.data.cameraPositionStartX || 0;
        this.cameraPositionStartY = this.data.cameraPositionStartY || 0;
        this.cameraPositionStartZ = this.data.cameraPositionStartZ || 1;
        this.fontIcon = prt.fontIcon;
        this.showMarkerTool = this.data.showMarkerTool;
        this.hideMarkersWhenCameraIsAnimating = this.data.hideMarkersWhenCameraIsAnimating;
        this.showCameraPositionTool = this.data.showCameraPositionTool;
        this.screen.className = 'fwdemv-model-manager';
        
        
        // 3D.
        this.camera = DEFAULT_CAMERA;
        this.lights = [];
        this.model = null;
        this.mixer = null;
        this.clips = [];
        this.clock = new THREE.Clock();
        this.current = 0;
        this.elapsedTime = 0;
        this.previousTime = 0;
        this.isDragging = false;
        this.destination = {x:0, y:0};
        this.time = 0;
        this.isPlaying = true;
        this.isTweening = false;
        this.setDefaultCameraOnce = true;


        // GUI.
        this.showGUI = this.data.showGUI;
        this.closeGUIWhenNotHit = this.data.closeGUIWhenNotHit;
        this.modelScaleOffsetMin =  this.data.modelScaleOffsetMin;
        this.modelScaleOffsetMax =  this.data.modelScaleOffsetMax;


        // Display.
        this.skeletonHelpers = [];
        this.showSkeletonHelper = this.data.showSkeletonHelper;
        this.showGridHelper = this.data.showGridHelper;
        this.modelWireframe = this.data.modelWireframe;
        this.modelOpacity = 0;

    

        // Animations.
        this.actionStates = {};
        this.animationCtrls = [];
        this.timeScale = this.data.timeScale;

        this.defaultAnimationName = this.data.defaultAnimationName;
        this.defaultAnimationRepeatCount = this.data.defaultAnimationRepeatCount;
        this.showMarkersWhileDefaultAnimationIsPlaying = this.data.showMarkersWhileDefaultAnimationIsPlaying;
    
        this.defaultAnimationPlayDelay = this.data.defaultAnimationPlayDelay;
        this.defaultAnimationClampWhenFinished = this.data.defaultAnimationClampWhenFinished;
        this.defaultAnimationCrossFadeDuration = this.data.defaultAnimationCrossFadeDuration;
        this.clampWhenFinished = this.defaultAnimationClampWhenFinished;

        this.hideMarkersAtAnimantionStart = this.data.hideMarkersAtAnimantionStart;

        this.defaultAnimationCameraPosition = this.data.defaultAnimationCameraPosition;
        this.defaultAnimationCameraPositionDuration = this.data.defaultAnimationCameraPositionDuration;
        this.defaultAnimationCameraPositionEasingType = this.data.defaultAnimationCameraPositionEasingType;
       
        // Orbital controls.
        this.enableOrbitalControls = this.data.enableOrbitalControls;
        this.zoomFactor = this.data.zoomFactor;
        this.zoomSpeed = this.data.zoomSpeed;
        this.enableKeboardPan = this.data.enableKeboardPan;
        this.dampingFactor = this.data.dampingFactor;
        this.autoRotate = this.data.autoRotate;
        this.autoRotateSpeed = this.data.autoRotateSpeed;
        this.screenSpacePanning = this.data.screenSpacePanning;
        this.enableZoom = this.data.enableZoom;
        this.enablePan = this.data.enablePan;
        this.panSpeed = this.data.panSpeed;
        this.keyPanSpeed = this.data.keyPanSpeed;
        this.zoomMaxDistance = this.data.zoomMaxDistance;
        this.zoomMinDistance = this.data.zoomMinDistance;
        this.horizontalRotationMaxAngle = this.data.horizontalRotationMaxAngle;
        this.horizontalRotationMinAngle = this.data.horizontalRotationMinAngle;
        this.verticalRotationMinAngle = this.data.verticalRotationMinAngle;
        this.verticalRotationMaxAngle = this.data.verticalRotationMaxAngle;
        this.keysType = this.data.keysType;


        // Camera and model.
        this.cameraPositionX = this.data.cameraPosition.x;
        this.cameraPositionY = this.data.cameraPosition.y;
        this.cameraPositionZ = this.data.cameraPosition.z;
        this.controlsTargetPositionX = this.data.cameraPosition.tx;
        this.controlsTargetPositionY = this.data.cameraPosition.ty;
        this.controlsTargetPositionZ = this.data.cameraPosition.tz;

        this.modelPositionX = this.data.modelPositionX;
        this.modelPositionY = this.data.modelPositionY;

       
        this.modelScaleOffset = this.data.modelScaleOffset;
        this.modelScale;
        this.markerPositionCopiedText = this.data.markerPositionCopiedText;
        this.cameraPositionCopiedText = this.data.cameraPositionCopiedText;
        this.preventToCopyMarkerPosition = this.data.preventToCopyMarkerPosition;


        // Enviroment map.
        this.loadEnvMapFristTime = true;
        this.envMapSource = this.data.envMapSource;
        this.envMapShowBackground = this.data.envMapShowBackground;
        this.backgroundBlurriness = this.data.backgroundBlurriness;
        this.envMapIntensity = this.data.envMapIntensity;

        this.environments = [
            {
              id: '',
              name: 'None',
              path: null,
            },
            {
              id: 'neutral', // THREE.RoomEnvironment
              name: 'Neutral',
              path: 'neutral',
            },
            {
              id: 'footprint-court',
              name: 'Venice sunset 1k',
              path: './environmentMaps/venice_sunset_1k.exr',
              format: '.exr'
            },
            {
              id: 'nvidia-canvas',
              name: 'Navidia canvas 4k',
              path: './environmentMaps/nvidiaCanvas-4k.exr',
              format: '.exr'
            }
        ];

        if(this.envMapSource.length > 4 && this.envMapSource != 'neutral'){
            const customSource = {
                id: 'custom-source',
                name: 'Custom source',
                path: this.envMapSource,
                format: '.exr'
            }
            this.environments.splice(2,0, customSource);
        }
       
        if(this.envMapSource == 'neutral'){
            this.envMapName = 'Neutral';
        }else if(this.envMapSource.length < 2){
            this.envMapName = 'None';
        }else{
            this.envMapName = 'Custom source';
        }


        // Lights
        this.showLights = this.data.showLights;
        this.toneMappingExposure = this.data.toneMappingExposure;
        this.ambientIntensity = this.data.ambientIntensity;
        this.ambientColor = this.data.ambientColor;
        this.directionalLightIntensity = this.data.directionalLightIntensity;
        this.directionalLightColor = this.data.directionalLightColor;
        this.directionalLightX = this.data.directionalLightX;
        this.directionalLightY = this.data.directionalLightY;
        this.directionalLightZ = this.data.directionalLightZ;
        

        // Tone mapping.
        this.toneMapping = this.data.toneMapping; 
        
        this.toneMappingOptions = {
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping
        };

      
        // Model.
        this.showModelInfoInTheConsole = this.data.showModelInfoInTheConsole;  
        this.animateModelOpacityOnIntro = this.data.animateModelOpacityOnIntro;
        this.showShadow = this.data.showShadow;
        this.shadowBlur = this.data.shadowBlur;
        this.shadowDarkness = this.data.shadowDarkness;
        this.shadowOpacity = this.data.shadowOpacity;
        this.shadowPlanePositionOffsetY = this.data.shadowPlanePositionOffsetY;
        this.shadowPlaneOpacity = this.data.shadowPlaneOpacity;
        this.shadowPlaneColor = this.data.shadowPlaneColor;
 

        // Markers.
        this.markersDataAr = this.data.markersDataAr;
        this.allowToLoadMarkers = true;
        this.animateMarkersWithSkeleton = this.data.animateMarkersWithSkeleton;
        this.showMarkersAfterTime = this.data.showMarkersAfterTime;
        this.markerToolTipOffsetY = this.data.markerToolTipOffsetY;
        this.setCameraPositionDigitize = this.setCameraPositionDigitize

        
        // Initialize main...
        this.addSceneAndRenderer();
        this.addCamera();
        this.addOrbitControls();
        this.addKeyboardSupport();
        this.setInputs();
       
        // Three-mesh-bvh to optmize raycasting performace!
        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    }


    /**
     * Move the camera based on predefined position.
     */
    moveCamera(cameraPosition, targetPosition, animate, duration, ease) {

        if(!ease){
            ease = 'linear'
        }

        FWDAnimation.killTweensOf(this.tweenCameraPositionObj);
       
        this.tweenCameraPositionObj = {
            cameraPoxX: this.activeCamera.position.x,
            cameraPoxY: this.activeCamera.position.y,
            cameraPoxZ: this.activeCamera.position.z,
            targetPosX: this.controls.target.x,
            targetPosY: this.controls.target.y,
            targetPosZ: this.controls.target.z,
        }
        
        
        if(animate){

            this.isTweening = true;
           
            clearTimeout(this.cameraAnimationFinishedTO);

            FWDAnimation.to(this.tweenCameraPositionObj, duration, {
                cameraPoxX: cameraPosition.x,
                cameraPoxY: cameraPosition.y,
                cameraPoxZ: cameraPosition.z,
                targetPosX: targetPosition.x,
                targetPosY: targetPosition.y,
                targetPosZ: targetPosition.z,
                onUpdate:()=>{
                    this.pauseAutoRotate();
                    this.activeCamera.position.copy(new THREE.Vector3( this.tweenCameraPositionObj.cameraPoxX,  this.tweenCameraPositionObj.cameraPoxY,  this.tweenCameraPositionObj.cameraPoxZ)); 
                    this.controls.target.copy(new THREE.Vector3( this.tweenCameraPositionObj.targetPosX,  this.tweenCameraPositionObj.targetPosY,  this.tweenCameraPositionObj.targetPosZ)); 
                    this.activeCamera.updateProjectionMatrix(); 
                },
                onComplete: () =>{
                    clearTimeout(this.showToolTipAtAnimationEndTO);
                    
                    this.cameraAnimationFinishedTO = setTimeout(() => {
                        if(this.destroyed) return;

                        this.allowToShowMarkers = true;
                        this.isTweening = false;
                        this.hideAndShowMarkers();
            
                        if(this.curMarkerDO){
                            let cameraShowToolTipWhenFinished = this.curMarkerDO.cameraShowToolTipWhenFinished;
                          
                            if(FWDEMVUtils.isMobile){
                                cameraShowToolTipWhenFinished = true;
                            }
                          
                            if(this.curMarkerDO.isShowed && this.curMarkerDO.tooltipHTML && !this.curMarkerDO.infoHTML && cameraShowToolTipWhenFinished){
                                this.showToolTipAtAnimationEndTO = setTimeout(() => {      
                                    this.showMarkerToolTip(this.curMarkerDO, this.curMarkerDO.tooltipHTML, this.curMarkerDO.maxWidth);
                                    this.pauseAnimation(); 
                                }, 250);                              
                            }
                        }
            
                    }, 50);
                }, ease: ease
            });

        }else{
            this.activeCamera.position.copy(cameraPosition); 
            this.controls.target.copy(targetPosition); 
            this.activeCamera.updateProjectionMatrix(); 
            this.isTweening = false;
        }
        
    }


    /**
     * Add scene and renderer.
     */
    addSceneAndRenderer(){
         this.scene =  new THREE.Scene;
         this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
         this.renderer.outputColorSpace = THREE.SRGBColorSpace;
 
         this.pmremGenerator = new PMREMGenerator(this.renderer);
         this.pmremGenerator.compileEquirectangularShader();
         this.neutralEnvironment = this.pmremGenerator.fromScene(new RoomEnvironment()).texture;
      
         this.renderer.setClearColor(0x000000, 0);
         this.screen.appendChild(this.renderer.domElement);
    }


    /**
     * Add camera.
     */
    addCamera(){
        const fov = (0.8 * 180) / Math.PI
        this.defaultCamera = new THREE.PerspectiveCamera(fov, this.width/this.height, 0.01, 1000); 
        this.activeCamera = this.defaultCamera;
        this.activeCamera.polygonOffset = true;
        this.scene.add(this.defaultCamera);
    }


    /**
     * Add orbit controls.
     */
    addOrbitControls(){
        this.controls = new OrbitControls(this.defaultCamera, this.renderer.domElement);
        this.controls.enabled = this.enableOrbitalControls;
        this.controls.autoRotateSpeed = this.autoRotateSpeed;
        this.controls.screenSpacePanning = this.screenSpacePanning;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = this.dampingFactor;
        this.controls.panSpeed = this.panSpeed;
        this.controls.enablePan = this.enablePan;
        this.controlsCliks = 0;
        
        if(FWDEMVUtils.isMobile){
            this.controls.enableZoom = this.enableZoom;
        }else{
            this.controls.enableZoom = false;
            if(this.enableZoom){
                this.addMouseWheelZoomSupport(); 
            }
           
        }
     
        this.controls.minDistance = this.zoomMinDistance;
        this.controls.maxDistance = this.zoomMaxDistance - 0.1;
       
        this.controls.maxAzimuthAngle = this.horizontalRotationMaxAngle * (Math.PI/180); // horizontalRotationMaxAngle
        this.controls.minAzimuthAngle = this.horizontalRotationMinAngle  * (Math.PI/180); // horizontalRotationMinAngle
        if(this.horizontalRotationMinAngle == 0
        && this.horizontalRotationMaxAngle == 0
        ){
            this.controls.minAzimuthAngle = Infinity;
        }

        this.controls.minPolarAngle = this.verticalRotationMinAngle * (Math.PI/180); // verticalRotationMinAngle
        this.controls.maxPolarAngle = this.verticalRotationMaxAngle * (Math.PI/180); // verticalRotationMaxAngle

        this.onToolPointerDown = this.onToolPointerDown.bind(this);
        this.screen.addEventListener('pointerdown', this.onToolPointerDown);
       
        this.onToolPointerUp = this.onToolPointerUp.bind(this);
        this.onToolpointerMove = this.onToolpointerMove.bind(this);
       

        this.onSetGlobalMouse = this.onSetGlobalMouse.bind(this);
        this.screen.addEventListener('pointermove', this.onSetGlobalMouse);

        this.activePinters = 0;
    }

    onSetGlobalMouse(e){
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);
        this.globalX = vc.x;
        this.globalY = vc.y;
    }

    onToolPointerDown(e){
        this.controlsMoved = false;
    
        this.activePinters += 1;
       
        if(FWDEMVUtils.isMobile){
            window.addEventListener('touchend', this.onToolPointerUp);
        }else{
            window.addEventListener('pointerup', this.onToolPointerUp);
        }
    
        window.addEventListener('pointermove', this.onToolpointerMove);
    
        const vc =  FWDEMVUtils.getViewportMouseCoordinates(e);
        this.clickedX = vc.x;
        this.clickedY = vc.y;
    
        clearTimeout(this.markersDisableTO);
       
        if(this.showMarkerTool) return;
        this.style.cursor = 'grabbing';
    }
    
    onToolpointerMove(e){
        
        const vc =  FWDEMVUtils.getViewportMouseCoordinates(e);
      
        let difX = Math.abs(this.clickedX - vc.x);
        let difY = Math.abs(this.clickedY - vc.y);
       
        if(difX > 4 || difY > 4){
            
            this.controlsMoved = true;
            if(this.tweenCameraPositionObj){
                FWDAnimation.killTweensOf(this.tweenCameraPositionObj);
                this.isTweening = false;
            }
            
            if(this.prt.cameraPositionsSelectMenuDO){
                if(!FWDEMVUtils.hitTest(this.prt.cameraPositionsSelectMenuDO.mainIntemsHolderDO.screen, this.globalX, this.globalY)){
                    this.hideToolTip();
                }
            }else{
                this.hideToolTip();
            }
    
            if(this.markersAR) {
               
                if(!this.markersAreDisabled){
                   
                    this.markersAreDisabled = true;

                    this.markersAR.forEach((marker) =>{ 
                        marker.disabled = true;
                    });
                }
            }
            
            if(this.guiDomElement && !FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)){
                this.updateModel();
            }
        }
    
        if(this.showMarkerTool) return;
        this.style.cursor = 'grabbing';
    }
    
    onToolPointerUp(e){
        this.controlsMoved = false;
        this.activePinters -= 1;
        if(this.activePinters < 0) {
            this.activePinters = 0;
        }

        if(this.activePinters == 0 && this.markersAR) {
            
            window.removeEventListener('pointermove', this.onToolpointerMove); 
            
            if(FWDEMVUtils.isMobile){
                window.removeEventListener('touchend', this.onToolPointerUp);
            }else{
                window.removeEventListener('pointerup', this.onToolPointerUp);
            }
           
            this.markersDisableTO = setTimeout(() =>{
                this.markersAreDisabled = false;
                this.markersAR.forEach((marker) =>{ 
                    marker.disabled = false;
                });
            }, 100);
        }
    
        if(this.showMarkerTool) return;
        this.style.cursor = 'grab';
    }

    enableNativeBrowserTouch(){
        this.addChild(this.disableDO);
    }

    disableNativeBrowserTouch(){
        if(this.contains(this.disableDO)){
            this.removeChild(this.disableDO);
        }
    }


    /**
     * Add keyboard panning.
     */
    addKeyboardSupport(){
        let keys;
        if(this.activeKeys == 'arrows'){
            keys = {
                LEFT: 'ArrowLeft', //left arrow
                UP: 'ArrowUp', // up arrow
                RIGHT: 'ArrowRight', // right arrow
                BOTTOM: 'ArrowDown' // down arrow
            }
        }else{
            keys = {
                LEFT: 'KeyA', //left arrow
                UP: 'KeyW', // up arrow
                RIGHT: 'KeyD', // right arrow
                BOTTOM: 'KeyS' // down arrow
            }
        }

        if(!this.enableKeboardPan) return;
        this.removeKeyboardSupport();
        this.controls.keys = keys;
      
        this.controls.keyPanSpeed = this.keyPanSpeed;
        this.controls.listenToKeyEvents(window);
    }

    removeKeyboardSupport(){
        try{
            this.controls.stopListenToKeyEvents();
        }catch(e){}
    }

    setInputs(){
        var numInputs = document.querySelectorAll('input');
        
        this.inputFocusInHandler = this.inputFocusInHandler.bind(this);
        this.inputFocusOutHandler = this.inputFocusOutHandler.bind(this);

        for (var i = 0; i < numInputs.length; i++) {
            numInputs[i].addEventListener("pointerdown", this.inputFocusInHandler);
            numInputs[i].addEventListener("touchstart", this.inputFocusInHandler);
        }

        var numTextA = document.querySelectorAll('textarea');
        for (var i = 0; i < numTextA.length; i++) {
            numTextA[i].addEventListener("pointerdown", this.inputFocusInHandler);
            numTextA[i].addEventListener("touchstart", this.inputFocusInHandler);
        }
    }
    
    inputFocusInHandler(e){
        this.curInput = e.target;
        this.removeKeyboardSupport();

        setTimeout(() =>{
            if(this.destroyed) return;

            if(this.hasPointerEvent_bl){
                window.addEventListener("pointerdown", this.inputFocusOutHandler);
            }else if(window.addEventListener){
                window.addEventListener("pointerdown", this.inputFocusOutHandler);
                window.addEventListener("touchstart", this.inputFocusOutHandler);
            }
        }, 50);
    }
    
    inputFocusOutHandler(e){
        var vc = FWDEMVUtils.getViewportMouseCoordinates(e);	

        this.addKeyboardSupport();
        if(!FWDEMVUtils.hitTest(this.curInput, vc.screenX, vc.screenY)){
            if(this.hasPointerEvent_bl){
                window.removeEventListener("pointerdown", this.inputFocusOutHandler);
            }else if(window.removeEventListener){
                window.removeEventListener("pointerdown", this.inputFocusOutHandler);
                window.removeEventListener("touchstart", this.inputFocusOutHandler);
            }
            return;
        }
    };


    /**
     * Add mousewheel zoom.
     */
    addMouseWheelZoomSupport(){ 
     
        if(!this.registerMouseWheelHandler){
            this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
            this.registerMouseWheelHandler = true;
        }
        
        this.screen.removeEventListener("DOMMouseScroll", this.mouseWheelHandler);
        this.screen.removeEventListener("mousewheel", this.mouseWheelHandler);
      
        if(!this.enableZoom) return;

        this.screen.addEventListener('DOMMouseScroll', this.mouseWheelHandler, {passive:false});
        this.screen.addEventListener ("mousewheel", this.mouseWheelHandler, {passive:false});
       
    }

    mouseWheelHandler(e){

        if(this.infoWindowDO && this.infoWindowDO.isShowed && this.infoWindowDO.closeButtoDO){
            return;
        }
    
        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);
     
        if(this.guiDomElement && !FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)){
            e.preventDefault();
        }else{
            return
        }
        
       
        let dir = e.detail || e.wheelDelta;	
        if(e.wheelDelta) dir *= -1;
        if(FWDEMVUtils.isOpera) dir *= -1;

        if(this.wheelEventFired) return;
      
        if(dir > 0){
            this.zoom('out');
        }else{
            this.zoom('in')
        }

        this.wheelEventFired = true;

        setTimeout(() => {
            if(this.destroyed) return;
            
            this.wheelEventFired = false;
        }, 50); // Reset the flag after 1 second
       
    }


    /**
     * Zoom...
     */
    zoom(direction, smallStep){

        if(this.tweenCameraPositionObj){
            FWDAnimation.killTweensOf(this.tweenCameraPositionObj);
        }

        this.hideToolTip();

        this.zoomObject = {controlsDistance: this.controls.getDistance()}

        let controlsDistance;
        if(!direction)  direction = 'in';
      
        let curCameraPosition = new THREE.Vector3();
        this.activeCamera.getWorldDirection(curCameraPosition);
        curCameraPosition.negate();

        let zoomFactor = this.zoomFactor;
        if(smallStep){
            zoomFactor = 0.025;
        }
    
        if(direction == 'in'){
            controlsDistance = this.zoomObject.controlsDistance - zoomFactor;
           
            if(controlsDistance <= this.controls.minDistance){
                controlsDistance = this.controls.minDistance;
            }
        }else if(direction == 'out'){
            controlsDistance = this.zoomObject.controlsDistance + zoomFactor;
           
            if(controlsDistance >= this.controls.maxDistance){
                controlsDistance = this.controls.maxDistance;
            }
        }
      
        FWDAnimation.killTweensOf(this.zoomObject);
        FWDAnimation.to(this.zoomObject, this.zoomSpeed, {controlsDistance: controlsDistance, onUpdate:()=>{
            this.activeCamera.getWorldDirection(curCameraPosition);
            curCameraPosition.negate();
            this.activeCamera.position.copy(this.controls.target).addScaledVector(curCameraPosition, this.zoomObject.controlsDistance);
        }, onComplete:() =>{
            this.isTweening = false;
            this.updateModel();
        }});
    }


    /**
     * Pan...
     */
    pan(direction) {
        const panSpeed = this.panSpeed;
        let deltaX = 0;
        let deltaY = 0;

        if(direction == 'up'){
            deltaY = 0.005 * this.keyPanSpeed;
        }else if(direction == 'down'){
            deltaY = 0.005 * -this.keyPanSpeed;
        }else if(direction == 'left'){
            deltaX = 0.005 * this.keyPanSpeed;
        }else if(direction == 'right'){
            deltaX = 0.005 * -this.keyPanSpeed;
        }
    
        const cameraDirection = new THREE.Vector3();
        this.activeCamera.getWorldDirection(cameraDirection);
    
        // Calculate the "right" vector by taking the cross product of the camera direction and the world up vector
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, this.activeCamera.up).normalize();
    
        // Calculate the "up" vector based on the camera's orientation
        const cameraUp = new THREE.Vector3();
        cameraUp.crossVectors(cameraRight, cameraDirection).normalize();
    
        // Calculate the pan vectors based on the camera's orientation for both X (right) and Y (up)
        const panX = cameraRight.clone().multiplyScalar(deltaX * panSpeed);
        const panY = cameraUp.clone().multiplyScalar(deltaY * panSpeed);
        
        // Target pan vector
        const pan = { x1: 0, y1: 0 }; // Starting pan vector
        const targetPan = {x1: panX.x, y1:panY.y}; 

        gsap.to(pan, this.panSpeed, {x1: targetPan.x1, y1: targetPan.y1, ease:Quint.easeOut, onUpdate:()=>{
         
            const deltaX = pan.x1 - panX.x; // Calculate the change in X
            const deltaY = pan.y1 - panY.y; // Calculate the change in Y

            const newPanX = cameraRight.clone().multiplyScalar(deltaX);
            const newPanY = cameraUp.clone().multiplyScalar(deltaY);
            const newPan = newPanX.add(newPanY);

            this.activeCamera.position.add(newPan);
            this.controls.target.add(newPan);
            this.controls.update();
        }});
    }


    /**
     * Add contact shandow.
     */
    addContactShadow(){

        setTimeout(() =>{
            if(this.destroyed) return;
            this.render()
            this.positionContactShadow();
        }, 100);

        if(!this.showShadow) return;

        const PLANE_WIDTH = 2.5;
        const PLANE_HEIGHT = 2.5;
        const CAMERA_HEIGHT = 0.3;
      
        if(!this.shadowGroup){

            // The shadow container.
            this.shadowGroup = new THREE.Group();
            this.scene.add(this.shadowGroup);

            // The render target that will show the shadows in the plane texture.
            this.renderTarget = new THREE.WebGLRenderTarget(512, 512);
            this.renderTarget.texture.generateMipmaps = false;

            // the render target that we will use to blur the first render target
            this.renderTargetBlur = new THREE.WebGLRenderTarget(512, 512);
            this.renderTargetBlur.texture.generateMipmaps = false;

            // Make a plane and make it face up.
            const planeGeometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT).rotateX(Math.PI/2);
            const planeMaterial = new THREE.MeshBasicMaterial( {
                map: this.renderTarget.texture,
                opacity: this.shadowOpacity,
                transparent: true,
                depthWrite: false,
            });
            this.shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);


            // Make sure it's rendered after the fillPlane.
            this.shadowPlane.renderOrder = 1;
            this.shadowGroup.add(this.shadowPlane);
            this.shadowPlane.scale.y = - 1;

            // The plane onto which to blur the texture.
            this.blurPlane = new THREE.Mesh(planeGeometry);
            this.blurPlane.visible = false;
            this.shadowGroup.add(this.blurPlane);

            // The plane with the color of the ground
            const fillPlaneMaterial = new THREE.MeshBasicMaterial( {
                color: new THREE.Color(this.shadowPlaneColor),
                opacity: this.shadowPlaneOpacity,
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
            } );
            this.fillPlane = new THREE.Mesh(planeGeometry, fillPlaneMaterial);
            this.fillPlane.rotateX(Math.PI);
            this.shadowGroup.add(this.fillPlane);


            // the camera to render the depth material from
            this.shadowCamera = new THREE.OrthographicCamera( - PLANE_WIDTH/2, PLANE_WIDTH/2, PLANE_HEIGHT/2, - PLANE_HEIGHT/2, 0, CAMERA_HEIGHT );
            this.shadowCamera.rotation.x = Math.PI/2; // get the camera to look up
            this.shadowGroup.add(this.shadowCamera);

        
            // Like MeshDepthMaterial, but goes from black to transparent
            this.depthMaterial = new THREE.MeshDepthMaterial();
            this.depthMaterial.userData.darkness = {value: this.shadowDarkness};

            this.depthMaterial.onBeforeCompile = (shader) => {

                shader.uniforms.darkness = this.depthMaterial.userData.darkness;
                shader.fragmentShader = /* glsl */`
                    uniform float darkness;
                    ${shader.fragmentShader.replace(
                'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
                'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
            )}
                `;

            };

            this.depthMaterial.depthTest = false;
            this.depthMaterial.depthWrite = false;

            this.horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
            this.horizontalBlurMaterial.depthTest = false;

            this.verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
            this.verticalBlurMaterial.depthTest = false;
        }
    }


    /**
     * Position shadow under the model.
     */
    positionContactShadow(){
       
        if(!this.shadowGroup) return
        
        const groupBoundingBox = new THREE.Box3();
        groupBoundingBox.setFromObject(this.model, true);
        const groupSize = new THREE.Vector3();
        groupBoundingBox.getSize(groupSize);

        const groupPosition = this.group.position.clone();
        const shadowPositionY = groupPosition.y - groupSize.y / 2 + this.shadowPlanePositionOffsetY;

        this.shadowGroup.position.set(0, shadowPositionY, 0);

        this.shadowPositionY = shadowPositionY;
    }


    /**
     * Blur shadow.
     */
    blurShadow( amount ) {

        this.blurPlane.visible = true;

        // blur horizontally and draw in the renderTargetBlur
        this.blurPlane.material = this.horizontalBlurMaterial;
        this.blurPlane.material.uniforms.tDiffuse.value = this.renderTarget.texture;
        this.horizontalBlurMaterial.uniforms.h.value = amount * 1 / 256;

        this.renderer.setRenderTarget(this.renderTargetBlur);
        this.renderer.render(this.blurPlane, this.shadowCamera);

        // blur vertically and draw in the main renderTarget
        this.blurPlane.material = this.verticalBlurMaterial;
        this.blurPlane.material.uniforms.tDiffuse.value = this.renderTargetBlur.texture;
        this.verticalBlurMaterial.uniforms.v.value = amount * 1 / 256;

        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.blurPlane, this.shadowCamera);

        this.blurPlane.visible = false;
    }


    /*
     * Resize.
     */
    resize(width, height){    
    
        // Resize camera.
        if(width && height){
            this.width = width;
            this.height = height;
        }

        if(this.infoWindowDO && this.infoWindowDO.isShowed){
            this.infoWindowDO.resize();
        }
       
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.defaultCamera.aspect = this.width / this.height;
        this.defaultCamera.updateProjectionMatrix();
      
        // GUI fix!
        this.setGUIHeight();
    }


    /*
     * Render!!!.
     */
    stop() {
        if(this.isPlaying){
            this.isPlaying = false;
            cancelAnimationFrame(this.RAFid);
        }
    }
  
    play() {
        this.stop();
        if(!this.isPlaying){
            this.isPlaying = true;
            this.render();
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.RAFid = requestAnimationFrame(this.render.bind(this));
        this.updateOnRender();
    }
  
    updateOnRender() {
       
        // Set framerate time.
        const fpsInterval = 1000 / 70;
        const current = Date.now();
        this.curFpsInterval = current - this.current;


        // Get delta time for mixer .
        this.elapsedTime = this.isPlaying ? this.clock.getElapsedTime() : 0;
        const deltaTime = this.elapsedTime - this.previousTime;
        this.previousTime = this.elapsedTime;
        

        // Render animation mixer.
        if(this.mixer){
            this.mixer.update(deltaTime);
        }


        // Frame rate limiter!
        if(this.curFpsInterval < fpsInterval) return;
        

        // Render all.
        if(this.showGridHelper && this.axesCamera){
            this.axesCamera.position.copy(this.defaultCamera.position)
            this.axesCamera.lookAt(this.axesScene.position)
            this.axesRenderer.render( this.axesScene, this.axesCamera );
        }
       
        if(this.stats){
            this.stats.update();
        }
        
        if(this.floor){
            this.floor.material.update();
        }
     
      
        this.controls.update();
        
        // Render shadow.
        if(this.showShadow && this.shadowGroup){

            // Remove the background
            const initialBackground = this.scene.background;

            // Force the depthMaterial to everything.
            this.scene.overrideMaterial = this.depthMaterial;

            // Set renderer clear alpha.
            const initialClearAlpha = this.renderer.getClearAlpha();
            this.renderer.setClearAlpha(0);

            // Render to the render target to get the depths
            this.renderer.setRenderTarget( this.renderTarget);
            this.renderer.render(this.scene, this.shadowCamera);

            // And reset the override material
            this.scene.overrideMaterial = null;
        
            this.blurShadow(this.shadowBlur);

            // a second pass to reduce the artifacts
            // (0.4 is the minimum blur amout so that the artifacts are gone)
            this.blurShadow(this.shadowBlur * 0.4);

            // reset and render the normal scene
            this.renderer.setRenderTarget(null);
            this.renderer.render(this.scene, this.activeCamera);
            this.renderer.setClearAlpha(initialClearAlpha);
            this.scene.background = initialBackground;

        }else{
            this.renderer.render(this.scene, this.activeCamera);
        }

        // Position makerks.
        this.cameraDistance = (this.zoomMaxDistance - this.activeCamera.position.distanceTo(this.controls.target))/this.zoomMaxDistance;
      
        this.positionMarkers();

        this.current = current;
    }


     /**
     * Enviroment map.
     */
     loadEnvironmentMap(source){

        if(this.destroyed) return;

        if(!source){
            this.scene.background = undefined;
            this.scene.environment = undefined;
            return;
        }
       
        if(source == 'neutral'){
            this.environmentMap = this.neutralEnvironment;
        
            if(this.loadEnvMapFristTime){
                this.loadModel(this.source);
                this.loadEnvMapFristTime = false;
            }else if(this.envMapShowBackground && this.environmentMap){
                this.scene.environment = this.environmentMap;
                this.scene.backgroundBlurriness = this.backgroundBlurriness;
                if(this.envMapShowBackground){
                    this.scene.background = this.environmentMap;
                }
            }
            return;
        }

        this.exrLoader = new EXRLoader();
        this.exrLoader.load(source,
        
        // On load.
        (environmentMap) =>{

            if(this.destroyed) return;

            environmentMap.mapping = THREE.EquirectangularReflectionMapping;
            this.environmentMap = environmentMap;
            
            if(this.loadEnvMapFristTime){
                this.loadModel(this.source);
                this.loadEnvMapFristTime = false;
            }else if(this.environmentMap){
                this.scene.environment = this.environmentMap;
                this.scene.backgroundBlurriness = this.backgroundBlurriness;
                
                if(this.envMapShowBackground){
                    this.scene.background = this.environmentMap;
                }
            }
        },

        // On progress.
        (xhr) =>{

            if(this.destroyed) return;

            let percentLoaded = (xhr.loaded / xhr.total) * 100;
            if(percentLoaded){
                percentLoaded = percentLoaded/2;
            }
            this.dispatchEvent(FWDEMVModelManager.LOAD_PROGRESS, {percentLoaded:percentLoaded});
        },

        // On error.
        (error) =>{
            if(this.destroyed) return;

            this.dispatchEvent(FWDEMVModelManager.ERROR, {error:error});
        });
    }

    
    /**
     * Update envMapIntensity for all materials ofthe loaded model.
     */
    updateModelEnvMapIntensity(){
        this.model.traverse((child) =>{
            if(child.isMesh && child.material.isMeshStandardMaterial){
                child.material.envMapIntensity = this.envMapIntensity;
            }
        })
    }

    updateModelOpacity(opacity){
        this.model.traverse((child) =>{
            if(child.isMesh && child.material.isMeshStandardMaterial){
                child.material.transparent = true;
                child.material.opacity = opacity;
            }
        })
    }


    /*
     * Load model.
     */
    loadModel(source, envMapSource){
        
        if(this.destroyed) return;

        this.source = source;

        this.allowToShowMarkers = false;

        if(this.source != this.prevSource){
            this.dispatchEvent(FWDEMVModelManager.START_TO_LOAD);
        }
       
        this.prevSource = this.source;
      
        if(envMapSource && envMapSource.length > 2 && envMapSource != this.prevMapSource){
            this.envMapSource = this.prevMapSource = source;
            this.loadEnvironmentMap(envMapSource, undefined, true);
            return;
        }

        this.isGLTF = /\.gltf$/i.test(source);

        MANAGER.onProgress = (url, itemsLoaded, itemsTotal ) =>{
            if(this.isGLTF){
                let percentLoaded = ( itemsLoaded / itemsTotal * 100 );
                if(this.envMapSource) percentLoaded = 50 + percentLoaded/2;
                this.dispatchEvent(FWDEMVModelManager.LOAD_PROGRESS, {percentLoaded:percentLoaded});
            }
        };
       

        // Load model.
        this.loader = new GLTFLoader(MANAGER)
        .setCrossOrigin('anonymous')
        .setDRACOLoader(DRACO_LOADER)
        .setKTX2Loader(KTX2_LOADER.detectSupport(this.renderer))
        .setMeshoptDecoder(MeshoptDecoder);
      
        this.loader.load(this.source,
            
        // On load.
        (gltf) =>{

            if(this.destroyed) return;
    
            const scene = gltf.scene || gltf.scenes[0];
            const clips = gltf.animations || [];
          
            if (!scene) {
                // Valid, but not supported by this viewer.
                let error =  'This model contains no scene, and cannot be viewed here. However, it may contain individual 3D resources.'
                this.dispatchEvent(FWDEMVModelManager.ERROR, {error:error});
            }
           
            this.setContent(scene, clips);
        },
        
        // On progress.
        (xhr) =>{

            if(this.destroyed) return;

            if(!this.isGLTF){
                let percentLoaded = ( xhr.loaded / xhr.total * 100 );
                if(this.envMapSource) percentLoaded = 50 + percentLoaded/2;
                this.dispatchEvent(FWDEMVModelManager.LOAD_PROGRESS, {percentLoaded:percentLoaded});
            }
        },

        // On error.
        (error) =>{
            if(this.destroyed) return;

            this.dispatchEvent(FWDEMVModelManager.ERROR, {error: error});
        });

        this.reflectors = [];

        this.cameraPosZ = this.activeCamera.position.z;
    }


    /**
     * Set content based on the loaded model and clips.
     */
    setContent(model, clips){
       
        this.clear();
        this.group =  new THREE.Group;
        this.model = model;
        this.clips = clips;
        this.group.add(this.model)
        this.scene.add(this.group);

        model.updateMatrixWorld(true); // donmccurdy/three-gltf-viewer#330

        const box = new Box3().setFromObject(this.group);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());
        this.size = size;
      
        this.controls.reset();

        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        this.modelScale = 1/size;
      
        this.defaultCamera.updateProjectionMatrix();
    
        this.updateModel();
        this.addContactShadow();
        this.updateModelWireframe();
        this.updateModelSkeleton();
       
        this.setCamera(DEFAULT_CAMERA);


        // Add enviroment map.
        if(this.environmentMap){
            this.scene.environment = this.environmentMap;
            this.scene.backgroundBlurriness = this.backgroundBlurriness;
            
            if(this.envMapShowBackground){
                this.scene.background = this.environmentMap;
            }
        }
       

        // Axis helper.
        this.updateAxesHelper();
        this.axesCamera.position.copy(this.defaultCamera.position)
        this.axesCamera.lookAt(this.axesScene.position)
        this.axesCamera.near = size / 100;
        this.axesCamera.far = size * 100;
        this.axesCamera.updateProjectionMatrix();
        this.axesCorner.scale.set(size, size, size);

        this.controls.saveState();
    
        this.model.traverse((node) => {
            if(node.isMesh) {

               // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
                node.material.depthWrite = !node.material.transparent;
                node.geometry.computeBoundsTree();
            }
        });
        
        this.addMouseWheelZoomSupport();
        this.updateLights();
        this.updateModelEnvMapIntensity();

        // Setup markers.
        if(this.showMarkerTool || this.showCameraPositionTool){
            this.setupMarkerTool();
        }

        this.setupMarkers();
        this.setupDisable();
      

        // Helpers.
        this.updateGrid();
        this.setupGUI();
        this.updateAnimationGUI();
       

        // Print model graph.
        if(this.showModelInfoInTheConsole){
            console.log('Easy Model Viewer debugging exported data...')
            this.printGraph(this.model);
        }
        
    
        // Setup info window.
        this.setupInfoWindow();

        this.prevModelSource = this.source;


        // Set default camera position.      
        this.disableControls();
        this.defaultCamera.position.set(
            this.cameraPositionX,
            this.cameraPositionY,
            this.cameraPositionZ);
        
        this.controls.target.set(
            this.controlsTargetPositionX,
            this.controlsTargetPositionY,
            this.controlsTargetPositionZ);

        setTimeout(() =>{    
            if(this.destroyed) return;

            this.enableControls();
            this.allowToShowMarkersFirstTime = true;
           
            if(this.data.autoRotate){
                this.playAutoRotate(true);
            }

        }, this.showMarkersAfterTime)
       
        this.loadCompleteTO = setTimeout(() =>{

            if(this.destroyed) return;

            this.defaultCameraPosition = new THREE.Vector3(
                this.activeCamera.position.x,
                this.activeCamera.position.y,
                this.activeCamera.position.z);
    
            this.reverseControlsPosition = new THREE.Vector3(
                this.controls.target.x,
                this.controls.target.y,
                this.controls.target.z);

            setTimeout(() =>{
                if(this.destroyed) return;

                this.updateClips();
            }, this.defaultAnimationPlayDelay);

            this.dispatchEvent(FWDEMVModelManager.LOAD_COOMPLETE);
        }, 1);

        // Set opacity.
        if(this.animateModelOpacityOnIntro){
            this.opacity = 0;
            FWDAnimation.to(this, .8, {opacity:1, delay:.8});
        }

        // Compile shaders
        this.renderer.compile(this.scene, this.activeCamera);

        this.allowToChageGUIValue = true;
    }


    /**
     * Print graph.
     */
    printGraph (node) {
        console.group(' <' + node.type + '> ' + node.name);
        node.children.forEach((child) => this.printGraph(child));
        console.groupEnd();
    }
    

    /**
     * Update grid.
     */
    updateGrid(){
        if(this.showGridHelper && !Boolean(this.gridHelper)) {
            this.gridHelper = new GridHelper(4,8);
            this.axesHelper = new AxesHelper();
            this.axesHelper.renderOrder = 999;
            this.axesHelper.onBeforeRender = (renderer) => renderer.clearDepth();
            this.scene.add(this.gridHelper);
            this.scene.add(this.axesHelper);
        } else {
            this.scene.remove(this.gridHelper);
            this.scene.remove(this.axesHelper);
            this.gridHelper = null;
            this.axesHelper = null;
            this.axesRenderer.clear();
        }
    }


    /**
     * Update wireframe.
     */
    updateModelWireframe(){
        FWDEMVUtils.traverseMaterials(this.model, (material) => {
            material.wireframe = this.modelWireframe;
        });
    }


    /**
     * Update skeleton helper,
     */
    updateModelSkeleton(){
        if(this.skeletonHelpers.length) {
            this.skeletonHelpers.forEach((helper) => this.scene.remove(helper));
        }
    
        this.model.traverse((node) => {
            if(node.isMesh && node.skeleton && this.showSkeletonHelper) {
                const helper = new SkeletonHelper(node.skeleton.bones[0].parent);
                helper.material.linewidth = 3;
                this.scene.add(helper);
                this.skeletonHelpers.push(helper);
            }
        });
    }


    /**
     * Set camera.
     */
    setCamera(name) {
        if(name === DEFAULT_CAMERA) {
            this.enableControls();
            this.activeCamera = this.defaultCamera;
        }else{
          this.disableControls();
          this.model.traverse((node) => {
                if(node.isCamera && node.name === name) {
                    this.activeCamera = node;
                }
            });
        }
    }

    updateModel(){
      
        if(this.guiCameraPOsitionX){
            this.guiCameraPOsitionX.setValue(this.controls.object.position.x)
            this.guiCameraPOsitionY.setValue(this.controls.object.position.y)
            this.guiCameraPOsitionZ.setValue(this.controls.object.position.z)
            this.guiCameraTargetX.setValue(this.controls.target.x)
            this.guiCameraTargetY.setValue(this.controls.target.y)
            this.guiCameraTargetZ.setValue(this.controls.target.z)
        }
       
        
        // Set default camera postion!
        if(this.setDefaultCameraOnce){
            this.controls.object.position.x = this.cameraPositionX;
            this.controls.object.position.y = this.cameraPositionY;
            this.controls.object.position.z = this.cameraPositionZ;
            
            this.setDefaultCameraOnce = false;
        }

        if(this.group){
            this.group.position.x = this.modelPositionX;
            this.group.position.y = this.modelPositionY;

            this.group.scale.set(this.modelScale + this.modelScaleOffset, this.modelScale + this.modelScaleOffset, this.modelScale + this.modelScaleOffset);
        }
    }


    /**
     * Update lights...
     */
    updateLights () {
        const lights = this.lights;

        if(this.showLights && !lights.length){
            this.addLights();
        }else if(!this.showLights && lights.length){
            this.removeLights();
        }
      
        this.renderer.toneMapping = this.toneMappingOptions[this.toneMapping];
        this.renderer.toneMappingExposure = Math.pow(2, this.toneMappingExposure);
      
        if(lights.length === 2){
            lights[0].intensity = this.ambientIntensity;
            lights[0].color.set(this.ambientColor);
            lights[1].intensity = this.directionalLightIntensity * Math.PI;
            lights[1].color.set(this.directionalLightColor);
        }
    }

    addLights(){
        const light1  = new AmbientLight(this.ambientColor, this.ambientIntensity);
        light1.name = 'ambient_light';
        this.defaultCamera.add(light1);
    
        this.light2 = new DirectionalLight(this.directionalLightColor, this.directionalLightIntensity * Math.PI);
        this.light2.position.set(this.directionalLightX, this.directionalLightY, this.directionalLightZ); // ~60º
        this.light2.name = 'main_light';
        this.defaultCamera.add(this.light2);

        this.lights.push(light1, this.light2);
    }

    removeLights(){
        this.lights.forEach((light) => light.parent.remove(light));
        this.lights.length = 0;
    }

    /**
     * Dispose and remove content.
     */
    clear(){

        if(!this.model) return;
    
        this.scene.remove(this.group);
    
        // dispose geometry
        this.model.traverse((node) => {
          if(!node.isMesh) return;
          node.geometry.dispose();
        });
    
        // Dispose textures.
        FWDEMVUtils.traverseMaterials(this.model, (material) => {
    
        for(const key in material) {
            if(key !== 'envMap' && material[key] && material[key].isTexture){
              material[ key ].dispose();
            }
          }
        });
    }

    /**
     * Add axes helper.
     */
    updateAxesHelper() {
        if(!this.axesDiv){
            this.axesDiv = document.createElement('div');
            this.prt.mainDO.screen.appendChild(this.axesDiv);
            this.axesDiv.classList.add('fwdemv-axes');
        
            const{clientWidth, clientHeight} = this.axesDiv;
        
            this.axesScene = new Scene();
            this.axesCamera = new PerspectiveCamera( 50, clientWidth / clientHeight, 0.1, 10 );
            this.axesScene.add(this.axesCamera);
        
            this.axesRenderer = new WebGLRenderer({alpha: true});
            this.axesRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.axesRenderer.setSize(this.axesDiv.clientWidth, this.axesDiv.clientHeight);
        
            this.axesCamera.up = this.defaultCamera.up;
        
            this.axesCorner = new AxesHelper(5);
            this.axesScene.add(this.axesCorner);
            this.axesDiv.appendChild(this.axesRenderer.domElement);
        }
        
        if(this.showGridHelper){
            this.axesDiv.style.display = 'block';
        }else{
            this.axesDiv.style.display = 'none';
        }
    }


    
    /**
     * Setup markers tool.
     */
    setupMarkerTool(){
        if(this.markerTools) return;

        this.countTimeToolPositonMarkers = 0;

        this.markerTools = new FWDEMVDisplayObject();
        this.markerTools.screen.className = 'fwdemv-markers-tool';
        this.markerTools.opacity = 0;
        this.markerTools.style.pointerEvents = 'none';
        this.addChild(this.markerTools);

        this.markerToolsHidden = new FWDEMVDisplayObject();
        this.markerToolsHidden.opacity = 0;
        this.addChild(this.markerToolsHidden);

        this.raycasterMT = new THREE.Raycaster();
        this.mouseMT = new THREE.Vector2();

        this.markerToolsOnClick = this.markerToolsOnClick.bind(this);
        this.screen.addEventListener('click', this.markerToolsOnClick);
        this.screen.addEventListener('contextmenu', this.markerToolsOnClick);
        
    }

    markerToolsOnClick(e){

        if(this.controlsMoved) return;
    
        let intersectionPoint = {x:0, y:0, z:0};
        let faceNormal = {x:0, y:0, z:0};

        let so = FWDEMVUtils.getScrollOffsets();
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);

        if(this.gui && FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)){
            return;
        }

        this.mouseMT.x = ((vc.x - this.rect.x) / this.width) * 2 - 1;
        this.mouseMT.y = -((vc.y - this.rect.y) / this.height) * 2 + 1;

        // Update the raycaster's origin based on the mouse position and camera.
        this.raycasterMT.setFromCamera(this.mouseMT, this.activeCamera);
        const intersects = this.raycasterMT.intersectObject(this.model, true).filter(intersection => !intersection.object.nonIntersectable);

        
        // Get the intersection point and face normal and mesh...
        let intersection;
        let meshName, mesh, boneName, bone;
        let firstTiragleVertexIndex;

        if(intersects.length > 0 && e.button == 0){
            intersection = intersects[0];
            
            if(intersection.face){
                intersectionPoint = intersection.point;
                faceNormal = intersection.face.normal.clone();
                firstTiragleVertexIndex = intersection.face.a;

                if (intersection.object.isMesh) {
                    meshName = intersection.object.name;
                    mesh = intersection.object;
                }
            }
        }
     
        if(intersects.length == 0 && e.button == 0){
            return;
        }
      
        // Get bone.
        if(mesh && mesh.skeleton){
            bone = FWDEMVUtils.getClosestBone(mesh, firstTiragleVertexIndex)
            boneName = bone.name;
        }


        // Transform faceNormal durection based on mesh.
        if(mesh){
            faceNormal.transformDirection(mesh.matrixWorld);
            faceNormal.multiplyScalar(10);
            faceNormal.add(intersectionPoint);
        }

    
        // Addition for helper tool.
        let positionAddition = ''
        positionAddition = `, meshName: ${meshName}`;

        if(boneName){
            positionAddition = `, boneName: ${boneName}`;
        }


        // Prevent if animation is running.
        if(this.isAnimationRunning()){
            this.markerTools.innerHTML = '<span style="color:#FF0000">' + this.preventToCopyMarkerPosition + '</span>';
           
            this.startMarkersToolsFlushAnimation();
            return;
        }

       
        if(e.button != 2){
            this.addMarkerHeplerPlane(undefined, intersectionPoint, faceNormal, meshName, boneName, true);
        }

        this.helperData = {
            'intersectionPoint': intersectionPoint,
            'faceNormal': faceNormal,
            'positionAddition': positionAddition
        }
    

        // Set marker position.
        let type;
        if(e.button == 0){
            this.markerToolsHidden.innerHTML = 'x:' + this.helperData.intersectionPoint.x + ', y:' + this.helperData.intersectionPoint.y + ', z:' + this.helperData.intersectionPoint.z + ', nx:' + this.helperData.faceNormal.x + ', ny:' + this.helperData.faceNormal.y + ', nz:' + this.helperData.faceNormal.z + this.helperData.positionAddition;

            this.markerTools.innerHTML = this.markerPositionCopiedText;
            type = 'marker';
        }else{
            this.markerToolsHidden.innerHTML = 'x:' + this.activeCamera.position.x + ', y:' + this.activeCamera.position.y + ', z:' + this.activeCamera.position.z + ', tx:' + this.controls.target.x + ', ty:' + this.controls.target.y + ', tz:' + this.controls.target.z;
            this.markerTools.innerHTML = this.cameraPositionCopiedText;
            type = 'camera';
        }

        // Dispatch event.
        this.dispatchEvent(FWDEMVModelManager.SET_MARKER_OR_CAMERA_POSITION, {position:this.markerToolsHidden.innerHTML,  positionType:type, info:this.markerTools.innerHTML});


        // Show flush animation.
        this.startMarkersToolsFlushAnimation();

      
        // Create a range and select the content within the div
        const range = document.createRange();
        range.selectNode(this.markerToolsHidden.screen);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    }

 

    /**
     * Add marker plane helper inside mesh or bone.
     */
    addMarkerHeplerPlane(marker, intersectionPoint, faceNormal, meshName, boneName, remove){
       
        if(this.intersectionChild && remove){
            if(this.helperPlane.removable){
                this.intersectionChild.remove(this.helperPlane);
            }
        }
       
        
        // Find the deepest bone or mesh;
        this.intersectionChild = FWDEMVUtils.getMeshByName(this.model, meshName);
      
        if(boneName){
            this.intersectionChild = FWDEMVUtils.getClosestBone(undefined, undefined, this.model, boneName);
        }
       
        if(marker && !marker.animateWithModel){
            this.intersectionChild = this.scene;
        }
       
        if(!this.intersectionChild){
            return;
        }
       
        if(marker && marker['marker3D']){
            marker['marker3D'].intersectionChild = this.intersectionChild;
        
            const markerT = marker['marker3D'];
            markerT.setInitialPostionAndScale(this.height);
            
            if(!marker['marker3D'].intersectionChild){
                marker['marker3D'].intersectionChild = this.scene;
            }

            marker['marker3D'].intersectionChild.attach(markerT.screen);   
        }
       
        // Create visual plane.
        const planeGeometry = new THREE.PlaneGeometry(0.01, 0.01);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, side: THREE.DoubleSide});

        this.helperPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.helperPlane.material.transparent = true;
        this.helperPlane.material.opacity = .5;
        this.helperPlane.nonIntersectable = true;

        if(remove){
            this.helperPlane.removable = true;
        }
       
        // Set the position of the helper plane and orient.
        const offset = faceNormal.clone().normalize().multiplyScalar(0.0001);
        const adjustedPosition = new THREE.Vector3().addVectors(intersectionPoint, offset);

        this.helperPlane.position.copy(adjustedPosition);
        this.helperPlane.lookAt(new THREE.Vector3().addVectors(adjustedPosition, faceNormal.clone()));
        this.intersectionChild.attach(this.helperPlane);
       
        let line;
        if(!this.showMarkerTool){
            this.helperPlane.material.transparent = true;
            this.helperPlane.material.opacity = 0; 
            this.helperPlane.material.depthWrite = false;
           
        }else{
           
             // Add center line helper
             const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0, 0, 0.05)]);
             const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 });
             lineMaterial.transparent = true;
             line = new THREE.Line(lineGeometry, lineMaterial);
 
             line.nonIntersectable = true;
             this.helperPlane.add(line);
        }
      
        return this.helperPlane;
    }


    startMarkersToolsFlushAnimation(){
        this.markerTools.opacity = 0;
        FWDAnimation.killTweensOf(this.markerTools);
        FWDAnimation.to(this.markerTools, .1, {opacity:1, delay:.1, ease:Expo.easeOut});
        FWDAnimation.to(this.markerTools, .1, {opacity:0, delay:.2, ease:Expo.easeOut});
        FWDAnimation.to(this.markerTools, .1, {opacity:1, delay:.3, ease:Expo.easeOut});
        FWDAnimation.to(this.markerTools, 4, {opacity:0, delay:.8, ease:Expo.easeOut});
    }


    /**
     * Execute markers.
     */
    exceuteMarkerBasedOnCameraPositionName(e, cameraPositionName, overwrite){
        this.markersAR.forEach((marker) =>{ 
            if(marker.cameraPositionName == cameraPositionName){
                this.markerOnPointerUp(e, marker, overwrite);
            }
        });

    }


    /**
     * Setup markers.
     */
    setupMarkers(){
        
        if(!this.markersDataAr) return;
      
        this.markersAR = [];
        this.sortedMarkersAR = [];
        this.countTimePositonMarkers = 0;

        this.markersDataAr.forEach((element, index) =>{ 
            this.addMarker(element, index);
        });

        this.setupMarkersToolTip();
    }

    setupDisable(){
        this.disableDO = new FWDEMVDisplayObject();
        this.disableDO.style.zIndex = 0;
        this.disableDO.style.width = '100%';
        this.disableDO.style.height = '100%';
        this.disableDO.style.background = 'rgba(0,0,0,0)';
    }

   
    /**
     * Add marker.
     */
    addMarker(element, index){
        const marker = new FWDEMVMarker(
            index,
            element['markerType'],
            element['polygonOffsetUnits'],
            this.data.markerPolygonOffsetAlpha,
            this.data.texturesDataAR,
            this.data.markerShowAndHideAnimationType,
            new THREE.Vector3(element.position.x, element.position.y, element.position.z),
            element['meshName'],
            element['boneName'],
            element['normalsAngle'],
            element['cameraPositionName'],
            element['cameraPosition'],
            element['cameraShowToolTipWhenFinished'],
            element['cameraPositionAnimationDuration'],
            element['cameraPositionEasingType'],
            element['animationFinishResetCamera'],
            element['showTooltipBoferePlaying'],
            element['animateWithModel'],
            element['animationShowToolTipWhenFinished'],
            element['animationFinishAction'],
            element['cameraAnimationDuration'],
            element['animationName'],
            element['animationNameRepeatCount'],
            element['animationTimeScale'],
            new THREE.Vector3(element.position.nx, element.position.ny, element.position.nz),
            element['scale'],
            element['iconType'],
            element['borderColor'],
            element['borderSelectedColor'],
            element['backgroundColor'],
            element['backgroundSelectedColor'],
            element['iconColor'],
            element['iconSelectedColor'],
            element['className'],
            element['link'],
            element['target'],
            element['maxWidth'],
            element['toolTipOffsetX'],
            element['tooltipHTML'],
            element['infoHTML'],
            this.markerToolTipOffsetY
        )

        if(marker.markerType == '3D'){
           marker['marker3D'] = new FWDEMV3DMaker(marker, this.scene);
           this.sortedMarkersAR.push({'marker': marker, 'distance': 0});
        }
      
        if(element.boneName){
            marker.planeHelper = this.addMarkerHeplerPlane(marker, marker.marker3dPosition, marker.normals, marker.meshName, marker.boneName);
        }

        if(element.meshName){
            marker.planeHelper = this.addMarkerHeplerPlane(marker, marker.marker3dPosition, marker.normals, marker.meshName, undefined)
        }

        marker.mesh = FWDEMVUtils.getMeshByName(this.model, marker.meshName);
       
        this.addChild(marker);
        
        this.markersAR.push(marker);

        this.hideToolTipTest = this.hideToolTipTest.bind(this);
            
        this.markerOnPointerOver = this.markerOnPointerOver.bind(this);   
        marker.addEventListener(FWDEMVMarker.POINTER_OVER, this.markerOnPointerOver);

        this.markerOnPointerOut = this.markerOnPointerOut.bind(this);   
        marker.addEventListener(FWDEMVMarker.POINTER_OUT, this.markerOnPointerOut);

        this.markerOnPointerUp = this.markerOnPointerUp.bind(this);   
        marker.addEventListener(FWDEMVMarker.POINTER_UP, this.markerOnPointerUp);
    }


    markerOnPointerOver(e){

        if(e.e.pointerType != 'mouse') return;

        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        if(this.guiDomElement && FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)){
            return;
        }
      
        this.markersAR.forEach((marker) =>{
            marker.setNormalState(true);    
            if(marker['marker3D']){
                marker['marker3D'].setNormalState(true);
            }
        });

        const marker = e.target;       

        if(marker['marker3D']){
            marker['marker3D'].setSelectedState(true);
        }

        marker.setSelectedState(true);
       
        if(marker != this.curMarkerDO){
            this.hideToolTip();
        }

        clearTimeout(this.pauseAnimationTO);
        if(this.isAnimationRunning()){
            this.pauseAnimationTO = setTimeout(() => {
                if(this.destroyed) return;
                this.pauseAnimation();
            }, 50)
            
        }

        this.curMarkerDO = marker;

        clearTimeout(this.prevAutoRotateTO);
        
        this.pauseAutoRotate(false, true);
       
        // Show tooltip.
        if(this.curMarkerDO.tooltipHTML){
            setTimeout(() =>{
                if(this.destroyed) return;
                this.showMarkerToolTip(this.curMarkerDO, this.curMarkerDO.tooltipHTML, this.curMarkerDO.maxWidth, true);
            }, 1)
            
        }
    }


    markerOnPointerOut(e){
        if(e.e.pointerType != 'mouse') return;
        
        const marker = e.target;

        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);	

        if(this.guiDomElement && FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)){
            return;
        }

        clearTimeout(this.pauseAnimationTO);
      
        if(this.curMarkerDO && !this.curMarkerDO.tooltipHTML){
           
            this.curMarkerDO.setNormalState(true);
            if(this.curMarkerDO['marker3D']){
                this.curMarkerDO['marker3D'].setNormalState(true);
            }

            if(this.prevAutoRotate && !this.isAnimationRunning()){
                this.playAutoRotate();
            }           
        }
        
        if(this.curMarkerDO && this.markersToolTipDO && !this.markersToolTipDO.isShowed){
            this.curMarkerDO.setNormalState(true);
            if(this.curMarkerDO['marker3D']){
                this.curMarkerDO['marker3D'].setNormalState(true);
            }
        }

        if(marker.playInReverse && this.isAnimationRunning()){
            return;
        }
      
        if(this.isAnimationPaused){
            if(this.markersToolTipDO && this.markersToolTipDO.isShowed){
                // Do nothing the tooltip is showed!
            }else if(this.curAnimClip && this.curAnimClip.name == this.defaultAnimationName){
                this.resumeAnimation();
            }
        }
    }


    markerOnPointerUp(e, markerP, overwrite){
        
        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);	

        if(e && this.guiDomElement&& FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)){
            return;
        }

        if(e.pointerType == 'touch' || !e){    
            this.prevAutoRotate = this.controls.autoRotate;
            this.controls.autoRotate = false;
            this.pauseAutoRotate(false, true);
        }
       
        if(this.curAnimClip && this.curAnimClip.name == this.defaultAnimationName){
            // Default animation running do nothing!
        }else{
            if((this.isAnimationRunning() || this.controlsMoved) && !overwrite){
                return;
            }
        }
       
        this.lastPointerType = e.pointerType;
  
        let marker
        if(e && !markerP){
            marker = e.target
        }else if(markerP){
            marker = markerP;
        }

        if(marker != this.curMarkerDO && !this.hideToolTipWithDelay.isShowed){
            this.markersAR.forEach((marker) =>{
                marker.setNormalState(true);    
                if(marker['marker3D']){
                    marker['marker3D'].setNormalState(true);
                }
            });
        }

        this.curMarkerDO = marker;
        
        if(marker && this.curMarkerDO == marker && this.curMarkerDO.isShowed){
            // Do noting.
        }else{
            this.hideToolTip();
        }
        
    

        // Show tooltip.
        if(this.curMarkerDO.tooltipHTML){
            this.showMarkerToolTip(this.curMarkerDO, this.curMarkerDO.tooltipHTML, this.curMarkerDO.maxWidth, true);
        }
        

        // Open link.
        if(marker.link){
            if(marker.linkTarget == '_self'){
                location.href = marker.link;
            }else{
                window.open(marker.link, '_blank');
            }
        }


        // Show info window.
        if(this.curMarkerDO.infoHTML){
            this.showInfoWindow(this.curMarkerDO.infoHTML);
        }
        
      
        // Marker animation.
        if(marker.animationName){
            this.timeScale = marker.animationTimeScale;
            this.animationFinishAction = marker.animationFinishAction;
            
            if(marker.playInReverse){
                
                this.playAnimationInReverse();
              
                if(this.curMarkerDO.animationFinishResetCamera == 'resetOnAnimationStart'){
                     this.moveCamera(this.defaultCameraPosition,
                          this.reverseControlsPosition,
                          true, marker.cameraPositionAnimationDuration,
                          marker.cameraPositionEasingType);
               }
                this.dispatchEvent(FWDEMVModelManager.SET_CAMERA_POSITION, {'cameraPositionName': this.data.cameraPostionsSelectMenuDefaultText});
            }else{  

                this.resetMarkersReversePlay();
              
                // Play animation.
                this.markerClicked = true;
                this.playOrStopAnimationClip(marker.animationName, true, marker.animationNameRepeatCount, false);


                if(marker.cameraPositionName && !FWDEMVUtils.areVectorsEqual(this.activeCamera.position, marker.cameraPosition, 2)){

                    // Play camera position animation.
                    if(marker.cameraPositionName){
                    
                        this.moveCamera(new THREE.Vector3(
                            marker.cameraPosition.x,
                            marker.cameraPosition.y,
                            marker.cameraPosition.z,
                        ),new THREE.Vector3(
                            marker.cameraPosition.tx,
                            marker.cameraPosition.ty,
                            marker.cameraPosition.tz,
                        ), true, 
                        marker.cameraPositionAnimationDuration,
                        marker.cameraPositionEasingType);

                        this.resetCameraInreverse = true;

                        this.dispatchEvent(FWDEMVModelManager.SET_CAMERA_POSITION, {'cameraPositionName': this.curMarkerDO.cameraPositionName, 'markerID': this.curMarkerDO.id});
                    } 

                    this.hideToolTip();
                }
            }

            if(this.curCilckedMarker && this.curMarkerDO.id != this.curCilckedMarker.id){
                this.resetMarkersReversePlay();
            }

            
        }else if(marker.cameraPositionName){

            // Play camera position animation.
            if(!FWDEMVUtils.areVectorsEqual(this.activeCamera.position, marker.cameraPosition, 2)){
                this.moveCamera(new THREE.Vector3(
                    marker.cameraPosition.x,
                    marker.cameraPosition.y,
                    marker.cameraPosition.z,
                ),new THREE.Vector3(
                    marker.cameraPosition.tx,
                    marker.cameraPosition.ty,
                    marker.cameraPosition.tz,
                ), true, 
                marker.cameraPositionAnimationDuration,
                marker.cameraPositionEasingType);
                this.hideToolTip();
            
                this.dispatchEvent(FWDEMVModelManager.SET_CAMERA_POSITION, {'cameraPositionName': this.curMarkerDO.cameraPositionName, 'markerID': this.curMarkerDO.id});
            }

            this.resetCameraInreverse = true;
        }       
    }


    /**
     * Position markers.
     */
    positionMarkers(){
        if(!this.markersAR) return;
        

        // Set Z index for 2D markers.
        this.sortedMarkersAR.forEach((marker) =>{
            const marker3D = marker.marker['marker3D'];
            marker.distance = this.activeCamera.position.distanceTo(marker3D.meshesHolder.getWorldPosition(new THREE.Vector3()))
        });
        
        this.sortedMarkersAR.sort(function(a, b) {
            return b.distance - a.distance;
        });
       
        this.sortedMarkersAR.forEach((marker, index) =>{
            marker.marker.style.zIndex = index;
        });
       
       

        // Position makerks.
        this.markersAR.forEach((marker, index) =>{

            // Get initial maker 3D position.
            let marker3DPosition = marker.marker3dPosition;

            if(marker.planeHelper){
                
                marker.planeHelper.updateMatrix()
            
                const worldPosition = new THREE.Vector3();
                marker3DPosition = marker.planeHelper.getWorldPosition(worldPosition);
             
                const normals = new THREE.Vector3();
                marker.normals = marker.planeHelper.getWorldDirection(normals);
            }

            if(marker['marker3D']){
                marker['marker3D'].updateScale(this.prt.heightScale, this.cameraDistance);
            }


            // Get 2D screen position and position markers.
            const markerScreenPosition = marker3DPosition.clone();
            markerScreenPosition.project(this.activeCamera);
            marker.markerScreenPosition = markerScreenPosition;

            let offset = 0;
         
            if(marker.isPointer){
                offset -= marker.totalHeight/2;
            }
           
        
            marker.x = this.width/2 + markerScreenPosition.x * this.width * 0.5;
            marker.y = this.height/2  + markerScreenPosition.y * this.height * -0.5 + offset;
            
        });

        this.hideAndShowMarkers();
    }


    /**
     * Hide or show makers.
     */
    hideAndShowMarkers(){
        if(!this.markersAR) return;
       
        this.allowToShowMarkers = !this.isSecondaryAnimationRunning();
      
        this.isCameraTwening = FWDAnimation.isTweening(this.tweenCameraPositionObj);
      
        if(this.isCameraTwening || this.isCorssFading){
             this.allowToShowMarkers = false
        }
     
        this.markersAR.forEach((marker) =>{
            
            // Calculate the angle between the normal vector and the camera vector.
            let cameraDir = new THREE.Vector3();
            this.activeCamera.getWorldDirection(cameraDir);
            const angle = marker.normals.angleTo(cameraDir) * (180 / Math.PI);
          
            if(!marker['marker3D']){
                if(
                    this.allowToShowMarkers
                    && this.allowToShowMarkersFirstTime
                    && this.showMarkersWhileDefaultAnimationIsPlaying
                    && !this.isCameraTwening
                    || (this.curAnimClip && this.curAnimClip.name == this.defaultAnimationName && !this.isCameraTwening && this.allowToShowMarkersFirstTime && this.showMarkersWhileDefaultAnimationIsPlaying && !this.isCorssFading)
                ){  // Adjust the range as needed
                    if(angle > marker.normalsAngle){
                        marker.show(true);
                    }else{
                        marker.hide(true);
                    }
                }else{
                    if(marker.markerType == '2D'){
                        marker.hide(true);
                    }
                }
            }else{
                if(
                    this.allowToShowMarkers
                    && this.allowToShowMarkersFirstTime
                    && this.showMarkersWhileDefaultAnimationIsPlaying
                    && !this.isCameraTwening
                    || (this.curAnimClip && this.curAnimClip.name == this.defaultAnimationName && !this.isCameraTwening && this.allowToShowMarkersFirstTime && this.showMarkersWhileDefaultAnimationIsPlaying && !this.isCorssFading)
                ){
                    marker['marker3D'].show();
                    marker.show();
                }else{
                    if(this.hideMarkersWhenCameraIsAnimating){
                        marker['marker3D'].hide();
                        marker.hide();
                    }
                }
            }
        });
    }


    /**
     * Reset marekers reverse play.
     */
    resetMarkersReversePlay(){
        if(!this.markersAR) return;
        
        this.markersAR.forEach((marker) =>{
            marker.playInReverse = false;
            marker.hideRwind();
        });
    }


    /**
     * Setup info window.
     */
    setupInfoWindow(){
        this.infoWindowDO = new FWDEMVInfoWindow(this, this.data);

        this.infoWindowDO.addEventListener(FWDEMVInfoWindow.HIDE_COMPLETE, () => {
            this.removeChild(this.infoWindowDO);

            this.controls.enablePan = this.data.enablePan;

            if(this.prevAutoRotate){
                this.playAutoRotate();
            }
        });

    }

    showInfoWindow(htmlContent){
        if(this.contains(this.infoWindowDO)) return;
        this.infoWindowDO.style.zIndex = 9999999;

        this.controls.enablePan = false;

        this.addChild(this.infoWindowDO);
        this.infoWindowDO.hide(false, true);
        this.infoWindowDO.show(htmlContent);

        setTimeout(() => {
            if(this.destroyed) return;
            this.pauseAutoRotate(false, true);
        }, 10);

        this.dispatchEvent(FWDEMVModelManager.SHOW_INFO_WINDOW);
    }


    /**
     * Setup markers tooltip.
     */
    setupMarkersToolTip(){
        this.markersToolTipDO = new FWDEMVMarkerToolTip(
            this,
            this.data.markerToolTipAndWindowBackgroundColor);
        this.markersToolTipDO.style.zIndex = 9999999999999;
    };


    /**
     * Show tooltip.
     */
    showMarkerToolTip(marker, label, maxWidth, enableHide){
        if(this.markersToolTipDO.id == marker.id) return;

        this.curMarkerDO.setSelectedState(true);
        
        this.hideToolTip();
        this.pauseAnimation(); 

        if(this.curMarkerDO['marker3D']){
            this.curMarkerDO['marker3D'].setSelectedState(true)
        }

        marker.setSelectedState(true);

        this.markersToolTipDO.id = marker.id;
       
        document.documentElement.appendChild(this.markersToolTipDO.screen);
        this.markersToolTipDO.setLabel(label, maxWidth);
     
        this.markersToolTipDO.show();
    
        this.curMarker = marker;
        
        this.positionTooltipWhenShowed();

        cancelAnimationFrame(this.markerTootipRAF);
        this.markerTootipRAF = requestAnimationFrame(this.positionTooltipWhenShowed.bind(this));

        if(enableHide){
            this.addHideEventsMarkerToolTip();
        }

        window.removeEventListener('scroll', this.checkMarkerTooltipOnScroll);
        this.checkMarkerTooltipOnScroll = this.checkMarkerTooltipOnScroll.bind(this);
        window.addEventListener('scroll', this.checkMarkerTooltipOnScroll);

        this.pauseAutoRotate(false, true);
    };

    checkMarkerTooltipOnScroll(e){
       this.hideToolTip();
    }

    positionTooltipWhenShowed(){
        let finalX;
        let finalY;
        let pointerOffsetX = 0;
        let pointerPostion;

        const so = FWDEMVUtils.getScrollOffsets();
        const vs = FWDEMVUtils.getViewportSize();

        this.showMarkerToolTipTO = setTimeout(() =>{
            if(this.destroyed) return;

            if(!this.markersToolTipDO.isShowed) return;
          
            finalY = this.curMarker.y + this.rect.y + so.y - this.curMarker.totalHeight/2 - this.markersToolTipDO.totalHeight + this.markersToolTipDO.pointerHeight/2 - this.markerToolTipOffsetY;
          
            this.curMarker.upateDumy('top');
       
            // Down.
            if(finalY - so.y < 0){
            
                finalY = this.curMarker.y + this.rect.y + so.y + this.curMarker.totalHeight/2 + this.markersToolTipDO.pointerHeight/2  + this.markersToolTipDO.pointerHeight + 2;
                
                this.markersToolTipDO.pointerUpDO.style.visibility = 'visible';
                this.markersToolTipDO.pointerDownDO.style.visibility = 'hidden';
                pointerPostion = FWDEMVMarkerToolTip.POINTER_UP;
                this.curMarker.upateDumy('bottom');
            // Up.
            }else{
                this.markersToolTipDO.pointerUpDO.style.visibility = 'hidden';
                this.markersToolTipDO.pointerDownDO.style.visibility = 'visible';
                pointerPostion = FWDEMVMarkerToolTip.POINTER_DOWN;
            }
                
            finalX = this.curMarker.x + this.rect.x + so.x + this.curMarker.toolTipOffsetX - this.markersToolTipDO.width/2;
            
            if(finalX < 10){
                pointerOffsetX = finalX - 10;
                finalX = 10;
            }else if(finalX + this.markersToolTipDO.totalWidth  > vs.w -10){
                pointerOffsetX = -(vs.w - finalX - this.markersToolTipDO.totalWidth - 10);
                finalX = vs.w - this.markersToolTipDO.totalWidth - 10;	
            }

            if(!this.isTweening){
                finalX = Math.round(finalX);
                finalY = Math.round(finalY);
            }
            
            this.markersToolTipDO.x = finalX;
            this.markersToolTipDO.y = finalY;	

            this.markersToolTipDO.positionPointer(pointerOffsetX - this.curMarker.toolTipOffsetX, pointerPostion);
        }, 120);
       
        this.markerTootipRAF = requestAnimationFrame(this.positionTooltipWhenShowed.bind(this));
    }


    /**
     * Hide and show tooltip.
     */
    addHideEventsMarkerToolTip(){    
        window.addEventListener("pointermove", this.hideToolTipTest);
        this.addHideToolTipClick();
    }
    
    hideToolTipTest(e){
       
        if(this.isTweening){
            this.hideToolTip()
            return;
        } 

        this.addHideToolTipClick();
        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        this.globalX = vc.x;
        this.globalY = vc.y;

        this.hideToolTipWithDelay();
    }

    hideToolTipWithDelay(){
        if(!this.markersToolTipDO) return;
        
        clearTimeout(this.hideToolTipTO);
        if(!FWDEMVUtils.hitTest(this.markersToolTipDO.screen, this.globalX, this.globalY)
            && !FWDEMVUtils.hitTest(this.curMarkerDO.dumyDO.screen, this.globalX, this.globalY)
            && !FWDEMVUtils.hitTest(this.curMarkerDO.dumyInDO.screen, this.globalX, this.globalY)
        ){
            this.hideToolTip();
            this.removeHideToolTipEvents();  
        }else{
            this.hideToolTipTO = setTimeout(() =>{
                if(this.destroyed) return;
                this.hideToolTipWithDelay();
            }, 1000);
        }
    }

    removeHideToolTipEvents(){
        window.removeEventListener("pointermove", this.hideToolTipTest);
    }

    addHideToolTipClick(){
        window.addEventListener("pointerdown", this.hideToolTipTest);
    }

    removeHideToolTipClick(){
        window.removeEventListener("pointerdown", this.hideToolTipTest);
    }
  
    hideToolTip(){
        if(!this.markersToolTipDO) return;
        clearTimeout(this.hideToolTipTO);
        clearTimeout(this.prevAutoRotateTO);

        if(this.prevAutoRotate && !this.infoWindowDO.isShowed && !this.isAnimationRunning()){
            this.playAutoRotate();
        }
     
        this.markersToolTipDO.hide();

        if(this.marker){
            this.marker.setNormalState(true);
            if(this.marker['marker3D']){
                this.marker['marker3D'].setNormalState(true);
            }
        } 
        this.markersToolTipDO.id = "none";
        
        if(this.curMarkerDO){
            this.curMarkerDO.upateDumy();
            this.curMarkerDO.holdState = false;
            this.curMarkerDO.setNormalState(true);
            if(this.curMarkerDO['marker3D']){
                this.curMarkerDO['marker3D'].setNormalState(true);
            }
        }

        this.removeHideToolTipClick();
        this.removeHideToolTipEvents();

        if(this.curAnimClip && this.curAnimClip.name == this.defaultAnimationName){
            this.resumeAnimation();
        }
      
        window.removeEventListener('scroll', this.checkMarkerTooltipOnScroll);
       
        cancelAnimationFrame(this.markerTootipRAF);
    };
    

    /**
     * 
     */
    enableControls(){
        if(!this.controls){
            return;
        }

        this.controls.enabled = this.enableOrbitalControls;

        if(this.controls.enabled &&  !this.showMarkerTool){
            this.style.cursor = 'grab';
        }
    }

    disableControls(){
        if(!this.controls){
            return;
        }

        this.controls.enabled = false;
        this.style.cursor = 'default';
    }

   
    /**
     * Setuo GUI!!!.
     */
    setupGUI(){
        if(this.gui || !this.showGUI) return;

        GUI.TEXT_OPEN = 'Open Live Settings';
        GUI.TEXT_CLOSED = 'Close';
        this.guiColorPickerHit = false;

        this.stats = new Stats();
        this.stats.dom.height = '48px';
        [].forEach.call(this.stats.dom.children, (child) => (child.style.display = ''));
    
        this.onCheckClickGUI = this.onCheckClickGUI.bind(this);
        window.addEventListener('pointerdown', this.onCheckClickGUI);
        
        this.gui = new GUI({ closeOnTop: false });
        this.gui.width = 104;
        this.guiDomElement = this.gui.domElement;
        this.prt.mainDO.screen.appendChild(this.guiDomElement);
        
        this.guiDomElement.style.position = 'absolute';
        this.guiDomElement.style.top = '0';
        this.guiDomElement.style.right = '0';
        this.gui.closed = true;
       
        FWDEMVUtils.addClass(this.guiDomElement, 'closed');

        this.onOpenGUI = this.onOpenGUI.bind(this);
        this.onCloseGUI = this.onCloseGUI.bind(this);

        this.guiDomElement.addEventListener('click',this.onOpenGUI);
        this.closeGuiButton = this.guiDomElement.querySelector('.dg.main.a .close-button');


        // Stats.
        const perfFolder = this.gui.addFolder('Performance');
        perfFolder.domElement.className = 'fwdemv-gui-performance';
        perfFolder.closed = true;

        const perfLi = document.createElement('li');
        this.stats.dom.style.position = 'static';
        perfLi.appendChild(this.stats.dom);
        perfLi.classList.add('gui-stats');
        perfFolder.__ul.appendChild( perfLi );

        const guiWrap = document.createElement('div');
        this.screen.appendChild( guiWrap );
        guiWrap.classList.add('gui-wrap');
        guiWrap.appendChild(this.gui.domElement);


        // Display.
        this.guiDisplayControls =  this.gui.addFolder('Display');
        this.guiDisplayControls.closed = true;

        this.guiDisplayControls.add(this, 'showGridHelper').name('Show helper grid').onChange(() => {
            this.updateGrid();
            this.updateAxesHelper();
            if(this.showGridHelper){
                this.prevShowShadow = this.showShadow;
                this.shadowGuiCheckbox.setValue(false)
            }else{
                this.shadowGuiCheckbox.setValue(this.prevShowShadow);
            }
        });

        this.guiDisplayControls.add(this, 'modelWireframe').name('Show model wireframe').onChange(() => {
            this.updateModelWireframe();
        });

      
        this.guiDisplayControls.add(this, 'showSkeletonHelper').name('Show skeleton helper').onChange(() => {
            this.updateModelSkeleton();
        });


        // Orbital controls.
        this.guiOrbitalControls =  this.gui.addFolder('Orbital controls');
        this.guiOrbitalControls.closed = true;

        this.guiOrbitalControls.add(this, 'dampingFactor', 0.01, 1, 0.01).name('Damping factor ').onChange(() => {
            this.controls.dampingFactor = this.dampingFactor;
        });
       
        this.guiOrbitalControls.add(this, 'enableKeboardPan').name('Enable keyboard pan').onChange(() => {
            if(this.enableKeboardPan){
                this.addKeyboardSupport();
            }else{
                this.removeKeyboardSupport();
            }
        });
        
        this.activeKeys = this.keysType; 
    
        this.activeKeysOptions = {
            arrows: 'Arrows',
            asdw: 'asdw'
        };

        this.guiOrbitalControls.add(this, 'activeKeys', Object.keys(this.activeKeysOptions)).name('Active keys').onChange((params) => {
            if(this.enableKeboardPan){
                this.addKeyboardSupport();
            }
        }).setValue(this.activeKeys);  

        this.guiOrbitalControls.add(this, 'enableZoom').name('Enable zoom').onChange(() => {
            if(FWDEMVUtils.isMobile){
                this.controls.enableZoom = this.enableZoom;
            }else{
                this.addMouseWheelZoomSupport(); 
            }
        });

        this.guiAutoRotate = this.guiOrbitalControls.add(this, 'autoRotate').name('Auto rotate').onChange(() => {
            
            if(!this.guiSetOutside){
                if(this.autoRotate){
                    this.playAutoRotate();
                }else{
                    this.pauseAutoRotate(false, true);
                }
            }
        });

        this.guiAutoRotateCheckbox = this.guiOrbitalControls.__controllers[2].domElement.firstChild;

        this.guiOrbitalControls.add(this, 'autoRotateSpeed', -5, 5, 0.1).name('Auto rotate speed').onChange(() => {
            this.controls.autoRotateSpeed = this.autoRotateSpeed;
        });

        this.guiOrbitalControls.add(this, 'screenSpacePanning').name('Screen space panning').onChange(() => {
            this.controls.screenSpacePanning = this.screenSpacePanning;
        });

        this.guiOrbitalControls.add(this, 'enablePan').name('Enable pan').onChange(() => {
            this.controls.enablePan = this.enablePan;
        });

        this.guiOrbitalControls.add(this, 'panSpeed', 0.1, 5, 0.1).name('Pan speed').onChange(() => {
            this.controls.panSpeed = this.panSpeed;
        });

        this.guiOrbitalControls.add(this, 'zoomMinDistance', 0, 10, 0.01).name('Zoom min distance').onChange(() => {
            this.controls.minDistance = this.zoomMinDistance;
        });

        this.guiOrbitalControls.add(this, 'zoomMaxDistance', 0, 10, 0.01).name('Zoom max distance').onChange(() => {
            this.controls.maxDistance = this.zoomMaxDistance - 0.1;
        });

        this.guiOrbitalControls.add(this, 'horizontalRotationMinAngle', -180, 0, 1).name('Horizontal drag rotation min angle').onChange(() => {
            this.controls.minAzimuthAngle = this.horizontalRotationMinAngle *  (Math.PI/180);
            
            if(this.horizontalRotationMinAngle == 0
            && this.horizontalRotationMaxAngle == 0
            ){
                this.controls.minAzimuthAngle = Infinity;
            }
        });

        this.guiOrbitalControls.add(this, 'horizontalRotationMaxAngle', 0, 180, 1).name('Horizontal drag rotation max angle').onChange(() => {
            this.controls.maxAzimuthAngle = this.horizontalRotationMaxAngle * (Math.PI/180);
            if(this.horizontalRotationMinAngle == 0
            && this.horizontalRotationMaxAngle == 0
            ){
                this.controls.maxAzimuthAngle = Infinity;
            }
        });

        this.guiOrbitalControls.add(this, 'verticalRotationMinAngle', 0, 180,  1).name('Vertical drag rotation min angle').onChange(() => {
            this.controls.minPolarAngle = this.verticalRotationMinAngle * (Math.PI/180);
             if(this.verticalRotationMinAngle == 0
             && this.verticalRotationMinAngle == 0
             ){
                 this.controls.minAzimuthAngle = Infinity;
             }
        });

        this.guiOrbitalControls.add(this, 'verticalRotationMaxAngle', 0, 180, 1).name('Vertical drag rotation max angle').onChange(() => {
            this.controls.maxPolarAngle = this.verticalRotationMaxAngle * (Math.PI/180);
             if(this.verticalRotationMinAngle == 0
             && this.verticalRotationMinAngle == 0
             ){
                 this.controls.minAzimuthAngle = Infinity;
             }
        });
        

        // Camera.
        this.guiModelGeometry =  this.gui.addFolder('Start camera and model geometry');
        this.guiModelGeometry.closed = true;
      
        let parameters = {
            textInput: String(this.cameraPositionX)
        };
        this.guiCameraPOsitionX = this.guiModelGeometry.add(parameters, 'textInput').name('Camera position X');
        
        let parameters2 = {
            textInput: String(this.cameraPositionY)
        };
        this.guiCameraPOsitionY = this.guiModelGeometry.add(parameters2, 'textInput').name('Camera position Y');

        let parameters3 = {
            textInput: String(this.cameraPositionZ)
        };
        this.guiCameraPOsitionZ = this.guiModelGeometry.add(parameters3, 'textInput').name('Camera position Z');
      
        let parameters4 = {
            textInput: String(this.cameraPositionX)
        };
        this.guiCameraTargetX = this.guiModelGeometry.add(parameters4, 'textInput').name('Controls target position X');

        let parameters5 = {
            textInput: String(this.cameraPositionY)
        };
        this.guiCameraTargetY = this.guiModelGeometry.add(parameters5, 'textInput').name('Controls target position Y');

        let parameters6 = {
            textInput: String(this.cameraPositionZ)
        };
        this.guiCameraTargetZ = this.guiModelGeometry.add(parameters6, 'textInput').name('Controls target position Z');

        if(this.showMarkerTool || this.isAdmin){
            this.guiModelGeometry.add(this, 'modelScaleOffset', this.modelScaleOffsetMin, this.modelScaleOffsetMax, 0.001).name('Model scale offset').onChange(() => {
                this.updateModel();
                this.positionContactShadow();         
            });
        }

        this.guiModelGeometry.add(this, 'modelPositionX', -0.5, 0.5, 0.001).name('Model position X').onChange(() => {
            this.updateModel();
            this.positionContactShadow();
        });

        this.guiModelGeometry.add(this, 'modelPositionY', -0.5, 0.5, 0.001).name('Model position Y').onChange(() => {
            this.updateModel();
            this.positionContactShadow();
        });

       
        // Shadow.
        this.guiShadowFolder = this.gui.addFolder('Shadow');
        this.guiShadowFolder.closed = true;
        
        this.shadowGuiCheckbox = this.guiShadowFolder.add(this, 'showShadow').name('Show shadow').onChange((value) => {
            if(this.showShadow){
                this.addContactShadow();
                if(this.shadowGroup){
                    this.shadowGroup.visible = true;
                }
            }else{
                if(this.shadowGroup){
                    this.shadowGroup.visible = false;
                }
            }

            document.querySelectorAll('.fwdemv-shadow').forEach((element) => {
                if(!this.showShadow){
                    element.style.opacity = .4;
                    element.style.pointerEvents = 'none';
                }else{
                    element.style.opacity = 1;
                    element.style.pointerEvents = 'auto';
                }
            })  
        });
      
        this.guiShadowFolder.add(this, 'shadowPlanePositionOffsetY', -.5, .5, 0.001).name('Shadow position Y offest').onChange((value) => {
            this.shadowGroup.position.y = this.shadowPositionY + this.shadowPlanePositionOffsetY;
        });
        FWDEMVUtils.addClass(this.guiShadowFolder.__controllers[1].__li, 'fwdemv-shadow');
      

        this.guiShadowFolder.add(this, 'shadowOpacity', 0, 1, 0.001).name('Shadow opacity').onChange((value) => {
            this.shadowPlane.material.opacity = this.shadowOpacity;
        });
        FWDEMVUtils.addClass(this.guiShadowFolder.__controllers[2].__li, 'fwdemv-shadow');

        this.guiShadowFolder.add(this, 'shadowDarkness', 0, 3, 0.001).name('Shadow darkness').onChange((value) => {
            this.depthMaterial.userData.darkness.value = this.shadowDarkness;
        });
        FWDEMVUtils.addClass(this.guiShadowFolder.__controllers[3].__li, 'fwdemv-shadow');

        this.guiShadowFolder.add(this, 'shadowBlur', 0, 3, 0.001).name('Shadow blur').onChange((value) => {
        });
        FWDEMVUtils.addClass(this.guiShadowFolder.__controllers[4].__li, 'fwdemv-shadow');
        
        this.guiShadowFolder.add(this, 'shadowPlaneOpacity', 0, 1, 0.001).name('Shadow plane opacity').onChange((value) => {
            this.fillPlane.material.opacity = this.shadowPlaneOpacity;
        });
        FWDEMVUtils.addClass(this.guiShadowFolder.__controllers[5].__li, 'fwdemv-shadow');

        this.guiShadowFolder.addColor(this, 'shadowPlaneColor').name('Shadow plane color').onChange(() => {
            this.fillPlane.material.color = new THREE.Color(this.shadowPlaneColor);
        });
        FWDEMVUtils.addClass(this.guiShadowFolder.__controllers[6].__li, 'fwdemv-shadow');

        setTimeout(() =>{
            if(this.destroyed) return;

            document.querySelectorAll('.fwdemv-shadow').forEach((element) => {
                if(!this.showShadow){
                    element.style.opacity = .4;
                    element.style.pointerEvents = 'none';
                }else{
                    element.style.opacity = 1;
                    element.style.pointerEvents = 'auto';
                }
            });
        }, 100);
        

        // Enviroment map.
        this.guiEnvMapFolder = this.gui.addFolder('Enviroment map');
        this.guiEnvMapFolder.closed = true;

        const environments = this.environments;
        this.guiEnvMapFolder.add(this, 'environments', this.environments.map((env) => env.name)).onChange((params) => {
           
            const environment = environments.filter((entry) => entry.name === params)[0];
            this.envMapName = environment.name;
            this.envMapSource = environment.path;
           
            if(this.allowToChageGUIValue){
                this.loadEnvironmentMap(this.envMapSource, false);
            }

            document.querySelectorAll('.fwdemv-env-map').forEach((element) => {
                if(this.envMapName != 'None'){
                    element.style.opacity = 1;
                    element.style.pointerEvents = 'auto';
                }else{
                    element.style.opacity = .4;
                    element.style.pointerEvents = 'none';
                }
            });
        }).setValue(this.envMapName);
       
        this.guiEnvMapFolder.add(this, 'envMapIntensity', 0, 4, 0.001).name('Env. map intensity').onChange(() => {
            this.updateModelEnvMapIntensity();
        });
        FWDEMVUtils.addClass(this.guiEnvMapFolder.__controllers[1].__li, 'fwdemv-env-map');

        this.guiEnvMapFolder.add(this, 'backgroundBlurriness', 0, 4, 0.001).name('Background blurriness').onChange(() => {
            this.scene.backgroundBlurriness = this.backgroundBlurriness;
        });
        FWDEMVUtils.addClass(this.guiEnvMapFolder.__controllers[2].__li, 'fwdemv-env-map');

        this.guiEnvMapFolder.add(this, 'envMapShowBackground').name('Env. map background').onChange(() => {
            if(this.environmentMap && this.envMapShowBackground){
                this.scene.background = this.environmentMap;
            }else{
                this.scene.background = undefined;
            }
        });
        FWDEMVUtils.addClass(this.guiEnvMapFolder.__controllers[3].__li, 'fwdemv-env-map');

        setTimeout(() =>{
            if(this.destroyed) return;

            document.querySelectorAll('.fwdemv-env-map').forEach((element) => {
             
                if(this.envMapName == 'None'){
                    element.style.opacity = .4;
                    element.style.pointerEvents = 'none';
                }else{
                    element.style.opacity = 1;
                    element.style.pointerEvents = 'auto';
                }
            });
        }, 500);
        
        this.guiEnvMapFolder.add(this, 'toneMapping', Object.keys(this.toneMappingOptions)).name('Tone mapping').onChange((params) => {
         
            this.renderer.toneMapping = this.toneMappingOptions[params];       
           
            if(!this.guiExposure){
                this.guiExposure =  this.guiEnvMapFolder.add(this, 'toneMappingExposure', -10, 10, 0.001).name('Tone mapping exposure').onChange(() => {
                    this.updateLights();
                });
            }
           
        }).setValue(this.toneMapping);


        // Lighting.
        this.guiLightingFolder = this.gui.addFolder('Lighthing');
        this.guiLightingFolder.closed = true;

        this.guiLightingFolder.add(this, 'showLights').name('Lights').onChange(() => {
            this.updateLights();
            document.querySelectorAll('.fwdemv-env-lights').forEach((element) => {
                if(this.showLights){
                    element.style.opacity = 1;
                    element.style.pointerEvents = 'auto';
                }else{
                    element.style.opacity = 0.4;
                    element.style.pointerEvents = 'none';
                }
            });
        });

        this.guiLightingFolder.addColor(this, 'ambientColor').name('Ambient light color').onChange(() => {
            this.updateLights();
        });
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[1].__li, 'fwdemv-env-lights');
        
        this.guiLightingFolder.add(this, 'ambientIntensity', 0, 4, 0.001).name('Ambient light intensity').onChange(() => {
            this.updateLights();
        });
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[2].__li, 'fwdemv-env-lights');

        this.guiLightingFolder.addColor(this, 'directionalLightColor').name('Directional light color').onChange(() => {
            this.updateLights();
        });
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[3].__li, 'fwdemv-env-lights');

        this.guiLightingFolder.add(this, 'directionalLightIntensity', 0, 4, 0.001).name('Directional light intensity').onChange(() => {
            this.updateLights();
        });
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[4].__li, 'fwdemv-env-lights');

        this.guiLightingFolder.add(this.light2.position, 'x', -4, 4, 0.001).name('Directional light position X').onChange(() => {});
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[5].__li, 'fwdemv-env-lights');

        this.guiLightingFolder.add(this.light2.position, 'y', -4, 4, 0.001).name('Directional light position Y').onChange(() => {});
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[6].__li, 'fwdemv-env-lights');

        this.guiLightingFolder.add(this.light2.position, 'y', -4, 4, 0.001).name('Directional light position Z').onChange(() => {});
        FWDEMVUtils.addClass(this.guiLightingFolder.__controllers[7].__li, 'fwdemv-env-lights');

        setTimeout(()=>{
            if(this.destroyed) return;

            document.querySelectorAll('.fwdemv-env-lights').forEach((element) => {
                if(this.showLights){
                    element.style.opacity = 1;
                    element.style.pointerEvents = 'auto';
                }else{
                    element.style.opacity = 0.4;
                    element.style.pointerEvents = 'none';
                }
            });
        });


        // Animations.
        this.guiAnimationsFolder = this.gui.addFolder('Animations');
        FWDEMVUtils.addClass(this.guiAnimationsFolder.domElement, 'fwdemv-env-gui-animations');

        this.guiPlaybackSpeed = this.guiAnimationsFolder.add(this, 'timeScale', 0, 3, 0.1).name('Playback speed').onChange((speed) => {
            if(this.mixer){
                this.mixer.timeScale = speed;
            }
        });
        FWDEMVUtils.addClass(this.guiAnimationsFolder.__controllers[0].domElement, 'playback-speed');
    }

    updateAnimationGUI(){
        if(!this.gui) return;

        // Add animations checkboxes.
        if(this.clips.length){
            this.animationsCheckBoxesAR = [];
            this.guiAnimationsFolder.domElement.style.display = '';
            this.actionStates = {};
        
            this.clips.forEach((clip) => {
                clip.name = `${clip.name}`;
              
                this.actionStates[clip.name] = false;
             
                // Play other clips when enabled.
                let animCkechbox = this.guiAnimationsFolder.add(this.actionStates, clip.name);
                this.animationsCheckBoxesAR.push(animCkechbox);
            });


            // If this checkbox is checked, uncheck all other checkboxes
            const allAnimCheckboxesAR = this.guiAnimationsFolder.__ul.querySelectorAll("input[type='checkbox']");
            const newAnimCheckeboxesAr = [];
         
            allAnimCheckboxesAR.forEach((removableCheckbox, index) =>{
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.setAttribute("data-id", this.clips[index]['name']);
                removableCheckbox.parentNode.appendChild(checkbox)
                removableCheckbox.parentNode.removeChild(removableCheckbox);
                newAnimCheckeboxesAr.push(checkbox);

            });

            newAnimCheckeboxesAr.forEach((checkbox, index) =>{
                           
                checkbox.addEventListener("change", (e) =>{
                    let state = e.target.checked;
                    newAnimCheckeboxesAr.forEach(checkbox => checkbox.checked = false); 
                    e.target.checked = state;
                  
                    for(let key in this.actionStates) {
                        if(e.target.getAttribute('data-id') == key){

                            this.resetMarkersReversePlay();
                          
                            this.playOrStopAnimationClip(key, e.target.checked, 100000, this.clampWhenFinished);

                            if(!e.target.checked){
                                if(this.defaultAnimAction){
                                    this.defaultAnimationRepeatCount = this.data.defaultAnimationRepeatCount;
                                    this.playOrStopAnimationClip(this.defaultAnimAction._clip.name, true, this.defaultAnimationRepeatCount, this.defaultAnimationClampWhenFinished);
                                }
                            }

                            this.curCheckbox = e.target;
                            break;
                        }
                    }                  
                });
            });
        }
    }

    onCheckClickGUI(e){
       
        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);
        let closeButtonY = this.guiDomElement.querySelector('.close-button.close-bottom').getBoundingClientRect().y;

        let colorPickers = this.guiDomElement.querySelectorAll('.selector');
        let colorPickersAR = Array.from(colorPickers);
       
        colorPickersAR.forEach((element) =>{
            if(FWDEMVUtils.hitTest(element, vc.x, vc.y)){
                this.guiColorPickerHit = true;
                return;
            }else{
                this.guiColorPickerHit = false;
            }
        });

        if(this.guiColorPickerHit){
            return;
        }
     
        if(!this.gui.closed){
            if((!FWDEMVUtils.hitTest(this.guiDomElement, vc.x, vc.y)
            || closeButtonY < vc.y)){
                if(this.closeGUIWhenNotHit){
                    this.gui.close();
                    this.onCloseGUI();
                }
            }
        }

        this.setGUIHeight();

        setTimeout(() =>{
            if(this.destroyed) return;
            this.setGUIHeight();
        }, 80);

        setTimeout(() =>{
            if(this.destroyed) return;
            this.setGUIHeight();
        }, 150);
    }

    onOpenGUI = function(){
        this.gui.width = 400;
        FWDEMVUtils.removeClass(this.guiDomElement, 'closed');
        FWDEMVUtils.addClass(this.guiDomElement, 'opened');
       
        this.guiDomElement.removeEventListener('click', this.onOpenGUI);
        this.closeGuiButton.addEventListener('click', this.onCloseGUI);

        this.setGUIHeight();
    }

    onCloseGUI = function(){
        FWDEMVUtils.removeClass(this.guiDomElement, 'opened');
        FWDEMVUtils.addClass(this.guiDomElement, 'closed');

        this.gui.width = 104;
        this.closeGuiButton.removeEventListener('click', this.onCloseGUI);
        setTimeout(function(){
            if(this.destroyed) return;
            this.guiDomElement.addEventListener('click',this.onOpenGUI);
            this.setGUIHeight();
        }.bind(this), 50);
    }

    setGUIHeight(){
        if(!this.gui) return;
        const child = FWDEMVUtils.getChildren(this.guiDomElement)[1];
        const child2 = FWDEMVUtils.getChildren(this.guiDomElement)[2];

        if(this.gui.closed){
            this.guiDomElement.style.height = child2.offsetHeight + 'px';
        }else{
            let sH = this.prt.height;
            let height = child.offsetHeight + child2.offsetHeight;
           
            if(height >= sH){
                this.guiDomElement.style.height = '100%';
            }else{
                this.guiDomElement.style.height = height + 'px';
            }
        }
    }


    /**
     * Play/pause autorotation.
     */
    playAutoRotate(setPrevAutoRotate){
        this.guiSetOutside = true;
        setTimeout(() =>{
            this.guiSetOutside = false;
        }, 50);

        if(this.gui){
            this.guiAutoRotate.setValue(true);
        }

        if(setPrevAutoRotate){
            this.prevAutoRotate = true;
        }
        
        this.controls.autoRotate = true;
        this.controls.dampingFactor = this.dampingFactor;
       
        this.dispatchEvent(FWDEMVModelManager.PLAY_AUTO_ROTATE);
    }

    pauseAutoRotate(setPrevAutoRotate, setDumping){
        this.guiSetOutside = true;
        setTimeout(() =>{
            this.guiSetOutside = false;
        }, 50);

        if(this.gui){
            this.guiAutoRotate.setValue(false);
        }
        
        if(setPrevAutoRotate){
            this.prevAutoRotate = false;
        }

        this.controls.autoRotate = false;
        if(setDumping && this.prevAutoRotate){
            this.controls.dampingFactor = 0;
        }
      
        this.dispatchEvent(FWDEMVModelManager.PAUSE_AUTO_ROTATE);
    }


    /**
     * Update animation clips.
     */
     updateClips() {
        if(this.mixer) {
            this.mixer.removeEventListener('finished', this.onMixerAnimationFinished);
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(this.mixer.getRoot());
            this.mixer = null;
        }
        if(!this.clips.length) return;
    
        this.mixer = new AnimationMixer(this.model);
  
        // Start default animation.
        this.clips.forEach(clip => {
            if(clip.name == this.defaultAnimationName && this.defaultAnimationRepeatCount){
                this.showMarkersWhileDefaultAnimationIsPlaying = this.showMarkersWhileDefaultAnimationIsPlaying;
                this.playOrStopAnimationClip(clip.name, true, this.defaultAnimationRepeatCount, this.defaultAnimationClampWhenFinished, this.clampWhenFinished);

                if(this.defaultAnimationCameraPosition){
                     this.moveCamera(new THREE.Vector3(
                        this.defaultAnimationCameraPosition.x,
                        this.defaultAnimationCameraPosition.y,
                        this.defaultAnimationCameraPosition.z,
                    ),new THREE.Vector3(
                        this.defaultAnimationCameraPosition.tx,
                        this.defaultAnimationCameraPosition.ty,
                        this.defaultAnimationCameraPosition.tz,
                    ), true, 
                    this.defaultAnimationCameraPositionDuration,
                    this.defaultAnimationCameraPositionEasingType);
                }
            }
        });

        // Animation finised event.
        this.mixer.addEventListener('loop', this.onMixerAnimationLoop.bind(this));

        // Animation finised event.
        this.mixer.addEventListener('finished', this.onMixerAnimationFinished.bind(this));
        
    }

    onMixerAnimationLoop(e){
        if(this.defaultAnimAction && this.defaultAnimAction._clip.name == e.action._clip.name){
            this.defaultAnimationRepeatCount -= 1;
        }
    }

    onMixerAnimationFinished(e){
        this.onAnimationActionFnish(e);
   
        let playInReverse = false;
        if(this.curMarkerDO && this.curMarkerDO.playInReverse){
            playInReverse = true;
        }

        this.dispatchEvent(FWDEMVModelManager.ANIMATION_FINISHED, { "action": this.curAnimAction, 'playInReverse':playInReverse });
    }
    
    playAllClips () {
        this.clips.forEach((clip) => {
            this.mixer.clipAction(clip).reset().play();
            this.actionStates[clip.name] = true;
        });
    }

    onAnimationActionFnish(e){
        
       
        if(this.defaultAnimAction && this.defaultAnimAction._clip.name == e.action._clip.name && !this.markerClicked){
            this.showMarkersWhileDefaultAnimationIsPlaying = true;
            return;
        }

        this.curAnimAction.reset();
        
        if(this.animationFinishAction == 'default'){
            this.resumeDefaultAnimation();
        }else if(this.animationFinishAction == 'playInReverse'){
            this.curAnimAction.repetitions = 1;
            this.timeScale *= -1;
            if(this.timeScale <= 0){
                this.playAnimation();
            }else{
                this.resumeDefaultAnimation();
            }
        }else if(this.animationFinishAction == 'playInReverseWithMarker'){
            if(this.curMarkerDO && this.curMarkerDO.playInReverse){
                this.resumeDefaultAnimation();
                this.resetMarkersReversePlay();
            }else{
                this.curMarkerDO.showRewind();
                this.curAnimAction.time = this.curAnimAction.duration;
                this.pauseAnimation();
                this.curMarkerDO.playInReverse = true;
            }
        // }else if(this.animationFinishAction == 'clampWhenFinished'){
        }else{
            this.curAnimAction.time = this.curAnimAction.duration;
            this.pauseAnimation()
        }

        let allowToPlayAnimationInreverse = false;
        if(this.curMarkerDO && this.curMarkerDO.animationFinishResetCamera == 'resetOnAnimationFinish'){
            allowToPlayAnimationInreverse = true
        }

        if(this.animationFinishAction == 'playInReverseWithMarker' && this.curMarkerDO.playInReverse){
            allowToPlayAnimationInreverse = false;
        }

        if(this.animationFinishAction == 'playInReverse' &&  this.timeScale < 0){
            allowToPlayAnimationInreverse = false;
        }

        if(allowToPlayAnimationInreverse){
            this.moveCamera(this.defaultCameraPosition,
            this.reverseControlsPosition,
            true, this.curMarkerDO.cameraPositionAnimationDuration,
            this.curMarkerDO.cameraPositionEasingType);
        }

        clearTimeout(this.mixerFinishedTO);
        clearTimeout(this.showToolTipAtAnimationEndTO);
      
        this.mixerFinishedTO = setTimeout(() => {
           
            if(this.isCameraTwening) return;
            this.allowToShowMarkers = false;
            this.hideAndShowMarkers();

            if(this.curMarkerDO){
               
                let animationShowToolTipWhenFinished = this.curMarkerDO.animationShowToolTipWhenFinished;
              
                if(FWDEMVUtils.isMobile){
                    animationShowToolTipWhenFinished = true;
                }
            
                if(this.curMarkerDO.isShowed && this.curMarkerDO.tooltipHTML && !this.curMarkerDO.infoHTML && animationShowToolTipWhenFinished){
                   
                    this.showToolTipAtAnimationEndTO = setTimeout(() => {                   
                        this.showMarkerToolTip(this.curMarkerDO, this.curMarkerDO.tooltipHTML, this.curMarkerDO.maxWidth);
                        this.pauseAnimation();
                    }, 250)
                }
            }
        }, 450);

    }

    resumeDefaultAnimation(){
        clearTimeout(this.crossFadingTO);

        if(!this.defaultAnimActionFinished && this.defaultAnimAction){
           
            this.clampWhenFinished = this.defaultAnimationClampWhenFinished;
            
            this.timeScale = this.data.timeScale;
            const tempCurAnimation = this.curAnimAction;
            this.curAnimAction.reset();

            this.playOrStopAnimationClip(this.defaultAnimAction._clip.name, true, this.defaultAnimationRepeatCount, this.defaultAnimationClampWhenFinished, true);
            

            if(this.curAnimAction && this.defaultAnimAction){
                this.defaultAnimAction.crossFadeFrom(tempCurAnimation, this.defaultAnimationCrossFadeDuration);
                this.isCorssFading = true;
                this.crossFadingTO = setTimeout(() =>{
                    if(this.destroyed) return;

                    this.isCorssFading = false;
                }, this.defaultAnimationCrossFadeDuration  * 1000)
            }
            
        }else{
            this.stopAnimation();
        }
        
    }


    /**
     * Play/stop animation clip.
     */
    playOrStopAnimationClip(name, play, repetitions, clampWhenFinished, doNOtoStopAniamtion){
        
        let animationAction;
        let animationClip;

        

        if(!doNOtoStopAniamtion){
            this.stopAnimation();
        }

        this.clips.forEach((clip) => {
            if(clip.name == name){
                animationClip = clip;
                animationAction = this.mixer.clipAction(clip);

                if(clip.name == this.defaultAnimationName && this.defaultAnimationRepeatCount && !this.defaultAnimAction){
                    this.defaultAnimAction = animationAction;
                }
            }
        });
       
        if(!animationClip) return;

        this.curAnimAction = animationAction;
        this.curAnimClip = animationClip;

        this.hideToolTip();

       
        if(this.curAnimAction){

            this.prevAutoRotate = false;
            this.pauseAutoRotate();
           
            if(play){
                if(repetitions !== undefined){
                    this.curAnimAction.repetitions = repetitions; // Repetions number or Infinity.
                }
                
                if(clampWhenFinished !== undefined){
                    this.curAnimAction.clampWhenFinished = clampWhenFinished; // pause at the last frame
                }

                this.curAnimAction.setEffectiveTimeScale(this.timeScale);
                this.curAnimAction.timeScale = this.timeScale;
                this.playAnimation();
                this.prevAnimAction = this.curAnimAction;
            }

            setTimeout(() => {
                this.allowToShowMarkers = false;
              
                this.hideToolTip();

                this.hideAndShowMarkers();
                this.dispatchEvent(FWDEMVModelManager.ANIMATION_START, {'action': this.curAnimAction});
            }, 10);
        }
    }


    /**
     * Aniamations utils.
     */
    stopAnimation(){
        if(this.curAnimAction){
            this.curAnimAction.stop();
            this.mixer.uncacheClip(this.curAnimClip);
            this.mixer.uncacheAction(this.curAnimClip);
           
        }
    }

    pauseAnimation(){
        if(this.curAnimAction && this.isAnimationRunning()){
            this.isAnimationPaused = true;
            this.curAnimAction.timeScale = 0;
        }
    }

    resumeAnimation(){
        if(this.curAnimAction && this.isAnimationPaused){
          
            this.isAnimationPaused = false;
            this.curAnimAction.timeScale = this.timeScale;
        }
    }

    playAnimation(){
        if(this.curAnimAction){
            this.curAnimAction.reset();
            this.curAnimAction.timeScale = this.timeScale;
            this.curAnimAction.play();
            this.hideToolTip();
        }
    }

    playAnimationInReverse(){
        if(this.curAnimAction){
            this.curAnimAction.repetitions = 1;
            this.timeScale *= -1;
            this.resumeAnimation()
            this.playAnimation();
        }
    }

    isAnimationRunning(){
        if(this.curAnimAction){
            return this.curAnimAction.isRunning();
        }

        return false;
    }

    isSecondaryAnimationRunning(){

        if((this.curAnimAction && this.defaultAnimAction)
            && (this.curAnimAction._clip.name == this.defaultAnimAction._clip.name)
            && this.isAnimationRunning()
        ){
            return false;
        }else if(this.curAnimAction && this.isAnimationRunning()){
            return true;
        }

        return false;
    }

    setCameraPositionDigitize(cameraPosition, cameraPositionAnimationDuration, cameraPositionEasingType){
        this.moveCamera(
          new Vector3(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          ),
          new Vector3(
            cameraPosition.tx,
            cameraPosition.ty,
            cameraPosition.tz
          ),
          true,
          cameraPositionAnimationDuration,
          cameraPositionEasingType
        );
      }


    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;

        this.stop();
        
        FWDAnimation.killTweensOf(this);
        clearTimeout(this.showToolTipAtAnimationEndTO);

        window.removeEventListener('scroll', this.checkMarkerTooltipOnScroll);

        if(this.inputFocusOutHandler){
            window.removeEventListener("pointerdown", this.inputFocusOutHandler);
            window.removeEventListener("touchstart", this.inputFocusOutHandler);
        }

        if(this.hideToolTipTest){
            window.removeEventListener("pointermove", this.hideToolTipTest);
            window.removeEventListener("pointerdown", this.hideToolTipTest);
        }

        if(this.onCheckClickGUI){
            window.removeEventListener('pointerdown', this.onCheckClickGUI);
        }

        if(this.isCameraTwening){
            FWDAnimation.killTweensOf(this.tweenCameraPositionObj);
        }

        if(this.zoomObject){
            FWDAnimation.killTweensOf(this.zoomObject);
        }

        if(this.markerTools){
            FWDAnimation.killTweensOf(this.markerTools);
        }

        if(this.markersAR && this.markersAR.length && this.markersAR){
            this.markersAR.forEach((marker) =>{
                marker.destroy();
                if(marker['marker3D']){
                    marker['marker3D'].destroy();
                }
            });
        }
        
        if(this.scene){
            this.scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {

                    // Dispose of the mesh's geometry and material
                    object.geometry.dispose();
                    object.material.dispose();
            
                    // If the material has a map, dispose of it
                    if (object.material.map) {
                        object.material.map.dispose();
                    }
                }
            });
        }
    }
}
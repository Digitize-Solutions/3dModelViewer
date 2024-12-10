/**
 * Easy 3D Model Viewer v:1.0
 * Main class.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVEventDispather from "./FWDEMVEventDispather";
import FWDEMVUtils from "./FWDEMVUtils";
import FWDEMVData from "./FWDEMVData";
import FWDEMVModelManager from "./FWDEMVModelManager";
import FWDEMVErrorWindow from "./FWDEMVErrorWIndow";
import FWDEMVPreloader from "./FWDEMVPreloader";
import FWDEMVLightbox from "./FWDEMVLightbox";
import FWDEMVController from "./FWDEMVController";
import FWDEMVHider from "./FWDEMVHider";
import FWDEMVCameraPositionsSelectMenu from "./FWDEMVCameraPositionsSelectMenu";


export default class FWDEMV extends FWDEMVEventDispather{

    static RESPONSIVE = "responsive";
	static AFTER_PARENT = "afterparent";
    static LIGHTBOX = 'lightbox';

    static NORMAL_SCREEN = 'staticScreen';
    static FULL_SCREEN = 'fullScreen';
    static ANIMATION_START = 'animationStart';
    static ANIMATION_FINISHED = 'animationFinished';
    static START_TO_LOAD = 'startToLoad';
    static LOAD_PROGRESS = 'loadProgress';
    static LOAD_COOMPLETE = 'loadComplete';
    static AUTOROTATE_PLAY = 'play';
    static AUTOROTATE_PAUSE = 'pause';
    static SET_CAMERA_POSITION = 'setCameraPosition';
    static SET_MARKER_OR_CAMERA_POSITION = 'getMarkerOrCameraPosition';
    static ERROR = 'error';

    
    /*
     * Initialize
     */
    constructor(settings){
      
        super();
        this.settings = settings;

        // Set instance name.
        this.instance = settings.instance;
        window[this.instance] = this;
        window['FWDEMV'] = FWDEMV;

        if(!FWDEMV.mainAR){
            FWDEMV.mainAR = []
        }
        FWDEMV.mainAR.push(this);

        // Set display type.
        this.displayType = settings.displayType || FWDEMV.RESPONSIVE;
		if(this.displayType.toLowerCase() != FWDEMV.RESPONSIVE 
        && this.displayType.toLowerCase() != FWDEMV.AFTER_PARENT
        && this.displayType.toLowerCase() != FWDEMV.LIGHTBOX){
                this.displayType = FWDEMV.RESPONSIVE;
        }
        this.displayType = this.displayType.toLowerCase();
       
        // Set parent.
        if(settings.parentId === undefined){
            alert("Easy 3D Model Viewer element parentId property is not found in the settings! ");
            return;
        }

        this.stageContainer = FWDEMVUtils.getChildById(settings.parentId);   
        if(!this.stageContainer && this.displayType != FWDEMV.LIGHTBOX){
            alert("Easy 3D Model Viewer element holder div is not found, please make sure that the container holder div exsists and the id is correct! " + settings.parentId);
            return;
        }
        this.stageContainer.style.position = 'relative';

        if(this.displayType == FWDEMV.LIGHTBOX){
            this.stageContainer = document.documentElement;
        }


        // Set various properties.
        this.fontIcon = this.settings.fontIcon || 'fwdemvicon';
        this.backgroundColor = settings.backgroundColor || '#FFFFFF';
        this.fullscreenBackgroundColor = settings.fullscreenBackgroundColor || '#FFFFFF';

        this.maxWidth = settings.maxWidth || 1000;
        this.startResizingWidth = settings.startResizingWidth || 1000;
        if(this.maxWidth < this.startResizingWidth){
            this.startResizingWidth = this.maxWidth;
        }

        this.maxHeight = settings.maxHeight || 700; 
        this.autoScale = settings.autoScale == "yes" ? true : false;
        this.initializeWhenVisible = settings.initializeWhenVisible == "yes" ? true : false;
        this.lightboxCloseButtonWidth = settings.lightboxCloseButtonWidth || 30;
        this.lightboxCloseButtonHeight = settings.lightboxCloseButtonHeight || 30;
        this.lightboxCloseButtonBackgroundNormalColor = settings.lightboxCloseButtonBackgroundNormalColor || "#7EC1AB";
        this.lightboxCloseButtonBackgroundSelectedColor = settings.lightboxCloseButtonBackgroundSelectedColor || "#FFFFFF";
        this.lightboxCloseButtonIconNormalColor = settings.lightboxCloseButtonIconNormalColor || "#FFFFFF";
        this.lightboxCloseButtonIconSelectedColor = settings.lightboxCloseButtonIconSelectedColor || "#7EC1AB";
        this.lightboxBackgroundColor = settings.lightboxBackgroundColor || 'rgba(0, 0, 0, .7)';
		
        // Setup main stuff.
        this.setupMainDO();
        this.setupErrorWindow();
        this.startResize();

        if(this.displayType == FWDEMV.LIGHTBOX){
            this.stageContainer = document.documentElement;
           
            this.setupLightBox();
        }else{
            if(this.initializeWhenVisible){
                if(FWDEMVUtils.elementIsVisibleInViewport(this.mainDO.screen, true)){
                    this.setupData();
                }
            }else{
                this.setupData();
            }
        }
    }


    /*
     * Setup main display object.
     */
    setupMainDO(){
        this.mainDO = new FWDEMVDisplayObject();
        this.mainDO.screen.className = 'fwdemv';
        this.mainDO.style.background = this.backgroundColor;
        this.stageContainer.appendChild(this.mainDO.screen);
    }

    /**
     * Setup error window.
     */
    setupErrorWindow(){
        this.errorWindowDO = new FWDEMVErrorWindow(this);
    }


    /**
     * Resize.
     */
    startResize(){
        this.onResize = this.onResize.bind(this);
        window.addEventListener("resize", this.onResize);

        this.onScroll = this.onScroll.bind(this)
        window.addEventListener('scroll', this.onScroll);

        this.onResize();
    }

    onScroll(e){
        this.globalX = this.mainDO.rect.x;
        this.globalY = this.mainDO.rect.y;

        if(this.displayType == FWDEMV.LIGHTBOX){
            this.resize();
        }

        if(FWDEMVUtils.elementIsVisibleInViewport(this.mainDO.screen, true)){
            if(this.initializeWhenVisible && this.displayType != FWDEMV.LIGHTBOX){
                this.setupData();
            }
            if(this.modelManagerDO){
                if(!this.modelManagerDO.isPlaying){
                    this.modelManagerDO.play();
                    this.modelManagerDO.addKeyboardSupport();
                }
            }

            if(this.controllerDO){
                this.controllerDO.positionBlockTouchButton();
            }
        }else{
            if(this.modelManagerDO){
                if(this.modelManagerDO.isPlaying){
                    this.modelManagerDO.stop();
                    this.modelManagerDO.removeKeyboardSupport();
                }
            }
        }
    }

    onResize(e){
        this.resize(e);
    }

    resize(){
       
        this.vs = FWDEMVUtils.getViewportSize();
        this.wsw = this.vs.w;
		this.wsh = this.vs.h;

        this.so = FWDEMVUtils.getScrollOffsets();
		this.sox = this.so.x;
		this.soy = this.so.y;

        if(this.isFullScreen){	
            this.width = this.wsw;
            this.height = this.wsh;
            this.mainDO.x  = this.sox;
            this.mainDO.y = this.soy;
            
            if(this.lightboxDO && this.displayType == FWDEMV.LIGHTBOX){
                this.lightboxDO.resize();

                this.mainDO.x = 0;
                this.mainDO.y = 0;
            }
        }else if(this.displayType == FWDEMV.LIGHTBOX){
            this.mainDO.x = 0;
            this.mainDO.y = 0;
            if(this.lightboxDO){
                this.lightboxDO.resize();
            }
        }else if(this.displayType == FWDEMV.RESPONSIVE){
           
            this.stageContainer.style.width = "100%";
            if(this.stageContainer.offsetWidth > this.maxWidth){
                this.stageContainer.style.width = this.maxWidth + "px";
            }
            this.width = this.stageContainer.offsetWidth;

            if(this.autoScale && this.width <= this.startResizingWidth){
                this.height = Math.round(this.maxHeight * (this.width/this.startResizingWidth));
                if(this.height < 500) this.height = 500;
            }else{
                this.height = this.maxHeight;
            }
           
            this.mainDO.x = 0;
            this.mainDO.y = 0;
            this.stageContainer.style.height = this.height  + "px";

            this.scale = Math.min(this.width/this.height, 1);
        }else if(this.displayType == FWDEMV.AFTER_PARENT){
            
            let offestX = 1;
            if(String(this.maxWidth).includes('%')){
                offestX = parseFloat(this.maxWidth) / 100;
            }

            let offestY = 1;
            if(String(this.maxHeight).includes('%')){
                offestY = parseFloat(this.maxHeight) / 100;
            }

            this.width = this.stageContainer.offsetWidth * offestX;
			this.height = this.stageContainer.offsetHeight * offestY;            
        }
        

        if(!this.initialHeight){
            this.initialHeight = this.height;
        }

        this.heightScale = this.initialHeight/this.height;
      
        if(this.displayType != FWDEMV.LIGHTBOX){
            this.mainDO.width = this.width;
		    this.mainDO.height = this.height
        }

        if(this.modelManagerDO){
            this.modelManagerDO.resize(this.width, this.height);
            if(this.modelManagerDO.model){
                this.onHiderShow();
            }
            
        }
        if(this.preloaderDO) this.preloaderDO.positionAndResize();
        if(this.controllerDO) this.controllerDO.positionAndResize();
        if(this.cameraPositionsSelectMenuDO) this.cameraPositionsSelectMenuDO.positionAndResize();

       
    }


    /*
     * Setup data.
     */
    setupData(){
        if(this.data) return;
        this.data = new FWDEMVData(this.settings);

        this.onDataError = this.onDataError.bind(this);
        this.data.addEventListener(FWDEMVData.ERROR, this.onDataError);

        this.onDataReady = this.onDataReady.bind(this);
        this.data.addEventListener(FWDEMVData.READY, this.onDataReady);
    }

    onDataError(e){
        this.errorWindowDO.showText(e.text);
    }

    onDataReady(e){
        this.setupPreloader();
        this.setupModelManager();
        this.setupController();
        this.setupCameraPositionsSelectMenu();

        if(this.data.loadModelDelay){
            setTimeout(() =>{
                if(this.destroyed) return;
                if(this.data.posterSource){
                   this.loadPoster();
                }else{
                    this.modelManagerDO.loadModel(this.data.source, this.data.envMapSource)
                }
            }, this.data.loadModelDelay);
        }else{
            if(this.data.posterSource){
                this.loadPoster();
             }else{
                 this.modelManagerDO.loadModel(this.data.source, this.data.envMapSource)
             }
        }
        this.resize();
    }


    /**
     * Setup preloader.
     */
    setupPreloader(){
        this.preloaderDO = new FWDEMVPreloader(this);

        this.mainDO.addChild(this.preloaderDO);
        this.preloaderDO.positionAndResize();
        this.preloaderDO.hide(false);
        this.preloaderDO.show();
        this.preloaderDO.update(0);

        this.onPreloaderHideCompleteHandler =  this.onPreloaderHideCompleteHandler.bind(this);
        this.preloaderDO.addEventListener(FWDEMVPreloader.HIDE_COMPLETE, this.onPreloaderHideCompleteHandler);
    }

    onPreloaderHideCompleteHandler(){
        this.mainDO.removeChild(this.preloaderDO);
    };

    loadPoster(){
        if(this.data.posterSource){
            const posterImg = new Image();
          
            posterImg.onload = (e) => {
                if(this.destroyed) return;

                this.preloaderDO.setPoster(posterImg);
                this.modelManagerDO.loadModel(this.data.source, this.data.envMapSource)
            }

            posterImg.onerror = (e) => {
                if(this.destroyed) return;

                this.errorWindowDO.showText('Poster not found: ' + this.data.posterSource);
            }
            posterImg.src = this.data.posterSource;
        }
    
    }


    /**
     * Setup lightbox.
     */
    setupLightBox(){
        this.lightboxDO = new FWDEMVLightbox(this);
        this.lightboxDO.show();

        this.lightboxDO.addEventListener(FWDEMVLightbox.HIDE_START, ()=>{
            if(this.destroyed) return;
            this.mainDO.style.pointerEvents = 'none';
            if(this.modelManagerDO){
                this.modelManagerDO.hideToolTip();
             }
        });

        this.lightboxDO.addEventListener(FWDEMVLightbox.SHOW_COMPLETE, ()=>{
            if(this.destroyed) return;
            this.setupData();
        });

        this.lightboxDO.addEventListener(FWDEMVLightbox.HIDE_COMPLETE, ()=>{
            if(this.destroyed) return;
            this.destroy();
        });
    }


    /**
     * Setup hider.
     */
	setupHider(){
	    this.hider = new FWDEMVHider(this.mainDO, this.data.hideControllerDelay);

        this.onHiderShow = this.onHiderShow.bind(this);
        this.hider.addEventListener(FWDEMVHider.SHOW, this.onHiderShow);

        this.onHiderHide = this.onHiderHide.bind(this);
        this.hider.addEventListener(FWDEMVHider.HIDE, this.onHiderHide);
	};

    onHiderShow(e){
        
        let animate = true;
        if(!e) animate = false
        this.controllerDO.show(animate);

        if(this.cameraPositionsSelectMenuDO){
            this.cameraPositionsSelectMenuDO.show(animate);
        }
    }

    onHiderHide(){
        if(FWDEMVUtils.hitTest(this.controllerDO.mainDO.screen, this.hider.gloabXTest, this.hider.gloabYTest)){
            this.hider.reset();
            return;
        }else if(
               (this.cameraPositionsSelectMenuDO && FWDEMVUtils.hitTest(this.cameraPositionsSelectMenuDO.mainDO.screen, this.hider.gloabXTest, this.hider.gloabYTest))
            || (this.cameraPositionsSelectMenuDO && FWDEMVUtils.hitTest(this.cameraPositionsSelectMenuDO.itemsHolderDumyDO.screen, this.hider.gloabXTest, this.hider.gloabYTest))
            || (this.cameraPositionsSelectMenuDO &&FWDEMVUtils.hitTest(this.cameraPositionsSelectMenuDO.mainIntemsHolderDO.screen, this.hider.gloabXTest, this.hider.gloabYTest))
            || (this.cameraPositionsSelectMenuDO &&FWDEMVUtils.hitTest(this.cameraPositionsSelectMenuDO.nextButtonDO.screen, this.hider.gloabXTest, this.hider.gloabYTest))
            || (this.cameraPositionsSelectMenuDO &&FWDEMVUtils.hitTest(this.cameraPositionsSelectMenuDO.prevButtonDO.screen, this.hider.gloabXTest, this.hider.gloabYTest))
        ){
            this.hider.reset();
            return;
        }else{
            this.controllerDO.hide(true);

            if(this.cameraPositionsSelectMenuDO){
                this.cameraPositionsSelectMenuDO.hide(true);
            }
        }
    }


    /**
     * Setup controller.
     */
    setupController(){
        this.controllerDO = new FWDEMVController(this);
        this.modelManagerDO.addChild(this.controllerDO);

        this.onBlockTouch = this.onBlockTouch.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.BLOCK_TOUCH, this.onBlockTouch);

        this.onUnblockTouch = this.onUnblockTouch.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.UNBLOCK_TOUCH, this.onUnblockTouch);

        this.onControllerPlay = this.onControllerPlay.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.PLAY, this.onControllerPlay);

        this.onControllerPause = this.onControllerPause.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.PAUSE, this.onControllerPause);

        this.onControllerZoomIn = this.onControllerZoomIn.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.ZOOMIN, this.onControllerZoomIn);

        this.onControllerZoomOut = this.onControllerZoomOut.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.ZOOMOUT, this.onControllerZoomOut);

        this.onControllerInfo = this.onControllerInfo.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.INFO, this.onControllerInfo);

        this.onControllerFullscreen = this.onControllerFullscreen.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.FULLSCREEN, this.onControllerFullscreen);

        this.onControllerNormalscreen = this.onControllerNormalscreen.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.NORMALSCREEN, this.onControllerNormalscreen);

        this.onControllerHelp = this.onControllerHelp.bind(this);
        this.controllerDO.addEventListener(FWDEMVController.HELP, this.onControllerHelp);

    }

    onBlockTouch(){
        this.controllerDO.setBlockTouchButtonsState('block');
        this.modelManagerDO.enableNativeBrowserTouch();
    }

    onUnblockTouch(){
        this.controllerDO.setBlockTouchButtonsState('unblock');
        this.modelManagerDO.disableNativeBrowserTouch();
    }

    onControllerPlay(){
        this.playAutoRotate();
    }

    onControllerPause(){
        this.pauseAutoRotate();
    }

    onControllerZoomIn(e){
        this.modelManagerDO.zoom('in', e.zoomSmallStep);
    }

    onControllerZoomOut(e){
        this.modelManagerDO.zoom('out', e.zoomSmallStep);
    }

    onControllerInfo(){
        this.modelManagerDO.hideToolTip();
        this.showInfoWindow();
        this.modelManagerDO.infoWindowDO.maxWidth = this.data.infoWindowWidth;
        this.modelManagerDO.infoWindowDO.closeButtoDO.screen.className = 'fwdemv-close-button';
    }

    onControllerFullscreen(){
        this.goFullScreen();
    }

    onControllerNormalscreen(){
        this.goNormalScreen();
    }

    onControllerHelp(e){
        
        this.showInfoWindow(this.data.helpScreenData);
        if(this.data.resizeHelpSpit == 'col3'){
            this.modelManagerDO.infoWindowDO.maxWidth = 900;
        }else if(this.data.resizeHelpSpit == 'col2'){
            this.modelManagerDO.infoWindowDO.maxWidth = 700;
        }else if(this.data.resizeHelpSpit == 'col1'){
            this.modelManagerDO.infoWindowDO.maxWidth = 500;
        }
        
        this.modelManagerDO.infoWindowDO.closeButtoDO.screen.className = 'fwdemv-close-button fwdemv-help-screen-close-buton-offset';
    
        const  svgElements = document.querySelectorAll('.fwdemv-help-icon');
        svgElements.forEach((svgElement) => {
            svgElement.style.fill = this.data.helpScreenIconColor;
            svgElement.style.stroke = this.data.helpScreenIconColor;
        });
    }


    /*
     * Setup camera positions select menu.
     */
    setupCameraPositionsSelectMenu(){
        if(!this.data.showCameraPositionsSelectMenu) return;
        this.cameraPositionsSelectMenuDO = new FWDEMVCameraPositionsSelectMenu(this, this.data);
        this.modelManagerDO.addChild(this.cameraPositionsSelectMenuDO);

        this.onCameraPositionsSelectMenu = this.onCameraPositionsSelectMenu.bind(this);
        this.cameraPositionsSelectMenuDO.addEventListener(FWDEMVCameraPositionsSelectMenu.ITEM_SELECT, this.onCameraPositionsSelectMenu);
    }

    onCameraPositionsSelectMenu(e){
        this.modelManagerDO.exceuteMarkerBasedOnCameraPositionName(e, e.cameraPositionName, true);
    }

    
    /*
     * Setup model manager.
     */
    setupModelManager(){
        this.modelManagerDO = new FWDEMVModelManager(this, this.data);

        this.onModelManagerShowInfoWindow = this.onModelManagerShowInfoWindow.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.SHOW_INFO_WINDOW, this.onModelManagerShowInfoWindow);

        this.onModelManagerStartToLoad = this.onModelManagerStartToLoad.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.START_TO_LOAD, this.onModelManagerStartToLoad);

        this.onModelManagerLoadProgress = this.onModelManagerLoadProgress.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.LOAD_PROGRESS, this.onModelManagerLoadProgress);

        this.onModelManagerLoadComplete = this.onModelManagerLoadComplete.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.LOAD_COOMPLETE, this.onModelManagerLoadComplete);

        this.onModelManagerError = this.onModelManagerError.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.ERROR, this.onModelManagerError);

        this.onModelManagerAnimationStart = this.onModelManagerAnimationStart.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.ANIMATION_START, this.onModelManagerAnimationStart);

        this.onModelManagerAnimationFinished = this.onModelManagerAnimationFinished.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.ANIMATION_FINISHED, this.onModelManagerAnimationFinished);

        this.onModelManagerPauseAutoRotate = this.onModelManagerPauseAutoRotate.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.PAUSE_AUTO_ROTATE, this.onModelManagerPauseAutoRotate);

        this.onModelManagerPlayAutoRotate = this.onModelManagerPlayAutoRotate.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.PLAY_AUTO_ROTATE, this.onModelManagerPlayAutoRotate);

        this.onModelManagerSetCameraPositon = this.onModelManagerSetCameraPositon.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.SET_CAMERA_POSITION, this.onModelManagerSetCameraPositon);

        this.onModelManagerSetMarkerOrCameraPositon = this.onModelManagerSetMarkerOrCameraPositon.bind(this);
        this.modelManagerDO.addEventListener(FWDEMVModelManager.SET_MARKER_OR_CAMERA_POSITION, this.onModelManagerSetMarkerOrCameraPositon);

        this.mainDO.addChildAt(this.modelManagerDO, 0);
    }

    onModelManagerShowInfoWindow(){
        if(this.cameraPositionsSelectMenuDO){
            setTimeout(() =>{
                if(this.destroyed) return;
                this.cameraPositionsSelectMenuDO.hideItems();
                this.modelManagerDO.hideToolTip();
            }, 50);
          
        }
    }

    onModelManagerStartToLoad(){
        this.dispatchEvent(FWDEMV.START_TO_LOAD);
    }

    onModelManagerLoadComplete(){
        this.APIReady = true;
        this.preloaderDO.hide(true);

        setTimeout(() =>{
            if(this.destroyed) return;

            this.controllerDO.show(true);
            if(this.cameraPositionsSelectMenuDO){
                this.cameraPositionsSelectMenuDO.show(true);
            }
        }, this.data.showMarkersAfterTime - 1000);

        setTimeout(() =>{
            if(this.destroyed) return;

            this.setupHider();
            this.hider.start();
        }, this.data.showMarkersAfterTime);


        this.dispatchEvent(FWDEMV.LOAD_COOMPLETE);
    }

    onModelManagerLoadProgress(e){
        this.preloaderDO.update(e.percentLoaded);
        this.dispatchEvent(FWDEMV.LOAD_PROGRESS, {'percentLoaded': e.percentLoaded});
    }

    onModelManagerError(e){
        this.errorWindowDO.showText(e.error);
        this.dispatchEvent(FWDEMV.ERROR, {'error': e.error});
    }

    onModelManagerAnimationStart(animationAction){
        this.dispatchEvent(FWDEMV.ANIMATION_START, {'animationAction': animationAction});
    }

    onModelManagerAnimationFinished(animationAction){
        this.dispatchEvent(FWDEMV.ANIMATION_FINISHED, {'animationAction': animationAction});
    }

    onModelManagerPauseAutoRotate(){
        this.controllerDO.setPlayButtonsState('play');
        this.dispatchEvent(FWDEMV.AUTOROTATE_PLAY);
    }

    onModelManagerPlayAutoRotate(){
        this.controllerDO.setPlayButtonsState('pause');
        this.dispatchEvent(FWDEMV.AUTOROTATE_PAUSE);
    }

    onModelManagerSetCameraPositon(e){
        if(this.cameraPositionsSelectMenuDO){
            this.cameraPositionsSelectMenuDO.updateSelectMenutText(e.cameraPositionName)
        }
        this.dispatchEvent(FWDEMV.SET_CAMERA_POSITION, {'cameraPositionName':e.cameraPositionName});
    }

    onModelManagerSetMarkerOrCameraPositon(e){
        this.dispatchEvent(FWDEMV.SET_MARKER_OR_CAMERA_POSITION, {event:e})
    }


    /**
     * Load model.
     */
    loadModel( modelSource, envMapSource, markersElement){

        this.modelSource = modelSource;
        this.envMapSource = envMapSource;
        this.markersElement = markersElement;

        this.modelManagerDO.loadModel(this.modelSource, this.envMapSource)
    }

    
    /**
     * API.
     */

    // Zoom.
    zoom(direction){
        if(!this.APIReady) return;
        this.modelManagerDO.zoom(direction);
    }

    pan(direction){
        if(!this.APIReady) return;
        this.modelManagerDO.pan(direction);
    }


    // Get camera current postion.
    getCameraPosition(){
        if(!this.APIReady) return;
        return {
            cameraX: this.modelManagerDO.activeCamera.x,
            cameraY: this.modelManagerDO.activeCamera.y,
            cameraZ: this.modelManagerDO.activeCamera.z,
            controlsX: this.modelManagerDO.controls.target.x,
            controlsY: this.modelManagerDO.controls.target.y,
            controlsZ: this.modelManagerDO.controls.target.z
        }
    }


    // Show info window.
    showInfoWindow(htmlContent){
        if(!this.APIReady) return;
        if(!htmlContent){
            htmlContent = this.data.infoHWindowHTML;
        }
        this.modelManagerDO.showInfoWindow(htmlContent);
    }


    // Play or pause animation clip
    playOrStopAnimationClip(name, play, repetitions, clampWhenFinished){
        if(!this.APIReady) return;
        this.modelManagerDO.playOrStopAnimationClip(name, play, repetitions, clampWhenFinished);
    }

    getAnimationClips(){
        if(!this.APIReady) return;
        return this.modelManagerDO.clips;
    }


    // Play/pause auto-rotate.
    playAutoRotate(){
        if(!this.APIReady) return;
        this.modelManagerDO.playAutoRotate(true);
    }

    pauseAutoRotate(){
       if(!this.APIReady) return;
       this.modelManagerDO.pauseAutoRotate(true);
    }


    // Go fullscreen / normal screen.
    goFullScreen(){
        if(!this.APIReady) return;
        if(this.isFullScreen) return;

        if(!this.bindFullScreenEvents){
            this.onFullScreenChange = this.onFullScreenChange.bind(this);
            this.bindFullScreenEvents = true;
        }

        document.addEventListener("fullscreenchange", this.onFullScreenChange);
        document.addEventListener("mozfullscreenchange", this.onFullScreenChange);
        document.addEventListener("webkitfullscreenchange", this.onFullScreenChange);

        var so = FWDEMVUtils.getScrollOffsets();
        
        this.lastScrollX = so.x;
        this.lastScrollY = so.y;
        
        if(document.documentElement.requestFullScreen){  
            document.documentElement.requestFullScreen();  
        }else if(document.documentElement.mozRequestFullScreen){  
            document.documentElement.mozRequestFullScreen();  
        }else if(document.documentElement.webkitRequestFullScreen){  
            document.documentElement.webkitRequestFullScreen();  
        }else if(document.documentElement.msieRequestFullScreen){  
            document.documentElement.msieRequestFullScreen();  
        }
        
        this.mainDO.style.position = "absolute";
        this.mainDO.style.background = this.fullscreenBackgroundColor;
        document.documentElement.style.overflow = "hidden";

        if(this.displayType != FWDEMV.LIGHTBOX){
            document.documentElement.appendChild(this.mainDO.screen);
            this.controllerDO.hideBlockTouchButtonAndEnableControls();
        }
        
        this.mainDO.style.zIndex = 2147483640;
        
        this.isFullScreen = true;

        this.controllerDO.setFullscreenButtonsState('fullscreen');
        
        this.resize();
        this.dispatchEvent(FWDEMV.FULL_SCREEN);
    
        
    };

    goNormalScreen(){			
        if(!this.APIReady) return;
        if(!this.isFullScreen) return;

        document.removeEventListener("fullscreenchange", this.onFullScreenChange);
        document.removeEventListener("mozfullscreenchange", this.onFullScreenChange);
        document.removeEventListener("webkitfullscreenchange", this.onFullScreenChange);

        if(document.cancelFullScreen){  
            document.cancelFullScreen();  
        }else if(document.mozCancelFullScreen){  
            document.mozCancelFullScreen();  
        }else if(document.webkitCancelFullScreen){  
            document.webkitCancelFullScreen();  
        }else if(document.msieCancelFullScreen){  
            document.msieCancelFullScreen();  
        }

        document.documentElement.style.overflow = "visible";
        this.mainDO.style.position = "relative";
        
        if(this.displayType == FWDEMV.LIGHTBOX){
            this.stageContainer.appendChild(this.mainDO.screen);
        }else{
            this.stageContainer.appendChild(this.mainDO.screen);
            this.controllerDO.showBlockTouchButtonAndEnableControls();
        }
        
        this.mainDO.style.zIndex = 0;
        this.mainDO.style.background = this.backgroundColor;
        window.scrollTo(this.lastScrollX, this.lastScrollY);
        
        this.isFullScreen = false;
        
        this.resize();

        this.controllerDO.setFullscreenButtonsState('normalscreen');

        this.resize();
        this.dispatchEvent(FWDEMV.NORMAL_SCREEN);
    };

    onFullScreenChange(e){
        if(!this.APIReady) return;
        if(!(document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msieFullScreen)){
            this.goNormalScreen();
        }
    };


    // Destroy.
    destroy(){
        if(this.destroyed) return;

        this.destroyed = true;
        
        this.mainDO.style.pointerEvents = 'none';

        if(this.onResize){
            window.removeEventListener("resize", this.onResize);
            window.removeEventListener('scroll', this.onScroll);
        }

        if(this.preloaderDO){
            this.preloaderDO.destroy();
        }

        if(this.hider){
            this.hider.destroy();
        }

        if(this.controllerDO){
            this.controllerDO.destroy();
        }

        if(this.data){
            this.data.destroy();
        }

        if(this.modelManagerDO){

            if(this.modelManagerDO.infoWindowDO){
                this.modelManagerDO.infoWindowDO.destroy();
            }

            this.modelManagerDO.destroy();
        }

        if(this.cameraPositionsSelectMenuDO){
            this.cameraPositionsSelectMenuDO.destroy();
        }

        if(this.lightboxDO){
            this.lightboxDO.destroy();
        }

        if(this.displayType == FWDEMV.LIGHTBOX){
            this.stageContainer = this.lightboxDO.screen;
        }

        this.stageContainer.parentElement.removeChild(this.stageContainer);
        window[this.instance] = undefined;
    }
}
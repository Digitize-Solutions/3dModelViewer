/**
 * Easy 3D Model Viewer v:1.0
 * Data class.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import * as THREE from 'three';
import FWDEMVEventDispather from "./FWDEMVEventDispather";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVData extends FWDEMVEventDispather{
    
    static ERROR = 'error';
    static READY = 'ready';


    /*
     * Initialize
     */
    constructor(settings){
        super();

        this.settings = settings;

        this.parseProperties();
        this.loadTextures();
    }


    /*
     * Parse properties.
     */
    parseProperties(){

        this.source = this.settings.source || '';

        this.texturesFolder = this.settings.texturesFolder;
       
        this.showAnimationIntro = this.settings.showAnimationIntro || "no";
        this.showAnimationIntro = this.showAnimationIntro == "yes" ? true : false;
        this.cameraPositionStartX = this.settings.cameraPositionStartX || 0;
        this.cameraPositionStartY = this.settings.cameraPositionStartY || 0;
        this.cameraPositionStartZ = this.settings.cameraPositionStartZ || 1;
        this.posterSource = this.settings.posterSource;
        if(this.posterSource && this.posterSource.length < 3){
            this.posterSource = undefined;
        }
        
        
        this.backgroundColor = this.settings.backgroundColor || '#FFFFFF';
        this.fullscreenBackgroundColor = this.settings.fullscreenBackgroundColor || '#FFFFFF';


        // Preloader.
        this.preloaderText = this.settings.preloaderText || "Loading 3D Model: ";
        this.preloaderPosition = this.settings.preloaderPosition || "center";

        this.preloaderOffsetX = this.settings.preloaderOffsetX;
        if(this.preloaderOffsetX === undefined){
            this.preloaderOffsetX = 20;
        }

        this.preloaderOffsetY = this.settings.preloaderOffsetY;
        if(this.preloaderOffsetY === undefined){
            this.preloaderOffsetY = 20;
        }

        this.showPreloaderProgressBar = this.settings.showPreloaderProgressBar || "no";
        this.showPreloaderProgressBar = this.showPreloaderProgressBar == "yes" ? true : false;   
        
        this.preloaderWidth = this.settings.preloaderWidth || '70%';

        this.preloaderProgressBarBackgroundColor = this.settings.preloaderProgressBarBackgroundColor || '#8b859b';
        this.preloaderProgressBarFillColor = this.settings.preloaderProgressBarFillColor || '#bfbf06';

        this.preloaderFontColor = this.settings.preloaderFontColor || '#000000';
        this.preloaderBackgroundSize = this.settings.preloaderBackgroundSize || 'large';

        this.preloaderBackgroundColor = this.settings.preloaderBackgroundColor || 'rgba(255, 255, 255, .7)';


        // Display. 
        this.showGridHelper = this.settings.showGridHelper || "yes";
        this.showGridHelper = this.showGridHelper == "yes" ? true : false;  

        this.modelWireframe = this.settings.modelWireframe || "yes";
        this.modelWireframe = this.modelWireframe == "yes" ? true : false;  

        this.showSkeletonHelper = this.settings.showSkeletonHelper || "yes";
        this.showSkeletonHelper = this.showSkeletonHelper == "yes" ? true : false;  


        // Animations.
        this.defaultAnimationName = this.settings.defaultAnimationName;

        this.defaultAnimationRepeatCount = this.settings.defaultAnimationRepeatCount;
        if(this.defaultAnimationRepeatCount === undefined){
            this.defaultAnimationRepeatCount = 1;
        }
        
        this.defaultAnimationPlayDelay = this.settings.defaultAnimationPlayDelay;
        if(this.defaultAnimationPlayDelay === undefined){
            this.defaultAnimationPlayDelay = 0.1;
        }

        if(this.defaultAnimationPlayDelay < 0.1){
            this.defaultAnimationPlayDelay = 0.1;
        }
        this.defaultAnimationPlayDelay *= 1000;

        this.defaultAnimationClampWhenFinished = this.settings.defaultAnimationClampWhenFinished || "yes";
        this.defaultAnimationClampWhenFinished = this.defaultAnimationClampWhenFinished == "yes" ? true : false; 

        this.timeScale = this.settings.timeScale;
        if(this.timeScale === undefined){
            this.timeScale = 1;
        }

        this.defaultAnimationCrossFadeDuration = this.settings.defaultAnimationCrossFadeDuration;
        if(this.defaultAnimationCrossFadeDuration === undefined){
            this.defaultAnimationCrossFadeDuration = .4;
        }
        
        this.showMarkersWhileDefaultAnimationIsPlaying = this.settings.showMarkersWhileDefaultAnimationIsPlaying || "yes";
        this.showMarkersWhileDefaultAnimationIsPlaying = this.showMarkersWhileDefaultAnimationIsPlaying == "no" ? false : true; 

        if(this.settings.defaultAnimationCameraPosition && this.settings.defaultAnimationCameraPosition.length > 5){
            let parsedObject = {};
            this.defaultAnimationCameraPosition = this.settings.defaultAnimationCameraPosition.replace(/\s/g, '');      
            let keyValuePairs = this.settings.defaultAnimationCameraPosition.split(',');
        
            // Set position.
            for (var i = 0; i < keyValuePairs.length; i++) {

                // Split each key-value pair by ":" to separate the key and value
                var parts = keyValuePairs[i].trim().split(':');
                
                // Ensure there are two parts (key and value)
                if (parts.length === 2) {
                    var key = parts[0].trim();
                    var value = parseFloat(parts[1].trim());
                    
                    // Add the key-value pair to the object
                    parsedObject[key] = value;
                }
            }
            this.defaultAnimationCameraPosition = parsedObject;
        }

        this.defaultAnimationCameraPositionDuration = this.settings.defaultAnimationCameraPositionDuration;
        if(this.defaultAnimationCameraPositionDuration ===  undefined){
            this.defaultAnimationCameraPositionDuration = 1.2;
        }
        this.defaultAnimationCameraPositionDuration =  Number(this.defaultAnimationCameraPositionDuration);

        this.defaultAnimationCameraPositionEasingType = this.settings.defaultAnimationCameraPositionEasingType;
        if(this.defaultAnimationCameraPositionEasingType == undefined){
            this.defaultAnimationCameraPositionEasingType = 'linear'; // linear, easeout, easeinout
        }

      
        // Controls.
        this.butonsAR = [];
        this.buttonsToolTipsAR = [];
        if(this.settings.buttons && this.settings.buttons.length > 0){
            this.butonsAR = FWDEMVUtils.splitAndTrim(this.settings.buttons, true, true);
            this.buttonsToolTipsAR = FWDEMVUtils.splitAndTrim(this.settings.buttonsToolTips, true);
        }
      
        this.showButtonsLabels = this.settings.showButtonsLabels || "yes";
        this.showButtonsLabels = this.showButtonsLabels == "yes" ? true : false;  

        this.showBlockTouchButton = this.settings.showBlockTouchButton || "yes";
        this.showBlockTouchButton = this.showBlockTouchButton == "yes" ? true : false;  
        if(!FWDEMVUtils.isMobile || this.settings.displayType == 'lightbox'){
            this.showBlockTouchButton = false;
        }
        this.blockTouchButtonSize = this.settings.blockTouchButtonSize || 30;


        this.hideControllerDelay = this.settings.hideControllerDelay;
        if(this.hideControllerDelay === undefined){
            this.hideControllerDelay = 3;
        }
        this.hideControllerDelay *= 1000;
     
        this.startAndEndButtonsHorizontalGap = this.settings.startAndEndButtonsHorizontalGap;
        if(this.startAndEndButtonsHorizontalGap === undefined){
            this.startAndEndButtonsHorizontalGap = 22;
        }

        this.startAndEndButtonsVerticalGap = this.settings.startAndEndButtonsVerticalGap;
        if(this.startAndEndButtonsVerticalGap === undefined){
            this.startAndEndButtonsVerticalGap = 5;
        }

        this.spaceBetweenButtons = this.settings.spaceBetweenButtons;
        if(this.spaceBetweenButtons === undefined){
            this.spaceBetweenButtons = 15;
        }

        this.buttonSize = this.settings.buttonSize;
        if(this.buttonSize === undefined){
            this.buttonSize = 30;
        }

        this.controllerOffsetY = this.settings.controllerOffsetY;
        if(this.controllerOffsetY === undefined){
            this.controllerOffsetY = 24;
        }

        this.buttonsToolTipOffsetY = this.settings.buttonsToolTipOffsetY;
        if(this.buttonsToolTipOffsetY === undefined){
            this.buttonsToolTipOffsetY = 10;
        }
		
        this.buttonsIconNormalColor = this.settings.buttonsIconNormalColor || '#FFFFFF';
        this.buttonsIconSelectedColor = this.settings.buttonsIconSelectedColor || '#d6d6d6';

        this.buttonToolTipBackgroundColor = this.settings.buttonToolTipBackgroundColor || '#FFFFFF';
        this.buttonToolTipTextColor = this.settings.buttonToolTipTextColor || '#FFFFFF';

        
        // Orbital controls.
        this.enableOrbitalControls = this.settings.enableOrbitalControls || "yes";
        this.enableOrbitalControls = this.enableOrbitalControls == "yes" ? true : false; 

        this.controllerBackgrondColor = this.settings.controllerBackgrondColor || 'rgba(0, 0, 0, 0.4)';

        this.dampingFactor = this.settings.dampingFactor;
        if(this.dampingFactor === undefined){
            this.dampingFactor = 0.1;
        }

        this.zoomFactor = this.settings.zoomFactor;
        if(this.zoomFactor === undefined){
            this.zoomFactor = .1;
        }

        this.zoomSpeed = this.settings.zoomSpeed;
        if(this.zoomSpeed === undefined){
            this.zoomSpeed = .25;
        }

        this.enableZoom = this.settings.enableZoom || "yes";
        this.enableZoom = this.enableZoom == "yes" ? true : false;  

        this.enableKeboardPan = this.settings.enableKeboardPan || "yes";
        this.enableKeboardPan = this.enableKeboardPan == "yes" ? true : false;  
        
        this.keysType = this.settings.keysType || 'asdw';
        this.keysType = this.keysType.toLowerCase()
        
        this.autoRotate = this.settings.autoRotate || "yes";
        this.autoRotate = this.autoRotate == "yes" ? true : false;  
        
        this.autoRotateSpeed = this.settings.autoRotateSpeed || 0;
        
        this.screenSpacePanning = this.settings.screenSpacePanning || "yes";
        this.screenSpacePanning = this.screenSpacePanning == "yes" ? true : false; 

        this.enablePan = this.settings.enablePan || "yes";
        this.enablePan = this.enablePan == "yes" ? true : false; 

        this.panSpeed = this.settings.panSpeed || 0.8;
        this.keyPanSpeed = this.settings.keyPanSpeed || 1;
        this.keyPanSpeed *= 7;

        this.zoomMaxDistance = this.settings.zoomMaxDistance || 1.5;
        this.zoomMinDistance = this.settings.zoomMinDistance || 0.07;
       
        this.horizontalRotationMaxAngle = this.settings.horizontalRotationMaxAngle || 0;
        this.horizontalRotationMinAngle = this.settings.horizontalRotationMinAngle || 0;
        
        this.verticalRotationMinAngle = this.settings.verticalRotationMinAngle || 0;

        this.verticalRotationMaxAngle = this.settings.verticalRotationMaxAngle;
        if(this.verticalRotationMaxAngle == undefined){
            this.verticalRotationMaxAngle = 180;
        }


        // Enviroment map.
        this.envMapSource = this.settings.envMapSource;

        this.envMapShowBackground = this.settings.envMapShowBackground || "yes";
        this.envMapShowBackground = this.envMapShowBackground == "yes" ? true : false; 

        this.backgroundBlurriness = this.settings.backgroundBlurriness || 0;

        this.envMapIntensity = this.settings.envMapIntensity || 1;
        
        
        // Model.
        this.loadModelDelay = this.settings.loadModelDelay || 0;
        this.loadModelDelay *= 1000;

        this.allowMeshTransparency = this.settings.allowMeshTransparency || "yes";
        this.allowMeshTransparency = this.allowMeshTransparency == "yes" ? true : false; 

        this.animateModelOpacityOnIntro = this.settings.animateModelOpacityOnIntro || "yes";
        this.animateModelOpacityOnIntro = this.animateModelOpacityOnIntro == "yes" ? true : false; 
        
        this.showModelInfoInTheConsole = this.settings.showModelInfoInTheConsole || "yes";
        this.showModelInfoInTheConsole = this.showModelInfoInTheConsole == "yes" ? true : false;  

        this.showShadow = this.settings.showShadow || "yes";
        this.showShadow = this.showShadow == "yes" ? true : false;  

        this.shadowBlur = this.settings.shadowBlur;
        if(this.shadowBlur === undefined){
            this.shadowBlur = 0;
        }

        this.shadowDarkness = this.settings.shadowDarkness;
        if(this.shadowDarkness === undefined){
            this.shadowDarkness = 0; z
        }

        this.shadowOpacity = this.settings.shadowOpacity;
        if(this.shadowOpacity === undefined){
            this.shadowOpacity = 0;
        }
        
        this.shadowPlanePositionOffsetY = this.settings.shadowPlanePositionOffsetY;
        if(this.shadowPlanePositionOffsetY === undefined){
            this.shadowPlanePositionOffsetY = 0;
        }
        
        this.shadowPlaneOpacity = this.settings.shadowPlaneOpacity;
        if(this.shadowPlaneOpacity === undefined){
            this.shadowPlaneOpacity = 0;
        }
       
        this.shadowPlaneColor = this.settings.shadowPlaneColor || '#FFFFFF';


        // Camera amd model initial position.
        let parsedObject = {};
        this.cameraPosition = this.settings.cameraPosition.replace(/\s/g, '');          
        let keyValuePairs = this.settings.cameraPosition.split(',');
       
        // Set position.
        for (var i = 0; i < keyValuePairs.length; i++) {

            // Split each key-value pair by ":" to separate the key and value
            var parts = keyValuePairs[i].trim().split(':');
            
            // Ensure there are two parts (key and value)
            if (parts.length === 2) {
                var key = parts[0].trim();
                var value = parseFloat(parts[1].trim());
                
                // Add the key-value pair to the object
                parsedObject[key] = value;
            }
        }
        this.cameraPosition = parsedObject;

        this.modelPositionX = Number(this.settings.modelPositionX) || 0;
        this.modelPositionY = Number(this.settings.modelPositionY) || 0;

        this.controlsTargetPositionX = Number(this.settings.controlsTargetPositionX) || 0;
        this.controlsTargetPositionY = Number(this.settings.controlsTargetPositionY) || 0;
        this.controlsTargetPositionZ = Number(this.settings.controlsTargetPositionZ) || 0;

        this.modelScaleOffset = Number(this.settings.modelScaleOffset) || 0;


        // Lights
        this.showLights = this.settings.showLights || "yes";
        this.showLights = this.showLights == "yes" ? true : false;  
       
        this.toneMappingExposure = Number(this.settings.toneMappingExposure) || 0;
        this.toneMapping = this.settings.toneMapping || 'ACESFilmic';
      

        this.ambientIntensity = Number(this.settings.ambientIntensity) || 0.3;
        this.ambientColor = this.settings.toneMappingExposure || '#FFFFFF';
        this.directionalLightIntensity = Number(this.settings.directionalLightIntensity) || 1;
        this.directionalLightColor = this.settings.directionalLightColor || '#FFFFFF';
        this.directionalLightX = this.settings.directionalLightX || 0.5;
        this.directionalLightY = this.settings.directionalLightY || 0;
        this.directionalLightZ = this.settings.directionalLightZs || 0.866;
        
        
        // Info window.
        this.infoWindowWidth = Number(this.settings.infoWindowWidth) || 920;
        this.closeButtonSize = Number(this.settings.closeButtonSize) || 27;
        this.infoWindowMainBackgroundColor = this.settings.infoWindowMainBackgroundColor || 'rgba(255, 255, 255, .7)';
        this.infoWindowBackgroundColor = this.settings.infoWindowBackgroundColor || '#FFFFFF';
        this.infoWindowScrollBarColor = this.settings.infoWindowScrollBarColor || '#8b859b';
        this.closeButtonBackgroundNormalColor = this.settings.closeButtonBackgroundNormalColor || '#10A0F1';
        this.closeButtonBackgroundSelectedColor = this.settings.closeButtonBackgroundSelectedColor || '#FFFFFF';
        this.closeButtonIconNormalColor = this.settings.closeButtonIconNormalColor || '#FFFFFF';
        this.closeButtonIconSelectedColor = this.settings.closeButtonIconSelectedColor || '#8b859b';

        this.showInfoWindowButton = this.settings.showInfoWindowButton || "no";
        this.showInfoWindowButton = this.showInfoWindowButton == "yes" ? true : false;  

        const infoWindowElement = document.getElementById(this.settings.infoWindowData);
        this.loadInfoWindow(infoWindowElement);


        // Markers.
        this.showMarkerTool = this.settings.showMarkerTool || "yes";
        this.showMarkerTool = this.showMarkerTool == "yes" ? true : false;  

        this.hideMarkersWhenCameraIsAnimating = this.settings.hideMarkersWhenCameraIsAnimating || "yes";
        this.hideMarkersWhenCameraIsAnimating = this.hideMarkersWhenCameraIsAnimating == "yes" ? true : false; 

        const markersElement = document.getElementById(this.settings.markersData);

        this.markerShowAndHideAnimationType = this.settings.markerShowAndHideAnimationType || "scale";

        this.animateMarkersWithSkeleton = this.settings.animateMarkersWithSkeleton || "no";
        this.animateMarkersWithSkeleton = this.animateMarkersWithSkeleton == "yes" ? true : false;  
        
        this.showMarkersAfterTime = this.settings.showMarkersAfterTime || 2;
        if(this.showMarkersAfterTime !== undefined){
            this.showMarkersAfterTime =  Number(this.settings.showMarkersAfterTime);
        }
        this.showMarkersAfterTime *= 1000;
       
        this.markerToolTipOffsetY = Number(this.settings.markerToolTipOffsetY) || 10;

        this.markerPolygonOffsetAlpha = Number(this.settings.markerPolygonOffsetAlpha) || .1;

        this.markerToolTipAndWindowBackgroundColor = this.settings.markerToolTipAndWindowBackgroundColor || '#FF0000';
        this.loadMarkers(markersElement);

      
        this.markerPositionCopiedText = this.settings.markerPositionCopiedText || 'Marker position copied to colipboard!';
        this.cameraPositionCopiedText = this.settings.cameraPositionCopiedText || 'Camera position copied to colipboard!';
        this.preventToCopyMarkerPosition = this.settings.preventToCopyMarkerPosition || 'Please disable the model animation to add markers!';
        
        this.showCameraPositionsSelectMenu = this.settings.showCameraPositionsSelectMenu || "yes";
        this.showCameraPositionsSelectMenu = this.showCameraPositionsSelectMenu == "yes" ? true : false;  
      
        if(!this.cameraPositionsAr || (this.cameraPositionsAr && this.cameraPositionsAr.length == 0)){
            this.showCameraPositionsSelectMenu = false;
        }
        
        this.cameraPostitionSelectMenuButtonSize = this.settings.cameraPostitionSelectMenuButtonSize || 30;

        this.cameraPostionsSelectMenuDefaultText = this.settings.cameraPostionsSelectMenuDefaultText || '...';
        this.cameraPostitionSelectMenuMaxWidth = this.settings.cameraPostitionSelectMenuMaxWidth || 240;
        this.cameraPostitionSelectMenuHeight = this.settings.cameraPostitionSelectMenuHeight || 40;
        this.cameraPostitionSelectMenuStartAndEndGap  = this.settings.cameraPostitionSelectMenuStartAndEndGap || 21;
        this.cameraPostionsSelectMenuBackgroundColor = this.settings.cameraPostionsSelectMenuBackgroundColor || 'rgba(0, 0, 0, 0.40)';
        this.cameraPostionsSelectMenuTextColor = this.settings.cameraPostionsSelectMenuTextColor || 'rgba(0, 0, 0, 0.40)';
        this.cameraPostionsSelectMenuButtonNormalColor = this.settings.cameraPostionsSelectMenuButtonNormalColor || 'rgba(255, 0, 0, .3)';
        this.cameraPostionsSelectMenuButtonSelectedColor = this.settings.cameraPostionsSelectMenuButtonSelectedColor || 'rgba(255, 0, 0, 1)';
        this.cameraPositionsNextButtonTooltip = this.settings.cameraPositionsNextButtonTooltip;
        this.cameraPositionsPrevButtonTooltip = this.settings.cameraPositionsPrevButtonTooltip;

        this.cameraPositionsSelectItemsMaxWidth = this.settings.cameraPositionsSelectItemsMaxWidth || 450;
        this.cameraPositionsSelectItemHeight = this.settings.cameraPositionsSelectItemHeight || 20;
        this.cameraPositionsSelectItemStartLeftGap = this.settings.cameraPositionsSelectItemStartLeftGap || 10;
        this.cameraPositionsSelectItemStartRightGap = this.settings.cameraPositionsSelectItemStartRightGap || 20;
        this.cameraPositionsSelectItemVerticalGap = this.settings.cameraPositionsSelectItemVerticalGap || 7;
        this.cameraPositionsSelectSpaceBetweenItems = this.settings.cameraPositionsSelectSpaceBetweenItems || 20;
        this.cameraPositionsSelectMaxItems = this.settings.cameraPositionsSelectMaxItems || 3;
        this.cameraPositionsSelectItemBackgroundColor = this.settings.cameraPositionsSelectItemBackgroundColor || 'rgba(0, 0, 0, .6)';
        this.cameraPositionsSelectItemsScrollBarTrackColor = this.settings.cameraPositionsSelectItemsScrollBarTrackColor || '#767676';
        this.cameraPositionsSelectItemsScrollBarHandlerNormalColor = this.settings.cameraPositionsSelectItemsScrollBarHandlerNormalColor || '#767676';
        this.cameraPositionsSelectItemsScrollBarHandlerSelectedColor = this.settings.cameraPositionsSelectItemsScrollBarHandlerSelectedColor || '#FFFFFF';
        this.cameraPositionsSelectItemNormalColor = this.settings.cameraPositionsSelectItemNormalColor || '#D9D9D9';
        this.cameraPositionsSelectItemSelectedColor = this.settings.cameraPositionsSelectItemSelectedColor || '#FFFFFF';


        // GUI.
        this.showGUI = this.settings.showGUI || "yes";
        this.showGUI = this.showGUI == "yes" ? true : false;  
        if(FWDEMVUtils.isMobile){
            this.showGUI = false;
        }

        this.closeGUIWhenNotHit = this.settings.closeGUIWhenNotHit || "yes";
        this.closeGUIWhenNotHit = this.closeGUIWhenNotHit == "yes" ? true : false;  
        
        this.modelScaleOffsetMin = Number(this.settings.modelScaleOffsetMin) || 0;
        this.modelScaleOffsetMax = Number(this.settings.modelScaleOffsetMax) || 4;

        
        // Help screen.
        this.helpScreenText = this.settings.helpScreenText || 'Help';
        this.mouseRotateAndZoomText = this.settings.mouseRotateAndZoomText || 'Rotate And Zoom';
        this.mouseRotateAndZoomInfo = this.settings.mouseRotateAndZoomInfo || 'Use the left mouse click to rotate and mousewheel to zoom.';
        this.mousePanText = this.settings.mousePanText || 'Pan With Mouse';
        this.mousePanInfo = this.settings.mousePanInfo || 'Use the right click mouse button to pan.';
        this.keyboardPanText = this.settings.keyboardPanText || 'Pan With Keyboard';
        this.keyboardPanInfo = this.settings.keyboardPanInfo || 'Use the the W A S D keyboard keys to pan.';

        this.touchRotateText = this.settings.touchRotateText || 'Rotate.';
        this.touchRotateInfo = this.settings.touchRotateInfo || 'Use one finger to rotate.';
        this.touchPanText = this.settings.touchPanText || 'Pan';
        this.touchPanInfo = this.settings.touchPanInfo || 'Use two fingers to pan.';

        this.helpScreenIconColor = this.settings.helpScreenIconColor || '#10A0F1';

        this.resizeHelpSpit = 'col3';
        const helpScreenSplitAR = [this.enableZoom, this.enablePan, this.enableKeboardPan];

        if(!this.enableZoom){
            let index = this.butonsAR.indexOf(this.enableZoom);
            helpScreenSplitAR.splice(index, 1);
        }

        if(!this.enablePan){
            let index = this.butonsAR.indexOf(this.enablePan);
            helpScreenSplitAR.splice(index, 1);
        }

        if(!this.enableKeboardPan || FWDEMVUtils.isMobile){
            let index = this.butonsAR.indexOf(this.enableKeboardPan);
            helpScreenSplitAR.splice(index, 1);
        }

        if(this.enableOrbitalControls && FWDEMVUtils.isMobile && this.enableZoom){
           helpScreenSplitAR.push('blockTouch')
        }
      
        if(helpScreenSplitAR.length == 2){
            this.resizeHelpSpit = 'col2'
        }

        if(helpScreenSplitAR.length == 1){
            this.resizeHelpSpit = 'col1'
        }

        this.helpScreenData = '<div class="fwdemv-help-screen"><h1 class="fwdemv-help-screen-title">' + this.helpScreenText + '</h1><div class="' + this.resizeHelpSpit + '">'
      
        if(this.enableOrbitalControls && !FWDEMVUtils.isMobile){
           
            if(this.enableZoom){
                this.helpScreenData += '<div class="col"><h4>' + this.mouseRotateAndZoomText + '</h4><svg width="119" height="80" viewBox="0 0 119 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 17.1481L40 14.1852C42.1667 12.4568 46.6 9 47 9C47.5 9 74.5 15.2963 76 15.6667C77.2 15.963 76.8333 21.2222 76.5 23.8148C65.1667 23.8148 42.4 23.5926 42 22.7037C41.6 21.8148 41.8333 18.6296 42 17.1481Z" fill="white"/><path class="fwdemv-help-icon"  d="M59 21.1296V16.1296L58.5 15.6296L53.5 16.6296L50.5 18.1296C49.1667 19.1296 46.5 21.2296 46.5 21.6296C46.5 22.0296 45.1667 23.7963 44.5 24.6296L42 29.6296V37.6296L43 38.1296L59 37.6296V33.6296L58 32.1296L56 30.1296V27.1296L57 22.6296L59 21.1296Z" fill="#FF0000"/><g clip-path="url(#clip0_75_3050)"><path d="M59 14.6296C49.2106 14.6405 41.2775 22.5736 41.2667 32.363V52.8963C41.2667 62.6901 49.2062 70.6296 59 70.6296C68.7938 70.6296 76.7333 62.6901 76.7333 52.8963V32.363C76.7225 22.5736 68.7894 14.6405 59 14.6296ZM60.8667 23.963V29.563C60.8667 30.5939 60.031 31.4296 59 31.4296C57.969 31.4296 57.1333 30.5939 57.1333 29.563V23.963C57.1333 22.932 57.969 22.0963 59 22.0963C60.031 22.0963 60.8667 22.932 60.8667 23.963ZM43.1333 32.363C43.1472 23.9716 49.69 17.0408 58.0667 16.5439V20.3622C56.4234 20.7865 55.2731 22.2658 55.2667 23.963V29.563C55.2731 31.2601 56.4234 32.7394 58.0667 33.1638V37.0296H43.1333V32.363Z" fill="white"/><path d="M59 14.6296C49.2106 14.6405 41.2775 22.5736 41.2667 32.363V52.8963C41.2667 62.6901 49.2062 70.6296 59 70.6296C68.7938 70.6296 76.7333 62.6901 76.7333 52.8963V32.363C76.7225 22.5736 68.7894 14.6405 59 14.6296ZM60.8667 23.963V29.563C60.8667 30.5939 60.031 31.4296 59 31.4296C57.969 31.4296 57.1333 30.5939 57.1333 29.563V23.963C57.1333 22.932 57.969 22.0963 59 22.0963C60.031 22.0963 60.8667 22.932 60.8667 23.963ZM43.1333 32.363C43.1472 23.9716 49.69 17.0408 58.0667 16.5439V20.3622C56.4234 20.7865 55.2731 22.2658 55.2667 23.963V29.563C55.2731 31.2601 56.4234 32.7394 58.0667 33.1638V37.0296H43.1333V32.363ZM74.8667 52.8963C74.8569 61.6552 67.7589 68.7532 59 68.763C50.2411 68.7532 43.1431 61.6552 43.1333 52.8963V38.8963H74.8667V52.8963ZM74.8667 37.0296H59.9333V33.1638C61.5767 32.7394 62.7269 31.2601 62.7333 29.563V23.963C62.7269 22.2658 61.5767 20.7865 59.9333 20.3622V16.5439C68.31 17.0408 74.8528 23.9716 74.8667 32.363V37.0296Z" fill="#27292B"/></g><path fill-rule="evenodd" clip-rule="evenodd" d="M41 34V35C40.9636 35.4991 41.1047 36.0903 41.1179 36.5978C41.1235 36.8126 41.1152 36.9764 41.1179 37.2222L41.0583 38.1426C39.9133 38.629 39.291 39.1894 38.5564 39.851C38.4042 39.9881 38.2471 40.1296 38.0796 40.2756C37.1801 41.0596 36.8286 41.7652 36.8286 42.328C36.8286 42.8511 37.1085 43.4854 37.8475 44.2016C38.5809 44.9123 39.68 45.6144 41.0801 46.2488C43.6791 47.4263 47.3299 48.3862 51.7563 48.8556L50.549 47.9613C50.0831 47.6161 49.7143 47.0872 49.7143 46.4286C49.7143 45.77 50.0831 45.241 50.549 44.8959C51.4759 44.2093 52.7812 44.2093 53.7081 44.8959L60.351 49.8165C60.8169 50.1616 61.1857 50.6906 61.1857 51.3492C61.1857 52.0078 60.8169 52.5368 60.351 52.8819L53.7081 57.8025C53.4668 57.9813 53.2302 58.1111 52.9744 58.1954C52.7236 58.2779 52.4518 58.3175 52.1286 58.3175C51.2149 58.3175 50.3813 57.8877 49.976 57.1494C49.7715 56.7769 49.6833 56.3271 49.7863 55.8683C49.8901 55.406 50.1687 55.0189 50.549 54.7372L52.6958 53.147C46.9236 52.5997 41.9189 51.3325 38.2913 49.58C34.5297 47.7628 32 45.2942 32 42.328C32 38.8362 34.9851 35.9953 40.3267 34.0598L41 34ZM55.4272 52.3682L51.1443 55.5407C50.2833 56.1784 50.8994 57.3175 52.1286 57.3175C52.3674 57.3175 52.5306 57.2887 52.6617 57.2455C52.7963 57.2012 52.9387 57.128 53.1129 56.999L59.7557 52.0783C60.329 51.6537 60.329 51.0447 59.7557 50.6201L53.1129 45.6994C52.5396 45.2748 51.7176 45.2748 51.1443 45.6994C50.571 46.1241 50.571 46.733 51.1443 47.1577L55.1926 50.1565L52.9259 49.9699C47.8542 49.5525 43.6393 48.5061 40.6674 47.1596C37.7438 45.835 35.8286 44.1218 35.8286 42.328C35.8286 41.345 36.4288 40.3879 37.4225 39.5218C37.5724 39.3911 37.7182 39.2594 37.8643 39.1275C38.6088 38.455 39.3579 37.7784 40.6674 37.2222C40.6651 37.0107 40.6597 36.8034 40.6544 36.5978C40.6498 36.423 40.6453 36.2494 40.6428 36.0755C40.6376 35.7231 40.6405 35.369 40.6674 35C40.3144 35.1279 39.9742 35.259 39.6467 35.3931C35.0976 37.2559 33 39.7014 33 42.328C33 44.6746 35.0287 46.8933 38.7263 48.6796C42.4142 50.4612 47.6543 51.7513 53.7638 52.2362L55.4272 52.3682ZM76.8305 34.0317L78.2208 34.6292C80.4446 35.5848 82.247 36.7115 83.5079 37.9804C84.7726 39.2531 85.5429 40.7249 85.5429 42.328C85.5429 44.9281 83.615 47.1668 80.6181 48.898C77.5801 50.6528 73.2555 52.0045 68.063 52.7412L68.0614 52.7414C67.498 52.8249 66.906 52.7401 66.408 52.5097C65.9231 52.2854 65.3864 51.8482 65.2278 51.1432C65.0785 50.4797 65.2361 49.8528 65.6373 49.3935C66.014 48.9623 66.5622 48.7231 67.1947 48.645L67.1958 48.6448C71.1887 48.0697 74.6177 47.0847 77.0408 45.9017C78.2355 45.3185 79.1866 44.6844 79.8251 44.0401C80.4655 43.3938 80.7143 42.8197 80.7143 42.328C80.7143 41.8725 80.4912 41.3232 79.8989 40.6932C79.3084 40.0651 78.4172 39.4317 77.2669 38.8375L76.68 38.5343L76.7286 37.8754C76.7853 37.1072 76.8238 36.3014 76.826 35.545L76.8305 34.0317ZM67.3172 49.6374C66.8562 49.6944 66.5628 49.8541 66.3904 50.0514C66.2122 50.2555 66.1196 50.5515 66.2034 50.9237C66.3369 51.5171 67.1648 51.8633 67.9145 51.7522L67.921 51.7513C73.0368 51.0257 77.2267 49.7021 80.1179 48.032C83.0083 46.3624 84.5429 44.3863 84.5429 42.328C84.5429 40.0061 82.5003 37.7828 78.8209 36.0016C78.5015 35.8469 78.1698 35.6957 77.826 35.5479C77.8249 35.9022 77.8163 36.2655 77.8018 36.6295C77.7841 37.0732 77.7577 37.518 77.7259 37.949C80.1456 39.199 81.7143 40.7306 81.7143 42.328C81.7143 44.0293 79.9823 45.5784 77.4795 46.8003C74.9353 48.0425 71.3984 49.0498 67.3384 49.6346L67.3278 49.6361L67.3172 49.6374Z" fill="white"/><path class="fwdemv-help-icon" d="M33 42.328C33 39.5123 35.4104 36.9048 40.6674 35C40.6115 35.7655 40.6592 36.4665 40.6674 37.2222C39.101 37.8875 38.3364 38.7252 37.4225 39.5218C36.4288 40.3879 35.8286 41.345 35.8286 42.328C35.8286 44.1218 37.7438 45.835 40.6674 47.1596C43.6393 48.5061 47.8542 49.5525 52.9259 49.9699L55.1926 50.1565L51.1443 47.1577C50.571 46.733 50.571 46.1241 51.1443 45.6994C51.7176 45.2748 52.5396 45.2748 53.1129 45.6994L59.7557 50.6201C60.329 51.0447 60.329 51.6537 59.7557 52.0783L53.1129 56.999C52.9387 57.128 52.7963 57.2012 52.6617 57.2455C52.5306 57.2887 52.3674 57.3175 52.1286 57.3175C50.8994 57.3175 50.2833 56.1784 51.1443 55.5407L55.4272 52.3682L53.7638 52.2362C47.6543 51.7513 42.4142 50.4612 38.7263 48.6796C35.0287 46.8933 33 44.6746 33 42.328Z" fill="#FF0000"/><path class="fwdemv-help-icon" d="M77.7259 37.949C77.7838 37.1644 77.8237 36.3341 77.826 35.5479C82.1303 37.3976 84.5429 39.8045 84.5429 42.328C84.5429 44.3863 83.0083 46.3624 80.1179 48.032C77.2267 49.7021 73.0368 51.0257 67.921 51.7513L67.9145 51.7522C67.1648 51.8633 66.3369 51.5171 66.2034 50.9237C66.1196 50.5515 66.2122 50.2555 66.3904 50.0514C66.5628 49.8541 66.8562 49.6944 67.3172 49.6374L67.3278 49.6361L67.3384 49.6346C71.3984 49.0498 74.9353 48.0425 77.4795 46.8003C79.9823 45.5784 81.7143 44.0293 81.7143 42.328C81.7143 40.7306 80.1456 39.199 77.7259 37.949Z" fill="#FF0000"/><defs><clipPath id="clip0_75_3050"><rect width="56" height="56" fill="white" transform="translate(31 14.6296)"/></clipPath></defs></svg><h4 class="second">' + this.mouseRotateAndZoomText + '</h4><p>' + this.mouseRotateAndZoomInfo + '</p></div>';
            }

            if(this.enablePan){
                this.helpScreenData += '<div class="col"><h4>' + this.mousePanText + '</h4><svg width="119" height="80" viewBox="0 0 119 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-help-icon" d="M60 24V19L60.5 18.5L65.5 19.5L68.5 21C69.8333 22 72.5 24.1 72.5 24.5C72.5 24.9 73.8333 26.6667 74.5 27.5L77 32.5V40.5L76 41L60 40.5V36.5L61 35L63 33V30L62 25.5L60 24Z" fill="#FF0000"/><g clip-path="url(#clip0_75_3021)"><path d="M60 17.5C50.2106 17.5109 42.2775 25.444 42.2667 35.2333V55.7667C42.2667 65.5605 50.2062 73.5 60 73.5C69.7938 73.5 77.7333 65.5605 77.7333 55.7667V35.2333C77.7225 25.444 69.7894 17.5109 60 17.5ZM61.8667 26.8333V32.4333C61.8667 33.4643 61.031 34.3 60 34.3C58.969 34.3 58.1333 33.4643 58.1333 32.4333V26.8333C58.1333 25.8024 58.969 24.9667 60 24.9667C61.031 24.9667 61.8667 25.8024 61.8667 26.8333ZM44.1333 35.2333C44.1472 26.842 50.69 19.9112 59.0667 19.4143V23.2325C57.4234 23.6569 56.2731 25.1362 56.2667 26.8333V32.4333C56.2731 34.1305 57.4234 35.6098 59.0667 36.0341V39.9H44.1333V35.2333ZM75.8667 55.7667C75.8569 64.5255 68.7589 71.6235 60 71.6333C51.2411 71.6235 44.1431 64.5255 44.1333 55.7667V41.7667H75.8667V55.7667ZM75.8667 39.9H60.9333V36.0341C62.5767 35.6098 63.7269 34.1305 63.7333 32.4333V26.8333C63.7269 25.1362 62.5767 23.6569 60.9333 23.2325V19.4143C69.31 19.9112 75.8528 26.842 75.8667 35.2333V39.9Z" fill="#27292B"/></g><path class="fwdemv-help-icon" d="M94.8891 45.1465L90.3535 40.6109C90.2826 40.5435 90.1937 40.4981 90.0976 40.4803C90.0015 40.4624 89.9022 40.4728 89.8119 40.5102C89.7215 40.5477 89.644 40.6105 89.5886 40.6911C89.5333 40.7717 89.5025 40.8666 89.5 40.9644V43H81.5C81.3674 43 81.2402 43.0527 81.1464 43.1465C81.0527 43.2402 81 43.3674 81 43.5V47.5C81 47.6326 81.0527 47.7598 81.1464 47.8536C81.2402 47.9473 81.3674 48 81.5 48H89.5V50.0357C89.5603 50.3616 89.7269 50.5282 90 50.5357C90.0657 50.5357 90.1307 50.5227 90.1913 50.4976C90.252 50.4725 90.3071 50.4356 90.3535 50.3892L94.8891 45.8535C94.9829 45.7597 95.0355 45.6326 95.0355 45.5C95.0355 45.3674 94.9829 45.2403 94.8891 45.1465Z" fill="#FF0000"/><path class="fwdemv-help-icon" d="M24.1109 45.1465L28.6465 40.6109C28.7174 40.5435 28.8063 40.4981 28.9024 40.4803C28.9985 40.4624 29.0978 40.4728 29.1881 40.5102C29.2785 40.5477 29.356 40.6105 29.4114 40.6911C29.4667 40.7717 29.4975 40.8666 29.5 40.9644V43H37.5C37.6326 43 37.7598 43.0527 37.8536 43.1465C37.9473 43.2402 38 43.3674 38 43.5V47.5C38 47.6326 37.9473 47.7598 37.8536 47.8536C37.7598 47.9473 37.6326 48 37.5 48H29.5V50.0357C29.4397 50.3616 29.2731 50.5282 29 50.5357C28.9343 50.5357 28.8693 50.5227 28.8087 50.4976C28.748 50.4725 28.6929 50.4356 28.6465 50.3892L24.1109 45.8535C24.0171 45.7597 23.9645 45.6326 23.9645 45.5C23.9645 45.3674 24.0171 45.2403 24.1109 45.1465Z" fill="#FF0000"/><g clip-path="url(#clip1_75_3021)"><path class="fwdemv-help-icon" d="M58.793 7.75724L58.7929 7.7573L54.2573 12.2929L54.2572 12.2928L54.2484 12.302C54.1144 12.443 54.0242 12.6199 53.9887 12.8111C53.9531 13.0023 53.9738 13.1998 54.0483 13.3795L54.5102 13.1881L54.0483 13.3795C54.1227 13.5592 54.2476 13.7134 54.408 13.8235L54.408 13.8235C54.5683 13.9336 54.7571 13.9949 54.9516 13.9998L54.9516 14L54.9643 14L56.5 14L56.5 21.5C56.5 21.7652 56.6053 22.0196 56.7929 22.2071C56.9804 22.3946 57.2348 22.5 57.5 22.5L61.5 22.5C61.7652 22.5 62.0195 22.3946 62.2071 22.2071C62.3946 22.0196 62.5 21.7652 62.5 21.5L62.5 14L64.0356 14L64.0815 14L64.1265 13.9917C64.35 13.9503 64.58 13.8619 64.7586 13.6834C64.9467 13.4953 65.0288 13.2562 65.0354 13.0136L65.0356 13.0136L65.0356 13.0001C65.0357 12.8687 65.0098 12.7386 64.9595 12.6172C64.9092 12.496 64.8355 12.3858 64.7427 12.2929C64.7426 12.2929 64.7425 12.2928 64.7425 12.2927L60.207 7.7573L60.207 7.75724C60.0194 7.56977 59.7651 7.46446 59.5 7.46446C59.2348 7.46446 58.9805 7.56977 58.793 7.75724Z" fill="#FF0000" stroke="white"/></g><g clip-path="url(#clip2_75_3021)"><path class="fwdemv-help-icon" d="M59.1465 62.8891L54.6108 58.3535C54.5435 58.2826 54.4981 58.1937 54.4802 58.0976C54.4624 58.0015 54.4728 57.9022 54.5102 57.8119C54.5476 57.7215 54.6104 57.644 54.691 57.5886C54.7716 57.5333 54.8666 57.5025 54.9643 57.5L57 57.5L57 49.5C57 49.3674 57.0526 49.2402 57.1464 49.1464C57.2402 49.0527 57.3674 49 57.5 49L61.5 49C61.6326 49 61.7598 49.0527 61.8535 49.1464C61.9473 49.2402 62 49.3674 62 49.5L62 57.5L64.0356 57.5C64.3615 57.5603 64.5282 57.7269 64.5356 58C64.5356 58.0657 64.5227 58.1307 64.4976 58.1913C64.4724 58.252 64.4356 58.3071 64.3891 58.3535L59.8535 62.8891C59.7597 62.9829 59.6326 63.0355 59.5 63.0355C59.3674 63.0355 59.2402 62.9829 59.1465 62.8891Z" fill="#FF0000"/></g><defs><clipPath id="clip0_75_3021"><rect width="56" height="56" fill="white" transform="translate(32 17.5)"/></clipPath><clipPath id="clip1_75_3021"><rect width="16" height="16" fill="white" transform="translate(51.5 23) rotate(-90)"/></clipPath><clipPath id="clip2_75_3021"><rect width="16" height="16" fill="white" transform="matrix(4.37114e-08 1 1 -4.37114e-08 51.5 48)"/></clipPath></defs></svg><h4 class="second">' + this.mousePanText + '</h4><p>' + this.mousePanInfo + '</p></div>';
            }

            if(this.enableKeboardPan){
                this.helpScreenData += '<div class="col"><h4>' + this.keyboardPanText + '</h4><svg width="119" height="80" viewBox="0 0 119 80" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="43.0234" y="6.36719" width="32.9531" height="31.2188" rx="2.60156" stroke="black" stroke-width="1.73438"/><path class="fwdemv-help-icon" d="M59.8832 14.5088L64.7997 19.4254C64.8728 19.5022 64.9219 19.5986 64.9413 19.7028C64.9606 19.807 64.9494 19.9146 64.9088 20.0125C64.8682 20.1104 64.8002 20.1945 64.7128 20.2545C64.6254 20.3145 64.5225 20.3479 64.4166 20.3506L62.2099 20.3506L62.2099 29.0225C62.2099 29.1662 62.1528 29.3041 62.0512 29.4057C61.9495 29.5074 61.8117 29.5645 61.6679 29.5645L57.332 29.5645C57.1883 29.5645 57.0504 29.5074 56.9488 29.4057C56.8471 29.3041 56.79 29.1662 56.79 29.0225L56.79 20.3506L54.5834 20.3506C54.2301 20.2853 54.0495 20.1046 54.0414 19.8086C54.0414 19.7374 54.0554 19.6669 54.0827 19.6012C54.1099 19.5354 54.1499 19.4757 54.2002 19.4254L59.1168 14.5088C59.2184 14.4072 59.3563 14.3501 59.5 14.3501C59.6437 14.3501 59.7815 14.4072 59.8832 14.5088V14.5088Z" fill="#10A0F1"/><rect x="43.0234" y="42.7891" width="32.9531" height="31.2188" rx="2.60156" stroke="black" stroke-width="1.73438"/><path class="fwdemv-help-icon" d="M59.8832 65.8662L64.7997 60.9496C64.8728 60.8728 64.9219 60.7764 64.9413 60.6722C64.9606 60.568 64.9494 60.4604 64.9088 60.3625C64.8682 60.2646 64.8002 60.1805 64.7128 60.1205C64.6254 60.0605 64.5225 60.0271 64.4166 60.0244L62.2099 60.0244L62.2099 51.3525C62.2099 51.2088 62.1528 51.0709 62.0512 50.9693C61.9495 50.8676 61.8117 50.8105 61.6679 50.8105L57.332 50.8105C57.1883 50.8105 57.0504 50.8676 56.9488 50.9693C56.8471 51.0709 56.79 51.2088 56.79 51.3525L56.79 60.0244L54.5834 60.0244C54.2301 60.0897 54.0495 60.2704 54.0414 60.5664C54.0414 60.6376 54.0554 60.7081 54.0827 60.7738C54.1099 60.8396 54.1499 60.8993 54.2002 60.9496L59.1168 65.8662C59.2184 65.9678 59.3563 66.0249 59.5 66.0249C59.6437 66.0249 59.7815 65.9678 59.8832 65.8662Z" fill="#10A0F1"/><rect x="4.86719" y="42.7891" width="32.9531" height="31.2188" rx="2.60156" stroke="black" stroke-width="1.73438"/><path class="fwdemv-help-icon" d="M13.876 58.0152L18.7926 53.0987C18.8694 53.0257 18.9658 52.9765 19.07 52.9571C19.1742 52.9378 19.2818 52.9491 19.3797 52.9896C19.4776 53.0302 19.5617 53.0983 19.6217 53.1856C19.6817 53.273 19.7151 53.3759 19.7178 53.4819L19.7178 55.6885L28.3896 55.6885C28.5334 55.6885 28.6713 55.7456 28.7729 55.8472C28.8745 55.9489 28.9316 56.0867 28.9316 56.2305L28.9316 60.5664C28.9316 60.7102 28.8745 60.848 28.7729 60.9497C28.6713 61.0513 28.5334 61.1084 28.3896 61.1084L19.7178 61.1084L19.7178 63.315C19.6524 63.6683 19.4718 63.8489 19.1758 63.857C19.1046 63.857 19.0341 63.843 18.9684 63.8158C18.9026 63.7885 18.8429 63.7486 18.7926 63.6982L13.876 58.7816C13.7744 58.68 13.7173 58.5422 13.7173 58.3984C13.7173 58.2547 13.7744 58.1169 13.876 58.0152Z" fill="#10A0F1"/><rect x="81.1797" y="42.7891" width="32.9531" height="31.2188" rx="2.60156" stroke="black" stroke-width="1.73438"/><path class="fwdemv-help-icon" d="M105.124 58.7816L100.207 63.6982C100.131 63.7712 100.034 63.8204 99.93 63.8397C99.8258 63.8591 99.7182 63.8478 99.6203 63.8073C99.5224 63.7667 99.4383 63.6986 99.3783 63.6112C99.3183 63.5239 99.2849 63.421 99.2822 63.315V61.1084H90.6104C90.4666 61.1084 90.3287 61.0513 90.2271 60.9497C90.1255 60.848 90.0684 60.7102 90.0684 60.5664V56.2305C90.0684 56.0867 90.1255 55.9489 90.2271 55.8472C90.3287 55.7456 90.4666 55.6885 90.6104 55.6885H99.2822V53.4819C99.3476 53.1286 99.5282 52.9479 99.8242 52.9399C99.8954 52.9399 99.9659 52.9539 100.032 52.9811C100.097 53.0084 100.157 53.0483 100.207 53.0987L105.124 58.0152C105.226 58.1169 105.283 58.2547 105.283 58.3984C105.283 58.5422 105.226 58.68 105.124 58.7816Z" fill="#10A0F1"/></svg><h4 class="second">' + this.keyboardPanText + '</h4><p>' + this.keyboardPanInfo + '</p></div>';
            }

            this.helpScreenData += '</div></div>';
        }else{

            if(this.enableZoom){
                this.helpScreenData += '<div class="col"><h4>' + this.touchRotateText + '</h4><svg width="87" height="58" viewBox="0 0 87 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path  d="M61.1309 28.8546V37.9165C61.1309 44.2175 56.0047 49.3436 49.7038 49.3436H43.8299C39.638 49.3436 36.0314 47.2616 33.935 43.6314L27.2543 32.0627C26.4589 30.6788 26.9347 28.9066 28.3135 28.11C29.6356 27.3463 31.1551 27.1196 32.5918 27.4716C34.0639 27.8322 35.2987 28.7656 36.0686 30.0998L36.7117 31.2145V16.8023C36.7117 14.5813 38.5195 12.7744 40.7418 12.7744C42.9642 12.7744 44.7721 14.5813 44.7721 16.8023V22.635C45.2541 22.4307 45.7835 22.3177 46.3391 22.3177C47.7051 22.3177 48.9145 23.0003 49.6436 24.0422C50.2948 23.5899 51.085 23.3245 51.9362 23.3245C53.4893 23.3245 54.8398 24.2069 55.5126 25.4965C56.0507 25.2058 56.6661 25.0406 57.3194 25.0406C59.4211 25.0406 61.1309 26.7516 61.1309 28.8546ZM58.6699 28.8546C58.6699 28.1085 58.0641 27.5016 57.3193 27.5016C56.5745 27.5016 55.9664 28.1085 55.9664 28.8546V30.7893C55.9664 31.4688 55.4154 32.0198 54.7359 32.0198C54.0563 32.0198 53.5054 31.4688 53.5054 30.7893V27.3524C53.5054 26.4884 52.8014 25.7855 51.9361 25.7855C51.0707 25.7855 50.3691 26.4884 50.3691 27.3524V30.7893C50.3691 31.4688 49.8182 32.0198 49.1386 32.0198C48.4591 32.0198 47.9082 31.4688 47.9082 30.7893V26.3455C47.9082 25.4815 47.2042 24.7785 46.3389 24.7785C45.4737 24.7785 44.772 25.4815 44.772 26.3455V30.7893C44.772 31.4688 44.221 32.0198 43.5415 32.0198C42.8619 32.0198 42.311 31.4688 42.311 30.7893V16.8023C42.311 15.9383 41.607 15.2354 40.7417 15.2354C39.8763 15.2354 39.1724 15.9383 39.1724 16.8023V35.8098C39.1724 36.3668 38.7982 36.8543 38.2602 36.9984C37.7224 37.1424 37.1545 36.9071 36.8761 36.4247L33.9369 31.3298C33.5057 30.5827 32.8201 30.0614 32.0062 29.862C31.7589 29.8015 31.5064 29.7715 31.2533 29.7715C30.6692 29.7715 30.0814 29.9308 29.5443 30.241C29.3413 30.3582 29.269 30.63 29.3864 30.8343L36.0659 42.4007C37.7109 45.2491 40.5407 46.8828 43.8298 46.8828H49.7037C54.6477 46.8828 58.6699 42.8605 58.6699 37.9166L58.6699 28.8546Z" fill="#27292B"/><path class="fwdemv-help-icon" d="M28.9729 13.9259C28.9729 10.4664 34.8934 8.65625 40.7418 8.65625C46.5903 8.65625 52.5109 10.4664 52.5109 13.9259C52.5109 15.9255 50.4306 17.5938 46.8033 18.5028C46.7029 18.528 46.6022 18.54 46.5032 18.54C45.9521 18.54 45.4507 18.1672 45.3107 17.6084C45.1454 16.9492 45.5458 16.2809 46.205 16.1158C48.8571 15.4511 50.05 14.4351 50.05 13.9259C50.05 13.6401 49.57 12.9154 47.7534 12.219C45.8998 11.5085 43.4098 11.1172 40.7418 11.1172C38.0739 11.1172 35.5839 11.5085 33.7304 12.219C31.9138 12.9154 31.4338 13.64 31.4338 13.9259C31.4338 14.2332 31.869 14.725 32.7962 15.2128L32.5961 14.7284C32.3365 14.1003 32.6353 13.3808 33.2634 13.1213C33.8914 12.8617 34.6111 13.1605 34.8705 13.7885L36.1168 16.8045C36.3763 17.4325 36.0775 18.1521 35.4496 18.4117L32.4336 19.658C32.2798 19.7215 32.1206 19.7516 31.964 19.7516C31.4808 19.7516 31.0224 19.4652 30.8263 18.9908C30.5668 18.3628 30.8655 17.6432 31.4936 17.3836L31.5767 17.3493C29.8938 16.4385 28.9729 15.2556 28.9729 13.9259Z" fill="#27292B"/></svg><h4 class="second">' + this.touchRotateText + '</h4><p>' + this.touchRotateInfo + '</p></div>';
            }

            if(this.enablePan){
                this.helpScreenData += '<div class="col"><h4>' + this.touchPanText + '</h4><svg width="86" height="58" viewBox="0 0 86 58" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_455_950)"><path d="M43.0086 29V13.6785C43.0086 12.2592 41.7368 11.0594 40.1153 11.0206C38.4331 10.9802 37.0549 12.1614 37.0549 13.6243V30.0918H35.6465C34.1634 30.0918 32.9612 31.1437 32.9612 32.4414V36.5581C32.9612 43.3023 39.2094 48.7695 46.917 48.7695H46.9171C54.6246 48.7695 60.873 43.3023 60.873 36.5581V28.5611C60.873 27.1419 59.6012 25.9422 57.9798 25.9032C56.2975 25.8629 54.9193 27.0441 54.9193 28.507V27.6929C54.9193 26.2736 53.6475 25.0739 52.0262 25.035C50.3438 24.9947 48.9656 26.1758 48.9656 27.6388L48.9622 11.8352C48.9622 10.3966 47.6294 9.23047 45.9854 9.23047C44.3413 9.23047 43.0086 10.3966 43.0086 11.8352V29Z" stroke="#27292B" stroke-width="2.51662" stroke-miterlimit="10"/><path class="fwdemv-help-icon" d="M32.8413 12.3203H22.5959" stroke="#27292B" stroke-width="2.51662" stroke-miterlimit="10"/><path class="fwdemv-help-icon" d="M26.1272 15.4102L22.5959 12.3203L26.1272 9.2305" stroke="#27292B" stroke-width="2.51662" stroke-miterlimit="10"/><path class="fwdemv-help-icon" d="M53.1584 12.3203H63.4039" stroke="#27292B" stroke-width="2.51662" stroke-miterlimit="10"/><path class="fwdemv-help-icon" d="M59.8726 9.2305L63.4038 12.3204L59.8726 15.4102" stroke="#27292B" stroke-width="2.51662" stroke-miterlimit="10"/></g></svg><h4 class="second">' + this.touchPanText + '</h4><p>' + this.touchPanInfo + '</p></div>';
            }
        }
    
        if(!this.helpScreenData){
            let index = this.butonsAR.indexOf('help');
            this.butonsAR.splice(index, 1);

            try{
                this.buttonsToolTipsAR.splice(index, 1);
            }catch(e){}
        }
    }
    

    /**
     * Load textures.
     */
    loadTextures(){
        this.texturesDataAR = [
            {
                name: 'backgroundTexture',
                src: 'background.png',
                texture: undefined
            },
            {   
                name: 'backgroundPointer',
                src: 'background-pointer.png',
                texture: undefined
            },
            {
                name: 'border',
                src: 'border.png',
                texture: undefined
            },
            {
                name: 'borderPointer',
                src: 'border-pointer.png',
                texture: undefined
            },
            {
                name: 'iconInfo',
                src: 'icon-info.png',
                texture: undefined
            },
            {
                name: 'iconInfoPointer',
                src: 'icon-info-pointer.png',
                texture: undefined
            },
            {
                name: 'iconLink',
                src: 'icon-link.png',
                texture: undefined
            },
            {
                name: 'iconLinkPointer',
                src: 'icon-link-pointer.png',
                texture: undefined
            },
            {
                name: 'iconPlay',
                src: 'icon-play.png',
                texture: undefined
            },
            {
                name: 'iconPlayPointer',
                src: 'icon-play-pointer.png',
                texture: undefined
            },
            {
                name: 'iconPlus',
                src: 'icon-plus.png',
                texture: undefined
            },
            {
                name: 'iconPlusPointer',
                src: 'icon-plus-pointer.png',
                texture: undefined
            },
            {
                name: 'iconRewind',
                src: 'icon-rewind.png',
                texture: undefined
            },
            {
                name: 'iconRewindPointer',
                src: 'icon-rewind-pointer.png',
                texture: undefined
            }
        ];
      
        let textureId = 0;

        // Load center and from left textures.
        let textureLoader = new THREE.ImageLoader();
        loadTexture.bind(this)();

        function loadTexture(){
            if(!this.texturesDataAR[textureId]) return;

            textureLoader.load(
                this.texturesFolder + this.texturesDataAR[textureId].src,
                
                // onLoad.
                onLoadComplete.bind(this),
                
                // onProgress callback currently not supported
                undefined,

                // onError callback
                onLoadError.bind(this)
            )
        }

        function onLoadError(){
            let error = 'Texture not found -  <font color="#FF0000">' + this.texturesDataAR[textureId].src + '</font>';
            this.dispatchEvent(FWDEMVData.ERROR, {text:error});
        }

        function onLoadComplete(image){
            
            this.texturesDataAR[textureId].texture = new THREE.Texture();
            this.texturesDataAR[textureId].texture.image = image;
            this.texturesDataAR[textureId].texture.name = this.texturesDataAR[textureId].name;
          
            if(this.texturesDataAR[textureId]){
                textureId ++;
                loadTexture.bind(this)();
            }
            if(textureId ==  this.texturesDataAR.length){
                this.dataReady();
            }
        }
    }


    /**
     * Load info window.
     */
    loadInfoWindow(infoData){
        this.infoHWindowHTML = '';
      
        if(infoData){
            this.infoHWindowHTML = infoData.innerHTML.trim().replace(/\n/g, '');
        }
    }
    

    /**
     * Load markers.
     */
    loadMarkers(markerData){
       
        if(!markerData){
            return;
        }
      
        const data = FWDEMVUtils.getChildren(markerData);
        this.markersDataAr = [];
        this.cameraPositionsAr = [];
        this.countCameraPosition = 1;
        
        data.forEach((element, index) =>{
            const obj = {};

            
            // Position.
            obj.position = FWDEMVUtils.getAttributeValue(element, "data-position");
            const parsedObject = {};
            obj.position = obj.position.replace(/\s/g, '');          
            const keyValuePairs = obj.position.split(',');


            // Get bone name.
            let boneName = null;
            for (let i = 0; i < keyValuePairs.length; i++) {       
                if (/boneName/.test(keyValuePairs[i])) {
                    boneName = keyValuePairs[i];
                    keyValuePairs.splice(i, 1);
                    break;
                }
            }

            if(boneName){
                obj.boneName = boneName.split(':');
                obj.boneName = obj.boneName[1].trim(); 
            }

          
            // Get meshName.
            let meshName = null;
            for (let i = 0; i < keyValuePairs.length; i++) {       
                if (/meshName/.test(keyValuePairs[i])) {
                    meshName = keyValuePairs[i];
                    keyValuePairs.splice(i, 1);
                    break;
                }
            }

            if(meshName){
                obj.meshName = meshName.split(':');
                obj.meshName = obj.meshName[1].trim(); 
            }

         
            // Set position.
            for (var i = 0; i < keyValuePairs.length; i++) {

                // Split each key-value pair by ":" to separate the key and value
                var parts = keyValuePairs[i].trim().split(':');
                
                // Ensure there are two parts (key and value)
                if (parts.length === 2) {
                    var key = parts[0].trim();
                    var value = parseFloat(parts[1].trim());
                    
                    // Add the key-value pair to the object
                    parsedObject[key] = value;
                }
            }
            obj.position = parsedObject;
           


            // Camera position
            obj.cameraPosition = FWDEMVUtils.getAttributeValue(element, "data-camera-position");
            obj.cameraPositionAnimationDuration = FWDEMVUtils.getAttributeValue(element, "data-camera-position-animation-duration");
            if(obj.cameraPositionAnimationDuration == undefined){
                obj.cameraPositionAnimationDuration = 0;
            }

            obj.cameraPositionEasingType = FWDEMVUtils.getAttributeValue(element, "data-camera-position-animation-easing-type");
            if(obj.cameraPositionEasingType == undefined){
                obj.cameraPositionEasingType = 'linear'; // linear, easeout, easeinout
            }
           
            obj.animationFinishResetCamera =  FWDEMVUtils.getAttributeValue(element, "data-animation-finish-reset-camera"); // default, resetOnAnimationStart, resetOnAnimationFinish

            obj.cameraShowToolTipWhenFinished = FWDEMVUtils.getAttributeValue(element, "data-camera-show-tooltip-when-finished") || "yes";
            obj.cameraShowToolTipWhenFinished = obj.cameraShowToolTipWhenFinished == "no" ? false : true; 

            obj.cameraAnimationDuration = Number(FWDEMVUtils.getAttributeValue(element, "data-animation-show-tooltip-when-finished")) || 1;

            obj.cameraPositionName = FWDEMVUtils.getAttributeValue(element, "data-camera-position-name");
            obj.cameraAnimationDuration = Number(FWDEMVUtils.getAttributeValue(element, "data-camera-animation-duration")) || 1;

            if(obj.cameraPosition && obj.cameraPositionName){
                const parsedObject = {};
                obj.cameraPosition = obj.cameraPosition.replace(/\s/g, '');          
                const keyValuePairs = obj.cameraPosition.split(',');

                // Set position.
                for (var i = 0; i < keyValuePairs.length; i++) {

                    // Split each key-value pair by ":" to separate the key and value
                    var parts = keyValuePairs[i].trim().split(':');
                    
                    // Ensure there are two parts (key and value)
                    if (parts.length === 2) {
                        var key = parts[0].trim();
                        var value = parseFloat(parts[1].trim());
                        
                        // Add the key-value pair to the object
                        parsedObject[key] = value;
                    }
                }
                obj.cameraPosition = parsedObject;
              
                obj.cameraPositionName = obj.cameraPositionName;
                this.cameraPositionsAr.push({cameraPositionName: obj.cameraPositionName, cameraPosition: obj.cameraPosition, markerCameraPositionsId: index});
            }

            // Other info.
            obj.iconType = FWDEMVUtils.getAttributeValue(element, "data-icon-type");
            obj.scale = FWDEMVUtils.getAttributeValue(element, "data-scale");
            
            obj.normalsAngle = Number(FWDEMVUtils.getAttributeValue(element, "data-normals-angle"));
            if(obj.normalsAngle == undefined){
                obj.normalsAngle = 110;
            }

            obj.markerType = FWDEMVUtils.getAttributeValue(element, "data-marker-type") || '2D';
            obj.polygonOffsetUnits = FWDEMVUtils.getAttributeValue(element, "data-polygon-offset-units") || 0.5;
            if(obj.polygonOffsetUnits <= 0){
                obj.polygonOffsetUnits = 0;
            }else if(obj.polygonOffsetUnits >= 50){
                obj.polygonOffsetUnits = 50;
            }
            obj.polygonOffsetUnits = 50000 * -obj.polygonOffsetUnits;
          
            obj.registrationPoint = FWDEMVUtils.getAttributeValue(element, "data-registration-point");
            obj.borderColor = FWDEMVUtils.getAttributeValue(element, "data-border-color");
            obj.borderSelectedColor = FWDEMVUtils.getAttributeValue(element, "data-border-selected-color");
            obj.iconType = FWDEMVUtils.getAttributeValue(element, "data-icon-type");
            obj.backgroundColor = FWDEMVUtils.getAttributeValue(element, "data-background-color");
            obj.backgroundSelectedColor = FWDEMVUtils.getAttributeValue(element, "data-background-selected-color");
            obj.className = FWDEMVUtils.getAttributeValue(element, "data-class");
            obj.iconColor = FWDEMVUtils.getAttributeValue(element, "data-icon-color");
            obj.iconSelectedColor = FWDEMVUtils.getAttributeValue(element, "data-icon-selected-color");

            obj.link = FWDEMVUtils.getAttributeValue(element, "data-link");
            obj.target = FWDEMVUtils.getAttributeValue(element, "data-target");
            obj.maxWidth = 400;
            obj.toolTipOffsetX = Number(FWDEMVUtils.getAttributeValue(element, "data-tooltip-offset-x")) || 0;


            obj.animationName = FWDEMVUtils.getAttributeValue(element, "data-animation-name");

            obj.animationShowToolTipWhenFinished = FWDEMVUtils.getAttributeValue(element, "data-animation-show-tooltip-when-finished") || "yes";
            obj.animationShowToolTipWhenFinished = obj.animationShowToolTipWhenFinished == "no" ? false : true; 

            if(!obj.animationName){
                obj.animationShowToolTipWhenFinished = undefined;
            }

            obj.showTooltipBoferePlaying = FWDEMVUtils.getAttributeValue(element, "data-animation-show-tooltip-bofere-playing") || "no";
            obj.showTooltipBoferePlaying = obj.showTooltipBoferePlaying == "yes" ? true : false;

            obj.animationNameRepeatCount = FWDEMVUtils.getAttributeValue(element, "data-animation-repeat-count");
            obj.animationTimeScale = FWDEMVUtils.getAttributeValue(element, "data-animation-time-scale");

            obj.animateWithModel = FWDEMVUtils.getAttributeValue(element, "data-animate-with-model");
            obj.animationFinishAction = FWDEMVUtils.getAttributeValue(element, "data-animation-finish-action");
            if(obj.animationFinishAction ==  undefined){
                obj.animationFinishAction = 'default'; // "", default, clampWhenFinished, playInReverse, playInReverseWithMarker
            }
        
            if(obj.animateWithModel === undefined){
                obj.animateWithModel = true;
            }else if(obj.animateWithModel == 'no'){
                obj.animateWithModel = false;
            }else{
                obj.animateWithModel = true;
            }


            const child =  FWDEMVUtils.getChildren(element);
            if(child){
                child.forEach((infoChild) =>{
                    if(FWDEMVUtils.hasAttribute(infoChild, 'data-max-width')){
                        obj.maxWidth = FWDEMVUtils.getAttributeValue(infoChild, "data-max-width");
                    }

                    if(FWDEMVUtils.hasAttribute(infoChild, 'data-tooltip')){
                        obj.tooltipHTML = infoChild.innerHTML.trim().replace(/\n/g, '');
                    }
                    
                    if(FWDEMVUtils.hasAttribute(infoChild, 'data-info')){
                        obj.infoHTML = infoChild.innerHTML.trim().replace(/\n/g, '');
                    }
                });
            }
           
            this.markersDataAr.push(obj);
        });
    }


    /*
     * Ready!
     */
    dataReady(){
       
        setTimeout(() =>{
            if(this.destroyed) return;
            this.dispatchEvent(FWDEMVData.READY);
        }, 1);
    }


    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;
    }
}
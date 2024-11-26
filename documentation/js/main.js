/**
 * Front js file, handles most of the js functionality.
 *
 * @package sisc
 * @since sisc 1.0
 */
 
jQuery(document).ready(function($){
    
    'use strict';

    let last_scroll = 0;
    let scrollObj;
    let ww = 0;

    // Initialized main.
    function init(){

        $(window).on('resize', resizeHandler);        
        $(window).on('scroll',function(){

            let scroll = $(window).scrollTop();
            if(Math.abs(scroll - last_scroll) > $(window).height() * 0.1){
                last_scroll = scroll;
                revealStuff();   
            }

            if(page == 'api' || page == 'api-wp'){
                sideBarScroll();
            }
        });
       
        if(page == "main"){      
            setupViewer();
        }else if(page == "demos"){
            setupGrid();
        }else if(page == 'api' || page == 'api-wp'){  
            initScrollToAnchor();
            hljs.initHighlightingOnLoad();
            initSidebar();
            sideBarScroll();

            setTimeout(function(){
    			sideBarScroll();
                resizeHandler();
    		}, 100);
        }

        hideOrShowScondaryMenu();
        revealStuff();
        resizeHandler();
        setTimeout(resizeHandler, 100);
        $('.menu-background').addClass('reveal-opacity');
    }

    function resizeHandler(){
        ww = $(window).width();
        hideOrShowScondaryMenu();
        resizeFeaturesImg();
    }

    // Reveal stuff.
    function revealStuff(){

        
        if(isVisible($('.demos-header'), -200)){
           $('.demos-header').addClass('reveal');
        }

        if(isVisible($('.info'), -200)){
            $('.info').addClass('reveal');
        }

        if(isVisible($('.api-main'))){
            $('.api-main').addClass('reveal-top');
        }

        if(isVisible($('.model-1'), -200)){
            $('.model-1').addClass('reveal');
        }

        if(isVisible($('.info-cols'), -200)){
            $('.info-cols').addClass('reveal');
            let ct = 400;
            $('.info-cols .col').each(function(){
                setTimeout(() =>{
                    $(this).addClass('reveal'); 
                }, ct);
                ct += 100
            });
        }

        if(isVisible($('.main-ft .header'), -200)){
            $('.main-ft .header').addClass('reveal');
        }

        $('.main-ft .ft-col.fwd-hide').each(function(){
            if(isVisible($(this), -200)){
                $(this).addClass('reveal'); 
            }
        });

        if(isVisible($('.model'), -200)){
            $('.model').addClass('reveal');
        }

        if(isVisible($('.model-2'), -200)){
            $('.model-2').addClass('reveal');
        }

        if(isVisible($('.many-features .header'), -200)){
            $('.many-features .header').addClass('reveal');
        }

        $('.many-features .col.fwd-hide').each(function(){
            if(isVisible($(this), -200)){
                $(this).addClass('reveal'); 
            }
        });

        if(isVisible($('.questions-main'), -200)){
            $('.questions-main').addClass('reveal');
        }

        if(isVisible($('.ready'), -200)){
            $('.ready').addClass('reveal');
        }

        if(isVisible($('.footer-main'), -100)){
            $('.footer-main').addClass('reveal');
        }
        
    }

    function isVisible(element, offset){
       
        if(element.hasClass('reveal') || !element.length){
           return;
        }
        
        if(!offset){
            offset = 0;
        }  

        let scroll_pos = $(window).scrollTop();
        let window_height = $(window).height();
        let el_top = $(element).offset().top;
        let el_height = $(element).height();
        let el_bottom = el_top + el_height;
        let result = ((el_top - offset < scroll_pos + window_height));
        return result;
    }


    // Animate clicks.
    $('#features_menu, #features-footer').on('click', function(e){
        scrollToFeatures();
    });

    $('#top').on('click', function(e){
        scrollTop();
    });

    function scrollToFeatures(){
        let startY =  $('.m-ft').offset().top;
        let pos = startY - 80;
       
        scrollObj = {scrollPos:$(window).scrollTop()}
        
        $(scrollObj).animate({ // call animate on the object
            scrollPos: pos
        }, {
            duration: 800,
            easing: 'easeInOutExpo',
            step: function(now) { // called for each animation step (now refers to the value changed)
                window.scrollTo(0,now);
            }
        });
    }

    window.scrollTop =  function(){
        let startY =  0;
        let pos = startY;
       
        scrollObj = {scrollPos:$(window).scrollTop()}
        
        $(scrollObj).animate({ // call animate on the object
            scrollPos: pos
        }, {
            duration: 800,
            easing: 'easeInOutExpo',
            step: function(now) { // called for each animation step (now refers to the value changed)
                window.scrollTo(0,now);
            }
        });
    }

   
    // Menu.
    $('.sub-menu').on('mouseover', function(){
        //$(this).prt().addClass('active');
    });

    $('.sub-menu').on('mouseleave', function(){
        //$(this).prt().removeClass('active');
    });
    
   
    $('.menu').addClass('reveal');

    let vMenuShowed = false;
    $('.vertical-menu-toggle').on('click', function(){
        if(!vMenuShowed){
            vMenuShowed = true;
            $('.vertical-menu-toggle').addClass('vertical-menu--showed');
            $('.secondary-navigation').addClass('secondary-menu-show');
            setTimeout(() =>{
                $(window).on('click', closeSecondaryMenu);
                $(window).on('scroll', closeSecondaryMenu);
            }, 50);
            
        }else{
            vMenuShowed = false;
            $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
            $('.secondary-navigation').removeClass('secondary-menu-show');
        }
    });

    function closeSecondaryMenu(e){
        let vmc = FWDEMVUtils.getViewportMouseCoordinates(e);    
        if(!FWDEMVUtils.hitTest($('.vertical-menu-toggle')[0], vmc.x, vmc.y)
          && !FWDEMVUtils.hitTest($('.vertical-menu-toggle')[0], vmc.x, vmc.y)){
            vMenuShowed = false;
            $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
            $('.secondary-navigation').removeClass('secondary-menu-show');
            $(window).off('click', closeSecondaryMenu);
            $(window).off('scroll', closeSecondaryMenu);
        }
    }

    function hideOrShowScondaryMenu(){
        let sW = $(window).width();
        
        if(sW <= 943){
            $('.vertical-menu-toggle').addClass('vertical-menu-show');
            $('.primary-navigation').addClass('primary-menu-hide');
            $('.secondary-navigation').addClass('activate-secondary-menu');
            
        }else{
            $('.vertical-menu-toggle').removeClass('vertical-menu-show');
            $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
            $('.primary-navigation').removeClass('primary-menu-hide');
            $('.secondary-navigation').removeClass('activate-secondary-menu');
            $('.secondary-navigation').removeClass('secondary-menu-show');
            vMenuShowed = false;
        }
    }

  
    // Setup viewer.
    if($('#myDivHolder').hasClass('fwd-hide-top')){
        $('#myDivHolder').addClass('reveal-top');
    }else{
        $('#myDivHolder').addClass('reveal');
    }
    setTimeout(function(){
        $('#myDivHolder').css({'transform':'none'});
    }, 800);
    
    let robotViewer;
    let frogViewer;

    function setupViewer(){

        ww = $(window).width();
        
        // Robot.
        new FWDEMV({

            // General settings.  
            instance: 'fwdemv0',
            texturesFolder: 'content/markers/',
            displayType: 'responsive',
            parentId: 'myDiv',
            maxWidth: 637,
            startResizingWidth: 637,
            maxHeight: 560,
            autoScale: 'yes',
            initializeWhenVisible: 'no',
            lightboxCloseButtonWidth: 30,
            lightboxCloseButtonHeight: 30,
            lightboxCloseButtonBackgroundNormalColor: "#8C2EEA",
            lightboxCloseButtonBackgroundSelectedColor: "#FFFFFF",
            lightboxCloseButtonIconNormalColor: "#FFFFFF",
            lightboxCloseButtonIconSelectedColor: "#8C2EEA",
            lightboxBackgroundColor: 'rgba(0, 0, 0, .7)',
            backgroundColor: 'rgba(255, 0, 0, 0)',
            fullscreenBackgroundColor: '#FFFFFF',

            // Preloader.
            preloaderText: 'Loading 3D Model: ',
            preloaderPosition: 'center',
            preloaderOffsetX: 0,
            preloaderOffsetY: 0,
            showPreloaderProgressBar: 'yes',
            preloaderWidth: '40%',
            preloaderProgressBarBackgroundColor: '#8b859b',
            preloaderProgressBarFillColor: '#8C2EEA',
            preloaderFontColor: '#000000',
            preloaderBackgroundColor: 'rgba(255, 255, 255, 0)',

            // Display helper.
            showGridHelper: 'no',
            modelWireframe: 'no',
            showSkeletonHelper: 'no',

            // Model.
            source: './models/robot/scene.gltf',
            posterSource: '',
            showModelInfoInTheConsole: 'no',
            animateModelOpacityOnIntro: 'yes',
            loadModelDelay: .5,

            // Shadow.
            showShadow: 'yes',
            shadowBlur: 1.21,
            shadowDarkness: 1.144,
            shadowOpacity: .8,
            shadowPlanePositionOffsetY: 0.017,
            shadowPlaneOpacity: 0,
            shadowPlaneColor: '#FFFFFF',

            // Camera amd model initial position.
            cameraPosition: 'x:-0.0018204682370411805, y:0.11811132022089547, z:-0.8815267406456804, tx:0.015140977624731444, ty:-0.031420736374766695, tz:0.03174162621871551',
            modelScaleOffset: 0,
            modelPositionX: 0,
            modelPositionY: 0,

            // Controller.
            buttons: '',
            buttonsToolTips: '',
            showButtonsLabels: 'yes',
            showBlockTouchButton: 'yes',
            blockTouchButtonSize: 40,
            hideControllerDelay: 3,
            buttonSize: 30,
            startAndEndButtonsHorizontalGap: 22,
            startAndEndButtonsVerticalGap: 5,
            spaceBetweenButtons: 15,
            controllerOffsetY: 24,
            buttonsToolTipOffsetY: 6,
            buttonsIconNormalColor: '#FFFFFF',
            buttonsIconSelectedColor: '#d6d6d6',
            buttonToolTipBackgroundColor: "#FFFFFF",
            buttonToolTipTextColor: "#00000",
            controllerBackgrondColor: 'rgba(0, 0, 0, .4)',

            // Orbital controls.
            enableOrbitalControls: 'yes',
            zoomFactor: 0.01,
            zoomSpeed: .25,
            dampingFactor: 0.1,
            autoRotate: 'no',
            autoRotateSpeed: 0.2,
            screenSpacePanning: 'yes',
            enablePan: 'no',
            enableZoom: 'no',
            enableKeboardPan: 'yes',
            keysType: 'asdw', // arrows/asdw
            panSpeed: 1,
            keyPanSpeed: 1,
            zoomMinDistance: 0.37,
            zoomMaxDistance: 1.17,
            horizontalRotationMaxAngle: 0,
            horizontalRotationMinAngle: 0,
            verticalRotationMinAngle: 80,
            verticalRotationMaxAngle: 80,

            // Enviroment map.
            envMapSource: 'neutral',
            envMapShowBackground: 'no',
            backgroundBlurriness: 0,
            envMapIntensity: 1,

            // Lights.
            showLights: 'yes',
            toneMapping: 'Linear',
            toneMappingExposure: 0,
            ambientIntensity: 1,
            ambientColor: '#FFFFFF',
            directionalLightIntensity: 1,
            directionalLightColor: '#FFFFFF',
            directionalLightX: 0.5,
            directionalLightY: 0,
            directionalLightZ: 0.866,

            // Animations.
            defaultAnimationName:'Take 001',
            defaultAnimationPlayDelay: 0.2,
            defaultAnimationRepeatCount: 999999,
            defaultAnimationClampWhenFinished: 'yes',
            defaultAnimationCrossFadeDuration: .5,
            timeScale: 1,

            // Markers & camera positions.
            markersData: '',
            showMarkerTool: 'no',
            markerShowAndHideAnimationType: 'scale',
            showMarkersAfterTime: 2,
            markerToolTipOffsetY: 10,
            markerPolygonOffsetAlpha: .1,
            markerToolTipAndWindowBackgroundColor: '#FFFFFF',
            markerPositionCopiedText: 'Marker position copied to colipboard!',
            cameraPositionCopiedText: 'Camera position copied to colipboard!',
            preventToCopyMarkerPosition: 'Please disable the model animation to add markers!',
            showCameraPositionsSelectMenu: 'no',
            cameraPostionsSelectMenuDefaultText: 'Plane Details',
            cameraPostitionSelectMenuMaxWidth: 240,
            cameraPostitionSelectMenuHeight: 40,
            cameraPostitionSelectMenuStartAndEndGap: 14,
            cameraPostitionSelectMenuButtonSize: 30,
            cameraPostionsSelectMenuBackgroundColor: 'rgba(0, 0, 0, 0.40)',
            cameraPostionsSelectMenuTextColor: '#FFFFFF',
            cameraPositionsNextButtonTooltip: '',
            cameraPositionsPrevButtonTooltip: '',
            cameraPostionsSelectMenuButtonNormalColor: '#d6d6d6',
            cameraPostionsSelectMenuButtonSelectedColor: '#FFFFFF',
            cameraPositionsSelectItemsMaxWidth: 350,
            cameraPositionsSelectItemHeight: 24,
            cameraPositionsSelectItemStartLeftGap: 6,
            cameraPositionsSelectItemStartRightGap: 30,
            cameraPositionsSelectItemVerticalGap: 16,
            cameraPositionsSelectSpaceBetweenItems: 8,
            cameraPositionsSelectMaxItems: 4,
            cameraPositionsSelectItemBackgroundColor: 'rgba(0, 0, 0, .6)',
            cameraPositionsSelectItemsScrollBarTrackColor: '#D9D9D9',
            cameraPositionsSelectItemsScrollBarHandlerNormalColor: '#767676',
            cameraPositionsSelectItemsScrollBarHandlerSelectedColor: '#FFFFFF',
            cameraPositionsSelectItemNormalColor: '#D9D9D9',
            cameraPositionsSelectItemSelectedColor: '#FFFFFF',

            // Info window.
            showInfoWindowButton: 'yes',
            infoWindowData: 'info_window_data',
            infoWindowWidth: 1080,
            infoWindowMainBackgroundColor: 'rgba(255, 255, 255, .7)',
            closeButtonSize: 27,
            closeButtonHeight: 27,
            closeButtonBackgroundNormalColor: "#8C2EEA",
            closeButtonBackgroundSelectedColor: "#FFFFFF",
            closeButtonIconNormalColor: "#FFFFFF",
            closeButtonIconSelectedColor: "#8C2EEA",
            infoWindowBackgroundColor:"#FFFFFF",
            infoWindowScrollBarColor:"#8b859b",

            // Help screen.
            helpScreenText: 'Help',
            mouseRotateAndZoomText: 'Rotate And Zoom',
            mouseRotateAndZoomInfo: 'Use the left mouse click to rotate and mousewheel to zoom.',
            mousePanText: 'Pan With Mouse',
            mousePanInfo: 'Use the right click mouse button to pan.',
            keyboardPanText: 'Pan With Keyboard',
            keyboardPanInfo: 'Use the the <strong>W A S D</strong> keyboard keys to pan.',
            touchRotateText: 'Rotate',
            touchRotateInfo: 'Use one finger to rotate.',
            touchPanText: 'Pan',
            touchPanInfo: 'Use two fingers to pan.',
            helpScreenIconColor: '#8C2EEA',

            // GUI settings.
            showGUI: 'no',
            closeGUIWhenNotHit: 'no',
            modelScaleOffsetMin: 0,
            modelScaleOffsetMax: 1,
        });
       
        let registerAPIInterval1;
        registerAPI1();
        function registerAPI1(){
           
            clearInterval(registerAPIInterval1);
         
            robotViewer = window['fwdemv0'];
            if(robotViewer && robotViewer.APIReady){ 

                setTimeout(() =>{
                    $('.model-1 .curl.curl-1, .model-1 .curl.curl-2').addClass('show-curl');                    
                }, 1000);

                setTimeout(() =>{
                    $('.model-1 .curl.curl-1 .mask').addClass('show-mask')
                    $('.model-1 .curl.curl-2 .mask').addClass('show-mask-right')
                }, 1200);

            }else{
                registerAPIInterval1 = setInterval(registerAPI1, 100);
            }
        };
         
        // Frog.
        let frogPreloaderOffestX = 1;
        let frogPreloaderOffestY = 70;
        
        if(ww <= 1480){
            frogPreloaderOffestY = -10;
        }

        if(ww <= 1323){
            frogPreloaderOffestY = -160;
        }

        if(ww <= 1000){
            frogPreloaderOffestY = -190;
        }

        if(ww <= 1000){
            frogPreloaderOffestY = -160;
        }

        if(ww <= 600){
            frogPreloaderOffestY = -140;
        }

        let cameraPositionX = -0.22497090152573185;
        let cameraPositionY = 0.39088289709957474;
        let cameraPositionZ = 0.604759900322482;
        let controlsTargetPositionX = 0.03126687993657234;
        let controlsTargetPositionY = -0.09558602182502957;
        let controlsTargetPositionZ = 0.012224891367610591;
        let maxHeight = 750;

        if(ww <= 460){
            frogPreloaderOffestY = -120;
        }

        if(ww <= 460){
            frogPreloaderOffestY = -140;
        }

        let cameraPosition = `x:${cameraPositionX}, y:${cameraPositionY}, z:${cameraPositionZ}, tx:${controlsTargetPositionX}, ty:${controlsTargetPositionY}, tz:${controlsTargetPositionZ}`;
    
        new FWDEMV({

            // General settings.  
            instance: 'fwdemv1',
            texturesFolder: 'content/markers/',
            displayType: 'responsive',
            parentId: 'myDiv2',
            maxWidth: 850,
            startResizingWidth: 850,
            maxHeight: maxHeight,
            autoScale: 'yes',
            initializeWhenVisible: 'yes',
            lightboxCloseButtonWidth: 30,
            lightboxCloseButtonHeight: 30,
            lightboxCloseButtonBackgroundNormalColor: "#21A80B",
            lightboxCloseButtonBackgroundSelectedColor: "#FFFFFF",
            lightboxCloseButtonIconNormalColor: "#FFFFFF",
            lightboxCloseButtonIconSelectedColor: "#21A80B",
            lightboxBackgroundColor: 'rgba(0, 0, 0, .7)',
            backgroundColor: 'rgba(0,0,0,0)',
            fullscreenBackgroundColor: '#FFFFFF',

            // Preloader.
            preloaderText: 'Loading 3D Model: ',
            preloaderPosition: 'center',
            preloaderOffsetX: frogPreloaderOffestX,
            preloaderOffsetY: frogPreloaderOffestY,
            showPreloaderProgressBar: 'yes',
            preloaderWidth: '40%',
            preloaderProgressBarBackgroundColor: '#8b859b',
            preloaderProgressBarFillColor: '#21A80B',
            preloaderFontColor: '#FFFFFF',
            preloaderBackgroundColor: 'rgba(255, 255, 255, 0)',

            // Display helper.
            showGridHelper: 'no',
            modelWireframe: 'no',
            showSkeletonHelper: 'no',

            // Model.
            source: './models/frog/scene.gltf',
            posterSource: '',
            animateModelOpacityOnIntro: 'yes',
            showModelInfoInTheConsole: 'no',
            loadModelDelay: 1,

            // Shadow.
            showShadow: 'yes',
            shadowBlur: 1.21,
            shadowDarkness: 1.144,
            shadowOpacity: .8,
            shadowPlanePositionOffsetY: 0.017,
            shadowPlaneOpacity: 0,
            shadowPlaneColor: '#FFFFFF',

            // Camera amd model initial position.
            cameraPosition: cameraPosition,
            modelScaleOffset: 0,
            modelPositionX: 0,
            modelPositionY: 0,

            // Controller.
            buttons: 'play, zoomin, zoomout, fullscreen',
            buttonsToolTips: 'Play/Pause, Zoom in, Zoom out, Full screen/Normal screen',
            showButtonsLabels: 'yes',
            showBlockTouchButton: 'yes',
            blockTouchButtonSize: 40,
            hideControllerDelay: 3000,
            buttonSize: 30,
            startAndEndButtonsHorizontalGap: 22,
            startAndEndButtonsVerticalGap: 5,
            spaceBetweenButtons: 15,
            controllerOffsetY: 20,
            buttonsToolTipOffsetY: 6,
            buttonsIconNormalColor: '#FFFFFF',
            buttonsIconSelectedColor: '#d6d6d6',
            buttonToolTipBackgroundColor: "#FFFFFF",
            buttonToolTipTextColor: "#00000",
            controllerBackgrondColor: 'rgba(0, 0, 0, .4)',

            // Orbital controls.
            enableOrbitalControls: 'yes',
            zoomFactor: 0.1,
            zoomSpeed: .25,
            dampingFactor: 0.1,
            autoRotate: 'no',
            autoRotateSpeed: 2,
            screenSpacePanning: 'yes',
            enablePan: 'yes',
            enableZoom: 'no',
            enableKeboardPan: 'yes',
            keysType: 'asdw', // arrows/asdw
            panSpeed: 1,
            keyPanSpeed: 1,
            zoomMinDistance: 0.37,
            zoomMaxDistance: 1.36,
            horizontalRotationMaxAngle: 0,
            horizontalRotationMinAngle: 0,
            verticalRotationMinAngle: 53,
            verticalRotationMaxAngle: 53,

            // Enviroment map.
            envMapSource: './environmentMaps/sky.exr', //./environmentMaps/venice_sunset_1k.exr
            envMapShowBackground: 'no',
            backgroundBlurriness: 0,
            envMapIntensity: 1,

            // Lights.
            showLights: 'yes',
            toneMapping: 'ACESFilmic',
            toneMappingExposure: 0,
            ambientIntensity: 1,
            ambientColor: '#FFFFFF',
            directionalLightIntensity: 1,
            directionalLightColor: '#FFFFFF',
            directionalLightX: 0.5,
            directionalLightY: 0,
            directionalLightZ: 0.866,

            // Animations.
            defaultAnimationName:'idle2',
            defaultAnimationPlayDelay: 0.35,
            defaultAnimationRepeatCount: 999999,
            defaultAnimationClampWhenFinished: 'yes',
            defaultAnimationCrossFadeDuration: .5,
            timeScale: 1,

            // Markers & camera positions.
            markersData: 'markers_data_frog',
            showMarkerTool: 'no',
            markerShowAndHideAnimationType: 'scale',
            showMarkersAfterTime: 2,
            markerToolTipOffsetY: 10,
            markerPolygonOffsetAlpha: .1,
            markerToolTipAndWindowBackgroundColor: '#FFFFFF',
            markerPositionCopiedText: 'Marker position copied to colipboard!',
            cameraPositionCopiedText: 'Camera position copied to colipboard!',
            preventToCopyMarkerPosition: 'Please disable the model animation to add markers!',
            showCameraPositionsSelectMenu: 'no',
            cameraPostionsSelectMenuDefaultText: 'Plane Details',
            cameraPostitionSelectMenuMaxWidth: 240,
            cameraPostitionSelectMenuHeight: 40,
            cameraPostitionSelectMenuStartAndEndGap: 14,
            cameraPostitionSelectMenuButtonSize: 30,
            cameraPostionsSelectMenuBackgroundColor: 'rgba(0, 0, 0, 0.40)',
            cameraPostionsSelectMenuTextColor: '#FFFFFF',
            cameraPositionsNextButtonTooltip: '',
            cameraPositionsPrevButtonTooltip: '',
            cameraPostionsSelectMenuButtonNormalColor: '#d6d6d6',
            cameraPostionsSelectMenuButtonSelectedColor: '#FFFFFF',
            cameraPositionsSelectItemsMaxWidth: 350,
            cameraPositionsSelectItemHeight: 24,
            cameraPositionsSelectItemStartLeftGap: 6,
            cameraPositionsSelectItemStartRightGap: 30,
            cameraPositionsSelectItemVerticalGap: 16,
            cameraPositionsSelectSpaceBetweenItems: 8,
            cameraPositionsSelectMaxItems: 4,
            cameraPositionsSelectItemBackgroundColor: 'rgba(0, 0, 0, .6)',
            cameraPositionsSelectItemsScrollBarTrackColor: '#D9D9D9',
            cameraPositionsSelectItemsScrollBarHandlerNormalColor: '#767676',
            cameraPositionsSelectItemsScrollBarHandlerSelectedColor: '#FFFFFF',
            cameraPositionsSelectItemNormalColor: '#D9D9D9',
            cameraPositionsSelectItemSelectedColor: '#FFFFFF',

            // Info window.
            showInfoWindowButton: 'yes',
            infoWindowData: 'info_window_data_frog',
            infoWindowWidth: 1080,
            infoWindowMainBackgroundColor: 'rgba(255, 255, 255, .7)',
            closeButtonSize: 27,
            closeButtonHeight: 27,
            closeButtonBackgroundNormalColor: "#21A80B",
            closeButtonBackgroundSelectedColor: "#FFFFFF",
            closeButtonIconNormalColor: "#FFFFFF",
            closeButtonIconSelectedColor: "#21A80B",
            infoWindowBackgroundColor:"#FFFFFF",
            infoWindowScrollBarColor:"#8b859b",

            // Help screen.
            helpScreenText: 'Help',
            mouseRotateAndZoomText: 'Rotate And Zoom',
            mouseRotateAndZoomInfo: 'Use the left mouse click to rotate and mousewheel to zoom.',
            mousePanText: 'Pan With Mouse',
            mousePanInfo: 'Use the right click mouse button to pan.',
            keyboardPanText: 'Pan With Keyboard',
            keyboardPanInfo: 'Use the the <strong>W A S D</strong> keyboard keys to pan.',
            touchRotateText: 'Rotate',
            touchRotateInfo: 'Use one finger to rotate.',
            touchPanText: 'Pan',
            touchPanInfo: 'Use two fingers to pan.',
            helpScreenIconColor: '#21A80B',

            // GUI settings.
            showGUI: 'no',
            closeGUIWhenNotHit: 'no',
            modelScaleOffsetMin: 0,
            modelScaleOffsetMax: 1,
        });

        let registerAPIInterval2;
        registerAPI2();
        function registerAPI2(){
           
            clearInterval(registerAPIInterval2);
         
            frogViewer = window['fwdemv1'];
            if(frogViewer && frogViewer.APIReady){ 

                setTimeout(() =>{
                    $('.model-2 .curl.curl-1, .model-2 .curl.curl-2, .model-2 .curl.curl-3').addClass('show-curl');                    
                }, 1000);

                setTimeout(() =>{
                    $('.model-2 .curl.curl-1 .mask').addClass('show-mask')
                    $('.model-2 .curl.curl-2 .mask').addClass('show-mask');
                    $('.model-2 .curl.curl-3 .mask').addClass('show-mask-right');
                }, 1200);

            }else{
                registerAPIInterval2 = setInterval(registerAPI2, 100);
            }
        };

        let carPreloaderOffestY = 60
        if(ww <= 600){
            carPreloaderOffestY = 20;
        }

        new FWDEMV({

            // General settings.  
            instance: 'fwdemv2',
            texturesFolder: 'content/markers/',
            displayType: 'responsive',
            parentId: 'myDiv3',
            maxWidth: 1920,
            startResizingWidth: 1000,
            maxHeight: 850,
            autoScale: 'yes',
            initializeWhenVisible: 'yes',
            lightboxCloseButtonWidth: 30,
            lightboxCloseButtonHeight: 30,
            lightboxCloseButtonBackgroundNormalColor: "#f74300",
            lightboxCloseButtonBackgroundSelectedColor: "#FFFFFF",
            lightboxCloseButtonIconNormalColor: "#FFFFFF",
            lightboxCloseButtonIconSelectedColor: "#f74300",
            lightboxBackgroundColor: 'rgba(0, 0, 0, .7)',
            backgroundColor: '#FFFFFF',
            fullscreenBackgroundColor: '#FFFFFF',

            // Preloader.
            preloaderText: 'Loading 3D Model: ',
            preloaderPosition: 'centertop',
            preloaderOffsetX: 0,
            preloaderOffsetY: carPreloaderOffestY,
            showPreloaderProgressBar: 'yes',
            preloaderWidth: '30%',
            preloaderProgressBarBackgroundColor: '#8b859b',
            preloaderProgressBarFillColor: '#f74300',
            preloaderFontColor: '#000000',
            preloaderBackgroundColor: 'rgba(255, 255, 255, 1)',

            // Display helper.
            showGridHelper: 'no',
            modelWireframe: 'no',
            showSkeletonHelper: 'no',

            // Model.
            source: './models/car/scene.gltf',
            posterSource: 'media/images/car-poster.png',
            animateModelOpacityOnIntro: 'no',
            showModelInfoInTheConsole: 'no',
            loadModelDelay: 1,

            // Shadow.
            showShadow: 'yes',
            shadowBlur: 1.21,
            shadowDarkness: 1.144,
            shadowOpacity: .8,
            shadowPlanePositionOffsetY: 0.017,
            shadowPlaneOpacity: 0,
            shadowPlaneColor: '#FFFFFF',

            // Camera amd model initial position.
            cameraPosition: 'x:0.01987817472036776, y:0.03996634389895941, z:0.7238608093931996, tx:-0.026500105198969687, ty:-0.08463777560222667, tz:0.01871927252418688',
            modelScaleOffset: 0,
            modelPositionX: 0,
            modelPositionY: 0,

            // Controller.
            buttons: 'play, zoomin, zoomout, info, help, fullscreen',
            buttonsToolTips: 'Play/Pause, Zoom in, Zoom out, Info, Help, Full screen/Normal screen',
            showButtonsLabels: 'yes',
            showBlockTouchButton: 'yes',
            blockTouchButtonSize: 40,
            hideControllerDelay: 4,
            buttonSize: 30,
            startAndEndButtonsHorizontalGap: 22,
            startAndEndButtonsVerticalGap: 5,
            spaceBetweenButtons: 15,
            controllerOffsetY: 24,
            buttonsToolTipOffsetY: 6,
            buttonsIconNormalColor: '#FFFFFF',
            buttonsIconSelectedColor: '#d6d6d6',
            buttonToolTipBackgroundColor: "#FFFFFF",
            buttonToolTipTextColor: "#00000",
            controllerBackgrondColor: 'rgba(0, 0, 0, .4)',

            // Orbital controls.
            enableOrbitalControls: 'yes',
            zoomFactor: 0.1,
            zoomSpeed: .25,
            dampingFactor: 0.1,
            autoRotate: 'yes',
            autoRotateSpeed: 0.6,
            screenSpacePanning: 'yes',
            enablePan: 'yes',
            enableZoom: 'no',
            enableKeboardPan: 'yes',
            keysType: 'asdw', // arrows/asdw
            panSpeed: 1,
            keyPanSpeed: 1,
            zoomMinDistance: 0.37,
            zoomMaxDistance: 1.17,
            horizontalRotationMaxAngle: 0,
            horizontalRotationMinAngle: 0,
            verticalRotationMinAngle: 80,
            verticalRotationMaxAngle: 80,

            // Enviroment map.
            envMapSource: './environmentMaps/rural_graffiti_tower_1k.exr',
            envMapShowBackground: 'yes',
            backgroundBlurriness: 1,
            envMapIntensity: 1,

            // Lights.
            showLights: 'yes',
            toneMapping: 'ACESFilmic',
            toneMappingExposure: 0,
            ambientIntensity: 1,
            ambientColor: '#FFFFFF',
            directionalLightIntensity: 1,
            directionalLightColor: '#FFFFFF',
            directionalLightX: 0.5,
            directionalLightY: 0,
            directionalLightZ: 0.866,

            // Animations.
            defaultAnimationName:'idle2',
            defaultAnimationPlayDelay: 0.2,
            defaultAnimationRepeatCount: 999999,
            defaultAnimationClampWhenFinished: 'yes',
            defaultAnimationCrossFadeDuration: .5,
            timeScale: 1,

            // Markers & camera positions.
            markersData: 'markers_data_car',
            showMarkerTool: 'no',
            markerShowAndHideAnimationType: 'scale',
            showMarkersAfterTime: 2,
            markerToolTipOffsetY: 10,
            markerPolygonOffsetAlpha: .1,
            markerToolTipAndWindowBackgroundColor: '#FFFFFF',
            markerPositionCopiedText: 'Marker position copied to colipboard!',
            cameraPositionCopiedText: 'Camera position copied to colipboard!',
            preventToCopyMarkerPosition: 'Please disable the model animation to add markers!',
            showCameraPositionsSelectMenu: 'yes',
            cameraPostionsSelectMenuDefaultText: 'Car Details',
            cameraPostitionSelectMenuMaxWidth: 240,
            cameraPostitionSelectMenuHeight: 40,
            cameraPostitionSelectMenuStartAndEndGap: 14,
            cameraPostitionSelectMenuButtonSize: 30,
            cameraPostionsSelectMenuBackgroundColor: 'rgba(0, 0, 0, 0.40)',
            cameraPostionsSelectMenuTextColor: '#FFFFFF',
            cameraPositionsNextButtonTooltip: '',
            cameraPositionsPrevButtonTooltip: '',
            cameraPostionsSelectMenuButtonNormalColor: '#d6d6d6',
            cameraPostionsSelectMenuButtonSelectedColor: '#FFFFFF',
            cameraPositionsSelectItemsMaxWidth: 240,
            cameraPositionsSelectItemHeight: 24,
            cameraPositionsSelectItemStartLeftGap: 6,
            cameraPositionsSelectItemStartRightGap: 30,
            cameraPositionsSelectItemVerticalGap: 16,
            cameraPositionsSelectSpaceBetweenItems: 8,
            cameraPositionsSelectMaxItems: 4,
            cameraPositionsSelectItemBackgroundColor: 'rgba(0, 0, 0, .6)',
            cameraPositionsSelectItemsScrollBarTrackColor: '#D9D9D9',
            cameraPositionsSelectItemsScrollBarHandlerNormalColor: '#767676',
            cameraPositionsSelectItemsScrollBarHandlerSelectedColor: '#FFFFFF',
            cameraPositionsSelectItemNormalColor: '#D9D9D9',
            cameraPositionsSelectItemSelectedColor: '#FFFFFF',

            // Info window.
            showInfoWindowButton: 'yes',
            infoWindowData: 'info_window_data_car',
            infoWindowWidth: 1080,
            infoWindowMainBackgroundColor: 'rgba(255, 255, 255, .7)',
            closeButtonSize: 27,
            closeButtonHeight: 27,
            closeButtonBackgroundNormalColor: "#f74300",
            closeButtonBackgroundSelectedColor: "#FFFFFF",
            closeButtonIconNormalColor: "#FFFFFF",
            closeButtonIconSelectedColor: "#f74300",
            infoWindowBackgroundColor:"#FFFFFF",
            infoWindowScrollBarColor:"#8b859b",

            // Help screen.
            helpScreenText: 'Help',
            mouseRotateAndZoomText: 'Rotate And Zoom',
            mouseRotateAndZoomInfo: 'Use the left mouse click to rotate and mousewheel to zoom.',
            mousePanText: 'Pan With Mouse',
            mousePanInfo: 'Use the right click mouse button to pan.',
            keyboardPanText: 'Pan With Keyboard',
            keyboardPanInfo: 'Use the the <strong>W A S D</strong> keyboard keys to pan.',
            touchRotateText: 'Rotate',
            touchRotateInfo: 'Use one finger to rotate the camera.',
            touchPanText: 'Pan',
            touchPanInfo: 'Use two fingers to pan the camera.',
            helpScreenIconColor: '#f74300',

            // GUI settings.
            showGUI: 'yes',
            closeGUIWhenNotHit: 'yes',
            modelScaleOffsetMin: 0,
            modelScaleOffsetMax: 1,
        });

    }

   
    // Main features.
    function resizeFeaturesImg(){
        if(!$('#img_1').length) return;
        var sw = $(window).outerWidth();

        if(sw <= 1015){
            
            var dW = 570;
            var dH = 369;
            var scale = $('#img_1').width() / dW;
            var h = Math.round(dH * scale);
            $('.main-ft .image').each(function(indx, el){
                $(el).height(h)
            });
        }else{
             $('.main-ft .image').each(function(indx, el){
                $(el).height(324)
            });
        }
    }

    if($('#img_1').length){
       
        new FWDSI({ 
            //main settings
            instanceName:"img_i_1",
            displayType:"afterparent",
            parentId:"img_1",
            limitId:"test",
            imageSource:"assets/1.jpg",
            initializeOnlyWhenVisible:"yes",
            slideshowPreloaderPosition:'center',
            slideshowRadius:10,
            maxWidth:570,
            maxHeight:369,
            slideshowBackgroundColor:"#FFFFFF",
            slideshowFillColor:"#000000",
            slideshowStrokeSize:3,
            backgroundColor:"#transparent"
        });

        new FWDSI({ 
            //main settings
            instanceName:"img_i_2",
            displayType:"afterparent",
            parentId:"img_2",
            limitId:"test",
            imageSource:"assets/2.jpg",
            initializeOnlyWhenVisible:"yes",
            slideshowPreloaderPosition:'center',
            slideshowRadius:10,
            maxWidth:570,
            maxHeight:369,
            slideshowBackgroundColor:"#FFFFFF",
            slideshowFillColor:"#000000",
            slideshowStrokeSize:3,
            backgroundColor:"#transparent"
        });

        new FWDSI({ 
            //main settings
            instanceName:"img_i_3",
            displayType:"afterparent",
            parentId:"img_3",
            limitId:"test",
            imageSource:"assets/3.jpg",
            initializeOnlyWhenVisible:"yes",
            slideshowPreloaderPosition:'center',
            slideshowRadius:10,
            maxWidth:570,
            maxHeight:369,
            slideshowBackgroundColor:"#FFFFFF",
            slideshowFillColor:"#000000",
            slideshowStrokeSize:3,
            backgroundColor:"#transparent"
        });
    }


    // Questions accordion.
    $('.accordion').each(function () {
        var $accordion = $(this);
        $accordion.find('.panel-title').on('click', function () {
            var $t = $(this);
            if($t.closest('.active').length){
                $t.closest('.active').find('.panel-content').slideUp(500, function(){
                    $(this).closest('.active').removeClass('active');
                });
                return false;
            }
            var $newPanel = $t.closest('.panel'),
                index = $newPanel.prevAll().length;
            var $panelActive = $accordion.find('.active');
            if ($panelActive.length) {
                $panelActive.find('.panel-content').slideUp(500, function(){
                    $(this).closest('.panel').removeClass('active');
                    $accordion.find('.panel:eq(' + index + ') .panel-content').slideDown(300)
                              .closest('.panel').addClass('active');
                });
            }else{
                $accordion.find('.panel:eq(' + index + ') .panel-content').slideDown(300)
                          .closest('.panel').addClass('active');
            }
            return false;
        });
    });


    function setupGrid(){
        FWDVSUtils.checkIfHasTransofrms();
        new FWDVS({
            //main settings 
            gridType:"classic",
            rightClickContextMenu:"default",
            instanceName:"myUGP",
            parentId:"myGDiv",
            mainFolderPath:"content",
            gridSkinPath:"grid_skin_classic",
            playlistId:"myPlaylist",
            allCategoriesLabel:"All",
            notFoundLabel:"Nothing found",
            showAllCategories:"yes",
            randomizeCategories:"no",
            animateParent:"yes",
            initializeOnlyWhenVisible:"no",
            prelaoderAllScreen:"no",
            searchLabel:"Search",
            startAtCategory:0,
            slideshowRadius:10,
            slideshowBackgroundColor:"#FFFFFF",
            slideshowFillColor:"#000000",
            slideshowStrokeSize:3,
            // menu settings
            showMenu:"yes",
            showMenuButtonsSpacers:"no",
            comboboxSelectorLabel:"Select categories",
            menuButtonSpacerHeight:20,
            //thumbnail settings
            howManyThumbnailsToDisplayPerSet:10,
            useThumbnailSlideshow:"yes",
            hideAndShowTransitionType:"scale",
            thumbanilBoxShadow:"none",
            disableThumbnails:"no",
            thumbnailBorderNormalColor:"",
            thumbnailBorderSelectedColor:"",
            thumbnailsHorizontalOffset:0,
            thumbnailsVerticalOffset:0,
            thumbnailMaxWidth:340,
            thumbnailMaxHeight:250,
            horizontalSpaceBetweenThumbnails:20,
            verticalSpaceBetweenThumbnails:32,
            thumbnailBorderSize:0,
            thumbnailBorderRadius:0,
            //preset settings
            preset:"team",
            previewText:"Read more",
            thumbnailOverlayOpacity:.5
        });

        myUGP.addListener(FWDVS.READY, createLeftGridMenu);
    }

    function createLeftGridMenu(){
        var cats = myUGP.data.cats;

        setTimeout(function(){
            $('.p-selector').addClass('reveal');
        }, 400);
        
        $('.demos .left').removeClass('load');
        $('.demos .right').removeClass('load');
        $('#myGDiv').removeClass('grid-load');


        for(var i=0; i<cats.length; i++){
           //$('.top .dumy').append('<p class="item fwd-hide-left" id="item_' + i + '"">' + cats[i]['label'] + '<span>' + cats[i]['tt']  + '</span></p>');
           $('.top .dumy').append('<p class="item fwd-hide-left" id="item_' + i + '"">' + cats[i]['label'] + '</p>');
        }

        // Reveal.
        setTimeout(function(){
            $('.choose').addClass('reveal');
            $('.search-holder').addClass('reveal-left');
            var dl = 200;
            $('.dumy .item').each(function(index, element){
                setTimeout(function(){
                    $(element).addClass('reveal-left');
                }, dl);  
                dl += 100;
            })
        }, 200);

        // Click events.
        $('.dumy .item').each(function(index, element){
            $(this).on('click', function(e){
                var id = parseInt(/[0-9]/.exec($(this).attr('id')));
                checkGridMenu(id);
                myUGP.updateCategory([id]);

            });
        });

        checkGridMenu(0);
        setupGridSearch();
    }

    function checkGridMenu(id){
        $('.dumy .item').each(function(index, element){
            var fid = parseInt(/[0-9]/.exec($(this).attr('id')));
            if(fid == id){
                $(this).addClass('grid-menu-active');
            }else{
                 $(this).removeClass('grid-menu-active');
            }
        });
    }

    var updateSearch_to;
    var isSearchShowed;
    var searchVal;
    var prevInptVal;
    var srcText = 'Search';

    function setupGridSearch(){
        var inpt = $('.search-holder input')[0];
        inpt.addEventListener("focus", inputFocusIn);
        inpt.addEventListener("blur", inputFocusOut);
        inpt.addEventListener("keyup", keyUpHandler);

        function inputFocusIn(){
            if(isSearchShowed) return;
            isSearchShowed = true;
            if(inpt.value == srcText){
                inpt.value = "";
            }
        }

         function inputFocusOut(e){
            if(!isSearchShowed) return;
            var vc = FWDVSUtils.getViewportMouseCoordinates(e); 
            if(!FWDVSUtils.hitTest(inpt, vc.screenX, vc.screenY)){
                isSearchShowed = false;
                if(inpt.value == ""){
                    inpt.value = srcText;
                }
                return;
            }
         }

         function keyUpHandler(e){
            if(e.stopPropagation) e.stopPropagation();
            var inptValue;
            
            if (prevInptVal != inpt.value){
                inptValue = inpt.value.toLowerCase();
                if (inptValue != srcText){
                    searchVal = inptValue;
                    clearTimeout(updateSearch_to);
                    self.updateSearch_to = setTimeout(function(){
                        myUGP.thumbnailManager_do.search(searchVal.toLowerCase());
                    }, 100);
                }
            }
            
            prevInptVal = inpt.value;
         }
    }

     // Help sidebar.
     var sBar = $('aside');
     var sBarHolder = $('main');
     var scrObj2 = {'offsetTop':0}
     var curSideClick;
     var asideShowed = false;
     
     var mainA;
     var sideA;
 
     $('.help-menu-toggle').on('click', function(e){
          if(!asideShowed){
              asideShowed = true;
              $('aside').addClass('showed');
              $(window).on('click', closeAside);
          }else{
              asideShowed = false;
              $('aside').removeClass('showed');
          }
     });
 
     function closeAside(e){
         var vmc = FWDRLUtils.getViewportMouseCoordinates(e);    
 
         if(!FWDRLUtils.hitTest($('aside')[0], vmc.screenX, vmc.screenY)
         && !FWDRLUtils.hitTest($('.help-menu-toggle')[0], vmc.screenX, vmc.screenY)){
            asideShowed = false;
            $('aside').removeClass('showed');
         }
     }
    
     function initSidebar(){
         sideA = $('.api-main aside')[0].querySelectorAll('[href]');
         mainA = $('.api-main main')[0].querySelectorAll('[id]:not(.img)');
       
         for(var i=0; i<mainA.length; i++){
             var el = mainA[i];
         }

         for(var i=0; i<sideA.length; i++){
             var el = sideA[i];
             
             el.addEventListener('click', function(e){
                 
                 for(var i=0; i<sideA.length; i++){
                     var el = sideA[i];
                     el.className = '';
                 }
                 curSideClick = e.target;
                 setTimeout(function(){
                     curSideClick.className = 'active';
                 }, 250)
                 
             })
         }
     }
 
 
     function sideBarScroll(){
         if(!mainA) return;
 
         var wH = window.innerHeight;
         var scroll_pos = $(window).scrollTop();
         var top = sBarHolder.offset().top;
         if(scroll_pos > top - 20){
             sBar.css({'position': 'fixed', 'top':20})
         }else{
             sBar.css({'position': 'absolute', 'top':0})
         }
 
         for(var i=0; i<mainA.length; i++){
             var el = mainA[i];
             var nextEl = mainA[i + 1];
             var next2El = mainA[i + 2];
             var curEl = mainA[0];
 
             if(el.getBoundingClientRect().y < 100){
                 curEl = el;
             }
 
             for(var j=0; j<mainA.length; j++){
                 var el2 =  mainA[j];
                 if(el2.getBoundingClientRect().y < 100){
                     curEl = el2;
                 }
             }
         }
 
         for(var i=0; i<sideA.length; i++){
             var el = sideA[i];
             el.className = '';
             
             if(curEl.id == el.href.match(/#(.*)/g)[0].substr(1)){
                 curEl = el;
                 curEl.className = 'active';
             }
         }
     }
 
 
      // Scroll smooth.
      var scrObj = {scrStart:0, scrEnd:0}
      function initScrollToAnchor(){
          var anchors = document.querySelectorAll('a[href^="#"]');
          for(var i=0; i<anchors.length; i++) {
              anchors[i].addEventListener( 'click', anchor, false );   
          }
  
          window.addEventListener('wheel', stopScrollToAnchorAnim, false);
          window.addEventListener('touchstart', stopScrollToAnchorAnim, false);
  
          function anchor( event ) {
          
              event.preventDefault(); 
              event.stopPropagation();
  
              scrObj.scrEnd = window.pageYOffset;
  
              var id = this.getAttribute( 'href' ),
                  el = document.getElementById(id.replace('#', ''));
                  scrObj.scrStart = el ? Math.round( el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 20) : null;
  
              if(el){
                  scrObj.scrStart = Math.min(scrObj.scrStart, document.body.scrollHeight - window.innerHeight);
 
                 // FWDAnimation.to(scrObj, .01, {scrEnd:scrObj.scrStart, onUpdate:function(e){
                      window.scrollTo(0, scrObj.scrStart);
                 // }, ease:Expo.easeInOut});
              }
          }
      }
  
      function stopScrollToAnchorAnim(){
          FWDAnimation.killTweensOf(scrObj);
          //FWDAnimation.killTweensOf(scrObj2);
      }

 
    init();

});

/*! highlight.js */
!function(e){var n="object"==typeof window&&window||"object"==typeof self&&self;"undefined"!=typeof exports?e(exports):n&&(n.hljs=e({}),"function"==typeof define&&define.amd&&define([],function(){return n.hljs}))}(function(e){function n(e){return e.replace(/[&<>]/gm,function(e){return I[e]})}function t(e){return e.nodeName.toLowerCase()}function r(e,n){var t=e&&e.exec(n);return t&&0===t.index}function i(e){return k.test(e)}function a(e){var n,t,r,a,o=e.className+" ";if(o+=e.parentNode?e.parentNode.className:"",t=B.exec(o))return R(t[1])?t[1]:"no-highlight";for(o=o.split(/\s+/),n=0,r=o.length;r>n;n++)if(a=o[n],i(a)||R(a))return a}function o(e,n){var t,r={};for(t in e)r[t]=e[t];if(n)for(t in n)r[t]=n[t];return r}function u(e){var n=[];return function r(e,i){for(var a=e.firstChild;a;a=a.nextSibling)3===a.nodeType?i+=a.nodeValue.length:1===a.nodeType&&(n.push({event:"start",offset:i,node:a}),i=r(a,i),t(a).match(/br|hr|img|input/)||n.push({event:"stop",offset:i,node:a}));return i}(e,0),n}function c(e,r,i){function a(){return e.length&&r.length?e[0].offset!==r[0].offset?e[0].offset<r[0].offset?e:r:"start"===r[0].event?e:r:e.length?e:r}function o(e){function r(e){return" "+e.nodeName+'="'+n(e.value)+'"'}l+="<"+t(e)+w.map.call(e.attributes,r).join("")+">"}function u(e){l+="</"+t(e)+">"}function c(e){("start"===e.event?o:u)(e.node)}for(var s=0,l="",f=[];e.length||r.length;){var g=a();if(l+=n(i.substring(s,g[0].offset)),s=g[0].offset,g===e){f.reverse().forEach(u);do c(g.splice(0,1)[0]),g=a();while(g===e&&g.length&&g[0].offset===s);f.reverse().forEach(o)}else"start"===g[0].event?f.push(g[0].node):f.pop(),c(g.splice(0,1)[0])}return l+n(i.substr(s))}function s(e){function n(e){return e&&e.source||e}function t(t,r){return new RegExp(n(t),"m"+(e.cI?"i":"")+(r?"g":""))}function r(i,a){if(!i.compiled){if(i.compiled=!0,i.k=i.k||i.bK,i.k){var u={},c=function(n,t){e.cI&&(t=t.toLowerCase()),t.split(" ").forEach(function(e){var t=e.split("|");u[t[0]]=[n,t[1]?Number(t[1]):1]})};"string"==typeof i.k?c("keyword",i.k):E(i.k).forEach(function(e){c(e,i.k[e])}),i.k=u}i.lR=t(i.l||/\w+/,!0),a&&(i.bK&&(i.b="\\b("+i.bK.split(" ").join("|")+")\\b"),i.b||(i.b=/\B|\b/),i.bR=t(i.b),i.e||i.eW||(i.e=/\B|\b/),i.e&&(i.eR=t(i.e)),i.tE=n(i.e)||"",i.eW&&a.tE&&(i.tE+=(i.e?"|":"")+a.tE)),i.i&&(i.iR=t(i.i)),null==i.r&&(i.r=1),i.c||(i.c=[]);var s=[];i.c.forEach(function(e){e.v?e.v.forEach(function(n){s.push(o(e,n))}):s.push("self"===e?i:e)}),i.c=s,i.c.forEach(function(e){r(e,i)}),i.starts&&r(i.starts,a);var l=i.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([i.tE,i.i]).map(n).filter(Boolean);i.t=l.length?t(l.join("|"),!0):{exec:function(){return null}}}}r(e)}function l(e,t,i,a){function o(e,n){var t,i;for(t=0,i=n.c.length;i>t;t++)if(r(n.c[t].bR,e))return n.c[t]}function u(e,n){if(r(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?u(e.parent,n):void 0}function c(e,n){return!i&&r(n.iR,e)}function g(e,n){var t=N.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(t)&&e.k[t]}function h(e,n,t,r){var i=r?"":y.classPrefix,a='<span class="'+i,o=t?"":C;return a+=e+'">',a+n+o}function p(){var e,t,r,i;if(!E.k)return n(B);for(i="",t=0,E.lR.lastIndex=0,r=E.lR.exec(B);r;)i+=n(B.substring(t,r.index)),e=g(E,r),e?(M+=e[1],i+=h(e[0],n(r[0]))):i+=n(r[0]),t=E.lR.lastIndex,r=E.lR.exec(B);return i+n(B.substr(t))}function d(){var e="string"==typeof E.sL;if(e&&!x[E.sL])return n(B);var t=e?l(E.sL,B,!0,L[E.sL]):f(B,E.sL.length?E.sL:void 0);return E.r>0&&(M+=t.r),e&&(L[E.sL]=t.top),h(t.language,t.value,!1,!0)}function b(){k+=null!=E.sL?d():p(),B=""}function v(e){k+=e.cN?h(e.cN,"",!0):"",E=Object.create(e,{parent:{value:E}})}function m(e,n){if(B+=e,null==n)return b(),0;var t=o(n,E);if(t)return t.skip?B+=n:(t.eB&&(B+=n),b(),t.rB||t.eB||(B=n)),v(t,n),t.rB?0:n.length;var r=u(E,n);if(r){var i=E;i.skip?B+=n:(i.rE||i.eE||(B+=n),b(),i.eE&&(B=n));do E.cN&&(k+=C),E.skip||(M+=E.r),E=E.parent;while(E!==r.parent);return r.starts&&v(r.starts,""),i.rE?0:n.length}if(c(n,E))throw new Error('Illegal lexeme "'+n+'" for mode "'+(E.cN||"<unnamed>")+'"');return B+=n,n.length||1}var N=R(e);if(!N)throw new Error('Unknown language: "'+e+'"');s(N);var w,E=a||N,L={},k="";for(w=E;w!==N;w=w.parent)w.cN&&(k=h(w.cN,"",!0)+k);var B="",M=0;try{for(var I,j,O=0;;){if(E.t.lastIndex=O,I=E.t.exec(t),!I)break;j=m(t.substring(O,I.index),I[0]),O=I.index+j}for(m(t.substr(O)),w=E;w.parent;w=w.parent)w.cN&&(k+=C);return{r:M,value:k,language:e,top:E}}catch(T){if(T.message&&-1!==T.message.indexOf("Illegal"))return{r:0,value:n(t)};throw T}}function f(e,t){t=t||y.languages||E(x);var r={r:0,value:n(e)},i=r;return t.filter(R).forEach(function(n){var t=l(n,e,!1);t.language=n,t.r>i.r&&(i=t),t.r>r.r&&(i=r,r=t)}),i.language&&(r.second_best=i),r}function g(e){return y.tabReplace||y.useBR?e.replace(M,function(e,n){return y.useBR&&"\n"===e?"<br>":y.tabReplace?n.replace(/\t/g,y.tabReplace):void 0}):e}function h(e,n,t){var r=n?L[n]:t,i=[e.trim()];return e.match(/\bhljs\b/)||i.push("hljs"),-1===e.indexOf(r)&&i.push(r),i.join(" ").trim()}function p(e){var n,t,r,o,s,p=a(e);i(p)||(y.useBR?(n=document.createElementNS("http://www.w3.org/1999/xhtml","div"),n.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):n=e,s=n.textContent,r=p?l(p,s,!0):f(s),t=u(n),t.length&&(o=document.createElementNS("http://www.w3.org/1999/xhtml","div"),o.innerHTML=r.value,r.value=c(t,u(o),s)),r.value=g(r.value),e.innerHTML=r.value,e.className=h(e.className,p,r.language),e.result={language:r.language,re:r.r},r.second_best&&(e.second_best={language:r.second_best.language,re:r.second_best.r}))}function d(e){y=o(y,e)}function b(){if(!b.called){b.called=!0;var e=document.querySelectorAll("pre code");w.forEach.call(e,p)}}function v(){addEventListener("DOMContentLoaded",b,!1),addEventListener("load",b,!1)}function m(n,t){var r=x[n]=t(e);r.aliases&&r.aliases.forEach(function(e){L[e]=n})}function N(){return E(x)}function R(e){return e=(e||"").toLowerCase(),x[e]||x[L[e]]}var w=[],E=Object.keys,x={},L={},k=/^(no-?highlight|plain|text)$/i,B=/\blang(?:uage)?-([\w-]+)\b/i,M=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,C="</span>",y={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},I={"&":"&amp;","<":"&lt;",">":"&gt;"};return e.highlight=l,e.highlightAuto=f,e.fixMarkup=g,e.highlightBlock=p,e.configure=d,e.initHighlighting=b,e.initHighlightingOnLoad=v,e.registerLanguage=m,e.listLanguages=N,e.getLanguage=R,e.inherit=o,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/},e.C=function(n,t,r){var i=e.inherit({cN:"comment",b:n,e:t,c:[]},r||{});return i.c.push(e.PWM),i.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),i},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e.METHOD_GUARD={b:"\\.\\s*"+e.UIR,r:0},e});hljs.registerLanguage("xml",function(s){var e="[A-Za-z0-9\\._:-]+",t={eW:!0,i:/</,r:0,c:[{cN:"attr",b:e,r:0},{b:/=\s*/,r:0,c:[{cN:"string",endsParent:!0,v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s"'=<>`]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist"],cI:!0,c:[{cN:"meta",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},s.C("<!--","-->",{r:10}),{b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{b:/<\?(php)?/,e:/\?>/,sL:"php",c:[{b:"/\\*",e:"\\*/",skip:!0}]},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{name:"style"},c:[t],starts:{e:"</style>",rE:!0,sL:["css","xml"]}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{name:"script"},c:[t],starts:{e:"</script>",rE:!0,sL:["actionscript","javascript","handlebars","xml"]}},{cN:"meta",v:[{b:/<\?xml/,e:/\?>/,r:10},{b:/<\?\w+/,e:/\?>/}]},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"name",b:/[^\/><\s]+/,r:0},t]}]}});hljs.registerLanguage("javascript",function(e){var r="[A-Za-z$_][0-9A-Za-z$_]*",t={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},a={cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},n={cN:"subst",b:"\\$\\{",e:"\\}",k:t,c:[]},c={cN:"string",b:"`",e:"`",c:[e.BE,n]};n.c=[e.ASM,e.QSM,c,a,e.RM];var s=n.c.concat([e.CBCM,e.CLCM]);return{aliases:["js","jsx"],k:t,c:[{cN:"meta",r:10,b:/^\s*['"]use (strict|asm)['"]/},{cN:"meta",b:/^#!/,e:/$/},e.ASM,e.QSM,c,e.CLCM,e.CBCM,a,{b:/[{,]\s*/,r:0,c:[{b:r+"\\s*:",rB:!0,r:0,c:[{cN:"attr",b:r,r:0}]}]},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{cN:"function",b:"(\\(.*?\\)|"+r+")\\s*=>",rB:!0,e:"\\s*=>",c:[{cN:"params",v:[{b:r},{b:/\(\s*\)/},{b:/\(/,e:/\)/,eB:!0,eE:!0,k:t,c:s}]}]},{b:/</,e:/(\/\w+|\w+\/)>/,sL:"xml",c:[{b:/<\w+\s*\/>/,skip:!0},{b:/<\w+/,e:/(\/\w+|\w+\/)>/,skip:!0,c:[{b:/<\w+\s*\/>/,skip:!0},"self"]}]}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:r}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:s}],i:/\[|%/},{b:/\$[(.]/},e.METHOD_GUARD,{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]},{bK:"constructor",e:/\{/,eE:!0}],i:/#(?!!)/}});
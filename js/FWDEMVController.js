/**
 * Easy 3D Model Viewer v:1.0
 * Controller.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVButton from "./FWDEMVButton";
import FWDEMEMVButtonTooltip from "./FWDEMVButtonTooltip";
import FWDEMVDisplayObject from "./FWDEMVDisplayObject";

export default class FWDEMVController extends FWDEMVDisplayObject{

    static PLAY = 'play';
    static PAUSE = 'pause';
    static ZOOMIN = 'zoomin';
    static ZOOMOUT = 'zoomout';
    static INFO = 'info';
    static HELP = 'help';
    static FULLSCREEN = 'fullscreen';
    static NORMALSCREEN = 'normalscreen';
    static BLOCK_TOUCH = 'blockTouch';
    static UNBLOCK_TOUCH = 'unblockTouch';


    /**
     * Initialize.
     */
    constructor(prt){
        super();

        this.prt = prt;
        this.data = this.prt.data;

        this.buttonsAR = [];

        this.butonsDataAR = this.data.butonsAR;
        this.buttonsToolTipsDataAR = this.data.buttonsToolTipsAR;
        this.showBlockTouchButton = this.data.showBlockTouchButton;
        this.blockTouchButtonSize = this.data.blockTouchButtonSize;

        this.startAndEndButtonsHorizontalGap = this.data.startAndEndButtonsHorizontalGap;
        this.startAndEndButtonsVerticalGap = this.data.startAndEndButtonsVerticalGap;
        this.buttonSize = this.data.buttonSize;

        this.enableOrbitalControls = this.data.enableOrbitalControls;
        this.buttonsToolTipOffsetY = this.data.buttonsToolTipOffsetY;
        this.controllerOffsetY = this.data.controllerOffsetY;
        this.spaceBetweenButtons = this.data.spaceBetweenButtons;
        this.controllerBackgrondColor = this.data.controllerBackgrondColor;

        this.showButtonsLabels = this.data.showButtonsLabels;

        this.buttonsIconNormalColor = this.data.buttonsIconNormalColor;
        this.buttonsIconSelectedColor = this.data.buttonsIconSelectedColor;

        this.buttonToolTipBackgroundColor = this.data.buttonToolTipBackgroundColor;
        this.buttonToolTipTextColor = this.data.buttonToolTipTextColor;
       
        this.buttonWidth = this.data.buttonSize;
        this.buttonHeight = this.data.buttonSize;

        this.screen.className ='fwdemv-controller';
        this.screen.style.overflow = 'visible';
    
        this.setupMainDO();
        this.setupButtons();
        
        this.totalHeight = this.startAndEndButtonsVerticalGap * 2 + this.buttonSize;

        this.height = this.totalHeight;
        this.mainDO.height = this.totalHeight;
      
        this.hide();
        this.style.zIndex = 99;
        this.displayHelpWindowDigitize = this.displayHelpWindowDigitize;
        this.dispatchEventDigitize = this.dispatchEvent

        window.addEventListener('pointerup', this.onWindowpointerUp);
    }

    onWindowpointerUp(e){
        clearTimeout(this.checkZoomPointerDownTO);
        clearTimeout(this.checkZoomPointerDownST);
        this.zoomSmallStep = false;
    }


    /**
     * Setuo main container.
     */
    setupMainDO(){
        this.mainDO = new FWDEMVDisplayObject();
        this.mainDO.screen.className = 'fwdemv-controller-buttons-holder';
        this.mainDO.style.backgroundColor = this.controllerBackgrondColor;
        this.mainDO.style.overflow = 'visible';
        this.addChild(this.mainDO);
    }


    /**
     * Position
     */
    positionAndResize(){
        this.prtWidth = this.prt.width;
        this.prtHeight = this.prt.height

        let offset = 1;
        if(this.prt.width < 400){
            offset = .7;
        }

        this.totalWidth = this.startAndEndButtonsHorizontalGap * offset * 2;

        this.totalWidth += (this.buttonsAR.length * this.buttonSize) +  ((this.buttonsAR.length - 1) * this.spaceBetweenButtons * offset);
    
        this.width = this.totalWidth;
        this.mainDO.width = this.totalWidth;
     
        this.x = Math.round((this.prtWidth - this.mainDO.width)/2);
        this.y = this.prtHeight - this.mainDO.height - this.controllerOffsetY;
       
        this.positionButtons();
        this.positionBlockTouchButton();
    }


    /**
     * Setup buttons.
     */
    setupButtons(){
        const totalButtons = this.butonsDataAR.length;

        let buttonName;
        let label1 = "";
        let label2 = "";


        for(let i = 0; i < totalButtons; i ++){
            buttonName = this.butonsDataAR[i];
          
            if(buttonName == "play"){
                let str = this.buttonsToolTipsDataAR[i];
                if(str){
                    if(str.indexOf("/") == -1){
                        label1 = "tooltip is not defined!";
                        label2 = "tooltip is not defined!";
                    }else{
                        label1 = str.substr(0, str.indexOf("/"));
                        label2 = str.substr(str.indexOf("/") + 1);
                    }
                }else{
                    label1 = "tooltip is not defined!";
                    label2 = "tooltip is not defined!";
                }
                this.setupPlayPauseButton(label1, label2);
                this.buttonsAR.push(this.playPauseButtonDO);
            }else if(buttonName == "zoomin"){
                if(this.showButtonsLabels) label1 = this.buttonsToolTipsDataAR[i] || "tooltip is not defined!";
                this.setupZoomIn(label1);
                this.buttonsAR.push(this.zoomInButtonDO);
            }else if(buttonName == "zoomout"){
                if(this.showButtonsLabels) label1 = this.buttonsToolTipsDataAR[i] || "tooltip is not defined!";
                this.setupZoomOut(label1);
                this.buttonsAR.push(this.zoomOutButtonDO);
            }else if(buttonName == "info"){
                if(this.showButtonsLabels) label1 = this.buttonsToolTipsDataAR[i] || "tooltip is not defined!";
                this.setupInfoButton(label1);
                this.buttonsAR.push(this.infoButtonDO);
            }else if(buttonName == "help"){
                if(this.showButtonsLabels) label1 = this.buttonsToolTipsDataAR[i] || "tooltip is not defined!";
                this.setupHelpButton(label1);
                this.buttonsAR.push(this.helpButtonDO);
            }else if(buttonName == "fullscreen"){
                let str = this.buttonsToolTipsDataAR[i];
                if(str){
                    if(str.indexOf("/") == -1){
                        label1 = "tooltip is not defined!";
                        label2 = "tooltip is not defined!";
                    }else{
                        label1 = str.substr(0, str.indexOf("/"));
                        label2 = str.substr(str.indexOf("/") + 1);
                    }
                }else{
                    label1 = "tooltip is not defined!";
                    label2 = "tooltip is not defined!";
                }
                this.setupFullscreenButton(label1, label2);
                this.buttonsAR.push(this.fullscreenButtonDO);
            }
        }

        if(this.showBlockTouchButton){
            this.setupBlockTouchButton();
        }
    }


    /**
     * Position buttons.
     */
    positionButtons(){
        let prevButton;

        let offset = 1;

        if(this.prt.width < 400){
            offset = .7;
        }

        this.buttonsAR.forEach((button, index) =>{ 
            if(index == 0){
                button.x = this.startAndEndButtonsHorizontalGap * offset;
            }else{
                button.x = prevButton.x + prevButton.width + this.spaceBetweenButtons * offset;
            }
            button.y = this.startAndEndButtonsVerticalGap * offset;

            prevButton = button;
        });
    }


    /**
     * Setup play/pause button.
     */
    setupPlayPauseButton(label1, label2){
        this.playPauseButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-play-pause-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-play',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-pause',
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.buttonWidth,
            this.buttonHeight);

        this.mainDO.addChild(this.playPauseButtonDO);
  
        this.playPauseButtonDO.addEventListener(FWDEMVButton.POINTER_UP, () =>{
            if(this.playPauseButtonDO.state == 0){
                this.dispatchEvent(FWDEMVController.PLAY);
            }else{
                this.dispatchEvent(FWDEMVController.PAUSE);
            }
        });

        this.onPlayPauseShowToolTip = this.onPlayPauseShowToolTip.bind(this);
        this.playPauseButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onPlayPauseShowToolTip);

        this.onPlayPauseHideToolTip = this.onPlayPauseHideToolTip.bind(this);
        this.playPauseButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onPlayPauseHideToolTip);

        if(this.showButtonsLabels){
            this.playPauseTooltipDO = new FWDEMEMVButtonTooltip(
                label1,
                label2,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.playPauseTooltipDO);
        }
    }   

    setPlayButtonsState(state){
        if(!this.playPauseButtonDO) return;

        if(state == 'play'){
            this.playPauseButtonDO.state = 0;
        }else{
            this.playPauseButtonDO.state = 1;          
        }

        if(this.playPauseTooltipDO){
            this.playPauseTooltipDO.hide();
            this.onPlayPauseShowToolTip();
        }
    }

    onPlayPauseShowToolTip(e){
       
        if(this.showButtonsLabels){
            if(this.playPauseButtonDO.state == 0){
                this.playPauseTooltipDO.setLabel(this.playPauseTooltipDO.toolTipLabel);
            }else if(this.playPauseButtonDO.state == 1){
                this.playPauseTooltipDO.setLabel(this.playPauseTooltipDO.toolTipLabel2);
            }

            setTimeout(() =>{
                if(this.destroyed) return;
                this.showToolTipButton(this.playPauseButtonDO, this.playPauseTooltipDO, this.buttonsToolTipOffsetY);
            }, 70)
        }
    }

    onPlayPauseHideToolTip(){
        if(!this.playPauseTooltipDO) return;
        this.playPauseTooltipDO.hide();
    }
    


    /**
     * Setup zoom buttons.
     */
    setupZoomIn(label){
        this.zoomInButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-zoom-in-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-zoomin',
            undefined,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.buttonWidth,
            this.buttonHeight);

        this.mainDO.addChild(this.zoomInButtonDO);

        this.onZoomInShowToolTip = this.onZoomInShowToolTip.bind(this);
        this.zoomInButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onZoomInShowToolTip);

        this.onZoomInHideToolTip = this.onZoomInHideToolTip.bind(this);
        this.zoomInButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onZoomInHideToolTip);

        this.onZoomInButtonPointerDown = this.onZoomInButtonPointerDown.bind(this);
        this.zoomInButtonDO.addEventListener(FWDEMVButton.POINTER_DOWN, this.onZoomInButtonPointerDown);
            
        this.onZoomInButtonPointerUp = this.onZoomInButtonPointerUp.bind(this);
        this.zoomInButtonDO.addEventListener(FWDEMVButton.POINTER_UP, this.onZoomInButtonPointerUp);   

        if(this.showButtonsLabels){
            this.zoomInTooltipDO = new FWDEMEMVButtonTooltip(
                label,
                undefined,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.zoomInTooltipDO);
        }
    }

    onZoomInShowToolTip(e){
        if(this.showButtonsLabels){
            this.showToolTipButton(this.zoomInButtonDO, this.zoomInTooltipDO, this.buttonsToolTipOffsetY)
        }
    }

    onZoomInHideToolTip(){
        if(!this.zoomInTooltipDO) return;
        this.zoomInTooltipDO.hide();
    }

    onZoomInButtonPointerDown(){
        this.zoomSmallStep = false;
        clearTimeout(this.checkZoomPointerDownTO);
        clearTimeout(this.checkZoomPointerDownST);

        this.checkZoomPointerDownTO = setTimeout(() => {
            if(this.destroyed) return;

            this.checkZoomPointerDownST =  setInterval(() => {
                if(this.destroyed) return;

                this.zoomSmallStep = true;
                this.dispatchEvent(FWDEMVController.ZOOMIN, {'zoomSmallStep': true});
            }, 50);
            
        }, 500);
    }

    onZoomInButtonPointerUp(){
        clearTimeout(this.checkZoomPointerDownTO);
        clearTimeout(this.checkZoomPointerDownST);

        if(!this.zoomSmallStep){
            this.dispatchEvent(FWDEMVController.ZOOMIN, {'zoomSmallStep': false});
        }
        this.zoomSmallStep = false;
    }

    setupZoomOut(label){
        this.zoomOutButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-zoom-out-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-zoomout',
            undefined,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.buttonWidth,
            this.buttonHeight);

        this.mainDO.addChild(this.zoomOutButtonDO);

        this.onZoomOutShowToolTip = this.onZoomOutShowToolTip.bind(this);
        this.zoomOutButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onZoomOutShowToolTip);

        this.onZoomOutHideToolTip = this.onZoomOutHideToolTip.bind(this);
        this.zoomOutButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onZoomOutHideToolTip);

        this.onZoomOutButtonPointerDown = this.onZoomOutButtonPointerDown.bind(this);
        this.zoomOutButtonDO.addEventListener(FWDEMVButton.POINTER_DOWN, this.onZoomOutButtonPointerDown);
  
        this.onZoomOutButtonPointerUp = this.onZoomOutButtonPointerUp.bind(this);
        this.zoomOutButtonDO.addEventListener(FWDEMVButton.POINTER_UP, this.onZoomOutButtonPointerUp);

        if(this.showButtonsLabels){
            this.zoomOutTooltipDO = new FWDEMEMVButtonTooltip(
                label,
                undefined,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.zoomOutTooltipDO);
        }

    }

    onZoomOutShowToolTip(e){
        if(this.showButtonsLabels){
            this.showToolTipButton(this.zoomOutButtonDO, this.zoomOutTooltipDO, this.buttonsToolTipOffsetY)
        }
    }

    onZoomOutHideToolTip(){
        if(!this.zoomOutTooltipDO) return;
        this.zoomOutTooltipDO.hide();
    }

    onZoomOutButtonPointerDown(){
        this.zoomSmallStep = false;
        clearTimeout(this.checkZoomPointerDownTO);
        clearTimeout(this.checkZoomPointerDownST);

        this.checkZoomPointerDownTO = setTimeout(() => {
            if(this.destroyed) return;

            this.checkZoomPointerDownST =  setInterval(() => {
                if(this.destroyed) return;

                this.zoomSmallStep = true;
                this.dispatchEvent(FWDEMVController.ZOOMOUT, {'zoomSmallStep': true});
            }, 50);
            
        }, 500);
    }

    onZoomOutButtonPointerUp(){
        clearTimeout(this.checkZoomPointerDownTO);
        clearTimeout(this.checkZoomPointerDownST);

        if(!this.zoomSmallStep){
            this.dispatchEvent(FWDEMVController.ZOOMOUT, {'zoomSmallStep': false});
        }
        this.zoomSmallStep = false;
    }


    /**
     * Setup info button.
     */
    setupInfoButton(label){
        this.infoButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-info-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-info',
            undefined,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.buttonWidth,
            this.buttonHeight);

        this.mainDO.addChild(this.infoButtonDO);

        this.onInfoButtonShowToolTip = this.onInfoButtonShowToolTip.bind(this);
        this.infoButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onInfoButtonShowToolTip);

        this.onInfoButtonHideToolTip = this.onInfoButtonHideToolTip.bind(this);
        this.infoButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onInfoButtonHideToolTip);
  
        this.onInfoButtonPointerUp = this.onInfoButtonPointerUp.bind(this);
        this.infoButtonDO.addEventListener(FWDEMVButton.POINTER_UP, this.onInfoButtonPointerUp);
        
        if(this.showButtonsLabels){
            this.infoTooltipDO = new FWDEMEMVButtonTooltip(
                label,
                undefined,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.infoTooltipDO);
        }

    }

    onInfoButtonShowToolTip(e){
        if(this.onInfoButtonShowToolTip){
            this.showToolTipButton(this.infoButtonDO, this.infoTooltipDO, this.buttonsToolTipOffsetY);
        }
    }

    onInfoButtonHideToolTip(){
        if(this.infoTooltipDO){
            this.infoTooltipDO.hide();
        }
    }

    onInfoButtonPointerUp(){
        this.dispatchEvent(FWDEMVController.INFO);
    }
    

    /**
     * Setup help button.
     */
    setupHelpButton(label){
        this.helpButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-help-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-help',
            undefined,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.buttonWidth,
            this.buttonHeight);

        this.mainDO.addChild(this.helpButtonDO);

        this.onHelpButtonShowToolTip = this.onHelpButtonShowToolTip.bind(this);
        this.helpButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onHelpButtonShowToolTip);

        this.onHelpButtonHideToolTip = this.onHelpButtonHideToolTip.bind(this);
        this.helpButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onHelpButtonHideToolTip);
  
        this.helpButtonDO.addEventListener(FWDEMVButton.POINTER_UP, () =>{
            this.dispatchEvent(FWDEMVController.HELP);
        });

        if(this.showButtonsLabels){
            this.helpTooltipDO = new FWDEMEMVButtonTooltip(
                label,
                undefined,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.helpTooltipDO);
        }
        
    }

    onHelpButtonShowToolTip(e){
        if(this.onInfoButtonShowToolTip){
            this.showToolTipButton(this.helpButtonDO, this.helpTooltipDO, this.buttonsToolTipOffsetY);
        }
    }

    onHelpButtonHideToolTip(){
        if(!this.helpTooltipDO) return;
        this.helpTooltipDO.hide();
    }


    /**
     * Setup play/pause button.
     */
    setupFullscreenButton(label1, label2){
        this.fullscreenButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-fullscreen-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-fullscreen',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-normalscreen',
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.buttonWidth,
            this.buttonHeight);
        

        this.mainDO.addChild(this.fullscreenButtonDO);

        this.fullscreenButtonDO.addEventListener(FWDEMVButton.POINTER_UP, () =>{
            if(this.fullscreenTooltipDO){
                this.fullscreenTooltipDO.hide();
                this.onFullscreenhowToolTip();
            }

            if(this.fullscreenButtonDO.state == 0){
                this.dispatchEvent(FWDEMVController.FULLSCREEN);
            }else{
                this.dispatchEvent(FWDEMVController.NORMALSCREEN);
            }
        });


        this.onFullscreenhowToolTip = this.onFullscreenhowToolTip.bind(this);
        this.fullscreenButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onFullscreenhowToolTip);

        this.onFullscreenHideToolTip = this.onFullscreenHideToolTip.bind(this);
        this.fullscreenButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onFullscreenHideToolTip);

        if(this.showButtonsLabels){
            this.fullscreenTooltipDO = new FWDEMEMVButtonTooltip(
                label1,
                label2,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.fullscreenTooltipDO);
        }
    }

    setFullscreenButtonsState(state){
        if(!this.fullscreenButtonDO) return;

        if(state == 'fullscreen'){
            this.fullscreenButtonDO.state = 1;
        }else{
            this.fullscreenButtonDO.state = 0;
        }
    }

    onFullscreenhowToolTip(e){
       
        if(this.showButtonsLabels){
            if(this.fullscreenButtonDO.state == 0){
                this.fullscreenTooltipDO.setLabel(this.fullscreenTooltipDO.toolTipLabel);
            }else if(this.fullscreenButtonDO.state == 1){
                this.fullscreenTooltipDO.setLabel(this.fullscreenTooltipDO.toolTipLabel2);
            }

            setTimeout(() =>{
                if(this.destroyed) return;
                
                this.showToolTipButton(this.fullscreenButtonDO, this.fullscreenTooltipDO, this.buttonsToolTipOffsetY);
            }, 70)
        }
    }

    onFullscreenHideToolTip(){
        if(!this.fullscreenTooltipDO) return;
        this.fullscreenTooltipDO.hide();
    }


    /**
     * Setup block/unblock block touch button.
     */
    setupBlockTouchButton(){
        if(!this.enableOrbitalControls){
            return;
        }

        this.blockTouchButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-block-touch-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-block-touch',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-unblock-touch',
            this.controllerBackgrondColor,
            this.controllerBackgrondColor,
            this.buttonsIconNormalColor,
            this.buttonsIconSelectedColor,
            false,
            this.blockTouchButtonSize,
            this.blockTouchButtonSize);
        
        this.blockTouchButtonDO.style.overflow = 'hidden';
        this.blockTouchButtonDO.style.zIndex = 1;
        this.prt.modelManagerDO.addChild(this.blockTouchButtonDO);

        this.blockTouchButtonDO.scale = 0;
        this.blockTouchButtonDO.addEventListener(FWDEMVButton.POINTER_UP, () =>{
          
            if(this.blockTouchButtonDO.state == 0){
                this.dispatchEvent(FWDEMVController.BLOCK_TOUCH);
            }else{
                this.dispatchEvent(FWDEMVController.UNBLOCK_TOUCH);
            }
        });

    }

    setBlockTouchButtonsState(state){
        if(!this.blockTouchButtonDO || !this.enableOrbitalControls) return;

        if(state == 'block'){
            this.blockTouchButtonDO.state = 1;
        }else{
            this.blockTouchButtonDO.state = 0;
        }
    }

    positionBlockTouchButton(){
        if(!this.blockTouchButtonDO) return;

        this.globalY = this.prt.mainDO.rect.y
        let y = 10;
        if(this.globalY < 10) y = Math.abs(this.globalY) + 10;
      
        this.blockTouchButtonDO.x = this.prt.width - this.blockTouchButtonDO.width - 10;
        
        if(this.prt.cameraPositionsSelectMenuDO && this.prt.cameraPositionsSelectMenuDO.positionType == 'minimal'){
         
            if(y + this.blockTouchButtonDO.height + 10 > this.prt.cameraPositionsSelectMenuDO.nextButtonDO.y){
                y += this.blockTouchButtonDO.height + this.prt.cameraPositionsSelectMenuDO.nextButtonDO.height + 10;
            }

            this.x = Math.round((this.prtWidth - this.mainDO.width)/2);

            if(this.x + this.width + 10 > this.blockTouchButtonDO.x
            && this.blockTouchButtonDO.y + this.blockTouchButtonDO.height >= this.y 
            ){
                this.x -= this.x + this.width + 10 - this.blockTouchButtonDO.x
            }
        }

        if(y > this.prt.height - this.blockTouchButtonDO.height - this.controllerOffsetY){
            y =  this.prt.height - this.blockTouchButtonDO.height - this.controllerOffsetY;
        } 

        this.blockTouchButtonDO.y = y;		
    }

    showBlockTouchButtonWithScale(){
        if(!this.blockTouchButtonDO || this.blockTouchButtonShowed || !this.enableOrbitalControls){
            return;
        }
        this.blockTouchButtonShowed = true;

        FWDAnimation.to(this.blockTouchButtonDO, 1, {scale:1, ease:Elastic.easeOut});

        if(this.orbitalControlsEnabled !== undefined){
            this.prt.modelManagerDO.controls.enabled = this.orbitalControlsEnabled;
        }
    }

    hideBlockTouchButtonAndEnableControls(){
        if(!this.blockTouchButtonDO || !this.enableOrbitalControls) return;
     
        FWDAnimation.killTweensOf(this.blockTouchButtonDO);
        this.blockTouchButtonDO.scale = 0;

        this.orbitalControlsEnabled = this.prt.modelManagerDO.enableOrbitalControls;
    }

    showBlockTouchButtonAndEnableControls(){
        if(!this.blockTouchButtonDO || !this.enableOrbitalControls) return;

        FWDAnimation.to(this.blockTouchButtonDO, 1, {scale:1, ease:Elastic.easeOut});

        if(this.orbitalControlsEnabled !== undefined){
            this.prt.modelManagerDO.controls.enabled = this.orbitalControlsEnabled;
        }
    }


    /**
     * Show button tooltip.
     */
    showToolTipButton(button, toolTipDO, offsetY){
        if(this.showButtonsLabels && button.isSelected){
           
            let finalX;
            let finalY;
            let globalX = this.mainDO.rect.x;
            let pointerOffsetX = 0;
          
            toolTipDO.show();
           
            setTimeout(() =>{
                if(this.destroyed || !toolTipDO.isShowed) return

                finalX = Math.round(button.x + (button.width- toolTipDO.totalWidth)/2);
                finalY = - toolTipDO.totalHeight - offsetY;
                const globalX = this.mainDO.rect.x;
                const curWidth = this.mainDO.width;
                
                if(globalX + finalX < 0){
                    pointerOffsetX = globalX + finalX;
                    finalX = finalX + Math.abs((globalX + finalX));
                }else if(globalX + curWidth - finalX - toolTipDO.totalWidth < 0){
                    pointerOffsetX = -(globalX + curWidth - finalX - toolTipDO.totalWidth);
                    finalX = finalX + globalX + curWidth - finalX - toolTipDO.totalWidth;
                }
                
                toolTipDO.x = finalX;
                toolTipDO.y = finalY + 6;	
                toolTipDO.positionPointer(pointerOffsetX);
            }, 121);
        }
    };


    /**
     * Hide/show.
     */
    hide(animate){
       
        FWDAnimation.killTweensOf(this.mainDO);
        if(animate){
            FWDAnimation.to(this.mainDO, .8, {
                y: this.mainDO.height + this.controllerOffsetY,
                onComplete: () =>{
                    this.mainDO.style.visibility = 'hidden';
                },
                ease:Expo.easeInOut
            });
        }else{
            this.mainDO.style.visibility = 'hidden';
            this.mainDO.y = this.mainDO.height + this.controllerOffsetY;
        }
    };
    
    show(animate){
        
        this.positionAndResize();

        this.showBlockTouchButtonWithScale();

        if(!this.buttonsAR.length) return;
 
        this.mainDO.style.visibility = 'visible';
        FWDAnimation.killTweensOf(this.mainDO);
        if(animate){
            FWDAnimation.to(this.mainDO, .8, {
                y: 0,
                ease:Expo.easeInOut
            });
        }else{
            this.mainDO.y = 0;
        }
    };

    displayHelpWindowDigitize(){
        this.dispatchEvent(FWDEMVController.HELP)
    }


    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;

        FWDAnimation.killTweensOf(this.mainDO);

        this.style.pointerEvents = 'none';

        window.removeEventListener('pointerup', this.onWindowpointerUp);

        if(this.playPauseButtonDO){
            this.playPauseButtonDO.destroy();
        }

        if(this.zoomInButtonDO){
            this.zoomInButtonDO.destroy();
        }

        if(this.zoomOutButtonDO){
            this.zoomOutButtonDO.destroy();
        }

        if(this.infoButtonDO){
            this.infoButtonDO.destroy();
        }

        if(this.helpButtonDO){
            this.helpButtonDO.destroy();
        }

        if(this.fullscreenButtonDO){
            this.fullscreenButtonDO.destroy();
        }

    }
}
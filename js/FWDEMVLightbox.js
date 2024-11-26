/**
 * Easy 3D Model Viewer v:1.0
 * Lightbox.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVButton from "./FWDEMVButton";
import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVLightbox extends FWDEMVDisplayObject{

   
    static SHOW_COMPLETE = 'showComplete';
    static HIDE_COMPLETE = 'hideComplete';
    static HIDE_START = 'hideStart';

    /*
     * Initialize
     */
    constructor(prt){

        super()

        this.prt = prt;
        this.data = this.prt.data;

        this.lightboxCloseButtonWidth = this.prt.lightboxCloseButtonWidth;
        this.lightboxCloseButtonHeight = this.prt.lightboxCloseButtonHeight;
        this.lightboxBackgroundColor = this.prt.lightboxBackgroundColor;
        this.holderBackgroundColor = this.prt.backgroundColor;
        this.lightboxCloseButtonBackgroundNormalColor = this.prt.lightboxCloseButtonBackgroundNormalColor;
        this.lightboxCloseButtonBackgroundSelectedColor = this.prt.lightboxCloseButtonBackgroundSelectedColor;
        this.lightboxCloseButtonIconNormalColor = this.prt.lightboxCloseButtonIconNormalColor;
        this.lightboxCloseButtonIconSelectedColor = this.prt.lightboxCloseButtonIconSelectedColor;
        this.startResizingWidth = this.prt.startResizingWidth;
        this.autoScale = this.prt.autoScale;
        this.maxWidth = this.prt.maxWidth;
        this.maxHeight = this.prt.maxHeight; 
        

        // Initialize main...
        this.screen.style.zIndex = '2147483647';
        this.screen.className = 'fwdemv-lightbox';
    }


    /**
     * Resize.
     */
    resize(){
        this.so = FWDEMVUtils.getScrollOffsets();
        this.vs = FWDEMVUtils.getViewportSize();
        
        if(this.isShowed){
            this.width = this.vs.w;
            this.height = this.vs.h;
            this.x =  this.so.x;
            this.y = this.so.y;
        }

        this.modelWidth = this.vs.w;
        if(this.modelWidth > this.maxWidth){
            this.modelWidth = this.maxWidth;
        }

        if(this.prt.isFullScreen){
            this.modelWidth = this.vs.w;
            this.modelHeight = this.vs.h;
        }else{
            if(this.autoScale && this.modelWidth <= this.startResizingWidth){
                this.modelHeight = Math.round(this.maxHeight * (this.modelWidth/this.startResizingWidth));
            }else{
                this.modelHeight = this.maxHeight;
            }
        }

        let offestX = 1;
        if(String(this.maxWidth).includes('%')){
            offestX = parseFloat(this.maxWidth) / 100;
        }
        this.modelWidth *= offestX;

        let offestY = 1;
        if(String(this.maxHeight).includes('%')){
            offestY = parseFloat(this.maxHeight) / 100;
            this.modelHeight =  this.vs.h * offestY;
        }
        
        this.prt.width = this.modelWidth;
        this.prt.height = this.modelHeight;  
        this.prt.mainDO.width = this.modelWidth;
        this.prt.mainDO.height = this.modelHeight;   
    
        this.modelX = Math.round((this.width - this.modelWidth)/2);
        this.modelY = Math.round((this.height - this.modelHeight)/2);
      
        if(this.isModelShowed){
            this.viewerMainDO.width = this.modelWidth;
            this.viewerMainDO.height = this.modelHeight;
            this.viewerMainDO.x = this.modelX;
            this.viewerMainDO.y = this.modelY;

            this.closeButtoDO.x = this.vs.w - this.closeButtoDO.width - 10;
            this.closeButtoDO.y = 10;
        }
       
    }   


    /**
     * Setup main containers.
     */
    setupMainContainers(){
    
        this.style.touchAction = "none";
            
        this.lightBoxBackgroundDO = new FWDEMVDisplayObject(); 
        this.lightBoxBackgroundDO.style.width = '100%';
        this.lightBoxBackgroundDO.style.height = '100%';
        this.lightBoxBackgroundDO.style.backgroundColor = this.lightboxBackgroundColor;
        this.addChild(this.lightBoxBackgroundDO);
            
        this.viewerMainDO = new FWDEMVDisplayObject();
        this.viewerMainDO.screen.className = 'fwdemv-lightbox-viewer-hoder'
        this.viewerMainDO.style.backgroundColor = this.holderBackgroundColor;
        this.prt.stageContainer = this.viewerMainDO.screen;
        this.viewerMainDO.addChild(this.prt.mainDO);
        this.addChild(this.viewerMainDO);
    };


    /**
     * Add keyboard esc support.
     */
    addKeyboardEscSupport(){

        this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
        window.addEventListener("keyup", this.onKeyUpHandler);
    }

    removeKeyboardEscSupport(){
        window.removeEventListener("keyup", this.onKeyUpHandler);
    }

    onKeyUpHandler(e){
        if(e.keyCode == 27){
           this.onCLoseButtonPointerUp();
        }
    }


    /**
     * Setup close button.
     */
    setupCloseButton(){

        this.closeButtoDO = new FWDEMVButton(
            this,
            'fwdemv-close-button',
            this.prt.fontIcon + '-close',
            undefined,
            this.lightboxCloseButtonBackgroundNormalColor,
            this.lightboxCloseButtonBackgroundSelectedColor,
            this.lightboxCloseButtonIconNormalColor,
            this.lightboxCloseButtonIconSelectedColor,
            true,
            this.lightboxCloseButtonWidth,
            this.lightboxCloseButtonHeight);
        
        this.closeButtoDO.x = -200;
        this.addChild(this.closeButtoDO);

        this.onCLoseButtonPointerUp =  this.onCLoseButtonPointerUp.bind(this);
        this.closeButtoDO.addEventListener(FWDEMVButton.POINTER_UP, this.onCLoseButtonPointerUp);
    }

    onCLoseButtonPointerUp(){
        this.hide();
    }

    /**
     * Show and hinde.
     */
    show(){
        if(this.isShowed) return;

        this.isShowed = true;
        document.documentElement.appendChild(this.screen);
        this.setupMainContainers();
        this.setupCloseButton();
        this.addKeyboardEscSupport();
       
        this.resize();

        // Model and viewer.
        this.lightBoxBackgroundDO.opacity = 0;
        FWDAnimation.to(this.lightBoxBackgroundDO, .8, {opacity:1});

        this.viewerMainDO.width = 0;
        this.viewerMainDO.height = 0;
        this.viewerMainDO.x = Math.round(this.vs.w/2);
        this.viewerMainDO.y = Math.round(this.vs.h/2);
        FWDAnimation.to(this.viewerMainDO, .8, {
            w: this.modelWidth, 
            h: this.modelHeight,
            x: Math.round((this.vs.w -this.modelWidth)/2),
            y: Math.round((this.vs.h -this.modelHeight)/2),
            delay:.2,
            ease:Expo.easeInOut});

         // CLose buton.
         this.closeButtoDO.x = this.vs.w;
         this.closeButtoDO.y =10;

         FWDAnimation.to(this.closeButtoDO, .8, {
            x: this.vs.w - this.closeButtoDO.width - 10,
            y: 10,
            delay:.2,
            ease:Expo.easeInOut,
            onComplete:(() =>{
                this.isModelShowed = true;
                this.resize();
                this.dispatchEvent(FWDEMVLightbox.SHOW_COMPLETE);
        })});
    }
   

    hide(){
        if(!this.isShowed) return;

        this.isShowed = false;
        this.removeKeyboardEscSupport();

        FWDAnimation.to(this.lightBoxBackgroundDO, .8, {opacity:0, delay:.2});

        FWDAnimation.to(this.closeButtoDO, .8, {
            x: this.vs.w,
            delay:.2,
            ease:Expo.easeInOut});
       
        FWDAnimation.to(this.viewerMainDO, .8, {
            w: 0, 
            h: 0,
            x: this.vs.w/2,
            y: this.vs.h/2,
            delay:.2,
            ease:Expo.easeInOut});

        FWDAnimation.to(this.prt.mainDO, .8, {
            x: -this.vs.w/2,
            y: -this.vs.h/2,
            delay:.2,
            ease:Expo.easeInOut,
            onComplete:(() =>{
                this.dispatchEvent(FWDEMVLightbox.HIDE_COMPLETE);
        })});

        this.dispatchEvent(FWDEMVLightbox.HIDE_START);
    }


     /**
     * Destroy.
     */
     destroy(){
        this.destroyed = true;

        if(this.onKeyUpHandler){
            window.removeEventListener("keyup", this.onKeyUpHandler);
        }
    }
}
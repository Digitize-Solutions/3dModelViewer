/**
 * Easy 3D Model Viewer v:1.0
 * Preloader.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";

export default class FWDEMVPreloader extends FWDEMVDisplayObject{

    static HIDE_COMPLETE = "hideComplete";
    

    /*
     * Initialize
     */
    constructor(
        prt
    ){
        super();    

        this.prt = prt;
        this.data = this.prt.data;

        this.maxWidth = this,prt.maxWidth
        this.preloaderText = this.data.preloaderText;
        this.preloaderPosition = this.data.preloaderPosition;
        this.preloaderOffsetX = this.data.preloaderOffsetX;
        this.preloaderOffsetY = this.data.preloaderOffsetY;
        this.showPreloaderProgressBar = this.data.showPreloaderProgressBar;
        this.preloaderWidth = this.data.preloaderWidth;
        this.preloaderProgressBarBackgroundColor = this.data.preloaderProgressBarBackgroundColor;
        this.preloaderProgressBarFillColor = this.data.preloaderProgressBarFillColor;
        this.preloaderFontColor = this.data.preloaderFontColor;
        this.preloaderBackgroundSize = this.data.preloaderBackgroundSize;
        this.preloaderBackgroundColor = this.data.preloaderBackgroundColor;
    
        // Initialize main...
        this.setupMainContainers();
    }

    
    // Setup main containers.
    setupMainContainers(){
        
        this.backgroundDO = new FWDEMVDisplayObject();
        this.backgroundDO.screen.className = 'fwdemv-preloader-background';
        this.backgroundDO.style.backgroundColor = this.preloaderBackgroundColor;
        this.backgroundDO.opacity = 0;
        this.backgroundDO.style.width = '100%';
        this.backgroundDO.style.height = '100%';
        this.addChild(this.backgroundDO);
        
        this.mainHolderDO = new FWDEMVDisplayObject();
        this.mainHolderDO.screen.className = 'fwdemv-main-holder';
        this.mainHolderDO.width = 1;
        this.mainHolderDO.style.overflow = 'visible';
        this.mainHolderDO.style.width = '100%';
        this.addChild(this.mainHolderDO);

        this.mainHolder2DO = new FWDEMVDisplayObject();
        this.mainHolder2DO.style.overflow = 'visible';
        this.mainHolder2DO.style.width = '100%';
        this.mainHolderDO.addChild(this.mainHolder2DO);

        if(this.showPreloaderProgressBar){
            this.barDO = new FWDEMVDisplayObject();
            this.barDO.style.width = '100%';
            this.barDO.style.overflow = 'visible';

            this.barbackgroundDO = new FWDEMVDisplayObject();
            this.barbackgroundDO.screen.className = 'fwdemv-preloader-bar-background';
            this.barbackgroundDO.style.height = '10px';
            this.barbackgroundDO.style.width = '100%';
            this.barbackgroundDO.style.height = '100%';
            this.barbackgroundDO.style.backgroundColor = this.preloaderProgressBarBackgroundColor;

            this.barFillDO = new FWDEMVDisplayObject();
            this.barFillDO.screen.className = 'fwdemv-preloader-bar-fill';
            this.barFillDO.style.width = 0;
            this.barFillDO.style.height = "19px";
            this.barFillDO.style.backgroundColor = this.preloaderProgressBarFillColor;
            this.barDO.addChild(this.barbackgroundDO);
            this.barDO.addChild(this.barFillDO);
            this.mainHolder2DO.addChild(this.barDO);
        }

        this.textDO = new FWDEMVDisplayObject();
        this.textDO.transformType = 'native';
        this.textDO.style.color = this.preloaderFontColor;
        this.textDO.screen.className = 'fwdemv-preloader-text';

        this.dumytextDO = new FWDEMVDisplayObject();
        this.dumytextDO.screen.className = 'fwdemv-preloader-text';
        this.dumytextDO.innerHTML = this.preloaderText + '100%';
        this.dumytextDO.style.visibility = 'hidden';

        this.textDO.style.display = 'inline-block';
        this.textDO.style.whiteSpace = "nowrap";
        this.textDO.style.color = this.fontColor;
        this.textDO.y = this.segmentHeight + 2;

        this.mainHolder2DO.addChild(this.textDO);
        this.addChild(this.dumytextDO);
    };

    
    /**
     * Position and resize.
     */
    positionAndResize(){
        
        if(this.prt.width == this.width && this.prt.height == this.height) return;
       
        this.width = this.prt.width;
        this.height = this.prt.height;
    
        this.positionPreloader();
        this.positionPoster();
    };

    positionPreloader(){
        
        if(this.barDO || this.preloaderBackgroundSize == 'small'){			
            if(this.barDO){
                this.barDO.height = this.barFillDO.height;
                this.barbackgroundDOy = Math.round((this.barFillDO.width - this.barbackgroundDO.height)/2);
            }
            
            if(this.preloaderWidth.indexOf('%') != -1){
                this.mainHolderDO.style.width = this.preloaderWidth;
            }else{
                this.mainHolderDO.style.width = Math.round(this.dumytextDO.width) + 'px';
            }
        }
        
        var t = this.preloaderPosition;
        
        if(t == 'topleft'){
            this.mainHolderDO.x = this.preloaderOffsetX;
            this.mainHolderDO.y = this.preloaderOffsetY;
        }else if(t == 'topright'){
            this.mainHolderDO.x = Math.round(this.width - this.mainHolderDO.width - this.preloaderOffsetX);
            this.mainHolderDO.y = this.preloaderOffsetY;
        }else if(t == 'bottomleft'){
            this.mainHolderDO.x = this.preloaderOffsetX;
            this.mainHolderDO.y = this.height - this.mainHolderDO.height + this.preloaderOffsetY;
        }else if(t == 'bottomright'){
            this.mainHolderDO.x = Math.round(this.width - this.mainHolderDO.width + this.preloaderOffsetX);
            this.mainHolderDO.y = this.height - this.mainHolderDO.height + this.preloaderOffsetY;
        }else if(t == 'centertop'){
            this.mainHolderDO.x = Math.round((this.width - this.mainHolderDO.width)/2) + this.preloaderOffsetX;
            this.mainHolderDO.y = this.preloaderOffsetY;
        }else if(t == 'centerbottom'){
            this.mainHolderDO.x = Math.round((this.width - this.mainHolderDO.width)/2) + this.preloaderOffsetX;
            this.mainHolderDO.y = this.height - this.mainHolderDO.height + this.preloaderOffsetY;
        }else{
            this.mainHolderDO.x = Math.round((this.width - this.mainHolderDO.width)/2) + this.preloaderOffsetX;
            this.mainHolderDO.y = Math.round((this.height - this.mainHolderDO.height)/2) + this.preloaderOffsetY;
        }
     
        if(this.preloaderBackgroundSize == 'small'){
            this.backgroundDO.width = this.mainHolderDO.width + 60;
            this.backgroundDO.height = this.mainHolderDO.height + 40;
            this.backgroundDO.x = this.mainHolderDO.x - 30;
            this.backgroundDO.y = this.mainHolderDO.y - 25;
        }
    }


    /**
     * Update text.
     */
    update(percent, text){
       
        this.textDO.y = 0;
        if(this.barDO){
            this.barFillDO.style.width = Math.round(percent) + '%';
            this.textDO.y = this.barFillDO.height;
        }

        if(!text){
            text = this.preloaderText;
        }

        this.textDO.innerHTML = text + Math.round(percent) + '%';
        this.textDO.style.left = '50%';
        this.textDO.style.transform = 'translateX(-50%)';
        this.mainHolderDO.setHeight(this.textDO.y + this.textDO.height);
       
        this.positionPreloader();
    };

    /**
     * Set poster.
     */
    setPoster(img){
        if(!this.posterDO){
            this.posterDO = new FWDEMVDisplayObject('img');
        }

        this.posterDO.screen = img;
        this.backgroundDO.addChild(this.posterDO);

        this.posterOriginalWidth = img.naturalWidth;
        this.posterOriginalHeight = img.naturalHeight;
        this.posterDO.screen = img;

        this.posterDO.opacity = 0;
        FWDAnimation.to(this.posterDO, .8, {opacity:1});

        this.hasPoster = true;
        this.positionPoster();
        
    }
   
    positionPoster(){
        if(!this.hasPoster) return;

        let scX = this.maxWidth/this.posterOriginalWidth;
        let scY = this.height/this.posterOriginalHeight;
        let ttSc;
			
        if(scX <= scY){
            ttSc = scX;
        }else{
            ttSc = scY;
        }
       
        this.posterDO.width = Math.round(ttSc * this.posterOriginalWidth);
        this.posterDO.height = Math.round(ttSc * this.posterOriginalHeight);
		this.posterDO.x = Math.round((this.width - this.posterDO.width)/2);
		this.posterDO.y = Math.round((this.height - this.posterDO.height)/2);
    }
    
    /**
     * Show / hide preloader animation.
     */
    show(){
       
        FWDAnimation.killTweensOf(this.backgroundDO);
        FWDAnimation.killTweensOf(this.mainHolder2DO);
        FWDAnimation.to(this.backgroundDO, .6, {opacity: 1});
        FWDAnimation.to(this.mainHolder2DO, .8, {opacity:1, y:0, delay: .1, ease:Expo.easeInOut});
        this.isShowed = true;
    };
    
    hide(animate){
        if(this.destroyed) return;
      
        FWDAnimation.killTweensOf(this);
        FWDAnimation.killTweensOf(this.mainHolder2DO);
       
        if(animate){
            FWDAnimation.to(this.backgroundDO, 1, {opacity:0, delay:.4, onComplete: () => this.onHideComplete()});
            FWDAnimation.to(this.mainHolder2DO, .8, {opacity:0, y:20, delay:.4, ease: Expo.easeInOut});
           
        }else{
            this.backgroundDO.opacity = 0;
            this.mainHolder2DO.opacity = 0;
            this.mainHolder2DO.y = -20;
        }
        this.isShowed = false;

       
        this.hasPoster = false;
        
    };
    
    onHideComplete(){
        if(this.posterDO){
            FWDAnimation.killTweensOf(this.posterDO);
            this.posterDO.width = 0;
            this.backgroundDO.removeChild(this.posterDO);
        }
        this.dispatchEvent(FWDEMVPreloader.HIDE_COMPLETE);
    };
    

    /**
     * Destroy.
     */
    destroy = function(){
        this.destroyed = true;

        FWDAnimation.killTweensOf(this.backgroundDO);
        FWDAnimation.killTweensOf(this.mainHolder2DO);
         
        if(this.posterDO){
            FWDAnimation.killTweensOf(this.posterDO);
        }
    };
}
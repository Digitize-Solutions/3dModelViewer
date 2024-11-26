/**
 * Easy 3D Model Viewer v:1.0
 * Marker tooltip window.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVMarkerToolTip extends FWDEMVDisplayObject{
    
    static POINTER_UP = 'pointerUp';
    static POINTER_DOWN = 'pointerDown';


    /**
     * Initialize
     */
    constructor(
        prt,
        backgroundColor
    ){
            
        super();
        
        this.prt = prt;
        this.totalHeight = 0;
        this.backgroundColor = backgroundColor;
        this.totalWidth;
        
        this.isShowed = true;
      
        // Initialize.
        this.screen.className = 'fwdemv-main-tooltip-window';
        this.style.overflow = "visible";
        this.style.zIndex = 999999999;
        this.setupMainContainers();
        this.hide();
       
    }
        
 
    /**
     * Setup main containers.
     */
    setupMainContainers(){	

        this.textDO = new FWDEMVDisplayObject();
        this.textDO.screen.className = 'fwdemv-tooltip-window';
        this.textDO.style.backgroundColor = this.backgroundColor;
        this.textDO.style.width = '100%';
        this.addChild(this.textDO);
        
        this.pointerHolderDO = new FWDEMVDisplayObject();
        this.pointerHolderDO.screen.className = 'fwdemv-pointer-holder';
        this.pointerHolderDO.style.overflow = 'visible';
        this.addChild(this.pointerHolderDO);

       
        this.pointerDownDO = new FWDEMVDisplayObject("div");
        this.pointerDownDO.x = 0;
        this.pointerDownDO.screen.className = 'fwdemv-tooltip-window-pointer fwdemv-pointer-down';
        this.pointerDownDO.style.backgroundColor = this.backgroundColor;
        this.pointerDownDO.rotation = 45;
        this.pointerDownDO.width = 8;
        this.pointerDownDO.height = 8;
        this.pointerHolderDO.addChild(this.pointerDownDO);
        
        
        this.pointerUpDO = new FWDEMVDisplayObject("div");
        this.pointerUpDO.y = 0;
        this.pointerUpDO.screen.className = 'fwdemv-tooltip-window-pointer fwdemv-pointer-up';
        this.pointerUpDO.rotation = 45;
        this.pointerUpDO.style.backgroundColor = this.backgroundColor;
        this.pointerUpDO.width = 8;
        this.pointerUpDO.height = 8;
        this.pointerHolderDO.addChild(this.pointerUpDO);
    };
            
            
    /**
     * Set label.
     */
    setLabel(label, maxWidth){
        if(this.destroyed) return;
        this.maxWidth = maxWidth;
        var curWidth = Math.min(this.maxWidth, (FWDEMVUtils.getViewportSize().w - 20));
      
        this.totalWidth = curWidth;
        this.width = this.totalWidth;
        
        this.textDO.innerHTML = label;
  
        setTimeout(() =>{
            this.pointerWidth = this.pointerUpDO.width;
            this.pointerHeight = this.pointerUpDO.height;
            this.totalHeight = this.textDO.height + this.pointerHeight;
            this.width = this.totalWidth;
            this.height = this.totalHeight - this.pointerHeight;
        },79);
    };
    

    /**
     * Position pointer.
     */
    positionPointer = function(offsetX, position){
        var finalX = 0;
        var finalY = 0;

        if(!offsetX) offsetX = 0;
        
        finalX = Math.round((this.totalWidth - this.pointerWidth)/2) + offsetX;
        if(finalX < 0) finalX = 0;

        if(position == FWDEMVMarkerToolTip.POINTER_DOWN){
            this.textDO.screen.className = 'fwdemv-tooltip-window fwdemv-pointer-down';
            finalY = Math.round(this.totalHeight - this.pointerHeight - this.pointerHeight/2);
            this.pointerHolderDO.x = finalX;
            this.pointerHolderDO.y = finalY;
        }else{
            this.textDO.screen.className = 'fwdemv-tooltip-window fwdemv-pointer-up';
            finalY = - this.pointerHeight  + Math.round(this.pointerHeight/2);
            this.pointerHolderDO.x = finalX;
            this.pointerHolderDO.y = finalY;
        }
    };

            
    /**
     * Show/hide.
     */     
    show(){
        if(this.isShowed) return;
       
        this.positionPointer();
        if(FWDEMVUtils.isMobile){
            this.opacity = 1;
        }else{
            FWDAnimation.to(this, .4, {opacity:1, delay:.1, ease:Quart.easeOut});
        }
        this.isShowed = true;
    };
    
    hide(){
        if(!this.isShowed) return;
      
        if(!FWDEMVUtils.isMobile) FWDAnimation.killTweensOf(this);
        this.x = -5000;
        this.opacity = 0;
        this.textDO.innerHTML = '';
        this.isShowed = false;
    };
            
            
    /**
     * Show/hide.
     */     
    destroy = function(){
        this.destroyed = true;
        FWDAnimation.killTweensOf(this);  
    }
}    
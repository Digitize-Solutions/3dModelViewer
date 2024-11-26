/**
 * Easy 3D Model Viewer v:1.0
 * Button tooltip.
 * @author Tibi - FWDEMesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";

export default class FWDEMEMVButtonTooltip extends FWDEMVDisplayObject{

  
    /*
     * Initialize
     */
    constructor(
        toolTipLabel,
        toolTipLabel2,
        buttonToolTipBackgroundColor,
        buttonToolTipFontColor
    ){

        super();
	
		this.toolTipLabel = toolTipLabel;
		this.toolTipLabel2 = toolTipLabel2;
        this.buttonToolTipBackgroundColor = buttonToolTipBackgroundColor;
        this.buttonToolTipFontColor = buttonToolTipFontColor;
		
		this.isShowed = true;

        this.style.overflow = 'visible';
        this.width = 200;
        this.setupMainContainers();
        this.setLabel(this.toolTipLabel);
        this.hide();
    }

    /**
     * Setup main container.
     */
    setupMainContainers(){	
       
        this.textDO = new FWDEMVDisplayObject();
        this.textDO.screen.className = 'fwdemv-button-tooltip';
        this.textDO.style.display = 'inline-block';
        this.textDO.style.whiteSpace = 'nowrap';
        this.textDO.style.backgroundColor = this.buttonToolTipBackgroundColor;
        this.textDO.style.color = this.buttonToolTipFontColor;
        this.addChild(this.textDO);
      
        this.pointerHolderDO = new FWDEMVDisplayObject("div");
        this.pointerHolderDO.style.overflow = 'visible';
        this.addChild(this.pointerHolderDO);
    
        this.pointerDO = new FWDEMVDisplayObject('div', '1d');
     
        this.pointerDO.y = 0;

        this.pointerDO.screen.className = 'fwdemv-button-tooltip-pointer fwdemv-pointer-down';
        this.pointerDO.screen.style.position = 'absolute';
        this.pointerDO.style.backgroundColor = this.dClr;
        this.pointerDO.rotation = 45;
        this.pointerDO.style.backgroundColor = this.buttonToolTipBackgroundColor;
        this.pointerDO.width = 8;
        this.pointerDO.height = 8;
        
    
        this.addChild(this.pointerDO);
    }
		
		
	/**
     * Set label 
     */
    setLabel(label){
        if(this == null) return;
        this.textDO.innerHTML = label;
        
        setTimeout(() => {
            if(this == null) return;
            this.pointerWidth = this.pointerDO.width
            this.pointerHeight = this.pointerDO.height;
            this.totalWidth = this.textDO.screen.offsetWidth;
            this.totalHeight = this.textDO.height + this.pointerHeight;
            this.positionPointer(0);
        },120);        
    };
		
	positionPointer(offsetX){
        var finalX;
        var finalY;
        
        if(!offsetX) offsetX = 0;
        
        finalX = Math.round((this.totalWidth - this.pointerWidth)/2) + offsetX;
        finalY = this.totalHeight - this.pointerHeight - this.pointerHeight/2;
    
        this.pointerDO.x = finalX;
        this.pointerDO.y = finalY;
    };
		
		
	/**
     * Show/hide. 
     */
    show(){
        if(this.isShowed) return;
        this.isShowed = true;

        clearInterval(this.hideWithDelayIdTO);
        this.positionPointer();
        
        FWDAnimation.killTweensOf(this);
        FWDAnimation.to(this, .4, {opacity:1, delay:.1, ease:Quart.easeOut});
    };
    
    hide(){
        if(!this.isShowed) return;
        this.isShowed = false;

        FWDAnimation.killTweensOf(this);
        this.x  = -5000;
        this.opacity = 0;
    };

}
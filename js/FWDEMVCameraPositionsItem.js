/**
 * Easy 3D Model Viewer v:1.0
 * Camera postions item.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";

export default class FWDEMVCameraPositionsItem extends FWDEMVDisplayObject{

    static POINTER_OVER = 'pointerOver';
    static POINTER_OUT = 'pointerOut';
    static POINTER_UP = 'pointerUp';

  
    /**
     * Initialize
     */
    constructor(
        cameraPositionName,
        id,
        fontIcon,
        height,
        normalColor,
        selectedColor
    ){

        super();
       
        this.cameraPositionName = cameraPositionName;
        this.id = id;
        this.fontIcon = fontIcon;
        this.height = height;
        this.normalColor = normalColor;
        this.selectedColor = selectedColor;


        // Initalize.
        this.screen.className = 'fwdemv-camera-positions-item';
        this.style.width = '100%';
        this.style.cursor = 'pointer';
       
        this.setupTextHolder();
        this.addEvents();
        this.setNormalState();
    }

    /**
     * Setup cameraPositionName hoder.
     */
    setupTextHolder(){
        this.textDO = new FWDEMVDisplayObject();
        this.textDO.screen.className = 'fwdemv-camera-position-item-text'
        this.textDO.style.overflow = 'hidden';
        this.textDO.style.whiteSpace = 'nowrap';  
        this.textDO.style.textOverflow = 'ellipsis';  
        this.textDO.style.textAlign = 'left';  
        this.textDO.style.display = 'inline-block';
       
        this.textDO.innerHTML = '<span class="fwdemv-camera-position-item-count" style="width:30px; display:inline-block; margin-right:4px; text-align: center; color:' + this.normalColor + '">' + (this.id + 1) + '</span>' + this.cameraPositionName;
        this.addChild(this.textDO);

        this.checkDO = new FWDEMVDisplayObject();
        this.checkDO.innerHTML = '<span style="display:inline-block" class="' + this.fontIcon + '-check"></span>';
        this.checkDO.style.color = this.selectedColor;
        this.checkDO.style.visibility = 'hidden';
        this.addChild(this.checkDO);
       
        setTimeout(() =>{
            this.textDO.y = Math.round((this.height - this.textDO.height)/2);
            this.checkDO.style.left = 'calc(100% - ' + this.checkDO.width + 'px)';
            this.checkDO.y = Math.round((this.height - this.checkDO.height)/2);

            this.textDO.style.width = 'calc(100% - ' + (this.checkDO.width + 10) + 'px)';
        }, 250);
    }


    /**
     * Add events.
     */
    addEvents(){
       
        this.onPointerOver = this.onPointerOver.bind(this);
        this.screen.addEventListener("pointerover", this.onPointerOver);

        this.onPointerOut = this.onPointerOut.bind(this);
        this.screen.addEventListener("pointerout", this.onPointerOut);

        this.onPointerUp = this.onPointerUp.bind(this);
        this.screen.addEventListener("pointerup", this.onPointerUp);
        
    }

    onPointerOver(e){
        if(this.disabled) return;
        if(e.pointerType == 'touch') return;
        this.setSelectedState(true);
    }
    
    onPointerOut(e){
        if(this.disabled) return;
        if(e.pointerType == 'touch') return;
        this.setNormalState(true);
    }

    onPointerUp(e){
        if(this.disabled) return;
        if(e.preventDefault) e.preventDefault();
        this.dispatchEvent(FWDEMVCameraPositionsItem.POINTER_UP , {e:e, 'id': this.id, 'cameraPositionName': this.cameraPositionName});
    }


    /**
     * Set states.
     */
    setNormalState(animate){
        if(this.isDisabled) return;

        this.isSelected = false;
        const countEL = this.screen.getElementsByClassName('fwdemv-camera-position-item-count')[0];
        
        if(animate){
            FWDAnimation.to(this.textDO.screen, .8, {color:this.normalColor, ease:Quint.easeOut});
            FWDAnimation.to(countEL, .8, {color:this.normalColor, ease:Quint.easeOut});
        }else{
            FWDAnimation.killTweensOf(this.textDO.screen);
            this.textDO.style.color = this.normalColor;

            FWDAnimation.killTweensOf(countEL);
            countEL.style.color = this.normalColor;
        }
    }

    setSelectedState(animate){
        if(this.isDisabled) return;

        this.isSelected = true;
        const countEL = this.screen.getElementsByClassName('fwdemv-camera-position-item-count')[0];

        if(animate){
            FWDAnimation.to(this.textDO.screen, .8, {color:this.selectedColor, ease:Quint.easeOut});
            FWDAnimation.to(countEL, .8, {color:this.selectedColor, ease:Quint.easeOut});
        }else{
            FWDAnimation.killTweensOf(this.textDO.screen);
            this.style.color = this.selectedColor;

            FWDAnimation.killTweensOf(countEL);
            countEL.style.color = this.selectedColor;
        }
    }


    /**
     * Disable/enable.
     */
    disable(){
        this.setSelectedState(true);
        this.disabled = true;
        this.style.cursor = 'default';
        this.checkDO.style.visibility = 'visible';
    }

    enable(){
        this.disabled = false;
        this.setNormalState(true);
        this.style.cursor = 'pointer';
        this.checkDO.style.visibility = 'hidden';
    }

}
/**
 * Easy 3D Model Viewer v:1.0
 * Hider.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVEventDispather from "./FWDEMVEventDispather";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVHider extends FWDEMVEventDispather{

    static HIDE = "hide";
    static SHOW = "show";


    /**
     * Initialize
     */
     constructor(testDO, delay){
        super();
       
        this.testDO = testDO;
        this.delay = delay;
        this.globalX = -1;
    	this.globalY = -1;

        this.dispatchOnceShow = true;
    	this.dispatchOnceHide = false;
        this.isStopped = true;
     }


    /**
      * Start/stop.
      */
    start(){
        this.currentTime = new Date().getTime() + this.delay;
        this.checkIntervalId = setInterval( () =>{
            this.update();
        }, 100);
        this.addPointerMoveCheck();
        this.isStopped = false;
    };

    stop(){
        clearInterval(this.checkIntervalId);
        this.isStopped = true;
        this.removePointerMoveCheck();
    };

    addPointerMoveCheck(){	
        this.onMouseOrTouchUpdate = this.onMouseOrTouchUpdate.bind(this);

        this.testDO.screen.addEventListener("pointerdown", this.onMouseOrTouchUpdate);
        this.testDO.screen.addEventListener("pointermove", this.onMouseOrTouchUpdate);
    };

    removePointerMoveCheck(){	
        this.testDO.screen.removeEventListener("pointerdown", this.onMouseOrTouchUpdate);
        this.testDO.screen.removeEventListener("pointermove", this.onMouseOrTouchUpdate);
    }

    onMouseOrTouchUpdate(e){
        if(this.destroyed) return;
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	

        this.gloabXTest = vc.x;
        this.gloabYTest = vc.y;

        if(this.globalX == vc.x && this.globalY == vc.y) return
        this.currentTime = new Date().getTime() + this.delay;
        this.globalX = vc.x;
        this.globalY = vc.y;
    };

    update(){
        if(this.destroyed) return;
        if(new Date().getTime() > this.currentTime){
            if(this.dispatchOnceShow){	
                this.dispatchEvent(FWDEMVHider.HIDE);
                this.dispatchOnceHide = true;
                this.dispatchOnceShow = false;	
            }
        }else{
            if(this.dispatchOnceHide){
                this.dispatchEvent(FWDEMVHider.SHOW);
                this.dispatchOnceHide = false;
                this.dispatchOnceShow = true;
            }
        }
    };

    reset(){
        this.currentTime = new Date().getTime();
        this.dispatchEvent(FWDEMVHider.SHOW);
    };


    /**
     * Destory.
     */
	destroy(){
        this.destroyed = true;
        this.removePointerMoveCheck();
    }
}
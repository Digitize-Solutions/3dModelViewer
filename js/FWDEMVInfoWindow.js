/**
 * Easy 3D Model Viewer v:1.0
 * Info window.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVButton from "./FWDEMVButton";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVInfoWindow extends FWDEMVDisplayObject{

    static HIDE_COMPLETE = "hideComplete";
	static SHOW_START = "showStart";
	

    /*
     * Initialize
     */
    constructor(prt, data){
        
        super();
       
        this.prt = prt;
        this.data = data;
        this.closeButtonBackgroundNormalColor = data.closeButtonBackgroundNormalColor;
        this.closeButtonBackgroundSelectedColor = data.closeButtonBackgroundSelectedColor;
        this.closeButtonBackgroundSelectedColor = data.closeButtonBackgroundSelectedColor;
        this.closeButtonIconSelectedColor = data.closeButtonIconSelectedColor;
        this.closeButtonSize = data.closeButtonSize;

		this.mainBackgroundColor = data.infoWindowMainBackgroundColor;
        this.infoWindowBackgroundColor = data.infoWindowBackgroundColor;
		this.scrollBarHandlerColor = data.infoWindowScrollBarColor;
		this.scrollBarTrackColor = data.infoWindowScrollBarColor;
		this.scrollBarTrackOpacity = .6;
		
        this.maxWidth = this.data.infoWindowWidth;
		this.mainContentFinalX = 0;
		this.mainContentFinalY = 0;
		this.contentFinalX = 0;
		this.contentFinalY = 0;
		this.headerFinalY = 0;
		
		this.offestWidth = 0;
		this.offsetHeight = 0;
		this.scrollBarHeight = 0;
		this.scrollBarWidth = 4;
		this.scrollBarBorderRadius = 15;
		this.vy = 0;
		this.vy2 = 0;
		this.friction = .9;
		
		this.hideWithDelayId_do;
		this.showOrHideWithDelayTO;
		this.hideCompleteId_to;
		this.updateMobileScrollRAF;
	
		this.isShowed = false;
		this.allowToScroll = true;


        // Initialize.
        this.screen.className = 'fwdemv-main-info-window';
		this.style.overflow = 'visible';
        this.style.cursor = 'auto';
        this.setupMainContainers();

        if(FWDEMVUtils.isMobile){
            this.setupMobileScrollbar();
        }else{
            this.addMouseWheelSupport();
        }
        this.setupPCScrollBar();
    }

    
    /**
     * Position and resize.
     */
    resize(){
        if(this.width == this.prt.width && this.height == this.prt.height) return;
        
        this.width = this.prt.width;
        this.height = this.prt.height;
        
        this.backgroundDO.width = this.width;
        this.backgroundDO.height = this.height;
        this.updateSize();
    };
    

   
    /**
     * Setup main containers.
     */
    setupMainContainers(){
    
        this.backgroundDO = new FWDEMVDisplayObject();
        this.backgroundDO.style.backgroundColor = this.mainBackgroundColor;
        this.addChild(this.backgroundDO);
        
        this.mainContentHolderDO = new FWDEMVDisplayObject();
        this.mainContentHolderDO.screen.className = 'fwdemv-main-content-holder';
        this.mainContentHolderDO.style.backfaceVisibility = 'visible';
        
        this.dumyHolderDO = new FWDEMVDisplayObject();
        this.dumyHolderDO.style.backfaceVisibility = 'visible';
        this.addChild(this.dumyHolderDO);
        
        this.dumyHolderDO.addChild(this.mainContentHolderDO);
        
        this.contentHolderDO = new FWDEMVDisplayObject();
        this.contentHolderDO.style.width = '100%';
        this.contentHolderDO.style.overflow = 'visible';
        this.contentHolderDO.style.backfaceVisibility = 'visible';
        this.contentHolderDO.screen.className = 'fwdemv-content-holder';

        this.in1_do = new FWDEMVDisplayObject();
        this.in1_do.style.position = 'relative';
        this.in1_do.screen.className = 'fwdemv-info-window';
        this.in1_do.style.overflow = 'visible';
        this.in1_do.style.width = '100%';
    
        this.in2_do = new FWDEMVDisplayObject();
        this.in2_do.screen.className = 'fwdemv-info-window-in';
        this.in2_do.style.position = 'relative';
        this.in2_do.style.width = '100%';
        this.in2_do.style.backgroundColor = this.infoWindowBackgroundColor;
        this.in1_do.addChild(this.in2_do);
        this.contentHolderDO.addChild(this.in1_do);
        
        this.mainContentHolderDO.addChild(this.contentHolderDO);
    };
    
    
    /**
     * Setup close button.
     */
    setupCloseButton(){
        if(this.closeButtoDO) return;

        this.closeButtoDO = new FWDEMVButton(
            this,
            'fwdemv-close-button',
            this.prt.fontIcon + '-close',
            undefined,
            this.closeButtonBackgroundNormalColor,
            this.closeButtonBackgroundSelectedColor,
            this.closeButtonBackgroundSelectedColor,
            this.closeButtonIconSelectedColor,
            true,
            this.closeButtonSize,
            this.closeButtonSize);
        
        this.mainContentHolderDO.addChild(this.closeButtoDO);
       
        this.closeButtonPointerUpHandler = this.closeButtonPointerUpHandler.bind(this);
        this.closeButtoDO.addEventListener(FWDEMVButton.POINTER_UP, this.closeButtonPointerUpHandler);
    };
    
    closeButtonPointerUpHandler(e){
        if(!this.isShowed) return;
        this.hide(true);
    };
    
  
    /**
     * Update content size.
     */
    updateSize(){
        if(this.destroyed || !this.closeButtoDO) return;
        this.mainContentHolderWidth = this.width - this.offestWidth;
        if(this.mainContentHolderWidth > this.maxWidth) this.mainContentHolderWidth = this.maxWidth;
        this.mainContentHolderDO.width = this.mainContentHolderWidth;
        this.dumyHolderDO.width = this.width;
        this.dumyHolderDO.height = this.height;

        if(FWDEMVUtils.isMobile){	
            setTimeout(() => {
                if(this.destroyed) return;
               
                FWDAnimation.killTweensOf(this.mainContentHolderDO);
               
                this.contentHolderHeight = this.in2_do.screen.offsetHeight + 40;
                this.mainContentHolderHeight = Math.min(this.height, this.contentHolderHeight);
                this.mainContentFinalX = Math.round((this.width - this.mainContentHolderWidth)/2);

                this.scrollBarHeight = Math.min(this.contentHolderHeight - 10 - this.closeButtonSize, this.height - 10 - this.closeButtonSize);
                
                if(this.height > this.contentHolderHeight){
                    this.scrollBarDO.style.overflow = 'hidden';
                    this.scrollBarHandlerDO.y = 0;
                    this.mainContentFinalY = Math.round((this.height - this.contentHolderHeight)/2);
                    this.allowToScroll = false;
                }else{
                    this.scrollBarDO.style.overflow = 'visible';
                    this.scrollBarDO.y  = 20;
                    this.mainContentFinalY = 0;	
                    this.allowToScroll = true;
                }

                if(this.height < 120) this.mainContentFinalY = 0;

                this.scrollBarHandlerHeight = Math.min((this.scrollBarHeight), (this.height/this.contentHolderHeight) * (this.scrollBarHeight));
                if(this.scrollBarHandlerHeight > 500){
                    this.scrollBarHandlerHeight = 500;
                }

                this.scrollBarDO.x = this.mainContentHolderWidth - this.scrollBarWidth - 6;
                this.scrollBarTrackDO.height = Math.max(this.scrollBarHeight, this.scrollBarHandlerHeight);
                this.scrollBarHandlerDO.height = this.scrollBarHandlerHeight;
                
                this.updateMobileScrollBarWithoutAnimation();
                FWDAnimation.killTweensOf(this.mainContentHolderDO);
                this.mainContentHolderDO.x  = this.mainContentFinalX;
                this.mainContentHolderDO.y = this.mainContentFinalY;
                this.mainContentHolderDO.height = this.mainContentHolderHeight;
            }, 50);
            
        }else{
        
            setTimeout(() => {
                if(this.destroyed) return;

                FWDAnimation.killTweensOf(this.mainContentHolderDO);
              
                this.contentHolderHeight = this.in2_do.screen.offsetHeight + 40;
                this.mainContentHolderHeight = Math.min(this.height, this.contentHolderHeight);
                this.mainContentFinalX = Math.round((this.width - this.mainContentHolderWidth)/2);

                this.scrollBarHeight = Math.min(this.contentHolderHeight - 10 - this.closeButtonSize, this.height - 10 - this.closeButtonSize);

                if(this.height > this.contentHolderHeight){
                    this.scrollBarDO.style.overflow = 'hidden';
                    this.scrollBarHandlerDO.y = 0;
                    this.mainContentFinalY = Math.round((this.height - this.contentHolderHeight)/2);
                    this.allowToScroll = false;
                }else{
                    this.mainContentFinalY = 0;
                    this.scrollBarDO.style.overflow = 'visible';
                    this.scrollBarDO.y  = 20;
                    this.allowToScroll = true;
                }
                
                if(this.height < 120) this.mainContentFinalY = 0;
            
                this.scrollBarHandlerHeight = Math.min((this.scrollBarHeight), (this.height/this.contentHolderHeight) * (this.scrollBarHeight));
                if(this.scrollBarHandlerHeight > 500){
                    this.scrollBarHandlerHeight = 500;
                }
                
                this.scrollBarDO.x = this.mainContentHolderWidth - this.scrollBarWidth - 2;
                this.scrollBarTrackDO.height = Math.max(this.scrollBarHeight, this.scrollBarHandlerHeight);
                this.scrollBarHandlerDO.height = this.scrollBarHandlerHeight;
                
                FWDAnimation.killTweensOf(this.mainContentHolderDO);
                this.mainContentHolderDO.x = this.mainContentFinalX;
                this.mainContentHolderDO.y = this.mainContentFinalY;
                this.mainContentHolderDO.height = this.mainContentHolderHeight;
               
                this.updatePCHandler(false);
            
            }, 50);
        }
       
        this.closeButtoDO.x = this.mainContentHolderWidth - this.closeButtonSize - 30;
        this.closeButtoDO.y = 30;
    };
    
    
    /**
     * Set text.
     */
    setText(text){
        if(this.destroyed) return;
        this.updateSize();
        this.in2_do.innerHTML = text;
    };

    
    /**
     * Setup PC scrollbar.
     */
    setupPCScrollBar(){
        
        this.scrollBarDO = new FWDEMVDisplayObject();
        this.scrollBarDO.style.overflow = "visible";
        this.mainContentHolderDO.addChild(this.scrollBarDO);
        
        this.scrollBarTrackDO = new FWDEMVDisplayObject();
        this.scrollBarTrackDO.width = this.scrollBarWidth;
        this.scrollBarTrackDO.style.backgroundColor = this.scrollBarTrackColor;
        this.scrollBarTrackDO.opacity = 0;
        this.scrollBarTrackDO.style.borderRadius = this.scrollBarBorderRadius + "px";
        this.scrollBarDO.addChild(this.scrollBarTrackDO);
        
        this.scrollBarHandlerDO = new FWDEMVDisplayObject();
        this.scrollBarHandlerDO.style.cursor = 'pointer';
        this.scrollBarHandlerDO.width = this.scrollBarWidth;
        this.scrollBarHandlerDO.style.borderRadius = this.scrollBarBorderRadius + "px";
        this.scrollBarHandlerDO.style.backgroundColor = this.scrollBarHandlerColor;
        this.scrollBarHandlerDO.opacity = .5;

        this.scrollBarHandlerPointerMoveHandler = this.scrollBarHandlerPointerMoveHandler.bind(this);
        this.scrollBarHandlerPointerEndHandler = this.scrollBarHandlerPointerEndHandler.bind(this);
        
        if(!FWDEMVUtils.isMobile){
            this.scrollBarHandlerOnPointerOver = this.scrollBarHandlerOnPointerOver.bind(this);
            this.scrollBarHandlerDO.screen.addEventListener("pointerover", this.scrollBarHandlerOnPointerOver);

            this.scrollBarHandlerOnPointerOut = this.scrollBarHandlerOnPointerOut.bind(this);
            this.scrollBarHandlerDO.screen.addEventListener("pointerout", this.scrollBarHandlerOnPointerOut);

            this.scrollBarHandlerOnPointerDown = this.scrollBarHandlerOnPointerDown.bind(this);
            this.scrollBarHandlerDO.screen.addEventListener("pointerdown", this.scrollBarHandlerOnPointerDown);
        }
           
        this.scrollBarDO.addChild(this.scrollBarHandlerDO);
    };

    
    /**
     * Desktop handler.
     */
    scrollBarHandlerOnPointerOver(){
        FWDAnimation.to(this.scrollBarHandlerDO, .2, {opacity:1, width:10});
        FWDAnimation.to(this.scrollBarTrackDO, .2, {opacity:.4, width:10});
        FWDAnimation.to(this.scrollBarDO, .2, {x:this.mainContentHolderWidth - this.scrollBarWidth - 6});
    };
    
    scrollBarHandlerOnPointerOut(){
        if(this.isDragging_bl) return;
        FWDAnimation.to(this.scrollBarHandlerDO, .3, {opacity:.5, width:this.scrollBarWidth});
        FWDAnimation.to(this.scrollBarTrackDO, .3, {opacity:0, width:this.scrollBarWidth});
        FWDAnimation.to(this.scrollBarDO, .3, {x:this.mainContentHolderWidth - this.scrollBarWidth - 2});
    };
    
    scrollBarHandlerOnPointerDown(e){
        if(!this.allowToScroll) return;
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);		
        this.isDragging_bl = true;
        this.yPositionOnPress = this.scrollBarHandlerDO.y;
        this.lastPresedY = vc.y;
        
        window.addEventListener("pointermove", this.scrollBarHandlerPointerMoveHandler);
        window.addEventListener("pointerup", this.scrollBarHandlerPointerEndHandler);	
    };
    
    scrollBarHandlerPointerMoveHandler(e){
        if(e.preventDefault) e.preventDefault();
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	

        this.scrollBarHandlerFinalY = Math.round(this.yPositionOnPress + vc.y - this.lastPresedY);
        if(this.scrollBarHandlerFinalY >= this.scrollBarHeight - this.scrollBarHandlerHeight){
            this.scrollBarHandlerFinalY = this.scrollBarHeight -  this.scrollBarHandlerHeight;
        }
        
        if(this.scrollBarHandlerFinalY <= 0) this.scrollBarHandlerFinalY = 0;
        this.scrollBarHandlerDO.y = this.scrollBarHandlerFinalY;
        this.updatePCHandler(true);
    };
    
    scrollBarHandlerPointerEndHandler(e){
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        this.isDragging_bl = false;
        
        if(!FWDEMVUtils.hitTest(this.scrollBarHandlerDO.screen, vc.x, vc.y)){
            this.scrollBarHandlerOnPointerOut();
        }
       
        window.removeEventListener("pointermove", this.scrollBarHandlerPointerMoveHandler);
        window.removeEventListener("pointerup", this.scrollBarHandlerPointerEndHandler);	
    };
    
    updatePCHandler(animate){
        
        let percent;
        let scrollPercent;
    
        scrollPercent = (this.scrollBarHandlerFinalY/(this.scrollBarHeight - this.scrollBarHandlerHeight));
        
        if(scrollPercent == "Infinity") scrollPercent = 0;
        if(scrollPercent >= 1) scrollPercent = 1;
       
        if(this.isDragging_bl){
            this.contentFinalY = parseInt(scrollPercent * (this.height - this.contentHolderHeight));
        }else{
            if(this.scrollBarHandlerDO.y < 0){
                this.scrollBarHandlerDO.y = 0;
            }else if(this.scrollBarHandlerDO.y > this.scrollBarHeight - this.scrollBarHandlerHeight){
                this.scrollBarHandlerDO.y = this.scrollBarHeight - this.scrollBarHandlerHeight;
            }
        
            percent = this.scrollBarHandlerDO.y/(this.scrollBarHeight - this.scrollBarHandlerHeight);	
            if(isNaN(percent)) percent = 0;
            
            if(this.height > this.contentHolderHeight){
                this.contentFinalY = 0;
            }else{
                this.contentFinalY = Math.round(percent * (this.height - this.contentHolderHeight));
            }
        }
        
        if(animate){
            FWDAnimation.to(this.contentHolderDO, .3, {y:Math.round(this.contentFinalY)});
        }else{
            this.contentHolderDO.y = Math.round(this.contentFinalY);
        }
    };
    
    
    /**
     * Add mouse wheel support.
     */
    addMouseWheelSupport(){
        this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
        this.screen.addEventListener ("mousewheel", this.mouseWheelHandler, {passive:false});
        this.screen.addEventListener('DOMMouseScroll', this.mouseWheelHandler, {passive:false});
    };
    
    mouseWheelHandler(e){
        if(!this.isShowed) return;
       
        if(this.isDragging_bl) return;
        if(this.height > this.contentHolderHeight) return;
    
        let speedPercent = (this.height/this.contentHolderHeight);
        let dir = e.detail || e.wheelDelta;	
        if(e.wheelDelta) dir *= -1;
        if(FWDEMVUtils.isOpera) dir *= -1;
        
        if(dir > 0){
            this.scrollBarHandlerDO.y = this.scrollBarHandlerDO.y + (45 * speedPercent);
        }else if(dir < 0){
            this.scrollBarHandlerDO.y = this.scrollBarHandlerDO.y - (45 * speedPercent);
        }
        
        this.updatePCHandler(true);
        
        if(e.preventDefault){
            e.preventDefault();
        }else{
            return false;
        }	
        return;
    };
    

    /**
     * Setup mobile scrollbar.
     */
    setupMobileScrollbar(){

        this.scrollBarpointerupHandler = this.scrollBarpointerupHandler.bind(this);
        this.scrollBarpointermoveHandler = this.scrollBarpointermoveHandler.bind(this);

        this.scrollBarPointerDownHandler = this.scrollBarPointerDownHandler.bind(this);
        this.screen.addEventListener("pointerdown", this.scrollBarPointerDownHandler, {passive: false});

        setTimeout(() =>{
            if(this.destroyed) return;
            this.scrollBarHandlerDO.opacity = 0;
        }, 250);
    };
    
    scrollBarPointerDownHandler(e){
        if(!this.allowToScroll) return;
        this.screen.style.touchAction = 'none';
        clearTimeout(this.cancelMoblileScrollbarTO);
     
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);		
        this.isDragging_bl = true;
        this.lastPresedY = vc.y;
        this.controlsCliks = 0;

        window.addEventListener("pointerup", this.scrollBarpointerupHandler);
        window.addEventListener("pointermove", this.scrollBarpointermoveHandler, {passive: false});
        window.addEventListener("touchmove", this.dummyScrollBarMove, {passive: false});
        
    };
    
    scrollBarpointermoveHandler(e){
        e.preventDefault();
   
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        let toAdd = vc.y - this.lastPresedY;
    
        this.contentFinalY += toAdd;
        this.contentFinalY = Math.round(this.contentFinalY);

        this.controlsCliks += 1;
        if(this.controlsCliks > 2){
            this.scrollBarHandlerDO.opacity = 1;
        }
        
        this.contentHolderDO.y = this.contentFinalY;
        this.lastPresedY = vc.y;
        this.vy = toAdd  * 2;
    };
    
    scrollBarpointerupHandler(e){
        this.isDragging_bl = false;

        clearTimeout(this.cancelMoblileScrollbarTO);
        this.cancelMoblileScrollbarTO = setTimeout(() => {
            if(this.destroyed) return;

            FWDAnimation.to(this.scrollBarHandlerDO, .8, {opacity: 0, ease:Quint.easeOut});
        }, 2000);
      
        window.removeEventListener("pointerup", this.scrollBarpointerupHandler);
        window.removeEventListener("pointermove", this.scrollBarpointermoveHandler);
        window.removeEventListener("touchmove", this.dummyScrollBarMove);
    };

    dummyScrollBarMove(e){
        e.preventDefault();
    }
    
    updateMobileScrollBar(){
        this.contentHolderHeight = this.in2_do.screen.offsetHeight;
        this.mainContentHolderHeight = Math.min(this.height, this.contentHolderHeight);
        if(!this.isDragging_bl){
            this.vy *= this.friction;
            this.contentFinalY += this.vy;	

            if(this.contentFinalY > 0){
                this.vy2 = (0 - this.contentFinalY) * .3;
                this.vy *= this.friction;
                this.contentFinalY += this.vy2;
            }else if(this.contentFinalY < this.mainContentHolderHeight - this.contentHolderHeight - 40){
                this.vy2 = (this.mainContentHolderHeight - this.contentHolderHeight - this.contentFinalY  - 40) * .3;
                this.vy *= this.friction;
                this.contentFinalY += this.vy2;
            }
            this.contentHolderDO.y =  Math.round(this.contentFinalY);
        }

        let percentScrolled = this.contentFinalY/(this.mainContentHolderHeight - this.contentHolderHeight - 40)
        this.scrollBarHandlerDO.y = percentScrolled * (this.scrollBarTrackDO.height -  this.scrollBarHandlerDO.height)
        this.updateMobileScrollRAF = requestAnimationFrame(this.updateMobileScrollBar.bind(this));
    };
    
    updateMobileScrollBarWithoutAnimation(){
        if(this.contentFinalY > 0){
            this.contentFinalY = 0;
        }else if(this.contentFinalY < this.mainContentHolderHeight - this.contentHolderHeight){
            this.contentFinalY = this.mainContentHolderHeight - this.contentHolderHeight;
        }
        this.contentHolderDO.y = Math.round(this.contentFinalY);
    };
    
    activateScrollBar(){
        if(FWDEMVUtils.isMobile){
            this.updateMobileScrollRAF = requestAnimationFrame(this.updateMobileScrollBar.bind(this));
        }
    };
    
    
    /**
     * Show / hide.
     */
    show(text){
    
        if(this.isShowed) return;
        this.setupCloseButton();
        this.isShowed = true;
        this.resize();
        this.setText(text);
        this.activateScrollBar();

        setTimeout(() => {
            if(this.destroyed) return;
            this.updateSize()
        }, 100);
        if(FWDEMVUtils.isMobile){
            FWDAnimation.to(this.backgroundDO, .8, {opacity:1});
            this.showOrHideWithDelayTO = setTimeout(() =>{
                if(this.destroyed) return;
                this.showWithDelay()
            } , 300);
        }else{
            FWDAnimation.to(this.backgroundDO, .6, {opacity:1});
            this.showOrHideWithDelayTO = setTimeout(() =>{
                if(this.destroyed) return;
                this.showWithDelay()
            }, 300);
          
        }
       
        this.dispatchEvent(FWDEMVInfoWindow.SHOW_START);
    };
    
    showWithDelay(){
       
        this.dumyHolderDO.x = 0;
        if(this.scrollBarHandlerDO) this.scrollBarHandlerDO.style.visiblity = 'visibile';
        this.mainContentHolderDO.y = -Math.min(this.mainContentHolderHeight, this.contentHolderHeight);
        
        if(FWDEMVUtils.isMobile && this.contentHolderHeight <= Math.abs(this.mainContentHolderDO.y)){
            this.mainContentHolderDO.y -= 30;
        }
        FWDAnimation.to(this.mainContentHolderDO, .8, {y:this.mainContentFinalY, ease:Expo.easeInOut, onComplete:() => this.showComplete()});
    };

    showComplete(){
        this.updateSize();
    }
    
    hide(animate, overwrite){
        if(!this.isShowed && !overwrite) return;
        this.isShowed = false;
        
        FWDAnimation.killTweensOf(this.backgroundDO);	
        if(animate){
            FWDAnimation.to(this.mainContentHolderDO, .8, {y:this.height, ease:Expo.easeInOut});
            this.showOrHideWithDelayTO = setTimeout(() => this.hideWithDelay(), 800);
        }else{
            this.dumyHolderDO.x  = -3000;
            if(this.scrollBarHandlerDO) this.scrollBarHandlerDO.style.visiblity = 'hidden';
            this.backgroundDO.setAlpha(0);
        }
        cancelAnimationFrame(this.updateMobileScrollRAF);
       
    };
    
    hideWithDelay(){
        this.in2_do.innerHTML  = '';
        FWDAnimation.to(this.backgroundDO, .6, {opacity:0});
        this.hideCompleteId_to = setTimeout(() =>{
            if(this.destroyed) return;
            this.hideWithDelayComplete()
        }, 600);
    };
    
    hideWithDelayComplete(){
        this.contentFinalY = 0;
        if(this.scrollBarHandlerDO) this.scrollBarHandlerDO.y = 0;
        this.dispatchEvent(FWDEMVInfoWindow.HIDE_COMPLETE);
    };


    /**
     *  Destroy.
     */
     destroy(){
        this.destroyed = true;

        if(this.scrollBarHandlerPointerMoveHandler){
            window.removeEventListener("pointermove", this.scrollBarHandlerPointerMoveHandler);
            window.removeEventListener("pointerup", this.scrollBarHandlerPointerEndHandler);	
        }

        if(this.scrollBarHandlerPointerMoveHandler){
            window.removeEventListener("pointerup", this.scrollBarpointerupHandler);
            window.removeEventListener("pointermove", this.scrollBarpointermoveHandler);
            window.removeEventListener("touchmove", this.dummyScrollBarMove);
        }

        if(this.mouseWheelHandler){
            this.screen.addEventListener ("mousewheel", this.mouseWheelHandler);
            this.screen.addEventListener('DOMMouseScroll', this.mouseWheelHandler);
        }
    }
}
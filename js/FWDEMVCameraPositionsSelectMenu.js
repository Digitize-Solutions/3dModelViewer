/**
 * Easy 3D Model Viewer v:1.0
 * Camera postions select menu.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVButton from "./FWDEMVButton";
import FWDEMVUtils from "./FWDEMVUtils";
import FWDEMVCameraPositionsItem from "./FWDEMVCameraPositionsItem";
import FWDEMEMVButtonTooltip from "./FWDEMVButtonTooltip";

export default class FWDEMVCameraPositionsSelectMenu extends FWDEMVDisplayObject{

    static HIDE_COMPLETE = "hideComplete";
	static SHOW_START = "showStart";
    static ITEM_SELECT ='itemSelect';
	

    /*
     * Initialize
     */
    constructor(prt, data){

        super();
       
        this.prt = prt;
        this.data = data;

        this.itemsAR = [];
        this.cameraPositionsAr = this.data.cameraPositionsAr;
        this.markerId = 0;
        this.vy = 0;
		this.vy2 = 0;
		this.friction = .9;
        this.resetId = true;
        this.itemsShowed = true;

        this.controllerOffsetY = this.data.controllerOffsetY;
        this.buttonsToolTipOffsetY = this.data.buttonsToolTipOffsetY;
        this.buttonToolTipBackgroundColor = this.data.buttonToolTipBackgroundColor;
        this.buttonToolTipTextColor = this.data.buttonToolTipTextColor;

        this.cameraPostitionSelectMenuButtonSize = this.data.cameraPostitionSelectMenuButtonSize;
        this.cameraPostionsSelectMenuDefaultText = this.data.cameraPostionsSelectMenuDefaultText;
        this.cameraPostitionSelectMenuMaxWidth = this.data.cameraPostitionSelectMenuMaxWidth;
        this.cameraPostitionSelectMenuHeight = this.data.cameraPostitionSelectMenuHeight;
        this.cameraPostitionSelectMenuStartAndEndGap  = this.data.cameraPostitionSelectMenuStartAndEndGap;
        this.cameraPostionsSelectMenuBackgroundColor = this.data.cameraPostionsSelectMenuBackgroundColor;
        this.cameraPostionsSelectMenuTextColor = this.data.cameraPostionsSelectMenuTextColor;
        this.cameraPositionsNextButtonTooltip = this.data.cameraPositionsNextButtonTooltip;
        this.cameraPositionsPrevButtonTooltip = this.data.cameraPositionsPrevButtonTooltip;

        this.cameraPositionsSelectItemBackgroundColor = this.data.cameraPositionsSelectItemBackgroundColor;
        this.cameraPositionsSelectItemStartLeftGap = this.data.cameraPositionsSelectItemStartLeftGap
        this.cameraPositionsSelectItemStartRightGap = this.data.cameraPositionsSelectItemStartRightGap;

        if(FWDEMVUtils.isMobile){
            this.cameraPositionsSelectItemStartRightGap = this.cameraPositionsSelectItemStartLeftGap + 6;
        }

        this.cameraPositionsSelectItemsMaxWidth = this.data.cameraPositionsSelectItemsMaxWidth;
        this.cameraPositionsSelectItemVerticalGap = this.data.cameraPositionsSelectItemVerticalGap;
        this.cameraPositionsSelectMaxItems = this.data.cameraPositionsSelectMaxItems;
        this.cameraPositionsSelectItemsScrollBarTrackColor = this.data.cameraPositionsSelectItemsScrollBarTrackColor;
        this.cameraPositionsSelectItemsScrollBarHandlerNormalColor = this.data.cameraPositionsSelectItemsScrollBarHandlerNormalColor;
        this.cameraPositionsSelectItemsScrollBarHandlerSelectedColor = this.data.cameraPositionsSelectItemsScrollBarHandlerSelectedColor;

        this.cameraPostionsSelectMenuButtonNormalColor = this.data.cameraPostionsSelectMenuButtonNormalColor;
        this.cameraPostionsSelectMenuButtonSelectedColor = this.data.cameraPostionsSelectMenuButtonSelectedColor;
        this.cameraPositionsSelectItemNormalColor = this.data.cameraPositionsSelectItemNormalColor;
        this.cameraPositionsSelectItemSelectedColor = this.data.cameraPositionsSelectItemSelectedColor;

        this.totalItems = this.cameraPositionsAr.length;
        this.totalVisibleItems = this.cameraPositionsSelectMaxItems;
        this.itemHeight = this.data.cameraPositionsSelectItemHeight;
        this.sapaceBetweenItems = this.data.cameraPositionsSelectSpaceBetweenItems;
        this.spaceBetweenItemsAndMenu = 16;
        this.itemsFinalY = 0;
        this.lastItemsY = 0;
        this.id = 0;

        this.scrollBarHandlerColor = data.infoWindowScrollBarColor;
		this.scrollBarTrackColor = data.infoWindowScrollBarColor;

        this.allowToScroll = true;
        this.showFirstTime = true;

        this.positionType = 'normal';
        this.scrollBarBorderRadius = 15;
        this.style.zIndex = 999;

        this.screen.className = 'fwdemv-camera-positions-select-menu';
        this.style.overflow = 'visible';

        this.setupMainDO();
        this.setupDisableDO();
        this.setupButtons();
        this.setupSelectMenuText();
        this.setupItems();

        setTimeout(() =>{
            if(this.destroyed) return;
            this.hideItems();
        }, 300);
        

        if(this.totalItems > this.totalVisibleItems){
            if(FWDEMVUtils.isMobile){
                this.setupMobileScrollBar();
            }else{
                this.addMouseWheelSupport();
            }

            this.setupScrollBar();
        }

        this.height = this.cameraPostitionSelectMenuHeight;
        this.mainDO.height = this.cameraPostitionSelectMenuHeight;

        this.hide();

        setTimeout(() =>{
            if(this.destroyed) return;
            this.hide()
        }, 50);    
    }


    /**
     * Resize and postion.
     */
    positionAndResize(){

        // Resize menu.
        this.width = Math.min(this.cameraPostitionSelectMenuMaxWidth, this.prt.width);
        this.height = this.cameraPostitionSelectMenuHeight;

        this.x = Math.round(this.prt.width - this.width - this.controllerOffsetY);
        this.y = this.prt.height - this.height - this.controllerOffsetY;
        
        this.mainDO.width = this.width;
        this.mainDO.height = this.height;

        this.prevButtonDO.x = this.cameraPostitionSelectMenuStartAndEndGap;
        this.prevButtonDO.y = Math.round((this.mainDO.height -  this.prevButtonDO.height)/2);

        this.nextButtonDO.x = this.mainDO.width - this.nextButtonDO.width - this.cameraPostitionSelectMenuStartAndEndGap;
        this.nextButtonDO.y = Math.round((this.mainDO.height -  this.nextButtonDO.height)/2);

        this.selectMenuTextDO.x = this.cameraPostitionSelectMenuButtonSize + this.cameraPostitionSelectMenuStartAndEndGap + 5;
        this.selectMenuTextDO.y = Math.round((this.mainDO.height - this.selectMenuTextDO.height)/2) - 1;
        this.selectMenuTextDO.width = this.mainDO.width - this.cameraPostitionSelectMenuButtonSize * 2 - this.cameraPostitionSelectMenuStartAndEndGap * 2 - 10;


        // Resize items.
        const mainItemsWidth = Math.min(this.cameraPositionsSelectItemsMaxWidth, this.prt.width - this.controllerOffsetY * 2);
        this.mainIntemsHolderDO.width = mainItemsWidth;

        if(this.totalItems <= this.cameraPositionsSelectMaxItems){
            this.itemsHolderDO.width = mainItemsWidth - this.cameraPositionsSelectItemStartLeftGap * 2 - 10;
        }else{
            this.itemsHolderDO.width = mainItemsWidth - this.cameraPositionsSelectItemStartLeftGap - this.cameraPositionsSelectItemStartRightGap;
        }

        this.itemsHolderInDO.width = this.itemsHolderDO.width;

        this.mainIntemsHolderDO.x = this.width - this.mainIntemsHolderDO.width;

        this.itemsHolderDO.height = this.curItemsCount * (this.itemHeight + this.sapaceBetweenItems);
        if(this.curItemsCount > 1){
            this.itemsHolderDO.height -= this.sapaceBetweenItems;
        }

        setTimeout(() => {
            if(this.destroyed) return;
            if(this.scrollBarDO){
                this.scrollBarDO.height = this.itemsHolderDO.height;
                this.scrollBarTrackDO.height = this.itemsHolderDO.height;
                this.scrollBarDO.x = mainItemsWidth - this.scrollBarHandlerDO.width - 8;
                this.scrollBarDO.y =  this.itemsHolderDO.y;

                this.itemsHolderHeight = this.itemsHolderInDO.height;
                this.mainItemsHolderHeight = this.itemsHolderDO.height;
                
                if(this.mainItemsHolderHeight > this.itemsHolderHeight){
                    this.scrollBarDO.style.overflow = 'hidden';
                    this.scrollBarHandlerDO.y = 0;
                    this.allowToScroll = false;
                }else{
                    this.scrollBarDO.style.overflow = 'visible';
                    this.scrollBarHandlerDO.y = 0;
                    this.allowToScroll = true;
                }
               
                this.scrollBarHandlerHeight = (this.mainItemsHolderHeight/this.itemsHolderHeight) * this.mainItemsHolderHeight; 
                this.scrollBarHeight = this.mainItemsHolderHeight;
                this.scrollBarHandlerDO.height = this.scrollBarHandlerHeight;
               
            }
        }, 50);
        this.mainIntemsHolderDO.height = this.itemsHolderDO.height + this.cameraPositionsSelectItemVerticalGap * 2;

        if(this.prt.width < 700 ){
            this.positionType = 'minimal';
        }else{
            this.positionType = 'normal';
        }

        if(this.x < this.prt.controllerDO.x + this.prt.controllerDO.width + this.controllerOffsetY && this.positionType == 'normal'){
            this.prt.controllerDO.x = this.x - this.prt.controllerDO.width - this.controllerOffsetY;
        }
    
        if(this.positionType == 'minimal'){
            this.x = 0;
            this.y = 0;
            this.mainDO.y = 0;
            this.selectMenuTextDO.style.visibility = 'hidden';
            this.mainDO.style.backgroundColor = 'rgba(0,0,0,0)';
           
            this.nextButtonDO.updateSize(this.prt.controllerDO.height);
            this.nextButtonDO.x = this.prt.width - this.nextButtonDO.width - 10;
            this.nextButtonDO.y = Math.round((this.prt.height - this.nextButtonDO.height)/2);
            this.nextButtonDO.style.borderRadius = '100%';
            this.nextButtonDO.style.overflow = 'hidden';
            this.nextButtonDO.backgroundNormalColor = this.cameraPostionsSelectMenuBackgroundColor;
            this.nextButtonDO.backgroundSelectedColor = this.cameraPostionsSelectMenuBackgroundColor;
            this.nextButtonDO.setNormalState();

            this.prevButtonDO.updateSize(this.prt.controllerDO.height);
            this.prevButtonDO.x = 10;
            this.prevButtonDO.y = Math.round((this.prt.height - this.nextButtonDO.height)/2);
            this.prevButtonDO.style.borderRadius = '100%';
            this.prevButtonDO.style.overflow = 'hidden';
            this.prevButtonDO.backgroundNormalColor = this.cameraPostionsSelectMenuBackgroundColor;
            this.prevButtonDO.backgroundSelectedColor = this.cameraPostionsSelectMenuBackgroundColor;
            this.prevButtonDO.setNormalState();

            this.hideItems();
        }else{
            this.selectMenuTextDO.style.visibility = 'visible';
            this.mainDO.style.backgroundColor = this.cameraPostionsSelectMenuBackgroundColor;
            
            this.nextButtonDO.updateSize(this.nextButtonDO.buttonWidth);
            this.nextButtonDO.style.borderRadius = '0%';
            this.nextButtonDO.style.overflow = 'visible';
            this.nextButtonDO.backgroundNormalColor = this.nextButtonDO.defaultNormalColor;
            this.nextButtonDO.backgroundSelectedColor = this.nextButtonDO.defaultBackgroundSelectedColor;
            this.nextButtonDO.setNormalState();

            this.prevButtonDO.updateSize(this.nextButtonDO.buttonWidth);
            this.prevButtonDO.style.borderRadius = '0%';
            this.prevButtonDO.style.overflow = 'visible';
            this.prevButtonDO.backgroundNormalColor = this.prevButtonDO.defaultNormalColor;
            this.prevButtonDO.backgroundSelectedColor = this.prevButtonDO.defaultBackgroundSelectedColor;
            this.prevButtonDO.setNormalState();
        }
        
    
    }


    /**
     * Setup main container.
     */
    setupMainDO(){

        this.mainDO = new FWDEMVDisplayObject();
        this.mainDO.screen.className = 'fwdemv-camera-positions-select-menu-holder';
        this.mainDO.style.overflow = 'visible';
        this.mainDO.style.cursor = 'pointer';
        this.mainDO.style.backgroundColor = this.cameraPostionsSelectMenuBackgroundColor;
        this.addChild(this.mainDO);

        this.itemsHolderDumyDO = new FWDEMVDisplayObject();
        this.itemsHolderDumyDO.style.width = '100%';
        this.itemsHolderDumyDO.style.pointerEvents = 'none';
        this.itemsHolderDumyDO.height = this.cameraPostitionSelectMenuHeight + this.spaceBetweenItemsAndMenu + 20;
        this.itemsHolderDumyDO.y = - this.spaceBetweenItemsAndMenu - 20;
    
        this.showItemsHandler = this.showItemsHandler.bind(this);
        this.mainDO.screen.addEventListener('pointerup', this.showItemsHandler);
    }

    showItemsHandler(e){
        this.showItems(true);
    }


    /**
     * Setup disable.
     */
     setupDisableDO(){
        this.disableDO = new FWDEMVDisplayObject();
        this.disableDO.style.width = '100%';
        this.disableDO.style.height = '100%';
    }

    showDisable(){
        if(!this.mainIntemsHolderDO.contains(this.disableDO)){
            this.mainIntemsHolderDO.addChild(this.disableDO);
        }
    }

    hideDisable(){
        if(this.mainIntemsHolderDO.contains(this.disableDO)){
            this.mainIntemsHolderDO.removeChild(this.disableDO);
        }
    }


    /**
     * Setup main container.
     */
    setupSelectMenuText(){
        this.selectMenuTextDO = new FWDEMVDisplayObject();
        this.selectMenuTextDO.screen.className = 'fwdemv-camera-positions-select-menu-text';
        this.selectMenuTextDO.style.overflow = 'hidden';
        this.selectMenuTextDO.style.whiteSpace = 'nowrap';  
        this.selectMenuTextDO.style.textOverflow = 'ellipsis';  
        this.selectMenuTextDO.style.textAlign = 'center';  
        this.selectMenuTextDO.style.color = this.cameraPostionsSelectMenuTextColor;
        this.selectMenuTextDO.innerHTML = this.cameraPostionsSelectMenuDefaultText;
        this.mainDO.addChild(this.selectMenuTextDO);
    }

    updateSelectMenutText(cameraPositionName){
        this.selectMenuTextDO.innerHTML = cameraPositionName;
        this.setCurrentItem(cameraPositionName, true);
    }


    /**
     * Setup buttons.
     */
    setupButtons(){
        this.nextButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-camera-positions-next-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-right',
            undefined,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.cameraPostionsSelectMenuButtonNormalColor,
            this.cameraPostionsSelectMenuButtonSelectedColor,
            false,
            this.cameraPostitionSelectMenuButtonSize,
            this.cameraPostitionSelectMenuButtonSize);

        this.mainDO.addChild(this.nextButtonDO);

        this.onNextButtonPointerUp = this.onNextButtonPointerUp.bind(this);
        this.nextButtonDO.addEventListener(FWDEMVButton.POINTER_UP, this.onNextButtonPointerUp);

        if(this.cameraPositionsNextButtonTooltip){
            this.onNextButtonShowToolTip = this.onNextButtonShowToolTip.bind(this);
            this.nextButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onNextButtonShowToolTip);

            this.onNextButtonHideToolTip = this.onNextButtonHideToolTip.bind(this);
            this.nextButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onNextButtonHideToolTip);

            this.nextTooltipDO = new FWDEMEMVButtonTooltip(
                this.cameraPositionsNextButtonTooltip,
                undefined,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.nextTooltipDO);
        }


        this.prevButtonDO = new FWDEMVButton(
            this,
            'fwdemv-button fwdemv-camera-positions-prev-button',
            'fwdemv-button-icon ' + this.prt.fontIcon + '-left',
            undefined,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
            this.cameraPostionsSelectMenuButtonNormalColor,
            this.cameraPostionsSelectMenuButtonSelectedColor,
            false,
            this.cameraPostitionSelectMenuButtonSize,
            this.cameraPostitionSelectMenuButtonSize);

        this.mainDO.addChild(this.prevButtonDO);

        this.onPrevButtonPointerUp = this.onPrevButtonPointerUp.bind(this);
        this.prevButtonDO.addEventListener(FWDEMVButton.POINTER_UP, this.onPrevButtonPointerUp);

        if(this.cameraPositionsPrevButtonTooltip){
            this.onPrevButtonShowToolTip = this.onPrevButtonShowToolTip.bind(this);
            this.prevButtonDO.addEventListener(FWDEMVButton.POINTER_OVER, this.onPrevButtonShowToolTip);

            this.onPrevButtonHideToolTip = this.onPrevButtonHideToolTip.bind(this);
            this.prevButtonDO.addEventListener(FWDEMVButton.POINTER_OUT, this.onPrevButtonHideToolTip);

            this.prevTooltipDO = new FWDEMEMVButtonTooltip(
                this.cameraPositionsPrevButtonTooltip,
                undefined,
                this.buttonToolTipBackgroundColor,
                this.buttonToolTipTextColor);
            this.mainDO.addChild(this.prevTooltipDO);
        }

    }

    onPrevButtonShowToolTip(e){
        if(this.prevTooltipDO){
            this.showToolTipButton(this.prevButtonDO, this.prevTooltipDO, this.buttonsToolTipOffsetY);
        }
    }

    onPrevButtonHideToolTip(){
        if(this.prevTooltipDO){
           this.prevTooltipDO.hide();
        }
    }

    onNextButtonShowToolTip(e){
        if(this.nextTooltipDO){
            this.showToolTipButton(this.nextButtonDO, this.nextTooltipDO, this.buttonsToolTipOffsetY);
        }
    }

    onNextButtonHideToolTip(){
        if(this.nextTooltipDO){
           this.nextTooltipDO.hide();
        }
    }

    onNextButtonPointerUp(e){
        if(this.resetId){
            this.resetId = false;
            this.id = -1;
        }
        
        this.id ++;
        if(this.id > this.totalItems - 1){
            this.id = 0;
        }
     
        const cameraPositionName = this.itemsAR[this.id]['cameraPositionName']

        this.setCurrentItem(cameraPositionName, true);
        this.dispatchEvent(FWDEMVCameraPositionsSelectMenu.ITEM_SELECT, {e:e, 'cameraPositionName': cameraPositionName});
    }

    onPrevButtonPointerUp(e){
        if(this.resetId){
            this.resetId = false;
            this.id = -1;
        }

        this.id --;
        if(this.id < 0){
            this.id = this.totalItems - 1;
        }
     
        const cameraPositionName = this.itemsAR[this.id]['cameraPositionName']

        this.setCurrentItem(cameraPositionName, true);
        this.dispatchEvent(FWDEMVCameraPositionsSelectMenu.ITEM_SELECT, {e:e, 'cameraPositionName': cameraPositionName});
    }


    /**
     * Setup items.
     */
    setupItems(){

        this.curItemsCount = Math.min(this.cameraPositionsSelectMaxItems, this.cameraPositionsAr.length);

        this.mainIntemsHolderDO = new FWDEMVDisplayObject();
        this.mainIntemsHolderDO.screen.className = 'fwdemv-main-items-holder';
        this.mainIntemsHolderDO.style.backgroundColor = this.cameraPositionsSelectItemBackgroundColor;
        this.mainIntemsHolderDO.style.pointerEvents = 'none';
        this.mainIntemsHolderDO.opacity = 0;

        this.itemsHolderDO = new FWDEMVDisplayObject();
        this.itemsHolderDO.screen.className = 'fwdemv-items-holder';
        this.itemsHolderDO.x = this.cameraPositionsSelectItemStartLeftGap;
        this.itemsHolderDO.y = this.cameraPositionsSelectItemVerticalGap;
        this.mainIntemsHolderDO.addChild(this.itemsHolderDO);
        this.mainDO.addChildAt(this.mainIntemsHolderDO, 0);

        this.itemsHolderInDO = new FWDEMVDisplayObject();
        this.itemsHolderInDO.screen.className = 'fwdemv-items-holder-in';
        this.itemsHolderDO.addChild(this.itemsHolderInDO)

        this.cameraPositionsAr.forEach((item, index) =>{
            const itemDO = new FWDEMVCameraPositionsItem(
                item['cameraPositionName'],
                index,
                this.prt.fontIcon,
                this.itemHeight,
                this.cameraPositionsSelectItemNormalColor,
                this.cameraPositionsSelectItemSelectedColor);
                itemDO.y = index * (this.itemHeight + this.sapaceBetweenItems);
            this.itemsHolderInDO.addChild(itemDO);
            this.itemsAR.push(itemDO);
                
            this.itemsHolderInDO.height = itemDO.y + itemDO.height;
            
            this.onItemPointerUp = this.onItemPointerUp.bind(this);
            itemDO.addEventListener(FWDEMVCameraPositionsItem.POINTER_UP, this.onItemPointerUp);
        });
    }

   

    onItemPointerUp(e){
        this.dispatchEvent(FWDEMVCameraPositionsSelectMenu.ITEM_SELECT, {e:e, 'cameraPositionName': e.cameraPositionName});
    }

  
    /**
     * Setup scrollbar.
     */
    setupScrollBar(){
        this.scrollBarDO = new FWDEMVDisplayObject();
        this.scrollBarDO.screen.className = 'fwdemv-camera-positions-scrollbar';
        this.scrollBarDO.style.overflow = "visible";
     
        this.scrollBarTrackDO = new FWDEMVDisplayObject();
        this.scrollBarTrackDO.screen.className = 'fwdemv-camera-positions-scrollbar-track';
        this.scrollBarTrackDO.width = 6;
        this.scrollBarTrackDO.style.backgroundColor = this.cameraPositionsSelectItemsScrollBarTrackColor;
        this.scrollBarTrackDO.opacity = 0;
        this.scrollBarTrackDO.style.borderRadius = this.scrollBarBorderRadius + "px";
        this.scrollBarDO.addChild(this.scrollBarTrackDO);
        
        this.scrollBarHandlerDO = new FWDEMVDisplayObject();
        this.scrollBarHandlerDO.screen.className = 'fwdemv-camera-positions-scrollbar-handler';
        this.scrollBarHandlerDO.style.cursor = 'pointer';
        this.scrollBarHandlerDO.width = 6;
        this.scrollBarHandlerDO.y = 0;
        this.scrollBarHandlerDO.style.borderRadius = this.scrollBarBorderRadius + "px";
        this.scrollBarHandlerDO.style.backgroundColor = this.cameraPositionsSelectItemsScrollBarHandlerNormalColor;
        this.scrollBarDO.addChild(this.scrollBarHandlerDO);

        if(FWDEMVUtils.isMobile){
            this.scrollBarHandlerDO.width = 2;
            this.scrollBarHandlerDO.opacity = 0;
        }
        
        this.mainIntemsHolderDO.addChild(this.scrollBarDO);

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
    }

    scrollBarHandlerOnPointerOver(){
        FWDAnimation.to(this.scrollBarHandlerDO.screen, .8, {backgroundColor: this.cameraPositionsSelectItemsScrollBarHandlerSelectedColor, ease:Quint.easeOut});
        FWDAnimation.to(this.scrollBarTrackDO, .2, {opacity:.2});
        
    };
    
    scrollBarHandlerOnPointerOut(){
        if(this.isDragging) return;
        FWDAnimation.to(this.scrollBarHandlerDO.screen, .8, {backgroundColor: this.cameraPositionsSelectItemsScrollBarHandlerNormalColor, ease:Quint.easeOut});
        FWDAnimation.to(this.scrollBarTrackDO, .3, {opacity:0});
        
    };
    
    scrollBarHandlerOnPointerDown(e){
        if(!this.allowToScroll) return;
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);		
        this.isDragging = true;
        this.yPositionOnPress = this.scrollBarHandlerDO.y;
        this.lastPresedY = vc.y;
        this.controlsCliks = 0;
      
        FWDAnimation.killTweensOf(this.scrollBarHandlerDO);

        window.addEventListener("pointermove", this.scrollBarHandlerPointerMoveHandler);
        window.addEventListener("pointerup", this.scrollBarHandlerPointerEndHandler);	
    };

    scrollBarHandlerPointerMoveHandler(e){
        if(e.preventDefault) e.preventDefault();
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
       
        this.scrollBarHandlerFinalY = Math.round(this.yPositionOnPress + vc.y - this.lastPresedY);
     
        if(this.scrollBarHandlerFinalY >= this.scrollBarDO.height - this.scrollBarHandlerDO.height){
            this.scrollBarHandlerFinalY = this.scrollBarDO.height - this.scrollBarHandlerDO.height;
        }
        
        if(this.scrollBarHandlerFinalY <= 0) this.scrollBarHandlerFinalY = 0;
       
        this.scrollBarHandlerDO.y = this.scrollBarHandlerFinalY;

        this.controlsCliks += 1;
        if(this.controlsCliks > 2){
            this.showDisable();
        }
        
        this.updateScrollBarHandlerAndContent(true, true);
    };

    scrollBarHandlerPointerEndHandler(e){
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        this.isDragging = false;
        
        if(!FWDEMVUtils.hitTest(this.scrollBarHandlerDO.screen, vc.x, vc.y)){
            this.scrollBarHandlerOnPointerOut();
        }

        setTimeout(() => {
            if(this.destroyed) return;
            this.hideDisable();
        }, 1)
       
       
        window.removeEventListener("pointermove", this.scrollBarHandlerPointerMoveHandler);
        window.removeEventListener("pointerup", this.scrollBarHandlerPointerEndHandler);	
    };


    /**
     * Update the scrollbar and content.
     */
    addMouseWheelSupport(){

        this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
        this.mainIntemsHolderDO.screen.addEventListener ("mousewheel", this.mouseWheelHandler);
        this.mainIntemsHolderDO.addEventListener('DOMMouseScroll', this.mouseWheelHandler);
    };
    
    mouseWheelHandler(e){
   
        if(this.isDragging) return;
        
        e.preventDefault();
        e.stopImmediatePropagation();
        
        var dir = e.detail || e.wheelDelta;	
        if(e.wheelDelta) dir *= -1;
        if(FWDEMVUtils.isOpera) dir *= -1;
      
        if(dir > 0){
            this.itemsFinalY -= (this.itemHeight + this.sapaceBetweenItems);
        }else{
            this.itemsFinalY += (this.itemHeight + this.sapaceBetweenItems);
        }

        let tempId = Math.round(this.itemsFinalY/(this.itemHeight + this.sapaceBetweenItems));
    
        if(tempId >= 0){
            tempId = 0;
        }else if(Math.abs(tempId) + this.totalVisibleItems >= this.totalItems){
            tempId = (this.totalItems - this.totalVisibleItems) * -1;
        }
        this.prevItemsY = -100;
        this.itemsFinalY = tempId * (this.itemHeight + this.sapaceBetweenItems);

        this.scrollBarHandlerFinalY = (this.scrollBarDO.height -this.scrollBarHandlerDO.height) * (tempId/ (this.totalItems - this.totalVisibleItems)) * -1

        if(this.scrollBarHandlerFinalY < 0){
            this.scrollBarHandlerFinalY = 0;
        }else if(this.scrollBarHandlerFinalY >= this.scrollBarDO.height - this.scrollBarHandlerDO.height){
            this.scrollBarHandlerFinalY = this.scrollBarDO.height - this.scrollBarHandlerDO.height;
        }

        FWDAnimation.killTweensOf(this.scrollBarHandlerDO);
        FWDAnimation.to(this.scrollBarHandlerDO, .5, {y:this.scrollBarHandlerFinalY, ease:Quart.easeOut});

        FWDAnimation.killTweensOf(this.itemsHolderDO);
        FWDAnimation.to(this.itemsHolderInDO, .5, {y: this.itemsFinalY, ease:Quart.easeOut});
       
        if(e.preventDefault){
            e.preventDefault();
        }else{
            return false;
        }	
        return;
    };


    /**
     * Update the scrollbar and content.
     */
    updateScrollBarHandlerAndContent(animate, overwrite){
      
        if(!overwrite) return;

        clearTimeout(this.disableOnMoveIdTO);
        cancelAnimationFrame(this.updateMoveMobileScrollBarRAFId);

        let percentScrolled = 0;
	    
        if(this.isDragging && !FWDEMVUtils.isMobile){
            percentScrolled = (this.scrollBarHandlerDO.y/(this.scrollBarDO.height - this.scrollBarHandlerDO.height));
            if(percentScrolled == "Infinity"){
                percentScrolled = 0;
            }else if(percentScrolled >= 1){
                percentScrolled = 1;
            }
            this.itemsFinalY = Math.round(percentScrolled * (this.totalItems - this.totalVisibleItems)) * (this.itemHeight + this.sapaceBetweenItems) * - 1;
        }else{
            
            let tempId = parseInt(this.id/this.totalVisibleItems) * this.totalVisibleItems;

            if(tempId + this.totalVisibleItems >= this.totalItems){
                tempId = this.totalItems - this.totalVisibleItems;
            }

            if(this.totalItems <= this.totalVisibleItems){
                tempId = 0;
            }

            this.itemsFinalY = parseInt(tempId * (this.itemHeight + this.sapaceBetweenItems) * -1);
            if(isNaN(this.itemsFinalY)) this.itemsFinalY = 0;
            
            if(this.scrollBarDO){
                this.scrollBarHandlerFinalY = (this.scrollBarDO.height -this.scrollBarHandlerDO.height) * (tempId/ (this.totalItems - this.totalVisibleItems));
            
                if(this.scrollBarHandlerFinalY < 0){
                this.scrollBarHandlerFinalY = 0;
                }else if(this.scrollBarHandlerFinalY >= this.scrollBarDO.height - this.scrollBarHandlerDO.height){
                    this.scrollBarHandlerFinalY = this.scrollBarDO.height - this.scrollBarHandlerDO.height;
                }
                
                FWDAnimation.killTweensOf(this.scrollBarHandlerDO);
                if(animate){
                    FWDAnimation.to(this.scrollBarHandlerDO, .5, {y:this.scrollBarHandlerFinalY, ease:Quart.easeOut});
                }else{
                    this.scrollBarHandlerDO.y = this.scrollBarHandlerFinalY;
                }
              
            }
        }

        if(this.prevItemsY == this.itemsFinalY && !overwrite) return;
        this.prevItemsY = this.itemsFinalY;

        if(isNaN(this.itemsFinalY))  return;

        FWDAnimation.killTweensOf(this.itemsHolderDO);
        if(animate){
            FWDAnimation.to(this.itemsHolderInDO, .5, {y: this.itemsFinalY, ease:Quart.easeOut});
        }else{
            this.itemsHolderInDO.setY(this.itemsFinalY);
        }      
       
    }   


    /**
     * Setup mobile scrollbar.
     */
    setupMobileScrollBar(){
      
        this.scrollBarPointerUpHandler = this.scrollBarPointerUpHandler.bind(this);
        this.scrollBarPointerMoveHandler = this.scrollBarPointerMoveHandler.bind(this);
        this.scrollBarPointDownHandler = this.scrollBarPointDownHandler.bind(this);

        this.mainIntemsHolderDO.screen.addEventListener("pointerdown", this.scrollBarPointDownHandler);
    }

    scrollBarPointDownHandler(e){
        FWDAnimation.killTweensOf(this.mainIntemsHolderDO);
        var vc = FWDEMVUtils.getViewportMouseCoordinates(e);		
        this.isDragging = true;
      
        this.lastPresedY = vc.y;
        this.checkLastPresedY = vc.y;
        this.controlsCliks = 0;
        
      
        window.addEventListener("pointerup", this.scrollBarPointerUpHandler);
        window.addEventListener("pointermove", this.scrollBarPointerMoveHandler);
        window.addEventListener("touchmove", this.scrollBarTouchMoveHandler, {passive: false});
        
        clearTimeout(this.disableOnMoveIdTO);
        cancelAnimationFrame(this.updateMoveMobileScrollBarRAFId);
        this.updateMobileScrollBar();
    };

    scrollBarTouchMoveHandler(e){
        e.preventDefault();
    }
    
    scrollBarPointerMoveHandler(e){
        if(e.preventDefault) e.preventDefault();
        
        this.controlsCliks += 1;
        if(this.controlsCliks > 2){
            this.showDisable();
            this.scrollBarHandlerDO.opacity = 1;
        }
       
        let vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        let toAdd = vc.y - this.lastPresedY;
        
        this.itemsFinalY += toAdd;
        this.itemsFinalY = Math.round(this.itemsFinalY);
        this.itemsHolderInDO.y = this.itemsFinalY;

        this.lastPresedY = vc.y;
        this.vy = toAdd * 2;
    };
    
    scrollBarPointerUpHandler(e){
        this.isDragging = false;
       
        if(Math.abs(this.vy) <= 2){
            this.vy = 0;
        };
        
        clearTimeout(this.disableOnMoveIdTO);
        this.disableOnMoveIdTO = setTimeout(() => {
            if(this.destroyed) return;
            this.hideDisable();
        }, 50);

        clearTimeout(this.cancelMoblileScrollbarTO);
        this.cancelMoblileScrollbarTO = setTimeout(() => {
            if(this.destroyed) return;

            cancelAnimationFrame(this.updateMoveMobileScrollBarRAFId);
            FWDAnimation.to(this.scrollBarHandlerDO, .8, {opacity: 0, ease:Quint.easeOut});
        }, 2000);
       
        window.removeEventListener("pointerup", this.scrollBarPointerUpHandler);
        window.removeEventListener("pointermove", this.scrollBarPointerMoveHandler);
    };

    
    updateMobileScrollBar(){
     
        if(!this.isDragging && !FWDAnimation.isTweening(this.mainIntemsHolderDO)){
            
            this.vy *= this.friction;
            this.itemsFinalY += this.vy;	
        
            if(this.itemsFinalY > 0){
                this.vy2 = (0 - this.itemsFinalY) * .3;
                this.vy *= this.friction;
                this.itemsFinalY += this.vy2;
            }else if(this.itemsFinalY < this.itemsHolderDO.height - this.itemsHolderInDO.height){
                this.vy2 = (this.itemsHolderDO.height - this.itemsHolderInDO.height - this.itemsFinalY) * .3;
                this.vy *= this.friction;
                this.itemsFinalY += this.vy2;
            }
              
            this.itemsHolderInDO.y = Math.round(this.itemsFinalY);  
        }
   
        if(!FWDAnimation.isTweening(this.mainIntemsHolderDO)){
            let percentScrolled = (this.itemsHolderInDO.y/(this.itemsHolderDO.height - this.itemsHolderInDO.height));
            this.scrollBarHandlerFinalY = (this.scrollBarDO.height -this.scrollBarHandlerDO.height) * percentScrolled;
    
            FWDAnimation.killTweensOf(this.scrollBarHandlerDO);
            this.scrollBarHandlerDO.y = this.scrollBarHandlerFinalY;
        }
        
        this.updateMoveMobileScrollBarRAFId = requestAnimationFrame(this.updateMobileScrollBar.bind(this));
    };


    /**
     * Set item based on the marker camera postion name.
     */
    setCurrentItem(cameraPositionName, animate){
        if(!cameraPositionName) return;

        if(cameraPositionName == this.cameraPostionsSelectMenuDefaultText){
            this.resetId = true;
        }

        this.itemsAR.forEach((item, index) =>{
            if(item.cameraPositionName == cameraPositionName){
                item.disable();
                this.resetId = false;
                this.id = index;
            }else{
                item.enable();
            }
        });

        this.cameraPositionName = cameraPositionName;

        this.updateScrollBarHandlerAndContent(animate, true);
    }


    /**
     * Hide/show items.
     */
    showItems(animate){
        if(this.itemsShowed) return;
        this.itemsShowed = true;
        
        FWDAnimation.killTweensOf(this.mainIntemsHolderDO);

        if(this.showFirstTime){
            this.hideItems();
            this.showFirstTime = false;
        }
       
        if(animate){ 
            if(this.positionType == 'normal'){
                FWDAnimation.to(this.mainIntemsHolderDO, .8, {
                    y: - (this.mainIntemsHolderDO.height + this.spaceBetweenItemsAndMenu),
                    opacity: 1,
                    onComplete: () =>{
                        this.mainIntemsHolderDO.style.pointerEvents = 'auto';
                    },
                    ease:Expo.easeInOut
                });
            }
        }else{
            if(this.positionType == 'normal'){
                this.mainIntemsHolderDO.style.pointerEvents = 'auto';
                this.mainIntemsHolderDO.opacity = 1;
                this.mainIntemsHolderDO.y = - (this.mainIntemsHolderDO.height + this.spaceBetweenItemsAndMenu);
            }
        }

        this.mainIntemsHolderDO.style.pointerEvents = 'auto';

        this.mainDO.addChild(this.itemsHolderDumyDO);

        this.setCurrentItem(this.cameraPositionName, false);
        this.addHideEvents();
    }

    hideItems(animate, overwrite){
        if(!this.itemsShowed && !overwrite) return;
        this.itemsShowed = false;
       
        FWDAnimation.killTweensOf(this.mainIntemsHolderDO);
        if(animate){
          
            FWDAnimation.to(this.mainIntemsHolderDO, .8, {
                y: - (this.mainIntemsHolderDO.height - this.spaceBetweenItemsAndMenu),
                opacity: 0,
                onComplete: () =>{
                    
                },
                ease:Expo.easeInOut
            });
            
        }else{
           
            this.mainIntemsHolderDO.style.pointerEvents = 'none';
            this.mainIntemsHolderDO.opacity = 0;
            this.mainIntemsHolderDO.y = - (this.mainIntemsHolderDO.height - this.spaceBetweenItemsAndMenu);
            
        }
        this.removeHitTestEvents();

        this.mainIntemsHolderDO.style.pointerEvents = 'none';

        if(this.mainDO.contains(this.itemsHolderDumyDO)){
            this.mainDO.removeChild(this.itemsHolderDumyDO);
        }
    }

    addHideEvents(){    
        this.onHideTest = this.onHideTest.bind(this);
        window.addEventListener("pointerdown", this.onHideTest);
    }
    
    onHideTest(e){
        const vc = FWDEMVUtils.getViewportMouseCoordinates(e);	
        this.globalX = vc.x;
        this.globalY = vc.y;

        this.hideWithDelay();
    }

    hideWithDelay(){
        if(!FWDEMVUtils.hitTest(this.mainDO.screen, this.globalX, this.globalY)
            && !FWDEMVUtils.hitTest(this.itemsHolderDumyDO.screen, this.globalX, this.globalY)
            && !FWDEMVUtils.hitTest(this.mainIntemsHolderDO.screen, this.globalX, this.globalY)
        ){
            this.hideItems(true);
        }
    }

    removeHitTestEvents(){
        window.removeEventListener("pointerdown", this.onHideTest);
    }


    /**
     * Show button tooltip.
     */
    showToolTipButton(button, toolTipDO, offsetY){
        if(button.isSelected){
           
            let finalX;
            let finalY;
            let globalX = this.mainDO.rect.x;
            let pointerOffsetX = 0;
          
            toolTipDO.show();
           
            setTimeout(() =>{
                if(this.destroyed || !toolTipDO.isShowed) return

                finalX = Math.round(button.x + (button.width - toolTipDO.totalWidth)/2) - 1;
                finalY = - toolTipDO.totalHeight - offsetY;
               
                if(globalX + finalX < 0){
                    pointerOffsetX = globalX + finalX;
                    finalX = finalX + Math.abs((globalX + finalX));
                }else if(globalX + finalX + toolTipDO.totalWidth > this.prt.width){
                    pointerOffsetX = -(globalX + finalX + toolTipDO.totalWidth/2 - this.prt.width + 9);
                    finalX = finalX - (globalX + finalX + toolTipDO.totalWidth - this.prt.width) 
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

        this.hideItems(animate, true);
 
        if(animate){
            if(this.positionType == 'normal'){
                FWDAnimation.to(this.mainDO, .8, {
                    y: this.mainDO.height + this.controllerOffsetY,
                    onComplete: () =>{
                        this.mainDO.style.visibility = 'hidden';
                    },
                    ease:Expo.easeInOut
                });
            }else{
                FWDAnimation.to(this.prevButtonDO, .8, {
                    x: -  this.prevButtonDO.width,
                    ease:Expo.easeInOut
                });

                FWDAnimation.to(this.nextButtonDO, .8, {
                    x: this.prt.width + this.nextButtonDO.width,
                    ease:Expo.easeInOut
                });
            }
        }else{
            if(this.positionType == 'normal'){
                FWDAnimation.killTweensOf(this.mainDO);
                this.mainDO.style.visibility = 'hidden';
                this.mainDO.y = this.mainDO.height + this.controllerOffsetY;
            }else{
                FWDAnimation.killTweensOf(this.prevButtonDO);
                FWDAnimation.killTweensOf(this.nextButtonDO);
                this.prevButtonDO.x = -  this.prevButtonDO.width;
                this.nextButtonDO.x = this.prt.width + this.prevButtonDO.width;
            }
        }
    };
    
    show(animate){
        
        this.mainDO.style.visibility = 'visible';

        if(animate){
            if(this.positionType == 'normal'){
                this.positionAndResize();
                FWDAnimation.to(this.mainDO, .8, {
                    y: 0,
                    ease:Expo.easeInOut
                });
            }else{
                FWDAnimation.to(this.prevButtonDO, .8, {
                    x: 10,
                    ease:Expo.easeInOut
                });

                FWDAnimation.to(this.nextButtonDO, .8, {
                    x: this.prt.width - this.nextButtonDO.width - 10,
                    ease:Expo.easeInOut
                });
            }
        }else{
            if(this.positionType == 'normal'){
                this.positionAndResize();
                FWDAnimation.killTweensOf(this.mainDO);
                this.mainDO.y = 0;
            }else{
                FWDAnimation.killTweensOf(this.prevButtonDO);
                FWDAnimation.killTweensOf(this.nextButtonDO);
                this.nextButtonDO.x = this.prt.width - this.nextButtonDO.width - 10;
                this.prevButtonDO.x =  10;
            }
        }
    };


    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;

        if(this.scrollBarHandlerPointerMoveHandler){
            window.removeEventListener("pointermove", this.scrollBarHandlerPointerMoveHandler);
            window.removeEventListener("pointerup", this.scrollBarHandlerPointerEndHandler);	
        }

        if(this.scrollBarPointerUpHandler){
            window.removeEventListener("pointerup", this.scrollBarPointerUpHandler);
            window.removeEventListener("pointermove", this.scrollBarPointerMoveHandler);
            window.removeEventListener("touchmove", this.scrollBarTouchMoveHandler);
        }
    }
}
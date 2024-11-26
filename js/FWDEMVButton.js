/**
 * Easy 3D Model Viewer v:1.0
 * Button.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVButton extends FWDEMVDisplayObject{

    static POINTER_OVER = 'pointerOver';
    static POINTER_OUT = 'pointerOut';
    static POINTER_DOWN = 'pointerDown';
    static POINTER_UP = 'pointerUp';

    /*
     * Initialize
     */
    constructor(
        prt, 
        mainClass,
        icon1,
        icon2,
        backgroundNormalColor,
        backgroundSelectedColor,
        iconNormalColor,
        iconSelectedColor,
        setupDumy,
        buttonWidth,
        buttonheight,
        showSecondIconOnHover
    ){

        super();

        this.prt = prt;
        this.icon1 = icon1;
        this.icon2 = icon2;
        this.defaultNormalColor = backgroundNormalColor;
        this.backgroundNormalColor = backgroundNormalColor;
        this.defaultBackgroundSelectedColor = backgroundSelectedColor;
        this.backgroundSelectedColor = backgroundSelectedColor;
        this.iconNormalColor = iconNormalColor;
        this.iconSelectedColor = iconSelectedColor;
        this._state = 0;
        this.isMobile = FWDEMVUtils.isMobile;
        this.showSecondIconOnHover = showSecondIconOnHover;
        this.buttonWidth = buttonWidth;
        this.width = buttonWidth;
        this.height = buttonheight;

        this.screen.className = mainClass;
        this.style.overflow = 'visible';
        this.btn1 = new FWDEMVDisplayObject();
       
        // Setup stuff.
        this.setupButtons();
        this.addEvents();
        this.setNormalState();

        this.enable();
        this._state = 0;
       
        if(setupDumy != undefined){
            this.setupDumy();
        }
    }


    /**
     * Setup buttons.
     */
    setupButtons(){

        // Buttons holder.
        this.buttonsHolderDO =  new FWDEMVDisplayObject();
        this.buttonsHolderDO.style.width = '100%';
        this.buttonsHolderDO.style.height = '100%';
        this.buttonsHolderDO.screen.className = 'fwdpap-button-holder';
        this.addChild(this.buttonsHolderDO);


        // First button.
        this.btn1DO = new FWDEMVDisplayObject();
        this.btn1DO.screen.className = 'fwdpap-first-button';
        this.btn1DO.style.width = '100%';
        this.btn1DO.style.height = '100%';
        this.btn1DO.style.pointerEvents = "none";
        this.btn1DO.innerHTML = '<span class="' + this.icon1 + '"</span>'
        this.buttonsHolderDO.addChild(this.btn1DO);

        this.btn1DOIcon = this.btn1DO.screen.firstChild;
        this.btn1DOIcon.style.position = 'absolute';
       

        // Second button.
        if(this.icon2){
            this.btn2DO = new FWDEMVDisplayObject();
            this.btn2DO.screen.className = 'fwdpap-second-button';
            this.btn2DO.style.width = '100%';
            this.btn2DO.style.height = '100%';
            this.btn2DO.style.pointerEvents = "none";
            this.btn2DO.innerHTML = '<span class="' + this.icon2 + '"</span>'
            this.buttonsHolderDO.addChild(this.btn2DO);
            this.state = 0;

            this.btn2DOIcon = this.btn2DO.screen.firstChild;
            this.btn2DOIcon.style.position = 'absolute';
        }

        this.positionIcon();
    }

    positionIcon(){
        let delay = 300;
        if(this.btn1DOIcon.offsetHeight){
            delay = 0;
        }
        
        setTimeout(() =>{
            if(this.destroyed) return;

            this.btn1DOIcon.style.top = Math.round((this.height - this.btn1DOIcon.offsetHeight)/2) + 'px';
            this.btn1DOIcon.style.left = Math.round((this.width - this.btn1DOIcon.offsetWidth)/2) + 'px';
            
            if(this.icon2){
                this.btn2DOIcon.style.top = Math.round((this.height - this.btn2DOIcon.offsetHeight)/2) + 'px';
                this.btn2DOIcon.style.left = Math.round((this.width - this.btn2DOIcon.offsetWidth)/2) + 'px';
            }
        }, delay);
    }


    /**
     * Set size.
     */
    updateSize(size){
        this.width = size;
        this.height = size;
        this.positionIcon();
    }


    /**
     * Setup dumy,
     */
    setupDumy(){
        this.dummyDO =  new FWDEMVDisplayObject();	
        this.dummyDO.style.width = '100%';
        this.dummyDO.style.pointerEvents = 'none';
        this.addChild(this.dummyDO);

        this.setDumyPositionTO = setTimeout(()=>{
            if(this.destroyed) return;
            this.dummyDO.height = 20 + this.height;
            this.dummyDO.y = -this.dummyDO.height + this.height + 10;
        }, 150);
    }


    /**
     * Add events.
     */
    addEvents(){
       
        this.onPointerOver = this.onPointerOver.bind(this);
        this.screen.addEventListener("pointerover", this.onPointerOver);

        this.onPointerOut = this.onPointerOut.bind(this);
        this.screen.addEventListener("pointerout", this.onPointerOut);

        this.onPointerDown = this.onPointerDown.bind(this);
        this.screen.addEventListener("pointerdown", this.onPointerDown);

        this.onPointerUp = this.onPointerUp.bind(this);
        this.screen.addEventListener("pointerup", this.onPointerUp);
        
    }

    onPointerOver(e){
        if(this.isDisabled || this.destroyed) return;
        this.setSelectedState(true);
        this.dispatchEvent(FWDEMVButton.POINTER_OVER, {e:e});
    }
    
    onPointerOut(e){
        if(this.isDisabled || this.destroyed) return;
        this.setNormalState(true);
        this.dispatchEvent(FWDEMVButton.POINTER_OUT, {e:e});
    }

    onPointerDown(e){
        if(this.destroyed) return;
        if(e.preventDefault) e.preventDefault();
        this.dispatchEvent(FWDEMVButton.POINTER_DOWN , {e:e});
    }

    onPointerUp(e){
        if(this.destroyed) return;
        if(e.preventDefault) e.preventDefault();
        this.dispatchEvent(FWDEMVButton.POINTER_UP , {e:e});
    }


    /**
     * Set buttons states.
     */
    setNormalState(animate){
        if(this.destroyed) return;
        
        this.isSelected = false;
        if(animate){
            FWDAnimation.to(this.btn1DO.screen, .8, {backgroundColor:this.backgroundNormalColor, color:this.iconNormalColor, ease:Quint.easeOut});
            if(this.btn2DO){
                let opacity = 1;
                if(this.showSecondIconOnHover){
                    opacity = 0;
                }
                FWDAnimation.to(this.btn2DO.screen, .8, {backgroundColor:this.backgroundNormalColor, color:this.iconNormalColor, opacity:opacity, ease:Quint.easeOut });
            }
        }else{
            this.btn1DO.style.backgroundColor = this.backgroundNormalColor;
            this.btn1DO.style.color = this.iconNormalColor;

            if(this.btn2DO){
                this.btn2DO.style.backgroundColor = this.backgroundNormalColor;
                this.btn2DO.style.color = this.iconNormalColor;
            }
        }
    }

    setSelectedState(animate){
        if(this.destroyed) return;

        this.isSelected = true;
        if(animate){
            FWDAnimation.to(this.btn1DO.screen, .8, {backgroundColor:this.backgroundSelectedColor, color:this.iconSelectedColor, ease:Quint.easeOut });
            if(this.btn2DO){
                FWDAnimation.to(this.btn2DO.screen, .8, {backgroundColor:this.backgroundSelectedColor, color:this.iconSelectedColor, opacity:1,  ease:Quint.easeOut });
            }
        }else{
            this.btn1DO.style.backgroundColor = this.backgroundSelectedColor;
            this.btn1DO.style.color = this.iconSelectedColor

            if(this.btn2DO){
                this.btn2DO.style.backgroundColor = this.backgroundSelectedColor;
                this.btn2DO.style.color = this.iconSelectedColor;
            }
        }
    }


    /**
     * Set state.
     */
    set state(state){
        
        if(this.showSecondIconOnHover){
            this.btn2DO.opacity = 0;
            return;
        }
        
        this._state = state;
       
        if(this._state == 1){
            this.btn1DO.style.visibility = 'hidden';
            this.btn2DO.style.visibility = 'visible';
        }else{
            this.btn1DO.style.visibility = 'visible';
            this.btn2DO.style.visibility = 'hidden';
        }
    }

    get state(){
        return this._state;
    }


    /**
     * Enable / disable.
     */
    enable(){
        this.style.pointerEvents = 'auto';
        this.style.cursor = 'pointer';
    }

    disable(){
        this.style.pointerEvents = 'none';
        this.style.cursor = 'auto';;
    }


    /**
     * Update colors.
     */
    updateColors(normalColor, selectedColor){
      
        if(normalColor){
            this.iconNormalColor = normalColor;

            if(!this.isSelected){
                this.btn1DO.style.color = this.iconNormalColor

                if(this.btn2DO){
                    this.btn2DO.style.color = this.iconNormalColor;
                }
            }
        }
      
        if(selectedColor){
            this.iconSelectedColor = selectedColor;
            if(this.isSelected){
                this.btn1DO.style.color = this.iconSelectedColor

                if(this.btn2DO){
                    this.btn2DO.style.color = this.iconSelectedColor;
                }
            }
        }
    }


    /**
     *  Destroy.
     */
     destroy(){
        this.destroyed = true;

        FWDAnimation.killTweensOf(this.btn1DO.screen);
      
        if(this.btn2DO){
            FWDAnimation.killTweensOf(this.btn2DO.screen);
        }
    }
}
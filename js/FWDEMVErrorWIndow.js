/**
 * Easy 3D Model Viewer v:1.0
 * Error window.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";

export default class FWDEMVErrorWindow extends FWDEMVDisplayObject{


    /*
     * Initialize
     */
    constructor(prt){

        super();
        if(this.destroyed) return;

        this.isShowedOnce = false;
        this.prt = prt;

        this.screen.className = 'fwdemv-error-window';
        this.style.position = 'relative';
        this.style.display = 'inline-block';
       
        this.textDO =  new FWDEMVDisplayObject();
        this.textDO.style.position = 'relative';
        this.textDO.style.display = 'inline-block';
        this.textDO.style.wordWrap = "break-word";
        this.textDO.screen.className = 'fwdemv-error-window-text';
    }

    /*
     * Show text.
     */
    showText(text){
        if(!this.isShowedOnce){
            window.removeEventListener('click', this.close);
            this.close = this.close.bind(this);
            window.addEventListener('click', this.close);
        }

        this.textDO.innerHTML = '<span class="' + this.prt.fontIcon + '-warning"></span><span class="fwdemv-error-text">' + text + '</span>';
        this.addChild(this.textDO);
        this.prt.mainDO.addChild(this);
    }

    close(){
        window.removeEventListener('click', this.close);
        try{
            this.removeChild(this.textDO);
        }catch(e){}   
    }

    
    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;
        window.removeEventListener('click', this.close);
    }
}
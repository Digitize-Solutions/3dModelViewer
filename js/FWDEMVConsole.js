/**
 * Easy 3D Model Viewer v:1.0
 * Console.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";

export default class FWDEMVConsole{


    /**
     * Initialize
     */
    constructor(){
        this.setupScreen();
    }


   /** 
    * Setup main screen.
    */
    setupScreen(){
        this.mainDO = new FWDEMVDisplayObject();
        this.mainDO.style.overflow = 'auto';
        this.mainDO.width = 300;
        this.mainDO.height = 200;
        this.mainDO.style.background = '#FFFFFF';
        document.documentElement.appendChild(this.mainDO.screen);
    };

    log(text){
        var currentInnerHTML = this.mainDO.innerHTML + "<br>" + text;
        this.mainDO.innerHTML = currentInnerHTML;  
        this.mainDO.screen.scrollTop = 10000;
    };
    
}
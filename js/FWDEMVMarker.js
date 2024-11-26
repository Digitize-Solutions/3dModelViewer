/**
 * Easy 3D Model Viewer v:1.0
 * Marker.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDEMVDisplayObject from "./FWDEMVDisplayObject";
import FWDEMVUtils from "./FWDEMVUtils";

export default class FWDEMVMarker extends FWDEMVDisplayObject{

    static POINTER_OVER = 'pointerOver';
    static POINTER_OUT = 'pointerOut';
    static POINTER_UP = 'pointerClick';

    // Static svg marker icons!
    static playSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white"/><path class="fwdemv-icon" d="M16.5786 11.1935L10.2929 7.12904C9.78214 6.79896 9 7.11928 9 7.93568V16.0626C9 16.7951 9.72679 17.2365 10.2929 16.8693L16.5786 12.8068C17.1393 12.4455 17.1411 11.5548 16.5786 11.1935Z" fill="white"/></svg>';

    static playPointerSvg = '<svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M16.7988 23.002C21.0376 21.1506 24 16.9212 24 12C24 5.37259 18.6274 0 12 0C5.37256 0 0 5.37259 0 12C0 16.9212 2.9624 21.1506 7.20123 23.002L12 31L16.7988 23.002Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M16.1057 22.2135L16.3985 22.0856C20.2862 20.3876 23 16.5096 23 12C23 5.92487 18.0752 1 12 1C5.92485 1 1 5.92487 1 12C1 16.5096 3.71382 20.3876 7.6015 22.0856L7.89433 22.2135L12 29.0563L16.1057 22.2135ZM12 31L7.20123 23.002C2.9624 21.1506 0 16.9212 0 12C0 5.37259 5.37256 0 12 0C18.6274 0 24 5.37259 24 12C24 16.9212 21.0376 21.1506 16.7988 23.002L12 31Z" fill="white"/><path class="fwdemv-icon" d="M16.5786 11.1935L10.2929 7.12904C9.78214 6.79896 9 7.11928 9 7.93568V16.0626C9 16.7951 9.72679 17.2365 10.2929 16.8693L16.5786 12.8068C17.1393 12.4455 17.1411 11.5548 16.5786 11.1935Z" fill="white"/></svg>';

    static linkSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white"/><path class="fwdemv-icon" d="M13.6545 10.3446C15.0548 11.7464 15.0356 13.9938 13.6629 15.3741C13.6604 15.3769 13.6573 15.3799 13.6545 15.3827L12.0795 16.9577C10.6904 18.3469 8.4303 18.3467 7.04137 16.9577C5.65223 15.5688 5.65223 13.3085 7.04137 11.9196L7.91104 11.05C8.14166 10.8193 8.53884 10.9726 8.55074 11.2985C8.56593 11.7139 8.64041 12.1312 8.77785 12.5342C8.8244 12.6706 8.79114 12.8216 8.68919 12.9235L8.38246 13.2302C7.7256 13.8871 7.705 14.9567 8.35539 15.6199C9.0122 16.2898 10.0918 16.2937 10.7536 15.6319L12.3286 14.0571C12.9894 13.3964 12.9866 12.3284 12.3286 11.6705C12.2419 11.5839 12.1545 11.5166 12.0863 11.4696C12.038 11.4365 11.9981 11.3925 11.9698 11.3412C11.9416 11.2899 11.9257 11.2327 11.9234 11.1742C11.9142 10.9265 12.0019 10.6713 12.1976 10.4756L12.6911 9.98214C12.8205 9.85274 13.0235 9.83685 13.1735 9.94157C13.3453 10.0616 13.5063 10.1964 13.6545 10.3446ZM16.9577 7.0413C15.5687 5.65234 13.3087 5.65216 11.9195 7.0413L10.3445 8.6163C10.3417 8.61911 10.3387 8.62216 10.3361 8.62497C8.96345 10.0052 8.94421 12.2526 10.3445 13.6544C10.4927 13.8026 10.6537 13.9375 10.8255 14.0575C10.9755 14.1622 11.1786 14.1463 11.3079 14.0169L11.8014 13.5234C11.9971 13.3277 12.0848 13.0725 12.0756 12.8248C12.0733 12.7663 12.0574 12.7091 12.0292 12.6578C12.0009 12.6065 11.961 12.5625 11.9127 12.5294C11.8445 12.4824 11.7571 12.4151 11.6704 12.3285C11.0124 11.6706 11.0096 10.6026 11.6704 9.9419L13.2454 8.36713C13.9072 7.70528 14.9868 7.70927 15.6436 8.37909C16.294 9.04237 16.2734 10.1119 15.6165 10.7688L15.3098 11.0755C15.2079 11.1775 15.1746 11.3284 15.2211 11.4648C15.3586 11.8678 15.4331 12.2851 15.4483 12.7005C15.4602 13.0264 15.8573 13.1797 16.088 12.9491L16.9576 12.0794C18.3468 10.6905 18.3468 8.4302 16.9577 7.0413Z" fill="white"/></svg>';

    static linkPointerSvg = '<svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path  class="fwdemv-background" d="M16.7988 23.002C21.0376 21.1506 24 16.9212 24 12C24 5.37259 18.6274 0 12 0C5.37256 0 0 5.37259 0 12C0 16.9212 2.9624 21.1506 7.20123 23.002L12 31L16.7988 23.002Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M16.1057 22.2135L16.3985 22.0856C20.2862 20.3876 23 16.5096 23 12C23 5.92487 18.0752 1 12 1C5.92485 1 1 5.92487 1 12C1 16.5096 3.71382 20.3876 7.6015 22.0856L7.89433 22.2135L12 29.0563L16.1057 22.2135ZM12 31L7.20123 23.002C2.9624 21.1506 0 16.9212 0 12C0 5.37259 5.37256 0 12 0C18.6274 0 24 5.37259 24 12C24 16.9212 21.0376 21.1506 16.7988 23.002L12 31Z" fill="white"/><path  class="fwdemv-icon" d="M13.6545 10.3446C15.0548 11.7464 15.0356 13.9938 13.6629 15.3741C13.6604 15.3769 13.6573 15.3799 13.6545 15.3827L12.0795 16.9577C10.6904 18.3469 8.4303 18.3467 7.04137 16.9577C5.65223 15.5688 5.65223 13.3085 7.04137 11.9196L7.91104 11.05C8.14166 10.8193 8.53884 10.9726 8.55074 11.2985C8.56593 11.7139 8.64041 12.1312 8.77785 12.5342C8.8244 12.6706 8.79114 12.8216 8.68919 12.9235L8.38246 13.2302C7.7256 13.8871 7.705 14.9567 8.35539 15.6199C9.0122 16.2898 10.0918 16.2937 10.7536 15.6319L12.3286 14.0571C12.9894 13.3964 12.9866 12.3284 12.3286 11.6705C12.2419 11.5839 12.1545 11.5166 12.0863 11.4696C12.038 11.4365 11.9981 11.3925 11.9698 11.3412C11.9416 11.2899 11.9257 11.2327 11.9234 11.1742C11.9142 10.9265 12.0019 10.6713 12.1976 10.4756L12.6911 9.98214C12.8205 9.85274 13.0235 9.83685 13.1735 9.94157C13.3453 10.0616 13.5063 10.1964 13.6545 10.3446ZM16.9577 7.0413C15.5687 5.65234 13.3087 5.65216 11.9195 7.0413L10.3445 8.6163C10.3417 8.61911 10.3387 8.62216 10.3361 8.62497C8.96345 10.0052 8.94421 12.2526 10.3445 13.6544C10.4927 13.8026 10.6537 13.9375 10.8255 14.0575C10.9755 14.1622 11.1786 14.1463 11.3079 14.0169L11.8014 13.5234C11.9971 13.3277 12.0848 13.0725 12.0756 12.8248C12.0733 12.7663 12.0574 12.7091 12.0292 12.6578C12.0009 12.6065 11.961 12.5625 11.9127 12.5294C11.8445 12.4824 11.7571 12.4151 11.6704 12.3285C11.0124 11.6706 11.0096 10.6026 11.6704 9.9419L13.2454 8.36713C13.9072 7.70528 14.9868 7.70927 15.6436 8.37909C16.294 9.04237 16.2734 10.1119 15.6165 10.7688L15.3098 11.0755C15.2079 11.1775 15.1746 11.3284 15.2211 11.4648C15.3586 11.8678 15.4331 12.2851 15.4483 12.7005C15.4602 13.0264 15.8573 13.1797 16.088 12.9491L16.9576 12.0794C18.3468 10.6905 18.3468 8.4302 16.9577 7.0413Z" fill="white"/></svg>';

    static infoSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white"/><path class="fwdemv-icon" d="M10.4688 14.9429H10.9375V11.5571H10.4688C10.2099 11.5571 10 11.3473 10 11.0884V9.96875C10 9.70986 10.2099 9.5 10.4688 9.5H13.0938C13.3526 9.5 13.5625 9.70986 13.5625 9.96875V14.9429H14.0312C14.2901 14.9429 14.5 15.1527 14.5 15.4116V16.5312C14.5 16.7901 14.2901 17 14.0312 17H10.4688C10.2099 17 10 16.7901 10 16.5312V15.4116C10 15.1527 10.2099 14.9429 10.4688 14.9429ZM12.25 5C11.318 5 10.5625 5.75551 10.5625 6.6875C10.5625 7.61949 11.318 8.375 12.25 8.375C13.182 8.375 13.9375 7.61949 13.9375 6.6875C13.9375 5.75551 13.182 5 12.25 5Z" fill="white"/></svg>';

    static infoPointerSvg = '<svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M16.7988 23.002C21.0376 21.1506 24 16.9212 24 12C24 5.37259 18.6274 0 12 0C5.37256 0 0 5.37259 0 12C0 16.9212 2.9624 21.1506 7.20123 23.002L12 31L16.7988 23.002Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M16.1057 22.2135L16.3985 22.0856C20.2862 20.3876 23 16.5096 23 12C23 5.92487 18.0752 1 12 1C5.92485 1 1 5.92487 1 12C1 16.5096 3.71382 20.3876 7.6015 22.0856L7.89433 22.2135L12 29.0563L16.1057 22.2135ZM12 31L7.20123 23.002C2.9624 21.1506 0 16.9212 0 12C0 5.37259 5.37256 0 12 0C18.6274 0 24 5.37259 24 12C24 16.9212 21.0376 21.1506 16.7988 23.002L12 31Z" fill="white"/><path class="fwdemv-icon" d="M10.4688 15.9429H10.9375V12.5571H10.4688C10.2099 12.5571 10 12.3473 10 12.0884V10.9688C10 10.7099 10.2099 10.5 10.4688 10.5H13.0938C13.3526 10.5 13.5625 10.7099 13.5625 10.9688V15.9429H14.0312C14.2901 15.9429 14.5 16.1527 14.5 16.4116V17.5312C14.5 17.7901 14.2901 18 14.0312 18H10.4688C10.2099 18 10 17.7901 10 17.5312V16.4116C10 16.1527 10.2099 15.9429 10.4688 15.9429ZM12.25 6C11.318 6 10.5625 6.75551 10.5625 7.6875C10.5625 8.61949 11.318 9.375 12.25 9.375C13.182 9.375 13.9375 8.61949 13.9375 7.6875C13.9375 6.75551 13.182 6 12.25 6Z" fill="white"/></svg>';

    static plusSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#ff0000"/><path class="fwdemv-icon" fill-rule="evenodd" clip-rule="evenodd" d="M18 12C18 12.6904 17.4404 13.25 16.75 13.25L7.25 13.25C6.55964 13.25 6 12.6904 6 12C6 11.3096 6.55964 10.75 7.25 10.75L16.75 10.75C17.4404 10.75 18 11.3096 18 12Z" fill="white"/><path class="fwdemv-icon-2" fill-rule="evenodd" clip-rule="evenodd" d="M12 18C11.3096 18 10.75 17.4404 10.75 16.75L10.75 7.25C10.75 6.55964 11.3096 6 12 6C12.6904 6 13.25 6.55964 13.25 7.25L13.25 16.75C13.25 17.4404 12.6904 18 12 18Z" fill="white"/></svg>';

    static plusPointerSvg = '<svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M16.7988 23.002C21.0376 21.1506 24 16.9212 24 12C24 5.37259 18.6274 0 12 0C5.37256 0 0 5.37259 0 12C0 16.9212 2.9624 21.1506 7.20123 23.002L12 31L16.7988 23.002Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M16.1057 22.2135L16.3985 22.0856C20.2862 20.3876 23 16.5096 23 12C23 5.92487 18.0752 1 12 1C5.92485 1 1 5.92487 1 12C1 16.5096 3.71382 20.3876 7.6015 22.0856L7.89433 22.2135L12 29.0563L16.1057 22.2135ZM12 31L7.20123 23.002C2.9624 21.1506 0 16.9212 0 12C0 5.37259 5.37256 0 12 0C18.6274 0 24 5.37259 24 12C24 16.9212 21.0376 21.1506 16.7988 23.002L12 31Z" fill="white"/><path class="fwdemv-icon" fill-rule="evenodd" clip-rule="evenodd" d="M18 12C18 12.6904 17.4404 13.25 16.75 13.25L7.25 13.25C6.55964 13.25 6 12.6904 6 12C6 11.3096 6.55964 10.75 7.25 10.75L16.75 10.75C17.4404 10.75 18 11.3096 18 12Z" fill="white"/><path class="fwdemv-icon-2" fill-rule="evenodd" clip-rule="evenodd" d="M12 18C11.3096 18 10.75 17.4404 10.75 16.75L10.75 7.25C10.75 6.55964 11.3096 6 12 6C12.6904 6 13.25 6.55964 13.25 7.25L13.25 16.75C13.25 17.4404 12.6904 18 12 18Z" fill="white"/></svg>';

    static rewindSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white"/><path class="fwdemv-icon" d="M16.9842 7.84412C16.8526 7.77895 16.7049 7.75363 16.5591 7.77126C16.4133 7.7889 16.2759 7.84872 16.1636 7.94338L12.3556 10.9412V8.91988C12.3669 8.70409 12.3183 8.48937 12.2152 8.2995C12.112 8.10962 11.9583 7.95201 11.7711 7.84412C11.6395 7.77895 11.4917 7.75363 11.346 7.77126C11.2002 7.7889 11.0627 7.84872 10.9505 7.94338L7.03999 11.0222C6.90039 11.143 6.78959 11.2935 6.71571 11.4627C6.64183 11.6319 6.60674 11.8155 6.61302 12C6.60674 12.1845 6.64183 12.3681 6.71571 12.5373C6.78959 12.7065 6.90039 12.857 7.03999 12.9778L10.9497 16.0579C11.0875 16.1707 11.2595 16.2332 11.4376 16.2353C11.5533 16.2345 11.6674 16.2074 11.7711 16.1559C11.9585 16.0479 12.1124 15.8901 12.2155 15.6999C12.3187 15.5098 12.3672 15.2948 12.3556 15.0788V13.0588L16.1628 16.0579C16.3006 16.1707 16.4726 16.2333 16.6507 16.2353C16.7664 16.2345 16.8805 16.2073 16.9842 16.1559C17.1716 16.0478 17.3254 15.89 17.4286 15.6999C17.5317 15.5098 17.5802 15.2948 17.5687 15.0788V8.91988C17.58 8.7041 17.5314 8.4894 17.4282 8.29954C17.3251 8.10968 17.1714 7.95206 16.9842 7.84412Z" fill="white"/><path class="fwdemv-icon-2" d="M6.26464 16.5C6.19444 16.5 6.12711 16.4721 6.07747 16.4225C6.02783 16.3728 5.99994 16.3055 5.99994 16.2353V7.76471C5.99994 7.72994 6.00679 7.69552 6.02009 7.66341C6.03339 7.63129 6.05289 7.60211 6.07747 7.57753C6.10205 7.55295 6.13123 7.53345 6.16335 7.52015C6.19546 7.50685 6.22988 7.5 6.26464 7.5C6.29941 7.5 6.33383 7.50685 6.36594 7.52015C6.39806 7.53345 6.42724 7.55295 6.45182 7.57753C6.4764 7.60211 6.4959 7.63129 6.5092 7.66341C6.5225 7.69552 6.52935 7.72994 6.52935 7.76471V16.2353C6.52935 16.3055 6.50146 16.3728 6.45182 16.4225C6.40218 16.4721 6.33485 16.5 6.26464 16.5Z" fill="white"/></svg>';

    static rewindPointerSvg = '<svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="fwdemv-background" d="M16.7988 23.002C21.0376 21.1506 24 16.9212 24 12C24 5.37259 18.6274 0 12 0C5.37256 0 0 5.37259 0 12C0 16.9212 2.9624 21.1506 7.20123 23.002L12 31L16.7988 23.002Z" fill="#10A0F1"/><path class="fwdemv-border" fill-rule="evenodd" clip-rule="evenodd" d="M16.1057 22.2135L16.3985 22.0856C20.2862 20.3876 23 16.5096 23 12C23 5.92487 18.0752 1 12 1C5.92485 1 1 5.92487 1 12C1 16.5096 3.71382 20.3876 7.6015 22.0856L7.89433 22.2135L12 29.0563L16.1057 22.2135ZM12 31L7.20123 23.002C2.9624 21.1506 0 16.9212 0 12C0 5.37259 5.37256 0 12 0C18.6274 0 24 5.37259 24 12C24 16.9212 21.0376 21.1506 16.7988 23.002L12 31Z" fill="white"/><path class="fwdemv-icon" d="M17.1266 7.34411C16.9951 7.27895 16.8473 7.25363 16.7015 7.27126C16.5558 7.28889 16.4183 7.34872 16.3061 7.44338L12.498 10.4412V8.41988C12.5094 8.20409 12.4608 7.98937 12.3576 7.79949C12.2545 7.60962 12.1008 7.45201 11.9135 7.34411C11.7819 7.27895 11.6342 7.25363 11.4884 7.27126C11.3426 7.28889 11.2052 7.34872 11.0929 7.44338L7.18244 10.5222C7.04284 10.643 6.93204 10.7935 6.85816 10.9627C6.78428 11.1319 6.74919 11.3155 6.75547 11.5C6.74919 11.6845 6.78428 11.8681 6.85816 12.0373C6.93204 12.2065 7.04284 12.357 7.18244 12.4778L11.0921 15.5579C11.2299 15.6707 11.402 15.7332 11.58 15.7353C11.6958 15.7345 11.8098 15.7074 11.9135 15.6559C12.101 15.5479 12.2548 15.3901 12.358 15.1999C12.4611 15.0098 12.5096 14.7948 12.498 14.5788V12.5588L16.3053 15.5579C16.443 15.6707 16.6151 15.7333 16.7931 15.7353C16.9089 15.7345 17.0229 15.7073 17.1266 15.6559C17.314 15.5478 17.4678 15.39 17.571 15.1999C17.6742 15.0098 17.7227 14.7948 17.7111 14.5788V8.41988C17.7224 8.2041 17.6738 7.9894 17.5707 7.79954C17.4675 7.60967 17.3138 7.45205 17.1266 7.34411Z" fill="white"/><path class="fwdemv-icon-2" d="M6.4071 16C6.3369 16 6.26957 15.9721 6.21993 15.9225C6.17028 15.8728 6.1424 15.8055 6.1424 15.7353V7.26471C6.1424 7.22994 6.14924 7.19552 6.16254 7.16341C6.17585 7.13129 6.19535 7.10211 6.21993 7.07753C6.24451 7.05295 6.27369 7.03345 6.3058 7.02015C6.33792 7.00685 6.37234 7 6.4071 7C6.44186 7 6.47628 7.00685 6.5084 7.02015C6.54052 7.03345 6.5697 7.05295 6.59428 7.07753C6.61886 7.10211 6.63835 7.13129 6.65166 7.16341C6.66496 7.19552 6.67181 7.22994 6.67181 7.26471V15.7353C6.67181 15.8055 6.64392 15.8728 6.59428 15.9225C6.54463 15.9721 6.47731 16 6.4071 16Z" fill="white"/></svg>';

    
    /**
     * Initialize
     */
    constructor(
        id,
        markerType,
        polygonOffsetUnits,
        markerPolygonOffsetAlpha,
        texturesAr,
        markerShowAndHideAnimationType,
        marker3dPosition,
        meshName,
        boneName,
        normalsAngle,
        cameraPositionName,
        cameraPosition,
        cameraShowToolTipWhenFinished,
        cameraPositionAnimationDuration,
        cameraPositionEasingType,
        animationFinishResetCamera,
        showTooltipBoferePlaying,
        animateWithModel,
        animationShowToolTipWhenFinished,
        animationFinishAction,
        cameraAnimationDuration,
        animationName,
        animationNameRepeatCount,
        animationTimeScale,
        normals,
        markerScale,
        iconType,
        borderColor,
        borderSelctedColor,
        backgroundColor,
        backgroundSelectedColor,
        iconColor,
        iconSelectedColor,
        className,
        link,
        linkTarget,
        maxWidth,
        toolTipOffsetX,
        tooltipHTML,
        infoHTML,
        markerToolTipOffsetY,
        
    ){
        
        super();
      
        this.id = id;
        this.markerType = markerType;
        this.polygonOffsetUnits = polygonOffsetUnits;
        this.markerPolygonOffsetAlpha = markerPolygonOffsetAlpha;
        this.texturesAr = texturesAr;
        this.markerShowAndHideAnimationType = markerShowAndHideAnimationType;
        this.markerScale = markerScale;
        this.marker3dPosition = marker3dPosition;
        this.meshName = meshName;
        this.boneName = boneName;
        this.normalsAngle = normalsAngle;
        this.animateWithModel = animateWithModel;
        this.animationShowToolTipWhenFinished = animationShowToolTipWhenFinished;
        this.animationFinishAction = animationFinishAction;
        this.cameraPosition = cameraPosition;
        this.cameraShowToolTipWhenFinished = cameraShowToolTipWhenFinished;
        this.cameraPositionName = cameraPositionName;
        this.cameraPositionAnimationDuration = cameraPositionAnimationDuration;
        this.cameraPositionEasingType = cameraPositionEasingType;
     
        if(this.cameraPositionEasingType == 'linear'){
            this.cameraPositionEasingType = 'linear';
        }else if(this.cameraPositionEasingType == 'easeout'){
            this.cameraPositionEasingType = Quint.easeOut;
        }else if(this.cameraPositionEasingType == 'easeinout'){
            this.cameraPositionEasingType = Expo.easeInOut;
        }

        this.animationFinishResetCamera = animationFinishResetCamera;
        this.showTooltipBoferePlaying = showTooltipBoferePlaying;
        this.cameraAnimationDuration = cameraAnimationDuration;
        this.animationName = animationName;
        this.animationNameRepeatCount = animationNameRepeatCount;
        this.animationTimeScale = animationTimeScale;
        this.normals = normals;
        this.iconType = iconType;
        this.registrationPoint = 'center';
        this.borderColor = borderColor;
        this.borderSelctedColor = borderSelctedColor;
        this.backgroundColor = backgroundColor;
        this.backgroundSelectedColor = backgroundSelectedColor;
        this.iconColor = iconColor;
        this.iconSelectedColor = iconSelectedColor;
        this.className = className;
        this.link = link;
        this.maxWidth = maxWidth;
        this.toolTipOffsetX = toolTipOffsetX;
        this.linkTarget = linkTarget;
        this.tooltipHTML = tooltipHTML;
        this.infoHTML = infoHTML;
        this.markerToolTipOffsetY = markerToolTipOffsetY + 10;

        this.iconWidth = 24;
        this.iconHeight = 24;
        
        this.screen.className = 'fwdemv-marker ' + this.className;
        if(this.iconType.match(/pointer/ig)){
            this.registrationPoint = 'down';
            this.screen.classList.add('pointer');
            this.iconWidth = 24;
            this.iconHeight = 31;
        }

        this.style.zIndex = '1';
        this.style.cursor = 'pointer';
        this.style.overflow = 'visible';


        // Setup main holder.
        this.mainDO = new FWDEMVDisplayObject();
        this.mainDO.screen.className = 'fwdemv-marker-main=holder';
        this.mainDO.style.overflow = 'visible';
        this.addChild(this.mainDO);


        // Hit test DO.
        this.hitDO = new FWDEMVDisplayObject();
        this.hitDO.screen.className = 'fwdemv-marker-hit';
        this.addChild(this.hitDO)
       
        
        // Setup other parts.
        this.setupDumy();
        this.setupIcon();
        this.setNormalState();
        this.addEvents();
        
        if(this.markerShowAndHideAnimationType == "scale"){
            if(FWDEMVUtils.isIOS){
                this.mainDO.scale = 0.5;
            }else{
                this.hide();
            }
        }else{
            this.hide();
        }

        if(this.markerType == '3D'){
            this.mainDO.style.opacity = 0;
        }
       
        this.hideRwind();
     }


     /**
      * Setup dumy.
      */
     setupDumy(){
        this.dumyDO = new FWDEMVDisplayObject();
        this.dumyDO.style.width = '100%';
        this.dumyDO.style.overflow = 'visible';
        this.dumyDO.screen.className = 'fwdemv-marker-dumy';
        this.mainDO.addChild(this.dumyDO);

        this.dumyInDO = new FWDEMVDisplayObject();
        this.dumyInDO.style.width = '200%';
        this.dumyInDO.style.left = '-50%';
        this.dumyDO.addChild(this.dumyInDO);
     }


    /**
      * Setup icon.
      */
    setupIcon(){
        this.style.zIndex = '999999'
        let svg = '';
        let rewindSvg = '';
        this.iconDO = new FWDEMVDisplayObject();
        this.rewindDO = new FWDEMVDisplayObject();
      
        this.iconDO.style.lineHeight = 0;
      
        if(this.iconType == 'plus'){
            svg = FWDEMVMarker.plusSvg;

            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconPlus')['texture'];

        }else if(this.iconType == 'plusPointer'){
            svg = FWDEMVMarker.plusPointerSvg;
            this.mainDO.style.transformOrigin = 'center bottom';
            this.hitDO.style.transformOrigin = 'center bottom';

            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconPlusPointer')['texture'];
            this.shadowTexture = this.pointerShadowTexture;
            this.isPointer = true;

        }else if(this.iconType == 'info'){
            svg = FWDEMVMarker.infoSvg;
            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconInfo')['texture'];

        }else if(this.iconType == 'infoPointer'){
            svg = FWDEMVMarker.infoPointerSvg;
            this.mainDO.style.transformOrigin = 'center bottom';
            this.hitDO.style.transformOrigin = 'center bottom';

            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconInfoPointer')['texture'];
            this.shadowTexture = this.pointerShadowTexture;
            this.isPointer = true;

        }else if(this.iconType == 'link'){
            svg = FWDEMVMarker.linkSvg;
            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconLink')['texture'];

        }else if(this.iconType == 'linkPointer'){
            svg = FWDEMVMarker.linkPointerSvg;
            this.mainDO.style.transformOrigin = 'center bottom';
            this.hitDO.style.transformOrigin = 'center bottom';

            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconLinkPointer')['texture'];
            this.shadowTexture = this.pointerShadowTexture;
            this.isPointer = true;

        }else if(this.iconType == 'play'){
            svg = FWDEMVMarker.playSvg;
            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconPlay')['texture'];

        }else if(this.iconType == 'playPointer'){
            svg = FWDEMVMarker.playPointerSvg;
            this.mainDO.style.transformOrigin = 'center bottom';
            this.hitDO.style.transformOrigin = 'center bottom';

            this.iconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconPlayPointer')['texture'];
            this.shadowTexture = this.pointerShadowTexture;
            this.isPointer = true;
        }

        this.iconDO.innerHTML = svg;
        if(this.isPointer){
            rewindSvg = FWDEMVMarker.rewindPointerSvg;
            this.borderTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'borderPointer')['texture'];
            this.backgroundTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'backgroundPointer')['texture'];
            this.rewindIconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconRewindPointer')['texture'];

        }else{
            rewindSvg = FWDEMVMarker.rewindSvg;
            this.borderTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'border')['texture'];
            this.backgroundTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'backgroundTexture')['texture'];
            this.rewindIconTexture = FWDEMVUtils.getObjectFromArrayByName(this.texturesAr, 'iconRewind')['texture'];
        }
      
        this.rewindDO.innerHTML = rewindSvg;
       
        this.totalWidth = this.iconWidth * this.markerScale;
        this.totalHeight = this.iconHeight * this.markerScale;
        
        this.mainDO.width = this.iconWidth;
        this.mainDO.height = this.iconHeight;
        this.dumyDO.width = this.iconWidth;
        this.dumyDO.height = this.iconHeight;
       
        if(this.isPointer){                
            this.mainDO.x = -this.mainDO.width/2;

            this.mainDO.y = this.totalHeight/2 - this.mainDO.height;
        }else{
            this.mainDO.x = -this.mainDO.width/2;
            this.mainDO.y = -this.mainDO.height/2;
        }
       
        this.hitDO.width = this.iconWidth;
        this.hitDO.height = this.iconHeight;
    

        if(this.isPointer){
            this.hitDO.x = -this.hitDO.width/2;
            this.hitDO.y = this.totalHeight/2 - this.hitDO.height;
        }else{
            this.hitDO.x = -this.mainDO.width/2;
            this.hitDO.y = -this.mainDO.height/2;
        }
      
        this.mainDO.addChild(this.iconDO);
        this.mainDO.addChild(this.rewindDO);
    }


    /**
     * Show/hide rewind.
     */
    showRewind(){
        this.rewindDO.style.visibility = 'visible';

        if(this['marker3D']){
            this['marker3D'].showRewind();
        }
        this.hasRewind = true;
    }

    hideRwind(){
        this.rewindDO.style.visibility = 'hidden';

        if(this['marker3D']){
            this['marker3D'].hideRewind();
        }
        this.hasRewind = false;
    }


    /**
     * Update dummy for hit testing.
     */
    upateDumy(position){
       
        if(position == 'top'){
            this.dumyDO.height = this.mainDO.height + this.markerToolTipOffsetY;
            this.dumyDO.y = -this.markerToolTipOffsetY;
            this.dumyInDO.height = this.markerToolTipOffsetY;
            this.dumyInDO.y = 0;
        }else if(position == 'bottom'){
            this.dumyDO.height = this.mainDO.height + this.markerToolTipOffsetY;
            this.dumyDO.y = 0;
            this.dumyInDO.height = this.markerToolTipOffsetY;
            this.dumyInDO.y = this.mainDO.height;
        }else{
            this.dumyDO.height = this.mainDO.height;
            this.dumyInDO.height = 0;
            this.dumyDO.y = 0;
        }
    }


    /**
     * Set position.
     */
    setPosition3D(position){
       this.marker3dPosition = position;
    }


    /**
     * Add events.
     */
    addEvents(){
       
        this.onPointerOver = this.onPointerOver.bind(this);
        this.hitDO.screen.addEventListener("pointerover", this.onPointerOver);

        this.onPointerOut = this.onPointerOut.bind(this);
        this.hitDO.screen.addEventListener("pointerout", this.onPointerOut);
       
        this.onPointerUp = this.onPointerUp.bind(this);
		this.hitDO.screen.addEventListener("pointerup", this.onPointerUp);
        this.hitDO.screen.addEventListener("touchend", this.onPointerUp);
    }

    onPointerOver(e){
        if(this.destroyed || e.pointerType != 'mouse') return;
        if(this.isDisabled || this.holdState) return;
        e.stopImmediatePropagation();
        this.setSelectedState(true);
        this.dispatchEvent(FWDEMVMarker.POINTER_OVER, {e:e});
    }
    
    onPointerOut(e){
        if(this.destroyed || e.pointerType != 'mouse') return;
        if(this.isDisabled) return;
       
        this.dispatchEvent(FWDEMVMarker.POINTER_OUT, {e:e});
    }

    onPointerUp(e){
        if(this.destroyed || this.disabled) return;
        this.dispatchEvent(FWDEMVMarker.POINTER_UP , {e:e, 'pointerType': e.pointerType});      
    }


    /**
     * Set buttons states.
     */
    setNormalState(animate){
        if(this.destroyed || this.iconType == 'none') return;
        this.isSelected = false;
      
        const border = this.iconDO.screen.querySelector('.fwdemv-border');
        const background = this.iconDO.screen.querySelector('.fwdemv-background');
        const icon = this.iconDO.screen.querySelector('.fwdemv-icon');
        const icon2 = this.iconDO.screen.querySelector('.fwdemv-icon-2');

        const border2 = this.rewindDO.screen.querySelector('.fwdemv-border');
        const background2 = this.rewindDO.screen.querySelector('.fwdemv-background');
        const icon3 = this.rewindDO.screen.querySelector('.fwdemv-icon');
        const icon4 = this.rewindDO.screen.querySelector('.fwdemv-icon-2');
   
        if(animate){
            FWDAnimation.to(border, .8, {fill:this.borderColor, ease:Quint.easeOut});
            FWDAnimation.to(background, .8, {fill:this.backgroundColor, ease:Quint.easeOut});
            FWDAnimation.to(icon, .8, {fill:this.iconColor, ease:Quint.easeOut});
            
            if(icon2){
                FWDAnimation.to(icon2, .8, {fill:this.iconColor, ease:Quint.easeOut});
            }

            FWDAnimation.to(border2, .8, {fill:this.borderColor, ease:Quint.easeOut});
            FWDAnimation.to(background2, .8, {fill:this.backgroundColor, ease:Quint.easeOut});
            FWDAnimation.to(icon3, .8, {fill:this.iconColor, ease:Quint.easeOut});
            FWDAnimation.to(icon4, .8, {fill:this.iconColor, ease:Quint.easeOut});

        }else{
            FWDAnimation.killTweensOf(border);
            border.style.fill = this.borderColor;

            FWDAnimation.killTweensOf(background);
            background.style.fill = this.backgroundColor;

            FWDAnimation.killTweensOf(icon);
            icon.style.fill = this.iconColor;

            if(icon2){
                FWDAnimation.killTweensOf(icon2);
                icon2.style.fill = this.iconColor;
            }

           
            FWDAnimation.killTweensOf(border2);
            border2.style.fill = this.borderColor;

            FWDAnimation.killTweensOf(background2);
            background2.style.fill = this.backgroundColor;

            FWDAnimation.killTweensOf(icon3);
            icon3.style.fill = this.iconColor;
    
            FWDAnimation.killTweensOf(icon4);
            icon4.style.fill = this.iconColor;

        }
    }

    setSelectedState(animate){
        if(this.destroyed || this.iconType == 'none') return;
        this.isSelected = true;
       
        const border = this.iconDO.screen.querySelector('.fwdemv-border');
        const background = this.iconDO.screen.querySelector('.fwdemv-background');
        const icon = this.iconDO.screen.querySelector('.fwdemv-icon');
        const icon2 = this.iconDO.screen.querySelector('.fwdemv-icon-2');

        const border2 = this.rewindDO.screen.querySelector('.fwdemv-border');
        const background2 = this.rewindDO.screen.querySelector('.fwdemv-background');
        const icon3 = this.rewindDO.screen.querySelector('.fwdemv-icon');
        const icon4 = this.rewindDO.screen.querySelector('.fwdemv-icon-2');
        
        if(animate){
           
            FWDAnimation.to(border, .8, {fill:this.borderSelctedColor, ease:Quint.easeOut});
            FWDAnimation.to(background, .8, {fill:this.backgroundSelectedColor, ease:Quint.easeOut});
            FWDAnimation.to(icon, .8, {fill:this.iconSelectedColor, ease:Quint.easeOut});
            
            if(icon2){
                FWDAnimation.to(icon2, .8, {fill:this.iconSelectedColor, ease:Quint.easeOut});
            }

            FWDAnimation.to(border2, .8, {fill:this.borderSelctedColor, ease:Quint.easeOut});
            FWDAnimation.to(background2, .8, {fill:this.backgroundSelectedColor, ease:Quint.easeOut});
            FWDAnimation.to(icon3, .8, {fill:this.iconSelectedColor, ease:Quint.easeOut});
            FWDAnimation.to(icon4, .8, {fill:this.iconSelectedColor, ease:Quint.easeOut});

        }else{
            FWDAnimation.killTweensOf(border);
            border.style.fill = this.borderSelctedColor;

            FWDAnimation.killTweensOf(background);
            background.style.fill = this.backgroundSelectedColor;

            FWDAnimation.killTweensOf(icon);
            icon.style.fill = this.iconSelectedColor;

            if(icon2){
                FWDAnimation.killTweensOf(icon2);
                icon2.style.fill = this.iconSelectedColor;
            }

            FWDAnimation.killTweensOf(border2);
            border2.style.fill = this.borderSelctedColor;

            FWDAnimation.killTweensOf(background2);
            background2.style.fill = this.backgroundSelectedColor;

            FWDAnimation.killTweensOf(icon3);
            icon3.style.fill = this.iconSelectedColor;
    
            FWDAnimation.killTweensOf(icon4);
            icon4.style.fill = this.iconSelectedColor;
        }
    }


    /**
     * Show/hide.
     */
    hide(animate){
        if(this.destroyed || this.isShowed === false) return;
       
        this.isShowed = false;
        this.isDisabled = true;
        this.screen.style.pointerEvents = 'none';

        this.hitDO.scale = 0;
       
        FWDAnimation.killTweensOf(this.mainDO);
        if(animate){
            if(this.markerShowAndHideAnimationType == 'scale'){
                FWDAnimation.to(this.mainDO, .4, {scale:0, ease:Quint.easeOut});
            }else{
                FWDAnimation.to(this.mainDO, .4, {opacity:0, ease:Quint.easeOut});
            }
           
        }else{
            if(this.markerShowAndHideAnimationType == 'scale'){
                this.mainDO.scale = 0;
            }else{
                this.mainDO.opacity = 0;
            }
        }
    }

    show(animate){
        if(this.destroyed || this.isShowed === true) return;

        this.isShowed = true;
        this.screen.style.pointerEvents = 'auto';

        this.hitDO.scale = this.markerScale;
      
        FWDAnimation.killTweensOf(this.mainDO);
        if(animate){
            if(this.markerShowAndHideAnimationType == 'scale'){
                FWDAnimation.to(this.mainDO, .85, {scale:this.markerScale, delay: .1 + Math.random() * .2, ease:Elastic.easeOut});
            }else{
                FWDAnimation.to(this.mainDO, .9, {opacity:1, delay: .1 + Math.random() * .2, ease:Quint.easeOut});
            }
        }else{
            if(this.markerShowAndHideAnimationType == 'scale'){
                this.mainDO.scale = this.markerScale;
            }else{
                this.mainDO.opacity = 1;
            }
        }

        setTimeout(() =>{
            if(this.destroyed) return;
            this.isDisabled = false;
        }, 10);
    }

    /**
     * Destroy.
     */
    destroy(){
        this.destroyed = true;

        FWDAnimation.killTweensOf(this.mainDO);
    }
}
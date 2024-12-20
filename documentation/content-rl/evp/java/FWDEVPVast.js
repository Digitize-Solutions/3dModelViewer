/**
 * Easy Video Player PACKAGED v8.3
 * VAST plugin.
 *
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © 2006 All Rights Reserved.
 */
(function (window){
var FWDEVPVast = function(
		_d
		){
		var _s = this;
		var prototype = FWDEVPVast.prototype;
		
	
		//##########################################//
		/* initialize  */
		//##########################################//
		_s.init = function(){};
		
		//####################################//
		/* load vast */
		//####################################//
		_s.setSource = function(source){
			_s.closeVast();
			_s.isVmapTimesFixed = false;
			_d.adsSource_ar = [];
			_s.vastData_ar = [];
			_s.parsedLienarVastAds_ar = [];
			_s.parsedNonLienarVastAds_ar = [];
			_s.countVastDataLoaded = 0;
			_s.totalDataVastToLoad = 1;
			_s.load(source);
			_d.dispatchEvent(FWDEVPData.VAST_LOADING);
		}
		
		_s.closeVast = function(){
			if(_s.vastXHR){
				_s.vastXHR.onreadystatechange = null;
				_s.vastXHR.onerror = null;
				_s.vastXHR.abort();
				_s.vastXHR = null;
			}
		}
		
		_s.load = function(source){
			var tempObj;
			
			_s.vastXHR = new XMLHttpRequest();
			_s.vastXHR.onreadystatechange = function(e){
				if(_s.vastXHR.readyState == 4){
					if(_s.vastXHR.status == 200){
						var respObj = FWDEVPUtils.xmlToJson(_s.vastXHR.responseXML);

						// Wrapper.
						try{
							var url = respObj['VAST']['Ad']['Wrapper']['VASTAdTagURI']['#cdata-section'];
							if(!url){
								url = respObj['VAST']['Ad']['Wrapper']['VASTAdTagURI']['#text'];
							}
							_s.load(url);
							return;
						}catch(e){}

						if(respObj['vmap:VMAP']){
							if(!respObj['vmap:VMAP']['vmap:AdBreak'].length){
								var obj = {};
								obj.timeOffset = respObj['vmap:VMAP']['vmap:AdBreak']['@attributes']['timeOffset'];
								obj.breakType = respObj['vmap:VMAP']['vmap:AdBreak']['@attributes']['breakType'];
								obj.breakId = respObj['vmap:VMAP']['vmap:AdBreak']['@attributes']['breakId'];
								obj.source = respObj['vmap:VMAP']['vmap:AdBreak']['vmap:AdSource']['vmap:AdTagURI']['#cdata-section'];
								_s.vastData_ar.push(obj);
							}else{
								for(var i=0; i<respObj['vmap:VMAP']['vmap:AdBreak'].length; i++){
									var obj = {};
									obj.timeOffset = respObj['vmap:VMAP']['vmap:AdBreak'][i]['@attributes']['timeOffset'];
									obj.breakType = respObj['vmap:VMAP']['vmap:AdBreak'][i]['@attributes']['breakType'];
									obj.breakId = respObj['vmap:VMAP']['vmap:AdBreak'][i]['@attributes']['breakId'];
									obj.source = respObj['vmap:VMAP']['vmap:AdBreak'][i]['vmap:AdSource']['vmap:AdTagURI']['#cdata-section'];
									_s.vastData_ar.push(obj);
								}
							}
							_s.totalDataVastToLoad = _s.vastData_ar.length;
							_s.load(_s.vastData_ar[_s.countVastDataLoaded]['source']);
							
							return;
						}
						
						var linearVast_ar = [];
						var nonLinearVast_ar = [];
						var respObj = FWDEVPUtils.xmlToJson(_s.vastXHR.responseXML).VAST;
						
						if(!respObj["Ad"]){
							var err = "No <font color='#FF0000'> &lt;ad&gt; </font> tag was found in the VAST file. Invalid VAST file.";
							//_d.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:err});
							console.log(err);
							_d.vastXML = undefined;
							_s.dispatchLoadDone();
							return;
						}else{
							if(!respObj["Ad"].length) respObj["Ad"] = [respObj["Ad"]];
							for(var i=0; i< respObj["Ad"].length; i++){
								tempObj = {};
								tempObj.id = respObj["Ad"][i]["@attributes"]["id"];
								tempObj.sequence = respObj["Ad"][i]["@attributes"]["sequence"];
								tempObj.startTime = respObj["Ad"][i]["@attributes"]["startTime"];
								if(!tempObj.sequence) tempObj.sequence = i;
								
								if(!respObj["Ad"][i]["InLine"]){
									var err = "No <font color='#FF0000'> &lt;InLine&gt; </font>tag was found in the VAST xml file.";
									//_d.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:respObj});
									console.log(err);
									_d.vastXML = undefined;
									_s.dispatchLoadDone();
									return;
								}
								tempObj["InLine"] = {};
								
								//impression
								tempObj["InLine"]["Impression"] = undefined;
								if(respObj["Ad"][i]["InLine"]["Impression"]){
									if(respObj["Ad"][i]["InLine"]["Impression"]["#cdata-section"]){
										tempObj["InLine"]["Impression"] = respObj["Ad"][i]["InLine"]["Impression"]["#cdata-section"];
									}else{
										tempObj["InLine"]["Impression"] = respObj["Ad"][i]["InLine"]["Impression"]["#text"];
									}
								}
								
								if(!respObj["Ad"][i]["InLine"]["Creatives"]["Creative"].length){
									respObj["Ad"][i]["InLine"]["Creatives"]["Creative"] = [respObj["Ad"][i]["InLine"]["Creatives"]["Creative"]]
								}
								
							
								if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"].length){
									for(var j=0; j<respObj["Ad"][i]["InLine"]["Creatives"]["Creative"].length; j++){
										
										//non linear
										if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']){
											tempObj["InLine"]["NonLinear"] = {};
											tempObj["InLine"]['type'] = 'nonlinear';
											tempObj["InLine"]["NonLinear"]['width'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['@attributes']['width'];
											tempObj["InLine"]["NonLinear"]['height'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['@attributes']['height'];
											tempObj["InLine"]["NonLinear"]['duration'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['@attributes']['minSuggestedDuration'];
											if(!tempObj["InLine"]["NonLinear"]['duration']) tempObj["InLine"]["NonLinear"]['duration'] = '00:00:05';
											try{
												tempObj["InLine"]["NonLinear"]['width'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['@attributes']['width'];
												tempObj["InLine"]["NonLinear"]['height'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['@attributes']['height'];
											}catch(e){}
											
											try{
												tempObj["InLine"]["NonLinear"]['ClickThroug'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['NonLinearClickThrough']['#cdata-section'];
												tempObj["InLine"]["NonLinear"]['ClickTracking'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['NonLinearClickTracking']['#cdata-section'];
											}catch(e){}
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['StaticResource']){
												tempObj["InLine"]["NonLinear"]['source'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['StaticResource']['#cdata-section'];
											}else if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['IFrameResource']){
												tempObj["InLine"]["NonLinear"]['source'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['IFrameResource']['#cdata-section'];
											}
											try{
												tempObj["InLine"]["NonLinear"]['type'] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]['NonLinearAds']['NonLinear']['StaticResource']['@attributes']['creativeType'];
											}catch(e){}
											
											nonLinearVast_ar.push(tempObj);
										}

									
										//linear ads
										if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]){
											
											if(!respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"].length){
												respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"] = [respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"]];
											}
											
											tempObj["InLine"]["Linear"] = {};
											tempObj["InLine"]['type'] = 'linear';
										
											//video source
											var allVideosObj = [];
										
											for(var k = 0; k<respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"].length; k++){
												var vid = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"][k];
												if(vid['#cdata-section'].match(/\.mp3|\.mp4/ig)){
													allVideosObj.push(vid);
												}
											}
											var videoSource;
											var correctIndex = 0;
											
											prop:for(var m=0;  m<allVideosObj.length; m++){
												if(window["innerWidth"] >= allVideosObj[m]["@attributes"]["width"]){
													correctIndex = m;
													break prop;
												}
											}
											
											if(allVideosObj[correctIndex]["#cdata-section"]){
												tempObj["InLine"]["Linear"]["videoSource"]  = allVideosObj[correctIndex]["#cdata-section"];
											}else{
												tempObj["InLine"]["Linear"]["videoSource"] = allVideosObj[correctIndex]["#text"];
											}
											
											//duration
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]){
												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#cdata-section"]){
													tempObj["InLine"]["Linear"]["Duration"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#cdata-section"];
												}else if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#text"]){
													tempObj["InLine"]["Linear"]["Duration"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#text"];
												}
											}
											
											//skip offset
											tempObj["InLine"]["Linear"]["skipoffset"] = undefined;
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["@attributes"]
											   && respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["@attributes"]["skipoffset"]
											){
												tempObj["InLine"]["Linear"]["skipoffset"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["@attributes"]["skipoffset"];
											}
											
											
											if(tempObj["InLine"]["Linear"]["skipoffset"]){
												tempObj["InLine"]["Linear"]["skipoffset"] = tempObj["InLine"]["Linear"]["skipoffset"].substr(0, 8);
												if(tempObj["InLine"]["Linear"]["Duration"] && tempObj["InLine"]["Linear"]["skipoffset"].indexOf("%") != -1){
													var tempSkipOffset =  Math.round(FWDEVPUtils.getSecondsFromString(tempObj["InLine"]["Linear"]["Duration"]) * (tempObj["InLine"]["Linear"]["skipoffset"].substr(0, tempObj["InLine"]["Linear"]["skipoffset"].length -1)/100));
													tempObj["InLine"]["Linear"]["skipoffset"] = FWDEVPUtils.formatTime(tempSkipOffset, true);
												}
												
											}
											
											if(tempObj["InLine"]["Linear"]["skipoffset"]){
												tempObj["InLine"]["Linear"]["skipoffset"] = FWDEVPUtils.getSecondsFromString(tempObj["InLine"]["Linear"]["skipoffset"]);
												if(tempObj["InLine"]["Linear"]["Duration"] && FWDEVPUtils.getSecondsFromString(tempObj["InLine"]["Linear"]["Duration"]) <= tempObj["InLine"]["Linear"]["skipoffset"]){
													tempObj["InLine"]["Linear"]["skipoffset"] = undefined;
												}
											}
											
											//tracking events
											tempObj["InLine"]["Linear"]["TrackingEvents"] = undefined;
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]){
												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"]){
													tempObj["InLine"]["Linear"]["TrackingEvents"] = [];
													for(var p=0; p<respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"].length; p++){
														tempObj["InLine"]["Linear"]["TrackingEvents"].push({
															event:respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["@attributes"]["event"]
														})
														if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["#cdata-section"]){
															tempObj["InLine"]["Linear"]["TrackingEvents"][p].URI = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["#cdata-section"];
														}else{
															tempObj["InLine"]["Linear"]["TrackingEvents"][p].URI = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["#text"];
														}
													}
												}
											}
											
											//video clicks
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]){
												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]){
													if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]["#cdata-section"]){
														tempObj["InLine"]["Linear"]["ClickThrough"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]["#cdata-section"];
													}else{
														tempObj["InLine"]["Linear"]["ClickThrough"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]["#text"]
													}
												}
											
												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]){
													
													if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]["#cdata-section"]){
														tempObj["InLine"]["Linear"]["ClickTracking"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]["#cdata-section"];
													}else{
														tempObj["InLine"]["Linear"]["ClickTracking"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]["#text"];
													}
												}
											}	
											linearVast_ar.push(tempObj);	
										}	
									}
								}
							}
						}
						
						FWDEVPUtils.storArrayBasedOnObjectValue(linearVast_ar, "sequence");
						FWDEVPUtils.storArrayBasedOnObjectValue(nonLinearVast_ar, "sequence");

						
						//create non linear ads object
						for(var i=0; i<nonLinearVast_ar.length; i++){
							var adsObj = {};
							if(!adsObj.timeStart) adsObj.timeStart = 0;
							if(nonLinearVast_ar[i].startTime) adsObj.timeStart = FWDEVPUtils.getSecondsFromString(nonLinearVast_ar[i].startTime);
							
							if(_s.vastData_ar.length && _s.vastData_ar[_s.countVastDataLoaded]['timeOffset']){
								var vmapTimeStart = _s.vastData_ar[_s.countVastDataLoaded]['timeOffset'];
								if(vmapTimeStart){
									if(vmapTimeStart.toLowerCase() == 'start'){
										adsObj.timeStart = 0;
									}else if(vmapTimeStart.toLowerCase() == 'end'){
										adsObj.timeStart = 'end';
									}else if(vmapTimeStart.toLowerCase().indexOf('%') != -1){
										adsObj.timeStart = vmapTimeStart.toLowerCase();
									}else{
										adsObj.timeStart = FWDEVPUtils.getSecondsFromString(vmapTimeStart.toLowerCase());
									}
								}
							}
							
							adsObj.imagePath = nonLinearVast_ar[i]['InLine']['NonLinear']['source'];
							if((nonLinearVast_ar[i]['InLine']['NonLinear']['type'] && nonLinearVast_ar[i]['InLine']['NonLinear']['type'].indexOf('image') != -1)
								|| adsObj.imagePath.match(/jpg|jpeg|png/ig)){
								if(adsObj.imagePath.indexOf('?') != -1){
									adsObj.imagePath = adsObj.imagePath + '&vast-type=.png';
								}else{
									adsObj.imagePath = adsObj.imagePath + '?vast-type=.png';
								}
							}
							adsObj.duration = nonLinearVast_ar[i]['InLine']['NonLinear']['duration'];
							adsObj.google_ad_width = nonLinearVast_ar[i]['InLine']['NonLinear']['width'] || 600;
							adsObj.google_ad_height = nonLinearVast_ar[i]['InLine']['NonLinear']['height'] || 200;
							
							if(nonLinearVast_ar[i]['InLine']['NonLinear']['ClickThroug']) adsObj.link = nonLinearVast_ar[i]['InLine']['NonLinear']['ClickThroug'];
							adsObj.target = '_blank';
							if(nonLinearVast_ar[i]['InLine']['NonLinear']['ClickTracking']) adsObj.tracking = nonLinearVast_ar[i]['InLine']['NonLinear']['ClickTracking'];
							_s.parsedNonLienarVastAds_ar.push(adsObj);
							
						}

						_d.popupAds_ar = _s.parsedNonLienarVastAds_ar;
						
						//create linear ads object
						for(var i=0; i<linearVast_ar.length; i++){
							var adsObj = {};
					
							adsObj.source = linearVast_ar[i]["InLine"]["Linear"]["videoSource"];
							adsObj.source = adsObj.source;
							adsObj.timeStart = FWDEVPUtils.getSecondsFromString(_d.vastLinearStartTime);
							if(linearVast_ar[i].startTime) adsObj.timeStart = FWDEVPUtils.getSecondsFromString(linearVast_ar[i].startTime);
							if(!adsObj.timeStart) adsObj.timeStart = 0;
							
							if(_s.vastData_ar.length && _s.vastData_ar[_s.countVastDataLoaded]['timeOffset']){
								var vmapTimeStart = _s.vastData_ar[_s.countVastDataLoaded]['timeOffset'];
								if(vmapTimeStart){
									if(vmapTimeStart.toLowerCase() == 'start'){
										adsObj.timeStart = 0;
									}else if(vmapTimeStart.toLowerCase() == 'end'){
										adsObj.timeStart = 'end';
									}else if(vmapTimeStart.toLowerCase().indexOf('%') != -1){
										adsObj.timeStart = vmapTimeStart.toLowerCase();
									}else{
										adsObj.timeStart = FWDEVPUtils.getSecondsFromString(vmapTimeStart.toLowerCase());
									}
								}
							}
							
							if(linearVast_ar[i]["InLine"]["Linear"]["skipoffset"]) adsObj.timeToHoldAds = linearVast_ar[i]["InLine"]["Linear"]["skipoffset"];
							adsObj.link = linearVast_ar[i]["InLine"]["Linear"]["ClickThrough"];
							
							if(linearVast_ar[i]["InLine"]["Linear"]["ClickTracking"]) adsObj.ClickTracking = linearVast_ar[i]["InLine"]["Linear"]["ClickTracking"];
							adsObj.target = _s.vastClickTroughTarget;
							if(linearVast_ar[i]["InLine"]["Impression"]) adsObj.Impression = linearVast_ar[i]["InLine"]["Impression"];
							if(linearVast_ar[i]["InLine"]["Linear"]["TrackingEvents"]) adsObj.TrackingEvents = linearVast_ar[i]["InLine"]["Linear"]["TrackingEvents"];
						
							_s.parsedLienarVastAds_ar.push(adsObj);
						}
					
						_d.adsSource_ar = _s.parsedLienarVastAds_ar;
						
						_d.isVastXMLParsed_bl = true;
						_s.countVastDataLoaded ++;
						if(_s.countVastDataLoaded == _s.totalDataVastToLoad){
							_s.dispatchLoadDone();
						}else{
							_s.load(_s.vastData_ar[_s.countVastDataLoaded]['source']);
						}
					}else{
						_d.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"vast XML file can't be loaded " +  _s.vastXHR.statusText});
					}
				}
			};

			_s.dispatchLoadDone = function(){
				_d.dispatchEvent(FWDEVPData.VAST_LOADED_DONE, {ads:_d.adsSource_ar});
			}
			
			_s.vastXHR.onerror = function(e){
				try{
					if(window.console) console.log(e);
					if(window.console) console.log(e.message);
				}catch(e){};
			};
			
			//if(source.indexOf("http") != -1 || source.indexOf("https") != -1){
				//source = "https://cors-anywhere.herokuapp.com/" + source;
			//}
			
			_s.vastXHR.open("get", source, true);
			_s.vastXHR.send();
		}
		
		_s.fixVmapTimes = function(duration){
			if(!duration || _s.isVmapTimesFixed){
				//_s.isVmapTimesFixed = true;
				return;
			}
		
			var ad;
			var timeStart;
		
			for(var i=0; i<_d.popupAds_ar.length; i++){
				ad = _d.popupAds_ar[i];
				if(String(ad['timeStart']).match(/%/ig)){
					timeStart = String(ad['timeStart']);
					timeStart = timeStart.substr(0, timeStart.length -1);
					timeStart = Math.round(Number(timeStart)/100 * duration);
					_d.popupAds_ar[i]['timeStart'] = timeStart;
				}
				
				_d.popupAds_ar[i]['timeEnd'] = _d.popupAds_ar[i]['timeStart'] + FWDEVPUtils.getSecondsFromString(_d.popupAds_ar[i]['duration']);
				if(i > 0){
					if(_d.popupAds_ar[i - 1]['timeStart'] == _d.popupAds_ar[i]['timeStart']){
						_d.popupAds_ar[i]['timeStart'] = Number(_d.popupAds_ar[i - 1]['timeEnd']) + 1;
						_d.popupAds_ar[i]['timeEnd'] = _d.popupAds_ar[i]['timeStart'] + (_d.popupAds_ar[0]['timeEnd'] - _d.popupAds_ar[0]['timeStart'])
					}
				}		
			}
		
			for(var i=0; i<_d.adsSource_ar.length; i++){
				ad = _d.adsSource_ar[i];
				if(String(ad['timeStart']).match(/%/ig)){
					timeStart = String(ad['timeStart']);
					timeStart = timeStart.substr(0, timeStart.length -1);
					timeStart = Math.round(Number(timeStart)/100 * duration);
					_d.adsSource_ar[i]['timeStart'] = timeStart;
				}else if(String(ad['timeStart']).toLowerCase() == 'end'){
					_d.adsSource_ar[i]['timeStart'] = duration - 1;
				}
			}
			_s.isVmapTimesFixed = true;
		}
		
		_s.init();
	};
	
	/* set prototype */
	FWDEVPVast.setPrototype = function(){
		FWDEVPVast.prototype = null;
		FWDEVPVast.prototype = new FWDEVPEventDispatcher("div");
	};
	FWDEVPVast.prototype = null;
	window.FWDEVPVast = FWDEVPVast;
}(window));
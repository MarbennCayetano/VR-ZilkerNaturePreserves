(function(){
    var script = {
 "propagateClick": false,
 "horizontalAlign": "left",
 "defaultVRPointer": "laser",
 "scripts": {
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "unregisterKey": function(key){  delete window[key]; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getKey": function(key){  return window[key]; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getFirstPlayListWithMedia": function(media, onlySelected){  var playLists = this.getPlayListsWithMedia(media, onlySelected); return playLists.length > 0 ? playLists[0] : undefined; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "registerKey": function(key, value){  window[key] = value; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getPlayListsWithMedia": function(media, onlySelected){  var result = []; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) result.push(playList); } return result; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "existsKey": function(key){  return key in window; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "setOverlayBehaviour": function(overlay, media, action, preventDoubleClick){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(preventDoubleClick){ if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 1000); } }; if(preventDoubleClick && window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getFirstPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = undefined; if(mediaDispatcher){ var playListsWithMedia = this.getPlayListsWithMedia(mediaDispatcher, true); playListDispatcher = playListsWithMedia.indexOf(playList) != -1 ? playList : (playListsWithMedia.length > 0 ? playListsWithMedia[0] : undefined); } if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } item.bind('begin', onBeginFunction, self); this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } }
 },
 "desktopMipmappingEnabled": false,
 "contentOpaque": false,
 "minHeight": 20,
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451], 'cardboardAvailable'); this.syncPlaylists([this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist,this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist,this.mainPlayList]); this.playList_164A18D0_10D8_23C2_416B_008D65E86F50.set('selectedIndex', 0)",
 "verticalAlign": "top",
 "downloadEnabled": false,
 "definitions": [{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_1",
 "height": 1620,
 "label": "PSX_20190715_202727",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_1.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_1_t.jpg",
 "class": "Photo"
},
{
 "id": "map_010A27D4_055F_CA60_41B5_0F10F6F3B206",
 "overlays": [
  "this.overlay_1AA2A67F_16AE_C51D_419C_BD875200B2F4",
  "this.overlay_18616ECD_16B1_C57D_4194_FA82A7C581A3",
  "this.overlay_19C5A820_16B3_CD23_41A9_BAD9F0077E15",
  "this.overlay_1969E783_16BE_C3E5_4192_354CF571D5E8",
  "this.overlay_0296E18D_16D6_BFFD_418B_034B0423BA41",
  "this.overlay_028B3903_16DE_4CE5_4164_202BC245EF02",
  "this.overlay_035EC68C_16F2_45E3_41B4_12BCB405AFEC",
  "this.overlay_34285EE4_277D_2AE5_41B1_DCB70221556B",
  "this.overlay_34E71BBA_2773_EB6D_41A9_0D5B6D2B14D7",
  "this.overlay_33DECA0B_2693_F523_4183_BFCEE3CCE0BB",
  "this.overlay_346D2E79_2FF3_2DEF_41BC_E7DB73E8C038",
  "this.overlay_343154F7_2F8D_3EE3_4182_485D0EA9300D",
  "this.overlay_7D9559BB_6E90_35D9_41D1_87F0F07B2124"
 ],
 "height": 1258,
 "label": "NaturePreservesReferenceMap",
 "minimumZoomFactor": 0.5,
 "initialZoomFactor": 1,
 "fieldOfViewOverlayOutsideOpacity": 0,
 "thumbnailUrl": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_t.png",
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "scaleMode": "fit_to_height",
 "fieldOfViewOverlayInsideOpacity": 0.4,
 "fieldOfViewOverlayOutsideColor": "#000000",
 "class": "Map",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 1360,
    "class": "ImageResourceLevel",
    "height": 1258,
    "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206.png"
   },
   {
    "width": 266,
    "class": "ImageResourceLevel",
    "tags": "preload",
    "height": 247,
    "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_lq.png"
   }
  ]
 },
 "width": 1360,
 "maximumZoomFactor": 1.2,
 "fieldOfViewOverlayRadiusScale": 0.1
},
{
 "id": "camera_16D6798D_10D8_2242_413D_3E801A2A82A8",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -69.94,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "photo_3173B13C_2F95_7765_41C4_97B76D4A8682",
 "height": 1620,
 "label": "PSX_20190715_210254",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_3173B13C_2F95_7765_41C4_97B76D4A8682.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_3173B13C_2F95_7765_41C4_97B76D4A8682_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_1778FA45_10D8_26C2_4190_5E922BE75D09",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -97.79,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "popup_64850133_747E_FC90_41DC_BF66732C9BBA",
 "yaw": -114.3,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 682,
    "url": "media/popup_64850133_747E_FC90_41DC_BF66732C9BBA_0_1.jpg"
   }
  ]
 },
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "rotationZ": 0,
 "rotationX": 0,
 "hfov": 14.86,
 "showDuration": 500,
 "rotationY": 0,
 "popupDistance": 100,
 "showEasing": "cubic_in",
 "pitch": -6.5,
 "popupMaxHeight": "95%",
 "hideEasing": "cubic_out",
 "hideDuration": 500
},
{
 "id": "camera_173B7AAB_10D8_2646_418D_7B1C58D3514E",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -77.04,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 110.85,
  "pitch": 6.08
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "camera_1663990E_10D8_225E_4187_CF8218602145",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 24.94,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "camera_17358ACD_10D8_27C2_4189_5669828ADC7E",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -40.86,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_19",
 "height": 1080,
 "label": "PSX_20190715_232012",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_19.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_19_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A839B55_2775_EB27_41AA_45F0A52C948E",
 "overlays": [
  "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_tcap0",
  "this.overlay_74F5A496_6FF0_13AB_41D6_9E3DC74C4085",
  "this.overlay_74CF55C7_6FF0_1DA9_41CB_C0D121DD39A5"
 ],
 "label": "Stairs",
 "thumbnailUrl": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 110.06,
   "yaw": 17.48,
   "distance": 1,
   "panorama": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -31.49,
   "yaw": -150.85,
   "distance": 1,
   "panorama": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 491.15,
   "angle": -161.16,
   "y": 576.27,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "camera_16179934_10D8_2242_4186_4C3B164606FD",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 80.03,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C",
 "overlays": [
  "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_tcap0",
  "this.overlay_7E0858EB_6E70_3379_41D3_25125636ADB0",
  "this.overlay_7EA0C1EE_6E70_157B_41CA_40A49112635D"
 ],
 "label": "Dry Creek Bed",
 "thumbnailUrl": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 121.92,
   "yaw": -32.64,
   "distance": 1,
   "panorama": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 664.13,
   "angle": -159.13,
   "y": 759.18,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_7",
 "height": 1080,
 "label": "PSX_20190715_191428",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_7.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_7_t.jpg",
 "class": "Photo"
},
{
 "id": "playList_164A18D0_10D8_23C2_416B_008D65E86F50",
 "class": "PlayList",
 "items": [
  {
   "media": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206",
   "class": "MapPlayListItem",
   "player": "this.MapViewerMapPlayer",
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')"
  }
 ]
},
{
 "id": "photo_16736589_1BDB_F204_4197_B10E10959ADF",
 "height": 1620,
 "label": "PSX_20190715_172515",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_16736589_1BDB_F204_4197_B10E10959ADF.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_16736589_1BDB_F204_4197_B10E10959ADF_t.jpg",
 "class": "Photo"
},
{
 "id": "ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist",
 "class": "PlayList",
 "items": [
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 0, 1)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_camera",
   "media": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 1, 2)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_camera",
   "media": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 2, 3)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301_camera",
   "media": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 3, 4)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_camera",
   "media": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 4, 5)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887_camera",
   "media": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 5, 6)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_camera",
   "media": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 6, 7)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_camera",
   "media": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 7, 8)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_camera",
   "media": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 8, 9)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_camera",
   "media": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 9, 10)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_camera",
   "media": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 10, 11)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_camera",
   "media": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 11, 12)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_camera",
   "media": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D"
  },
  {
   "player": "this.MainViewerPanoramaPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 12, 0)",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_camera",
   "media": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E"
  }
 ]
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401",
 "label": "Rock Roses Critters",
 "playList": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_t.png"
},
{
 "id": "playList_FED2B532_F029_E246_41E8_C185DD7E474D",
 "items": [
  "this.albumitem_165628CB_10D8_23C6_4181_E053C3041F66"
 ],
 "change": "this.showComponentsWhileMouseOver(this.container_165618CB_10D8_23C6_4180_0088A1E879A6, [this.htmltext_1655B8CC_10D8_23C2_417D_EDEA7A3ECF42,this.component_165528CC_10D8_23C2_4161_3EB1DEF3D617,this.component_165508CC_10D8_23C2_4179_C79949E0FBD6], 2000)",
 "class": "PlayList"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_14",
 "height": 1493,
 "label": "PSX_20190715_212516",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_14.jpg"
   }
  ]
 },
 "width": 1005,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_14_t.jpg",
 "class": "Photo"
},
{
 "id": "ImageResource_649ECD55_7472_A490_41B0_D29C1BB9CB22",
 "class": "ImageResource",
 "levels": [
  {
   "width": 1620,
   "class": "ImageResourceLevel",
   "height": 1080,
   "url": "media/popup_64850133_747E_FC90_41DC_BF66732C9BBA_0_0.jpg"
  },
  {
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 682,
   "url": "media/popup_64850133_747E_FC90_41DC_BF66732C9BBA_0_1.jpg"
  },
  {
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 341,
   "url": "media/popup_64850133_747E_FC90_41DC_BF66732C9BBA_0_2.jpg"
  }
 ]
},
{
 "id": "panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -7.81,
  "pitch": -3.36
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "camera_175ECA20_10D8_2642_4176_80BDF29A7F40",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -162.52,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50_2",
 "height": 1620,
 "label": "PSX_20190715_231830",
 "duration": 5000,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_2.jpg"
   }
  ]
 },
 "width": 1080,
 "data": "Setting 360 camera in creek",
 "thumbnailUrl": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_2_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_16C7199F_10D8_227E_4169_B5CD7B3EB31F",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 148.51,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_15",
 "height": 1080,
 "label": "PSX_20190715_225739",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_15.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_15_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_16F7B9B1_10D8_2242_4159_1E326FEA59B2",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 15.62,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "propagateClick": false,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titleFontSize": "1.29vmin",
 "titleFontFamily": "Arial",
 "contentOpaque": false,
 "minHeight": 20,
 "closeButtonBackgroundColor": [],
 "verticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonIconLineWidth": 2,
 "minWidth": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "paddingRight": 0,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "paddingLeft": 0,
 "closeButtonBorderRadius": 11,
 "titlePaddingLeft": 5,
 "shadowOpacity": 0.5,
 "modal": true,
 "closeButtonRollOverBackgroundColor": [],
 "backgroundColor": [],
 "shadowBlurRadius": 6,
 "headerPaddingBottom": 5,
 "titlePaddingTop": 5,
 "bodyBackgroundOpacity": 1,
 "scrollBarWidth": 10,
 "titleTextDecoration": "none",
 "shadow": true,
 "borderRadius": 5,
 "veilColorRatios": [
  0,
  1
 ],
 "children": [
  "this.container_165618CB_10D8_23C6_4180_0088A1E879A6"
 ],
 "closeButtonIconHeight": 20,
 "title": "",
 "backgroundColorRatios": [],
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowSpread": 1,
 "headerPaddingLeft": 10,
 "scrollBarOpacity": 0.5,
 "bodyBorderColor": "#000000",
 "layout": "vertical",
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#B2B2B2",
 "footerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "backgroundOpacity": 1,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingRight": 5,
 "shadowColor": "#000000",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "footerHeight": 5,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerPaddingTop": 10,
 "titleFontWeight": "normal",
 "headerBackgroundColorDirection": "vertical",
 "shadowVerticalLength": 0,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "overflow": "scroll",
 "width": 400,
 "titlePaddingBottom": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "bodyPaddingRight": 0,
 "titleFontStyle": "normal",
 "bodyBackgroundColorDirection": "vertical",
 "id": "window_CA10627F_CF65_79DD_41CB_F97BBD5CF7A2",
 "gap": 10,
 "height": 600,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "class": "Window",
 "headerPaddingRight": 0,
 "bodyPaddingTop": 0,
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "headerBorderColor": "#000000",
 "bodyPaddingBottom": 0,
 "bodyBorderSize": 0,
 "titleFontColor": "#000000",
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColor": [
  "#999999",
  "#999999",
  "#999999"
 ],
 "closeButtonBackgroundColorRatios": [],
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "headerBackgroundOpacity": 0,
 "veilColorDirection": "horizontal",
 "closeButtonPressedIconLineWidth": 3,
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "Window19662"
 }
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1",
 "height": 1080,
 "label": "PSX_20190715_164717",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1_t.jpg",
 "class": "Photo"
},
{
 "id": "playList_1649E8D1_10D8_23C2_4178_F26A6AE7BAF8",
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "player": "this.MainViewerPhotoAlbumPlayer",
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401"
  }
 ]
},
{
 "id": "photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695",
 "height": 1080,
 "label": "PSX_20190715_231505",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -104.4,
  "pitch": -10.82
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "viewerArea": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C"
},
{
 "id": "photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB",
 "height": 1080,
 "label": "PSX_20190715_205145",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB.jpg"
   }
  ]
 },
 "width": 1592,
 "duration": 5000,
 "thumbnailUrl": "media/photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_171ADA68_10D8_26C2_4189_ACA15C2E1F12",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -149.35,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_16",
 "height": 1080,
 "label": "PSX_20190715_230256",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_16.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_16_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -95.09,
  "pitch": -11.33
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6",
 "overlays": [
  "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_tcap0",
  "this.overlay_727070B4_6FF0_13EF_41DA_5456B62490EF",
  "this.overlay_711D0677_6FF0_1F69_41CD_8D6B359ADB7C"
 ],
 "label": "Spanish Moss",
 "thumbnailUrl": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 17.48,
   "yaw": 139.14,
   "distance": 1,
   "panorama": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -150.85,
   "yaw": -31.49,
   "distance": 1,
   "panorama": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 545.09,
   "angle": -158.62,
   "y": 595.67,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "photo_31736C3B_2F95_2D63_41C2_62475673F4B8",
 "height": 1620,
 "label": "PSX_20190715_230953",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31736C3B_2F95_2D63_41C2_62475673F4B8.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31736C3B_2F95_2D63_41C2_62475673F4B8_t.jpg",
 "class": "Photo"
},
{
 "id": "playList_FECCC530_F029_E242_41EB_8BA096AA369E",
 "items": [
  "this.albumitem_165008C9_10D8_23C2_4187_5FC9E126B8B3"
 ],
 "change": "this.showComponentsWhileMouseOver(this.container_1657E8C9_10D8_23C2_412A_D2AC0ECF639C, [this.htmltext_165778CA_10D8_23C6_4189_89F2468CFE6F,this.component_1656E8CA_10D8_23C6_418C_A5A31DCC9765,this.component_1656D8CA_10D8_23C6_4180_490FB11D445B], 2000)",
 "class": "PlayList"
},
{
 "id": "mainPlayList",
 "class": "PlayList",
 "items": [
  "this.PanoramaPlayListItem_1648B8D2_10D8_23C6_4179_A6AFA07EC7DA",
  "this.PanoramaPlayListItem_164818D2_10D8_23C6_4186_4B799A29C0A4",
  "this.PanoramaPlayListItem_164F78D3_10D8_23C6_418C_DF0FC97102F9",
  "this.PanoramaPlayListItem_164ED8D3_10D8_23C6_418E_665BAD3F31D6",
  "this.PanoramaPlayListItem_164FD8D4_10D8_23C2_4184_1303BCAB65C7",
  "this.PanoramaPlayListItem_164F48D5_10D8_23C2_417F_389B5AE6E6BC",
  "this.PanoramaPlayListItem_164EB8D5_10D8_23C2_418D_D01E10D6B385",
  "this.PanoramaPlayListItem_164E28D6_10D8_23CE_4185_F800BB1F0E84",
  "this.PanoramaPlayListItem_164D78D6_10D8_23CE_416D_A6F61680760E",
  "this.PanoramaPlayListItem_164CF8D7_10D8_23CE_418F_D779FF87D505",
  "this.PanoramaPlayListItem_164C68D7_10D8_23CE_4168_ACCD478D0D0F",
  "this.PanoramaPlayListItem_1643B8D8_10D8_23C2_416A_19394A0B47A0",
  "this.PanoramaPlayListItem_164328D9_10D8_23C2_4188_ADE4A28C21EC"
 ]
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1",
 "height": 1080,
 "label": "PSX_20190715_231505",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_3172C8A6_2F95_7562_41AA_718D6950386C",
 "height": 1620,
 "label": "PSX_20190715_211440",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_3172C8A6_2F95_7562_41AA_718D6950386C.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_3172C8A6_2F95_7562_41AA_718D6950386C_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_1619B922_10D8_2246_4148_46C01DA4B17C",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -149.13,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D",
 "overlays": [
  "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_tcap0",
  "this.overlay_72BB42AE_6FB0_17FB_41D9_8E49056B196A",
  "this.overlay_72830C1C_6FB0_12DF_41C6_F63EEF0AE0A2",
  "this.overlay_66633ED6_7476_A590_41DA_BD535D20E01D",
  "this.popup_6747CFB6_7475_A390_41DB_B25639C60B0F"
 ],
 "label": "Cliff Face",
 "thumbnailUrl": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 102.96,
   "yaw": -5.47,
   "distance": 1,
   "panorama": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 139.14,
   "yaw": 17.48,
   "distance": 1,
   "panorama": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 550.29,
   "angle": -156.61,
   "y": 496.2,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E",
 "overlays": [
  "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_tcap0",
  "this.overlay_72D56459_6F90_3359_418D_582929A430CC",
  "this.overlay_707ED8CC_6F90_13BF_419D_7949D5F805DF",
  "this.overlay_C8E890AC_CF5F_1963_41D5_843EED445BEC",
  "this.overlay_C834EC9C_CF5F_0923_41CF_4B4EC0758149"
 ],
 "label": "Creek",
 "thumbnailUrl": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -164.38,
   "yaw": 30.87,
   "distance": 1,
   "panorama": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -5.47,
   "yaw": 102.96,
   "distance": 1,
   "panorama": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 720.37,
   "angle": -159.87,
   "y": 583.6,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "ImageResource_66B66150_7473_DC90_41DC_22322829086C",
 "class": "ImageResource",
 "levels": [
  {
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 1620,
   "url": "media/popup_6747CFB6_7475_A390_41DB_B25639C60B0F_0_0.jpg"
  },
  {
   "width": 682,
   "class": "ImageResourceLevel",
   "height": 1024,
   "url": "media/popup_6747CFB6_7475_A390_41DB_B25639C60B0F_0_1.jpg"
  },
  {
   "width": 341,
   "class": "ImageResourceLevel",
   "height": 512,
   "url": "media/popup_6747CFB6_7475_A390_41DB_B25639C60B0F_0_2.jpg"
  }
 ]
},
{
 "id": "camera_160E3947_10D8_22CE_418F_B87573C2C75F",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -162.52,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2A587C82_2777_2D1D_415B_1535451C4887_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 40.66,
  "pitch": -11.08
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "ImageResource_AE69E0A7_B727_396D_41D4_C455ABE8E287",
 "class": "ImageResource",
 "levels": [
  {
   "width": 1620,
   "class": "ImageResourceLevel",
   "height": 1080,
   "url": "media/popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542_0_0.jpg"
  },
  {
   "width": 1024,
   "class": "ImageResourceLevel",
   "height": 682,
   "url": "media/popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542_0_1.jpg"
  },
  {
   "width": 512,
   "class": "ImageResourceLevel",
   "height": 341,
   "url": "media/popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542_0_2.jpg"
  }
 ]
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_13",
 "height": 1080,
 "label": "PSX_20190715_212308",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_13.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_13_t.jpg",
 "class": "Photo"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_17",
 "height": 1620,
 "label": "PSX_20190715_230552",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_17.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_17_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_168C69E9_10D8_25C2_4180_B73DF9770440",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 169.17,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_5",
 "height": 1620,
 "label": "PSX_20190715_202727",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_5.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_5_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_169249D8_10D8_25C2_418D_86ED1C5E46BC",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -131.53,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 148.32,
  "pitch": 2.84
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_3",
 "height": 1620,
 "label": "PSX_20190715_191630",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_3.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_3_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B",
 "height": 1620,
 "label": "PSX_20190715_211049",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A49533A_2775_3B6D_41B2_C4785C51308E",
 "overlays": [
  "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_tcap0",
  "this.overlay_75D02DFE_6F90_2D5B_41D7_8BDAFB5ADD6F",
  "this.overlay_73822CC3_6F91_F3A9_41BE_B7A35648B3B3",
  "this.overlay_ABC5265A_B725_1927_41DE_679A254066B9"
 ],
 "label": "Rock Roses",
 "thumbnailUrl": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 48.47,
   "yaw": -81.99,
   "distance": 1,
   "panorama": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -10.83,
   "yaw": 31.02,
   "distance": 1,
   "panorama": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 518.81,
   "angle": -151.47,
   "y": 657.26,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_8",
 "height": 1620,
 "label": "PSX_20190715_191903",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_8.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_8_t.jpg",
 "class": "Photo"
},
{
 "id": "playList_FEC68515_F029_E242_41D0_FEB3446DBF09",
 "items": [
  "this.albumitem_165EB8C1_10D8_23C2_4184_0CA0114EDFD9"
 ],
 "change": "this.showComponentsWhileMouseOver(this.container_165E98C1_10D8_23C2_4174_6A88702EC8C8, [this.htmltext_165E38C2_10D8_23C6_4190_5DE11AB21428,this.component_165DA8C3_10D8_23C6_4170_5B45245A7B06,this.component_165D98C3_10D8_23C6_4190_49BDEEE29487], 2000)",
 "class": "PlayList"
},
{
 "id": "photo_31745018_2F95_152D_41AB_FD0BA7C83181",
 "height": 1080,
 "label": "PSX_20190715_222933",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31745018_2F95_152D_41AB_FD0BA7C83181.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31745018_2F95_152D_41AB_FD0BA7C83181_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_9",
 "height": 742,
 "label": "PSX_20190715_210605",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_9.jpg"
   }
  ]
 },
 "width": 1125,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_9_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5",
 "overlays": [
  "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_tcap0",
  "this.overlay_741CE97C_6F90_155F_41C4_99743EE74010",
  "this.overlay_7443EF0C_6FEF_EEBF_41AF_43366FD0846D"
 ],
 "label": "Lookout Point Area",
 "thumbnailUrl": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 30.65,
   "yaw": -99.97,
   "distance": 1,
   "panorama": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 149.47,
   "yaw": -11.59,
   "distance": 1,
   "panorama": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 453.3,
   "angle": -158.8,
   "y": 607.18,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "MainViewerPhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "viewerArea": "this.MainViewer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_0",
 "height": 1080,
 "label": "PSX_20190715_164943",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_0.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_0_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_C3E14C78_F165_09E3_41E3_9B94D6640E64",
 "height": 1620,
 "label": "PSX_20190715_231642",
 "duration": 5000,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_C3E14C78_F165_09E3_41E3_9B94D6640E64.jpg"
   }
  ]
 },
 "width": 1080,
 "data": "360 camera submerged",
 "thumbnailUrl": "media/photo_C3E14C78_F165_09E3_41E3_9B94D6640E64_t.jpg",
 "class": "Photo"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_2",
 "height": 1080,
 "label": "PSX_20190715_172841",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_2.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_2_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_174F2A34_10D8_2642_418D_3D0F13C674DD",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 29.15,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "playList_164988D1_10D8_23C2_4190_37592BBF4824",
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "player": "this.MainViewerPhotoAlbumPlayer",
   "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079"
  }
 ]
},
{
 "id": "camera_16AD2A0C_10D8_2642_4152_16F58C66C628",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -148.98,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079",
 "label": "Pond2",
 "playList": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_t.png"
},
{
 "id": "popup_6747CFB6_7475_A390_41DB_B25639C60B0F",
 "yaw": 116.84,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 682,
    "class": "ImageResourceLevel",
    "height": 1024,
    "url": "media/popup_6747CFB6_7475_A390_41DB_B25639C60B0F_0_1.jpg"
   }
  ]
 },
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "rotationZ": 0,
 "rotationX": 0,
 "hfov": 9.6,
 "showDuration": 500,
 "rotationY": 0,
 "popupDistance": 100,
 "showEasing": "cubic_in",
 "pitch": 14.99,
 "popupMaxHeight": "95%",
 "hideEasing": "cubic_out",
 "hideDuration": 500
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_0",
 "height": 873,
 "label": "PSX_20190715_170236",
 "duration": 5000,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_0.jpg"
   }
  ]
 },
 "width": 873,
 "data": "Testing Description Area",
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_0_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E",
 "height": 1076,
 "label": "PSX_20190715_233116",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E.jpg"
   }
  ]
 },
 "width": 1415,
 "duration": 5000,
 "thumbnailUrl": "media/photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_17696A56_10D8_26CE_4191_52BC12B9E3CE",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 97.25,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC",
 "label": "Photo Shoot Prep",
 "playList": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_t.png"
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_2",
 "height": 784,
 "label": "PSX_20190715_203325",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_2.jpg"
   }
  ]
 },
 "width": 1149,
 "duration": 5000,
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_2_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD",
 "height": 1620,
 "label": "PSX_20190715_204807",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BE02603_2777_FD20_41C2_33930A820301",
 "overlays": [
  "this.panorama_2BE02603_2777_FD20_41C2_33930A820301_tcap0",
  "this.overlay_7CFD44BD_6E70_13D9_41C5_325C2A5F9C67",
  "this.overlay_7F26D2BC_6E70_17DF_418C_6CC8B91FE33E"
 ],
 "label": "Fork1",
 "thumbnailUrl": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -155.06,
   "yaw": 82.21,
   "distance": 1,
   "panorama": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 30.87,
   "yaw": -164.38,
   "distance": 1,
   "panorama": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 654.81,
   "angle": -159.47,
   "y": 708.6,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "camera_16384959_10D8_22C2_418A_1C69AEDE40B7",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -141.1,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_1",
 "height": 1080,
 "label": "PSX_20190715_172047",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_1.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_1_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_317FAD99_2F95_6F2F_41BA_141EA18567B3",
 "height": 1080,
 "label": "PSX_20190715_212138",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_317FAD99_2F95_6F2F_41BA_141EA18567B3.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_317FAD99_2F95_6F2F_41BA_141EA18567B3_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -118.72,
  "pitch": -1.16
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_10",
 "height": 1620,
 "label": "PSX_20190715_204139",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_10.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_10_t.jpg",
 "class": "Photo"
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_0",
 "height": 1080,
 "label": "PSX_20190715_193720",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_0.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_0_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_6",
 "height": 784,
 "label": "PSX_20190715_203325",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_6.jpg"
   }
  ]
 },
 "width": 1149,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_6_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_170B3A89_10D8_2642_4181_9AA37F31D728",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -30.53,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "photo_31753761_2F95_1B1F_41BE_312E7D761EAC",
 "height": 1620,
 "label": "PSX_20190715_224748",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31753761_2F95_1B1F_41BE_312E7D761EAC.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31753761_2F95_1B1F_41BE_312E7D761EAC_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_7",
 "height": 1620,
 "label": "PSX_20190715_204356",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_7.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_7_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_317269C7_2F95_1723_4191_79C8244B985E",
 "height": 1620,
 "label": "PSX_20190715_225119",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_317269C7_2F95_1723_4191_79C8244B985E.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_317269C7_2F95_1723_4191_79C8244B985E_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -137.5,
  "pitch": -11.26
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonCardboardView": "this.IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451",
 "mouseControlMode": "drag_acceleration",
 "touchControlMode": "drag_rotation",
 "class": "PanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true
},
{
 "id": "camera_162B096B_10D8_22C6_4190_8EE9C94EA87E",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 98.01,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26",
 "label": "Scenic",
 "playList": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_t.png"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_17",
 "height": 1620,
 "label": "PSX_20190715_224259",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_17.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_17_t.jpg",
 "class": "Photo"
},
{
 "propagateClick": false,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titleFontSize": "1.29vmin",
 "titleFontFamily": "Arial",
 "contentOpaque": false,
 "minHeight": 20,
 "closeButtonBackgroundColor": [],
 "verticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonIconLineWidth": 2,
 "minWidth": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "paddingRight": 0,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "paddingLeft": 0,
 "closeButtonBorderRadius": 11,
 "titlePaddingLeft": 5,
 "shadowOpacity": 0.5,
 "modal": true,
 "closeButtonRollOverBackgroundColor": [],
 "backgroundColor": [],
 "shadowBlurRadius": 6,
 "headerPaddingBottom": 5,
 "titlePaddingTop": 5,
 "bodyBackgroundOpacity": 1,
 "scrollBarWidth": 10,
 "titleTextDecoration": "none",
 "shadow": true,
 "borderRadius": 5,
 "veilColorRatios": [
  0,
  1
 ],
 "children": [
  "this.container_1657E8C9_10D8_23C2_412A_D2AC0ECF639C"
 ],
 "closeButtonIconHeight": 20,
 "title": "",
 "backgroundColorRatios": [],
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowSpread": 1,
 "headerPaddingLeft": 10,
 "scrollBarOpacity": 0.5,
 "bodyBorderColor": "#000000",
 "layout": "vertical",
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#B2B2B2",
 "footerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "backgroundOpacity": 1,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingRight": 5,
 "shadowColor": "#000000",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "footerHeight": 5,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerPaddingTop": 10,
 "titleFontWeight": "normal",
 "headerBackgroundColorDirection": "vertical",
 "shadowVerticalLength": 0,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "overflow": "scroll",
 "width": 400,
 "titlePaddingBottom": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "bodyPaddingRight": 0,
 "titleFontStyle": "normal",
 "bodyBackgroundColorDirection": "vertical",
 "id": "window_CAED3B8D_CF65_0F3D_41D9_4876B53DBF98",
 "gap": 10,
 "height": 600,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "class": "Window",
 "headerPaddingRight": 0,
 "bodyPaddingTop": 0,
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "headerBorderColor": "#000000",
 "bodyPaddingBottom": 0,
 "bodyBorderSize": 0,
 "titleFontColor": "#000000",
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColor": [
  "#999999",
  "#999999",
  "#999999"
 ],
 "closeButtonBackgroundColorRatios": [],
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "headerBackgroundOpacity": 0,
 "veilColorDirection": "horizontal",
 "closeButtonPressedIconLineWidth": 3,
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "Window20217"
 }
},
{
 "id": "album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0",
 "height": 1080,
 "label": "PSX_20190715_185423",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_12",
 "height": 1620,
 "label": "PSX_20190715_222743",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_12.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_12_t.jpg",
 "class": "Photo"
},
{
 "id": "album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9",
 "label": "Candid",
 "playList": "this.album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_t.png"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_16",
 "height": 1080,
 "label": "PSX_20190715_223942",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_16.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_16_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 121.12,
  "pitch": -20.68
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_10",
 "height": 1080,
 "label": "PSX_20190715_211715",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_10.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_10_t.jpg",
 "class": "Photo"
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0",
 "height": 1080,
 "label": "PSX_20190715_230256",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A",
 "height": 1620,
 "label": "PSX_20190715_231830",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_8",
 "height": 1620,
 "label": "PSX_20190715_204929",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_8.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_8_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_173BC8EF_1BDA_121C_41BB_234A0345A49C",
 "height": 1080,
 "label": "PSX_20190715_203027",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_173BC8EF_1BDA_121C_41BB_234A0345A49C.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_173BC8EF_1BDA_121C_41BB_234A0345A49C_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_31729630_2F95_7D7D_41B0_44A2B5C516E9",
 "height": 1080,
 "label": "PSX_20190715_211306",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31729630_2F95_7D7D_41B0_44A2B5C516E9.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31729630_2F95_7D7D_41B0_44A2B5C516E9_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 80.04,
  "pitch": 1.71
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "photo_31848902_2F95_171D_41B7_C159F68EAE74",
 "height": 1080,
 "label": "PSX_20190715_194022",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31848902_2F95_171D_41B7_C159F68EAE74.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31848902_2F95_171D_41B7_C159F68EAE74_t.jpg",
 "class": "Photo"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_1",
 "height": 1620,
 "label": "PSX_20190715_171902",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_1.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_1_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28",
 "height": 1620,
 "label": "PSX_20190715_224547",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28_t.jpg",
 "class": "Photo"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_6",
 "height": 1620,
 "label": "PSX_20190715_191227",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_6.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_6_t.jpg",
 "class": "Photo"
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50_0",
 "height": 1620,
 "label": "PSX_20190715_230552",
 "duration": 5000,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_0.jpg"
   }
  ]
 },
 "width": 1080,
 "data": "Creek",
 "thumbnailUrl": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_0_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_31CEEC58_2F95_6D2D_41C2_D00705969834",
 "height": 1080,
 "label": "PSX_20190715_204610",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_31CEEC58_2F95_6D2D_41C2_D00705969834.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_31CEEC58_2F95_6D2D_41C2_D00705969834_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_169131DD_1BE6_123C_41B7_7073C3019485",
 "height": 1620,
 "label": "PSX_20190715_210024",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_169131DD_1BE6_123C_41B7_7073C3019485.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_169131DD_1BE6_123C_41B7_7073C3019485_t.jpg",
 "class": "Photo"
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0",
 "height": 1080,
 "label": "PSX_20190715_164330",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_18",
 "height": 876,
 "label": "PSX_20190715_230808",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_18.jpg"
   }
  ]
 },
 "width": 1380,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_18_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_16E1F9C2_10D8_25C6_4151_F1AF348B4717",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 174.53,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "propagateClick": false,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titleFontSize": "1.29vmin",
 "titleFontFamily": "Arial",
 "contentOpaque": false,
 "minHeight": 20,
 "closeButtonBackgroundColor": [],
 "verticalAlign": "middle",
 "shadowHorizontalLength": 3,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonIconLineWidth": 2,
 "minWidth": 20,
 "closeButtonIconWidth": 20,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "paddingRight": 0,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "paddingLeft": 0,
 "closeButtonBorderRadius": 11,
 "titlePaddingLeft": 5,
 "shadowOpacity": 0.5,
 "modal": true,
 "closeButtonRollOverBackgroundColor": [],
 "backgroundColor": [],
 "shadowBlurRadius": 6,
 "headerPaddingBottom": 5,
 "titlePaddingTop": 5,
 "bodyBackgroundOpacity": 1,
 "scrollBarWidth": 10,
 "titleTextDecoration": "none",
 "shadow": true,
 "borderRadius": 5,
 "veilColorRatios": [
  0,
  1
 ],
 "children": [
  "this.container_165E98C1_10D8_23C2_4174_6A88702EC8C8"
 ],
 "closeButtonIconHeight": 20,
 "title": "",
 "backgroundColorRatios": [],
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowSpread": 1,
 "headerPaddingLeft": 10,
 "scrollBarOpacity": 0.5,
 "bodyBorderColor": "#000000",
 "layout": "vertical",
 "veilOpacity": 0.4,
 "closeButtonIconColor": "#B2B2B2",
 "footerBackgroundOpacity": 0,
 "headerBorderSize": 0,
 "backgroundOpacity": 1,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingRight": 5,
 "shadowColor": "#000000",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "footerHeight": 5,
 "closeButtonRollOverIconColor": "#FFFFFF",
 "headerPaddingTop": 10,
 "titleFontWeight": "normal",
 "headerBackgroundColorDirection": "vertical",
 "shadowVerticalLength": 0,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "overflow": "scroll",
 "width": 400,
 "titlePaddingBottom": 5,
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "bodyPaddingRight": 0,
 "titleFontStyle": "normal",
 "bodyBackgroundColorDirection": "vertical",
 "id": "window_AB6E3EA2_B72B_0967_41CA_469C0DC711D2",
 "gap": 10,
 "height": 600,
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "class": "Window",
 "headerPaddingRight": 0,
 "bodyPaddingTop": 0,
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "headerBorderColor": "#000000",
 "bodyPaddingBottom": 0,
 "bodyBorderSize": 0,
 "titleFontColor": "#000000",
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColor": [
  "#999999",
  "#999999",
  "#999999"
 ],
 "closeButtonBackgroundColorRatios": [],
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "headerBackgroundOpacity": 0,
 "veilColorDirection": "horizontal",
 "closeButtonPressedIconLineWidth": 3,
 "paddingBottom": 0,
 "scrollBarMargin": 2,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "Window11415"
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_9",
 "height": 1620,
 "label": "PSX_20190715_203549",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_9.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_9_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0",
 "overlays": [
  "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_tcap0",
  "this.overlay_7FFB1922_6E70_F2EB_41D4_93AF95F333C1",
  "this.overlay_7FB7D09A_6E70_13DB_41D3_ADC189CDECF0",
  "this.overlay_A76F6EB1_B125_0965_41D6_534E3D397B2F",
  "this.popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542"
 ],
 "label": "Cactus Patch",
 "thumbnailUrl": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 82.21,
   "yaw": -155.06,
   "distance": 1,
   "panorama": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -82.75,
   "yaw": 38.9,
   "distance": 1,
   "panorama": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 616.61,
   "angle": -156.16,
   "y": 699.28,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2",
 "height": 1080,
 "label": "PSX_20190715_165732",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2_t.jpg",
 "class": "Photo"
},
{
 "id": "MapViewerMapPlayer",
 "class": "MapPlayer",
 "viewerArea": "this.MapViewer",
 "movementMode": "constrained"
},
{
 "id": "panorama_2A587C82_2777_2D1D_415B_1535451C4887",
 "overlays": [
  "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887_tcap0",
  "this.overlay_7D10B969_6E70_1579_41DB_1E07EE198721",
  "this.overlay_7CA1175C_6E70_FD5F_41D5_19B492554547",
  "this.overlay_7CE58D22_6E90_12EB_41CF_F462E1ACCC26"
 ],
 "label": "Fork2",
 "thumbnailUrl": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 38.9,
   "yaw": -82.75,
   "distance": 1,
   "panorama": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -81.99,
   "yaw": 48.47,
   "distance": 1,
   "panorama": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 550.9,
   "angle": -155.85,
   "y": 708.6,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "playList_164A28D0_10D8_23C2_418F_7E6A87230920",
 "class": "PlayList",
 "items": [
  {
   "media": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206",
   "class": "MapPlayListItem",
   "player": "this.MapViewerMapPlayer",
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')"
  }
 ]
},
{
 "id": "photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21",
 "height": 1080,
 "label": "PSX_20190715_211715",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_3173926D_2F95_15E7_41B3_9B101F175342",
 "height": 1080,
 "label": "PSX_20190715_224133",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_3173926D_2F95_15E7_41B3_9B101F175342.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_3173926D_2F95_15E7_41B3_9B101F175342_t.jpg",
 "class": "Photo"
},
{
 "id": "camera_16BCA9FB_10D8_25C6_4182_F7F21F22C22F",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 168.41,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE",
 "overlays": [
  "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_tcap0",
  "this.overlay_7C42CAAE_6E90_17FB_41CE_0ABE5B682598",
  "this.overlay_7C584779_6E90_3D59_419B_650F7DD4E19D"
 ],
 "label": "Stairs to Lookout Point",
 "thumbnailUrl": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -11.59,
   "yaw": 149.47,
   "distance": 1,
   "panorama": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 31.02,
   "yaw": -10.83,
   "distance": 1,
   "panorama": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 457.99,
   "angle": -161.5,
   "y": 646.71,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "playList_1649A8D1_10D8_23C2_4191_57AFD6CA4319",
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "player": "this.MainViewerPhotoAlbumPlayer",
   "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50"
  }
 ]
},
{
 "id": "camera_1624397C_10D8_22C2_418D_464D64864069",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -58.08,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_2",
 "height": 1080,
 "label": "PSX_20190715_191026",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_2.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_2_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -82.95,
  "pitch": -19.21
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_14",
 "height": 790,
 "label": "PSX_20190715_223524",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_14.jpg"
   }
  ]
 },
 "width": 1228,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_14_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA",
 "overlays": [
  "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0",
  "this.overlay_617CEB42_6E70_16AB_41D7_B65D455BAF0C"
 ],
 "label": "Entrance",
 "thumbnailUrl": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -32.64,
   "yaw": 121.92,
   "distance": 1,
   "panorama": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 715.93,
   "angle": -158.14,
   "y": 836.96,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "camera_17257AEE_10D8_27DF_4184_903A4C2C981A",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 147.36,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_12",
 "height": 1620,
 "label": "PSX_20190715_210820",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_12.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_12_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_4",
 "height": 1080,
 "label": "PSX_20190715_193720",
 "duration": 5000,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_4.jpg"
   }
  ]
 },
 "width": 1620,
 "data": "A bug!",
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_4_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_371B1A36_2F93_7565_419F_DC23C6E93CC3",
 "height": 1080,
 "label": "PSX_20190715_190730",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_371B1A36_2F93_7565_419F_DC23C6E93CC3.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_371B1A36_2F93_7565_419F_DC23C6E93CC3_t.jpg",
 "class": "Photo"
},
{
 "id": "photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA",
 "height": 1080,
 "label": "PSX_20190715_205717",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16",
 "overlays": [
  "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_tcap0",
  "this.overlay_7455B879_6FF0_1359_41BD_6E413BF66E0F",
  "this.overlay_74EF4D01_6FF0_32A9_41D2_110F46C58A6F",
  "this.overlay_6532C198_747D_BF90_41D0_16BC97C61C52",
  "this.popup_64850133_747E_FC90_41DC_BF66732C9BBA"
 ],
 "label": "Lookout Point Ledge",
 "thumbnailUrl": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_t.jpg",
 "pitch": 0,
 "class": "Panorama",
 "partial": false,
 "hfovMin": "135%",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -99.97,
   "yaw": 30.65,
   "distance": 1,
   "panorama": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 17.48,
   "yaw": 110.06,
   "distance": 1,
   "panorama": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E"
  }
 ],
 "hfov": 360,
 "mapLocations": [
  {
   "x": 472.09,
   "angle": -162.04,
   "y": 600.61,
   "class": "PanoramaMapLocation",
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "frames": [
  {
   "stereoCube": {
    "class": "ImageResource",
    "levels": [
     {
      "rowCount": 5,
      "width": 30720,
      "colCount": 60,
      "height": 2560,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/0/{row}_{column}.jpg"
     },
     {
      "rowCount": 3,
      "width": 18432,
      "colCount": 36,
      "height": 1536,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/1/{row}_{column}.jpg"
     },
     {
      "rowCount": 2,
      "width": 12288,
      "colCount": 24,
      "height": 1024,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/2/{row}_{column}.jpg"
     },
     {
      "rowCount": 1,
      "width": 6144,
      "colCount": 12,
      "height": 512,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/3/{row}_{column}.jpg"
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_t.jpg"
  }
 ],
 "hfovMax": 130
},
{
 "id": "photo_36333405_2FFD_1D27_41C2_A8850A963931",
 "height": 1620,
 "label": "PSX_20190715_222743",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/photo_36333405_2FFD_1D27_41C2_A8850A963931.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/photo_36333405_2FFD_1D27_41C2_A8850A963931_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_13",
 "height": 1620,
 "label": "PSX_20190715_223247",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_13.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_13_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_11",
 "height": 1620,
 "label": "PSX_20190715_212650",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_11.jpg"
   }
  ]
 },
 "width": 1080,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_11_t.jpg",
 "class": "Photo"
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50",
 "label": "Pond1",
 "playList": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_t.png"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946",
 "label": "Nature, Close Up",
 "playList": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_t.png"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_4",
 "height": 1080,
 "label": "PSX_20190715_190526",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_4.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_4_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2BE02603_2777_FD20_41C2_33930A820301_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 108.01,
  "pitch": -7.36
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_3",
 "height": 1080,
 "label": "PSX_20190715_190026",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_3.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_3_t.jpg",
 "class": "Photo"
},
{
 "id": "ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist",
 "class": "PlayList",
 "items": [
  {
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 0, 1)",
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 0, '#999999')",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946"
  },
  {
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 1, 2)",
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 1, '#999999')",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26"
  },
  {
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 2, 3)",
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 2, '#999999')",
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC"
  },
  {
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 3, 0)",
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 3, '#999999')",
   "media": "this.album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9"
  }
 ]
},
{
 "id": "popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542",
 "yaw": -57.37,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 1024,
    "class": "ImageResourceLevel",
    "height": 682,
    "url": "media/popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542_0_1.jpg"
   }
  ]
 },
 "popupMaxWidth": "95%",
 "class": "PopupPanoramaOverlay",
 "rotationZ": 0,
 "rotationX": 0,
 "hfov": 14.94,
 "showDuration": 500,
 "rotationY": 0,
 "popupDistance": 100,
 "showEasing": "cubic_in",
 "pitch": 2.21,
 "popupMaxHeight": "95%",
 "hideEasing": "cubic_out",
 "hideDuration": 500
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_11",
 "height": 1080,
 "label": "PSX_20190715_205404",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_11.jpg"
   }
  ]
 },
 "width": 1620,
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_11_t.jpg",
 "class": "Photo"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_15",
 "height": 796,
 "label": "PSX_20190715_223730",
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_15.jpg"
   }
  ]
 },
 "width": 1160,
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_15_t.jpg",
 "class": "Photo"
},
{
 "id": "panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 126.75,
  "pitch": 8.47
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 323,
    "easing": "linear",
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 }
},
{
 "propagateClick": false,
 "paddingBottom": 0,
 "contentOpaque": false,
 "minHeight": 1,
 "right": "0%",
 "tabsAlign": "normal",
 "selectedTabFontColor": "#FFFFFF",
 "tabsRollOverFontWeight": "bold",
 "shadowHorizontalLength": 3,
 "minWidth": 1,
 "borderColor": "#000000",
 "tabsPosition": "top",
 "paddingRight": 0,
 "paddingLeft": 0,
 "pagePaddingBottom": 0,
 "selectedTabFontWeight": "bold",
 "shadowOpacity": 0.5,
 "shadowBlurRadius": 6,
 "scrollBarWidth": 10,
 "tabsBackgroundColor": [
  "#CCCCCC"
 ],
 "borderRadius": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "tabsFontFamily": "Arial",
 "scrollBarOpacity": 0.5,
 "shadowSpread": 1,
 "top": "0%",
 "pagePaddingTop": 0,
 "tabsRollOverFontColor": "#000000",
 "scrollBarVisible": "rollOver",
 "selectedTabFontSize": "16px",
 "tabsBackgroundOpacity": 0.65,
 "backgroundOpacity": 0,
 "tabsRollOverBackgroundColor": [
  "#FFFFFF"
 ],
 "shadowColor": "#000000",
 "tabsTextDecoration": "none",
 "shadowVerticalLength": 0,
 "tabsSize": 32,
 "overflow": "visible",
 "tabsFontColor": "#333333",
 "tabsBackgroundColorRatios": [
  1
 ],
 "selectedTabBackgroundOpacity": 1,
 "width": "99.925%",
 "tabsFontWeight": "normal",
 "id": "TabPanel_EA372801_F8DB_22F3_41E4_0E3F42744A6D",
 "tabsFontSize": "14px",
 "tabsRollOverBackgroundOpacity": 0.78,
 "class": "TabPanel",
 "height": "100%",
 "paddingTop": 0,
 "selectedTabBackgroundColorRatios": [
  0
 ],
 "tabsFontStyle": "italic",
 "click": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98.bind('hide', function(e){ e.source.unbind('hide', arguments.callee, this); this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist.set('selectedIndex', -1); }, this); this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist.set('selectedIndex', 0)",
 "pagePaddingRight": 0,
 "pagePaddingLeft": 0,
 "borderSize": 1,
 "data": {
  "name": "TabPanel942"
 },
 "pages": [
  {
   "propagateClick": false,
   "horizontalAlign": "left",
   "contentOpaque": false,
   "minHeight": 20,
   "shadowColor": "#000000",
   "borderRadius": 0,
   "verticalAlign": "top",
   "shadowVerticalLength": 0,
   "minWidth": 20,
   "overflow": "scroll",
   "paddingLeft": 0,
   "width": "100%",
   "paddingRight": 0,
   "shadowOpacity": 0,
   "backgroundColor": [
    "#006699"
   ],
   "shadowBlurRadius": 6,
   "scrollBarWidth": 10,
   "gap": 10,
   "height": "100%",
   "class": "TabPanelPage",
   "children": [
    "this.MainViewer",
    "this.MapViewer",
    "this.Image_E9C82CBA_F8EA_E311_41E9_A6E55967A747",
    "this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10",
    "this.Image_1103C169_03B9_4620_4192_E72E4E37992D",
    "this.IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451",
    "this.Image_0F1988E8_1D38_F021_41B3_7097618BA3E7"
   ],
   "shadow": true,
   "paddingTop": 0,
   "label": "Zilker Nature Preserves",
   "backgroundColorRatios": [
    0
   ],
   "scrollBarColor": "#000000",
   "backgroundColorDirection": "vertical",
   "shadowSpread": 1,
   "borderSize": 0,
   "scrollBarOpacity": 0.5,
   "shadowHorizontalLength": 3,
   "scrollBarMargin": 2,
   "backgroundOpacity": 1,
   "creationPolicy": "inAdvance",
   "paddingBottom": 0,
   "layout": "absolute",
   "scrollBarVisible": "rollOver",
   "data": {
    "name": "TabPanelPage943"
   }
  },
  {
   "propagateClick": false,
   "horizontalAlign": "left",
   "contentOpaque": false,
   "minHeight": 20,
   "verticalAlign": "top",
   "minWidth": 20,
   "overflow": "scroll",
   "paddingLeft": 0,
   "width": "100%",
   "paddingRight": 0,
   "backgroundColor": [
    "#006699"
   ],
   "scrollBarWidth": 10,
   "gap": 10,
   "height": "100%",
   "borderRadius": 0,
   "class": "TabPanelPage",
   "children": [
    "this.Container_054E2CAE_1C2A_121C_41B5_BC9CB48187EA"
   ],
   "shadow": false,
   "paddingTop": 0,
   "label": "Zilker Nature Preserves Media",
   "backgroundColorRatios": [
    0
   ],
   "backgroundColorDirection": "vertical",
   "scrollBarColor": "#000000",
   "borderSize": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "TabPanelPage1538"
   },
   "scrollBarMargin": 2,
   "backgroundOpacity": 1,
   "creationPolicy": "inAdvance",
   "paddingBottom": 0,
   "layout": "absolute",
   "scrollBarVisible": "rollOver"
  },
  {
   "propagateClick": false,
   "horizontalAlign": "left",
   "contentOpaque": false,
   "minHeight": 20,
   "shadowColor": "#000000",
   "verticalAlign": "top",
   "shadowVerticalLength": 0,
   "borderRadius": 0,
   "minWidth": 20,
   "overflow": "scroll",
   "paddingLeft": 0,
   "width": "100%",
   "paddingRight": 0,
   "shadowOpacity": 0,
   "backgroundColor": [
    "#006699"
   ],
   "shadowBlurRadius": 6,
   "scrollBarWidth": 10,
   "gap": 10,
   "height": "100%",
   "class": "TabPanelPage",
   "children": [
    "this.HTMLText_119E6B44_03C9_3A60_417F_E649C6F59526"
   ],
   "shadow": true,
   "paddingTop": 0,
   "label": "About",
   "backgroundColorRatios": [
    0
   ],
   "scrollBarColor": "#000000",
   "backgroundColorDirection": "vertical",
   "shadowSpread": 1,
   "borderSize": 0,
   "scrollBarOpacity": 0.5,
   "shadowHorizontalLength": 3,
   "scrollBarMargin": 2,
   "backgroundOpacity": 1,
   "creationPolicy": "inAdvance",
   "paddingBottom": 0,
   "layout": "absolute",
   "scrollBarVisible": "rollOver",
   "data": {
    "name": "TabPanelPage1555"
   }
  }
 ],
 "scrollBarMargin": 2,
 "selectedTabBackgroundColor": [
  "#006699"
 ],
 "tabsRollOverBackgroundColorRatios": [
  1
 ]
},
{
 "propagateClick": false,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 350,
  "easing": "cubic_in_out"
 },
 "borderRadius": 0,
 "left": 0,
 "minHeight": 0,
 "right": 0,
 "minWidth": 0,
 "paddingLeft": 0,
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "id": "veilPopupPanorama",
 "class": "UIComponent",
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [
  0
 ],
 "visible": false,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "data": {
  "name": "UIComponent7139"
 },
 "top": 0,
 "backgroundOpacity": 0.55,
 "paddingBottom": 0,
 "bottom": 0
},
{
 "propagateClick": false,
 "borderRadius": 0,
 "left": 0,
 "minHeight": 0,
 "right": 0,
 "scaleMode": "custom",
 "minWidth": 0,
 "paddingLeft": 0,
 "paddingRight": 0,
 "backgroundColor": [],
 "id": "zoomImagePopupPanorama",
 "class": "ZoomImage",
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [],
 "visible": false,
 "backgroundColorDirection": "vertical",
 "borderSize": 0,
 "data": {
  "name": "ZoomImage7140"
 },
 "top": 0,
 "backgroundOpacity": 1,
 "paddingBottom": 0,
 "bottom": 0
},
{
 "textDecoration": "none",
 "propagateClick": false,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 350,
  "easing": "cubic_in_out"
 },
 "borderRadius": 0,
 "horizontalAlign": "center",
 "fontStyle": "normal",
 "minHeight": 0,
 "shadowColor": "#000000",
 "fontFamily": "Arial",
 "verticalAlign": "middle",
 "right": 10,
 "iconHeight": 20,
 "borderColor": "#000000",
 "iconLineWidth": 5,
 "minWidth": 0,
 "pressedIconColor": "#888888",
 "paddingLeft": 5,
 "paddingRight": 5,
 "backgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "id": "closeButtonPopupPanorama",
 "gap": 5,
 "class": "CloseButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 5,
 "fontColor": "#FFFFFF",
 "shadowBlurRadius": 6,
 "backgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "iconWidth": 20,
 "label": "",
 "visible": false,
 "backgroundColorDirection": "vertical",
 "rollOverIconColor": "#666666",
 "shadowSpread": 1,
 "iconColor": "#000000",
 "borderSize": 0,
 "data": {
  "name": "CloseButton7141"
 },
 "top": 10,
 "backgroundOpacity": 0.3,
 "fontWeight": "normal",
 "paddingBottom": 5,
 "iconBeforeLabel": true,
 "cursor": "hand",
 "fontSize": "1.29vmin",
 "layout": "horizontal"
},
{
 "id": "overlay_1AA2A67F_16AE_C51D_419C_BD875200B2F4",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "toolTip": "Entrance"
  }
 ],
 "image": {
  "x": 700.93,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_14.png"
    }
   ]
  },
  "y": 821.96,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 705.71,
  "height": 30,
  "y": 826.63,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_14_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_18616ECD_16B1_C57D_4194_FA82A7C581A3",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "toolTip": "Dry Creek Bed"
  }
 ],
 "image": {
  "x": 649.13,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_15.png"
    }
   ]
  },
  "y": 744.18,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 652.1,
  "height": 30,
  "y": 746.99,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_15_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_19C5A820_16B3_CD23_41A9_BAD9F0077E15",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "toolTip": "Cactus Patch"
  }
 ],
 "image": {
  "x": 601.61,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_16.png"
    }
   ]
  },
  "y": 684.28,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 606.45,
  "height": 30,
  "y": 689.03,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_16_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_1969E783_16BE_C3E5_4192_354CF571D5E8",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "toolTip": "Stairs to Lookout Point"
  }
 ],
 "image": {
  "x": 442.99,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_17.png"
    }
   ]
  },
  "y": 631.71,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 444.68,
  "height": 30,
  "y": 633.48,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_17_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_0296E18D_16D6_BFFD_418B_034B0423BA41",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "toolTip": "Stairs From Lookout Point"
  }
 ],
 "image": {
  "x": 476.15,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_19.png"
    }
   ]
  },
  "y": 561.27,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 479.32,
  "height": 30,
  "y": 564.63,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_19_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_028B3903_16DE_4CE5_4164_202BC245EF02",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "toolTip": "Cliff Face"
  }
 ],
 "image": {
  "x": 535.29,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_20.png"
    }
   ]
  },
  "y": 481.2,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 539.66,
  "height": 30,
  "y": 485.51,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_20_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_035EC68C_16F2_45E3_41B4_12BCB405AFEC",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "toolTip": "Mirror Pond"
  }
 ],
 "image": {
  "x": 705.37,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_21.png"
    }
   ]
  },
  "y": 568.6,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 709.68,
  "height": 30,
  "y": 572.9,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_21_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_34285EE4_277D_2AE5_41B1_DCB70221556B",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "toolTip": "Fork to Cactus Patch and Eanes Creek"
  }
 ],
 "image": {
  "x": 639.81,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_22.png"
    }
   ]
  },
  "y": 693.6,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 643.12,
  "height": 30,
  "y": 697.13,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_22_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_34E71BBA_2773_EB6D_41A9_0D5B6D2B14D7",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "toolTip": "Fork to Rock Roses and Spanish Moss"
  }
 ],
 "image": {
  "x": 535.9,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_23.png"
    }
   ]
  },
  "y": 693.6,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 539.11,
  "height": 30,
  "y": 697.13,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_23_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_33DECA0B_2693_F523_4183_BFCEE3CCE0BB",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "toolTip": "Spanish Moss"
  }
 ],
 "image": {
  "x": 530.09,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_24.png"
    }
   ]
  },
  "y": 580.67,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 533.11,
  "height": 30,
  "y": 583.6,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_24_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_346D2E79_2FF3_2DEF_41BC_E7DB73E8C038",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "toolTip": "Lookout Point Ledge"
  }
 ],
 "image": {
  "x": 462.09,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 20,
     "class": "ImageResourceLevel",
     "height": 20,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_27.png"
    }
   ]
  },
  "y": 590.61,
  "class": "HotspotMapOverlayImage",
  "height": 20,
  "width": 20
 },
 "map": {
  "width": 20,
  "x": 462.62,
  "height": 20,
  "y": 591.06,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_27_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_343154F7_2F8D_3EE3_4182_485D0EA9300D",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "toolTip": "Lookout Point Area"
  }
 ],
 "image": {
  "x": 443.3,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 20,
     "class": "ImageResourceLevel",
     "height": 20,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_28.png"
    }
   ]
  },
  "y": 597.18,
  "class": "HotspotMapOverlayImage",
  "height": 20,
  "width": 20
 },
 "map": {
  "width": 20,
  "x": 443.65,
  "height": 20,
  "y": 597.63,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_28_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_7D9559BB_6E90_35D9_41D1_87F0F07B2124",
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "toolTip": "Rock Roses"
  }
 ],
 "image": {
  "x": 503.81,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_29.png"
    }
   ]
  },
  "y": 642.26,
  "class": "HotspotMapOverlayImage",
  "height": 30,
  "width": 30
 },
 "map": {
  "width": 30,
  "x": 503.81,
  "height": 30,
  "y": 642.26,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_29_map.gif"
    }
   ]
  },
  "offsetX": 0
 },
 "rollOverDisplay": false,
 "class": "AreaHotspotMapOverlay",
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_74F5A496_6FF0_13AB_41D6_9E3DC74C4085",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.48,
   "hfov": 21.72,
   "pitch": -36.25
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16, this.camera_16D6798D_10D8_2242_413D_3E801A2A82A8); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "toolTip": "Lookout Point Ledge"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -36.25,
   "yaw": 17.48,
   "image": "this.AnimatedImageResource_72CA5C71_6FB0_3369_41CA_1ECE04903518",
   "hfov": 21.72,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_74CF55C7_6FF0_1DA9_41CB_C0D121DD39A5",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -150.85,
   "hfov": 19.15,
   "pitch": -44.67
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6, this.camera_16C7199F_10D8_227E_4169_B5CD7B3EB31F); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "toolTip": "Spanish Moss"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -44.67,
   "yaw": -150.85,
   "image": "this.AnimatedImageResource_72CA6C71_6FB0_3369_41B0_937980E85866",
   "hfov": 19.15,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_7E0858EB_6E70_3379_41D3_25125636ADB0",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -32.64,
   "hfov": 25.21,
   "pitch": -20.56
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA, this.camera_1624397C_10D8_22C2_418D_464D64864069); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "toolTip": "Entrance"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.56,
   "yaw": -32.64,
   "image": "this.AnimatedImageResource_7A4AB722_6E90_1EE8_41D0_7CF23A46D907",
   "hfov": 25.21,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7EA0C1EE_6E70_157B_41CA_40A49112635D",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 142.83,
   "hfov": 19.18,
   "pitch": -7.62
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "toolTip": "Fork - Cactus Patch and Eanes Creek"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -7.62,
   "yaw": 142.83,
   "image": "this.AnimatedImageResource_7A4A1723_6E90_1EE9_41D8_3F62D994AFA1",
   "hfov": 19.18,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.32",
     "zoomFactor": 1.1,
     "y": "0.69"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.34",
     "zoomFactor": 1.1,
     "y": "0.66"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_1"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.51",
     "zoomFactor": 1.1,
     "y": "0.36"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_2"
  }
 ]
},
{
 "id": "albumitem_165628CB_10D8_23C6_4181_E053C3041F66",
 "player": "this.viewer_uid165658CB_10D8_23C6_418F_B5D1F4B1DA7APhotoAlbumPlayer",
 "begin": "this.updateMediaLabelFromPlayList(this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList, this.htmltext_1655B8CC_10D8_23C2_417D_EDEA7A3ECF42, this.albumitem_165628CB_10D8_23C6_4181_E053C3041F66); this.loopAlbum(this.playList_FED2B532_F029_E246_41E8_C185DD7E474D, 0)",
 "class": "PhotoAlbumPlayListItem",
 "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079"
},
{
 "propagateClick": false,
 "horizontalAlign": "left",
 "contentOpaque": false,
 "minHeight": 20,
 "verticalAlign": "top",
 "minWidth": 20,
 "overflow": "scroll",
 "paddingLeft": 0,
 "width": "100%",
 "paddingRight": 0,
 "backgroundColor": [],
 "id": "container_165618CB_10D8_23C6_4180_0088A1E879A6",
 "scrollBarWidth": 10,
 "gap": 10,
 "height": "100%",
 "borderRadius": 0,
 "class": "Container",
 "children": [
  "this.viewer_uid165658CB_10D8_23C6_418F_B5D1F4B1DA7A",
  {
   "propagateClick": false,
   "horizontalAlign": "left",
   "scrollBarVisible": "rollOver",
   "borderRadius": 0,
   "left": 0,
   "contentOpaque": true,
   "minHeight": 20,
   "verticalAlign": "bottom",
   "right": 0,
   "minWidth": 20,
   "overflow": "scroll",
   "paddingLeft": 0,
   "paddingRight": 0,
   "backgroundColor": [],
   "scrollBarWidth": 7,
   "gap": 10,
   "height": "30%",
   "class": "Container",
   "children": [
    "this.htmltext_1655B8CC_10D8_23C2_417D_EDEA7A3ECF42"
   ],
   "shadow": false,
   "paddingTop": 0,
   "backgroundColorRatios": [],
   "backgroundColorDirection": "vertical",
   "scrollBarColor": "#FFFFFF",
   "borderSize": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container7135"
   },
   "scrollBarMargin": 2,
   "backgroundOpacity": 0.3,
   "paddingBottom": 0,
   "layout": "vertical",
   "bottom": 0
  },
  "this.component_165528CC_10D8_23C2_4161_3EB1DEF3D617",
  "this.component_165508CC_10D8_23C2_4179_C79949E0FBD6"
 ],
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [],
 "backgroundColorDirection": "vertical",
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container7134"
 },
 "scrollBarMargin": 2,
 "backgroundOpacity": 0.3,
 "paddingBottom": 0,
 "layout": "absolute",
 "scrollBarVisible": "rollOver"
},
{
 "propagateClick": true,
 "horizontalAlign": "center",
 "minHeight": 50,
 "borderRadius": 0,
 "verticalAlign": "middle",
 "right": 10,
 "minWidth": 50,
 "paddingLeft": 0,
 "width": "14.22%",
 "paddingRight": 0,
 "id": "IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "pressedIconURL": "skin/IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF_pressed.png",
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "maxWidth": 60,
 "maxHeight": 60,
 "borderSize": 0,
 "rollOverIconURL": "skin/IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF_rollover.png",
 "iconURL": "skin/IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF.png",
 "data": {
  "name": "IconButton >"
 },
 "top": "20%",
 "transparencyActive": false,
 "bottom": "20%",
 "paddingBottom": 0,
 "cursor": "hand",
 "backgroundOpacity": 0
},
{
 "propagateClick": false,
 "toolTipShadowColor": "#333333",
 "left": "0%",
 "vrPointerColor": "#FFFFFF",
 "minHeight": 1,
 "playbackBarHeadBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "minWidth": 1,
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "paddingRight": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#0066FF",
 "playbackBarHeadOpacity": 1,
 "progressBorderRadius": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "borderRadius": 0,
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipTextShadowBlurRadius": 3,
 "progressBottom": 2,
 "progressBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "playbackBarProgressBorderSize": 0,
 "toolTipOpacity": 1,
 "playbackBarBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBorderColor": "#FFFFFF",
 "top": "0%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBarBorderRadius": 0,
 "toolTipFontSize": 12,
 "playbackBarBorderRadius": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "transitionMode": "blending",
 "progressLeft": 0,
 "width": "100%",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingLeft": 6,
 "playbackBarBackgroundOpacity": 1,
 "id": "ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98",
 "playbackBarBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipDisplayTime": 600,
 "class": "ViewerArea",
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowColor": "#000000",
 "paddingTop": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "progressRight": 0,
 "playbackBarRight": 0,
 "toolTipPaddingRight": 6,
 "toolTipFontStyle": "normal",
 "progressBarBorderSize": 0,
 "progressOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarProgressBorderRadius": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "paddingBottom": 0,
 "toolTipBorderRadius": 3,
 "playbackBarOpacity": 1
},
{
 "propagateClick": true,
 "horizontalAlign": "center",
 "left": 10,
 "minHeight": 50,
 "borderRadius": 0,
 "verticalAlign": "middle",
 "minWidth": 50,
 "paddingLeft": 0,
 "width": "14.22%",
 "paddingRight": 0,
 "id": "IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "pressedIconURL": "skin/IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C_pressed.png",
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "maxWidth": 60,
 "maxHeight": 60,
 "borderSize": 0,
 "rollOverIconURL": "skin/IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C_rollover.png",
 "iconURL": "skin/IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C.png",
 "data": {
  "name": "IconButton <"
 },
 "top": "20%",
 "transparencyActive": false,
 "bottom": "20%",
 "paddingBottom": 0,
 "cursor": "hand",
 "backgroundOpacity": 0
},
{
 "id": "panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_727070B4_6FF0_13EF_41DA_5456B62490EF",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -31.49,
   "hfov": 19.77,
   "pitch": -42.75
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E, this.camera_174F2A34_10D8_2642_418D_3D0F13C674DD); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "toolTip": "Stairs - Lookout Point Ledge"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -42.75,
   "yaw": -31.49,
   "image": "this.AnimatedImageResource_72CBFC72_6FB0_336B_41D9_F088AFA0531F",
   "hfov": 19.77,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_711D0677_6FF0_1F69_41CD_8D6B359ADB7C",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 139.14,
   "hfov": 19.28,
   "pitch": -44.28
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D, this.camera_175ECA20_10D8_2642_4176_80BDF29A7F40); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "toolTip": "Cliff Face"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -44.28,
   "yaw": 139.14,
   "image": "this.AnimatedImageResource_4A7E2591_6F90_1DA9_41AF_2CEA4B093A34",
   "hfov": 19.28,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "albumitem_165008C9_10D8_23C2_4187_5FC9E126B8B3",
 "player": "this.viewer_uid165038C9_10D8_23C2_4189_6B9FA978C363PhotoAlbumPlayer",
 "begin": "this.updateMediaLabelFromPlayList(this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList, this.htmltext_165778CA_10D8_23C6_4189_89F2468CFE6F, this.albumitem_165008C9_10D8_23C2_4187_5FC9E126B8B3); this.loopAlbum(this.playList_FECCC530_F029_E242_41EB_8BA096AA369E, 0)",
 "class": "PhotoAlbumPlayListItem",
 "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50"
},
{
 "id": "PanoramaPlayListItem_1648B8D2_10D8_23C6_4179_A6AFA07EC7DA",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_1648B8D2_10D8_23C6_4179_A6AFA07EC7DA, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 0, 1)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_camera",
 "media": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA"
},
{
 "id": "PanoramaPlayListItem_164818D2_10D8_23C6_4186_4B799A29C0A4",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164818D2_10D8_23C6_4186_4B799A29C0A4, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 1, 2)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_camera",
 "media": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C"
},
{
 "id": "PanoramaPlayListItem_164F78D3_10D8_23C6_418C_DF0FC97102F9",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164F78D3_10D8_23C6_418C_DF0FC97102F9, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 2, 3)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301_camera",
 "media": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
},
{
 "id": "PanoramaPlayListItem_164ED8D3_10D8_23C6_418E_665BAD3F31D6",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164ED8D3_10D8_23C6_418E_665BAD3F31D6, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 3, 4)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_camera",
 "media": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0"
},
{
 "id": "PanoramaPlayListItem_164FD8D4_10D8_23C2_4184_1303BCAB65C7",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164FD8D4_10D8_23C2_4184_1303BCAB65C7, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 4, 5)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887_camera",
 "media": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887"
},
{
 "id": "PanoramaPlayListItem_164F48D5_10D8_23C2_417F_389B5AE6E6BC",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164F48D5_10D8_23C2_417F_389B5AE6E6BC, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 5, 6)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_camera",
 "media": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E"
},
{
 "id": "PanoramaPlayListItem_164EB8D5_10D8_23C2_418D_D01E10D6B385",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164EB8D5_10D8_23C2_418D_D01E10D6B385, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 6, 7)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_camera",
 "media": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE"
},
{
 "id": "PanoramaPlayListItem_164E28D6_10D8_23CE_4185_F800BB1F0E84",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164E28D6_10D8_23CE_4185_F800BB1F0E84, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 7, 8)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_camera",
 "media": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5"
},
{
 "id": "PanoramaPlayListItem_164D78D6_10D8_23CE_416D_A6F61680760E",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164D78D6_10D8_23CE_416D_A6F61680760E, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 8, 9)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_camera",
 "media": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16"
},
{
 "id": "PanoramaPlayListItem_164CF8D7_10D8_23CE_418F_D779FF87D505",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164CF8D7_10D8_23CE_418F_D779FF87D505, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 9, 10)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_camera",
 "media": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E"
},
{
 "id": "PanoramaPlayListItem_164C68D7_10D8_23CE_4168_ACCD478D0D0F",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164C68D7_10D8_23CE_4168_ACCD478D0D0F, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 10, 11)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_camera",
 "media": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
},
{
 "id": "PanoramaPlayListItem_1643B8D8_10D8_23C2_416A_19394A0B47A0",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_1643B8D8_10D8_23C2_416A_19394A0B47A0, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 11, 12)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_camera",
 "media": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D"
},
{
 "id": "PanoramaPlayListItem_164328D9_10D8_23C2_4188_ADE4A28C21EC",
 "end": "this.trigger('tourEnded')",
 "player": "this.MainViewerPanoramaPlayer",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_164328D9_10D8_23C2_4188_ADE4A28C21EC, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 12, 0)",
 "class": "PanoramaPlayListItem",
 "camera": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_camera",
 "media": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E"
},
{
 "id": "panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_72BB42AE_6FB0_17FB_41D9_8E49056B196A",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.48,
   "hfov": 23.98,
   "pitch": -27.07
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6, this.camera_17358ACD_10D8_27C2_4189_5669828ADC7E); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "toolTip": "Spanish Moss"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.07,
   "yaw": 17.48,
   "image": "this.AnimatedImageResource_4A7FA592_6F90_1DAB_415D_6B760BA7548A",
   "hfov": 23.98,
   "distance": 50
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Right-Up"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_72830C1C_6FB0_12DF_41C6_F63EEF0AE0A2",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0_HS_2_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -5.47,
   "hfov": 23.9,
   "pitch": -27.45
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E, this.camera_173B7AAB_10D8_2646_418D_7B1C58D3514E); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "toolTip": "Mirror Pond"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.45,
   "yaw": -5.47,
   "image": "this.AnimatedImageResource_4A7F6592_6F90_1DAB_41D0_139F138B596F",
   "hfov": 23.9,
   "distance": 50
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_66633ED6_7476_A590_41DA_BD535D20E01D",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0_HS_3_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 116.84,
   "hfov": 14.44,
   "pitch": 14.99
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_6747CFB6_7475_A390_41DB_B25639C60B0F, {'pressedBorderColor':'#000000','pressedBackgroundColorDirection':'vertical','rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'paddingTop':5,'rollOverIconWidth':20,'iconHeight':20,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'iconLineWidth':5,'backgroundColorRatios':[0,0.09803921568627451,1],'iconWidth':20,'paddingRight':5,'rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','rollOverBorderSize':0,'pressedBackgroundOpacity':0.3,'iconColor':'#000000','rollOverIconColor':'#666666','pressedIconColor':'#888888','rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'borderSize':0,'pressedIconLineWidth':5,'borderColor':'#000000','pressedBorderSize':0,'pressedIconWidth':20,'backgroundOpacity':0.3,'paddingLeft':5,'rollOverIconLineWidth':5,'rollOverBorderColor':'#000000','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'paddingBottom':5}, this.ImageResource_66B66150_7473_DC90_41DC_22322829086C, null, null, null, null, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 318,
      "class": "ImageResourceLevel",
      "height": 317,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0_HS_3_0.png"
     }
    ]
   },
   "distance": 50,
   "hfov": 14.44,
   "pitch": 14.99,
   "yaw": 116.84
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Image"
 },
 "rollOverDisplay": false
},
{
 "id": "panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_72D56459_6F90_3359_418D_582929A430CC",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 30.87,
   "hfov": 25.15,
   "pitch": -20.95
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE02603_2777_FD20_41C2_33930A820301, this.camera_16F7B9B1_10D8_2242_4159_1E326FEA59B2); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "toolTip": "Fork - Cactus Patch and Mirror Pond"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.95,
   "yaw": 30.87,
   "image": "this.AnimatedImageResource_4A7CF593_6F90_1DA9_41D2_F39AD5A95B45",
   "hfov": 25.15,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_707ED8CC_6F90_13BF_419D_7949D5F805DF",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 102.96,
   "hfov": 24.63,
   "pitch": -23.81
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D, this.camera_16E1F9C2_10D8_25C6_4151_F1AF348B4717); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "toolTip": "Cliff Face"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.81,
   "yaw": 102.96,
   "image": "this.AnimatedImageResource_CC91A14C_CF6D_3B23_41A5_5AA427836387",
   "hfov": 24.63,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_C8E890AC_CF5F_1963_41D5_843EED445BEC",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_2_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 107.14,
   "hfov": 14.81,
   "pitch": -7.88
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupMedia(this.window_CAED3B8D_CF65_0F3D_41D9_4876B53DBF98, this.album_C65587B4_CF25_0763_41AA_F07882B4DA50, this.playList_FECCC530_F029_E242_41EB_8BA096AA369E, '90%', '90%', false, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_2_0.png"
     }
    ]
   },
   "distance": 50,
   "hfov": 14.81,
   "pitch": -7.88,
   "yaw": 107.14
  }
 ],
 "data": {
  "label": "Image"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_C834EC9C_CF5F_0923_41CF_4B4EC0758149",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_3_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -104.8,
   "hfov": 14.74,
   "pitch": -9.58
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupMedia(this.window_CA10627F_CF65_79DD_41CB_F97BBD5CF7A2, this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079, this.playList_FED2B532_F029_E246_41E8_C185DD7E474D, '90%', '90%', false, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_3_0.png"
     }
    ]
   },
   "distance": 50,
   "hfov": 14.74,
   "pitch": -9.58,
   "yaw": -104.8
  }
 ],
 "data": {
  "label": "Image"
 },
 "rollOverDisplay": false
},
{
 "id": "panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_75D02DFE_6F90_2D5B_41D7_8BDAFB5ADD6F",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 31.02,
   "hfov": 16.86,
   "pitch": -18.11
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE, this.camera_168C69E9_10D8_25C2_4180_B73DF9770440); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "toolTip": "Stairs - Lookout Point"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -18.11,
   "yaw": 31.02,
   "image": "this.AnimatedImageResource_72D4FC6E_6FB0_337B_41D0_B5F4B7BB7408",
   "hfov": 16.86,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_73822CC3_6F91_F3A9_41BE_B7A35648B3B3",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0_HS_2_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -81.99,
   "hfov": 13.16,
   "pitch": -60.73
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A587C82_2777_2D1D_415B_1535451C4887, this.camera_169249D8_10D8_25C2_418D_86ED1C5E46BC); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "toolTip": "Fork - Rock Roses and Spanish Moss"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -60.73,
   "yaw": -81.99,
   "image": "this.AnimatedImageResource_72D48C6F_6FB0_3379_41D6_61CA8E8562D6",
   "hfov": 13.16,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_ABC5265A_B725_1927_41DE_679A254066B9",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0_HS_3_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -44.74,
   "hfov": 13.34,
   "pitch": -26.87
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupMedia(this.window_AB6E3EA2_B72B_0967_41CA_469C0DC711D2, this.album_AE202F34_B73D_0763_41DA_7F6605170401, this.playList_FEC68515_F029_E242_41D0_FEB3446DBF09, '90%', '90%', false, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0_HS_3_0.png"
     }
    ]
   },
   "distance": 50,
   "hfov": 13.34,
   "pitch": -26.87,
   "yaw": -44.74
  }
 ],
 "data": {
  "label": "Image"
 },
 "rollOverDisplay": false
},
{
 "id": "albumitem_165EB8C1_10D8_23C2_4184_0CA0114EDFD9",
 "player": "this.viewer_uid165EC8C1_10D8_23C2_418C_39A935C1D425PhotoAlbumPlayer",
 "begin": "this.updateMediaLabelFromPlayList(this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList, this.htmltext_165E38C2_10D8_23C6_4190_5DE11AB21428, this.albumitem_165EB8C1_10D8_23C2_4184_0CA0114EDFD9); this.loopAlbum(this.playList_FEC68515_F029_E242_41D0_FEB3446DBF09, 0)",
 "class": "PhotoAlbumPlayListItem",
 "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401"
},
{
 "id": "panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_741CE97C_6F90_155F_41C4_99743EE74010",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -11.59,
   "hfov": 23.9,
   "pitch": -27.45
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE, this.camera_170B3A89_10D8_2642_4181_9AA37F31D728); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "toolTip": "Stairs - Lookout Point"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.45,
   "yaw": -11.59,
   "image": "this.AnimatedImageResource_72D5EC70_6FB0_3367_4192_CD07B49C57A9",
   "hfov": 23.9,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7443EF0C_6FEF_EEBF_41AF_43366FD0846D",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -99.97,
   "hfov": 23.29,
   "pitch": -30.13
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16, this.camera_171ADA68_10D8_26C2_4189_ACA15C2E1F12); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "toolTip": "Lookout Point Ledge"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.13,
   "yaw": -99.97,
   "image": "this.AnimatedImageResource_72D5AC70_6FB0_3367_41DA_7C148C081687",
   "hfov": 23.29,
   "distance": 50
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "rollOverDisplay": false
},
{
 "propagateClick": false,
 "toolTipShadowColor": "#333333",
 "left": "0%",
 "vrPointerColor": "#FFFFFF",
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "minWidth": 100,
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "paddingRight": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 15,
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBorderRadius": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "borderRadius": 0,
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderSize": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBarBorderRadius": 0,
 "progressBottom": 0,
 "toolTipOpacity": 1,
 "playbackBarBottom": 5,
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "2vmin",
 "playbackBarBorderRadius": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "bottom": "0%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "transitionMode": "blending",
 "progressLeft": 0,
 "width": "58%",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingLeft": 6,
 "playbackBarBackgroundOpacity": 1,
 "id": "MainViewer",
 "playbackBarBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipDisplayTime": 600,
 "class": "ViewerArea",
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowColor": "#000000",
 "paddingTop": 15,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "progressRight": 0,
 "playbackBarRight": 0,
 "toolTipPaddingRight": 6,
 "toolTipFontStyle": "normal",
 "progressBarBorderSize": 0,
 "progressOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarProgressBorderRadius": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Main Viewer"
 },
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "paddingBottom": 15,
 "toolTipBorderRadius": 3,
 "playbackBarOpacity": 1
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.44",
     "zoomFactor": 1.1,
     "y": "0.66"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.56",
     "zoomFactor": 1.1,
     "y": "0.51"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1"
  }
 ]
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.45",
     "zoomFactor": 1.1,
     "y": "0.68"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.32",
     "zoomFactor": 1.1,
     "y": "0.25"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.44",
     "zoomFactor": 1.1,
     "y": "0.71"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.53",
     "zoomFactor": 1.1,
     "y": "0.57"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_16736589_1BDB_F204_4197_B10E10959ADF"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_outside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.36",
     "zoomFactor": 1.1,
     "y": "0.47"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_371B1A36_2F93_7565_419F_DC23C6E93CC3"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.32",
     "zoomFactor": 1.1,
     "y": "0.69"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_173BC8EF_1BDA_121C_41BB_234A0345A49C"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.40",
     "zoomFactor": 1.1,
     "y": "0.32"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.72",
     "zoomFactor": 1.1,
     "y": "0.56"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_169131DD_1BE6_123C_41B7_7073C3019485"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.69",
     "zoomFactor": 1.1,
     "y": "0.66"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_outside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.48",
     "zoomFactor": 1.1,
     "y": "0.38"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA"
  }
 ]
},
{
 "id": "panorama_2BE02603_2777_FD20_41C2_33930A820301_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_7CFD44BD_6E70_13D9_41C5_325C2A5F9C67",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 82.21,
   "hfov": 13.89,
   "pitch": -13.72
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0, this.camera_1663990E_10D8_225E_4187_CF8218602145); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "toolTip": "Cactus Patch"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -13.72,
   "yaw": 82.21,
   "image": "this.AnimatedImageResource_7A4DF723_6E90_1EE9_41DA_527EC862146A",
   "hfov": 13.89,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7F26D2BC_6E70_17DF_418C_6CC8B91FE33E",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -164.38,
   "hfov": 13.23,
   "pitch": -22.31
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E, this.camera_1619B922_10D8_2246_4148_46C01DA4B17C); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "toolTip": "Mirror Pond"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -22.31,
   "yaw": -164.38,
   "image": "this.AnimatedImageResource_7A4D4724_6E90_1EEF_41D3_61A98F9F519E",
   "hfov": 13.23,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "borderRadius": 0,
 "left": 35,
 "minHeight": 1,
 "verticalAlign": "middle",
 "minWidth": 1,
 "paddingLeft": 0,
 "width": 54,
 "paddingRight": 0,
 "id": "IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451",
 "height": 55,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "maxWidth": 54,
 "maxHeight": 55,
 "borderSize": 0,
 "iconURL": "skin/IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451.png",
 "data": {
  "name": "IconButton14830"
 },
 "transparencyActive": false,
 "bottom": 35,
 "paddingBottom": 0,
 "cursor": "hand",
 "backgroundOpacity": 0
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.43",
     "zoomFactor": 1.1,
     "y": "0.47"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.61",
     "zoomFactor": 1.1,
     "y": "0.74"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_1"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.58",
     "zoomFactor": 1.1,
     "y": "0.57"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_2"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.29",
     "zoomFactor": 1.1,
     "y": "0.49"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_3"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.47",
     "zoomFactor": 1.1,
     "y": "0.47"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_4"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.42",
     "zoomFactor": 1.1,
     "y": "0.50"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_6"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.72",
     "zoomFactor": 1.1,
     "y": "0.49"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_7"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.65",
     "zoomFactor": 1.1,
     "y": "0.42"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_8"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.36",
     "zoomFactor": 1.1,
     "y": "0.44"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_9"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.73",
     "zoomFactor": 1.1,
     "y": "0.69"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_10"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.62",
     "zoomFactor": 1.1,
     "y": "0.68"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_11"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.65",
     "zoomFactor": 1.1,
     "y": "0.68"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_12"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.66",
     "zoomFactor": 1.1,
     "y": "0.58"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_13"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.34",
     "zoomFactor": 1.1,
     "y": "0.26"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_14"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.55",
     "zoomFactor": 1.1,
     "y": "0.26"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_15"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.41",
     "zoomFactor": 1.1,
     "y": "0.35"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_16"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.39",
     "zoomFactor": 1.1,
     "y": "0.68"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_17"
  }
 ]
},
{
 "propagateClick": false,
 "horizontalAlign": "left",
 "contentOpaque": false,
 "minHeight": 20,
 "verticalAlign": "top",
 "minWidth": 20,
 "overflow": "scroll",
 "paddingLeft": 0,
 "width": "100%",
 "paddingRight": 0,
 "backgroundColor": [],
 "id": "container_1657E8C9_10D8_23C2_412A_D2AC0ECF639C",
 "scrollBarWidth": 10,
 "gap": 10,
 "height": "100%",
 "borderRadius": 0,
 "class": "Container",
 "children": [
  "this.viewer_uid165038C9_10D8_23C2_4189_6B9FA978C363",
  {
   "propagateClick": false,
   "horizontalAlign": "left",
   "scrollBarVisible": "rollOver",
   "borderRadius": 0,
   "left": 0,
   "contentOpaque": true,
   "minHeight": 20,
   "verticalAlign": "bottom",
   "right": 0,
   "minWidth": 20,
   "overflow": "scroll",
   "paddingLeft": 0,
   "paddingRight": 0,
   "backgroundColor": [],
   "scrollBarWidth": 7,
   "gap": 10,
   "height": "30%",
   "class": "Container",
   "children": [
    "this.htmltext_165778CA_10D8_23C6_4189_89F2468CFE6F"
   ],
   "shadow": false,
   "paddingTop": 0,
   "backgroundColorRatios": [],
   "backgroundColorDirection": "vertical",
   "scrollBarColor": "#FFFFFF",
   "borderSize": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container7129"
   },
   "scrollBarMargin": 2,
   "backgroundOpacity": 0.3,
   "paddingBottom": 0,
   "layout": "vertical",
   "bottom": 0
  },
  "this.component_1656E8CA_10D8_23C6_418C_A5A31DCC9765",
  "this.component_1656D8CA_10D8_23C6_4180_490FB11D445B"
 ],
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [],
 "backgroundColorDirection": "vertical",
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container7128"
 },
 "scrollBarMargin": 2,
 "backgroundOpacity": 0.3,
 "paddingBottom": 0,
 "layout": "absolute",
 "scrollBarVisible": "rollOver"
},
{
 "id": "album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.37",
     "zoomFactor": 1.1,
     "y": "0.46"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.64",
     "zoomFactor": 1.1,
     "y": "0.35"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.54",
     "zoomFactor": 1.1,
     "y": "0.75"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31848902_2F95_171D_41B7_C159F68EAE74"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.68",
     "zoomFactor": 1.1,
     "y": "0.65"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31CEEC58_2F95_6D2D_41C2_D00705969834"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.29",
     "zoomFactor": 1.1,
     "y": "0.56"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.32",
     "zoomFactor": 1.1,
     "y": "0.75"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_3173B13C_2F95_7765_41C4_97B76D4A8682"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1.1,
     "y": "0.53"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.34",
     "zoomFactor": 1.1,
     "y": "0.47"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31729630_2F95_7D7D_41B0_44A2B5C516E9"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.51",
     "zoomFactor": 1.1,
     "y": "0.48"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_3172C8A6_2F95_7562_41AA_718D6950386C"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.66",
     "zoomFactor": 1.1,
     "y": "0.63"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.58",
     "zoomFactor": 1.1,
     "y": "0.42"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_317FAD99_2F95_6F2F_41BA_141EA18567B3"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.42",
     "zoomFactor": 1.1,
     "y": "0.62"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31745018_2F95_152D_41AB_FD0BA7C83181"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.61",
     "zoomFactor": 1.1,
     "y": "0.74"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_36333405_2FFD_1D27_41C2_A8850A963931"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.47",
     "zoomFactor": 1.1,
     "y": "0.51"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_3173926D_2F95_15E7_41B3_9B101F175342"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.67",
     "zoomFactor": 1.1,
     "y": "0.66"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.59",
     "zoomFactor": 1.1,
     "y": "0.74"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31753761_2F95_1B1F_41BE_312E7D761EAC"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.36",
     "zoomFactor": 1.1,
     "y": "0.38"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_317269C7_2F95_1723_4191_79C8244B985E"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.59",
     "zoomFactor": 1.1,
     "y": "0.30"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_31736C3B_2F95_2D63_41C2_62475673F4B8"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.46",
     "zoomFactor": 1.1,
     "y": "0.48"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695"
  }
 ]
},
{
 "propagateClick": false,
 "horizontalAlign": "left",
 "contentOpaque": false,
 "minHeight": 20,
 "verticalAlign": "top",
 "minWidth": 20,
 "overflow": "scroll",
 "paddingLeft": 0,
 "width": "100%",
 "paddingRight": 0,
 "backgroundColor": [],
 "id": "container_165E98C1_10D8_23C2_4174_6A88702EC8C8",
 "scrollBarWidth": 10,
 "gap": 10,
 "height": "100%",
 "borderRadius": 0,
 "class": "Container",
 "children": [
  "this.viewer_uid165EC8C1_10D8_23C2_418C_39A935C1D425",
  {
   "propagateClick": false,
   "horizontalAlign": "left",
   "scrollBarVisible": "rollOver",
   "borderRadius": 0,
   "left": 0,
   "contentOpaque": true,
   "minHeight": 20,
   "verticalAlign": "bottom",
   "right": 0,
   "minWidth": 20,
   "overflow": "scroll",
   "paddingLeft": 0,
   "paddingRight": 0,
   "backgroundColor": [],
   "scrollBarWidth": 7,
   "gap": 10,
   "height": "30%",
   "class": "Container",
   "children": [
    "this.htmltext_165E38C2_10D8_23C6_4190_5DE11AB21428"
   ],
   "shadow": false,
   "paddingTop": 0,
   "backgroundColorRatios": [],
   "backgroundColorDirection": "vertical",
   "scrollBarColor": "#FFFFFF",
   "borderSize": 0,
   "scrollBarOpacity": 0.5,
   "data": {
    "name": "Container7123"
   },
   "scrollBarMargin": 2,
   "backgroundOpacity": 0.3,
   "paddingBottom": 0,
   "layout": "vertical",
   "bottom": 0
  },
  "this.component_165DA8C3_10D8_23C6_4170_5B45245A7B06",
  "this.component_165D98C3_10D8_23C6_4190_49BDEEE29487"
 ],
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [],
 "backgroundColorDirection": "vertical",
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container7122"
 },
 "scrollBarMargin": 2,
 "backgroundOpacity": 0.3,
 "paddingBottom": 0,
 "layout": "absolute",
 "scrollBarVisible": "rollOver"
},
{
 "id": "panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_7FFB1922_6E70_F2EB_41D4_93AF95F333C1",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 38.9,
   "hfov": 23.11,
   "pitch": -30.89
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A587C82_2777_2D1D_415B_1535451C4887, this.camera_17696A56_10D8_26CE_4191_52BC12B9E3CE); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "toolTip": "Fork - Rock Roses and Spanish Moss"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.89,
   "yaw": 38.9,
   "image": "this.AnimatedImageResource_7A4CC724_6E90_1EEF_41BE_F87D26252598",
   "hfov": 23.11,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7FB7D09A_6E70_13DB_41D3_ADC189CDECF0",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -155.06,
   "hfov": 22.23,
   "pitch": -34.34
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE02603_2777_FD20_41C2_33930A820301, this.camera_1778FA45_10D8_26C2_4190_5E922BE75D09); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "toolTip": "Fork - Cactus Patch and Eanes Creek"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -34.34,
   "yaw": -155.06,
   "image": "this.AnimatedImageResource_7A4C9724_6E90_1EEF_41DA_5F0BDE16AAE2",
   "hfov": 22.23,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_A76F6EB1_B125_0965_41D6_534E3D397B2F",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0_HS_2_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -57.37,
   "hfov": 14.94,
   "pitch": 2.21
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_A5AD3F7C_B127_07E3_41C8_542B4D5C1542, {'pressedBorderColor':'#000000','pressedBackgroundColorDirection':'vertical','rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'paddingTop':5,'rollOverIconWidth':20,'iconHeight':20,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'iconLineWidth':5,'backgroundColorRatios':[0,0.09803921568627451,1],'iconWidth':20,'paddingRight':5,'rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','rollOverBorderSize':0,'pressedBackgroundOpacity':0.3,'iconColor':'#000000','rollOverIconColor':'#666666','pressedIconColor':'#888888','rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'borderSize':0,'pressedIconLineWidth':5,'borderColor':'#000000','pressedBorderSize':0,'pressedIconWidth':20,'backgroundOpacity':0.3,'paddingLeft':5,'rollOverIconLineWidth':5,'rollOverBorderColor':'#000000','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'paddingBottom':5}, this.ImageResource_AE69E0A7_B727_396D_41D4_C455ABE8E287, null, null, null, null, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0_HS_2_0.png"
     }
    ]
   },
   "distance": 50,
   "hfov": 14.94,
   "pitch": 2.21,
   "yaw": -57.37
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Image"
 },
 "rollOverDisplay": false
},
{
 "propagateClick": false,
 "toolTipShadowColor": "#333333",
 "vrPointerColor": "#FFFFFF",
 "minHeight": 1,
 "playbackBarHeadBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "right": "0%",
 "playbackBarHeadBorderColor": "#000000",
 "progressBarOpacity": 1,
 "playbackBarHeadHeight": 15,
 "minWidth": 1,
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "paddingRight": 15,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBorderRadius": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "borderRadius": 0,
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderSize": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressBarBorderRadius": 0,
 "progressBottom": 2,
 "toolTipOpacity": 1,
 "playbackBarBottom": 0,
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "2vmin",
 "playbackBarBorderRadius": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "bottom": "0%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "transitionMode": "blending",
 "progressLeft": 0,
 "width": "30%",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingLeft": 6,
 "playbackBarBackgroundOpacity": 1,
 "id": "MapViewer",
 "playbackBarBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipDisplayTime": 600,
 "class": "ViewerArea",
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowColor": "#000000",
 "paddingTop": 15,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "progressRight": 0,
 "playbackBarRight": 0,
 "toolTipPaddingRight": 6,
 "toolTipFontStyle": "normal",
 "progressBarBorderSize": 0,
 "progressOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarProgressBorderRadius": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "data": {
  "name": "Floor Plan"
 },
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "paddingBottom": 15,
 "toolTipBorderRadius": 3,
 "playbackBarOpacity": 1
},
{
 "id": "panorama_2A587C82_2777_2D1D_415B_1535451C4887_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_7D10B969_6E70_1579_41DB_1E07EE198721",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -82.75,
   "hfov": 21.5,
   "pitch": -37.01
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0, this.camera_16384959_10D8_22C2_418A_1C69AEDE40B7); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "toolTip": "Cactus Patch"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -37.01,
   "yaw": -82.75,
   "image": "this.AnimatedImageResource_7A4C7725_6E90_1EE9_41DA_C68E1A6E78DA",
   "hfov": 21.5,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7CA1175C_6E70_FD5F_41D5_19B492554547",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 48.47,
   "hfov": 20.95,
   "pitch": -38.93
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E, this.camera_162B096B_10D8_22C6_4190_8EE9C94EA87E); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "toolTip": "Rock Roses"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -38.93,
   "yaw": 48.47,
   "image": "this.AnimatedImageResource_7A4FC725_6E90_1EE9_41C8_88F7318E2C19",
   "hfov": 20.95,
   "distance": 50
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7CE58D22_6E90_12EB_41CF_F462E1ACCC26",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0_HS_2_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 117.71,
   "hfov": 20.83,
   "pitch": -39.31
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "toolTip": "Spanish Moss"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -39.31,
   "yaw": 117.71,
   "image": "this.AnimatedImageResource_7A4F9725_6E90_1EE9_41D0_1AC613212553",
   "hfov": 20.83,
   "distance": 50
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Right-Up"
 },
 "rollOverDisplay": false
},
{
 "id": "panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_7C42CAAE_6E90_17FB_41CE_0ABE5B682598",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 149.47,
   "hfov": 23.38,
   "pitch": -29.74
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5, this.camera_16BCA9FB_10D8_25C6_4182_F7F21F22C22F); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "toolTip": "Lookout Point Area"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.74,
   "yaw": 149.47,
   "image": "this.AnimatedImageResource_7A4F0726_6E90_1EEB_41C3_D8111326CF51",
   "hfov": 23.38,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_7C584779_6E90_3D59_419B_650F7DD4E19D",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -10.83,
   "hfov": 20.72,
   "pitch": -39.69
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E, this.camera_16AD2A0C_10D8_2642_4152_16F58C66C628); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "toolTip": "Rock Roses"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -39.69,
   "yaw": -10.83,
   "image": "this.AnimatedImageResource_7A4ED726_6E90_1EEB_41DA_2F7093C01E84",
   "hfov": 20.72,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_617CEB42_6E70_16AB_41D7_B65D455BAF0C",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 121.92,
   "hfov": 25.89,
   "pitch": -15.97
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C, this.camera_17257AEE_10D8_27DF_4184_903A4C2C981A); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "toolTip": "Dry Creek Bed"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -15.97,
   "yaw": 121.92,
   "image": "this.AnimatedImageResource_60A45089_6E70_13B9_41BF_45BAA8D0B565",
   "hfov": 25.89,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_tcap0",
 "angle": 0,
 "inertia": false,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ]
 },
 "rotate": false,
 "class": "TripodCapPanoramaOverlay",
 "distance": 50,
 "hfov": 37.5
},
{
 "id": "overlay_7455B879_6FF0_1359_41BD_6E413BF66E0F",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0_HS_0_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 30.65,
   "hfov": 19.6,
   "pitch": -29.43
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5, this.camera_16179934_10D8_2242_4186_4C3B164606FD); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "toolTip": "Lookout Point Area"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.43,
   "yaw": 30.65,
   "image": "this.AnimatedImageResource_4A79D58F_6F90_1DB9_41D0_888E2B7A16E6",
   "hfov": 19.6,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_74EF4D01_6FF0_32A9_41D2_110F46C58A6F",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0_HS_1_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 110.06,
   "hfov": 16.46,
   "pitch": -52.32
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E, this.camera_160E3947_10D8_22CE_418F_B87573C2C75F); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "toolTip": "Stairs - Lookout Point Ledge"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -52.32,
   "yaw": 110.06,
   "image": "this.AnimatedImageResource_4A796590_6F90_1DA7_419E_D9BC8483395B",
   "hfov": 16.46,
   "distance": 50
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Right"
 },
 "rollOverDisplay": false
},
{
 "id": "overlay_6532C198_747D_BF90_41D0_16BC97C61C52",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0_HS_2_0_0_map.gif"
     }
    ]
   },
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -114.3,
   "hfov": 14.86,
   "pitch": -6.5
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupPanoramaOverlay(this.popup_64850133_747E_FC90_41DC_BF66732C9BBA, {'pressedBorderColor':'#000000','pressedBackgroundColorDirection':'vertical','rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'paddingTop':5,'rollOverIconWidth':20,'iconHeight':20,'rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'iconLineWidth':5,'backgroundColorRatios':[0,0.09803921568627451,1],'iconWidth':20,'paddingRight':5,'rollOverBackgroundOpacity':0.3,'backgroundColorDirection':'vertical','rollOverBorderSize':0,'pressedBackgroundOpacity':0.3,'iconColor':'#000000','rollOverIconColor':'#666666','pressedIconColor':'#888888','rollOverBackgroundColorDirection':'vertical','pressedIconHeight':20,'borderSize':0,'pressedIconLineWidth':5,'borderColor':'#000000','pressedBorderSize':0,'pressedIconWidth':20,'backgroundOpacity':0.3,'paddingLeft':5,'rollOverIconLineWidth':5,'rollOverBorderColor':'#000000','backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'rollOverIconHeight':20,'paddingBottom':5}, this.ImageResource_649ECD55_7472_A490_41B0_D29C1BB9CB22, null, null, null, null, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0_HS_2_0.png"
     }
    ]
   },
   "distance": 50,
   "hfov": 14.86,
   "pitch": -6.5,
   "yaw": -114.3
  }
 ],
 "enabledInCardboard": true,
 "data": {
  "label": "Image"
 },
 "rollOverDisplay": false
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.45",
     "zoomFactor": 1.1,
     "y": "0.64"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.68",
     "zoomFactor": 1.1,
     "y": "0.43"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_2"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_outside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.30",
     "zoomFactor": 1.1,
     "y": "0.47"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.photo_C3E14C78_F165_09E3_41E3_9B94D6640E64"
  }
 ]
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.71",
     "zoomFactor": 1.1,
     "y": "0.43"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_0"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.27",
     "zoomFactor": 1.1,
     "y": "0.63"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_1"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.44",
     "zoomFactor": 1.1,
     "y": "0.57"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_2"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.61",
     "zoomFactor": 1.1,
     "y": "0.40"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_3"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.74",
     "zoomFactor": 1.1,
     "y": "0.60"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_4"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.58",
     "zoomFactor": 1.1,
     "y": "0.55"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_5"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.71",
     "zoomFactor": 1.1,
     "y": "0.31"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_6"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.38",
     "zoomFactor": 1.1,
     "y": "0.58"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_7"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.53",
     "zoomFactor": 1.1,
     "y": "0.53"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_8"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.53",
     "zoomFactor": 1.1,
     "y": "0.59"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_9"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.39",
     "zoomFactor": 1.1,
     "y": "0.49"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_10"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.41",
     "zoomFactor": 1.1,
     "y": "0.72"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_11"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.61",
     "zoomFactor": 1.1,
     "y": "0.51"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_12"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.71",
     "zoomFactor": 1.1,
     "y": "0.32"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_13"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.34",
     "zoomFactor": 1.1,
     "y": "0.49"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_14"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.52",
     "zoomFactor": 1.1,
     "y": "0.38"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_15"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.62",
     "zoomFactor": 1.1,
     "y": "0.54"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_16"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.69",
     "zoomFactor": 1.1,
     "y": "0.59"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_17"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.48",
     "zoomFactor": 1.1,
     "y": "0.53"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_18"
  },
  {
   "class": "PhotoPlayListItem",
   "camera": {
    "scaleMode": "fit_inside",
    "targetPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.52",
     "zoomFactor": 1.1,
     "y": "0.56"
    },
    "easing": "linear",
    "initialPosition": {
     "class": "PhotoCameraPosition",
     "x": "0.50",
     "zoomFactor": 1,
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "duration": 5000
   },
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_19"
  }
 ]
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "toolTipBackgroundColor": "#F6F6F6",
 "minHeight": 1,
 "borderRadius": 0,
 "verticalAlign": "middle",
 "right": "12.37%",
 "toolTip": "Austin Parks and Recreation",
 "scaleMode": "fit_inside",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipBorderSize": 1,
 "toolTipShadowVerticalLength": 0,
 "minWidth": 1,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "width": "16.357%",
 "toolTipShadowBlurRadius": 3,
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipShadowOpacity": 1,
 "toolTipPaddingLeft": 6,
 "id": "Image_E9C82CBA_F8EA_E311_41E9_A6E55967A747",
 "toolTipPaddingBottom": 4,
 "height": "16.007%",
 "toolTipBorderColor": "#767676",
 "toolTipDisplayTime": 600,
 "class": "Image",
 "toolTipShadowHorizontalLength": 0,
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "url": "skin/Image_E9C82CBA_F8EA_E311_41E9_A6E55967A747.png",
 "paddingTop": 0,
 "click": "this.openLink('http://www.austintexas.gov/page/trail-directory', '_blank')",
 "toolTipFontStyle": "normal",
 "toolTipShadowSpread": 0,
 "toolTipPaddingRight": 6,
 "maxWidth": 1200,
 "toolTipTextShadowBlurRadius": 3,
 "maxHeight": 611,
 "borderSize": 0,
 "data": {
  "name": "Image6116"
 },
 "toolTipBorderRadius": 3,
 "bottom": "3.29%",
 "paddingBottom": 0,
 "toolTipOpacity": 1,
 "cursor": "hand",
 "toolTipShadowColor": "#333333",
 "backgroundOpacity": 0,
 "toolTipFontSize": "2vmin"
},
{
 "propagateClick": false,
 "itemBackgroundColorRatios": [],
 "itemLabelPosition": "bottom",
 "minHeight": 20,
 "verticalAlign": "top",
 "right": "30%",
 "rollOverItemLabelFontWeight": "normal",
 "rollOverItemBackgroundOpacity": 0,
 "minWidth": 20,
 "borderColor": "#006699",
 "itemLabelTextDecoration": "none",
 "paddingRight": 5,
 "paddingLeft": 5,
 "selectedItemBorderSize": 0,
 "selectedItemBackgroundColor": [],
 "selectedItemLabelFontSize": "12px",
 "itemHorizontalAlign": "center",
 "itemThumbnailShadowOpacity": 0.27,
 "backgroundColor": [
  "#999999"
 ],
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontWeight": "bold",
 "scrollBarWidth": 10,
 "selectedItemLabelFontStyle": "normal",
 "itemThumbnailShadowHorizontalLength": 3,
 "borderRadius": 0,
 "itemThumbnailShadowBlurRadius": 8,
 "shadow": false,
 "itemThumbnailShadowVerticalLength": 3,
 "itemLabelFontColor": "#333333",
 "rollOverItemLabelFontColor": "#FFFFFF",
 "backgroundColorRatios": [
  0
 ],
 "itemVerticalAlign": "middle",
 "itemOpacity": 1,
 "selectedItemLabelFontWeight": "bold",
 "selectedItemThumbnailShadowOpacity": 0.25,
 "scrollBarColor": "#FFFFFF",
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontSize": "12px",
 "scrollBarOpacity": 0.5,
 "layout": "vertical",
 "rollOverItemLabelFontStyle": "italic",
 "scrollBarVisible": "rollOver",
 "top": 0,
 "itemPaddingBottom": 3,
 "backgroundOpacity": 0.7,
 "itemThumbnailOpacity": 1,
 "horizontalAlign": "left",
 "bottom": 0,
 "itemLabelFontStyle": "italic",
 "itemThumbnailShadowColor": "#000000",
 "itemThumbnailBorderRadius": 5,
 "itemLabelHorizontalAlign": "center",
 "selectedItemLabelFontColor": "#FFFFFF",
 "itemThumbnailHeight": 60,
 "itemPaddingRight": 3,
 "itemThumbnailShadow": true,
 "selectedItemBackgroundColorRatios": [],
 "selectedItemThumbnailShadow": true,
 "playList": "this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist",
 "itemMode": "normal",
 "itemLabelGap": 6,
 "width": "12%",
 "selectedItemBorderColor": "#FFFFFF",
 "id": "ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10",
 "gap": 6,
 "itemBorderRadius": 0,
 "itemLabelFontFamily": "Arial",
 "class": "ThumbnailList",
 "paddingTop": 15,
 "itemPaddingLeft": 3,
 "itemBackgroundOpacity": 0,
 "backgroundColorDirection": "vertical",
 "itemThumbnailWidth": 60,
 "selectedItemBorderRadius": 0,
 "itemPaddingTop": 3,
 "data": {
  "name": "ThumbnailList35762"
 },
 "itemThumbnailShadowSpread": 1,
 "scrollBarMargin": 2,
 "itemBackgroundColor": [],
 "paddingBottom": 15,
 "borderSize": 15
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "left": "0%",
 "minHeight": 1,
 "verticalAlign": "middle",
 "scaleMode": "fit_inside",
 "minWidth": 1,
 "paddingLeft": 0,
 "width": "20.206%",
 "paddingRight": 0,
 "id": "Image_1103C169_03B9_4620_4192_E72E4E37992D",
 "height": "34.058%",
 "borderRadius": 0,
 "class": "Image",
 "shadow": false,
 "url": "skin/Image_1103C169_03B9_4620_4192_E72E4E37992D.png",
 "paddingTop": 0,
 "maxWidth": 125,
 "maxHeight": 125,
 "borderSize": 0,
 "data": {
  "name": "Image23472"
 },
 "top": "0%",
 "backgroundOpacity": 0,
 "paddingBottom": 0
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "minHeight": 1,
 "borderRadius": 0,
 "verticalAlign": "middle",
 "right": "1.51%",
 "scaleMode": "fit_inside",
 "minWidth": 1,
 "paddingLeft": 0,
 "width": "11.244%",
 "paddingRight": 0,
 "id": "Image_0F1988E8_1D38_F021_41B3_7097618BA3E7",
 "height": "17.415%",
 "class": "Image",
 "shadow": false,
 "url": "skin/Image_0F1988E8_1D38_F021_41B3_7097618BA3E7.png",
 "paddingTop": 0,
 "click": "this.openLink('http://www.austintexas.gov/parkrangers', '_blank')",
 "maxWidth": 453,
 "maxHeight": 141,
 "borderSize": 0,
 "data": {
  "name": "Image8615"
 },
 "bottom": "2.96%",
 "paddingBottom": 0,
 "cursor": "hand",
 "backgroundOpacity": 0
},
{
 "propagateClick": true,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "borderRadius": 0,
 "left": "0%",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "right": "0%",
 "minWidth": 1,
 "overflow": "scroll",
 "paddingLeft": 0,
 "paddingRight": 0,
 "backgroundColor": [
  "#006699",
  "#000000"
 ],
 "id": "Container_054E2CAE_1C2A_121C_41B5_BC9CB48187EA",
 "scrollBarWidth": 10,
 "gap": 10,
 "class": "Container",
 "children": [
  "this.Container_0549BCAD_1C2A_121C_41A7_35813EA4901D",
  "this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B"
 ],
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColorDirection": "vertical",
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "--PHOTOALBUM"
 },
 "top": "0%",
 "scrollBarMargin": 2,
 "backgroundOpacity": 0.57,
 "creationPolicy": "inAdvance",
 "paddingBottom": 0,
 "layout": "absolute",
 "bottom": "0%"
},
{
 "propagateClick": false,
 "scrollBarVisible": "rollOver",
 "left": 15,
 "shadowHorizontalLength": 2,
 "minHeight": 1,
 "shadowColor": "#000000",
 "borderRadius": 0,
 "right": 15,
 "shadowVerticalLength": 2,
 "borderColor": "#000000",
 "minWidth": 1,
 "paddingLeft": 20,
 "paddingRight": 20,
 "shadowBlurRadius": 7,
 "shadowOpacity": 0.19,
 "backgroundColor": [
  "#FFFFFF",
  "#CCCCCC"
 ],
 "id": "HTMLText_119E6B44_03C9_3A60_417F_E649C6F59526",
 "scrollBarWidth": 10,
 "class": "HTMLText",
 "shadow": true,
 "paddingTop": 20,
 "backgroundColorRatios": [
  0.73,
  1
 ],
 "backgroundColorDirection": "vertical",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#006699;font-size:37px;\"><B>City of Austin VR</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#006699;font-size:37px;\"><B>Zilker Nature Preserves</B></SPAN><SPAN STYLE=\"font-size:37px;\"><B> </B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:22px;\"><B>Austin Parks and Recreation</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Austin\u2019s preserve system began in 1935 with the creation of Zilker Nature Preserve. Over the years, the City of Austin has acquired over 2200 acres of preserve land. Preserve land is a unique type of park land that is set aside because it provides essential endangered species habitat, includes a unique natural feature such as a cave or stream, or provides a prime example of a specific type of ecosystem. Preserve land is set aside by either purchasing property from private or commercial land owners, if an area is designated as endangered species habitat or if it is deeded to the city.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">This project was created in collaboration with the City of Austin Park Rangers and Communications and Technology Management (CTM) Department.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\"><B>VR Zilker Nature Preserves Expedition Team</B></SPAN><B>:</B></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Jimmy Evans</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Tessa Rangel</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Juan Mata</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Sheridan Jones</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Marbenn Cayetano</SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "shadowSpread": 1,
 "borderSize": 1,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "HTMLText53815"
 },
 "top": 15,
 "scrollBarMargin": 2,
 "backgroundOpacity": 0.91,
 "paddingBottom": 20,
 "bottom": 15
},
{
 "id": "AnimatedImageResource_72CA5C71_6FB0_3369_41CA_1ECE04903518",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_72CA6C71_6FB0_3369_41B0_937980E85866",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4AB722_6E90_1EE8_41D0_7CF23A46D907",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4A1723_6E90_1EE9_41D8_3F62D994AFA1",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "viewer_uid165658CB_10D8_23C6_418F_B5D1F4B1DA7APhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "viewerArea": "this.viewer_uid165658CB_10D8_23C6_418F_B5D1F4B1DA7A",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C"
},
{
 "propagateClick": false,
 "toolTipShadowColor": "#333333",
 "vrPointerColor": "#FFFFFF",
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "minWidth": 100,
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "paddingRight": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBorderRadius": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderSize": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "progressBottom": 2,
 "toolTipOpacity": 1,
 "playbackBarBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBarBorderRadius": 0,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBorderRadius": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "transitionMode": "blending",
 "progressLeft": 0,
 "width": "100%",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingLeft": 6,
 "playbackBarBackgroundOpacity": 1,
 "id": "viewer_uid165658CB_10D8_23C6_418F_B5D1F4B1DA7A",
 "playbackBarBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipDisplayTime": 600,
 "class": "ViewerArea",
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "progressRight": 0,
 "playbackBarRight": 0,
 "paddingTop": 0,
 "toolTipFontStyle": "normal",
 "progressBarBorderSize": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadow": true,
 "playbackBarProgressBorderRadius": 0,
 "progressOpacity": 1,
 "data": {
  "name": "ViewerArea7133"
 },
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "paddingBottom": 0,
 "toolTipBorderRadius": 3,
 "playbackBarOpacity": 1
},
{
 "propagateClick": false,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "minHeight": 0,
 "minWidth": 0,
 "paddingLeft": 10,
 "width": "100%",
 "paddingRight": 10,
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_1655B8CC_10D8_23C2_417D_EDEA7A3ECF42",
 "scrollBarWidth": 10,
 "borderRadius": 0,
 "class": "HTMLText",
 "shadow": false,
 "paddingTop": 5,
 "backgroundColorRatios": [
  0
 ],
 "visible": false,
 "backgroundColorDirection": "vertical",
 "html": "",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "data": {
  "name": "HTMLText7136"
 },
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0.7,
 "paddingBottom": 5,
 "scrollBarVisible": "rollOver"
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "left": 10,
 "minHeight": 0,
 "verticalAlign": "middle",
 "minWidth": 0,
 "iconURL": "skin/album_left.png",
 "paddingLeft": 0,
 "paddingRight": 0,
 "id": "component_165528CC_10D8_23C2_4161_3EB1DEF3D617",
 "borderRadius": 0,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList, -1)",
 "visible": false,
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "IconButton7137"
 },
 "top": "45%",
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "cursor": "hand",
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "right": 10,
 "minWidth": 0,
 "iconURL": "skin/album_right.png",
 "paddingLeft": 0,
 "paddingRight": 0,
 "id": "component_165508CC_10D8_23C2_4179_C79949E0FBD6",
 "borderRadius": 0,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList, 1)",
 "visible": false,
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "IconButton7138"
 },
 "top": "45%",
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "cursor": "hand",
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0
},
{
 "id": "AnimatedImageResource_72CBFC72_6FB0_336B_41D9_F088AFA0531F",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_4A7E2591_6F90_1DA9_41AF_2CEA4B093A34",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "viewer_uid165038C9_10D8_23C2_4189_6B9FA978C363PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "viewerArea": "this.viewer_uid165038C9_10D8_23C2_4189_6B9FA978C363",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C"
},
{
 "id": "AnimatedImageResource_4A7FA592_6F90_1DAB_415D_6B760BA7548A",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_4A7F6592_6F90_1DAB_41D0_139F138B596F",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0_HS_2_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_4A7CF593_6F90_1DA9_41D2_F39AD5A95B45",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_CC91A14C_CF6D_3B23_41A5_5AA427836387",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_72D4FC6E_6FB0_337B_41D0_B5F4B7BB7408",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_72D48C6F_6FB0_3379_41D6_61CA8E8562D6",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0_HS_2_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "viewer_uid165EC8C1_10D8_23C2_418C_39A935C1D425PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "viewerArea": "this.viewer_uid165EC8C1_10D8_23C2_418C_39A935C1D425",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C"
},
{
 "id": "AnimatedImageResource_72D5EC70_6FB0_3367_4192_CD07B49C57A9",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_72D5AC70_6FB0_3367_41DA_7C148C081687",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4DF723_6E90_1EE9_41DA_527EC862146A",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4D4724_6E90_1EEF_41D3_61A98F9F519E",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "propagateClick": false,
 "toolTipShadowColor": "#333333",
 "vrPointerColor": "#FFFFFF",
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "minWidth": 100,
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "paddingRight": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBorderRadius": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderSize": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "progressBottom": 2,
 "toolTipOpacity": 1,
 "playbackBarBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBarBorderRadius": 0,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBorderRadius": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "transitionMode": "blending",
 "progressLeft": 0,
 "width": "100%",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingLeft": 6,
 "playbackBarBackgroundOpacity": 1,
 "id": "viewer_uid165038C9_10D8_23C2_4189_6B9FA978C363",
 "playbackBarBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipDisplayTime": 600,
 "class": "ViewerArea",
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "progressRight": 0,
 "playbackBarRight": 0,
 "paddingTop": 0,
 "toolTipFontStyle": "normal",
 "progressBarBorderSize": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadow": true,
 "playbackBarProgressBorderRadius": 0,
 "progressOpacity": 1,
 "data": {
  "name": "ViewerArea7127"
 },
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "paddingBottom": 0,
 "toolTipBorderRadius": 3,
 "playbackBarOpacity": 1
},
{
 "propagateClick": false,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "minHeight": 0,
 "minWidth": 0,
 "paddingLeft": 10,
 "width": "100%",
 "paddingRight": 10,
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_165778CA_10D8_23C6_4189_89F2468CFE6F",
 "scrollBarWidth": 10,
 "borderRadius": 0,
 "class": "HTMLText",
 "shadow": false,
 "paddingTop": 5,
 "backgroundColorRatios": [
  0
 ],
 "visible": false,
 "backgroundColorDirection": "vertical",
 "html": "",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "data": {
  "name": "HTMLText7130"
 },
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0.7,
 "paddingBottom": 5,
 "scrollBarVisible": "rollOver"
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "left": 10,
 "minHeight": 0,
 "verticalAlign": "middle",
 "minWidth": 0,
 "iconURL": "skin/album_left.png",
 "paddingLeft": 0,
 "paddingRight": 0,
 "id": "component_1656E8CA_10D8_23C6_418C_A5A31DCC9765",
 "borderRadius": 0,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList, -1)",
 "visible": false,
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "IconButton7131"
 },
 "top": "45%",
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "cursor": "hand",
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "right": 10,
 "minWidth": 0,
 "iconURL": "skin/album_right.png",
 "paddingLeft": 0,
 "paddingRight": 0,
 "id": "component_1656D8CA_10D8_23C6_4180_490FB11D445B",
 "borderRadius": 0,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList, 1)",
 "visible": false,
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "IconButton7132"
 },
 "top": "45%",
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "cursor": "hand",
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0
},
{
 "propagateClick": false,
 "toolTipShadowColor": "#333333",
 "vrPointerColor": "#FFFFFF",
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadHeight": 15,
 "minWidth": 100,
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "paddingRight": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "progressBorderRadius": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "toolTipTextShadowColor": "#000000",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "shadow": false,
 "toolTipFontFamily": "Arial",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "vrPointerSelectionTime": 2000,
 "firstTransitionDuration": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderSize": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "progressBottom": 2,
 "toolTipOpacity": 1,
 "playbackBarBottom": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBarBorderRadius": 0,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBorderRadius": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontWeight": "normal",
 "toolTipFontColor": "#606060",
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "transitionMode": "blending",
 "progressLeft": 0,
 "width": "100%",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingLeft": 6,
 "playbackBarBackgroundOpacity": 1,
 "id": "viewer_uid165EC8C1_10D8_23C2_418C_39A935C1D425",
 "playbackBarBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "height": "100%",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipDisplayTime": 600,
 "class": "ViewerArea",
 "playbackBarHeadWidth": 6,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "progressRight": 0,
 "playbackBarRight": 0,
 "paddingTop": 0,
 "toolTipFontStyle": "normal",
 "progressBarBorderSize": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadow": true,
 "playbackBarProgressBorderRadius": 0,
 "progressOpacity": 1,
 "data": {
  "name": "ViewerArea7121"
 },
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "progressBackgroundOpacity": 1,
 "transitionDuration": 500,
 "paddingBottom": 0,
 "toolTipBorderRadius": 3,
 "playbackBarOpacity": 1
},
{
 "propagateClick": false,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "minHeight": 0,
 "minWidth": 0,
 "paddingLeft": 10,
 "width": "100%",
 "paddingRight": 10,
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_165E38C2_10D8_23C6_4190_5DE11AB21428",
 "scrollBarWidth": 10,
 "borderRadius": 0,
 "class": "HTMLText",
 "shadow": false,
 "paddingTop": 5,
 "backgroundColorRatios": [
  0
 ],
 "visible": false,
 "backgroundColorDirection": "vertical",
 "html": "",
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "data": {
  "name": "HTMLText7124"
 },
 "scrollBarMargin": 2,
 "scrollBarOpacity": 0.5,
 "backgroundOpacity": 0.7,
 "paddingBottom": 5,
 "scrollBarVisible": "rollOver"
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "left": 10,
 "minHeight": 0,
 "verticalAlign": "middle",
 "minWidth": 0,
 "iconURL": "skin/album_left.png",
 "paddingLeft": 0,
 "paddingRight": 0,
 "id": "component_165DA8C3_10D8_23C6_4170_5B45245A7B06",
 "borderRadius": 0,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList, -1)",
 "visible": false,
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "IconButton7125"
 },
 "top": "45%",
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "cursor": "hand",
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "minHeight": 0,
 "verticalAlign": "middle",
 "right": 10,
 "minWidth": 0,
 "iconURL": "skin/album_right.png",
 "paddingLeft": 0,
 "paddingRight": 0,
 "id": "component_165D98C3_10D8_23C6_4190_49BDEEE29487",
 "borderRadius": 0,
 "class": "IconButton",
 "mode": "push",
 "shadow": false,
 "paddingTop": 0,
 "click": "this.loadFromCurrentMediaPlayList(this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList, 1)",
 "visible": false,
 "borderSize": 0,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "data": {
  "name": "IconButton7126"
 },
 "top": "45%",
 "transparencyActive": false,
 "backgroundOpacity": 0,
 "cursor": "hand",
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 250,
  "easing": "cubic_in_out"
 },
 "paddingBottom": 0
},
{
 "id": "AnimatedImageResource_7A4CC724_6E90_1EEF_41BE_F87D26252598",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4C9724_6E90_1EEF_41DA_5F0BDE16AAE2",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4C7725_6E90_1EE9_41DA_C68E1A6E78DA",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4FC725_6E90_1EE9_41C8_88F7318E2C19",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4F9725_6E90_1EE9_41D0_1AC613212553",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0_HS_2_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4F0726_6E90_1EEB_41C3_D8111326CF51",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_7A4ED726_6E90_1EEB_41DA_2F7093C01E84",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_60A45089_6E70_13B9_41BF_45BAA8D0B565",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_4A79D58F_6F90_1DB9_41D0_888E2B7A16E6",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0_HS_0_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "id": "AnimatedImageResource_4A796590_6F90_1DA7_419E_D9BC8483395B",
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0_HS_1_0.png"
  }
 ],
 "frameDuration": 41,
 "colCount": 4,
 "rowCount": 6,
 "class": "AnimatedImageResource",
 "frameCount": 24
},
{
 "propagateClick": false,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "left": "15%",
 "contentOpaque": false,
 "minHeight": 1,
 "shadowColor": "#000000",
 "borderRadius": 0,
 "verticalAlign": "top",
 "right": "15%",
 "shadowVerticalLength": 0,
 "minWidth": 1,
 "overflow": "visible",
 "paddingLeft": 0,
 "paddingRight": 0,
 "shadowBlurRadius": 25,
 "shadowOpacity": 0.3,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "id": "Container_0549BCAD_1C2A_121C_41A7_35813EA4901D",
 "scrollBarWidth": 10,
 "gap": 10,
 "class": "Container",
 "children": [
  "this.Container_05498CAE_1C2A_121C_418B_696992CD1ECF"
 ],
 "shadow": true,
 "paddingTop": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColorDirection": "vertical",
 "scrollBarColor": "#000000",
 "shadowSpread": 1,
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "top": "10%",
 "scrollBarMargin": 2,
 "backgroundOpacity": 1,
 "creationPolicy": "inAdvance",
 "paddingBottom": 0,
 "layout": "vertical",
 "bottom": "10%",
 "data": {
  "name": "Global"
 }
},
{
 "propagateClick": false,
 "itemBackgroundColorRatios": [],
 "itemLabelPosition": "bottom",
 "minHeight": 20,
 "verticalAlign": "top",
 "right": "-0.01%",
 "rollOverItemLabelFontWeight": "normal",
 "rollOverItemBackgroundOpacity": 0,
 "minWidth": 20,
 "borderColor": "#006699",
 "itemLabelTextDecoration": "none",
 "paddingRight": 15,
 "paddingLeft": 15,
 "itemThumbnailScaleMode": "fit_outside",
 "itemHorizontalAlign": "center",
 "itemThumbnailShadowOpacity": 0.27,
 "backgroundColor": [
  "#999999"
 ],
 "itemLabelFontWeight": "normal",
 "scrollBarWidth": 10,
 "itemThumbnailShadowHorizontalLength": 3,
 "borderRadius": 0,
 "itemThumbnailShadowBlurRadius": 8,
 "shadow": false,
 "itemThumbnailShadowVerticalLength": 3,
 "itemLabelFontColor": "#000000",
 "rollOverItemLabelFontColor": "#FFFFFF",
 "backgroundColorRatios": [
  0
 ],
 "itemVerticalAlign": "middle",
 "itemOpacity": 1,
 "selectedItemLabelFontWeight": "bold",
 "scrollBarColor": "#FFFFFF",
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontSize": "12px",
 "scrollBarOpacity": 0.5,
 "layout": "vertical",
 "rollOverItemLabelFontStyle": "italic",
 "backgroundOpacity": 0.7,
 "top": "0%",
 "itemPaddingBottom": 3,
 "scrollBarVisible": "rollOver",
 "itemThumbnailOpacity": 1,
 "horizontalAlign": "left",
 "itemLabelFontStyle": "italic",
 "itemThumbnailShadowColor": "#000000",
 "itemThumbnailBorderRadius": 5,
 "itemLabelHorizontalAlign": "center",
 "selectedItemLabelFontColor": "#FFFFFF",
 "itemThumbnailHeight": 75,
 "itemPaddingRight": 3,
 "itemThumbnailShadow": true,
 "playList": "this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist",
 "itemMode": "normal",
 "itemLabelGap": 8,
 "width": "15%",
 "id": "ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B",
 "gap": 13,
 "itemBorderRadius": 0,
 "itemLabelFontFamily": "Arial",
 "class": "ThumbnailList",
 "height": "100%",
 "paddingTop": 15,
 "itemPaddingLeft": 3,
 "itemBackgroundOpacity": 0,
 "backgroundColorDirection": "vertical",
 "itemThumbnailWidth": 100,
 "itemPaddingTop": 3,
 "data": {
  "name": "ThumbnailList35762"
 },
 "itemThumbnailShadowSpread": 1,
 "scrollBarMargin": 2,
 "itemBackgroundColor": [],
 "paddingBottom": 15,
 "borderSize": 15
},
{
 "propagateClick": false,
 "horizontalAlign": "left",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "minWidth": 1,
 "overflow": "visible",
 "paddingLeft": 0,
 "width": "100%",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "id": "Container_05498CAE_1C2A_121C_418B_696992CD1ECF",
 "scrollBarWidth": 10,
 "gap": 10,
 "height": "100%",
 "borderRadius": 0,
 "class": "Container",
 "children": [
  "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98",
  "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
  "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
 ],
 "shadow": false,
 "paddingTop": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "backgroundColorDirection": "vertical",
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Container photo"
 },
 "scrollBarMargin": 2,
 "backgroundOpacity": 0.3,
 "creationPolicy": "inAdvance",
 "paddingBottom": 0,
 "layout": "absolute",
 "scrollBarVisible": "rollOver"
}],
 "minWidth": 20,
 "overflow": "visible",
 "paddingLeft": 0,
 "width": "100%",
 "paddingRight": 0,
 "mobileMipmappingEnabled": false,
 "id": "rootPlayer",
 "scrollBarWidth": 10,
 "gap": 10,
 "vrPolyfillScale": 1,
 "borderRadius": 0,
 "class": "Player",
 "children": [
  "this.TabPanel_EA372801_F8DB_22F3_41E4_0E3F42744A6D",
  "this.veilPopupPanorama",
  "this.zoomImagePopupPanorama",
  "this.closeButtonPopupPanorama"
 ],
 "shadow": false,
 "paddingTop": 0,
 "height": "100%",
 "mouseWheelEnabled": true,
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarOpacity": 0.5,
 "data": {
  "name": "Player502"
 },
 "backgroundPreloadEnabled": true,
 "scrollBarMargin": 2,
 "creationPolicy": "inAdvance",
 "paddingBottom": 0,
 "layout": "absolute",
 "scrollBarVisible": "rollOver"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();

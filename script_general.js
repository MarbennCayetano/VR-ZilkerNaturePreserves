(function(){
	var script = {
 "paddingRight": 0,
 "gap": 10,
 "mouseWheelEnabled": true,
 "minWidth": 20,
 "defaultVRPointer": "laser",
 "scrollBarWidth": 10,
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451], 'cardboardAvailable'); this.syncPlaylists([this.mainPlayList,this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist,this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist]); this.playList_F0571FF1_FDD4_EFE6_41EC_90CD3A5F7E97.set('selectedIndex', 0)",
 "scrollBarMargin": 2,
 "overflow": "hidden",
 "vrPolyfillScale": 1,
 "backgroundPreloadEnabled": true,
 "downloadEnabled": false,
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Player",
 "desktopMipmappingEnabled": false,
 "mobileMipmappingEnabled": false,
 "width": "100%",
 "scripts": {
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "unregisterKey": function(key){  delete window[key]; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "existsKey": function(key){  return key in window; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ var audioData = audios[audio.get('id')]; if(audioData) audio = audioData.audio; } if(audio.get('state') == 'playing') audio.pause(); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = undefined; if(mediaDispatcher){ var playListsWithMedia = this.getPlayListsWithMedia(mediaDispatcher, true); playListDispatcher = playListsWithMedia.indexOf(playList) != -1 ? playList : (playListsWithMedia.length > 0 ? playListsWithMedia[0] : undefined); } if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } item.bind('begin', onBeginFunction, self); this.executeFunctionWhenChange(playList, index, disposeCallback);  },
  "getPlayListsWithMedia": function(media, onlySelected){  var result = []; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) result.push(playList); } return result; },
  "stopGlobalAudios": function(onlyForeground){  var audios = window.currentGlobalAudios; var self = this; if(audios){ Object.keys(audios).forEach(function(key){ var data = audios[key]; if(!onlyForeground || (onlyForeground && !data.asBackground)) { self.stopGlobalAudio(data.audio); } }); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback, stopBackgroundAudio){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')].audio; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } var src = this.playGlobalAudio(audio, endCallback); if(stopBackgroundAudio === true){ var stateChangeFunc = function(){ if(src.get('state') == 'playing'){ this.pauseGlobalAudios(src.get('id'), [src]); } else { this.resumeGlobalAudios(src.get('id')); src.unbind('stateChange', stateChangeFunc, this); } }; src.bind('stateChange', stateChangeFunc, this); } return src; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ var audioData = audios[audio.get('id')]; if(audioData){ audio = audioData.audio; delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "setOverlayBehaviour": function(overlay, media, action, preventDoubleClick){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(preventDoubleClick){ if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 1000); } }; if(preventDoubleClick && window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getFirstPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "playGlobalAudio": function(audio, endCallback, asBackground){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = {'audio': audio, 'asBackground': asBackground || false}; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "_getPlayListsWithViewer": function(viewer){  var playLists = this.getByClassName('PlayList'); var containsViewer = function(playList) { var items = playList.get('items'); for(var j=items.length-1; j>=0; --j) { var item = items[j]; var player = item.get('player'); if(player !== undefined && player.get('viewerArea') == viewer) return true; } return false; }; for(var i=playLists.length-1; i>=0; --i) { if(!containsViewer(playLists[i])) playLists.splice(i, 1); } return playLists; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios).map(function(v) { return v.audio })); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "keepCompVisible": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\\text-align:left\\><SPAN STYLE=\\color:#FFFFFF;font-size:12px;font-family:Verdana\\><span color=\\white\\ font-family=\\Verdana\\ font-size=\\12px\\>' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "registerTextVariable": function(obj){  var property = (function() { switch (obj.get('class')) { case 'Label': return 'text'; case 'Button': case 'BaseButton': return 'label'; case 'HTMLText': return 'html'; } })(); if (property == undefined) return; var re = new RegExp('\\{\\{\\s*(\\w+)\\s*\\}\\}', 'g'); var text = obj.get(property); var data = obj.get('data') || {}; data[property] = text; obj.set('data', data); var updateLabel = function(vars) { var text = data[property]; for (var i = 0; i < vars.length; ++i) { var info = vars[i]; var dispatchers = info.dispatchers; for (var j = 0; j < dispatchers.length; ++j) { var dispatcher = dispatchers[j]; var index = dispatcher.get('selectedIndex'); if (index >= 0) { var srcPropArray = info.src.split('.'); var src = dispatcher.get('items')[index]; if(src == undefined || (info.itemCondition !== undefined && !info.itemCondition.call(this, src))) continue; for (var z = 0; z < srcPropArray.length; ++z) src = 'get' in src ? src.get(srcPropArray[z]) : src[srcPropArray[z]]; text = text.replace(info.replace, src); } } } if(text != data[property]) obj.set(property, text); }; var vars = []; var addVars = function(dispatchers, eventName, src, replace, itemCondition) { vars.push({ 'dispatchers': dispatchers, 'eventName': eventName, 'src': src, 'replace': replace, 'itemCondition': itemCondition }); }; var viewerAreaItemCondition = function(item) { var player = item.get('player'); return player !== undefined && player.get('viewerArea') == this.MainViewer; }; while (null != (result = re.exec(text))) { switch (result[1]) { case 'title': var playLists = this._getPlayListsWithViewer(this.MainViewer); addVars(playLists, 'change', 'media.label', result[0], viewerAreaItemCondition); break; case 'subtitle': var playLists = this._getPlayListsWithViewer(this.MainViewer); addVars(playLists, 'change', 'media.data.subtitle', result[0], viewerAreaItemCondition); break; } } if (vars.length > 0) { var func = updateLabel.bind(this, vars); for (var i = 0; i < vars.length; ++i) { var info = vars[i]; var dispatchers = info.dispatchers; for (var j = 0; j < dispatchers.length; ++j) dispatchers[j].bind(info.eventName, func, this); } } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext, true); }; playNext(); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getKey": function(key){  return window[key]; },
  "getFirstPlayListWithMedia": function(media, onlySelected){  var playLists = this.getPlayListsWithMedia(media, onlySelected); return playLists.length > 0 ? playLists[0] : undefined; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "_initItemWithComps": function(playList, index, components, eventName, visible, effectToApply, delay, restoreStateAt){  var item = playList.get('items')[index]; var registerVisibility = restoreStateAt > 0; var rootPlayer = this.rootPlayer; var cloneEffect = function(visible) { var klass = effectToApply ? effectToApply.get('class') : undefined; var effect = undefined; switch(klass) { case 'FadeInEffect': case 'FadeOutEffect': effect = rootPlayer.createInstance(visible ? 'FadeInEffect' : 'FadeOutEffect'); break; case 'SlideInEffect': case 'SlideOutEffect': effect = rootPlayer.createInstance(visible ? 'SlideInEffect' : 'SlideOutEffect'); break; } if(effect){ effect.set('duration', effectToApply.get('duration')); effect.set('easing', effectToApply.get('easing')); if(klass.indexOf('Slide') != -1) effect.set(visible ? 'from' : 'to', effectToApply.get(visible ? 'to' : 'from')); } return effect; }; var endFunc = function() { for(var i = 0, count = components.length; i<count; ++i) { var component = components[i]; if(restoreStateAt > 0){ this.setComponentVisibility(component, !visible, 0, cloneEffect(!visible)); } else { var key = 'visibility_' + component.get('id'); if(this.existsKey(key)) { if(this.getKey(key)) this.setComponentVisibility(component, true, 0, cloneEffect(true)); else this.setComponentVisibility(component, false, 0, cloneEffect(false)); this.unregisterKey(key); } } } item.unbind('end', endFunc, this); if(addMediaEndEvent) media.unbind('end', endFunc, this); }; var stopFunc = function() { item.unbind('stop', stopFunc, this, true); item.unbind('stop', stopFunc, this); item.unbind('begin', stopFunc, this, true); item.unbind('begin', stopFunc, this); for(var i = 0, count = components.length; i<count; ++i) { this.keepCompVisible(components[i], false); } }; var addEvent = function(eventName, delay, restoreStateAt){ var changeFunc = function(){ var changeVisibility = function(component, visible, effect) { rootPlayer.setComponentVisibility(component, visible, delay, effect, visible ? 'showEffect' : 'hideEffect', false); if(restoreStateAt > 0){ var time = delay + restoreStateAt + (effect != undefined ? effect.get('duration') : 0); rootPlayer.setComponentVisibility(component, !visible, time, cloneEffect(!visible), visible ? 'hideEffect' : 'showEffect', true); } }; for(var i = 0, count = components.length; i<count; ++i){ var component = components[i]; if(visible == 'toggle'){ if(!component.get('visible')) changeVisibility(component, true, cloneEffect(true)); else changeVisibility(component, false, cloneEffect(false)); } else { changeVisibility(component, visible, cloneEffect(visible)); } } item.unbind(eventName, changeFunc, this); }; item.bind(eventName, changeFunc, this) }; if(eventName == 'begin'){ for(var i = 0, count = components.length; i<count; ++i){ var component = components[i]; this.keepCompVisible(component, true); if(registerVisibility) { var key = 'visibility_' + component.get('id'); this.registerKey(key, component.get('visible')); } } item.bind('stop', stopFunc, this, true); item.bind('stop', stopFunc, this); item.bind('begin', stopFunc, this, true); item.bind('begin', stopFunc, this); if(registerVisibility){ item.bind('end', endFunc, this); var media = item.get('media'); var addMediaEndEvent = media.get('loop') != undefined && !(media.get('loop')); if(addMediaEndEvent) media.bind('end', endFunc, this); } } else if(eventName == 'end' && restoreStateAt > 0){ addEvent('begin', restoreStateAt, 0); restoreStateAt = 0; } if(eventName != undefined) addEvent(eventName, delay, restoreStateAt); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "registerKey": function(key, value){  window[key] = value; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "shareSocial": function(socialID, url, deepLink){  if(url == undefined) { url = deepLink ? location.href : location.href.split(location.search||location.hash||/[?#]/)[0]; } else if(deepLink) { url += location.hash; } url = (function(id){ switch(id){ case 'fb': return 'https://www.facebook.com/sharer/sharer.php?u='+url; case 'wa': return 'https://api.whatsapp.com/send/?text='+encodeURIComponent(url); case 'tw': return 'https://twitter.com/intent/tweet?source=webclient&url='+url; default: return undefined; } })(socialID); this.openLink(url, '_blank'); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')].audio; } return audio; }
 },
 "definitions": [{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 1,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "visible",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "id": "Container_05498CAE_1C2A_121C_418B_696992CD1ECF",
 "children": [
  "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98",
  "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
  "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "Container photo"
 }
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_193720",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_0_t.jpg"
},
{
 "id": "panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5",
   "yaw": 30.65,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -99.97
  },
  {
   "panorama": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E",
   "yaw": 110.06,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 17.48
  }
 ],
 "label": "Lookout Point Ledge",
 "mapLocations": [
  {
   "x": 472.09,
   "class": "PanoramaMapLocation",
   "angle": -162.04,
   "y": 600.61,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_tcap0",
  "this.overlay_7455B879_6FF0_1359_41BD_6E413BF66E0F",
  "this.overlay_74EF4D01_6FF0_32A9_41D2_110F46C58A6F",
  "this.overlay_6532C198_747D_BF90_41D0_16BC97C61C52"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_0",
 "height": 873,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_170236",
 "data": "Testing Description Area",
 "width": 873,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_0_t.jpg"
},
{
 "id": "photo_31753761_2F95_1B1F_41BE_312E7D761EAC",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_31753761_2F95_1B1F_41BE_312E7D761EAC.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_224748",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31753761_2F95_1B1F_41BE_312E7D761EAC_t.jpg"
},
{
 "id": "photo_31848902_2F95_171D_41B7_C159F68EAE74",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_31848902_2F95_171D_41B7_C159F68EAE74.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_194022",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31848902_2F95_171D_41B7_C159F68EAE74_t.jpg"
},
{
 "transparencyActive": false,
 "paddingRight": 0,
 "minWidth": 50,
 "right": 10,
 "pressedIconURL": "skin/IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF_pressed.png",
 "rollOverIconURL": "skin/IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF_rollover.png",
 "horizontalAlign": "center",
 "propagateClick": true,
 "iconURL": "skin/IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF.png",
 "class": "IconButton",
 "width": "14.22%",
 "id": "IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF",
 "mode": "push",
 "maxWidth": 60,
 "paddingBottom": 0,
 "maxHeight": 60,
 "shadow": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 50,
 "top": "20%",
 "bottom": "20%",
 "cursor": "hand",
 "data": {
  "name": "IconButton >"
 }
},
{
 "id": "panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -82.95,
  "class": "PanoramaCameraPosition",
  "pitch": -19.21
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "paddingRight": 0,
 "left": "0%",
 "minWidth": 1,
 "toolTipOpacity": 1,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "progressBarBorderColor": "#0066FF",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "top": "0%",
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": 12,
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadShadow": true,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 1,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "id": "photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_231505",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_8",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_8.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_204929",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_8_t.jpg"
},
{
 "id": "camera_F03F3090_FDD4_F026_41DE_A23B3E2DA0AF",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -40.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_224547",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_16",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_16.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_230256",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_16_t.jpg"
},
{
 "id": "playList_F0A2DFDF_FDD4_EFDA_41D2_B8633348B8E7",
 "items": [
  "this.albumitem_F0A16FE0_FDD4_EFE6_41EB_DE13A034AC12"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0A22FE0_FDD4_EFE6_41D9_0E57882DF19B, [this.htmltext_F0A27FE0_FDD4_EFE6_41D0_F60EFFD4A7BC,this.component_F0A12FE1_FDD4_EFE6_41E3_1852610D8A6B,this.component_F0A13FE1_FDD4_EFE6_41E0_F67F397E8FA7], 2000)"
},
{
 "id": "MainViewerPanoramaPlayer",
 "mouseControlMode": "drag_acceleration",
 "gyroscopeEnabled": true,
 "buttonCardboardView": "this.IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "class": "PanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "viewerArea": "this.MainViewer"
},
{
 "id": "camera_F01EC068_FDD4_F0E6_41D5_2E4343E95593",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -30.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_31745018_2F95_152D_41AB_FD0BA7C83181",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_31745018_2F95_152D_41AB_FD0BA7C83181.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_222933",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31745018_2F95_152D_41AB_FD0BA7C83181_t.jpg"
},
{
 "id": "album_E51177F6_F753_57D4_41B1_A793F6E896D4",
 "label": "Austin Skyline",
 "playList": "this.album_E51177F6_F753_57D4_41B1_A793F6E896D4_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_E51177F6_F753_57D4_41B1_A793F6E896D4_t.png"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_17",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_17.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_224259",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_17_t.jpg"
},
{
 "id": "camera_F3C150C4_FDD4_F02E_41EE_C41197CB9F17",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 98.01,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_31736C3B_2F95_2D63_41C2_62475673F4B8",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_31736C3B_2F95_2D63_41C2_62475673F4B8.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_230953",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31736C3B_2F95_2D63_41C2_62475673F4B8_t.jpg"
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_2",
 "height": 784,
 "image": {
  "levels": [
   {
    "url": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_203325",
 "width": 1149,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_2_t.jpg"
},
{
 "paddingRight": 15,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 1,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "right": "0%",
 "toolTipFontColor": "#606060",
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBorderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "bottom": "0%",
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowBlurRadius": 3,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "2vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadShadow": true,
 "width": "30%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "MapViewer",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 15,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 15,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 1,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "Floor Plan"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "id": "camera_F06DB055_FDD4_F02E_41E2_7465BB7ED3A6",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 147.36,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B",
 "label": "Spanish Moss",
 "playList": "this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_t.png"
},
{
 "id": "panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -118.72,
  "class": "PanoramaCameraPosition",
  "pitch": -1.16
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "camera_F35881A6_FDD4_F06A_41EF_280A94522030",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 24.94,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "playList_F0571FF1_FDD4_EFE6_41EC_90CD3A5F7E97",
 "class": "PlayList",
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')",
   "class": "MapPlayListItem",
   "player": "this.MapViewerMapPlayer",
   "media": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ]
},
{
 "id": "photo_169131DD_1BE6_123C_41B7_7073C3019485",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_169131DD_1BE6_123C_41B7_7073C3019485.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_210024",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_169131DD_1BE6_123C_41B7_7073C3019485_t.jpg"
},
{
 "id": "camera_F36951F7_FDD4_F3EA_41D5_CA7F63635AC7",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -131.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_205145",
 "width": 1592,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_2",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_191026",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_2_t.jpg"
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "TabPanelPage",
 "width": "100%",
 "backgroundColor": [
  "#006699"
 ],
 "id": "TabPanelPage_EB10C36D_FBF3_5779_41D1_E8A51BE7EF1E",
 "children": [
  "this.Container_054E2CAE_1C2A_121C_41B5_BC9CB48187EA"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "height": "100%",
 "label": "Zilker Nature Preserves Media",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "TabPanelPage1538"
 }
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0A49FDD_FDD4_EFDE_41E2_A16D916BA4A2"
 ],
 "bodyBackgroundOpacity": 0,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_E451F39B_F751_485C_41EA_A660CDFB2ECD",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window7789"
 },
 "headerBorderColor": "#000000"
},
{
 "id": "panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE",
   "yaw": -11.59,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 149.47
  },
  {
   "panorama": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16",
   "yaw": -99.97,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 30.65
  }
 ],
 "label": "Lookout Point Area",
 "mapLocations": [
  {
   "x": 453.3,
   "class": "PanoramaMapLocation",
   "angle": -158.8,
   "y": 607.18,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_tcap0",
  "this.overlay_741CE97C_6F90_155F_41C4_99743EE74010",
  "this.overlay_7443EF0C_6FEF_EEBF_41AF_43366FD0846D"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_164717",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_3",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_3.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_190026",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_3_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_17",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_17.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_230552",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_17_t.jpg"
},
{
 "id": "panorama_2BE02603_2777_FD20_41C2_33930A820301_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 108.01,
  "class": "PanoramaCameraPosition",
  "pitch": -7.36
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50_0",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_230552",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_0_t.jpg"
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0A22FE0_FDD4_EFE6_41D9_0E57882DF19B"
 ],
 "bodyBackgroundOpacity": 0,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_EF479375_F9B2_C8D4_41B8_6187040312B0",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window19423"
 },
 "headerBorderColor": "#000000"
},
{
 "id": "panorama_2A839B55_2775_EB27_41AA_45F0A52C948E",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6",
   "yaw": -150.85,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -31.49
  },
  {
   "panorama": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16",
   "yaw": 17.48,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 110.06
  }
 ],
 "label": "Stairs",
 "mapLocations": [
  {
   "x": 491.15,
   "class": "PanoramaMapLocation",
   "angle": -161.16,
   "y": 576.27,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_tcap0",
  "this.overlay_74F5A496_6FF0_13AB_41D6_9E3DC74C4085",
  "this.overlay_74CF55C7_6FF0_1DA9_41CB_C0D121DD39A5"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "camera_F394411A_FDD4_F05A_41E5_F6E547A0C7A3",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 15.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -104.4,
  "class": "PanoramaCameraPosition",
  "pitch": -10.82
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_231505",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1_t.jpg"
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_230256",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0_t.jpg"
},
{
 "id": "panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6",
   "yaw": 17.48,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 139.14
  },
  {
   "panorama": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E",
   "yaw": -5.47,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 102.96
  }
 ],
 "label": "Cliff Face",
 "mapLocations": [
  {
   "x": 550.29,
   "class": "PanoramaMapLocation",
   "angle": -156.61,
   "y": 496.2,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_tcap0",
  "this.overlay_72BB42AE_6FB0_17FB_41D9_8E49056B196A",
  "this.overlay_72830C1C_6FB0_12DF_41C6_F63EEF0AE0A2",
  "this.overlay_66633ED6_7476_A590_41DA_BD535D20E01D"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_164943",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_0_t.jpg"
},
{
 "toolTipPaddingLeft": 6,
 "toolTipPaddingBottom": 4,
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 1,
 "toolTipOpacity": 1,
 "toolTipFontSize": "1.11vmin",
 "right": "8.41%",
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontStyle": "normal",
 "scaleMode": "fit_inside",
 "toolTipShadowColor": "#333333",
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": "14.077%",
 "class": "Image",
 "toolTipFontWeight": "normal",
 "toolTipShadowHorizontalLength": 0,
 "id": "Image_C1917B7E_CD65_BB02_41CF_3E886C81AE2F",
 "maxWidth": 753,
 "paddingBottom": 0,
 "maxHeight": 456,
 "toolTipPaddingTop": 4,
 "url": "skin/Image_C1917B7E_CD65_BB02_41CF_3E886C81AE2F.png",
 "shadow": false,
 "toolTipBorderSize": 1,
 "toolTipShadowOpacity": 1,
 "height": "14.493%",
 "click": "this.openLink('http://LNT.org', '_blank')",
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "toolTipBorderColor": "#767676",
 "toolTipShadowVerticalLength": 0,
 "toolTip": "Leave No Trace",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "top": "3.77%",
 "toolTipShadowBlurRadius": 3,
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontFamily": "Arial",
 "cursor": "hand",
 "data": {
  "name": "Image1427"
 },
 "toolTipDisplayTime": 600
},
{
 "id": "playList_F0AE5FE4_FDD4_EFEE_41DA_5C8241C85310",
 "items": [
  "this.albumitem_F0AEFFE4_FDD4_EFEE_41D8_CAC6C6E0A873"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0AEDFE4_FDD4_EFEE_4181_9CC66F025652, [this.htmltext_F0AD6FE5_FDD4_EFEE_41BD_4FF46B694DA4,this.component_F0AC2FE5_FDD4_EFEE_41E4_9833E37ADA6B,this.component_F0AC3FE5_FDD4_EFEE_41BB_FDEDF1D1A3F7], 2000)"
},
{
 "id": "panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 80.04,
  "class": "PanoramaCameraPosition",
  "pitch": 1.71
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "camera_F3F3F0E5_FDD4_F1EE_41E8_9E4C0982041A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 80.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_3172C8A6_2F95_7562_41AA_718D6950386C",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_3172C8A6_2F95_7562_41AA_718D6950386C.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_211440",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_3172C8A6_2F95_7562_41AA_718D6950386C_t.jpg"
},
{
 "paddingRight": 0,
 "minWidth": 1,
 "left": "0%",
 "scaleMode": "fit_inside",
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": "20.206%",
 "class": "Image",
 "id": "Image_1103C169_03B9_4620_4192_E72E4E37992D",
 "maxWidth": 125,
 "paddingBottom": 0,
 "maxHeight": 125,
 "url": "skin/Image_1103C169_03B9_4620_4192_E72E4E37992D.png",
 "shadow": false,
 "height": "34.058%",
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "top": "0%",
 "data": {
  "name": "Image23472"
 }
},
{
 "id": "panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA",
   "yaw": -32.64,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 121.92
  },
  {
   "panorama": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301",
   "class": "AdjacentPanorama"
  }
 ],
 "label": "Dry Creek Bed",
 "mapLocations": [
  {
   "x": 664.13,
   "class": "PanoramaMapLocation",
   "angle": -159.13,
   "y": 759.18,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_tcap0",
  "this.overlay_7E0858EB_6E70_3379_41D3_25125636ADB0",
  "this.overlay_7EA0C1EE_6E70_157B_41CA_40A49112635D"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "photo_31729630_2F95_7D7D_41B0_44A2B5C516E9",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_31729630_2F95_7D7D_41B0_44A2B5C516E9.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_211306",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31729630_2F95_7D7D_41B0_44A2B5C516E9_t.jpg"
},
{
 "id": "panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301",
   "yaw": 30.87,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -164.38
  },
  {
   "panorama": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D",
   "yaw": 102.96,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -5.47
  }
 ],
 "label": "Creek",
 "mapLocations": [
  {
   "x": 720.37,
   "class": "PanoramaMapLocation",
   "angle": -159.87,
   "y": 583.6,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_tcap0",
  "this.overlay_72D56459_6F90_3359_418D_582929A430CC",
  "this.overlay_707ED8CC_6F90_13BF_419D_7949D5F805DF",
  "this.overlay_C8E890AC_CF5F_1963_41D5_843EED445BEC",
  "this.overlay_C834EC9C_CF5F_0923_41CF_4B4EC0758149"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079",
 "label": "Pond2",
 "playList": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_t.png"
},
{
 "id": "panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5",
   "yaw": 149.47,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -11.59
  },
  {
   "panorama": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E",
   "yaw": -10.83,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 31.02
  }
 ],
 "label": "Stairs to Lookout Point",
 "mapLocations": [
  {
   "x": 457.99,
   "class": "PanoramaMapLocation",
   "angle": -161.5,
   "y": 646.71,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_tcap0",
  "this.overlay_7C42CAAE_6E90_17FB_41CE_0ABE5B682598",
  "this.overlay_7C584779_6E90_3D59_419B_650F7DD4E19D"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_14",
 "height": 790,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_14.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_223524",
 "width": 1228,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_14_t.jpg"
},
{
 "id": "panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -137.5,
  "class": "PanoramaCameraPosition",
  "pitch": -11.26
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_2",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_172841",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_2_t.jpg"
},
{
 "id": "photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_204807",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_4",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_4.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_193720",
 "data": "A bug!",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_4_t.jpg"
},
{
 "id": "photo_317FAD99_2F95_6F2F_41BA_141EA18567B3",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_317FAD99_2F95_6F2F_41BA_141EA18567B3.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_212138",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_317FAD99_2F95_6F2F_41BA_141EA18567B3_t.jpg"
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "bodyBorderSize": 0,
 "bodyBorderColor": "#000000",
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0ACCFE6_FDD4_EFEA_41E2_B2528004BF8D"
 ],
 "bodyBackgroundOpacity": 1,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_CA10627F_CF65_79DD_41CB_F97BBD5CF7A2",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#999999",
  "#999999",
  "#999999"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window19662"
 },
 "headerBorderColor": "#000000"
},
{
 "id": "photo_16736589_1BDB_F204_4197_B10E10959ADF",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_16736589_1BDB_F204_4197_B10E10959ADF.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_172515",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_16736589_1BDB_F204_4197_B10E10959ADF_t.jpg"
},
{
 "id": "camera_F3B6E154_FDD4_F02E_41E2_881951284C32",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -58.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_0",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_224547",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_0_t.jpg"
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50_2",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_231830",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_2_t.jpg"
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401",
 "label": "Rock Roses Critters",
 "playList": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_t.png"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_18",
 "height": 876,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_18.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_230808",
 "width": 1380,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_18_t.jpg"
},
{
 "paddingRight": 15,
 "itemLabelFontSize": "12px",
 "minWidth": 20,
 "itemPaddingBottom": 3,
 "playList": "this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist",
 "right": "-0.01%",
 "rollOverItemBackgroundOpacity": 0,
 "borderColor": "#006699",
 "itemBackgroundOpacity": 0,
 "itemThumbnailShadowOpacity": 0.27,
 "itemThumbnailScaleMode": "fit_outside",
 "class": "ThumbnailList",
 "itemThumbnailShadowColor": "#000000",
 "itemOpacity": 1,
 "backgroundColor": [
  "#999999"
 ],
 "itemBackgroundColorDirection": "vertical",
 "itemLabelHorizontalAlign": "center",
 "itemLabelFontColor": "#000000",
 "itemMode": "normal",
 "itemThumbnailOpacity": 1,
 "backgroundColorDirection": "vertical",
 "itemBorderRadius": 0,
 "layout": "vertical",
 "itemLabelPosition": "bottom",
 "paddingLeft": 15,
 "top": "0%",
 "itemLabelFontStyle": "italic",
 "itemPaddingLeft": 3,
 "selectedItemLabelFontWeight": "bold",
 "itemThumbnailShadowSpread": 1,
 "rollOverItemLabelFontColor": "#FFFFFF",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "itemVerticalAlign": "middle",
 "itemLabelGap": 8,
 "itemThumbnailShadow": true,
 "itemPaddingRight": 3,
 "horizontalAlign": "left",
 "propagateClick": false,
 "width": "15%",
 "itemThumbnailShadowBlurRadius": 8,
 "itemBackgroundColor": [],
 "itemLabelFontFamily": "Arial",
 "id": "ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B",
 "itemThumbnailShadowHorizontalLength": 3,
 "paddingBottom": 15,
 "height": "100%",
 "shadow": false,
 "scrollBarColor": "#FFFFFF",
 "itemHorizontalAlign": "center",
 "itemThumbnailHeight": 75,
 "scrollBarVisible": "rollOver",
 "rollOverItemLabelFontStyle": "italic",
 "itemBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "paddingTop": 15,
 "backgroundOpacity": 0.7,
 "borderRadius": 0,
 "verticalAlign": "top",
 "itemPaddingTop": 3,
 "rollOverItemLabelFontWeight": "normal",
 "borderSize": 15,
 "minHeight": 20,
 "itemThumbnailBorderRadius": 5,
 "itemThumbnailWidth": 100,
 "itemThumbnailShadowVerticalLength": 3,
 "data": {
  "name": "ThumbnailList35762"
 },
 "backgroundColorRatios": [
  0
 ],
 "gap": 13,
 "selectedItemLabelFontColor": "#FFFFFF",
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "normal"
},
{
 "paddingRight": 0,
 "gap": 10,
 "shadowSpread": 1,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "shadowOpacity": 0,
 "shadowColor": "#000000",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "TabPanelPage",
 "width": "100%",
 "backgroundColor": [
  "#006699"
 ],
 "id": "TabPanelPage_EB17836D_FBF3_5779_41B5_0B878DD1E213",
 "children": [
  "this.MainViewer",
  "this.MapViewer",
  "this.Image_E9C82CBA_F8EA_E311_41E9_A6E55967A747",
  "this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10",
  "this.Image_1103C169_03B9_4620_4192_E72E4E37992D",
  "this.IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451",
  "this.Image_0F1988E8_1D38_F021_41B3_7097618BA3E7",
  "this.Image_C1917B7E_CD65_BB02_41CF_3E886C81AE2F"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "shadow": true,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "height": "100%",
 "label": "Zilker Nature Preserves",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "shadowHorizontalLength": 3,
 "data": {
  "name": "TabPanelPage943"
 },
 "backgroundColorRatios": [
  0
 ]
},
{
 "id": "camera_F00F107B_FDD4_F0DA_41CC_EE23849EB6EA",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -149.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "paddingRight": 20,
 "left": 15,
 "minWidth": 1,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.19,
 "shadowBlurRadius": 7,
 "shadowSpread": 1,
 "right": 15,
 "scrollBarMargin": 2,
 "shadowColor": "#000000",
 "borderColor": "#000000",
 "propagateClick": false,
 "class": "HTMLText",
 "backgroundColor": [
  "#FFFFFF",
  "#CCCCCC"
 ],
 "id": "HTMLText_119E6B44_03C9_3A60_417F_E649C6F59526",
 "paddingBottom": 20,
 "shadow": true,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "shadowVerticalLength": 2,
 "paddingTop": 20,
 "backgroundOpacity": 0.91,
 "paddingLeft": 20,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#006699;font-size:37px;\"><B>City of Austin VR</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#006699;font-size:37px;\"><B>Zilker Nature Preserves</B></SPAN><SPAN STYLE=\"font-size:37px;\"><B> </B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:22px;\"><B>Austin Parks and Recreation</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">One can trace Texas\u2019 rich history through the Zilker Park and the Zilker Nature Preserve. The Preserve is situated at the western edge of Zilker Park where Eanes Creek meets the Colorado River. Up until the 1830s this area was inhabited by many different groups of Native Americans. Nomadic Lipan Apaches and Tonkawas moved through during the 1400-1500s. Later, Kiowas and Comanches moved in throughout the 1700-1800s. While claimed by the Spanish Empire in the 1600s, no real European settlements were established in Central Texas until much later.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">In 1821 Mexico gained independence from Spain and this area of Texas was among those vast Mexican land holdings. In the 1830s William Barton used the area of Zilker Park as cattle ranchland. In 1836 Texas won its independence from Mexico forming the Republic of Texas and in 1839 Waterloo (later changed to Austin) became the capital. Through the 1860s mills operated on Barton Creek. In the early 1900s the area was bought by Andrew Jackson Zilker. Zilker later sold the land to the City of Austin. The city worked with the Civil Works Administration to turn the area into a park. The area of the Zilker Nature Preserve was left to be a wilderness area for park goers to explore. Around 200 Civilian Conservation Corps workers built many structures that still stand today. Near the summit lookout of the Preserve the CCC built the Zilker Clubhouse and was used as a Boy Scout Cabin. The trail overlook structure was also built during this time. Two dams were built on Eanes Creek to catch water that flowed through there. One of these dams can be seen in images from this presentation near the creek and Mirror Pond. There was also a pistol range built into the hillside on the north end of the preserve.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">The Austin Nature and Science Center was built in the 1960s on the eastern edge of the preserve. Except for some invasive plant management the preserve has remained untouched since then. The preserve is utilized by the Nature and Science Center as an outdoor exhibit and learning center. Come explore the trails of the Preserve and be a part of this rich history.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">This project was created in collaboration with the City of Austin Park Rangers and Communications and Technology Management (CTM) Department.</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:12px;\"><BR STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\"><B>VR Zilker Nature Preserves Expedition Team</B></SPAN><B>:</B></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Jimmy Evans</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Tessa Rangel</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Juan Mata</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Sheridan Jones</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;\">Marbenn Cayetano</SPAN></SPAN></DIV></div>",
 "borderRadius": 0,
 "borderSize": 1,
 "minHeight": 1,
 "top": 15,
 "bottom": 15,
 "backgroundColorRatios": [
  0.73,
  1
 ],
 "shadowHorizontalLength": 2,
 "data": {
  "name": "HTMLText53815"
 }
},
{
 "id": "photo_317269C7_2F95_1723_4191_79C8244B985E",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_317269C7_2F95_1723_4191_79C8244B985E.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_225119",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_317269C7_2F95_1723_4191_79C8244B985E_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_7",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_7.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_191428",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_7_t.jpg"
},
{
 "id": "playList_F0A40FDD_FDD4_EFDE_41B3_9945483B0FA8",
 "items": [
  "this.albumitem_F0A45FDD_FDD4_EFDE_41A5_3A50F2B9E264"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0A49FDD_FDD4_EFDE_41E2_A16D916BA4A2, [this.htmltext_F0A33FDE_FDD4_EFDA_4197_63EE02852E73,this.component_F0A38FDE_FDD4_EFDA_41D5_3CF7B39FAA56,this.component_F0A3EFDE_FDD4_EFDA_41A9_8ADCF07C675E], 2000)"
},
{
 "id": "album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_2",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_190526",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_2_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946",
 "label": "Nature, Close Up",
 "playList": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_t.png"
},
{
 "toolTipPaddingLeft": 6,
 "toolTipPaddingBottom": 4,
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 1,
 "toolTipOpacity": 1,
 "toolTipFontSize": "1.11vmin",
 "right": "1.25%",
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontStyle": "normal",
 "scaleMode": "fit_inside",
 "toolTipShadowColor": "#333333",
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": "11.244%",
 "class": "Image",
 "toolTipFontWeight": "normal",
 "toolTipShadowHorizontalLength": 0,
 "id": "Image_0F1988E8_1D38_F021_41B3_7097618BA3E7",
 "maxWidth": 453,
 "paddingBottom": 0,
 "maxHeight": 141,
 "toolTipPaddingTop": 4,
 "url": "skin/Image_0F1988E8_1D38_F021_41B3_7097618BA3E7.png",
 "shadow": false,
 "toolTipBorderSize": 1,
 "toolTipShadowOpacity": 1,
 "height": "17.415%",
 "click": "this.openLink('http://www.austintexas.gov/parkrangers', '_blank')",
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "toolTipBorderColor": "#767676",
 "toolTipShadowVerticalLength": 0,
 "toolTip": "Austin Park Ranger",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "bottom": "4.11%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontFamily": "Arial",
 "cursor": "hand",
 "toolTipShadowBlurRadius": 3,
 "data": {
  "name": "Image8615"
 },
 "toolTipDisplayTime": 600
},
{
 "id": "playList_F0BCBFD4_FDD4_902E_41E2_3ADBE75C1B90",
 "items": [
  "this.albumitem_F0BC8FD6_FDD4_902A_41DE_B86EE13C40A3"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0BCFFD6_FDD4_902A_41E9_EABBF538BC37, [this.htmltext_F0BB8FD7_FDD4_902A_41D8_2F2C867E18CF,this.component_F0B9DFD8_FDD4_9026_41D3_9C061866D83D,this.component_F0B82FD8_FDD4_9026_41BB_F64B78D11DE1], 2000)"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_10",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_10.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_204139",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_10_t.jpg"
},
{
 "id": "photo_3173926D_2F95_15E7_41B3_9B101F175342",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_3173926D_2F95_15E7_41B3_9B101F175342.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_224133",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_3173926D_2F95_15E7_41B3_9B101F175342_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_11",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_11.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_205404",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_11_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_6",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_6.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_191227",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_6_t.jpg"
},
{
 "id": "album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "image001",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_0_t.jpg"
},
{
 "id": "photo_36333405_2FFD_1D27_41C2_A8850A963931",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_36333405_2FFD_1D27_41C2_A8850A963931.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_222743",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_36333405_2FFD_1D27_41C2_A8850A963931_t.jpg"
},
{
 "id": "camera_F3A6A16B_FDD4_F0FA_41E1_2324043E5826",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 148.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_16",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_16.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_223942",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_16_t.jpg"
},
{
 "id": "playList_F0A72FDA_FDD4_EFDA_41EC_0692D71C03FB",
 "items": [
  "this.albumitem_F0A74FDA_FDD4_EFDA_41E9_580BB0D315A1"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0A78FDA_FDD4_EFDA_41E0_E0B8BAA3849E, [this.htmltext_F0A7DFDB_FDD4_EFDA_41E9_ACC24C6933E8,this.component_F0A68FDB_FDD4_EFDA_41D0_0640369EE8D7,this.component_F0A69FDB_FDD4_EFDA_41EB_111474198ACD], 2000)"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26",
 "label": "Scenic",
 "playList": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_t.png"
},
{
 "paddingRight": 0,
 "gap": 10,
 "left": "0%",
 "minWidth": 1,
 "scrollBarWidth": 10,
 "right": "0%",
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": true,
 "class": "Container",
 "backgroundColor": [
  "#006699",
  "#000000"
 ],
 "id": "Container_054E2CAE_1C2A_121C_41B5_BC9CB48187EA",
 "children": [
  "this.Container_0549BCAD_1C2A_121C_41A7_35813EA4901D",
  "this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.57,
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "top": "0%",
 "creationPolicy": "inAdvance",
 "bottom": "0%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--PHOTOALBUM"
 }
},
{
 "id": "camera_F3D180B2_FDD4_F06A_41EE_7D39AEAD909F",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -141.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "camera_F3E34102_FDD4_F02A_41DE_72E47D03DABA",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -162.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist",
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 0, '#999999')",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 0, 1)",
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946"
  },
  {
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 1, '#999999')",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 1, 2)",
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26"
  },
  {
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 2, '#999999')",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 2, 3)",
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC"
  },
  {
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 3, '#999999')",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_06C84396_1C2A_160C_41B9_9BA644CC039B_playlist, 3, 0)",
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "media": "this.album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9"
  }
 ]
},
{
 "id": "ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "id": "camera_F3565189_FDD4_F026_41BE_38E2BD30434C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -69.94,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_2A49533A_2775_3B6D_41B2_C4785C51308E",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE",
   "yaw": 31.02,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -10.83
  },
  {
   "panorama": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887",
   "yaw": -81.99,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 48.47
  }
 ],
 "label": "Rock Roses",
 "mapLocations": [
  {
   "x": 518.81,
   "class": "PanoramaMapLocation",
   "angle": -151.47,
   "y": 657.26,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_tcap0",
  "this.overlay_75D02DFE_6F90_2D5B_41D7_8BDAFB5ADD6F",
  "this.overlay_73822CC3_6F91_F3A9_41BE_B7A35648B3B3",
  "this.overlay_ABC5265A_B725_1927_41DE_679A254066B9"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_231830",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A_t.jpg"
},
{
 "id": "camera_F33A022D_FDD4_F07E_41EC_C34678AB4E9D",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -162.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0AEDFE4_FDD4_EFEE_4181_9CC66F025652"
 ],
 "bodyBackgroundOpacity": 0,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_E2DDF2C7_F757_C834_4199_62E1779CB443",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window9524"
 },
 "headerBorderColor": "#000000"
},
{
 "paddingRight": 0,
 "gap": 10,
 "left": "15%",
 "minWidth": 1,
 "scrollBarWidth": 10,
 "shadowOpacity": 0.3,
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "right": "15%",
 "scrollBarMargin": 2,
 "overflow": "visible",
 "shadowColor": "#000000",
 "horizontalAlign": "center",
 "propagateClick": false,
 "class": "Container",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "id": "Container_0549BCAD_1C2A_121C_41A7_35813EA4901D",
 "children": [
  "this.Container_05498CAE_1C2A_121C_418B_696992CD1ECF"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "shadow": true,
 "scrollBarVisible": "rollOver",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "top": "10%",
 "bottom": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 }
},
{
 "id": "mainPlayList",
 "class": "PlayList",
 "items": [
  "this.PanoramaPlayListItem_F0545FF6_FDD4_EFEA_418C_F43EC6E054FD",
  "this.PanoramaPlayListItem_F050E005_FDD4_F02E_41E9_5B6631C2A784",
  "this.PanoramaPlayListItem_F05F5005_FDD4_F02E_41ED_A5D04FF6F0BF",
  "this.PanoramaPlayListItem_F05E2006_FDD4_F02A_41EC_8F98AFB24F1B",
  "this.PanoramaPlayListItem_F05E9006_FDD4_F02A_41DF_F6269D250B42",
  "this.PanoramaPlayListItem_F05D6007_FDD4_F02A_41A7_D356A6434694",
  "this.PanoramaPlayListItem_F05DC007_FDD4_F02A_41E5_AFE59E77FEE0",
  "this.PanoramaPlayListItem_F05C9008_FDD4_F026_41DE_AEF31593553C",
  "this.PanoramaPlayListItem_F05B7008_FDD4_F026_41C6_552A8D2EF3AB",
  "this.PanoramaPlayListItem_F05BE009_FDD4_F026_41E5_FC4452002072",
  "this.PanoramaPlayListItem_F05AB009_FDD4_F026_41B2_FFB36137F670",
  "this.PanoramaPlayListItem_F059100A_FDD4_F03A_41C0_A17016030C0F",
  "this.PanoramaPlayListItem_F059F00A_FDD4_F03A_41E7_320B3F70EEBB"
 ]
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "bodyBorderSize": 0,
 "bodyBorderColor": "#000000",
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0A78FDA_FDD4_EFDA_41E0_E0B8BAA3849E"
 ],
 "bodyBackgroundOpacity": 1,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_AB6E3EA2_B72B_0967_41CA_469C0DC711D2",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#999999",
  "#999999",
  "#999999"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window11415"
 },
 "headerBorderColor": "#000000"
},
{
 "id": "album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_1",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_190026",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_1_t.jpg"
},
{
 "transparencyActive": false,
 "paddingRight": 0,
 "minWidth": 50,
 "left": 10,
 "pressedIconURL": "skin/IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C_pressed.png",
 "rollOverIconURL": "skin/IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C_rollover.png",
 "horizontalAlign": "center",
 "propagateClick": true,
 "iconURL": "skin/IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C.png",
 "class": "IconButton",
 "width": "14.22%",
 "id": "IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "mode": "push",
 "maxWidth": 60,
 "paddingBottom": 0,
 "maxHeight": 60,
 "shadow": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 50,
 "top": "20%",
 "bottom": "20%",
 "cursor": "hand",
 "data": {
  "name": "IconButton <"
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_11",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_11.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_212650",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_11_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_3",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_3.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_191630",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_3_t.jpg"
},
{
 "id": "playList_F0A1CFE2_FDD4_EFEA_41CA_CB17A7FAE1F7",
 "items": [
  "this.albumitem_F0A01FE2_FDD4_EFEA_41D0_F286E96246AC"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0A05FE2_FDD4_EFEA_41E7_84122D9EEB5C, [this.htmltext_F0A0CFE3_FDD4_EFEA_41D1_C54910D1E876,this.component_F0AFBFE3_FDD4_EFEA_41E2_DFBDA53F39E6,this.component_F0AFEFE3_FDD4_EFEA_41B0_B3FCC9BB4A37], 2000)"
},
{
 "id": "panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 126.75,
  "class": "PanoramaCameraPosition",
  "pitch": 8.47
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist",
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 0, 1)",
   "camera": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 1, 2)",
   "camera": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 2, 3)",
   "camera": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 3, 4)",
   "camera": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 4, 5)",
   "camera": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 5, 6)",
   "camera": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 6, 7)",
   "camera": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 7, 8)",
   "camera": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 8, 9)",
   "camera": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 9, 10)",
   "camera": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 10, 11)",
   "camera": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 11, 12)",
   "camera": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D"
  },
  {
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist, 12, 0)",
   "camera": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_camera",
   "player": "this.MainViewerPanoramaPlayer",
   "media": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E"
  }
 ]
},
{
 "id": "MapViewerMapPlayer",
 "class": "MapPlayer",
 "movementMode": "constrained",
 "viewerArea": "this.MapViewer"
},
{
 "id": "playList_F0AC7FE6_FDD4_EFEA_41B3_CB93B45C0104",
 "items": [
  "this.albumitem_F0AC8FE6_FDD4_EFEA_41E7_27A05E4AC4F0"
 ],
 "class": "PlayList",
 "change": "this.showComponentsWhileMouseOver(this.container_F0ACCFE6_FDD4_EFEA_41E2_B2528004BF8D, [this.htmltext_F0AB6FE6_FDD4_EFEA_41BA_F421D024A521,this.component_F0ABCFE7_FDD4_EFEA_41E3_D52D717C432E,this.component_F0AA2FE7_FDD4_EFEA_41EF_73A53EFB5702], 2000)"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_8",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_8.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_191903",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_8_t.jpg"
},
{
 "id": "album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_172841",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_0_t.jpg"
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0A05FE2_FDD4_EFEA_41E7_84122D9EEB5C"
 ],
 "bodyBackgroundOpacity": 0,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_EC63177C_F9B7_48D4_41D5_0D14A0243356",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window12541"
 },
 "headerBorderColor": "#000000"
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_1",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_202727",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_AE202F34_B73D_0763_41DA_7F6605170401_1_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_7",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_7.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_204356",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_7_t.jpg"
},
{
 "id": "camera_F32B123F_FDD4_F05A_41D4_BA4AF9FD9A81",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 29.15,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "camera_F2DB1250_FDD4_F026_41E6_FCF832239DE4",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -97.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "transparencyActive": false,
 "paddingRight": 0,
 "left": 35,
 "minWidth": 1,
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 54,
 "class": "IconButton",
 "iconURL": "skin/IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451.png",
 "id": "IconButton_03D08FA0_16F2_4323_41B0_42D4929F2451",
 "mode": "push",
 "maxWidth": 54,
 "paddingBottom": 0,
 "maxHeight": 55,
 "height": 55,
 "shadow": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "bottom": 35,
 "cursor": "hand",
 "data": {
  "name": "IconButton14830"
 }
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_19",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_19.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_232012",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_19_t.jpg"
},
{
 "id": "camera_F30A321C_FDD4_F05E_41E2_E59DE3C77647",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -148.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_164330",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0_t.jpg"
},
{
 "id": "panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -95.09,
  "class": "PanoramaCameraPosition",
  "pitch": -11.33
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_1",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_171902",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_1_t.jpg"
},
{
 "id": "photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E",
 "height": 1076,
 "image": {
  "levels": [
   {
    "url": "media/photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_233116",
 "width": 1415,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E_t.jpg"
},
{
 "id": "panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 148.32,
  "class": "PanoramaCameraPosition",
  "pitch": 2.84
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D",
   "yaw": 139.14,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 17.48
  },
  {
   "panorama": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E",
   "yaw": -31.49,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -150.85
  }
 ],
 "label": "Spanish Moss",
 "mapLocations": [
  {
   "x": 545.09,
   "class": "PanoramaMapLocation",
   "angle": -158.62,
   "y": 595.67,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_tcap0",
  "this.overlay_727070B4_6FF0_13EF_41DA_5456B62490EF",
  "this.overlay_711D0677_6FF0_1F69_41CD_8D6B359ADB7C",
  "this.overlay_123C83C4_0437_37AF_4160_C8E8379BB634"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C",
   "yaw": 121.92,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -32.64
  }
 ],
 "label": "Entrance",
 "mapLocations": [
  {
   "x": 715.93,
   "class": "PanoramaMapLocation",
   "angle": -158.14,
   "y": 836.96,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0",
  "this.overlay_617CEB42_6E70_16AB_41D7_B65D455BAF0C"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "photo_31CEEC58_2F95_6D2D_41C2_D00705969834",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_31CEEC58_2F95_6D2D_41C2_D00705969834.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_204610",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_31CEEC58_2F95_6D2D_41C2_D00705969834_t.jpg"
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC",
 "label": "Photo Shoot Prep",
 "playList": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_t.png"
},
{
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingRight": 0,
 "backgroundColorRatios": [],
 "shadowSpread": 1,
 "minWidth": 20,
 "headerBackgroundOpacity": 0,
 "overflow": "scroll",
 "headerBackgroundColorDirection": "vertical",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "titlePaddingRight": 5,
 "titleFontWeight": "normal",
 "closeButtonIconLineWidth": 2,
 "closeButtonIconWidth": 20,
 "class": "Window",
 "closeButtonRollOverBackgroundColor": [],
 "veilColorDirection": "horizontal",
 "modal": true,
 "backgroundColor": [],
 "children": [
  "this.container_F0BCFFD6_FDD4_902A_41E9_EABBF538BC37"
 ],
 "bodyBackgroundOpacity": 0,
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "contentOpaque": false,
 "title": "",
 "layout": "vertical",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "titleTextDecoration": "none",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "veilOpacity": 0.4,
 "paddingLeft": 0,
 "titleFontStyle": "normal",
 "shadowHorizontalLength": 3,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "veilColorRatios": [
  0,
  1
 ],
 "headerBorderSize": 0,
 "footerBackgroundOpacity": 0,
 "footerHeight": 5,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "closeButtonBackgroundColorRatios": [],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "titleFontFamily": "Arial",
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonIconColor": "#B2B2B2",
 "closeButtonPressedIconColor": "#FFFFFF",
 "bodyPaddingRight": 0,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": 400,
 "headerPaddingTop": 10,
 "headerPaddingRight": 0,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "bodyPaddingBottom": 0,
 "bodyPaddingTop": 0,
 "id": "window_E6C29764_F9F1_48F4_4146_5E1409AC4090",
 "titleFontColor": "#000000",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "height": 600,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "paddingBottom": 0,
 "footerBackgroundColorDirection": "vertical",
 "titlePaddingLeft": 5,
 "shadow": true,
 "scrollBarColor": "#000000",
 "headerPaddingLeft": 10,
 "bodyPaddingLeft": 0,
 "closeButtonPressedBackgroundColor": [],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingBottom": 5,
 "headerVerticalAlign": "middle",
 "scrollBarVisible": "rollOver",
 "paddingTop": 0,
 "closeButtonBorderRadius": 11,
 "scrollBarOpacity": 0.5,
 "closeButtonPressedIconLineWidth": 3,
 "bodyBackgroundColorDirection": "vertical",
 "titleFontSize": "1.29vmin",
 "backgroundOpacity": 1,
 "borderRadius": 5,
 "borderSize": 0,
 "verticalAlign": "middle",
 "titlePaddingTop": 5,
 "closeButtonIconHeight": 20,
 "minHeight": 20,
 "gap": 10,
 "closeButtonBackgroundColor": [],
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "shadowVerticalLength": 0,
 "data": {
  "name": "Window28481"
 },
 "headerBorderColor": "#000000"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_14",
 "height": 1493,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_14.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_212516",
 "width": 1005,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_14_t.jpg"
},
{
 "id": "photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_205717",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA_t.jpg"
},
{
 "id": "album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9",
 "label": "Candid",
 "playList": "this.album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_t.png"
},
{
 "id": "photo_371B1A36_2F93_7565_419F_DC23C6E93CC3",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_371B1A36_2F93_7565_419F_DC23C6E93CC3.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_190730",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_371B1A36_2F93_7565_419F_DC23C6E93CC3_t.jpg"
},
{
 "id": "photo_3173B13C_2F95_7765_41C4_97B76D4A8682",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_3173B13C_2F95_7765_41C4_97B76D4A8682.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_210254",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_3173B13C_2F95_7765_41C4_97B76D4A8682_t.jpg"
},
{
 "id": "photo_C3E14C78_F165_09E3_41E3_9B94D6640E64",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_C3E14C78_F165_09E3_41E3_9B94D6640E64.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_231642",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_C3E14C78_F165_09E3_41E3_9B94D6640E64_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_9",
 "height": 742,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_9.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_210605",
 "width": 1125,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_9_t.jpg"
},
{
 "id": "camera_F02190A1_FDD4_F066_41EC_90DBB491A71F",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -77.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_185423",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_15",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_15.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_225739",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_15_t.jpg"
},
{
 "toolTipPaddingLeft": 6,
 "toolTipPaddingBottom": 4,
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 1,
 "toolTipOpacity": 1,
 "toolTipFontSize": "2vmin",
 "right": "12.37%",
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontStyle": "normal",
 "scaleMode": "fit_inside",
 "toolTipShadowColor": "#333333",
 "horizontalAlign": "center",
 "propagateClick": false,
 "width": "16.357%",
 "class": "Image",
 "toolTipFontWeight": "normal",
 "toolTipShadowHorizontalLength": 0,
 "id": "Image_E9C82CBA_F8EA_E311_41E9_A6E55967A747",
 "maxWidth": 1200,
 "paddingBottom": 0,
 "maxHeight": 611,
 "toolTipPaddingTop": 4,
 "url": "skin/Image_E9C82CBA_F8EA_E311_41E9_A6E55967A747.png",
 "shadow": false,
 "toolTipBorderSize": 1,
 "toolTipShadowOpacity": 1,
 "height": "16.007%",
 "click": "this.openLink('http://www.austintexas.gov/page/trail-directory', '_blank')",
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "toolTipBorderColor": "#767676",
 "toolTipShadowVerticalLength": 0,
 "toolTip": "Austin Parks & Recreation",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 1,
 "bottom": "4.88%",
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontFamily": "Arial",
 "cursor": "hand",
 "toolTipShadowBlurRadius": 3,
 "data": {
  "name": "Image6116"
 },
 "toolTipDisplayTime": 600
},
{
 "id": "camera_F37951DA_FDD4_F3DA_41A5_055AD40EACBE",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 169.17,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50",
 "label": "Pond1",
 "playList": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_C65587B4_CF25_0763_41AA_F07882B4DA50_t.png"
},
{
 "id": "album_E51177F6_F753_57D4_41B1_A793F6E896D4_0",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_E51177F6_F753_57D4_41B1_A793F6E896D4_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_205404",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_E51177F6_F753_57D4_41B1_A793F6E896D4_0_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_6",
 "height": 784,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_6.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_203325",
 "data": "Bug with pollen",
 "width": 1149,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_6_t.jpg"
},
{
 "paddingRight": 5,
 "selectedItemBackgroundColorRatios": [],
 "minWidth": 20,
 "itemPaddingBottom": 3,
 "itemLabelFontSize": "12px",
 "playList": "this.ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10_playlist",
 "right": "30%",
 "selectedItemLabelFontSize": "12px",
 "rollOverItemBackgroundOpacity": 0,
 "borderColor": "#006699",
 "itemBackgroundOpacity": 0,
 "itemThumbnailShadowOpacity": 0.27,
 "itemThumbnailScaleMode": "fit_outside",
 "class": "ThumbnailList",
 "itemThumbnailShadowColor": "#000000",
 "itemOpacity": 1,
 "backgroundColor": [
  "#999999"
 ],
 "itemBackgroundColorDirection": "vertical",
 "itemLabelHorizontalAlign": "center",
 "itemLabelFontColor": "#333333",
 "itemMode": "normal",
 "itemThumbnailOpacity": 1,
 "backgroundColorDirection": "vertical",
 "selectedItemBorderColor": "#FFFFFF",
 "itemBorderRadius": 0,
 "layout": "vertical",
 "selectedItemThumbnailShadowOpacity": 0.25,
 "itemLabelPosition": "bottom",
 "paddingLeft": 5,
 "top": 0,
 "itemLabelFontStyle": "italic",
 "itemPaddingLeft": 3,
 "selectedItemLabelFontWeight": "bold",
 "selectedItemThumbnailShadow": true,
 "bottom": 0,
 "itemThumbnailShadowSpread": 1,
 "rollOverItemLabelFontColor": "#FFFFFF",
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "itemVerticalAlign": "middle",
 "selectedItemBorderRadius": 0,
 "itemLabelGap": 6,
 "selectedItemBackgroundColor": [],
 "itemThumbnailShadow": true,
 "itemPaddingRight": 3,
 "horizontalAlign": "left",
 "propagateClick": false,
 "width": "12%",
 "itemThumbnailShadowBlurRadius": 8,
 "itemBackgroundColor": [],
 "itemLabelFontFamily": "Arial",
 "id": "ThumbnailList_0D63B845_02C9_C660_4180_AF4838870A10",
 "selectedItemLabelFontStyle": "normal",
 "paddingBottom": 15,
 "shadow": false,
 "scrollBarColor": "#FFFFFF",
 "itemHorizontalAlign": "center",
 "itemThumbnailHeight": 60,
 "scrollBarVisible": "rollOver",
 "rollOverItemLabelFontStyle": "italic",
 "itemBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "paddingTop": 15,
 "backgroundOpacity": 0.7,
 "itemThumbnailShadowHorizontalLength": 3,
 "borderRadius": 0,
 "verticalAlign": "top",
 "selectedItemBorderSize": 0,
 "itemPaddingTop": 3,
 "rollOverItemLabelFontWeight": "normal",
 "borderSize": 15,
 "minHeight": 20,
 "itemThumbnailBorderRadius": 5,
 "itemThumbnailWidth": 60,
 "itemThumbnailShadowVerticalLength": 3,
 "data": {
  "name": "ThumbnailList35762"
 },
 "backgroundColorRatios": [
  0
 ],
 "gap": 6,
 "selectedItemLabelFontColor": "#FFFFFF",
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "bold"
},
{
 "id": "panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301",
   "yaw": -155.06,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 82.21
  },
  {
   "panorama": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887",
   "yaw": 38.9,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -82.75
  }
 ],
 "label": "Cactus Patch",
 "mapLocations": [
  {
   "x": 616.61,
   "class": "PanoramaMapLocation",
   "angle": -156.16,
   "y": 699.28,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_tcap0",
  "this.overlay_7FFB1922_6E70_F2EB_41D4_93AF95F333C1",
  "this.overlay_7FB7D09A_6E70_13DB_41D3_ADC189CDECF0",
  "this.overlay_A76F6EB1_B125_0965_41D6_534E3D397B2F"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "panorama_2A587C82_2777_2D1D_415B_1535451C4887_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 40.66,
  "class": "PanoramaCameraPosition",
  "pitch": -11.08
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "playList_F0BD7FD2_FDD4_902A_41D2_64CE6E22C36E",
 "class": "PlayList",
 "items": [
  {
   "class": "PhotoAlbumPlayListItem",
   "start": "this.changeBackgroundWhilePlay(this.playList_F0BD7FD2_FDD4_902A_41D2_64CE6E22C36E, 0, '#999999')",
   "begin": "this.loopAlbum(this.playList_F0BD7FD2_FDD4_902A_41D2_64CE6E22C36E, 0)",
   "player": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98PhotoAlbumPlayer",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946"
  }
 ]
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_13",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_13.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_223247",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_13_t.jpg"
},
{
 "paddingRight": 0,
 "gap": 10,
 "shadowSpread": 1,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "shadowOpacity": 0,
 "shadowColor": "#000000",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "TabPanelPage",
 "width": "100%",
 "backgroundColor": [
  "#006699"
 ],
 "id": "TabPanelPage_EB11236D_FBF3_5779_41BB_E21B1976C389",
 "children": [
  "this.HTMLText_119E6B44_03C9_3A60_417F_E649C6F59526"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "shadow": true,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "backgroundOpacity": 1,
 "height": "100%",
 "label": "About",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "shadowHorizontalLength": 3,
 "data": {
  "name": "TabPanelPage1555"
 },
 "backgroundColorRatios": [
  0
 ]
},
{
 "id": "photo_E0C32E34_F9B3_7854_41E0_203F0CE81EC8",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_E0C32E34_F9B3_7854_41E0_203F0CE81EC8.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "image001",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_E0C32E34_F9B3_7854_41E0_203F0CE81EC8_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_1",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_1.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_172047",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_1_t.jpg"
},
{
 "id": "camera_F31B820A_FDD4_F03A_41EE_761F06F25F36",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 168.41,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 121.12,
  "class": "PanoramaCameraPosition",
  "pitch": -20.68
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_173BC8EF_1BDA_121C_41BB_234A0345A49C",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_173BC8EF_1BDA_121C_41BB_234A0345A49C.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_203027",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_173BC8EF_1BDA_121C_41BB_234A0345A49C_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_12",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_12.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_222743",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_12_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_12",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_12.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_210820",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_12_t.jpg"
},
{
 "id": "album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27",
 "label": "Cactus",
 "playList": "this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_t.png"
},
{
 "id": "map_010A27D4_055F_CA60_41B5_0F10F6F3B206",
 "height": 1258,
 "label": "NaturePreservesReferenceMap",
 "initialZoomFactor": 1,
 "fieldOfViewOverlayOutsideColor": "#000000",
 "fieldOfViewOverlayInsideOpacity": 0.4,
 "fieldOfViewOverlayRadiusScale": 0.1,
 "thumbnailUrl": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_t.png",
 "fieldOfViewOverlayOutsideOpacity": 0,
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "scaleMode": "fit_to_height",
 "image": {
  "levels": [
   {
    "width": 1360,
    "class": "ImageResourceLevel",
    "height": 1258,
    "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206.png"
   },
   {
    "tags": "preload",
    "width": 266,
    "class": "ImageResourceLevel",
    "height": 247,
    "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_lq.png"
   }
  ],
  "class": "ImageResource"
 },
 "width": 1360,
 "class": "Map",
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
 "maximumZoomFactor": 1.2,
 "minimumZoomFactor": 0.5
},
{
 "id": "panorama_2BE02603_2777_FD20_41C2_33930A820301",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0",
   "yaw": 82.21,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -155.06
  },
  {
   "panorama": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E",
   "yaw": -164.38,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 30.87
  }
 ],
 "label": "Fork1",
 "mapLocations": [
  {
   "x": 654.81,
   "class": "PanoramaMapLocation",
   "angle": -159.47,
   "y": 708.6,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2BE02603_2777_FD20_41C2_33930A820301_tcap0",
  "this.overlay_7CFD44BD_6E70_13D9_41C5_325C2A5F9C67",
  "this.overlay_7F26D2BC_6E70_17DF_418C_6CC8B91FE33E"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_165732",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2_t.jpg"
},
{
 "id": "camera_F2CDD262_FDD4_F0EA_41C1_2FF22596E5D2",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 97.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_211715",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21_t.jpg"
},
{
 "paddingRight": 0,
 "selectedTabFontWeight": "bold",
 "shadowSpread": 1,
 "minWidth": 1,
 "overflow": "visible",
 "right": "0%",
 "tabsRollOverFontWeight": "bold",
 "pagePaddingRight": 0,
 "borderColor": "#000000",
 "tabsPosition": "top",
 "tabsFontFamily": "Arial",
 "class": "TabPanel",
 "tabsRollOverBackgroundColor": [
  "#FFFFFF"
 ],
 "tabsBackgroundColorRatios": [
  1
 ],
 "pages": [
  "this.TabPanelPage_EB17836D_FBF3_5779_41B5_0B878DD1E213",
  "this.TabPanelPage_EB10C36D_FBF3_5779_41D1_E8A51BE7EF1E",
  "this.TabPanelPage_EB11236D_FBF3_5779_41BB_E21B1976C389"
 ],
 "contentOpaque": false,
 "shadowHorizontalLength": 3,
 "pagePaddingTop": 0,
 "tabsBackgroundColor": [
  "#CCCCCC"
 ],
 "paddingLeft": 0,
 "top": "0%",
 "tabsSize": 32,
 "tabsAlign": "normal",
 "tabsFontStyle": "italic",
 "tabsRollOverBackgroundOpacity": 0.78,
 "scrollBarWidth": 10,
 "shadowBlurRadius": 6,
 "scrollBarMargin": 2,
 "selectedTabBackgroundColorRatios": [
  0
 ],
 "shadowOpacity": 0.5,
 "shadowColor": "#000000",
 "selectedTabBackgroundOpacity": 1,
 "tabsRollOverFontColor": "#000000",
 "selectedTabBackgroundColor": [
  "#006699"
 ],
 "tabsFontWeight": "normal",
 "propagateClick": false,
 "width": "99.925%",
 "tabsTextDecoration": "none",
 "tabsFontColor": "#333333",
 "id": "TabPanel_EA372801_F8DB_22F3_41E4_0E3F42744A6D",
 "pagePaddingLeft": 0,
 "paddingBottom": 0,
 "height": "100%",
 "shadow": true,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "tabsFontSize": "14px",
 "scrollBarVisible": "rollOver",
 "selectedTabFontColor": "#FFFFFF",
 "click": "this.ViewerAreaLabeled_05499CAE_1C2A_121C_41B8_0D0C1B4F8E98.bind('hide', function(e){ e.source.unbind('hide', arguments.callee, this); this.playList_F0BD7FD2_FDD4_902A_41D2_64CE6E22C36E.set('selectedIndex', -1); }, this); this.playList_F0BD7FD2_FDD4_902A_41D2_64CE6E22C36E.set('selectedIndex', 0)",
 "tabsRollOverBackgroundColorRatios": [
  1
 ],
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "scrollBarOpacity": 0.5,
 "selectedTabFontSize": "16px",
 "borderRadius": 5,
 "borderSize": 1,
 "tabsBackgroundOpacity": 0.65,
 "pagePaddingBottom": 0,
 "minHeight": 1,
 "shadowVerticalLength": 0,
 "data": {
  "name": "TabPanel942"
 }
},
{
 "id": "album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8",
 "label": "Overpass",
 "playList": "this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_AlbumPlayList",
 "class": "PhotoAlbum",
 "thumbnailUrl": "media/album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_t.png"
},
{
 "id": "panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -7.81,
  "class": "PanoramaCameraPosition",
  "pitch": -3.36
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_10",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_10.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_211715",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_10_t.jpg"
},
{
 "id": "camera_F348C1C2_FDD4_F02A_41D1_770FCA843B8C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -149.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 110.85,
  "class": "PanoramaCameraPosition",
  "pitch": 6.08
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "paddingRight": 0,
 "left": "0%",
 "minWidth": 100,
 "toolTipOpacity": 1,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "progressBarBorderColor": "#000000",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBorderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 15,
 "transitionMode": "blending",
 "bottom": "0%",
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowBlurRadius": 3,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "toolTipShadowVerticalLength": 0,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 0,
 "playbackBarBottom": 5,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "2vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadShadow": true,
 "width": "58%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "MainViewer",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 15,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 15,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "Main Viewer"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_13",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_13.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_212308",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_13_t.jpg"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_15",
 "height": 796,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_15.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_223730",
 "width": 1160,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_15_t.jpg"
},
{
 "id": "camera_F3842136_FDD4_F06A_41E5_5FCAC268642B",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 174.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_2A587C82_2777_2D1D_415B_1535451C4887",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0",
   "yaw": -82.75,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": 38.9
  },
  {
   "panorama": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E",
   "yaw": 48.47,
   "class": "AdjacentPanorama",
   "distance": 1,
   "backwardYaw": -81.99
  }
 ],
 "label": "Fork2",
 "mapLocations": [
  {
   "x": 550.9,
   "class": "PanoramaMapLocation",
   "angle": -155.85,
   "y": 708.6,
   "map": "this.map_010A27D4_055F_CA60_41B5_0F10F6F3B206"
  }
 ],
 "pitch": 0,
 "hfov": 360,
 "thumbnailUrl": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_t.jpg",
 "hfovMin": "135%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "stereoCube": {
    "levels": [
     {
      "tags": "ondemand",
      "width": 30720,
      "class": "TiledImageResourceLevel",
      "height": 2560,
      "colCount": 60,
      "rowCount": 5,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/0/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 18432,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 36,
      "rowCount": 3,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/1/{row}_{column}.jpg"
     },
     {
      "tags": "ondemand",
      "width": 12288,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 24,
      "rowCount": 2,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/2/{row}_{column}.jpg"
     },
     {
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 6144,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 12,
      "rowCount": 1,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_0/3/{row}_{column}.jpg"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887_tcap0",
  "this.overlay_7D10B969_6E70_1579_41DB_1E07EE198721",
  "this.overlay_7CA1175C_6E70_FD5F_41D5_19B492554547",
  "this.overlay_7CE58D22_6E90_12EB_41CF_F462E1ACCC26"
 ],
 "class": "Panorama",
 "partial": false,
 "hfovMax": 130
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_5",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_5.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_202727",
 "data": "Bug on a flower",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_1748A5DE_1BEA_723C_4171_5192A385F946_5_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_4",
 "height": 1080,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_4.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_190526",
 "width": 1620,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_4_t.jpg"
},
{
 "id": "photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_211049",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B_t.jpg"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_9",
 "height": 1620,
 "image": {
  "levels": [
   {
    "url": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_9.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "label": "PSX_20190715_203549",
 "width": 1080,
 "class": "Photo",
 "duration": 5000,
 "thumbnailUrl": "media/album_15834473_1BEE_7204_41A9_0004D2670A26_9_t.jpg"
},
{
 "id": "panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_7455B879_6FF0_1359_41BD_6E413BF66E0F",
 "areas": [
  {
   "toolTip": "Lookout Point Area",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5, this.camera_F3F3F0E5_FDD4_F1EE_41E8_9E4C0982041A); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -29.43,
   "hfov": 19.6,
   "yaw": 30.65,
   "image": "this.AnimatedImageResource_E6497326_F9D2_C874_41E5_BD7104061A03",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 30.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.43,
   "hfov": 19.6
  }
 ]
},
{
 "id": "overlay_74EF4D01_6FF0_32A9_41D2_110F46C58A6F",
 "areas": [
  {
   "toolTip": "Stairs - Lookout Point Ledge",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E, this.camera_F3E34102_FDD4_F02A_41DE_72E47D03DABA); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -52.32,
   "hfov": 16.46,
   "yaw": 110.06,
   "image": "this.AnimatedImageResource_E648C326_F9D2_C874_41C5_13E38E604106",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Arrow 01b Right"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 110.06,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -52.32,
   "hfov": 16.46
  }
 ]
},
{
 "id": "overlay_6532C198_747D_BF90_41D0_16BC97C61C52",
 "areas": [
  {
   "click": "this.showPopupMedia(this.window_E451F39B_F751_485C_41EA_A660CDFB2ECD, this.album_E51177F6_F753_57D4_41B1_A793F6E896D4, this.playList_F0A40FDD_FDD4_EFDE_41B3_9945483B0FA8, '90%', '90%', false, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_1_HS_2_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 14.86,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": -6.5,
   "yaw": -114.3
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -114.3,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.5,
   "hfov": 14.86
  }
 ]
},
{
 "id": "albumitem_F0A16FE0_FDD4_EFE6_41EB_DE13A034AC12",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_AlbumPlayList, this.htmltext_F0A27FE0_FDD4_EFE6_41D0_F60EFFD4A7BC, this.albumitem_F0A16FE0_FDD4_EFE6_41EB_DE13A034AC12); this.loopAlbum(this.playList_F0A2DFDF_FDD4_EFDA_41D2_B8633348B8E7, 0)",
 "player": "this.viewer_uidF0A10FE0_FDD4_EFE6_41BE_AFE0E9C1B333PhotoAlbumPlayer",
 "media": "this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B"
},
{
 "id": "album_E51177F6_F753_57D4_41B1_A793F6E896D4_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.50",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.43"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E51177F6_F753_57D4_41B1_A793F6E896D4_0"
  }
 ]
},
{
 "id": "album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.57",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.49"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_0"
  }
 ]
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0A49FDD_FDD4_EFDE_41E2_A16D916BA4A2",
 "children": [
  "this.viewer_uidF0A47FDD_FDD4_EFDE_41D7_1AE5363E1AA7",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0A33FDE_FDD4_EFDA_4197_63EE02852E73"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1668"
   }
  },
  "this.component_F0A38FDE_FDD4_EFDA_41D5_3CF7B39FAA56",
  "this.component_F0A3EFDE_FDD4_EFDA_41A9_8ADCF07C675E"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1667"
 }
},
{
 "id": "panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_741CE97C_6F90_155F_41C4_99743EE74010",
 "areas": [
  {
   "toolTip": "Stairs - Lookout Point",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE, this.camera_F01EC068_FDD4_F0E6_41D5_2E4343E95593); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -27.45,
   "hfov": 23.9,
   "yaw": -11.59,
   "image": "this.AnimatedImageResource_E6462325_F9D2_C874_41E0_FA358429F0A3",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -11.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.45,
   "hfov": 23.9
  }
 ]
},
{
 "id": "overlay_7443EF0C_6FEF_EEBF_41AF_43366FD0846D",
 "areas": [
  {
   "toolTip": "Lookout Point Ledge",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16, this.camera_F00F107B_FDD4_F0DA_41CC_EE23849EB6EA); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -30.13,
   "hfov": 23.29,
   "yaw": -99.97,
   "image": "this.AnimatedImageResource_E6499326_F9D2_C874_41DE_E279B01E6B21",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -99.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.13,
   "hfov": 23.29
  }
 ]
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0A22FE0_FDD4_EFE6_41D9_0E57882DF19B",
 "children": [
  "this.viewer_uidF0A10FE0_FDD4_EFE6_41BE_AFE0E9C1B333",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0A27FE0_FDD4_EFE6_41D0_F60EFFD4A7BC"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1674"
   }
  },
  "this.component_F0A12FE1_FDD4_EFE6_41E3_1852610D8A6B",
  "this.component_F0A13FE1_FDD4_EFE6_41E0_F67F397E8FA7"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1673"
 }
},
{
 "id": "panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_74F5A496_6FF0_13AB_41D6_9E3DC74C4085",
 "areas": [
  {
   "toolTip": "Lookout Point Ledge",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16, this.camera_F3565189_FDD4_F026_41BE_38E2BD30434C); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -36.25,
   "hfov": 21.72,
   "yaw": 17.48,
   "image": "this.AnimatedImageResource_E6481327_F9D2_C874_41E9_A5F574631439",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 17.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -36.25,
   "hfov": 21.72
  }
 ]
},
{
 "id": "overlay_74CF55C7_6FF0_1DA9_41CB_C0D121DD39A5",
 "areas": [
  {
   "toolTip": "Spanish Moss",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6, this.camera_F3A6A16B_FDD4_F0FA_41E1_2324043E5826); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -44.67,
   "hfov": 19.15,
   "yaw": -150.85,
   "image": "this.AnimatedImageResource_E64BD327_F9D2_C874_41C1_37DA613E39B3",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -150.85,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -44.67,
   "hfov": 19.15
  }
 ]
},
{
 "id": "panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_72BB42AE_6FB0_17FB_41D9_8E49056B196A",
 "areas": [
  {
   "toolTip": "Spanish Moss",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6, this.camera_F03F3090_FDD4_F026_41DE_A23B3E2DA0AF); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -27.07,
   "hfov": 23.98,
   "yaw": 17.48,
   "image": "this.AnimatedImageResource_E64AB328_F9D2_C87C_41E7_4B7561F7DADD",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Arrow 01b Right-Up"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 17.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.07,
   "hfov": 23.98
  }
 ]
},
{
 "id": "overlay_72830C1C_6FB0_12DF_41C6_F63EEF0AE0A2",
 "areas": [
  {
   "toolTip": "Mirror Pond",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E, this.camera_F02190A1_FDD4_F066_41EC_90DBB491A71F); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -27.45,
   "hfov": 23.9,
   "yaw": -5.47,
   "image": "this.AnimatedImageResource_E64A1329_F9D2_C87C_41E7_B401E3D84F48",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -5.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.45,
   "hfov": 23.9
  }
 ]
},
{
 "id": "overlay_66633ED6_7476_A590_41DA_BD535D20E01D",
 "areas": [
  {
   "click": "this.showPopupMedia(this.window_EC63177C_F9B7_48D4_41D5_0D14A0243356, this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8, this.playList_F0A1CFE2_FDD4_EFEA_41CA_CB17A7FAE1F7, '90%', '90%', false, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 318,
      "class": "ImageResourceLevel",
      "height": 317,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_1_HS_3_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 14.44,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": 14.99,
   "yaw": 116.84
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_1_HS_3_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 116.84,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 14.99,
   "hfov": 14.44
  }
 ]
},
{
 "id": "albumitem_F0AEFFE4_FDD4_EFEE_41D8_CAC6C6E0A873",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList, this.htmltext_F0AD6FE5_FDD4_EFEE_41BD_4FF46B694DA4, this.albumitem_F0AEFFE4_FDD4_EFEE_41D8_CAC6C6E0A873); this.loopAlbum(this.playList_F0AE5FE4_FDD4_EFEE_41DA_5C8241C85310, 0)",
 "player": "this.viewer_uidF0AEBFE4_FDD4_EFEE_41C6_E8FCD8342CA3PhotoAlbumPlayer",
 "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50"
},
{
 "id": "panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_7E0858EB_6E70_3379_41D3_25125636ADB0",
 "areas": [
  {
   "toolTip": "Entrance",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA, this.camera_F3B6E154_FDD4_F02E_41E2_881951284C32); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -20.56,
   "hfov": 25.21,
   "yaw": -32.64,
   "image": "this.AnimatedImageResource_E643A321_F9D2_C86C_41D5_1B4322478B84",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -32.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.56,
   "hfov": 25.21
  }
 ]
},
{
 "id": "overlay_7EA0C1EE_6E70_157B_41CA_40A49112635D",
 "areas": [
  {
   "toolTip": "Fork - Cactus Patch and Eanes Creek",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -7.62,
   "hfov": 19.18,
   "yaw": 142.83,
   "image": "this.AnimatedImageResource_E6430321_F9D2_C86C_41BF_A0B241BB076B",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 142.83,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.62,
   "hfov": 19.18
  }
 ]
},
{
 "id": "panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_72D56459_6F90_3359_418D_582929A430CC",
 "areas": [
  {
   "toolTip": "Fork - Cactus Patch and Mirror Pond",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE02603_2777_FD20_41C2_33930A820301, this.camera_F394411A_FDD4_F05A_41E5_F6E547A0C7A3); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -20.95,
   "hfov": 25.15,
   "yaw": 30.87,
   "image": "this.AnimatedImageResource_E64DB329_F9D2_C87C_41E3_9EE124C32357",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 30.87,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.95,
   "hfov": 25.15
  }
 ]
},
{
 "id": "overlay_707ED8CC_6F90_13BF_419D_7949D5F805DF",
 "areas": [
  {
   "toolTip": "Cliff Face",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D, this.camera_F3842136_FDD4_F06A_41E5_5FCAC268642B); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -23.81,
   "hfov": 24.63,
   "yaw": 102.96,
   "image": "this.AnimatedImageResource_E64D7329_F9D2_C87C_41E7_6654343E1F9F",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 102.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.81,
   "hfov": 24.63
  }
 ]
},
{
 "id": "overlay_C8E890AC_CF5F_1963_41D5_843EED445BEC",
 "areas": [
  {
   "click": "this.showPopupMedia(this.window_E2DDF2C7_F757_C834_4199_62E1779CB443, this.album_C65587B4_CF25_0763_41AA_F07882B4DA50, this.playList_F0AE5FE4_FDD4_EFEE_41DA_5C8241C85310, '90%', '90%', false, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_2_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 14.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": -7.88,
   "yaw": 107.14
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 107.14,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.88,
   "hfov": 14.81
  }
 ]
},
{
 "id": "overlay_C834EC9C_CF5F_0923_41CF_4B4EC0758149",
 "areas": [
  {
   "click": "this.showPopupMedia(this.window_CA10627F_CF65_79DD_41CB_F97BBD5CF7A2, this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079, this.playList_F0AC7FE6_FDD4_EFEA_41B3_CB93B45C0104, '90%', '90%', false, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_3_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 14.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": -9.58,
   "yaw": -104.8
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_3_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -104.8,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.58,
   "hfov": 14.74
  }
 ]
},
{
 "id": "album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.44",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.66"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.56",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.51"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_1"
  }
 ]
},
{
 "id": "panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_7C42CAAE_6E90_17FB_41CE_0ABE5B682598",
 "areas": [
  {
   "toolTip": "Lookout Point Area",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5, this.camera_F31B820A_FDD4_F03A_41EE_761F06F25F36); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -29.74,
   "hfov": 23.38,
   "yaw": 149.47,
   "image": "this.AnimatedImageResource_E646E325_F9D2_C874_41CB_27FC4FCBD438",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 149.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.74,
   "hfov": 23.38
  }
 ]
},
{
 "id": "overlay_7C584779_6E90_3D59_419B_650F7DD4E19D",
 "areas": [
  {
   "toolTip": "Rock Roses",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E, this.camera_F30A321C_FDD4_F05E_41E2_E59DE3C77647); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -39.69,
   "hfov": 20.72,
   "yaw": -10.83,
   "image": "this.AnimatedImageResource_E646A325_F9D2_C874_41E5_82B1C3D1209B",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -10.83,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -39.69,
   "hfov": 20.72
  }
 ]
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0ACCFE6_FDD4_EFEA_41E2_B2528004BF8D",
 "children": [
  "this.viewer_uidF0AC5FE6_FDD4_EFEA_41E0_8AA10C1DBE91",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0AB6FE6_FDD4_EFEA_41BA_F421D024A521"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1692"
   }
  },
  "this.component_F0ABCFE7_FDD4_EFEA_41E3_D52D717C432E",
  "this.component_F0AA2FE7_FDD4_EFEA_41EF_73A53EFB5702"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1691"
 }
},
{
 "id": "album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.32",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.69"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.34",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.66"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_1"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.51",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.36"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401_2"
  }
 ]
},
{
 "id": "albumitem_F0A45FDD_FDD4_EFDE_41A5_3A50F2B9E264",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_E51177F6_F753_57D4_41B1_A793F6E896D4_AlbumPlayList, this.htmltext_F0A33FDE_FDD4_EFDA_4197_63EE02852E73, this.albumitem_F0A45FDD_FDD4_EFDE_41A5_3A50F2B9E264); this.loopAlbum(this.playList_F0A40FDD_FDD4_EFDE_41B3_9945483B0FA8, 0)",
 "player": "this.viewer_uidF0A47FDD_FDD4_EFDE_41D7_1AE5363E1AA7PhotoAlbumPlayer",
 "media": "this.album_E51177F6_F753_57D4_41B1_A793F6E896D4"
},
{
 "id": "album_1748A5DE_1BEA_723C_4171_5192A385F946_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.71",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.43"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.27",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.63"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_1"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.44",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.57"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_2"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.61",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.40"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_3"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.74",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.60"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_4"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.58",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.55"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_5"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.71",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.31"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_6"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.38",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.58"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_7"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.53",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.53"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_8"
  },
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.36",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.73"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_E0C32E34_F9B3_7854_41E0_203F0CE81EC8"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.53",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.59"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_9"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.39",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.49"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_10"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.41",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.72"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_11"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.61",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.51"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_12"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.71",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.32"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_13"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.34",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.49"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_14"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.52",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.38"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_15"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.62",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.54"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_16"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.69",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.59"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_17"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.48",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.53"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_18"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.52",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.56"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_1748A5DE_1BEA_723C_4171_5192A385F946_19"
  }
 ]
},
{
 "id": "albumitem_F0BC8FD6_FDD4_902A_41DE_B86EE13C40A3",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_AlbumPlayList, this.htmltext_F0BB8FD7_FDD4_902A_41D8_2F2C867E18CF, this.albumitem_F0BC8FD6_FDD4_902A_41DE_B86EE13C40A3); this.loopAlbum(this.playList_F0BCBFD4_FDD4_902E_41E2_3ADBE75C1B90, 0)",
 "player": "this.viewer_uidF0BB9FD5_FDD4_902E_41E2_E1A2DDFBAE5APhotoAlbumPlayer",
 "media": "this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27"
},
{
 "id": "albumitem_F0A74FDA_FDD4_EFDA_41E9_580BB0D315A1",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList, this.htmltext_F0A7DFDB_FDD4_EFDA_41E9_ACC24C6933E8, this.albumitem_F0A74FDA_FDD4_EFDA_41E9_580BB0D315A1); this.loopAlbum(this.playList_F0A72FDA_FDD4_EFDA_41EC_0692D71C03FB, 0)",
 "player": "this.viewer_uidF0A71FDA_FDD4_EFDA_41BB_4600A8C252BBPhotoAlbumPlayer",
 "media": "this.album_AE202F34_B73D_0763_41DA_7F6605170401"
},
{
 "id": "album_15834473_1BEE_7204_41A9_0004D2670A26_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.43",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.47"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.61",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.74"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_1"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.58",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.57"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_2"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.29",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.49"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_3"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.47",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.47"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_4"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.42",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_6"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.72",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.49"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_7"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.65",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.42"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_8"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.36",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.44"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_9"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.73",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.69"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_10"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.62",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.68"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_11"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.65",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.68"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_12"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.66",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.58"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_13"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.34",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.26"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_14"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.55",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.26"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_15"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.41",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.35"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_16"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.39",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.68"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_15834473_1BEE_7204_41A9_0004D2670A26_17"
  }
 ]
},
{
 "id": "panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_75D02DFE_6F90_2D5B_41D7_8BDAFB5ADD6F",
 "areas": [
  {
   "toolTip": "Stairs - Lookout Point",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE, this.camera_F37951DA_FDD4_F3DA_41A5_055AD40EACBE); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -18.11,
   "hfov": 16.86,
   "yaw": 31.02,
   "image": "this.AnimatedImageResource_E647F324_F9D2_C874_41E3_55084A34DA36",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 31.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.11,
   "hfov": 16.86
  }
 ]
},
{
 "id": "overlay_73822CC3_6F91_F3A9_41BE_B7A35648B3B3",
 "areas": [
  {
   "toolTip": "Fork - Rock Roses and Spanish Moss",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A587C82_2777_2D1D_415B_1535451C4887, this.camera_F36951F7_FDD4_F3EA_41D5_CA7F63635AC7); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -60.73,
   "hfov": 13.16,
   "yaw": -81.99,
   "image": "this.AnimatedImageResource_E647B324_F9D2_C874_41EB_953B877BFA98",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -81.99,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -60.73,
   "hfov": 13.16
  }
 ]
},
{
 "id": "overlay_ABC5265A_B725_1927_41DE_679A254066B9",
 "areas": [
  {
   "click": "this.showPopupMedia(this.window_AB6E3EA2_B72B_0967_41CA_469C0DC711D2, this.album_AE202F34_B73D_0763_41DA_7F6605170401, this.playList_F0A72FDA_FDD4_EFDA_41EC_0692D71C03FB, '90%', '90%', false, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_1_HS_3_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 13.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": -26.87,
   "yaw": -44.74
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_1_HS_3_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -44.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.87,
   "hfov": 13.34
  }
 ]
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0AEDFE4_FDD4_EFEE_4181_9CC66F025652",
 "children": [
  "this.viewer_uidF0AEBFE4_FDD4_EFEE_41C6_E8FCD8342CA3",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0AD6FE5_FDD4_EFEE_41BD_4FF46B694DA4"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1686"
   }
  },
  "this.component_F0AC2FE5_FDD4_EFEE_41E4_9833E37ADA6B",
  "this.component_F0AC3FE5_FDD4_EFEE_41BB_FDEDF1D1A3F7"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1685"
 }
},
{
 "id": "PanoramaPlayListItem_F0545FF6_FDD4_EFEA_418C_F43EC6E054FD",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F0545FF6_FDD4_EFEA_418C_F43EC6E054FD, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 0, 1)",
 "camera": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA"
},
{
 "id": "PanoramaPlayListItem_F050E005_FDD4_F02E_41E9_5B6631C2A784",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F050E005_FDD4_F02E_41E9_5B6631C2A784, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 1, 2)",
 "camera": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C"
},
{
 "id": "PanoramaPlayListItem_F05F5005_FDD4_F02E_41ED_A5D04FF6F0BF",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05F5005_FDD4_F02E_41ED_A5D04FF6F0BF, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 2, 3)",
 "camera": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2BE02603_2777_FD20_41C2_33930A820301"
},
{
 "id": "PanoramaPlayListItem_F05E2006_FDD4_F02A_41EC_8F98AFB24F1B",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05E2006_FDD4_F02A_41EC_8F98AFB24F1B, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 3, 4)",
 "camera": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0"
},
{
 "id": "PanoramaPlayListItem_F05E9006_FDD4_F02A_41DF_F6269D250B42",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05E9006_FDD4_F02A_41DF_F6269D250B42, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 4, 5)",
 "camera": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A587C82_2777_2D1D_415B_1535451C4887"
},
{
 "id": "PanoramaPlayListItem_F05D6007_FDD4_F02A_41A7_D356A6434694",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05D6007_FDD4_F02A_41A7_D356A6434694, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 5, 6)",
 "camera": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E"
},
{
 "id": "PanoramaPlayListItem_F05DC007_FDD4_F02A_41E5_AFE59E77FEE0",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05DC007_FDD4_F02A_41E5_AFE59E77FEE0, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 6, 7)",
 "camera": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE"
},
{
 "id": "PanoramaPlayListItem_F05C9008_FDD4_F026_41DE_AEF31593553C",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05C9008_FDD4_F026_41DE_AEF31593553C, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 7, 8)",
 "camera": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5"
},
{
 "id": "PanoramaPlayListItem_F05B7008_FDD4_F026_41C6_552A8D2EF3AB",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05B7008_FDD4_F026_41C6_552A8D2EF3AB, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 8, 9)",
 "camera": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16"
},
{
 "id": "PanoramaPlayListItem_F05BE009_FDD4_F026_41E5_FC4452002072",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05BE009_FDD4_F026_41E5_FC4452002072, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 9, 10)",
 "camera": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E"
},
{
 "id": "PanoramaPlayListItem_F05AB009_FDD4_F026_41B2_FFB36137F670",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F05AB009_FDD4_F026_41B2_FFB36137F670, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 10, 11)",
 "camera": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6"
},
{
 "id": "PanoramaPlayListItem_F059100A_FDD4_F03A_41C0_A17016030C0F",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F059100A_FDD4_F03A_41C0_A17016030C0F, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 11, 12)",
 "camera": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D"
},
{
 "id": "PanoramaPlayListItem_F059F00A_FDD4_F03A_41E7_320B3F70EEBB",
 "end": "this.trigger('tourEnded')",
 "class": "PanoramaPlayListItem",
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_F059F00A_FDD4_F03A_41E7_320B3F70EEBB, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 12, 0)",
 "camera": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_camera",
 "player": "this.MainViewerPanoramaPlayer",
 "media": "this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E"
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0A78FDA_FDD4_EFDA_41E0_E0B8BAA3849E",
 "children": [
  "this.viewer_uidF0A71FDA_FDD4_EFDA_41BB_4600A8C252BB",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0A7DFDB_FDD4_EFDA_41E9_ACC24C6933E8"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1662"
   }
  },
  "this.component_F0A68FDB_FDD4_EFDA_41D0_0640369EE8D7",
  "this.component_F0A69FDB_FDD4_EFDA_41EB_111474198ACD"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1661"
 }
},
{
 "id": "albumitem_F0A01FE2_FDD4_EFEA_41D0_F286E96246AC",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_AlbumPlayList, this.htmltext_F0A0CFE3_FDD4_EFEA_41D1_C54910D1E876, this.albumitem_F0A01FE2_FDD4_EFEA_41D0_F286E96246AC); this.loopAlbum(this.playList_F0A1CFE2_FDD4_EFEA_41CA_CB17A7FAE1F7, 0)",
 "player": "this.viewer_uidF0A03FE2_FDD4_EFEA_41D8_035BED038593PhotoAlbumPlayer",
 "media": "this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8"
},
{
 "id": "albumitem_F0AC8FE6_FDD4_EFEA_41E7_27A05E4AC4F0",
 "class": "PhotoAlbumPlayListItem",
 "begin": "this.updateMediaLabelFromPlayList(this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList, this.htmltext_F0AB6FE6_FDD4_EFEA_41BA_F421D024A521, this.albumitem_F0AC8FE6_FDD4_EFEA_41E7_27A05E4AC4F0); this.loopAlbum(this.playList_F0AC7FE6_FDD4_EFEA_41B3_CB93B45C0104, 0)",
 "player": "this.viewer_uidF0AC5FE6_FDD4_EFEA_41E0_8AA10C1DBE91PhotoAlbumPlayer",
 "media": "this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079"
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0A05FE2_FDD4_EFEA_41E7_84122D9EEB5C",
 "children": [
  "this.viewer_uidF0A03FE2_FDD4_EFEA_41D8_035BED038593",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0A0CFE3_FDD4_EFEA_41D1_C54910D1E876"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1680"
   }
  },
  "this.component_F0AFBFE3_FDD4_EFEA_41E2_DFBDA53F39E6",
  "this.component_F0AFEFE3_FDD4_EFEA_41B0_B3FCC9BB4A37"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1679"
 }
},
{
 "id": "panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_727070B4_6FF0_13EF_41DA_5456B62490EF",
 "areas": [
  {
   "toolTip": "Stairs - Lookout Point Ledge",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A839B55_2775_EB27_41AA_45F0A52C948E, this.camera_F32B123F_FDD4_F05A_41D4_BA4AF9FD9A81); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -42.75,
   "hfov": 19.77,
   "yaw": -31.49,
   "image": "this.AnimatedImageResource_E64BA328_F9D2_C87C_41B5_F3403581084A",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -31.49,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -42.75,
   "hfov": 19.77
  }
 ]
},
{
 "id": "overlay_711D0677_6FF0_1F69_41CD_8D6B359ADB7C",
 "areas": [
  {
   "toolTip": "Cliff Face",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D, this.camera_F33A022D_FDD4_F07E_41EC_C34678AB4E9D); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -44.28,
   "hfov": 19.28,
   "yaw": 139.14,
   "image": "this.AnimatedImageResource_E64B1328_F9D2_C87C_41EE_8A69433C2A05",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 139.14,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -44.28,
   "hfov": 19.28
  }
 ]
},
{
 "id": "overlay_123C83C4_0437_37AF_4160_C8E8379BB634",
 "areas": [
  {
   "toolTip": "Close up of Spanish moss",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.showPopupMedia(this.window_EF479375_F9B2_C8D4_41B8_6187040312B0, this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B, this.playList_F0A2DFDF_FDD4_EFDA_41D2_B8633348B8E7, '90%', '90%', false, false)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_1_HS_2_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 13.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": 26.31,
   "yaw": -114.76
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -114.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 26.31,
   "hfov": 13.4
  }
 ]
},
{
 "id": "panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_617CEB42_6E70_16AB_41D7_B65D455BAF0C",
 "areas": [
  {
   "toolTip": "Dry Creek Bed",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C, this.camera_F06DB055_FDD4_F02E_41E2_7465BB7ED3A6); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -15.97,
   "hfov": 25.89,
   "yaw": 121.92,
   "image": "this.AnimatedImageResource_E643E320_F9D2_C86C_41D8_B5FEC582B823",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 121.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.97,
   "hfov": 25.89
  }
 ]
},
{
 "id": "album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.45",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.68"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.32",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.25"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_1"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.44",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.71"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_16F65654_1BDE_1E0C_41B4_93BF2AEA82BC_2"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.53",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.57"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_16736589_1BDB_F204_4197_B10E10959ADF"
  },
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.36",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.47"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_371B1A36_2F93_7565_419F_DC23C6E93CC3"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.32",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.69"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_173BC8EF_1BDA_121C_41BB_234A0345A49C"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.40",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.32"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_17000E76_1BDA_2E0C_41AF_D63791BF4EAB"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.72",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.56"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_169131DD_1BE6_123C_41B7_7073C3019485"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.69",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.66"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_16E12898_1BE6_F204_41B3_3E5A82D4CF9A"
  },
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.48",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.38"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_3658CE70_2F95_2DFD_41BB_95EC87D121EA"
  }
 ]
},
{
 "paddingRight": 0,
 "gap": 10,
 "minWidth": 20,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "overflow": "scroll",
 "horizontalAlign": "left",
 "propagateClick": false,
 "class": "Container",
 "width": "100%",
 "backgroundColor": [],
 "id": "container_F0BCFFD6_FDD4_902A_41E9_EABBF538BC37",
 "children": [
  "this.viewer_uidF0BB9FD5_FDD4_902E_41E2_E1A2DDFBAE5A",
  {
   "paddingRight": 0,
   "gap": 10,
   "left": 0,
   "minWidth": 20,
   "scrollBarWidth": 7,
   "right": 0,
   "scrollBarMargin": 2,
   "overflow": "scroll",
   "horizontalAlign": "left",
   "propagateClick": false,
   "class": "Container",
   "backgroundColor": [],
   "children": [
    "this.htmltext_F0BB8FD7_FDD4_902A_41D8_2F2C867E18CF"
   ],
   "contentOpaque": true,
   "paddingBottom": 0,
   "shadow": false,
   "scrollBarColor": "#FFFFFF",
   "scrollBarVisible": "rollOver",
   "layout": "vertical",
   "backgroundColorDirection": "vertical",
   "scrollBarOpacity": 0.5,
   "paddingTop": 0,
   "backgroundOpacity": 0.3,
   "height": "30%",
   "verticalAlign": "bottom",
   "paddingLeft": 0,
   "borderRadius": 0,
   "borderSize": 0,
   "minHeight": 20,
   "bottom": 0,
   "backgroundColorRatios": [],
   "data": {
    "name": "Container1656"
   }
  },
  "this.component_F0B9DFD8_FDD4_9026_41D3_9C061866D83D",
  "this.component_F0B82FD8_FDD4_9026_41BB_F64B78D11DE1"
 ],
 "contentOpaque": false,
 "paddingBottom": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "backgroundOpacity": 0.3,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "backgroundColorRatios": [],
 "data": {
  "name": "Container1655"
 }
},
{
 "id": "album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.37",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.46"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_3172B0E3_2F95_36E3_41B1_9DA369CCB13E"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.64",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.35"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_36727D27_2F9D_2F63_41BA_8EE2EA079ED9_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.54",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.75"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31848902_2F95_171D_41B7_C159F68EAE74"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.68",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.65"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31CEEC58_2F95_6D2D_41C2_D00705969834"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.29",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.56"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31751EE6_2F95_6AE5_41BC_E80B0D93E0DD"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.32",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.75"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_3173B13C_2F95_7765_41C4_97B76D4A8682"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.50",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.53"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_317373BF_2F95_7B63_41C2_EE5CE0169B4B"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.34",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.47"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31729630_2F95_7D7D_41B0_44A2B5C516E9"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.51",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.48"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_3172C8A6_2F95_7562_41AA_718D6950386C"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.66",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.63"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_317EEB3B_2F95_6B63_41BC_4E5A5AFFBC21"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.58",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.42"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_317FAD99_2F95_6F2F_41BA_141EA18567B3"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.42",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.62"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31745018_2F95_152D_41AB_FD0BA7C83181"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.61",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.74"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_36333405_2FFD_1D27_41C2_A8850A963931"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.47",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.51"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_3173926D_2F95_15E7_41B3_9B101F175342"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.67",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.66"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_3175C4E7_2F95_1EE2_41AC_33D0058F6A28"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.59",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.74"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31753761_2F95_1B1F_41BE_312E7D761EAC"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.36",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.38"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_317269C7_2F95_1723_4191_79C8244B985E"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.59",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.30"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_31736C3B_2F95_2D63_41C2_62475673F4B8"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.46",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.48"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_317C8E71_2F95_2DFF_41B3_BE09FF01C695"
  }
 ]
},
{
 "id": "album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.45",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.64"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_0"
  },
  {
   "camera": {
    "scaleMode": "fit_inside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.68",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.43"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_2"
  },
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.30",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.47"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.photo_C3E14C78_F165_09E3_41E3_9B94D6640E64"
  }
 ]
},
{
 "id": "panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_7FFB1922_6E70_F2EB_41D4_93AF95F333C1",
 "areas": [
  {
   "toolTip": "Fork - Rock Roses and Spanish Moss",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A587C82_2777_2D1D_415B_1535451C4887, this.camera_F2CDD262_FDD4_F0EA_41C1_2FF22596E5D2); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -30.89,
   "hfov": 23.11,
   "yaw": 38.9,
   "image": "this.AnimatedImageResource_E645F322_F9D2_C86C_41CF_7EB27D4EA129",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 38.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.89,
   "hfov": 23.11
  }
 ]
},
{
 "id": "overlay_7FB7D09A_6E70_13DB_41D3_ADC189CDECF0",
 "areas": [
  {
   "toolTip": "Fork - Cactus Patch and Eanes Creek",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BE02603_2777_FD20_41C2_33930A820301, this.camera_F2DB1250_FDD4_F026_41E6_FCF832239DE4); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -34.34,
   "hfov": 22.23,
   "yaw": -155.06,
   "image": "this.AnimatedImageResource_E6458322_F9D2_C86C_41E3_FAAB546F0E6D",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -155.06,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -34.34,
   "hfov": 22.23
  }
 ]
},
{
 "id": "overlay_A76F6EB1_B125_0965_41D6_534E3D397B2F",
 "areas": [
  {
   "click": "this.showPopupMedia(this.window_E6C29764_F9F1_48F4_4146_5E1409AC4090, this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27, this.playList_F0BCBFD4_FDD4_902E_41E2_3ADBE75C1B90, '90%', '90%', false, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "image": {
    "levels": [
     {
      "width": 319,
      "class": "ImageResourceLevel",
      "height": 318,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_1_HS_2_0.png"
     }
    ],
    "class": "ImageResource"
   },
   "hfov": 14.94,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "pitch": 2.21,
   "yaw": -57.37
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -57.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 2.21,
   "hfov": 14.94
  }
 ]
},
{
 "id": "album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.55",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.45"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_0"
  },
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.43",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.55"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_1"
  },
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.72",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.37"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_2"
  }
 ]
},
{
 "id": "overlay_1AA2A67F_16AE_C51D_419C_BD875200B2F4",
 "areas": [
  {
   "toolTip": "Entrance",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 821.96,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_14_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 700.93,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 700.93,
  "height": 30,
  "y": 821.96,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_14.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_18616ECD_16B1_C57D_4194_FA82A7C581A3",
 "areas": [
  {
   "toolTip": "Dry Creek Bed",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 744.18,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_15_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 649.13,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 649.13,
  "height": 30,
  "y": 744.18,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_15.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_19C5A820_16B3_CD23_41A9_BAD9F0077E15",
 "areas": [
  {
   "toolTip": "Cactus Patch",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 684.28,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_16_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 601.61,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 601.61,
  "height": 30,
  "y": 684.28,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_16.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_1969E783_16BE_C3E5_4192_354CF571D5E8",
 "areas": [
  {
   "toolTip": "Stairs to Lookout Point",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 631.71,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_17_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 442.99,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 442.99,
  "height": 30,
  "y": 631.71,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_17.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_0296E18D_16D6_BFFD_418B_034B0423BA41",
 "areas": [
  {
   "toolTip": "Stairs From Lookout Point",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 561.27,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_19_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 476.15,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 476.15,
  "height": 30,
  "y": 561.27,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_19.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_028B3903_16DE_4CE5_4164_202BC245EF02",
 "areas": [
  {
   "toolTip": "Cliff Face",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 481.2,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_20_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 535.29,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 535.29,
  "height": 30,
  "y": 481.2,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_20.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_035EC68C_16F2_45E3_41B4_12BCB405AFEC",
 "areas": [
  {
   "toolTip": "Mirror Pond",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 568.6,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_21_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 705.37,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 705.37,
  "height": 30,
  "y": 568.6,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_21.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_34285EE4_277D_2AE5_41B1_DCB70221556B",
 "areas": [
  {
   "toolTip": "Fork to Cactus Patch and Eanes Creek",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 693.6,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_22_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 639.81,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 639.81,
  "height": 30,
  "y": 693.6,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_22.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_34E71BBA_2773_EB6D_41A9_0D5B6D2B14D7",
 "areas": [
  {
   "toolTip": "Fork to Rock Roses and Spanish Moss",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 693.6,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_23_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 535.9,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 535.9,
  "height": 30,
  "y": 693.6,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_23.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_33DECA0B_2693_F523_4183_BFCEE3CCE0BB",
 "areas": [
  {
   "toolTip": "Spanish Moss",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 580.67,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_24_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 530.09,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 530.09,
  "height": 30,
  "y": 580.67,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 30,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_24.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_346D2E79_2FF3_2DEF_41BC_E7DB73E8C038",
 "areas": [
  {
   "toolTip": "Lookout Point Ledge",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 20,
  "class": "HotspotMapOverlayMap",
  "height": 20,
  "y": 590.61,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_27_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 462.09,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 462.09,
  "height": 20,
  "y": 590.61,
  "image": {
   "levels": [
    {
     "width": 20,
     "class": "ImageResourceLevel",
     "height": 20,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_27.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 20,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_343154F7_2F8D_3EE3_4182_485D0EA9300D",
 "areas": [
  {
   "toolTip": "Lookout Point Area",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 20,
  "class": "HotspotMapOverlayMap",
  "height": 20,
  "y": 597.18,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_28_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 443.3,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 443.3,
  "height": 20,
  "y": 597.18,
  "image": {
   "levels": [
    {
     "width": 20,
     "class": "ImageResourceLevel",
     "height": 20,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_28.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 20,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "overlay_7D9559BB_6E90_35D9_41D1_87F0F07B2124",
 "areas": [
  {
   "toolTip": "Rock Roses",
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "AreaHotspotMapOverlay",
 "rollOverDisplay": false,
 "map": {
  "width": 30,
  "class": "HotspotMapOverlayMap",
  "height": 30,
  "y": 642.26,
  "image": {
   "levels": [
    {
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_29_map.gif"
    }
   ],
   "class": "ImageResource"
  },
  "x": 503.81,
  "offsetY": 0,
  "offsetX": 0
 },
 "image": {
  "x": 503.81,
  "height": 30,
  "y": 642.26,
  "image": {
   "levels": [
    {
     "width": 30,
     "class": "ImageResourceLevel",
     "height": 29,
     "url": "media/map_010A27D4_055F_CA60_41B5_0F10F6F3B206_HS_29.png"
    }
   ],
   "class": "ImageResource"
  },
  "width": 30,
  "class": "HotspotMapOverlayImage"
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true
},
{
 "id": "panorama_2BE02603_2777_FD20_41C2_33930A820301_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_7CFD44BD_6E70_13D9_41C5_325C2A5F9C67",
 "areas": [
  {
   "toolTip": "Cactus Patch",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0, this.camera_F35881A6_FDD4_F06A_41EF_280A94522030); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -13.72,
   "hfov": 13.89,
   "yaw": 82.21,
   "image": "this.AnimatedImageResource_E6429321_F9D2_C86C_41E6_9C207636BE49",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 82.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.72,
   "hfov": 13.89
  }
 ]
},
{
 "id": "overlay_7F26D2BC_6E70_17DF_418C_6CC8B91FE33E",
 "areas": [
  {
   "toolTip": "Mirror Pond",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E, this.camera_F348C1C2_FDD4_F02A_41D1_770FCA843B8C); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -22.31,
   "hfov": 13.23,
   "yaw": -164.38,
   "image": "this.AnimatedImageResource_E6424321_F9D2_C86C_41E5_C9FF78817235",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -164.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.31,
   "hfov": 13.23
  }
 ]
},
{
 "id": "album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_AlbumPlayList",
 "class": "PhotoPlayList",
 "items": [
  {
   "camera": {
    "scaleMode": "fit_outside",
    "duration": 5000,
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "targetPosition": {
     "x": "0.45",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.70"
    }
   },
   "class": "PhotoPlayListItem",
   "media": "this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_0"
  }
 ]
},
{
 "id": "panorama_2A587C82_2777_2D1D_415B_1535451C4887_tcap0",
 "class": "TripodCapPanoramaOverlay",
 "angle": 0,
 "hfov": 37.5,
 "rotate": false,
 "inertia": false,
 "distance": 50,
 "image": {
  "levels": [
   {
    "width": 850,
    "class": "ImageResourceLevel",
    "height": 850,
    "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_tcap0.png"
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "overlay_7D10B969_6E70_1579_41DB_1E07EE198721",
 "areas": [
  {
   "toolTip": "Cactus Patch",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0, this.camera_F3D180B2_FDD4_F06A_41EE_7D39AEAD909F); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -37.01,
   "hfov": 21.5,
   "yaw": -82.75,
   "image": "this.AnimatedImageResource_E644D323_F9D2_C86C_41E4_27A9232BF219",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_1_HS_0_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -82.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -37.01,
   "hfov": 21.5
  }
 ]
},
{
 "id": "overlay_7CA1175C_6E70_FD5F_41D5_19B492554547",
 "areas": [
  {
   "toolTip": "Rock Roses",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_2A49533A_2775_3B6D_41B2_C4785C51308E, this.camera_F3C150C4_FDD4_F02E_41EE_C41197CB9F17); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -38.93,
   "hfov": 20.95,
   "yaw": 48.47,
   "image": "this.AnimatedImageResource_E644B323_F9D2_C86C_41CB_4FDB97845DC3",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_1_HS_1_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 48.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -38.93,
   "hfov": 20.95
  }
 ]
},
{
 "id": "overlay_7CE58D22_6E90_12EB_41CF_F462E1ACCC26",
 "areas": [
  {
   "toolTip": "Spanish Moss",
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "useHandCursor": true,
 "enabledInCardboard": true,
 "items": [
  {
   "pitch": -39.31,
   "hfov": 20.83,
   "yaw": 117.71,
   "image": "this.AnimatedImageResource_E6446323_F9D2_C86C_41ED_7E6D966B2489",
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "data": {
  "label": "Circle Arrow 01b Right-Up"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "width": 37,
      "class": "ImageResourceLevel",
      "height": 16,
      "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_1_HS_2_0_0_map.gif"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 117.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -39.31,
   "hfov": 20.83
  }
 ]
},
{
 "id": "AnimatedImageResource_E6497326_F9D2_C874_41E5_BD7104061A03",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E648C326_F9D2_C874_41C5_13E38E604106",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0BD09_2774_EF21_4196_BFDEFF2B9F16_1_HS_1_0.png"
  }
 ]
},
{
 "id": "viewer_uidF0A10FE0_FDD4_EFE6_41BE_AFE0E9C1B333PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0A10FE0_FDD4_EFE6_41BE_AFE0E9C1B333",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0A47FDD_FDD4_EFDE_41D7_1AE5363E1AA7",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1666"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0A33FDE_FDD4_EFDA_4197_63EE02852E73",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1669"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0A38FDE_FDD4_EFDA_41D5_3CF7B39FAA56",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_E51177F6_F753_57D4_41B1_A793F6E896D4_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1670"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0A3EFDE_FDD4_EFDA_41A9_8ADCF07C675E",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_E51177F6_F753_57D4_41B1_A793F6E896D4_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1671"
 }
},
{
 "id": "AnimatedImageResource_E6462325_F9D2_C874_41E0_FA358429F0A3",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E6499326_F9D2_C874_41DE_E279B01E6B21",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0E555_2777_1F27_41B7_FEB34EDF4AD5_1_HS_1_0.png"
  }
 ]
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0A10FE0_FDD4_EFE6_41BE_AFE0E9C1B333",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1672"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0A27FE0_FDD4_EFE6_41D0_F60EFFD4A7BC",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1675"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0A12FE1_FDD4_EFE6_41E3_1852610D8A6B",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1676"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0A13FE1_FDD4_EFE6_41E0_F67F397E8FA7",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_E05B5415_F9B1_4854_41E2_5BDEDA68B42B_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1677"
 }
},
{
 "id": "AnimatedImageResource_E6481327_F9D2_C874_41E9_A5F574631439",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E64BD327_F9D2_C874_41C1_37DA613E39B3",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A839B55_2775_EB27_41AA_45F0A52C948E_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E64AB328_F9D2_C87C_41E7_4B7561F7DADD",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E64A1329_F9D2_C87C_41E7_B401E3D84F48",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE3F9FF_2775_36E3_41B4_02AD6810F00D_1_HS_2_0.png"
  }
 ]
},
{
 "id": "viewer_uidF0AEBFE4_FDD4_EFEE_41C6_E8FCD8342CA3PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0AEBFE4_FDD4_EFEE_41C6_E8FCD8342CA3",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "id": "AnimatedImageResource_E643A321_F9D2_C86C_41D5_1B4322478B84",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E6430321_F9D2_C86C_41BF_A0B241BB076B",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE0662D_2777_1D67_4197_2EC03ECFE99C_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E64DB329_F9D2_C87C_41E3_9EE124C32357",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E64D7329_F9D2_C87C_41E7_6654343E1F9F",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A79CF76_2774_EBE5_41B5_E79FA105500E_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E646E325_F9D2_C874_41CB_27FC4FCBD438",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E646A325_F9D2_C874_41E5_82B1C3D1209B",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A76B44E_2775_3D25_41AA_E9A4ECFC02FE_1_HS_1_0.png"
  }
 ]
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0AC5FE6_FDD4_EFEA_41E0_8AA10C1DBE91",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1690"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0AB6FE6_FDD4_EFEA_41BA_F421D024A521",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1693"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0ABCFE7_FDD4_EFEA_41E3_D52D717C432E",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1694"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0AA2FE7_FDD4_EFEA_41EF_73A53EFB5702",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C947C58D_CF5B_1B3D_41E7_EAE0F7123079_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1695"
 }
},
{
 "id": "viewer_uidF0A47FDD_FDD4_EFDE_41D7_1AE5363E1AA7PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0A47FDD_FDD4_EFDE_41D7_1AE5363E1AA7",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "id": "viewer_uidF0BB9FD5_FDD4_902E_41E2_E1A2DDFBAE5APhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0BB9FD5_FDD4_902E_41E2_E1A2DDFBAE5A",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "id": "viewer_uidF0A71FDA_FDD4_EFDA_41BB_4600A8C252BBPhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0A71FDA_FDD4_EFDA_41BB_4600A8C252BB",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "id": "AnimatedImageResource_E647F324_F9D2_C874_41E3_55084A34DA36",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E647B324_F9D2_C874_41EB_953B877BFA98",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A49533A_2775_3B6D_41B2_C4785C51308E_1_HS_2_0.png"
  }
 ]
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0AEBFE4_FDD4_EFEE_41C6_E8FCD8342CA3",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1684"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0AD6FE5_FDD4_EFEE_41BD_4FF46B694DA4",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1687"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0AC2FE5_FDD4_EFEE_41E4_9833E37ADA6B",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1688"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0AC3FE5_FDD4_EFEE_41BB_FDEDF1D1A3F7",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_C65587B4_CF25_0763_41AA_F07882B4DA50_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1689"
 }
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0A71FDA_FDD4_EFDA_41BB_4600A8C252BB",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1660"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0A7DFDB_FDD4_EFDA_41E9_ACC24C6933E8",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1663"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0A68FDB_FDD4_EFDA_41D0_0640369EE8D7",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1664"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0A69FDB_FDD4_EFDA_41EB_111474198ACD",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_AE202F34_B73D_0763_41DA_7F6605170401_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1665"
 }
},
{
 "id": "viewer_uidF0A03FE2_FDD4_EFEA_41D8_035BED038593PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0A03FE2_FDD4_EFEA_41D8_035BED038593",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "id": "viewer_uidF0AC5FE6_FDD4_EFEA_41E0_8AA10C1DBE91PhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer",
 "buttonPrevious": "this.IconButton_0549ECAE_1C2A_121C_4188_6BDD69838E9C",
 "viewerArea": "this.viewer_uidF0AC5FE6_FDD4_EFEA_41E0_8AA10C1DBE91",
 "buttonNext": "this.IconButton_0549CCAE_1C2A_121C_419B_FF389ABE0FEF"
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0A03FE2_FDD4_EFEA_41D8_035BED038593",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1678"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0A0CFE3_FDD4_EFEA_41D1_C54910D1E876",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1681"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0AFBFE3_FDD4_EFEA_41E2_DFBDA53F39E6",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1682"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0AFEFE3_FDD4_EFEA_41B0_B3FCC9BB4A37",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_EC5846E8_F9B1_C9FC_41DB_D6ECC3271DD8_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1683"
 }
},
{
 "id": "AnimatedImageResource_E64BA328_F9D2_C87C_41B5_F3403581084A",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E64B1328_F9D2_C87C_41EE_8A69433C2A05",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A8D5F32_2775_6B7D_41B7_8638AE46D7B6_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E643E320_F9D2_C86C_41D8_B5FEC582B823",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A678049_2777_352F_41C1_49B3B5E4A8CA_1_HS_0_0.png"
  }
 ]
},
{
 "paddingRight": 0,
 "toolTipTextShadowOpacity": 0,
 "minWidth": 100,
 "toolTipOpacity": 1,
 "progressBarBorderColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "playbackBarOpacity": 1,
 "toolTipFontColor": "#606060",
 "toolTipPaddingRight": 6,
 "firstTransitionDuration": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "class": "ViewerArea",
 "transitionDuration": 500,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBarBorderSize": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "toolTipShadowSpread": 0,
 "paddingLeft": 0,
 "transitionMode": "blending",
 "toolTipShadowBlurRadius": 3,
 "progressLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "toolTipShadowVerticalLength": 0,
 "toolTipDisplayTime": 600,
 "toolTipFontFamily": "Arial",
 "toolTipPaddingBottom": 4,
 "playbackBarBackgroundOpacity": 1,
 "progressBottom": 2,
 "playbackBarBottom": 0,
 "playbackBarHeight": 10,
 "vrPointerColor": "#FFFFFF",
 "toolTipFontSize": "1.11vmin",
 "progressRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderColor": "#000000",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressOpacity": 1,
 "playbackBarProgressOpacity": 1,
 "playbackBarProgressBorderSize": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressHeight": 10,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarRight": 0,
 "propagateClick": false,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipFontWeight": "normal",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadWidth": 6,
 "width": "100%",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "id": "viewer_uidF0BB9FD5_FDD4_902E_41E2_E1A2DDFBAE5A",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipShadowHorizontalLength": 0,
 "toolTipBorderSize": 1,
 "paddingBottom": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "shadow": false,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarBorderRadius": 0,
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarLeft": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarBorderSize": 0,
 "paddingTop": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "borderRadius": 0,
 "toolTipBorderColor": "#767676",
 "borderSize": 0,
 "minHeight": 50,
 "playbackBarHeadBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "data": {
  "name": "ViewerArea1654"
 },
 "toolTipTextShadowColor": "#000000"
},
{
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "HTMLText",
 "width": "100%",
 "backgroundColor": [
  "#000000"
 ],
 "id": "htmltext_F0BB8FD7_FDD4_902A_41D8_2F2C867E18CF",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 5,
 "shadow": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "visible": false,
 "paddingTop": 5,
 "backgroundOpacity": 0.7,
 "paddingLeft": 10,
 "html": "",
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "HTMLText1657"
 }
},
{
 "paddingRight": 0,
 "left": 10,
 "minWidth": 0,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_left.png",
 "id": "component_F0B9DFD8_FDD4_9026_41D3_9C061866D83D",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_AlbumPlayList, -1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1658"
 }
},
{
 "paddingRight": 0,
 "minWidth": 0,
 "right": 10,
 "horizontalAlign": "center",
 "propagateClick": false,
 "showEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "class": "IconButton",
 "iconURL": "skin/album_right.png",
 "id": "component_F0B82FD8_FDD4_9026_41BB_F64B78D11DE1",
 "mode": "push",
 "hideEffect": {
  "duration": 250,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "paddingBottom": 0,
 "shadow": false,
 "click": "this.loadFromCurrentMediaPlayList(this.album_E6CC9A87_F9F1_5834_41D3_2D71EAACDD27_AlbumPlayList, 1)",
 "visible": false,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "verticalAlign": "middle",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 0,
 "top": "45%",
 "cursor": "hand",
 "transparencyActive": true,
 "data": {
  "name": "IconButton1659"
 }
},
{
 "id": "AnimatedImageResource_E645F322_F9D2_C86C_41CF_7EB27D4EA129",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E6458322_F9D2_C86C_41E3_FAAB546F0E6D",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BF103C6_2775_7B25_41BF_BC5A1F8EFAD0_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E6429321_F9D2_C86C_41E6_9C207636BE49",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E6424321_F9D2_C86C_41E5_C9FF78817235",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2BE02603_2777_FD20_41C2_33930A820301_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E644D323_F9D2_C86C_41E4_27A9232BF219",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_1_HS_0_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E644B323_F9D2_C86C_41CB_4FDB97845DC3",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_1_HS_1_0.png"
  }
 ]
},
{
 "id": "AnimatedImageResource_E6446323_F9D2_C86C_41ED_7E6D966B2489",
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "colCount": 4,
 "rowCount": 6,
 "frameDuration": 41,
 "levels": [
  {
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 780,
   "url": "media/panorama_2A587C82_2777_2D1D_415B_1535451C4887_1_HS_2_0.png"
  }
 ]
}],
 "id": "rootPlayer",
 "contentOpaque": false,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "shadow": false,
 "children": [
  "this.TabPanel_EA372801_F8DB_22F3_41E4_0E3F42744A6D"
 ],
 "scrollBarVisible": "rollOver",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "height": "100%",
 "verticalAlign": "top",
 "paddingLeft": 0,
 "borderRadius": 0,
 "borderSize": 0,
 "minHeight": 20,
 "data": {
  "name": "Player502"
 }
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


	if(script.data == undefined)
		script.data = {};
	script.data["history"] = {};   

	TDV.PlayerAPI.defineScript(script);
})();

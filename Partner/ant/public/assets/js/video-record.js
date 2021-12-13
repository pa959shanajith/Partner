var player;
var videoJDFiles = [];
var level = 1;
var instance = undefined;
var retakeVideo = false;
function startRecording(_instance){
	console.log("Starting Recording  ");
	//$("#startBtn").hide();
	//$("#jd-video").removeClass("hide");
	instance = _instance;
	var id = _instance.state.current + 1;
	setTimeout(function(){startCamera(id);},100);
	
};
function startCamera(videoId){
	console.log("Starting Camera");
	//$("#next").addClass("disabled");
	var options = {
	  controls: true,
	  width: 680,
	  height: 340,
	  fluid: false,
	  loop: false,
	  plugins: {
		record: {
		  audio: true,
		  video: true,
		  maxLength: 60,
		  debug: true,
		  videoMimeType: "video/webm;codecs=VP8"
		}
	  }
	};
	
	player = videojs(document.getElementById('play'+videoId), options, function() {
		//print version information at startup
		var msg = 'Using video.js ' + 
			' with videojs-record ' + videojs.getPluginVersion('record') +
			' and recordrtc ';
		videojs.log(msg);
	});
	
	// error handling
	player.on('deviceError', function() {
		console.log('device error:', player.deviceErrorCode);
	});
	
	player.on('error', function(element, error) {
		console.error(error);
	});
	player.on('startRecord', () => {
	  console.log('started recording!');
	});

	// user completed recording and stream is available
	player.on('finishRecord', () => {
	  // recordedData is a blob object containing the recorded data that
	  // can be downloaded by the user, stored on server etc.
	  // console.log('finished recording: ', this.player.recordedData);
	  //this.levelOneDone = true;
	  var _id = player.id().substr(4);
	  var obj = findVideo(_id);
	  if(obj == undefined || obj.length == 0){
		videoJDFiles.push({id: _id, data: player.recordedData});
	  }
	  else
	  {
		//this.removeVideo(_id);
		videoJDFiles.push({id: _id, data: player.recordedData});
	  }
	  if(instance != undefined)
	  {
			if (!retakeVideo) {
				if (instance.state.current == 0)
					instance.enableDisable(false);
				else if (instance.state.current == 1)
					instance.enableDisable(false);
				else if (instance.state.current == 2)
					instance.enableDisable(false);
			} else {
				retakeVideo = false;
				instance.goToPreview();
			}
		} 
	});
}


function retake(id){
	retakeVideo = true;
	//startCamera(""+id);
}
function findVideo(_id){
	var i = videoJDFiles.length;
	while(i--){
		if( videoJDFiles[i] && videoJDFiles[i].id === _id ){ 
		  return videoJDFiles[i];
		}
	}
	return undefined;
}
function removeVideo(_id){
	var i = videoJDFiles.length;
	while(i--){
		if( videoJDFiles[i] && videoJDFiles[i].id === _id ){ 
			videoJDFiles.splice(i,1);
		}
	}
	return videoJDFiles;
}  
function playVideo(id) {
	var recordedVideo = document.querySelector('video#play4');
	var videoObj = findVideo(id);
	recordedVideo.src = null;
	recordedVideo.srcObject = null;
	recordedVideo.src = window.URL.createObjectURL(videoObj.data);
	recordedVideo.controls = true;
	recordedVideo.play();
}
function getVideoJDs() {
	return videoJDFiles;
}
function disposeVideo() {
	if(player && player.player_) 
	{
		player.dispose();
	}
}
function destroyVideoJD(){
	if(player && player.player_) 
	{
		player.dispose();
	}
	player = undefined;
	videoJDFiles = [];
	retakeVideo = false;
}




		
		
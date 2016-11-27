micInput = function(initialize){
	// set up for audio input
	try {
		var source
		navigator.getUserMedia = navigator.webkitGetUserMedia
		if (navigator.getUserMedia({audio: true, video: false}, connectStream, microphoneError))
		{
			console.log(source)
			return(source)
		}
		
	}
	catch(e) {
		alert("Sorry, your browser doesn't support the magic of getUserMedia \n try the latest firefox or chrome");
	}

	// if the mic is accesible
	function connectStream(stream)
	{
		source = audioContext.createMediaStreamSource(stream);
		initialize(source)
	}

	// if the mic is in accessible
	function microphoneError(e) {
		alert('MicrophoneError error!', e);
	};

	
}

fileInput = function(path,initialize)
{
	// Create an <audio> element.
	var audio = new Audio();
		
	// // Pick any one of these songs
	audio.src = path
	audio.autoplay = true;
	audio.playbackRate = 1;

	// Our <audio> element will be the audio source.
	source = audioContext.createMediaElementSource(audio);
	
	initialize(source)
}
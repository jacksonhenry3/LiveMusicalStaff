// set up for audio input
try {
	navigator.getUserMedia = navigator.webkitGetUserMedia
	navigator.webkitGetUserMedia({audio: true, video: false}, connectStream, microphoneError);
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of getUserMedia \n try the latest firefox or chrome");
}

// if the mic is accesible
function connectStream(stream)
{
	source = context.createMediaStreamSource(stream);
	initialize()
	anim()
}

// if the mic is in accessible
function microphoneError(e) {
	alert('MicrophoneError error!', e);
};


try {
	audioContext = new window.AudioContext();
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}
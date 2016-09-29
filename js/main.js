// set up for audio playback
try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}

var analyser = new FourierAnalyser(context),
	scale = new ChromaticScale()//center_frequency = 440, N = 0),
	canvas = new audioCanvas(context,scale,simpleLines);

// Create an <audio> element.
var audio = new Audio();
	
// Pick any one of these songs
audio.src = 'music/C-major.mp3'
audio.autoplay = true;
audio.playbackRate = 1;

// Our <audio> element will be the audio source.
source = context.createMediaElementSource(audio);

source1 = context.createOscillator()
source1.frequency.value = 440
// source1.start()
// source1.connect(source)
source.connect(analyser.node)
source.connect(context.destination)

canvas.animate()
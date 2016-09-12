// set up for audio playback
try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}



// initialize values that you might want to fiddle with
var freqBinNumber       = Math.pow(2,15),
	N= 3,//Number of octaves below a440 to start
	startingFrequency   = 440/Math.pow(2,N),
	numKeys             = 12*(2*N+1),
	numPoints           = 500,
	threshold           = 0 ; // 0=> no thrsholding otherwise between 0 and 1
	

// initialize values that you WON'T want to fiddle with
var	h          = $(window).height(),
	w          = $(window).width(),
	gainNode   = context.createGain(),
	MainBuffer = new Float32Array(freqBinNumber/2),
	dataSets   = [],
	MainAnalyser,
	series,
	source,
	dbToAbsract,
	canvas = document.getElementById('myCanvas');
    canvasContext = canvas.getContext('2d');

	gainNode.gain.value = .6

	canvasContext.canvas.width  = window.innerWidth;
  canvasContext.canvas.height = window.innerHeight;

// if the frequency range extends beyong the limit this cuts it off
// for (var i = numKeys - 1; i >= 0; i--) {
// 	if (keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)>24000){numKeys = i}
// }


// if the source is to be an audio file
function genAudioSource()
{

	// Create an <audio> element.
	var audio = new Audio();
	
		// Pick any one of these songs
		audio.src = 'C-major.mp3';
		audio.src = "Tobu - Roots [NCS Release].mp3"
		// audio.src = 'book1-prelude01.mp3';
		audio.src = "bach-bwv895-breemer.mp3"
		audio.src = "Chapter 22 - The Deathly Hallows.mp3"
		// audio.src = "09 - Dance Anthem of the 80's.m4a"
		// audio.src = '01 - The Calculation.m4a'
		// audio.src = "Silver Lining.mp3"
		// audio.src = "09 Wild Horse.mp3"

		audio.autoplay = true;
		audio.playbackRate =1;

	// Our <audio> element will be the audio source.
	// source = context.createMediaElementSource(audio);

	initialize()
	anim()
}



function initialize(){
	// Generate the analyser node
	MainAnalyser     = context.createAnalyser();
	MainAnalyser.fftSize = freqBinNumber;
	MainAnalyser.smoothingTimeConstant = 0;

	// connect the audio source to it
	source.connect(MainAnalyser)

for (var i = 0; i < numKeys; i++) {
	keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)
	data = []
	for (var j = numPoints - 1; j >= 0; j--) {data.unshift({x:1000000,y:(numKeys-i)*(h-20)/numKeys+10})}
	dataSets.push(data)
}



 dbToAbsract = d3.scaleLinear()
	.range([0,1])
	.domain([-70,-30])
	.clamp(true);



source.connect(gainNode);	
gainNode.connect(context.destination)
}


function anim(){
	requestAnimationFrame(anim)
	updateData(dataSets)

	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	
	

	for (var i = numKeys - 1; i >= 0; i--) {
		data = dataSets[i]
		canvasContext.beginPath();
		canvasContext.moveTo(0,(numKeys-i)*(h-20)/numKeys+10);
		for (var j = data.length - 1; j >= 0; j--) {
			
			canvasContext.lineTo(w/2-j*w/2/numPoints,data[j].y);
		}
		canvasContext.closePath();
		canvasContext.fillStyle = colors[i%12];
		canvasContext.strokeStyle = colors[i%12];
		canvasContext.fill()
	canvasContext.lineWidth = 1;
	canvasContext.stroke();
	}
	
}


function getFreqDat(freq)
{
	SR = context.sampleRate
	freqBinWidth=SR/(freqBinNumber/2)
	binNum = Math.floor(freq/freqBinWidth)
	return(MainBuffer[binNum])
}



function updateData(dataSets) {
	MainAnalyser.getFloatFrequencyData(MainBuffer);
	
	for (var i = numKeys - 1; i >= 0; i--) {
		keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)
		data = dataSets[i]



			
		mean = dbToAbsract(getFreqDat(keyFrequency));


		if (threshold != 0)
		{
			if (mean<threshold) {mean=0}
			// if (mean>threshold) {mean=1}
		}

		xLoc = w/2-i*w/2/numPoints



		data.pop()
		data.shift()
		data.unshift({x:xLoc,y:(mean)*h/numKeys+(numKeys-i)*(h-20)/numKeys+10})
		data.unshift({x:xLoc,y:(numKeys-i)*(h-20)/numKeys+10})

	}
}

// genAudioSource()
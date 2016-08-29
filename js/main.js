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
	startingFrequency   = 440/8,
	numKeys             = 12*10,
	numPoints           = 100,
	threshold           = 0; // 0=> no thrsholding otherwise between 0 and 1
	

// initialize values that you WON'T want to fiddle with
var	h          = $(window).height(),
	w          = $(window).width(),
	gainNode   = context.createGain(),
	MainBuffer = new Float32Array(freqBinNumber/2),
	dataSets   = [],
	MainAnalyser,
	series,
	source,
	svg,
	dbToAbsract;
	gainNode.gain.value = .8

// if the frequency range extends beyong the limit this cuts it off
for (var i = numKeys - 1; i >= 0; i--) {
	if (keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)>24000){numKeys = i}
}


// if the source is to be an audio file
function genAudioSource()
{

	// Create an <audio> element.
	var audio = new Audio();
	
		// Pick any one of these songs
		audio.src = 'C-major.mp3';
		audio.src = "Tobu - Roots [NCS Release].mp3"
		audio.src = 'book1-prelude01.mp3';
		audio.src = '01 - The Calculation.m4a'

		audio.autoplay = true;
		audio.playbackRate =1;

	// Our <audio> element will be the audio source.
	source = context.createMediaElementSource(audio);

	initialize()
	anim()
}





var line = d3.line()
	.curve(d3.curveCatmullRom.alpha(0.5))
    .x(function(d,i) { return w/2-i*w/2/numPoints; })
    .y(function(d,i) { return d.y; });
 


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
	for (var j = numPoints - 1; j >= 0; j--) {data.unshift({x:1000000,y:i*(h-20)/numKeys+10})}
	dataSets.push(data)
}




	// VISUALS
	svg = d3.select("#a").append("svg:svg")
	.attr("width", w)
	.attr("height",  h)
	.style('background-color','#EEE');

	series = svg.selectAll(".series")
    .data(dataSets)
    .enter()
    .append("g")
    .attr("class", "series");

series.append("path")
	.attr("d", function (d) {return line(d);})
	.attr("stroke",function(d,i) {return(colors[i%12]);})
    .attr("stroke-width",2)
    .attr('fill',function(d,i) {return(colors[i%12]);})

 dbToAbsract = d3.scaleLinear()
	.range([0,1])
	.domain([-70,-20])
	.clamp(true);



source.connect(gainNode);	
gainNode.connect(context.destination)
}


function anim(){
	requestAnimationFrame(anim)
	updateData(dataSets)
	series.select("path")
		.attr("d", function (d) {return line(d);})
		.attr("stroke-width",function(d,i){if (d.y-(i*(h-20)/numKeys+10)==0) {return(0)} return(2)});
		// .attr("stroke",function(d,i) {if(d.y>i*(h-20)/numKeys+10) {return('none')};  return(colors[i%12]);});
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
			if (mean>threshold) {mean=1}
		}


		data.pop()
		data.pop()
		data.shift()
		data.unshift({x:0,y:(mean)*h/numKeys*1+i*(h-20)/numKeys+10})
		data.unshift({x:0,y:i*(h-20)/numKeys+10})
		data.push({x:0,y:i*(h-20)/numKeys+10})
	}
}

genAudioSource()
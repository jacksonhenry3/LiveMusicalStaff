// set up for audio playback
try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}

// set up for audio input
try {
	navigator.getUserMedia = navigator.webkitGetUserMedia
	navigator.webkitGetUserMedia({audio: true, video: false}, connectStream, microphoneError);
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of getUserMedia \n try the latest firefox or chrome");
}

function getFrequencyValue(frequency) {
  var nyquist = context.sampleRate/2;
  var index = Math.round(frequency/nyquist * MainBuffer.length);
  return MainBuffer[index];
}

// if the mic is accesible
function connectStream(stream)
{
	// source = context.createMediaStreamSource(stream);
	// Create an <audio> element.
	var audio = new Audio();
	

		audio.src = 'C-major.mp3';
		// audio.src = 'Soldier.m4a';
		// audio.src = "Frug.mp3"
		audio.src = "Tobu - Roots [NCS Release]_7wNb0pHyGuI_youtube.mp3"
		// audio.src = "03 The Gladdest Thing.mp3"
		// audio.src = "Chapter 01 - The Boy Who Lived.mp3"
		// audio.src = 'book1-prelude01.mp3';
		audio.src = "http://hwcdn.libsyn.com/p/9/c/a/9ca9b58d704d5817/67v2.mp3?c_id=12345654&expiration=1472429776&hwt=3e7c538b2950db440cae5b0fb3f1ffd6"
		audio.autoplay = true;
		audio.playbackRate =1;

	// Our <audio> element will be the audio source.
	source = context.createMediaElementSource(audio);

	initialize()
	anim()
}

// if the mic is in accessible
function microphoneError(e) {
	alert('MicrophoneError error!', e);
};

function makeColorGradient(frequency1, frequency2, frequency3,
                             phase1, phase2, phase3,
                             center, width, len)
  {
  	colors = []
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    for (var i = 0; i < len; ++i)
    {
       var red = Math.floor(Math.sin(frequency1*i + phase1) * width + center);
       var grn = Math.floor(Math.sin(frequency2*i + phase2) * width + center);
       var blu = Math.floor(Math.sin(frequency3*i + phase3) * width + center);
       colors.push('rgba('+red.toString()+','+grn.toString()+','+blu.toString()+',.8)')
    }
    return(colors)
  }
var colors =  makeColorGradient(.3,.3,.3,0,2,4);

// set up vars and audio nodes
var freqBinNumber = Math.pow(2,15),
	gainNode      = context.createGain(),
	numKeys		  = 12*100,
	h 			  = $(window).height(),
	w 			  = $(window).width(),
	numPoints     = 100,
	filters  	  = [],
	analysers 	  = [],
	buffers  	  = [],
	dataSets 	  = [],
	startingFrequency = 440/8,
	MainAnalyser,
	MainBuffer = new Float32Array(freqBinNumber/2),
	series,
	source,
	svg,
	dbToAbsract;

for (var i = numKeys - 1; i >= 0; i--) {
	if (keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)>24000){numKeys = i}
}

var line = d3.line()
	// .curve(d3.curveCatmullRom.alpha(0.5))
    .x(function(d,i) { return w/2-i*w/2/numPoints; })
    .y(function(d,i) { return d.y; });


function generateFilter(freq) {
	var filter      = context.createBiquadFilter();
		filter.type = 'bandpass';
		filter.Q.value = 50;
		// filter.Q.value = 1/2;
		filter.frequency.value = freq;
	return(filter)
}

function generateAnalyser(){
	var analyser     = context.createAnalyser();
	analyser.fftSize = freqBinNumber;
	analyser.smoothingTimeConstant = 0;
	return(analyser)
}

// function 


function initialize(){
	MainAnalyser = generateAnalyser()
	source.connect(MainAnalyser)
// initialize all filters,analysers and data sources


for (var i = 0; i < numKeys; i++) {
	keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)

	// generate filter and analyser
	// filter = generateFilter(keyFrequency)
	// analyser = generateAnalyser()


	// add new nodes to audio graph
	// MainAnalyser.connect(filter);
	// filter.connect(analyser);
	// filter.connect(context.destination)

	data = []
	for (var j = numPoints - 1; j >= 0; j--) {data.unshift({x:1000000,y:i*(h-20)/numKeys+10})}

	// add to datums to lists
	// filters.push(filter)
	// analysers.push(analyser)
	// buffers.push(new Float32Array(freqBinNumber/2))
	dataSets.push(data)
}

// gainNode settings
gainNode.gain.value = .8


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



console.log(context.sampleRate)
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
	// return(0)
}

function updateData(dataSets) {
	MainAnalyser.getFloatFrequencyData(MainBuffer);
	// MainTotal = MainBuffer.reduce((a, b) => a + b)
	
	for (var i = numKeys - 1; i >= 0; i--) {
		keyFrequency = Math.pow(2,Math.log2(startingFrequency)+i/12)
		analyser = analysers[i]
		buffer = buffers[i]
		data = dataSets[i]

		// analyser.getFloatFrequencyData(buffer);
		// normalizedBuffer = buffer.map(function(x) { return x /1; });

		// var total = buffer.reduce((a, b) => a + b)
		// mean = dbToAbsract(getFrequencyValue(keyFrequency))


			
		mean = dbToAbsract(getFreqDat(keyFrequency));
		// mean = 
		var VALUE = document.getElementById("myRange").value;	
		// if (mean<.3) {mean=0}
		// if (mean>.3) {mean=1}


		data.pop()
		data.pop()
		data.shift()
		data.unshift({x:0,y:(mean)*h/numKeys*2+i*(h-20)/numKeys+10})
		data.unshift({x:0,y:i*(h-20)/numKeys+10})
		data.push({x:0,y:i*(h-20)/numKeys+10})
	}
}
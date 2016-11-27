var analyser = new FourierAnalyser(audioContext),
	scale = new ChromaticScale(center_frequency = 440, N = 2,history_length = 500),
	canvas = new audioCanvas(audioContext,scale,simpleLines);

initialize = function(source)
{
	source.connect(analyser.node)
	// source.connect(audioContext.destination)
	canvas.animate()
}

// fileInput('music/amclassical_beethoven_fur_elise.mp3',initialize)
micInput(initialize)
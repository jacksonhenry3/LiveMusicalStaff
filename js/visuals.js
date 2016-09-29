audioCanvas = function(audio_context, scale, animate_function)
{
	this.canvas = document.getElementById('myCanvas');
	this.context = this.canvas.getContext('2d')
	this.context.canvas.width  = window.innerWidth;
  	this.context.canvas.height = window.innerHeight;

	this.height = $(window).height()
	this.width = $(window).width()
	
	this.audio_context = audio_context
	this.animate_function = animate_function

	this.scale = scale

	this.animate = function()
	{
		this.animate_function()
	}
}

simpleLines = function()
{

	scale.updateNotes(analyser)
	context = canvas.context
	padding = 20//px
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let entry of scale.notes.entries())
	{
		i = entry[0]
		note = entry[1]
		context.beginPath();
		baseline_height = (scale.num_keys-i)*(canvas.height-padding)/scale.num_keys+padding/2
		line_height = (canvas.height-padding)/scale.num_keys

		context.moveTo(0,baseline_height);
		history_length = note.history.length
		for (let entry of note.history.entries())
		{
			j = entry[0]
			cal = 1-entry[1]
			context.lineTo(j*canvas.width/2/history_length,baseline_height+cal*line_height);
		}
		context.lineTo(canvas.width/2,baseline_height);
		context.closePath();
		context.fillStyle = colors[i%12];
		context.strokeStyle = colors[i%12];
		context.fill()
		context.lineWidth = 1;
		context.stroke();
	}
	requestAnimationFrame(simpleLines)
}
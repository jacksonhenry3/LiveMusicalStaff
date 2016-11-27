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
		baseline_height = (scale.num_keys-i)*(canvas.height-padding)/scale.num_keys-padding/2
		line_height = (canvas.height-padding)/scale.num_keys

		context.moveTo(0,baseline_height);
		history_length = note.history.length
		for (let entry of note.history.entries())
		{
			j = entry[0]
			cal = entry[1]
			context.lineTo(j*canvas.width/2/history_length,baseline_height+cal**3*line_height);
		}
		context.lineTo(canvas.width/2,baseline_height);
		context.closePath();
		context.fillStyle = colors[i%12].replace(".5555",Math.max(.15,Math.pow(note.magnitude,3)).toString());
		context.strokeStyle = colors[i%12].replace(".5555",Math.max(.15,Math.pow(note.magnitude,3)).toString());
		context.fill()
		context.lineWidth = 1;
		context.stroke();
	}
	requestAnimationFrame(simpleLines)
}
possible_note_names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
var harmonicsHistory = {}
for (let name of possible_note_names)
{
	harmonicsHistory[name] = Array(1000+1).join('0').split('').map(parseFloat)
	// console.log(name)
}

harmonicLines = function()
{

	scale.updateNotes(analyser)
	context = canvas.context
	padding = 20//px
	context.clearRect(0, 0, canvas.width, canvas.height);

	harmonics = {}
	for (let note of scale.notes)
	{
		// console.log(note.name)
		harmonics[note.name]=harmonics[note.name]+note.magnitude || note.magnitude
	}

	for (let name of possible_note_names)
	{
		harmonicsHistory[name].shift()
		harmonicsHistory[name].push(harmonics[name]/5)
	}

	i = 0
	for (let name of possible_note_names)
	{
		context.beginPath();
		line_height = (canvas.height-padding)/12
		baseline_height = (12-i)*line_height-padding/2
		

		context.moveTo(0,baseline_height);
		history_length = 1000
		for (let entry of harmonicsHistory[name].entries())
		{
			j = entry[0]
			val = entry[1]
			context.lineTo(j*canvas.width/2/history_length,baseline_height+val*line_height);
		}
		context.lineTo(canvas.width/2,baseline_height);
		context.closePath();
		context.fillStyle = colors[i%12]//.replace(".5",val.toString());
		context.strokeStyle = colors[i%12]//.replace(".5",val.toString());
		context.fill()
		context.lineWidth = 1;
		context.stroke();
		i++
	}
	requestAnimationFrame(harmonicLines)
}
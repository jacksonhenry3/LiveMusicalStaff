FourierAnalyser = function(context, freqBinNumber = Math.pow(2,14))
{
	this.context = context
	this.buffer = new Float32Array(freqBinNumber/2)
	this.node     = this.context.createAnalyser();
	this.node.fftSize = freqBinNumber;
	this.node.smoothingTimeConstant = .9;
	this.sample_rate = this.context.sampleRate
	this.freq_bin_width = this.sample_rate/(freqBinNumber/2)

	this.updateData = function()
	{
		this.node.getFloatFrequencyData(this.buffer);
	}

	this.connect = function(node)
	{
		this.node.connect(node)
	}

	this.getNoteMagnitude = function(freq)
	{
		// console.log(freq)
		binNum = Math.ceil(freq/this.freq_bin_width)
		// console.log(freq)
		// console.log(this.buffer[binNum])
		return(this.buffer[binNum])
	}
}

Note = function(frequency, name = 'NONE', history_length = 500)
{
	this.name = name //this.getName()
	this.frequency = frequency
	this.magnitude = 0
	this.history = Array(history_length+1).join('0').split('').map(parseFloat)

	this.getMagnitude = function(analyser)
	{
		db = analyser.getNoteMagnitude(this.frequency)
		this.magnitude = dbToAbstract(db)
		this.history.shift()
		this.history.push(this.magnitude)
	}
}

ChromaticScale = function(center_frequency = 440, N = 1,history_length = 100)
{
	this.num_keys = 12*(2*N+1)
	this.starting_frequency =  center_frequency/Math.pow(2,N)
	this.note_frequencys = []
	this.note_names = []
	this.notes = []
	this.note_history = []
	
	possible_note_names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
	for (var i = 0; i < this.num_keys; i++)
	{
		this.note_frequencys.push(Math.pow(2,Math.log2(this.starting_frequency)+i/12))
		this.note_names.push(possible_note_names[i%12])
	}

	for (let entry of this.note_frequencys.entries())
	{
		i = entry[0]
		freq = entry[1]
		this.notes.push(new Note(freq,this.note_names[i], history_length))
	}

	this.updateNotes = function(analyser)
	{
		analyser.updateData()
		for (let note of this.notes)
		{
			note.getMagnitude(analyser)
		}
	}
}

dbToAbstract = function(val)
{
	
	norm_val = (val+70)/40
	norm_val = Math.min(norm_val,1)
	norm_val = Math.max(norm_val,0)
	return(norm_val)
}
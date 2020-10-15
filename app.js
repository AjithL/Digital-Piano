// WRITTEN BY REY

/* credit to BOBE for the adshower */
const MS_BETWEEN_ADS = 90 * 1000;
class AdShower {
	constructor() {
		this.lastAdShow = 0;
		this.isQueueing = false;
		this.queuedAd = null;
	}
	playingOpportunity() {
		if (this.timeSinceLastAd() > MS_BETWEEN_ADS) {
			this.queueAd();
			if (this.canFireAd()) {
				this.lastAdShow = Date.now();
				this.fireAd();
			}
		}
	}
	timeSinceLastAd() {
		return Date.now() - this.lastAdShow;
	}
	queueAd() {
		if (!this.isQueueing && this.queuedAd == null) {
			this.isQueueing = true;
			getKaiAd({
				publisher: 'd213844c-c0c9-4d8f-9da8-3e96cba72428',
				app: 'Digital Piano',
				slot: 'Playing piano',
				test: 0,
				onerror: (err) => {
					console.error('Custom catch:', err);
					this.isQueueing = false;
				},
				onready: (ad) => {
					this.isQueueing = false;
					this.queuedAd = ad;
				}
			});
		}
	}
	canFireAd() {
		return this.queuedAd != null;
	}
	fireAd() {
		this.queuedAd.call('display');
		this.queuedAd = null;
	}
}

window.addEventListener("load", function() {
  // adshower
  var adShower = new AdShower();
  
  // loading and copying of all notes
  var noteDiv = document.getElementById("");
  var noteNames = ["C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5"];
  var notes = [];
  var notesCopies = [];
  var octave = 1;
  
  // whitenotes
  var white1 = document.getElementById("1"); 
  var white2 = document.getElementById("3"); 
  var white3 = document.getElementById("5"); 
  var white4 = document.getElementById("6"); 
  var white5 = document.getElementById("8"); 
  var white6 = document.getElementById("*"); 
  var white7 = document.getElementById("#"); 
  
  // blacknotes
  var black1 = document.getElementById("2");
  var black2 = document.getElementById("4");
  var black3 = document.getElementById("7");
  var black4 = document.getElementById("9");
  var black5 = document.getElementById("0");
  
  // softkeys
  var down = document.getElementById("down");
  var up = document.getElementById("up");
  
  var pointer = document.getElementById("pointer");
  
  for (var x = 0; x < noteNames.length; x++) {
	var noteHTML = createNoteHTML(noteNames[x]);
	var noteHTMLcopy = noteHTML.cloneNode(true);
	notes.push(noteHTML);
	notesCopies.push(noteHTMLcopy);
  }
  
  function createNoteHTML(name) {
	var note      = document.createElement('audio');
	note.id       = name;
	note.src      = 'notes/' + name + '.mp3';
	note.type     = 'audio/mpeg';
	note.playbackRate = 1.75; 
	note.mozaudiochannel = "normal";
	noteDiv.appendChild(note);
	return note;
  }
  
  function swapCopy(id) {
	var temp = notes[id];
	notes[id] = notesCopies[id];
	notesCopies[id] = temp;
  }
  
  function playSound(note) {
	note.pause();
	note.currentTime = 0;
	note.play();
  }
  
  function playNote(id) {
	var pos = id + (octave * 12);
	if (!notes[pos].paused) {
		playSound(notesCopies[pos]);
		swapCopy(pos);
	} else {
		playSound(notes[pos]);
	}
  }
  
  function highlightNote(note, color1, color2) {
	note.style.backgroundColor = color1;
	setTimeout(function(){
	  note.style.backgroundColor = color2;  
	}, 250);
  }
  
  function setPointer() {
	if (octave == 0) {
		pointer.style.left = "-7px";
	} else if (octave == 2) {
		pointer.style.left = "calc(100% - 7px)";
	} else {
		pointer.style.left = "calc(50% - 7px)";
	}
  }
  
  // map keys to notes
  function handleKeyDown(event) {
	adShower.playingOpportunity();  
	  
	switch (event.key) {
		case '1':
			playNote(0);
			highlightNote(white1, "lightgrey", "white");
		break;
		case '2':
			playNote(1);
			highlightNote(black1, "grey", "black");
		break;
		case '3':
			playNote(2);
			highlightNote(white2, "lightgrey", "white");
		break;
		case '4':
			playNote(3);
			highlightNote(black2, "grey", "black");
		break;
		case '5':
			playNote(4);
			highlightNote(white3, "lightgrey", "white");
		break;
		case '6':
			playNote(5);
			highlightNote(white4, "lightgrey", "white");
		break;
		case '7':
			playNote(6);
			highlightNote(black3, "grey", "black");
		break;
		case '8':
			playNote(7);
			highlightNote(white5, "lightgrey", "white");
		break;
		case '9':
			playNote(8);
			highlightNote(black4, "grey", "black");
		break;
		case '*':
			playNote(9);
			highlightNote(white6, "lightgrey", "white");
		break;
		case '0':
			playNote(10);
			highlightNote(black5, "grey", "black");
		break;
		case '#':
			playNote(11);
			highlightNote(white7, "lightgrey", "white");
		break;
		case 'SoftLeft':
			if (octave > 0) {
				octave--;
				highlightNote(down, "grey", "#262626");
				setPointer();
			}
		break;
		case 'SoftRight':
			if (octave < 2) {
				octave++;
				highlightNote(up, "grey", "#262626");
				setPointer();
			}
		break;
	}
  };
  document.addEventListener('keydown', handleKeyDown);
});

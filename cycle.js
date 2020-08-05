var loop, speed, length, sequence, beatToShow, tapTimeout;
var tap = [];
var currentBeat = 0;
var tapTotal = 0;
var tapAvg = 0;
var bpmFocused = false;
//non-button imputs
const bpmNum = document.getElementById('bpmNum');
const beatNum = document.getElementById('beatNum');
const accentEach = document.getElementById('accentEach');
//sfx files
const accent = new Audio('./res/accent.ogg');
const quarter = new Audio('./res/quarter.ogg');
const eighth = new Audio('./res/eighth.ogg');

//main cycle
function cycle() {
    arrayGen(accentEach.value, division); //the sequence of beats is generated

    if (division == 0) { //if division == 0, it's shuffle, so it's treated as a 3 division (because we can't divide by 0);
        speed = 60000 / bpmNum.value / 3;
        play(currentBeat);
        currentBeat >= (accentEach.value * 3) - 1 ? currentBeat = 0 : currentBeat++;
    } else { //if division == 1, 2, 3 or 4, the number directly affects the speed;
        speed = 60000 / bpmNum.value / division;
        play(currentBeat);
        currentBeat >= (accentEach.value * division) - 1 ? currentBeat = 0 : currentBeat++; //beat subdivision counter
    }
    beatNum.innerHTML = beatToShow; //this updates the beat counter

    if (bpmNum.value < 20 || bpmNum.value > 240) { //Check if the numbers used are valid; if not, turn them red
        bpmNum.style.color = "red";
        speed = 500; //placeholder speed until a valid one is written.
    } else {
        bpmNum.style.color = "#F0F3BD";
    }
    if (accentEach.value < 2 || accentEach.value > 8) {
        accentEach.style.color = "red";
    } else {
        accentEach.style.color = "#F0F3BD";
    }
    loop = setTimeout(cycle, speed); //main timer, calls itself
}

//generates a punched card-like sequence
function arrayGen(accEach, divEach) {
    sequence = []; //array is emptied every time, to allow a rebuild if the accent or div changes
    if (divEach == 0) { //if Shuffle, treat the division as 3 and add a 0 (silence) on every 3n+2 term (1,4,7)
        length = accEach * 3;
        for (let i = 0; i < length; i++) {
            i % 3 ? sequence[i] = 3 : (sequence[i] = 2);
            (i - 1) % 3 ? null : sequence[i] = 0;
        }
    } else { //if not Shuffle, simply use the division number to generate an appropriate sequence
        length = accEach * divEach;
        for (let i = 0; i < length; i++) {
            i % divEach ? sequence[i] = 3 : sequence[i] = 2;
        }
    }
    sequence[0] = 1; //add a 1, which marks a strong accent, to the beggining of every sequence, always.
}

function play(i) { //the generated array works much like a punched card
    if (sequence[i] == 1) { //1 = accent, only used at the begining of every bar
        accent.play();
        beatToShow = 1;
    } else if (sequence[i] == 2) { //2 = play a quarter note (or crotchet) sound
        quarter.play();
        beatToShow++;
    } else if (sequence[i] == 3) { //3 = play an eighth note (or quaver) sound
        eighth.play();
    }
}

function bpmTap() {
    beatNum.style.color = "#00A896"; //change color to green to signify that it's being controlled by the tap function 
    if (bpmTap.first) { //this if makes it so that the first time the fn runs, tap[0] equals the time now
        tap = [performance.now()];
        bpmTap.first = false;
    } else {
        tap.push(performance.now()); //add the current timestamp to the tap array initialized above
        for (let i = 0; i < tap.length - 1; i++) {
            tapTotal += tap[i + 1] - tap[i]; //add up all the differences between each timestamp (time elapsed)
        }
        tapAvg = tapTotal / tap.length; //average all the differences out
        tapTotal = 0; //reset the variable to avoid adding numbers from previous instances of bpmTap()
        bpmNum.value = Math.floor(60000 / tapAvg / division); //display the averaged value on the bpm counter
        clearInterval(tapTimeout); //clear the interval started below (READ MORE BELOW)
    }
    tapTimeout = setTimeout(function () { //This timeout makes it so that all the variables used in this function reset...
        bpmTap.first = true; //...themselves after 3.5 seconds of inactivity.
        tap = []; //This is done so that one can use the tap function multiple times, if not...
        tapIndex = 1; //...for this, we would have a, say, 45 seconds time difference somewhere in the middle
        tapAvg = 0; //Say we average the tempo, play a while, and then try again. All that time...
        beatNum.style.color = "#F0F3BD"; //...we waited would throw our average off balance, so I implemented this auto reset
    }, 3500);
}

document.addEventListener('keydown', function () {
    if (event.keyCode === 65) { //If A is pressed, tap
        bpmTap();
    } else if (event.keyCode === 32) { //If the Space bar is pressed, START or STOP the metronome
        swStartStop();
    } else if (event.keyCode === 68) { //If D is pressed, change the subdivision
        changeDiv();
    } else if (event.keyCode === 87) { //If W is pressed, increase the number of quarters in each compass
        accentEach.value = parseInt(accentEach.value) + 1;
    } else if (event.keyCode === 83) { //If S is pressed, decrease it
        accentEach.value = parseInt(accentEach.value) - 1;
    } else if (event.keyCode === 13) { //If Enter is pressed, focus on bpm
        if (bpmFocused == true) {
            bpmNum.blur();
            bpmFocused = !bpmFocused;
        } else if (bpmFocused == false) {
            bpmNum.value = "";
            bpmNum.focus();
            bpmFocused = !bpmFocused;
        }
    } else if (event.keyCode === 38) { //If W is pressed, increase the bpm
        event.preventDefault();
        bpmNum.value = parseInt(bpmNum.value) + 5;
    } else if (event.keyCode === 40) { //If S is pressed, decrease it
        event.preventDefault();
        bpmNum.value = parseInt(bpmNum.value) - 5;
    }
});
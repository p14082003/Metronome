//visual display
const divisionEach = document.getElementById('divisionEach');
const startStop = document.getElementById('startStop');

//vars that track the inputs of #startStop and #divisionEach
var onOff = false;
var division = 1;

//when #startStop is pressed, works like a switch
function swStartStop() {
    onOff = !onOff;
    if (onOff) {
        cycle();
        startStop.value = "Stop";
    } else {
        clearInterval(loop);
        currentBeat = 0;
        startStop.value = "Start";
    }
    startStop.blur();
}

//cycles between subdivisions. 0 = shuffle subdivision; 1 = no subdivision; 2, 3, 4 = 2, 3, 4 subdivisions
function changeDiv() {
    if (division < 4) {
        division++
        divisionEach.value = "Every " + division;
    } else {
        division = 0;
        divisionEach.value = "Shuffle";
    }
    divisionEach.blur();
}
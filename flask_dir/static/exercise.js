// collapsible button
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
};


// slider functionality
const slider = document.getElementById("workout-rating");
const output = document.getElementById("workout-rating-value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
};


// AJAX start workout
function startWorkout() {
    start = $.ajax({
        type: 'POST',
        url: '/start-workout',
        success: function() {
            console.log("workout started");
        }
    });

    start.done(function() {
        $('#start-workout-button').hide();
        $('#exercise-page-title').show();
        $('#cardio-button').show();
        $('#cardio-contents').show();
        $('#exercise-form').show();
    });
};


// starting exercise / set counts
var exerciseNumber = 1;
var setNumber = 1;


// set buttons
const addExerciseButton = document.getElementById("add-exercise-button");
const addSetButton = document.getElementById("add-set-button");
const finishWorkoutButton = document.getElementById("finish-workout-button");

// set input ids
var repsInputId = 'exercise' + exerciseNumber + '-set' + setNumber + '-reps';
var weightInputId = 'exercise' + exerciseNumber + '-set' + setNumber + '-weight';
var exerciseNameId = 'exercise' + exerciseNumber + '-name';

// derive input elements from ids
const exerciseTableBody = document.getElementById("exercise-table-body");
const repsInputElem = document.getElementById(repsInputId);
const weightInputElem = document.getElementById(weightInputId);
const exerciseNameInputElem = document.getElementById(exerciseNameId);
const workoutNameElem = document.getElementById("workout-name");
const ratingElem = document.getElementById("workout-rating");

// set table attrs
const headerRow = document.createElement("tr");
const header = document.createElement("th");
const set1HeaderRow = document.createElement("tr");
const set1Header = document.createElement("th");

const exerciseInputRow = document.createElement("tr");

const dataRow = document.createElement("tr");
const set1DataRow = document.createElement("tr");

const repsData = document.createElement("td");
const weightData = document.createElement("td");
const exerciseInputData = document.createElement("td");
const set1RepsData = document.createElement("td");
const set1WeightData = document.createElement("td");

const repsInput = document.createElement("input");
const weightInput = document.createElement("input");
const exerciseInput = document.createElement("input");
const set1RepsInput = document.createElement("input");
const set1WeightInput = document.createElement("input");


// listeners for valid input fields
var repsValid = false;
var weightValid = false;

repsInputElem.addEventListener('input', function() {
    repsValid = false;
    var repsVal = repsInputElem.value;

    if (1 <= repsVal <= 169) {
        repsValid = true;
    } else {
        repsValid = false;
        repsInputElem.style.border = "2px solid red";
        // todo repsInputElem.style.borderRadius = "3px";
    }
});

weightInputElem.addEventListener('input', function() {
    weightValid = false;
    var weightVal = weightInputElem.value;

    if (0.5 <= weightVal <= 6699) {
        weightValid = true;
    } else {
        weightValid = false;
        weightInputElem.style.border = "2px solid red";
        // todo weightInputElem.style.borderRadius = "3px";
    }
});


addSetButton.onclick = function addSet() {
// initialize AJAX function
// add new set every click, max 10 sets
    var repsVal = repsInputElem.value;
    var weightVal = weightInputElem.value;

    // if reps & weight values are valid save set / start new set
    if (repsValid === true && weightValid === true) {
        finishSet = $.ajax ({
            type: 'POST',
            url: '/finish-set',
            data: {
                repsVal: repsVal,
                weightVal: weightVal,
            },
            success: function () {
                console.log("set saved");
            }
        });

        finishSet.done(function() {
            repsInputId.disabled = true;
            weightInputId.disabled = true;
        });


        // increment set count when set added successfully
        setNumber += 1;

        const headerRow = document.createElement("tr");
        const header = document.createElement("th");
        const dataRow = document.createElement("tr");
        const repsData = document.createElement("td");
        const weightData = document.createElement("td");
        const repsInput = document.createElement("input");
        const weightInput = document.createElement("input");

        header.innerText = "Set " + setNumber;
        header.setAttribute("colspan", 2);

        // repsInput attrs
        repsInput.type = "number";
        repsInput.pattern = "[0-9]*";
        repsInput.id = "exercise" + exerciseNumber + "-set" + setNumber + "-reps";
        repsInput.name = "exercise" + exerciseNumber + "-set" + setNumber + "-reps";
        repsInput.setAttribute("class", "form-exercise");
        repsInput.placeholder = "Reps";

        // weightInput attrs
        weightInput.type = "number";
        weightInput.pattern = "[0-9]*(.?[0-9])?";
        weightInput.setAttribute("inputmode", "decimal")
        weightInput.id = "exercise" + exerciseNumber + "-set" + setNumber + "-weight";
        weightInput.name = "exercise" + exerciseNumber + "-set" + setNumber + "-weight";
        weightInput.setAttribute("class", "form-exercise");
        weightInput.placeholder = "Weight";

        if (setNumber <= 10) {
            // add set header
            headerRow.append(header);

            // add input areas to respective table data tags
            repsData.append(repsInput);
            weightData.append(weightInput);

            // add data tags to single table row
            dataRow.append(repsData);
            dataRow.append(weightData);

            // add header row & data row to exercise table
            exerciseTableBody.append(headerRow);
            exerciseTableBody.append(dataRow);
        };
    };
};


addExerciseButton.onclick = function addExercise() {
// add new exercise every click, max 15 exercises
    var exerciseNameId = 'exercise' + exerciseNumber + '-name';
    var exerciseName = exerciseNameInputElem.value;
    var repsVal = repsInputElem.value;
    var weightVal = weightInputElem.value;

    finishExercise = $.ajax ({
        type: 'POST',
        url: '/finish-exercise',
        data: {
            exerciseName: exerciseName,
            repsVal: repsVal,
            weightVal: weightVal,
        },
        success: function () {
            console.log("exercise saved");
        }
    });

    finishExercise.done(function() {
        repsInputId.disabled = true;
        weightInputElem.disabled = true;
        exerciseNameInputElem.disabled = true;
    });


    // increment exercise count
    exerciseNumber += 1;


    header.innerText = "Exercise " + exerciseNumber;
    header.setAttribute("colspan", 2);

    exerciseInputData.setAttribute("colspan", 2);
    exerciseInput.type = "text";
    exerciseInput.setAttribute("class", "form-exercise-title-input");
    exerciseInput.id = "exercise" + exerciseNumber + "-name";
    exerciseInput.name = "exercise" + exerciseNumber + "-name";
    exerciseInput.placeholder = "Exercise Name";

    set1Header.innerText = "Set 1";
    set1Header.setAttribute("colspan", 2);

    set1RepsInput.type = "number";
    set1RepsInput.pattern = "[0-9]*";
    set1RepsInput.id = "exercise" + exerciseNumber + "-set1-reps";
    set1RepsInput.name = "exercise" + exerciseNumber + "-set1-reps";
    set1RepsInput.setAttribute("class", "form-exercise");
    set1RepsInput.placeholder = "Reps";

    set1WeightInput.type = "number";
    set1WeightInput.pattern = "[0-9]*(.?[0-9])?";
    set1WeightInput.inputmode = "decimal";
    set1WeightInput.id = "exercise" + exerciseNumber + "-set1-weight";
    set1WeightInput.name = "exercise" + exerciseNumber + "-set1-weight";
    set1WeightInput.setAttribute("class", "form-exercise");
    set1WeightInput.placeholder = "Weight";

    if (exerciseNumber <= 15) {
        // add headers
        headerRow.append(header);
        set1HeaderRow.append(set1Header);

        // add static 3 sets to respective data tags
        exerciseInputData.append(exerciseInput);
        set1RepsData.append(set1RepsInput);
        set1WeightData.append(set1WeightInput);

        // add data tags to each row
        exerciseInputRow.append(exerciseInputData);
        set1DataRow.append(set1RepsData);
        set1DataRow.append(set1WeightData);

        // add header row & data rows to exercise table
        exerciseTableBody.append(headerRow);
        exerciseTableBody.append(exerciseInputRow);
        exerciseTableBody.append(set1HeaderRow);
        exerciseTableBody.append(set1DataRow);
    };

    // reset set count whenever new exercise added
    setNumber = 1;
};


// AJAX finish workout
function finishWorkout() {
    var repsVal = repsInputElem.value;
    var weightVal = weightInputElem.value;
    var exerciseName = exerciseNameInputElem.value;
    var workoutName = workoutNameElem.value;
    var rating = ratingElem.value;

    finish = $.ajax({
        type: 'POST',
        url: '/finish-workout',
        data: {
            workoutName: workoutName,  // info to send to backend
            rating: rating,
            exerciseName: exerciseName,
            repsVal: repsVal,
            weightVal: weightVal,
        },
        success: function() {
            console.log("workout saved");
        }
    });

    // disable elements when finished
    finish.done(function(data) {
        workoutName.text = data.workout_name;
        workoutName.disabled = true;
        exerciseNameInputElem.disabled = true;
        repsInputElem.disabled = true;
        weightInputElem.disabled = true;
        finishWorkoutButton.disabled = true;
        addExerciseButton.disabled = true;
        addSetButton.disabled = true;
        finishWorkoutButton.html = "Workout Finished";
    });
};
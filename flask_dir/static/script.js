var exerciseNumber = 1;
var setNumber = 1;

const addExerciseButton = document.getElementById("add-exercise-button");
const addSetButton = document.getElementById("add-set-button");
const exerciseTableBody = document.getElementById("exercise-table-body");

addSetButton.onclick = function addSet() {
// initialize AJAX function & add new set every click, max 10 sets

    // AJAX finish set
    //  changing elements is necessary for disabling input fields incrementally
    var repsElem = 'exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightElem = 'exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsElem).val();
    var weightValue = $(weightElem).val();


    finishSet = $.ajax ({
        type: 'POST',
        url: '/finish-set',
        data: {
            repsValue: repsValue,
            weightValue: weightValue,
        },
        success: function () {
            console.log("set saved");
        }
    });

    finishSet.done(function() {
        $(#repsElem).attr('disabled', true);
        $(#weightElem).attr('disabled', true);
    });


    // increment set count
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

    repsInput.type = "number";
    repsInput.id = repsElem;
    repsInput.name = repsElem;
    repsInput.setAttribute("class", "form-exercise");
    repsInput.placeholder = "Reps";

    weightInput.type = "number";
    weightInput.id = weightElem;
    weightInput.name = weightElem;
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


addExerciseButton.onclick = function addExercise() {
// add new exercise every click, max 15 exercises

    // AJAX finish exercise
    var exerciseNameInput = 'exercise' + exerciseNumber + '-name';
    var exerciseName = $(exerciseNameInput).val();

    var repsElem = 'exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightElem = 'exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsElem).val();
    var weightValue = $(weightElem).val();


    finishExercise = $.ajax ({
        type: 'POST',
        url: '/finish-exercise',
        data: {
            exerciseName: exerciseName,
            repsValue: repsValue,
            weightValue: weightValue,
        },
        success: function () {
            console.log("exercise saved");
        }
    });

    finishExercise.done(function() {
        $(#repsElem).attr('disabled', true);
        $(#weightElem).attr('disabled', true);
        $(#exerciseNameInput).attr('disabled', true);
    });


    // increment exercise count
    exerciseNumber += 1;

    // exercise header & input fields
    const headerRow = document.createElement("tr");
    const header = document.createElement("th");
    const exerciseInputRow = document.createElement("tr");
    const exerciseInputData = document.createElement("td");
    const exerciseInput = document.createElement("input");

    // set header items
    const set1HeaderRow = document.createElement("tr");
    const set1Header = document.createElement("th");

    // set input fields
    const set1DataRow = document.createElement("tr");
    const set1RepsData = document.createElement("td");
    const set1WeightData = document.createElement("td");
    const set1RepsInput = document.createElement("input");
    const set1WeightInput = document.createElement("input");

    // exercise header text
    header.innerText = "Exercise " + exerciseNumber;
    header.setAttribute("colspan", 2);

    // exercise input field
    exerciseInputData.setAttribute("colspan", 2);
    exerciseInput.type = "text";
    exerciseInput.setAttribute("class", "form-exercise-title-input");
    exerciseInput.id = exerciseNameInput;
    exerciseInput.name = exerciseNameInput;
    exerciseInput.placeholder = "Exercise Name";

    // set header text
    set1Header.innerText = "Set 1";
    set1Header.setAttribute("colspan", 2);

    // set input field
    set1RepsInput.type = "number";
    set1RepsInput.id = repsElem;
    set1RepsInput.name = repsElem;
    set1RepsInput.setAttribute("class", "form-exercise");
    set1RepsInput.placeholder = "Reps";

    // weight input field
    set1WeightInput.type = "number";
    set1WeightInput.id = weightElem;
    set1WeightInput.name = weightElem;
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


// slider functionality
var slider = document.getElementById("workout-rating");
var output = document.getElementById("workout-rating-value");
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
        $('#exercise-form').show();
    });
};


// AJAX finish workout
function finishWorkout() {
    var workoutName = $("#workout-name").val();
    var rating = $("#workout-rating").val();
    var exerciseNameInput = 'exercise' + exerciseNumber + '-name';
    var exerciseName = $(exerciseNameInput).val();
    var repsElem = 'exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightElem = 'exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsElem).val();
    var weightValue = $(weightElem).val();

    finish = $.ajax({
        type: 'POST',
        url: '/finish-workout',
        data: {
            workoutName: workoutName,  // info to send to backend
            rating: rating,
            exerciseName: exerciseName,
            repsValue: repsValue,
            weightValue: weightValue,
        },
        success: function() {
            console.log("workout saved");
        }
    });

    // disable elements when finished
    finish.done(function(data) {
        $('#workout-name').text(data.workout_name);
        $('#workout-name').attr('disabled', true);

        $(#exerciseNameInput).attr('disabled', true);
        $(#repsElem).attr('disabled', true);
        $(#weightElem).attr('disabled', true);

        $('#finish-workout-button').attr('disabled', true);
        $('#add-exercise-button').attr('disabled', true);
        $('#add-set-button').attr('disabled', true);
        $('#finish-workout-button').html('Workout Finished');
    });
};
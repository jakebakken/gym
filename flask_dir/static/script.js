var exerciseNumber = 1;
var setNumber = 1;

const addExerciseButton = document.getElementById("add-exercise-button");
const addSetButton = document.getElementById("add-set-button");
const exerciseTableBody = document.getElementById("exercise-table-body");

addSetButton.onclick = function addSet() {
// initialize AJAX function
// add new set every click, max 10 sets

    // AJAX finish set
    //  changing elements is necessary for disabling input fields incrementally
    var repsInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsInputElem).val();
    var weightValue = $(weightInputElem).val();


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
        $(repsInputElem).attr('disabled', true);
        $(weightInputElem).attr('disabled', true);
    });


    // increment set count
    setNumber += 1;


    const header_row = document.createElement("tr");
    const header = document.createElement("th");
    const data_row = document.createElement("tr");
    const reps_data = document.createElement("td");
    const weight_data = document.createElement("td");
    const reps_input = document.createElement("input");
    const weight_input = document.createElement("input");

    header.innerText = "Set " + setNumber;
    header.setAttribute("colspan", 2);

    reps_input.type = "number";
    reps_input.id = "exercise" + exerciseNumber + "-set" + setNumber + "-reps";
    reps_input.name = "exercise" + exerciseNumber + "-set" + setNumber + "-reps";
    reps_input.setAttribute("class", "form-exercise");
    reps_input.placeholder = "Reps";

    weight_input.type = "number";
    weight_input.id = "exercise" + exerciseNumber + "-set" + setNumber + "-weight";
    weight_input.name = "exercise" + exerciseNumber + "-set" + setNumber + "-weight";
    weight_input.setAttribute("class", "form-exercise");
    weight_input.placeholder = "Weight";

    if (setNumber <= 10) {
        // add set header
        header_row.append(header);

        // add input areas to respective table data tags
        reps_data.append(reps_input);
        weight_data.append(weight_input);

        // add data tags to single table row
        data_row.append(reps_data);
        data_row.append(weight_data);

        // add header row & data row to exercise table
        exerciseTableBody.append(header_row);
        exerciseTableBody.append(data_row);
    };
};

// lol all these vars need to be in js syntax not python

addExerciseButton.onclick = function addExercise() {
// add new exercise every click, max 15 exercises

    // AJAX finish exercise
    var exerciseNameInput = '#exercise' + exerciseNumber + '-name';
    var exerciseName = $(exerciseNameInput).val();
    var repsInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsInputElem).val();
    var weightValue = $(weightInputElem).val();


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
        $(repsInputElem).attr('disabled', true);
        $(weightInputElem).attr('disabled', true);
        $(exerciseNameInput).attr('disabled', true);
    });


    // increment exercise count
    exerciseNumber += 1;


    const header_row = document.createElement("tr");
    const header = document.createElement("th");
    const exercise_input_row = document.createElement("tr");
    const exercise_input_data = document.createElement("td");
    const exercise_input = document.createElement("input");

    const set1_header_row = document.createElement("tr");
    const set1_header = document.createElement("th");

    const set1_data_row = document.createElement("tr");
    const set1_reps_data = document.createElement("td");
    const set1_weight_data = document.createElement("td");
    const set1_reps_input = document.createElement("input");
    const set1_weight_input = document.createElement("input");

    header.innerText = "Exercise " + exerciseNumber;
    header.setAttribute("colspan", 2);

    exercise_input_data.setAttribute("colspan", 2);
    exercise_input.type = "text";
    exercise_input.setAttribute("class", "form-exercise-title-input");
    exercise_input.id = "exercise" + exerciseNumber + "-name";
    exercise_input.name = "exercise" + exerciseNumber + "-name";
    exercise_input.placeholder = "Exercise Name";

    set1_header.innerText = "Set 1";
    set1_header.setAttribute("colspan", 2);

    set1_reps_input.type = "number";
    set1_reps_input.id = "exercise" + exerciseNumber + "-set1-reps";
    set1_reps_input.name = "exercise" + exerciseNumber + "-set1-reps";
    set1_reps_input.setAttribute("class", "form-exercise");
    set1_reps_input.placeholder = "Reps";

    set1_weight_input.type = "number";
    set1_weight_input.id = "exercise" + exerciseNumber + "-set1-weight";
    set1_weight_input.name = "exercise" + exerciseNumber + "-set1-weight";
    set1_weight_input.setAttribute("class", "form-exercise");
    set1_weight_input.placeholder = "Weight";

    if (exerciseNumber <= 15) {
        // add headers
        header_row.append(header);
        set1_header_row.append(set1_header);

        // add static 3 sets to respective data tags
        exercise_input_data.append(exercise_input);
        set1_reps_data.append(set1_reps_input);
        set1_weight_data.append(set1_weight_input);

        // add data tags to each row
        exercise_input_row.append(exercise_input_data);
        set1_data_row.append(set1_reps_data);
        set1_data_row.append(set1_weight_data);

        // add header row & data rows to exercise table
        exerciseTableBody.append(header_row);
        exerciseTableBody.append(exercise_input_row);
        exerciseTableBody.append(set1_header_row);
        exerciseTableBody.append(set1_data_row);
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
    var exerciseNameInput = '#exercise' + exerciseNumber + '-name';
    var exerciseName = $(exerciseNameInput).val();
    var repsInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsInputElem).val();
    var weightValue = $(weightInputElem).val();

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

    // json object that gets passed back to frontend after ajax done
    finish.done(function(data) {
        $('#workout-name').text(data.workout_name);
        $('#workout-name').attr('disabled', true);
        $(exerciseNameInput).attr('disabled', true);
        $(repsInputElem).attr('disabled', true);
        $(weightInputElem).attr('disabled', true);
        $('#finish-workout-button').attr('disabled', true);
        $('#add-exercise-button').attr('disabled', true);
        $('#add-set-button').attr('disabled', true);
        $('#finish-workout-button').html('Workout Finished');
    });
};
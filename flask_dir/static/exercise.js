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
}

// AJAX start workout
function startWorkout() {
    start = $.ajax({
        type: 'POST',
        url: '/start-workout',
    });

    start.done(function() {
        $('#start-workout-button').hide();
        $('#exercise-page-title').show();
        $('#cardio-button').show();
        $('#cardio-contents').show();
        $('#exercise-form').show();
        $('#pie').show();
    });
};

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
    let repsInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    let weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    let repsValue = $(repsInputElem).val();
    let weightValue = $(weightInputElem).val();
    var repsValid = false;
    var weightValid = false;

    // abstract these into functions (since multiple buttons use)
    // check if reps input is valid
    if ((1 <= repsValue) && (repsValue <= 169)) {
        repsValid = true;
        $(repsInputElem).css('border', '');
        $(repsInputElem).css('border-radius', '');
    } else {
        repsValid = false;
        $(repsInputElem).css('border', '2px solid red');
        $(repsInputElem).css('border-radius', '3px');
    };

    // check if weight input is valid
    if ((0.5 <= weightValue) && (weightValue <= 6699)) {
        weightValid = true;
        $(weightInputElem).css('border', '');
        $(weightInputElem).css('border-radius', '');
    } else {
        weightValid = false;
        $(weightInputElem).css('border', '2px solid red');
        $(weightInputElem).css('border-radius', '3px');
    };

    // if input fields are valid, do ajax call
    if (repsValid && weightValid) {
        finishSet = $.ajax ({
            type: 'POST',
            url: '/finish-set',
            data: {
                repsValue: repsValue,
                weightValue: weightValue,
            },
        });

        finishSet.done(function() {
            $(repsInputElem).attr('disabled', true);
            $(weightInputElem).attr('disabled', true);
        });


        // increment set count
        if (setNumber < 10) {
            setNumber += 1;
        };


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
        repsInput.pattern = "[0-9]*";
        repsInput.id = "exercise" + exerciseNumber + "-set" + setNumber + "-reps";
        repsInput.name = "exercise" + exerciseNumber + "-set" + setNumber + "-reps";
        repsInput.setAttribute("class", "form-exercise");
        repsInput.placeholder = "Reps";

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

    // AJAX finish exercise
    let exerciseNameInput = '#exercise' + exerciseNumber + '-name';
    let repsInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    let weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    let exerciseName = $(exerciseNameInput).val();
    let repsValue = $(repsInputElem).val();
    let weightValue = $(weightInputElem).val();
    var repsValid = false;
    var weightValid = false;
    var exerciseNameValid = false;

    // check if exerciseName is valid
    if ((1 < exerciseName.length) && (exerciseName.length <= 50)) {
        exerciseNameValid = true;
        $(exerciseNameInput).css('border', '');
        $(exerciseNameInput).css('border-radius', '');
    } else {
        exerciseNameValid = false;
        $(exerciseNameInput).css('border', '2px solid red');
        $(exerciseNameInput).css('border-radius', '3px');
    };

    // check if reps input is valid
    if ((1 <= repsValue) && (repsValue <= 169)) {
        repsValid = true;
        $(repsInputElem).css('border', '');
        $(repsInputElem).css('border-radius', '');
    } else {
        repsValid = false;
        $(repsInputElem).css('border', '2px solid red');
        $(repsInputElem).css('border-radius', '3px');
    };

    // check if weight input is valid
    if ((0.5 <= weightValue) && (weightValue <= 6699)) {
        weightValid = true;
        $(weightInputElem).css('border', '');
        $(weightInputElem).css('border-radius', '');
    } else {
        weightValid = false;
        $(weightInputElem).css('border', '2px solid red');
        $(weightInputElem).css('border-radius', '3px');
    };

    if (repsValid && weightValid && exerciseNameValid) {
        finishExercise = $.ajax ({
            type: 'POST',
            url: '/finish-exercise',
            data: {
                exerciseName: exerciseName,
                repsValue: repsValue,
                weightValue: weightValue,
            },
        });

        finishExercise.done(function() {
            $(repsInputElem).attr('disabled', true);
            $(weightInputElem).attr('disabled', true);
            $(exerciseNameInput).attr('disabled', true);
        });


        // increment exercise count
        if (exerciseNumber < 15) {
            exerciseNumber += 1;
        };


        const headerRow = document.createElement("tr");
        const header = document.createElement("th");
        const exerciseInputRow = document.createElement("tr");
        const exerciseInputData = document.createElement("td");
        const exerciseInput = document.createElement("input");

        const set1HeaderRow = document.createElement("tr");
        const set1Header = document.createElement("th");

        const set1DataRow = document.createElement("tr");
        const set1RepsData = document.createElement("td");
        const set1WeightData = document.createElement("td");
        const set1RepsInput = document.createElement("input");
        const set1WeightInput = document.createElement("input");

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
        set1WeightInput.setAttribute("inputmode", "decimal");
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
};


// slider functionality
const slider = document.getElementById("workout-rating");
var output = document.getElementById("workout-rating-value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
};


// AJAX finish workout
function finishWorkout() {
    let workoutNameInput = '#workout-name';
    let exerciseNameInput = '#exercise' + exerciseNumber + '-name';
    let repsInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    let weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    let workoutName = $(workoutNameInput).val();
    let exerciseName = $(exerciseNameInput).val();
    let repsValue = $(repsInputElem).val();
    let weightValue = $(weightInputElem).val();
    let rating = $("#workout-rating").val();
    var workoutNameValid = false;
    var repsValid = false;
    var weightValid = false;
    var exerciseNameValid = false;

    // check if workoutName is valid
    if ((1 <= workoutName.length) && (workoutName.length <= 50)) {
        workoutNameValid = true;
        $(workoutNameInput).css('border', '');
        $(workoutNameInput).css('border-radius', '');
    } else {
        workoutNameValid = false;
        $(workoutNameInput).css('border', '2px solid red');
        $(workoutNameInput).css('border-radius', '3px');
    };

    // check if exerciseName is valid
    if ((1 <= exerciseName.length) && (exerciseName.length <= 50)) {
        exerciseNameValid = true;
        $(exerciseNameInput).css('border', '');
        $(exerciseNameInput).css('border-radius', '');
    } else {
        exerciseNameValid = false;
        $(exerciseNameInput).css('border', '2px solid red');
        $(exerciseNameInput).css('border-radius', '3px');
    };

    // check if reps input is valid
    if ((1 <= repsValue) && (repsValue <= 169)) {
        repsValid = true;
        $(repsInputElem).css('border', '');
        $(repsInputElem).css('border-radius', '');
    } else {
        repsValid = false;
        $(repsInputElem).css('border', '2px solid red');
        $(repsInputElem).css('border-radius', '3px');
    };

    // check if weight input is valid
    if ((0.5 <= weightValue) && (weightValue <= 6699)) {
        weightValid = true;
        $(weightInputElem).css('border', '');
        $(weightInputElem).css('border-radius', '');
    } else {
        weightValid = false;
        $(weightInputElem).css('border', '2px solid red');
        $(weightInputElem).css('border-radius', '3px');
    };

    if (workoutNameValid && exerciseNameValid && repsValid && weightValid) {
        finish = $.ajax({
            type: 'POST',
            url: '/finish-workout',
            data: {
                workoutName: workoutName,
                rating: rating,
                exerciseName: exerciseName,
                repsValue: repsValue,
                weightValue: weightValue,
            },
        });

        // disable elements when finished
        finish.done(function(data) {
            $(workoutNameInput).text(data.workout_name);
            $(workoutNameInput).attr('disabled', true);
            $(exerciseNameInput).attr('disabled', true);
            $(repsInputElem).attr('disabled', true);
            $(weightInputElem).attr('disabled', true);
            $('#finish-workout-button').attr('disabled', true);
            $('#add-exercise-button').attr('disabled', true);
            $('#add-set-button').attr('disabled', true);
            $('#finish-workout-button').html('Workout Finished');
        });
    };
};


// responsive pie chart to show % of time spent on each portion of workout

const workoutNamePie = document.getElementById("workout-name");
var pieTitle = "* add workout name *";
// temporary title initialized
var pieLayout = {title: pieTitle, width: 350, height: 400};  // redundant sizing
// xArray is Exercise Names
var xArray = ["Italy", "France", "Spain", "USA"];
// yArray is Exercise duration / Workout duration (update every 10ms)
var yArray = [23, 23, 38, 56];

var pieData = [{labels:xArray, values:yArray, type:"pie"}];

Plotly.newPlot("pie", pieData, pieLayout);

// title adjusts as user enters workout name
workoutNamePie.addEventListener('input', function() {
    pieTitle = workoutNamePie.value;
    if (pieTitle === '') {
        pieTitle = "* add workout name*";
    }
    pieLayout = {title: pieTitle, width: 350, height: 400};  // redundant sizing
    Plotly.newPlot("pie", pieData, pieLayout);
});
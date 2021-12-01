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

const addExerciseButton = document.getElementById("add-exercise-button");
const addSetButton = document.getElementById("add-set-button");
const exerciseTableBody = document.getElementById("exercise-table-body");

addSetButton.onclick = function addSet() {
// initialize AJAX function
// add new set every click, max 10 sets

    // AJAX finish set
    //  changing elements is necessary for disabling input fields incrementally
    var repsInputId = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var repsInputElem = document.getElementById(``'\\"' + exercise + ${exerciseNumber} + -set + ${setNumber} + -reps + '\\"'`);
    console.log(repsInputElem)

    var repsValid = false;
    var weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsInputId).val();  // todo change to elem.value;
    var weightValue = $(weightInputElem).val();

    // listeners for valid reps/weight input values
    repsInputElem.addEventListener('input', function() {
        repsValid = false;

        if (1 <= repsValue <= 169) {
            repsValid = true;
        } else {
            repsValid = false;
            repsInputElem.style.border = "2px solid red";
            repsInputElem.style.borderRadius = "3px";
        }
    });

    // weightInputElem.addEventListener('input', function() {
    //     var weightValid = false;

    //     if (0.5 <= weightValue <= 6699) {
    //         weightValid = true;
    //     }
    // });

    var weightValid = true;

    // if reps & weight values are valid save set / start new set
    if (repsValid === true && weightValid === true) {
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
            $(repsInputId).attr('disabled', true);
            $(weightInputElem).attr('disabled', true);
        });


        // increment set count when set added successfully
        setNumber += 1;


        // new table attrs
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

    // AJAX finish exercise
    var exerciseNameInput = '#exercise' + exerciseNumber + '-name';
    var exerciseName = $(exerciseNameInput).val();
    var repsInputId = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsInputId).val();
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
        $(repsInputId).attr('disabled', true);
        $(weightInputElem).attr('disabled', true);
        $(exerciseNameInput).attr('disabled', true);
    });


    // increment exercise count
    exerciseNumber += 1;


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


// slider functionality
var slider = document.getElementById("workout-rating");
var output = document.getElementById("workout-rating-value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
};


// AJAX finish workout
function finishWorkout() {
    var workoutName = $("#workout-name").val();
    var rating = $("#workout-rating").val();
    var exerciseNameInput = '#exercise' + exerciseNumber + '-name';
    var exerciseName = $(exerciseNameInput).val();
    var repsInputId = '#exercise' + exerciseNumber + '-set' + setNumber + '-reps';
    var weightInputElem = '#exercise' + exerciseNumber + '-set' + setNumber + '-weight';
    var repsValue = $(repsInputId).val();
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

    // disable elements when finished
    finish.done(function(data) {
        $('#workout-name').text(data.workout_name);
        $('#workout-name').attr('disabled', true);
        $(exerciseNameInput).attr('disabled', true);
        $(repsInputId).attr('disabled', true);
        $(weightInputElem).attr('disabled', true);
        $('#finish-workout-button').attr('disabled', true);
        $('#add-exercise-button').attr('disabled', true);
        $('#add-set-button').attr('disabled', true);
        $('#finish-workout-button').html('Workout Finished');
    });
};
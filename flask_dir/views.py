from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from .models import Workout, Exercise, Set
from . import db
import datetime as dt


# blueprint for Flask application
views = Blueprint('views', __name__)


@views.route('/')
@login_required
def home_page():
    workouts = Workout.query.filter_by(
        user_id=current_user.id).order_by(Workout.id.desc()).all()

    return render_template('home.html', user=current_user, workouts=workouts)


@views.route('/exercise/', methods=['GET', 'POST'])
@login_required
def exercise_page():
    return render_template('exercise.html', user=current_user)


@views.route('/start-workout', methods=['POST'])
@login_required
def start_workout():
    date = dt.datetime.now().date()
    start_time = dt.datetime.now()

    # initialize new workout instance
    start_of_workout = Workout(
        user_id=current_user.id,
        date=date,
        start_time=start_time,
    )
    db.session.add(start_of_workout)
    db.session.commit()

    # query workout that was just committed to db
    started_workout = Workout.query.filter_by(
        user_id=current_user.id).order_by(Workout.id.desc()).first()

    # initialize first Exercise
    start_of_exercise = Exercise(
        user_id=current_user.id,
        workout_id=started_workout.id,
        start_time=start_time,
    )
    db.session.add(start_of_exercise)
    db.session.commit()

    # query exercise that was just committed to db
    started_exercise = Exercise.query.filter_by(
        user_id=current_user.id).order_by(Exercise.id.desc()).first()

    # initialize first Set
    start_of_set = Set(
        user_id=current_user.id,
        workout_id=started_workout.id,
        exercise_id=started_exercise.id,
        start_time=start_time,
    )
    db.session.add(start_of_set)
    db.session.commit()

    return jsonify({'result': 'success'})


# todo route for cardio


@views.route('/finish-set', methods=['POST'])
@login_required
def finish_set():
    # finish current Set
    set_finish_time = dt.datetime.now()
    reps_value = request.form['repsValue']
    weight_value = request.form['weightValue']

    current_set = Set.query.filter_by(
        user_id=current_user.id).order_by(Set.id.desc()).first()

    # for setting exercise_id in Set()
    current_exercise = Exercise.query.filter_by(
        user_id=current_user.id).order_by(Exercise.id.desc()).first()

    current_set.end_time = set_finish_time
    current_set.reps = reps_value
    current_set.weight = weight_value
    db.session.commit()

    # start new Set
    start_of_set = Set(
        user_id=current_user.id,
        workout_id=current_set.workout_id,
        exercise_id=current_exercise.id,
        start_time=set_finish_time,
    )
    db.session.add(start_of_set)
    db.session.commit()

    return jsonify({'result': 'success'})


# todo finish this func
@views.route('/finish-exercise', methods=['POST'])
@login_required
def finish_exercise():
    # finish last Set in current Exercise, finish current Exercise, and start
    #  a new Exercise
    exercise_finish_time = dt.datetime.now()
    exercise_name = request.form['exerciseName']
    reps_value = request.form['repsValue']
    weight_value = request.form['weightValue']

    # query current Set
    current_set = Set.query.filter_by(
        user_id=current_user.id).order_by(Set.id.desc()).first()
    # query current Exercise
    current_exercise = Exercise.query.filter_by(
        user_id=current_user.id).order_by(Exercise.id.desc()).first()

    # add missing values
    current_set.end_time = exercise_finish_time
    current_set.reps = reps_value
    current_set.weight = weight_value
    current_exercise.end_time = exercise_finish_time
    current_exercise.name = exercise_name
    db.session.commit()

    # start new Exercise
    start_of_exercise = Exercise(
        user_id=current_user.id,
        workout_id=current_exercise.workout_id,
        start_time=exercise_finish_time,
    )
    db.session.add(start_of_exercise)
    db.session.commit()

    # query new Exercise for below Set exercise_id
    new_exercise = Exercise.query.filter_by(
        user_id=current_user.id).order_by(Exercise.id.desc()).first()

    # start new Set
    start_of_set = Set(
        user_id=current_user.id,
        workout_id=current_set.workout_id,
        exercise_id=new_exercise.id,
        start_time=exercise_finish_time,
    )
    db.session.add(start_of_set)
    db.session.commit()

    return jsonify({'result': 'success'})


@views.route('/finish-workout', methods=['POST'])
@login_required
def finish_workout():
    # finish last Set in current Exercise, finish current Exercise,
    #  finish Workout
    workout_name = request.form['workoutName']
    end_time = dt.datetime.now()
    rating = request.form['rating']
    exercise_name = request.form['exerciseName']
    reps_value = request.form['repsValue']
    weight_value = request.form['weightValue']

    # query current Set, Exercise, Workout

    # query current Set
    current_set = Set.query.filter_by(
        user_id=current_user.id).order_by(Set.id.desc()).first()
    # query current Exercise
    current_exercise = Exercise.query.filter_by(
        user_id=current_user.id).order_by(Exercise.id.desc()).first()
    # query current Workout
    current_workout = Workout.query.filter_by(
        user_id=current_user.id).order_by(Workout.id.desc()).first()

    # add all missing values
    current_set.end_time = end_time
    current_set.reps = reps_value
    current_set.weight = weight_value
    current_exercise.end_time = end_time
    current_exercise.name = exercise_name
    current_workout.name = workout_name
    current_workout.end_time = end_time
    current_workout.rating = rating

    # commit all to finish Workout
    db.session.commit()

    # return to AJAX call
    return jsonify({'result': 'success'})


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

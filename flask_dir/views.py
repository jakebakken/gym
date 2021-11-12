from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Workout, Exercise, Set
from . import db
import datetime as dt


# blueprint for Flask application
views = Blueprint('views', __name__)


@views.route('/')
@login_required
def home_page():
    return render_template('home.html', user=current_user)


@views.route('/exercise/', methods=['GET', 'POST'])
@login_required
def exercise_page():
    if request.method == 'POST':
        if 'start-workout-button' in request.form:
            workout_date = dt.datetime.now().date()
            workout_start_time = dt.datetime.now()

            start_of_workout = Workout(
                user_id=current_user.id, workout_date=workout_date,
                workout_start_time=workout_start_time,
            )
            db.session.add(start_of_workout)
            db.session.commit()

            flash("Workout Started", category='success')

    return render_template('exercise.html', user=current_user)


@views.route('/finish')
@login_required
def finish():
    if request.method == 'POST':
        workout_name = request.form.get('workout-name')
        workoutName = workout_name
        workout_end_time = dt.datetime.now()
        rating = request.form.get('workout-rating')

        # get the latest created workout from current user
        #  (aka the incomplete entry of this current workout)
        current_workout = Workout.query.filter_by(
            user_id=current_user.id).order_by(Workout.id.desc()).first()

        # fill in missing values
        current_workout.workout_name = workout_name
        current_workout.workout_end_time = workout_end_time
        current_workout.rating = rating
        db.session.commit()

        flash("Workout Finished", category='success')
        return jsonify({'workout_name': workoutName})  # value return back to exercise name input


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

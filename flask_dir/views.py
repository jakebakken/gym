from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user
from .models import Workouts, Exercises, Sets
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
        if request.form.action == 'finish-workout-button':
            workout_date = dt.datetime.now().date()
            workout_name = request.form.get('workout-name')
            workout_start_time = dt.datetime.now()
            workout_end_time = dt.datetime.now()
            rating = request.form.get('workout-rating')

            new_workout = Workouts(
                user_id=current_user.id, workout_date=workout_date,
                workout_name=workout_name, workout_start_time=workout_start_time,
                workout_end_time=workout_end_time, rating=rating,
            )
            db.session.add(new_workout)
            db.session.commit()

        pass
        # workout_name = request.form.get('workout-name')
        # exercise_name = request.form.get('exercise-1-name')
        # set_1_reps = request.form.get('set-1-reps')
        # set_1_weight = request.form.get('set-1-weight')

        # if len(workout_name) < 1:
        #     flash("Workout needs a name", category='error')
        # elif len(workout_name) > 50:
        #     flash("Workout name is too long", category='error')
        # else:
            # todo workout saved on finishWorkout.click
        #     db.session.add(#new_workout)
        #     db.session.commit()
        #     flash("Workout Saved", category='success')

    return render_template('exercise.html', user=current_user)


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

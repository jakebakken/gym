from flask import Blueprint, render_template, request, flash
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
    return render_template('exercise.html', user=current_user)


@views.route('/start-workout', methods=['POST'])
@login_required
def submit_start_workout_data():
    if request.method == 'POST':
        workout_date = dt.datetime.now().date()
        workout_name = request.form.get('workout-name')
        workout_start_time = dt.datetime.now()
        workout_end_time = dt.datetime.now()
        rating = request.form.get('workout-rating')

        new_workout = Workout(
            user_id=current_user.id, workout_date=workout_date,
            workout_name=workout_name, workout_start_time=workout_start_time,
            workout_end_time=workout_end_time, rating=rating,
        )
        db.session.add(new_workout)
        db.session.commit()

        return flash("Workout Saved", category='success')

    return render_template('exercise.html', user=current_user)


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

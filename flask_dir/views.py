from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user
from .models import Test
from . import db


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
        workout_name = request.form.get('workout-name')
        exercise_name = request.form.get('exercise-1-name')
        set_1_reps = request.form.get('set-1-reps')
        set_1_weight = request.form.get('set-1-weight')

        if len(workout_name) < 1:
            flash("Workout needs a name", category='error')
        elif len(workout_name) > 50:
            flash("Workout name is too long", category='error')
        else:
            new_workout = Test(
                user_id=current_user.id,
                workout_name=workout_name,
                exercise_name=exercise_name,
                set_1_reps=set_1_reps,
                set_1_weight=set_1_weight,
            )
            db.session.add(new_workout)
            db.session.commit()
            flash("Workout Saved", category='success')

            return render_template('exercise.html', user=current_user)


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

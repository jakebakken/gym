from flask import Blueprint, render_template
from flask_login import login_required, current_user


# blueprint for Flask application
views = Blueprint('views', __name__)


@views.route('/')
@login_required
def home_page():
    return render_template('home.html', user=current_user)


@views.route('/exercise/')
@login_required
def exercise_page():
    return render_template('exercise.html', user=current_user)


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

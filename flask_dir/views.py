from flask import Blueprint, render_template
from .models import Users


# blueprint for Flask application
views = Blueprint('views', __name__)


@views.route('/')
def home_page():
    return render_template('home.html')


@views.route('/exercise')
def exercise_page():
    return render_template('exercise.html')


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

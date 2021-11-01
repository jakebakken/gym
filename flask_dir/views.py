from flask import Blueprint, render_template, redirect
from flask_login import login_required


# blueprint for Flask application
views = Blueprint('views', __name__)


@views.route('/')
@login_required
def home_page():
    return render_template('home.html')


@views.route('/exercise/')
@login_required
def exercise_page():
    return redirect('/exercise_dashboard')


# @views.route('/exercise_dashboard/')
# @login_required
# def exercise_dashboard_page():
#     return render_template('/exercise_dashboard/')


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

from flask import Blueprint, render_template, redirect
from flask_login import login_required
from .plotlydash import dashboard
from werkzeug.middleware.dispatcher import DispatcherMiddleware


# blueprint for Flask application
views = Blueprint('views', __name__)


@views.route('/')
@login_required
def home_page():
    return render_template('home.html')


@views.route('/exercise')
@login_required
def exercise_page():
    return render_template('exercise.html')


app = dashboard.app
app_flask = dashboard.app_flask()
dash_app = DispatcherMiddleware(
    app_flask, {'/dash1': app.server}
)

@app_flask.route('/exercise_dashboard/')
def render_dashboard():
    return redirect('/dash1')


@views.route('/signup')
def signup_page():
    return render_template('signup.html')


@views.route('/login')
def login_page():
    return render_template('login.html')

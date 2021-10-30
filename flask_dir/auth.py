from flask import Blueprint, request, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required
import os, psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from .models import Users
from . import db


# blueprint for Flask application
auth = Blueprint('auth', __name__)

# database connection
DATABASE_URL = os.environ['DATABASE_URL']


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # query database to see if user exists
        user = Users.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                flash(f"Hey {user.first_name}", category='success')
                return redirect(url_for('views.home_page'))
            else:
                flash("Incorrect password, try again", category='error')
        else:
            flash("Account with this email was not found", category='error')
            return redirect(url_for('views.login_page'))


    return redirect(url_for('views.login_page'))


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.login_page'))


@auth.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        password_confirm = request.form.get('password_confirm')

        if len(first_name) < 1:
            flash("First name is required", category='error')
        if len(first_name) > 50:
            flash("First name can't be over 50 characters", category='error')
        if len(last_name) < 1:
            flash("Last name is required", category='error')
        if len(last_name) > 50:
            flash("Last name can't be over 50 characters", category='error')
        if len(username) < 1:
            flash("Username is required", category='error')
        if len(username) > 50:
            flash("Username can't be over 50 characters", category='error')

        if len(email) < 5:
            flash("Email is required", category='error')
        if len(email) > 100:
            flash("Last name can't be over 100 characters", category='error')

        if password != password_confirm:
            flash("Passwords do not match", category='error')
        if len(password) < 8:
            flash("Password must be at least 8 characters", category='error')
        if len(password) > 50:
            flash("Password can't be over 50 characters", category='error')

        if 50 >= len(first_name) >= 1 and 50 >= len(last_name) >= 1 and \
                50 >= len(username) >= 1 and 100 >= len(email) >= 5 and \
                password == password_confirm and 50 >= len(password) >= 8:
            # instantiate new user
            user = Users.query.filter_by(email=email)
            # if user doesn't exist in database, add new user
            if not user:
                new_user = Users(
                    first_name=first_name, last_name=last_name, username=username,
                    email=email, password=generate_password_hash(
                        password, method='sha256'
                    )
                )
                # add new user to db
                db.session.add(new_user)
                db.session.commit()
                login_user(user, remember=True)
                flash("Account Created", category='success')
                return redirect(url_for('views.home_page'))
            else:
                flash("An account with this email already exists", category='error')

    return redirect(url_for('views.signup_page'))

from flask import Blueprint, request, flash, redirect, url_for, render_template
from flask_login import login_user, logout_user, login_required, current_user
import os
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
                flash(f"Hey {user.first_name}!", category='success')
                return redirect(url_for('views.home_page', user=current_user))
            else:
                flash("Incorrect password, try again", category='error')
        else:
            flash("Account with this email was not found", category='error')
            return redirect(url_for('views.login_page'))

    return render_template('login.html', user=current_user)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/signup', methods=['GET', 'POST'])
def sign_up():
    special_chars = [
        '!', '”', '#', '$', '%', '&', '’', '(', ')', '*', '+', ',', '-', '.',
        '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`',
        '{', '|', '}', '~'
    ]

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
        if not any(char.isupper() for char in password):
            flash("Password must contain at least 1 uppercase character", category='error')
        if not any(char.islower() for char in password):
            flash("Password must contain at least 1 lowercase character", category='error')
        if not any(char.isnumeric() for char in password):
            flash("Password must contain at least 1 number", category='error')
        if not any(char in special_chars for char in password):
            flash("Password must contain at least one special character", category='error')

        if 50 >= len(first_name) >= 1 and 50 >= len(last_name) >= 1 and \
                50 >= len(username) >= 1 and 100 >= len(email) >= 5 and \
                password == password_confirm and 50 >= len(password) >= 8 and \
                any(char.isupper() for char in password) and \
                any(char.islower() for char in password) and \
                any(char.isnumeric() for char in password) and \
                any(char in special_chars for char in password):
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
                return redirect(url_for('views.home_page', user=current_user))
            else:
                flash("An account with this email already exists", category='error')

    return render_template('signup.html', user=current_user)

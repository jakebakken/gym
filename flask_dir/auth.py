from flask import Blueprint, request, flash, redirect, url_for, render_template, jsonify
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
                return redirect(url_for('views.home_page'))
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


@auth.route('/signup_user', methods=['GET', 'POST'])
def sign_up_new_user():
    first_name = request.form['firstVal']
    last_name = request.form['lastVal']
    username = request.form['usernameVal']
    email = request.form['emailVal']
    password = request.form['passwordVal']

    # query for existing user by entered email
    user = Users.query.filter_by(email=email).first()

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
        login_user(new_user, remember=True)
        return render_template('home.html', user=current_user)

    else:
        flash("An account with this email already exists", category='error')
        return jsonify({'result': 'error'})


@auth.route('/signup', methods=['GET', 'POST'])
def sign_up():
    pass

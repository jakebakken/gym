from flask import Blueprint, render_template, request, flash, redirect, url_for
import os, psycopg2
from flask_login import login_user
from .models import Users
from . import db
from werkzeug.security import generate_password_hash, check_password_hash


# blueprint for Flask application
auth = Blueprint('auth', __name__)

# database connection
DATABASE_URL = os.environ['DATABASE_URL']


@auth.route('/login', methods=['GET', 'POST'])
def login():
    db_connection = None

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if email is not None:
            try:
                db_connection = psycopg2.connect(DATABASE_URL)
                cursor = db_connection.cursor()

                email_exists_query = f"SELECT EXISTS (SELECT 1 FROM users WHERE email = '{email}' LIMIT 1);"
                cursor.execute(email_exists_query)
                email_exists_in_users = cursor.fetchone()[0]

                if email_exists_in_users:
                    password_query = f"SELECT passw FROM users WHERE email = '{email}';"
                    cursor.execute(password_query)
                    stored_password = cursor.fetchone()[0]

                    if password == stored_password:
                        user_id_query = f"SELECT id FROM users WHERE email = '{email}';"
                        cursor.execute(user_id_query)
                        user_id = cursor.fetchone()[0]

                        login_user(user_id, remember=True)
                        flash("Login Successful", category='success')
                        return render_template('home.html')
                    else:
                        flash("Incorrect password for this email", category='error')
                else:
                    flash("There is no account registered with this email", category='error')
                    return render_template('login.html')

            except Exception as error:
                flash(f"Error: {error}", category='error')
                return render_template('login.html')

            finally:
                # close the communication with the database server
                cursor.close()
                if db_connection is not None:
                    db_connection.close()


    return render_template('login.html')


@auth.route('/logout')
def logout():
    return render_template('login.html')


@auth.route('/signup', methods=['GET', 'POST'])
def sign_up():
    db_connection = None

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
            new_user = Users(first_name=first_name, last_name=last_name, username=username, email=email, password=generate_password_hash(password, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            flash("Account Created", category='success')
            return redirect(url_for('views.home_page'))


    return render_template('signup.html')

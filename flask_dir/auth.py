from flask import Blueprint, render_template, request, flash
import os, psycopg2


# blueprint for Flask application
auth = Blueprint('auth', __name__)

# database connection
DATABASE_URL = os.environ['DATABASE_URL']


@auth.route('/login', methods=['GET', 'POST'])
def login():
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
            try:
                # create a new database connection by calling the connect() function
                db_connection = psycopg2.connect(DATABASE_URL)

                #  create a new cursor
                cursor = db_connection.cursor()

                # todo if email does not exist in database yet
                email_exists_in_db_query = f"SELECT EXISTS (SELECT 1 FROM users WHERE email = '{email}' LIMIT 1);"
                cursor.execute(email_exists_in_db_query)
                if cursor == 'f':
                    # execute an SQL statement to HerokuPostgres
                    query = "INSERT INTO users(first_name, last_name, passw, email, username) VALUES(%s, %s, %s, %s, %s);"
                    cursor.execute(query, (first_name, last_name, password, email, username))

                    db_connection.commit()
                    flash(f'Account created, welcome {first_name}!', category='success')
                    return render_template('login.html')

                else:
                    flash(f"{cursor}", category='error')

                # close the communication with the HerokuPostgres
                cursor.close()

            except Exception as error:
                flash(f"Error: {error}", category='error')

            finally:
                # close the communication with the database server by calling the close()
                if db_connection is not None:
                    db_connection.close()

    return render_template('signup.html')

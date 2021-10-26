from flask import Blueprint, render_template, request, flash


# blueprint for Flask application
auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


@auth.route('/logout')
def logout():
    return render_template('login.html')


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
            # todo add inputs to db + commit if user doesn't already exist
            flash('Account Created', category='valid')
            return render_template('login.html')

    return render_template('signup.html')

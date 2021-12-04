from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
import os
from os import path


db = SQLAlchemy()
SQLALCHEMY_URL = os.environ['SQLALCHEMY_URL']


def create_app():
    app = Flask(__name__, instance_relative_config=False)

    # app key
    app.config['SECRET_KEY'] = os.environ['FLASK_SK']
    # db key
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_URL
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import Users

    create_db(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # reference user by pk (works like FILTER BY id)
        return Users.query.get(int(user_id))

    import datetime as dt
    from dateutil import tz
    import pytz

    # add function to change UTC Date -> local Date in jinja
    @app.context_processor
    def utility_processor():
        def local_date(date_object):
            dt_str = date_object.strftime("%Y-%m-%d")
            print(f"dt_str: {dt_str}")

            date_format = "%Y-%m-%d"
            print(f"date_format: {date_format}")

            utc = dt.datetime.strptime(dt_str, date_format).replace(tzinfo=pytz.UTC)
            print(f"utc: {utc}")

            local = utc.astimezone(tz.tzlocal())
            print(f"local: {local}")

            loc_date = local.strftime("%d-%b-%Y")
            print(f"loc_date: {loc_date}")

            return loc_date
        return dict(local_date=local_date)

    return app


def create_db(app):
    # check if db exists, if not: create it
    if not path.exists(SQLALCHEMY_URL):
        db.create_all(app=app)

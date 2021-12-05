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
        def local_dt(date_object, time_object):
            date_str = date_object.strftime("%Y-%m-%d")
            time_str = time_object.strftime("%H:%M:%S.%f")
            dt_str = f"{date_str} {time_str}"
            format = f"%Y-%m-%d %H:%M:%S.%f"
            utc = dt.datetime.strptime(dt_str, format).replace(tzinfo=pytz.UTC)

            print(f"utc: {utc}")
            print(f"type: {type(utc)}\n")

            local = utc.astimezone(tz.gettz('US/Pacific'))

            print(f"local: {local}")
            print(f"type: {type(local)}\n")

            loc_dt = local.strftime("%d-%b-%Y %H:%M:%S.%f")

            print(f"loc_date: {loc_dt}")
            print(f"type: {type(loc_dt)}\n")

            return loc_dt
        return dict(local_date=local_dt)

    return app


def create_db(app):
    # check if db exists, if not: create it
    if not path.exists(SQLALCHEMY_URL):
        db.create_all(app=app)

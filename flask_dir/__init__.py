from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
import os
from os import path
import datetime as dt
from dateutil import tz
import pytz
import time


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

    @app.context_processor
    def utility_processor():
        def local_date(date_object):
            date_str = date_object.strftime("%Y-%m-%d")
            format="%Y-%m-%d"
            utc = dt.datetime.strptime(date_str, format).replace(tzinfo=pytz.UTC)
            local = utc.astimezone(tz.gettz('US/Pacific'))
            loc_date = local.strftime("%d-%b-%Y")
            return loc_date
        return dict(local_date=local_date)

    @app.context_processor
    def utility_processor():
        def local_dt(date_object, time_object, return_val='dt'):
            date_str = date_object.strftime("%Y-%m-%d")
            time_str = time_object.strftime("%H:%M:%S.%f")
            dt_str = f"{date_str} {time_str}"
            dt_format = f"%Y-%m-%d %H:%M:%S.%f"

            # declare UTC object
            utc = dt.datetime.strptime(dt_str, dt_format).replace(tzinfo=pytz.UTC)
            # change UTC object to US/Pacific TZ
            local = utc.astimezone(tz.gettz('US/Pacific'))

            if return_val == 'dt':
                return local.strftime("%d-%b-%Y %H:%M:%S.%f")

            elif return_val == 'time':
                t = local.strftime("%H:%M:%S.%f")
                tt = time.strptime(t, '%H:%M:%S.%f')
                time_12h = time.strftime("%I:%M%p", tt)
                return time_12h

            elif return_val == 'date':
                return local.strftime("%d-%b-%Y")

            else:
                ValueError("Invalid Parameter passed for return_val")
                return "local_dt() error"
        return dict(local_dt=local_dt)

    return app


def create_db(app):
    # check if db exists, if not: create it
    if not path.exists(SQLALCHEMY_URL):
        db.create_all(app=app)

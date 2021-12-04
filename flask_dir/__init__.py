from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
import os
from os import path
import datetime as dt
from dateutil import tz
import pytz


db = SQLAlchemy()
SQLALCHEMY_URL = os.environ['SQLALCHEMY_URL']


# add function to change UTC Date -> local Date in jinja
def utc_to_local_date(utc_date_object):
    # change utc Date to str
    dt_str = utc_date_object.strftime("%Y-%m-%d")
    # define date format
    date_format = "%Y-%m-%d"
    utc = dt.datetime.strptime(dt_str, date_format).replace(tzinfo=pytz.UTC)
    local_tz = tz.tzlocal()
    local = utc.astimezone(local_tz)
    local_date = local.strftime("%d-%b-%Y")
    return local_date


def create_app():
    app = Flask(__name__, instance_relative_config=False)

    # app key
    app.config['SECRET_KEY'] = os.environ['FLASK_SK']
    # db key
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_URL
    db.init_app(app)

    app.jinja_env.globals.update(utc_to_local_date=utc_to_local_date)

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

    return app


def create_db(app):
    # check if db exists, if not: create it
    if not path.exists(SQLALCHEMY_URL):
        db.create_all(app=app)

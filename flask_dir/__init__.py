from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from os import path


db = SQLAlchemy()
SQLALCHEMY_URL = os.environ['SQLALCHEMY_URL']


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ['FLASK_SK']
    # db connection
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_URL
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import Users, Workouts

    create_db(app)

    return app


def create_db(app):
    # check if db exists, if not: create it
    if not path.exists(SQLALCHEMY_URL):
        db.create_all(app=app)

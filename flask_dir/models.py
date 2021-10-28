from . import db
from flask_login import UserMixin


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    username = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(50))
    workouts = db.relationship('Workout')  # to access all Workouts a User has created


class Workouts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # foreign key reference must be lowercase
    workout_date = db.Column(db.Date)
    workout_start_time = db.Column(db.Time)
    workout_end_time = db.Column(db.Time)
    rating = db.Column(db.String(50))

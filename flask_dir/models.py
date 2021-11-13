from . import db
from flask_login import UserMixin


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    username = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(255))
    workout = db.relationship('Workout', backref='users')  # to access all Workouts a User has created


class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # foreign key reference must be lowercase
    workout_date = db.Column(db.Date)
    workout_name = db.Column(db.String(50))
    workout_start_time = db.Column(db.Time)
    workout_end_time = db.Column(db.Time)
    rating = db.Column(db.Integer)
    exercise = db.relationship('Exercise', backref='workout')


class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'))
    exercise_name = db.Column(db.String(50))
    exercise_start_time = db.Column(db.Time)
    exercise_end_time = db.Column(db.Time)
    set = db.relationship('Set', backref='exercise')


class Set(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'))
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'))
    set_start_time = db.Column(db.Time)
    set_end_time = db.Column(db.Time)
    reps = db.Column(db.Integer)
    weight = db.Column(db.Integer)

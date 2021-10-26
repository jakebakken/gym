import os
import psycopg2
import dash
from dash import html, dcc, dash_table
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate


# app initialization
external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = dash.Dash(
    __name__,
    suppress_callback_exceptions=True,
    external_stylesheets=external_stylesheets,
    meta_tags=[
        {
            "name": "viewport",
            "content": "width=device-width, initial-scale=1"
        }
    ]
)
server = app.server

# KEEP FALSE FOR DEPLOYMENT
debug = False

# db vars
DATABASE_URL = os.environ['DATABASE_URL']
connection = None


# cardio & exercise datatable columns
cardio_cols = [
    'Type', 'Distance', 'Duration (min)', 'Cooldown',
]
exercise_cols = [
    'Exercise', 'S1 Reps', 'S1 Weight', 'S2 Reps', 'S2 Weight', 'S3 Reps',
    'S3 Weight',
]

# app layout
app.layout = html.Div([
    html.H2("Get After It", style={'textAlign': 'left', 'fontWeight': 'bold'}),
    html.Hr(style={
        'background': 'black', 'height': '0.5px', 'width': '95%',
        'margin-top': '0em', 'margin-bottom': '1.5em',
    }),
    html.Div([
        html.Div(html.Button("Start Workout", id='start-workout-button',
                             n_clicks=0,
                             style={
                                 'backgroundColor': '#3bed71',
                                 'minWidth': '50%', 'maxWidth': '99%',
                                 'height': '50px',
                             }),
                 style={
                     'width': '50%', 'display': 'inline-block',
                     'textAlign': 'left'
                 }),
        html.Div(html.Button("Finish Workout", id='finish-workout-button',
                             n_clicks=0,
                             style={
                                 'backgroundColor': '#ef6c57',
                                 'minWidth': '50%', 'maxWidth': '99%',
                                 'height': '50px',
                             }),
                 style={
                     'width': '50%', 'display': 'inline-block',
                     'textAlign': 'right'
                 }),
    ], style={'margin-bottom': '1.5em'}),
    html.H4("Cardio"),  # todo inline dropdown Y/N cardio (table inactive if no)
    dash_table.DataTable(
        id='cardio-datatable',
        style_table={'padding-bottom': '10px'},
        style_cell={
            'minWidth': '100px', 'width': '100px', 'maxWidth': '150px',
            'fontSize': '12px', 'height': '40px'
        },
        style_header={
            'backgroundColor': '#2b4353', 'color': '#eaf6f6',
            'textAlign': 'center'
        },
        columns=(
            [{'id': col, 'name': col} for col in cardio_cols]
        ),
        data=[
            {'Type': '', 'Duration (min)': 0, 'Cooldown': ''},
        ],
        editable=True,
    ),
    html.H4("Exercise"),
    html.Div([
        html.Div([
            html.Button("Add Exercise", id='add-exercise-button', n_clicks=0,
                        style={'backgroundColor': '#e3e3e3'}),
        ], style={'textAlign': 'left', 'display': 'inline-block',
                  'width': '50%'}),
        html.Div([
            html.Button("Add Set", id='add-set-button',
                        style={'backgroundColor': '#e3e3e3'}),
        ], style={
            'textAlign': 'right', 'display': 'inline-block', 'width': '50%'
        }),
    ], style={'padding-bottom': '20px'}),

    dcc.Store(id='exercise-rows-store', storage_type='session'),
    dcc.Store(id='exercise-columns-store', storage_type='session'),

    dash_table.DataTable(
        id='exercise-datatable',
        style_table={
            'padding-left': 'auto', 'padding-right': 'auto', 'minWidth': '100%',
            'maxWidth': '100%', 'overflowX': 'auto'
        },
        style_header={
            'backgroundColor': '#2b4353', 'color': '#eaf6f6',
            'textAlign': 'center'
        },
        style_cell_conditional=[
            {
                'if': {
                    'column_id': 'Exercise'
                },
                'textAlign': 'center',
            },
        ],
        fixed_columns={'headers': True, 'data': 1},
        style_cell={
            'minWidth': '80px', 'width': '80px', 'maxWidth': '150px',
            'fontSize': '12px', 'height': '40px'
        },
        columns=(
            [{'id': col, 'name': col} for col in exercise_cols]
        ),
        data=[
            {col: '' for col in exercise_cols}
        ],
        editable=True,
        persistence=True,
        persisted_props=[
            'columns.name', 'data', 'hidden_columns', 'selected_columns',
            'selected_rows', 'sort_by'
        ],
        persistence_type='session',
        row_deletable=True,
        export_format='xlsx',
    ),
    html.Br(),
    html.Hr(),
    html.P("", id='db-p'),
])


# @app.callback(
#     Output('db-p', 'children'),
#     Input('start-workout-button', 'n_clicks'))
# def access_db_select_users(n_clicks):
#     if n_clicks > 0:
#         try:
#             # create a new database connection by calling the connect() function
#             connection = psycopg2.connect(DATABASE_URL)
#
#             #  create a new cursor
#             cursor = connection.cursor()
#
#             # execute an SQL statement to HerokuPostgres
#             query = "INSERT INTO users(first_name, last_name, passw, email) VALUES(%s, %s, %s, %s);"
#             cursor.execute(query, ('colton', 'bakken', 'pas2830d.!!', 'colton@gmail.com'))
#             connection.commit()
#
#             # close the communication with the HerokuPostgres
#             cursor.close()
#             return 'User added to users'
#         except Exception as error:
#             return 'Cause: {}'.format(error)
#
#         finally:
#             # close the communication with the database server by calling the close()
#             if connection is not None:
#                 connection.close()
#                 # return 'Database connection closed.'


@app.callback(
    Output('exercise-datatable', 'data'),
    Input('add-exercise-button', 'n_clicks'),
    State('exercise-datatable', 'data'),
    State('exercise-datatable', 'columns'))
def add_exercise_datatable_row(n_clicks, rows, columns):
    # max 25 exercises
    if len(rows) >= 25:
        raise PreventUpdate

    # add new row to exercise table
    if n_clicks > 0:
        rows.append({c['id']: '' for c in columns})
    return rows


@app.callback(
    Output('exercise-datatable', 'columns'),
    Input('add-set-button', 'n_clicks'),
    State('exercise-datatable', 'columns'))
def add_exercise_datatable_column(n_clicks, existing_columns):
    # todo Max out at 10 columns
    if n_clicks is None:
        raise PreventUpdate

    # function that sets the set name based on column length, if style of this
    # table changes this will have to be edited
    set_num = int( (len(existing_columns) / 2) + 0.5 )

    # max 10 cols
    if set_num > 10:
        raise PreventUpdate

    # on add-set click, add reps col & weight col
    if n_clicks > 0:
        existing_columns.append({
            'id': f"S{set_num} Reps",
            'name': f"S{set_num} Reps",
        })
        existing_columns.append({
            'id': f"S{set_num} Weight",
            'name': f"S{set_num} Weight",
        })
    return existing_columns


if __name__ == '__main__':
    app.run_server(debug=debug)

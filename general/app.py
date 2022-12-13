import os

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

import config

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

config.connection = mysql.connector.connect(
    host=os.environ.get('HOST'),
    port=3306,
    database=os.environ.get('DB_NAME'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASS'),
    autocommit=True)

db = config.connection


# takes topics as strings
@app.route('/airport/<topic>')
def new_higher_lower(topic):
    with db.cursor() as cursor:
        from random import randrange
        random_country_id = randrange(0, config.AIRPORT_AMOUNT)
        query = f"SELECT country.name, europe_airport.name, {topic}, latitude_deg, longitude_deg " \
                f"FROM country, europe_airport " \
                f"WHERE europe_airport.id='{random_country_id}' AND country.iso_country=europe_airport.iso_country"
        cursor.execute(query)
        airport_data = cursor.fetchone()
        response = jsonify(country=airport_data[0], airport_name=airport_data[1], topic_value=airport_data[2],
                           latitude_deg=airport_data[3], longitude_deg=airport_data[4])
        return response


# takes topics as numbers
@app.route('/leaderboard/<topic>')
def leaderboard(topic):  # returns table of result. (best 10 sorted by points, and then id)
    with db.cursor() as cursor:
        query = "SELECT points, screen_name FROM europe_game " \
                f"WHERE topic={topic} ORDER BY points DESC, id LIMIT 10;"
        cursor.execute(query)
        leaderboard_data = cursor.fetchall()
        return leaderboard_data


# Example:
# /game_end?points=5&name=Jeff&topic=1
@app.route('/game_end')
def game_end():  # stores points and screen name in database
    with db.cursor() as cursor:
        args = request.args
        points = args.get('points')
        screen_name = args.get('name')
        topic = args.get('topic')
        query = f"INSERT INTO flight_game.europe_game (points, screen_name, topic) " \
                f"VALUES (%(points)s, %(screen_name)s, %(topic)s);"
        data = {"points": points, "screen_name": screen_name, "topic": topic}
        cursor.execute(query, data)
        return {}


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

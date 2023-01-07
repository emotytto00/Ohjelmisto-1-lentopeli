import os

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from random import randrange
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
last_5_airports = [0 for i in range(5)]


def new_country_id():
    random_country_id = 0

    while random_country_id in last_5_airports:
        random_country_id = randrange(0, config.AIRPORT_AMOUNT - 1)

    # Shift the list left while adding a new element
    last_5_airports.pop(0)
    last_5_airports.append(random_country_id)

    return random_country_id


# takes topics as strings
@app.route('/airport/<topic>', methods=['GET'])
def new_higher_lower(topic):
    with db.cursor() as cursor:
        country_id = new_country_id()
        query = f"SELECT country.name, europe_airport.name, {topic}, " \
                f"latitude_deg, longitude_deg, europe_airport.iso_country " \
                f"FROM country, europe_airport " \
                f"WHERE europe_airport.id='{country_id}' AND country.iso_country=europe_airport.iso_country " \
                f"LIMIT 1"
        cursor.execute(query)
        airport_data = cursor.fetchone()
        response = jsonify(country=airport_data[0], airport_name=airport_data[1], topic_value=airport_data[2],
                           latitude_deg=airport_data[3], longitude_deg=airport_data[4], iso_country=airport_data[5])
        return response


# takes topics as numbers
@app.route('/leaderboard/<topic>', methods=['GET'])
def leaderboard(topic):  # returns table of result. (best 10 sorted by points, and then id)
    with db.cursor() as cursor:
        query = "SELECT points, screen_name FROM europe_game " \
                f"WHERE topic={topic} ORDER BY points DESC, id LIMIT 10;"
        cursor.execute(query)
        leaderboard_data = cursor.fetchall()
        return leaderboard_data


# Example:
# /game_end?points=5&name=Jeff&topic=1
@app.route('/game_end', methods=['GET'])
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

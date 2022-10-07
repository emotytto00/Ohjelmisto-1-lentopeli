import mysql.connector


class sql:
    def __init__(self, password):
        self.password = password
        self.connection = 0
        try:
            self.connection = mysql.connector.connect(
                host='127.0.0.1',
                port=3306,
                database='flight_game',
                user='root',
                password=self.password,
                autocommit=True)
        except mysql.connector.ProgrammingError:
            print("Invalid credentials")
            quit()

    def new_higher_lower(self, topic, country_id):
        with self.connection.cursor() as cursor:
            # Defining the query
            query = f"SELECT country.name, europe_airport.name, {topic} " \
                    f"FROM country, europe_airport " \
                    f"WHERE europe_airport.id='{country_id}' AND country.iso_country=europe_airport.iso_country;"
            # Adding the coordinates to the airports list
            cursor.execute(query)
            airport_data = cursor.fetchall()
            # Printing distance
            if airport_data:
                return airport_data[0]
            else:
                return "ERROR: sql returned empty set"

    def game_end(self, points, screen_name):
        with self.connection.cursor() as cursor:
            query = f"INSERT INTO flight_game.europe_game (points, screen_name) " \
                    f"VALUES (%(points)s, %(screen_name)s);"
            data = {"points": points, "screen_name": screen_name}
            cursor.execute(query, data)

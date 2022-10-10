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
            print("### Invalid credentials")
            quit()

    def new_higher_lower(self, topic, country_id):  #
        with self.connection.cursor() as cursor:
            # Defining the query
            query = f"SELECT country.name, europe_airport.name, {topic} " \
                    f"FROM country, europe_airport " \
                    f"WHERE europe_airport.id='{country_id}' AND country.iso_country=europe_airport.iso_country"
            cursor.execute(query)
            airport_data = cursor.fetchall()
            if airport_data:
                return airport_data[0]
            else:
                return False

    def game_end(self, points, screen_name, topic):  # stores points and screen name in database
        with self.connection.cursor() as cursor:
            query = f"INSERT INTO flight_game.europe_game (points, screen_name, topic) " \
                    f"VALUES (%(points)s, %(screen_name)s, %(topic)s);"
            data = {"points": points, "screen_name": screen_name, "topic":topic}
            cursor.execute(query, data)

    def leaderboard(self, topic):  # returns table of result. (best 10 sorted by points, and then id)
        with self.connection.cursor() as cursor:
            query = "SELECT points, screen_name FROM europe_game " \
                    f"WHERE topic={topic} ORDER BY points DESC, id LIMIT 10;"
            cursor.execute(query)
            leaderboard_data = cursor.fetchall()
            if leaderboard_data:  # if data exists
                return leaderboard_data
            else:
                return False


connection = sql(input("Input password for SQL connection: "))

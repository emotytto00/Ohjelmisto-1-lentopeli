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
            del self

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
                return airport_data
            else:
                return "ERROR: sql returned empty set"


# test = sql(input("Input password for SQL connection: "))
test = sql("mariadbadmin6432@_")
print(sql.new_higher_lower(test, "elevation_ft", 1))

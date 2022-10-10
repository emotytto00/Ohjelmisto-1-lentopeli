from sql import connection
connection = connection


def print_leaderboard(topic):
    print('Top 10 players')
    print(connection.leaderboard(topic))

def leaderboard_menu():
    while True:
        pass
        # input (mikä topic)
        # printtaa print_leaderboard(inputilla)
        # kysyy mitä tehdään
        # poistutaan breakillä

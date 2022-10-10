from sql import connection
connection = connection


def print_leaderboard(topic):
    print('Top 10 highscores:')
    for item in connection.leaderboard(topic):
        for value in item:
            print(value)

def leaderboard_menu():
    while True:
        pass
        # input (mikä topic)
        # printtaa print_leaderboard(inputilla)
        # kysyy mitä tehdään
        # poistutaan breakillä

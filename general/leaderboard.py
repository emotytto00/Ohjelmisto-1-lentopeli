from sql import connection
connection = connection

def print_leaderboard():
    print('Top 10 players')
    print(connection.leaderboard())


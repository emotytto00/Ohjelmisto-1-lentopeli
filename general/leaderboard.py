from sql import connection
connection = connection

print('Top 10 players')
print(connection.leaderboard())


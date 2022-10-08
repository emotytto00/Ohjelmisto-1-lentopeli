from general.sql import sql

yhteys = sql("DonGio024")

print('Top 10 players')
print(yhteys.leaderboard())


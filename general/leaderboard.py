from sql import connection

connection = connection


def print_leaderboard(topic):
    from general.peli import game
    print('\nTop 10 highscores for topic: ', game.topics[topic])
    x = 0
    print(f"{'+--------+'}{'------------------------------+':>28}\n"
          f'| Points | Screen name                  |\n'
          f"{'+--------+'}{'------------------------------+':>28}")
    for item in connection.leaderboard(topic):
        if x > 0:
            print()
        print('| ', end='')
        x += 1
        y = 0
        for value in item:
            if y == 0:
                print(f'{value:>6}', end='')
            if y == 1:
                print(f'{value:<28}', end='')
            y += 1
            print(f' | ', end='')
    print(f"\n{'+--------+'}{'------------------------------+':>28}")

def leaderboard_menu():
    while True:
        pass
        # input (mikä topic)
        # printtaa print_leaderboard(inputilla)
        # kysyy mitä tehdään
        # poistutaan breakillä

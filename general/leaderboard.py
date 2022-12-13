from config import connection

connection = connection


def print_leaderboard(topic):
    from general.peli import game
    print('\nTop 10 highscores for topic:', game.topics[topic][1])
    x = 0
    print(f"{'+--------+':<10}{'------------------------------+':>28}\n"
          f"{'|':<2}{'Points':^6}{'|':^3}{'Screen name':<28}{'|':>2}\n"
          f"{'+--------+':<10}{'------------------------------+':>28}")
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
    print(f"\n{'+--------+':<10}{'------------------------------+':>28}")


def leaderboard_menu():
    from general.peli import game
    from general import peli
    peli.print_topics()
    while True:
        from general import peli
        view_leaderboard = input('Which leaderboard do you want to view?\n(!) Input an empty string to return\n')
        try:
            view_leaderboard = int(view_leaderboard)
        except ValueError:
            if view_leaderboard == '':
                break
            print('### Invalid value mi amigo')
        else:
            if 0 < view_leaderboard <= len(game.topics):
                print_leaderboard(view_leaderboard)
                topics_again = input('Do you wish to see the topics again? (y/n) ')
                if topics_again.startswith('y'):
                    peli.print_topics()
                else:
                    try:
                        view_leaderboard = int(view_leaderboard)
                    except ValueError:
                        if view_leaderboard == '':
                            break
                        print('### Invalid value mi amigo')
            else:
                print('### Value out of range muchachos')

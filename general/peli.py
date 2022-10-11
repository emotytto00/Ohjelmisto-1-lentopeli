import random
import sys
import leaderboard
from sql import connection


def print_topics():
    print("\nChoose from the following topics:")
    x = 0
    print(f"{'+---+':<5}{'-----------------------------------+':>28}\n"
          f"{'|':<2}{'#':^1}{'|':^3}{'Topic':<33}{'|':>2}\n"
          f"{'+---+':<5}{'-----------------------------------+':>28}")
    for item in game.topics.items():
        if x > 0:
            print()
        print("| ", end="")
        x += 1
        print(f"{item[0]:>1} | ", end="")
        print(f"{item[1]:<33}", end="")
        print(f" | ", end="")
    print(f"\n{'+---+'}{'-----------------------------------+':>28}")


class game:
    game_running = False
    connection = connection
    AIRPORT_AMOUNT = 37
    topics = {1: "elevation_ft",
              2: "flights",
              3: "rating",
              4: "review_amount",
              5: "revenue"}

    def __init__(self, screen_name):
        self.topic = None
        self.new = None
        self.points = 0
        self.screen_name = screen_name
        self.create_game()

    def create_game(self):
        while True:  # new game creation
            new_game = input("Start a new game?: (y/n)\n")
            if new_game.lower().startswith("y"):
                self.start_game()
            elif new_game.lower().startswith("n"):
                print("Quitting...")
                sys.exit()

    def start_game(self):  # Game
        if not game.game_running:  # starts a new game if a game isn't already running
            self.points = 0
            game.game_running = True



            while True:  # topic selection
                print_topics()
                self.topic = input(f"Select topic: (#)\n")
                try:
                    self.topic = int(self.topic)
                except ValueError:
                    print("### Value error: not an integer")
                else:
                    if 0 < self.topic <= len(game.topics):  # if valid topic selection
                        break
                    else:
                        print("### Invalid topic: out of range")

        # Initializing the airports from database
        old = game.connection.new_higher_lower(game.topics[self.topic], random.randrange(0, game.AIRPORT_AMOUNT))
        self.new = game.connection.new_higher_lower(game.topics[self.topic], random.randrange(0, game.AIRPORT_AMOUNT))

        while game.game_running:
            if self.new and old:  # if the SQL-query return valid data for both airports
                while self.new == old:  # Re-roll the new airport if it is the same as the old airport. (no duplicates)
                    self.new = game.connection.new_higher_lower(game.topics[self.topic],
                                                                random.randrange(0, game.AIRPORT_AMOUNT))
                # Print interface
                print(f"\n\n{game.topics[self.topic]:^128}")
                print(f"{old[0]:>64}  :  {self.new[0]:<64}\n"
                      f"{old[1]:>64}  :  {self.new[1]:<64}\n"
                      f"{old[2]:>64}  :  {'??????':<64}\n")

                self.answer(self.new[2], old[2])  # Ask the user for input and determine whether it is right or wrong
                old = self.new  # (current round new) -> (next round old)
            else:  # if SQL-query doesn't return valid data for both airports
                print("### An error occurred while trying to fetch data from the database")
                sys.exit()

    def end_game(self):  # What happens when the game ends
        game.connection.game_end(self.points, self.screen_name, self.topic)  # writes values to database
        print(f"Final score: {self.points}\n\n\n")  # prints score
        leaderboard.print_leaderboard(self.topic)  # prints leaderboard
        game.game_running = False  # stops game

    def right_answer(self):  # What happens when the user inputs the right answer
        self.points += 1
        print(f"Correct answer.\nCurrent points: {self.points}")

    def wrong_answer(self):  # What happens when the user inputs the wrong answer
        print("Wrong answer")
        print(f"The value was: {self.new[2]}")
        self.end_game()

    def answer(self, f_data_new, f_data_old):  # Answering process
        higher = False
        while True:  # keep asking until valid higher/lower answer is inputted
            user_answer = input("    Higher or lower?: ")
            try:
                user_answer = str(user_answer)
            except ValueError:
                print("### Value Error")
            else:
                if f_data_new > f_data_old:  # logic for comparison
                    higher = True
                # if answer is higher and it's correct
                if user_answer.lower().startswith("h") and higher:
                    self.right_answer()
                    break
                # if answer is lower and it's correct
                elif user_answer.lower().startswith("l") and not higher:
                    self.right_answer()
                    break
                # if not valid input
                elif not user_answer.lower().startswith("h") and not user_answer.lower().startswith("l"):
                    print("### Invalid answer format")
                # if answer is not correct or invalid
                else:
                    self.wrong_answer()
                    break

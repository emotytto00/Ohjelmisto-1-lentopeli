import random
import sys
from general.sql import sql


class game:
    game_running = False
    connection = sql(input("Input password for SQL connection: "))
    airport_amount = 37
    topics = {1: "elevation_ft"}

    def __init__(self):
        self.points = 0
        if not game.game_running:  # starts a new game if a game isn't already running
            game.game_running = True
            self.screen_name = input("Input a screen name: ")

            while True:  # topic selection
                self.topic = input(f"Select topic:\n{game.topics}\n")
                try:
                    self.topic = int(self.topic)
                except ValueError:
                    print("### Value error: insert an integer")
                else:
                    if 0 < self.topic <= len(game.topics):  # if valid topic selection
                        break
                    else:
                        print("### Invalid topic: out of range")

        old = game.connection.new_higher_lower(game.topics[self.topic], random.randrange(0, game.airport_amount))
        new = game.connection.new_higher_lower(game.topics[self.topic], random.randrange(0, game.airport_amount))
        while game.game_running:  # The game itself
            while new == old:  # Re-roll the new airport if it is the same as the old airport. (no duplicates)
                new = game.connection.new_higher_lower(game.topics[self.topic],
                                                       random.randrange(0, game.airport_amount))
            print(f"\n\n{game.topics[self.topic]:^128}")
            print(f"{old[0]:>64}  :  {new[0]:<64}\n"
                  f"{old[1]:>64}  :  {new[1]:<64}\n"
                  f"{old[2]:>64}  :  {'??????':<64}\n")
            self.answer(new[2], old[2])
            old = new  # (current round new) -> (next round old)

    def end_game(self):  # What happens when the game ends
        game.connection.game_end(self.points, self.screen_name)  # writes values to database
        print(f"Final score: {self.points}")
        game.game_running = False

    def right_answer(self):  # What happens when the user inputs the right answer
        self.points += 1
        print(f"Correct answer.\nCurrent points: {self.points}")

    def wrong_answer(self):  # What happens when the user inputs the wrong answer
        print("Wrong answer")
        self.end_game()

    def answer(self, f_data_new, f_data_old):  # Answering process
        higher = False
        user_answer = input("    Higher or lower?: ")
        try:
            user_answer = str(user_answer)
        except ValueError:
            print("Value Error")
        else:
            if f_data_new > f_data_old:
                higher = True
            if user_answer.lower().startswith("h") and higher:
                self.right_answer()
            elif user_answer.lower().startswith("l") and not higher:
                self.right_answer()
            else:
                self.wrong_answer()


while True:  # Game
    new_game = input("Start a new game?: (y/n)\n")
    if new_game.lower().startswith("y"):
        game = game()
    elif new_game.lower().startswith("n"):
        print("Quitting...")
        sys.exit()

import sys
from peli import game


class menu:
    MAIN_MENU_OPTIONS = {1: "New Game",
                         2: "Leaderboard",
                         3: "Change Screen Name",
                         4: "Exit"}

    def __init__(self):
        self.screen_name = self.input_screen_name()
        self.run_menu()

    def run_menu(self):
        while True:
            self.choose_from_menu()

    @staticmethod
    def input_screen_name():
        while True:  # screen name input
            f_screen_name = input("Input a screen name: ")
            if len(f_screen_name) < 25:
                return f_screen_name
            else:
                print("### Error: name too long (Max 25 characters)")

    @staticmethod
    def print_menu_options():
        x = 0
        print("\n\n"
              f"{'+---+':<5}{'-----------------------------------+':>28}\n"
              f"{'|':<2}{'#':^1}{'|':^3}{'Main menu':<33}{'|':>2}\n"
              f"{'+---+':<5}{'-----------------------------------+':>28}")
        for item in menu.MAIN_MENU_OPTIONS.items():
            if x > 0:
                print()
            print("| ", end="")
            x += 1
            print(f"{item[0]:>1} | ", end="")
            print(f"{item[1]:<33}", end="")
            print(f" | ", end="")
        print(f"\n{'+---+'}{'-----------------------------------+':>28}")

    def choose_from_menu(self):
        while True:
            self.print_menu_options()
            user_input = input("Select: (#)\n")
            try:
                user_input = int(user_input)
            except ValueError:
                print("### Value error: not an integer")
            else:
                if 0 < user_input <= len(menu.MAIN_MENU_OPTIONS):  # if valid menu selection
                    self.options(user_input)
                else:
                    print("### Invalid input: out of range")

    def options(self, selection):
        if selection == 1:
            game(self.screen_name).create_game()
        elif selection == 2:
            from general.leaderboard import leaderboard_menu
            leaderboard_menu()
        elif selection == 3:
            self.input_screen_name()
        elif selection == 4:
            sys.exit()
        else:
            print("### Invalid input: out of range")

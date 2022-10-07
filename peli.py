#EI TOIMI


import random
import sys

def vertaus(l1, l2, valinta):
    #muuttujat
    kavijamaara1 = l1
    kavijamaara2 = l2
    max = ''

    if kavijamaara1 > kavijamaara2:
        max = l1
    elif kavijamaara1 < kavijamaara2:
        max = l2
    if max == valinta:
        return True
    else:
        return False

pelipaalla = 0
pisteet = 0

pelataanko = str(input('Haluatko pelata peliä (kyllä/en): ').lower())
if pelataanko == 'kyllä':
    pelipaalla +=1
elif pelataanko == 'en':
    print('No voi harmi :(')
    sys.exit()


while pelipaalla == 1:
    l1 = int(10)
    l2 = int(20)

    print(f'{l1}')
    print('VAI')
    print(f'{l2}')

    valinta = int(input('Kummassa on enemmän kävijöitä?: '))
    vertaus(l1, l2, valinta)
    if vertaus(l1, l2, valinta):
        print('Oikein!')
        pisteet += 1
        print(f'pisteet: {pisteet}')
    else:
        print('Väärin meni!')
        print(f'Sait {pisteet} pistettä!')
        uudestaan = input('Haluatko yrittää uudestaan?(kyllä/en): ').lower()
        if uudestaan == 'kyllä':
            pass
        else:
            print('Näkemiin!')
            quit()
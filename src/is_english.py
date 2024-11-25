#!/usr/bin/env python3
"""
Checks if string passed as argument is in the NLTK words corpus, printing
true or false on stdout.
"""
from nltk.corpus import words
import sys.argv as args

def main(arg):
    isEnglish = arg in words.words()
    print(str(arg))

if __name__ == '__main__':
    main(args[1])

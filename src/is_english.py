#!/usr/bin/env python3
"""
Checks if string passed as argument is in the NLTK words corpus, printing
true or false on stdout.
"""
from nltk.corpus import words
import sys

def main(arg):
    isEnglish = arg.lower() in words.words()
    print(str(isEnglish).lower())

if __name__ == '__main__':
    main(sys.argv[1])

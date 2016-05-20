#!/usr/bin/env python
# Name: Julia Jansen
# Student number: 10208194

'''
This script reformats data from csv file
into a useful json file  
'''
import csv
import json

csvfile = open('countrycodes.csv', 'r')
jsonfile = open('countrycodes.json', 'w')

fieldnames = ("code2", "code3", "country")
reader = csv.DictReader(csvfile, fieldnames)

jsonfile.write('{\n	"points" : [\n')
for row in reader:
	jsonfile.write('		')
	json.dump(row, jsonfile)
	jsonfile.write(',\n')
jsonfile.write('{}\n	]\n}')


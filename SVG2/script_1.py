#!/usr/bin/env python
# Name: Julia Jansen
# Student number: 10208194

'''
This script reformats data from csv file
into a useful json file that contains country, country code and urban population (%).
'''
import csv
import json

csvfile = open('urban_2014.csv', 'r')
jsonfile = open('urban_2014.json', 'w')

fieldnames = ("country","code","urban_pop")
reader = csv.DictReader(csvfile, fieldnames)

jsonfile.write('{\n	"points" : [\n')
for row in reader:
	jsonfile.write('		')
	json.dump(row, jsonfile)
	jsonfile.write(',\n')
jsonfile.write('{}\n	]\n}')
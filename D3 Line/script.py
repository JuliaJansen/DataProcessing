#!/usr/bin/env python
# Name: Julia Jansen
# Student number: 10208194

'''
This script reformats data from csv file
into a useful json file that contains data, year, month, country code.
http://sdwebx.worldbank.org/climateportal/index.cfm?page=downscaled_data_download&menu=historical
'''
import csv
import json

csvfile = open('temp.csv', 'r')
jsonfile = open('temp.json', 'w')

fieldnames = ("rainfall", "year", "month", "country_code")
reader = csv.DictReader(csvfile, fieldnames)

jsonfile.write('{\n	"points" : [\n')
for row in reader:
	jsonfile.write('		')
	json.dump(row, jsonfile)
	jsonfile.write(',\n')
jsonfile.write('{}\n	]\n}')


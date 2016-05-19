#!/usr/bin/env python
# Name: Julia Jansen
# Student number: 10208194

'''
This script reformats data from csv file
into a useful json file that contains country, 
'''
import csv
import json

csvfile = open('Footprint_2012.csv', 'r')
jsonfile = open('footprint.json', 'w')

fieldnames = ("Country", "Population", "Cropland", "Grazing", "ForestProduct", "Carbon", "Fish", "Build up land", "Footprintcapita", "Footprintcountry")
reader = csv.DictReader(csvfile, fieldnames)

jsonfile.write('{\n	"points" : [\n')
for row in reader:
	jsonfile.write('		')
	json.dump(row, jsonfile)
	jsonfile.write(',\n')
jsonfile.write('{}\n	]\n}')


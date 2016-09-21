# BomahGoogleScript
A Google Script to be added to a custom set spreadsheet for BOMAH

## Usage of the script

This script is set up to pull all the responses from a specially formatted spreadsheet (for example the output of a form). The top row is a header row and ignored by the script, the columns are Time, Name, and Number, in that order. Additionally, the script adds a menu called BOMAH to the top of the sheet which can then be used to update the csv files that will be generated and which will just hold the phone numbers by date. This is useful so that a google drive api can easily connect to the folder simply pull the csv file to have a list of phone numbers by date who (for example) attended a workshop.

/*
*
*Bomah Spreadsheet Helper to go along with a spreadsheet created using Bomah Workshop Create Google Script
*
*Written by Jonathan Hamermesh,
*November & December 2014
*
*/

/*function runs on onOpen and inflates the menu with the createTimeTrigger function
to be run on the first opening of the Spreadsheet */
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    {name: "Create trigger for every hour", functionName: "createTimeTrigger"},
    {name: "Force update of number lists", functionName: "updateResponses"},
    ];
  ss.addMenu("Bomah", menuEntries);
}

/*creates triggers to run every hour */
function createTimeTrigger() {
  // Trigger every hour
  ScriptApp.newTrigger('updateResponses')
      .timeBased()
      .everyHours(1)
      .create();
}

/*Primary function run every time and does all the work, getting the numbers
and putting them into the correct csv file to save */
function updateResponses() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRow = 2, startColumn = 1, numColumns = 3;
  var numRows = ss.getLastRow();
  var dataEntArray = ss.getSheetValues(startRow, startColumn, numRows, numColumns);
  var numbersToSend = new Array();
  var sendArrayCount = 0;
  var temp;
  
  Logger.log(dataEntArray);
    
  var today = getDay();
  var year = getYear();
  var date = getDate();
  
  Logger.log("today's date is: " + today + ", " + year);
  
  //put all numbers from today into an array
    for (var i = 0; i < dataEntArray.length; i++) {
    //if statement determines if the timestamp includes today's date and year
    if ((JSON.stringify(dataEntArray[i][0]).indexOf(today.split(' ')[0] + '-' + today.split(' ')[1])!=-1)&&(JSON.stringify(dataEntArray[i][0]).indexOf(year)!=-1)) {
      temp = JSON.stringify(dataEntArray[i][2]);
      //regex magic
      temp = temp.replace(/[^0-9]*/g, "");
      //puts in 0 to fill up area code if 0s are removed
      for(var j = temp.length; j < 10; j++) temp = '0' + temp;
      numbersToSend[sendArrayCount] = temp;
      sendArrayCount++;
    }
  }

  Logger.log(numbersToSend);

  if(numbersToSend.length!=0) {

    //prepares filename for csv list of numbers per date
    var csvFileName = date + "_numbers.csv";
    //convert numbersToSend array to CSV format
    var csvFile = convertArrayToCsv(numbersToSend);

    //remove any previous csv files from 'today'
    try{
      var prevCSV = DriveApp.getFilesByName(csvFileName);
      while (prevCSV.hasNext()) {
        var file = prevCSV.next();
        file.setTrashed(true);
      }
    }catch (e) {
      Logger.log(e);
    }

    //create a file in the Docs List with the given name and CSV data
    DocsList.createFile(csvFileName, csvFile);
  }
}

/*gets date and returns as mm dd */
function getDay() {
  var today = new Date();
  var dd = today.getDate();
  if(dd<10) dd='0'+dd;
  var mm = today.getMonth(); //January is 0!
  mm++;
  today = mm + ' ' + dd;
  return today;
}

/*returns Year */
function getYear() {
  var today = new Date();
  var year = today.getFullYear();
  return year;
}

/*returns date as mm/dd/yyyy */
function getDate() {
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();

  if(dd<10) 
    dd='0'+dd; 
  if(mm<10)
    mm='0'+mm; 

  date = mm+'/'+dd+'/'+yyyy;
  
  return date;
}

/*takes the nums and converts them to CSV data */
function convertArrayToCsv(nums) {
  var csvFile = undefined;
  var csv = "";
  
  //Loop through the array and build a string with csv data
  for (var i = 0; i<nums.length; i++) {
    if (nums[i] != null) {
      if (i<nums.length-1) {
        csv += nums[i] + "," + "\n";
      }
      else {
        csv += nums[i];
      }
    }
  }
  csvFile=csv;
  return csvFile;
}

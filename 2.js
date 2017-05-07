/* Copyright (c) 2015 Vladimir Nikitenko - Code Project Open License (CPOL) */

//All parameters except aJSON are optional and have default values.
function jsonObjToHtmlTable(aJSON, aAddHead, aTable, aClearSectionToFill, aSectionToFill,
                            aClearEntireTable, aClearHead, aClearAllBodies, aClearFoot) {
  if (!Boolean(aJSON))
    throw "jsonObjToHtmlTable: Required parameter aJSON is not specified";
  var addHead = Boolean(aAddHead);
  var createNewTable = !Boolean(aTable);
  var clearSectionToFill = !createNewTable && Boolean(aClearSectionToFill);
  var clearTable = !createNewTable && Boolean(aClearEntireTable);
  var clearHead = !createNewTable && (clearTable || addHead || Boolean(aClearHead));
  var clearAllBodies = !createNewTable && (clearTable || Boolean(aClearAllBodies));
  var clearFoot = !createNewTable && (clearTable || Boolean(aClearFoot));

  var tblToFill = createNewTable ? document.createElement("table") : aTable;
  var tblHead = tblToFill.tHead;
  var tblFoot = tblToFill.tFoot;
  var tblBodies = tblToFill.tBodies;
  var sectionToFill = createNewTable ? null : aSectionToFill;
  if (!sectionToFill) {
    if (!(Boolean(tblBodies) && (tblBodies.length > 0))) {
      tblToFill.appendChild(document.createElement("TBODY"));
      tblBodies = tblToFill.tBodies;
    }
    sectionToFill = tblBodies[tblBodies.length - 1];
  }

  if (!jsonObjToHtmlTable.clearTableSection)
    jsonObjToHtmlTable.clearTableSection = function (aTblSection) {
                                             for (var i = aTblSection.rows.length - 1; i >= 0; i--)
                                               aTblSection.deleteRow(i);
                                           };
  if (clearHead && Boolean(tblHead))
    jsonObjToHtmlTable.clearTableSection(tblHead);
  if (clearAllBodies && Boolean(tblBodies) && (tblBodies.length > 0))
    for (var i = tblBodies.length - 1; i >= 0; i--)
      jsonObjToHtmlTable.clearTableSection(tblBodies[i]);
  if (clearFoot && Boolean(tblFoot))
    jsonObjToHtmlTable.clearTableSection(tblFoot);
  if (clearSectionToFill)
    jsonObjToHtmlTable.clearTableSection(sectionToFill);

  var inputJSObj, allRowsAsArrayOfObjects, oneRowAsObject, rowKeyNames;
  var headRow, headRowCell, tableRow, rowCell;

  if(!Object.hasOwnProperty("keys")){ 
    Object.keys = function(aObj){
                    var keyNameArray = [];
                    for (keyName in aObj){
                      if (aObj.hasOwnProperty(keyName)){
                        keyNameArray[keyNameArray.length] = keyName;
                      }
                    }
                    return keyNameArray;
                  };
  }
  inputJSObj = (Object.prototype.toString.call(aJSON) === "[object String]") ? JSON.parse(aJSON) : aJSON;
  allRowsAsArrayOfObjects = (Object.prototype.toString.call(inputJSObj) === "[object Array]") ?
                              inputJSObj : inputJSObj[Object.keys(inputJSObj)[0]];
  rowKeyNames = [];
  if (allRowsAsArrayOfObjects.length > 0){
    rowKeyNames = Object.keys(allRowsAsArrayOfObjects[0]);
    if (addHead) {
      tblHead = tblHead ? tblHead : tblToFill.createTHead();
      headRow = tblHead.insertRow(-1);
      for (var j = 0; j < rowKeyNames.length; j++) {
        headRowCell = document.createElement("th");
        headRowCell.appendChild(document.createTextNode(rowKeyNames[j]));
        headRow.appendChild(headRowCell);
      }
    }
    for (var i = 0; i < allRowsAsArrayOfObjects.length; i++) {
      oneRowAsObject = allRowsAsArrayOfObjects[i];
      tableRow = sectionToFill.insertRow(-1);
      for (var j = 0; j < rowKeyNames.length; j++) {
        rowCell = document.createElement("td");
        rowCell.appendChild(document.createTextNode(oneRowAsObject[rowKeyNames[j]]));
        tableRow.appendChild(rowCell);
      }
    }
  }
  return tblToFill;
}

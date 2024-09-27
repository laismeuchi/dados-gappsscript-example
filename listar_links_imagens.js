function getAllImageLinksInFolderAndPrintToSheet(folderId, sheetId) {
  Logger.log("Folder ID log: " + folderId);
  Logger.log("Sheet ID log: " + sheetId);

  // File types considered as images
  const imageFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml'];

  // Get the main folder by ID
  const mainFolder = DriveApp.getFolderById(folderId);
  
  // Initialize an array to hold the file names and links
  let imageDetails = [];

   // Recursive function to scan the folder and its subfolders
  function scanFolder(folder) {
    // Get all files in the current folder
    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      if (imageFileTypes.includes(file.getMimeType())) {
        // Split file name by period, if it has more than one part, remove the last part (extension)
        const fileNameParts = file.getName().split('.');
        const fileName = fileNameParts.length > 1 ? fileNameParts.slice(0, -1).join('.') : file.getName();
        // Construct the thumbnail URL
        const thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`;
        // Add the file name and thumbnail URL to the array
        imageDetails.push([fileName, thumbnailUrl]);
      }
    }

    // Get all subfolders in the current folder
    const subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      scanFolder(subfolders.next()); // Recursive call
    }
  }

  // Start scanning from the main folder
  scanFolder(mainFolder);

  // Write the file names (without extensions) and links to the Google Sheet
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  sheet.clear(); // Clear the sheet before writing new data
  sheet.getRange(1, 1, imageDetails.length, 2).setValues(imageDetails);
}

function testFolderAndSheetAccess(folderId, sheetId) {
  // Try accessing the folder
  const mainFolder = DriveApp.getFolderById(folderId);
  Logger.log("Folder Name test: " + mainFolder.getName());
  
  // Try accessing the sheet
  const sheet = SpreadsheetApp.openById(sheetId);
  Logger.log("Sheet Name test: " + sheet.getName());
}

function testGetAllImageLinksAndPrintToSheet() {
  const folderId = 'your-folder-id'; // Replace with your folder ID
  const sheetId = 'your-google-sheet-id'; // Replace with your Google Sheet ID

  testFolderAndSheetAccess(folderId, sheetId);
  
  getAllImageLinksInFolderAndPrintToSheet(folderId, sheetId);
}

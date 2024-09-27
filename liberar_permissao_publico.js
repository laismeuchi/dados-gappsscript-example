function setPublicPermissionForAllImages(folderId) {
  Logger.log("Folder ID log: " + folderId);

  // File types considered as images
  const imageFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml'];

  // Get the main folder by ID
  const mainFolder = DriveApp.getFolderById(folderId);
  
  // Recursive function to scan the folder and its subfolders
  function scanFolderAndSetPermissions(folder) {
    // Get all files in the current folder
    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      if (imageFileTypes.includes(file.getMimeType())) {
        // Set the file permission to public
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        Logger.log("Set public permission for file: " + file.getName());
      }
    }

    // Get all subfolders in the current folder
    const subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      scanFolderAndSetPermissions(subfolders.next()); // Recursive call
    }
  }

  // Start scanning from the main folder
  scanFolderAndSetPermissions(mainFolder);

  Logger.log("Completed setting public permissions for all images in the folder.");
}

function testSetPublicPermissionForAllImages() {
  const folderId = 'your_filder_id'; // Replace with your folder ID
  setPublicPermissionForAllImages(folderId);
}

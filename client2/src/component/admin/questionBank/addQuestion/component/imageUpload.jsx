import React from "react";
import "./css/image.css";
import image from "../../../../../util/Avater";

function ImageUplaod({ getImage, uploadImageSize, setImageUpload,Notification }) {
  const updateFiles = async (incommingFiles) => {
    function formatSizeUnits(bytes) {
      if (bytes >= 1073741824) {
        bytes = (bytes / 1073741824).toFixed(2) + " GB";
      } else if (bytes >= 1048576) {
        bytes = (bytes / 1048576).toFixed(2) + " MB";
      } else if (bytes >= 1024) {
        bytes = (bytes / 1024).toFixed(2) + " KB";
      } else if (bytes > 1) {
        bytes = bytes + " bytes";
      } else if (bytes === 1) {
        bytes = bytes + " byte";
      } else {
        bytes = "0 bytes";
      }
      return bytes;
    }
   
if(incommingFiles.target.files[0].size < '3000000') {


    const size = formatSizeUnits(incommingFiles.target.files[0].size);

    setImageUpload(size);
 
  
    const formData = new FormData();

    await formData.append("file", incommingFiles.target.files[0]);
    getImage(formData);
}
else Notification('info','Image must be below 3MB')
  };
  return (
    <div className="app">
      {uploadImageSize.length === 0 ? null : (
        <div>
          {" "}
          <p>Complete</p> <p> File Size : {uploadImageSize}</p>{" "}
        </div>
      )}
      <div className="parent">
        <div className="file-upload">
          <img className="upload-image" src={image.uploadImage} alt="" />
          <h3 style={{ fontWeight: "normal", fontSize: "15px" }}>Add image</h3>
          <input type="file" onChange={updateFiles} />
        </div>
      </div>
    </div>
  );
}

export default ImageUplaod;

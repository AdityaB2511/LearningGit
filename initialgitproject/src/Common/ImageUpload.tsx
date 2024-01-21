import React, { useState } from "react";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <label>Upload Image</label>
        </div>
        <div className="col-md-2">
        <input
         className="btn btn-sm"
          type="file"
          name="myImage"
          accept={"image/png, image/gif, image/jpeg"}
          onChange={(event) => {
            debugger;
            console.log( URL.createObjectURL(event.target.files[0]))
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>
      </div>
      <div className="row col-md-4">
        {selectedImage && (
          <div>
            <img
              alt="not found"
              width={"100%"}
              src={URL.createObjectURL(selectedImage)}
              typeof="image"
            />
            <br />
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUpload;

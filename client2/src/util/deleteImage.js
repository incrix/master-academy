export const deleteImage = (imageUrl) =>{
    fetch("https://upload.incrix.com/api/deleteFile", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ filename: imageUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
     
        });
}
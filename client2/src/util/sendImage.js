import axios from "axios";
export const sendImage = async (formData,setTime) => {
  const config = {
    headers: {
      apikey: "444470",
      doctype: "image",
    },
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percentCompleted = (progressEvent.loaded / progressEvent.total) * 100
      setTime(percentCompleted)
    },
  };

  const get = await axios
    .post("https://upload.incrix.com/api/sendfile", formData, config)
    .then((res) => {
      return res.data.message;
    });

  return get;
};

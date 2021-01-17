import React, {useState} from 'react';
import './App.css';
import axios from 'axios'
import Dropzone from "react-dropzone";
function App() {
const [selectedFile, setSelectedFile] = useState(null);
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null)
  const [loading, setLoading] = useState(0)
  const onChange = (e) => {
    const { files } = e.target;
    setSelectedFile(files[0]);
    setDisplayFile(URL.createObjectURL(files[0]));
    };
    const onSubmit = async(file) => {
      console.log(file)
      //here, we are creatingng a new FormData object; this lets you compile a set of key/value pairs.
      var data = new FormData();
      // we are appending a new value onto an existing key inside a FormData object. the keys here are what is required for the upload by the cloudinary endpoint. the value in line 7 is your upload preset
      data.append('upload_preset', 'xqrwjsdz');
      data.append('file', file)
      try {
      //making a post request to the cloudinary endpoint
      const response = await axios.post(`https://api.cloudinary.com/v1_1/djvzkeset/upload`, data,  {
        // the onUploadProgress is part of the the available config options for making requests.
        onUploadProgress: (ProgressEvent) => {
        setLoading(
        Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
        );
        },
        });
      console.log(response.data)
      //if a response is gotten, we set the selectedFile to null(this is also the original value while desclaring the state variable
      if (response.data) {
        setSelectedFile(null);
        // the API call returns a response that includes the URLs for accessing the uploaded file. here, when we have a response, we call setUploadedImage with a new value.
setUploadedImage(response.data.secure_url);
setDisplayFile('')
      }
      } catch (e) {
      //logthe error if any here. you can as well display them to the users
      console.log(e.response)
      // set the state of loading to 0 if there is an error
      setLoading(0);
      }
      }
return (
<div className="App">
<div className="container">
<div className="inputs">
<input type="file" onChange={onChange} />
<button onClick={() => onSubmit(selectedFile)}>Upload</button>
      </div>
      {displayFile ? (
<img className="preview" alt="preview" src={displayFile} />
) : null}
<hr />
{loading > 0 ? (
<div style={{ width: `${loading}%` }} className="loading">
{loading}%
</div>
      ) : null}
      <hr />
      <Dropzone multiple={false} onDrop={acceptedFiles => {
onSubmit(acceptedFiles[0]);
setDisplayFile(URL.createObjectURL(acceptedFiles[0]))
}}>
{({getRootProps, getInputProps}) => (
<section className="dropzone">
<div {...getRootProps()}>
<input {...getInputProps()} onChange={onChange} />
<p>Drag and drop some files here, or click to select files</p>
</div>
</section>
)}
</Dropzone>
    </div>
    
    <img alt="preview" className="preview" src={uploadedImage} />
</div>
);
}
export default App;
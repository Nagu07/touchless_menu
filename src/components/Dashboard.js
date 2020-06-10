import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import Loader from "./Loader";
import {storage} from './firebase';

//Sign In component
var userName;
var htmlTemplate;

class DashboardComp extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
    image:[],
    url:null,
    loading: false
    };
       
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleQR = this.handleQR.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
} 
    handleChange(event) 
    {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({ 
          [name]: event.target.files
      });
    }

      //Image upload to storage
    handleQR(event) {
      this.setState({ 
        loading: true
       });
       getHTMLURL(userName);
       setTimeout(() => {
        var htmlFileURL = sessionStorage.getItem('htmlURL');
        this.setState({ 
          url: "http://api.qrserver.com/v1/create-qr-code/?data="+htmlFileURL+"&size=100x100",
          loading:false
        });
       },10000);
    }

       
    //Image Delete in storage
    handleDelete(event) {
      this.setState({ 
        loading: true
      });
      getFileName(userName);
      setTimeout(() => {
        alert('Uploaded successfully');
        this.setState({ 
          loading: false
      });
     },10000);

    }
    
    //Image upload to storage
    handleSubmit(event) {
      this.setState({ 
        loading: true
       });
      for(let i=0;i<this.state.image.length;i++)
      {
        const imgObj = this.state.image[i];
        const UploadTask = storage.ref(`${userName}/${imgObj.name}`).put(imgObj);
      }
      setTimeout(() => {
          alert('Uploaded successfully');
          this.setState({ 
            loading: false
        });
       },10000);
    }
    
    //Return a HTML document to user browser
    handlePreview(event) {
        this.setState({ 
          loading: true
        });
        getFileURL(userName);
        setTimeout(() => {
          alert('Preview generated successfully');
          this.setState({ 
            loading: false
        });
      },10000);
  }
      

  render()
  {
    userName = sessionStorage.getItem('userName');
    if(userName == null)
      {
        return <Redirect  to="/login" ></Redirect>;
      }
    if (this.state.loading) 
    {
      return <Loader />;
    }
    return (
        <div className="App">
          <div className="dashboard-section">
          <h3 className="header-text marign-bottom-medium">Dashboard {userName}</h3>
           <div className="upload-section">
           <p className="paragraph-text marign-bottom-small">Upload you menu pictures here</p>
           <div class="upload-btn-wrapper">
            <button class="btn">Select files</button>
            <input type="file" name="image" value={this.state.value} onChange={this.handleChange} multiple/>
          </div>
           <div className="button-section">
           <button onClick={this.handleSubmit} className="form-controls-button">Upload</button>
           <button onClick={this.handlePreview} className="form-controls-button">Download HTML</button>
           <button onClick={this.handleDelete} className="form-controls-button">Delete Uploads</button>
           </div>
           <div>
             <button onClick={this.handleQR} className="form-controls-button">Get QR Code</button>
           </div>
           <div className="marign-bottom-small">
           <img src={this.state.url}></img>  
           </div>
           <div className="inst-section">
             <h2 className="inst-section-header marign-bottom-small">Upload Instructions</h2>
             <ul className="inst-section-list">
               <li className="inst-section-item"><ion-icon name="arrow-forward-outline"></ion-icon> Take photo of your menu sections with good clarity</li>
               <li className="inst-section-item"><ion-icon name="arrow-forward-outline"></ion-icon> Select and Upload the menu pictures</li>
               <li className="inst-section-item"><ion-icon name="arrow-forward-outline"></ion-icon> You can view your menu preview using menu preview button</li>
               <li className="inst-section-item"><ion-icon name="arrow-forward-outline"></ion-icon> You can view your QR code using OR code preview button</li>
             </ul>
           </div>
           </div>
           <footer>&copy; Copyright {(new Date().getFullYear())} Touchless menu</footer>
        </div> 
        </div>     
      );
    }
} 

export default function Dashboard()
{
    return (
        <div className="App">
           <DashboardComp></DashboardComp>
        </div>     
      );
} 

//Gets the link from the firebase
 
function getFileURL(userName)
{
   var fileListArray=[];
   var storageRef = storage.ref();
   var fileList = storageRef.child(`${userName}`);
   
   fileList.listAll().then(function(res) {
     res.items.forEach(function (itemRef) {
      itemRef.getDownloadURL().then(function (url) {  
      fileListArray.push(url);
     })
    })
  })
  //console.log(fileListArray);
  setTimeout(() => {
   generateHTML(fileListArray);
  },5000);
}

//Generating HTML and store it

function generateHTML(fileListArray)
{
  console.log(fileListArray);
  htmlTemplate = "<!DOCTYPE html><html><head><style>img{height:100vh;width:100vw;}</style></head><body>";
  for(let i=0;i<fileListArray.length;i++)
  {
    htmlTemplate += "<img src=" + fileListArray[i] + " />";
  }
  htmlTemplate += "</body></html>";
  
  const element = document.createElement("a");
  const file = new Blob([htmlTemplate],    
                    {type: 'text/html'});
  const UploadHTMLTask = storage.ref(`HTML_Pages/${userName}.html`).put(file);            
  element.href = URL.createObjectURL(file);
  element.download = ""+userName+".html";
  document.body.appendChild(element);
  element.click();
}

//Get List of File under a user
function getFileName(userName)
{
  var fileNameList=[];
   var storageRef = storage.ref();
   var fileList = storageRef.child(`${userName}`);
   
   fileList.listAll().then(function(res) {
     res.items.forEach(function (itemRef) {
        fileNameList.push(itemRef.name);
    })
  })
  //console.log(fileListArray);
  setTimeout(() => {
     deleteFileUploads(fileNameList);
  },4000);
}

//Deleting List of file under user folder one by one
function deleteFileUploads(fileNameList)
{          
    var storageRef = storage.ref();    
    for(let i=0;i<fileNameList.length;i++)
      {
        // Create a reference to the file to delete
        var imageRef = storageRef.child(`${userName}/${fileNameList[i]}`);
        // Delete the file
        var test = imageRef.delete().then(function() {
            // File deleted successfully
            console.log('Delete success');
        }).catch(function(error) {
            // Uh-oh, an error occurred!
            alert('Error occured while deleting please contact site admin');
        });
      }    
}

//Get HTML file Link
function getHTMLURL(userName)
{
  var htmlFileURL = null;
  var storageRef = storage.ref();
  var htmlFileURL = storageRef.child(`HTML_Pages/${userName}.html`);
   
  htmlFileURL.getDownloadURL().then(function(url) {
    htmlFileURL = url;
  }).catch(function(error) {
    alert('Error occured while fetching HTML File URL, Please contact site admin');
  });
  //console.log(fileListArray);
  setTimeout(() => {
    sessionStorage.setItem('htmlURL',htmlFileURL);
 },3000);
}


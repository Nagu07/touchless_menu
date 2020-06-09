import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
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
    url:null
    };
       
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
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
        htmlTemplate += "</body></html>";
         console.log(htmlTemplate);
        const element = document.createElement("a");
        const file = new Blob([htmlTemplate],    
                    {type: 'text/html'});
        console.log(file);
        const UploadHTMLTask = storage.ref(`HTML_Pages/${userName}.html`).put(file);            
        element.href = URL.createObjectURL(file);
        element.download = ""+userName+".html";
        document.body.appendChild(element);
        element.click();

      }

       
    //Image Delete in storage
    // handleDelete(event) {
    //     // Create a reference to the file to delete
    //     var storageRef = storage.ref();
    //     var desertRef = storageRef.child(`${userName}`);

    //     // Delete the file
    //     desertRef.delete().then(function() {
    //       // File deleted successfully
    //       alert('All Uploads deleted successfully');
    //     }).catch(function(error) {
    //       // Uh-oh, an error occurred!
    //       alert('Error occured while delete, Please contact website administrator');
    //     });
    //   // const image = this.state.image;
    //   // event.preventDefault();
    //   // const UploadTask = storage.ref(`images/${image.name}`).put(image);
    // }
    
    //Image upload to storage
    handleSubmit(event) {
      console.log(this.state.image);
      for(let i=0;i<this.state.image.length;i++)
      {
        const imgObj = this.state.image[i];
        const UploadTask = storage.ref(`${userName}/${imgObj.name}`).put(imgObj);
        console.log(UploadTask);
      }
    }
    
    //Return a HTML document to user browser
    handlePreview(event) {
      //  htmlTemplate = "<!DOCTYPE html><html><head><style>img{height:100vh;width:100vw;}</style></head><body>";

      //const storageRef = storage.ref();
      //const fileList = storageRef.child(`${userName}`);
      
    //   var forEachtest = new Promise((resolve, reject) => fileList.listAll().then(function(res) {
    //      res.items.forEach(function (itemRef) {
    //       //console.log(itemRef.name);
    //       itemRef.getDownloadURL().then(function (url) {
    //         console.log(url);
    //         htmlTemplate += "<img src=" + url + " />";
    //       });
    //     });
    //   }));

    //   forEachtest.then(() => {
    //     console.log('All done!');
    // });

    // var fileListArray = getFileURL(userName, fileListArray => 
    // {
    //   console.log('Now we have data');
    //   console.log(fileListArray);
    // });       
    //var test = generateHTML(fileListArray);
    // for(let i=0;i<fileListArray.length;i++)
    // {
    //   htmlTemplate += "<img src=" + fileListArray[i] + " />";
    // }
    //   htmlTemplate += "</body></html>";

    //console.log(generateHTML(fileListArray));
      // const element = document.createElement("a");
      // const file = new Blob([generateHTML(fileListArray)],    
      //             {type: 'text/plain;charset=utf-8'});
      // element.href = URL.createObjectURL(file);
      // element.download = "myTest.html";
      // document.body.appendChild(element);
      // element.click();
  }
      

  render()
  {
    userName = sessionStorage.getItem('userName');
    if(userName == null)
      {
        return <Redirect  to="/login" ></Redirect>;
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
           <div className="button-section marign-bottom-medium">
           <button onClick={this.handleSubmit} className="form-controls-button">Upload</button>
           <button onClick={this.handlePreview} className="form-controls-button">Generate HTML</button>
           <button onClick={this.handleQR} className="form-controls-button">Download HTML</button>
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
           {/* <img src={this.state.url}></img> */}
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
  return fileListArray;
}

//Generating HTML and store it

function generateHTML(fileListArray,callback)
{
  htmlTemplate = "<!DOCTYPE html><html><head><style>img{height:100vh;width:100vw;}</style></head><body>";
  for(let i=0;i<fileListArray.length;i++)
  {
    htmlTemplate += "<img src=" + fileListArray[i] + " />";
  }
  htmlTemplate += "</body></html>";
  callback(htmlTemplate);
}



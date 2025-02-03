import axios from "axios";
import { useState } from "react"
import TrendChart from "./components/Trend";
import data from '../data.json';


function App() {
  const [file,setFile]=useState<File|null>(null);
  const [message,setMessage]=useState("");
  const [extractText,setExtractText]=useState("");
  const [ttc,setTtc]=useState(0);
  const [ttk,setTtk]=useState(0);
  const [searchId,setSearchId]=useState("");
  const [chartData,setChartData]=useState<Number[]>([1,2]);

  const handleFileChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    console.log(event);
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
    
  }
  const handleUpload=async()=>{
    if(!file){
      setMessage("please select a file");
      return;
    }
    const formData=new FormData();
    formData.append("image",file);

    try{
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      setExtractText(response.data.extractedText);
      const data=response.data.extractedText.split(" ");
      console.log(data);
      setTtc(Number(data[1]));
      setTtk(Number(data[2]));
      
    }catch(error){
      setMessage("upliad failed")
    }
    
  }
  const handleShowChart=()=>{
    let f:boolean=false;
    data?.forEach((x)=>{
      if(x.userid==searchId){
        console.log(typeof(x.winningData));
        setChartData(x.winningData);
        f=true;
      }
    })
    if(f==false){
      console.log("useid dows not exists");
      
    }
    console.log(chartData);
    
  }
  return (
    <>
      <div>Hiii</div>
      <div>
        <input type="file" onChange={handleFileChange}/>
        <button onClick={handleUpload}>Upload</button>
        {message && <p>{message}</p>}
      </div>
      <div>
        {extractText && <p>{extractText}</p>}
      </div>
      <table border={1}>
        <tr>
        <th>name</th>
        <th>Total token captured</th>
        <th>Total token killed</th>
        </tr>
        <tr>
          <td>a</td>
          <td>{ttc}</td>
          <td>{ttk}</td>
        </tr>
      </table>
      <div>
        <input type="text" value={searchId} onChange={(e)=>setSearchId(e.target.value)}/>
        <button onClick={handleShowChart}>show chart</button>
          <TrendChart xy={chartData}/>
      </div>
    </>
  )
}

export default App

import { Paper, Stack, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import ColorRadioButtons from "./selectOption";
import html2pdf from 'html2pdf.js';
import Loader from "./Loader";

function DownloadPdf() {
  const myRef = useRef();
  const { search } = useLocation();
  const examID = search.split("=")[2];
  const nameUrl = search.split("=")[1];
  const [exameName,setExamName] = useState('')
  const [questions, setQuestions] = useState([]);
  const [isLoading,setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    fetch(`/api/${nameUrl}/examDownload/${examID}`)
      .then((res) => res.json())
      .then( async (data) => {
        setExamName(data.name)
        const imageUrlToBase64 = async (url) => {
            const data = await fetch(url);
            const blob = await data.blob();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
              };
              reader.onerror = reject;
            });
          };
             
          for(let i=0;i<data.questions.length;i++){
            if(data.questions[i].quesImage !== '') {
            
               await imageUrlToBase64(data.questions[i].quesImage).then(data1 => data.questions[i].quesImage = data1 )
          }
          if(data.questions[i].explanatinImageUrl !== '') {
            await imageUrlToBase64(data.questions[i].explanatinImageUrl).then(data1 => data.questions[i].explanatinImageUrl = data1 )
       }
        }
  
        setQuestions(data.questions);
        setLoading(false)
      });
   
  }, []);
  const downloadPdf = async () => {
    try {
      const element = await document.getElementById('htmlContentToConvert');
      if (element) {
        const options = {
          margin: 10,
          filename: `${exameName}.pdf`,
          image: { type: 'jpeg', quality: 1 },
           //html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy', 'avoid-all'] }
        };
        html2pdf(element, options);
      } else {
        console.error('Element not found');
      }
    } catch (error) {
      throw error;
    }
  };


  return (
isLoading ? <Loader /> :
    <body style={{ position: "relative" ,  fontSize: '16px',
    lineHeight:' 1.5'}}  ref = {myRef} >
      <Button
        sx={{
          position: "fixed",
          top: "10px",
          right: "20px",
          backgroundColor: "#187163",
          color: "white",
          ":hover": {
            backgroundColor: "#187163",
          },
        }}
        onClick={downloadPdf}
      >
        Download
      </Button>
      <Paper
     
      id='htmlContentToConvert'
        style={{
       
          display: "flex",
          gap: "10px",
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          flexDirection: "column",
        }}
      >
        {questions.map((task, index) => (
          <Stack key={index}  >
            <Stack display="flex" gap="3px" direction="row" alignItems="start">
              <p style={{ fontWeight: 700, fontSize: "18px" }}>{index + 1}.</p>
              <p style={{ fontWeight: 700, fontSize: "18px" }}>{task.title}</p>
            </Stack>
            {task.quesImage == "" ? null : (
              <Stack >
                <p style={{ fontWeight: "700", fontSize: "16px" }}>
                  Question Image :
                </p>
                <center>
                  <img
                    style={{
                      width: "400px",
                      height: "200px",
                    }}
                    
                    src={task.quesImage}
                    alt=""
                  />
                </center>
              </Stack>
            )}
            <Stack>
              {task.options.map((task, index) => (
                <Stack
                  key={index}
                  display="flex"
                  direction="row"
                  alignItems="center"
                >
                  <ColorRadioButtons isCorrect={task.isCorrect} index={index} />
                  <p key={index} style={{ fontSize: "15px" }}>
                    {task.option}
                  </p>
                </Stack>
              ))}
            </Stack>
            {task.explanatinImageUrl !== "" ? (
              <div >
                <p style={{ fontWeight: "700", fontSize: "18px" }}>
                  Explanation Image :
                </p>
                <center>
                  <img
                    style={{
                      width: "400px",
                      height: "200px",
                    }}
                  
                    src={
                  task.explanatinImageUrl
                    }
                    alt=""
                  />
                </center>
              </div>
            ) : null}
            {task.explanation !== "" ? (
              <div >
                <p style={{ fontWeight: "700", fontSize: "18px" }}>
                  Explanation :
                </p>
                <p style={{ fontSize: "15px" }}>{task.explanation}</p>
              </div>
            ) : null}
          </Stack>
        ))}
       
      </Paper>
    </body>
  );
}

export default DownloadPdf;


{/* <body style={{ position: "relative" ,fontSize: '16px',
lineHeight:' 1.5'}}  ref = {myRef} >
  <Button
    sx={{
      position: "fixed",
      top: "10px",
      right: "20px",
      backgroundColor: "#187163",
      color: "white",
      ":hover": {
        backgroundColor: "#187163",
      },
    }}
    onClick={downloadPdf}
  >
    Download
  </Button>
  <Paper
 
  id='htmlContentToConvert'
    style={{
  
      display: "flex",
      gap: "10px",
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      flexDirection: "column",
    }}
  >
    {questions.map((task, index) => (
      <Stack key={index}  >
        <Stack display="flex" gap="3px" direction="row" alignItems="start">
          <p style={{ fontWeight: 700, fontSize: "18px" }}>{index + 1}.</p>
          <p style={{ fontWeight: 700, fontSize: "18px" }}>{task.title}</p>
        </Stack>
        {task.quesImage == "" ? null : (
          <Stack >
            <p style={{ fontWeight: "700", fontSize: "16px" }}>
              Question Image :
            </p>
            <center>
              <img
                style={{
                  width: "400px",
                  height: "200px",
                }}
                // onLoad={callAgain}
                src={task.quesImage}
                alt=""
              />
            </center>
          </Stack>
        )}
        <Stack>
          {task.options.map((task, index) => (
            <Stack
              key={index}
              display="flex"
              direction="row"
              alignItems="center"
            >
              <ColorRadioButtons isCorrect={task.isCorrect} index={index} />
              <p key={index} style={{ fontSize: "15px" }}>
                {task.option}
              </p>
            </Stack>
          ))}
        </Stack>
        {task.explanatinImageUrl !== "" ? (
          <div >
            <p style={{ fontWeight: "700", fontSize: "18px" }}>
              Explanation Image :
            </p>
            <center>
              <img
                style={{
                  width: "400px",
                  height: "200px",
                }}
              
                src={
              task.explanatinImageUrl
                }
                alt=""
              />
            </center>
          </div>
        ) : null}

        {task.explanation !== "" ? (
          <div >
            <p style={{ fontWeight: "700", fontSize: "18px" }}>
              Explanation :
            </p>
            <p style={{ fontSize: "15px" }}>{task.explanation}</p>
          </div>
        ) : null}
      </Stack>
    ))}
   
  </Paper>
</body> */}
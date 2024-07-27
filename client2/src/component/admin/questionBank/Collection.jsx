import React, { useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Notification from "../../../util/Alert";
import Button from "@mui/material/Button";
import Question from "./addQuestion/AddQuestion";
import QuestionList from "./questionEdit/QuestionList";

function Collection() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const id = search.split("=")[1];

  const [title,setTitle] = useState("")
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [notificate, setNotification] = useState(false);
  const [add, setAdd] = useState(true);
  const [print, setPrint] = useState([]);
  const [searchQues, setSeach] = useState('');

  const senData = (send) => {
    fetch("/api/admin/createQuestion", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(send),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setSeverity(data.status);
        setNotification(true);
        getPriQuestion();
      });
  };
  const controlNotification = (status,message) => {
    setMessage(message)
    setSeverity(status)
    setNotification(true)
     }

  const getPriQuestion = () => {
    fetch("/api/admin/question", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ bankID: id }),
    })
      .then((res) => res.json())
      .then((data) => {

        setPrint(data.message);
      });


      fetch("/api/admin/getBankName", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title)
        });
  };

  const searchQuestion = () => {

    if (search !== '' && searchQues !== '') {
      fetch("/api/admin/searchQues", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title: searchQues,quesID:id }),
      })
        .then((res) => res.json())
        .then((data) => {
         
          if(data.status == 'info') return controlNotification(data.status,data.message)
          setPrint(data);
        
        });
    }
    else {
      return controlNotification('info','Please Enter Question Title ')
    }
  };

  useEffect(() => {
    getPriQuestion();
  }, []);

  const style = {
    outerLayer: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "30px",
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: "70px",
    },
    bar: {
      display: "flex",
      gap: "40px",
    },
    questionBody: {
      height: "calc(100vh - 180px)",
      overflowY: "scroll",
      overflowX: "hidden",
      display: "flex",
      padding: "0 10px",
      flexDirection: "column",
      gap: "20px",
    },
  };
  return (
    <div style={style.outerLayer}>
      <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
      <div style={style.navbar}>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <p
            style={{ cursor: "pointer",marginLeft:'10px' }}
            onClick={() => {
              navigate("/admin/bank");
            }}
          >
            Question Bank
          </p>
          <p>{`>`}</p>
          <p style={{ color: "#FEA800" }}>{title}</p>
        </div>
        <div style={style.bar}>
          <OutlinedInput
            placeholder="Search"
            onChange={(e) => {
              setSeach(e.target.value);
             
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchQuestion();
              }
            }}
            sx={{
              width: "253px",
              height: "40px",
              background: "#FFFFFF",
              borderRadius: "5px",
              outline: "1px solid #C4C4C4",
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={searchQuestion} edge="end">
                  <SearchRoundedIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            onClick={() => {
              setAdd(!add);
              getPriQuestion();
            }}
            sx={{
              width: "150px",
              height: "40px",
              fontSize: "14px",
              background: `${add ? "#187163" : "#FEA800"}`,
              color: "white",
              transformText: "lowercase",
              marginRight:'20px',
              "&:hover": {
                backgroundColor: `${add ? "#185C52" : "#FEA820"}`,
              },
            }}
          >
            {add ? "Add question" : "Close"}
          </Button>
        </div>
      </div>
      <div style={style.questionBody} >
        <Question id={id} add={add} senData={senData} />
        {print.length !== 0
          ? print.map((list, index) => (
              <QuestionList
              controlNotification={controlNotification}
                list={list}
                setPrint={setPrint}
                getPriQuestion={getPriQuestion}
                index={index}
                key={index}
              />
            ))
          : <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#CACACA",
          }}
        >
          Add question to the bank
        </div>}
      </div>
    </div>
  );
}

export default Collection;

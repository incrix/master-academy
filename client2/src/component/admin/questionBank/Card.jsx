import React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Image from "../../../util/Avater";

const Card = ({ task, index }) => {
  const navigate = useNavigate();
  const style = {
    container: {
      width: "310px",
      height: "78px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px",
      boxShadow: "0px 15px 62px 0px rgba(0, 0, 0, 0.08)",
    },
    image: {
      width: "46px",
      height: "44px",
    },
    firstChild: {
      display: "flex",
      gap: "10px",
    },

    heading: {
      fontSize: "18px",
    },
    subHeading: {
      fontSize: "14px",
      color: "#FEA800",
    },
  };
  function RouteDirect(task) {
    navigate(`/admin/bank/collection?=${task._id}=${task.title}`);
   
  }

  return (
    
      <div key={index}>
        <Paper sx={style.container}>
          <div style={style.firstChild}>
            <img style={style.image} src={Image.FileImage} alt="" />

            <div>
              <p style={style.heading}>{task.title}</p>
              <p style={style.subHeading}> {task.totalQuestions} Q</p>
            </div>
          </div>
          <Button
            variant="contained"
            style={{
              fontSize: "14px",
              backgroundColor: "#187163",
              textTransform: "none",
            }}
            onClick={() => {
              RouteDirect(task);
            }}
          >
            View
          </Button>
        </Paper>
      </div>
    
  );
};

export default Card;

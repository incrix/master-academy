import React from "react";
import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ColorRadioButtons from "../../../../../util/selectOption";
import { deleteImage } from "../../../../../util/deleteImage";
import Number from "../../questionEdit/editQuestion/component/Number";

function NormalQuestion({
  list,
  index,
  callEdit,
  isOpen,
  setOpen,
  deleteQuestion,
}) {
  const style = {
    outerLayer: {
      with: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    choose: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    question: {
      marginTop: "20px",
      with: "100%",
      fontSize: "18px",
      fontWeight: "600",
    },
    option: {
      with: "100%",
      maxWidth: "600px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    option1: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    explain: {
      marginBottom: "20px",
    },
    image: {
      maxWidth: "120px",
      maxHeight: "120px",
      //  width:'150px',
      //  height:'150px'
    },
  };

  return (
    <Paper
      sx={{
        width: "100%",
        background: " #F5F5F5",
        display: "flex",
        flexDirection: "row",
        padding: "0px 30px",
        justifyContent: "space-between",
      }}
      key={index}
    >
      
      <div style={style.outerLayer}>
        <p style={style.question}>{index+1}.{'  '}{list.title}</p>
        <div style={style.option}>
          <div style={style.option1}>
            {list.type === "Multiple Choose" ? (
              list.options.map((task, key) => (
                <div key={key} style={style.choose}>
                  <ColorRadioButtons isCorrect={task.isCorrect} index={index} />
                  <p>{task.option}</p>
                </div>
              ))
            ) : (
              <div style={{ margin: "20px 0", gap: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <p
                    style={{
                      width: "50px",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    From 
                  </p>
                  <p>:</p>
                  <p style={{ fontSize: "20px" }}>{list.Number[0].from}</p>
                </div>
                <div
                  style={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <p
                    style={{
                      width: "50px",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >

                    To 
                  </p>
                  <p>:</p>
                  <p style={{ fontSize: "20px" }}>{list.Number[0].to}</p>
                </div>
              </div>
            )}
          </div>
          {list.imageUrl == "" ? null : (
            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              <label htmlFor="" style={{ fontSize: "18px", fontWeight: "600" }}>
                Question Image
              </label>
              <img src={list.imageUrl} style={style.image} alt="" />
            </div>
          )}
        </div>
        <div style={style.explain}>
          {list.explanation === "" ? null : (
            <label style={{ fontSize: "18px", fontWeight: "600" }}>
              Explanation
            </label>
          )}
          <p style={{ marginTop: "10px" }}> {list.explanation}</p>
        </div>

        {list.explanatinImageUrl == "" ||
        list.explanatinImageUrl == undefined ? null : (
          <div
            style={{ display: "flex", gap: "10px", flexDirection: "column" }}
          >
            <label style={{ fontSize: "18px", fontWeight: "600" }}>
              Explanation Image
            </label>
            <img src={list.explanatinImageUrl} style={style.image} alt="" />
          </div>
        )}

        <div style={style.explain}>
          {list.explanationLink === "" ? null : (
            <label style={{ fontSize: "18px", fontWeight: "600" }}>
              Explanation Link
            </label>
          )}
          <p style={{ marginTop: "10px" }}> {list.explanationLink}</p>
        </div>
      </div>
      <div
        style={{
          padding: "20px",
          display: "flex",
          width: "60px",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <Button
          sx={{
            color: "#787486",
            background: "#E8E8EA",
            borderRadius: "5px",
            // width: '65px',
            // height: '27px',
            textTransform:'none',
            fontSize:'14px',
            border:'2px solid #787486',
             "&:hover": {
              background: "#E8E8EA",
             },
          }}
          onClick={() => {
            callEdit(list);
            setOpen(!isOpen);
          }}
        >
          {/* <EditIcon /> */}
          Edit
        </Button>
        {/* <IconButton
          sx={{
            color: "white",
            background: "#FEA800",
            borderRadius: "5px",
            width: "50px",
            height: "30px",
            "&:hover": {
              backgroundColor: "#F4A200",
            },
          }}
          onClick={async () => {
            if (list.explanatinImageUrl !== "") {
             await deleteImage(list.explanatinImageUrl);
            }
            if (list.imageUrl !== '') {
             await deleteImage(list.imageUrl);
            }

            deleteQuestion(list._id,list.QuesbankID,list.level)
          }}
        >
          <DeleteIcon />
        </IconButton> */}
      </div>
    </Paper>
  );
}

export default NormalQuestion;

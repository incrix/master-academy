import React, { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import UnstyledSelectBasic from "./component/option";
import Choose from "./component/choose";
import Radio from "@mui/material/Radio";
import { sendImage } from "../../../../util/sendImage";
import SelectLevel from "./component/selectLevel";
import ImageUpload from "./component/imageUpload";
import Notification from "../../../../util/Alert";
import Numbers from "./component/Number";
import "./component/css/image.css";

function Question({ add, senData, id }) {
  const [optionList, setOptionList] = useState([
    { option: "Option 1", isCorrect: false },
  ]);
  const [change, setChange] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [timeQues, setTimeQues] = useState("");
  const [timeExplanation, setTimeExplanation] = useState("");
  const [questions, setQuestions] = useState([
    {
      title: "",
      type: "Multiple Choose",
      options: [],
      level: "Choose level",
      explanation: "",
      explanationLink: "",
      imageUrl: "",
      answer: "",
      QuesbankID: "",
    },
  ]);

  const [isOpen, setOpen] = useState(false);
  const [notificate, setNotification] = useState(false);
  const [image, uploadImage] = useState("");
  const [explanationImage, uploadExplanationImage] = useState("");
  const [uploadImageSize, setImageUpload] = useState([]);
  const [uploadExplanationImageSize, setExplanationImageUpload] = useState([]);
  const [Number, setNumber] = useState([{ from: "", to: "" }]);

  useEffect(() => {
    setQuestions((preValue) => {
      let newList = [...preValue];
      newList[0].answer = optionList.filter((task) => {
        if (task.isCorrect === true) {
          return task.option;
        }
      });
      return newList;
    });
  }, [optionList]);

  const addOptionList = () => {
    setOptionList((value) => {
      const index = value.length;

      return [...value, { option: `Option ${index + 1}`, isCorrect: false }];
    });
  };

  const editOptionList = (index, value) => {
    setOptionList((preValue) => {
      let newList = [...preValue];
      newList[index].option = value;
      return newList;
    });
  };

  const editCorrect = (index) => {
    setOptionList((preValue) => {
      let newList = [...preValue];
      newList[index].isCorrect = true;
      return newList;
    });
  };

  const setCorrectOption = async (clickIndex) => {
    setOptionList((preValue) => {
      preValue.filter((value, index) => {
        if (value.isCorrect === false) {
          if (index === clickIndex) {
            value.isCorrect = true;
          }
        } else value.isCorrect = false;
      });
      return preValue;
    });
    editCorrect(clickIndex);
  };
  const deleteOption = (delIndex) => {
    if (optionList.length !== 1) {
      const get = optionList.filter((task, index) => index !== delIndex);
      setOptionList(get);
    }
  };

  const chooseOption = (option, choose) => {
    setQuestions((preValue) => {
      let newList = [...preValue];
      newList[0].type = choose;
      return newList;
    });
    setOpen(option);
  };
  const chooseLevel = (level) => {
    setQuestions((preValue) => {
      let newList = [...preValue];
      newList[0].level = level;
      return newList;
    });
  };

  const getImage = (getImage) => {
    uploadImage(getImage);
  };
  const getExplanationImage = (getImage) => {
    uploadExplanationImage(getImage);
  };

  const controlNotification = (status, message) => {
    setMessage(message);
    setSeverity(status);
    setNotification(true);
  };

  const sendQuestion = async () => {
    let getImageUrl = "";
    let ExplanatinimageUrl = "";
    if (image !== "") {
      const Url = await sendImage(image, setTimeQues);
      getImageUrl = Url;
    }
    if (explanationImage !== "") {
      const Url = await sendImage(explanationImage, setTimeExplanation);
      ExplanatinimageUrl = Url;
    }
    const send = {
      questionBankId: id,
      type: questions[0].type,
      title: questions[0].title,
      options: optionList,
      level: questions[0].level,
      explanation: questions[0].explanation,
      explanationLink: questions[0].explanationLink,
      imageUrl: getImageUrl,
      explanatinImageUrl: ExplanatinimageUrl,
      answer: questions[0].answer,
      Number: Number,
    };
    senData(send);
    setChange(!change);
    setOpen(false);
    setQuestions([
      {
        title: "",
        type: "Multiple Choose",
        options: [],
        level: "Choose level",
        explanation: "",
        imageUrl: "",
        answer: "",
        explanationLink: "",
        QuesbankID: "",
      },
    ]);
    uploadImage("");
    uploadExplanationImage("");
    setOptionList([{ option: "Option 1", isCorrect: false }]);
    setImageUpload("");
    setExplanationImageUpload("");
    setNumber((prevalue) => {
      const getValue = [...prevalue]
      getValue[0].from = ''
      getValue[0].to = ''
      return getValue
    })
  
    setTimeExplanation("");
    setTimeQues("");
  };

  const style = {
    outerLayer: {
      width: "100%",
    },
    firstChild: {
      width: "70%",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },
    textarea: {
      maxWidth: "760px",
      height: "80px",
      padding: "20px",
      fontSize: "18px",
      outline: "#D1D7DD solid 2px",
      border: "none",
      borderRadius: "2px",
    },
    choose: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      width: "180%",
    },
    option: {
      display: "flex",
      gap: "10px",
      width: "25px",
      height: "15px",
      alignItems: "center",
    },
    firstRowSecondChild: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    upload: {
      display: "flex",
      width: "100%",
    },

    uploadImage: {
      width: "212px",
      height: "40px",
      marginLeft: "auto",
    },

    secondChild: {
      display: "flex",
      width: "50%",
      flexDirection: "column",
      gap: "20px",
      justifyContent: "space-between",
    },
    secondChildFirst: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "auto",
      gap: "20px",
    },
    secondChildBtn: {
      marginLeft: "auto",
      background: " #187163",
      color: "white",
      width: "115px",
      height: "30px",
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
      {add === false ? (
        <Paper
          sx={{
            width: "100%",
            background: " #F5F5F5",
            padding: "30px",
            display: "flex",
          }}
        >
          <div style={style.firstChild}>
            <textarea
              className="text-area"
              style={style.textarea}
              value={questions[0].title}
              placeholder="Add your question here..."
              cols="30"
              rows="10"
              onChange={(e) => {
                // setQuestion(e.target.value);
                setQuestions((preValue) => {
                  let newList = [...preValue];
                  newList[0].title = e.target.value;
                  return newList;
                });
              }}
            ></textarea>
            <div style={style.firstRowSecondChild}>
              <div style={style.choose}>
                {isOpen === false ? (
                  optionList.map((value, index) => {
                    return (
                      <Choose
                        setCorrectOption={setCorrectOption}
                        actValue={value}
                        key={index}
                        deleteOption={deleteOption}
                        index={index}
                        addOptionList={addOptionList}
                        editOptionList={editOptionList}
                      />
                    );
                  })
                ) : (
                  <Numbers
                    to={Number[0].to}
                    from={Number[0].from}
                    setNumber={setNumber}
                  />
                )}
                {isOpen === false ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      width: "150px",
                    }}
                    onClick={addOptionList}
                  >
                    <Radio checked={false} sx={{ color: "#787486" }} />
                    <div style={{ color: "#787486", cursor: "pointer" }}>
                      add option
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <textarea
              className="text-area"
              style={style.textarea}
              placeholder="Add explanation..."
              value={questions[0].explanation}
              onChange={(e) => {
                setQuestions((preValue) => {
                  let newList = [...preValue];
                  newList[0].explanation = e.target.value;
                  return newList;
                });
              }}
            ></textarea>

            <textarea
              className="text-area"
              style={style.textarea}
              placeholder="Add explanation Link..."
              value={questions[0].explanationLink}
              onChange={(e) => {
                setQuestions((preValue) => {
                  let newList = [...preValue];
                  newList[0].explanationLink = e.target.value;
                  return newList;
                });
              }}
            ></textarea>
          </div>

          <div style={style.secondChild}>
            <div style={style.secondChildFirst}>
              <div style={{ width: "100%" }}>
                <UnstyledSelectBasic
                  chooseOption={chooseOption}
                  questions={questions}
                  change={change}
                />
              </div>
              <SelectLevel
                setQuestions={setQuestions}
                questions={questions}
                change={change}
              />
              <div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  Add Question Image
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ImageUpload
                    getImage={getImage}
                    Notification={controlNotification}
                    setImageUpload={setImageUpload}
                    uploadImageSize={uploadImageSize}
                  />
                  {timeQues == "" ? null : (
                    <progress id="progress" value={timeQues} max="100">
                      {" "}
                    </progress>
                  )}
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  Add Explanation Image
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ImageUpload
                    getImage={getExplanationImage}
                    Notification={controlNotification}
                    setImageUpload={setExplanationImageUpload}
                    uploadImageSize={uploadExplanationImageSize}
                  />
                  {timeExplanation == "" ? null : (
                    <progress id="progress" value={timeExplanation} max="100">
                      {" "}
                    </progress>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <Button
                style={style.secondChildBtn}
                onClick={() => {


                  if (questions[0].title !== "") {
                    if (questions[0].answer.length !== 0) {
                      if (questions[0].level == "Choose level") {
                        setMessage("Please Select level");
                        setSeverity("warning");
                        setNotification(true);
                      } else {
                        if(questions[0].type == 'Number') {
                          if(Number[0].from == '' || Number[0].to == '') {
                            setMessage("Please select answer");
                            setSeverity("warning");
                            setNotification(true);
                          }
                          else  sendQuestion();
                        }else sendQuestion();
                       
                      }
                    } else if (questions[0].type !== "Number") {
                      setMessage("Please Select Answer");
                      setSeverity("warning");
                      setNotification(true);
                    } else {
                      if (questions[0].level == "Choose level") {
                        setMessage("Please select level");
                        setSeverity("warning");
                        setNotification(true);
                      } else {
                        if(questions[0].type == 'Number') {
                          if(Number[0].from == '' || Number[0].to == '') {
                            setMessage("Please select answer");
                            setSeverity("warning");
                            setNotification(true);
                          }
                          else  sendQuestion();
                        }else sendQuestion();
                        
                      }
                    }
                  } else {
                    setMessage("Please type Question");
                    setSeverity("warning");
                    setNotification(true);
                  }
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </Paper>
      ) : null}
    </div>
  );
}

export default Question;

import React, { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import UnstyledSelectBasic from "./component/option";
import Choose from "./component/choose";
import Radio from "@mui/material/Radio";
import { sendImage } from "../../../../../util/sendImage";
import SelectLevel from "./component/selectLevel";
import ImageUpload from "./component/imageUpload";
import Number from "./component/Number";
import { deleteImage } from "../../../../../util/deleteImage";
import "./component/css/image.css";

function Question({
  editData,
  edit,
  isCurrent,
  isChange,
  controlNotification,
}) {
  const [optionList, setOptionList] = useState(edit.options);
  const [isOpen, setOpen] = useState(false);
  const [answer, setAnswer] = useState(edit.answer);
  const [timeQues,setTimeQues] = useState('')
  const [timeExplanation,setTimeExplanation] = useState('')
  const [question, setQuestion] = useState(edit.title);
  const [options, setOptions] = useState([]);
  const [level, setLevel] = useState(edit.level);
  const [checkImage, setImage] = useState([
    { changeQuestionImage: true },
    { changeExpanationImage: true },
    { changeExpanationImage: false },
    { changeQuestionImage: '' },
    { changeExpanationImage: '' },

  ]);
  const [explain, setExplain] = useState(edit.explanation);
  const [explainLink, setExplainLink] = useState(edit.explanationLink);
  const [image, uploadImage] = useState("");
  const [type, setType] = useState(edit.type);
  const [Numbers, setNumber] = useState(edit.Number[0]);
  const [oldImageUrl, setOldImageUrl] = useState(edit.imageUrl);

  const [explanatinImageUrl, setExplanationImageUrl] = useState(
    edit.explanatinImageUrl
  );

  useEffect(() => {
    optionList.map((task) => {
      if (task.isCorrect == true) {
        setAnswer(task.option);
      }
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
    const get = optionList.filter((task, index) => index !== delIndex);
    setOptionList(get);
  };

  const chooseOption = (option, choose) => {
    setOptions(choose);
    setType(choose);
    setOpen(option);
  };
  const chooseLevel = (level) => {
    setLevel(level);
  };
  const getQuestionImage = (getImage) => {
    uploadImage(getImage);
  };

  const getExplanationImage = (Image) => {
    setExplanationImageUrl(Image);
  };
  const DeleteImage = (image) => {
    setImage((preValue) => {
      const getValue = [...preValue];
      getValue[3].changeQuestionImage = image;
      return getValue;
    });
  
    setOldImageUrl("");
  };
  const deleteExplanationImage = (image) => {
    setImage((preValue) => {
      const getValue = [...preValue];
      getValue[2].changeExpanationImage = true;
      getValue[4].changeExpanationImage = image;
      return getValue;
    });
  
  };

  const sendQuestion = async () => {
    let getImageUrl = "";
    let getExplanatinImageUrl = "";
    if (image !== "") {
    
      if(oldImageUrl !== '')  await deleteImage(oldImageUrl);
     
      getImageUrl = await sendImage(image,setTimeQues);
    } else if (oldImageUrl !== "") {
      getImageUrl = oldImageUrl;
    }
    if (checkImage[2].changeExpanationImage == false) {
      if (explanatinImageUrl !== edit.explanatinImageUrl) {
        getExplanatinImageUrl = await sendImage(explanatinImageUrl,setTimeExplanation)
        if(edit.explanatinImageUrl !== '') deleteImage(edit.explanatinImageUrl)
      } else {
        getExplanatinImageUrl = edit.explanatinImageUrl;
      }
    } else {
      if(explanatinImageUrl !== edit.explanatinImageUrl) {
       
         getExplanatinImageUrl = await sendImage(explanatinImageUrl,setTimeExplanation)
        
        }

    }

    if(checkImage[3].changeQuestionImage !== '') await deleteImage(checkImage[3].changeQuestionImage)
    if(checkImage[4].changeExpanationImage !== '') await deleteImage(checkImage[4].changeExpanationImage)

    const send = {
      questionID: edit._id,
      questionBankId: edit.QuesbankID,
      type: type,
      title: question,
      options: optionList,
      level: level,
      explanation: explain,
      imageUrl: getImageUrl,
      explanatinImageUrl: getExplanatinImageUrl,
      explanationLink: explainLink,
      answer: answer,
      Number: Numbers,
    };

    setExplain("");
    setLevel("");
    setOptions("");
    setQuestion("");
    uploadImage("");
    setExplanationImageUrl("");
    editData(send);
  };

  const style = {
    outerLayer: {
      width: "100%",
    },
    firstChild: {
      width: "70%",
      display: "flex",
      flexDirection: "column",
      gap: "50px",
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
      gap: "20px",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    secondChildFirst: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "auto",
      gap: "20px",
    },
    secondChildBtn: {
      marginLeft: "20px",
      background: " #187163",
      color: "white",
      width: "115px",
      height: "30px",
    },
    DeleteBtn: {
      marginLeft: "20px",
      background: " #187163",
      color: "white",
      width: "115px",
      height: "30px",
    },
    changeImage: {
      marginLeft: "20px",
      background: " #187163",
      color: "white",
      width: "150px",
      height: "30px",
    },
    Remove: {
      background: " red",
      color: "white",
      width: "150px",
      height: "50px",
    },
  };
  return (
    <div style={style.outerLayer}>
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
            value={question}
            placeholder="Add your question here..."
            cols="30"
            rows="10"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          ></textarea>
          <div style={style.firstRowSecondChild}>
            <div style={style.choose}>
              {type == "Multiple Choose" ? (
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
                <Number
                  to={Numbers.to}
                  from={Numbers.from}
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
            value={explain}
            onChange={(e) => {
              setExplain(e.target.value);
            }}
          ></textarea>

          <textarea
            className="text-area"
            style={style.textarea}
            placeholder="Add explanation Link ..."
            value={explainLink}
            onChange={(e) => {
              setExplainLink(e.target.value);
            }}
          ></textarea>
        </div>

        <div style={style.secondChild}>
          <div style={style.secondChildFirst}>
            <div style={{ width: "50%" }}>
              <UnstyledSelectBasic chooseOption={chooseOption} type={type} />
            </div>
            <SelectLevel chooseLevel={chooseLevel} editLevel={edit.level} />

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <label htmlFor="" style={{ fontSize: "18px", fontWeight: "600" }}>
                Change Question Image
              </label>

              {edit.imageUrl === "" ? (
                <ImageUpload
                  getImage={getQuestionImage}
                  controlNotification={controlNotification}
                />
              ) : (
                checkImage[3].changeQuestionImage == '' ?    
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={edit.imageUrl}
                    style={{
                      width: "100px",
                      height: "100px",
                    }}
                    alt=""
                  />
                </div>: null
              )}

              {edit.imageUrl !== "" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    style={style.changeImage}
                    onClick={() =>
                      setImage((preValue) => {
                       
                        const getValue = [...preValue];
                        getValue[0].changeQuestionImage = true;
                        return getValue;
                      })
                    }
                  >
                    Change image
                  </Button>
                  <Button
                    style={style.DeleteBtn}
                    onClick={() =>
                      setImage((preValue) => {
                        const getValue = [...preValue];
                        getValue[0].changeQuestionImage = false;
                        return getValue;
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              ) : null}

              {edit.imageUrl !== "" ? (
                checkImage[0].changeQuestionImage == true ? (
                  <ImageUpload
                    getImage={getQuestionImage}
                    controlNotification={controlNotification}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "70px",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={style.Remove}
                      onClick={() => {
                        DeleteImage(edit.imageUrl);
                      }}
                    >
                      Remove image
                    </Button>
                  </div>
                )
              ) : null}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <label htmlFor="" style={{ fontSize: "18px", fontWeight: "600" }}>
                Change Explanation Image
              </label>
              {edit.explanatinImageUrl === "" ? (
                <ImageUpload
                  getImage={getExplanationImage}
                  controlNotification={controlNotification}
                />
              ) : (

                checkImage[4].changeExpanationImage  == '' ? 
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={edit.explanatinImageUrl}
                    style={{
                      width: "100px",
                      height: "100px",
                    }}
                    alt=""
                  />
                </div>
                : null
              )}

              {edit.explanatinImageUrl !== "" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    style={style.changeImage}
                    onClick={() =>
                      setImage((preValue) => {
                   
                        const getValue = [...preValue];
                        getValue[1].changeExpanationImage = true;
                        return getValue;
                      })
                    }
                  >
                    Change image
                  </Button>
                  <Button
                    style={style.DeleteBtn}
                    onClick={() =>
                      setImage((preValue) => {
                        const getValue = [...preValue];
                        getValue[1].changeExpanationImage = false;
                        return getValue;
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              ) : null}

              {edit.explanatinImageUrl !== "" ? (
                checkImage[1].changeExpanationImage == true ? (
                  <ImageUpload
                    getImage={getExplanationImage}
                    controlNotification={controlNotification}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "70px",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={style.Remove}
                      onClick={() => {
                        deleteExplanationImage(edit.explanatinImageUrl);
                      }}
                    >
                      Remove image
                    </Button>
                  </div>
                )
              ) : null}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{ ...style.secondChildBtn, background: "#787486" }}
              onClick={() => {
                isChange(!isCurrent);
              }}
            >
              Cancel
            </Button>
            <Button
              style={style.secondChildBtn}
              onClick={() => {
                if (type == "Multiple Choose") {
                  const list = [];
                  optionList.map((task) => {
                    if (task.isCorrect == false) list.push(task);
                  });
                  if (optionList.length !== list.length) {
                    sendQuestion();
                    isChange(!isCurrent);
                  } else
                    controlNotification("warning", "Please choose the answer");
                } else  {
                  
                  sendQuestion();
                  isChange(!isCurrent);
                }
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default Question;

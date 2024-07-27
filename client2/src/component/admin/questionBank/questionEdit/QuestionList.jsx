import React, { useState } from "react";
import Notificate from "../../../../util/Alert";
import NormalQuestion from "./normalQuestion/NormalQuestion";
import EditQuestion from "./editQuestion/EditQuestion";
function QuestionList({ list, index, getPriQuestion, setPrint,controlNotification }) {
  const [isOpen, setOpen] = useState(false);
 
  const [edit, setEdit] = useState([]);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [notificate, setNotification] = useState(false);
  const callEdit = (data) => {
    setEdit(data)
  };

  const deleteQuestion = (deleteId,bankID,level) => {
    fetch("/api/admin/deleteQuestion", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: deleteId,bankID:bankID,level:level}),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setSeverity(data.status);
        setNotification(true);
        getPriQuestion();
      });
  };

  const editData = (data) => {
   
    fetch("/api/admin/editQuestion", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setSeverity(data.status);
        setNotification(true);
        getPriQuestion();
      });
  };

  return (
    <div>

     <Notificate
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
   
      {isOpen === false ? (
        <NormalQuestion
          list={list}
          index={index}
          callEdit={callEdit}
          setOpen={setOpen}
          isOpen={isOpen}
          deleteQuestion={deleteQuestion}
        />
      ) : (
        <EditQuestion
        controlNotification={controlNotification}
          edit={list}
          editData={editData}
          isChange={setOpen}
          isCurrent={isOpen}
        />
      )}
    </div>
  );
}

export default QuestionList;

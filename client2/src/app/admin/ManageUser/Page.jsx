import React, { useEffect, useState } from "react";

import ManageUser from "./components/ManageUser";
import SearchBar from "./components/SearchBar";
import Notification from '../../../util/Alert'
function Manage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [userList, setUserList] = useState([]);
  const [notificate, setNotification] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [isCall,setCall] = useState(false)
  useEffect(() => {
    fetch("/api/admin/manageUser")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          setUsers(data.getTotalUser);
          setUserList(data.getTotalUser);
        }
      });
  },[isCall]);

  useEffect(() => {
    if (userList.length > 0) {
      if (filter !== "") {
        setSearchEmail("");
      
        fetch("/api/admin/pageManageUserFilter",{
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ filter }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status == "success") {
              setUserList(data.getTotalUser);
            }
          });
      }
    }
  }, [filter]);

  useEffect(() => {
    if (userList.length > 0) {
      if (searchEmail !== "") {
        setFilter("");
       
        fetch("/api/admin/pageManageUserSeachEmail",{
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ searchEmail }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status == "success") {
              setUserList(data.getTotalUser);
            }
          });
      }
    }
  }, [searchEmail]);

  const nextPage = (nextPage) => {
    try {
      fetch("/api/admin/nextPageManageUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ nextPage, filter, searchEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "success") {
            setUsers(data.getTotalUser);
            setUserList((preValue) => {
              let getValue = preValue;
              for (let i = 0; i < data.getTotalUser.length; i++) {
                getValue.push(data.getTotalUser[i]);
              }
              getValue = [
                ...getValue.filter(
                  (task, index) => getValue.indexOf(task) == index
                ),
              ];
              return getValue;
            });


          }
        });
    } catch (error) {
      throw error;
    }
  };

  const ControlNotification = (status, message) => {
    setMessage(message);
    setSeverity(status);
    setNotification(true);
  };

  return (
    userList.length > 0 && (
      <div>
        <SearchBar
          setFilter={setFilter}
          filter={filter}
          setSearchEmail={setSearchEmail}
        />
        <ManageUser
          users={users}
          userList={userList}
          filter={filter}
          searchEmail={searchEmail}
          nextPage={nextPage}
          ControlNotification={ControlNotification}
          isCall ={isCall} setCall={setCall}
        />
        <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
        />
      </div>
    )
  );
}

export default Manage;

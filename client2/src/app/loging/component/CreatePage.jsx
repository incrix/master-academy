import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import Image from "../../../util/Avater";
import useWindowDimensions from '../../../util/useWindowDimensions';
export default function CreatePage({ controlNotification }) {
 
  const navigator = useNavigate();
  const { width } = useWindowDimensions();
  const [gender, setGender] = useState([
    { title: "Male", isSelect: true },
    { title: "Female", isSelect: false },
  ]);

  // const [getDetails,setGetdetails] = useState([])
  const [details, setDetails] = useState({ name: "", phone: "" });
  const [Maleavatar, setMaleAvatar] = useState([
    { url: Image.MaleAvatar1, isSelect: false },
    { url: Image.MaleAvatar2, isSelect: false },
    { url: Image.MaleAvatar3, isSelect: false },
    { url: Image.MaleAvatar4, isSelect: false },
  ]);
  const [Femaleavatar, setFealeAvatar] = useState([
    { url: Image.FemaleAvatar1, isSelect: false },
    { url: Image.FemaleAvatar2, isSelect: false },
    { url: Image.FemaleAvatar3, isSelect: false },
    { url: Image.FemaleAvatar4, isSelect: false },
  ]);

  const create = () => {
    const check = [];
    const getDetails =[]
  

    gender.map((task) => {
      if (task.title == "Male" && task.isSelect == true) {
      
        Maleavatar.map((task1) => {
          if (task1.isSelect == false) check.push(task1);
          else getDetails.push({gender:task.title,url:task1.url})
        });

        if (Maleavatar.length == check.length)
          controlNotification("info", "Please select the avatar");
      } else if (task.title == "Female" && task.isSelect == true) {
        Femaleavatar.map((task1) => {
          if (task1.isSelect == false) check.push(task1);
          else getDetails.push({gender:task.title,url:task1.url})
        });
        if (Maleavatar.length == check.length)
          controlNotification("info", "Please select the avatar");
      }
    });
    if(Maleavatar.length !== check.length )  {

     let setImageName = [    
       { url: Image.MaleAvatar1, name: "Male1" },
     { url: Image.MaleAvatar2,name: "Male2" },
     { url: Image.MaleAvatar3,name: "Male3" },
     { url: Image.MaleAvatar4,name: "Male4" },
     { url: Image.FemaleAvatar1, name: "FeMale1" },
     { url: Image.FemaleAvatar2, name: "FeMale2" },
     { url: Image.FemaleAvatar3, name: "FeMale3" },
     { url: Image.FemaleAvatar4, name: "FeMale4" },]

     setImageName = [...setImageName.filter(task => task.url == getDetails[0].url)]
     
      fetch('/api/user/createDetails',{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({name:details.name,phone:details.phone,gender:getDetails[0].gender,avatar:setImageName[0].name})
      })
      .then(res => res.json())
      .then((data)=> {
        controlNotification(data.status,data.message)
        if(data.status == 'success' && data.change == 'create')  navigator("/login/goal")
        if(data.status == 'success' && data.change == 'edit')  navigator("/login");
      })

    }
  
  };
  const style = {
    otp: {
      color: "#187163",
      fontFamily: " DM Sans",
      fontSize: " 12px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: " normal",
    },
    heading: {
      color: "#000",
      fontFamily: "DM Sans",
      fontSize: " 25px",
      fontStyle: " normal",
      fontWeight: " 700",
      lineHeight: "normal",
    },
    title: {
      color: "#000",
      fontFamily: "DM Sans",
      fontSize: " 15px",
      fontStyle: " normal",
      fontWeight: " 400",
      lineHeight: "normal",
    },
  };
  return (
    <Paper
      sx={{
        borderRadius: "7px",
        background: "#FFF",
        boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.15)",
        width: "423px",
        height: "550px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(width < 1000 && {
          width: "80%",
          height: "500px",
       
        })
      }}
    >
      <Stack direction="column" spacing="20px" width="80%" height="95%">
        <h1 style={style.heading}>Enter the Details</h1>
        <Stack direction="column" spacing="10px">
          <label htmlFor="">Name</label>
          <TextField
            id="outlined-basic"
            label="Enter your Name"
            variant="outlined"
            onChange={(e) =>
              setDetails((preValue) => {
                const getValue = { ...preValue };
                getValue.name = e.target.value;
                return getValue;
              })
            }
          />
        </Stack>
        <Stack direction="column" spacing="10px">
          <label htmlFor="">Phone Number</label>
          <TextField
            type="number"
            id="outlined-basic"
            label="Enter your phone number"
            variant="outlined"
            onChange={(e) =>
              setDetails((preValue) => {
                const getValue = { ...preValue };
                getValue.phone = e.target.value;
                return getValue;
              })
            }
          />
        </Stack>
        <Stack direction="column" spacing="10px">
          <label htmlFor="" style={style.title}>
            Gender
          </label>
          <Stack direction="row" spacing="10px">
            {gender.map((task, index) => (
              <ChooseGender
                key={index}
                task={task}
                setGender={setGender}
                index={index}
              />
            ))}
          </Stack>
        </Stack>

        <Stack direction="column" spacing="20px">
          <label htmlFor="" style={style.title}>
            Select Avatar
          </label>
          <Stack direction="row" spacing="20px">
            {gender.map((task) =>
              task.title == "Male" && task.isSelect == true
                ? Maleavatar.map((task, index) => (
                    <ChooseAvatar
                      key={index}
                      task={task}
                      setAvatar={setMaleAvatar}
                      index={index}
                      width={width}
                    />
                  ))
                : ""
            )}

            {gender.map((task) =>
              task.title == "Female" && task.isSelect == true
                ? Femaleavatar.map((task, index) => (
                    <ChooseAvatar
                      key={index}
                      task={task}
                      setAvatar={setFealeAvatar}
                      index={index}
                      width={width}
                    />
                  ))
                : ""
            )}
          </Stack>
        </Stack>

        <Button
          style={{
            borderRadius: "4px",
            width: "100%",
            color: "white",
            // background: "#187163",
             color: width < 1000 ?"#187163" : 'white',
             background: width < 1000 ?"white" : '#187163',
          }}
          onClick={()=>{
            if(details.name == '' && details.phone == '' ) controlNotification('info','Please fill the details')
            else create()
  
          }}
        >
          Next
        </Button>

      </Stack>
    </Paper>
  );
}

const ChooseGender = ({ task, index, setGender }) => {
  const handleChange = (event) => {
    setGender((preValue) => {
      const getValue = [...preValue];
      getValue[index].isSelect = true;
      return getValue;
    });
    setGender((preValue) => {
      const getValue = [...preValue];
      getValue.filter((task, index1) => {
        if (index1 !== index) task.isSelect = false;
      });

      return getValue;
    });
  };

  const controlProps = (item) => ({
    checked: true === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <div
      style={{ display: "flex", gap: "10px", alignItems: "center" }}
      key={index}
    >
      <Radio
        {...controlProps(task.isSelect)}
        sx={{
          width: "11px",
          height: "11px",
          color: "#787486",
          "&.Mui-checked": {
            color: "#FEA800",
          },
          marginRight:'5px'
        }}
      />
      <p>{task.title}</p>
    </div>
  );
};

const ChooseAvatar = ({ task, index, setAvatar,width }) => {
  const change = () => {
  
    setAvatar((preValue) => {
      const getValue = [...preValue];
      getValue[index].isSelect = true;
      return getValue;
    });
    setAvatar((preValue) => {
      const getValue = [...preValue];
      getValue.filter((task, index1) => {
        if (index1 !== index) task.isSelect = false;
      });

      return getValue;
    });
  };

  const style = {

    image: {
      width: width > 1000 ?"56px" : '40px',
      height: width > 1000 ?"56px" : '40px',
      border: "solid #187163",
      borderRadius: "350px",
    },
  };
  const style2 = {
    image: {
      width: width > 1000 ?"56px" : '40px',
      height: width > 1000 ?"56px" : '40px',
      borderRadius: "350px",
    },
  };

  return task.isSelect == true ? (
    <img src={task.url} alt="" style={style.image} onClick={change} />
  ) : (
    <img src={task.url} alt="" style={style2.image} onClick={change} />
  );
};

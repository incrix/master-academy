import { Stack, Button } from "@mui/material";
import Header from "../../exam/pages/components/ExamHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../util/Footer";
import useWindowDimensions from "../../../util/useWindowDimensions";
import Image from "../../../util/Avater";
import { callProfileUrl } from "../../../util/callImageUrl";
export default function Success() {
  const navigator = useNavigate();
  const [user, setUser] = useState([]);
  const { width } = useWindowDimensions();
  useEffect(() => {
    fetch("/payMent")
    .then((res) => res.json())
    .then((data) =>{
        if(data.status == false)  navigator('/')
    });

    fetch("/api/user/getUserDetails")
      .then((res) => res.json())
      .then(async(data) => {
        data.avatar = await callProfileUrl(data.avatar)
        setUser(data)});
  },[]);

  const handleSuccess = () => {
    fetch("/handleStatus")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") navigator("/")
      })
  };
  return (
    <Stack direction="column" alignItems="center" height="100vh" padding="20px">
      <Stack
        width={width < 650 ? "100%" : "80%"}
        direction="column"
        height="100%"
        alignItems="center"
        gap="20px"
      >
        <Header user={user} />
        <Stack
          width="100%"
          gap="20px"
          height="820px"
          borderRadius="11px"
          boxShadow="0px 4px 11px 4px rgba(111, 111, 111, 0.15)"
          justifyContent="center"
          alignItems="center"
        >
          <img
            style={{ width: width < 650 ? "130px" : "200px" }}
            src={Image.successImg}
            alt=""
          />
          <p style={{ fontSize: "20px", color: " #187163", fontWeight: "700" }}>
            Payment Successful
          </p>
          <Button
            onClick={handleSuccess}
            style={{ background: "#187163", color: "white", width: "150px" }}
          >
            Done
          </Button>
        </Stack>
        <Stack marginTop="auto" width="100%">
          <Footer />
        </Stack>
      </Stack>
    </Stack>
  );
}

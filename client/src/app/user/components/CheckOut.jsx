import Header from "../../exam/pages/components/ExamHeader";
import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import Footer from "../../../util/Footer";
import useWindowDimensions from "../../../util/useWindowDimensions";
import { useNavigate } from "react-router-dom";
import Address from '../../../util/Address'
import { callProfileUrl } from "../../../util/callImageUrl";
import {domainName} from '../../../util/paymentServerName'
export default function CheckOut() {
  const { width } = useWindowDimensions();
  const navigator = useNavigate();
  const [isChange,setChange] = useState(false)
  const [user, setuser] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  useEffect(() => {
    fetch("/api/user/getCheckout")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "error") return navigator("/");
        const month = [
          { num: 1, month: "January" },
          { num: 2, month: "February" },
          { num: 3, month: "March" },
          { num: 4, month: "April " },
          { num: 5, month: "May " },
          { num: 6, month: "June" },
          { num: 7, month: "July" },
          { num: 8, month: "August" },
          { num: 9, month: "September" },
          { num: 10, month: "October" },
          { num: 11, month: "November" },
          { num: 12, month: "December" },
        ];

        const getMonth = month.filter((task) => task.num == eval(data.month));

        setDetails({
          day: data.day,
          month: getMonth[0].month,
          amount: data.amount,
          total: data.totalAmount,
          year: data.year,
          planMonth: data.planMonth,
          courseName: data.courseName,
          discount: data.discount,
          discountAmount : data.discountAmount
        });
      });
    fetch("/api/user/getUserAddress")
      .then((res) => res.json())
      .then((data) => setAddress(data.address));

    fetch("/api/user/getUserDetails")
      .then((res) => res.json())
      .then(async(data) =>{ 
        data.avatar = await callProfileUrl(data.avatar)
        setuser(data)
      });
  },[isChange]);

  return width > 652 ? (
    <DTCheckOut user={user} details={details} width={width} address={address} isChange={isChange} setChange={setChange} />
  ) : (
    <MDCheckOut user={user} details={details} address={address} isChange={isChange} setChange={setChange}  />
  );
}

function DTCheckOut({ user, details, width, address ,isChange,setChange }) {
  return (
    details && (
      <div
        style={{
          display: "flex",
          backgroundColor: "#C5CFD3",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
          padding: "20px",
          height: "100vh",
        }}
      >
        <Stack width="80%">
          <Header user={user} />
        </Stack>
        <Stack
          width={"80%"}
          borderRadius="11px"
          backgroundColor="white"
          height="820px"
          direction={"row"}
          justifyContent={"center"}
        >
          <Stack
            direction={"column"}
            justifyContent={"center"}
            gap="20px"
            padding={"20px"}
            alignItems={"center"}
            width={width > 922 ? "60%" : "80%"}
          >
            <p
              style={{ fontSize: "30px", color: "#187163", fontWeight: "700" }}
            >
              Checkout
            </p>
            <Stack
              width="100%"
              padding={"10px"}
              direction="column"
              gap="20px"
              boxShadow="0px 4px 31px 0px rgba(0, 0, 0, 0.08)"
            >
              <p style={{ fontSize: "16px", fontWeight: "700" }}>
                {details.courseName}
              </p>
              <Stack
                direction="row"
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <p
                  style={{
                    color: "#FEA800",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Valid till {details.day}th {details.month} {details.year}
                </p>
                <p
                  style={{
                    color: "#187163",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {details.planMonth} month
                </p>
              </Stack>
            </Stack>
            <Stack marginTop="auto" width="100%" direction="column" gap="10px">
              <Stack direction="column" gap="10px">
                <Stack direction="row" justifyContent="space-between">
                  <p style={{ color: "#787486", fontSize: "18px" }}>Subtotal</p>
                  <p style={{ fontSize: "16px", color: "#187163" }}>
                    ₹{details.amount}
                  </p>
                </Stack>
                {details.discount > 0 ? (
                  <Stack direction="row" justifyContent="space-between">
                    <p style={{ color: "#FEA800", fontSize: "18px" }}>
                      Discount {' '} ({details.discount}%)
                    </p>
                    <p style={{ fontSize: "16px", color: "#FEA800" }}>
                      -{' '}₹{details.discountAmount}
                    </p>
                  </Stack>
                ) : null}
                <hr />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack>
                    <p style={{ fontSize: "18px", fontWeight: "500" }}>Total</p>
                    <p style={{ color: "#787486", fontSize: "14px" }}>
                      Including all taxes
                    </p>
                  </Stack>
                  <p
                    style={{
                      fontSize: "21px",
                      fontWeight: "700",
                      color: "#187163",
                    }}
                  >
                    ₹{details.total}
                  </p>
                </Stack>
              </Stack>
              {/* <form method="POST" name="customerData" action="https://themastersacademy.in/payment/ccavRequestHandler">   */}

              {address.city == null &&
              address.state == null &&
              address.pincode == null &&
              address.address == null ? (
                <Address isChange={isChange} setChange={setChange} color= "#187163" />
              ) : (
                <form
                  method="POST"
                  name="customerData"
                  action={domainName}
                >
                  <button
                    style={{
                      width: "100%",
                      height: "30px",
                      background: "#187163",
                      borderRadius: "4px",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    type="submit"
                  >
                    Proceed to Payment
                  </button>
                </form>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack width={"80%"} marginTop="auto">
          <Footer />
        </Stack>
      </div>
    )
  );
}

function MDCheckOut({ user, details,address ,isChange,setChange}) {

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          height: "90%",
          width: "100%",
          padding: "10px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Header user={user} />
        <Stack
          width="100%"
          padding={"10px"}
          direction="column"
          gap="20px"
          height="100px"
          boxShadow="0px 4px 31px 0px rgba(0, 0, 0, 0.08)"
        >
          <p style={{ fontSize: "16px", fontWeight: "700" }}>
            {details.courseName}
          </p>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <p
              style={{
                color: "#FEA800",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Valid till {details.day}th {details.month} {details.year}
            </p>
            <p
              style={{
                color: "#187163",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {details.planMonth} month
            </p>
          </Stack>
        </Stack>
        <Stack direction="column" width="100%" padding="10px" gap="10px">
          <Stack direction="row" justifyContent="space-between">
            <p style={{ color: "#787486", fontSize: "18px" }}>Subtotal</p>
            <p style={{ fontSize: "16px", color: "#187163" }}>
              ₹{details.amount}
            </p>
          </Stack>
          {details.discount > 0 ? (
            <Stack direction="row" justifyContent="space-between">
              <p style={{ color: "#FEA800", fontSize: "18px" }}>
                Discount {' '} ({details.discount}%)
                </p>
              <p style={{ fontSize: "16px", color: "#FEA800" }}>
              -{' '}₹{details.discountAmount}
              </p>
            </Stack>
          ) : null}
          <hr />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack>
              <p style={{ fontSize: "18px", fontWeight: "500" }}>Total</p>
              <p style={{ color: "#787486", fontSize: "14px" }}>
                Including all taxes
              </p>
            </Stack>
            <p
              style={{
                fontSize: "21px",
                fontWeight: "700",
                color: "#187163",
              }}
            >
              ₹{details.total}
            </p>
          </Stack>
        </Stack>
        {/* 
              <form method="POST" style={{width:'100%',marginTop:'auto'}} name="customerData" action="https://themastersacademy.in/payment/ccavRequestHandler">   */}
        {/* <form
          method="POST"
          style={{ width: "100%", marginTop: "auto" }}
          name="customerData"
          action="http://localhost:1338/payment/ccavRequestHandler"
        >
          <button
            style={{
              width: "100%",
              height: "36px",
              background: "#FEA800",
              borderRadius: "5px",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            type="submit"
          >
            Proceed to Payment
          </button>
        </form> */}

{address.city == null &&
              address.state == null &&
              address.pincode == null &&
              address.address == null ? (
                <div style={{marginTop:'auto',width:'100%'}}>

               
                <Address isChange={isChange} setChange={setChange}  color='#FEA800' />
                </div>
              ) : (
                <form
                method="POST"
                style={{ width: "100%", marginTop: "auto" }}
                name="customerData"
                action={domainName}
              >
                <button
                  style={{
                    width: "100%",
                    height: "36px",
                    background: "#FEA800",
                    borderRadius: "5px",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  type="submit"
                >
                  Proceed to Payment
                </button>
              </form>
              )}

      </div>
    </div>
  );
}

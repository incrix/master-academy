import { Paper, Stack } from "@mui/material";
import useWindowDimensions from "./useWindowDimensions";
export default function Footer() {
  const { width } = useWindowDimensions();
  const style = {
    footer: {
      color: "#FEA800",
      fontFamily: "DM Sans",
      fontSize: width > 416 ? "16px" : "13px",
      fontWeight: "500",
    },
  };
  return width > 650 ? (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "90px",
        padding: "15px",
        borderRadius: "14px",
      }}
    >
      <Stack direction={"row"}>
        <a href="/policy" style={{ ...style.footer }}>
          Privacy Policy
        </a>
        <a href="/policy" style={{ ...style.footer, marginLeft: "50px" }}>
          Terms and Conditions
        </a>

        <div style={{ marginLeft: "auto", display: "flex", gap: "15px" }}>
          <a
            href="https://themastersacademy.in/aboutus.html"
            style={{ ...style.footer }}
          >
            About Us
          </a>
          <a
            href="https://themastersacademy.in/Contact.html"
            style={{ ...style.footer }}
          >
            Contact Us
          </a>
          <p style={{ ...style.footer }}>
            {" "}
            <font color="#187163"> Version </font> 1.0.0
          </p>
        </div>
      </Stack>
      <Stack
        sx={{ marginTop: "auto" }}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <p style={{ ...style.footer, color: "#187163" }}>
          © 2023 The Masters Academy - All rights reserved
        </p>
        <p style={style.footer}>
          <font color="#187163"> Designed </font> by incrix
        </p>
      </Stack>
    </Paper>
  ) : (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
        width: "100%",
        borderRadius: "14px",
        padding: "10px",
        gap: "10px",
      }}
    >
      <Stack direction={"row"}>
        <a href="/policy" style={{ ...style.footer }}>
          Privacy Policy
        </a>
        <a href="/policy" style={{ ...style.footer, marginLeft: "50px" }}>
          Terms and Conditions
        </a>
      </Stack>
      <Stack
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ width: "100%" }}
        gap={"5px"}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <a
            href="https://themastersacademy.in/aboutus.html"
            style={{ ...style.footer }}
          >
            About Us
          </a>
          <p style={{ ...style.footer }}>
            {" "}
            <font color="#187163"> Version </font> 1.0.0
          </p>
          <a
            href="https://themastersacademy.in/Contact.html"
            style={{ ...style.footer }}
          >
            Contact Us
          </a>
        </div>
        <p style={style.footer}>
          <font color="#187163"> Designed </font> by incrix
        </p>
      </Stack>
      <Stack
        sx={{ marginTop: "auto" }}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <p style={{ ...style.footer, color: "#187163" }}>
          © 2023 The Masters Academy - All rights reserved
        </p>
      </Stack>
    </Paper>
  );
}

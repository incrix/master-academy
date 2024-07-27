import { Stack } from "@mui/material";
import image from "./Avater";
import useWindowDimensions from "./useWindowDimensions";
export default function ErrorPage() {
  const { width } = useWindowDimensions();
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap="10px"
      height='100vh'
    >
      <img src={image.Error} style={{ width: width > 600 ? "600px" : "400px", height: "400" }} alt="" />
      <p style={{ fontSize: "38px", fontWeight: "700" }}>Page not found</p>
      <p
        style={{
            textAlign:'center',
          fontSize: "16px",
          fontWeight: "400",
          color: "var(--cool-gray-500, #6B7280)",
        }}
      >
        Oops! Looks like you followed a bad link. If you think this is a problem
        with us, please tell us.
      </p>
    </Stack>
  );
}

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  Stack,
} from "@mui/material";
import { forwardRef, useState } from "react";
import Avater from "../../../../util/Avater";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function WarningComp({}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");

  window.oncontextmenu = () => {
    return false;
  };

  window.onkeydown =
    window.onkeyup =
    window.onkeypress =
      () => {
        window.event.returnValue = false;
        return false;
      };

  let h = window.innerHeight;
  let w = window.innerWidth;

  window.onresize = () => {
    if (h !== window.innerHeight || w !== window.innerWidth) {
      setViolationMessage(
        "You are not allowed to resize the window, or to open the developer tools."
      );
      setIsDialogOpen(true);
    }
  };

  window.onfocus = function () {
    setViolationMessage(
      "You are not allowed to switch tabs, or to open the developer tools."
    );
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      disableEscapeKeyDown
      aria-describedby="alert-dialog-slide-description"
    >
      {/* <DialogTitle>{"Stop violating the exam protocol."}</DialogTitle> */}
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Stack alignItems="center">
            <img
              src={Avater.WarningIcon}
              alt="warning"
              width="100px"
              height="100px"
            />
            <h1>Stop Violating</h1>
            <div style={{
                width: "80%",
                textAlign: "center",
                fontSize: "18px",
            }}>{violationMessage}</div>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack alignItems="center" width="100%">
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#FF0000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FF0000",
                color: "#fff",
              },
            }}
            onClick={handleDialogClose}
          >
            Ok
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

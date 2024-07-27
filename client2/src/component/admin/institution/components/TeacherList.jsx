import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";
import AddTeacherBatch from "./AddTeacherBatch";
import "../../../../App.css";
import LoadingButton from "@mui/lab/LoadingButton";

export default function TeacherList({
  institute,
  getTeacheAccess,
  ControlNotification,
  isLoading,
  setLoading,
}) {
  return (
    <div
      className="scrollHide"
      style={{ height: "400px", overflowY: "scroll" }}
    >
      {institute.teacherList.length !== 0 ? (
        <Teacher
          institute={institute}
          getTeacheAccess={getTeacheAccess}
          ControlNotification={ControlNotification}
          isLoading={isLoading}
          setLoading={setLoading}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#CACACA",
          }}
        >
          No Active Teachers
        </div>
      )}
    </div>
  );
}

function Teacher({
  institute,
  getTeacheAccess,
  ControlNotification,
  isLoading,
  setLoading,
}) {
  const handleOk = (data) => {
    getTeacheAccess("ok", data);
  };
  const handleRemoveBatch = (data, data2) => {
    const details = {
      removeBatch: data,
      teacher: data2,
    };
    getTeacheAccess("removeBatch", details);
  };
  const removeTeacher = (data) => {
    setLoading((preValue) => {
      let getValue = [...preValue];
      getValue.push(data.id);
      return getValue;
    });
    getTeacheAccess("removeTeacher", data);
  };

  const style = {
    image: {
      width: "40px",
      height: " 40px",
    },
    name: {
      color: " ##000",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    rollNumber: {
      color: " ##000",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "normal",
    },
    email: {
      color: " ##000",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    selectBtn: {
      width: "30px",
      height: "30px",
      color: "green",
      background: "#18716330",
      cursor: "pointer",
    },
    deleteBtn: {
      width: "30px",
      height: "30px",
      color: "#F33B12",
      background: "#F33B1233",
      cursor: "pointer",
    },
    viewBtn: {
      width: "80px",
      height: "40px",
      background: "#187163",
      color: "white",
    },
  };

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 650,
          borderCollapse: "separate",
          borderSpacing: "20px",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" style={{ width: "20%" }}>
              Teacher
            </TableCell>

            <TableCell align="center" style={{ width: "30%" }}>
              Email
            </TableCell>
            <TableCell align="center" sx={{ width: "30%" }}>
              Active Batch
            </TableCell>
            <TableCell align="center" sx={{ width: "20%" }}>
              Add Batch
            </TableCell>
            <TableCell align="center" sx={{ width: "20%" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {institute.teacherList.map((teacher, index) => (
            <TableRow
              key={index}
              style={{
                borderCollapse: "separate",
                borderSpacing: "0px 4px",
              }}
            >
              <TableCell component="th" scope="row">
                <div
                  style={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <img style={style.image} src={teacher.avatar} alt="" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <p style={style.name}>{teacher.name}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell align="center">
                <p style={style.email}>{teacher.email}</p>
              </TableCell>
              <TableCell align="center">
                {teacher.batchList.length > 0 ? (
                  teacher.batchList.map((task, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <p style={{ width: "70px" }}>{task.batchName}</p>
                      <Button
                        style={{ color: "red", background: "none" }}
                        onClick={() => handleRemoveBatch(task, teacher)}
                      >
                        X
                      </Button>
                    </Stack>
                  ))
                ) : (
                  <p>No active batch</p>
                )}
              </TableCell>
              <TableCell align="center">
                <AddTeacherBatch
                  institute={institute}
                  teacherID={teacher.id}
                  ControlNotification={ControlNotification}
                  getTeacheAccess={getTeacheAccess}
                />
              </TableCell>
              <TableCell align="center">
                {isLoading.indexOf(teacher.id.valueOf()) !== -1 ? (
                  <LoadingButton
                    loading
                    sx={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: "white",
                      "& .MuiCircularProgress-root": { color: "#187163" },
                    }}
                  />
                ) : (
                  <Button
                    style={style.viewBtn}
                    onClick={() => removeTeacher(teacher)}
                  >
                    Remove
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

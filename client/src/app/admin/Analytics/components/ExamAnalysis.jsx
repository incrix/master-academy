import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Radar, Doughnut, Line } from "react-chartjs-2";
import { Paper, Stack, Button } from "@mui/material";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip
  // Legend
);
function ExamAnalysis({ examAnalysis, totalAnalysis }) {
  const [getdata, setData] = useState([]);
  const [total,setTotal] = useState(0)
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April ",
      "May ",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Exam",
        data: getdata.length > 0 ? getdata[0].data : examAnalysis[0].data,
        fill: false,
        borderColor: "#187163",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
      },
      y: {
        type: "linear",
        position: "left",
      },
    },
    layout: {
      width: "100%",
    },
  };

  useEffect(() =>{
 if(getdata.length ==  0)
 {
  let total = 0 
   examAnalysis[0].data.map(task => total = total + eval(task) )
  setTotal(total)
 }else{
  let total = 0 
  getdata[0].data.map(task => total = total + eval(task) )
  setTotal(total)
 }
},[getdata])

  return (
    <div style={{ height: "50vh", width: "80%", display: "flex", gap: "10px" }}>
      <Paper sx={{ width: "70%", height: "50vh", padding: "10px" }}>
        <Line data={data} options={options} />
      </Paper>
      <Paper
        sx={{
          width: "20%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginLeft: "auto", width: "70%" }}>
          <SelectYear
            examAnalysis={examAnalysis}
            getdata={getdata}
            setData={setData}
          />
        </div>

        {getdata.length > 0 ? (
          <ShowTotal
            limitYear={getdata[0].year}
            totalAnalysis={totalAnalysis}
            totalExam ={total}
          />
        ) : (
          <ShowTotal
            limitYear={examAnalysis[0].year}
            totalAnalysis={totalAnalysis}
            totalExam ={total}
          />
        )}
      </Paper>
    </div>
  );
}

function ShowTotal({ limitYear, totalAnalysis,totalExam }) {
  return totalAnalysis.map((task) => {
    if (task.year == limitYear) {
      return (
        <Stack
          sx={{
            marginTop: "auto",
            display: "flex",
            gap: "15px",
            paddingBottom: "20px",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              height: "100px",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <p style={{ color: "#187163" }}>Total Payment</p>
            <p style={{ color: "#FEA800", padding: "10px" }}>
            ₹ {' '} {task.totalPayment} 
            </p>
          </Paper>
          <Paper
            sx={{
              width: "100%",
              height: "100px",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <p style={{ color: "#187163" }}>Total Exam</p>
            <p style={{ color: "#FEA800", padding: "10px" }}>
              {totalExam}
            </p>
          </Paper>
        </Stack>
      );
    }
  });
}

function SelectYear({ examAnalysis, setData, getdata }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">
        {getdata.length > 0 ? getdata[0].year : examAnalysis[0].year}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={(e) => {
          setData([examAnalysis[e.target.value]]);
        }}
        label={getdata.length > 0 ? getdata[0].year : examAnalysis[0].year}
      >
        {examAnalysis.map((task, index) => (
          <MenuItem value={index}>{task.year}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ExamAnalysis;

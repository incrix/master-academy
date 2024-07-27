import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Image from "../../../util/Avater";

export default function CourseCollection({ courseList, setNotify, isNotify }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {courseList.map((course, index) => {
        return (
          <CollectionCart
            course={course}
            key={index}
            index={index}
            isNotify={isNotify}
            setNotify={setNotify}
          />
        );
      })}
    </div>
  );
}

function CollectionCart({ course, index }) {
  
  const navigate = useNavigate();
  const style = {
    container: {
      width: "310px",
      height: "78px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px",
      boxShadow: "0px 15px 62px 0px rgba(0, 0, 0, 0.08)",
      position: "relative",
    },
    image: {
      width: "46px",
      height: "44px",
    },
    firstChild: {
      display: "flex",
      gap: "10px",
    },

    heading: {
      fontSize: "18px",
    },
    subHeading: {
      fontSize: "14px",
      color: "#FEA800",
    },
    status: {
      position: "absolute",
      top: "0",
      right: "0",
      width:'60px',
      fontWeight: "700",
      fontSize:'12px',
      textAlign:'center',
      color: course.status == 'publish'? "#02C94F": "#F0954F",
      backgroundColor: course.status == 'publish'? "#D4F6E1": "#FFF1E8",
      borderRadius: "0px 5px",
    },
  };
  function RouteDirect(course) {
    navigate(`/admin/dashboard/course?${course._id}`);
  }
  return (
    <>
      <div key={index}>
        <Paper sx={style.container}>
          <div style={style.firstChild}>
            <img style={style.image} src={Image.FileImage} alt="" />

            <div>
              <p style={style.heading}>{course.title}</p>
            
            </div>
          </div>
          <Button
            variant="contained"
            style={{
              fontSize: "14px",
              backgroundColor: "#187163",
              width: "74px",
              height: "28px",
              textTransform: "none",
            }}
            onClick={() => {
              RouteDirect(course);
            }}
          >
            View
          </Button>
          <div style={style.status}>{course.status == 'publish'? 'Live' : 'Draft' }</div>
        </Paper>
      </div>
    </>
  );
}

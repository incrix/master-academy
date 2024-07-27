import Card from "../../../component/admin/questionBank/Card";
import  '../../../App.css'
function QuestionBank({ bank }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
       
      
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "70px",
        }}
      >
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <p style={{ cursor: "pointer", color: "#FEA800" }}>Question Bank</p>
          <p>{`>`}</p>
        </div>
      </div>
    
      {bank.length === 0 ? (
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
          Create question bank
        </div>
      ) : (
        <div className="scrollHide" style={{  width:'100%', padding:'10px',height:'70vh', overflow:'scroll', paddingLeft:'20px',paddingRight:'20px'}}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap"  }}>
          {bank.map((task, index) => {
            return <Card task={task} index={index} key={index} />;
          })}
          </div>
        </div>
      )}
    
    </div>
  );
}

export default QuestionBank;


import * as ExcelJS from 'exceljs';

export default  async function DownloadExcelSheet ({examInfo,list})  {
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    const columns = [
      { header: "Roll Number", key: "roll", width: 20 },
      { header: "Name", key: "name", width: 50 },
      { header: "Department", key: "dept", width: 10 },
      { header: "Mark", key: "mark", width: 10 },
      { header: "Email", key: "email", width: 50 },
    ];
    for(let i=0;i<examInfo.actualAnswerList.length;i++){
      columns.push({header: i+1, key:i+1, width: 10, })
    }
    worksheet.columns = columns
    list.map((task, index) => {
  
      worksheet.addRow({
        name: task.name,
        roll: task.rollNumber,
        dept: task.dept,
        email: task.email,
        mark: task.mark,
      });
    });
    const ansWer = ['A','B','C','D','E','F','G','H']
    examInfo.studentsPerformance.map((task,index) => {
      let row = 2+index
       task.studentAnswerList.map((task,index) => {
        const cell = worksheet.getCell(row,5+index+1); // Add 1 because column indexes start from 1
        const cellAlign = worksheet.getCell(row,4);
        cellAlign.alignment = {
          vertical: 'left',
          horizontal: 'left'
      }
        if(task !== null)
      { 
         cell.value = ansWer[task] 
         cell.alignment = 
        {
          vertical: 'right',
          horizontal: 'right'
        }
      
      }
      else if(task == null) cell.value = ''
      else {
        cell.value = task
      }
       })
    })


    // Generate a blob containing the Excel file
    const blob = await workbook.xlsx.writeBuffer();
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    
    // Create a link and click on it to trigger the download
    const a = document.createElement('a');
    a.href = blobUrl;
  const examName = `${examInfo.title}.xlsx`;
    a.download = examName
    a.click();
    URL.revokeObjectURL(blobUrl);
return 'success'
  };


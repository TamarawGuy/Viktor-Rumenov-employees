import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import {
  nullToDates,
  refactorData,
  refactorProjectsData,
  daysWorkedTogether,
  returnResult,
} from "./utils.js";

const UploadFileForm = () => {
  const [projectsData, setProjectsData] = useState([]);

  const handleChange = (e) => {
    const fileReader = new FileReader();

    fileReader.addEventListener("load", (e) => {
      let finalData = [];
      let csvData = e.target.result;
      let data = convertCsvDataToArray(csvData);
      let fixedNullDatesData = nullToDates(data);
      let objectsData = refactorData(fixedNullDatesData);
      let projectsObjectsData = refactorProjectsData(objectsData);

      for (const project of projectsObjectsData) {
        let empArr = project.emp;

        for (let i = 0; i < empArr.length; i++) {
          for (let j = i + 1; j < empArr.length; j++) {
            let empId1 = empArr[i].empId;
            let empId2 = empArr[j].empId;
            let emp1DateRange = empArr[i].date;
            let emp2DateRange = empArr[j].date;

            let days = daysWorkedTogether(emp1DateRange, emp2DateRange);
            // console.log(days);

            let data = {
              empIds: [empId1, empId2].sort(),
              projectId: project.id,
              daysWorked: days,
            };

            finalData.push(data);
          }
        }
      }
      let projects = returnResult(finalData);
      console.log(JSON.stringify(projects, null, 2));
      setProjectsData(projects);
    });

    fileReader.readAsBinaryString(e.target.files[0]);
  };

  const convertCsvDataToArray = (data) => {
    let result = [];
    let lines = data.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      result.push(lines[i].split(","));
    }

    return result;
  };

  const columns = [
    { field: "empId1", headerName: "Employee ID #1", width: 303 },
    { field: "empId2", headerName: "Employee ID #2", width: 303 },
    { field: "projectId", headerName: "Project ID", width: 303 },
    { field: "daysWorked", headerName: "Days Worked", width: 303 },
  ];

  return (
    <div className="container">
      <div className="container-input">
        <input type="file" name="file" accept=".csv" onChange={handleChange} />
      </div>
      <div className="data-grid">
        <DataGrid rows={projectsData} columns={columns} />
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <UploadFileForm />
    </div>
  );
}

export default App;

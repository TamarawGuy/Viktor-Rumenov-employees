// convert NULL to today's date object
function nullToDates(data) {
  const newData = data.map((arr) => {
    arr[2] = new Date(arr[2]);
    if (arr[3] === "NULL") {
      arr[3] = new Date();
      return arr;
    } else {
      arr[3] = new Date(arr[3]);
      return arr;
    }
  });

  return newData;
}

// refactor data to array of objects
function refactorData(data) {
  const refactoredData = data.map((arr) => {
    return {
      empId: Number(arr[0]),
      projectId: arr[1],
      from: arr[2],
      to: arr[3],
    };
  });

  return refactoredData;
}

function refactorProjectsData(initialData) {
  const result = [];
  const projectIds = new Set();

  initialData.forEach((data) => {
    if (!projectIds.has(data.projectId)) {
      projectIds.add(data.projectId);
      result.push({
        id: data.projectId,
        emp: [
          {
            empId: data.empId,
            date: {
              from: data.from,
              to: data.to,
            },
          },
        ],
      });
    } else {
      const projectIndex = result.findIndex((p) => p.id === data.projectId);
      result[projectIndex].emp.push({
        empId: data.empId,
        date: {
          from: data.from,
          to: data.to,
        },
      });
    }
  });

  return result;
}

// calculate milliseconds to days function
function calculateDays(millisecondsDifference) {
  return Math.ceil(millisecondsDifference / (1000 * 3600 * 24));
}

// return days that overlap between 2 different date ranges
function daysWorkedTogether(firstDateRange, secondDateRange) {
  // f.from ----------- f.to
  //         s.from -------------- s.to
  if (
    firstDateRange.from <= secondDateRange.from &&
    firstDateRange.to >= secondDateRange.from &&
    firstDateRange.to <= secondDateRange.to
  ) {
    let difference = firstDateRange.to - secondDateRange.from;
    let days = calculateDays(difference);
    return days;
  }

  //            f.from ----------- f.to
  // s.from -------------- s.to
  if (
    firstDateRange.from >= secondDateRange.from &&
    firstDateRange.from <= secondDateRange.to &&
    secondDateRange.to <= firstDateRange.to
  ) {
    let difference = secondDateRange.to - firstDateRange.from;
    let days = calculateDays(difference);
    return days;
  }

  // f.from ------------------- f.to
  //        s.from -------- s.to
  if (
    firstDateRange.from <= secondDateRange.from &&
    firstDateRange.to >= secondDateRange.to
  ) {
    let difference = secondDateRange.to - secondDateRange.from;
    let days = calculateDays(difference);
    return days;
  }

  //        f.from -------- f.to
  // s.from ------------------- s.to

  if (
    firstDateRange.from >= secondDateRange.from &&
    firstDateRange.to <= secondDateRange.to
  ) {
    let difference = firstDateRange.to - firstDateRange.from;
    let days = calculateDays(difference);
    return days;
  }

  return 0;
}

// return the pair that has worked the most
function maxDaysWorkedByPair(data) {
  let newData = [];
  let pairs = [];

  data.map((item) => {
    let strPairData = JSON.stringify(item.empIds);
    let found = pairs.includes(strPairData);

    if (found) {
      let additionalDays = item.daysWorked;
      let obj = newData.find(
        (item) => JSON.stringify(item.empIds) === strPairData
      );
      let updatedDays = additionalDays + obj.maxDays;
      newData = newData.filter(
        (item) => JSON.stringify(item.empIds) !== strPairData
      );
      newData.push({ ...obj, maxDays: updatedDays });
    } else {
      pairs.push(strPairData);
      newData.push({ empIds: item.empIds, maxDays: item.daysWorked });
    }
  });

  let days = Math.max(...newData.map((o) => o.maxDays));
  let pair = newData.find((obj) => obj.maxDays === days);

  return pair;
}

// return the result data for datagrid
function returnResult(data) {
  let id = 0;
  let result = [];
  let pair = maxDaysWorkedByPair(data);

  for (const obj of data) {
    let strObjPair = JSON.stringify(obj.empIds);
    let strWinnerPair = JSON.stringify(pair.empIds);

    if (strObjPair === strWinnerPair) {
      result.push({
        id,
        empId1: pair.empIds[0],
        empId2: pair.empIds[1],
        projectId: obj.projectId,
        daysWorked: obj.daysWorked,
      });
    }
    id++;
  }

  return result;
}

export {
  nullToDates,
  refactorData,
  refactorProjectsData,
  daysWorkedTogether,
  maxDaysWorkedByPair,
  returnResult,
};

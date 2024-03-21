exports.goalValid = (date, time) => {
  try {
    const getDate = date.split("/");
    const getTime = time.split(":");
    const date1 = new Date();
    let indianTime = date1.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const month = indianTime.split(",")[0].split("/");
    const time1 = indianTime.split(",")[1].split(":");

    const examHours = eval(getTime[0] + 3600000) + eval(getTime[1] * 60000);
    const indianHours =
      eval(time1[0].trim() + 3600000) + eval(time1[1].trim() * 60000);

    if (
      eval(getDate[0]) <= eval(month[0]) &&
      eval(getDate[1]) <= eval(month[1]) &&
      eval(getDate[2]) <= eval(month[2])
    ) {
      if (
        eval(getDate[0]) == eval(month[0]) &&
        eval(getDate[1]) == eval(month[1]) &&
        eval(getDate[2]) == eval(month[2])
      ) {
        if (examHours < indianHours) return true;
        else return false;
      } else return true;
    } else return false;
  } catch (error) {
    throw error;
  }
};

exports.getExamStartTime = (date, time) => {
  try {
    const getDate = date.split("/");
    const getTime = time.split(":");

    const date1 = new Date();
    let indianTime = date1.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const month = indianTime.split(",")[0].split("/");
    const time1 = indianTime.split(",")[1].split(":");
    // const examHours = eval(getTime[0] + 3600000) + eval(getTime[1] * 60000);
    // const indianHours = eval(time1[0].trim() + 3600000) + eval(time1[1].trim() * 60000);

    function hoursAndMinutesToMilliseconds(hours, minutes) {
      var millisecondsInAnHour = 60 * 60 * 1000;
      var millisecondsInAMinute = 60 * 1000;

      var totalMilliseconds =
        hours * millisecondsInAnHour + minutes * millisecondsInAMinute;

      return totalMilliseconds;
    }

    // var milliseconds = hoursAndMinutesToMilliseconds(time1[0],time1[1]);
    const examHours = hoursAndMinutesToMilliseconds(getTime[0], getTime[1]);
    const indianHours = hoursAndMinutesToMilliseconds(time1[0], time1[1]);

    if (
      getDate[1] == month[0] &&
      getDate[2] == month[2] &&
      getDate[0] == month[1] &&
      indianHours >= examHours
    )
      return true;
    else return false;
  } catch (error) {
    throw error;
  }
};

exports.getExamExamEndTime = (date, time) => {
  try {
    const getDate = date.split("/");
    const getTime = time.split(":");

    const date1 = new Date();
    let indianTime = date1.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const month = indianTime.split(",")[0].split("/");
    const time1 = indianTime.split(",")[1].split(":");

    function hoursAndMinutesToMilliseconds(hours, minutes) {
      var millisecondsInAnHour = 60 * 60 * 1000;
      var millisecondsInAMinute = 60 * 1000;
      var totalMilliseconds =
        hours * millisecondsInAnHour + minutes * millisecondsInAMinute;
      return totalMilliseconds;
    }

    const examHours = hoursAndMinutesToMilliseconds(getTime[0], getTime[1]);
    const indianHours = hoursAndMinutesToMilliseconds(time1[0], time1[1]);

    if (
      getDate[1] == month[0] &&
      getDate[2] == month[2] &&
      getDate[0] == month[1] &&
      indianHours <= examHours
    )
      return true;
    else return false;
  } catch (error) {
    throw error;
  }
};

function getValidExam(date, time) {
  try {
    const getDate = date.split("/");
    const getTime = time.split(":");

    const date1 = new Date();
    let indianTime = date1.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const month = indianTime.split(",")[0].split("/");
    const time1 = indianTime.split(",")[1].split(":");

    function hoursAndMinutesToMilliseconds(hours, minutes) {
      var millisecondsInAnHour = 60 * 60 * 1000;
      var millisecondsInAMinute = 60 * 1000;
      var totalMilliseconds =
        hours * millisecondsInAnHour + minutes * millisecondsInAMinute;
      return totalMilliseconds;
    }

    const examHours = hoursAndMinutesToMilliseconds(getTime[0], getTime[1]);
    const indianHours = hoursAndMinutesToMilliseconds(time1[0], time1[1]);

    if (
      // getDate[1] >= month[0] &&
      // getDate[2] >= month[2] &&
      // getDate[0] >= month[1] &&
      indianHours > examHours
    )
      return true;
    else return false;
  } catch (error) {
    throw error;
  }
}

exports.getExamValid = (date, time) => {
  try {
    // new Date("11/21/1987 16:00:00") its the format of the date object
    const getDate = date.split("/");
  
    const date1 = new Date();
    const getIndianTime = date1.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const getIndiaMonth = getIndianTime.split(",")[0].split("/");
    const getIndiaHourandMin = getIndianTime.split(",")[1].split(":");


    return  new Date(`${getDate[1]}/${getDate[0]}/${getDate[2]} ${time}:00`) <
     new Date(`${getIndiaMonth[0]}/${getIndiaMonth[1]}/${getIndiaMonth[2]} ${getIndiaHourandMin[0]}:${getIndiaHourandMin[1]}:${getIndiaHourandMin[2]}`)
  
  } catch (error) {
    throw error;
  }
};

exports.analiysticsTime = (year, month, date) => {
  try {

    const currentDate = new Date(`${year} ${month} ${date}`);
    // Get the date string in ISO format without milliseconds and time zone offset
    let isoString = currentDate.toISOString().slice(0, -5);
    // Add milliseconds
    isoString += `.${String(currentDate.getMilliseconds()).padStart(3, "0")}`;
    // Add time zone offset
    const offsetMinutes = -currentDate.getTimezoneOffset();
    const offsetHours = Math.floor(offsetMinutes / 60);
    const offsetMinutesRemainder = offsetMinutes % 60;
    const offsetString = `${offsetHours >= 0 ? "+" : "-"}${String(
      Math.abs(offsetHours)
    ).padStart(2, "0")}:${String(Math.abs(offsetMinutesRemainder)).padStart(
      2,
      "0"
    )}`;
    isoString += offsetString;
    return isoString;
  } catch (error) {
    throw error;
  }
};

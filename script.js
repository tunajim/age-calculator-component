


// get required elements
const dateForm = document.forms["date"];
const arrowButton = document.querySelector(".arrow-button");

const errorMessages = document.querySelectorAll(".date-form__error-message");
const dateFormInputs = document.querySelectorAll(".date-form__input");
const dateFormLabels = document.querySelectorAll(".date-form__label");
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


dateForm.addEventListener("submit", validateForm);
arrowButton.addEventListener("mouseup", submitForm);
document.addEventListener("keydown", checkKey);

function validateForm(e) {
  e.preventDefault();
  console.log(e.target.month);
}

let pattern = /[0-9][0-9]/;

function submitForm(e) {
  let day = dateForm.day.value;
  let month = dateForm.month.value;
  const year = dateForm.year.value;

  let dayString = "" + day;
  let monthString = "" + month;

  // check to see if user inputed a single digit
  if (day < 10 && day != "") dayString = "0" + day;
  if (month < 10 && month != "") monthString = "0" + month;

  day = "" + day;
  month = "" + month;

  //   if user entered a double digit date, or added a 0 in front
  if (pattern.test(day)) dayString = day;
  if (pattern.test(month)) monthString = month;

  const date = `${year}-${monthString}-${dayString}`;
  const realDate = new Date(date);

  //  handle form submission
  if (isValidDate(date) && isInPast(realDate)) {
    deactivateErrorState();
    updateValues(date, true);
  } else {
    console.log("invalid");
    generateFormErrors(day, month, year, false);
    updateValues(date, false);
  }
}


function isInPast(realDate) {
    const currentDate = new Date();
    if(realDate.getTime() < currentDate.getTime()) {
        return true;
    } else {
        return false;
    };
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  // Check if the date object is valid and if the input date string matches the parsed date
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
}


// get error messages
const dayErrorMessage = document.querySelector(
  ".date-form__error-message__day"
);
const monthErrorMessage = document.querySelector(
  ".date-form__error-message__month"
);
const yearErrorMessage = document.querySelector(
  ".date-form__error-message__year"
);

// handle updating values

const yearSlot = document.getElementById("year");
const daySlot = document.getElementById("day");
const monthSlot = document.getElementById("month");
let dateSlots = [yearSlot, daySlot, monthSlot];
const today = new Date();
const monthToday = today.getMonth();
const yearToday = today.getFullYear();


function updateValues(date, isDate) {
  const date2 = new Date(date);
  console.log(Math.abs(today.getTime()));
  const diffInMs = Math.abs(today.getTime() - date2.getTime());

  const msPerDay = 24 * 60 * 60 * 1000;
  const msPerMonth = 30 * msPerDay;
  const msPerYear = 365 * msPerDay;

  const yearDiff = Math.floor(diffInMs / msPerYear);
  const monthDiff = Math.floor((diffInMs % msPerYear) / msPerMonth);
  const dayDiff = Math.floor(((diffInMs % msPerYear) % msPerMonth) / msPerDay);

  if (isDate) {
    yearSlot.textContent = yearDiff;
    daySlot.textContent = dayDiff;
    monthSlot.textContent = monthDiff;
  } else {
    dateSlots.forEach((slot) => {
      slot.textContent = "- -";
    });
  }
}

// handle inputs and errors

function generateFormErrors(day, month, year) {
  if (month > 12 || month < 1)
    monthErrorMessage.textContent = "Must be a valid month";

  if (day <= months.length && day > 0) {
    if (month == 2 && isLeapYear(year)) {
      if (day > 29) dayErrorMessage.textContent = "Must be a valid day";
    } else if (months[month - 1] < day) {
      dayErrorMessage.textContent.textContent = "Must be a valid day";
    }
  }
  activateErrorState();
  isInputEmpty(day, month, year);
}

function isLeapYear(year) {
  year % 4 == 0
    ? year % 100 == 0
      ? year % 400 == 0
        ? true
        : false
      : true
    : false;
}

function isInputEmpty(day, month, year) {
  day != ""
    ? (dayErrorMessage.textContent = "Must be a valid day")
    : (dayErrorMessage.textContent = "This field is required");

  month != ""
    ? (monthErrorMessage.textContent = "Must be a valid month")
    : (monthErrorMessage.textContent = "This field is required");

  year != ""
    ? (yearErrorMessage.textContent = "Must be in the past")
    : (yearErrorMessage.textContent = "This field is required");
}

function deactivateErrorState() {
  errorMessages.forEach((message) => {
    message.classList.remove("active");
  });

  dateFormInputs.forEach((input) => {
    input.classList.remove("active");
  });

  dateFormLabels.forEach((label) => {
    label.classList.remove("active");
  });
}

function activateErrorState() {
  errorMessages.forEach((message) => {
    message.classList.add("active");
  });

  dateFormInputs.forEach((input) => {
    input.classList.add("active");
  });

  dateFormLabels.forEach((label) => {
    label.classList.add("active");
  });
}

function checkKey(e) {
    console.log(e.key);
    if(e.key == "Enter") {
        submitForm(e);
    }
}
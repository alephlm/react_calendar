import React from 'react';
import { render } from 'react-dom';
import CalendarControls from './containers/calendar-controls'
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import moment from 'moment';

function requestDates(state, weekDay = 0) {
  var month = state.week[weekDay].format("MM");
  var year = state.week[weekDay].format("YYYY");
  fetch(`http://localhost/calendar-api/holidaysmonth?month=${month}&year=${year}`)
  .then(results => results.json())
  .then(data => {
    data = state.folkHolidays.concat(data.map(a => ({ ...a, date: moment(a.date) }))); //converts date from SQLstring to date
    let newState = {...state, 
      folkHolidays: data, 
      requestedDates: [...state.requestedDates, month + year],
      actualMonth: month,
      actualYear: year,};
      newState = {...newState, folkHolidaysThisWeek: getWeekHolidays(newState)}
      
      store.dispatch({type: "FETCH", payload: newState});
      })
}

function getWeekHolidays(state) {
  return state.week.map(day => {
      var holiday = state.folkHolidays.filter(a => a.date.format("MM.DD") === day.format("MM.DD"))
      return holiday ? holiday : [[]];
  });
}

function getCurrentWeek() {
  var startDay = "Sun";
  var week = Array(7).fill(null);
  var today = moment().format('ddd');
  week = week.map((e, i) => { return moment().add(i, 'days'); });
  while (today !== startDay) {
      week = week.map((e, i) => { return e.subtract(1, 'days'); })
      today = week[0].format('ddd');
  }
  return week;
}

function goToPrevWeek(state) {
  let newState = {...state};
  let prevWeek = newState.week.map((e, i) => { return e.subtract(7, 'days'); })
  setActualMonthAndYear({...state, week: prevWeek}, prevWeek, 0);
  return {...state, week: prevWeek, folkHolidaysThisWeek: getWeekHolidays(state)}
}

function goToNextWeek(state) {
  let newState = {...state};
  let nextWeek = newState.week.map((e, i) => { return e.add(7, 'days'); })
  setActualMonthAndYear({...state, week: nextWeek}, nextWeek, 6);
  return {...state, week: nextWeek, folkHolidaysThisWeek: getWeekHolidays(state)}
}

function setActualMonthAndYear(state, week = state.week, weekDay = 6) {
  var month = week[weekDay].format("MM");
  var year = week[weekDay].format("YYYY");
  if (state.requestedDates.findIndex(a => a === month + year) === -1) {
      requestDates(state, weekDay);
  }
}

function changeWeekStartDay(state, e) {
  let newWeek = [...state.week];
  let today = newWeek[0].format('ddd');

  while (today !== e.target.value) {
      newWeek = newWeek.map((e, i) => { return e.subtract(1, 'days'); })
      today = newWeek[0].format('ddd');
  }
  let newState = {...state, week: newWeek, startDay: e.target.value}
  setActualMonthAndYear(newState, newWeek, 0);
  return {...newState,  folkHolidaysThisWeek: getWeekHolidays(state)}
}

const initialState = {
  week: getCurrentWeek(),
  startDay: "Sun",
  folkHolidays: [],
  folkHolidaysThisWeek: [Array(7).fill('')],
  actualMonth: -1,
  actualYear: -1,
  requestedDates: []
}

function calendarReducer(state = initialState, action) {
  switch (action.type) {
    case 'NEXT_WEEK':
      return goToNextWeek(state);
    case 'PREV_WEEK':
      return goToPrevWeek(state);
    case 'CHANGE_START_DAY':
      return changeWeekStartDay(state, action.payload);
    case 'COMPONENT_MOUNT':
      setActualMonthAndYear(state);
      break;
    case 'FETCH':
      return {...state, 
        folkHolidays: action.payload.folkHolidays,
        folkHolidaysThisWeek: action.payload.folkHolidaysThisWeek,
        actualMonth: action.payload.actualMonth,
        actualYear: action.payload.actualYear,
        requestedDates: action.payload.requestedDates};
    default:
      return state
  }
  return state;
}

let store = createStore(calendarReducer);

store.subscribe(() => console.log(store.getState()))


render(
  <Provider store={store}>
    <CalendarControls />
  </Provider>,
  document.getElementById('root')
);

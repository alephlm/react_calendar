import React from 'react'
import { Day } from './day';
import './calendar.css'

export const Calendar = (props) => {
  var monthName = () => {
    if (props.week[0].format("MM.YYYY") === props.week[6].format("MM.YYYY")) {
      return props.week[0].format("MM.YYYY");
    } else {
      return `${props.week[0].format("MM.YYYY")} - ${props.week[6].format("MM.YYYY")}`;
    }
  }
  return (
    <div>
      {monthName()}
      <div className="calendar">
        {props.week.map((e, i) =>
          <Day date={props.week[i]}
            folkHoliday={props.folkHolidays[i]}
            calendarHoliday={props.calendarHolidays[i]}></Day>
        )}
      </div>
    </div>
  );
}
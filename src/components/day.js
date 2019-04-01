import React from 'react'
import './day.css';

export const Day = (props) => {
  return (
    <div className="day">
      <div className="date">
        <p>{props.date.format("ddd")}</p>
        <div className="week-day">
          <p>{props.date.format("DD")}</p>
        </div>
      </div>
      <div className="square">
        <div className="holiday-wrapper" title={props.folkHoliday}>
          <div className={(props.folkHoliday != "" ? 'folk-holiday' : '')}>
            {props.folkHoliday}
          </div>
        </div>
        <div title={props.calendarHoliday} className={(props.folkHoliday == "" ? 'holiday-wrapper calendar-holiday-wrapper' : 'holiday-wrapper')}>
          <div className={(props.calendarHoliday != "" ? 'calendar-holiday' : '')}>
            {props.calendarHoliday}
          </div>
        </div>
      </div>
    </div>
  );
}
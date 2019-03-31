import React from 'react'
import './day.css';

export const Day = (props) => {
      return (
        <div className="day">
          <div className="date">
            <p>{props.date.format("ddd DD")}</p>
          </div>
          <div className="square">
            <div className="folk-holiday">
              {props.folkHoliday}
            </div>
            <div className="calendar-holiday">
              {props.calendarHoliday}
            </div>
          </div>
        </div>
      );
  }
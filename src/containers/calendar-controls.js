
import React from 'react';
import { Calendar } from '../components/calendar';
import moment from 'moment';
import './calendar-controls.css';
import {connect} from 'react-redux'

export class CalendarControls extends React.Component {
    
  render(){
    return(
      <div className="wrapper">
        <Calendar
        week={this.props.state.week} 
        folkHolidays={this.props.state.folkHolidaysThisWeek.map(a => a.filter(b => b.type === '0').map(b => b.description))}
        calendarHolidays={this.props.state.folkHolidaysThisWeek.map(a => a.filter(b => b.type === '1').map(b => b.description))}
        ></Calendar>
        <div className="calendar-controls">
          <button onClick={() => this.props.goToPrevWeek()}>prev week</button>
          <button onClick={() => this.props.goToNextWeek()}>next week</button>
          <select onChange={(e) => this.props.changeWeekStartDay(e)}>
              <option value="Sun">Sun</option>
              <option value="Mon">Mon</option>
              <option value="Tue">Tue</option>
              <option value="Wed">Wed</option>
              <option value="Thu">Thu</option>
              <option value="Fri">Fri</option>
              <option value="Sat">Sat</option>
          </select>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      state
    }
  };

  const mapDispatchToProps = dispatch => {
    return {
      // dispatching plain actions
      goToNextWeek: () => dispatch({ type: 'NEXT_WEEK' }),
      goToPrevWeek: () => dispatch({ type: 'PREV_WEEK' }),
      changeWeekStartDay: (e) => dispatch({ type: 'CHANGE_START_DAY', payload: e })
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(CalendarControls);
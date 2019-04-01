
import React from 'react';
import { Calendar } from '../components/calendar';
import './calendar-controls.css';
import { connect } from 'react-redux'

export class CalendarControls extends React.Component {
  componentDidMount() {
    this.props.componentMount();
  }
  render() {
    return (
      <div className="wrapper">
        <Calendar
          week={this.props.state.week}
          folkHolidays={this.props.state.holidaysThisWeek.map(a => a.filter(b => b.type === '0').map(b => b.description))}
          calendarHolidays={this.props.state.holidaysThisWeek.map(a => a.filter(b => b.type === '1').map(b => b.description))}
        ></Calendar>
        <div className="calendar-controls">
          <button title="Previous Week" onClick={() => this.props.goToPrevWeek()}>{"<<"}</button>
          <select onChange={(e) => this.props.changeWeekStartDay(e)}>
            <option value="Sun">Sunday</option>
            <option value="Mon">Monday</option>
            <option value="Tue">Tuesday</option>
            <option value="Wed">Wednesday</option>
            <option value="Thu">Thusday</option>
            <option value="Fri">Friday</option>
            <option value="Sat">Saturday</option>
          </select>
          <button title="Next Week" onClick={() => this.props.goToNextWeek()}>{">>"}</button>
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
    goToNextWeek: () => dispatch({ type: 'NEXT_WEEK' }),
    goToPrevWeek: () => dispatch({ type: 'PREV_WEEK' }),
    componentMount: () => dispatch({ type: 'COMPONENT_MOUNT' }),
    changeWeekStartDay: (e) => dispatch({ type: 'CHANGE_START_DAY', payload: e })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarControls);
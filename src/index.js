import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';

class Day extends React.Component {
    render() {
      return (
        <div>
          <div className="date">
            <p>{this.props.date}</p>
          </div>
          <div className="square">
            <div className="folk-holiday">
              {this.props.folkHoliday}
            </div>
            <div className="calendar-holiday">
              {this.props.calendarHoliday}
            </div>
          </div>
        </div>
      );
    }
  }

  class Calendar extends React.Component {
    render(){
      return(
        <div className="calendar">
          <Day date={this.props.week[0].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[0]} calendarHoliday={this.props.calendarHolidays[0]}></Day>
          <Day date={this.props.week[1].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[1]} calendarHoliday={this.props.calendarHolidays[1]}></Day>
          <Day date={this.props.week[2].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[2]} calendarHoliday={this.props.calendarHolidays[2]}></Day>
          <Day date={this.props.week[3].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[3]} calendarHoliday={this.props.calendarHolidays[3]}></Day>
          <Day date={this.props.week[4].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[4]} calendarHoliday={this.props.calendarHolidays[4]}></Day>
          <Day date={this.props.week[5].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[5]} calendarHoliday={this.props.calendarHolidays[5]}></Day>
          <Day date={this.props.week[6].format("ddd DD.MM.YYYY")} folkHoliday={this.props.folkHolidays[6]} calendarHoliday={this.props.calendarHolidays[6]}></Day>
        </div>
      );
    }
  }

  class CalendarControls extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        week: this.getCurrentWeek(),
        startDay: "Sun",
        folkHolidays: [],
        folkHolidaysThisWeek: [[]],
        actualMonth: -1,
        actualYear: -1,
        requestedDates: []
      };
    }

    componentDidMount(){
      this.requestDates();
    }

    requestDates(weekDay = 0){
      var month = this.state.week[weekDay].format("MM");
      var year = this.state.week[weekDay].format("YYYY");
      fetch(`http://localhost/calendar-api/holidaysmonth?month=${month}&year=${year}`)
      .then(results => results.json())
      .then(data => {
        data = this.state.folkHolidays.concat(data.map(a => ({...a, date: moment(a.date)}))); //converts date from SQLstring to date
        this.setState({folkHolidays: data, requestedDates: [...this.state.requestedDates, month + year]})
        this.getWeekHolidays();
      })
    }

    getWeekHolidays(){
      var holidaysWeek = this.state.week.map(day => {
        var holiday = this.state.folkHolidays.filter(a => a.date.format("MM.DD") === day.format("MM.DD"))
        return holiday ? holiday : [[]];
      });
      this.setState({folkHolidaysThisWeek: holidaysWeek})
    }

    getCurrentWeek() {
      var startDay = "Sun";
      var week = Array(7).fill(null);
      var today = moment().format('ddd');
      week = week.map((e, i) => {return moment().add(i, 'days');});
      while(today !== startDay){
        week = week.map((e, i) => {return e.subtract(1, 'days');})
        today = week[0].format('ddd');
      }
      return week;
    }

    goToPrevWeek(){
      let newWeek = [...this.state.week];
      let prevWeek = newWeek.map((e, i) => {return e.subtract(7, 'days');})
      this.setState({week: prevWeek});
      this.setActualMonthAndYear(prevWeek, 0);
      this.getWeekHolidays();
    }

    goToNextWeek(){
      let newWeek = [...this.state.week];
      let nextWeek = newWeek.map((e, i) => {return e.add(7, 'days');})
      this.setState({week: nextWeek});
      this.setActualMonthAndYear(nextWeek, 6);
      this.getWeekHolidays();
    }

    setActualMonthAndYear(week, weekDay){
      var month = week[weekDay].format("MM");
      var year = week[weekDay].format("YYYY");
      if(this.state.requestedDates.findIndex(a => a === month + year) === -1){
        this.requestDates(weekDay);
      }
      this.setState({actualMonth: month, actualYear: year})
    }

    changeWeekStartDay(e){
      let newWeek = [...this.state.week];
      let today = newWeek[0].format('ddd');

      while(today !== e.target.value){
        newWeek = newWeek.map((e, i) => {return e.subtract(1, 'days');})
        today = newWeek[0].format('ddd');
      }
      this.setState({week: newWeek, startDay: e.target.value})
      this.setActualMonthAndYear(newWeek, 0);
      this.getWeekHolidays();
    }

    render(){
      return(
        <div className="wrapper">
          <Calendar
          week={this.state.week} 
          folkHolidays={this.state.folkHolidaysThisWeek.map(a => a.filter(b => b.type === '0').map(b => b.description))}
          calendarHolidays={this.state.folkHolidaysThisWeek.map(a => a.filter(b => b.type === '1').map(b => b.description))}
          ></Calendar>
          <div className="calendar-controls">
            <button onClick={() => this.goToPrevWeek()}>prev week</button>
            <button onClick={() => this.goToNextWeek()}>next week</button>
            <select onChange={(e) => this.changeWeekStartDay(e)}>
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
  
 
  // ========================================
  
  ReactDOM.render(
    <CalendarControls />,
    document.getElementById('root')
  );
  
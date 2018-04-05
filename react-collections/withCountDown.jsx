
import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';



function withCountdown(BaseComponent) {
  class WithCountdown extends Component {

    constructor(props){
        super(props)
        this.state = this.getTime()
    }

    componentDidMount(){
        this.interval = setInterval(this.onTick,1000)
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    getTime = () => {
        if(typeof window === 'undefined'){
            return {
                day : "--",hour : "--",minute : "--",second : "--",timeString : "---------",
            }
        }
        

        var now = new Date().getTime();
        var time = typeof this.props.time == "string"
            ? Date.parse(this.props.time)
            : this.props.time
        var timeString= (new Date(time)).toString()

        var distance = time - now;
    
        var day = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var second = Math.floor((distance % (1000 * 60)) / 1000);

        if(day < 10) day = '0' + day;
        if(hour < 10) hour = '0' + hour;
        if(minute < 10) minute = '0' + minute;
        if(second < 10) second = '0' + second;

        
        return {day,hour,minute,second,timeString}
    }

    onTick = () => {


        this.setState({...this.getTime()})
    }

    render() {
      return (
        <BaseComponent {...this.props} {...this.state}/>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    WithCountdown.displayName = wrapDisplayName(BaseComponent, 'withCountdown');
  }

  return WithCountdown;
}

export default withCountdown;

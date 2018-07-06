import React, {Component} from 'react';
import Bricks from './Bricks';
import Pad from './Pad';


class Ball extends React.Component {
    static initialState = () => {
        var randomVx = Ball.granularity * Math.random();
        var randomVy = Math.sqrt(Ball.granularity * Ball.granularity - randomVx * randomVx);
        return {
            y: Math.random() * (Pad.padLevel - Bricks.bottomRowHeight() - 3 * Ball.ballDiameter) + 
                Bricks.bottomRowHeight(),
            x: Math.random() * (100 - Ball.ballDiameter),
            vx: randomVx,
            vy: randomVy,
            deadCount: 0
        };
    }
    
    constructor(props) {
        super(props);
        if (this.props.newGame) {
            this.state = Ball.initialState();
        }        
    }

    killBall = () => {
        switch (this.props.deathOption) {

        }
    }

    moveOneUnit = () => {
        if (this.state.deadCount <= 0) {
            this.setState({
                deadCount: this.props.checkFloorImpact() ? Ball.deadTimeout : 0
            });
        }
        this.setState((prevState, props) => {
            var xMultiplier = props.xMultiplier();
            var yMultiplier = props.yMultiplier();
            var horizontalReflector = (prevState.x <= 0 && prevState.vx < 0 ? -1 : 1) * 
                (prevState.x >= 100 - Ball.ballDiameter && prevState.vx > 0 ? -1 : 1);
            var verticalReflector = (prevState.y <= 0 && prevState.vy < 0 ? -1 : 1) * 
                (prevState.y >= 100 - 3 * Ball.ballDiameter && prevState.vy > 0 ? -1 : 1);
            return ({
                x: prevState.x + prevState.vx * xMultiplier,
                y: prevState.y + prevState.vy * yMultiplier,
                vx: horizontalReflector * xMultiplier * prevState.vx,
                vy: verticalReflector * yMultiplier * prevState.vy
            })
        });
    }

    // Various incarnations of this lifecylce method induced stack-overload type crashes
    // /* This doesn't work--not sure why */
    // componentWillReceiveProps() {
    //     if (this.props.refresh) {
    //         this.setState(Ball.initialState());
    //     }
    //     //this.props.refreshed();
    // }

    getProperSpeed() {
        var ans = this.state.deadCount > 0 ? Ball.deadSpeed : Ball.speed * this.props.speedMultiplier;
        //var ans = Ball.speed;
        this.props.displayMessage('deadCount = ' + this.state.deadCount + '; speed = ' + ans + '; multiplier = ' + this.props.speedMultiplier);
        return ans;
    }

    componentDidUpdate() {
        if (this.props.refresh) {
            this.setState(Ball.initialState());
            this.props.refreshed();
        }
        //this.props.refreshed();
            // Including this line here caused a stack-overload crash
    }

    maintainBallMotion() {
        setTimeout(
            () => {
                if (!this.props.paused) {
                    this.setState(prevState => ({
                        deadCount: prevState.deadCount - 1
                    }));
                    this.moveOneUnit();
                }
                this.maintainBallMotion();
            },
            1/(this.getProperSpeed())
        );
    }

    componentDidMount() {
        this.maintainBallMotion();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        this.props.displayMessage(' ');
    }

    render() {
        const ballStyle = {
            top: this.state.y + '%',
            left: this.state.x + '%',
            width: (Ball.ballDiameter/3) + '%',
            padding: (Ball.ballDiameter/3) + '%',
            borderRadius: '50%',
            borderColor: '#' + (this.state.deadCount > 0 ? Ball.deadDisplayColor : Ball.liveDisplayColors[this.props.displayStyle]),
            backgroundColor: '#' + (this.state.deadCount > 0 ? Ball.deadDisplayColor : Ball.liveDisplayColors[this.props.displayStyle])
        }
        return (
            <div    className="ball"
                    style={ballStyle}>
            </div>
        )
    }
}

Ball.liveDisplayColors = [
    '000000',
    'ffffff'
]

Ball.deadTimeout = 25;
Ball.deadDisplayColor = 'ff0000';
Ball.ballDiameter = 1.5;
Ball.speed = 1;
Ball.deadSpeed = .1;
Ball.granularity = .5;
Ball.maxSpeed = 5;
Ball.attenuationFactor = 15;

Ball.deathOptions = {
    PAUSE: 0,
    CONTINUE: 1
}

export default Ball;
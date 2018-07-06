import React, {Component} from 'react';

class Pad extends React.Component {
    static initialPosition = () => ({
        x: Pad.initialPos,
        y: Pad.padLevel,
        v: 0
    });
    
    constructor(props) {
        super(props);
        this.state = Pad.initialPosition();
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleKeyDown = (event) => {
        switch(event.keyCode) {
            case Pad.keyCodes.left:
                this.setState({
                    v: -1
                });
                break;
            case Pad.keyCodes.right:
                this.setState({
                    v: 1
                });
                break;
            default:
                break;
        }
    }

    handleKeyUp = (event) => {
        switch(event.keyCode) {
            case Pad.keyCodes.left: 
                this.setState({
                    v: 0
                });
                break;
            case Pad.keyCodes.right:
                this.setState({
                    v: 0
                });
            default:
                break;
        }
    }

    move = () => {
        if (this.state.v != 0) {
            this.setState((prevState, props) => ({
                x: props.paused ? prevState.x : 
                    (prevState.x + prevState.v > 100 - Pad.padWidth || prevState.x + prevState.v < 0 ? prevState.x : 
                    prevState.x + prevState.v)
            }));
        }
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleKeyDown, false);
        document.addEventListener('keyup', this.handleKeyUp, false);
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.move(),
            10
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        let padStyle = {
            top: this.state.y + '%',
            left: this.state.x + '%',
            width: Pad.padWidth + '%',
            height: Pad.padHeight + '%',
            backgroundColor: '#' + Pad.displayColors[this.props.displayStyle]
        }
        return (
            <div    className='pad'
                    style={padStyle}>
            </div>
        )
    }
}

Pad.keyCodes = {
    left: 37,               // Left arrow key code
    right: 39               // Right arrow key code
}

Pad.padWidth = 8;
Pad.padHeight = 1;
Pad.padLevel = 90;
Pad.initialPos = 47.5;
Pad.displayColors = [
    '000000',
    'ffffff'
]

export default Pad;

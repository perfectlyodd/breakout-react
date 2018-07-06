import React, {Component} from 'react';
import './App.css';


class Brick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            y: this.props.topPos,
            x: this.props.leftPos
        };
    }

    brickStyle = () => ({
        top: this.state.y + '%',
        left: this.state.x + '%',
        width: Brick.brickWidth + '%',
        height: Brick.brickHeight + '%',
        backgroundColor: this.props.color,
        visibility: this.props.visibility > 0 ? 'visible' : 'hidden',
        opacity: this.props.visibility > 0 ? (this.props.visibility === 1 ? 1 : (this.props.visibility / this.props.maxOpacity)) : 0,
        zIndex: this.props.zIndex
        //opacity: 1
    })

    render() {
        return (
            <div    className="brick"
                    style={this.brickStyle()}>           
            </div>
        );
    }
}

Brick.brickWidth = 8;
Brick.brickHeight = 4;
Brick.border = 1;
    // Used to determine gap between bricks

export default Brick;
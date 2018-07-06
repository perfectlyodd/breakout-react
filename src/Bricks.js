import React, {Component} from 'react';
import _ from 'lodash';
import Brick from './Brick';


class Bricks extends React.Component {
    static bottomRowHeight = () => (Bricks.rows.length * Brick.brickHeight + 
        (Bricks.rows.length - 1) * (2 * Brick.border) + Bricks.topmostPos);
    
    static initialUsedArray = () => {
        var arr = [];
        var row = Bricks.cols.slice(0).fill(1, 0, Bricks.cols.length);
            // Note: calling slice(0) creates a clone of the original array--necessary because we don't
            // want to modify the original
        Bricks.rows.forEach((row) => {
            arr.push(row);
        });
        return arr;
    }
    
    constructor(props) {
        super(props);
        this.state = {
            used: Bricks.initialUsedArray()
        }
        this.props.displayMessage(this.state.used.length);
            // For debugging
    }

    static maxBrickOpacity(row, col) {
        return 2 * (Bricks.rows.length - row) - 1;
    }

    render() {
        return (
            <div>  
                {this.props.children}
            </div>
        );
    }
}

Bricks.rows = _.range(0,4);
Bricks.cols = _.range(0,10);

/* The following two properties should become calculated functions at some point */
Bricks.leftmostPos = 5.5;
Bricks.topmostPos = 15;

Bricks.rowStyle = {
    display: 'inline'
};
Bricks.colStyle = {
    display: 'block'
};

Bricks.colors = [
    '3399ff',
    'ff0066',
    'ff9900',
    '66ff99',
    '9900ff'
];

export default Bricks;


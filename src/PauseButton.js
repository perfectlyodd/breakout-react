import React from 'react';

const PauseButton = (props) => {
    var pauseStyle = {
        color: '#' + PauseButton.textColors[props.displayStyle]
    }
    return (
        <button     onClick={props.onClick}
                    style={pauseStyle} >
            {props.paused ? 'Resume' : 'Pause'}
        </button>
    )
}

PauseButton.textColors = [
    '000000',
    '000000'
]

export default PauseButton;
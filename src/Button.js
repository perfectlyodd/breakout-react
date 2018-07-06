import React from 'react';

const Button = (props) => {
    var buttonStyle = {
        color: '#' + Button.textColors[props.displayOption[props.displayStyle]]
    }
    return (
        <button     onClick={props.onClick}
                    style={buttonStyle} >
            {props.message}
        </button>
    )
}

Button.textColors = [
    ['000000',
    '000000'],
    ['000000',
    '000000']
]

Button.displayOptions = {
    INGAME: 0,
    INPANEL: 1
}

export default Button;
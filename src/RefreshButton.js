import React from 'react';

const RefreshButton = (props) => {
    var refreshStyle = {
        color: '#' + RefreshButton.textColors[props.displayStyle]
    }
    return (
        <button     onClick={props.onClick}
                    style={refreshStyle} >
            Refresh
        </button>
    )
}

RefreshButton.textColors = [
    '000000',
    '000000'
]

export default RefreshButton;
import React from "react";


class Header extends React.Component{

    render(){
        return (
            <div style={header}>
                <h1>Draughts</h1>
            </div>
        );
    }
}

export default Header;

const header = {
    background: '#3b3b3b',
    color: '#ffffff',
    fontSize: '24px',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
}
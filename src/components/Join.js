import React from "react";
import '../stylesheets/CreateOrJoin.css'
import {Link} from "react-router-dom";

class Join extends React.Component{

    state = {
        username: "",
        serverID: ""
    }

    usernameChange = (event) => {
        this.setState({username: event.target.value});


    }

    serverChange = (event) => {
        this.setState({serverID: event.target.value});

    }

    setJoinInfo = () => {
        this.props.setServerID.call(this, this.state.serverID);
        this.props.setUsername.call(this, this.state.username);
    }


    render() {
        return (
            <div className="center">
                <input className='stack' type="text" onChange={this.usernameChange}/>
                <input className='stack' type="text" onChange={this.serverChange}/>
                <Link className='join' to="/gameInstance" onClick={this.setJoinInfo}>Join</Link>
            </div>
        );
    }

}

export default Join;
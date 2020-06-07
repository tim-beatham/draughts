import React from "react";
import '../stylesheets/CreateOrJoin.css'
import {Link} from "react-router-dom";
import socketIOClient from "socket.io-client";

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

    setJoinInfo = (e) => {
        if (this.state.serverID.trim() !== "" && this.state.username.trim() !== ""){
            this.props.setServerID.call(this, this.state.serverID);
            this.props.setUsername.call(this, this.state.username);
        } else {
            e.preventDefault();
        }
    }


    render() {
        return (
            <div className="center">
                <p>Enter a username: </p>
                <input className='stack' type="text" onChange={this.usernameChange}/>
                <p>Enter a Server ID: </p>
                <input className='stack' type="text" onChange={this.serverChange}/>
                <br/>
                <Link className='join' to="/check" onClick={this.setJoinInfo}>Join</Link>
            </div>
        );
    }

}

export default Join;
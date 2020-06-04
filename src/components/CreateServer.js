import {useEffect} from "react";
import React from "react";
import "../stylesheets/CreateOrJoin.css";
import {Link} from "react-router-dom";
import socketIOClient from "socket.io-client"


const ENDPOINT = "http://localhost:4000";

class CreateServer extends React.Component {

    state = {
        username: ""
    }

    usernameChange = (event) => {
        this.setState({username: event.target.value});
    };

    render() {
        return (
            <div className="center" >
                <input type="text" id="server-box" onChange={this.usernameChange}/>
                <Link to="/gameInstance" onClick={this.props.setUsername.bind(this, this.state.username)}
                      className="create-server">Create Server</Link>
            </div>
        );
    }
}

export default CreateServer;
import {useEffect} from "react";
import React from "react";
import "../stylesheets/CreateOrJoin.css";
import {Link} from "react-router-dom";
import socketIOClient from "socket.io-client"


class CreateServer extends React.Component {

    state = {
        username: ""
    }

    usernameChange = (event) => {
        this.setState({username: event.target.value});
    };

    setJoinInfo = () => {
        this.props.setUsername.call(this, this.state.username);
        this.props.setServer.call(this, "");
    };

    render() {
        return (
            <div className="center" >
                Enter your username: <br/>
                <br />
                <input type="text" className="stack" id="server-box" onChange={this.usernameChange}/>
                <br/>
                <Link to="/check" className="stack" onClick={this.setJoinInfo}
                      className="create-server">Create Server</Link>
            </div>
        );
    }
}

export default CreateServer;
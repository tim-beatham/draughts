import React from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4000"

class GameInstance extends React.Component {

    state = {
        users: [],
        serverID: ""
    }

    componentDidMount() {
        this.socket = socketIOClient(ENDPOINT);

        if (this.props.server === ""){
            // Then we are creating a server
            this.socket.emit("create-server", this.props.username);
            this.socket.on("server-created", (serverID) => {
                this.setState({serverID: serverID});
            })

        } else {
            // We are joining a server.

            this.socket.emit("join-server", {server: this.props.server, username: this.props.username});
        }

        this.socket.on("user-changed", (users) => {
           this.setState({users: users});
        });


    }

    componentWillUnmount() {
        this.socket.emit("user-disconnecting", this.props.username);

    }

    render() {
        return (
            <div>
                <p>{this.state.serverID}</p>
                <p>{this.state.users.toString()}</p>
            </div>
        );
    }
}

export default GameInstance;
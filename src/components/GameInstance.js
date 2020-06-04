import React from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4000"

class GameInstance extends React.Component {

    state = {
        users: [],
    }

    componentDidMount() {
        console.log(this.props.username);
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit("client-username", this.props.username)

        this.socket.on("update-users", (users) => {
            this.setState({users: users});
        })
    }

    componentWillUnmount() {
        this.socket.emit("user-disconnecting", this.props.username);

        this.setState({users: []});

        this.socket.disconnect();
    }

    render() {
        return (
            <p>{this.state.users.join("\n")}</p>
        );
    }
}

export default GameInstance;
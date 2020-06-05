import React from "react";
import socketIOClient from "socket.io-client";
import "../stylesheets/CreateOrJoin.css"
import Board from "./Board";

const ENDPOINT = "http://86.134.79.199:4000"

class GameInstance extends React.Component {

    state = {
        users: [],
        serverID: "",
        message: "",
        messages: ""
    }

    componentDidMount() {
        this.socket = socketIOClient(ENDPOINT);

        // Listen for the user closing the browser,
        window.addEventListener("beforeunload", (ev) => {
            this.disconnect();
        });

        this.socket.username = this.props.username;

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

        // Listen for the user sending a message.
        this.socket.on("update-messages", (newMsg) => {
           this.setState({messages: this.state.messages + "\n " + newMsg});
           console.log("hello");
        });

        this.socket.on("user-changed", (users) => {
           this.setState({users: users});
        });

    }

    disconnect = () => {
        this.socket.emit("user-disconnecting", this.props.username);
        this.socket.disconnect();
    }

    componentWillUnmount() {
        this.disconnect();
    }

    onMessageChange = (e) => {
        this.setState({message: e.target.value});
    }

    submitChat = (e) => {
        e.preventDefault();
        // Send a message to all clients on the socket.
        if (this.state.message.trim() !== "") {
            this.socket.emit("message-sent", {username: this.props.username, message: this.state.message})
        }
    }

    render() {
        return (
            <div>
                <div id="chatDiv">
                    <textarea id="chatArea" value={this.state.messages} readOnly/>
                    <form onSubmit={this.submitChat}>
                        <input id="chatForm" type="text" onChange={this.onMessageChange}/>
                        <input type="submit" id="chatSubmit" value="Enter"/>
                    </form>
                </div>
                <div>
                    <p>{this.state.serverID}</p>
                    <p>Users: {this.state.users.join(", ")}</p>
                    <Board />
                </div>
            </div>


        );
    }
}

export default GameInstance;
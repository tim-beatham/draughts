import React from "react";
import socketIOClient from "socket.io-client";
import "../stylesheets/CreateOrJoin.css"
import Board from "./Board";
import {Redirect} from 'react-router-dom';

const ENDPOINT = "http://localhost:4000"

class GameInstance extends React.Component {

    constructor() {
        super();
        // Need a reference to the message box so I can delete the text in it.
        this.msgBoxRef = React.createRef();
        this.socket = socketIOClient(ENDPOINT);
    }

    state = {
        users: [],
        serverID: "",
        message: "",
        messages: "",
        noServer: false,
        userExists: false,
        team1: true,
        turnMsg: "Waiting for the other player to join.",
        wonMsg: "",
        connectionRefused: false
    }

    changeTurnMsg = (team) => {
        if (team) {
            this.setState({turnMsg: this.state.users[0] + "'s turn"});
        } else {
            this.setState({turnMsg: this.state.users[1] + "'s turn"});
        }
    }

    hideTurnMsg = () => {
        this.setState({turnMsg: ""})
    }

    setWonMsg = (team) => {
        if (team) {
            this.setState({wonMsg: this.state.users[0] + " has won!"})
        } else {
            this.setState({wonMsg: this.state.users[1] + " has won!"})
        }
    }

    componentDidMount() {
        this.setState({connectionRefused: false})
        // Listen for the user closing the browser,
        window.addEventListener("beforeunload", (ev) => {
            this.disconnect();
        });

        this.socket.username = this.props.username;

        this.socket.on('user-exists-error', () => {
            this.setState({userExists: true});
        })

        this.socket.on('no-server-error', () => {
            this.setState({noServer: true});
        });

        if (this.props.server === ""){
            // Then we are creating a server
            this.socket.emit("create-server", this.props.username);
            this.socket.on("server-created", (serverID) => {
                this.setState({serverID: serverID});
            });
            this.setState({team1: true});

        } else {
            // We are joining a server.
            this.socket.emit("join-server", {server: this.props.server, username: this.props.username});
            this.setState({team1: false});
        }

        // Listen for the user sending a message.
        this.socket.on("update-messages", (newMsg) => {
           this.setState({messages: this.state.messages + "\n " + newMsg});
           console.log("hello");
        });

        this.socket.on("user-changed", (users) => {
           this.setState({users: users});
        });

        this.socket.on("start", () => {
            this.changeTurnMsg(this.state.users[0] + "'s turn");
        });

        this.socket.on("disconnect", () => {
            this.setState({connectionRefused: true})
        })

        this.socket.on("user-disconnected", () => {
            this.disconnect()
            this.setState({connectionRefused: true})
        })
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
        this.msgBoxRef.current.value = "";
        this.state.message = "";
    }

    redirectToRoot = () => {
        if (this.props.username === ""){
            return <Redirect to='/' />
        }

        if (this.state.connectionRefused) {
            return <Redirect to='/' />
        }
    }

    render() {
        return (
            <div>
                <div id="chatDiv">
                    {this.redirectToRoot()}
                    <textarea id="chatArea" value={this.state.messages} readOnly/>
                    <form onSubmit={this.submitChat}>
                        <input id="chatForm" ref={this.msgBoxRef} type="text" onChange={this.onMessageChange}/>
                        <input type="submit" id="chatSubmit" value="Enter"/>
                    </form>
                </div>
                <div>
                    <p>{this.state.serverID}</p>
                    <p>Users: {this.state.users.join(", ")}</p>
                    <p>{this.state.turnMsg}</p>
                    <p>{this.state.wonMsg}</p>
                    <Board socket={this.socket} user={this.props.username} team={this.state.team1}
                    setTurnMsg={this.changeTurnMsg} setWonMsg={this.setWonMsg} hideTurnMsg={this.hideTurnMsg}/>
                </div>
            </div>
        );
    }
}

export default GameInstance;
# Draughts

I created this program during lockdown. I used it to learn JavaScript. I created the draughts game using the React.JS framework and the Socket.io framework.

## The Game

![the game](https://github.com/tim-beatham/draughts/blob/master/images/game.png)

Each game instance allows two users to play against each other and communicate one another. If more users try to connect to the game the user connecting gets a prompt saying that the server is full.

The game is run on one remote server. Via sockets more than one game instance can take place at the same time.

## The Main Menu

![the main menu](https://github.com/tim-beatham/draughts/blob/master/images/main_menu.png)

The main menu prompts the user to either create a game or join a game.

## Creating A Game

![creating a game](https://github.com/tim-beatham/draughts/blob/master/images/create_server.png)

When creating a game the user simply enters their username.

## Joining A Game

![joining a game](https://github.com/tim-beatham/draughts/blob/master/images/join_game.png)

To join a game the user simply needs to enter a username which is not already taken and the serverID of the host's server.



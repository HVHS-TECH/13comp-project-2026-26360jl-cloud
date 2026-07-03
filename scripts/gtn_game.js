/****************************************************************************************************************/
// gtn_game.js
// Written by Joseph L
// 
// Handles gameplay for Guess The Number
// Joins lobby
// Reads game information and sends guesses
// Swaps between the GUI for queuing and playing games
// gtn_game.js and gtn_queue.js can use global variables from eachother and share functions
/****************************************************************************************************************/
var userInGame = false;
let gameInfo = {
    lobbyId: 0,
    currentPlayersTurn: 0,
    playerTurnId: 0,
    opponentInfo: {
        uid: "",
        name: "",
        photoUrl: ""
    },
    correctNumber: 0
}

/*************************************************************************************
 * joinLobby(lobbyId)
 * 
 * lobbyId: a unique id in the firebase database that stores all the information about a specific game
 * 
 *************************************************************************************/
async function joinLobby(lobbyId)
{
    const LOBBY_INFO = await firebaseSnapshot("liveGames/" + lobbyId);

    gameInfo.lobbyId = lobbyId;
    gameInfo.correctNumber = LOBBY_INFO.correctNumber;
    gameInfo.currentPlayersTurn = 0;

    var opponentUid;
    if (getUserInfo().uid == LOBBY_INFO.player1)
    {
        gameInfo.playerTurnId = 0
        opponentUid = LOBBY_INFO.player2
    }
    else
    {
        gameInfo.playerTurnId = 1
        opponentUid = LOBBY_INFO.player1
    }

    gameInfo.opponentInfo = await getUserInfoFromUID(opponentUid);

    firebaseRef("liveGames/" + lobbyId).on('value', readGameData);
    firebaseRef("liveGames/" + lobbyId).onDisconnect().remove()
    setupUI();
    userInGame = true;
}

/*************************************************************************************
 * setupUI()
 * 
 * displays the Game GUI and hides the buttons for queueing
 * 
 *************************************************************************************/
function setupUI()
{
    document.getElementById("game").style.display = "";
    document.getElementById("queue").style.display = "none";
    document.getElementById("opponent").src = gameInfo.opponentInfo.photoUrl
    document.getElementById("vsTag").innerHTML = getUserInfo().name + " (you) vs " + gameInfo.opponentInfo.name
    //document.getElementById("gameStatus").style.display = "";
    document.getElementById("postGameButton").style.display = "none"
}

/*************************************************************************************
 * readGameData(snapshot)
 * 
 * Called everytime the lobby data is changed. Like when the players turn changes
 * Displays game status to user
 * Determines when the game is finished
 * Recognises if the opponenent has left and counts it as you winning
 * 
 *************************************************************************************/
function readGameData(snapshot)
{
    //hopefully this never happens because I am an awesome programmer :)
    if (userInGame && userInQueue)
    {
        error("SOMETHING WRONG HAS HAPPENED")
        return
    }

    const GAME_DATA = snapshot.val()

    if (GAME_DATA == null)
    {
        if (userInGame)
        {
            document.getElementById("gameStatus").innerHTML = gameInfo.opponentInfo.name + " has quit the game, " + getUserInfo().name + " wins by default";

            leaderboardIncrementStat(getUserInfo().uid, "gtnWins")
            leaderboardIncrementStat(gameInfo.opponentInfo.uid, "gtnLosses")

            afterGameFinish()
        }
        return
    }

    document.getElementById("gameStatus").innerHTML = GAME_DATA.gameStatus

    if (GAME_DATA.playersTurn == -1)
    {
        afterGameFinish()
        return
    }

    gameInfo.playersTurn = GAME_DATA.playersTurn
    
    if (gameInfo.playersTurn == gameInfo.playerTurnId)
    {
        document.getElementById("turnTracker").innerHTML = "it is your turn"
    }
    else
    {
        document.getElementById("turnTracker").innerHTML = "it is not your turn"
    }
}

/*************************************************************************************
 * sendTurn()
 * 
 * Function called by enter guess button
 * When its the players turn, checks they're input to see if they guessed the correct number
 * If they're guess is higher or lower send information to the firebase and update the game status
 * Ends turn
 * 
 *************************************************************************************/
function sendTurn()
{
    if (gameInfo.playersTurn == gameInfo.playerTurnId)
    {
        const GUESS = document.getElementById("guessInput").value

        if (GUESS >= 0 && GUESS <= 100 && GUESS.length > 0)
        {
            console.log("guess is valid")
        }
        else
        {
            alert("please enter a valid guess between 0 and 100")
            return;
        }

        if (GUESS == gameInfo.correctNumber)
        {
            setGameStatus(getUserInfo().name + " guessed " + GUESS + ", correct! " + getUserInfo().name + " wins")
            
            leaderboardIncrementStat(getUserInfo().uid, "gtnWins")
            leaderboardIncrementStat(gameInfo.opponentInfo.uid, "gtnLosses")

            //firebaseWrite("/liveGames/" + gameInfo.lobbyId + "/playersTurn", -1);
            firebase.database().ref("/liveGames/" + gameInfo.lobbyId + "/playersTurn").set(-1);
            return
        }
        if (GUESS < gameInfo.correctNumber)
        {
            setGameStatus(getUserInfo().name + " guessed " + GUESS + ", too low")
        }
        if (GUESS > gameInfo.correctNumber)
        {
            setGameStatus(getUserInfo().name + " guessed " + GUESS + ", too high")
        }

        //firebaseWrite("/liveGames/" + gameInfo.lobbyId + "/playersTurn", 1 - gameInfo.playerTurnId);
        firebase.database().ref("/liveGames/" + gameInfo.lobbyId + "/playersTurn").set(1 - gameInfo.playerTurnId);
    }
}

/*************************************************************************************
 * setGameStatus()
 * 
 * Wrapper function
 * The game status 
 * 
 *************************************************************************************/
function setGameStatus(message)
{
    //firebaseWrite("/liveGames/" + gameInfo.lobbyId + "/gameStatus", message);
    firebase.database().ref("/liveGames/" + gameInfo.lobbyId + "/gameStatus").set(message);
}

function afterGameFinish()
{
    userInGame = false
    document.getElementById("turnTracker").style.display = "none"
    document.getElementById("guessInput").style.display = "none"
    document.getElementById("guessButton").style.display = "none"
    document.getElementById("opponent").src = ""
    document.getElementById("vsTag").innerHTML = "vs"
    document.getElementById("postGameButton").style.display = ""
}
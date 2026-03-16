var userInGame = false

gameInfo = {
    lobbyId: 0,
    playerTurnId: 1,
    opponentInfo: {
        uid: "",
        name: "",
        photoUrl: ""
    },
    correctNumber: 0,
    playersTurn: 0
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("game").style.display = "none";
});

function startGame(lobbyId, _player1, _player2)
{
    gameInfo.playerTurnId = 0
    var ref = firebase.database().ref("liveGames/" + lobbyId);

    const RANDOM_NUMBER = Math.floor(Math.random() * 100);

    ref.set(
        {
            correctNumber: RANDOM_NUMBER,
            playersTurn: 0,
            player1: _player1,
            player2: _player2,
            gameStatus: ""
        }
    );

    ref.onDisconnect().remove()

    initGame(lobbyId)
}

async function initGame(lobbyId)
{
    gameInfo.lobbyId = lobbyId;
    waitForLobbyInit()
}

async function waitForLobbyInit()
{
    var lobbyInitialized = false
    await firebase.database().ref('/liveGames/' + gameInfo.lobbyId).once('value', _waitForLobbyInit);

    function _waitForLobbyInit(snapshot)
    {
        //does the lobby exist yet?
        if (snapshot.val() == null)
        {
            waitForLobbyInit()
            return
        }
        else lobbyInitialized = true
    }

    if (lobbyInitialized) afterLobbyInit()
}

function afterLobbyInit()
{
    userInGame = true
    if (gameInfo.playerTurnId == 1)
    {
        var ref = firebase.database().ref("liveGames/" + gameInfo.lobbyId);
        ref.onDisconnect().remove()
    }
    
    initGameInfo()
    firebase.database().ref('/liveGames/' + gameInfo.lobbyId).on('value', readGameData);
}

async function initGameInfo()
{
    await firebase.database().ref('/liveGames/' + gameInfo.lobbyId).once('value', _initGameInfo);

    var opponentUID

    function _initGameInfo(snapshot)
    {
        const LOBBY_DATA = snapshot.val()

        if (LOBBY_DATA == null)
        {
            console.log("something very wrong has happened")
            return
        }

        gameInfo.correctNumber = LOBBY_DATA.correctNumber
        if (gameInfo.playerTurnId == 0)
            opponentUID = LOBBY_DATA.player2;
        else if (gameInfo.playerTurnId == 1)
            opponentUID = LOBBY_DATA.player1;
    }
    
    const OPPONENT_INFO = await getUserInfoFromUID(OPPONENT_INFO)
    gameInfo.opponentInfo = opponentInfo

    setupUI()
}

function setupUI()
{
    document.getElementById("game").style.display = "";
    document.getElementById("queue").style.display = "none";
    document.getElementById("opponent").src = gameInfo.opponentInfo.photoUrl
    document.getElementById("vsTag").innerHTML = getUserInfo().name + " (you) vs " + gameInfo.opponentInfo.name
}

function readGameData(snapshot)
{
    const GAME_DATA = snapshot.val()
    if (GAME_DATA == null)
    {
        console.log("Game is finished")
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

    document.getElementById("gameStatus").innerHTML = GAME_DATA.gameStatus
}

function sendTurn()
{
    if (gameInfo.playersTurn == gameInfo.playerTurnId)
    {
        const GUESS = document.getElementById("guessInput").value

        if (GUESS == gameInfo.correctNumber)
        {
            setGameStatus(getUserInfo().name + " guessed " + GUESS + ", correct! " + getUserInfo().name + " wins")
        }
        if (GUESS < gameInfo.correctNumber)
        {
            setGameStatus(getUserInfo().name + " guessed " + GUESS + ", too low")
        }
        if (GUESS > gameInfo.correctNumber)
        {
            setGameStatus(getUserInfo().name + " guessed " + GUESS + ", too high")
        }

        firebase.database().ref("/liveGames/" + gameInfo.lobbyId + "/playersTurn").set(1 - gameInfo.playerTurnId);
    }
}

function setGameStatus(message)
{
    firebase.database().ref("/liveGames/" + gameInfo.lobbyId + "/gameStatus").set(message);
}
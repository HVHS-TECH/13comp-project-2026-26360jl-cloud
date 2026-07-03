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

function setupUI()
{
    document.getElementById("game").style.display = "";
    document.getElementById("queue").style.display = "none";
    document.getElementById("opponent").src = gameInfo.opponentInfo.photoUrl
    document.getElementById("vsTag").innerHTML = getUserInfo().name + " (you) vs " + gameInfo.opponentInfo.name
    //document.getElementById("gameStatus").style.display = "";
    document.getElementById("postGameButton").style.display = "none"
}

function readGameData(snapshot)
{
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
            console.log(userInGame)
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

function sendTurn()
{
    if (gameInfo.playersTurn == gameInfo.playerTurnId)
    {
        const GUESS = document.getElementById("guessInput").value

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
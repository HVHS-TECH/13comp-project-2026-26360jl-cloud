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

    const randomNumber = Math.floor(Math.random() * 100);

    ref.set(
        {
            correctNumber: randomNumber,
            playersTurn: 0,
            player1: _player1,
            player2: _player2
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
    console.log(gameInfo.playerTurnId)
    if (gameInfo.playerTurnId == 1)
    {
        var ref = firebase.database().ref("liveGames/" + gameInfo.lobbyId);
        ref.onDisconnect().remove()
    }
    
    setupUI()
}

function sendTurn()
{
    const guess = document.getElementById("guessInput").value
    console.log(guess)
}

async function setupUI()
{
    document.getElementById("game").style.display = "";
    document.getElementById("queue").style.display = "none";
    await firebase.database().ref('/liveGames/' + gameInfo.lobbyId).once('value', _getPlayerIds);

    var opponentUID

    function _getPlayerIds(snapshot)
    {
        if (gameInfo.playerTurnId == 0)
            opponentUID = snapshot.val().player2;
        else if (gameInfo.playerTurnId == 1)
            opponentUID = snapshot.val().player1;
    }
    
    const opponentInfo = await getUserInfoFromUID(opponentUID)

    gameInfo.opponentInfo = opponentInfo

    document.getElementById("opponent").src = opponentInfo.photoUrl
    document.getElementById("vsTag").innerHTML = getUserInfo().name + " (you) vs " + opponentInfo.name
}
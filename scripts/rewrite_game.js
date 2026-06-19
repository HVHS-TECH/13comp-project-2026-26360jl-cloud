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
    if (userInfo.uid == LOBBY_INFO.player1)
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

    setupUI();
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
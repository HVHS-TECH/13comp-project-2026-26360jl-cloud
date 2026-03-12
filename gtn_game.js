var userInGame = false
var playerTurnID = 1 //since startGame() is only ran on only one client, we can assume if its not run you're the second player
let sdfghjikjoihghdsajkdfj

gameInfo = {

}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("game").style.display = "none";
});

function startGame(lobbyId, _player1, _player2)
{
    playerTurnID = 0
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
    sdfghjikjoihghdsajkdfj = lobbyId

    waitForLobbyInit()
    
    async function waitForLobbyInit()
    {
        temp = false
        firebase.database().ref('/liveGames/' + sdfghjikjoihghdsajkdfj).once('value', _waitForLobbyInit);
        function _waitForLobbyInit(snapshot)
        {
            if (snapshot.val() == null) {
                waitForLobbyInit()
                temp = true
                return
            }
        }
        if (temp)
            return

        afterLobbyInit()
    }
}

function afterLobbyInit()
{
    console.log("after lobby init is called")
    userInGame = true
    var ref = firebase.database().ref("liveGames/" + sdfghjikjoihghdsajkdfj);
    ref.onDisconnect().remove()
    document.getElementById("game").style.display = "";
    document.getElementById("queue").style.display = "none";
    setupUI()
}

function sendTurn()
{
    const guess = document.getElementById("guessInput").value
    console.log(guess)
}

async function setupUI()
{
    await firebase.database().ref('/liveGames/' + sdfghjikjoihghdsajkdfj).once('value', _getPlayerIds);

    var opponentUID

    function _getPlayerIds(snapshot)
    {
        if (playerTurnID == 0)
            opponentUID = snapshot.val().player2;
        else if (playerTurnID == 1)
            opponentUID = snapshot.val().player1;
    }
    
    const opponentInfo = await getUserInfoFromUID(opponentUID)

    document.getElementById("opponent").src = opponentInfo.photoUrl
    document.getElementById("vsTag").innerHTML = getUserInfo().name + " (you) vs " + opponentInfo.name
}
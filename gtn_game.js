userInGame = false
playerTurnID = 1 //since startGame() is only ran on only one client, we can assume if its not run you're the second player

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

function initGame(lobbyId)
{
    userInGame = true
    var ref = firebase.database().ref("liveGames/" + lobbyId);
    ref.onDisconnect().remove()
    document.getElementById("game").style.display = "";
    document.getElementById("queue").style.display = "none";
    firebase.database().ref('/liveGames/' + lobbyId).on('value', readGame);
}

function readGame(snapshot)
{
    console.log("aaaa")
    console.log(snapshot.val())
}

function sendTurn()
{
    const guess = document.getElementById("guessInput").value
    console.log(guess)
}
var userInQueue = false
var temp = false

document.addEventListener("DOMContentLoaded", function () {
    var img = document.getElementById("profile");
    img.src = localStorage.getItem('userImg');
    document.getElementById("game").style.display = "none";
})

function joinQueue()
{
    if (userInGame) return
    if (userInQueue) return

    userInQueue = true
    firebaseWrite("queue/" + userInfo.uid, {timestamp: Date.now()})
    firebaseRef("queue/" + userInfo.uid).onDisconnect().remove()

    firebaseRead("queue", (snapshot) => {
        var queueLength = Object.keys(snapshot.val()).length;
        console.log(queueLength)
        //if you are the first person in queue
        if (queueLength == 1)
        {
            firebaseWrite("queue/" + userInfo.uid, {matchmake: true})
        }
        else if (queueLength == 2)
        {
            var sorted = Object.keys(snapshot.val()).sort((a, b) => snapshot.val()[a].timestamp - snapshot.val()[b].timestamp)
            if (snapshot.val()[sorted[0]].matchmake == null)
                firebaseWrite("queue/" + sorted[0], {matchmake: true})
        }
    })

    firebaseRef("queue/" + userInfo.uid).on('value', (snapshot) => {
        console.log(snapshot.val())
        if (snapshot.val() == null)
            return

        if (snapshot.val().lobbyId != null)
        {
            console.log(snapshot.val().lobbyId)
            leaveQueue()
            joinLobby(snapshot.val().lobbyId)
        }
        if (snapshot.val().matchmake != null)
        {
            if (temp) return
            console.log("i am matchmaker");
            matchmake()
        }
    })
}

function matchmake(snapshot)
{
    firebaseRef("queue").on('value', async (snapshot) => {
        if (temp) return
        console.log("i am matchmaking")
        var queueLength = Object.keys(snapshot.val()).length;
        console.log(queueLength)
        var sorted = Object.keys(snapshot.val()).sort((a, b) => snapshot.val()[a].timestamp - snapshot.val()[b].timestamp)

        if (queueLength >= 2)
        {
            temp = true
            console.log("matchmake " + sorted[0] + " + " + sorted[1])
            const lobbyId = crypto.randomUUID()
            const RANDOM_NUMBER = Math.floor(Math.random() * 100);

            firebaseWrite("liveGames/" + lobbyId, {
                correctNumber: RANDOM_NUMBER,
                playersTurn: 0,
                player1: sorted[0],
                player2: sorted[1],
                gameStatus: ""
            })

            await firebaseWrite("queue/" + sorted[1], {lobbyId: lobbyId})
            leaveQueue()
            joinLobby(lobbyId)
        }
    })
}

function leaveQueue()
{
    if (userInGame) return
    
    userInQueue = false

    firebaseRef("queue/" + userInfo.uid).remove()
    firebaseRef("queue").off();
}
var userInQueue = false;
var temp = false;
var matchmaking = false;

document.addEventListener("DOMContentLoaded", function () {
    var img = document.getElementById("profile");
    img.src = localStorage.getItem('userImg');
    document.getElementById("game").style.display = "none";
    firebaseRef("queue").on('value', updateQueueLength)
})

function updateQueueLength(snapshot)
{
    const queueCounter = document.getElementById("queueCount");

    if (snapshot.val() == null)
    {
        queueCounter.innerHTML = "0 players in queue"
        return
    }

    var rename = ""
    if (userInQueue)
        rename = "(you are queuing)"

    var queueLength = Object.keys(snapshot.val()).length;
    queueCounter.innerHTML = queueLength + " players in queue " + rename;

    if (matchmaking)
    {
        matchmake(snapshot);
    }
}

function joinQueue()
{
    if (userInGame) return
    if (userInQueue) return

    userInQueue = true
    firebaseWrite("queue/" + getUserInfo().uid, {timestamp: Date.now()})
    firebaseRef("queue/" + getUserInfo().uid).onDisconnect().remove()

    firebaseRead("queue", (snapshot) => {
        if (snapshot.val() == null) return

        var queueLength = Object.keys(snapshot.val()).length;

        //if you are the first person in queue
        if (queueLength == 1)
        {
            firebaseWrite("queue/" + getUserInfo().uid, {matchmake: true})
        }
        else if (queueLength == 2)
        {
            var sorted = Object.keys(snapshot.val()).sort((a, b) => snapshot.val()[a].timestamp - snapshot.val()[b].timestamp)
            if (snapshot.val()[sorted[0]].matchmake == null)
                firebaseWrite("queue/" + sorted[0], {matchmake: true})
        }
    })

    firebaseRef("queue/" + getUserInfo().uid).on('value', (snapshot) => {
        if (snapshot.val() == null)
            return

        if (snapshot.val().lobbyId != null)
        {
            leaveQueue()
            joinLobby(snapshot.val().lobbyId)
        }
        if (snapshot.val().matchmake != null)
        {
            if (temp) return
            matchmaking = true;
            //matchmake()
        }
    })
}

async function matchmake(snapshot)
{
    if (temp) return
    if (snapshot.val() == null) return

    var queueLength = Object.keys(snapshot.val()).length;
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
        matchmaking = false;
    }
}

function leaveQueue()
{
    if (userInGame) return
    
    userInQueue = false

    firebaseRef("queue/" + getUserInfo().uid).remove()
    firebaseRef("queue/" + getUserInfo().uid).off()
}
var userInQueue = false
var temp = false

function joinQueue()
{
    if (userInQueue) return

    userInQueue = true
    firebaseWrite("queue/" + userInfo.uid, {timestamp: Date.now()})
    firebaseRef("queue/" + userInfo.uid).onDisconnect().remove()

    firebaseRef("queue/" + userInfo.uid).on('value', (snapshot) => {
        if (snapshot.val().lobbyId != null)
        {
            console.log(snapshot.val().lobbyId)
            leaveQueue()
        }
    })

    firebaseRef("queue").on('value', (snapshot) => {
        if (temp) return

        const queueData = snapshot.val();
        if (queueData == null) return;

        var uids = Object.keys(queueData)
        var sortedQueue = uids.sort((a, b) => queueData[a].timestamp - queueData[b].timestamp)

        if (sortedQueue.length < 2) return

        //ONLY the first person in queue will make changes

        if (sortedQueue[0] == userInfo.uid)
        {
            temp = true

            console.log("thats me")
            
            const lobbyId = crypto.randomUUID()
            const RANDOM_NUMBER = Math.floor(Math.random() * 100);

            firebaseWrite("liveGames/" + lobbyId, {
                correctNumber: RANDOM_NUMBER,
                playersTurn: 0,
                player1: sortedQueue[0],
                player2: sortedQueue[1],
                gameStatus: ""
            })

            firebaseWrite("queue/" + sortedQueue[1], {lobbyId: lobbyId});
            leaveQueue()
        }
    })
}

function leaveQueue()
{
    userInQueue = false

    firebaseRef("queue/" + userInfo.uid).remove()
    firebaseRef("queue").off();
}
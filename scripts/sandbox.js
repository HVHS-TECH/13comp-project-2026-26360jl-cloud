var userInQueue = false
var temp = false

function joinQueue()
{
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
            firebaseRef("queue").on('value', matchmake)
        }
        else if (queueLength == 2)
        {
            var sorted = Object.keys(snapshot.val()).sort((a, b) => snapshot.val()[a].timestamp - snapshot.val()[b].timestamp)
            if (sorted[0] == userInfo.uid)
                firebaseRef("queue").on('value', matchmake)
        }
    })

    /*firebaseRef("queue/" + userInfo.uid).on('value', (snapshot) => {
        if (snapshot.val().lobbyId != null)
        {
            console.log(snapshot.val().lobbyId)
            leaveQueue()
        }
    })

    */
}

function matchmake(snapshot)
{
    console.log("i am matchmaking")
    firebaseRef("queue").on('value', (snapshot) => {
        var queueLength = Object.keys(snapshot.val()).length;
        var sorted = Object.keys(snapshot.val()).sort((a, b) => snapshot.val()[a].timestamp - snapshot.val()[b].timestamp)

        if (queueLength >= 2)
        {
            console.log("matchmake " + sorted[0] + " + " + sorted[1])
        }
    })
}

console.log("PAGES WOKR")

function leaveQueue()
{
    userInQueue = false

    firebaseRef("queue/" + userInfo.uid).remove()
    firebaseRef("queue").off();
}
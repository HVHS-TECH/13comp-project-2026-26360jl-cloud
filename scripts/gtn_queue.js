userInQueue = false

firebase.database().ref('/queue/').on('value', readQueue);

function readQueue(snapshot)
{
    document.getElementById("profile").src = userInfo.photoUrl

    if (userInGame)
        return

    const queueText = document.getElementById("queueCount")
    if (snapshot.val() == null)
    {
        queueText.innerHTML = "0 players in queue"
        return
    }

    const userUids = Object.keys(snapshot.val());
    const userTimestamps = Object.values(snapshot.val());
    var queueLength = userTimestamps.length

    queueText.innerHTML = queueLength + " players in queue"

    if (userInQueue)
        queueText.innerHTML += " (you are in queue)"
    else
        return // if the user is not queueing it doesn't care about starting games its not apart of

    if (queueLength < 2)
        return
    
    if (userUids[0] == userInfo.uid)
    {
        startGame(userTimestamps[0].lobbyId, userUids[0], userUids[1])
        leaveQueue()
    }
    if (userUids[1] == userInfo.uid)
    {
        initGame(userTimestamps[0].lobbyId)
        leaveQueue()
    }
}

function queue()
{
    userInQueue = true
    const userInfo = getUserInfo()
    const lobbyId = crypto.randomUUID()

    var ref = firebase.database().ref("queue/" + userInfo.uid);
    ref.set(
        {
            lobbyId: lobbyId,
            timestamp: Date.now()
        }
    );
    ref.onDisconnect().remove()
}

function leaveQueue()
{
    userInQueue = false
    const userInfo = getUserInfo()
    firebase.database().ref('queue/' + userInfo.uid).remove()
}
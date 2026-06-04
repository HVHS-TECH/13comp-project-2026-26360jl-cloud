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

    var abc = snapshot.val();

    var unsorted = Object.keys(snapshot.val());

    var sorted = unsorted.sort((a, b) => abc[a].timestamp - abc[b].timestamp)

    console.log(abc[sorted[0]].lobbyId)

    var queueLength = sorted.length

    queueText.innerHTML = queueLength + " players in queue"

    if (userInQueue)
        queueText.innerHTML += " (you are in queue)"
    else
        return // if the user is not queueing it doesn't care about starting games its not apart of

    if (queueLength < 2)
        return
    
    if (sorted[0] == userInfo.uid)
    {
        startGame(abc[sorted[0]].lobbyId, sorted[0], sorted[1])
    }
    if (sorted[1] == userInfo.uid)
    {
        initGame(abc[sorted[0]].lobbyId)
    }
}

function queue()
{
    if (userInQueue) return;

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

function leaveQueue(user2uid)
{
    userInQueue = false
    const userInfo = getUserInfo()
    firebase.database().ref('queue/' + userInfo.uid).remove()
    firebase.database().ref('queue/' + user2uid).remove()
}
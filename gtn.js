userInQueue = false

firebase.database().ref('/queue/').on('value', readQueue);

function readQueue(snapshot)
{
    document.getElementById("profile").src = userInfo.photoUrl
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
    
    if (userUids[0] == getUserInfo().uid)
    {
        console.log(userTimestamps[0].lobbyId)
        firebase.database().ref('liveGames/' + userTimestamps[0].lobbyId).set(
        {
            lobbyId: "test"
        }
    )
    }
}

function queue()
{
    userInQueue = true
    const userInfo = getUserInfo()
    const lobbyId = crypto.randomUUID()
    firebase.database().ref('queue/' + userInfo.uid).set(
        {
            lobbyId: lobbyId
        }
    )
}

function leaveQueue()
{
    userInQueue = false
    const userInfo = getUserInfo()
    firebase.database().ref('queue/' + userInfo.uid).remove()
}
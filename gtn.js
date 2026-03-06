const maxTimestepDifference = 10000 //If another users timestep has a 10 second difference then they get kicked from queue

userInQueue = false

firebase.database().ref('/queue/').on('value', readQueue);

function readQueue(snapshot)
{
    /*document.getElementById("profile").src = userInfo.photoUrl
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
                lobbyId: "test",
                user1: userUids[0],
                user2: userUids[1]
            }
        )
    }*/
}

function queue()
{
    userInQueue = true
    const userInfo = getUserInfo()
    const lobbyId = crypto.randomUUID()
    /*firebase.database().ref('queue/' + userInfo.uid).set(
        {
            lobbyId: lobbyId,
            timestamp: Date.now()
        }
    )*/

    var ref = firebase.database().ref("queue/" + userInfo.uid);
    ref.update({
        onlineState: Date.now(),
        status: "I'm online."
    });
    ref.onDisconnect().update({
        onlineState: false,
        status: "I'm offline."
    });

    //pingQueue(userInfo, lobbyId)
}

//this function is to ping the server with a timestamp every 3 seconds.
//the other clients then check that everyones timestamp is up to date.
//when the differences in timestamps are too big, it probably means the user has closed the tab so they are no longer wanting to queue
//when this happens the other users will kick them out of the queue
async function pingQueue(userInfo, lobbyId) {
    var ref = firebase.database().ref('queue/' + userInfo.uid + "/timestamp").set(Date.now())
    ref.onDisconnect().set(false);

    await delay(3000);

    console.log("Waited 3 seconds!");

    if (userInQueue)
        pingQueue(userInfo, lobbyId)

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

function leaveQueue()
{
    userInQueue = false
    const userInfo = getUserInfo()
    firebase.database().ref('queue/' + userInfo.uid).remove()
}
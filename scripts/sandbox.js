var userInQueue = false
var temp = false

function joinQueue()
{
    //if (userInQueue) return

    userInQueue = true
    firebaseWrite("queue/" + userInfo.uid, {timestamp: Date.now()})
    firebaseRef("queue/" + userInfo.uid).onDisconnect().remove()

    firebaseRead("queue", (snapshot) => {
        var queueLength = Object.keys(snapshot.val()).length;
        console.log(queueLength)
        //if you are the first person in queue
        if (queueLength == 1)
        {
            console.log("i am matchmaker")
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
firebaseRef("queue").on('value', (snapshot) => {
        
    })
}

function leaveQueue()
{
    userInQueue = false

    firebaseRef("queue/" + userInfo.uid).remove()
    firebaseRef("queue").off();
}
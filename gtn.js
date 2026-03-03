function test()
{
    document.getElementById("profileImage").src = getUserInfo().photoUrl
}

function queue()
{
    userInfo = getUserInfo()
    firebase.database().ref('queue/'+userInfo.uid).set(
        {
            timestamp: Date.now()
        }
    )
}
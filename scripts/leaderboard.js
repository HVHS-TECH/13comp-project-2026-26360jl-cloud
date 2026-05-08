var userInfoLoaded = false
var userInfo = {}
var leaderboardData = {}

document.addEventListener("DOMContentLoaded", function () {
    loadLeaderboardData();
})

function loadLeaderboardData()
{
    firebaseRead("/leaderboard/", async function(snapshot){
            if (snapshot.val() == null) return
            leaderboardData = snapshot.val();

            await loadUserInfoAsync(leaderboardData)
            userInfoLoaded = true
            getSelectedStatArray(leaderboardData)
        })
}

async function refreshLeaderboard()
{
    if (userInfoLoaded == false) {
        console.log("User info is not loaded")
        loadLeaderboardData();
        return
    }
    
    getSelectedStatArray(leaderboardData)
}

//loading 1 by 1 which is bad async
async function loadUserInfoAsync(leaderboardData)
{
    const USER_UIDS = Object.keys(leaderboardData);
    for (var i = 0; i < USER_UIDS.length; i++)
    {
        const UID = USER_UIDS[i]
        //await leaderboardValidateStats(UID, "gtnWins")
        //await leaderboardValidateStats(UID, "gtnLosses")
        userInfo[UID] = await getUserInfoFromUID(UID)
    }
}

function getSelectedStatArray(leaderboardData)
{
    const SELECT_ELEMENT = document.getElementById("sortOption").value

    var items = Object.keys(leaderboardData)
    items.sort((a, b) => leaderboardData[b][SELECT_ELEMENT] - leaderboardData[a][SELECT_ELEMENT]);
    const ulElement = document.getElementById("leaderboardList");

    while (ulElement.children.length > 0)
    {
        ulElement.children[0].remove();
    }

    for (var i = 0; i < items.length; i++)
    {
        const USER_UID = items[i]
        const liElement = document.createElement("li");
        liElement.textContent = "#" + (i + 1) + " " + userInfo[USER_UID].name + " : " + leaderboardData[USER_UID][SELECT_ELEMENT]

        const imgElement = document.createElement("img")
        imgElement.src = userInfo[USER_UID].photoUrl
        liElement.appendChild(imgElement)

        ulElement.appendChild(liElement)
    }
}
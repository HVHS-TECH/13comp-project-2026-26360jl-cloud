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
    
    getSelectedStatArray()
}

//loading 1 by 1 which is bad async
async function loadUserInfoAsync(leaderboardData)
{
    const USER_UIDS = Object.keys(leaderboardData);
    for (var i = 0; i < USER_UIDS.length; i++)
    {
        const UID = USER_UIDS[i]
        await leaderboardValidateStats(UID, "gtnWins")
        await leaderboardValidateStats(UID, "gtnLosses")
        userInfo[UID] = await getUserInfoFromUID(UID)
        var wins = leaderboardData[UID]["gtnWins"]
        var losses = leaderboardData[UID]["gtnLosses"]
        var wr = wins / (wins + losses)
        let rounded = Math.round(wr * 100) / 100;
        leaderboardData[UID]["gtnWR"] = rounded * 100
    }

    console.log(leaderboardData)
}

var suffixes = {
    gtnWins: "wins",
    gtnLosses: "losses",
}

function getSelectedStatArray()
{
    const SELECT_ELEMENT = document.getElementById("sortOption").value

    var items = Object.keys(leaderboardData)
    items.sort((a, b) => leaderboardData[b][SELECT_ELEMENT] - leaderboardData[a][SELECT_ELEMENT]);
    const parent = document.getElementById('leaderboard');
    const children = parent.getElementsByClassName('leaderboardSlot');

    while (children.length > 0)
    {
        children[0].remove();
    }
    let podium = ['🥇','🥈','🥉']
    for (var i = 0; i < items.length; i++)
    {
        const USER_UID = items[i]
        const containerDiv = document.createElement("div")
        containerDiv.classList.add("leaderboardSlot")

        const firstSpanElement = document.createElement("span")
        firstSpanElement.classList.add("sub")
        firstSpanElement.classList.add("max-width")

        if (i <= 2) firstSpanElement.innerHTML = podium[i]
        else firstSpanElement.innerHTML = i + 1

        const imgElement = document.createElement("img")
        imgElement.classList.add("rounded-circle")
        imgElement.classList.add("sub")
        imgElement.width = 42
        imgElement.height = 42
        imgElement.src = userInfo[USER_UID].photoUrl

        const lastSpanElement = document.createElement("span")
        lastSpanElement.classList.add("sub")

        lastSpanElement.innerHTML = userInfo[USER_UID].name + " : " + leaderboardData[USER_UID][SELECT_ELEMENT] + " " + suffixes[SELECT_ELEMENT] + " (" + leaderboardData[USER_UID]["gtnWR"] + "% wr)"

        containerDiv.appendChild(firstSpanElement)
        containerDiv.appendChild(imgElement)
        containerDiv.appendChild(lastSpanElement)
        parent.appendChild(containerDiv)
    }
}
var userInfoLoaded = false
var userInfo = {}

document.addEventListener("DOMContentLoaded", function () {
    refreshLeaderboard();
})

function refreshLeaderboard()
{
    firebaseRead("/leaderboard/", async function(snapshot){
        if (snapshot.val() == null) return
        leaderboardData = snapshot.val();

        if (userInfoLoaded == false) {
            console.log("NULL")
            await loadUserInfoAsync(leaderboardData)
            userInfoLoaded = true
        }

        getSelectedStatArray(leaderboardData)
    })
}

const TYPE_GTN_WINS = 0;
const TYPE_GTN_LOSSES = 1;
const TYPE_HIGHSCORE = 2;

async function loadUserInfoAsync(leaderboardData)
{
    const USER_UIDS = Object.keys(leaderboardData);
    for (var i = 0; i < USER_UIDS.length; i++)
    {
        const UID = USER_UIDS[i]
        userInfo[UID] = await getUserInfoFromUID(UID)
    }
}

function getSelectedStatArray(leaderboardData)
{
    const SELECT_ELEMENT = document.getElementById("sortOption").value

    var items = Object.keys(leaderboardData)
    console.log(leaderboardData) 
    items.sort((a, b) => leaderboardData[b][SELECT_ELEMENT] - leaderboardData[a][SELECT_ELEMENT]);
    console.log(items)
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
        ulElement.appendChild(liElement)
    }
}
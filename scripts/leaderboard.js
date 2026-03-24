var leaderboardData__;
var tempNameRenameLater = new Map();
var orderedData = []

document.addEventListener("DOMContentLoaded", function () {
    firebaseRead("/leaderboard/", function(snapshot){
        if (snapshot.val() == null) return

        leaderboardData = snapshot.val();
        leaderboardData__ = leaderboardData;
        showLeaderboardList(leaderboardData)
    })
})

function bubbleSort()
{

}

function sortByGTNWins()
{
    const USER_UIDS = Object.keys(leaderboardData__);
    const USER_STATS = Object.values(leaderboardData__);
    var unordered = []

    for (var i = 0; i < USER_UIDS.length; i++)
    {
        tempNameRenameLater.set(USER_UIDS[i], USER_STATS[i].gtnWins);
        unordered[i] = USER_STATS[i].gtnWins;
    }

    console.log(unordered)
}

function sortByGTNLosses()
{

}

function sortByHighscore()
{

}

async function showLeaderboardList(leaderboardData)
{
    sortByGTNWins()
    const ulElement = document.getElementById("leaderboardList");

    const USER_UIDS = Object.keys(leaderboardData);
    const USER_STATS = Object.values(leaderboardData);

    for (var i = 0; i < USER_UIDS.length; i++)
    {
        const liElement = document.createElement("li");
        const userInfo = await getUserInfoFromUID(USER_UIDS[i])
        liElement.textContent = userInfo.name
        ulElement.appendChild(liElement)
    }
}
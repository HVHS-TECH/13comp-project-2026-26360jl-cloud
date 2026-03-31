var leaderboardData__;
var orderedData = []
var orderedUids = []

document.addEventListener("DOMContentLoaded", function () {
    refreshLeaderboard();
})

function refreshLeaderboard()
{
    firebaseRead("/leaderboard/", function(snapshot){
        if (snapshot.val() == null) return

        leaderboardData = snapshot.val();
        leaderboardData__ = leaderboardData;
        showLeaderboardList(leaderboardData)
    })
}

const TYPE_GTN_WINS = 0;
const TYPE_GTN_LOSSES = 1;
const TYPE_HIGHSCORE = 2;

function sortSelectedStat(type)
{
    const USER_UIDS = Object.keys(leaderboardData__);
    const USER_STATS = Object.values(leaderboardData__);
    var unordered = []
    var unordered_uids = []

    switch (type)
    {
        case TYPE_GTN_WINS:
            for (var i = 0; i < USER_UIDS.length; i++)
            {
                unordered[i] = USER_STATS[i].gtnWins;
                unordered_uids[i] = USER_UIDS[i];
            }
            break;
        case TYPE_GTN_LOSSES:
            for (var i = 0; i < USER_UIDS.length; i++)
            {
                unordered[i] = USER_STATS[i].gtnLosses;
                unordered_uids[i] = USER_UIDS[i];
            }
            break;
        case TYPE_HIGHSCORE:
            for (var i = 0; i < USER_UIDS.length; i++)
            {
                unordered[i] = USER_STATS[i].highscore;
                unordered_uids[i] = USER_UIDS[i];
            }
            break
    }

    console.log(unordered)
    console.log(unordered_uids)

    sort(unordered, USER_UIDS);
}

function sort(unordered, unordered_uids)
{
    for (var i = 0; i < unordered.length; i++)
    {
        for (var j = 0; j < unordered.length; j++)
        {
            if (j == unordered.length) continue

            if (unordered[j] < unordered[j + 1])
            {
                temp = unordered[j]
                unordered[j] = unordered[j + 1]
                unordered[j + 1] = temp

                tempUid = unordered_uids[j]
                unordered_uids[j] = unordered_uids[j + 1]
                unordered_uids[j + 1] = tempUid
            }
        }
    }
    orderedData = unordered
    orderedUids = unordered_uids
}

async function showLeaderboardList(leaderboardData)
{
    await sortSelectedStat(getTypeFromOption())
    const ulElement = document.getElementById("leaderboardList");

    while (ulElement.children.length > 0)
    {
        ulElement.children[0].remove();
    }

    for (var i = 0; i < orderedUids.length; i++)
    {
        const liElement = document.createElement("li");
        const userInfo = await getUserInfoFromUID(orderedUids[i])
        liElement.textContent = "#" + (i + 1) + " " + userInfo.name + " : " + orderedData[i]
        ulElement.appendChild(liElement)
    }
}

function getTypeFromOption()
{
    const selectElement = document.getElementById("sortOption").value
    if (selectElement == "gtnWins")
            return TYPE_GTN_WINS;
    if (selectElement == "gtnLosses")
            return TYPE_GTN_LOSSES;
    if (selectElement == "highscore")
            return TYPE_HIGHSCORE;
}
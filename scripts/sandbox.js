var callbacks = {}
var queue = []
var GLOBALUSERINFO = {}
var leaderboardLoaded = false;

document.addEventListener("DOMContentLoaded", function () {
    loadLeaderboardData();
})

function loadLeaderboardData()
{
    const parent = document.getElementById('leaderboard');
    const children = parent.getElementsByClassName('leaderboardSlot');

    while (children.length > 0)
    {
        children[0].remove();
    }
    loadGlobalUserInfo()
}

function refreshLeaderboard()
{
    if (leaderboardLoaded == true)
        getSelectedStatArray();
}

async function registerCallback(id, func)
{
    queue[queue.length] = id

    callbacks[id] = false
    let c = await func;
    callbacks[id] = true

    if (c != null)
    {
        GLOBALUSERINFO[c.uid]["info"] = c;
    }
}

async function loadGlobalUserInfo() {

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    firebaseRead("leaderboard/", async (snapshot) => {
        const LEADERBOARD_DATA = snapshot.val();
        var uids = Object.keys(snapshot.val())

        for (var j = 0; j < uids.length; j++)
        {
            const wins = LEADERBOARD_DATA[uids[j]]["gtnWins"]
            const losses = LEADERBOARD_DATA[uids[j]]["gtnLosses"]
            const wr = wins / (wins + losses)
            const rounded = Math.round(wr * 100) / 100

            GLOBALUSERINFO[uids[j]] = {};
            GLOBALUSERINFO[uids[j]].gtnWins = wins
            GLOBALUSERINFO[uids[j]].gtnLosses = losses
            GLOBALUSERINFO[uids[j]].gtnWR = rounded * 100

            registerCallback("uid" + j, getUserInfoFromUID(uids[j]))
            registerCallback("lstatWins" + j, leaderboardValidateStats(uids[j], "gtnWins"))
            registerCallback("lstatLoss" + j, leaderboardValidateStats(uids[j], "gtnLosses"))
        }
        
        var breakout = false
        var i = 0;
        while (!breakout)
        {
            if (i >= queue.length)
                breakout = true

            if (callbacks[queue[i]] == true)    
            {
                i++;
            }
            await sleep(1)
        }

        leaderboardLoaded = true
        getSelectedStatArray();
    })
}

const suffixes = { gtnWins: "wins", gtnLosses: "losses" }

function getSelectedStatArray()
{
    const SELECT_ELEMENT = document.getElementById("sortOption").value

    var items = Object.keys(GLOBALUSERINFO)
    items.sort((a, b) => GLOBALUSERINFO[b][SELECT_ELEMENT] - GLOBALUSERINFO[a][SELECT_ELEMENT]);
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
        imgElement.src = GLOBALUSERINFO[USER_UID]["info"].photoUrl

        const lastSpanElement = document.createElement("span")
        lastSpanElement.classList.add("sub")

        lastSpanElement.innerHTML = GLOBALUSERINFO[USER_UID]["info"].name + " : " + GLOBALUSERINFO[USER_UID][SELECT_ELEMENT] + " " + suffixes[SELECT_ELEMENT] + " (" + GLOBALUSERINFO[USER_UID]["gtnWR"] + "% wr)"

        containerDiv.appendChild(firstSpanElement)
        containerDiv.appendChild(imgElement)
        containerDiv.appendChild(lastSpanElement)
        parent.appendChild(containerDiv)
    }
}
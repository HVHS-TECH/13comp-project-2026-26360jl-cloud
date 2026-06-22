var callbacks = {

}

var queue = []
var freeIndex = 0;

var USERINFO = []
var i = 0

async function registerCallback(id, func, jay)
{
    queue[freeIndex] = id
    freeIndex++;

    callbacks[id] = false
    let c = await func;
    callbacks[id] = true

    if (c != null)
    {
        USERINFO[jay] = c;
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
firebaseRead("leaderboard/", async (snapshot) => {
    uids = Object.keys(snapshot.val())
    
    for (var j = 0; j < uids.length; j++)
    {
        registerCallback("uid" + j, getUserInfoFromUID(uids[j]), j)
        registerCallback("lstatWins" + j, leaderboardValidateStats("gtnWins", uids[j]))
        registerCallback("lstatLoss" + j, leaderboardValidateStats("gtnLosses", uids[j]))
    }
    
    var breakout = false
    var i = 0;
    while (!breakout)
    {
        if (i >= freeIndex)
            breakout = true

        if (callbacks[queue[i]] == true)    
        {
            i++;
            console.log("true")
        }

        await sleep(1)
    }
    console.log(USERINFO)
})
async function leaderboardIncrementStat(uid, stat)
{
    var statValue = 0
    await firebase.database().ref("leaderboard/" + uid + "/" + stat).once('value', _getStatValue);

    function _getStatValue(snapshot)
    {
        if (snapshot.val() == null) return //if this is null they arent in the firebase leaderboard database
        statValue = snapshot.val()
    }

    statValue++;

    firebase.database().ref("leaderboard/" + uid + "/" + stat).set(statValue);
}

//if the user has never won/lost a game, it doesnt exist in the database. This just makes it exist as 0 so the leaderboard can sort correctly.
async function leaderboardValidateStats(uid, stat) {
    await firebase.database().ref("leaderboard/" + uid + "/" + stat).once('value', _getStatValue);

    function _getStatValue(snapshot)
    {
        if (snapshot.val() == null) //if this is null they arent in the firebase leaderboard database
        {
            firebase.database().ref("leaderboard/" + uid + "/" + stat).set(0);
        }
    }
}
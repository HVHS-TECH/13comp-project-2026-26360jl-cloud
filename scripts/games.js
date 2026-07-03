var toggled = {

}

function openStatPopup()
{
    const modal = document.getElementById("modal")
    const statsInfo = document.getElementById("stats-info")
    modal.classList.add("open")

    firebaseRead("leaderboard/" + getUserInfo().uid, (snapshot) => {
        const STATS = snapshot.val();
        if (STATS == null) return

        var wins = STATS.gtnWins;
        var losses = STATS.gtnLosses;

        if (wins == null) { wins = 0; leaderboardValidateStats(getUserInfo().uid, "gtnWins") }
        if (losses == null) { losses = 0; leaderboardValidateStats(getUserInfo().uid, "gtnLosses") }

        const wr = wins / (wins + losses)
        const rounded = Math.round(wr * 100) / 100

        statsInfo.innerHTML =   "GTN Wins: " + wins + ", " +
                                "GTN Losses: " + losses + ", " +
                                "Winrate: " + rounded * 100 + "%";
    })
}

function closeStatPopup()
{
    const modal = document.getElementById("modal")
    modal.classList.remove("open")
}

function extendSect(element)
{
    let id = element.id
    if (toggled[id] == null)
        toggled[id] = false;

    const desc = element.querySelector('#extend');
    const btn = element.querySelector('#extend1');

    if(toggled[id] = !toggled[id])
    {
        desc.style.display = ""
        btn.style.display = ""
    }
    else
    {
        desc.style.display = "none"
        btn.style.display = "none"
    }

    //document.getElementById("").style.display = ""
    
}
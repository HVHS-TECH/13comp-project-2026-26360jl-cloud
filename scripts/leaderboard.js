document.addEventListener("DOMContentLoaded", function () {
    firebase.database().ref('/leaderboard/').once('value', loadLeaderboard);
})

function loadLeaderboard(snapshot)
{
    console.log(snapshot.val())
    
}
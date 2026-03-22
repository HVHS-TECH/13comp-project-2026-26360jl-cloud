document.addEventListener("DOMContentLoaded", function () {
    //firebase.database().ref('/leaderboard/').once('value', loadLeaderboard);
    firebaseRead("/leaderboard/", function(snapshot){
        console.log(snapshot.val())
    })
})

function loadLeaderboard(snapshot)
{
    console.log(snapshot.val())
    
}
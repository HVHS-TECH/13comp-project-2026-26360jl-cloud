document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            window.location.replace("./games.html")
        }
    })
})

function login()
{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var userInfo = result.user;

        checkFirebase(userInfo)
    })
}

function checkFirebase(userInfo)
{
    firebase.database().ref('/registeredUsers/' + userInfo.uid).once('value', _checkFirebase);

    function _checkFirebase(snapshot)
    {
        //if user is not registered in firebase
        if (snapshot.val() == null)
        {
            alert("you are not signed up")
            window.location.replace("./signup.html")
            return
        }
    }
}
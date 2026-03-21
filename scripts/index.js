document.addEventListener("DOMContentLoaded", async function () {
    firebase.auth().onAuthStateChanged(async (user) => {
        console.log(user)
        if (user == null)
            return

        if (! await checkFirebase(user))
            return

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
    })
}

async function checkFirebase(userInfo)
{
    var userInFirebase = false
    await firebase.database().ref('/registeredUsers/' + userInfo.uid).once('value', _checkFirebase);

    async function _checkFirebase(snapshot)
    {
        console.log(snapshot.val())
        //if user is not registered in firebase
        if (snapshot.val() == null)
        {
            userInFirebase = false
            alert("you are not signed up")
            await window.location.replace("./signup.html")
        } else userInFirebase = true
    }

    return userInFirebase
}
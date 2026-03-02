async function signup()
{
    userAge = document.getElementById("age").value
    userGender = document.getElementById("gender").value
    userAddress = document.getElementById("address").value

    if (userAge < 5 || userAge > 99)
    {
        alert("Please enter valid age")
        return
    }

    var provider = new firebase.auth.GoogleAuthProvider();

    await firebase.auth().signInWithPopup(provider).then(async function(result) {
        var token = result.credential.accessToken;
        var userInfo = result.user;

        await firebase.database().ref('registeredUsers/' + userInfo.uid).set(
            {
                displayName: userInfo.displayName,
                email: userInfo.email,
                photoUrl: userInfo.photoURL,
                age: userAge,
                gender: userGender,
                address: userAddress,
                uid: userInfo.uid
            }
        )
    })

    window.location.replace("./games.html")
}
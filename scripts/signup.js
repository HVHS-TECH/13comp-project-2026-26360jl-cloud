var USER_INFO;

document.addEventListener("DOMContentLoaded", async function () {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user == null) {
            window.location.replace("./index.html")
            return
        }
        if (await checkFirebase(user)) { window.location.replace("./games.html"); return; }

        USER_INFO = user;
    })
})

async function signup()
{
    const userAge = document.getElementById("age").value
    const userGender = document.getElementById("gender").value
    const userAddress = document.getElementById("address").value

    if (userAge < 5 || userAge > 99)
    {
        alert("Please enter valid age between 5 and 99")
        return
    }

    if (userAddress.length < 1)
    {
        alert("Please enter valid address")
        return
    }

    await firebase.database().ref('registeredUsers/' + USER_INFO.uid).set(
        {
            displayName: USER_INFO.displayName,
            email: USER_INFO.email,
            photoUrl: USER_INFO.photoURL,
            age: userAge,
            gender: userGender,
            address: userAddress,
            uid: USER_INFO.uid
        }
    )

    localStorage.setItem('userName', USER_INFO.displayName);
    localStorage.setItem('userImg', USER_INFO.photoURL);
    localStorage.setItem('userUid', USER_INFO.uid);

    window.location.replace("./games.html")
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
        } else userInFirebase = true
    }

    return userInFirebase
}
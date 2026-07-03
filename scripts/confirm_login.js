document.addEventListener("DOMContentLoaded", function () {
    //every time the user loads a site, they are authenticated, when user is null they are not logged in
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user == null)
        {
            //if user is null, you're not logged in. Redirect to homepage
            alert("you are not logged in")
            window.location.replace("./index.html")
            return;
        }

        if (! await checkFirebase(user))
            return

        updateLocalStorage(user)
    })
})

async function checkFirebase(userInfo)
{
    var userInFirebase = false
    await firebase.database().ref('/registeredUsers/' + userInfo.uid).once('value', _checkFirebase);

    async function _checkFirebase(snapshot)
    {
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

function updateLocalStorage(user)
{
    if (user == null)
        return; // should never get here

    localStorage.setItem('userName', user.displayName);
    localStorage.setItem('userImg', user.photoURL);
    localStorage.setItem('userUid', user.uid);
}

function getUserInfo()
{
    return {
        uid: localStorage.getItem('userUid'),
        name: localStorage.getItem('userName'),
        photoUrl: localStorage.getItem('userImg')
    };
}

//used to get information about other users with their uid
//eg: used to get opponents name, and profile picture in GTN, used for the leaderboard aswell
async function getUserInfoFromUID(uid)
{
    var tempUserInfo = {
        uid: "",
        name: "",
        photoUrl: ""
    }

    await firebase.database().ref('/registeredUsers/' + uid).once('value', (snapshot) => {
        const userInfo = snapshot.val();
        //if user is not registered in firebase
        if (userInfo == null) return null

        tempUserInfo.uid = userInfo.uid
        tempUserInfo.name = userInfo.displayName
        tempUserInfo.photoUrl = userInfo.photoUrl
    });
    
    return tempUserInfo;
}
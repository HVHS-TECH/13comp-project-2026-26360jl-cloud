/****************************************************************************************************************/
// confirm_login.js
// Written by Joseph L
// 
// Used on every page to confirm the user has logged in with google and they have signed up to the database
// Prevents someone from accessing without signing up and logging in
// Also provides some useful user functions
// If the user is detected to not be logged in, they are redirected to the login page
// If the user has logged in but aren't in the database, they are redirected to the signup page
/****************************************************************************************************************/

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

        //check if the user is in firebase
        if (! await checkFirebase(user.uid))
            return

        updateLocalStorage(user)
    })
})

/*************************************************************************************
 * checkFirebase(uid)
 * 
 * Reads from firebase database to confirm the users info is there
 * If snapshot.val() is null, that means they aren't in the database and they have skipped the signup process
 * Returns true or false
 * 
 *************************************************************************************/
async function checkFirebase(uid)
{
    var userInFirebase = false
    await firebase.database().ref('/registeredUsers/' + uid).once('value', _checkFirebase);

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

/*************************************************************************************
 * updateLocalStorage(user)
 * 
 * user: object that contains information about the user like uid, displayName, photoURL
 * Updates local storage so this information is easily accessible
 * 
 *************************************************************************************/
function updateLocalStorage(user)
{
    if (user == null)
        return; // should never get here

    localStorage.setItem('userName', user.displayName);
    localStorage.setItem('userImg', user.photoURL);
    localStorage.setItem('userUid', user.uid);
}

/*************************************************************************************
 * getUserInfo()
 * 
 * Utility function that returns local storage information as an easily usable object
 * 
 *************************************************************************************/
function getUserInfo()
{
    return {
        uid: localStorage.getItem('userUid'),
        name: localStorage.getItem('userName'),
        photoUrl: localStorage.getItem('userImg')
    };
}

/*************************************************************************************
 * getUserInfoFromUID(uid)
 * 
 * Gets information (as an object) about another user using their uid
 * Used in gtn_game.js to get name and profile picture of opponent
 * Used in leaderboard.js to get the name of everyone on the leaderboard
 * Returns { uid, name, photoUrl }
 * 
 *************************************************************************************/
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
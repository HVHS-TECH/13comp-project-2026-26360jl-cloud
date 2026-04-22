var userInfo={};
userInfo.uid = {
    uid1 : {
        wins: 0,
        losses: 1
    },
    uid2 : {
        wins: 2,
        losses: 3
    },
    uid3 : {
        wins: 4,
        losses: 0
    }
}

console.log(userInfo)
console.log(userInfo["uid"].age)
console.log(Object.keys(userInfo.uid))
var items = Object.keys(userInfo.uid)
console.log(items) 
items.sort((a, b) => userInfo.uid[b].wins - userInfo.uid[a].wins);
console.log(items)
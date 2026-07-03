/****************************************************************************************************************/
// games.js
// Written by Joseph L
// 
// Code for the opening/closing sections on the games page
// Only used in games.html
/****************************************************************************************************************/

//stores booleans with ids as keys
// Eg: gameButton1: false (closed)
// Eg: gameButton2: true (opened)
var toggled = {

}

/*************************************************************************************
 * extendSect(element)
 * 
 * element: used to save each sections state uniquely
 * 
 * Toggles the section, if its open information about the game and a play button opens
 * When closed, the information and play button is removed
 *************************************************************************************/
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
}
toggled = {

}

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

    //document.getElementById("").style.display = ""
    
}
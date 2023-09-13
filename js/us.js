// all icons
let worksIcons = {
    "java":"java(1).png",
    "py":"python.svg",
    "js":"java-script.png",
    "swift":"swift.png",
    "graphic":"pen-tool.png",
    "camera":"camera.png",
    "editoer":"editoer.png",
    "cg":"calligrapher.png",
    "sw":"script.png"
}
let membersSection = document.querySelector('#members');

// Title HTML Builder
function titleBuilder(title){
    let titleHTML = `
        <div class="lines">
            <div class="line-between0"></div>
            <h2>${title}</h2>
            <div class="line-between0"></div>
        </div>
    
    `
    return titleHTML;

}
// Card HTML Builder
function cardBuilder(member){
    // works builder, Ex: swift, python, java, ..etc
    let cardWorks = ''
    for(let j of member.works){
        cardWorks += `
        <div class="icon3">
            <img src="icons/${worksIcons[j]}" alt="no Icon" width="30px">
        </div>
        `
    }
    let cardHTML = `
    <div class="flexbox flexbox-member">
        <div class="card">
            <div class="border-user">
                <i class="fa-solid fa-user"></i>
            </div>
            <h1>${member.name}</h1>
            <p>${member.description}</p>
            <div><h1 style="margin: 0px;">المجالات</h1></div>
            <div class="tags-icons">${cardWorks}</div>
        </div>
    </div>
    
    `
    return cardHTML;

}

// Main function to get members from members.json
async function getMembers(){
    membersSection.innerHTML =''
    let htmlInsert = ``
    let data = await((await fetch('/database/members.json')).json());
    keys = Object.keys(data);
    for(let i of keys){
        htmlInsert += titleBuilder(i);
        htmlInsert+='<div class="member-flex">';
        for(let j in data[i])
            htmlInsert += cardBuilder(data[i][j]);
        htmlInsert+='</div>'
    }
    membersSection.innerHTML = htmlInsert
}

getMembers();

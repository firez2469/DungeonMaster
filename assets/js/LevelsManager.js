elementCount = 1;
loadedLevelsCount = 0;
heldData = []


function displayLogin(){
  var loginBox = document.getElementById("login-box");
  var saveBtn = document.getElementById("save");
  var loggedInVal = window.sessionStorage.getItem("login");
  var loggedinText = document.getElementById("loggedInAs");
  var logoutBtn = document.getElementById("logout");
  console.log(loggedInVal=="null");
  if(loggedInVal==undefined||loggedInVal=="null"||loggedInVal=="undefined"){
    
    loggedInVal = "";
    loggedinText.innerText = "Not logged in";
    logoutBtn.style.visibility="hidden";
    saveBtn.style.visibility="hidden";
  }else{
    if(!!loginBox){
      loginBox.style.visibility="hidden";
      window.location = "https://firez2469.github.io/DungeonMaster/Levels.html";
    }
    
    loggedinText.innerText = "Logged in as: "+loggedInVal;
    logoutBtn.style.visibility="visible";

    
  }

  logoutBtn.onclick = function(){
    window.sessionStorage.setItem("login",undefined);
    window.location = "https://firez2469.github.io/DungeonMaster/login.html";
  }
  
  

}

displayLogin();

function deleteElement(id){
  var val = id.split('delete')[1];
  //console.log(val);
  if(val > 0){
    document.getElementById("levelItem"+val).remove();
    //console.log("Deleted!");
  }
}

function enterLvlElement(id){
  //console.log("Transfering to level "+id);
  window.sessionStorage.setItem('levelLoad',id);
  var lvlVal = id.split('enterlvl')[1];
  if(id == "enter_lvl"){
    lvlVal="";
  }
  var clone = document.getElementById("levelItem"+lvlVal);
  //console.log(id.split('enterlvl')[1]);
  var name = clone.querySelector("#level_name").innerHTML;
  var desc = clone.querySelector("#level_desc").innerHTML;
  window.sessionStorage.setItem('levelName',name);
  window.sessionStorage.setItem('levelDesc',desc);
  //console.log("Name:"+name+" desc:"+desc);

  window.location = 'https://firez2469.github.io/DungeonMaster/Level.html';
}


function createNewLevel(){

    var original = document.getElementById("levelItem");
    var clone = original.cloneNode(true);
    clone.removeAttribute("id");
    clone.id = "levelItem"+elementCount;
    //console.log(clone);
    delBtn = clone.querySelector("#delete");

    delBtn.id = "delete"+elementCount;
    delBtn.onclick = function(event){
      deleteElement(event.target.id);
    }
    enterBtn = clone.querySelector("#enter_lvl");
    if(!!enterBtn){

      //console.log("element count:"+elementCount);
      enterBtn.id = "enterlvl"+elementCount;
      enterBtn.onclick = function(event){
        enterLvlElement(event.target.id);
      }
    }


    if(!!document.getElementById("levels")){
      clone.querySelector("#level_name").innerHTML="New Level "+elementCount;
      clone.querySelector("#level_desc").innerHTML="Level description...";
    }
    document.getElementById("body").appendChild(clone);
    elementCount++;
    return clone;
}


/*function save(){
  //Check if in list of levels scene
  if(!!document.getElementById("levels")){

  }
  //Check if templates items in scene
  if(!!document.getElementById("templates")){

  }
  //Chek if in list of templates page
  if(!!document.getElementById("listTemplates")){

  }
}*/



var inDoc = !!document.getElementById("createNew");
if(inDoc){
  var element = document.getElementById("createNew");
  element.onclick = function(event) {
    //console.log(event);
    createNewLevel();
  }
}

var inDoc = !!document.getElementById("save");
if(inDoc){
  var element = document.getElementById("save");
  element.onclick = function(event) {
    //console.log(event);
    save();
  }
}
//EnterLevel for LevelsCard page to enter and store which level.
if(!!document.getElementById("levels")){
  //initialize the start btn to load enterLvlElement
  var initEnterBtn = document.getElementById("enter_lvl");
  initEnterBtn.onclick = function(event){
    enterLvlElement(event.target.id);
  }


}
if(!!document.getElementById("level")){
  var name = window.sessionStorage.getItem('levelName');
  var desc = window.sessionStorage.getItem('levelDesc');
  var id = window.sessionStorage.getItem('levelLoad');
  var idNum = id.split("enterlvl")[1];
  if(!!idNum == false){
    idNum=0;
  }
  //console.log("Name:"+name+" Desc:"+desc+" Id:"+id+" Num:"+idNum);
  var levelTitle = document.getElementById("level");
  levelTitle.value += name;
  var levelDesc = document.getElementById("level_desc");
  levelDesc.value = desc;

}






//LOADER SECTION

loaded = 0;

function contains(str,el){
  matchInd = 0;
  matchLength = 0;
  match=false;
  for(let i =0;i<str.length;i++){
    if(!match){
      match = str[i]==el[0];
      matchInd =0;
      matchLength = 1;
    }else{
      if(str[i]==el[matchLength]){
        matchLength+=1;
      }else if(matchLength==el.length){
        return true;
      }else{
        match=false;
      }
    }
  }
  return match;
}

function parseArray(data){
  endData = [];
  //Level 1 []
  lines = data.split('\n');
  curHeader ="__Default__";
  headerData = []

  for(let i=0; i<lines.length;i++){


    if(contains(lines[i],"__"||i==lines.length-1)){
      //is header

      //append old data to old header.

      endData.push({Header:curHeader,Data:headerData});
      //update to new header.
      headerData=[];
      curHeader=lines[i];
    }else{
      //is not header
      headerData.push(lines[i]);
    }

  }
  if(endData.length>0){
    console.log(endData[0]);
  }
  return endData;

}

function saveTemplate(clone){
  var text="";
  name = clone.querySelector("#template_name").value;
  desc = clone.querySelector("#template_desc").value;
  align = clone.querySelector("#template_alignment").value;
  size = clone.querySelector("#template_size").value;
  ac = clone.querySelector("#template_ac").value;
  hp = clone.querySelector("#template_hp").value;
  speed = clone.querySelector("#template_speed").value;
  str = clone.querySelector("#template_str").value;
  dex = clone.querySelector("#template_dex").value;
  con = clone.querySelector("#template_con").value;
  int = clone.querySelector("#template_int").value;
  wis = clone.querySelector("#template_wis").value;
  cha = clone.querySelector("#template_cha").value;
  skills = clone.querySelector("#template_skills").value;
  abilities= clone.querySelector("#template_abilities").value;
  spells = clone.querySelector("#template_spells").value;
  text+="__Template__:\n";
  text+="#template_name:"+name+"\n";
  text+="#template_desc:"+desc+"\n";
  text+="#template_alignment:"+align+"\n";
  text+="#template_size:"+size+"\n";
  text+="#template_ac:"+ac+"\n";
  text+="#template_hp:"+hp+"\n";
  text+="#template_speed:"+speed+"\n";
  text+="#template_str:"+str+"\n";
  text+="#template_dex:"+dex+"\n";
  text+="#template_con:"+con+"\n";
  text+="#template_int:"+int+"\n";
  text+="#template_wis:"+wis+"\n";
  text+="#template_cha:"+cha+"\n";
  text+="#template_skills:"+skills+"\n";
  text+="#template_abilities:"+abilities+"\n";
  text+="#template_spells:"+spells+"\n";
  text+="__Default__\n";
  console.log("Text:"+text);
  return text;
}
function saveLevelCard(clone){
  var text="";

  name = clone.querySelector("#level_name").innerHTML;
  desc = clone.querySelector("#level_desc").innerHTML;
  text+="__Level__:\n";
  text+="#level_name:"+name+"\n";
  text+="#level_desc:"+desc+"\n";
  text+="__Default__\n";
  return text;
}
//TODO: Work further on levelSave.
function saveLevel(){
  var text="";
  name = document.getElementById("level").value;
  desc = document.getElementById("level_desc").value;
  text+="__Level__:\n";
  text+="#level_name:"+name+"\n";
  text+="#level_desc:"+desc+"\n";

  text+="__Default__\n";
  return text;
}


function save(){
  var a =document.createElement("a");
  text = "Hello world this is a file!";
  console.log("Saving...");
  if(!!document.getElementById("templates")){
    text="";
    curIndex = 1;
    clone = document.getElementById("levelItem");
    text+=saveTemplate(clone);
    console.log("Is Valid?:"+curIndex+":"+!!document.getElementById("levelItem"+curIndex));
    while(!!document.getElementById("levelItem"+curIndex)){
        clone = document.getElementById("levelItem"+curIndex);
        text+=saveTemplate(clone);
        curIndex++;
    }
    a.href = window.URL.createObjectURL(new Blob([text],{type:"text/plain"}));
    a.download = "save.txt";
    a.click();
    console.log("Saved!");

  }else if(!!document.getElementById("levels")){
    
    text="";
    curIndex=1;
    clone = document.getElementById("levelItem");
    text+=saveLevelCard(clone);
    while(!!document.getElementById("levelItem"+curIndex)){
        clone = document.getElementById("levelItem"+curIndex);
        text+=saveLevelCard(clone);
        curIndex++;
    }
    a.href = window.URL.createObjectURL(new Blob([text],{type:"text/plain"}));
    a.download = "save_levels.txt";
    a.click();
    console.log("Saved!");

  }else if(!!document.getElementById("level")){
    text="";
    text+=saveLevel();
    a.href = window.URL.createObjectURL(new Blob([text],{type:"text/plain"}));
    a.download = "save_level.txt";
    a.click();
    console.log("Saved!");
  }






}
/*
window.addEventListener("load", function() {
  document.getElementById("file-upload").onchange = function(event) {
    var reader = new FileReader();
    console.log(event.srcElement.files[0]);
    reader.readAsDataURL(event.srcElement.files[0]);
    var me = this;
    reader.onload = function () {
      var fileContent = reader.result;
      reader.readAsText(event.srcElement.files[0]);
      //console.log(fileContent);
      load(fileContent);

    }

}});*/


function load(data){
  //console.log(data);
  if(loaded <= 1){
    outData = parseArray(data);
    //Check if in list of levels scene
    if(!!document.getElementById("levels")){
      for(let i =0;i<outData.length;i++){
        console.log("Data:"+outData[i].Header);
        if(outData[i].Header=="__Level__:"){
          console.log("LEVELCARD!!!");
          if(loadedLevelsCount != 0){
            clone = createNewLevel();
            applyToCloneLevels(clone,outData[i].Data);

          }else{

            orig = document.getElementById("levelItem");
            console.log(orig);
            applyToCloneLevels(orig,outData[i].Data);
          }
          loadedLevelsCount++;
        }else{
          //heldData.put(outData[i]);
        }
        console.log(outData[i].Header);
      }

    }
    //Check if templates items in scene
    if(!!document.getElementById("templates")){
      //console.log("Loaded:"+loaded);
      for(let i = 0; i < outData.length;i++){
        if(outData[i].Header == "__Template__:"){
          console.log("TEMPLATE!!!");
          if(loadedLevelsCount!=0){
            clone = createNewLevel();
            applyToCloneTemplate(clone,outData[i].Data);
          }else{
            orig = document.getElementById("levelItem");
            applyToCloneTemplate(orig,outData[i].Data);
          }

          loadedLevelsCount++;
        }else{
          //heldData.put(outData[i]);
        }
        console.log(outData[i].Header);
      }
    }
    //Chek if in list of templates page
    if(!!document.getElementById("listTemplates")){

    }

  }

  loaded +=1;
}

function applyToCloneTemplate(clone,data){
  console.log("Applying data:"+data);

  for(let i =0;i<data.length;i++){
    var key = data[i].split(':')[0];
    var v = data[i].split(':')[1];
    console.log("Read{"+key+":"+v+"}");
    clone.querySelector(key).value = v;
  }
  //clone.querySelector("#");
}
function applyToCloneLevels(clone,data){
  console.log("Applying level data:"+data);

  for(let i = 0; i < data.length; i++){
    var key = data[i].split(':')[0];
    var v = data[i].split(':')[1];
    console.log("Read{"+key+":"+v+"}");
    clone.querySelector(key).innerHTML = v;
  }

}


/*function clicked(name){
  console.log("Clicked:"+name);
}*/

function mode(mode){
  console.log("Entering mode:"+mode);
  
  if(mode == "create"){
    document.getElementById("spawnable_card").style.visibility='visible';
    document.getElementById("create_mode_btn").disabled=true;
    document.getElementById("edit_mode_btn").disabled=false;
  }else{
    document.getElementById("spawnable_card").style.visibility='hidden';
    document.getElementById("create_mode_btn").disabled=false;
    document.getElementById("edit_mode_btn").disabled=true;
    
  }
}
if(!!document.getElementById("level"))
  document.getElementById("create_mode_btn").disabled=true;

function deleteAtPath(path){
  delvalue(path);
}


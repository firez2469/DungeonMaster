import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-analytics.js";
import {getDatabase, ref, set, push,update, get,child} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
//import {clicked} from "./custom-code.html";

var playerIconLink = 'https://pic.onlinewebfonts.com/svg/img_235012.png';
var enemyIconLink = 'https://media.discordapp.net/attachments/884300143548063754/985266517744685096/full-face.png';

const firebaseConfig = {
  apiKey: "AIzaSyAOGv3RJqw5T4pPAGDfvwRhoYyI6U5omWs",
  authDomain: "test-1-f3a0b.firebaseapp.com",
  databaseURL: "https://test-1-f3a0b.firebaseio.com",
  projectId: "test-1-f3a0b",
  storageBucket: "test-1-f3a0b.appspot.com",
  messagingSenderId: "800825612650",
  appId: "1:800825612650:web:817df1bd2d25755fd12d13",
  measurementId: "G-KVWPQ6GHFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const dbRef = ref(getDatabase());
var AllTemplates = [];
//entityData if loaded
var entityData=[];
var firebaseReady = false;
var globalLogin = window.sessionStorage.getItem("login");

export {entityData};

//INITIAL LOAD
if(!!document.getElementById("save")){
  //check location
  if(!!document.getElementById("templates")){
    //tempalate
    load(globalLogin,"templates");

  }else if(!!document.getElementById("levels")){
    //level cards
    load(globalLogin,"levels");

  }else if(!!document.getElementById("level")){
    var lvl = window.sessionStorage.getItem('levelLoad');
    //level

    lvl = lvl.split("enter_lvl")[1];
    if(lvl == ""){
      lvl = 0;
    }
    console.log("Loading level:"+lvl);
    load(globalLogin,"levels/"+lvl);
    load(globalLogin,"templates","-level");
    

  }


}

function save(){
  var isTemplates = !!document.getElementById("templates");
  var isLevels = !!document.getElementById("levels");
  var isLevel = !!document.getElementById("level");
  //console.log("Level:"+isLevel);
  //console.log("Levels:"+isLevels);
  if(!!document.getElementById("templates")||isLevel){
    var clone = document.getElementById("levelItem");
    if(isTemplates)
      saveTemplate(globalLogin,clone,0);
    else if(isLevel||isLevels){
      
      var id = window.sessionStorage.getItem('levelLoad');
      //console.log("ID:"+id);
      if(id == "enter_lvl"){
        id = 0;
      }
      else {
        //console.log(id.split('enterlvl'));
        id = id.split('enterlvl')[1];
      }
      //console.log("Final ID:"+id);
      saveLevel(globalLogin,clone,id);
    }


    var curIndex = 1;
    while(!!document.getElementById("levelItem"+curIndex)){
        clone = document.getElementById("levelItem"+curIndex);
        if(isTemplates){
          saveTemplate(globalLogin,clone,curIndex);
        }else if(isLevel||isLevels){
          var id = window.sessionStorage.getItem('levelLoad');
          console.log("Saving for level:"+id);
          saveLevel(globalLogin,clone,id);
        }

        curIndex++;
    }
    if(!!document.getElementById("templates")){
      
      for(let i =1;i<100;i++){
        if(!!document.getElementById("levelItem"+i)){
          saveTemplate(globalLogin,document.getElementById("levelItem"+i),i);
        }else{
          set(ref(database,"/"+globalLogin+"/templates/"+i),{});
        }
      }
    }
    

  }else{
    if(isLevels){
      if(!!document.getElementById("levels")){
      

        for(let i =1;i<100;i++){
          if(!!document.getElementById("levelItem"+i)){
            saveLevels(globalLogin,document.getElementById("levelItem"+i),i);
          }else{
            set(ref(database,"/"+globalLogin+"/levels/"+i),{});
          }
        }
      }

      var firstClone = document.getElementById("levelItem");
      saveLevels(globalLogin,firstClone,0);
      /*var ind = 1;
      while(!!document.getElementById("levelItem"+ind)){
        var clone = document.getElementById("levelItem"+ind);
        saveLevels(globalLogin,clone,ind);
        console.log("Saving level for:"+ind);
        ind++;
      }*/
      //console.log("Saved until level "+ind-1);
    }
  }

}

function saveTemplate(login,clone,ind){
  console.log("Saving template");
  var name = clone.querySelector("#template_name").value;
  console.log("Found value:"+name);
  var desc = clone.querySelector("#template_desc").value;
  var align = clone.querySelector("#template_alignment").value;
  var size = clone.querySelector("#template_size").value;
  var ac = clone.querySelector("#template_ac").value;
  var hp = clone.querySelector("#template_hp").value;
  var speed = clone.querySelector("#template_speed").value;
  var str = clone.querySelector("#template_str").value;
  var dex = clone.querySelector("#template_dex").value;
  var con = clone.querySelector("#template_con").value;
  var int = clone.querySelector("#template_int").value;
  var wis = clone.querySelector("#template_wis").value;
  var cha = clone.querySelector("#template_cha").value;
  var skills = clone.querySelector("#template_skills").value;
  var abilities= clone.querySelector("#template_abilities").value;
  var spells = clone.querySelector("#template_spells").value;
  console.log("Setting:"+name);
  set(ref(database, "/"+login+'/templates/'+ind+"/"), {
    "name":name,
    "desc":desc,
    "align":align,
    "size":size,
    "ac":ac,
    "hp":hp,
    "speed":speed,
    "str":str,
    "dex":dex,
    "con":con,
    "int":int,
    "wis":wis,
    "cha":cha,
    "skills":skills,
    "abilities":abilities,
    "spells":spells
  });
}
function saveLevel(login, clone, ind){
  //query html
  console.log("Saving Level");
  //send to database
  var isLevels = !!document.getElementById("levels");
  var isLevel = !!document.getElementById("level");

  if(isLevel)
    var name = document.getElementById("level").value;
    var desc = document.getElementById("level_desc").value;
    
    console.log("Entity Data:");
    console.log(entityData);
    var length = window.sessionStorage.getItem("level_length");
    var fields = window.sessionStorage.getItem("fields").split(',');
    entityData=new Array(length);
    for(var i =0;i<length;i++){
      entityData[i]={};
      for(var j=0;j<fields.length;j++){
        var item = window.sessionStorage.getItem("level_entity"+i+fields[j]);
        
        entityData[i][fields[j]] = item;
      }
    }
    if(entityData[0]==0){
      entityData={};
    }
    
    set(ref(database, "/"+login+'/levels/'+ind+"/"), {
      "name":name,
      "desc":desc,
      "entityData":entityData
    });
}
function saveLevels(login,clone,ind){
  console.log("Saving levels");
  var name = clone.querySelector("#level_name").innerHTML;
  var desc = clone.querySelector("#level_desc").innerHTML;
  set(ref(database,"/"+login+"/levels/"+ind+"/name/"),name);
  set(ref(database,"/"+login+"/levels/"+ind+"/desc/"),desc);

  /*set(ref(database,"/"+login+"/levels/"+ind+"/"),{
    "name":name,
    "desc":desc
  });*/
}


function load(login,type,optionalParam=undefined){
  
  console.log("Path:/"+login+"/"+type);
  console.log("Optional:"+optionalParam);
  return get(child(dbRef, `/`+login+`/`+type)).then((snapshot) => {
    if (snapshot.exists()) {

      var users = snapshot.val();
      console.log("TYPE:"+type);
      var ind = 0;

      for(const [key,value] of Object.entries(users)){
        if(type == "templates" && optionalParam==undefined){
          if(key!='temp_a'){
            if(key > 0){
              createNewLevel();
            }
            var name = value["name"];
            var desc = value["desc"];
            var align = value["align"];
            var size = value["size"];
            var ac = value["ac"];
            var hp = value["hp"];
            var speed = value["speed"];
            var str = value["str"];
            var dex = value["dex"];
            var con = value["con"];
            var int = value["int"];
            var wis = value["wis"];
            var cha = value["cha"];
            var skills = value["skills"];
            var abilities= value["abilities"];
            var spells = value["spells"];
            //LOAD INTO HTML!!!!
            var _key = key;
            if(key == 0){
              _key = "";
            }
            var clone = document.getElementById("levelItem"+_key);
            clone.querySelector("#template_name").value = name;
            console.log("Found value:"+name);
            clone.querySelector("#template_desc").value = desc;
            clone.querySelector("#template_alignment").value = align;
            clone.querySelector("#template_size").value=size;
            clone.querySelector("#template_ac").value= ac;
            clone.querySelector("#template_hp").value=hp;
            clone.querySelector("#template_speed").value=speed;
            clone.querySelector("#template_str").value=str;
            clone.querySelector("#template_dex").value=dex;
            clone.querySelector("#template_con").value=con;
            clone.querySelector("#template_int").value=int;
            clone.querySelector("#template_wis").value=wis;
            clone.querySelector("#template_cha").value=cha;
            clone.querySelector("#template_skills").value=skills;
            clone.querySelector("#template_abilities").value=abilities;
            clone.querySelector("#template_spells").value=spells;


            console.log("value:"+value["name"]);
          }

        }
        else if(type == "levels"&& optionalParam==undefined){

          if(key != "na"){
            console.log("Level "+ind+":"+value["name"]);
            var name = value["name"];
            var desc = value["desc"];
            var publicIndex = ind;
            if(publicIndex == 0){
              publicIndex="";
            }else{
              createNewLevel();
            }
            var clone = document.getElementById("levelItem"+publicIndex);

            clone.querySelector("#level_name").innerHTML = name;
            clone.querySelector("#level_desc").innerHTML = desc;

          }


          ind++;
        }
        else if(type.includes("level")&& optionalParam==undefined){
          var id = window.sessionStorage.getItem('levelLoad');
          if(key == "name"){
            document.getElementById("level").value = value;
          }else if(key == "entityData"){
            entityData=value;
            firebaseReady=true;
            console.log("Set entity Data pog!");
          }
          else
          {
            var k = "level_"+key;
            document.getElementById(k).value = value;
          }

          console.log("key:"+key);
        }else if(type == "templates"&&optionalParam=="-level"){
          if(key!='temp_a'){
            if(key > 0){
              //createNewLevel();
            }
            
            //LOAD INTO TEMPLATES ARRAY!!!!
            var _key = key;
            if(key == 0){
              _key = "";
            }
            AllTemplates.push(value);

            console.log("value:"+value["name"]);
          }

        
        }
      }
      firebaseReady=true;
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  }).catch((error) => {
    console.error(error);
  });

}


function findUser(path,name){
  return get(child(dbRef, `/`+path)).then((snapshot) => {
    if (snapshot.exists()) {
      //console.log(snapshot.val());
      var users = snapshot.val();
      for(const [key,value] of Object.entries(users)){

        if(key == name){
          console.log("key:"+key,"value:"+value);
        }
      }
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  }).catch((error) => {
    console.error(error);
  });

  //console.log(database);
}

findUser("/users","Bungee");

function setValue(){

  //var data = document.getElementById("firebase_text").value;

  set(ref(database, 'users/Bungee'), {
    "data":"test"
  });

}
function pushValue(){
  // A post entry.
  const postData = {
    "Bungee":0
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(database), 'posts')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/users/'] = postData;
  return update(ref(database), updates);
}


//var btn = document.getElementById("firebase_submit");
//btn.onclick = pushValue();

/*for(const [key,value] of Object.entries(users)){
  console.log("key:"+key,"value:"+value);
}*/
document.getElementById("save").onclick = function(){
  console.log("Saving!!!");
  save();
}


console.log("NO Crash");



window.onload = function(){
  if(!!document.getElementById("templates")||document.getElementById("level")){
    loadTemplates(globalLogin);
  }
  
}


function loadTemplates(login){
  //console.log("loading templates at /"+login);
  get(child(dbRef, `/`+login+"/templates")).then((snapshot) => {
    if (snapshot.exists()) {
      //console.log(snapshot.val());
      var templates = snapshot.val();
      var templateIndex = 0;
      for(const [key,value] of Object.entries(templates)){
        if(value != "na"){
          //console.log("Template Key:"+key,"value:"+value);
          //First template is assigned later ones are copied and assigned.
          if(templateIndex == 0){
            var _temp = document.getElementById("template0_btn");
            
            //_temp.onclick = function(){clicked("template0")};
            var clone = document.getElementById("template0");
            var title = clone.querySelector("#template_name");
            title.innerHTML = value["name"];
            
            //templateIndex++;
          }else{
            console.log("Loading:"+key);
            var original = document.getElementById("template0");
            var clone = original.cloneNode(true);
            let newTempIndex = templateIndex;
           
            clone.id = "template"+newTempIndex;
            
            var icon = clone.querySelector("#template0_btn");
            //console.log("Assigned to:"+newTempIndex);
            //icon.onclick = function(){clicked("template"+newTempIndex);};
            icon.id = "template"+newTempIndex+"_btn";
            var title = clone.querySelector("#template_name");
            title.innerHTML = value["name"];
            document.getElementById("spawnable").appendChild(clone);
            
          }
          templateIndex++;
        }
      }
      return snapshot.val();
    } else {
      console.log("Template No data available");
      return null;
    }
  }).catch((error) => {
    console.error(error);
  });
}

export function createNewObject(template){
  //console.log("Creating "+template);
}

export function loadObjectData(template,level,name){
  //console.log("Loading:"+name+" with template "+template+" @ level "+level);
}
export function setEntityData(data){
  window.sessionStorage.setItem("level_length",data.length);
  
  entityData=[];
  var fields = "";
  for(var i =0;i<data.length;i++){
    
    for(var key in data[i]){
      var value = data[i][key];
      let endValue = value;
      if(key=="img"){
        if(key=="img"){
          if(value.src == playerIconLink){
            endValue = "player";
          }else{
            endValue = "enemy";
          }
        }
        
      }
      window.sessionStorage.setItem("level_entity"+i+key,endValue);
      if(i==0){
        fields+=key+",";
      }
    }

    entityData.push(data[i]);
  }
  fields = fields.substring(0,fields.length-1);

  window.sessionStorage.setItem("fields",fields);
  entityData=data;
  //console.log("Entity Data Set:");
  //console.log(data);
  //console.log(entityData);
 
}

export function getTemplates(){
  return AllTemplates;
}

export function loadedPreviousEntityData(data){
 
  if(firebaseReady){
    data = entityData;
  }else{
    
  }
  let newData = entityData;
  return [firebaseReady,newData];
}


//import {jsSHA} from "https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.2/sha.js";
runLogin();
function runLogin(){
  console.log("Starting");
  if(!!document.getElementById("login-box")){
    var STATE = "LOGIN";

    var registerLinkBtn = document.getElementById("register-link");
    var loginBtn = document.getElementById("submit-id-submit");
    var settingsHeader = document.getElementById("settingTitle");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var errorTxt = document.getElementById("errorMsg");
    errorTxt.style.display = "none";
    registerLinkBtn.onclick = function(){
        if(STATE == "LOGIN"){
            
            STATE = "SIGNUP";
            
            settingsHeader.innerHTML = "Sign Up";
            registerLinkBtn.innerHTML = "Login!";
            registerLinkBtn.parentElement.firstChild.data="Already have an account?";
            loginBtn.innerHTML="Sign up";
        }else{
            
            STATE = "LOGIN";
            settingsHeader.innerHTML="Login";
            registerLinkBtn.innerHTML=  "Sign Up!";
            registerLinkBtn.parentElement.firstChild.data = "Don't have an account?";

            loginBtn.innerHTML="Login";
        }
      
    }
    loginBtn.onsubmit=function(){
      loginClicked();
    }
    
    loginBtn.onclick = function(){
        loginClicked();
        
    }

    function loginClicked(){
      var _email = email.value;
      var hash = toHash(password.value)
      console.log(hash);
      if(STATE == "LOGIN"){
          
        return get(child(dbRef, `/users`)).then((snapshot) => {
          if (snapshot.exists()) {
            //console.log(snapshot.val());
            var users = snapshot.val();
            var loginSuccess = false;
            for(const [key,value] of Object.entries(users)){
              
              if(key != "Bungee"){
                
                var usernameLoaded = value["name"];
                var passLoaded = value["password"];
                if(usernameLoaded==_email&&passLoaded==hash){
                  
                  console.log("Logged in as "+usernameLoaded+"!");
                  loginSuccess=true;
                  window.sessionStorage.setItem("login",usernameLoaded.replace("@","_").replace(".","_"));
                  window.sessionStorage.setItem("loggedIn","true");
                  location.reload(true);
                }
              
              }
            }
            if(!loginSuccess){
              console.log("Incorrect username or password");
              errorTxt.style.display="block";
              errorTxt.innerText = "Incorrect username or password";
            }
            return snapshot.val();
          } else {
            console.log("No data available");
            return null;
          }
        }).catch((error) => {
          console.error(error);
        });

      }else if(STATE == "SIGNUP"){
          alert("Currently Sign up is disabled. Go to form to request access to server.");
      }

    }
    
    function toHash(obj) {
       
        var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
        hashObj.update(obj);
        var hash = hashObj.getHash("HEX");
        
        return hash;
      }
  }
    
}


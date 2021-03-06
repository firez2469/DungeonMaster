    console.log("Starting canvas code");
    import { createNewObject,loadObjectData, setEntityData, getTemplates, loadedPreviousEntityData } from "./FirebaseLoader.mjs";
    import {entityData} from "./FirebaseLoader.mjs";

    //Set initial button onclicks
    var create_mode_btn = document.getElementById("create_mode_btn");
    var edit_mode_btn = document.getElementById("edit_mode_btn");
    create_mode_btn.onclick=function(){
      mode("create");
      setState("create");
    }
    edit_mode_btn.onclick = function(){
      mode("edit");
      setState("edit");
    }

    //TODO:Implement templates with random colors
    //1. Load all templates in spawnable section
    //2. Assign each one a random color (tint) in spawnable
    //3. When a tmplate is selected, change the image that is with cursor.
    //4. When placed down save to placedObjects array.
    //5. Add all new fields (x,y,color,name,desc, and each template fields to save)


    var canvas = document.getElementById("#playersCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";
    ctx.canvas.width = window.innerWidth*.75;
    ctx.canvas.height = window.innerHeight/2;
    var pPosX = 0;
    var pPosY = 0;
    //Needs to be replicated in FirebaseLoader as well.
    var playerIconLink = 'https://pic.onlinewebfonts.com/svg/img_235012.png';
    var enemyIconLink = 'https://media.discordapp.net/attachments/884300143548063754/985266517744685096/full-face.png';


    var typeSelected = "player";

    var img_icon = new Image();
    img_icon.src = playerIconLink;


    var placedObjects=[];
    var templateObjects = [];
    var canvasX;
    var canvasY;
    ctx.fillStyle="#09f";
    var currentColor = ctx.fillStyle;

    var state = "create";

    var playersIndex = 0;

    var selectedNameVar;

    var isDown = false;
    var imgWidth = 20;
    var imgHeight = 20;
    var wasFirebaseLoaded = false;

    window.onload = function(){
      selectedNameVar = document.getElementById("namefield");




    }
    document.getElementById("clearbtn").onclick=function(){
      clearScreen();
    }
    //Represents the index of the selected entity.
    var selectedIndex = -1;

    //setInterval(function(){renderCanvas();},500);
    function renderCanvas(){
      ctx.canvas.width = window.innerWidth*.6;
      ctx.canvas.height = window.innerHeight/2;
      var cRect = canvas.getBoundingClientRect();
      canvasX = Math.round(e.clientX - cRect.left);
      canvasY = Math.round(e.clientY - cRect.top);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      //typeSelected = window.sessionStorage.getItem('type_selected');

      setOnClicks();


      for(let i=0;i<placedObjects.length;i++){
        if(typeof(placedObjects[i]["img"])!="object"){

          var newImg = new Image();
          if(placedObjects[i]["img"]=="player"){
            newImg.src=playerIconLink;
          }else{
            newImg.src = enemyIconLink;
          }

          placedObjects[i]["img"]=newImg;
        }
        //console.log(placedObjects[i])
        draw_img(
          ctx,
          placedObjects[i]["img"],
          placedObjects[i]["color"],
          placedObjects[i]["x"],
          placedObjects[i]["y"],
          imgWidth,
          imgHeight);
      }

      if(state == "create"){
        setImage();
        draw_img(ctx,img_icon,currentColor,canvasX-(imgWidth/2),canvasY-(imgHeight/2),imgWidth,imgHeight);
      }
      else if(state == "edit"){
        if(isDown){
          //console.log("Dragging");
          //console.log(selectedNameVar);
          //console.log(selectedIndex);
          //console.log(placedObjects[selectedIndex]);
          if(dist(parseFloat(placedObjects[selectedIndex]["x"]),parseFloat(placedObjects[selectedIndex]["y"]),canvasX-(imgWidth/2),canvasY-(imgHeight/2)) < 150){
            placedObjects[selectedIndex]["x"]=canvasX-(imgWidth/2);
            placedObjects[selectedIndex]["y"]=canvasY-(imgHeight/2);
          }

        }

      }


      /*ctx.fillStyle=currentColor;
      ctx.fillRect(canvasX-(imgWidth/2),canvasY-(imgHeight/2),imgWidth,imgHeight);

      ctx.globalCompositeOperation="destination-in";
      /*ctx.drawImage(img_icon,
        canvasX-(imgWidth/2),
        canvasY-(imgHeight/2),
        imgWidth,
        imgHeight

      );
      ctx.drawImage(img_icon,canvasX-(imgWidth/2),canvasY-(imgHeight/2),imgWidth,imgHeight);*/



    }

    canvas.addEventListener("mousemove", function(e){
      ctx.canvas.width = window.innerWidth*.6;
      ctx.canvas.height = window.innerHeight/2;
      var cRect = canvas.getBoundingClientRect();
      canvasX = Math.round(e.clientX - cRect.left);
      canvasY = Math.round(e.clientY - cRect.top);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      //typeSelected = window.sessionStorage.getItem('type_selected');

      setOnClicks();


      for(let i=0;i<placedObjects.length;i++){
        if(typeof(placedObjects[i]["img"])!="object"){

          var newImg = new Image();
          if(placedObjects[i]["img"]=="player"){
            newImg.src=playerIconLink;
          }else{
            newImg.src = enemyIconLink;
          }

          placedObjects[i]["img"]=newImg;
        }
        //console.log(placedObjects[i])
        draw_img(
          ctx,
          placedObjects[i]["img"],
          placedObjects[i]["color"],
          placedObjects[i]["x"],
          placedObjects[i]["y"],
          imgWidth,
          imgHeight);
      }

      if(state == "create"){
        setImage();
        draw_img(ctx,img_icon,currentColor,canvasX-(imgWidth/2),canvasY-(imgHeight/2),imgWidth,imgHeight);
      }
      else if(state == "edit"){
        if(isDown){
          //console.log("Dragging");
          //console.log(selectedNameVar);
          //console.log(selectedIndex);
          //console.log(placedObjects[selectedIndex]);
          if(dist(parseFloat(placedObjects[selectedIndex]["x"]),parseFloat(placedObjects[selectedIndex]["y"]),canvasX-(imgWidth/2),canvasY-(imgHeight/2)) < 150){
            placedObjects[selectedIndex]["x"]=canvasX-(imgWidth/2);
            placedObjects[selectedIndex]["y"]=canvasY-(imgHeight/2);
          }

        }

      }


      /*ctx.fillStyle=currentColor;
      ctx.fillRect(canvasX-(imgWidth/2),canvasY-(imgHeight/2),imgWidth,imgHeight);

      ctx.globalCompositeOperation="destination-in";
      /*ctx.drawImage(img_icon,
        canvasX-(imgWidth/2),
        canvasY-(imgHeight/2),
        imgWidth,
        imgHeight

      );
      ctx.drawImage(img_icon,canvasX-(imgWidth/2),canvasY-(imgHeight/2),imgWidth,imgHeight);*/

    });
    canvas.addEventListener("click",function(e){
      setOnClicks();
      isDown=false;
      if(state == "create"){
        var name = getNewName();
        var templateInd=typeSelected;
        if(typeSelected.includes("template")){
          templateInd=typeSelected.split("template")[1];
        }
        var templates = getTemplates();
        var template_vals = templates[templateInd];
        //console.log("applying template data:");
        //console.log(template_vals);
        var placedObjectsElement = {
          "img":img_icon,
          "x":canvasX-(imgWidth/2),
          "y":canvasY-(imgHeight/2),
          "color":currentColor,
          "name":name,
          "desc":"",
          "template":templateInd
        };
        for(var key in template_vals){
          if(key != "name"){
            placedObjectsElement[key] = template_vals[key];
            if(template_vals[key]==undefined||template_vals[key]=="undefined"||template_vals[key]==null){
              if(key != "skills"||key!="abilities"||key!="spells"||key!="desc"){
                placedObjectsElement[key]=10;
              }else{
                placedObjectsElement[key]="N/A";
              }
            }
          }

        }
        placedObjects.push(placedObjectsElement);
        //console.log("Name:"+name);
        currentColor='hsl('+360*Math.random()+', 50%, 50%';
        img_icon=new Image();
        img_icon.src = playerIconLink;
      }else if(state == "edit"){

        //finds closest entity.
        for(var i =0;i<placedObjects.length;i++){
          if(placedObjects[i] != undefined){
            var dist_tot = dist(canvasX,canvasY,parseFloat(placedObjects[i]["x"])+(imgWidth/2),parseFloat(placedObjects[i]["y"])+(imgHeight/2));
            //console.log(placedObjects[i]["x"]);
            //console.log("DIST:"+dist_tot);
           // console.log("Image Size:"+imgWidth);
            if(dist_tot<=imgWidth*0.75){
              updateEntityValues(i,selectedNameVar);
              //get fields
              selectedNameVar = document.getElementById("namefield");
              var descfield = document.getElementById("descfield");
              var acfield = document.getElementById("acfield");
              var hpfield = document.getElementById("hpfield");
              var sizefield = document.getElementById("sizefield");
              var speedfield = document.getElementById("speedfield");
              var strfield = document.getElementById("strfield");
              var dexfield = document.getElementById("dexfield");
              var confield = document.getElementById("confield");
              var intfield = document.getElementById("intfield");
              var wisfield = document.getElementById("wisfield");
              var chafield = document.getElementById("chafield");
              var skillsfield = document.getElementById("skillsfield");;
              var abilitiesfield = document.getElementById("abilitiesfield");
              var spellsfield=document.getElementById("spellsfield");

              //update prev entity based on old data
              if(selectedIndex!=-1){
                placedObjects[selectedIndex]["name"]=selectedNameVar.innerHTML;
                placedObjects[selectedIndex]["desc"] = descfield.innerHTML;
                placedObjects[selectedIndex]["ac"]=acfield.value;
                placedObjects[selectedIndex]["hp"]=hpfield.value;
                placedObjects[selectedIndex]["size"]=sizefield.value;
                placedObjects[selectedIndex]["speed"]=speedfield.value;
                placedObjects[selectedIndex]["str"]=strfield.value;
                placedObjects[selectedIndex]["dex"]=dexfield.value;
                placedObjects[selectedIndex]["con"]=confield.value;
                placedObjects[selectedIndex]["int"]=intfield.value;
                placedObjects[selectedIndex]["wis"]=wisfield.value;
                placedObjects[selectedIndex]["cha"]=chafield.value;
                placedObjects[selectedIndex]["skills"]=skillsfield.value;
                placedObjects[selectedIndex]["abilities"]=abilitiesfield.value;
                placedObjects[selectedIndex]["spells"]=spellsfield.value;
              }

              //update fields with new entity data.
              selectedNameVar.innerHTML = placedObjects[i]["name"];
              descfield.innerHTML=placedObjects[i]["desc"];
              acfield.value = placedObjects[i]["ac"];
              hpfield.value = placedObjects[i]["hp"];
              sizefield.value = placedObjects[i]["size"];
              speedfield.value = placedObjects[i]["speed"];
              strfield.value = placedObjects[i]["str"];
              dexfield.value = placedObjects[i]["dex"];
              confield.value = placedObjects[i]["con"];
              intfield.value = placedObjects[i]["int"];
              wisfield.value = placedObjects[i]["wis"];
              chafield.value = placedObjects[i]["cha"];
              skillsfield.value = placedObjects[i]["skills"];
              abilitiesfield.value = placedObjects[i]["abilities"];
              spellsfield.value = placedObjects[i]["spells"];

              selectedIndex=i;
              //update firebase
              //console.log("Template:"+placedObjects[i]["template"]);
              createNewObject(placedObjects[i]["template"]);
              var curLvl = window.sessionStorage.getItem("levelLoad");
              curLvl = curLvl.replace("enterlvl","");
              loadObjectData(placedObjects[i]["template"],curLvl,placedObjects[i][["name"]]);

            }


          }

        }

      }

      var data =setEntityData(placedObjects);

    });


    canvas.addEventListener("mousedown",function(e){

      isDown=true;
      if(state == "edit"){
        for(var i =0;i<placedObjects.length;i++){
          if(placedObjects[i] != undefined){
            var dist_tot = dist(canvasX,canvasY,parseFloat(placedObjects[i]["x"])+(imgWidth/2),parseFloat(placedObjects[i]["y"])+(imgHeight/2));
            //console.log("DIST:"+dist_tot);
            //console.log("Image Size:"+imgWidth);
            if(dist_tot<=imgWidth*0.75){
              selectedNameVar = document.getElementById("namefield");
              updateEntityValues(i,selectedNameVar);
              if(selectedIndex!=-1){
                placedObjects[selectedIndex]["name"]=selectedNameVar.innerHTML;
              }
              //console.log("Pressed:"+placedObjects[i]["name"]);

              selectedNameVar.innerHTML = placedObjects[i]["name"];
              selectedIndex=i;
            }


          }

        }
      }
    });

    canvas.addEventListener("mouseup",function(e){
      var data =setEntityData(placedObjects);



      isDown=false;
      if(state == "edit"){

      }
    });

    function draw_img(ctx,imgObj,color,x,y,width,height){
      if(imgObj.complete){
        //ctx.fillStyle=color;
        //ctx.fillRect(x,y,width,height);
        //ctx.globalCompositeOperation="destination-in";
        ctx.drawImage(imgObj,x,y,width,height);
      }


    }

    export function setState(newState){
      state=newState;
      var data =setEntityData(placedObjects);

    }

    function clicked(name){
      console.log("Clicked:"+name);
      typeSelected=name;
      console.log("Changed to:"+typeSelected);
    }

    function dist(x1,y1,x2,y2){

      return Math.sqrt(((x1-x2)**2)+((y1-y2)**2));
    }

    function setImage(){
      //console.log("Type:"+typeSelected);
      if(typeSelected == "player"){
        img_icon.src = playerIconLink;

      }else if(typeSelected.includes("template")){
        img_icon.src = enemyIconLink;
      }
    }
    //gets a name with incrementing numbers
    function getNewName(){
      if(typeSelected == "player"){
        playersIndex++;
        return "Player"+playersIndex;
      }else if(typeSelected.includes("template")){


        var newName = "template"+Math.max(typeSelected.replace("template",""),0);
        console.log("searching:"+newName);
        var template_name = document.getElementById(newName).querySelector("#template_name").innerHTML;

        return template_name+placedObjects.length;
      }
      return "entity"+placedObjects.length;
    }

    var p_icon = document.getElementById("player_icon").onclick = function(){clicked("player");}
    console.log(!!p_icon);
    setOnClicks();

    function setOnClicks(){
      var sel = 0;
    //console.log("Loaded");
    //console.log(!!document.getElementById("template"+sel));
    while(!!document.getElementById("template"+sel)){

      let sval = 0;
      sval = sel;
      const selBtn = document.getElementById("template"+sel).querySelector("#template"+sel+"_btn").onclick=function(){
        clicked("template"+sval);
      }
      sel++;
    }
    }

    function updateEntityValues(i,selectedNameVar){
              selectedNameVar = document.getElementById("namefield");
              var descfield = document.getElementById("descfield");
              var acfield = document.getElementById("acfield");
              var hpfield = document.getElementById("hpfield");
              var sizefield = document.getElementById("sizefield");
              var speedfield = document.getElementById("speedfield");
              var strfield = document.getElementById("strfield");
              var dexfield = document.getElementById("dexfield");
              var confield = document.getElementById("confield");
              var intfield = document.getElementById("intfield");
              var wisfield = document.getElementById("wisfield");
              var chafield = document.getElementById("chafield");
              var skillsfield = document.getElementById("skillsfield");;
              var abilitiesfield = document.getElementById("abilitiesfield");
              var spellsfield=document.getElementById("spellsfield");

              //update prev entity based on old data
              if(selectedIndex!=-1){
                placedObjects[selectedIndex]["name"]=selectedNameVar.innerHTML;
                placedObjects[selectedIndex]["desc"] = descfield.innerHTML;
                placedObjects[selectedIndex]["ac"]=acfield.value;
                placedObjects[selectedIndex]["hp"]=hpfield.value;
                placedObjects[selectedIndex]["size"]=sizefield.value;
                placedObjects[selectedIndex]["speed"]=speedfield.value;
                placedObjects[selectedIndex]["str"]=strfield.value;
                placedObjects[selectedIndex]["dex"]=dexfield.value;
                placedObjects[selectedIndex]["con"]=confield.value;
                placedObjects[selectedIndex]["int"]=intfield.value;
                placedObjects[selectedIndex]["wis"]=wisfield.value;
                placedObjects[selectedIndex]["cha"]=chafield.value;
                placedObjects[selectedIndex]["skills"]=skillsfield.value;
                placedObjects[selectedIndex]["abilities"]=abilitiesfield.value;
                placedObjects[selectedIndex]["spells"]=spellsfield.value;
              }
              //console.log("Pressed:"+placedObjects[i]["name"]);
              //update fields with new entity data.
              selectedNameVar.innerHTML = placedObjects[i]["name"];
              descfield.innerHTML=placedObjects[i]["desc"];
              acfield.value = placedObjects[i]["ac"];
              hpfield.value = placedObjects[i]["hp"];
              sizefield.value = placedObjects[i]["size"];
              speedfield.value = placedObjects[i]["speed"];
              strfield.value = placedObjects[i]["str"];
              dexfield.value = placedObjects[i]["dex"];
              confield.value = placedObjects[i]["con"];
              intfield.value = placedObjects[i]["int"];
              wisfield.value = placedObjects[i]["wis"];
              chafield.value = placedObjects[i]["cha"];
              skillsfield.value = placedObjects[i]["skills"];
              abilitiesfield.value = placedObjects[i]["abilities"];
              spellsfield.value = placedObjects[i]["spells"];

              selectedIndex=i;
              //update firebase
              //console.log("Template:"+placedObjects[i]["template"]);
              createNewObject(placedObjects[i]["template"]);
              var curLvl = window.sessionStorage.getItem("levelLoad");
              curLvl = curLvl.replace("enterlvl","");
              loadObjectData(placedObjects[i]["template"],curLvl,placedObjects[i][["name"]]);
    }

    function checkAndLoadFromFirebase(){

      if(!wasFirebaseLoaded){
        var output = loadedPreviousEntityData(placedObjects);
        //console.log("Loaded:");
        //console.log(entityData);
        placedObjects=entityData;
        wasFirebaseLoaded=output[0];
        clearInterval();
      }
      return wasFirebaseLoaded;
    }
    setInterval(checkAndLoadFromFirebase,500);

    function clearScreen(){
      placedObjects=[];
      playersIndex=0;

    }

    setEntityData(placedObjects);

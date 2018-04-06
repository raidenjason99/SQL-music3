function albums(json) {
  var o = document.getElementById("output");
  for(var e=0;e<json.length;e++) {
    o.innerHTML += json[e].album + "<br>";
  }
}


function artistCallback(json)
    {
    //  console.log(JSON.stringify(json));
      var nam = document.getElementById("output");
      var select =buildArtistPullDown(json);
      nam.appendChild(select);
      access("select distinct year from collection" ,yearCallback);
    }



function yearCallback(json)
{
  //console.log(JSON.stringify(json));
  var name2 = document.getElementById("output");
  var select2 = buildYearPullDown(json);
  console.log(select2);
  name2.appendChild(select2);
  var btn = document.createElement("button");
  var t = document.createTextNode("find")
       btn.appendChild(t);
    //btn.innerHTML="find";
    btn.onclick = find;
    name2.appendChild(btn);

  //var dez = document.getElementById("output");
  //output.innerHTML="find";
}

function go(){
  access("select a distinct artist from collection order by artist",artistCallback);
}

function find(json)
{
  //alert("hook me up");


    var z = document.getElementById("artist").selectedIndex; // artistCallback
    var y = document.getElementById("year").selectedIndex; // years
    var o = document.getElementById("artist");
    var p = document.getElementById("year");

  var arts = o[z].text;
  var yrs = p[y].text;

 if (z == 0 && y == 0)
  {
     access("select * from collection", displayCallback);

  }
  else if ( y != 0) // year
 {
  access("select * from collection where year= " +yrs, displayCallback);
  alert(yrs);
}
  else if ( z != 0 ){ // artist
    //console.log("select * from collection where artist = '"+arts+"'");
    access("select * from collection where artist= '"+arts+"'", displayCallback);
    alert(arts);
}

  else if( y!=0 && z != 0){
    alert(arts +"  " +yrs);
    //console.log("select * from collection where artist= "+arts+" and year= "+yrs);
    access("select * from collection where artist = '" + arts + "' and year = "+ yrs, displayCallback);

  }

}


function displayCallback(json){

  //a-lert ("displayCallback: " + JSON.stringify(json));

  var results = document.getElementById("results");
  while (results.firstchild)
  {
  results.removeChild(results.firstChild);
}
  for (var e=0; e<json.length; e++)

  {

    var div = document.createElement("div");
    var img = document.createElement("img");
    img.setAttribute("width" , "100");
    img.setAttribute("height" ,"100");
    img.setAttribute("src",json[e].cover);
    div.appendChild(img);

    var span = document.createElement("span");
    span.innerHTML =  json[e].album+ " "+json[e].price;
    div.appendChild(span);

    var button=document.createElement("button");
    button.innerHTML="Purchase";
    span.appendChild(button);
    var id = json[e].id;
    button.setAttribute("onclick","purchase("+id+" )");
    div.appendChild(button);

    results.appendChild(div)

   }

  }

  //function purchase(id)  {
    //alert("purchase id " + id);
//  }
function purchase(id){

  ///alert(typeof id +" jfkdsljflkdsf");
  var id2 = JSON.stringify(id);
  access("select price,album,number,id from collection where id=" +id2, purchaseCallback);
}

 function purchaseCallback(json)
 {
   alert("I am here purchase Callback");
  var number = 0;

  if ( json[0].number < 1){
    alert("sorry the item is out of stock.");
  }
    else {
         alert("you are going to be charged at: "+json[0].price+" for"+json[0].album+"");
         //var newaccess = json[0].number - 1;
         var accesstring = "update collection set number= number-1 where id="+json[0].id;
         access(accesstring,null);
         //alert("the quantity on hand is"+ newaccess);

    }

 }

 //function artistCallback(json){
   //buildArtistPullDown(json);

 //}



    function buildArtistPullDown(json)
    {

      var s = document.createElement("select");
      s.setAttribute("id", "artist");


      var h = document.createElement("option");
      h.innerHTML = "<b>Artists</b>";
      s.appendChild(h);

      for(var i=0; i < json.length; i++)
      {
        var v = json[i].artist;

        var q = document.createElement("option");
        q.innerHTML = v;
        s.appendChild(q);
      }

      return s;
    }




function buildYearPullDown(json)
{
  var d =document.createElement("select");

  d.setAttribute("id", "year");

  var l = document.createElement("option");
  l.innerHTML = "<b>Year<b>";

  d.appendChild(l);

  for (var i = 0; i < json.length; i++)
  {
    var k = json[i].year;
    var p = document.createElement("option");
    p.innerHTML=k;
    d.appendChild(p);
  }
  return d;
}


function go()
{
  access("select distinct artist from collection order by artist", artistCallback);
}


var ajax;
var acallback=null;
function access(query, callback)
{
  acallback = callback;
  ajax = new XMLHttpRequest();
  ajax.onreadystatechange = ajaxProcess;
  ajax.open("GET", "http://127.0.0.1:8000/sql?query=" + query); ajax.send(null);
}
function ajaxProcess() {
  if((ajax.readyState == 4)&&(ajax.status == 200)){
    ajaxCompleted(ajax.responseText)
  }
}

function ajaxCompleted(text) {
  var output = document.getElementById("output");
  if(acallback != null) {
    var data = JSON.parse(text);
    acallback(data);
  }
}

window.onload=go;

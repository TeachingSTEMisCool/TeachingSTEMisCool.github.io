//"Import" root
function getRootValue(v) {
  let root = document.querySelector(':root');
  //v = variable
  let rootS = getComputedStyle(root);
  //Reuse RootS for optimization
  rootS = rootS.getPropertyValue(v);
  return rootS;
}

function setRootValue(v, setTo) {
  let root = document.querySelector(':root')
  //v = variable
  root.style.setProperty(v, setTo);
}
// Get help popup elements
const hlp_icn = document.getElementById("hlp_icn");
const cls = document.getElementById("cls_hlp")
const hlp_txt_container = document.getElementById("hlp_txt");
//Easy access to help text here.
let hlp_txt = "Click the choose a filter button to see the different options available. When you choose a filter you will see every partner that offers what you have selected, the default option shows everything. Click the contact name of a partner to see extra info for that partner. Click the 	&#x1f5b6; button in order to open a window that will print the table."

hlp_txt_container.innerHTML = hlp_txt;

hlp_icn.addEventListener("click", function() {
  hlp_popup.style.display = "block";
  overlay.style.display = "block";
});

cls.addEventListener("click", function() {
  hlp_popup.style.display = "none";
  overlay.style.display = "none";
});
//Calculate how much space help text will take up
//Honestly I just copy and pasted this off stack overflow
function getTextWidth(inputText) {

  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  return context.measureText(inputText);
}

let hlp_width = getTextWidth(hlp_txt).width

let HelpHeight = Math.sqrt((hlp_width*2)*(28/*Tinker with this number if the help text doesn't fit*/)/2)

//Set values
setRootValue("--ViewWidth", window.innerWidth + "px");
setRootValue("--ViewHeight", window.innerHeight + "px");

//If the size of the window cannot hold everything in the navbar, hide it
if (parseInt(getRootValue("--ViewWidth").replaceAll("px", "")) < (document.getElementsByClassName("NavItems").length * 66)) {
  document.getElementById("Navbar").style.display = "none";
}

window.onresize = function() {
  setRootValue("--ViewWidth", window.innerWidth + "px");
  setRootValue("--ViewHeight", window.innerWidth + "px");
  //If the size of the window cannot hold everything in the navbar, hide it... again
  if (parseInt(getRootValue("--ViewWidth").replaceAll("px", "")) < (document.getElementsByClassName("NavItems").length * 66)) {
    document.getElementById("Navbar").style.display = "none";
  } else {
    document.getElementById("Navbar").style.display = "inline";
  }
}

setRootValue("--HelpHeight", HelpHeight +'px');

//Error details stuffs down here
const cls_err = document.getElementById('cls_err_msg');
const cls_err_details = document.getElementById('cls_err_details');
const getDetails = document.getElementById('SeeErrorDetails');

cls_err.addEventListener('click', function(){
  document.getElementById('AWSError').style.display = 'none';
});

cls_err_details.addEventListener('click', function(){
  document.getElementById('ErrorDetailsBox').style.display = 'none';
});

getDetails.addEventListener('click', function(){
  document.getElementById('ErrorDetailsBox').style.display = 'block';
});
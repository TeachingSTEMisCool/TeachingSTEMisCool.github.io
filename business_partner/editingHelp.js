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
let hlp_txt = "Click the second to the left icon to add a partner, or the third to the left in order to remove a partner."

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

let HelpHeight = Math.sqrt((hlp_width*2)*(40/*Tinker with this number if the help text doesn't fit*/)/2)


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
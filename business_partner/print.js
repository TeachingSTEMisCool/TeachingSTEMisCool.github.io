const print_icn = document.getElementById("print");
const printWarningPopup = document.getElementById("prntWrningPopup");
const cls_warning = document.getElementById("cls_prnt_wrning");
const printAnyway = document.getElementById('printAnyway');

//Ripped from stack overflow
function printDiv(data) {
  let divToPrint = document.getElementById(data);
  let popupWin = window.open('', '_blank', 'width=300,height=300');
  popupWin.document.open();
  popupWin.document.write('<head> <meta charset="utf-8"> <title>WHHS CTE Partners</title> <link rel="stylesheet" href="style.css"> </head>');
  popupWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</html>');
  popupWin.print();
  popupWin.close();
}

function createWarningPopup(){
  overlay.style.display = "block";
  printWarningPopup.style.display = "block";
}

cls_warning.addEventListener('click', function(){
  overlay.style.display = "none";
  printWarningPopup.style.display = "none";
});

print_icn.addEventListener('click', function() {
  if (drp_prm.options[drp_prm.selectedIndex].text == "Choose a filter"){
    createWarningPopup();
  } else {
    printDiv('dynamicTable');
  }
});

printAnyway.addEventListener('click', function(){
    printDiv('dynamicTable');
});
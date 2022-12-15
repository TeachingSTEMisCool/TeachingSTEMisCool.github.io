//"Import" Root
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

//Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:757f4a4c-5d84-473d-8dfd-209ea223f4de'
});
const ddb = new AWS.DynamoDB();
const params = {
  TableName: 'WHHS_CTE_Partners'
};

//Define Removed Items
let RemovedItems;
function DefineItems(data) {
  //Reset arrays
  let Items = [];
  let RemovedItems = [];
  let AllItems = [];
    // Save original data.Items
    let v = data.Items;
    //fill Items with everything from database
    for (data.Items in data.Items[0]) {
      Items.push(data.Items);
      AllItems.push(data.Items);
    }
    //Bring back original data.Items
    data.Items = v;
    
    //Find everything in data.Items[0] that holds a string
    for (let x = 0; x < Items.length; x++) {
      if (typeof data.Items[0][Items[x]].S != "undefined") {
        RemovedItems.push(x);
      }
    }
    //Remove all strings from Items
    for (let x = RemovedItems.length; x > 0; x--) {
      Items.splice(RemovedItems[x - 1], 1);
    }
    Items = [Items, RemovedItems, AllItems]
  return Items;
  }


//Extra info upon click on td_3
function AddOrRemoveXtraInfoPopup(data, Selected) {
  let cls = document.getElementById("cls_xtra_info")
  let overlay = document.getElementById("overlay")
  let popup = document.getElementById('xtra_info_popup')
  let xtraInfo = document.getElementById("xtra_info_txt_container")
  xtraInfo.innerHTML = ""
  overlay.style.display = "none";
  popup.style.display = "none";
  let SelectedPartner = 0;
  //Find name of selected partner
  if (data.Items[0]['Partner Name'].S != Selected) {
    for (let x = 0; data.Items[x]['Partner Name'].S != Selected; x++) {
      SelectedPartner = x + 1;
    }
  }
  //Find all items with strings
  let x=0;
  let RemovedItems = DefineItems(data)[1];
  let AllItems = DefineItems(data)[2];
  let ExtraInfo = [];
  let AllStrings = [];
  //Sort through all Items
  while (x<AllItems.length){
    //Check if xth item contains a string
    if (data.Items[SelectedPartner][AllItems[x]].S != null){
      //Check if item is contact name, partner name, or partner description
      let RemovedInfo = ["Contact_Name", "Partner Name", "Partner_Description"]
      if (!RemovedInfo.includes(AllItems[x])){
        ExtraInfo.push(data.Items[SelectedPartner][AllItems[x]].S)
        AllStrings.push(AllItems[x])
      }
    }
    x++
  }
  
  //Fill extra info
  for (let x=0; x<ExtraInfo.length;x++) {
    let extra_info = document.createElement('EI');
    xtraInfo.appendChild(extra_info);
    extra_info.appendChild(document.createTextNode(AllStrings[x].replaceAll("_", " ") + ": " + ExtraInfo[x]));
    //Add three line breaks
    for (let x = 0; x<3; x++) {
      extra_info.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "br"));
    }
    setRootValue("--xtraInfoHeight", x*118+"px")
  }
  //Show extra info
  popup.style.display = "block";
  overlay.style.display = "block";
  //Wait for popup to be closed
  cls.addEventListener("click", function() {
    popup.style.display = "none";
    overlay.style.display = "none";
  });
}


//Fill dropdown from database
const drp_prm = document.getElementById("drp_prm");

function CreateDropdown(data) {
  let Items = DefineItems(data)[0];
  let drp_prm = document.getElementById("drp_prm")
  //Run through the options for a partner(ie. judging)
  for (let x =0; x<Items.length; x++) {
      let newOption = new Option(Items[x].replaceAll('_', ' '), x)
      drp_prm.appendChild(newOption)
  }
}


//Fill table from database

function CreateTable() {
  document.getElementById("dynamicTable").innerHTML.text = "";
  ddb.scan(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      document.getElementById('AWSError').style.display = 'block';
      let Details = document.getElementById('ErrorDetailsTxtTable');
      Details.innerHTML.text = err;
    } else {
      CreateDropdown(data)
      let Items = DefineItems(data)[0];

      let myTableDiv = document.getElementById("dynamicTable");

      let table = document.createElement('TABLE');

      myTableDiv.innerHTML = '';

      let tableBody = document.createElement('TBODY');
      table.appendChild(tableBody);

      //Create header
      //TR = table row
      //TH = table header

      //Create partner name column
      let tr_head_1 = document.createElement('TR');
      tableBody.appendChild(tr_head_1);
      let th_head_1 = document.createElement('TH');
      th_head_1.width = '120';
      th_head_1.appendChild(document.createTextNode('Partner Name'));
      tr_head_1.appendChild(th_head_1);
      //Create partner description column
      let tr_head_2 = document.createElement('TR');
      tableBody.appendChild(tr_head_2);
      let th_head_2 = document.createElement('TH');
      th_head_2.width = '400';
      th_head_2.appendChild(document.createTextNode('Partner Description'));
      tr_head_1.appendChild(th_head_2);
      //Create contact name column
      let tr_head_3 = document.createElement('TR');
      tableBody.appendChild(tr_head_3);
      let th_head_3 = document.createElement('TH');
      th_head_3.width = '200';
      th_head_3.appendChild(document.createTextNode('Contact Name'));
      tr_head_1.appendChild(th_head_3);

      //Create xth header
      if (drp_prm.options[drp_prm.selectedIndex].value != "Default") {
        let tr_head_x = document.createElement('TR');
        tableBody.appendChild(tr_head_x);
        let th_head_x = document.createElement('TH');
        th_head_x.width = '200'; th_head_x.appendChild(document.createTextNode(drp_prm.options[drp_prm.selectedIndex].text));
        tr_head_1.appendChild(th_head_x);
      }
      else if (drp_prm.options[drp_prm.selectedIndex].value == "Default") {
        let i = 0
        while (i < Items.length ){
          //Create a header
          let tr_head_x = document.createElement('TR');
          tableBody.appendChild(tr_head_x);
          let th_head_x = document.createElement('TH');
          th_head_x.width = '200'; th_head_x.appendChild(document.createTextNode(Items[i].replaceAll('_', ' ')));
          tr_head_1.appendChild(th_head_x);
          i++
        }
        setRootValue("--BodyWidth", (((i+2)*200)-20)+"px");
      }

      for (let i = 0; i < data.Items.length; i++) {
        let tr = document.createElement('TR');
        tableBody.appendChild(tr);
        if (drp_prm.options[drp_prm.selectedIndex].value != "Default") {
          if (data.Items[i][drp_prm.options[drp_prm.selectedIndex].text.replaceAll(' ', '_')].BOOL) {
            //Populate header
            //TD = table data / cell
            let td_1 = document.createElement('TD');
            td_1.width = '75';
            td_1.appendChild(document.createTextNode(data.Items[i]['Partner Name'].S));
            tr.appendChild(td_1);
            let td_2 = document.createElement('TD');
            td_2.width = '150';
            td_2.appendChild(document.createTextNode(data.Items[i]['Partner_Description'].S));
            tr.appendChild(td_2);
            let td_3 = document.createElement('TD');
            td_3.width = '150';
            td_3.appendChild(document.createTextNode(data.Items[i]['Contact_Name'].S));
            tr.appendChild(td_3);

            td_3.addEventListener("click", function() {
              AddOrRemoveXtraInfoPopup(data, tr.firstChild.innerHTML);
            });
            //Populate the xth column


            let td_x = document.createElement('TD');
            td_x.width = '75';
            td_x.appendChild(document.createTextNode("Yes"));
            tr.appendChild(td_x);
          }
        } else if (drp_prm.options[drp_prm.selectedIndex].value == "Default") {
          //Populate partner name column
          let td_1 = document.createElement('TD');
          td_1.width = '75';
          td_1.appendChild(document.createTextNode(data.Items[i]['Partner Name'].S));
          tr.appendChild(td_1);

          let td_2 = document.createElement('TD');
          td_2.width = '150';
          td_2.appendChild(document.createTextNode(data.Items[i]['Partner_Description'].S));
          tr.appendChild(td_2);
          let td_3 = document.createElement('TD');
          td_3.width = '150';
          td_3.appendChild(document.createTextNode(data.Items[i]['Contact_Name'].S));
          tr.appendChild(td_3);
          td_3.addEventListener("click", function() {
            AddOrRemoveXtraInfoPopup(data, tr.firstChild.innerHTML);
          });
          /*
          i = partner index
          x = partner data
          */
          for (let x = 0; x < Items.length; x++) {
            let td_x = document.createElement('TD')
            td_x.width = '75';
            let z;
            if (data.Items[i][Items[x]].BOOL) {
              z = "Yes"
            } else {
              z = "No"
            }
            td_x.appendChild(document.createTextNode(z));
            tr.appendChild(td_x);
          }

        }

        myTableDiv.appendChild(table);

      }
    }
  }
  )
}
drp_prm.addEventListener("change", function() { CreateTable() });
CreateTable();
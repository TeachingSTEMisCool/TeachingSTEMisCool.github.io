const Key = document.getElementById('Key').innerHTML;
//Get Buttons
const AddPartnerBtn = document.getElementById('addPartner');
const DeletePartnerBtn = document.getElementById('deletePartner');
const AddColumnBtn = document.getElementById('addColumn');
//Initialize the Amazon Cognito credentials provider

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: Key
});
let params = {
  TableName: 'WHHS_CTE_Partners'
}
const ddb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

let dataFull

ddb.scan(params, function(err, data) {
  if (err){
    console.log('err', err)
  }else{
    dataFull = data
  }
});

DeletePartnerBtn.addEventListener('click', function DeletePartner(){
  //Prompt for which partner
  Part2Del = prompt("Which partner would you like to delete?"); //Replace with buttons for each partner later
  //Delete it
  params = {
    TableName: 'WHHS_CTE_Partners',
    Key: {
      'Partner Name': {S: Part2Del}
    }
  }
  // Call DynamoDB to delete the item from the table
  ddb.deleteItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
});

AddPartnerBtn.addEventListener('click', function AddPartner() {
  let Item = {};
  let attributes = [];
  //Look through partner 0 as a default
  let ref = dataFull.Items[0];
  //Prompt for each item within partner (ie. name, address, judging, etc.)
  for (Items in ref){
    attributes.push(Items)
  }
  ref = dataFull.Items[0]

  let window = document.getElementById('window');
  window.style.border = '2px solid black;';

  let Bools = [];
  for (let i=0; i<attributes.length; i++){
    if (Object.keys(ref[attributes[i]]) == 'BOOL'){
      Bools.push(attributes[i]);
      let BoolQueryLabel = document.createElement('label');
      let BoolQuery = document.createElement('input');
      BoolQuery.type ='checkbox';
      BoolQuery.id = attributes[i];
      BoolQuery.name = attributes[i];
      BoolQuery.value = attributes[i];
      BoolQueryLabel.for = attributes[i];
      BoolQueryLabel.innerHTML = attributes[i].replaceAll('_', ' ');
      window.appendChild(BoolQuery);
      window.appendChild(BoolQueryLabel);
      window.appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "br"));
    }else if (Object.keys(ref[attributes[i]]) == 'S'){
      let Str;
      function promptForStr(){
        let string = prompt (attributes[i].replaceAll('_', ' ') + '?');
        if (string != ''){
          Str = string;
        }else{
          console.log('Invalid Input');
          promptForStr();
        }
      }
      promptForStr();
      Item[attributes[i]] = {S: Str}
    }
  }
  let submit = document.createElement('input');
  submit.type = 'submit';
  window.appendChild(submit)
  submit.addEventListener('click', function(){
    //window.style.display = 'none';
    //Get what the checkboxes are
    for(let i = 0; i<Bools.length; i++){
      let checkbox = document.getElementById(Bools[i])
      Item[Bools[i]] = {BOOL: checkbox.checked}
    }
    //Send to AWS
    params = {
      TableName: 'WHHS_CTE_Partners',
      Item
      };
    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
    window.innerHTML = "";
    window.style.border = '0px';
  });
});


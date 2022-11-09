let btn = document.getElementById("btn");

btn.addEventListener("click", function(){
  const output = document.getElementById("output");
  const radios = document.getElementsByName("choice");
  let choice;
  for (let i = 0; i < radios.length; i++){
    if (radios[i].checked){
      choice = radios[i].value;
    }
  }
  const message = document.getElementById("message").value;
  const key = document.getElementById("key").value;
  let result;
  if (choice == "encrypt"){
    result = encrypt(message, key);
  } else if (choice == "decrypt"){
    result = decrypt(message, key);
  } else {
    console.log("Uh oh!");
  }
  output.innerHTML = 'Encrypted/Decrypted Message: "' + result + '"';
});

function encrypt(message, key){
  let encryption = "";
  const keyNum = Number(key);
  for (let i = 0; i < message.length; i++){
    let ascii = Number(message[i].charCodeAt());
    ascii = ((ascii + keyNum - 32) % 94) + 32;
    encryption += String.fromCharCode(ascii);
  }
  return encryption;
}

function decrypt(message, key){
  let encryption = "";
  const keyNum = Number(key);
  for (let i = 0; i < message.length; i++){
    let ascii = Number(message[i].charCodeAt());
    let temp = (ascii - keyNum - 32) % 94;
    if (temp < 0){
      temp += 94;
    }
    ascii = temp + 32;
    encryption += String.fromCharCode(ascii);
  }
  return encryption;
}
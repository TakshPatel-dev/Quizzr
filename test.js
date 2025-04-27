const params = new URLSearchParams({
    a: "Taksh",
    b: "Patel",
    c: "kumar"
});
var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
console.log(params.toString())

const txtCustomerAccount = $("#txt-customer-account");
const txtDate = $("#txt-meter-date");
const txtValue = $("#txt-meter-value");
const btnSave = $("#btn-save");
const API_BASE_URL = "http://localhost:8080/app/api/v1/";

[txtCustomerAccount,txtDate,txtValue].forEach(elm=>{
    elm.addClass('animate__animated');
})

btnSave.on('click',()=>{
    saveCustomer();
})

function saveCustomer() {
    if (!isValid()) return;

    const accountNumber = txtCustomerAccount.val().trim();
    const date = txtDate.val().trim();
    const value = txtValue.val().trim();

    const reading = {accountNumber,date,value}

    const jqxhr = $.ajax(`${API_BASE_URL}meter`,{
        method:'POST',
        contentType:'application/json',
        data: JSON.stringify(reading)
    });

    jqxhr.done(()=>{
        resetInputs(true);
        alert("Successfully Saved!");
        console.log("success");
    });
    jqxhr.fail((err)=>{
        alert("Customer Account Number Not Found! Please enter a correct account number");
        txtCustomerAccount.trigger('select');
        console.log(err);
    })
}

function isValid() {
    const customerAccount = txtCustomerAccount.val().trim();
    const date = txtDate.val().trim();
    const value = txtValue.val().trim();
    let valid = true;
    resetInputs();
    if (!value){
        valid = validate(txtValue,"Reading Should not be empty");
    }else if(value<=0){
        valid = validate(txtValue,"Reading should be positive");
    }
    if (!date){
        valid = validate(txtDate,"Date can not be empty");
    }
    if (!customerAccount){
        valid = validate(txtCustomerAccount,"Customer Account number can not be empty");
    }else if (!/\d{8}/.test(customerAccount)){
        valid = validate(txtCustomerAccount,"Invalid Customer Account Number");
    }
    return valid;
}

function validate(txt,msg){
    txt.next().text(msg)
    setTimeout(()=>txt.addClass("animate__shakeX is-invalid"))
    txt.trigger('focus');
    return false;
}

function resetInputs(clear) {
    [txtCustomerAccount,txtDate,txtValue].forEach(txt=>{
        txt.removeClass("animate__shakeX is-invalid")
        if (clear) txt.val("");
    })
}


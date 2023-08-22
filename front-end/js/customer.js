const txtSearch = $("#txt-search");
const txtLastDate = $("#txt-last-date");
const txtPreviousDate = $("#txt-previous-date");
const txtLastReading = $("#txt-last-reading");
const txtPreviousReading = $("#txt-previous-reading");
const txtFixedCharge = $("#txt-fixed-charge");
const txtFirstRange = $("#txt-first-range");
const txtSecondRange = $("#txt-second-range");
const txtThirdRange = $("#txt-third-range");
const txtTotal = $("#txt-total");
const btnSearch = $("#btn-search")
const API_BASE_URL = "http://localhost:8080/app/api/v1/";

btnSearch.on('click',()=>{
    const accountNumber = txtSearch.val().trim();
    if (!/\d{8}/.test(accountNumber)){
        alert("Invalid Customer Account Number")
        return;
    }
    getBillDetails()
})

function getBillDetails(){
    const q = txtSearch.val().trim();
    const jqxhr = $.ajax(`${API_BASE_URL}meter?q=${q}`,{
        method:'GET'
    })

    jqxhr.done((readingList)=>{
        console.log(readingList);
        if (!readingList){
            alert("No records found");
            return;
        }
        calculateBill(readingList);
    })
    jqxhr.fail(()=>{
        alert("No Account found")
    })
}

function calculateBill(readingList) {
    const lastDate = readingList[0].date;
    const lastValue = readingList[0].value;
    const previousDate = readingList[1].date;
    const previousValue = readingList[1].value;

    const dateDifference = (lastDate-previousDate)/86400000;
    console.log(dateDifference);
    const readingDifference = lastValue-previousValue;
    const firstRange = dateDifference;
    const secondRange = firstRange + dateDifference*2;

    const firstRangeFixed = 500;
    const firstRangeUnit = 20;
    const secondRangeFixed = 1000;
    const secondRangeUnit = 35;
    const thirdRangeFixed = 1500;

    let fixedAmount=0;
    let firstRangeAmount=0;
    let secondRangeAmount=0;
    let thirdRangeAmount=0;
    let totalAmount=0;

    if (readingDifference<=firstRange){
        fixedAmount = firstRangeFixed;
        firstRangeAmount = firstRangeUnit*readingDifference;
        totalAmount = fixedAmount + firstRangeAmount;
    }else if (readingDifference<=secondRange){
        fixedAmount = secondRangeFixed;
        firstRangeAmount = firstRange * firstRangeUnit;
        secondRangeAmount = (readingDifference-firstRange) * secondRangeUnit;
        totalAmount = fixedAmount + firstRangeAmount + secondRangeAmount;
    }else{
        fixedAmount = thirdRangeFixed;
        firstRangeAmount = firstRange * firstRangeUnit;
        secondRangeAmount = (secondRange-firstRange) * secondRangeUnit;
        for (let i=0;i<(readingDifference-secondRange);i++){
            thirdRangeAmount += 40 + i;
        }
        totalAmount = fixedAmount + firstRangeAmount + secondRangeAmount + thirdRangeAmount;
    }
    const reading = {lastDate,previousDate,lastValue,previousValue,fixedAmount,firstRangeAmount,secondRangeAmount,thirdRangeAmount,totalAmount};
    viewDetails(reading);
}

function viewDetails(reading) {
    txtLastDate.val(new Date(reading.lastDate).toString().substring(0,16));
    txtPreviousDate.val(new Date(reading.previousDate).toString().substring(0,16));
    txtLastReading.val(reading.lastValue);
    txtPreviousReading.val(reading.previousValue);
    txtFixedCharge.val(`Rs.${reading.fixedAmount}.00`);
    txtFirstRange.val(`Rs.${reading.firstRangeAmount}.00`);
    txtSecondRange.val(`Rs.${reading.secondRangeAmount}.00`);
    txtThirdRange.val(`Rs.${reading.thirdRangeAmount}.00`);
    txtTotal.val(`Rs.${reading.totalAmount}.00`);
}





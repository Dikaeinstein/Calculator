/* jshint node: true, esversion: 6 */
const operators = {
    "+": function sum(x, y) {
        return new Big(x).plus(y);
    },
    "-": function sub(x, y) {
        return new Big(x).minus(y);
    },
    "x": function mul(x, y) { 
        return new Big(x).times(y).round(8);
    },
    "/": function div(x, y) {
        return new Big(x).div(y).round(8);
    }
};
let handleTotal = (bigTotal) => (bigTotal.e > 12) ? bigTotal.toExponential() : bigTotal.toString();

function clickNumber(e) {
    var mainDisp = $("#main");
    var value = $(e.target).val();
    var numElement = `<div class="main-number">${value}</div>`;
    
    // handle number length in the main display
    if (mainDisp.contents().length >= 12) {
        // if number length exceeds 12 scale down font-size to
        // to accumulate upto 16 numbers
        if (mainDisp.contents().length < 16) {
            mainDisp.css("font-size", "4.2rem");
            mainDisp.append(numElement);
        }
        else
            return false;
    }
    else {
        mainDisp.css("font-size", "5.4rem");
        // display numbers
        if ($("#main div:first").text() === "0" && $("#main div").length === 1 && value === "0")
            return false;
        else if ($("#main div:first").text() === "0" && value !== "." && $("#main div").length === 1)
            mainDisp.html(numElement); 
        else if ($("#main div:first").text() === "0" && value === ".")
            mainDisp.append(numElement);
        else if ($("#main div:first").text() === "0" && $($("#main div").get(1)).text() === ".")
            mainDisp.append(numElement);
        else if ($("#main div").is(".main-result")) 
            mainDisp.html(numElement);
        else
            mainDisp.append(numElement);
    }    
}
function clickClear(e) {
    $("#operation").empty();
    $("#main").html("<div class='main-number'>0</div>");
    return false;
}
function clickBs(e) {
    var last = $("#main div:last");
    if ($("#main div").length > 1)
        last.remove();
    else  if ($("#main div").length === 1)
        $("#main").html("<div class='main-number'>0</div>");
    else
        return false;
}
function clickOperator(e) {
    var operation = $("#operation");
    var operator, number, operationElem;
    if (!$("#main div").length)
        return false;
    else {
        operator = $(e.target).val();
        number = $("#main").text();
        operationElem = `<div class="operation-num"> ${number} </div><div class="operation-op">${operator}</div>`;
        operation.append(operationElem);
        $("#main").empty();
    }
}
function clickEqual() {
    var total = 0;
    var operator = "+";
    var number;
    var ops = $("#operation div:odd"); // all operators 
    var nums = $("#operation div:even"); // all numbers pressed
    // loop through operators and perform operation
    for (var i = 0; i < ops.length; i++) {
        number = Number($(nums[i]).text().trim());
        total = handleTotal(operators[operator](total, number));
        console.log(total);
        operator = $(ops[i]).text().trim();
    }
    number = $("#main").text().trim();
    total = handleTotal(operators[operator](total, number));
    $("#main").html(`<div class="main-result">${total}</div>`);
    console.log(total);
    $("#operation").empty();
}

$(document).ready(function() {
    $(".buttons button").focus(function (event) {
        $(event.target).css("outline", "none");
    });


    // clear main display onLoad
    clickClear();
    // register event handlers 
    $(".number").click(clickNumber);
    $("#clear").click(clickClear);
    $("#backspace").click(clickBs);
    $(".operator").click(clickOperator);
    $("#equal").click(clickEqual);
});
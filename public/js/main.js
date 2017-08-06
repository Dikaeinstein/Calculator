/* jshint node: true, esversion: 6 */
const operators = {
    "+": function sum(x, y) {
        return Math.round((x + y) * 100) / 100;
    },
    "-": function sub(x, y) {
        return Math.round((x - y) * 100) / 100;
    },
    "x": function mul(x, y) { 
        return Math.round((x * y) * 100) / 100;
    },
    "/": function div(x, y) {
        return Math.round((x / y) * 100) / 100;
    }
};

function clickNumber(e) {
    var mainDisp = $("#main");
    var value = $(e.target).val();
    var numElement = `<div class="main-number">${value}</div>`;
    // handle character length in the main display
    if (mainDisp.contents().length >= 8) {
        return false;
    }
    else {
        // display numbers
        if ($("#main div:first").text() === "0" && value === "0")
            return false;
        else if ($("#main div:first").text() === "0" && value !== "." && $("#main div").length === 1)
            mainDisp.html(numElement); 
        else if ($("#main div:first").text() === "0" && value === ".")
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
        total = operators[operator](total, number);
        operator = $(ops[i]).text().trim();
    }
    number = Number($("#main").text().trim());
    total = operators[operator](total, number);
    $("#main").html(`<div class="main-result">${total}</div>`);
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
/* jshint node: true, esversion: 6 */

$(document).ready(function() {
    $(".buttons button").focus(function (event) {
        $(event.target).css("outline", "none");
    });

    // used unicode strings as keys so as to match html character entities
    const operators = {
        "\u002B": function sum(x, y) {
            return new Big(x).plus(y);
        },
        "\u2212": function sub(x, y) {
            return new Big(x).minus(y);
        },
        "\u00D7": function mul(x, y) { 
            return new Big(x).times(y);
        },
        "\u00F7": function div(x, y) {
            if (y === "0")
                return "Cannot divide by zero";
            return new Big(x).div(y);
        }
    };

    // handle the total returned by the operator methods
    // to make it fit display width.
    let handleTotal = (bigTotal) => {
        let total; 
        if (typeof(bigTotal) == "string")
            total = bigTotal;

        else if (bigTotal.c.length > 12) {
            if (bigTotal.e > 9) { 
                // set no. of coefficients(significant digits) to 8
                // to accomodate exponentiation part on the display.
                bigTotal.c.length = 8; 
                total = bigTotal.toString();
            } else {
                // if no exponentiation,
                // set no. of coefficients(significant digits) to 12
                bigTotal.c.length = 12;     
                total = bigTotal.toString();    
            }
        }
        else if (bigTotal.e > 12) {
            total = bigTotal.toExponential();
        } 
        else {
            total = bigTotal.toString();
        }
        return total;
    };

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
        else if (mainDisp.text() === "Cannot divide by zero")
            mainDisp.html(numElement);
        else {
            // scale up font-size back to original size
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
        $("#operation").empty(); // operations 
        $("#main").html("<div class='main-number'>0</div>"); // reset main display to 0
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
        var operator, number, operationElem, val;
        if (!$("#main div").length) // do nothing for empty display
            return false;
        else {
            // extract the operator and number and append to display
            operator = $(e.target).text();
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
        // loop through operators and perform operation on numbers
        for (var i = 0; i < ops.length; i++) {
            number = Number($(nums[i]).text().trim());
            total = handleTotal(operators[operator](total, number));
            operator = $(ops[i]).text().trim();
        }
        number = $("#main").text().trim();
        total = handleTotal(operators[operator](total, number));
        if (total == "Cannot divide by zero")
            $("#main").html(`<div class="main-result-divby0">${total}</div>`);    
        else
            $("#main").html(`<div class="main-result">${total}</div>`);
        $("#operation").empty();
    }

    // clear main display onLoad
    clickClear();
    // register event handlers 
    $(".number").click(clickNumber);
    $("#clear").click(clickClear);
    $("#backspace").click(clickBs);
    $(".operator").click(clickOperator);
    $("#equal").click(clickEqual);
});
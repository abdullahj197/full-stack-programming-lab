function calculate() {

    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);
    let operation = document.getElementById("operation").value;
    let resultBox = document.getElementById("result");

    // Validation
    if (isNaN(num1) || isNaN(num2)) {
        resultBox.innerText = "⚠ Please enter valid numbers!";
        resultBox.style.background = "#ff4d4d";
        resultBox.style.color = "white";
        return;
    }

    if (operation == "") {
        resultBox.innerText = "⚠ Please select an operation!";
        resultBox.style.background = "#ff4d4d";
        resultBox.style.color = "white";
        return;
    }

    let result;

    if (operation == "add") {
        result = num1 + num2;
    }
    else if (operation == "sub") {
        result = num1 - num2;
    }
    else if (operation == "mul") {
        result = num1 * num2;
    }
    else if (operation == "div") {

        if (num2 == 0) {
            resultBox.innerText = "❌ Cannot divide by zero!";
            resultBox.style.background = "#ff0000";
            resultBox.style.color = "white";
            return;
        }

        result = num1 / num2;
    }

    resultBox.innerText = "✅ Result: " + result;

    // Dynamic color styling
    if (result > 0) {
        resultBox.style.background = "#4CAF50";
        resultBox.style.color = "white";
    }
    else if (result < 0) {
        resultBox.style.background = "#f44336";
        resultBox.style.color = "white";
    }
    else {
        resultBox.style.background = "#2196F3";
        resultBox.style.color = "white";
    }
}

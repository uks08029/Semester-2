function calculateResult() {
    let n = document.getElementById("subject").value;
    let i;
    let total = 0;
    for (i = 0; i < n; i++) {
        let marks = parseFloat(prompt("enter the marks of subject " + (i + 1)));
        total += marks;
    }
    let avg = total / n;
    let grade;
    if (avg > 90) {
        grade = 'A+';
    }
    else if (avg > 80) {
        grade = 'A';
    }
    else if (avg > 70) {
        grade = 'B+';
    }
    else if (avg > 60) {
        grade = 'B';
    }
    else if (avg > 50) {
        grade = 'C';
    }
    else if (avg > 33) {
        grade = 'D';
    }
    else if (avg < 33) {
        grade = 'F';
    }
    else { grade = "enter valid input" }

    let result;
    if (avg >= 33) {
        result = "pass";
    }
    else {
        result = "Fail";
    }
    document.getElementById("result").innerHTML =
        "Total Marks: " + total + "<br/>" +
        "Average Marks: " + avg + "<br/>" +
        "Grade: " + grade + "<br/>" +
        "Result: " + result;
}
class Student {
    constructor(id, name, semester, courses) {
        this.id = id;
        this.name = name;
        this.semester = semester;
        this.courses = courses;
    }

    getDetails() {
        return `
            <div class="student-card">
                <h3>${this.name}</h3>
                <p><strong>ID:</strong> ${this.id}</p>
                <p><strong>Semester:</strong> ${this.semester}</p>
                <p><strong>Courses:</strong> ${this.courses.join(", ")}</p>
                <span class="badge">${this.courses.length} Courses</span>
            </div>
        `;
    }
}

const student1 = new Student(1, "Ali Ahmed", "3rd", ["OOP", "DBMS"]);
const student2 = new Student(2, "Sara Khan", "4th", ["Software Engineering", "Computer Networks"]);
const student3 = new Student(3, "Usman Malik", "2nd", ["Programming Fundamentals", "Calculus"]);

const students = [student1, student2, student3];

let output = "";
students.forEach(student => {
    output += student.getDetails();
});

document.getElementById("students").innerHTML = output;
var inicialization = require('./src/population/Inicialization');
inicialization = new inicialization();

var classrooms = inicialization.inputToArrayClassrooms('/../../inputs/classrooms.csv');
var subjects = inicialization.inputToArraySubjects('/../../inputs/subjects.csv');
var professors = inicialization.inputToArrayProfessors('/../../inputs/professors.csv');

console.log(classrooms);
console.log(subjects);
console.log(professors);

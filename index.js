var inicialization = require('./src/population/Inicialization');
inicialization = new inicialization();
var gene = require('./src/population/Gene');
gene = new gene();

var classrooms = inicialization.inputToArrayClassrooms('/../../inputs/classrooms.csv');
var subjects = inicialization.inputToArraySubjects('/../../inputs/subjects.csv');
var professors = inicialization.inputToArrayProfessors('/../../inputs/professors.csv');

console.log(classrooms);
// console.log(subjects);
// console.log(professors);

// console.log(' ');
// var temp = gene.getProfessorsWithPreferences(professors);
// console.log(temp);

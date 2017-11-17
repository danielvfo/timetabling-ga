var inicialization = require('./src/population/Inicialization');
inicialization = new inicialization();
var gene = require('./src/population/Gene');
gene = new gene();

var classrooms = inicialization.inputToArrayClassrooms('/../../inputs/classrooms.csv');
var subjects = inicialization.inputToArraySubjects('/../../inputs/subjects.csv');
var professors = inicialization.inputToArrayProfessors('/../../inputs/professors.csv');
//console.log(inicialization.hasEnoughProfessorsForSubjects(subjects, professors));
var professors_with_preferences = gene.getProfessorsWithPreferences(professors);
//
// try {
//   var professor_with_preferences = getProfessorWithPreferences;
//   var subject = getSubject(professor_with_preferences);
//   var professor_subject = linkProfessorWithSubject(professor_with_preferences, subject);
//   var classroom = getClassroom(subject);
//   var professor_subject_classroom = linkProfessorSubjectWithClassroom(professor_subject, classroom);
//   individual.pushTuple(professor_subject_classroom);
// } catch (e) {
//   console.log(e);
// } finally {
// }


// var individual = [];
// var tuple = [];
// //while (professors_with_preferences) {
//   var professor = gene.getRandomObject(professors_with_preferences); //get one random professor from the professors with preferences
//   console.log(professor);
//   var desired_subject_id = gene.getRandomObject(professor.subject_id) //get a random desired subject
//   console.log(desired_subject_id);
//   if (gene.hasBond(desired_subject_id, individual)) { //if the desired subject, YES, is taken by another professor
//     gene.popElement(professor.subject_id, desired_subject_id); //we have to remove it from this professor's prefered subjects array
//   } else { //if the desired subject is NOT taken, we have to check if it has a lab counterpart
//     console.log('YAAY!')
//   }
// //}

var individual = [];
var subject = gene.getRandomObject(subjects);
console.log(subject);
var subject_complement = gene.getSubjetComplement(subject, subjects);
console.log(subject_complement);
try {
  var suitable_classrooms = gene.fetchClassrooms(subject, classrooms, individual);
} catch (e) {
  console.log('\nNo suitable classrooms left!');
}
console.log(suitable_classrooms);

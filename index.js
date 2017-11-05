var inicialization = require('./src/population/Inicialization');
inicialization = new inicialization();
var gene = require('./src/population/Gene');
gene = new gene();

// var classrooms = inicialization.inputToArrayClassrooms('/../../inputs/classrooms.csv');
// var subjects = inicialization.inputToArraySubjects('/../../inputs/subjects.csv');
// var professors = inicialization.inputToArrayProfessors('/../../inputs/professors.csv');
// var professors_with_preferences = gene.getProfessorsWithPreferences(professors);
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

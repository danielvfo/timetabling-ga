var inicialization = require('./src/population/Inicialization');
inicialization = new inicialization();
var gene = require('./src/population/Gene');
gene = new gene();
const shuffle = require('shuffle-array');

var classrooms = inicialization.inputToArrayClassrooms('/../../inputs/classrooms.csv');
var subjects = inicialization.inputToArraySubjects('/../../inputs/subjects.csv');
var professors = inicialization.inputToArrayProfessors('/../../inputs/professors.csv');
//If there aren't enough professors (considering their available units), the app breaks ---------------
if (!inicialization.hasEnoughProfessorsForSubjects(subjects, professors)){
  process.exit(1);
}
//-----------------------------------------------------------------------------------------------------
//hasEnoughClasrooms
var professors_with_preferences = gene.getProfessorsWithPreferences(professors);

var individual = [];
var c = 0;
while (c<3) {
var subject_classroom_professor = [];
var selected_subjects = [];
//Pick one random subject and find classrooms for it --------------------------------------------------------------------
var subject = gene.getRandomObject(subjects);
try {
  var suitable_classrooms = gene.fetchClassrooms(subject, classrooms, individual);
} catch (e) {
  console.log('\nNo suitable classrooms left!');
}
suitable_classrooms = shuffle(suitable_classrooms);
try {
  var combined_classrooms = gene.combineClassrooms(subject, suitable_classrooms);
} catch (e) {
  console.log('\nNo combinations available for: ' + subject.id);
}
selected_subjects.push(subject);
var temp = gene.linkSubjectClassrooms(subject, combined_classrooms);
subject_classroom_professor.push(temp);
//----------------------------------------------------------------------------------------------------------------------
//Find a complement for the previously picked subect (e. g. a lab for a lecture) as well as classrooms for it ----------
var subject_complement = gene.getSubjetComplement(subject, subjects);
if (subject_complement) {
  try {
    var suitable_classrooms_complement = gene.fetchClassrooms(subject_complement, classrooms, individual);
  } catch (e) {
    console.log('\nNo suitable classrooms left for the complement!');
  }
  suitable_classrooms_complement = shuffle(suitable_classrooms_complement);
  try {
    var combined_classrooms_complement = gene.combineClassrooms(subject_complement, suitable_classrooms_complement);
  } catch (e) {
    console.log('\nNo combinations available for: ' + subject_complement.id + ' (complement)');
  }
  selected_subjects.push(subject_complement);
  var temp = gene.linkSubjectClassrooms(subject_complement, combined_classrooms_complement);
  subject_classroom_professor.push(temp);
}
//-------------------------------------------------------------------------------------------------------------------------
//Find a professor for the previously selected subjects -------------------------------------------------------------------
var chosen_professor;
professors_with_preferences.forEach((professor) => {
  selected_subjects.forEach((subject) => {
    professor.subject_id.forEach((id) => {
      if ((id == subject.id) && (gene.hasEnoughUnits(professor, selected_subjects))) {
        chosen_professor = professor;
        professor = gene.removePreference(professor, id);
        professor = gene.subtractUnits(professor, selected_subjects);
        professors_with_preferences = gene.updateProfessor(professors_with_preferences, professor);
      } else if ((id == subject.id) && !(gene.hasEnoughUnits(professor, selected_subjects))) {
        professor = gene.removePreference(professor, id);
        professors_with_preferences = gene.updateProfessor(professors_with_preferences, professor);
      }
    });
  });
});
if (!chosen_professor) {
  professors.forEach((professor) => {
    if (gene.hasEnoughUnits(professor, selected_subjects)) {
      chosen_professor = professor;
      professor = gene.subtractUnits(professor, selected_subjects);
      professors = gene.updateProfessor(professors, professor);
    }
  });
}
//-----------------------------------------------------------------------------------------------------------------------

//link a subject classroom pair with the chosen_professor
subject_classroom_professor.forEach((item) => {
  item.professor = chosen_professor;
});
//console.log(subject_classroom_professor);

professors_with_preferences = gene.removeNoUnitsProfessors(professors_with_preferences);
professors = gene.removeNoUnitsProfessors(professors);
professors_with_no_preferences_remaining = gene.getProfessorWithUnitsRemaining(professors_with_preferences);
professors_with_no_preferences_remaining.forEach((professor) => {
  gene.popElement(professors_with_preferences, professor);
  professors.push(professor);
});
subject_classroom_professor.forEach((item) => {
  gene.popElement(subjects, item.subject);
  if (item.classroom.constructor === Array) {
    item.classroom.forEach((room) => {
      gene.popElement(classrooms, room);
    });
  } else {
    gene.popElement(classrooms, item.classroom);
  }
});
individual.push(subject_classroom_professor);
c++;
}
individual.forEach((item) => {
   console.log(item);
});

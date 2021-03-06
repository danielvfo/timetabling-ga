const fs = require('fs');
const shuffle = require('shuffle-array');

module.exports = class Inicialization {

  //Open and covert to an array of JS objects the classrooms.csv file
  inputToArrayClassrooms(input) {
    var csv = fs.readFileSync(__dirname + input, 'utf8');
    var array = csv.split('\r\n');
    var objects_array = [];
    array.map((item, index) => {
      if (index > 0) { //ignore the first line (table headers)
        var temp = item.split(';');
        if (temp[0]) { //avoiding to include empty entries
          objects_array.push({id: temp[0], classroom: temp[1], time_window: temp[2], is_lab: temp[3], lab_type: temp[4], weekday: temp[5]});
        }
      }
    });
    objects_array = shuffle(objects_array);
    return objects_array;
  };

  //Open and covert to an array of JS objects the subjects.csv file
  inputToArraySubjects(input) {
    var csv = fs.readFileSync(__dirname + input, 'utf8');
    var array = csv.split('\r\n');
    var objects_array = [];
    array.map((item, index) => {
      if (index > 0) { //ignore the first line (table headers)
        var temp = item.split(';');
        if (temp[0]) { //avoiding to include empty entries
          objects_array.push({id: temp[0], major: temp[1], semester: temp[2], subject: temp[3], description: temp[4], is_lab: temp[5], units: temp[6], lab_type: temp[7], shift: temp[8]});
        }
      }
    });
    objects_array = shuffle(objects_array);
    return objects_array;
  };

  //Open and covert to an array of JS objects the professors.csv file
  inputToArrayProfessors(input) {
    var csv = fs.readFileSync(__dirname + input, 'utf8');
    var array = csv.split('\r\n');
    var objects_array = [];
    array.map((item, index) => {
      if (index > 0) { //ignore the first line (table headers)
        var temp = item.split(';');
        if (temp[0]) { //avoiding to include empty entries
          objects_array.push({id: temp[0], professor: temp[1], units: temp[2], subject_id: temp[3]});
        }
      }
    });
    objects_array = shuffle(objects_array);
    return objects_array;
  };

  //Function to count the total number of units in subjects
  countTotalNumberOfSubjectUnits(subjects) {
    var total_units = 0;
    subjects.map((subject) => {
      total_units += subject.units;
    });
    return total_units;
  };

  //Function to count the total number of professors available units
  countTotalNumberOfProfessorUnits(professors) {
    var total_units = 0;
    professors.map((professor) => {
      total_units += professor.units;
    });
    return total_units;
  };

  //Check if there are enough professor availability for the porposed number of subjects
  hasEnoughProfessorsForSubjects(subjects, professors) {
    var total_professor_units = this.countTotalNumberOfProfessorUnits(professors);
    var total_subject_units = this.countTotalNumberOfSubjectUnits(subjects);
    if (total_professor_units < total_subject_units) {
      return false;
    } else {
      return true;
    }
  };

};

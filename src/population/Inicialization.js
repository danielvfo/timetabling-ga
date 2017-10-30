const fs = require('fs');

module.exports = class Inicialization {
  constructor() {};
  //Open and covert to an array of JS objects the classrooms.csv file
  inputToArrayClassrooms(input) {
    var csv = fs.readFileSync(__dirname + input, 'utf8');
    var array = csv.split('\r\n');
    var objects_array = [];
    array.forEach((item, index) => {
      if (index > 0) {
        var temp = item.split(';');
        if (temp[0]) {
          objects_array.push({classroom: temp[0], time_window: temp[1], is_lab: temp[2], lab_type: temp[3], weekday: temp[4]});
        }
      }
    });
    return objects_array;
  };
  //Open and covert to an array of JS objects the subjects.csv file
  inputToArraySubjects(input) {
    var csv = fs.readFileSync(__dirname + input, 'utf8');
    var array = csv.split('\r\n');
    var objects_array = [];
    array.forEach((item, index) => {
      if (index > 0) {
        var temp = item.split(';');
        if (temp[0]) {
          objects_array.push({id: temp[0], major: temp[1], semester: temp[2], subject: temp[3], description: temp[4], is_lab: temp[5], units: temp[6], lab_type: temp[7], shift: temp[8]});
        }
      }
    });
    return objects_array;
  };
  //Open and covert to an array of JS objects the professors.csv file
  inputToArrayProfessors(input) {
    var csv = fs.readFileSync(__dirname + input, 'utf8');
    var array = csv.split('\r\n');
    var objects_array = [];
    array.forEach((item, index) => {
      if (index > 0) {
        var temp = item.split(';');
        if (temp[0]) {
          objects_array.push({id: temp[0], professor: temp[1], units: temp[2], subject_id: temp[3]});
        }
      }
    });
    return objects_array;
  };

  createInicialPopulation() {

  };
};

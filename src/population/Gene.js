const shuffle = require('shuffle-array');

module.exports = class Gene {

  //Pop an especified element out of an array
  popElement(array, element) {
    var element_to_return;
    var index = array.indexOf(element);
    if (index > -1) {
      element_to_return = array.splice(index, 1);
    }
    return element_to_return;
  };

  //Get all the professors who have preferences from the original professors array
  getProfessorsWithPreferences(professors) {
    var professors_with_preferences = [];
    professors.forEach((professor) => {
      if (professor.subject_id) { //Professor has subjects preferences
        var aux = professor.subject_id.split('.');
        professor.subject_id = aux;
        professors_with_preferences.push(professor);
        this.popElement(professors, professor);
      }
    });
    return professors_with_preferences;
  };

  //Get a random object using the "shuffle-array" package "pick" function
  getRandomObject(array) {
    try {
      return shuffle.pick(array);
    } catch (e) {
        throw e;
    }
  };

  //Get a complementary subject of a given subject. E. g.: get the lab part of a lecture
  getSubjetComplement(subject, subjects) {
    try {
      var subject_complement;
      subjects.forEach((item) => {
        if ((item.id != subject.id) && (item.major == subject.major) && (item.subject == subject.subject)) {
          subject_complement = item;
        }
      });
      return subject_complement;
    } catch (e) {
        throw e;
    }
  };

  //Check if a classroom and a subject laboratory type match
  labMatch(classroom, subject) {
    try {
      if (classroom.lab_type == subject.lab_type) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
        throw e;
    }
  };

  //Check if the shift between a given classroom and a subject matches
  checkShiftMatch(classroom, subject) {
    try {
      if ((subject.shift == 'I') && (classroom.time_window[0] == 'M')) {
        return true;
      }
      if ((subject.shift == 'I') && (classroom.time_window[0] == 'T')) {
        return true;
      }
      if ((subject.shift == 'M') && (classroom.time_window[0] == 'M')) {
        return true;
      }
      if ((subject.shift == 'T') && (classroom.time_window[0] == 'T')) {
        return true;
      }
      if ((subject.shift == 'N') && (classroom.time_window[0] == 'N')) {
        return true;
      }
      return false;
    } catch (e) {
        throw e;
    }
  };

  //Check if a classroom time window is taken
  timeWindowIsTaken(classroom, individual) {
    var counter = 0;
    if (individual) {
      individual.forEach((item) => {
        item.schedule.forEach((triplet) => {
          if ((triplet.classroom.time_window == classroom.time_window) && (triplet.classroom.weekday == classroom.weekday)) {
            counter++;
          }
        });
      });
    }
    if (counter) {
      return true;
    } else {
      return false;
    }
  };

  //Fetch all compatible available classrooms for a given subject
  fetchClassrooms(subject, classrooms, individual) {
    var suitable_classrooms = [];
    classrooms.forEach((classroom) => { //get all classrooms in which lab matches, shift matches  and time window is NOT taken
      if ((this.labMatch(classroom, subject)) && (this.checkShiftMatch(classroom, subject)) && !(this.timeWindowIsTaken(classroom, individual))) {
        suitable_classrooms.push(classroom);
      }
    });
    if (suitable_classrooms) { //if the suitable classrooms array is empty, throw error
      return suitable_classrooms;
    } else {
      throw e;
    }
  }

  //
  updateProfessor(professors, professor) {
    professors.forEach((item) => {
      if (item.id == professor.id) {
        this.popElement(professors, item);
        professors.push(professor);
      }
    });
    return professors;
  };

  //Get professors from the "professor_with_preferences" array who have remaining units but no more preferences
  getProfessorWithUnitsRemaining(professors_with_preferences) {
    professors_with_preferences.forEach((professor) => {
      if ((professor.subject_id == '') && (professor.units > 0)) {
        return this.popElement(professors_with_preferences, professor);
      }
    });
  };

  //Check if a subject is already taken. If yes, reuturn true, if no, return false
  hasBond(subject, individual) {
    if (individual) {
      individual.forEach((item) => {
        var counter = 0;
        item.schedule.forEach((tuple) => {
          if (tuple.subject.id == subject.id) {
            counter++;
            return true;
          }
        });
        if (counter == 0) {
          return false;
        }
      });
    } else {
        return false;
    }
  };

  //Check if a given professor has enough units for a subject supposed to link
  hasEnoughUnits(professor, subjects) {
    var units = 0;
    if (subjects.length > 1) {
      subjects.forEach((subject) => {
        units = units + subject.units;
      });
    } else {
      units = subjects.units;
    }
    if (professor.units >= units) {
      return true;
    } else {
        return false;
    }
  };

  //Subtract the units from a given professor related to a subject supposed to link
  subtractUnits(professor, subjects) {
    var units = 0;
    if (subjects.constructor === Array) {
      subjects.forEach((subject) => {
        units = units + subject.units;
      });
    } else {
        units = subjects.units;
    }
    professor.units = professor.units - units;
    return professor;
  };

  //Get the prefered subject searching by its id
  getSubjectByID(subjects, desired_id) {
    subjects.forEach((subject) => {
      if (subject.id == desired_id) {
        return subject;
      }
    });
    return undefined;
  };

  //Check if a subject is a laboratory type
  isLab(subject) {
    if (subject.is_lab) {
      return true;
    } else {
        return false;
    }
  };

  //
  linkProfessorWithSubject(professor, subjects) {
    var professor_with_subject = [];
    if (subjects.constructor === Array) {
      subjects.forEach((subject) => {
        professor_with_subject.push({subject: subject, professor: professor});
      });
    } else {
        professor_with_subject.push({subject: subjects, professor: professor});
    }
    return professor_with_subject;
  };

  //
  linkProfessorSubjectWithClassroom(professor_with_subject, classroom) {
    var professor_subject_classroom = [];
    professor_with_subject.forEach((item) => {
      professor_subject_classroom.push({subject: subject, professor: professor, classroom: classroom});
    });
    return professor_subject_classroom;
  };

};

const shuffle = require('shuffle-array');

module.exports = class Gene {

  //Get all the professors whose have preferences from the professors original array
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

  //Pop an especified element out of an array
  popElement(array, element) {
    var element_to_return;
    var index = array.indexOf(element);
    if (index > -1) {
      element_to_return = array.splice(index, 1);
    }
    return element_to_return;
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
    if (subjects.length > 1) {
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
  getDesiredSubject(id, subjects) {
    try {
      subjects.forEach((subject) => {
        if (subject.id == id) {
          return subject;
        } else {
            return false;
        }
      });
    } catch (e) {
        throw e;
    }
  }

  //Get a random subject using the "shuffle-array" package "pick" function
  getRandomSubject(subjects) {
    try {
      return shuffle.pick(subjects);
    } catch (e) {
        throw e;
    }
  };

  //Get a complementary subject of a given subject. E. g.: get the lab part of a lecture
  getSubjetComplement(subject, subjects) {
    try {
      subjects.forEach((item) => {
        if ((item.id != subject.id) && (item.subject == subject.subject)) {
          return item;
        } else {
            return false;
        }
      });
    } catch (e) {
        throw e;
    }
  };

  //Check if a subject is a laboratory type
  isLab(subject) {
    if (subject.is_lab) {
      return true;
    } else {
        return false;
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
};

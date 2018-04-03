const shuffle = require('shuffle-array');
const forParallel = require('node-in-parallel');

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
    professors.map((professor) => {
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
      subjects.map((item) => {
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
      individual.map((triplet) => {
        if (triplet.classroom.constructor === Array) {
          triplet.classroom.map((room) => {
            if ((room.time_window == classroom.time_window) && (room.weekday == classroom.weekday)) {
              counter++;
            }
          });
        } else {
          if ((triplet.classroom.time_window == classroom.time_window) && (triplet.classroom.weekday == classroom.weekday)) {
            counter++;
          }
        }
      });
    }
    if (counter) {
      return true;
    } else {
      return false;
    }
  };

  //Fetch all compatible and available classrooms for a given subject
  fetchClassrooms(subject, classrooms, individual) {
    var suitable_classrooms = [];
    classrooms.map((classroom) => { //get all classrooms in which lab matches, shift matches  and time window is NOT taken
      if ((this.labMatch(classroom, subject)) && (this.checkShiftMatch(classroom, subject)) && !(this.timeWindowIsTaken(classroom, individual))) {
        suitable_classrooms.push(classroom);
      }
    });
    if (suitable_classrooms[0]) { //if the suitable classrooms array is empty, throw error
      return suitable_classrooms;
    } else {
      throw e;
    }
  }

  //Helper function for the "combineClassrooms" function. Fetches one classroom from the "suitable_classrooms" array
  fetchSolo(suitable_classrooms) {
    return this.getRandomObject(suitable_classrooms);
  }

  //Helper function for the "combineClassrooms" function. Fetches a pair of classrooms, in sequence, from the "suitable_classrooms" array
  fetchPair(suitable_classrooms) {                         //In order to cobine the classrooms according to the number of units
    var suitable_classrooms_copy = suitable_classrooms;    //of a given subject, this piece of code gets the first classroom in the
    for (var i = 0; i < suitable_classrooms.length; i++) { //"suitable_classrooms" array and then it searches for another one where the
      var combined_classrooms = [];                        //classroom ID is different, the classroom name is equal, the clasroom
      combined_classrooms.push(suitable_classrooms[i]);    //time window is a sequence of the previously selected and the weekday
      for (var j = 0; j < suitable_classrooms_copy.length; j++) { //of the classrooms is equal
        if ((suitable_classrooms[i].id != suitable_classrooms_copy[j].id) && (suitable_classrooms[i].classroom == suitable_classrooms_copy[j].classroom) && (suitable_classrooms[i].time_window[0] == suitable_classrooms_copy[j].time_window[0]) && (Number(suitable_classrooms[i].time_window[1]) == Number(suitable_classrooms_copy[j].time_window[1]) + 1) && (suitable_classrooms[i].weekday == suitable_classrooms_copy[j].weekday)) {
          combined_classrooms.push(suitable_classrooms_copy[j]);
        }
        if (combined_classrooms.length == 2) {
          return combined_classrooms;
        }
      }
    }
    throw e;
  }

  //Helper function for the "combineClassrooms" function. Fetches a triplet of classrooms, in sequence, from the "suitable_classrooms" array
  fetchTriplet(suitable_classrooms) {                      //In order to cobine the classrooms according to the number of units
    var suitable_classrooms_copy = suitable_classrooms;    //of a given subject, this piece of code gets the first classroom in the
    for (var i = 0; i < suitable_classrooms.length; i++) { //"suitable_classrooms" array and then it searches for another two where the
      var combined_classrooms = [];                        //classroom ID is different, the classroom name is equal, the clasroom
      combined_classrooms.push(suitable_classrooms[i]);    //time window is a sequence of the previously selected and the weekday
      for (var j = 0; j < suitable_classrooms_copy.length; j++) { //of the classrooms is equal
        if ((suitable_classrooms[i].id != suitable_classrooms_copy[j].id) && (suitable_classrooms[i].classroom == suitable_classrooms_copy[j].classroom) && (suitable_classrooms[i].time_window[0] == suitable_classrooms_copy[j].time_window[0]) && (Number(suitable_classrooms[i].time_window[1]) == Number(suitable_classrooms_copy[j].time_window[1]) + 1) && (suitable_classrooms[i].weekday == suitable_classrooms_copy[j].weekday)) {
          combined_classrooms.push(suitable_classrooms_copy[j]);
        }
        if ((suitable_classrooms[i].id != suitable_classrooms_copy[j].id) && (suitable_classrooms[i].classroom == suitable_classrooms_copy[j].classroom) && (suitable_classrooms[i].time_window[0] == suitable_classrooms_copy[j].time_window[0]) && (Number(suitable_classrooms[i].time_window[1]) == Number(suitable_classrooms_copy[j].time_window[1]) + 2) && (suitable_classrooms[i].weekday == suitable_classrooms_copy[j].weekday)) {
          combined_classrooms.push(suitable_classrooms_copy[j]);
        }
        if (combined_classrooms.length == 3) {
          return combined_classrooms;
        }
      }
    }
    throw e;
  }

  //Helper function for the "combineClassrooms" function. It removes classrooms which have same day and time of a previously
  //assigned classroom
  removeSameDayAndTime(combination, suitable_classrooms){
    suitable_classrooms.map((i) => {
      combination.map((j) => {
        if ((i.weekday == j.weekday) && (i.time_window == j.time_window)) {
          this.popElement(suitable_classrooms, i);
        }
      });
    });
    return suitable_classrooms;
  };

  //Sorry for the looong function
  //tl;dr: it selects and combine classrooms from the suitable_classrooms array for a given subject taking in
  //account its number of units. For example: if it is a 4 units subject it needs 4 classrooms entries, even if it's
  //the same classroom but in a different time window and/or a different weekday
  combineClassrooms(subject, suitable_classrooms) {
    var units = subject.units;
    var combined_classrooms = [];
    switch (units) {
      case '1':
        return this.fetchSolo(suitable_classrooms);

      case '2':
        return this.fetchPair(suitable_classrooms);

      case '3':
        return this.fetchTriplet(suitable_classrooms);

      case '4':
        var pair = this.fetchPair(suitable_classrooms);
        pair.map((item) => {
          combined_classrooms.push(item);
          this.popElement(suitable_classrooms, item);
        });
        suitable_classrooms = this.removeSameDayAndTime(pair, suitable_classrooms);
        var pair = this.fetchPair(suitable_classrooms);
        pair.map((item) => {
          combined_classrooms.push(item);
        });
        return combined_classrooms;

      case '5':
        var triplet = this.fetchTriplet(suitable_classrooms);
        triplet.map((item) => {
          combined_classrooms.push(item);
          this.popElement(suitable_classrooms, item);
        });
        suitable_classrooms = this.removeSameDayAndTime(triplet, suitable_classrooms);
        var pair = this.fetchPair(suitable_classrooms);
        pair.map((item) => {
          combined_classrooms.push(item);
        });
        return combined_classrooms;

      case '6':
        var triplet = this.fetchTriplet(suitable_classrooms);
        triplet.map((item) => {
          combined_classrooms.push(item);
          this.popElement(suitable_classrooms, item);
        });
        suitable_classrooms = this.removeSameDayAndTime(triplet, suitable_classrooms);
        var triplet = this.fetchTriplet(suitable_classrooms);
        triplet.map((item) => {
          combined_classrooms.push(item);
        });
        return combined_classrooms;

      case '7':
        var triplet = this.fetchTriplet(suitable_classrooms);
        triplet.map((item) => {
          combined_classrooms.push(item);
          this.popElement(suitable_classrooms, item);
        });
        suitable_classrooms = this.removeSameDayAndTime(triplet, suitable_classrooms);
        var triplet = this.fetchTriplet(suitable_classrooms);
        triplet.map((item) => {
          combined_classrooms.push(item);
          this.popElement(suitable_classrooms, item);
        });
        suitable_classrooms = this.removeSameDayAndTime(triplet, suitable_classrooms);
        combined_classrooms.push(this.fetchSolo(suitable_classrooms));
        return combined_classrooms;
    }
    throw e;
  }

  //Link a subject with a set of combined classrooms or a single clasroom
  linkSubjectClassrooms(subject, classrooms) {
    var subject_classroom = {};
    subject_classroom = {subject: subject, classroom: classrooms, professor: ''};
    return subject_classroom;
  }

  //Check if a given professor has enough units for a subject supposed to link
  hasEnoughUnits(professor, subjects) {
    var units = 0;
    if (subjects.constructor === Array) {
      subjects.map((subject) => {
        units += Number(subject.units);
      });
    } else {
      units = Number(subjects.units);
    }
    if (Number(professor.units) >= Number(units)) {
      return true;
    } else {
      return false;
    }
  };

  //Remove an ID from the subject_id array within a professor
  removePreference(professor, id) {
    var subject_id_support = professor.subject_id;
    subject_id_support.map((subject) => {
      if (subject == id) {
        this.popElement(subject_id_support, id);
      }
    });
    professor.subject_id = subject_id_support;
    return professor;
  }

  //Subtract the units from a given professor related to a subject supposed to link
  subtractUnits(professor, subjects) {
    var units = 0;
    if (subjects.constructor === Array) {
      subjects.map((subject) => {
        units += Number(subject.units);
      });
    } else {
        units = Number(subjects.units);
    }
    professor.units -= Number(units);
    return professor;
  };

  //Update a given professor in a professors array. For example:
  //When you remove a preference from a professor and you want to update the original array
  //Or when you subtract availabe units from a certain professor
  updateProfessor(professors, professor) {
    professors.map((item) => {
      if (item.id == professor.id) {
        this.popElement(professors, item);
        professors.push(professor);
      }
    });
    return professors;
  };

  //Get professors from the "professor_with_preferences" array who have remaining units but no more preferences
  getProfessorWithUnitsRemaining(professors_with_preferences) {
    var professors = [];
    professors_with_preferences.map((professor) => {
      if ((professor.subject_id == '') && (professor.units > 0)) {
        professors.push(this.popElement(professors_with_preferences, professor));
      }
    });
    return professors;
  };

  //Wipe professors with no units remaining
  removeNoUnitsProfessors(professors) {
    professors.map((professor) => {
      if (Number(professor.units) <= 0) {
        this.popElement(professors, professor);
      }
    });
    return professors;
  }

  // addToIndividual(subject_classroom_professor, individual) {
  //   subject_classroom_professor.map((triplet) => {
  //     if (individual.length == 0) {
  //       individual.push({major: triplet.subject.major, semester: triplet.subject.semester, schedule: triplet});
  //     } else {
  //       individual.map((element, index) => {
  //         if ((element.major == triplet.subject.major) && (element.semester == triplet.subject.semester)) { //same major, same semester
  //           console.log(element.major + ' == ' + triplet.subject.major + ' && ' + element.semester + '==' + triplet.subject.semester);
  //           individual[index].schedule.push(triplet);
  //         } else { //new semester OR new major
  //           individual.push({major: triplet.subject.major, semester: triplet.subject.semester, schedule: triplet});
  //         }
  //       });
  //     }
  //   });
  //   return individual;
  // }

  // //Check if a subject is already taken. If yes, reuturn true, if no, return false
  // hasBond(subject, individual) {
  //   if (individual) {
  //     individual.map((item) => {
  //       var counter = 0;
  //       item.schedule.map((tuple) => {
  //         if (tuple.subject.id == subject.id) {
  //           counter++;
  //           return true;
  //         }
  //       });
  //       if (counter == 0) {
  //         return false;
  //       }
  //     });
  //   } else {
  //       return false;
  //   }
  // };
  //
  // //Get the prefered subject searching by its id
  // getSubjectByID(subjects, desired_id) {
  //   subjects.map((subject) => {
  //     if (subject.id == desired_id) {
  //       return subject;
  //     }
  //   });
  //   return undefined;
  // };
  //
  // //Check if a subject is a laboratory type
  // isLab(subject) {
  //   if (subject.is_lab) {
  //     return true;
  //   } else {
  //       return false;
  //   }
  // };
  //
  // //
  // linkProfessorWithSubject(professor, subjects) {
  //   var professor_with_subject = [];
  //   if (subjects.constructor === Array) {
  //     subjects.map((subject) => {
  //       professor_with_subject.push({subject: subject, professor: professor});
  //     });
  //   } else {
  //       professor_with_subject.push({subject: subjects, professor: professor});
  //   }
  //   return professor_with_subject;
  // };
  //
  // //
  // linkProfessorSubjectWithClassroom(professor_with_subject, classroom) {
  //   var professor_subject_classroom = [];
  //   professor_with_subject.map((item) => {
  //     professor_subject_classroom.push({subject: subject, professor: professor, classroom: classroom});
  //   });
  //   return professor_subject_classroom;
  // };

};

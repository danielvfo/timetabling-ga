const shuffle = require('shuffle-array');

module.exports = class Gene {

  getProfessorsWithPreferences(professors) {
    var temp = [];
    professors.forEach((professor) => {
      if(professor.subject_id) { //Professor has subjects preferences
        temp.push(professor);
      }
    });
    return temp;
  };

  hasBond(subject, individual) {

  }

  subtractUnits(subject, professor) {

  };

  isLab(subject) {

  };

  isLab(classroom) {

  };

  sameType(classroom, subject) {

  };
};

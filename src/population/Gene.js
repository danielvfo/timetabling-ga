const shuffle = require('shuffle-array');

module.exports = class Gene {

  getProfessorsWithPreferences(professors) {
    var temp = [];
    professors.forEach((item) => {
      if(item.subject_id) { //Professor has subjects preferences
        temp.push(item);
      }
    });
    return temp;
  };

  createGene() {

  };
};

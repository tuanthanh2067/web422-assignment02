const _ = require("lodash");

const avg = (grades) => {
  let avg = 0;
  _.forEach(grades, function (grade) {
    avg += grade.score;
  });
  return (avg / grades.length).toFixed(2);
};

module.exports.avg = avg;

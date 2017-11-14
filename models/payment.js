var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  date: {
    type: Date
  },
  sum: {
    type: Number,
    default: 0
  },
  type: {
    type: String
  },
  program: {
    type: String
  },
  image: {
    type: String
  },
  userID: {
    type: String
  },
  description: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Payment = mongoose.model('Payment', schema);

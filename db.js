var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/sensordb", {
    useMongoClient: true,
});

module.exports = mongoose;

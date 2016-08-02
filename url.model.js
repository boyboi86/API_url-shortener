var shortid = require('shortid');

var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

/* defining a simple id within the shortUrl
** mongodb will assign a custom _id to this new Schema
** the users will use the simple id track any url instead
*/

var Url = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortid.generate()
    }
})

module.exports = mongoose.model('Url', Url);
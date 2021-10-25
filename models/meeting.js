const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    date: {
        type: String,
        required: [true, 'must provide date'],
        // trim: true
    },
    start_time: {
        type: String,
        required: [true, 'must provide start time'],
        // trim: true
    },
    end_time: {
        type: String,
        required: [true, 'must provide end time'],
        // trim: true
    }
})

module.exports = mongoose.model('meeting', MeetingSchema)
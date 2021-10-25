const Meeting = require("../models/meeting");

const scheduledMeeting = async (req,res) =>{

    const meeting = await Meeting.find({ 'date': req.body.date, $or:[{
        'start_time': {
            $lte: req.body.start_time,
            // $gte: req.body.end_time
        }
    },{
        'end_time': {
            $gte: req.body.start_time,
            // $lte: req.body.end_time
        }
    }] });


    if(meeting){
        res.status(401).send("meeting already exists");
    } else {
        const data = await Meeting.create(req.body);
        res.status(200).json({data})
    }

}

const getAllMeetings = async(req,res) =>{

    let pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (!pattern.test(req.body.date)) {
        return res.status(401).json({ msg: `Please enter delivery date in dd/mm/yyyy format` });
    }
    const meeting = await Meeting.find({
        'date': req.body.date
    });
    if (!meeting) {
        res.status(401).send("No Meeting exists for the daya");
    } else {
        res.status(200).json({ meeting })
    }

}


const updateMeeting = async (req, res) => {

    const { id: meetingID } = req.params;
    const meeting = await Meeting.findOneAndUpdate({
        '_id': meetingID
    },req.body);
    if (!meeting) {
        res.status(401).send("No Meeting exist");
    } else {
        res.status(200).json({ meeting })
    }

}


const cancelMeeting = async (req, res) => {

    const { id: meetingID } = req.params;
    const meeting = await Meeting.findOne({
        '_id': meetingID
    });

    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()
    let todayDate = cDay + "/" + cMonth + "/" + cYear;
    let time = currentDate.getHours() + ":" + currentDate.getMinutes();
    // console.log(time);

    if (todayDate == meeting.date){
        if (time > meeting.start_time) {

        }
    }
    // console.log("time", year);
    if (!meeting) {
        res.status(401).send("No Meeting exist");
    } else {
        res.status(200).json({ meeting })
    }

}


module.exports = { scheduledMeeting, getAllMeetings, updateMeeting, cancelMeeting};
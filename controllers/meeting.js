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

    if (req.body.start_time < "09:00" || req.body.start_time > "18:00" || req.body.end_time < "09:00" || req.body.end_time > "18:00"){
        res.status(401).send("meeting can only be scheduled between 09:00 and 18:00");
    }


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
    
    const meetingTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00","17:00","18:00"];

    meeting.forEach(ele=>{
        function deleteData(data) {
            data = data + ":00";
            const index = meetingTimes.indexOf(data);
            delete meetingTimes[index];
        }
        endTimeData = parseInt(ele.end_time)
        startTimeData = parseInt(ele.start_time);
        while ((startTimeData <= endTimeData)){
            deleteData(startTimeData);
            startTimeData = parseInt(startTimeData) + 1;
            startTimeData = startTimeData.toString();
        }
    })
    
    let availableMeetings = meetingTimes.map((ele,index)=>{
        let diff = parseInt(meetingTimes[index]) - parseInt(meetingTimes[index+1]);
        if (diff==-1){
            let d = {};
            d['date'] = req.body.date;
            d['start_time'] = meetingTimes[index];
            d['end_time'] = meetingTimes[index + 1];
            return d;
        }
    })

    availableMeetings = availableMeetings.filter(function (element) {
        return element !== undefined;
    });

    if (!availableMeetings) {
        res.status(401).send("No Meeting available for this day");
    } else {
        res.status(200).json({ availableMeetings })
    }

}


const updateMeeting = async (req, res) => {

    const { id: meetingID } = req.params;

    if (req.body.start_time < "09:00" || req.body.start_time > "18:00" || req.body.end_time < "09:00" || req.body.end_time > "18:00") {
        res.status(401).send("meeting can only be scheduled between 09:00 and 18:00");
    }
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
            res.status(401).send("Ccouldn't Cancel meetings if the meeting has already started");
        }
    } else {
        const meetingDelete = await Meeting.findOneAndDelete({ '_id': meetingID });
        if (!meetingDelete) {
            res.status(401).send("No Meeting exist");
        } else {
            res.status(200).send(" Meeting deleted successfully");
        }
    }

}


module.exports = { scheduledMeeting, getAllMeetings, updateMeeting, cancelMeeting};
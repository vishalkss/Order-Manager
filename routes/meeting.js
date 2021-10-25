const express = require("express");
const router = express.Router();
const { scheduledMeeting, getAllMeetings, updateMeeting, cancelMeeting } = require('../controllers/meeting');

router.route('/schedule-meeting').post(scheduledMeeting);
router.route('/get-all-meetings').get(getAllMeetings);
router.route('/update-meeting/:id').patch(updateMeeting);
router.route('/cancel-meeting/:id').delete(cancelMeeting);

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");
const Doctor = require("../Models/doctorModel");
const authMiddleware = require("../middlewares/AuthMiddleWare");
const authAdminMiddleware = require("../middlewares/AuthAdminMiddleWare");

//get user data
router.get("/get-all-users", authMiddleware,authAdminMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "User Data fetched Successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in getting data",
      success: false,
    });
  }
});

//get doctor data
router.get("/get-all-doctors", authMiddleware,authAdminMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctor Data fetched Successfully",
      data: doctors,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in getting data",
      success: false,
    });
  }
});

//change doctor account status
router.post("/change-doctor-status", authMiddleware,authAdminMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status,
    });

    const user = await User.findOne({ _id: doctor.userId });
    const unseenNotifications = user.unseenNotifications;

    unseenNotifications.push({
      type: "new-doctor-request-change",
      message: `Your Doctor account has been ${status}`,
      onclickPath: "/notifications",
    });

    await User.findByIdAndUpdate(doctor.userId, { unseenNotifications , isDoctor : status === 'blocked' ? false : true});

    res.status(200).send({
      message: "Doctor status updated Successfully",
      data: doctor,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in getting data",
      success: false,
    });
  }
});

module.exports = router;

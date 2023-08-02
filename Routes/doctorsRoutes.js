const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleWare");
const Doctor = require("../Models/doctorModel");
const router = express.Router();
const Appointment = require("../Models/appointmentModel");
const User = require("../Models/userModel");

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor Info",
      success: false,
    });
  }
});

router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );

    res.status(200).send({
      success: true,
      message: "Doctor data updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting doctor Info",
      success: false,
    });
  }
});

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctorId);

    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting doctor Info",
      success: false,
    });
  }
});

router.get("/get-appointments-by-doctor-id", authMiddleware,async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({
        doctorId: doctor._id,
      });
      res.status(200).send({
        message: "Appointments Data fetched Successfully",
        data: appointments,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error in getting Appointments data",
        success: false,
      });
    }
  }
);


//change appoitnment status
router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id : appointment.userId});
    const unseenNotifications = user.unseenNotifications;

    unseenNotifications.push({
      type: "appointment-status-change",
      message: `Your appointment status has been ${status}`,
      onclickPath: "/appointments",
    });

    await User.findByIdAndUpdate(appointment.userId, { unseenNotifications });

    res.status(200).send({
      message: "Appointment status updated Successfully",
      data: appointment,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in changing appointment status",
      success: false,
    });
  }
});

module.exports = router;

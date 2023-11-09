const express = require("express");
const User = require("../Models/userModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/AuthMiddleWare");
const Doctor = require("../Models/doctorModel");
const Appointment = require("../Models/appointmentModel");
const moment = require("moment");
const nodemailer = require('nodemailer');
const secretKey = process.env.JWT_SECRET;
const gmail_pass = process.env.GMAIL_PASS;
const front_end = process.env.FRONT_END_URL;
const mongo = require('../config/dbConfig');

//email config
const transporter = nodemailer.createTransport({
  service : "gmail",
  auth : {
      user : "messageforpriyanshu@gmail.com",
      pass : gmail_pass
  }
});

//register
router.post("/register", async (req, res) => {
  try {
    console.log(req.body.email);
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new User(req.body);

    await newUser.save();

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error creating user", success: false, error });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(200)
        .send({ message: "User does not exists", success: false });

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res
        .status(200)
        .send({ message: "Login Successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error Logging In", success: false, error });
  }
});

//get user data
router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error getting user Info",
      success: false,
    });
  }
});

//applying for Doctor
router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const doctorExists = await Doctor.findOne({userId : req.body.userId});

    if (doctorExists) {
      console.log(doctorExists);
      return res
        .status(200)
        .send({ message: "Already Applied", success: true });
    }

    const newDoctor = new Doctor(req.body);

    await newDoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;

    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onclickPath: "/admin/doctors",
    });

    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });

    res.status(200).send({
      message: "Doctor account applied successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "error applying Doctor account",
      success: false,
      error,
    });
  }
});

//mark notification as seen
router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });

      const unseenNotifications = user.unseenNotifications;
      const seenNotification = user.seenNotifications;

      seenNotification.push(...unseenNotifications);

      user.seenNotification = seenNotification;
      user.unseenNotifications = [];
      const updatedUser = await user.save();

      updatedUser.password = undefined;

      res.status(200).send({
        message: "All Notiications marked as seen",
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "error in marking all notification as unseen",
        success: false,
      });
    }
  }
);

//delete all notification
router.post("/delete-all-notifications-as-seen",authMiddleware,async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });

      user.seenNotifications = [];
      user.unseenNotifications = [];

      const updatedUser = await user.save();
      updatedUser.password = undefined;

      res.status(200).send({
        message: "All Notiications deleted",
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).send({
        message: "error in deleting all notification",
        success: false,
      });
    }
  }
);

//get all doctors
router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({
      status: "approved",
    });
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

//doctor appointment
router.post("/book-appointment", authMiddleware, async (req, res) => {

  const session = await mongo.startSession();
  
  try {
    session.startTransaction();

    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const time = moment(req.body.time, "HH:mm").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1,'hours').toISOString();
    const toTime = moment(req.body.time, "HH:mm")  .add(1,'hours').toISOString();
    const doctorId = req.body.doctorId;
    const doctorInfo = req.body.doctorInfo;

    req.body.status = "pending";
    req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time,'HH:mm').toISOString();

    const existingAppointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    }).session(session);

    if (existingAppointments.length > 0) {
      // Slot is already booked
      return res.status(200).send({
        message: "Appointments not available ,someone book before you",
        success: false,
      });
    } else {
      // Slot is available, proceed to book it
      const newAppointment = new Appointment(req.body);

      await newAppointment.save({ session });

    //pushing notifications based on user id
    const user = await User.findById(req.body.doctorInfo.userId);

    user.unseenNotifications.push({
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onclickPath: "/doctor/appointments",
      type: "new-appointment-request",
    });

    await user.save({session});

    await session.commitTransaction();

    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  }
  } catch (error) {
    await session.abortTransaction();
    res.status(500).send({
      message: "Error checking or booking appointment",
      success: false,
    });
  } finally {
    session.endSession();
  }
});

//check availability
router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const time = moment(req.body.time, "HH:mm").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1,'hours').toISOString();
    const toTime = moment(req.body.time, "HH:mm")  .add(1,'hours').toISOString();
    const doctorId = req.body.doctorId;
    const doctorInfo = req.body.doctorInfo;

    const doctorTimeFrom = moment(doctorInfo.timings[0], "HH:mm").toISOString(); // Convert to ISO 8601 format
    const doctorTimeTo = moment(doctorInfo.timings[1], "HH:mm").toISOString(); // Convert to ISO 8601 format

    
    if (moment(date).isBefore(new Date(), 'day')) {
      return res.status(200).send({
        message: "The given date is in the past.",
        success: false,
      });
    };

    if (time < doctorTimeFrom || time > doctorTimeTo) {
      return res.status(200).send({
        message: "Not Matching Doctor's Time",
        success: false,
      });
    };

    //console.log(req.body);

    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime }, 
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error cheking appointments Info",
      success: false
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId : req.body.userId,
    });
    res.status(200).send({
      message: "Appointments Data fetched Successfully",
      data: appointments ,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in getting Appointments data",
      success: false,
    });
  }
});

//password Reset
router.post('/sendPasswordResetLink' ,async (req,res) => {
  const {email} = req.body;
  
  if(!email){
    res.status(200).send({success:false,message : "Enter your email"});
    return;
  }
  
  try 
  {
      const userFind = await User.findOne({email : email});
      
      if(!userFind){
        res.status(200).send({success : false , message : "User does not exist"});
        return;
      }
      const token = jwt.sign({_id : userFind._id} , secretKey , {
          expiresIn : "120s"
      });

      const setuserToken = await User.findByIdAndUpdate(userFind._id,{verifyToken : token});

      if(setuserToken){
          const mailOptions = {
              from : "messageforpriyanshu@gmail.com",
              to : email,
              subject : "Sending Email for password reset",
              text : `This link is valid for 2 minutes ${front_end}/forgotPassword/${userFind._id}/${token}/`
          };

          transporter.sendMail(mailOptions , (error,info) => {
              if(error){
                  res.status(200).send({success:false,message : "email not sent , please try again"});
                  return;
              }

              else {
                  //console.log("email sent" ,info.response);
                  res.status(201).send({success : true,message : "Password change link sent to mail successfully"});
                  return;
              }
          });
      }
  } catch (error) {
      res.status(401).send({message : "invalid User"});
  }
});

//to verify forgot-password-link
router.get('/forgotPassword/:id/:token' , async (req,res) => {
  try 
  {
      const {id , token} = req.params;

      const validuser = await User.findOne({_id : id, verifyToken : token});

      const verifyToken = jwt.verify(token,secretKey);

      if(validuser && verifyToken._id){
          res.status(201).send({success : true , validuser});
          return;
      }

      else res.status(401).send({success : false , message : "Not Valid Link"});   
  } catch (error) {
      res.status(401).send({success:false , message : "invalid token"});
    
  }
});

//update password
router.post("/password/:id/:token" , async(req,res) => {

  try {
      const {id,token} = req.params;
      const {password} = req.body;

      if(!password){
        res.status(200).send({message : "Enter Password" , success : false});
        return;
      }
      const validuser = await User.findOne({_id : id, verifyToken : token});

      const verifyToken = jwt.verify(token,secretKey);

      if(validuser && verifyToken._id){
          const newPassword = await bcrypt.hash(password , 12);
          const setNewUserPass = await User.findByIdAndUpdate(id,{password : newPassword});

          await setNewUserPass.save(); 
          res.status(201).send({success : true , setNewUserPass , message:"Password Updated Successfully"});
          return;
      }

      else res.status(201).send({success : false , message : "user not exits"});
  } 
  catch (error) {
      res.status(401).send({success:false , message : "invalid token"});
  }
});


module.exports = router;

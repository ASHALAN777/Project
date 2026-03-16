const {
  signupvalidation,
  loginvalidation,
} = require("../middleware/AuthValidation");

const {
  Signupcontrol,
  Logincontrol,
} = require("../controllers/AuthController");

const authMiddleware = require("../middleware/authMiddleware");

const refresher = require("../middleware/refreshMiddleware");
const { forgotpassword,otpverify,resetpassword} =require ("../controllers/forgotPassword")

const User = require("../Models/user-schema");

const router = require("express").Router();

router.post("/signup", signupvalidation, Signupcontrol);
router.post("/login", loginvalidation, Logincontrol);

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      authenticated: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({ message: "Logged out" });
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select(
      "name email role CreatedAt leaveStatus salary leaves",
    );

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/test-sanitize", (req, res) => {
//   console.log("Body:", req.body);

//   res.json({
//     message: "Sanitize working",
//     body: req.body
//   });
// });

router.post("/refresh", refresher);

router.patch("/leave/:id", authMiddleware, async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const Updateduser = await User.findById(req.params.id);

    if (!Updateduser) {
      return res.status(404).json({ message: "User not found" });
    }
    const leave = Updateduser.leaves.id(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "leave not found" });
    }
    leave.status = status;
    leave.adminaction = new Date();

    Updateduser.leaveStatus = status === "Approved" ? "Approved" : "Rejected";

    await Updateduser.save();

    res.json({
      message: "Leave status updated",
      leaveStatus: Updateduser.leaveStatus,
      id: Updateduser._id,
      success: true,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});

router.post("/leave/:id/apply", authMiddleware, async (req, res) => {
  try {
    const leave = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "Employee") {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }
    user.leaveStatus = "Applied";
    user.leaves.push({
      leavedate: new Date(),
      leavereason: leave.leavereason,
      leavefromdate: leave.leavefromdate,
      leavetodate: leave.leavetodate,
      status: "Applied",
    });

    await user.save();

    res.json({
      success: true,
      message: "Leave applied",
      user,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Leave application failed" });
  }
});
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, Mobile, Address, age, Date_of_birth } = req.body;

    if (name !== undefined) user.name = name;
    if (Mobile !== undefined) user.Mobile = Mobile;
    if (Address !== undefined) user.Address = Address;
    if (age !== undefined) user.age = age;
    if (Date_of_birth !== undefined) user.Date_of_birth = Date_of_birth;

    await user.save();

    res.json({
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Profile Updation failed" });
  }
});


router.post("/forgot-password", forgotpassword)
router.post("/verify-otp", otpverify)
router.post("/reset-password", resetpassword)
















module.exports = router;

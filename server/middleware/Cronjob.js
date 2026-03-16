const cron = require("node-cron");
const User = require("../Models/user-schema");

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    const users = await User.find({ "leaves.status": "Applied" });

    for (const user of users) {
      let updated = false;
      for (const leave of user.leaves) {
        if (leave.status !== "Applied") continue;

        const hourspassed =
          (now - new Date(leave.appliedAt)) / (1000 * 60 * 60);
        if (hourspassed >= 24) {
          ((leave.status = "Expired"), (leave.adminaction = now));
          user.leaveStatus = "Rejected";
          updated = true;
        }
        // console.log("Cron running at", new Date());

      }
      await user.save();
    }
  } catch (err) {
    // console.error("Error updating expired leaves:", err);
  }
});

module.exports = cron;
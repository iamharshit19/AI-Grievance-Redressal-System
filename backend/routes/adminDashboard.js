import express from "express";
const router = express.Router();
import Grievance from "../models/Grievance.js";

router.get("/stats", async (req, res) => {
  try {
    const total = await Grievance.countDocuments({});
    const resolved = await Grievance.countDocuments({ status: "Resolved" });
    const pending = await Grievance.countDocuments({ status: "Processing" });
    const inProgress = await Grievance.countDocuments({ status: "Processing" });
    const critical = await Grievance.countDocuments({
      message: { $regex: /(urgent|flood|accident)/i },
    });

    res.json({ total, resolved, pending,  inProgress, critical });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Grievance.find({
      message: { $regex: /(flood|accident|fire|collapse)/i },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = alerts.map((a) => ({
      title: `Alert: ${a.department}`,
      message: a.message,
      time: a.createdAt.toLocaleString(),
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/progress/monthly", async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const previousMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const year = now.getFullYear();
    const prevYear = previousMonth === 12 ? year - 1 : year;

    const result = await Grievance.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(prevYear, previousMonth - 1, 1),
            $lte: new Date(year, thisMonth, 0, 23, 59, 59), // End of this month
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          name: {
            $arrayElemAt: [
              [
                "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              "$_id.month"
            ],
          },
          total: 1,
          resolved: 1,
          _id: 0,
        },
      },
      { $sort: { name: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error fetching monthly stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/tasks", async (req, res) => {
  res.json([
    {
      id: 1,
      priority: "high",
      title: "Review Water Supply Complaint",
      deadline: "Today, 5:00 PM",
      status: "Unassigned",
    },
    {
      id: 2,
      priority: "medium",
      title: "Field Inspection Report",
      deadline: "Tomorrow, 2:00 PM",
      status: "Unassigned",
    },
  ]);
});
router.put("/grievances/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Not found" });
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Fetch grievances
router.get("/grievances", async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch grievances" });
  }
});
router.get("/grievances/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ error: "Not found" });
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



export default router;

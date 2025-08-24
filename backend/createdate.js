db.grievances.find({ createdAt: { $type: "string" } }).forEach(function(doc) {
    db.grievances.updateOne(
      { _id: doc._id },
      { $set: { createdAt: new Date(doc.createdAt) } }
    );
  });

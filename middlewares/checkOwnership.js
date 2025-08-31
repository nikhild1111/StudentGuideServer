const express = require("express");

// middlewares/checkOwnership.js
const checkOwnership = (resourceType) => {
  return (req, res, next) => {
    try {
      const { role, _id, guideProfile, mentorProfile, booksProfile } = req.user;
      const resourceId = req.params.id; // guide/mentor/book/profile id from URL

      // ✅ If Admin, allow directly
      if (role === "admin") {
        return next();
      }

      let exists = false;

      switch (resourceType) {
        case "guide":
          exists = guideProfile?.toString() === resourceId;
          break;

        case "mentor":
          exists = mentorProfile?.toString() === resourceId;
          break;

        case "book":
          exists = (booksProfile || []).some(
            (bookId) => bookId.toString() === resourceId
          );
          break;

        case "profile":
          // ✅ Only allow if user is updating/deleting their own profile
          exists = _id?.toString() === resourceId;
          break;

        default:
          return res.status(400).json({ message: "Invalid resource type" });
      }

      if (!exists) {
        return res.status(403).json({
          message: `Not authorized: ${resourceType} not linked to your account`,
        });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = checkOwnership;

const EmployeeProfile = require("../models/employeeProfile"); // Ensure this path is correct

exports.getAllEmployeeApplicationInfo = async (req, res) => {
  try {
    // Fetching all employee profiles from the database
    const employeeProfiles = await EmployeeProfile.find({});

    // Check if employeeProfiles array is empty
    if (employeeProfiles.length === 0) {
      return res.status(404).json({ message: "No employee profiles found" });
    }

    const response = employeeProfiles.map((profile) => {
      // Constructing name
      const firstName = profile.name?.first || "";
      const middleName = profile.name?.middle ? profile.name.middle + " " : "";
      const lastName = profile.name?.last || "";
      const name = `${firstName} ${middleName}${lastName}`.trim();

      // Extracting work authorization details
      const workAuthorization = profile.workAuthorization
        ? {
            kind: profile.workAuthorization.kind || "Not Available",
            title: profile.workAuthorization.title || "Not Available",
            proof: profile.workAuthorization.proof || "Not Available",
            start: profile.workAuthorization.start
              ? profile.workAuthorization.start.toDateString()
              : "Not Available",
            end: profile.workAuthorization.end
              ? profile.workAuthorization.end.toDateString()
              : "Not Available",
          }
        : "No Work Authorization Info";

      // Extracting current visa step
      const visaCurrStep = profile.visaCurrStep || "No Current Visa Step";

      // Extracting visa status details
      const visaStatus = profile.visaStatus || null;

      return {
        id: profile._id.toString(),
        name: name,
        workAuthorization: workAuthorization,
        visaCurrStep: visaCurrStep,
        visaStatus: visaStatus, // Adding visa status to the response
      };
    });

    res.json(response);
  } catch (error) {
    console.error("Error: ", error); // Error logging
    res.status(500).send(error.message);
  }
};

const EmployeeProfile = require("../models/employeeProfile"); // Ensure this path is correct
const ApiError = require("../errors/ApiError");
const sendEmail = require("../utils/sendEmail");

const nextStepMap = {
  OPTreceipt: "OPTead",
  OPTead: "I983",
  I983: "I20",
};

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

exports.updateVisaStatueById = async (req, res, next) => {
  try {
    const { profileId, action, feedback } = req.body;
    const existingProfile = await EmployeeProfile.findById(profileId).populate(
      "employeeId"
    );
    if (!existingProfile) {
      throw new ApiError(404, "profile not found");
    }
    if (action === "reject" && !feedback) {
      throw new ApiError(400, "reject action needs a feedback");
    }
    const currStep =
      existingProfile.visaStatus[existingProfile.visaCurrStep]?.step;
    if (!currStep) {
      throw new ApiError(404, "step not found");
    }

    switch (action) {
      case "approve":
        currStep.status = "approved";
        currStep.feedback = null;
        if (existingProfile.visaCurrStep === "I20") {
          existingProfile.visaCurrStep = "complete";
        } else {
          existingProfile.visaCurrStep =
            nextStepMap[existingProfile.visaCurrStep];
        }
        await sendEmail(
          existingProfile.employeeId.email,
          `Your ${existingProfile.visaCurrStep} document is approved!`
        );
        break;
      case "reject":
        currStep.status = "rejected";
        currStep.feedback = feedback;
        await sendEmail(
          existingProfile.employeeId.email,
          `Your ${existingProfile.visaCurrStep} document is rejected!`
        );
        break;
      default:
        throw new ApiError(400, "action must be either approve or reject");
    }
    await existingProfile.save();
    const result = await EmployeeProfile.findById(existingProfile._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

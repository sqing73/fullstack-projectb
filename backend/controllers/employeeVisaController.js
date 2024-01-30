const EmployeeProfile = require("../models/employeeProfile"); // Import Employee model

exports.getVisaStatus = async (req, res) => {
  try {
    await req.user.populate("profile");
    const profile = req.user.profile;
    if (!profile || !profile.visaStatus) {
      return res.status(404).json({ message: "No visa status found" });
    }
    return res.status(200).json({
      visaStatus: req.user.profile.visaStatus,
      visaCurrStep: req.user.profile.visaCurrStep,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateVisaStatusFile = async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).send("Filename is required");
    }

    const profile = await EmployeeProfile.findById(req.user.profile);
    if (!profile) {
      return res.status(404).send("Employee profile not found");
    }

    const currentStep = profile.visaCurrStep;
    if (!currentStep || !profile.visaStatus) {
      return res.status(400).send("Invalid visa status step");
    }

    if (
      profile.visaStatus[currentStep] &&
      profile.visaStatus[currentStep].step
    ) {
      profile.visaStatus[currentStep].step.file = filename;
      profile.visaStatus[currentStep].step.status = "pending";
    } else {
      profile.visaStatus[currentStep] = {
        step: {
          file: filename,
          status: "pending",
          feedback: null,
        },
      };
    }
    await profile.save();
    res.status(200).json({
      message: "Visa status file updated and status set to pending",
      visaStatus: profile.visaStatus,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new visa record for an employee
exports.createEmployeeProfile = async (req, res) => {
  try {
    //TODO: add logic to create new workauthorization and visa status
    const newEmployeeProfile = new EmployeeProfile({
      ...req.body,
      employeeId: req.user._id,
    });

    const savedEmployeeProfile = await newEmployeeProfile.save();
    req.user.profile = savedEmployeeProfile._id;
    await req.user.save();

    res.status(201).json(savedEmployer); // Send back the created profile with a 201 Created status
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve a specific employee's visa details
exports.getEmployeeProfile = async (req, res) => {
  try {
    if (!req.user.profile) {
      return res.status(404).send("Employee profile not found");
    }
    const profile = await EmployeeProfile.findById(req.user.profile).select(
      "-visaStatus -visaCurrStep -workAuthorization"
    );

    res.json(profile);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Modify an existing employee's visa record
exports.modifyEmployeeProfile = async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };
    //TODO: check if body only contains modifiable fields
    const updatedProfile = await EmployerProfile.findByIdAndUpdate(
      req.user.profile,
      updates,
      { new: true }
    );
    if (!profile) {
      return res.status(404).send("Employer not found");
    }
    res.json(updatedProfile); // Send back the updated profile
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const EmployeeProfile = require("../models/employeeProfile"); // Import Employee model

// Retrieve visa information for an employee
exports.getEmployeeVisaInfo = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const visaStatus = await EmployeeProfile.findOne({
      employeeId: employeeId.toString(),
    }, 'VisaStatus');

    if (!visaStatus) {
      return res.status(404).send("Visa status not found");
    }

    const response = {
      id: visaStatus._id,
      name: `${visaStatus.name.first} ${visaStatus.name.last}`,
      visaStatus: visaStatus.VisaStatus,
      nextStep: visaStatus.visaNextStep,
    };

    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new visa record for an employee
exports.createEmployeeVisa = async (req, res) => {
  try {
    const newVisa = new EmployeeProfile({
      ...req.body,
      visaStatus: {
        inProgress: "yes",
        nextStep: "Submit OPTEAD documents",
      },
    });

    const savedVisa = await newVisa.save();
    res.status(201).json(savedVisa);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve a specific employee's visa details
exports.getEmployeeVisa = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await EmployeeProfile.findById(employeeId, "VisaStatus");

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.json({
      id: employee._id,
      visaStatus: employee.VisaStatus,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Modify an existing employee's visa record
exports.modifyEmployeeVisa = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updates = {
      ...req.body,
      visaStatus: {
        ...req.body.visaStatus,
        inProgress: "yes",
      },
    };

    const updatedEmployee = await EmployeeProfile.findByIdAndUpdate(
      employeeId,
      updates,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).send("Employee not found");
    }

    res.json(updatedEmployee.VisaStatus);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

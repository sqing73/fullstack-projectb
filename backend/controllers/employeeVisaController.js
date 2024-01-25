const EmployeeProfile = require("../models/employeeProfile"); // Import Employee model

exports.getEmployeeApplicationInfo = async (req, res) => {
  try {
    console.log('1');
    const employeeId = req.user.id; // Assuming this is provided by user authentication
    console.log(req.user.id);
    const appStatus = await EmployeeProfile.findOne({
      employeeId: employeeId.toString(),
    })

    if (!appStatus) {
      return res.status(404).send("Application status not found");
    }

    const response = {
      id: appStatus._id, // ObjectId of the application status record
      name: `${appStatus.employeeId.name.first} ${appStatus.employeeId.name.last}`, // Full name
      applicationStatus: appStatus.status, // Application status
      nextStep: appStatus.nextStep, // Next step in the process
    };

    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createEmployeeApplication = async (req, res) => {
  try {
    const newEmployer = new EmployerProfile({
      ...req.body,
      inProgress: "yes",
      nextStep: "HR Review",
    });

    const savedEmployer = await newEmployer.save();
    res.status(201).json(savedEmployer); // Send back the created profile with a 201 Created status
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getEmployeeApplication = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await EmployeeProfile.findById(
      employeeId,
      "name personalInfo residencyStatus.status phoneNumbers email profilePicture address workAuthorization reference"
    );

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    const formattedEmployee = {
      id: employee._id,
      fname: employee.name.first,
      lname: employee.name.last,
      mname: employee.name.middle,
      pname: employee.name.preferred,
      profilePicture: employee.profilePicture,
      address: employee.address,
      cell: employee.phoneNumbers.cell,
      email: employee.email,
      ssn: employee.personalInfo.ssn,
      dob: employee.personalInfo.dob,
      gender: employee.personalInfo.gender,
      citizen: employee.residencyStatus.status,
      workAuth: employee.workAuthorization,
      reference: employee.reference,
    };

    res.json(formattedEmployee);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.modifyEmployeeApplication = async (req, res) => {
  try {
    const employerId = req.params.id;
    const updates = {
      // Contains the fields to update
      ...req.body,
      inProgress: "yes",
    };

    const updatedEmployer = await EmployerProfile.findByIdAndUpdate(
      employerId,
      updates,
      { new: true }
    );
    if (!updatedEmployer) {
      return res.status(404).send("Employer not found");
    }

    res.json(updatedEmployer); // Send back the updated profile
  } catch (error) {
    res.status(500).send(error.message);
  }
};

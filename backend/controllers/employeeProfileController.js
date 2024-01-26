const EmployeeProfile = require("../models/employeeProfile");

exports.getAllEmployeeProfiles = async (req, res) => {
  try {
    const employeeProfiles = await EmployeeProfile.find(
      {},
      "-VisaStatus -visaNextStep"
    );
    // const formattedEmployees = employees.map((emp) => ({
    //   id: emp._id, // Including the ObjectId
    //   name: `${emp.name.first} ${emp.name.middle ? emp.name.middle + " " : ""}${
    //     emp.name.last
    //   }`,
    //   ssn: emp.personalInfo.ssn,
    //   workAuthorizationTitle: emp.residencyStatus.status,
    //   phoneNumber: emp.phoneNumbers.cell, // or work, depending on what you need
    //   email: emp.email,
    // }));
    res.status(200).json(employeeProfiles);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
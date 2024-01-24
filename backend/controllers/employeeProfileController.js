const EmployeeProfile = require("../models/employeeProfile");

exports.getAllEmployeeProfiles = async (req, res) => {
  try {
    const employees = await EmployeeProfile.find({}).select(
      "-applicationStatus"
    );
    // const formattedEmployees = employees.map(emp => ({
    //     id: emp._id,  // Including the ObjectId
    //     name: `${emp.name.first} ${emp.name.middle ? emp.name.middle + ' ' : ''}${emp.name.last}`,
    //     ssn: emp.personalInfo.ssn,
    //     workAuthorizationTitle: emp.residencyStatus.status,
    //     phoneNumber: emp.phoneNumbers.cell, // or work, depending on what you need
    //     email: emp.email
    // }));
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

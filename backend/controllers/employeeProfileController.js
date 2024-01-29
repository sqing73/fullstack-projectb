const EmployeeProfile = require("../models/employeeProfile");
const EmployeeModel = require("../models/employee");

exports.getAllEmployeeProfiles = async (req, res) => {
  try {
    const employeeProfiles = await EmployeeProfile.find({});
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

exports.getNotProfiledEmployees = async (req, res, next) => {
  try {
    const notProfiledEmployees = await EmployeeModel.find({ profile: null });
    res.status(200).json(notProfiledEmployees);
  } catch (error) {
    next(error);
  }
};

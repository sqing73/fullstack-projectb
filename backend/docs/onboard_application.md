# Onboarding Application

## Design
Since each user can only have 1 application, therefore we use `user_id` as `application_id` to simplify the workflow. all functions under `employeeApplicationController` like `getApplication` and `modifyApplication` can be treated as `getProfile` and `modifyProfile`.

## Workflow
For the new employee, enter `/application` will automatically POST employee id to the backend to create a application
- Create application
```
POST /api/application
{ ..., employee: _id }
```
server will return application form
sample response:
```
{
    app_id: id,
    fname: "", 
    lname: "", 
    mname: "",
    pname: "",
    profilePicture: "",
    address: {
      // required
      apt: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cell: "", 
    email: "",
    ssn: "",
    dob: "2024-01-01", 
    gender: "", 
    citizen: "Green Card", 
    workAuth: {
      type: "", 
      proof: "", 
      start: "2024-01-01",
      end: "2024-01-01",
    },
    reference: {
      fname: "", 
      lname: "", 
      mname: "",
      phone: "",
      email: "",
      relationship: "", 
    },
}
```

For the old employee, login should return uid (or application id) and the frontend will store it in the redux
View application
```
GET /api/application/:id
```
if the previous application is rejected, user can modify it and resubmit
Modify application
```
PUT /api/application/:id
{
    application_form
}
```
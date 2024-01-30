# Onboarding Application

## Workflow
For employee, they can access `/application` if their application are not approved yet.
webpage will try to get existing application first,
View application
```
GET /employee/profile
```

if the application has not been submitted yet, submit button will create new application
- Create application
```
POST /employee/profile
data: { ...inputs }
```

if the application has been rejected, submit button will update the application
Modify application
```
PUT /employee/profile
data: { ...inputs }

For HR, they can access applications in `/hr/hiring` and select `onboard` button.
Select the specific application will redirect to `/application/hr_view/:id`, where id is used to identify employee.
HR can *approve* application or *reject* application and leave feedback.

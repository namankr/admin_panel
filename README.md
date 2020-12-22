# admin_panel

Problem Statement 

In the Admin Panel
- Login with admin credentials
- A Mentor CRUD ( Create, Read, Update and Delete) 
- Every mentor there will be add more option to add multiple tasks while create or update mentor
- All Data will store to MongoDb 

Solution 

Getting started !!

Pre requisite to run this project node installed. if not please install from - https://nodejs.org/

Step to connect with database

go to the folder rbac-backend in the project.
In the rbac-backend/server.js file replace line 21 with the connection url shared privately over email.
// line 20 on file //server.js

.connect('mongodb://localhost:27017/rbac')

Running server -

open the terminal under folder rbac-backend Type below two commands

1.npm install 2.npm start

This should start the server at port 3000

Running webapp (front end)

open the terminal under folder frontend Type below two commands

1.npm install 2.npm start

This should start serving the pages at localhost 8080

Notes : 

This is still not a production ready code/project. 
Backend logic needs more validations.
UI Can be improved a lot as i have not focussed on that yet.

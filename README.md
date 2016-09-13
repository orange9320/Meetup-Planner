# Udacity Front-end Meetup Planner Project

## Profile
In this project I made a meetup planner. In this planner, users can register their own accounts and login with their own accounts. Then events can be created and stored locally.

## Preprare
Download the zip project file and extract. Get into "Meetup-Planner\build". 
* Open index.html in a broswer can give a quick locally viewing. 
* Or run command 'python pserver' (for python 3) to start a simple http server and see _localhost:8888_. 
* For python 2, run 'python -m SimpleHTTPServer 8888', and open also at _loaclhost:8888_.

To see codes, get into _src/js_ or _src/css_ and open expected files for more details.

To run gulp, some plugins are needed:
* gulp
* gulp-concat
* gulp-minify-css
* gulp-rename
* gulp-uglify
Them are not included because of number of files limit of submit.

## Start
### login
If you have already registered an account, just type in the account and password to login.

## Register
Otherwise, a new account need to be created. First name, last name, email and password are requried. And employer and title are optional. 

Once all fields are correct, a new account can be created.

## Events board
After login, the events board is devided into 2 parts. One is upcoming events and the other is expired events, based on current time. 

Both parts show recent events first then earlier or more future.

Also, there's will be a hamburger icon will be displayed at left top with 3 functions:
* __Add a new event__ -- add a new event
* __clear__ -- remove all events
* __sign out__ -- return to login window

## Add new event
To create a new event, event name, type, host, start time, end time, location and guest list are required.

If event type is left blank, it will turn to 'Others', and host to [User's name], 
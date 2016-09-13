function appVM() {
    var self = this;

    self.isMenuShow = ko.observable(false);			
    self.isLoginShow = ko.observable(true);
    self.loginError = ko.observable(false);
    self.eventDBName = ko.observable(undefined);
    self.nameErrorMsg = ko.observable("");
    self.emailErrorMsg = ko.observable("");
    self.passwordErrorMsg = ko.observable("");
    self.rePasswordErrorMsg = ko.observable("");
    self.focusPassword = ko.observable(false);
    self.regPassword = ko.observable("");
    self.regRePassword = ko.observable("");
    self.eventNameErrorMsg = ko.observable("");
    self.allHosters = ko.observableArray([]);
    self.eventStartErrorMsg = ko.observable("");
    self.eventEndErrorMsg = ko.observable("");
    self.eventLocationErrorMsg = ko.observable("");
    self.upComingEvents = ko.observableArray([]);
    self.expiredEvents = ko.observableArray([]);
    self.isCreateEvent = ko.observable(false);
    self.isRegisterShow = ko.computed(function() {
        return !self.isLoginShow();
    });
    self.passwordLengthFit = ko.observable(false);
    self.hasDigits = ko.observable(false);
    self.hasLower = ko.observable(false);
    self.hasUpper = ko.observable(false);


    // Switch show/hidden of menu when click hamburger button
    self.menuClick = function() {
        self.isMenuShow(!self.isMenuShow());
    };

    // Hide menu and open create event form
    self.toCreateEvent = function() {
        self.isMenuShow(false);
        self.isCreateEvent(true);
        $("#new-event-name").focus();
        document.getElementById("new-event-starttime").min = timeFormat(new Date());
    };

    // Remove all current events
    self.clearEvents = function() {
        eventDB().remove();
        self.isMenuShow(false);
        refreshEvents();
    };

    // Return to login
    self.signOut = function() {
    	self.isLoginShow(true);
        eventDB = TAFFY();
        self.eventDBName(undefined);
        self.isMenuShow(false);
        self.isCreateEvent(false);
        refreshEvents();
    };

    // check whether valid account and password
    // if so, load user's events/
    // Otherwise, show error message
    self.userLogin = function() {
        userDB = TAFFY().store("userDB");
        var username = $("#user-email");
        var password = $("#user-password");
        var user = userDB({ "email": username.val(), "password": password.val() }).first();
        if (!user) {
            self.loginError(true);
        } else {
            curUser = user;
            loadUserEvents(curUser);
            self.loginError(false);
        }
    };

    // Hide login window and show register window
    self.toRegister = function() {
        self.isLoginShow(false);
        document.getElementById("reg-first-name").focus();
        scrollTo(0, 0);
    };

    // Validity if first name is left blank
    self.firstNameValidity = function() {
        var tar = $("#reg-first-name");
        if (tar.val() === "") {
            self.nameErrorMsg("You can\'t leave this empty");
            inputErrorStyle(tar);
        } else {
            inputInitStyle(tar);
            self.nameErrorMsg("");
        }
    };

    // Validity if last name is left blank
    self.lastNameValidity = function() {
        var tar = $("#reg-last-name");
        if (tar.val() === "") {
            self.nameErrorMsg("You can\'t leave this empty");
            inputErrorStyle(tar);
        } else {
            inputInitStyle(tar);
            if ($("#reg-first-name").val() !== "") {
                self.nameErrorMsg("");
            }
        }
    };

    // Validity if email is left blank
    //					 is exists
    //					 is invalid
    self.emailValidity = function() {
        var tar = $("#reg-email");
        emailPattern = new RegExp("[\\w\-\.]+\\@\\w+\\.\\w+\$");
        var emailText = tar.val();
        if (emailText === "") {
            self.emailErrorMsg("You can\'t leave this empty");
            inputErrorStyle(tar);
        } else if (!emailText.match(emailPattern)) {
            self.emailErrorMsg("It\'s not a valid email format");
            inputErrorStyle(tar);
        } else if (duplicateCheck(emailText)) {
            self.emailErrorMsg("Email has already existed");
            inputInitStyle(tar);
        } else {
            self.emailErrorMsg("");
            inputInitStyle(tar);
        }
    };

    // Password validity
    self.passwordEnter = function() {
        var len = self.regPassword().length;
        var hasDigitPattern = /\d/;
        var hasLowerPattern = /[a-z]/;
        var hasUpperPattern = /[A-Z]/;
        self.passwordLengthFit(len > 7 && len < 21);
        self.hasDigits(self.regPassword().match(hasDigitPattern));
        self.hasLower(self.regPassword().match(hasLowerPattern));
        self.hasUpper(self.regPassword().match(hasUpperPattern));
    };

    // Password error show
    self.passwordValidity = function() {
        var tar = $("#reg-password");
        if (self.passwordLengthFit() &&
            self.hasDigits() &&
            self.hasLower() &&
            self.hasUpper()) {
            self.passwordErrorMsg("");
            inputInitStyle(tar);
        } else {
            self.passwordErrorMsg("Your password does not match all standards.");
            inputErrorStyle(tar);
        }
    };

    // Second password validity
    self.rePasswordValidity = function() {
        var tar = $("#reg-repassword");
        if (self.regPassword() === self.regRePassword()) {
            self.rePasswordErrorMsg("");
            inputInitStyle(tar);
        } else {
            self.rePasswordErrorMsg("Two passwords should be same.");
            inputErrorStyle(tar);
        }
    };

    // Check all field before create account
    self.createValidity = function() {
        var tar = $("#create-button");
        var allCorrect = self.nameErrorMsg() === "" &&
            self.emailErrorMsg() === "" &&
            self.passwordErrorMsg() === "" &&
            self.rePasswordErrorMsg() === "";
        if (!allCorrect) {
            alert("Please fix all red wrong fields before create account!");
        } else {
            curUser = new regAccount();
            userDB.insert(curUser);
            loadUserEvents(curUser);
        }
    };

    self.eventNameValidity = function() {
        var tar = $("#new-event-name");
        if (tar.val() === "") {
            self.eventNameErrorMsg("You can\'t leave this empty.");
            inputErrorStyle(tar);
        } else {
            self.eventNameErrorMsg("");
            inputInitStyle(tar);
        }
    };

    self.eventTypeValidity = function() {
        var tar = $("#new-event-type").prev();
        if (tar.val() === "") {
            tar.val("Others");
        }
    };

    self.eventHostValidity = function() {
        var tar = $("#new-event-host").prev();
        if (tar.val() === "") {
            tar.val(curUser.showName);
        }
    };

    self.startTimeValidity = function() {
        var tar = $("#new-event-starttime");
        var nextTar = $("new-event-endtime");
        if (tar.val() === "") {
            self.eventStartErrorMsg("You need to choose a start time.");
            inputErrorStyle(tar);
        } else if(tar.val() < timeFormat(new Date())){
            self.eventStartErrorMsg("Start time is already passed.");
            inputErrorStyle(tar);
        } else{
            self.eventStartErrorMsg("");
            inputInitStyle(tar);
            document.getElementById("new-event-endtime").min = tar.val();
        }
    };

    self.endTimeValidity = function() {
        var prevTar = $("#new-event-starttime");
        var tar = $("#new-event-endtime");
        var endTimeText = tar.val();
        if (endTimeText === "") {
            self.eventEndErrorMsg("You need to choose end time.");
            inputErrorStyle(tar);
        } else if (endTimeText <= prevTar.val()) {
            self.eventEndErrorMsg("End time cannot earlier than start.");
            inputErrorStyle(tar);
        } else {
            self.eventEndErrorMsg("");
            inputInitStyle(tar);
        }
    };

    self.eventLocationValidity = function() {
        var tar = $("#new-event-location");
        if (tar.val() === "") {
            self.eventLocationErrorMsg("You can\'t leave this empty.");
            inputErrorStyle(tar);
        } else {
            self.eventLocationErrorMsg("");
            inputInitStyle(tar);
        }
    };

    self.eventGuestsValidity = function() {
        var tar = $("#new-event-guests");
        if (tar.val() === "") {
            tar.val("None");
        }
    };

    self.createEventValidity = function() {
        var tar = $("#create-event-button");
        var allCorrect = self.eventNameErrorMsg() === "" &&
            self.eventStartErrorMsg() === "" &&
            self.eventEndErrorMsg() === "" &&
            self.eventLocationErrorMsg() === "";
        if (!allCorrect) {
            alert("Please fix all red wrong fields!");
        } else {
            var curEvent = new event();
            eventDB.insert(curEvent);
            refreshEvents();
            self.isCreateEvent(false);
        }

    };

    var inputErrorStyle = function(tar) {
        tar.css({ borderColor: "red", borderStyle: "solid" });
    };

    var inputInitStyle = function(tar) {
        tar.css({ borderColor: "", borderStyle: "" });
    };

    // Check whether current email is existed
    var duplicateCheck = function(tarEmail) {
        var existEmail = userDB({ "email": tarEmail });
        if (existEmail.count() > 0) {
            return true;
        }
        return false;
    };

    // create a new account
    var regAccount = function() {
        this.firstName = $("#reg-first-name").val();
        this.lastName = $("#reg-last-name").val();
        this.showName = this.firstName[0].toUpperCase() + this.firstName.substring(1) + " " + this.lastName.toUpperCase();
        this.email = $("#reg-email").val();
        this.password = $("#reg-password").val();
        this.employer = $("#reg-employer").val();
        this.title = $("#reg-title").val();
        this.dbName = randName(18);
    };

    // Create a new event and clear form
    var event = function() {
        pNname = $("#new-event-name");
        pType = $("#new-event-type").prev();
        pHost = $("#new-event-host").prev();
        pStartTime = $("#new-event-starttime");
        pEndTime = $("#new-event-endtime");
        pLocation = $("#new-event-location");
        pGuests = $("#new-event-guests");
        pMessage = $("#new-event-msg");

        this.name = pNname.val();
        this.type = pType.val();
        this.host = pHost.val();
        this.startTime = pStartTime.val();
        this.endTime = pEndTime.val();
        this.location = pLocation.val();
        this.guests = pGuests.val();
        this.message = pMessage.val();

        pNname.val("");
        pType.val("");
        pHost.val("");
        pStartTime.val("");
        pEndTime.val("");
        pLocation.val("");
        pGuests.val("");
        pMessage.val("");
    };

    var timeFormat = function(t) {
        var yyyy = t.getYear() + 1900;
        var mm = t.getMonth() + 1;
        var dd = t.getDate();
        var HH = t.getHours();
        var MM = t.getMinutes();

        if (mm < 10) mm = "0" + mm;
        if (dd < 10) dd = "0" + dd;
        if (HH < 10) HH = "0" + HH;
        if (MM < 10) MM = "0" + MM;
        return yyyy + "-" + mm + "-" + dd + "T" + HH + ":" + MM;
    };

    var randName = function(n) {
        var text = Math.random().toString(36).substr(2, 1 + n);
        if (userDB({ "dbName": text }).count > 0) {
            text = randName(16);
        }
        return text;
    };


    var loadFreqHoster = function(db) {
        db().distinct("host").forEach(function(hoster) {
            self.allHosters.push({ "hoster": hoster });
        });
    };

    // Load user's event
    var loadUserEvents = function(curUser) {
        self.eventDBName(curUser.dbName);
        eventDB = TAFFY().store(self.eventDBName());
        loadFreqHoster(eventDB);
        refreshEvents();
    };

    // refresh current user's event
    var refreshEvents = function() {
        var allEvents = eventDB().order("startTime").get();
        var curTime = timeFormat(new Date());
        self.upComingEvents([]);
        self.expiredEvents([]);
        allEvents.forEach(function(event) {
            if (event.startTime < curTime) {
                self.expiredEvents.push(event);
            } else {
                self.upComingEvents.push(event);
            }
        });

        self.expiredEvents.reverse();
    };

    var userDB = TAFFY().store("userDB");
}


// Start
ko.applyBindings(new appVM());

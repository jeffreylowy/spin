// @ts-ignore
angular
  .module("app.services", [])

  .service("loginService", function($http, $rootScope) {
    return {
      // @ts-ignore
      data: {},
      getLogin: function(username, password) {
        self = this;
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRConsAPI",
          data:
            "method=login" +
            $rootScope.luminate.postdata +
            "&user_name=" +
            username +
            "&password=" +
            password,
          headers: $rootScope.luminate.header
        })
          .success(function(data) {
            // @ts-ignore
            self.data = data.loginResponse;
            // @ts-ignore
            return self.data;
          })
          .error(function(error) {
            console.log(error.errorResponse.message);
          });
      }
    };
  })
  .service("constituentService", function($http, $rootScope) {
    return {
      getConsRecord: function() {
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRConsAPI",
          data:
            "method=getUser" +
            $rootScope.luminate.postdata +
            "&cons_id=" +
            $rootScope.luminate.cons_id +
            "&sso_auth_token=" +
            $rootScope.luminate.token,
          headers: $rootScope.luminate.header
        }).then(
          function(consResponse) {
            $rootScope.luminate.cons_info = consResponse.data.getConsResponse;

            var customBooleans = $rootScope.luminate.cons_info.custom.boolean;
            var customStrings = $rootScope.luminate.cons_info.custom.string;

            $rootScope.groupArray = [].concat(customBooleans, customStrings);

            //Angular forEach testing Custom Strings
            // @ts-ignore
            angular.forEach($rootScope.groupArray, function(value, key) {
              var cons_customId = value.id;
              var cons_customContent = value.content;

              switch (cons_customId) {
                // ALC Medical Waiver complete (constituent checkbox)
                case "custom_boolean3":
                  $rootScope.luminate.bikeParking =
                    cons_customContent === "true" ? true : false;
                  break;

                // Bike Parking boolean
                case "custom_boolean13":
                  $rootScope.luminate.bikeParking =
                    cons_customContent === "true" ? true : false;
                  break;

                // Roadie Team Assignment
                case "custom_string3":
                  $rootScope.luminate.roadieTeamAssignment = cons_customContent;
                  break;

                // Roadie Team Captain
                case "custom_string5":
                  $rootScope.luminate.roadieTeamCaptain = cons_customContent;
                  break;

                // Meal Preference
                case "custom_string9":
                  $rootScope.luminate.tentAddress = cons_customContent;
                  break;

                // Meal Preference
                case "custom_string11":
                  $rootScope.luminate.mealPreference = cons_customContent;
                  break;

                // Tent Keyword
                case "custom_string14":
                  $rootScope.luminate.tentKeyword = cons_customContent;
                  break;

                // ALC Representitive
                case "custom_string16":
                  $rootScope.luminate.alcRep = cons_customContent;
                  break;

                // ALC Region
                case "custom_string19":
                  $rootScope.luminate.alcRegion = cons_customContent;
                  break;

                // Bike rack to use as a fallback instead of Firebase
                case "custom_string28":
                  $rootScope.luminate.bikeRack = cons_customContent;
                  break;

                // ALC Shirt Size
                case "custom_string30":
                  $rootScope.luminate.shirtSize = cons_customContent;
                  break;
              }
            });
          },
          function(consResponseErorr) {
            console.log(
              "Error getting Constituent Information",
              consResponseErorr
            );
          }
        );
      }
    };
  })
  // @ts-ignore
  .service("incentivesService", function($rootScope, $stateParams, $http) {
    var cons_id = $rootScope.luminate.cons_id;

    return {
      getIncentives: function getIncentives() {
        // @ts-ignore
        var incentives = firebaseIncentives
          .database()
          .ref("/incentives/" + cons_id);
        return incentives;
      },
      getTop545: function getIncentives() {
        // @ts-ignore
        var incentives = firebaseIncentives
          .database()
          .ref("/top545/" + cons_id);
        return incentives;
      },
      getTop50: function getIncentives() {
        // @ts-ignore
        var incentives = firebaseIncentives.database().ref("/top50/" + cons_id);
        return incentives;
      },
      updateIncentives: function updateIncentives(incentiveObject) {
        // @ts-ignore
        firebase
          .database()
          .ref("/" + cons_id)
          .set(incentiveObject);
      }
    };
  })
  // @ts-ignore
  .service("bikeParkingService", function($rootScope, $stateParams, $http) {
    var participantNumber = $rootScope.luminate.tr_info.raceNumber;
    return {
      getBikeLocation: function getBikeLocation() {
        console.log("Hi from the bikeParkingService 👋");
        // @ts-ignore
        var bikeParking = firebaseBikeParking
          .database()
          .ref("/" + participantNumber);
        return bikeParking;
      }
    };
  })
  // @ts-ignore
  .service("interactionService", function($rootScope, $stateParams, $http) {
    return {
      logInteraction: function(subject, body) {
        // Log login interaction to CONS profile
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRConsAPI",
          data:
            "method=logInteraction" +
            $rootScope.luminate.postdata +
            "&interaction_subject=" +
            subject +
            "&cons_id=" +
            $rootScope.luminate.cons_id +
            "&interaction_body=" +
            body +
            "&interaction_type_id=1010&sso_auth_token=" +
            $rootScope.luminate.token,
          headers: $rootScope.luminate.header
        })
          // @ts-ignore
          .success(function(loginResponseData) {
            console.log("Login interaction successful");
          })
          .error(function(response) {
            console.log("Interaction error:", response);
          });
      }
    };
  })
  .service("teamRaiserService", function($http, $rootScope) {
    return {
      getTeamRaiserRegistration: function() {
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRTeamraiserAPI",
          data:
            "method=getRegistration" +
            $rootScope.luminate.postdata +
            "&sso_auth_token=" +
            $rootScope.luminate.token +
            "&fr_id=" +
            $rootScope.luminate.fr_id,
          headers: $rootScope.luminate.header
        }).then(
          function(trResponse) {
            $rootScope.luminate.tr_info =
              trResponse.data.getRegistrationResponse.registration;
            console.log(
              "$rootScope.luminate.tr_info ",
              $rootScope.luminate.tr_info
            );

            /**
             * --- ASSIGN PARTICIPATION TYPE BASED ON PARTICIPATION TYPE ID NUMBER ---
             * Sets the participation type based on the ID numbers in $rootSceope
             * $rootScope should be the only place you will need to make updates each year
             * Update the IDs in $rootScope using the participation type IDs in
             * the TeamRasier settings.
             *
             * IDs are located in:
             * Luminate Online > TeamRaiser > [TeamRaiser Campaign] > 7. Manage Participation Types
             */

            switch ($rootScope.luminate.tr_info.participationTypeId) {
              case $rootScope.luminate.type_id.cyclist:
                // Participation type is Cyclist
                $rootScope.luminate.tr_info.typeName = "Cyclist";
                break;
              case $rootScope.luminate.type_id.staff:
                // Participation type is Staff
                $rootScope.luminate.tr_info.typeName = "Staff";
                break;
              case $rootScope.luminate.type_id.roadie:
                // Participation type is Staff
                $rootScope.luminate.tr_info.typeName = "Roadie";
                break;
            }
          },
          function(trResponseErorr) {
            console.log(
              "Error getting TeamRaiser Registration:",
              trResponseErorr
            );
          }
        );
      }
    };
  })
  .service("tentMateService", function($http, $rootScope) {
    return {
      getTentMate: function() {
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRTeamraiserAPI",
          data:
            "method=getTentmate" +
            $rootScope.luminate.postdata +
            "&sso_auth_token=" +
            $rootScope.luminate.token +
            "&fr_id=" +
            $rootScope.luminate.fr_id,
          headers: $rootScope.luminate.header
        }).then(
          function(tentMateResponse) {
            /**
             * --- TENT ASSIGNMENT STATUS CODES ---
             * 0 = Initial status
             * 1 = Eligible for pairing
             * 2 = No tent required
             * 3 = Single tent
             * 4 = Requested
             * 5 = Requested by tentmate
             * 6 = Requested by tentmate and eligible
             * 7 = Accepted awaiting eligibility
             * 8 = Accepted awaiting tentmate eligibility
             * 9 = Accepted and confirmed
             */

            $rootScope.luminate.tentMate =
              tentMateResponse.data.getTentmateResponse.record;
          },
          function(tentMateResponseErorr) {
            console.log(
              "Error getting TeamRaiser Registration:",
              tentMateResponseErorr
            );
          }
        );
      }
    };
  })
  .service("participantProgress", function($http, $rootScope) {
    return {
      getProgress: function() {
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRTeamraiserAPI",
          data:
            "method=getParticipantProgress" +
            $rootScope.luminate.postdata +
            "&cons_id=" +
            $rootScope.luminate.cons_id +
            "&fr_id=" +
            $rootScope.luminate.fr_id,
          headers: $rootScope.luminate.header
        }).then(
          function(partProgressResponse) {
            $rootScope.luminate.tr_part_progress =
              partProgressResponse.data.getParticipantProgressResponse.personalProgress;
          },
          function(partProgressErorr) {
            console.log("Error getting trPartReponse: ", partProgressErorr);
          }
        );
      }
    };
  })
  .service("constituentGroupsService", function($http, $rootScope) {
    return {
      getGroups: function() {
        $http({
          method: "POST",
          url: $rootScope.luminate.uri + "CRConsAPI",
          data:
            "method=getUserGroups" +
            $rootScope.luminate.postdata +
            "&sso_auth_token=" +
            $rootScope.luminate.token +
            "&cons_id=" +
            $rootScope.luminate.cons_id,
          headers: $rootScope.luminate.header
        }).then(
          function(grpResponse) {
            $rootScope.luminate.grp_info =
              grpResponse.data.getConsGroupsResponse.group;

            // @ts-ignore
            angular.forEach($rootScope.luminate.grp_info, function(value, key) {
              var convioGroupId = value.id;

              /**
               * --- ASSIGN ORIENTATION MEETING TIME AND MEDICAL FORM CHECK ---
               * Assign POM time to groups object.
               * Participants are added to an email group associated with each POM when they RSVP
               * The IDs in the Switch statement below are the email group IDs
               */

              switch (convioGroupId) {
                case $rootScope.luminate.group_id.pom_one:
                  $rootScope.luminate.groups.pom = "9:30 AM";
                  break;
                case $rootScope.luminate.group_id.pom_two:
                  $rootScope.luminate.groups.pom = "11:00 AM";
                  break;
                case $rootScope.luminate.group_id.pom_three:
                  $rootScope.luminate.groups.pom = "2:00 PM";
                  break;
                case $rootScope.luminate.group_id.pom_four:
                  $rootScope.luminate.groups.pom = "4:00 PM";
                case $rootScope.luminate.group_id.medical:
                  // The group ID for the ALC Medform Complete group.
                  // Clear the group of all memebers. Update the checkbox. Run query with same name.
                  $rootScope.luminate.groups.med_form = true;
              }
            });
          },
          function(grpResponseErorr) {
            console.log("Error getting grpResponse: ", grpResponseErorr);
          }
        );
      }
    };
  })
  // @ts-ignore
  .service("appConfigService", function($http, $rootScope) {
    return {
      getConfig: function getConfig() {
        // @ts-ignore
        fb_appConfig
          .database()
          .ref("/")
          .on("value", function(snapshot) {
            // Database snapshot of the config object
            var config = snapshot.val();

            // Get TeamRaiser ID from Firebase
            $rootScope.luminate.fr_id = String(config.teamraiser.id);
            // Get Cyclist participation type ID from Firebase
            $rootScope.luminate.type_id = {
              cyclist: String(config.part_types.cyclist),
              office: String(config.part_types.office),
              roadie: String(config.part_types.roadie),
              staff: String(config.part_types.staff),
              trl: String(config.part_types.trl),
              virtual: String(config.part_types.virtual)
            };

            $rootScope.luminate.group_id = {
              pom_one: String(config.pom.pom_one),
              pom_two: String(config.pom.pom_two),
              pom_three: String(config.pom.pom_three),
              pom_four: String(config.pom.pom_four),
              medical: String(config.med_form)
            };
          });
      }
    };
  });

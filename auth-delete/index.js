/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

function listAllUsers(nextPageToken) {
  // List batch of users, 10 at a time.
  admin.auth().listUsers(10, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
          
        //console.log("user", userRecord.toJSON());
        admin.auth().deleteUser(userRecord.uid)
            .then(function() {
                console.log("Successfully deleted user");
                  return null;
            })
            .catch(function(error) {
                console.log("Error deleting user:", error);
            });

      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
          //Wait because timeout
          //This is important because cloud function doesn't allow more 60 second for a cloud function
          setTimeout(listAllUsers(listUsersResult.pageToken), 2000);
                  
      }
      return null;
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
}

exports.clean = functions.https.onRequest((req, res) => {
   listAllUsers();
});
// [END import]
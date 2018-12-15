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

// The Firebase Admin SDK to access the Firebase Firestore Database.
const admin = require('firebase-admin');
admin.initializeApp();


//this is location of message body 
//if you do not want to update your cloud function for message body this can be used to change message body dynamically
const messageBody = admin.firestore().collection(`basic`).doc(`message`)

exports.dailyNotification = functions.https.onRequest((request, res) => {

        console.log("Error fetching messageBody:", request.body.topic);

  return messageBody.get().then(messageBodyResult => {

    const title = messageBody.data().title;

       const payload = {
        notification: {
          title : "New Notification",
          body: `${title}`,
          icon: "default",
          click_action : "com.example.pulkit.TARGET_NOTIFICATION",//if you want to handle on click of notification
          color : "#1589EE"
        },
        //this is for sending intent data 
        data : {
          from_user_id : title,
          userName : title

        }
      };
// here first param is your fcm topic name to which you want to send notification
//second param corresponds to notification data
          return admin.messaging().sendToTopic("testing", payload).then(response => {
            res.send("Completed");
        return null;

      });


    })
    .catch(function(error) {
        console.log("Error Sending Notification:", error);
    });
    
});
// [END import]
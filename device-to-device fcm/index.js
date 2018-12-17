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


exports.sendRequest = functions.firestore.document(`users/{user_id}/notifications/{notification_id}`)
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Database.
      const user_id = context.params.user_id;
      const notification_id = context.params.notification_id;

      /*
   * 'fromUser' query retreives the ID of the user who sent the notification
   */

  const fromUser = admin.firestore().collection(`users`).doc(user_id).collection('notifications').doc(notification_id)

  return fromUser.get().then(fromUserResult => {

    const from_user_id = fromUserResult.data().from;
    const type = fromUserResult.data().type;
    const count = fromUserResult.data().count;


    /*
     * The we run two queries at a time using Firebase 'Promise'.
     * One to get the name of the user who sent the notification
     * another one to get the devicetoken to the device we want to send notification to
     */

    const userQuery = admin.firestore().collection(`users`).doc(from_user_id).get()
    const deviceToken = admin.firestore().collection(`users`).doc(user_id).get()

    return Promise.all([userQuery, deviceToken]).then(result => {

      const userName = result[0].data().name;
      const token_id = result[1].data().device_token;

      /*
       * We are creating a 'payload' to create a notification to be sent.
       */
      var payload;
      payload = {
        notification: {
          title : "New Friend Request",
          body: `${userName} has sent you request`,
          click_action : "com.example.pulkit.chatapp1_TARGET_NOTIFICATION",
          color : "#5351f5",
          priority: "high"
        },
        data : {
          from_user_id : from_user_id,
          userName : userName
        }
      };
      /*
       * Then using admin.messaging() we are sending the payload notification to the token_id of
       * the device we retreived.
       */

      return admin.messaging().sendToDevice(token_id, payload).then(response => {
        return null;

      });

    });

  });

    });

// [END import]
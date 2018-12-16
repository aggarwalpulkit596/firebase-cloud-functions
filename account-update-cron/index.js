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
const secureCompare = require('secure-compare');
admin.initializeApp();


exports.resetHits = functions.https.onRequest((req, res) => {

	const key = req.query.key;

  	// Exit if the keys don't match.
  	if (!secureCompare(key, functions.config().cron.key)) {
    	console.log('The key provided in the request does not match the key set in the environment. Check that', key,
        	'matches the cron.key attribute in `firebase env:get`');
    	res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        	'cron.key environment variable.');
    return null;
  	}
	//This sets all users 'hits' property to 0 at users/{userid}/hits 
	admin.firestore().collection('users').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
                  admin.firestore().collection(`users`).doc(doc.id).set({
             hits: 0
          }, {merge: true});
        })
    return res.send("Hits Reset Protocol Completed");
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
});
// [END import]
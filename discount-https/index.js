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

const functions = require(‘firebase-functions’);
const cors = require(‘cors’)({origin: true});
const validator = require(‘validator’);
exports.discount = functions.https.onRequest((req, res) => {
 if (req.method === ‘PUT’) {
 res.status(403).send(‘Forbidden!’);
 }
 cors(req, res, () => {
 let amount = req.query.orderAmt;
 if (!amount) {
 amount = req.body.orderAmt;
 }
 let discount;
 if(validator.isNumeric(amount)){
 discount = ‘Invalid Order Amount’;
 }else{
 if (amount < 200){
 discount = ‘Eligible for extra 10% off’;
 }else if(amount > 199 && amount < 400){
 discount = ‘Eligible for extra 15% off’;
 }else if(amount > 399 && amount < 600){
 discount = ‘Eligible for extra 20% off’;
 }else{
 discount = ‘Eligible for extra 25% off’;
 }
 }
 res.status(200).send(discount);
});
});

// [END import]
<<<<<<< HEAD
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
console.log(OAuth2Client);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';


var express = require('express')
var app = express()

//Transform the content of cash flow data rows and columns here
function transformData(rows){
	//Iterating over the rows here
	for(var i=0; i <rows.length; i++){
		//Changing the content of first column of each row here	
		rows[i][0] = i;
		rows[i][1] = "COPYAPP"
		rows[i][2] = rows[i][2] + "1";
	}
	
	// Return modified rows
	return rows;
}



// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), coreFn2);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function coreFn(auth){
	console.log("Call came here");	
	
	  
	  const sheets = google.sheets({version: 'v4', auth});
	  sheets.spreadsheets.values.get({
		//spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
		spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
		range: 'Sheet1!A2:E',
	  }, (err, {data}) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = data.values;
		if (rows.length) {
		  console.log('Name, Major:');
		  // Print columns A and E, which correspond to indices 0 and 4.
		  rows.map((row) => {
			console.log(`${row[0]}, ${row[4]}`);
			app.get('/', function (req, res, auth) {
				res.send("" + data.values)
			});

			
		  })
		} else {
		  console.log('No data found.');
		}
	  });
	 
	  	
	
	
}


function coreFn2(auth){
	const sheets = google.sheets({version: 'v4', auth});
	app.get('/read', function (req, res) {
		//res.send(auth);
		  
		  sheets.spreadsheets.values.get({
			//spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			range: 'Sheet1!A:AQ',
		  }, (err, {data}) => {
			if (err) return console.log('The API returned an error: ' + err);
			const rows = data.values;
			if (rows.length) {
			  console.log('Name, Major:');
			  // Print columns A and E, which correspond to indices 0 and 4.
			  rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			  })
			  
			  res.json(rows);
			} else {
			  
			}
		  });		
	});
	
	app.get('/upsert', function (req, res) {
		sheets.spreadsheets.values.append({
			spreadsheetId: '1FuLa7ZP_5e1gQoP9rqlMDf33_SiZLmAKiBwJUyjP630',
			range: 'Sheet1!A2:E',
		  valueInputOption: 'RAW',
		  insertDataOption: 'INSERT_ROWS',
		  resource: {
			values: [
			  [new Date(), "User1", "4.Senior", "CA", "English", "Drama Club"],
			  [new Date(), "User1", "5.Senior", "CA", "English", "Drama Club"]
			],
		  },
		  auth: auth
		}, (err, response) => {
		  if (err) return console.error(err)
		  res.json({"message": "Done"})	  
		})			
	});
	

	app.get('/scpy', function (req, res) {

		  sheets.spreadsheets.values.get({
			//spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			range: 'Sheet1!A:AQ',
		  }, (err, {data}) => {
			if (err) return console.log('The API returned an error: ' + err);
			var rows = data.values;
			if (rows.length) {
			  rows = transformData(rows);	
			  console.log('Name, Major:');
			  // Print columns A and E, which correspond to indices 0 and 4.
			  rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			  })
				
				
				//Write now
				sheets.spreadsheets.values.append({
					spreadsheetId: '1FuLa7ZP_5e1gQoP9rqlMDf33_SiZLmAKiBwJUyjP630',
					range: 'Sheet1!A2:E',
				  valueInputOption: 'RAW',
				  insertDataOption: 'INSERT_ROWS',
				  resource: {
					values: rows,
				  },
				  auth: auth
				}, (err, response) => {
				  if (err) return console.error(err)
				  res.json({"message": "Done"})	  
				})					
			} else {
			  
			}
		  });	
	
		
	});	
	
	app.get('/scpy-ae', function (req, res) {

		  sheets.spreadsheets.values.get({
			spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			range: 'AE!A:AQ',
		  }, (err, {data}) => {
			if (err) return console.log('The API returned an error: ' + err);
			var rows = data.values;
			if (rows.length) {
			  rows = transformData(rows);	
			  //console.log('Name, Major:');
			  // Print columns A and E, which correspond to indices 0 and 4.
			  rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			  })
				
				
				//Write now
				sheets.spreadsheets.values.append({
					spreadsheetId: '1FuLa7ZP_5e1gQoP9rqlMDf33_SiZLmAKiBwJUyjP630',
					range: 'AE!A1:E',
				  valueInputOption: 'RAW',
				  insertDataOption: 'INSERT_ROWS',
				  resource: {
					values: rows,
				  },
				  auth: auth
				}, (err, response) => {
				  if (err) return console.error(err)
				  res.json({"message": "Done"})	  
				})					
			} else {
			  
			}
		  });	
	
		
	});		
	
	app.listen(process.env.PORT || 8080, () => console.log('Example app listening on port 8080!'))	
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {OAuth2Client} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    //spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
	spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
    range: 'Sheet1!A2:E',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      })
    } else {
      console.log('No data found.');
    }
  });
  

  
    sheets.spreadsheets.values.append({
		spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
		range: 'Sheet1!A2:E',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          ["Alexandra1", "Female", "4.Senior", "CA", "English", "Drama Club"]
        ],
      },
      auth: auth
    }, (err, response) => {
      if (err) return console.error(err)
    }) 

}
=======
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
console.log(OAuth2Client);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';


var express = require('express')
var app = express()






// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), coreFn2);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function coreFn(auth){
	console.log("Call came here");	
	
	  
	  const sheets = google.sheets({version: 'v4', auth});
	  sheets.spreadsheets.values.get({
		//spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
		spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
		range: 'Sheet1!A2:E',
	  }, (err, {data}) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = data.values;
		if (rows.length) {
		  console.log('Name, Major:');
		  // Print columns A and E, which correspond to indices 0 and 4.
		  rows.map((row) => {
			console.log(`${row[0]}, ${row[4]}`);
			app.get('/', function (req, res, auth) {
				res.send("" + data.values)
			});

			
		  })
		} else {
		  console.log('No data found.');
		}
	  });
	 
	  	
	
	
}


function coreFn2(auth){
	const sheets = google.sheets({version: 'v4', auth});
	app.get('/read', function (req, res) {
		//res.send(auth);
		  
		  sheets.spreadsheets.values.get({
			//spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			range: 'Sheet1!A:AQ',
		  }, (err, {data}) => {
			if (err) return console.log('The API returned an error: ' + err);
			const rows = data.values;
			if (rows.length) {
			  console.log('Name, Major:');
			  // Print columns A and E, which correspond to indices 0 and 4.
			  rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			  })
			  
			  res.json(rows);
			} else {
			  
			}
		  });		
	});
	
	app.get('/upsert', function (req, res) {
		sheets.spreadsheets.values.append({
			spreadsheetId: '1FuLa7ZP_5e1gQoP9rqlMDf33_SiZLmAKiBwJUyjP630',
			range: 'Sheet1!A2:E',
		  valueInputOption: 'RAW',
		  insertDataOption: 'INSERT_ROWS',
		  resource: {
			values: [
			  [new Date(), "User1", "4.Senior", "CA", "English", "Drama Club"],
			  [new Date(), "User1", "5.Senior", "CA", "English", "Drama Club"]
			],
		  },
		  auth: auth
		}, (err, response) => {
		  if (err) return console.error(err)
		  res.json({"message": "Done"})	  
		})			
	});
	

	app.get('/scpy', function (req, res) {

		  sheets.spreadsheets.values.get({
			//spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
			range: 'Sheet1!A:AQ',
		  }, (err, {data}) => {
			if (err) return console.log('The API returned an error: ' + err);
			const rows = data.values;
			if (rows.length) {
			  console.log('Name, Major:');
			  // Print columns A and E, which correspond to indices 0 and 4.
			  rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			  })

				//Write now
				sheets.spreadsheets.values.append({
					spreadsheetId: '1FuLa7ZP_5e1gQoP9rqlMDf33_SiZLmAKiBwJUyjP630',
					range: 'Sheet1!A2:E',
				  valueInputOption: 'RAW',
				  insertDataOption: 'INSERT_ROWS',
				  resource: {
					values: rows,
				  },
				  auth: auth
				}, (err, response) => {
				  if (err) return console.error(err)
				  res.json({"message": "Done"})	  
				})					
			} else {
			  
			}
		  });	
	
		
	});	
	
	app.listen(process.env.PORT || 8080, () => console.log('Example app listening on port 8080!'))	
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {OAuth2Client} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    //spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
	spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
    range: 'Sheet1!A2:E',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      })
    } else {
      console.log('No data found.');
    }
  });
  

  
    sheets.spreadsheets.values.append({
		spreadsheetId: '1rWK0TueCetHp7SSUVj1y8Y4TdCv0RIHPog7BBxOrqGM',
		range: 'Sheet1!A2:E',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          ["Alexandra1", "Female", "4.Senior", "CA", "English", "Drama Club"]
        ],
      },
      auth: auth
    }, (err, response) => {
      if (err) return console.error(err)
    }) 

}
>>>>>>> refs/heads/master

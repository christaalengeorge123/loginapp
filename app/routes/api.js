var User = require('../models/user'); // Import User Model
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package

//var sendgrid =require('sendgrid')(demoemail,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);
 var sess='';
module.exports= function(router){



var options = {
  auth: {
    api_user: 'kottackalchrista',
    api_key: 'Pr15cs1005'
  }
}

var client = nodemailer.createTransport({
       service: 'Zoho',
        auth: {
            user: 'kottackalchrista@gmail.com', // Your email address
            pass: '306prghostel' // Your password
        },
       tls: { rejectUnauthorized: false }
   });﻿

var client = nodemailer.createTransport(sgTransport(options));

//http://localhost:8080/api/users
//User registration route
router.post('/users',function(req,res){
	var user=new User();
	user.username= req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;
	user.temporarytoken=jwt.sign({username: user.username,email:user.email},secret, {expiresIn: '24h'});
	//user.token=token;
	

	if(req.body.username==null||req.body.username==''||req.body.password==null||req.body.password==''||req.body.email==null||req.body.email==''){
		
		res.json({ success:false, message:'Ensure username,email,and password were provided'});
	}else{
		user.save(function(err){
		if(err){
			res.json({ success:false, message:'Username or Email already exists!'});
			
		} else{

			var email = {
			  from: 'Localhost Staff,staff@localhost.com',
			  to: user.email,
			  subject: 'Localhost Activation Link',
			  text: 'Hello ' + user.username + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
			  html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
			};

			client.sendMail(email, function(err, info){
			    if (err ){
			    	
			      console.log(err);

			    }
			    else {
			      console.log('Message sent: ' + info.response);
			      console.log('christa');
			    }
			});
			res.json({ success:true, message:'Account registered! Please check your e-mail for activation link'});
			//res.json({success:true, message:'User authenticated!', token: token});

		}


	});


	}

});  

	//user login route
	//http://localhost:8080/api/authenticate
	router.post('/authenticate', function(req, res) {
		User.findOne({ username: req.body.username }).select('email username password active').exec(function(err, user) {
			if (err) throw err; // Throw err if cannot connect

			// Check if user is found in the database (based on username)			
			if (!user) {
				res.json({ success: false, message: 'Username not found' }); // Username not found in database
			} else if (user) {
				// Check if user does exist, then compare password provided by user
				if (!req.body.password) {
					res.json({ success: false, message: 'No password provided' }); // Password was not provided
				} else {
					var validPassword = user.comparePassword(req.body.password); // Check if password matches password provided by user 
					if (!validPassword) {
						res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password in database
					} else if (!user.active) {
						res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true }); // Account is not activated 
					} else {
// session storing the username
                             sess=req.body.username;

						// Logged in: Give user token
						//console.log('christa'+token);
						res.json({ success: true, message: 'User authenticated!'}); // Return token in JSON object to controller
					}
				}
			}
		});
	});


router.post('/generate/', function(req, res) {

	console.log('enterd '+ sess);
	User.findOne({ username: sess }, function(err, user) {
            if (err) throw err; // Throw error if cannot connect
            // Check if username was found in database
            if (!user) {
                res.json({ success: false, message: 'No user was found' }); // Return an error
            } else  {
							// If save succeeds, create e-mail object
							var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); 
							var email = {
								from: 'Localhost Staff, staff@localhost.com',
								to: user.email,
								subject: 'Localhost Account Activated',
								text: 'Hello ' + user.username + ', hureyyyyyyyyyyyyy!'+ 'token for accesiing api' + token,
								html: 'Hello<strong> ' + user.username + '</strong>,<br><br>'+ ' token for accessing api-' +  token
							};

							// Send e-mail object to user
							client.sendMail(email, function(err, info) {
								if (err) {
									console.log(err);
								}
								else
								{
									console.log('Message sent' +info.response);
								} // If unable to send e-mail, log error info to console/terminal
							});
							res.json({ success: true, message: 'Please check your mail for accessing token!' }); // Return success message to controller
						}
        });
    });

router.put('/activate/:token', function(req, res) {

	//console.log('enterd ');

		User.findOne({ temporarytoken: req.params.token }, function(err, user) {
			if (err) throw err; // Throw error if cannot login
			var token = req.params.token; // Save the token from URL for verification 
			//console.log('christa');
			// Function to verify the user's token
			jwt.verify(token, secret, function(err, decoded) {
				if (err) {

					res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
				} else if (!user) {
					res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
				} else {
					user.temporarytoken = false; // Remove temporary token
					user.active = true; // Change account status to Activated
					// Mongoose Method to save user into the database
					user.save(function(err) {
						if (err) {
							console.log(err);
							// If unable to save user, log error info to console/terminal
						} else {
							// If save succeeds, create e-mail object
							var email = {
								from: 'Localhost Staff, staff@localhost.com',
								to: user.email,
								subject: 'Localhost Account Activated',
								text: 'Hello ' + user.username + ', Your account has been successfully activated!',
								html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Your account has been successfully activated!'
							};

							// Send e-mail object to user
							client.sendMail(email, function(err, info) {
								if (err) {
									console.log(err);
								}
								else
								{
									console.log('Message sent' +info.response);
								} // If unable to send e-mail, log error info to console/terminal
							});
							res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
						}
					});
				}
			});
		});
	});







	router.use(function(req,res,next){
		var token=req.body.token||req.body.query||req.headers['x-access-token'];
	if(token){
		//verify token
		jwt.verify(token,secret,function(err,decoded){
			if(err){
				res.json({success:false, message:'Token invalid'});
				}else{
					req.decoded=decoded;
					next();
				}
		});
	}else {

		res.json({success:false,message:'No token provided'});
	 }


 });



router.post('/me',function(req,res){
	res.send(req.decoded);
  });


router.get('/value',function(req,res){
		
		var token=req.body.token||req.body.query||req.headers['x-access-token'];
	if(token){
		//verify token
		jwt.verify(token,secret,function(err,decoded){
			if(err){
				res.json({success:false, message:'Token invalid'});
				}else{
					req.decoded=decoded;
					next();
					//res.send(req.decoded);

				}
		});
	}else {

		res.json({success:false,message:'No token provided'});
	 }
   });

router.get('/test',function(req,res){
		res.send(req.decoded);
		//res.send("hello");
  });

router.get('/check',function(req,res){
		//res.send(req.decoded);

		var token=req.body.token||req.body.query||req.headers['x-access-token'];

		User.find({$and:[{"token":token}]}).exec(function(err,user){
			if(err) throw err;

			if(user){
				res.json(user);
               // console.log(User.username);
				//res.json({success:true, message:'valid user'});
			}else{
				res.json({success:false, message:'invalid user'});
			}
			
		});
    });


	
	return router;
}


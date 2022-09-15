
const nodemailer = require('nodemailer');


module.exports = (() => {

    const sendMail = (host, port, auth, from, to, bcc, subject, html = null, attachments = null) => {
        return new Promise((resolve) => {
            try {
				let transporter = nodemailer.createTransport({
					host: host, 
					port: port, 
					secureConnection: true, 
					auth: {
						user: auth.user, 
						pass: auth.password
					}, 
					tls: {
			        	rejectUnauthorized: false
				    }
				});

				let mailOptions = {
					from: from, 
					to: to, 
					bcc: bcc, 
					subject: subject
				}

				if(html !== null) {
					mailOptions.html = html
				}
				
				if(attachments !== null) {
					mailOptions.attachments = attachments
				}
				
				transporter.sendMail(mailOptions, (error, info) => {
	    			if (error) {
	    				console.log(`Cannot send email '${error.stack}'`)
	        			resolve(false)
						return
	    			}

	    			console.log(`Message sent (id: ${info.messageId})`)
	    			resolve(true)
				})
			}
			catch(err) {
				console.log(`catch error ${err.stack}`)
				resolve(false)
			} 
        })
    }

    return {
        sendMail
    }
})()
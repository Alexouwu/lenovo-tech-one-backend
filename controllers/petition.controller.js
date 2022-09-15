const models = require('../models');
const bcrypt = require('bcrypt');
const transporter = require('../middlewares/transport');
const ejs = require('ejs');
const qrcode = require('qrcode')
const path = require('path')
const fs = require('fs')
const { mail } = require('../util')
const date_notification = require(__dirname + '/../config/config.json')['send_notification'];
let date_format = require('dateformat')

async function sendReminder(req, res) {

    const email = req.body.email;
    
    let template = fs.readFileSync(path.resolve(__dirname, '../views/register.html'), 'utf-8')

    let img_1 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R02_01.png'
    let img_2 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R02_02.png'
    let img_3 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R02_03.png'
    let img_4 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R02_04.png'
    let img_5 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R02_05.png'
    
    let html_rendered = ejs.render(template, {            
        img_1: img_1,
        img_2: img_2,
        img_3: img_3,
        img_4: img_4,
        img_5: img_5
    }, { delimiter: '%' })

    console.log(email)
    await mail.sendMail('smtp-relay.sendinblue.com', 587, {
        user: 'lenosmtp22@gmail.com',
        password: 'DHhTpzZnO0jL2UK3'
    }, 'Tech One Lenovo <no-reply@techonemx.com>', email, null, 'Invite for Lenovo Tech One', html_rendered)

    res.send({
        message: "Send email"
    })

}

function createGuest(req, res) {
    const email = req.body.values.email;
    const dia = req.body.values.dia;
    const horario = req.body.values.horario;
    const guest = {
        email: email,
        fecha: dia,
        horario: horario
    };
    models.Guest.create(guest)
        .then(result => {
            res.send({
                message: "Data has been saved"
            })
        }).catch(error => {
            res.send({
                err: error
            })
        })
}

async function createUser(req, res) {



    const name = req.body.values.name;
    const middlename = req.body.values.middlename;
    const business = req.body.values.business;
    const email = req.body.values.email;
    const password = req.body.values.password;
    //Find guest
    models.Guest.findOne({
        where: {
            email: email
        }
    }).then(guest => {
        //Hash password
        if (guest) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    const user = {
                        name: name,
                        middlename: middlename,
                        business: business,
                        email: email,
                        password: hash,
                        guestId: guest.id
                    };
                    models.User.create(user)
                        .then(async(result) => {

                            let qr = await QR(email)

                            sendQR(guest.email, guest.fecha, guest.horario, qr)
                            
                            res.send({
                                message: "Data has been saved"
                            })

                        }).catch(error => {
                            res.send({
                                err: error
                            })
                        });
                });
            });
        } else {
            res.send({
                err: new Error()
            })
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })
}

function signIn(req, res) {
    const email = req.body.values.email;
    const password = req.body.values.password;

    models.User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    res.send({
                        user: user
                    })
                } else {
                    res.send({
                        message: "Invalid email or password"
                    })
                }
            });
        } else {
            res.send({
                message: "Invalid email or password"
            })
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })

}

async function resetToken(req, res) {
    const email = req.body.values.email;

    const reset_id = makeid();
    let template = fs.readFileSync(path.resolve(__dirname, '../views/token.html'), 'utf-8')

    let html_rendered = ejs.render(template, {
        token: reset_id
    }, { delimiter: '%' })



    models.User.findOne({
        where: {
            email: email
        }
    }).then(async(user) => {
        if (user) {

            await mail.sendMail('smtp-relay.sendinblue.com', 587, {
                user: 'lenosmtp22@gmail.com',
                password: 'DHhTpzZnO0jL2UK3'
            }, 'Tech One Lenovo <no-reply@techonemx.com>', email, null, 'Reset your password for Lenovo', html_rendered)


            user.reset = reset_id;
            user.save()
            res.send({
                message: "Token has been updated"
            });
            console.log("Token has been updated")
        } else {
            res.send({ message: "Invalid email or password" });
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })
}

function resetPassword(req, res) {
    const reset = req.body.values.code;
    const password = req.body.values.password;
    const email = req.body.values.email;

    models.User.findOne({
        where: {
            reset: reset,
            email: email
        }
    }).then(user => {
        if (user) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    user.password = hash;
                    user.save();
                    res.send("OK PASS UPD");
                });
            });
        } else {
            res.send("DATOS INCORRECTOS");
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })
}

function getDate(req, res) {
    const email = req.body.values.email;
    models.Guest.findOne({
        where: {
            email: email
        }
    }).then(guest => {
        if(guest) {
            if(guest.fecha.split(" ")[0]=="23"){
                res.send({
                    fecha: guest.fecha,
                    horario: guest.horario,
                    dia: guest.fecha.split(" ")[0],
                    diaSemana: "MI�0�7RCOLES"
            })
        } else{
            res.send({
                fecha: guest.fecha,
                horario: guest.horario,
                dia: guest.fecha.split(" ")[0],
                diaSemana: "JUEVES"
            })
        }
        } else {
            res.send({
                message: "Invalid email"
            })
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })
}

function setAssitance(req, res) {
    const email = req.body.values.email;

    models.User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user) {
            user.assistance = 1;
            user.save();
            res.send({
                mesage: "Assitance was set"
            })
        } else {
            res.send({
                message: "Invalid email"
            })
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })
}

function findGuestAssistance(req, res) {
    const email = req.body.values.email;

    models.Guest.findOne({
        where: {
            email: email
        }
    }).then(guest => {
        if(guest) {
            const date = guest.fecha;
            const actualDate = new Date();
            var meses = {
                "ENERO": 0,
                "FEBRERO": 1,
                "MARZO": 2,
                "ABRIL": 3,
                "MAYO": 4,
                "JUNIO": 5,
                "JULIO": 6,
                "AGOSTO": 7,
                "SEPTIEMBRE": 8,
                "OCTUBRE": 9,
                "NOVIEMBRE": 10,
                "DICIEMBRE": 11,
              };
              const dateArray = date.split(" ");
              const dia = dateArray[0];
              const mes = dateArray[2];
              const mesUp = mes.toUpperCase();
              const mesNum = meses[mesUp];
              const actualDay = actualDate.getDate();
              const actualMonth = actualDate.getMonth();
              if(dia == actualDay && mesNum == actualMonth){
                models.User.findOne({
                    where: {
                        email: email
                    }
                }).then(user=>{
                    if(user){
                        res.send({message: user.name, id: "0"})
                    }
                })
              }
              else{
                res.send({ message: "Usuario no registrado", id: "1" });
              }
            //Do the dates compare, by day and month
            /*if (dia2 == d2) {
                res.send({ message: result[0].nombre, id: "0" });
            } else {
                res.send({ message: "Usuario registrado para: " + dia1, id: "1" });
            }*/
            // res.send({
            //     message: "ok i'm not implemented"
            // })
        } else {
            res.send({ 
                message: "Usuario no registrado", 
                id: "2" 
            });
        }
    }).catch(error => {
        res.send({
            err: error
        })
    })
}

//Auxiliar functions
function makeid() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < 9; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function sendQR(email, fecha, hora, qr) {    

    let template = fs.readFileSync(path.resolve(__dirname, '../views/qr.html'), 'utf-8')

    let html_rendered = ejs.render(template, {            
        fecha: fecha,
        hora: hora,
        email: email
    }, { delimiter: '%' })


    await mail.sendMail('smtp-relay.sendinblue.com', 587, {
        user: 'lenosmtp22@gmail.com',
        password: 'DHhTpzZnO0jL2UK3'
    }, 'Tech One Lenovo <no-reply@techonemx.com>', email, null, 'Invite for Lenovo Tech One', html_rendered,
        [
            {
                file: 'invite.png',                            
                path: qr,
                cid: 'imgid'
            }
        ]
    )
  
}


const QR = (value) => {


    return new Promise((resolve) => {
        const options = { 
            errorCorrectionLevel: 'H', 
            margin: 1
        }

        qrcode.toDataURL(value, options, (err, res) => {

            // Error
            if (err) {
                console.log(`Cannot generate QR Code '${err}'`)

                resolve(null)
                return
            }
            
            // Success
            console.log(`QR with value '${value}' generated`)
            resolve(res)
        })
    })
}

module.exports = {
    createGuest: createGuest,
    createUser: createUser,
    signIn: signIn,
    resetToken: resetToken,
    resetPassword: resetPassword,
    getDate: getDate,
    setAssitance: setAssitance,
    findGuestAssistance: findGuestAssistance,
    sendReminder: sendReminder
}

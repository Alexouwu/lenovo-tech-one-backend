

const cron = require('node-cron');
const { mail } = require('../util')
const fs = require('fs')
const path = require('path')
const models = require('../models');
const date_notification = require(__dirname + '/../config/config.json')['send_notification'];
const ejs = require('ejs');
let date_format = require('dateformat')

cron.schedule('0 0 11 14 3 *', async () => {
// cron.schedule('0 */1 * * * *', async () => {
    try {
        let start_date = date_notification.start_date
        let end_date = date_notification.end_date
        let date_now = date_format(new Date(), "yyyy-mm-dd HH:MM:ss")

        if (date_now > start_date && date_now < end_date) {
            // Get Users
            models.User.findAll().then(async user => {
                for (let index in user) {
                    let key = user[index]

                    // Verifiy exit email
                    if (key.email != null) {

                        // Send Email
                        let template = fs.readFileSync(path.resolve(__dirname, '../views/register.html'), 'utf-8')

                        let img_1 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R01_01.png'
                        let img_2 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R01_02.png'
                        let img_3 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R01_03.png'
                        let img_4 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R01_04.png'
                        let img_5 = 'https://lenovo-tech.s3.amazonaws.com/register-mail/Lenovo_One_Lenovo_2022_mailing-REMINDER-BIG-EVENT_R01_05.png'
                        
                        let html_rendered = ejs.render(template, {            
                            img_1: img_1,
                            img_2: img_2,
                            img_3: img_3,
                            img_4: img_4,
                            img_5: img_5
                        }, { delimiter: '%' })
                        // console.log(key.email, "DATA USER")
                        // await mail.sendMail('smtp-relay.sendinblue.com', 587, {
                        //     user: 'lenosmtp22@gmail.com',
                        //     password: 'DHhTpzZnO0jL2UK3'
                        // }, 'Tech One Lenovo <no-reply@techonemx.com>', key.email, null, 'Invite for Lenovo Tech One', html_rendered)
                    }
                }
            })

        }        
    }
    catch(err) {
        console.log(err)
    }
});
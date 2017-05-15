import 'colors'
import * as containerized from 'containerized'
import {sendPushNotification} from './send_push_notifications'
import {MonologSchema} from './interface'
import {Channel} from 'amqplib/callback_api'

const amqlib = require('amqplib/callback_api')


const getErrorColor = (config: MonologSchema): string => {

    let severity = config.severity || 'severe'

    let color = 'red'

    switch (severity) {

        case 'moderate':
            color = 'yellow'
            break
        case 'light':
            color = 'green'
            break
        case 'ignore':
            color = 'blue'
            break
    }

    return color
}


let strLimit = 80

const fillRemainingSpace = (length) => {

    let spaces = ''

    for (let i = 0; i < strLimit - length; i++) spaces += ' '

    return spaces
}


const truncateMessage = (message: string): string => {

    if (message.length <= strLimit) return `| ${message}${fillRemainingSpace(message.length)} |`

    else return `| ${message} |`
}


/**
 * config Object
 * {
 *     file_path: String;
 *     line_number: Number(__line);
 *     error: Mixed;
 *     message: String;
 *     severity: Enum('sever', 'moderate', 'light')
 * }
 */
/*
export const MonologX = (config: MonologSchema, callback?: Function) => {

    return {

        createClient: () => {

            amqlib.connect(`amqp://${containerized() ? 'rabbit' : 'localhost'}`, (err, conn) => {

            })
        }
    }

    // Set default severity value
    config.severity = config.severity || 'severe'

    // Save to database in production
    MonologModel.create(config, (err, monologEntry) => {

        if (config.severity === 'severe') {
            // Send notification to all Stellium developers on severe
            // notification that requires immediate attention
            sendPushNotification(config.message, monologEntry._id)
        }

        // Trigger callback if provided
        if (callback && typeof callback === 'function') callback(err, monologEntry)
    })
}
*/


let rabbitChannel: Channel


amqlib.connect(`amqp://${containerized() ? 'rabbit' : 'localhost'}`, (err, conn) => {

    if (err) {
        console.log('error connecting to rabbit server', err)
        return
    }

    conn.createChannel((err, ch) => {

        if (err) {
            console.log('error creating rabbit channel', err)
            return
        }

        rabbitChannel = ch
    })
})


export class Monolog {


    public static createClient(): Monolog {

        return new Monolog
    }


    log(message: any): void {

        if (!rabbitChannel) {
            throw new Error('Rabbit Channel has not been initialised yet')
        }

        if (typeof message === 'object') {
            message = JSON.stringify(message)
        }

        const q = 'monolog'

        rabbitChannel.assertQueue(q, {durable: false})

        rabbitChannel.sendToQueue(q, Buffer.from(message))
    }
}

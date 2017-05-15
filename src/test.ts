import {Monolog} from './monolog'


const monologClient = Monolog.createClient()

setTimeout(() => {

    console.log('Attempting to send message')

    monologClient.log({
        message: 'test'
    })
}, 1000)

import {Monolog} from './monolog'
import {DefineCurrentModule} from '@stellium/common'


DefineCurrentModule('test')

const monologClient = Monolog.createClient()

setTimeout(() => {

    console.log('Attempting to send message')

    monologClient.log({
        message: 'test'
    })
}, 1000)

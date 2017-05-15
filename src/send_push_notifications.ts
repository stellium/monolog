import * as request from 'request'


export const sendPushNotification = (message: string, monologEntryId: string) => {

    if (typeof message !== 'string') {

        message = JSON.stringify(message)
    }

    request.post(`https://api.pushover.net/1/messages.json`, {
        form: {
            token: 'apwmscqq8sz67hy3jc8uyurc6uq1a7',
            user: 'umkmpemhynmcfe9t4yqjyf317474hy',
            title: 'Monolog Severe Error',
            url: `http://stellium.io/stellium/expecto_patronum/${monologEntryId}`,
            message: message
        }
    }, err => {

        if (err) {
            throw err
        }

        console.log('Push Notification sent!')

        // MonologModel.findByIdAndUpdate(monologEntryId, {status: 'transported'})
    })
}

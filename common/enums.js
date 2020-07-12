const status = {
    pending: 'p',
    authorized: 'a',
    cancelled: 'c',
    declined: 'd'
}
module.exports = {
    recordStatus: {
        pending: status.pending,
        authorized: status.authorized,
        cancelled: status.cancelled,
        declined: status.declined
    }
}
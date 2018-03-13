
exports.URI = function (paymentInfo) {
  if(paymentInfo.currency == 'BTC') {
    let uri = 'bitcoin:'
    uri += paymentInfo.address
    uri += '?amount='
    uri += paymentInfo.amount
    uri += '&message='
    uri += encodeURIComponent(paymentInfo.message)
    if (paymentInfo.label) {
      uri += '&label='
      uri += encodeURIComponent(paymentInfo.label)
    }

    return uri
  } else if (paymentInfo.currency == 'NANO') {
    let uri = 'xrb:'
    uri += paymentInfo.address
    uri += '?amount='
    uri += paymentInfo.amount
    uri += '&message='
    uri += encodeURIComponent(paymentInfo.message)
    if (paymentInfo.label) {
      uri += '&label='
      uri += encodeURIComponent(paymentInfo.label)
    }

    return uri
  } else {

  }
}
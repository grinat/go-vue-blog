import moment from 'moment'
moment.locale('en')

export function fromNow (unixMin = 0) {
  return moment(unixMin * 1000).fromNow()
}

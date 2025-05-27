import Mixpanel from 'mixpanel'

const mixpanel = Mixpanel.init('token')

export function trackServerEvent(eventName: string, properties: any) {
  if (process.env.NODE_ENV === 'development') {
    console.info('trackServerEvent', eventName, properties)
    return
  }

  mixpanel.track(eventName, properties)
}

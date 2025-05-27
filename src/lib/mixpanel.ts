import Mixpanel from 'mixpanel'

import { serverEnv } from '@/utils/env'

const mixpanel = Mixpanel.init(serverEnv.MIXPANEL_TOKEN)

export function trackServerEvent(eventName: string, properties: any) {
  if (process.env.NODE_ENV === 'development') {
    console.info('trackServerEvent', eventName, properties)
    return
  }

  mixpanel.track(eventName, properties)
}

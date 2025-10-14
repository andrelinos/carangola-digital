import {

CinemaOld,
Facebook,
Globe,
Instagram,
Linkedin,
Threads,
Tiktok,
} from 'iconoir-react'



import { Mail } from 'lucide-react'

export const SOCIAL_MEDIA_CONFIG = [
  { key: 'facebook', Icon: Facebook },
  { key: 'instagram', Icon: Instagram },
  { key: 'linkedin', Icon: Linkedin },
  { key: 'threads', Icon: Threads },
  { key: 'tiktok', Icon: Tiktok },
  { key: 'kwai', Icon: CinemaOld },
  { key: 'site', Icon: Globe },
  { key: 'email', Icon: Mail },
] as const

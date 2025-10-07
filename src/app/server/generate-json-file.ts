'server-only'

import path from 'node:path'

import { promises as fs } from 'node:fs'
import { serverEnv } from '@/utils/env'
import { Timestamp } from 'firebase-admin/firestore'

interface DataProps {
  userId: string | null | undefined
  name: string | null | undefined
  link: string
  createdAt?: number
}

export async function generateJsonFile(data: DataProps) {
  if (!data) return true

  try {
    const filePath = path.join(process.cwd(), serverEnv.FILE_JSON_SEARCH_PATH)
    let records = []

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      records = JSON.parse(fileContent)
      if (!Array.isArray(records)) {
        records = []
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'ENOENT'
      ) {
        records = [] as DataProps[]
        await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8')
      }
    }

    const recordIndex: number = (records as DataProps[]).findIndex(
      (record: DataProps) => record.userId === data.userId
    )

    if (recordIndex !== -1) {
      records[recordIndex] = {
        userId: data.userId,
        name: data.name,
        link: data.link,
        createdAt: Timestamp.now().toMillis(),
      }
      await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8')
    } else {
      records.push({
        userId: data.userId,
        name: data.name,
        link: data.link,
        createdAt: Timestamp.now().toMillis(),
      })

      await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8')
    }

    return true
  } catch (error) {
    return true
  }
}

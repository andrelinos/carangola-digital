import { serverEnv } from '@/utils/env'
import { type NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

interface RecordProps {
  name: string
  link: string
  createdAt: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchTerms = body?.searchTerms

    if (!searchTerms || !searchTerms.trim()) {
      return NextResponse.json({
        message: 'Search terms are required',
      })
    }

    const filePath = path.join(process.cwd(), serverEnv.FILE_JSON_SEARCH_PATH)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const records = JSON.parse(fileContent) as RecordProps[]
    const searchValue = searchTerms.trim().toLowerCase()

    const filteredRecords = records.filter(record => {
      return (
        record.name.toLowerCase().includes(searchValue) ||
        record.link.toLowerCase().includes(searchValue)
      )
    })

    return NextResponse.json({
      data: filteredRecords,
    })
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}

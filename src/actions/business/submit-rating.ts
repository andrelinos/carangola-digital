'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

interface SubmitRatingProps {
  profileId: string
  score: number
  slug: string
}

export async function submitRating({ profileId, score, slug }: SubmitRatingProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id
  const ratingId = `${userId}_${profileId}`

  try {
    const profileRef = db.collection('profiles').doc(profileId)
    const ratingRef = db.collection('ratings').doc(ratingId)

    await db.runTransaction(async (transaction) => {
      const profileDoc = await transaction.get(profileRef)
      const ratingDoc = await transaction.get(ratingRef)

      if (!profileDoc.exists) {
        throw new Error('Profile not found')
      }

      const profileData = profileDoc.data()
      const oldRatingData = ratingDoc.data()

      // Security Check: Owner cannot rate their own profile
      if (profileData?.userId === userId) {
        throw new Error('Self-rating is not allowed')
      }

      let newTotalScoreSum = (profileData?.totalScoreSum || 0)
      let newReviewCount = (profileData?.reviewCount || 0)

      if (ratingDoc.exists) {
        // Update existing rating: subtract old score, add new score
        const oldScore = oldRatingData?.score || 0
        newTotalScoreSum = newTotalScoreSum - oldScore + score
      } else {
        // New rating: increment count and add score
        newReviewCount += 1
        newTotalScoreSum += score
      }

      const newAverage = newTotalScoreSum / newReviewCount

      // Update Rating Document
      transaction.set(ratingRef, {
        userId,
        profileId,
        score,
        updatedAt: Timestamp.now().toMillis(),
        createdAt: oldRatingData?.createdAt || Timestamp.now().toMillis(),
      }, { merge: true })

      // Update Profile Document
      transaction.update(profileRef, {
        rating: newAverage,
        reviewCount: newReviewCount,
        totalScoreSum: newTotalScoreSum,
        updatedAt: Timestamp.now().toMillis(),
      })
    })

    revalidatePath(`/business/${slug}`)
    return { success: true }
  } catch (error) {
    console.error('Error submitting rating:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}

import { HeaderHome } from '@/components/commons/headers'

export default async function LinkInBio({
  params,
}: {
  params: Promise<{ socialMediaSlug: string }>
}) {
  const { socialMediaSlug } = await params

  // const texts = (await getTextsBySlug(socialMediaSlug)) as any

  // if (!texts) {
  //   return notFound()
  // }

  return (
    <div className="mx-auto max-w-7xl">
      <HeaderHome />
      {/* <HeroBusiness profileData={texts} /> */}
      {/* <VideoExplanation />
      <Pricing />
      <FAQ /> */}
    </div>
  )
}

export const EmailDev = () => {
  const user = 'andrelinodev'
  const domain = 'gmail.com'
  const email = `${user}@${domain}`
  return (
    <a href={`mailto:${email}`} className="text-blue-500 hover:underline">
      {email}
    </a>
  )
}

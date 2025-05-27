export function getInitialsFullNameAvatar(name: string | null | undefined) {
  if (name) {
    try {
      const partesNome = name.trim().split(' ')
      if (partesNome.length === 1) {
        return partesNome[0][0].toUpperCase()
      }

      return partesNome[0][0].toUpperCase() + partesNome[1][0].toUpperCase()
    } catch (error) {
      return 'NA'
    }
  }
  return 'NA'
}

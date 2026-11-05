const PLURAL_FORMS: Record<string, string> = {
  one: 'projekt',
  few: 'projekty',
  many: 'projektów',
  other: 'projektu'
}

const pluralRules = new Intl.PluralRules('pl-PL')

export const formatProjectCount = (count: number) =>
  `${count} ${PLURAL_FORMS[pluralRules.select(count)]}`

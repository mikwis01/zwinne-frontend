const TICKET_PREFIX = 'FT'
const TYPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test'
]
const MAX_LENGTH = 100

const example = `[${TICKET_PREFIX}-00][feat] - some task name`

/** @type {import('@commitlint/types').UserConfig} */
export default {
  rules: {
    'ticket-declaration': [2, 'always'],
    'change-type': [2, 'always'],
    'header-pattern': [2, 'always'],
    'header-length': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'ticket-declaration': ({ header = '' }) => [
          new RegExp(`^\\[${TICKET_PREFIX}-\\d+\\]`).test(header),
          `should start with a ticket reference, e.g. "[${TICKET_PREFIX}-00]"`
        ],
        'change-type': ({ header = '' }) => [
          new RegExp(
            `^\\[${TICKET_PREFIX}-\\d+\\]\\[(${TYPES.join('|')})\\]`
          ).test(header),
          `should contain a change type after the ticket (one of: ${TYPES.join(', ')}), e.g. "[feat]"`
        ],
        'header-pattern': ({ header = '' }) => [
          new RegExp(`^\\[${TICKET_PREFIX}-\\d+\\]\\[[a-z]+\\] - \\S.*`).test(
            header
          ),
          `should match the format: ${example}`
        ],
        'header-length': ({ header = '' }) => [
          header.length <= MAX_LENGTH,
          `should be at most ${MAX_LENGTH} characters long`
        ]
      }
    }
  ]
}

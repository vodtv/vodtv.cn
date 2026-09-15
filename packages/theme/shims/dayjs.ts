import dayjsModule from 'dayjs/dayjs.min.js'

const dayjs = (dayjsModule as typeof import('dayjs')).default ?? dayjsModule

export default dayjs
export * from 'dayjs/dayjs.min.js'

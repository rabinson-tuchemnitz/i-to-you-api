import * as cron from 'node-cron'
import { deleteInactiveFilesCommand } from './DeleteUnUsedFiles'

cron.schedule('0 0 0 * * *', () => {
  console.log('Deleting files inactive for 14 days from database')
  deleteInactiveFilesCommand()
  console.log('Operation Completed')
})

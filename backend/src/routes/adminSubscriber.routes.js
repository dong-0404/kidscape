import { Router } from 'express'
import authGuard from '../middleware/authGuard.js'
import validate from '../middleware/validate.js'
import {
  adminListSubscribers,
  deleteSubscriber,
  exportSubscribers,
} from '../controllers/subscriber.controller.js'
import { idParam } from '../validators/subscriber.validator.js'

const router = Router()

router.use(authGuard)

router.get('/', adminListSubscribers)
router.get('/export', exportSubscribers)
router.delete('/:id', idParam, validate, deleteSubscriber)

export default router

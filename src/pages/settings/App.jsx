
import { inject } from 'mobx-react'
import { renderRoutes } from 'utils/router.config'

import routes from './routes'

const App = () => renderRoutes(routes)

export default inject('rootStore')(App)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import routes from './Routes/Routes'
import { Provider } from 'react-redux'
import { store } from './Redux/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={routes}/>
    </Provider>
  </StrictMode>,
)

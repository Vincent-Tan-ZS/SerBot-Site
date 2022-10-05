import {Backdrop} from '@mui/material'
import Loading from '../components/Loading'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Loading />
      <Backdrop />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

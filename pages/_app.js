import React from 'react';
import Loading from '../components/Loading'
import MainSnackbar from '../components/MainSnackbar'
import '../styles/globals.css'
import {SNACKBAR_SEVERITY_INFO} from '../Utils';

function MyApp({ Component, pageProps }) {
  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(SNACKBAR_SEVERITY_INFO);

  const OnSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  return (
    <>
      <Loading />
      <MainSnackbar open={snackbarOpen} onClose={OnSnackbarClose} text={snackbarText} severity={snackbarSeverity} />
      <Component snackbarStates={{setSnackbarOpen, setSnackbarText, setSnackbarSeverity}} {...pageProps} />
    </>
  )
}

export default MyApp

import React from 'react';
import Loading from '../components/Loading'
import MainSnackbar from '../components/MainSnackbar'
import '../styles/globals.css'
import {SNACKBAR_SEVERITY_INFO} from '../Utils';
import BaseModal from '../components/BaseModal';
import {ModalContext} from '../contexts/ModalContext';
import {SnackbarContext} from '../contexts/SnackbarContext';

function MyApp({ Component, pageProps }) {
  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(SNACKBAR_SEVERITY_INFO);

  const OnSnackbarClose = () => {
    setSnackbarOpen(false);
  }
  
  // Modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalChildren, setModalChildren] = React.useState(<></>);

  const OnModalClosed = () => {
    setModalOpen(false);
  }

  return (
    <>
      <Loading />
      <MainSnackbar open={snackbarOpen} onClose={OnSnackbarClose} text={snackbarText} severity={snackbarSeverity} />
      <BaseModal open={modalOpen} OnClose={OnModalClosed} title={modalTitle}>
        {modalChildren}
      </BaseModal>
      
      <SnackbarContext.Provider value={{setSnackbarOpen, setSnackbarText, setSnackbarSeverity}}>
        <ModalContext.Provider value={{setModalOpen, setModalTitle, setModalChildren}}>
          <Component {...pageProps} />
        </ModalContext.Provider>
      </SnackbarContext.Provider>
    </>
  )
}

export default MyApp

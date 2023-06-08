import React from 'react';
import Loading from '../components/Loading'
import MainSnackbar from '../components/MainSnackbar'
import '../styles/globals.css'
import {SNACKBAR_SEVERITY_INFO, Settings} from '../Utils';
import BaseModal from '../components/BaseModal';
import {ModalContext} from '../contexts/ModalContext';
import {SnackbarContext} from '../contexts/SnackbarContext';
import {MobileContext} from '../contexts/MobileContext';
import {useMediaQuery} from '@mui/material';
import {Helmet} from 'react-helmet';

function MyApp({ Component, pageProps }) {
	const isMobile = useMediaQuery("(max-width:600px)");

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
  const [modalMaxWidth, setModalMaxWidth] = React.useState("lg");
  const [modalChildren, setModalChildren] = React.useState(<></>);

  const OnModalClosed = () => {
    setModalOpen(false);
  }

  // Title
  const [title, setTitle] = React.useState("SerBot Site");

  React.useEffect(() => {
    const compName = `${Component.name}`;

    let _title = "SerBot Site";
    const key = Object.keys(Settings).find(s => s === `PAGE_TITLE_${compName.toUpperCase()}`);

    if (key !== undefined)
    {
      _title = Settings[key];
    }

    setTitle(_title);
  }, [Component.name]);

  console.log(Component.name);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MobileContext.Provider value={isMobile}>
        <Loading />
        <MainSnackbar open={snackbarOpen} onClose={OnSnackbarClose} text={snackbarText} severity={snackbarSeverity} />
        
        
        <SnackbarContext.Provider value={{setSnackbarOpen, setSnackbarText, setSnackbarSeverity}}>
          <BaseModal open={modalOpen} OnClose={OnModalClosed} title={modalTitle} maxWidth={modalMaxWidth}>
            {modalChildren}
          </BaseModal>
          <ModalContext.Provider value={{setModalOpen, setModalTitle, setModalMaxWidth, setModalChildren,}}>
            <Component {...pageProps} />
          </ModalContext.Provider>
        </SnackbarContext.Provider>
      </MobileContext.Provider>
    </>
  )
}

export default MyApp

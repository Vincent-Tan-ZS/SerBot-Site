import React, { useCallback } from 'react';
import Loading from '../components/Loading'
import MainSnackbar from '../components/MainSnackbar'
import '../styles/globals.css'
import {CheckAuthCode, SNACKBAR_SEVERITY_INFO, Settings} from '../Utils';
import BaseModal from '../components/BaseModal';
import {ModalContext} from '../contexts/ModalContext';
import {SnackbarContext} from '../contexts/SnackbarContext';
import {MobileContext} from '../contexts/MobileContext';
import {Button, useMediaQuery} from '@mui/material';
import {Helmet} from 'react-helmet';
import { AuthenticationContext } from '../contexts/AuthenticationContext';
import ConfirmationModalChild from '../components/Modals/ConfirmationModalChild';

function MyApp({ Component, pageProps }) {
	const isMobile = useMediaQuery("(max-width:600px)");

  // Authentication
  const [authed, setAuthed] = React.useState(false);

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
  const [modalHeight, setModalHeight] = React.useState("auto");
  const [modalActions, setModalActions] = React.useState(undefined);
  const [modalProps, setModalProps] = React.useState({});

  const OnModalClosed = () => {
    setModalOpen(false);
    setModalHeight("auto");
  }

  const OpenModal = ({title, height, maxWidth, actions, props, children}) => {
			setModalOpen(true);
      if (title) setModalTitle(title);
      if (height) setModalHeight(height);
      if (maxWidth) setModalMaxWidth(maxWidth);
      setModalProps(props ?? {});
      setModalActions(actions ?? <></>);
      setModalChildren(children);
  }

  const CloseModal = (reset) => {
    setModalOpen(false);

    if (reset)
    {
      setModalTitle("");
      setModalHeight("auto")
      setModalChildren(<></>);
      setModalActions(undefined);
      setModalProps({});
    }
  }

  const OpenConfirmationModal = ({ title, message, height, callback }) => {
    OpenModal({
      title: title,
      height: height ?? "auto",
      children: <ConfirmationModalChild callback={callback} message={message} />,
      actions: (
        <>
          <Button variant="contained" color="primary" onClick={() => OnConfirmationCallbackClick(callback)}>Confirm</Button>
          <Button variant="contained" color="error" onClick={CloseModal}>Cancel</Button>
        </>
      )
    });
  }

  const OnConfirmationCallbackClick = useCallback((callback) => {
    CloseModal();
    if (callback) callback();
  });

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

  React.useEffect(() => {
    CheckAuthCode();
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <AuthenticationContext.Provider value={{authed, setAuthed}}>
        <MobileContext.Provider value={isMobile}>
        <Loading />
        <MainSnackbar open={snackbarOpen} onClose={OnSnackbarClose} text={snackbarText} severity={snackbarSeverity} />
        
        
        <SnackbarContext.Provider value={{setSnackbarOpen, setSnackbarText, setSnackbarSeverity}}>
          <ModalContext.Provider value={{OpenModal, CloseModal, OpenConfirmationModal, modalProps, setModalProps}}>
            <BaseModal open={modalOpen} OnClose={OnModalClosed} title={modalTitle} maxWidth={modalMaxWidth} height={modalHeight} actions={modalActions}>
              {modalChildren}
            </BaseModal>
            <Component {...pageProps} />
          </ModalContext.Provider>
        </SnackbarContext.Provider>
      </MobileContext.Provider>
      </AuthenticationContext.Provider>
    </>
  )
}

export default MyApp

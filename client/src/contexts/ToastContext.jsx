import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showToast = (message, type = 'info', options = {}) => {
    const defaultOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const toastOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        toast.success(message, {
          ...toastOptions,
          style: {
            background: '#4caf50',
            color: '#ffffff',
            fontWeight: 'bold'
          }
        });
        break;
      case 'error':
        toast.error(message, {
          ...toastOptions,
          style: {
            background: '#f44336',
            color: '#ffffff',
            fontWeight: 'bold'
          }
        });
        break;
      case 'warning':
        toast.warning(message, {
          ...toastOptions,
          style: {
            background: '#ff9800',
            color: '#ffffff',
            fontWeight: 'bold'
          }
        });
        break;
      case 'info':
        toast.info(message, {
          ...toastOptions,
          style: {
            background: '#2196f3',
            color: '#ffffff',
            fontWeight: 'bold'
          }
        });
        break;
      default:
        toast(message, toastOptions);
    }
  };

  const showSuccess = (message, options) => showToast(message, 'success', options);
  const showError = (message, options) => showToast(message, 'error', options);
  const showWarning = (message, options) => showToast(message, 'warning', options);
  const showInfo = (message, options) => showToast(message, 'info', options);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
        toastStyle={{
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      />
    </ToastContext.Provider>
  );
}; 
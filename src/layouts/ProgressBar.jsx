import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timeout);
  }, [location, navigationType]);

  return null;
}
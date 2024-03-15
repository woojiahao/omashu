import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Bounce, ToastContainer, ToastOptions, toast } from "react-toastify";

interface LayoutProps extends React.PropsWithChildren {
  hasToast?: boolean;
}

export default function Layout({ hasToast = false, children }: LayoutProps) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!hasToast) return;

    const toastMessage = searchParams.get('message');
    if (!toastMessage) return;

    const toastMessageType = searchParams.get('message-type');

    const toastProps: ToastOptions = {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    }

    if (toastMessageType === 'error') {
      toast.error(toastMessage, toastProps);
    } else if (toastMessage === 'success') {
      toast.success(toastMessage, toastProps);
    } else if (toastMessage === 'notification') {
      toast.info(toastMessage, toastProps);
    } else {
      toast(toastMessage, toastProps);
    }
  }, [])

  return (
    <div>
      <div className="w-[70%] my-12 mx-auto">
        {children}
      </div>
      {hasToast && <ToastContainer />}
    </div>
  )
}
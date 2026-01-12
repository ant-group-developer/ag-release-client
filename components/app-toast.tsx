'use client';

// import { useThemeMode } from '@/hooks/use-theme-mode';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppToast() {
    // const { isDark } = useThemeMode();

    return (
        <ToastContainer
            transition={Slide}
            pauseOnFocusLoss={false}
            position="top-center"
            newestOnTop
            closeOnClick
            // theme={isDark ? 'dark' : 'light'}
        />
    );
}

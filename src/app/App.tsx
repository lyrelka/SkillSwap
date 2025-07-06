import { Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import { RegistrationPage } from '@/pages/RegistrationPage/RegistrationPage';
import { ProtectedRoute } from './providers/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import Page404 from '@/pages/Page404';
import Page500 from '@/pages/Page500';
import { Footer } from '@/pages/Footer';
import { Header } from '@/pages/Header';

const App = () => {
  return (
    <div className={styles.app}>
      <Header/>
      <Routes>
        <Route path={`${import.meta.env.BASE_URL}/`} element={<HomePage />} />
        <Route path='*' element={<Page404 />} />
        <Route path={`${import.meta.env.BASE_URL}/500`} element={<Page500 />} />
        <Route element={<ProtectedRoute isAuthenticated={false} />}>
          <Route path={`${import.meta.env.BASE_URL}/registration`} element={<RegistrationPage />} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
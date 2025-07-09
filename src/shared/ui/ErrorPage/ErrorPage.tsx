import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import styles from './ErrorPage.module.css';
import { ErrorPageProps } from './types';

const ErrorPage = ({
  imagePath,
  title,
  description,
  altText,
  onReportClick,
}: ErrorPageProps) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(`${import.meta.env.BASE_URL}/`, { replace: true });
  };
  return (
    <div className={styles.errorPage}>
      <img
        src={imagePath}
        alt={altText}
        className={styles.errorImage}
        loading="lazy"
      />
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.buttonContainer}>
        <button
          className={clsx(styles.button, styles.secondaryButton)}
          onClick={onReportClick}
        >
          Сообщить об ошибке
        </button>
        <Link
          to={`${import.meta.env.BASE_URL}/`}
          className={clsx(styles.button, styles.primaryButton)}
          onClick={handleHomeClick}
        >
          На главную
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

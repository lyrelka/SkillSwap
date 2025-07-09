import React, { useCallback, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.css';
import { ValidatorFn } from '../../shared/lib/db/RegistrationForm/types';
import { StepOne } from '@/shared/ui/Step/StepOne/StepOne';
import { StepTwoForm } from '@/shared/ui/Step/StepTwo/StepTwo';
import { StepThreeForm } from '@/shared/ui/Step/StepThree/StepThree';
import { AuthModal } from '@/shared/ui/AuthModal/AuthModal';
import { Button } from '@/shared/ui/Button/Button';
import {
  IFormData,
  IFormErrors,
} from '../../shared/lib/db/RegistrationForm/types';
import { formReducer, initialState } from './formReducer';
import {
  validationRules,
  checkEmailExists,
} from '@/shared/lib/db/RegistrationForm/utils';
import lamp from '@shared/assets/icons/lamp.svg';
import logo from '@shared/assets/icons/logo.svg';
import about from '@shared/assets/icons/about.svg';
import StepThreeIcon from '@shared/assets/icons/StepThree.svg';
import close from '@shared/assets/icons/close.svg';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { formData, errors, step } = state;

  const validate = useCallback(
    (currentStep: number, data: IFormData): IFormErrors => {
      const newErrors: Partial<IFormErrors> = {};
      const rulesForStep = validationRules[currentStep];
      if (!rulesForStep) return {} as IFormErrors;

      (Object.keys(rulesForStep) as Array<keyof IFormData>).forEach(field => {
        const validator = rulesForStep[field] as
          | ValidatorFn<IFormData[typeof field]>
          | undefined;

        if (validator) {
          const value = data[field];
          const error = validator(value as IFormData[typeof field]);

          if (error) {
            newErrors[field] = error;
          }
        }
      });

      return newErrors;
    },
    []
  );

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const target = e.target as HTMLInputElement;
      const { name, value } = target;
      const field = name as keyof IFormData;

      dispatch({ type: 'SET_FIELD', field, value });

      if (errors[field]) {
        dispatch({
          type: 'SET_ERRORS',
          errors: {
            ...errors,
            [field]: undefined,
          },
        });
      }
    },
    [dispatch, errors]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        dispatch({
          type: 'SET_FIELD',
          field: 'skillImage',
          value: e.target.files![0],
        });
      }
    },
    [dispatch]
  );

  const handleNextStep = useCallback(async () => {
    const validationErrors = validate(step, formData);

    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: validationErrors });
      return;
    }

    if (step === 1) {
      try {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          dispatch({
            type: 'SET_ERRORS',
            errors: { email: 'Email уже используется' },
          });
          return;
        }
      } catch (error) {
        console.error('Ошибка при проверке email:', error);
        dispatch({
          type: 'SET_ERRORS',
          errors: { email: 'Не удалось проверить email. Попробуйте позже.' },
        });
        return;
      }
    }

    dispatch({ type: 'NEXT_STEP' });
  }, [step, formData, validate, dispatch]);

  const handlePrevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    const finalErrors = validate(3, formData);
    if (Object.keys(finalErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors: finalErrors });
      return;
    }

    console.log('ОТПРАВКА ДАННЫХ:', formData);
    navigate(`${import.meta.env.BASE_URL}/`);
  }, [formData, validate, navigate]);

  const rightPanelContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <div className={styles.rightPanel}>
            <img src={lamp} alt="Лампочка" loading="lazy" />
            <h2 className={styles.welcomeTitle}>
              Добро пожаловать в SkillSwap!
            </h2>
            <p className={styles.welcomeText}>
              Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с
              другими людьми
            </p>
          </div>
        );
      case 2:
        return (
          <>
            <img
              src={about}
              alt="Человек рассказывающий о себе"
              loading="lazy"
            />
            <h2 className={styles.welcomeTitle}>Расскажите немного о себе</h2>
            <p>
              Это поможет другим людям лучше вас узнать, чтобы выбрать для
              обмена
            </p>
          </>
        );
      case 3:
        return (
          <>
            <img src={StepThreeIcon} alt="Доска с записями" loading="lazy" />
            <h2 className={styles.welcomeTitle}>
              Укажите, чем вы готовы поделиться
            </h2>
            <p>
              Так другие люди смогут увидеть ваши предложения и предложить вам
              обмен!
            </p>
          </>
        );
      default:
        return null;
    }
  }, [step]);

  return (
    <div className={styles.pageLayout}>
      <div className={styles.contentWrapper}>
        <header className={styles.mainHeader}>
          <div 
            className={styles.logo}
            onClick={() => navigate(`${import.meta.env.BASE_URL}/`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`${import.meta.env.BASE_URL}/`)}
          >
            <h1>
              <img
                src={logo}
                className={styles.logo}
                alt="Логотип компании SkillSwap"
                loading="lazy"
              />
              <span className={styles.logoBold}>SkillSwap</span>
            </h1>
          </div>
          <Button
            variant="back"
            onClick={() => navigate(`${import.meta.env.BASE_URL}/`)}
            className={styles.closeButton}
          >
            Закрыть
            <img src={close} alt="Закрыть" />
          </Button>
        </header>
        <main className={styles.mainContent}>
          <div className={styles.stepTracker}>
            <h2 className={styles.stepTitle}>Шаг {step} из 3</h2>
            <div className={styles.progressBars}>
              <div
                className={`${styles.bar} ${step >= 1 ? styles.filled : ''}`}
              />
              <div
                className={`${styles.bar} ${step >= 2 ? styles.filled : ''}`}
              />
              <div
                className={`${styles.bar} ${step >= 3 ? styles.filled : ''}`}
              />
            </div>
          </div>
          <AuthModal rightPanelContent={rightPanelContent}>
            {step === 1 && (
              <StepOne
                formData={{
                  email: formData.email,
                  password: formData.password,
                }}
                errors={errors}
                onInputChange={handleInputChange}
                onNext={handleNextStep}
                isPasswordVisible={false}
                togglePasswordVisibility={() => {}}
              />
            )}
            {step === 2 && (
              <StepTwoForm
                formData={formData}
                onInputChange={handleInputChange}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                errors={errors}
              />
            )}
            {step === 3 && (
              <StepThreeForm
                formData={formData}
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onNext={handleSubmit}
                onPrev={handlePrevStep}
                errors={errors}
              />
            )}
          </AuthModal>
        </main>
      </div>
    </div>
  );
};

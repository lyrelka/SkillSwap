import React from 'react';
import { Link } from 'react-router-dom';
import styles from './headerMenu.module.css';
import chevron from '../../../assets/icons/chevron-down.svg';
import type { HeaderMenuProps } from './types';

export const HeaderMenu = ({ onSkillsToggle }: HeaderMenuProps) => {
    return (
        <div className={styles.menuBlock}>
            <Link to={`${import.meta.env.BASE_URL}/about`} className={styles.navLink} aria-label="Подробнее о проекте">
                О проекте
            </Link>

            <button
                type="button"
                className={styles.skillsToggle}
                onClick={onSkillsToggle}
                aria-label="Показать все навыки"
            >
                <span>Все навыки</span>
                <img src={chevron} alt="Переключение списка навыков" loading="lazy" />
            </button>
        </div>
    );
};
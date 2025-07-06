import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardSkill } from './../../shared/ui/CardSkill/CardSkill';
import { CardSkillComponentProps } from './type';

export const CardSkillComponent: FC<CardSkillComponentProps> = memo(
  ({ person }) => {
    const navigate = useNavigate();

    const onDetailsClick = () => {
      if (!person?.id) {
        // перенаправляем на 404, если person или id отсутствуют
        navigate(`${import.meta.env.BASE_URL}/404`, {
          state: {
            message: 'Пользователь не найден',
            from: 'CardSkillComponent',
          },
          replace: true,
        });
        return;
      }

      navigate(`${import.meta.env.BASE_URL}/skill/${person.id}`, { replace: true });
      window.location.reload();
    };

    if (!person) {
      navigate(`${import.meta.env.BASE_URL}/404`, {
        state: {
          message: 'Данные пользователя не загружены',
          from: 'CardSkillComponent',
        },
        replace: true,
      });
      return null;
    }

    return <CardSkill person={person} onDetailsClick={onDetailsClick} />;
  }
);

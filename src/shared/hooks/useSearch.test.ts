import { renderHook, act } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { TCategoryWantToLearn, CardPersonInfo } from '../lib/db/users/types';
import 'core-js/actual/structured-clone';
import useSearch from './useSearch';

const mockUsersData: CardPersonInfo[] = [
  {
    id: 2,
    avatarUrl: 'shared/assets/avatars/user_2.jpg',
    name: 'Анна',
    location: 'Казань',
    age: '26',
    gender: 'Женский',
    skillCanTeach: {
      id: 9,
      name: 'Английский язык',
      description: 'Привет! Учу английскому языку!',
    },
    subcategoriesWantToLearn: [
      { id: 6, name: 'Тайм-менеджмент' },
      { id: 36, name: 'Медитация' },
      { id: 38, name: 'Ментальное здоровье' },
      { id: 40, name: 'Физические тренировки' },
    ],
  },
  {
    id: 3,
    avatarUrl: 'shared/assets/avatars/user_3.jpg',
    name: 'Максим',
    location: 'Москва',
    age: '23',
    gender: 'Мужской',
    skillCanTeach: {
      id: 35,
      name: 'Бизнес-план',
      description: 'Привет! Учу бизнесу!',
    },
    subcategoriesWantToLearn: [
      { id: 9, name: 'Английский язык' },
      { id: 36, name: 'Медитация' },
      { id: 38, name: 'Ментальное здоровье' },
      { id: 40, name: 'Физические тренировки' },
    ],
  },
  {
    id: 4,
    avatarUrl: 'shared/assets/avatars/user_4.jpg',
    name: 'Илона',
    location: 'Екатеринбург',
    age: '33',
    gender: 'Женский',
    skillCanTeach: {
      id: 9,
      name: 'Английский язык',
      description: 'Привет! Учу английскому языку!',
    },
    subcategoriesWantToLearn: [
      { id: 6, name: 'Тайм-менеджмент' },
      { id: 36, name: 'Медитация' },
      { id: 38, name: 'Ментальное здоровье' },
      { id: 40, name: 'Физические тренировки' },
    ],
  },
];

describe('Тесты хука useSearch', () => {
  test('Поиск не зависит от регистра', () => {
    const { result: resultLower } = renderHook(() =>
      useSearch(mockUsersData, 'wantToLearn', 'английский')
    );
    const { result: resultUpper } = renderHook(() =>
      useSearch(mockUsersData, 'wantToLearn', 'АНГЛИЙСКИЙ')
    );
    const { result: resultMixed } = renderHook(() =>
      useSearch(mockUsersData, 'wantToLearn', 'АнГлИйСкИй')
    );

    expect(resultUpper.current).toEqual(resultLower.current);
    expect(resultMixed.current).toEqual(resultLower.current);
  });
  test('Поиск навыка, выбран чек-бокс Все', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, '', 'Английский')
    );
    expect(result.current).toHaveLength(3);
  });
  test('Поиск навыка, выбран чек-бокс Могу научить', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'canTeach', 'Английский')
    );
    expect(result.current.map(u => u.name).sort()).toEqual(['Максим']);
  });
  test('Поиск навыка, выбран чек-бокс Хочу научиться', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'wantToLearn', 'Английский')
    );
    expect(result.current.map(u => u.name).sort()).toEqual(['Анна', 'Илона']);
  });
  test('Поиск с пустой строкой возвращает исходный массив', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'wantToLearn', '')
    );
    expect(result.current).toEqual(mockUsersData);
  });
  test('Поиск по несуществующему слову возвращает пустой массив', () => {
    const { result } = renderHook(() => useSearch(mockUsersData, '', 'дзюдо'));
    expect(result.current).toEqual([]);
  });
  test('Поиск по частичному совпадению', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'canTeach', 'Англ')
    );
    expect(result.current.map(u => u.name)).toEqual(['Максим']);
  });
  test('Поведение с невалидным форматом  - возвращает весь список', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'invalid', 'Английский')
    );
    expect(result.current).toHaveLength(3);
  });
  test('Поиск по пустому массиву возвращает пустой массив', () => {
    const { result } = renderHook(() =>
      useSearch([], 'wantToLearn', 'Английский')
    );
    expect(result.current).toEqual([]);
  });
  test('Поиск с пробелами не сработает(вернет пустой массив)', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'canTeach', '  Английский  ')
    );
    expect(result.current).toEqual([]);
  });
  test('Поиск со спецсимволами не сработает(вернет пустой массив), если их нет в name', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, 'canTeach', 'Англ@')
    );
    expect(result.current).toEqual([]);
  });
  test('Результаты содержат только уникальных пользователей', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, '', 'Английский')
    );

    const ids = result.current.map(u => u.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });
  test('Все пользователи в результате имеют корректную структуру', () => {
    const { result } = renderHook(() =>
      useSearch(mockUsersData, '', 'Английский')
    );

    result.current.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('avatarUrl');
      expect(user).toHaveProperty('gender');
      expect(user).toHaveProperty('location');
      expect(user).toHaveProperty('age');
      expect(user).toHaveProperty('skillCanTeach');
      expect(user.skillCanTeach).toHaveProperty('id');
      expect(user.skillCanTeach).toHaveProperty('name');
      expect(user.skillCanTeach).toHaveProperty('description');
      expect(Array.isArray(user.subcategoriesWantToLearn)).toBe(true);
    });
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { TCategoryWantToLearn, CardPersonInfo } from '../lib/db/users/types';
import 'core-js/actual/structured-clone';
import useFilter from './useFilter';

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

describe('Тесты хука useFilter', () => {
  test('Фильтрация по подкатегории, выбираем Все(format не задан)', () => {
    const filters = {
      subcategory: ['9'], // Выбираем навык с id 9, Английский язык
    };
    const { result } = renderHook(() => useFilter(mockUsersData, filters, '')); //оставляем в фильтр пустую строку, имитация Все
    expect(result.current).toHaveLength(3); //У всех пользователей встретился Английский язык в карточке
  });

  test('Фильтрация по подкатегории, Хочу научиться(format wantToLearn)', () => {
    const filters = {
      subcategory: ['9'], // Выбираем навык с id 9, Английский язык
    };
    const { result } = renderHook(() =>
      useFilter(mockUsersData, filters, 'wantToLearn')
    ); //Выбираем, что хотим обучиться
    expect(result.current).toHaveLength(2); //Ожидаем 2 пользователей, которые обучают навыку
    expect(result.current.map(u => u.name).sort()).toEqual(['Анна', 'Илона']); //Ожидаем Анну и Илону
  });

  test('Фильтрация по подкатегории, Moгу научить(format canTeach)', () => {
    const filters = {
      subcategory: ['6'], // Выбираем навык с id 6, Тайм-менеджмент
    };
    const { result } = renderHook(() =>
      useFilter(mockUsersData, filters, 'canTeach')
    ); //Выбираем Могу научить
    expect(result.current).toHaveLength(2); //У двух человек есть этот навык в Хочу обучиться
    expect(result.current.map(u => u.name).sort()).toEqual(['Анна', 'Илона']); //Ожидаем Анну и Илону
  });

  test('Фильтрация по полу автора', () => {
    const filters = { gender: 'Мужской' };
    const { result } = renderHook(() => useFilter(mockUsersData, filters));
    expect(result.current.map(u => u.name)).toEqual(['Максим']);
  });

  test('Фильтрация по городу', () => {
    const filters = { location: ['Казань'] };
    const { result } = renderHook(() => useFilter(mockUsersData, filters));
    expect(result.current.map(u => u.name)).toEqual(['Анна']);
  });

  test('Фильтрация по массиву значений location', () => {
    const filters = { location: ['Казань', 'Москва'] };
    const { result } = renderHook(() => useFilter(mockUsersData, filters));
    expect(result.current.map(u => u.name).sort()).toEqual(['Анна', 'Максим']);
  });

  test('Фильтрация по всем чекбоксам (подкатегория, навык, пол, город)', () => {
    const filters = {
      subcategory: ['9'], // Выбираем навык с id 9, Английский язык
      gender: 'Женский',
      location: ['Екатеринбург'],
    };
    const { result } = renderHook(() => useFilter(mockUsersData, filters, ''));
    expect(result.current.map(u => u.name)).toEqual(['Илона']);
  });

  test('Фильтрация, если ни один пользователь не подоходит, должна выдавать пустой массив', () => {
    const filters = {
      subcategory: ['9'], // Выбираем навык с id 9, Английский язык
      gender: 'Мужской',
      location: ['Москва'],
    };
    const { result } = renderHook(() =>
      useFilter(mockUsersData, filters, 'wantToLearn')
    );
    expect(result.current).toEqual([]);
  });

  test('Пустые фильтры (filters = {}) возвращают весь список', () => {
    const filters = {};
    const { result } = renderHook(() => useFilter(mockUsersData, filters));
    expect(result.current).toHaveLength(mockUsersData.length);
  });

  test('Пустой массив subcategory не фильтрует данные', () => {
    const filters = { subcategory: [] };
    const { result } = renderHook(() =>
      useFilter(mockUsersData, filters, 'canTeach')
    );
    expect(result.current).toHaveLength(mockUsersData.length);
  });

  test('Несуществующие подкатегории (subcategory: ["999"]) возвращают пустой массив', () => {
    const filters = { subcategory: ['999'] };
    const { result } = renderHook(() => useFilter(mockUsersData, filters));
    expect(result.current).toEqual([]);
  });

  test('Пустой массив данных возвращает пустой массив', () => {
    const filters = { subcategory: ['9'] };
    const { result } = renderHook(() => useFilter([], filters));
    expect(result.current).toEqual([]);
  });

  test('Результат содержит только уникальных пользователей', () => {
    const filters = {
      subcategory: ['9'], // Выбираем навык с id 9, Английский язык, встречается во всех мок-пользователях
    };

    const { result } = renderHook(() => useFilter(mockUsersData, filters, ''));

    const ids = result.current.map(user => user.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  test('Каждый объект результата содержит обязательные поля', () => {
    const filters = { gender: 'Женский' };
    const { result } = renderHook(() => useFilter(mockUsersData, filters));

    result.current.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('location');
      expect(user).toHaveProperty('skillCanTeach');
      expect(user.skillCanTeach).toHaveProperty('id');
      expect(user.skillCanTeach).toHaveProperty('name');
      expect(user).toHaveProperty('subcategoriesWantToLearn');
      expect(Array.isArray(user.subcategoriesWantToLearn)).toBe(true);
    });
  });
});

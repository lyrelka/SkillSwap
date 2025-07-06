import { TCategory, TSkill, TSubcategory } from '@shared/lib/db/skills/types';
import memoize from 'lodash/memoize';

export function readAllCategories(): Promise<TCategory[]> {
  return fetch(`${import.meta.env.BASE_URL}/db/skills.json`)
    .then(response => response.json())
    .then(data => data as TCategory[])
    .catch(error => {
      console.error('Error fetching skills data:', error);
      return [];
    });
}

export function readCategoryByName(
  name: string
): Promise<TCategory | undefined> {
  return readAllCategories().then(categories => {
    return categories.find(category => category.category === name);
  });
}

export function readSubcategoryByName(
  subcategoryName: string
): Promise<TSubcategory | undefined> {
  return readAllCategories().then(categories => {
    for (const category of categories) {
      const subcategory = category.subcategory.find(
        sub => sub.name === subcategoryName
      );
      if (subcategory) {
        return subcategory;
      }
    }
    return undefined;
  });
}

export function readSubcategoryById(
  subcategoryId: number
): Promise<TSubcategory | undefined> {
  return readAllCategories().then(categories => {
    for (const category of categories) {
      const subcategory = category.subcategory.find(
        sub => sub.id === subcategoryId
      );
      if (subcategory) {
        return subcategory;
      }
    }
    return undefined;
  });
}

export function readSkillByName(
  skillName: string
): Promise<TSkill | undefined> {
  return readAllCategories().then(categories => {
    for (const category of categories) {
      for (const subcategory of category.subcategory) {
        const skill = subcategory.skills.find(
          skill => skill.name === skillName
        );
        if (skill) {
          return skill;
        }
      }
    }
    return undefined;
  });
}

export function readSkillById(skillId: number): Promise<TSkill | undefined> {
  return readAllCategories().then(categories => {
    for (const category of categories) {
      for (const subcategory of category.subcategory) {
        const skill = subcategory.skills.find(skill => skill.id === skillId);
        if (skill) {
          return skill;
        }
      }
    }
    return undefined;
  });
}


// кэшируем результаты readAllCategories с явным указанием типа возвращаемого значения
const memoizedReadAllCategories: () => Promise<TCategory[]> = memoize(readAllCategories);

// по названию скилла выдает цвет категории
export function readSkillColorByName(
  skillName: string
): Promise<string | undefined> {
  return memoizedReadAllCategories()
    .then((categories: TCategory[]) => {
      if (!categories || categories.length === 0) {
        console.error("Ошибка: список категорий пуст или не определён");
        return undefined;
      }
      const foundCategory = categories.find((category: TCategory) => 
        category.subcategory.some((subcategory: TSubcategory) => 
          subcategory.skills.some((skill: TSkill) => skill.name === skillName)
        )
      );
      return foundCategory?.color;
    })
    .catch((error) => {
      console.error("Ошибка при загрузке категорий:", error);
      return undefined;
    });
}

export function readSkillColorBySubcategoryName(
  subcategoryName: string
): Promise<string | undefined> {
  return memoizedReadAllCategories()
    .then((categories: TCategory[]) => {
      if (!categories || categories.length === 0) {
        console.error("Ошибка: список категорий пуст или не определён");
        return undefined;
      }
      const foundCategory = categories.find((category: TCategory) => 
        category.subcategory.some((subcategory: TSubcategory) => 
          subcategory.name === subcategoryName
        )
      );
      return foundCategory?.color;
    })
    .catch((error) => {
      console.error("Ошибка при загрузке категорий:", error);
      return undefined;
    });
}

// Функция для получения CSS класса по цвету категории
export function getColorClassName(color: string | undefined): string {
  if (!color) return '';

  const colorMap: Record<string, string> = {
    EEE7F7: 'business',
    EBE5C5: 'foreignlang',
    E9F7E7: 'health',
    F7E7F2: 'art',
    E7F2F6: 'education',
    F7EBE5: 'house',
  };

  return colorMap[color] || '';
}

export function readSkillColorClass(
  name: string,
  by: 'skill' | 'subcategory'
): Promise<string> {
  const colorPromise =
    by === 'skill'
      ? readSkillColorByName(name)
      : readSkillColorBySubcategoryName(name);
  
  return colorPromise.then(getColorClassName);
}
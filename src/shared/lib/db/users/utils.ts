import { CardPersonInfo } from '@shared/lib/db/users/types';

export function readAllUsers(): Promise<CardPersonInfo[]> {
  return fetch(`${import.meta.env.BASE_URL}/db/users.json`)
    .then(response => response.json())
    .then(data => data as CardPersonInfo[])
    .catch(error => {
      console.error('Error fetching users data:', error);
      return [];
    });
}

export function readUserById(id: number): Promise<CardPersonInfo | undefined> {
  return readAllUsers().then(users => {
    return users.find(user => user.id === id);
  });
}

import { atom, selector } from 'recoil';

export interface IUser {
  id: number;
  username: string;
  email: string;
  // add more fields as needed
}

export interface IAuth {
  accessToken: string;
  refreshToken?: string;
  user?: IUser;
}

// Atom to store auth information
export const authAtom = atom<IAuth | null>({
  key: 'authAtom',
  default: null,
});

// Selector to check if user is authenticated
export const isAuthenticatedSelector = selector<boolean>({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const auth = get(authAtom);
    return !!(auth && auth.accessToken);
  },
});
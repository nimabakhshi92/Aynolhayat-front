export const isAdmin = (user) => {
  return user?.is_staff;
};

export const isLoggedIn = (user) => user?.id !== 2;

export const isSuperAdmin = (user) => user?.id === 3;

export const getFont = (defualt) => defualt * 1.4;

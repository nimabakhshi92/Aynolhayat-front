export const isAdmin = (user) => {
  return user?.id === 1 || user?.id === 3;
};

export const isSuperAdmin = (user) => user?.id === 3;

export const getFont = (defualt) => defualt * 1.4;

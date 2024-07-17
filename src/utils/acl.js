export const isAdmin = (user) => {
  return user?.is_staff;
};

export const isLoggedIn = (user) => user?.id !== 2;

export const isSuperAdmin = (user) => user?.is_super_admin;

export const isCheckerAdmin = (user) => user?.is_checker_admin

export const getFont = (defualt) => defualt * 1.4;

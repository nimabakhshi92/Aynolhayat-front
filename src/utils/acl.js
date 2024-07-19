export const isAdmin = (user) => {
  return user?.is_staff;
};

export const isLoggedIn = (user) => user?.id !== 2;

export const isSuperAdmin = (user) => user?.is_super_admin;

export const isCheckerAdmin = (user) => user?.is_checker_admin

export const getFont = (user, defualt) => {
  if (user?.is_super_admin || user?.is_checker_admin)
    return defualt * 1.4
  else return defualt
}

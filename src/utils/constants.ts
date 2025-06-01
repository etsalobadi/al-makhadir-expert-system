
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  JUDGE: 'judge',
  EXPERT: 'expert',
  NOTARY: 'notary',
  INHERITANCE_OFFICER: 'inheritance_officer',
};

export const CASE_STATUS = {
  NEW: 'new',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  PENDING_REVIEW: 'pending_review',
  COMPLETED: 'completed',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
};

export const EXPERT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
};

export const NAVIGATION_ITEMS = [
  {
    name: 'لوحة المعلومات',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE, USER_ROLES.EXPERT, USER_ROLES.NOTARY, USER_ROLES.INHERITANCE_OFFICER],
  },
  {
    name: 'الخبراء',
    path: '/experts',
    icon: 'Users',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE],
  },
  {
    name: 'القضايا',
    path: '/cases',
    icon: 'FileText',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE, USER_ROLES.EXPERT, USER_ROLES.NOTARY, USER_ROLES.INHERITANCE_OFFICER],
  },
  {
    name: 'قسمة المواريث',
    path: '/inheritance',
    icon: 'Gavel',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE, USER_ROLES.INHERITANCE_OFFICER],
  },
  {
    name: 'بوابة الجلسات',
    path: '/sessions',
    icon: 'Video',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE, USER_ROLES.EXPERT],
  },
  {
    name: 'الإعلانات القضائية',
    path: '/announcements',
    icon: 'Bell',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE, USER_ROLES.EXPERT, USER_ROLES.NOTARY, USER_ROLES.INHERITANCE_OFFICER],
  },
  {
    name: 'الخدمات الإلكترونية',
    path: '/electronic-services',
    icon: 'Database',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE],
  },
  {
    name: 'الشكاوى',
    path: '/complaints',
    icon: 'AlertCircle',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE],
  },
  {
    name: 'التقارير',
    path: '/reports',
    icon: 'BarChart',
    roles: [USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.JUDGE],
  },
  {
    name: 'الإعدادات',
    path: '/settings',
    icon: 'Settings',
    roles: [USER_ROLES.ADMIN],
  },
];

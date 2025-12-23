export enum View {
  LOGIN = 'LOGIN',
  ROLE_SELECT = 'ROLE_SELECT',
  DASHBOARD = 'DASHBOARD',
  ORDER_CUSTOMER = 'ORDER_CUSTOMER',
  ORDER_SERVICE = 'ORDER_SERVICE',
  ORDER_DETAIL = 'ORDER_DETAIL',
  PAYMENT = 'PAYMENT',
  FEEDBACK = 'FEEDBACK',
  DAY_OPEN = 'DAY_OPEN',
  DAY_CLOSE = 'DAY_CLOSE',
  // Add other views as needed for full implementation
}

export interface User {
  name: string;
  role: string;
  avatar?: string;
}

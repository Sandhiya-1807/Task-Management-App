import { AuthUser } from '../types/auth';

const DEMO_USERS_KEY = 'task_app_demo_registered_users';
const DEMO_SESSION_KEY = 'task_app_demo_current_session';

interface DemoStoredUser {
  uid: string;
  name: string;
  email: string;
  passwordHash: string; // Stored only locally in browser localStorage for simulation
}

export function getStoredDemoUsers(): DemoStoredUser[] {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading demo users from storage:', e);
    return [];
  }
}

export function saveStoredDemoUsers(users: DemoStoredUser[]): void {
  try {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving demo users to storage:', e);
  }
}

export function getDemoCurrentSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error reading demo session:', e);
    return null;
  }
}

export function setDemoCurrentSession(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_SESSION_KEY);
    }
  } catch (e) {
    console.error('Error setting demo session:', e);
  }
}

export function registerDemoUser(name: string, email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredDemoUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account already exists with this email address.');
  }

  // Consistent, deterministic or unique local ID for isolation
  const uid = `demo_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: DemoStoredUser = {
    uid,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password, // kept strictly client-side in localStorage
  };

  users.push(newUser);
  saveStoredDemoUsers(users);

  const authUser: AuthUser = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.name,
  };

  setDemoCurrentSession(authUser);
  return authUser;
}

export function loginDemoUser(email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredDemoUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error('No user account found with this email.');
  }

  if (user.passwordHash !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  const authUser: AuthUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.name,
  };

  setDemoCurrentSession(authUser);
  return authUser;
}

export function logoutDemoUser(): void {
  setDemoCurrentSession(null);
}

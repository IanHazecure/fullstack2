import { Injectable } from '@angular/core';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  birthDate: string;
  shippingAddress: string;
  recoveryCode: string;
  createdAt: string;
}

export interface AuthResult {
  ok: boolean;
  message?: string;
  user?: User;
}

const KEYS = {
  users: 'vinilos.users',
  currentUser: 'vinilos.currentUser',
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readList(): User[] {
    try {
      const value = localStorage.getItem(KEYS.users);
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeList(users: User[]): void {
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  }

  private createId(): string {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private seed(): User[] {
    const users = this.readList();
    if (!users.some(u => u.username === 'admin')) {
      users.push({
        id: this.createId(),
        fullName: 'Administrador Vinilos',
        username: 'admin',
        email: 'admin@vinilos.test',
        password: 'Admin123',
        role: 'admin',
        birthDate: '1990-01-01',
        shippingAddress: '',
        recoveryCode: 'VINILOS-ADMIN',
        createdAt: new Date().toISOString(),
      });
      this.writeList(users);
    }
    return users;
  }

  getUsers(): User[] {
    return this.seed();
  }

  private saveUsers(users: User[]): void {
    this.writeList(users);
  }

  findUserByIdentifier(identifier: string): User | undefined {
    const normalized = this.normalize(identifier);
    return this.getUsers().find(
      u => u.username === normalized || u.email.toLowerCase() === normalized
    );
  }

  registerUser(userData: Partial<User> & { password: string }): AuthResult {
    const users = this.getUsers();
    const username = this.normalize(userData.username!);
    const email = this.normalize(userData.email!);

    if (users.some(u => u.username === username)) {
      return { ok: false, message: 'Ese nombre de usuario ya está registrado.' };
    }
    if (users.some(u => u.email.toLowerCase() === email)) {
      return { ok: false, message: 'Ese correo electrónico ya está registrado.' };
    }

    const newUser: User = {
      id: this.createId(),
      fullName: userData.fullName!.trim(),
      username,
      email,
      password: userData.password,
      role: 'user',
      birthDate: userData.birthDate!,
      shippingAddress: userData.shippingAddress?.trim() || '',
      recoveryCode: userData.recoveryCode || '',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return { ok: true, user: newUser };
  }

  authenticateUser(identifier: string, password: string): AuthResult {
    const user = this.findUserByIdentifier(identifier);
    if (!user || user.password !== password) {
      return { ok: false, message: 'Usuario o contraseña incorrectos.' };
    }
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
    return { ok: true, user };
  }

  getCurrentUser(): User | null {
    try {
      const value = localStorage.getItem(KEYS.currentUser);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  }

  updateUser(updatedUser: User): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index === -1) return false;

    users[index] = updatedUser;
    this.saveUsers(users);

    const current = this.getCurrentUser();
    if (current && current.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }
    return true;
  }

  deleteUserById(userId: string): boolean {
    const users = this.getUsers();
    const next = users.filter(u => u.id !== userId);
    if (next.length === users.length) return false;

    this.saveUsers(next);
    const current = this.getCurrentUser();
    if (current && current.id === userId) this.logout();
    return true;
  }

  logout(): void {
    localStorage.removeItem(KEYS.currentUser);
  }

  recoverPassword(identifier: string, recoveryCode: string, newPassword: string): AuthResult {
    const users = this.getUsers();
    const normalized = this.normalize(identifier);
    const idx = users.findIndex(
      u => u.username === normalized || u.email.toLowerCase() === normalized
    );

    if (idx === -1) return { ok: false, message: 'Usuario no encontrado.' };

    const user = users[idx];
    if (!user.recoveryCode || user.recoveryCode !== recoveryCode) {
      return { ok: false, message: 'Código de recuperación incorrecto.' };
    }

    user.password = newPassword;
    users[idx] = user;
    this.saveUsers(users);

    const current = this.getCurrentUser();
    if (current && current.id === user.id) this.setCurrentUser(user);

    return { ok: true };
  }
}
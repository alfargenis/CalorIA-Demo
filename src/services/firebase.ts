/**
 * CalorIA Demo - Mock Firebase Service
 * Simulates Firebase functionality for demo purposes
 */

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    // Mock authentication - always succeeds for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: 'demo_user_123',
      email,
      displayName: 'Demo User',
      createdAt: new Date(),
    };
  }

  static async signUpWithEmail(email: string, password: string) {
    return this.signInWithEmail(email, password);
  }

  static async signInWithGoogle() {
    return this.signInWithEmail('demo@caloria.app', 'demo');
  }

  static async signInWithApple() {
    return this.signInWithEmail('demo@caloria.app', 'demo');
  }

  static async signOut() {
    console.log('Demo sign out');
  }
}

export class FirestoreService {
  static async saveUserProfile(userId: string, profile: any) {
    console.log('Demo: Saving user profile locally');
    return profile;
  }

  static async getUserProfile(userId: string) {
    console.log('Demo: Getting user profile from local storage');
    return null;
  }
}

export class StorageService {
  static async uploadImage(userId: string, imageUri: string, path: string) {
    console.log('Demo: Mock image upload');
    return `demo_images/${Date.now()}.jpg`;
  }
}
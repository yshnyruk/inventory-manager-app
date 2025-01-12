import { auth } from './firebase';
import {
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export const registerUser = async (
  nickname: string,
  email: string,
  password: string,
  checkPassword: string
) => {
  if (password !== checkPassword) {
    alert('Passwords do not match. Please try again.');
    return null;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: nickname,
    });

    alert('User registered successfully!');
    console.log('User registered:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    // Handle errors
    switch ((error as any).code) {
      case 'auth/email-already-in-use':
        alert('The email address is already in use by another account.');
        break;
      case 'auth/invalid-email':
        alert('The email address is not valid. Please enter a valid email.');
        break;
      case 'auth/weak-password':
        alert(
          'The password is too weak. Please choose a stronger password (at least 6 characters).'
        );
        break;
      case 'auth/operation-not-allowed':
        alert(
          'Email/password accounts are not enabled. Please contact support.'
        );
        break;
      case 'auth/invalid-credential':
        alert('Invalid credential. Please try again.');
        break;
      default:
        alert(`An unknown error occurred: ${(error as any).message}`);
    }
    console.log(
      'Error registering user:',
      (error as any).code,
      (error as any).message
    );
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    alert(`Welcome back, ${user.displayName}!`);
    console.log('User signed in:', user);
    return userCredential.user;
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      switch ((error as any).code) {
        case 'auth/user-not-found':
          alert('User not found. Please check your email or sign up.');
          break;
        case 'auth/wrong-password':
          alert('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          alert('Invalid email format. Please enter a valid email.');
          break;
        case 'auth/too-many-requests':
          alert('Too many login attempts. Please try again later.');
          break;
        case 'auth/invalid-credential':
          alert('Invalid credential. Please try again.');
          break;
        default:
          alert(`An unknown error occurred: ${error.message}`);
      }
      console.log('Login error:', error.message);
    } else {
      alert('An unexpected error occurred. Please try again.');
      console.log(
        'Unknown error:',
        (error as any).code,
        (error as any).message
      );
      return null;
    }
  }
};

export const logoutUser = () => signOut(auth);

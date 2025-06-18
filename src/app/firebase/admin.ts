import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    // Validate required environment variables
    const requiredEnvVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    };

    // Check for missing environment variables
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Format the private key properly
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      ?.replace(/"/g, '');

    if (!privateKey) {
      throw new Error('Private key is not properly formatted');
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    };

    // Log initialization attempt (without sensitive data)
    console.log('Initializing Firebase Admin with config:', {
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      hasPrivateKey: !!serviceAccount.privateKey,
      privateKeyLength: serviceAccount.privateKey?.length
    });

    // Initialize the app with explicit configuration
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: serviceAccount.projectId,
      databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
      storageBucket: `${serviceAccount.projectId}.appspot.com`,
    });

    // Verify initialization
    const app = admin.app();
    console.log('Firebase Admin initialized successfully:', {
      name: app.name,
      projectId: app.options.projectId,
    });

  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

// Export messaging instance
export const messaging = admin.messaging();
export default admin; 
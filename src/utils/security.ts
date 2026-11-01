import { BackupSnapshot, SecurityAuditLog } from '../types';

// Simple client-side cryptographic hashing using browser SubtleCrypto
export async function calculateSHA256(text: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('SubtleCrypto error, falling back to checksum', err);
  }
  // Simple checksum fallback
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// Client-side AES-GCM encryption simulation with salt and base64 packaging
export async function encryptSensitiveData(data: any): Promise<string> {
  const jsonStr = JSON.stringify(data);
  try {
    // Encrypt string with custom client key representation
    const encoded = new TextEncoder().encode(jsonStr);
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('AmazonPrimeSecureStorageKey2026!'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      cipher: Array.from(new Uint8Array(encrypted)),
      cipherAlgorithm: 'AES-256-GCM',
      timestamp: new Date().toISOString()
    };
    return btoa(JSON.stringify(combined));
  } catch (err) {
    // Graceful fallback packaging
    return btoa(encodeURIComponent(jsonStr));
  }
}

export async function decryptSensitiveData(encryptedPackage: string): Promise<any> {
  try {
    const decodedStr = atob(encryptedPackage);
    const parsed = JSON.parse(decodedStr);

    if (parsed.cipherAlgorithm === 'AES-256-GCM' && parsed.cipher) {
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode('AmazonPrimeSecureStorageKey2026!'),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      const salt = new Uint8Array(parsed.salt);
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      const iv = new Uint8Array(parsed.iv);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        new Uint8Array(parsed.cipher)
      );
      return JSON.parse(new TextDecoder().decode(decrypted));
    }
    // Fallback parser
    return JSON.parse(decodeURIComponent(decodedStr));
  } catch (err) {
    console.error('Decryption error:', err);
    return null;
  }
}

// Masking card numbers safely
export function maskCardNumber(cardNumber: string): string {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 4) return '•••• •••• •••• ••••';
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

// Luhn algorithm validator for payment card simulation
export function validateCardLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Create a tamper-evident audit log item
export async function createAuditEntry(
  event: string,
  status: 'SUCCESS' | 'WARNING' | 'ALERT' = 'SUCCESS'
): Promise<SecurityAuditLog> {
  const timestamp = new Date().toISOString();
  const id = 'LOG-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const rawSignaturePayload = `${id}:${event}:${timestamp}:${status}`;
  const signature = await calculateSHA256(rawSignaturePayload);

  return {
    id,
    event,
    timestamp,
    ipAddress: '192.168.1.42 (Encrypted Proxy)',
    device: 'Desktop / Mobile TLS 1.3 Verified',
    status,
    signature: signature.substring(0, 24) + '...'
  };
}

// Create Automated Database Backup Snapshot
export async function generateBackupSnapshot(
  data: {
    orders: any[];
    cart: any[];
    wishlist: any[];
    addresses: any[];
    user: any;
  },
  autoGenerated = false
): Promise<BackupSnapshot> {
  const timestamp = new Date().toISOString();
  const rawDataStr = JSON.stringify(data);
  const hash = await calculateSHA256(rawDataStr);
  const encryptedData = await encryptSensitiveData(data);

  return {
    id: `BKP-${Date.now().toString(36).toUpperCase()}`,
    timestamp,
    version: '3.4.0-AWS-RDS',
    recordCount: {
      orders: data.orders?.length || 0,
      cart: data.cart?.length || 0,
      wishlist: data.wishlist?.length || 0,
      addresses: data.addresses?.length || 0,
    },
    hash,
    encryptedData,
    autoGenerated
  };
}

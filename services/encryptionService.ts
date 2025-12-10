// services/encryptionService.ts

// Configuration for encryption
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12; // Recommended for AES-GCM
const KEY_LENGTH = 256;

interface EncryptedPackage {
    data: string; // Base64 encoded encrypted data
    iv: string;   // Base64 encoded IV
    salt: string; // Base64 encoded Salt
}

// Helper: Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Helper: Convert Base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
};

// Helper: Derive Key from Password
const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt as any, // Cast to any to avoid TS ArrayBuffer/SharedArrayBuffer issues
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: KEY_LENGTH },
        false,
        ["encrypt", "decrypt"]
    );
};

export const encryptData = async (data: any, password: string): Promise<string> => {
    try {
        const jsonString = JSON.stringify(data);
        const enc = new TextEncoder();
        const encodedData = enc.encode(jsonString);

        // Generate random salt and IV
        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
        const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

        // Derive key
        const key = await deriveKey(password, salt);

        // Encrypt
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv as any // Cast to any to avoid TS issues
            },
            key,
            encodedData
        );

        // Package result
        const pkg: EncryptedPackage = {
            data: arrayBufferToBase64(encryptedContent),
            iv: arrayBufferToBase64(iv.buffer as ArrayBuffer), // Use .buffer
            salt: arrayBufferToBase64(salt.buffer as ArrayBuffer) // Use .buffer
        };

        return JSON.stringify(pkg);
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Failed to encrypt data.");
    }
};

export const decryptData = async (encryptedPackageStr: string, password: string): Promise<any> => {
    try {
        const pkg: EncryptedPackage = JSON.parse(encryptedPackageStr);

        if (!pkg.data || !pkg.iv || !pkg.salt) {
            throw new Error("Invalid backup file format.");
        }

        const salt = base64ToUint8Array(pkg.salt);
        const iv = base64ToUint8Array(pkg.iv);
        const encryptedData = base64ToUint8Array(pkg.data);

        // Derive key
        const key = await deriveKey(password, salt);

        // Decrypt
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv as any // Cast to any
            },
            key,
            encryptedData as any // Cast to any to avoid TS issues
        );

        const dec = new TextDecoder();
        const decodedString = dec.decode(decryptedContent);
        return JSON.parse(decodedString);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Failed to decrypt data. Incorrect password or corrupted file.");
    }
};

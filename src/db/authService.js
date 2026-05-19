// src/db/authService.js
import CryptoJS from 'crypto-js';
import db from './database';

// Helper function to hash passwords (SHA-256) as required by Component 0 Security
export const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
};

// Register a new parent
export const registerParent = async (username, password, isAdmin = false) => {
    // Check if username already exists
    const existing = await db.parents.where({ username }).first();
    if (existing) {
        throw new Error('Username already exists. Please choose another.');
    }

    const hashedPassword = hashPassword(password);

    // Add to Dexie database
    await db.parents.add({
        username: username,
        password: hashedPassword,
        is_admin: isAdmin
    });
};

// Login a parent
export const loginParent = async (username, password) => {
    const parent = await db.parents.where({ username }).first();

    if (!parent) {
        throw new Error('Username not found.');
    }

    const hashedPassword = hashPassword(password);
    if (parent.password !== hashedPassword) {
        throw new Error('Incorrect password.');
    }

    // Success: Return parent data without the password
    return { id: parent.id, username: parent.username, is_admin: parent.is_admin };
};
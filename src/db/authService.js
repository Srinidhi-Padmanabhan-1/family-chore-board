import CryptoJS from 'crypto-js';
import db from './database';

// Helper function to hash passwords (SHA-256)
export const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
};

// Register a new parent
export const registerParent = async (username, password, isAdmin = false) => {
    const existing = await db.parents.where({ username }).first();
    if (existing) {
        throw new Error('Username already exists. Please choose another.');
    }

    const hashedPassword = hashPassword(password);

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

    return { id: parent.id, username: parent.username, is_admin: parent.is_admin };
};

// Register a new child
export const registerChild = async (username, password, parentId) => {
    const existing = await db.children.where({ username }).first();
    if (existing) {
        throw new Error('Child username already exists. Please choose another.');
    }

    const hashedPassword = hashPassword(password);

    await db.children.add({
        username: username,
        password: hashedPassword,
        points_balance: 0,
        parent_id: parseInt(parentId)
    });
};
// Login a child
export const loginChild = async (username, password) => {
    const child = await db.children.where({ username }).first();

    if (!child) {
        throw new Error('Username not found. Did your parent make your account yet?');
    }

    const hashedPassword = hashPassword(password);
    if (child.password !== hashedPassword) {
        throw new Error('Incorrect password.');
    }

    // Success! Return the child's basic info
    return { id: child.id, username: child.username };
};
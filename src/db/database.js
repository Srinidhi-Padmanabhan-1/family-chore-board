import Dexie from 'dexie';

// 1. Auto-Initialization
const db = new Dexie('ChoreBoardDB');

// 2. Tables Created
db.version(1).stores({
    parents: '++id, username, password, is_admin',
    children: '++id, username, password, points_balance, parent_id',
    chores: '++id, title, description, point_value, status, assigned_child_id',
    rewards: '++id, title, cost',
    transactions_history: '++id, child_id, action_type, points_change, timestamp'
});

export default db;
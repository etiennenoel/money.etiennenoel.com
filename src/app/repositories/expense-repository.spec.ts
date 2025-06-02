import 'fake-indexeddb/auto';
import { ExpenseRepository } from './expense-repository';
import { Expense } from '../interfaces/expense.interface';

describe('ExpenseRepository', () => {
  let repository: ExpenseRepository;

  beforeEach(() => {
    // Clears all instances and deletes all databases.
    // indexedDB.deleteDatabase('ExpenseDB'); // fake-indexeddb automatically clears between tests
    repository = new ExpenseRepository();
    // Ensure the DB is ready before each test by chaining a dummy operation
    return new Promise((resolve) => {
      const ensureDbReady = async () => {
        await repository.getAll(); // Or any other simple operation to ensure DB is open
        resolve(null);
      };
      ensureDbReady();
    });
  });

  afterEach(async () => {
    // Clean up the database after each test to ensure test isolation
    // This might not be strictly necessary with fake-indexeddb/auto per test file,
    // but good practice if state could leak or if not using /auto.
    // For fake-indexeddb, the database is in-memory and typically reset.
    // However, explicit deletion can be done if needed.
    const dbInstance = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('ExpenseDB');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    dbInstance.close(); // Close connection before deleting
    await new Promise<void>((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase('ExpenseDB');
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = (event) => {
            console.error("Error deleting database:", (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error);
        };
        deleteRequest.onblocked = (event) => {
            console.warn("Delete database blocked:", event);
            // Attempt to force close and retry or just resolve and hope for the best
            // This can happen if connections are not properly closed.
            resolve(); 
        };
    });
  });

  // Test Database Initialization (implicitly tested by beforeEach and operations)
  // We can add a more specific test if needed, but fake-indexeddb handles setup.
  it('should initialize the database and object store', async () => {
    // The beforeEach block already initializes ExpenseRepository, which opens the DB.
    // We can verify by trying to add and retrieve an item.
    const expenseData = {
      transactionDate: new Date(),
      amount: 100,
      currency: 'USD',
      location: 'Test Location',
      description: 'Test DB Init',
      categories: ['test'],
      labels: [],
    };
    const createdExpense = await repository.create(expenseData);
    expect(createdExpense.id).toBeDefined();
    const retrievedExpense = await repository.getById(createdExpense.id);
    expect(retrievedExpense).toBeDefined();
    expect(retrievedExpense?.description).toBe('Test DB Init');
  });

  describe('create()', () => {
    it('should add an expense to the database and return it', async () => {
      const expenseData = {
        transactionDate: new Date('2024-01-15'),
        amount: 120.50,
        currency: 'USD',
        location: 'Grocery Store',
        description: 'Weekly groceries',
        categories: ['food', 'groceries'],
        labels: ['essential'],
      };
      const createdExpense = await repository.create(expenseData);
      expect(createdExpense.id).toBeDefined();
      expect(createdExpense.createdAt).toBeInstanceOf(Date);
      expect(createdExpense.amount).toBe(120.50);
      expect(createdExpense.description).toBe('Weekly groceries');

      const retrievedExpense = await repository.getById(createdExpense.id);
      expect(retrievedExpense).toEqual(createdExpense);
    });

    it('should generate id and createdAt', async () => {
      const expenseData = {
        transactionDate: new Date(),
        amount: 50,
        currency: 'EUR',
        location: 'Cafe',
        description: 'Coffee',
        categories: ['food'],
        labels: [],
      };
      const createdExpense = await repository.create(expenseData);
      expect(createdExpense.id).toEqual(expect.any(String));
      expect(createdExpense.id.length).toBeGreaterThan(0); // Basic check for UUID-like string
      expect(createdExpense.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getById()', () => {
    it('should retrieve an existing expense', async () => {
      const expenseData = {
        transactionDate: new Date(),
        amount: 75,
        currency: 'GBP',
        location: 'Bookstore',
        description: 'New novel',
        categories: ['leisure'],
        labels: [],
      };
      const createdExpense = await repository.create(expenseData);
      const retrievedExpense = await repository.getById(createdExpense.id);
      expect(retrievedExpense).toEqual(createdExpense);
    });

    it('should return undefined for a non-existent expense', async () => {
      const retrievedExpense = await repository.getById('non-existent-id');
      expect(retrievedExpense).toBeUndefined();
    });
  });

  describe('getAll()', () => {
    it('should return an empty array when the store is empty', async () => {
      const allExpenses = await repository.getAll();
      expect(allExpenses).toEqual([]);
    });

    it('should retrieve all expenses', async () => {
      const expenseData1 = {
        transactionDate: new Date(),
        amount: 25,
        currency: 'USD',
        location: 'Online Store',
        description: 'Software subscription',
        categories: ['software', 'work'],
        labels: ['monthly'],
      };
      const expenseData2 = {
        transactionDate: new Date(),
        amount: 200,
        currency: 'USD',
        location: 'Restaurant',
        description: 'Dinner with friends',
        categories: ['food', 'social'],
        labels: [],
      };
      await repository.create(expenseData1);
      await repository.create(expenseData2);

      const allExpenses = await repository.getAll();
      expect(allExpenses.length).toBe(2);
      // Order might not be guaranteed, so check for presence
      expect(allExpenses.find(e => e.description === 'Software subscription')).toBeDefined();
      expect(allExpenses.find(e => e.description === 'Dinner with friends')).toBeDefined();
    });
  });

  describe('update()', () => {
    it('should update an existing expense and return it', async () => {
      const expenseData = {
        transactionDate: new Date(),
        amount: 90,
        currency: 'CAD',
        location: 'Hardware Store',
        description: 'Tools',
        categories: ['home'],
        labels: [],
      };
      const createdExpense = await repository.create(expenseData);

      const updatedData: Expense = {
        ...createdExpense,
        amount: 95.50,
        description: 'Better tools',
      };
      const updatedExpense = await repository.update(updatedData);
      expect(updatedExpense.amount).toBe(95.50);
      expect(updatedExpense.description).toBe('Better tools');
      expect(updatedExpense.id).toBe(createdExpense.id);

      const retrievedExpense = await repository.getById(createdExpense.id);
      expect(retrievedExpense?.amount).toBe(95.50);
    });

    it('should reject if trying to update a non-existent expense', async () => {
      const nonExistentExpense: Expense = {
        id: 'non-existent-id',
        createdAt: new Date(),
        transactionDate: new Date(),
        amount: 100,
        currency: 'USD',
        location: 'Nowhere',
        description: 'Ghost expense',
        categories: [],
        labels: [],
      };
      await expect(repository.update(nonExistentExpense)).rejects.toThrow(
        `Expense with id ${nonExistentExpense.id} not found.`
      );
    });
  });

  describe('delete()', () => {
    it('should delete an existing expense', async () => {
      const expenseData = {
        transactionDate: new Date(),
        amount: 40,
        currency: 'AUD',
        location: 'Pharmacy',
        description: 'Medicine',
        categories: ['health'],
        labels: [],
      };
      const createdExpense = await repository.create(expenseData);
      await repository.delete(createdExpense.id);
      const retrievedExpense = await repository.getById(createdExpense.id);
      expect(retrievedExpense).toBeUndefined();
    });

    it('should resolve even if trying to delete a non-existent expense', async () => {
      // IndexedDB delete operation is idempotent, it doesn't error if key not found
      await expect(repository.delete('non-existent-id')).resolves.toBeUndefined();
    });
  });
});

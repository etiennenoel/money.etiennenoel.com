import { Expense } from '../interfaces/expense.interface';

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'c6c9b5c0-22f7-4c7a-9f6d-9e8e3e6a2f1a',
    createdAt: new Date('2023-10-01T10:00:00Z'),
    transactionDate: new Date('2023-09-28T14:30:00Z'),
    amount: 50.00,
    currency: 'USD',
    location: 'Supermarket A',
    description: 'Weekly groceries',
    categories: ['groceries', 'food'],
    labels: ['essential']
  },
  {
    id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    createdAt: new Date('2023-10-05T12:15:00Z'),
    transactionDate: new Date('2023-10-03T09:00:00Z'),
    amount: 25.50,
    currency: 'USD',
    location: 'Coffee Shop X',
    description: 'Morning coffee and pastry',
    categories: ['food', 'coffee'],
    labels: ['discretionary']
  },
  {
    id: 'f4e3d2c1-b0a9-8z7y-6x5w-v4u3t2s1r0q9',
    createdAt: new Date('2023-10-10T18:45:00Z'),
    transactionDate: new Date('2023-10-09T17:30:00Z'),
    amount: 120.75,
    currency: 'EUR',
    location: 'Online Retailer Z',
    description: 'New headphones',
    categories: ['electronics', 'shopping'],
    labels: ['personal', 'gadget']
  },
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p7',
    createdAt: new Date('2023-10-15T08:00:00Z'),
    transactionDate: new Date('2023-10-14T10:20:00Z'),
    amount: 15.00,
    currency: 'GBP',
    location: 'Local Bakery',
    description: 'Bread and pastries for breakfast',
    categories: ['food', 'bakery'],
    labels: ['essential', 'treat']
  },
  {
    id: 'p0o9i8u7-y6t5-r4e3-w2q1-a0s9d8f7g6h5',
    createdAt: new Date('2023-10-20T15:30:00Z'),
    transactionDate: new Date('2023-10-19T11:00:00Z'),
    amount: 75.20,
    currency: 'USD',
    location: 'Gas Station Y',
    description: 'Fuel for car',
    categories: ['transportation', 'car'],
    labels: ['essential']
  },
  {
    id: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8i7u6y5t4',
    createdAt: new Date('2023-10-25T11:00:00Z'),
    transactionDate: new Date('2023-10-24T13:45:00Z'),
    amount: 300.00,
    currency: 'USD',
    location: 'Utility Company ABC',
    description: 'Electricity bill payment',
    categories: ['utilities', 'bills'],
    labels: ['essential', 'household']
  },
  {
    id: 'm1n2b3v4-c5x6-z7l8-k9j0-h1g2f3d4s5a6',
    createdAt: new Date('2023-10-28T19:00:00Z'),
    transactionDate: new Date('2023-10-27T20:15:00Z'),
    amount: 45.99,
    currency: 'EUR',
    location: 'Restaurant Q',
    description: 'Dinner with friends',
    categories: ['food', 'social', 'dining out'],
    labels: ['discretionary', 'leisure']
  },
  {
    id: 'q7w8e9r1-t2y3-u4i5-o6p7-a8s9d0f1g2h3',
    createdAt: new Date('2023-11-01T09:30:00Z'),
    transactionDate: new Date('2023-10-30T16:00:00Z'),
    amount: 10.00,
    currency: 'USD',
    location: 'Bookstore R',
    description: 'Bookmark',
    categories: [], // Empty categories
    labels: [] // Empty labels
  }
];

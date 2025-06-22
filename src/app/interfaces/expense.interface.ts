export interface Expense {
  id: string; // uuid
  createdAt: Date;
  transactionDate: Date;
  amount: number;
  // currency: string;
  location: string;
  description: string;
  categories: string[];
  labels: string[];
}

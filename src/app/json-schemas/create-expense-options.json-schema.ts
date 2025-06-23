export const CreateExpenseOptionsJsonSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Expenses",
  "description": "An array of expenses",
  "type": "array",
  "items": {
    "type": "object",
    "title": "Expense",
    "description": "A single expense record",
    "required": [
      "transactionDate",
      "amount",
      //"currency",
      //"location",
      "description",
      //"categories",
      //"labels"
    ],
    "properties": {
      "transactionDate": {
        "type": "string",
        "description": "The date and time of the financial transaction",
        "format": "date-time"
      },
      "amount": {"type": "number", "description": "The monetary value of the expense"},
      //"currency": {"type": "string", "description": "The currency of the amount"},
      //"location": { "type": "string", "description": "The location where the expense occurred" },
      "description": {"type": "string", "description": "A brief description of the expense"},
      //"categories": { "type": "array", "description": "A list of categories for the expense", "items": { "type": "string" } },
      //"labels": { "type": "array", "description": "A list of labels for the expense", "items": { "type": "string" } }
    }
  }
};

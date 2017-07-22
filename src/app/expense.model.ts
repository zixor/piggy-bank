export interface Expense {
    id?: string;
    date: string;
    amount: number;
    category: string;
    description: string;
    image?: string;
    incoming: false;
}
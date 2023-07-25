import { String } from "typescript-string-operations";

export class Account {
  private _balance: number = 0;
  private _transactions: Transaction[] = [];

  get balance(): number {
    return this._balance;
  }

  get transactions(): Transaction[] {
    return this._transactions;
  }

  deposit(amount: number, date: Date) {
    if (amount > 0) {
      this._balance += amount;
      this.transactions.push(new Transaction(amount, date));
      return "The money has been added to your account.";
    }
    return "Given amount is invalid.";
  }

  withdraw(amount: number, date: Date) {
    if (amount > 0) {
      if (amount <= this._balance) {
        this._balance -= amount;
        this.transactions.push(new Transaction(-1 * amount, date));
        return "The money has been withdrawn from your account.";
      }
      return "You don't have enough money.";
    }
    return "Given amount is invalid.";
  }

  generateBankStatement() {
    let result = `date       || credit  || debit  || balance`;
    let rows: string[] = [];

    let balance = 0;

    this._transactions.forEach((transaction) => {
      balance += transaction.amount;
      if (transaction.amount > 0) {
        rows.push(
          `\n${transaction.date.toLocaleDateString(
            "en-GB"
          )} || ${transaction.amount.toFixed(2)} ||        || ${balance.toFixed(
            2
          )}`
        );
      } else {
        rows.push(
          `\n${transaction.date.toLocaleDateString("en-GB")} ||         || ${(
            -1 * transaction.amount
          ).toFixed(2)} || ${balance.toFixed(2)}`
        );
      }
    });
    rows.reverse().forEach((row) => {
      result += row;
    });

    return result;
  }
}

export class Transaction {
  constructor(private _amount: number, private _date: Date) {}

  get amount(): number {
    return this._amount;
  }

  get date(): Date {
    return this._date;
  }
}

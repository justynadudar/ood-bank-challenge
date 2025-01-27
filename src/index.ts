import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export class Account {
  private _transactions: Transaction[] = [];
  private _canOverdraft: boolean = false;

  get transactions(): Transaction[] {
    return this._transactions;
  }

  deposit(amount: number, date: Date) {
    if (amount > 0) {
      this.transactions.push(new Transaction(amount, date));
      return "The money has been added to your account.";
    }
    return "Given amount is invalid.";
  }

  withdraw(amount: number, date: Date) {
    if (amount > 0) {
      if (
        amount <= this.getBalance() ||
        (this._canOverdraft && this.getBalance() - amount >= -500)
      ) {
        this.transactions.push(new Transaction(-1 * amount, date));
        return "The money has been withdrawn from your account.";
      }
      return "You don't have enough money.";
    }
    return "Given amount is invalid.";
  }

  generateBankStatement() {
    let result = `${"date".padEnd(15)}||  ${"credit".padEnd(
      15
    )}||  ${"debit".padEnd(15)}||  ${"balance".padEnd(15)}`;
    let rows: string[] = [];

    let balance = 0;

    this._transactions.forEach((transaction) => {
      balance += transaction.amount;
      if (transaction.amount > 0) {
        rows.push(
          `\n${transaction.date
            .toLocaleDateString("en-GB")
            .padEnd(15)}||  ${transaction.amount
            .toFixed(2)
            .padEnd(15)}||  ${"".padEnd(15)}||  ${balance
            .toFixed(2)
            .padEnd(15)}`
        );
      } else {
        rows.push(
          `\n${transaction.date
            .toLocaleDateString("en-GB")
            .padEnd(15)}||  ${"".padEnd(15)}||  ${(-1 * transaction.amount)
            .toFixed(2)
            .padEnd(15)}||  ${balance.toFixed(2).padEnd(15)}`
        );
      }
    });
    rows.reverse().forEach((row) => {
      result += row;
    });

    return result;
  }

  generateBankStatementBetween2Dates(date1: Date, date2: Date) {
    let result = `${"date".padEnd(15)}||  ${"credit".padEnd(
      15
    )}||  ${"debit".padEnd(15)}||  ${"balance".padEnd(15)}`;
    let rows: string[] = [];

    if (date2 < date1) {
      let tmp = date1;
      date1 = date2;
      date2 = tmp;
    }

    let balance = 0;

    this._transactions.forEach((transaction) => {
      balance += transaction.amount;
      if (!(transaction.date < date1) && !(transaction.date > date2)) {
        if (transaction.amount > 0) {
          rows.push(
            `\n${transaction.date
              .toLocaleDateString("en-GB")
              .padEnd(15)}||  ${transaction.amount
              .toFixed(2)
              .padEnd(15)}||  ${"".padEnd(15)}||  ${balance
              .toFixed(2)
              .padEnd(15)}`
          );
        } else {
          rows.push(
            `\n${transaction.date
              .toLocaleDateString("en-GB")
              .padEnd(15)}||  ${"".padEnd(15)}||  ${(-1 * transaction.amount)
              .toFixed(2)
              .padEnd(15)}||  ${balance.toFixed(2).padEnd(15)}`
          );
        }
      }
    });
    rows.reverse().forEach((row) => {
      result += row;
    });

    return result;
  }

  getBalance(): number {
    let balance = 0;
    this._transactions.forEach((transaction) => {
      balance += transaction.amount;
    });
    return balance;
  }

  allowOverdraft() {
    this._canOverdraft = true;
  }

  generatePDF() {
    let rowsForTable: string[][] = [];

    let balance = 0;

    this._transactions.forEach((transaction) => {
      balance += transaction.amount;
      if (transaction.amount > 0) {
        rowsForTable.push([
          transaction.date.toLocaleDateString("en-GB"),
          transaction.amount.toFixed(2),
          "",
          balance.toFixed(2),
        ]);
      } else {
        rowsForTable.push([
          transaction.date.toLocaleDateString("en-GB"),
          "",
          (-1 * transaction.amount).toFixed(2),
          balance.toFixed(2),
        ]);
      }
    });

    const doc = new jsPDF();

    autoTable(doc, {
      head: [["date", "credit", "debit", "balance"]],
      body: rowsForTable.reverse(),
    });

    doc.save("bank statement.pdf");
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

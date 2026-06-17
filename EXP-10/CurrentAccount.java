class CurrentAccount extends BankAccount {

    public CurrentAccount(String accountNumber, String accountHolderName, double balance) {
        super(accountNumber, accountHolderName, balance);
    }

    // Implement abstract method
    @Override
    double calculateInterest() {
        return getBalance() * 0.02; // 2% interest
    }
}

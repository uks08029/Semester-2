class SavingsAccount extends BankAccount {

    public SavingsAccount(String accountNumber, String accountHolderName, double balance) {
        super(accountNumber, accountHolderName, balance);
    }

    // Implement abstract method
    @Override
    double calculateInterest() {
        return getBalance() * 0.04; // 4% interest
    }
}

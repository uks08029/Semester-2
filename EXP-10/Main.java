public class Main {
    public static void main(String[] args) {

        // Create Savings Account object
        SavingsAccount savings = new SavingsAccount(
                "SA101",
                "Aaska Singh",
                10000
        );

        // Deposit money
        savings.deposit(2000);

        // Display details
        System.out.println("\nSavings Account Details:");
        savings.displayDetails();

        // Calculate interest
        System.out.println("Interest         : " + savings.calculateInterest());

        System.out.println("----------------------------------");

        // Create Current Account object
        CurrentAccount current = new CurrentAccount(
                "CA202",
                "Rahul Sharma",
                15000
        );

        // Deposit money
        current.deposit(3000);

        // Display details
        System.out.println("\nCurrent Account Details:");
        current.displayDetails();

        // Calculate interest
        System.out.println("Interest         : " + current.calculateInterest());
    }
}

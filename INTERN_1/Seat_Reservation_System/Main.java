// Displaying seating map with VIP, Regular, Economy and reserved seats.

// Booking multiple seats with price calculation.

// Canceling reservations.

// Counting available seats.

// Showing all reservations.

// Searching booking history by customer name.

// Persistent data storage in CSV files.

// Clean, menu-driven console interface.
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

// Enum for seat categories
enum Category { VIP, REGULAR, ECONOMY }

// Seat class representing each seat in the theater
class Seat {
    int row, number;
    Category category;
    boolean reserved;
    String customerName;
    LocalDateTime bookedAt;

    Seat(int row, int number, Category category) {
        this.row = row;
        this.number = number;
        this.category = category;
        this.reserved = false;
        this.customerName = "";
        this.bookedAt = null;
    }

    // Short representation of seat for display
    String shortDisplay() {
        if (reserved) return "X";
        switch (category) {
            case VIP: return "V";
            case REGULAR: return "R";
            default: return "E";
        }
    }
}

// Booking record class to store reservation history
class BookingRecord {
    String customerName;
    int row, seatNumber;
    Category category;
    double price;
    LocalDateTime timestamp;

    BookingRecord(String customerName, int row, int seatNumber, Category category, double price, LocalDateTime timestamp) {
        this.customerName = customerName;
        this.row = row;
        this.seatNumber = seatNumber;
        this.category = category;
        this.price = price;
        this.timestamp = timestamp;
    }
}

// Theater class handling seat management and bookings
class Theater {
    private Seat[][] seats;
    private int rows, cols;
    private Map<Category, Double> priceMap;
    private List<BookingRecord> history;
    private DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    Theater(int rows, int cols, Map<Category, Double> priceMap) {
        this.rows = rows;
        this.cols = cols;
        this.priceMap = priceMap;
        this.history = new ArrayList<>();
        seats = new Seat[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                Category cat = (r < Math.max(1, rows/5)) ? Category.VIP :
                               (r < Math.max(1, rows*3/5)) ? Category.REGULAR : Category.ECONOMY;
                seats[r][c] = new Seat(r + 1, c + 1, cat);
            }
        }
    }

    // Display the seating map
    void displaySeating() {
        System.out.println("\nSeating Map:");
        System.out.print("     ");
        for (int c = 0; c < cols; c++) System.out.printf(" %2d  ", c+1);
        System.out.println("\n    " + "-----".repeat(Math.max(0, cols)));
        for (int r = 0; r < rows; r++) {
            System.out.printf("R%2d |", r+1);
            for (int c = 0; c < cols; c++)
                System.out.printf(" %s   ", seats[r][c].shortDisplay());
            System.out.println("  (" + seats[r][0].category + ")");
        }
        System.out.println("Legend: V=VIP, R=Regular, E=Economy, X=Reserved");
        System.out.println("Prices: VIP=" + priceMap.get(Category.VIP) +
                           ", REGULAR=" + priceMap.get(Category.REGULAR) +
                           ", ECONOMY=" + priceMap.get(Category.ECONOMY));
    }

    // Reserve seats
    boolean reserveSeats(List<int[]> positions, String name) {
        for (int[] pos : positions) {
            if (!validPosition(pos[0], pos[1]) || seats[pos[0]-1][pos[1]-1].reserved) return false;
        }
        LocalDateTime now = LocalDateTime.now();
        for (int[] pos : positions) {
            Seat s = seats[pos[0]-1][pos[1]-1];
            s.reserved = true;
            s.customerName = name;
            s.bookedAt = now;
            history.add(new BookingRecord(name, s.row, s.number, s.category, priceMap.get(s.category), now));
        }
        return true;
    }

    // Cancel a reservation
    boolean cancelReservation(int row, int col) {
        if (!validPosition(row, col)) return false;
        Seat s = seats[row-1][col-1];
        if (!s.reserved) return false;
        s.reserved = false;
        s.customerName = "";
        s.bookedAt = null;
        return true;
    }

    // Count available seats
    int availableCount() {
        int count = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (!seats[r][c].reserved) count++;
        return count;
    }

    // Show all current reservations
    void showReservationDetails() {
        System.out.println("\nReserved Seats:");
        boolean any = false;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) {
                Seat s = seats[r][c];
                if (s.reserved) {
                    System.out.println("Row " + s.row + " Seat " + s.number + " - " + s.customerName +
                                       " - " + s.category + " - Booked at " +
                                       (s.bookedAt == null ? "-" : s.bookedAt.format(dtf)));
                    any = true;
                }
            }
        if (!any) System.out.println("No reservations yet.");
    }

    // Search booking history by customer name
    List<BookingRecord> searchByName(String name) {
        List<BookingRecord> res = new ArrayList<>();
        for (BookingRecord br : history)
            if (br.customerName.equalsIgnoreCase(name)) res.add(br);
        return res;
    }

    // Calculate total price for a list of seats
    double calculateTotalPrice(List<int[]> positions) {
        double total = 0;
        for (int[] p : positions) {
            if (validPosition(p[0], p[1])) total += priceMap.get(seats[p[0]-1][p[1]-1].category);
        }
        return total;
    }

    // Validate seat position
    private boolean validPosition(int row, int col) {
        return row >= 1 && row <= rows && col >= 1 && col <= cols;
    }

    // Save seats and history to CSV files
    void saveToFiles(String seatsFile, String historyFile) {
        try (PrintWriter pw = new PrintWriter(new FileWriter(seatsFile))) {
            pw.println("row,col,category,reserved,customerName,bookedAt");
            for (int r = 0; r < rows; r++)
                for (int c = 0; c < cols; c++) {
                    Seat s = seats[r][c];
                    String nameEsc = s.customerName.replace("\n", " ").replace(",", " ");
                    String time = s.bookedAt == null ? "" : s.bookedAt.format(dtf);
                    pw.printf("%d,%d,%s,%b,%s,%s\n", s.row, s.number, s.category, s.reserved, nameEsc, time);
                }
        } catch (IOException e) { System.out.println("Error saving seats: " + e.getMessage()); }

        try (PrintWriter pw = new PrintWriter(new FileWriter(historyFile))) {
            pw.println("customerName,row,seat,category,price,timestamp");
            for (BookingRecord br : history) {
                String nameEsc = br.customerName.replace("\n", " ").replace(",", " ");
                String ts = br.timestamp == null ? "" : br.timestamp.format(dtf);
                pw.printf("%s,%d,%d,%s,%.2f,%s\n", nameEsc, br.row, br.seatNumber, br.category, br.price, ts);
            }
        } catch (IOException e) { System.out.println("Error saving history: " + e.getMessage()); }
    }

    // Load seats and history from CSV files
    void loadFromFiles(String seatsFile, String historyFile) {
        File sf = new File(seatsFile);
        if (sf.exists()) {
            try (BufferedReader br = new BufferedReader(new FileReader(sf))) {
                br.readLine(); // skip header
                String line;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.split(",", 6);
                    if (parts.length < 6) continue;
                    int row = Integer.parseInt(parts[0]);
                    int col = Integer.parseInt(parts[1]);
                    boolean reserved = Boolean.parseBoolean(parts[3]);
                    String name = parts[4];
                    String time = parts[5];
                    if (validPosition(row, col)) {
                        Seat s = seats[row-1][col-1];
                        s.reserved = reserved;
                        s.customerName = name.equals("null") ? "" : name;
                        if (!time.isEmpty()) s.bookedAt = LocalDateTime.parse(time, dtf);
                    }
                }
            } catch (IOException e) { System.out.println("Error loading seats: " + e.getMessage()); }
        }

        File hf = new File(historyFile);
        if (hf.exists()) {
            try (BufferedReader br = new BufferedReader(new FileReader(hf))) {
                br.readLine(); // skip header
                String line;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.split(",", 6);
                    if (parts.length < 6) continue;
                    String name = parts[0];
                    int row = Integer.parseInt(parts[1]);
                    int seat = Integer.parseInt(parts[2]);
                    Category cat = Category.valueOf(parts[3]);
                    double price = Double.parseDouble(parts[4]);
                    LocalDateTime ts = parts[5].isEmpty() ? null : LocalDateTime.parse(parts[5], dtf);
                    history.add(new BookingRecord(name, row, seat, cat, price, ts));
                }
            } catch (IOException e) { System.out.println("Error loading history: " + e.getMessage()); }
        }
    }

    // Print complete booking history
    void printHistory() {
        if (history.isEmpty()) { System.out.println("No booking history yet."); return; }
        System.out.println("\nBooking History:");
        for (BookingRecord br : history) {
            System.out.println(br.customerName + " - Row " + br.row + " Seat " + br.seatNumber +
                               " - " + br.category + " - ₹" + String.format("%.2f", br.price) +
                               " - " + (br.timestamp == null ? "-" : br.timestamp.format(dtf)));
        }
    }
}

// Main class with menu-driven interface
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Map<Category, Double> priceMap = new HashMap<>();
        priceMap.put(Category.VIP, 500.0);
        priceMap.put(Category.REGULAR, 300.0);
        priceMap.put(Category.ECONOMY, 150.0);

        Theater theater = new Theater(8, 10, priceMap);
        theater.loadFromFiles("seats.csv", "history.csv");

        boolean running = true;
        while (running) {
            System.out.println("\n------- MENU -------");
            System.out.println("1. View seating map");
            System.out.println("2. Book seat(s)");
            System.out.println("3. Cancel a reservation");
            System.out.println("4. Show available seats count");
            System.out.println("5. List all reservations");
            System.out.println("6. Search bookings by customer name");
            System.out.println("7. View booking history");
            System.out.println("8. Exit");
            System.out.print("Choose an option: ");

            String input = sc.nextLine();
            int opt;
            try { opt = Integer.parseInt(input); } 
            catch (NumberFormatException e) { System.out.println("Invalid input. Enter a number 1-8."); continue; }

            switch (opt) {
                case 1 -> theater.displaySeating();
                case 2 -> {
                    try {
                        System.out.print("Enter seats to book (row-seat,row-seat,...): ");
                        String[] parts = sc.nextLine().split(",");
                        List<int[]> positions = new ArrayList<>();
                        for (String p : parts) {
                            String[] xy = p.trim().split("-");
                            if (xy.length != 2) throw new Exception("Invalid seat format");
                            positions.add(new int[]{Integer.parseInt(xy[0]), Integer.parseInt(xy[1])});
                        }
                        System.out.print("Enter customer name: ");
                        String name = sc.nextLine().trim();
                        double total = theater.calculateTotalPrice(positions);
                        if (theater.reserveSeats(positions, name)) {
                            System.out.println("Seats booked successfully!");
                            System.out.println("Total price: ₹" + String.format("%.2f", total));
                            theater.saveToFiles("seats.csv", "history.csv");
                            theater.displaySeating();
                        } else System.out.println("Failed to book seats. They might be reserved or invalid.");
                    } catch (Exception e) { System.out.println("Error: " + e.getMessage()); }
                }
                case 3 -> {
                    try {
                        System.out.print("Enter row to cancel: ");
                        int row = Integer.parseInt(sc.nextLine());
                        System.out.print("Enter seat number to cancel: ");
                        int col = Integer.parseInt(sc.nextLine());
                        if (theater.cancelReservation(row, col)) {
                            System.out.println("Reservation cancelled successfully.");
                            theater.saveToFiles("seats.csv", "history.csv");
                            theater.displaySeating();
                        } else System.out.println("Failed to cancel reservation. Seat might be empty or invalid.");
                    } catch (Exception e) { System.out.println("Invalid input."); }
                }
                case 4 -> System.out.println("Available seats count: " + theater.availableCount());
                case 5 -> theater.showReservationDetails();
                case 6 -> {
                    System.out.print("Enter customer name to search: ");
                    String searchName = sc.nextLine().trim();
                    List<BookingRecord> results = theater.searchByName(searchName);
                    if (results.isEmpty()) System.out.println("No bookings found for " + searchName);
                    else for (BookingRecord br : results)
                        System.out.println(br.customerName + " - Row " + br.row + " Seat " + br.seatNumber +
                                           " - " + br.category + " - ₹" + String.format("%.2f", br.price) +
                                           " - " + (br.timestamp == null ? "-" : br.timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
                }
                case 7 -> theater.printHistory();
                case 8 -> { running = false; System.out.println("Exiting..."); }
                default -> System.out.println("Invalid option. Try again.");
            }
        }
        sc.close();
    }
}
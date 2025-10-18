import java.io.*;
import java.util.*;
import java.util.regex.*;

// Student class
class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String name;
    private int age;
    private String studentClass;
    private String department;
    private double gpa;
    private String contact;

    public Student(int id, String name, int age, String studentClass, String department, double gpa, String contact) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.studentClass = studentClass;
        this.department = department;
        this.gpa = gpa;
        this.contact = contact;
    }

    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getStudentClass() { return studentClass; }
    public String getDepartment() { return department; }
    public double getGpa() { return gpa; }
    public String getContact() { return contact; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }
    public void setStudentClass(String studentClass) { this.studentClass = studentClass; }
    public void setDepartment(String department) { this.department = department; }
    public void setGpa(double gpa) { this.gpa = gpa; }
    public void setContact(String contact) { this.contact = contact; }

    @Override
    public String toString() {
        return String.format("%-5d %-15s %-5d %-10s %-10s %-5.2f %-15s",
                id, name, age, studentClass, department, gpa, contact);
    }

    public String toCSV() {
        return id + "," + name + "," + age + "," + studentClass + "," + department + "," + gpa + "," + contact;
    }
}

//  Main class name changed to match file name "sis.java"
public class sis {
    private static List<Student> students = new ArrayList<>();
    private static final String FILE_NAME = "students.csv";
    private static final Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        loadStudents();
        int choice;
        do {
            System.out.println("\n===== STUDENT INFORMATION SYSTEM =====");
            System.out.println("1. Add Student");
            System.out.println("2. View All Students");
            System.out.println("3. Search Student");
            System.out.println("4. Update Student");
            System.out.println("5. Delete Student");
            System.out.println("6. Sort Students");
            System.out.println("0. Exit");
            System.out.print("Enter your choice: ");

            while (!sc.hasNextInt()) {
                System.out.print("Invalid input! Enter a number: ");
                sc.next();
            }
            choice = sc.nextInt();
            sc.nextLine(); // consume newline

            switch (choice) {
                case 1 -> addStudent();
                case 2 -> viewStudents();
                case 3 -> searchStudent();
                case 4 -> updateStudent();
                case 5 -> deleteStudent();
                case 6 -> sortStudents();
                case 0 -> {
                    saveStudents();
                    System.out.println(" Data saved successfully! Exiting... Goodbye!");
                }
                default -> System.out.println("Invalid choice! Try again.");
            }
        } while (choice != 0);
    }

    private static void addStudent() {
        System.out.print("Enter Student ID: ");
        int id = sc.nextInt();
        sc.nextLine();
        if (findStudentById(id) != null) {
            System.out.println("Student ID already exists!");
            return;
        }

        System.out.print("Enter Name: ");
        String name = sc.nextLine();

        System.out.print("Enter Age: ");
        int age = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Class: ");
        String studentClass = sc.nextLine();

        String department;
        while (true) {
            System.out.print("Enter Department (letters only): ");
            department = sc.nextLine();
            if (department.matches("[a-zA-Z]+")) break;
            System.out.println(" Invalid department! Only letters are allowed.");
        }

        System.out.print("Enter GPA: ");
        double gpa = sc.nextDouble();
        sc.nextLine();

        String contact;
        while (true) {
            System.out.print("Enter 10-digit Contact Number: ");
            contact = sc.nextLine();
            if (contact.matches("\\d{10}")) break;
            System.out.println(" Invalid number! Must be exactly 10 digits.");
        }

        students.add(new Student(id, name, age, studentClass, department, gpa, contact));
        System.out.println(" Student added successfully!");
    }

    private static void viewStudents() {
        if (students.isEmpty()) {
            System.out.println("No students found!");
            return;
        }
        System.out.printf("%-5s %-15s %-5s %-10s %-10s %-5s %-15s\n",
                "ID", "Name", "Age", "Class", "Dept", "GPA", "Contact");
        System.out.println("----------------------------------------------------------------------");
        for (Student s : students) {
            System.out.println(s);
        }
    }

    private static void searchStudent() {
        System.out.print("Enter Student ID to search: ");
        int id = sc.nextInt();
        sc.nextLine();
        Student s = findStudentById(id);
        if (s != null) {
            System.out.printf("%-5s %-15s %-5s %-10s %-10s %-5s %-15s\n",
                    "ID", "Name", "Age", "Class", "Dept", "GPA", "Contact");
            System.out.println("----------------------------------------------------------------------");
            System.out.println(s);
        } else {
            System.out.println("Student not found!");
        }
    }

    private static void updateStudent() {
        System.out.print("Enter Student ID to update: ");
        int id = sc.nextInt();
        sc.nextLine();
        Student s = findStudentById(id);
        if (s == null) {
            System.out.println("Student not found!");
            return;
        }

        System.out.print("Enter new Name (" + s.getName() + "): ");
        String name = sc.nextLine();

        System.out.print("Enter new Age (" + s.getAge() + "): ");
        int age = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter new Class (" + s.getStudentClass() + "): ");
        String studentClass = sc.nextLine();

        String department;
        while (true) {
            System.out.print("Enter new Department (" + s.getDepartment() + "): ");
            department = sc.nextLine();
            if (department.matches("[a-zA-Z]+")) break;
            System.out.println(" Invalid department! Only letters are allowed.");
        }

        System.out.print("Enter new GPA (" + s.getGpa() + "): ");
        double gpa = sc.nextDouble();
        sc.nextLine();

        String contact;
        while (true) {
            System.out.print("Enter new 10-digit Contact (" + s.getContact() + "): ");
            contact = sc.nextLine();
            if (contact.matches("\\d{10}")) break;
            System.out.println(" Invalid number! Must be exactly 10 digits.");
        }

        s.setName(name);
        s.setAge(age);
        s.setStudentClass(studentClass);
        s.setDepartment(department);
        s.setGpa(gpa);
        s.setContact(contact);

        System.out.println(" Student updated successfully!");
    }

    private static void deleteStudent() {
        System.out.print("Enter Student ID to delete: ");
        int id = sc.nextInt();
        sc.nextLine();
        Student s = findStudentById(id);
        if (s == null) {
            System.out.println("Student not found!");
            return;
        }
        students.remove(s);
        System.out.println(" Student deleted successfully!");
    }

    private static void sortStudents() {
        System.out.println("1. Sort by Name");
        System.out.println("2. Sort by GPA");
        System.out.println("3. Sort by Class");
        System.out.print("Choose sorting option: ");
        int option = sc.nextInt();
        sc.nextLine();

        switch (option) {
            case 1 -> students.sort(Comparator.comparing(Student::getName));
            case 2 -> students.sort(Comparator.comparingDouble(Student::getGpa).reversed());
            case 3 -> students.sort(Comparator.comparing(Student::getStudentClass));
            default -> {
                System.out.println("Invalid option!");
                return;
            }
        }
        System.out.println(" Students sorted successfully!");
        viewStudents();
    }

    private static Student findStudentById(int id) {
        for (Student s : students) {
            if (s.getId() == id) return s;
        }
        return null;
    }

    private static void saveStudents() {
        try (PrintWriter pw = new PrintWriter(new FileWriter(FILE_NAME))) {
            pw.println("ID,Name,Age,Class,Department,GPA,Contact");
            for (Student s : students) {
                pw.println(s.toCSV());
            }
        } catch (IOException e) {
            System.out.println(" Error saving data: " + e.getMessage());
        }
    }

    private static void loadStudents() {
        File file = new File(FILE_NAME);
        if (!file.exists()) return;

        try (BufferedReader br = new BufferedReader(new FileReader(FILE_NAME))) {
            br.readLine(); // skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length == 7) {
                    students.add(new Student(
                            Integer.parseInt(data[0]),
                            data[1],
                            Integer.parseInt(data[2]),
                            data[3],
                            data[4],
                            Double.parseDouble(data[5]),
                            data[6]
                    ));
                }
            }
            System.out.println(" Data loaded successfully!");
        } catch (IOException e) {
            System.out.println(" Error loading data: " + e.getMessage());
        }
    }
}

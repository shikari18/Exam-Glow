import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const csSubject: Subject = {
  id: "computer-science-0478",
  name: "Computer Science",
  code: "0478",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Computer Science – Cambridge IGCSE (0478)",
};

const csObjectives: SyllabusObjective[] = [
  {
    id: "cs-1", subjectId: "computer-science-0478", code: "1",
    title: "Data Representation", description: "Number systems, text, sound, images, compression, and encryption", order: 1,
    subObjectives: [
      { id: "cs-1-1", subjectId: "computer-science-0478", code: "1.1", title: "Number Systems", description: "Convert between binary, denary, and hexadecimal; binary addition and logical shifts", order: 1, parentId: "cs-1" },
      { id: "cs-1-2", subjectId: "computer-science-0478", code: "1.2", title: "Text, Sound and Images", description: "How characters, sound waves, and bitmap images are represented digitally", order: 2, parentId: "cs-1" },
      { id: "cs-1-3", subjectId: "computer-science-0478", code: "1.3", title: "Data Compression", description: "Lossy vs lossless compression and their application to files", order: 3, parentId: "cs-1" },
      { id: "cs-1-4", subjectId: "computer-science-0478", code: "1.4", title: "Encryption", description: "Symmetric and asymmetric encryption; ciphertext, plaintext, and keys", order: 4, parentId: "cs-1" },
    ],
  },
  {
    id: "cs-2", subjectId: "computer-science-0478", code: "2",
    title: "Data Transmission", description: "Methods of data transmission, packets, error detection, and protocols", order: 2,
    subObjectives: [
      { id: "cs-2-1", subjectId: "computer-science-0478", code: "2.1", title: "Types of Transmission", description: "Serial and parallel; simplex, half-duplex, and full-duplex transmission", order: 1, parentId: "cs-2" },
      { id: "cs-2-2", subjectId: "computer-science-0478", code: "2.2", title: "Packet Switching", description: "Structure of a packet and the process of packet switching", order: 2, parentId: "cs-2" },
      { id: "cs-2-3", subjectId: "computer-science-0478", code: "2.3", title: "Error Detection", description: "Parity checks, checksums, check digits, and ARQ", order: 3, parentId: "cs-2" },
    ],
  },
  {
    id: "cs-3", subjectId: "computer-science-0478", code: "3",
    title: "Hardware", description: "CPU architecture, memory, storage, and devices", order: 3,
    subObjectives: [
      { id: "cs-3-1", subjectId: "computer-science-0478", code: "3.1", title: "CPU Architecture", description: "Von Neumann architecture, ALU, CU, registers, buses, and fetch-decode-execute cycle", order: 1, parentId: "cs-3" },
      { id: "cs-3-2", subjectId: "computer-science-0478", code: "3.2", title: "Input and Output Devices", description: "Operation of common input/output devices (sensors, printers, screens)", order: 2, parentId: "cs-3" },
      { id: "cs-3-3", subjectId: "computer-science-0478", code: "3.3", title: "Storage and Memory", description: "RAM, ROM, and primary/secondary/virtual storage media (HDD, SSD, Optical)", order: 3, parentId: "cs-3" },
      { id: "cs-3-4", subjectId: "computer-science-0478", code: "3.4", title: "Network Hardware", description: "Routers, switches, NICs, and transmission media", order: 4, parentId: "cs-3" },
    ],
  },
  {
    id: "cs-4", subjectId: "computer-science-0478", code: "4",
    title: "Software", description: "Operating systems, application software, and translators", order: 4,
    subObjectives: [
      { id: "cs-4-1", subjectId: "computer-science-0478", code: "4.1", title: "Operating Systems", description: "Functions of an OS: process, memory, file, and device management; user interfaces", order: 1, parentId: "cs-4" },
      { id: "cs-4-2", subjectId: "computer-science-0478", code: "4.2", title: "Types of Software", description: "System software vs application software and their utilities", order: 2, parentId: "cs-4" },
      { id: "cs-4-3", subjectId: "computer-science-0478", code: "4.3", title: "Translators", description: "Compilers, interpreters, and assemblers; high-level vs low-level languages", order: 3, parentId: "cs-4" },
    ],
  },
  {
    id: "cs-5", subjectId: "computer-science-0478", code: "5",
    title: "The Internet and Its Uses", description: "Web technologies, cybersecurity, and digital ethics", order: 5,
    subObjectives: [
      { id: "cs-5-1", subjectId: "computer-science-0478", code: "5.1", title: "Web Technologies", description: "Internet vs WWW; URL, HTTP/HTTPS, IP and MAC addresses, DNS, and web browsers", order: 1, parentId: "cs-5" },
      { id: "cs-5-2", subjectId: "computer-science-0478", code: "5.2", title: "Cybersecurity Threats and Firewalls", description: "Phishing, malware, hacking, DDoS; firewalls, proxy servers, and two-factor authentication", order: 2, parentId: "cs-5" },
      { id: "cs-5-3", subjectId: "computer-science-0478", code: "5.3", title: "Ethics and Technology", description: "Intellectual property, copyright, plagiarism, digital currency, and environmental impacts", order: 3, parentId: "cs-5" },
    ],
  },
  {
    id: "cs-6", subjectId: "computer-science-0478", code: "6",
    title: "Automated and Emerging Technologies", description: "Sensors, robotics, and artificial intelligence", order: 6,
    subObjectives: [
      { id: "cs-6-1", subjectId: "computer-science-0478", code: "6.1", title: "Automated Systems", description: "Sensors, actuators, and microprocessor feedback control loops", order: 1, parentId: "cs-6" },
      { id: "cs-6-2", subjectId: "computer-science-0478", code: "6.2", title: "Robotics and AI", description: "Characteristics and applications of robots; machine learning and expert systems", order: 2, parentId: "cs-6" },
    ],
  },
  {
    id: "cs-7", subjectId: "computer-science-0478", code: "7",
    title: "Algorithm Design and Problem-Solving", description: "Computational thinking, flowcharts, pseudocode, and trace tables", order: 7,
    subObjectives: [
      { id: "cs-7-1", subjectId: "computer-science-0478", code: "7.1", title: "Computational Thinking", description: "Decomposition, abstraction, pattern recognition, and algorithm design", order: 1, parentId: "cs-7" },
      { id: "cs-7-2", subjectId: "computer-science-0478", code: "7.2", title: "Flowcharts and Pseudocode", description: "Design algorithms using flowcharts and pseudocode with standard loops/selection", order: 2, parentId: "cs-7" },
      { id: "cs-7-3", subjectId: "computer-science-0478", code: "7.3", title: "Trace Tables and Search/Sort", description: "Dry run algorithms with trace tables; linear search, bubble sort, and insertion sort", order: 3, parentId: "cs-7" },
    ],
  },
  {
    id: "cs-8", subjectId: "computer-science-0478", code: "8",
    title: "Programming", description: "Variables, control structures, arrays, and procedures/functions", order: 8,
    subObjectives: [
      { id: "cs-8-1", subjectId: "computer-science-0478", code: "8.1", title: "Programming Concepts", description: "Data types, variables, constants, arithmetic/logical/relational operators", order: 1, parentId: "cs-8" },
      { id: "cs-8-2", subjectId: "computer-science-0478", code: "8.2", title: "Control Structures and Arrays", description: "Sequence, selection (IF/CASE), iteration (FOR/WHILE/REPEAT); 1D and 2D arrays", order: 2, parentId: "cs-8" },
      { id: "cs-8-3", subjectId: "computer-science-0478", code: "8.3", title: "Subroutines and File Handling", description: "Procedures, functions, parameters, local/global scope; reading/writing text files", order: 3, parentId: "cs-8" },
    ],
  },
  {
    id: "cs-9", subjectId: "computer-science-0478", code: "9",
    title: "Databases", description: "Database concepts and SQL querying", order: 9,
    subObjectives: [
      { id: "cs-9-1", subjectId: "computer-science-0478", code: "9.1", title: "Database Concepts", description: "Tables, fields, records, primary/foreign keys, and data validation/verification", order: 1, parentId: "cs-9" },
      { id: "cs-9-2", subjectId: "computer-science-0478", code: "9.2", title: "SQL Queries", description: "Construct SQL statements using SELECT, FROM, WHERE, and ORDER BY", order: 2, parentId: "cs-9" },
    ],
  },
  {
    id: "cs-10", subjectId: "computer-science-0478", code: "10",
    title: "Boolean Logic", description: "Logic gates, circuits, and truth tables", order: 10,
    subObjectives: [
      { id: "cs-10-1", subjectId: "computer-science-0478", code: "10.1", title: "Logic Gates", description: "AND, OR, NOT, NAND, NOR, and XOR gates, symbols, and truth tables", order: 1, parentId: "cs-10" },
      { id: "cs-10-2", subjectId: "computer-science-0478", code: "10.2", title: "Logic Circuits", description: "Draw and represent logic circuits from boolean expressions or truth tables", order: 2, parentId: "cs-10" },
    ],
  },
];

export const cs0478Data: SyllabusData = {
  subject: csSubject,
  objectives: csObjectives,
  notes: [],
};

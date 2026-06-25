import type { NoteChapter } from "./types";

export const csDataRepresentationNotes: NoteChapter = {
  subject: "Computer Science",
  title: "Data Representation",
  pages: [
    {
      section: "1.1 Number Systems",
      blocks: [
        { kind: "video", youtubeId: "r1WV68nraoc", title: "Binary & Hex Conversions — IGCSE Computer Science (Cognito)", caption: "Full walkthrough of binary, denary, and hexadecimal conversions with worked examples" },
        { kind: "intro", text: "Computers store all data as **binary** (base-2), using only the digits 0 and 1 (bits). Understanding how to convert between **denary** (base-10), **binary** (base-2), and **hexadecimal** (base-16) is one of the most heavily tested skills in IGCSE Computer Science." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/ASCII-Table-wide.svg/800px-ASCII-Table-wide.svg.png", caption: "Hexadecimal digit values 0–F mapped to denary and binary — memorise A=10 through F=15", side: "full" },
        { kind: "highlight", text: "**Place values for an 8-bit binary number:**\n128 | 64 | 32 | 16 | 8 | 4 | 2 | 1\n\nExample: 10110011₂ = 128+32+16+2+1 = **179₁₀**", color: "blue" },
        { kind: "table", headers: ["Denary", "Binary (8-bit)", "Hexadecimal"], rows: [
          ["0", "0000 0000", "00"],
          ["10", "0000 1010", "0A"],
          ["15", "0000 1111", "0F"],
          ["16", "0001 0000", "10"],
          ["179", "1011 0011", "B3"],
          ["255", "1111 1111", "FF"],
        ]},
        { kind: "keyterms", terms: [
          { label: "Bit", value: "The smallest unit of data — a single binary digit, either 0 or 1." },
          { label: "Byte", value: "A group of 8 bits. Can represent values 0–255." },
          { label: "Nibble", value: "4 bits. Represents one hexadecimal digit (0–F)." },
          { label: "Binary (base-2)", value: "Number system using only 0 and 1. Each column is a power of 2." },
          { label: "Hexadecimal (base-16)", value: "Uses digits 0–9 and letters A–F. 1 hex digit = 4 binary bits." },
          { label: "Denary (base-10)", value: "Standard decimal system (digits 0–9)." },
        ]},
        { kind: "highlight", text: "**Hex ↔ Binary shortcut:** Group binary into nibbles of 4 from the right, convert each group.\n\nExample: 1010 1100₂ → A | C₁₆ → AC₁₆\n\nHex → Binary: replace each hex digit with its 4-bit binary equivalent.", color: "green" },
        { kind: "bullets", items: [
          { text: "**Binary addition rules:**", sub: ["0 + 0 = 0", "0 + 1 = 1", "1 + 1 = 0, carry 1", "1 + 1 + 1 = 1, carry 1"] },
          { text: "**Logical shifts:**", sub: ["Shift LEFT by 1 = multiply by 2 (add 0 on right)", "Shift RIGHT by 1 = divide by 2 (add 0 on left)", "Overflow error if shifted bits are lost beyond 8 bits"] },
        ]},
        { kind: "tip", text: "Always show working in exams. Write out place values above each bit position. For hex, write out digit values (A=10, B=11… F=15) to avoid mistakes." },
        { kind: "warning", text: "A=10, B=11, C=12, D=13, E=14, F=15 — forgetting these hex values is the #1 mistake. Memorise them before your exam." },
      ],
    },
    {
      section: "1.2 Text, Sound and Images",
      blocks: [
        { kind: "video", youtubeId: "OtByNnlPSaM", title: "How Computers Store Images, Sound & Text — Computerphile", caption: "How binary represents characters (ASCII/Unicode), pixels, and audio samples" },
        { kind: "intro", text: "All types of data — characters, audio, and images — must be converted into binary before a computer can process them. Different data types use different encoding schemes." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/ASCII_Code_Chart-Quick_ref_card.png/800px-ASCII_Code_Chart-Quick_ref_card.png", caption: "ASCII code chart — each character maps to a unique 7-bit binary code. Extended ASCII uses 8 bits for 256 characters.", side: "full" },
        { kind: "keyterms", terms: [
          { label: "ASCII", value: "American Standard Code for Information Interchange — assigns a unique 7-bit binary code to each character (128 possible characters)." },
          { label: "Unicode", value: "Extended encoding standard supporting over 1 million characters; uses 8, 16, or 32 bits per character. Supports all world languages." },
          { label: "Pixel", value: "The smallest element of a digital image. Each pixel is stored as a binary number representing its colour." },
          { label: "Bit depth (colour depth)", value: "The number of bits used to represent each pixel. More bits = more possible colours." },
          { label: "Resolution", value: "The number of pixels per unit area. Higher resolution = sharper image = larger file size." },
          { label: "Sample rate", value: "Number of audio samples taken per second (Hz). Higher = better quality = larger file." },
          { label: "Sample resolution", value: "Number of bits used per audio sample. More bits = more accurate sound." },
        ]},
        { kind: "highlight", text: "**Image file size formula:**\nFile size (bits) = width × height × colour depth\n\n**Audio file size formula:**\nFile size (bits) = sample rate × sample resolution × duration (seconds)\n\nDivide by 8 for bytes, by 1024 for KB, by 1024 again for MB.", color: "blue" },
        { kind: "comparison", left: { label: "ASCII", items: ["7-bit encoding (128 characters)", "Covers English alphabet, digits, punctuation", "Simpler and uses less memory", "Cannot represent non-Latin scripts"] }, right: { label: "Unicode", items: ["8–32 bits per character", "Covers 1 million+ characters worldwide", "Supports Chinese, Arabic, emoji, etc.", "Backwards compatible with ASCII (first 128 codes match)"] } },
        { kind: "tip", text: "For image file size: multiply width × height first to get total pixels, then multiply by colour depth in bits. Convert to bytes by dividing by 8, to kilobytes by dividing by 1024." },
      ],
    },
    {
      section: "1.3 Data Compression",
      blocks: [
        { kind: "video", youtubeId: "Lto-ajuqW3w", title: "Compression Explained — Computerphile", caption: "Lossy vs lossless compression, run-length encoding and how file compression works" },
        { kind: "intro", text: "Data compression reduces file size to save storage space and speed up transmission. There are two types: **lossless** (no data lost) and **lossy** (some data permanently removed)." },
        { kind: "comparison", left: { label: "Lossless compression", items: ["No data is lost — original file perfectly restored", "Used for text files, programs, and PNG images", "Run-length encoding (RLE) is a common technique", "File size reduction less extreme than lossy", "ZIP, PNG, GIF formats"] }, right: { label: "Lossy compression", items: ["Some data permanently discarded", "Used for audio (MP3), images (JPEG), video (MP4)", "Cannot recover original quality", "Much greater file size reduction", "Imperceptible quality loss at moderate levels"] } },
        { kind: "highlight", text: "**Run-Length Encoding (RLE) example:**\nOriginal: AAABBBBBCCDDDDDD\nEncoded:  3A 5B 2C 6D\n\nRLE works best with long runs of the same value — ideal for simple bitmap images (e.g. a mostly-white background).", color: "green" },
        { kind: "tip", text: "Always give BOTH reasons compression is needed: (1) to reduce storage space used; (2) to reduce time taken to transmit data. One reason = 1 mark, both = 2 marks." },
      ],
    },
    {
      section: "1.4 Encryption",
      blocks: [
        { kind: "video", youtubeId: "AQDCe585Lnc", title: "Asymmetric Encryption — Computerphile", caption: "How public and private keys work in asymmetric encryption — RSA explained simply" },
        { kind: "intro", text: "Encryption converts **plaintext** into **ciphertext** using a key so that unauthorised users cannot read the data even if they intercept it." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Public_key_encryption_keys.svg/800px-Public_key_encryption_keys.svg.png", caption: "Asymmetric encryption: Alice encrypts using Bob's public key. Only Bob's private key can decrypt — keeping messages secure even on public networks.", side: "full" },
        { kind: "keyterms", terms: [
          { label: "Plaintext", value: "The original, readable data before encryption." },
          { label: "Ciphertext", value: "The scrambled, unreadable output after encryption." },
          { label: "Key", value: "A value used by an algorithm to encrypt or decrypt data." },
          { label: "Symmetric encryption", value: "The same key encrypts and decrypts (e.g. Caesar cipher). Faster but key must be shared securely." },
          { label: "Asymmetric encryption", value: "Uses two keys — public key encrypts, private key decrypts. More secure for internet communications (HTTPS)." },
        ]},
        { kind: "comparison", left: { label: "Symmetric encryption", items: ["Same key encrypts and decrypts", "Faster processing", "Key must be transmitted securely — creates vulnerability", "Used for bulk data encryption (e.g. AES)"] }, right: { label: "Asymmetric encryption", items: ["Public key encrypts; private key decrypts", "Slower but more secure for key exchange", "Public key can be freely shared — no security risk", "Used in HTTPS, digital signatures, email security"] } },
        { kind: "tip", text: "Remember: the public key is shared openly; the private key is NEVER shared. If Alice sends a message to Bob encrypted with Bob's public key, ONLY Bob's private key can decrypt it." },
      ],
    },
  ],
};

export const csDataTransmissionNotes: NoteChapter = {
  subject: "Computer Science",
  title: "Data Transmission",
  pages: [
    {
      section: "2.1 Types of Transmission",
      blocks: [
        { kind: "video", youtubeId: "Dxcc6ycZ73M", title: "Serial vs Parallel Transmission — IGCSE Computer Science", caption: "Simplex, half-duplex, full-duplex, serial and parallel data transmission explained" },
        { kind: "intro", text: "Data transmission refers to how binary data moves between devices. The method affects speed, reliability, and cost." },
        { kind: "comparison", left: { label: "Serial transmission", items: ["Bits sent one at a time along a single wire", "Slower but more reliable over long distances", "No synchronisation problems", "Used for USB, Ethernet, telephone modems"] }, right: { label: "Parallel transmission", items: ["Multiple bits sent simultaneously across multiple wires", "Faster over short distances", "Timing skew at long distances — bits arrive out of sync", "Used internally in CPUs, older printer connections"] } },
        { kind: "table", headers: ["Mode", "Direction", "Example"], rows: [
          ["Simplex", "One direction only", "TV broadcast, keyboard to computer"],
          ["Half-duplex", "Both directions, not at the same time", "Walkie-talkie, HTTP request/response"],
          ["Full-duplex", "Both directions simultaneously", "Telephone call, video conference"],
        ]},
        { kind: "tip", text: "Serial is preferred for long-distance; parallel for short-distance (e.g. inside a computer). State the mode AND give a real-world example to earn full marks." },
      ],
    },
    {
      section: "2.2 Packet Switching",
      blocks: [
        { kind: "video", youtubeId: "AkxqkoxErRk", title: "Packet Switching Explained — How the Internet Works", caption: "How data is broken into packets, routed across networks, and reassembled at the destination" },
        { kind: "intro", text: "Large files are broken into small units called **packets** before being sent across a network. Each packet travels independently and may take a different route. They are reassembled at the destination." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Packet_Switching.gif/400px-Packet_Switching.gif", caption: "Packet switching: packets take different routes through the network, then are reassembled in order at the destination using packet sequence numbers.", side: "full" },
        { kind: "keyterms", terms: [
          { label: "Packet", value: "A small unit of data that includes payload (data), header (source IP, destination IP, packet number, protocol), and trailer (error checking)." },
          { label: "Packet switching", value: "Data is broken into packets routed independently across the network and reassembled at the destination." },
          { label: "Router", value: "A network device that forwards packets between networks using IP addresses, selecting the best route for each packet." },
        ]},
        { kind: "bullets", items: [
          { text: "**A packet header contains:**", sub: ["Source IP address", "Destination IP address", "Packet sequence number (for reassembly)", "Total number of packets", "Protocol (e.g. TCP/IP)"] },
        ]},
        { kind: "highlight", text: "**Why packet switching?**\n• Efficient — multiple packets share the same network links simultaneously\n• Resilient — if one route fails, packets find another route\n• No dedicated line needed — more cost effective than circuit switching\n• Packets can arrive out of order and are reassembled using sequence numbers", color: "blue" },
      ],
    },
    {
      section: "2.3 Error Detection",
      blocks: [
        { kind: "video", youtubeId: "PPGd9hy1PtY", title: "Error Detection Methods — IGCSE Computer Science (Parity, Checksum)", caption: "Parity checks, checksums, check digits and ARQ for detecting transmission errors" },
        { kind: "intro", text: "Data can be corrupted during transmission. Error detection methods allow the receiver to identify (and sometimes request correction of) errors." },
        { kind: "table", headers: ["Method", "How it works", "Detects"], rows: [
          ["Parity check", "Extra parity bit added to make total number of 1s even or odd", "Single-bit errors only"],
          ["Checksum", "Mathematical calculation on data; result sent with data and recalculated at receiver", "Multiple-bit errors"],
          ["Check digit", "Extra digit added to identification numbers, calculated from other digits (e.g. ISBN, barcode)", "Transcription and transposition errors"],
          ["ARQ (Automatic Repeat reQuest)", "If error detected, receiver requests sender to retransmit the data", "Any error — triggers retransmission"],
        ]},
        { kind: "tip", text: "Parity only DETECTS errors — it cannot correct them. For 2-bit errors, parity fails (even number of flips still passes the check). ARQ is the only method here that requests retransmission automatically." },
      ],
    },
  ],
};

export const csHardwareNotes: NoteChapter = {
  subject: "Computer Science",
  title: "Hardware",
  pages: [
    {
      section: "3.1 CPU Architecture",
      blocks: [
        { kind: "video", youtubeId: "TIHW5hEoaAw", title: "CPU Architecture & Fetch-Decode-Execute — IGCSE CS (Cognito)", caption: "Von Neumann architecture, registers, buses and the FDE cycle explained with diagrams" },
        { kind: "intro", text: "The **Central Processing Unit (CPU)** is the brain of the computer. It follows the **Von Neumann architecture** — instructions and data share the same memory (RAM) and are processed sequentially." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Von_Neumann_Architecture.svg/800px-Von_Neumann_Architecture.svg.png", caption: "Von Neumann Architecture: CPU (ALU + CU + Registers) connected to shared memory via buses. Instructions and data use the same memory — a key feature of this design.", side: "full" },
        { kind: "keyterms", terms: [
          { label: "ALU (Arithmetic Logic Unit)", value: "Performs arithmetic operations (+, −, ×, ÷) and logical comparisons (AND, OR, NOT)." },
          { label: "Control Unit (CU)", value: "Coordinates all CPU operations; manages the FDE cycle and sends control signals." },
          { label: "PC (Program Counter)", value: "Holds the memory address of the NEXT instruction to be fetched. Increments after each fetch." },
          { label: "MAR (Memory Address Register)", value: "Holds the address in memory being read from or written to." },
          { label: "MDR (Memory Data Register)", value: "Temporarily holds data just fetched from or about to be written to memory." },
          { label: "CIR (Current Instruction Register)", value: "Holds the instruction currently being decoded and executed." },
          { label: "ACC (Accumulator)", value: "Stores the result of arithmetic and logic operations." },
        ]},
        { kind: "highlight", text: "**Fetch-Decode-Execute Cycle:**\n1. **Fetch:** Address in PC → MAR → instruction fetched to MDR → copied to CIR → PC incremented\n2. **Decode:** Control Unit decodes the instruction in CIR\n3. **Execute:** ALU calculates / data written / branch taken", color: "blue" },
        { kind: "comparison", left: { label: "Factors increasing CPU performance", items: ["Higher clock speed (GHz) — more cycles/second", "More cores — parallel instruction processing", "Larger cache — more data at CPU speed", "Wider bus width — more data transferred per cycle"] }, right: { label: "Bus types", items: ["Data bus — carries data (bidirectional)", "Address bus — carries memory addresses (unidirectional, CPU → memory)", "Control bus — carries control signals (bidirectional)", "Bus width = number of parallel wires = bits per transfer"] } },
        { kind: "tip", text: "The most common exam question: 'Explain the fetch-decode-execute cycle.' Use register names — PC, MAR, MDR, CIR — describing exactly what happens at each stage. Missing register names = lost marks." },
      ],
    },
    {
      section: "3.2 Input and Output Devices",
      blocks: [
        { kind: "video", youtubeId: "DuoyMB142mQ", title: "Input & Output Devices — IGCSE Computer Science", caption: "How keyboards, mice, cameras, touchscreens, printers, and sensors work at a technical level" },
        { kind: "intro", text: "Input devices send data **into** the computer. Output devices send data **out** of the computer. Some devices (e.g. touchscreen) do both." },
        { kind: "table", headers: ["Device", "Type", "How it works"], rows: [
          ["Keyboard", "Input", "Each key sends a unique ASCII/Unicode code to the CPU"],
          ["Mouse", "Input", "Tracks movement and button clicks; sends coordinates and signals"],
          ["Microphone", "Input", "Converts sound waves → electrical signal → ADC converts to digital samples"],
          ["Camera/Scanner", "Input", "CCD sensors capture light intensity per pixel → binary image data"],
          ["Barcode reader", "Input", "Laser reflects off dark/light bars → interprets binary pattern"],
          ["Touch screen", "Input/Output", "Capacitive layer detects finger position; LCD shows output simultaneously"],
          ["Monitor (LCD)", "Output", "Each pixel controlled by liquid crystals; backlit by LEDs"],
          ["Inkjet printer", "Output", "Tiny ink droplets fired at paper through microscopic nozzles"],
          ["Laser printer", "Output", "Toner powder attracted to charged drum → fused to paper by heat"],
          ["Speaker", "Output", "DAC converts digital audio → electrical signal → vibrates cone → sound"],
          ["Actuator", "Output", "Converts electrical control signal into physical movement (motor, servo)"],
        ]},
        { kind: "tip", text: "For sensor/actuator control loop questions: name the sensor → state what it measures → describe how the microprocessor processes the signal → state what the actuator does in response." },
      ],
    },
    {
      section: "3.3 Storage and Memory",
      blocks: [
        { kind: "video", youtubeId: "TkqG_NXt8hk", title: "Storage Devices Explained — HDD, SSD, Optical — IGCSE CS", caption: "RAM vs ROM, primary vs secondary storage, HDD vs SSD vs optical — how each works and when to use each" },
        { kind: "intro", text: "Computers use different types of memory and storage for different purposes. Understanding their properties — speed, capacity, persistence, and cost — is essential." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Storage_pyramid.svg/600px-Storage_pyramid.svg.png", caption: "Storage hierarchy: speed decreases and capacity increases as you move down. Cache is fastest and smallest; magnetic tape is slowest and largest.", side: "right" },
        { kind: "comparison", left: { label: "Primary storage (RAM & ROM)", items: ["Directly accessible by the CPU", "RAM: volatile; stores current programs and data", "ROM: non-volatile; stores firmware/boot instructions permanently", "Very fast; expensive per GB"] }, right: { label: "Secondary storage", items: ["Not directly accessible — must be loaded into RAM first", "Non-volatile — retains data without power", "HDD: magnetic, moving parts, large capacity, cheaper, slower", "SSD: flash memory, no moving parts, faster, more expensive", "Optical (DVD/CD): laser reads pits and lands — slow, portable"] } },
        { kind: "table", headers: ["Type", "Volatile?", "Speed", "Capacity", "Cost per GB"], rows: [
          ["Cache", "Yes", "Fastest", "Very small (KB–MB)", "Most expensive"],
          ["RAM", "Yes", "Very fast", "Medium (4–64 GB)", "High"],
          ["ROM", "No", "Fast", "Very small", "Medium"],
          ["SSD", "No", "Fast", "Large (256 GB–4 TB)", "Medium"],
          ["HDD", "No", "Slow", "Very large (1–20 TB)", "Low"],
          ["Optical", "No", "Slowest", "Small (700 MB–100 GB)", "Very low"],
        ]},
        { kind: "highlight", text: "**Virtual memory:** When RAM is full, the OS uses part of the HDD/SSD as temporary RAM (swap space). This is much slower than real RAM and causes performance slowdowns called 'thrashing'.", color: "yellow" },
      ],
    },
    {
      section: "3.4 Network Hardware",
      blocks: [
        { kind: "video", youtubeId: "Mad4kgrBykI", title: "Network Devices Explained — Router, Switch, Hub, NIC — IGCSE CS", caption: "How routers, switches, hubs, NICs, and WAPs work and their roles in a network" },
        { kind: "intro", text: "Network hardware connects devices together and manages how data flows between them." },
        { kind: "table", headers: ["Device", "Function"], rows: [
          ["Router", "Connects different networks (LAN to internet); routes packets using IP addresses"],
          ["Switch", "Connects devices within a LAN; sends data only to the destination device (MAC addresses)"],
          ["Hub", "Broadcasts data to ALL connected devices — inefficient and creates security issues (deprecated)"],
          ["NIC (Network Interface Card)", "Hardware that connects a device to a network; every NIC has a unique MAC address"],
          ["WAP (Wireless Access Point)", "Provides Wi-Fi connectivity; connects wireless devices to a wired network"],
          ["Modem", "Converts digital signals to analogue (and back) for transmission over telephone lines"],
        ]},
        { kind: "comparison", left: { label: "Wired (Ethernet)", items: ["Uses copper or fibre optic cables", "Faster and more reliable speeds", "Not affected by interference", "Better for fixed devices (desktops, servers)"] }, right: { label: "Wireless (Wi-Fi)", items: ["Uses radio waves (2.4 GHz or 5 GHz)", "Flexible — devices can move freely", "Subject to interference and walls", "Better for mobile devices (laptops, phones)"] } },
      ],
    },
  ],
};

export const csSoftwareNotes: NoteChapter = {
  subject: "Computer Science",
  title: "Software",
  pages: [
    {
      section: "4.1 Operating Systems",
      blocks: [
        { kind: "video", youtubeId: "26QPDBe-NB8", title: "Operating Systems Explained — IGCSE Computer Science", caption: "Functions of an OS: process management, memory management, file management, device management, and user interfaces" },
        { kind: "intro", text: "The **Operating System (OS)** is the most important piece of system software. It acts as the interface between hardware and application programs, and manages all computer resources." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kernel_Layout.svg/600px-Kernel_Layout.svg.png", caption: "The OS kernel sits between hardware and applications — managing resources and providing a controlled interface for programs to access hardware safely.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Operating System (OS)", value: "System software that manages hardware resources and provides a platform for applications to run." },
          { label: "Process management", value: "Controls which processes run, allocates CPU time using scheduling algorithms, handles multitasking." },
          { label: "Memory management", value: "Allocates RAM to processes, manages virtual memory, prevents processes accessing each other's memory." },
          { label: "File management", value: "Organises files in hierarchical directory structure, handles read/write access permissions." },
          { label: "Device management", value: "Uses device drivers to communicate with peripheral hardware (printers, keyboards, monitors)." },
          { label: "User interface", value: "Provides GUI (graphical) or CLI (command-line) for user interaction." },
        ]},
        { kind: "comparison", left: { label: "GUI (Graphical User Interface)", items: ["Uses windows, icons, menus, pointer (WIMP)", "Easy for beginners — intuitive", "Uses more memory and processing power", "Examples: Windows, macOS, Android, iOS"] }, right: { label: "CLI (Command-Line Interface)", items: ["User types text commands", "More precise and faster for experienced users", "Uses less memory and processing power", "Examples: Linux terminal, Windows PowerShell"] } },
        { kind: "tip", text: "Questions about OS functions often ask: 'State two functions of an OS.' Learn all 5 (process, memory, file, device management, user interface) with one-line descriptions each." },
      ],
    },
    {
      section: "4.2 Types of Software",
      blocks: [
        { kind: "video", youtubeId: "OExXFN9KMUk", title: "System Software vs Application Software — IGCSE CS", caption: "Types of software including OS, utilities, open source, proprietary, and application software" },
        { kind: "intro", text: "Software is divided into **system software** (manages the computer itself) and **application software** (performs tasks for the user)." },
        { kind: "comparison", left: { label: "System software", items: ["Operating systems (Windows, Linux, macOS)", "Device drivers (translate OS commands to hardware)", "Utilities (disk defragmenter, antivirus, file compressor)", "Programming language translators"] }, right: { label: "Application software", items: ["General-purpose: word processor, spreadsheet, browser", "Special-purpose: payroll system, hospital database", "Bespoke: custom software for one specific client", "Open source: source code freely available (LibreOffice, Firefox)"] } },
        { kind: "keyterms", terms: [
          { label: "Open source", value: "Software with source code freely available — can be modified and redistributed (e.g. Linux, Firefox, LibreOffice)." },
          { label: "Proprietary (closed source)", value: "Source code kept secret; licence required to use (e.g. Microsoft Office, Adobe Photoshop)." },
        ]},
      ],
    },
    {
      section: "4.3 Translators",
      blocks: [
        { kind: "video", youtubeId: "d7KHAVaX_Rs", title: "Compilers vs Interpreters — IGCSE Computer Science", caption: "How compilers, interpreters, and assemblers translate high-level code to machine code" },
        { kind: "intro", text: "Translators convert programs written in high-level or assembly language into machine code (binary) that the CPU can execute." },
        { kind: "comparison", left: { label: "High-level languages (Python, Java, C++)", items: ["Human-readable syntax", "Machine-independent — runs on different hardware", "Easier to write, debug and maintain", "Must be translated to machine code"] }, right: { label: "Low-level languages", items: ["Assembly: mnemonics (ADD, MOV, SUB) — one-to-one with machine code", "Machine code: binary instructions directly executed by CPU", "Hardware-specific — not portable", "Faster execution; used for device drivers, embedded systems"] } },
        { kind: "table", headers: ["Translator", "How it works", "Key advantage"], rows: [
          ["Compiler", "Translates entire source code to machine code BEFORE execution. Creates standalone executable.", "Fast execution; code hidden from user; errors reported after full translation"],
          ["Interpreter", "Translates and executes ONE LINE AT A TIME. No standalone file created.", "Easier debugging (stops at first error); source code must be present to run"],
          ["Assembler", "Translates assembly language mnemonics directly to machine code (one-to-one).", "Architecture-specific; very fast execution"],
        ]},
        { kind: "tip", text: "Python is interpreted. C++ is compiled. Compiler = fast execution but slow translation phase. Interpreter = slow execution but immediate error feedback line-by-line." },
      ],
    },
  ],
};

export const csInternetNotes: NoteChapter = {
  subject: "Computer Science",
  title: "The Internet and Its Uses",
  pages: [
    {
      section: "5.1 Web Technologies",
      blocks: [
        { kind: "video", youtubeId: "hJHvda31SyQ", title: "How the Internet Works — Explained Simply", caption: "IP addresses, DNS, HTTP/HTTPS, routers, and how a webpage reaches your browser" },
        { kind: "intro", text: "The **Internet** is a global network of connected computers. The **World Wide Web (WWW)** is a collection of web pages and resources accessed via the internet using HTTP/HTTPS." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Internet_map_1024.jpg/800px-Internet_map_1024.jpg", caption: "A visualisation of the internet's structure — thousands of interconnected networks forming a global mesh. No single point of failure: packets can be rerouted around damage.", side: "full" },
        { kind: "keyterms", terms: [
          { label: "Internet", value: "A global network of interconnected computers using the TCP/IP protocol suite. The physical infrastructure." },
          { label: "WWW (World Wide Web)", value: "A collection of websites and web pages accessible via the internet through browsers. A SERVICE running ON the internet." },
          { label: "URL", value: "Uniform Resource Locator — the unique address of a web resource. Format: protocol://domain/path" },
          { label: "HTTP/HTTPS", value: "HyperText Transfer Protocol — rules for requesting and sending web pages. HTTPS adds TLS/SSL encryption." },
          { label: "IP address", value: "A unique numerical address identifying a device on a network. IPv4: 32-bit (e.g. 192.168.1.1); IPv6: 128-bit." },
          { label: "MAC address", value: "Media Access Control address — unique hardware identifier burned into every NIC. Used within a local network." },
          { label: "DNS", value: "Domain Name System — translates domain names (google.com) into IP addresses. The internet's phone book." },
        ]},
        { kind: "highlight", text: "**How DNS works:**\n1. User types google.com → browser checks its own cache\n2. If not found → asks local DNS server\n3. Local DNS checks its records → if not found → asks root DNS servers\n4. IP address returned to browser → browser contacts web server\n5. Web server sends back the webpage (HTML, CSS, images)", color: "blue" },
        { kind: "comparison", left: { label: "IPv4", items: ["32-bit address — 4 groups of 0–255", "Example: 192.168.0.1", "~4.3 billion unique addresses", "Running out of addresses globally"] }, right: { label: "IPv6", items: ["128-bit address — 8 groups of hex", "Example: 2001:0db8::370:7334", "340 undecillion unique addresses", "Solves IPv4 address exhaustion"] } },
      ],
    },
    {
      section: "5.2 Cybersecurity",
      blocks: [
        { kind: "video", youtubeId: "inWWhr5tnEA", title: "Cybersecurity Threats Explained — IGCSE Computer Science", caption: "Phishing, malware, hacking, DDoS attacks and how to protect against them" },
        { kind: "intro", text: "Cybersecurity protects computers, networks, and data from unauthorised access, theft, and damage. Understanding common threats and countermeasures is essential." },
        { kind: "table", headers: ["Threat", "Description", "Prevention"], rows: [
          ["Phishing", "Fake emails/websites trick users into revealing personal info or login credentials", "User education, email filtering, check URLs, 2FA"],
          ["Malware", "Malicious software: viruses (self-replicating), worms (spread across networks), ransomware (encrypts files), spyware (monitors user)", "Antivirus software, keep OS updated, avoid suspicious downloads"],
          ["Hacking", "Unauthorised access to systems to steal, modify or delete data", "Strong passwords, firewalls, intrusion detection, encryption"],
          ["DDoS attack", "Overwhelms a server with traffic from many compromised devices (botnet)", "Firewalls, traffic filtering, rate limiting, CDN"],
          ["SQL injection", "Malicious SQL code inserted into input fields to manipulate a database", "Input validation/sanitisation, prepared statements"],
        ]},
        { kind: "keyterms", terms: [
          { label: "Firewall", value: "Hardware or software that monitors and filters network traffic based on security rules — blocks unauthorised access." },
          { label: "Proxy server", value: "Acts as an intermediary between users and the internet — hides user IP, can filter content, caches web pages." },
          { label: "Two-factor authentication (2FA)", value: "Requires two forms of verification (e.g. password + OTP to phone) — adds a second layer of security." },
        ]},
        { kind: "tip", text: "For security questions: identify the threat, explain HOW it works, then give TWO specific countermeasures. 'Use a strong password' alone scores 0. Be specific: 'Use 2FA so that even if the password is stolen, the attacker needs the second factor to log in.'" },
      ],
    },
    {
      section: "5.3 Ethics and Technology",
      blocks: [
        { kind: "video", youtubeId: "GcRmRPBVQRE", title: "Digital Ethics & Technology — IGCSE Computer Science", caption: "Intellectual property, privacy, digital footprints, copyright, and environmental impacts of computing" },
        { kind: "intro", text: "The widespread use of digital technology raises important ethical, legal, and social issues that computer scientists must consider." },
        { kind: "keyterms", terms: [
          { label: "Intellectual property (IP)", value: "Creations of the mind — software, music, writing, inventions — protected by law." },
          { label: "Copyright", value: "Legal right giving the creator exclusive rights to use and distribute their work." },
          { label: "Open source", value: "Software whose source code is freely available to view, use, modify and distribute." },
          { label: "Digital footprint", value: "The trail of data left whenever someone uses the internet — browsing history, social media posts, purchases." },
          { label: "Environmental impact", value: "Data centres consume enormous electricity; manufacturing requires rare earth minerals; e-waste pollutes landfill." },
        ]},
        { kind: "comparison", left: { label: "Benefits of digital technology", items: ["Enables remote working and education", "Faster communication globally", "Access to information democratised", "Automation increases productivity"] }, right: { label: "Concerns about digital technology", items: ["Privacy — personal data collected and sold", "Cybercrime and identity theft", "Job losses due to automation", "Environmental cost of data centres and e-waste"] } },
      ],
    },
  ],
};

export const csAlgorithmsNotes: NoteChapter = {
  subject: "Computer Science",
  title: "Algorithm Design and Problem-Solving",
  pages: [
    {
      section: "7.1 Computational Thinking",
      blocks: [
        { kind: "video", youtubeId: "mUXo-S7gzds", title: "Computational Thinking — IGCSE Computer Science (Cognito)", caption: "Decomposition, abstraction, pattern recognition and algorithm design explained with examples" },
        { kind: "intro", text: "**Computational thinking** is the process of solving problems in a way that a computer could execute. It involves four key skills used by all programmers and problem-solvers." },
        { kind: "keyterms", terms: [
          { label: "Decomposition", value: "Breaking a complex problem into smaller, more manageable sub-problems that can each be solved independently." },
          { label: "Abstraction", value: "Removing unnecessary detail and focusing only on the information relevant to solving the problem." },
          { label: "Pattern recognition", value: "Identifying similarities or recurring features in problems that allow solutions from one to be applied to another." },
          { label: "Algorithm design", value: "Designing a step-by-step set of instructions to solve a problem or achieve a goal." },
        ]},
        { kind: "highlight", text: "**Example — decomposing 'build a school app':**\n→ Design the login system\n→ Create student database\n→ Build timetable module\n→ Add notification system\n→ Test on multiple devices\n→ Deploy to server\n\nEach sub-task solved independently — this is decomposition in action.", color: "blue" },
      ],
    },
    {
      section: "7.2 Flowcharts and Pseudocode",
      blocks: [
        { kind: "video", youtubeId: "7v2gs8rdQzU", title: "Algorithms & Pseudocode — IGCSE Computer Science (Cognito)", caption: "Flowcharts, pseudocode, loops, selection, decomposition and abstraction with CAIE-style examples" },
        { kind: "intro", text: "Algorithms can be represented using **flowcharts** (diagrams) or **pseudocode** (structured English-like code). Both are used to plan programs before writing actual code." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/LampFlowchart.svg/500px-LampFlowchart.svg.png", caption: "Flowchart example showing decision (diamond), process (rectangle), and terminal (oval/rounded rectangle) symbols — standard notation used in IGCSE CS.", side: "right" },
        { kind: "table", headers: ["Flowchart symbol", "Shape", "Meaning"], rows: [
          ["Terminal", "Rounded rectangle / oval", "Start or End of algorithm"],
          ["Process", "Rectangle", "An action or calculation (e.g. total ← total + 1)"],
          ["Decision", "Diamond", "A yes/no question — branches the flow"],
          ["Input/Output", "Parallelogram", "Data entered by user or displayed as output"],
          ["Arrow", "Arrow line", "Shows the direction of flow"],
        ]},
        { kind: "highlight", text: "**Cambridge IGCSE pseudocode keywords:**\nDECLARE name : INTEGER\nname ← value\nINPUT name\nOUTPUT name\nIF condition THEN ... ELSE ... ENDIF\nFOR i ← 1 TO 10 ... NEXT i\nWHILE condition DO ... ENDWHILE\nREPEAT ... UNTIL condition\nPROCEDURE name() ... ENDPROCEDURE\nFUNCTION name() RETURNS type ... ENDFUNCTION", color: "green" },
        { kind: "tip", text: "Use ← for assignment (not = or :=). Indent code inside loops and conditionals. Always close loops with ENDWHILE, ENDIF, NEXT — missing these loses marks in Paper 2." },
      ],
    },
    {
      section: "7.3 Trace Tables and Searching/Sorting",
      blocks: [
        { kind: "video", youtubeId: "ZZuD6iUe3Pc", title: "Bubble Sort & Linear Search Traced — IGCSE Computer Science", caption: "Bubble sort, insertion sort, and linear search traced through worked examples with trace tables" },
        { kind: "intro", text: "Trace tables allow you to **dry-run** an algorithm — tracking the value of every variable at each step to verify the algorithm works correctly." },
        { kind: "bullets", items: [
          { text: "**Creating a trace table:**", sub: ["Create one column for each variable used", "Add an OUTPUT column if there is printed output", "Work through the algorithm line by line, one step at a time", "Update variable values only when they change", "Show intermediate values clearly — don't skip steps"] },
        ]},
        { kind: "highlight", text: "**Linear search:** Check each element in sequence until found or end reached.\n• Works on UNSORTED data\n• Best case: O(1); Worst case: O(n)\n\n**Bubble sort:** Compare adjacent pairs, swap if out of order. Repeat until no swaps needed.\n• After each PASS, the largest unsorted element bubbles to its correct position\n• Requires n−1 passes maximum for n elements\n\n**Insertion sort:** Take each element and insert it into its correct position in the sorted portion.", color: "blue" },
        { kind: "tip", text: "In trace table questions, the examiner checks every row carefully — never skip a row. Show every iteration of a loop even if the value doesn't change. Missing rows = lost marks." },
      ],
    },
  ],
};

export const csProgrammingNotes: NoteChapter = {
  subject: "Computer Science",
  title: "Programming",
  pages: [
    {
      section: "8.1 Programming Concepts",
      blocks: [
        { kind: "video", youtubeId: "rfscVS0vtbw", title: "Programming Fundamentals — Variables, Loops, Functions", caption: "Core programming concepts: data types, variables, operators, selection and iteration in Python/pseudocode" },
        { kind: "intro", text: "Programming is the process of writing instructions for a computer to follow. Understanding fundamental concepts — variables, data types, and operators — is the foundation of all programming." },
        { kind: "table", headers: ["Data type", "Description", "Example values"], rows: [
          ["INTEGER", "Whole numbers (positive, negative, zero)", "42, -7, 0, 1000"],
          ["REAL / FLOAT", "Numbers with decimal points", "3.14, -0.5, 100.0"],
          ["CHAR", "A single character", "'A', '5', '@'"],
          ["STRING", "A sequence of characters", "'Hello', 'IGCSE 2025'"],
          ["BOOLEAN", "True or False only", "TRUE, FALSE"],
        ]},
        { kind: "highlight", text: "**Variable vs Constant:**\n• **Variable:** named memory location whose value CAN CHANGE during execution\n• **Constant:** SET ONCE and NEVER changes (e.g. PI = 3.14159)\n\n**Arithmetic operators:** + − * / DIV (integer division) MOD (remainder)\n**Relational operators:** = <> < > <= >=\n**Logical operators:** AND OR NOT", color: "blue" },
        { kind: "tip", text: "DIV gives the whole-number quotient: 17 DIV 5 = 3. MOD gives the remainder: 17 MOD 5 = 2. These appear frequently — know the difference and practise with examples." },
      ],
    },
    {
      section: "8.2 Arrays and Procedures",
      blocks: [
        { kind: "video", youtubeId: "K1-K2La00MY", title: "Arrays, Procedures & Functions — IGCSE Computer Science", caption: "How to declare and use 1D arrays, write procedures and functions, and pass parameters in pseudocode" },
        { kind: "intro", text: "**Arrays** store multiple values of the same data type under one name, accessed by index. **Procedures and functions** allow code to be reused by wrapping it in a named block." },
        { kind: "highlight", text: "**Array declaration and access:**\nDECLARE scores[1:10] : INTEGER\nscores[1] ← 95\nOUTPUT scores[3]\n\n**Loop through an array:**\nFOR i ← 1 TO 10\n    OUTPUT scores[i]\nNEXT i\n\n**Procedure:**\nPROCEDURE greet(name : STRING)\n    OUTPUT 'Hello, ' & name\nENDPROCEDURE\nCALL greet('Zara')\n\n**Function:**\nFUNCTION square(n : INTEGER) RETURNS INTEGER\n    RETURN n * n\nENDFUNCTION\nresult ← square(5)  ← result = 25", color: "green" },
        { kind: "comparison", left: { label: "Procedure", items: ["Performs a set of actions", "Does NOT return a value", "Called with CALL procedureName()", "Use for side effects (printing, modifying variables)"] }, right: { label: "Function", items: ["Performs actions AND returns a value", "Declared with RETURNS dataType", "Called as part of an expression: result ← functionName(x)", "Use when you need a calculated value back"] } },
        { kind: "tip", text: "A function MUST have a RETURN statement. A procedure does NOT. Parameters pass data INTO the procedure/function. If a parameter can be modified inside and the change seen outside, it is passed by reference (not by value)." },
      ],
    },
    {
      section: "8.3 File Handling",
      blocks: [
        { kind: "video", youtubeId: "Uh2ebFW8OYM", title: "File Handling in Pseudocode — IGCSE Computer Science", caption: "OPENFILE, READFILE, WRITEFILE and EOF() explained with worked examples in CAIE pseudocode" },
        { kind: "intro", text: "Programs can read from and write to files to permanently store and retrieve data between sessions." },
        { kind: "highlight", text: "**File handling pseudocode:**\n\n— Reading a file:\nOPENFILE 'data.txt' FOR READING\nWHILE NOT EOF('data.txt') DO\n    READFILE 'data.txt', line\n    OUTPUT line\nENDWHILE\nCLOSEFILE 'data.txt'\n\n— Writing a file:\nOPENFILE 'output.txt' FOR WRITING\nWRITEFILE 'output.txt', 'Hello World'\nCLOSEFILE 'output.txt'", color: "blue" },
        { kind: "tip", text: "Always CLOSEFILE after reading or writing. Use EOF() in a WHILE loop to avoid reading past the end of the file. Forgetting CLOSEFILE or EOF() are the two most common file handling mistakes." },
      ],
    },
  ],
};

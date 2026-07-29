const practiceRoutes = {
    english: {
        label: "English",
        topics: {
            engall: {
                label: "Englight All (Grammer and Literature)",
                route: "/t20/english/all",
                active: true,
            },
            spelling: {
                label: "Spelling Test",
                route: "/t20/english/spelling",
                active: true,
            },
            literature: {
                label: "Literature (ইংরেজি সাহিত্য)",
                route: "/t20/english/literature",
                active: true,
            },
            vocabulary: {
                label: "Vocabulary - One Word Substitution",
                route: "/t20/english/vocabulary",
                active: true,
            },
            tense: {
                label: "The Tense (Feture, Present, Past)",
                route: "/t20/english/tense",
                active: true,
            },
            verb: {
                label: "The Verb, Adverb, Group Verb and Right Form of Verb",
                route: "/t20/english/verb482",
                active: true,
            },
            voice: {
                label: "Voice Change ( Active & Passive Voice)",
                route: "/t20/english/voice",
                active: true,
            },
        },
    },

    gk: {
        label: "GK",
        topics: {
            all: {
                label: "GK > All Topics",
                route: "/t20/gk/all",
                active: true,
            },
            // bangladesh: {
            //     label: "GK > বাংলাদেশ বিষয়াবলি",
            //     route: "/t20/gk/bangladesh-affairs",
            //     active: false,
            // },
            bangladesh: {
                label: "AtoZ GK Lecture 1 > বাংলাদেশ বিষয়াবলি",
                route: "/t20/gk/a2z",
                active: true,
            },
            language: {
                label: "GK > ভাষা আন্দোলন - মুক্তিযুদ্ধ",
                route: "/t20/gk/language-movement",
                active: false,
            },
            economy: {
                label: "GK > বাংলাদেশের অর্থনীতি",
                route: "/t20/gk/economy",
                active: false,
            },
            census: {
                label: "GK > বাংলাদেশের জনশুমারি",
                route: "/t20/gk/census",
                active: false,
            },
            industry: {
                label: "GK > বাংলাদেশের শিল্প ও বাণিজ্য",
                route: "/t20/gk/industry-commerce",
                active: false,
            },
            constitution: {
                label: "GK > বাংলাদেশের সংবিধান",
                route: "/t20/gk/constitution",
                active: false,
            },
            international: {
                label: "GK > আন্তর্জাতিক বিষয়াবলি",
                route: "/t20/gk/international",
                active: false,
            },
            history: {
                label: "GK > বৈশ্বিক ইতিহাস",
                route: "/t20/gk/world-history",
                active: false,
            },
            current: {
                label: "GK > সাম্প্রতিক ঘটনাপ্রবাহ",
                route: "/t20/gk/current-affairs",
                active: false,
            },
        },
    },

    Bangla: {
        label: "Bangla",
        topics: {
            all: {
                label: "BN > বাংলা ভাষা ও সাহিত্য (All Topics)",
                route: "/t20/bangla/all",
                active: true,
            },
            bakaron1: {
                label: "BN > কারক ও বিভক্তি ",
                route: "/t20/bangla/bacaron/karokobivokti",
                active: true,
            },
            shahitto2: {
                label: "BN > বাংলা সাহিত্য (মধ্যযুগ)", 
                route: "/t20/bangla/shahitto/modhdhojug",
                active: true,
            },
            shahitto3: {
                label: "BN > বাংলা সাহিত্য (প্রাচীন যুগ/চর্যাপদ)", 
                route: "/t20/bangla/shahitto/prachinjug",
                active: true,
            },
            shahitto4: {
                label: "BN > মুক্তিযুদ্ধ ও ভাষা আন্দোলন বিষয়ক সাহিত্য", 
                route: "/t20/bangla/shahitto/muktijudhovashaandolon",
                active: true,
            },
            bakaron2: {
                label: "BN > প্রকৃতি ও প্রত্যয় ",
                route: "/t20/bangla/bacaron/pokritioprotoy",
                active: true,
            },
            bakaron3: {
                label: "BN > ভাষাতত্ত্ব (শব্দ, ধ্বনি, ....সন্ধি ) ",
                route: "/t20/bangla/bacaron/",
                active: false,
            },
        },
    },

    ICT: {
        label: "তথ্য ও প্রযুক্তি-ICT",
        topics: {
            all: {
                label: "ICT > তথ্য প্রযুক্তি (All Topics)",
                route: "/t20/ict/all",
                active: true,
            },
            computerMaintanence: {
                label: "ICT > কম্পিউটার রক্ষণাবেক্ষণ, Virus, Cyber Security, firewall, software, Operating System ect.",
                route: "/t20/ict/comMaintanence",
                active: true,
            },
            computerPeripherals: {
                label: "ICT > কম্পিউটার পেরিফেরালস (Computer Peripherals, কি-বোর্ড, মাউস, OCR )",
                route: "/t20/ict/computer-peripherals",
                active: true,
            },
            computerArchitecture: {
                label: "ICT > কম্পিউটারের অঙ্গসংগঠন (CPU, Hard Disk, ALU, RAM, ROM)",
                route: "/t20/ict/computer-architecture",
                active: true,
            },
            computerPracticalFields: {
                label: "ICT > দৈনন্দিন জীবনে কম্পিউটার",
                route: "/t20/ict/doinondin-jibone-computer",
                active: true,
            },
            computerNumberSystem: {
                label: "ICT > Computer Number System (বাইনারি, অক্টাল, হেক্সা ডেসিমল ও রুপান্তর)",
                route: "/t20/ict/number-system",
                active: true,
            },
            computerHistory: {
                label: "ICT > কম্পিউটারের ইতিহাস, প্রকারভেদ, প্রজন্ম",
                route: "/t20/ict/computarer-itihas-prokarved",
                active: true,
            },
            computerDatabase: {
                label: "ICT > ডেটাবেইস সিস্টেম (Database Management System)",
                route: "/t20/ict/computer-database",
                active: true,
            },
            computerNetworking: {
                label: "ICT > কম্পিউটার নেটওয়ার্ক & Data communications",
                route: "/t20/ict/computer-networking",
                active: true,
            },
            computerMachineCode: {
                label: "ICT > Machine Code (ASCII, BCD, Unicode ..ect.)",
                route: "/t20/ict/machine-code",
                active: true,
            },
        },
    },
    Biology: {
        label: "সাধারণ বিজ্ঞান",
        topics: {
            biology: {
                label: "জীব বিজ্ঞান",
                route: "/t20/sadharon-biggan/biology",
                active: true,
            },
            physics: {
                label: "পদার্থ বিজ্ঞান",
                route: "/t20/sadharon-biggan/physics",
                active: true,
            },
            chemistry: {
                label: "রসায়ন বিজ্ঞান",
                route: "/t20/sadharon-biggan/chemistry",
                active: true,
            },
        },
    },
    NoitikotaMS: {
        label: "নৈতিকতা, মূল্যবোধ ও সুশাসন",
        topics: {
            all: {
                label: "নৈতিকতা, মূল্যবোধ ও সুশাসন (All Topics)",
                route: "/t20/noitikota-mullobodh-sushahon/all",
                active: true,
            },
            Noitikota: {
                label: "নৈতিকতা",
                route: "/t20/noitikota-mullobodh-sushahon/noitikota",
                active: true,
            },
            Mullobodh: {
                label: "মূল্যবোধ",
                route: "/t20/noitikota-mullobodh-sushahon/mullobodh",
                active: true,
            },
            Sushason: {
                label: "সুশাসন",
                route: "/t20/noitikota-mullobodh-sushahon/sushason",
                active: true,
            },
        },
    },
};

export const defaultQuizConfig = {
    questionLimit: 20,
    timeLimit: 120,
    negativeMarking: 0.5,
    timerDisplay: "t20",
};

export default practiceRoutes;
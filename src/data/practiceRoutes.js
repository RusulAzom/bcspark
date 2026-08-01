const practiceRoutes = {
    english: {
        label: "👉 English",
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
        label: "👉 GK - বাংলাদেশ বিষয়াবলী",
        topics: {
            all: {
                label: "GK > বাংলাদেশ All Topics",
                route: "/t20/gk/all",
                active: true,
            },
            jatiyaBisoyboli: {
                label: "জাতীয় বিষয়াবলী",
                route: "/t20/gk/jatiya-bisoyboli",
                active: true,
            },
            krisijSompod: {
                label: "কৃষিজ সম্পদ",
                route: "/t20/gk/krisij-sompod",
                active: true,
            },
            jonosumari: {
                label: "জনশুমারি",
                route: "/t20/gk/jonosumari",
                active: true,
            },
            orthoniti: {
                label: "বাংলাদেশের অর্থনীতি",
                route: "/t20/gk/orthoniti",
                active: true,
            },
            shilpoBanijjo: {
                label: "শিল্প ও বাণিজ্য",
                route: "/t20/gk/shilpo-banijjo",
                active: true,
            },
            bangladesherSongbidhan: {
                label: "বাংলাদেশের সংবিধান",
                route: "/t20/gk/bangladesher-songbidhan",
                active: true,
            },
            rajnoitikOsorkarBabostha: {
                label: "রাজনৈতিক ও সরকার ব্যবস্থা",
                route: "/t20/gk/rajnoitik-osorkar-babostha",
                active: true,
            },
            jatiyoOrjon: {
                label: "জাতীয় অর্জন",
                route: "/t20/gk/jatiyo-orjon",
                active: true,
            },
            prothisthanSomuho: {
                label: "গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ",
                route: "/t20/gk/prothisthan-somuho",
                active: true,
            },
            kheladhulaCholochitra: {
                label: "খেলাধুলা ও চলচ্চিত্র",
                route: "/t20/gk/kheladhula-cholochitra",
                active: true,
            },
            gonomadhomProjukti: {
                label: "গণমাধ্যম ও প্রযুক্তি",
                route: "/t20/gk/gonomadhom-projukti",
                active: true,
            },
        },
    },

    GKInternational: {
        label: "👉 GK - আন্তর্জাতিক",
        topics: {
            all: {
                label: "GK - আন্তর্জাতিক (All Topics)",
                route: "/t20/gk-international/all",
                active: true,
            },
            itihasVurajniti: {
                label: "বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি",
                route: "/t20/gk-international/itihas-vurajniti",
                active: true,
            },
            nirapottaCkuktti: {
                label: "আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক",
                route: "/t20/gk-international/nirapotta-ckuktti",
                active: true,
            },
            currentWorld: {
                label: "বিশ্বের সাম্প্রতিক ও চলমান ঘটনাস্প্রবাহ",
                route: "/t20/gk-international/current-world",
                active: true,
            },
            internationalEnviroment: {
                label: "আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি",
                route: "/t20/gk-international/international-enviroment",
                active: true,
            },
            antorjatikSongothon: {
                label: "আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি",
                route: "/t20/gk-international/antorjatik-songothon",
                active: true,
            },
        },
    },

    Bangla: {
        label: "👉 বাংলা ব্যাকরণ",
        topics: {
            all: {
                label: "বাংলা ব্যাকরণ (All Topics)",
                route: "/t20/bangla/all",
                active: true,
            },
            bakkotottoOproyog: {
                label: "শুদ্ধিকরণ, প্রকরণ, অনুবাদ …. - বাক্যতত্ত্ব ও প্রয়োগ",
                route: "/t20/bangla/bakkototto-oproyog",
                active: true,
            },
            bakaronicUpadan: {
                label: "সন্ধি, ণ-ত্ব ও ষ-ত্ব, উপসর্গ, সমাস, প্রকৃতি, কারক, ক্রিয়ার ... - ব্যাকরণিক উপাদান",
                route: "/t20/bangla/bakaronic-upadan",
                active: true,
            },
            vashaOdhonniBiggan: {
                label: "ভাষা, ধ্বনি, চিহ্ন ... - ভাষা ও ধ্বনিবিজ্ঞান",
                route: "/t20/bangla/vasha-odhonni-biggan",
                active: true,
            },
            shobdoOruptotto: {
                label: "বচন, পুরুষ ও দ্বিরুক্ত শব্দ, পদাশ্রিত, পদ .... - শব্দ ও রূপতত্ত্ব",
                route: "/t20/bangla/shobdo-ruptotto",
                active: true,
            },
        },
    },

    ICT: {
        label: "👉 তথ্য ও প্রযুক্তি-ICT",
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
        label: "👉 সাধারণ বিজ্ঞান",
        topics: {
            all: {
                label: "সাধারণ বিজ্ঞান (All Topics)",
                route: "/t20/sadharon-biggan/all",
                active: true,
            },
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
    VugolPoribeshDM: {
        label: "👉 ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
        topics: {
            all: {
                label: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা (All Topics)",
                route: "/t20/vugol-poribesh-dm/all",
                active: true,
            },
            vugol: {
                label: "ভূগোল",
                route: "/t20/vugol-poribesh-dm/vugol",
                active: true,
            },
            poribesh: {
                label: "পরিবেশ",
                route: "/t20/vugol-poribesh-dm/poribesh",
                active: true,
            },
            durjogBabosthapona: {
                label: "দুর্যোগ ব্যবস্থাপনা",
                route: "/t20/vugol-poribesh-dm/durjog-babosthapona",
                active: true,
            },
        },
    },
    NoitikotaMS: {
        label: "👉 নৈতিকতা, মূল্যবোধ ও সুশাসন",
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
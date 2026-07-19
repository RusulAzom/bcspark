const practiceRoutes = {
    english: {
        label: "English",
        topics: {
            spelling: {
                label: "Grammar - Spelling Test",
                route: "/t20/english/spelling",
                active: true,
            },
            oneword: {
                label: "Vocabulary - One Word Substitution",
                route: "/t20/english/vocabulary",
                active: true,
            },
            synonyms: {
                label: "Grammar - Synonyms",
                route: "/t20/english/synonyms",
                active: false,
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
                label: "BN > ভাষা, প্রয়োগ-অপ্রয়োগ, বানান ও বাক্য শুদ্ধি ..ect ",
                route: "/t20/bangla/bakaron1",
                active: false,
            },
            bakaron2: {
                label: "BN > ভাষাতত্ত্ব (শব্দ, ধ্বনি, ....সন্ধি ) ",
                route: "/t20/bangla/language-movement",
                active: false,
            },
        },
    },

    ICT: {
        label: "ICT",
        topics: {
            all: {
                label: "ICT > All Topics",
                route: "/t20/ict/all",
                active: true,
            },
            computerPeripherals: {
                label: "ICT > কম্পিউটার পেরিফেরালস",
                route: "/t20/gk/bangladesh-affairs",
                active: false,
            },
            computerArchitecture: {
                label: "ICT > কম্পিউটারের অঙ্গসংগঠন ",
                route: "/t20/gk/language-movement",
                active: false,
            },
            computerPracticalFields: {
                label: "ICT > দৈনন্দিন জীবনে কম্পিউটার",
                route: "/t20/gk/economy",
                active: false,
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
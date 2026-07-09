const practiceRoutes = {
    english: {
        label: "English",
        topics: {
            spelling: {
                label: "Grammar - Spelling Test",
                route: "/t20/english/spelling",
                active: true,
            },
            synonyms: {
                label: "Grammar - Synonyms",
                route: "/t20/english/synonyms",
                active: false,
            },
            oneword: {
                label: "Vocabulary - One Word Substitution",
                route: "/t20/english/one-word",
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
            bangladesh: {
                label: "GK > বাংলাদেশ বিষয়াবলি",
                route: "/t20/gk/bangladesh-affairs",
                active: false,
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
};

export default practiceRoutes;
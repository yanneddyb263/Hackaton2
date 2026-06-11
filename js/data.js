// Mock Database and State Management for EcoCycle CI
export const COTE_DIVOIRE_ZONES = [
    "Zone Industrielle de Yopougon",
    "Zone Industrielle de Vridi",
    "Zone Industrielle de Koumassi",
    "Zone Industrielle de PK24 (Akoupé-Zeudji)",
    "Zone Industrielle de Bonoua"
];

export const BUSINESS_SECTORS = [
    "Agro-industrie (Processing)",
    "Plastiques & Emballages",
    "Chimie & Cosmétiques",
    "Textile & Habillement",
    "BTP & Matériaux de Construction",
    "Logistique & Transport",
    "Automobile & Garages"
];

export const WASTE_TYPES = {
    cardboard: {
        id: "cardboard",
        name: "Cardboard",
        emoji: "📦",
        recyclable: true,
        unit: "kg",
        pricePerKg: 80, // SME gets paid 80 FCFA/kg
        co2SavedPerKg: 1.2 // kg CO2 avoided per kg recycled
    },
    plastic: {
        id: "plastic",
        name: "Plastic",
        emoji: "🥤",
        recyclable: true,
        unit: "kg",
        pricePerKg: 150, // SME gets paid 150 FCFA/kg
        co2SavedPerKg: 2.1
    },
    metal: {
        id: "metal",
        name: "Metal",
        emoji: "⚙️",
        recyclable: true,
        unit: "kg",
        pricePerKg: 350, // SME gets paid 350 FCFA/kg
        co2SavedPerKg: 3.5
    },
    oil: {
        id: "oil",
        name: "Used Oil",
        emoji: "🛢️",
        recyclable: true,
        unit: "L",
        pricePerKg: 200, // SME gets paid 200 FCFA/L
        co2SavedPerKg: 1.8
    },
    hazardous: {
        id: "hazardous",
        name: "Hazardous Waste",
        emoji: "☣️",
        recyclable: false,
        unit: "kg",
        pricePerKg: 250, // SME pays 250 FCFA/kg for disposal
        co2SavedPerKg: 0.2
    },
    mixed: {
        id: "mixed",
        name: "Mixed Waste",
        emoji: "🗑️",
        recyclable: false,
        unit: "kg",
        pricePerKg: 50, // SME pays 50 FCFA/kg for disposal
        co2SavedPerKg: 0.0
    }
};

// Initial state
export const state = {
    currentUser: null, // Stores user object: { name, role, details... }
    declarations: [
        {
            id: "dec-101",
            date: "2026-06-05",
            company: "SIPRA Industries",
            zone: "Zone Industrielle de Yopougon",
            wasteType: "plastic",
            weight: 1200,
            recyclable: true,
            status: "Completed",
            value: 180000,
            co2Avoided: 2520,
            collector: "Société Ivoirienne de Recyclage"
        },
        {
            id: "dec-102",
            date: "2026-06-08",
            company: "SIPRA Industries",
            zone: "Zone Industrielle de Yopougon",
            wasteType: "mixed",
            weight: 850,
            recyclable: false,
            status: "Completed",
            value: -42500,
            co2Avoided: 0,
            collector: "Ecopro Abidjan"
        },
        {
            id: "dec-103",
            date: "2026-06-10",
            company: "SIPRA Industries",
            zone: "Zone Industrielle de Yopougon",
            wasteType: "metal",
            weight: 600,
            recyclable: true,
            status: "Pending Match",
            value: 210000,
            co2Avoided: 2100,
            collector: null
        }
    ],
    matchingAlerts: [
        {
            id: "alert-201",
            smeName: "Abidjan Metal Works",
            zone: "Zone Industrielle de Vridi",
            wasteType: "metal",
            weight: 1800,
            distance: 4.2,
            value: 630000
        },
        {
            id: "alert-202",
            smeName: "CIE Plastics",
            zone: "Zone Industrielle de Koumassi",
            wasteType: "plastic",
            weight: 750,
            distance: 8.5,
            value: 112500
        },
        {
            id: "alert-203",
            smeName: "Cosmétiques d'Afrique",
            zone: "Zone Industrielle de Yopougon",
            wasteType: "hazardous",
            weight: 400,
            distance: 12.1,
            value: 100000 // Collector earns this
        }
    ],
    recyclerConfig: {
        companyName: "Société Ivoirienne de Recyclage",
        businessType: "both", // recycler, collector, both
        zones: ["Zone Industrielle de Yopougon", "Zone Industrielle de Vridi"],
        prices: {
            plastic: 150,
            cardboard: 80,
            metal: 350,
            oil: 200,
            mixed: 50,
            hazardous: 250
        }
    },
    tempDeclaration: null // For Screen 4 Qualification Result
};

export function saveState() {
    localStorage.setItem("ecocycle_state", JSON.stringify(state));
}

export function loadState() {
    const data = localStorage.getItem("ecocycle_state");
    if (data) {
        Object.assign(state, JSON.parse(data));
    }
}

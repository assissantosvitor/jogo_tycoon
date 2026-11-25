/* ==========================================================
   STARTUP TYCOON 3D
   systems.js — SISTEMAS DE SIMULAÇÃO

   Integra:
   - Economia
   - Funcionários
   - Produtos
   - Construção
   - Expansão do escritório
   - Pesquisa
   - Marketing
   - Investidores
   - Concorrentes
   - Eventos aleatórios
   - Progressão
   - Conquistas
   - LocalStorage / Auto Save
   - Integração com game.js e ui.js
   ========================================================== */

const SAVE_KEY = "startupTycoon3D_save_v2";

const LEGACY_SAVE_KEYS = [
    "startupTycoon3D_save_v1",
    "startup-tycoon-3d-v1"
];

const SAVE_VERSION = 2;

const DAY_DURATION_SECONDS = 20;

const AUTOSAVE_INTERVAL_SECONDS = 30;

const MAX_EVENT_LOG = 60;


/* ==========================================================
   HELPERS
   ========================================================== */

function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}


function uid(
    prefix = "id"
) {

    if (
        globalThis.crypto
            ?.randomUUID
    ) {

        return `${prefix}-${globalThis.crypto.randomUUID()}`;
    }


    return `${prefix}-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}


function randomBetween(
    min,
    max
) {

    return (
        min +
        Math.random() *
        (
            max -
            min
        )
    );
}


function choose(
    array
) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];
}


function deepClone(
    value
) {

    if (
        typeof structuredClone ===
        "function"
    ) {

        return structuredClone(
            value
        );
    }


    return JSON.parse(
        JSON.stringify(
            value
        )
    );
}


function safeNumber(
    value,
    fallback = 0
) {

    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? number
        : fallback;
}


function normalizeCompanyName(
    value
) {

    const name =
        String(
            value ||
            "Nova Labs"
        )
            .trim();


    return (
        name ||
        "Nova Labs"
    ).slice(
        0,
        36
    );
}


/* ==========================================================
   EMPLOYEE ROLES
   ========================================================== */

const EMPLOYEE_ROLES = {

    programmer: {

        id:
            "programmer",

        name:
            "Programador",

        salary:
            4200,

        hiringFee:
            2500,

        description:
            "Desenvolve produtos e sistemas.",

        productPower:
            1.25,

        designPower:
            0.15,

        researchPower:
            0.10,

        marketingPower:
            0.05,

        salesPower:
            0.05
    },


    designer: {

        id:
            "designer",

        name:
            "Designer",

        salary:
            3600,

        hiringFee:
            2200,

        description:
            "Aumenta qualidade e experiência dos produtos.",

        productPower:
            0.55,

        designPower:
            1.25,

        researchPower:
            0.10,

        marketingPower:
            0.15,

        salesPower:
            0.05
    },


    marketing: {

        id:
            "marketing",

        name:
            "Marketing",

        salary:
            3400,

        hiringFee:
            2000,

        description:
            "Melhora campanhas e popularidade.",

        productPower:
            0.10,

        designPower:
            0.10,

        researchPower:
            0.05,

        marketingPower:
            1.40,

        salesPower:
            0.15
    },


    sales: {

        id:
            "sales",

        name:
            "Vendas",

        salary:
            3200,

        hiringFee:
            1900,

        description:
            "Converte mercado em novos usuários e receita.",

        productPower:
            0.05,

        designPower:
            0.05,

        researchPower:
            0.05,

        marketingPower:
            0.20,

        salesPower:
            1.45
    },


    researcher: {

        id:
            "researcher",

        name:
            "Pesquisador",

        salary:
            5200,

        hiringFee:
            3200,

        description:
            "Gera pontos de pesquisa e inovação.",

        productPower:
            0.20,

        designPower:
            0.10,

        researchPower:
            1.60,

        marketingPower:
            0.05,

        salesPower:
            0.05
    },


    manager: {

        id:
            "manager",

        name:
            "Gerente",

        salary:
            6000,

        hiringFee:
            3800,

        description:
            "Eleva produtividade e coordena a equipe.",

        productPower:
            0.35,

        designPower:
            0.30,

        researchPower:
            0.30,

        marketingPower:
            0.30,

        salesPower:
            0.30
    }
};


/* ==========================================================
   BUILD ITEMS
   ========================================================== */

const BUILD_ITEMS = {

    workstation: {

        id:
            "workstation",

        name:
            "Estação de trabalho",

        cost:
            1800,

        unlockLevel:
            1,

        description:
            "Mesa, computador e cadeira em uma estação completa."
    },


    desk: {

        id:
            "desk",

        name:
            "Mesa",

        cost:
            600,

        unlockLevel:
            1,

        description:
            "Mesa para organizar o escritório."
    },


    computer: {

        id:
            "computer",

        name:
            "Computador",

        cost:
            900,

        unlockLevel:
            1,

        description:
            "Equipamento essencial para a equipe técnica."
    },


    chair: {

        id:
            "chair",

        name:
            "Cadeira",

        cost:
            350,

        unlockLevel:
            1,

        description:
            "Conforto para longas horas de trabalho."
    },


    plant: {

        id:
            "plant",

        name:
            "Planta",

        cost:
            250,

        unlockLevel:
            1,

        description:
            "Decoração que melhora o ambiente."
    },


    sofa: {

        id:
            "sofa",

        name:
            "Sofá",

        cost:
            850,

        unlockLevel:
            1,

        description:
            "Área de descanso para recuperar energia."
    },


    coffee: {

        id:
            "coffee",

        name:
            "Cafeteira",

        cost:
            1000,

        unlockLevel:
            1,

        description:
            "Ajuda funcionários a recuperar energia."
    },


    decoration: {

        id:
            "decoration",

        name:
            "Decoração",

        cost:
            450,

        unlockLevel:
            1,

        description:
            "Deixa a sede com mais personalidade."
    },


    server: {

        id:
            "server",

        name:
            "Servidor",

        cost:
            3500,

        unlockLevel:
            2,

        description:
            "Aumenta a capacidade de usuários dos produtos online."
    }
};


/* ==========================================================
   PRODUCT TYPES
   ========================================================== */

const PRODUCT_TYPES = {

    app: {

        id:
            "app",

        name:
            "Aplicativo",

        cost:
            3500,

        requiredProgress:
            100,

        baseQuality:
            45,

        baseARPU:
            0.18,

        unlockLevel:
            1,

        requiredTechnology:
            null,

        online:
            true
    },


    game: {

        id:
            "game",

        name:
            "Jogo",

        cost:
            6000,

        requiredProgress:
            130,

        baseQuality:
            48,

        baseARPU:
            0.24,

        unlockLevel:
            1,

        requiredTechnology:
            null,

        online:
            true
    },


    social: {

        id:
            "social",

        name:
            "Rede social",

        cost:
            11000,

        requiredProgress:
            180,

        baseQuality:
            44,

        baseARPU:
            0.12,

        unlockLevel:
            2,

        requiredTechnology:
            "cloud",

        online:
            true
    },


    software: {

        id:
            "software",

        name:
            "Software",

        cost:
            8500,

        requiredProgress:
            160,

        baseQuality:
            52,

        baseARPU:
            0.32,

        unlockLevel:
            2,

        requiredTechnology:
            null,

        online:
            false
    },


    streaming: {

        id:
            "streaming",

        name:
            "Streaming",

        cost:
            22000,

        requiredProgress:
            260,

        baseQuality:
            50,

        baseARPU:
            0.20,

        unlockLevel:
            3,

        requiredTechnology:
            "cloud",

        online:
            true
    },


    ai: {

        id:
            "ai",

        name:
            "Inteligência Artificial",

        cost:
            32000,

        requiredProgress:
            330,

        baseQuality:
            55,

        baseARPU:
            0.46,

        unlockLevel:
            3,

        requiredTechnology:
            "artificial-intelligence",

        online:
            true
    },


    os: {

        id:
            "os",

        name:
            "Sistema operacional",

        cost:
            85000,

        requiredProgress:
            520,

        baseQuality:
            60,

        baseARPU:
            0.52,

        unlockLevel:
            5,

        requiredTechnology:
            "cybersecurity",

        online:
            false
    },


    business: {

        id:
            "business",

        name:
            "Serviço empresarial",

        cost:
            16000,

        requiredProgress:
            220,

        baseQuality:
            56,

        baseARPU:
            0.38,

        unlockLevel:
            2,

        requiredTechnology:
            "cloud",

        online:
            true
    }
};


/* ==========================================================
   CAMPAIGNS
   ========================================================== */

const CAMPAIGNS = {

    social: {

        id:
            "social",

        name:
            "Redes sociais",

        cost:
            1200,

        duration:
            6,

        reach:
            30,

        popularity:
            0.65,

        unlockLevel:
            1,

        description:
            "Campanha barata e constante nas redes."
    },


    influencer: {

        id:
            "influencer",

        name:
            "Influenciadores",

        cost:
            4000,

        duration:
            8,

        reach:
            85,

        popularity:
            1,

        unlockLevel:
            2,

        description:
            "Criadores de conteúdo divulgam seu produto."
    },


    ads: {

        id:
            "ads",

        name:
            "Anúncios online",

        cost:
            7500,

        duration:
            10,

        reach:
            150,

        popularity:
            1.35,

        unlockLevel:
            2,

        description:
            "Aquisição de usuários em grande escala."
    },


    event: {

        id:
            "event",

        name:
            "Evento tecnológico",

        cost:
            18000,

        duration:
            12,

        reach:
            300,

        popularity:
            1.8,

        unlockLevel:
            3,

        description:
            "Apresente o produto em um grande evento."
    },


    tv: {

        id:
            "tv",

        name:
            "Campanha nacional",

        cost:
            55000,

        duration:
            15,

        reach:
            800,

        popularity:
            2.5,

        unlockLevel:
            5,

        description:
            "Campanha de mídia para uma empresa nacional."
    }
};


/* ==========================================================
   TECHNOLOGIES
   ========================================================== */

const TECHNOLOGIES = {

    cloud: {

        id:
            "cloud",

        name:
            "Cloud Computing",

        cost:
            5000,

        points:
            100,

        unlockLevel:
            1,

        prerequisites:
            [],

        description:
            "Receita online +10% e libera produtos conectados."
    },


    "artificial-intelligence": {

        id:
            "artificial-intelligence",

        name:
            "Inteligência Artificial",

        cost:
            12000,

        points:
            180,

        unlockLevel:
            2,

        prerequisites:
            [
                "cloud"
            ],

        description:
            "Desenvolvimento +15% e libera produtos de IA."
    },


    "big-data": {

        id:
            "big-data",

        name:
            "Big Data",

        cost:
            10000,

        points:
            170,

        unlockLevel:
            2,

        prerequisites:
            [
                "cloud"
            ],

        description:
            "Aquisição de usuários +20%."
    },


    cybersecurity: {

        id:
            "cybersecurity",

        name:
            "Cibersegurança",

        cost:
            9000,

        points:
            150,

        unlockLevel:
            2,

        prerequisites:
            [
                "cloud"
            ],

        description:
            "Reduz impacto de falhas e libera sistemas avançados."
    },


    "machine-learning": {

        id:
            "machine-learning",

        name:
            "Machine Learning",

        cost:
            20000,

        points:
            260,

        unlockLevel:
            3,

        prerequisites:
            [
                "artificial-intelligence",
                "big-data"
            ],

        description:
            "Qualidade inicial +8 e IA mais eficiente."
    },


    robotics: {

        id:
            "robotics",

        name:
            "Robótica",

        cost:
            35000,

        points:
            350,

        unlockLevel:
            4,

        prerequisites:
            [
                "machine-learning"
            ],

        description:
            "Produtividade global +20%."
    },


    vr: {

        id:
            "vr",

        name:
            "Realidade Virtual",

        cost:
            26000,

        points:
            300,

        unlockLevel:
            4,

        prerequisites:
            [
                "artificial-intelligence"
            ],

        description:
            "Jogos geram 25% mais receita."
    },


    quantum: {

        id:
            "quantum",

        name:
            "Computação Quântica",

        cost:
            120000,

        points:
            650,

        unlockLevel:
            6,

        prerequisites:
            [
                "robotics",
                "cybersecurity"
            ],

        description:
            "Receita global +30% no estágio final."
    }
};


/* ==========================================================
   COMPANY STAGES
   ========================================================== */

const COMPANY_STAGES = [

    {
        level: 1,
        name: "Startup de Garagem",
        valuation: 0
    },

    {
        level: 2,
        name: "Pequena Startup",
        valuation: 50000
    },

    {
        level: 3,
        name: "Empresa em Crescimento",
        valuation: 150000
    },

    {
        level: 4,
        name: "Empresa Tecnológica",
        valuation: 500000
    },

    {
        level: 5,
        name: "Empresa Nacional",
        valuation: 1500000
    },

    {
        level: 6,
        name: "Multinacional",
        valuation: 5000000
    },

    {
        level: 7,
        name: "Gigante Tecnológica",
        valuation: 18000000
    },

    {
        level: 8,
        name: "Império Tecnológico",
        valuation: 70000000
    }
];


/* ==========================================================
   OFFICE LEVELS
   ========================================================== */

const OFFICE_LEVELS = [

    {
        level:
            1,

        name:
            "Escritório Inicial",

        width:
            20,

        depth:
            16,

        cost:
            0,

        requiredCompanyLevel:
            1,

        employeeCapacity:
            8,

        rentPerDay:
            180,

        rooms: [

            "Área Principal",

            "Recepção",

            "Sala de Reunião",

            "Descanso"
        ]
    },


    {
        level:
            2,

        name:
            "Escritório Expandido",

        width:
            26,

        depth:
            20,

        cost:
            30000,

        requiredCompanyLevel:
            2,

        employeeCapacity:
            18,

        rentPerDay:
            420,

        rooms: [

            "Área Principal",

            "Recepção",

            "Sala de Reunião",

            "Descanso",

            "Sala de Servidores"
        ]
    },


    {
        level:
            3,

        name:
            "Sede da Startup",

        width:
            32,

        depth:
            24,

        cost:
            125000,

        requiredCompanyLevel:
            3,

        employeeCapacity:
            35,

        rentPerDay:
            900,

        rooms: [

            "Área Principal",

            "Recepção",

            "Sala de Reunião",

            "Descanso",

            "Sala de Servidores",

            "Estúdio de Design"
        ]
    },


    {
        level:
            4,

        name:
            "Campus Tecnológico",

        width:
            40,

        depth:
            30,

        cost:
            500000,

        requiredCompanyLevel:
            5,

        employeeCapacity:
            70,

        rentPerDay:
            2200,

        rooms: [

            "Área Principal",

            "Recepção",

            "Sala de Reunião",

            "Descanso",

            "Data Center",

            "Estúdio de Design",

            "Laboratório de Pesquisa"
        ]
    },


    {
        level:
            5,

        name:
            "Mega Sede",

        width:
            50,

        depth:
            36,

        cost:
            2000000,

        requiredCompanyLevel:
            6,

        employeeCapacity:
            150,

        rentPerDay:
            6500,

        rooms: [

            "Área Principal",

            "Recepção",

            "Sala de Reunião",

            "Descanso",

            "Data Center",

            "Estúdio de Design",

            "Laboratório de Pesquisa",

            "Área Executiva"
        ]
    }
];


/* ==========================================================
   ACHIEVEMENTS
   ========================================================== */

const ACHIEVEMENTS = {

    "first-hire": {

        id:
            "first-hire",

        name:
            "Primeira contratação",

        description:
            "Contrate seu primeiro novo funcionário.",

        reward:
            1500
    },


    "first-product": {

        id:
            "first-product",

        name:
            "Primeira grande ideia",

        description:
            "Crie seu primeiro produto.",

        reward:
            1500
    },


    "first-launch": {

        id:
            "first-launch",

        name:
            "Dia de lançamento",

        description:
            "Lance seu primeiro produto.",

        reward:
            2500
    },


    "team-10": {

        id:
            "team-10",

        name:
            "Equipe de verdade",

        description:
            "Tenha 10 funcionários ao mesmo tempo.",

        reward:
            5000
    },


    "first-research": {

        id:
            "first-research",

        name:
            "Laboratório ligado",

        description:
            "Conclua a primeira tecnologia.",

        reward:
            3000
    },


    "first-expansion": {

        id:
            "first-expansion",

        name:
            "Precisamos de mais espaço",

        description:
            "Faça a primeira expansão da sede.",

        reward:
            6000
    },


    "million-company": {

        id:
            "million-company",

        name:
            "Clube do milhão",

        description:
            "Alcance valuation de $1.000.000.",

        reward:
            15000
    },


    "million-users": {

        id:
            "million-users",

        name:
            "Um milhão de usuários",

        description:
            "Alcance 1.000.000 de usuários somados.",

        reward:
            25000
    },


    "max-office": {

        id:
            "max-office",

        name:
            "Mega Sede",

        description:
            "Construa a sede de nível máximo.",

        reward:
            50000
    },


    empire: {

        id:
            "empire",

        name:
            "Império Tecnológico",

        description:
            "Alcance o estágio final da empresa.",

        reward:
            100000
    }
};


/* ==========================================================
   COMPETITORS
   ========================================================== */

const COMPETITOR_TEMPLATES = [

    {
        name:
            "FutureAI",

        color:
            "#7f76ff",

        strength:
            1.05
    },


    {
        name:
            "TechNova",

        color:
            "#50c9a8",

        strength:
            0.95
    },


    {
        name:
            "ByteLabs",

        color:
            "#ffad66",

        strength:
            1
    },


    {
        name:
            "CyberSoft",

        color:
            "#58a9ff",

        strength:
            1.1
    }
];


/* ==========================================================
   EMPLOYEE NAMES
   ========================================================== */

const FIRST_NAMES = [

    "Ana",
    "Lucas",
    "Marina",
    "Pedro",
    "Camila",
    "Rafael",
    "Bianca",
    "Gabriel",
    "Julia",
    "Felipe",
    "Sofia",
    "Bruno",
    "Laura",
    "Henrique",
    "Livia",
    "Diego",
    "Nathalia",
    "Mateus",
    "Isabela",
    "Thiago",
    "Beatriz",
    "Arthur",
    "Carolina",
    "Caio"
];


const LAST_NAMES = [

    "Silva",
    "Costa",
    "Souza",
    "Oliveira",
    "Lima",
    "Santos",
    "Pereira",
    "Almeida",
    "Ferreira",
    "Rocha",
    "Martins",
    "Gomes"
];


/* ==========================================================
   GAME SYSTEMS
   ========================================================== */

class GameSystems {


    constructor(
        game
    ) {


        this.game =
            game;


        this.state =
            this.createDefaultState(
                "Nova Labs"
            );


        this.listeners =
            new Set();


        this.paused =
            false;


        this.dayAccumulator =
            0;


        this.autosaveAccumulator =
            0;


        this.candidateRefreshAccumulator =
            0;


        this.initialized =
            false;


        this.lastPublicState =
            null;
    }


    /* ======================================================
       INIT
       ====================================================== */

    async init() {


        if (
            this.initialized
        ) {

            return true;
        }


        const loaded =
            this.loadGame(
                true
            );


        if (
            !loaded
        ) {


            this.state =
                this.createDefaultState(
                    "Nova Labs"
                );


            this.recalculateAll();


            this.restoreWorldFromState();
        }


        this.applySettingsToGame();


        this.ensureCandidates();


        this.emitStateChange(
            "init"
        );


        this.initialized =
            true;


        return true;
    }


    /* ======================================================
       DEFAULT STATE
       ====================================================== */

    createDefaultState(
        companyName = "Nova Labs"
    ) {


        const office =
            this.getOfficeLevelConfig(
                1
            );


        return {

            version:
                SAVE_VERSION,


            company: {

                name:
                    normalizeCompanyName(
                        companyName
                    ),

                level:
                    1,

                stage:
                    COMPANY_STAGES[
                        0
                    ].name,

                reputation:
                    50,

                valuation:
                    25000,

                equity:
                    1
            },


            office: {

                level:
                    office.level,

                name:
                    office.name,

                width:
                    office.width,

                depth:
                    office.depth,

                employeeCapacity:
                    office.employeeCapacity,

                rooms:
                    [
                        ...office.rooms
                    ]
            },


            time: {

                day:
                    1,

                elapsed:
                    0
            },


            employees: [

                this.createEmployee(

                    "programmer",

                    "Ana Silva",

                    {

                        skill:
                            62,

                        happiness:
                            88,

                        energy:
                            100,

                        salary:
                            EMPLOYEE_ROLES
                                .programmer
                                .salary
                    }
                ),


                this.createEmployee(

                    "designer",

                    "Lucas Costa",

                    {

                        skill:
                            60,

                        happiness:
                            86,

                        energy:
                            100,

                        salary:
                            EMPLOYEE_ROLES
                                .designer
                                .salary
                    }
                )
            ],


            candidates:
                [],


            products:
                [],


            constructions:
                [],


            researchedTechnologies:
                [],


            activeResearch:
                null,


            campaigns:
                [],


            investorOffers:
                [],


            competitors:
                this.createCompetitors(),


            achievements:
                [],


            eventLog:
                [],


            finances: {

                cash:
                    25000,

                dailyRevenue:
                    0,

                dailyExpenses:
                    0,

                dailyProfit:
                    0,

                totalRevenue:
                    0,

                totalExpenses:
                    0,

                totalInvested:
                    0,

                ledger:
                    []
            },


            statistics: {

                hires:
                    0,

                fires:
                    0,

                productsCreated:
                    0,

                productsLaunched:
                    0,

                officeExpansions:
                    0,

                campaignsStarted:
                    0,

                technologiesCompleted:
                    0,

                investorDeals:
                    0,

                highestCash:
                    25000,

                highestValuation:
                    25000,

                totalUsersPeak:
                    0
            },


            modifiers: {

                productivityBoostUntil:
                    0,

                outageUntil:
                    0,

                reputationBoostUntil:
                    0
            },


            settings: {

                quality:
                    "medium",

                shadows:
                    true,

                sound:
                    true
            }
        };
    }


    createCompetitors() {


        return COMPETITOR_TEMPLATES
            .map(

                (
                    template,
                    index
                ) => ({


                    id:
                        uid(
                            "competitor"
                        ),


                    name:
                        template.name,


                    color:
                        template.color,


                    strength:
                        template.strength,


                    cash:
                        80000 +
                        index *
                        35000,


                    users:
                        3000 +
                        index *
                        1400,


                    products:
                        1 +
                        (
                            index >
                                1

                                ? 1

                                : 0
                        ),


                    quality:
                        55 +
                        index *
                        5,


                    reputation:
                        42 +
                        index *
                        4,


                    marketing:
                        0,


                    valuation:
                        120000 +
                        index *
                        85000

                })
            );
    }


    /* ======================================================
       PUBLIC STATE
       ====================================================== */

    getPublicState() {


        this.recalculateAll();


        this.lastPublicState =
            deepClone(
                this.state
            );


        return this.lastPublicState;
    }


    subscribe(
        callback
    ) {


        if (
            typeof callback !==
            "function"
        ) {


            return () => { };
        }


        this.listeners.add(
            callback
        );


        try {


            callback(
                this.getPublicState()
            );


        }
        catch (
        error
        ) {


            console.error(

                "Erro no listener inicial de GameSystems:",

                error
            );
        }


        return () => {


            this.listeners.delete(
                callback
            );
        };
    }


    emitStateChange(
        reason = "state"
    ) {


        this.recalculateAll();


        const snapshot =
            deepClone(
                this.state
            );


        this.lastPublicState =
            snapshot;


        this.listeners
            .forEach(

                listener => {


                    try {


                        listener(
                            snapshot,
                            reason
                        );


                    }
                    catch (
                    error
                    ) {


                        console.error(

                            "Erro em listener do GameSystems:",

                            error
                        );
                    }
                }
            );


        window.dispatchEvent(

            new CustomEvent(

                "startup:state-changed",

                {

                    detail: {

                        reason,

                        state:
                            snapshot
                    }
                }
            )
        );
    }


    /* ======================================================
       UPDATE
       ====================================================== */

    update(
        delta
    ) {


        if (
            this.paused
        ) {

            return;
        }


        const dt =
            clamp(

                safeNumber(
                    delta
                ),

                0,

                0.25
            );


        if (
            dt <=
            0
        ) {

            return;
        }


        this.state
            .time
            .elapsed +=
            dt;


        this.dayAccumulator +=
            dt;


        this.autosaveAccumulator +=
            dt;


        this.candidateRefreshAccumulator +=
            dt;


        this.updateEmployeeVitals(
            dt
        );


        this.updateProductDevelopment(
            dt
        );


        this.updateResearch(
            dt
        );


        if (
            this.dayAccumulator >=
            DAY_DURATION_SECONDS
        ) {


            while (
                this.dayAccumulator >=
                DAY_DURATION_SECONDS
            ) {


                this.dayAccumulator -=
                    DAY_DURATION_SECONDS;


                this.processDay();
            }
        }


        if (
            this.autosaveAccumulator >=
            AUTOSAVE_INTERVAL_SECONDS
        ) {


            this.autosaveAccumulator =
                0;


            this.saveGame(
                true
            );
        }


        if (
            this.candidateRefreshAccumulator >=
            75
        ) {


            this.candidateRefreshAccumulator =
                0;


            this.refreshEmployeeCandidates(
                false
            );
        }
    }


    setPaused(
        value
    ) {


        this.paused =
            Boolean(
                value
            );
    }


    /* ======================================================
       EMPLOYEES
       ====================================================== */

    createEmployee(
        roleId,
        name = null,
        overrides = {}
    ) {


        const role =
            EMPLOYEE_ROLES[
            roleId
            ]

            ||

            EMPLOYEE_ROLES
                .programmer;


        const skill =
            clamp(

                safeNumber(

                    overrides.skill,

                    randomBetween(
                        48,
                        78
                    )
                ),

                1,

                100
            );


        return {

            id:
                overrides.id

                ||

                uid(
                    "employee"
                ),


            name:
                name

                ||

                `${choose(
                    FIRST_NAMES
                )} ${choose(
                    LAST_NAMES
                )}`,


            role:
                role.id,


            roleName:
                role.name,


            salary:
                Math.round(

                    safeNumber(

                        overrides.salary,

                        role.salary *
                        randomBetween(
                            0.92,
                            1.18
                        )
                    )
                ),


            level:
                Math.max(

                    1,

                    Math.floor(

                        safeNumber(
                            overrides.level,
                            1
                        )
                    )
                ),


            xp:
                Math.max(

                    0,

                    safeNumber(
                        overrides.xp,
                        0
                    )
                ),


            skill,


            productivity:
                clamp(

                    safeNumber(

                        overrides.productivity,

                        0.9 +
                        skill /
                        250
                    ),

                    0.4,

                    2.5
                ),


            happiness:
                clamp(

                    safeNumber(
                        overrides.happiness,
                        82
                    ),

                    0,

                    100
                ),


            energy:
                clamp(

                    safeNumber(
                        overrides.energy,
                        100
                    ),

                    0,

                    100
                ),


            activity:
                overrides.activity

                ||

                "Disponível"
        };
    }


    createCandidate() {


        const roleId =
            choose(
                Object.keys(
                    EMPLOYEE_ROLES
                )
            );


        const role =
            EMPLOYEE_ROLES[
            roleId
            ];


        const level =
            Math.random() <
                0.15

                ? 2

                : 1;


        const skill =
            randomBetween(

                level ===
                    2

                    ? 62

                    : 46,

                level ===
                    2

                    ? 88

                    : 78
            );


        const employee =
            this.createEmployee(

                roleId,

                null,

                {

                    level,

                    skill,

                    salary:

                        role.salary *
                        randomBetween(
                            0.92,
                            1.28
                        )
                }
            );


        return {

            ...employee,


            id:
                uid(
                    "candidate"
                ),


            signingBonus:
                Math.round(

                    role.hiringFee *
                    (
                        0.85 +
                        skill /
                        160
                    )
                )
        };
    }


    ensureCandidates() {


        if (
            !Array.isArray(
                this.state.candidates
            )
        ) {


            this.state.candidates =
                [];
        }


        while (
            this.state
                .candidates
                .length <
            5
        ) {


            this.state
                .candidates
                .push(

                    this.createCandidate()
                );
        }
    }


    getEmployeeCandidates() {


        this.ensureCandidates();


        return deepClone(
            this.state.candidates
        );
    }


    refreshEmployeeCandidates(
        emit = true
    ) {


        this.state.candidates =
            Array.from(

                {
                    length:
                        5
                },

                () =>
                    this.createCandidate()
            );


        if (
            emit
        ) {


            this.emitStateChange(
                "candidates-refreshed"
            );
        }


        return this.getEmployeeCandidates();
    }


    getEmployeeById(
        employeeId
    ) {


        return this.state
            .employees
            .find(

                employee =>
                    employee.id ===
                    employeeId
            )

            ||

            null;
    }


    getEmployeeCapacity() {


        return this.state
            .office
            .employeeCapacity;
    }


    hireEmployee(
        candidateId
    ) {


        if (
            this.state
                .employees
                .length >=
            this.getEmployeeCapacity()
        ) {


            return this.fail(

                "Escritório lotado",

                "Expanda a sede antes de contratar mais funcionários."
            );
        }


        const index =
            this.state
                .candidates
                .findIndex(

                    candidate =>
                        candidate.id ===
                        candidateId
                );


        if (
            index <
            0
        ) {


            return this.fail(

                "Candidato indisponível",

                "Atualize a lista de candidatos e tente novamente."
            );
        }


        const candidate =
            this.state
                .candidates[
            index
            ];


        const role =
            EMPLOYEE_ROLES[
            candidate.role
            ];


        const fee =
            safeNumber(

                candidate.signingBonus,

                role
                    ?.hiringFee

                ||

                0
            );


        if (
            !this.spend(
                fee,
                "Contratação"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        const employee = {

            ...candidate,


            id:
                uid(
                    "employee"
                ),


            activity:
                "Conhecendo o escritório"
        };


        delete employee.signingBonus;


        this.state
            .employees
            .push(
                employee
            );


        this.state
            .candidates
            .splice(
                index,
                1
            );


        this.state
            .candidates
            .push(

                this.createCandidate()
            );


        this.state
            .statistics
            .hires +=
            1;


        this.game
            ?.addEmployee3D?.(
                employee
            );


        this.logEvent(

            "Nova contratação",

            `${employee.name} entrou como ${employee.roleName}.`,

            "success"
        );


        this.checkAchievements();


        this.emitStateChange(
            "employee-hired"
        );


        return {

            success:
                true,

            employee:
                deepClone(
                    employee
                )
        };
    }


    fireEmployee(
        employeeId
    ) {


        const index =
            this.state
                .employees
                .findIndex(

                    employee =>
                        employee.id ===
                        employeeId
                );


        if (
            index <
            0
        ) {


            return {

                success:
                    false,

                message:
                    "Funcionário não encontrado."
            };
        }


        const employee =
            this.state
                .employees[
            index
            ];


        const severance =
            Math.round(

                employee.salary *
                0.5
            );


        if (
            !this.spend(
                severance,
                "Rescisão"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente para pagar a rescisão."
            };
        }


        this.state
            .employees
            .splice(
                index,
                1
            );


        this.state
            .statistics
            .fires +=
            1;


        this.game
            ?.removeEmployee3D?.(
                employeeId
            );


        this.logEvent(

            "Funcionário desligado",

            `${employee.name} deixou a empresa. Rescisão: $${severance.toLocaleString(
                "pt-BR"
            )}.`,

            "warning"
        );


        this.emitStateChange(
            "employee-fired"
        );


        return {

            success:
                true,

            employee:
                deepClone(
                    employee
                ),

            severance
        };
    }


    updateEmployeeVitals(
        delta
    ) {


        const coffeeCount =
            this.countConstruction(
                "coffee"
            );


        const sofaCount =
            this.countConstruction(
                "sofa"
            );


        const plantCount =
            this.countConstruction(
                "plant"
            );


        const managerCount =
            this.countRole(
                "manager"
            );


        const day =
            this.state
                .time
                .day;


        for (
            const employee
            of this.state.employees
        ) {


            const energyDrain =
                0.19 *
                delta;


            let happinessDelta =
                0;


            if (
                employee.energy <
                35
            ) {


                employee.activity =
                    "Fazendo uma pausa";


                employee.energy +=
                    (
                        1.4 +
                        coffeeCount *
                        0.18 +
                        sofaCount *
                        0.12
                    ) *
                    delta;
            }
            else {


                employee.energy -=
                    energyDrain;


                if (
                    employee.role ===
                    "researcher"

                    &&

                    this.state
                        .activeResearch
                ) {


                    employee.activity =
                        "Pesquisando";
                }
                else if (
                    this.state
                        .products
                        .some(

                            product =>
                                product.status ===
                                "development"
                        )
                ) {


                    employee.activity =
                        "Trabalhando em produto";
                }
                else if (
                    this.state
                        .campaigns
                        .length

                    &&

                    [
                        "marketing",
                        "sales"
                    ].includes(
                        employee.role
                    )
                ) {


                    employee.activity =
                        "Acompanhando campanha";
                }
                else {


                    employee.activity =
                        choose(
                            [

                                "Trabalhando",

                                "Revisando tarefas",

                                "Conversando com a equipe"
                            ]
                        );
                }
            }


            const salaryStress =
                employee.salary >
                    8000

                    ? 0.002

                    : 0;


            happinessDelta +=
                (
                    plantCount *
                    0.002 +

                    sofaCount *
                    0.002 +

                    managerCount *
                    0.003 -

                    salaryStress
                ) *
                delta;


            if (
                this.state
                    .finances
                    .cash <
                0
            ) {


                happinessDelta -=
                    0.03 *
                    delta;
            }


            employee.energy =
                clamp(
                    employee.energy,
                    0,
                    100
                );


            employee.happiness =
                clamp(

                    employee.happiness +
                    happinessDelta,

                    20,

                    100
                );


            const energyFactor =
                0.55 +
                employee.energy /
                220;


            const happinessFactor =
                0.70 +
                employee.happiness /
                300;


            const managerFactor =
                1 +
                Math.min(
                    0.25,
                    managerCount *
                    0.04
                );


            const techFactor =
                this.hasTechnology(
                    "robotics"
                )

                    ? 1.20

                    : 1;


            const eventFactor =
                day <=
                    this.state
                        .modifiers
                        .productivityBoostUntil

                    ? 1.15

                    : 1;


            employee.productivity =
                clamp(

                    (
                        0.65 +
                        employee.skill /
                        170
                    )

                    *

                    energyFactor

                    *

                    happinessFactor

                    *

                    managerFactor

                    *

                    techFactor

                    *

                    eventFactor,

                    0.35,

                    2.5
                );


            employee.xp +=
                employee.productivity *
                delta *
                0.20;


            this.processEmployeeLevelUp(
                employee
            );
        }
    }


    processEmployeeLevelUp(
        employee
    ) {


        let required =
            employee.level *
            100;


        while (
            employee.xp >=
            required
        ) {


            employee.xp -=
                required;


            employee.level +=
                1;


            employee.skill =
                clamp(

                    employee.skill +
                    randomBetween(
                        2,
                        5
                    ),

                    1,

                    100
                );


            employee.salary =
                Math.round(

                    employee.salary *
                    1.035
                );


            required =
                employee.level *
                100;
        }
    }


    countRole(
        roleId
    ) {


        return this.state
            .employees
            .filter(

                employee =>
                    employee.role ===
                    roleId
            )
            .length;
    }


    rolePower(
        roleId
    ) {


        return this.state
            .employees

            .filter(

                employee =>
                    employee.role ===
                    roleId
            )

            .reduce(

                (
                    sum,
                    employee
                ) => {


                    return (
                        sum +
                        employee.productivity *
                        (
                            0.55 +
                            employee.skill /
                            120
                        )
                    );

                },

                0
            );
    }


    /* ======================================================
       PRODUCTS
       ====================================================== */

    createProduct(
        typeId,
        name
    ) {


        const type =
            PRODUCT_TYPES[
            typeId
            ];


        if (
            !type
        ) {


            return this.fail(

                "Produto inválido",

                "Categoria de produto não encontrada."
            );
        }


        if (
            this.state
                .company
                .level <
            type.unlockLevel
        ) {


            return this.fail(

                "Produto bloqueado",

                `Alcance o nível ${type.unlockLevel} da empresa.`
            );
        }


        if (
            type.requiredTechnology

            &&

            !this.hasTechnology(
                type.requiredTechnology
            )
        ) {


            return this.fail(

                "Tecnologia necessária",

                `Pesquise ${TECHNOLOGIES[
                    type.requiredTechnology
                ]?.name || type.requiredTechnology} primeiro.`
            );
        }


        if (
            !this.spend(
                type.cost,
                "Desenvolvimento de produto"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        const machineLearningBonus =
            this.hasTechnology(
                "machine-learning"
            )

                ? 8

                : 0;


        const product = {

            id:
                uid(
                    "product"
                ),


            type:
                type.id,


            name:
                String(
                    name ||
                    type.name
                )
                    .trim()
                    .slice(
                        0,
                        40
                    )

                ||

                type.name,


            status:
                "development",


            progress:
                0,


            requiredProgress:
                type.requiredProgress,


            quality:
                clamp(

                    type.baseQuality +

                    machineLearningBonus +

                    randomBetween(
                        -4,
                        5
                    ),

                    20,

                    90
                ),


            popularity:
                5,


            users:
                0,


            revenuePerDay:
                0,


            costPerDay:
                0,


            rating:
                0,


            createdDay:
                this.state
                    .time
                    .day,


            launchedDay:
                null
        };


        this.state
            .products
            .push(
                product
            );


        this.state
            .statistics
            .productsCreated +=
            1;


        this.logEvent(

            "Novo produto",

            `${product.name} entrou em desenvolvimento.`,

            "info"
        );


        this.checkAchievements();


        this.emitStateChange(
            "product-created"
        );


        return {

            success:
                true,

            product:
                deepClone(
                    product
                )
        };
    }


    updateProductDevelopment(
        delta
    ) {


        const developing =
            this.state
                .products
                .filter(

                    product =>
                        product.status ===
                        "development"
                );


        if (
            !developing.length

            ||

            !this.state
                .employees
                .length
        ) {

            return;
        }


        const programmerPower =
            this.rolePower(
                "programmer"
            );


        const designerPower =
            this.rolePower(
                "designer"
            );


        const managerPower =
            this.rolePower(
                "manager"
            );


        const researcherPower =
            this.rolePower(
                "researcher"
            );


        const techBoost =
            this.hasTechnology(
                "artificial-intelligence"
            )

                ? 1.15

                : 1;


        const split =
            developing.length;


        const totalPower =

            programmerPower *
            1

            +

            designerPower *
            0.45

            +

            managerPower *
            0.30

            +

            researcherPower *
            0.12;


        if (
            totalPower <=
            0
        ) {

            return;
        }


        for (
            const product
            of developing
        ) {


            const rawWorkPerSecond =
                (
                    0.30 +
                    totalPower *
                    0.08
                )

                *

                techBoost

                /

                split;


            const progressPerSecond =
                rawWorkPerSecond

                *

                (
                    100 /
                    Math.max(
                        100,
                        product.requiredProgress
                    )
                );


            product.progress =
                clamp(

                    product.progress +

                    progressPerSecond *
                    delta,

                    0,

                    100
                );


            const qualityGain =
                (
                    designerPower *
                    0.004

                    +

                    programmerPower *
                    0.0015
                )

                *

                delta

                /

                split;


            product.quality =
                clamp(

                    product.quality +
                    qualityGain,

                    1,

                    100
                );
        }
    }


    launchProduct(
        productId
    ) {


        const product =
            this.state
                .products
                .find(

                    item =>
                        item.id ===
                        productId
                );


        if (
            !product
        ) {


            return {

                success:
                    false,

                message:
                    "Produto não encontrado."
            };
        }


        if (
            product.status !==
            "development"
        ) {


            return {

                success:
                    false,

                message:
                    "Produto já lançado."
            };
        }


        if (
            product.progress <
            100
        ) {


            return this.fail(

                "Produto incompleto",

                "Conclua o desenvolvimento antes de lançar."
            );
        }


        product.status =
            "launched";


        product.progress =
            100;


        product.launchedDay =
            this.state
                .time
                .day;


        product.popularity =
            clamp(

                product.popularity +

                12 +

                this.state
                    .company
                    .reputation *
                0.08,

                1,

                100
            );


        product.users =
            Math.round(

                80 +

                product.quality *
                8 +

                this.state
                    .company
                    .reputation *
                5
            );


        product.rating =
            clamp(

                product.quality /
                20,

                1,

                5
            );


        this.state
            .company
            .reputation =
            clamp(

                this.state
                    .company
                    .reputation +
                3,

                0,

                100
            );


        this.state
            .statistics
            .productsLaunched +=
            1;


        this.logEvent(

            "🚀 Produto lançado",

            `${product.name} chegou ao mercado.`,

            "success"
        );


        this.checkAchievements();


        this.emitStateChange(
            "product-launched"
        );


        return {

            success:
                true,

            product:
                deepClone(
                    product
                )
        };
    }


    maintainProduct(
        productId
    ) {


        const product =
            this.state
                .products
                .find(

                    item =>
                        item.id ===
                        productId
                );


        if (
            !product

            ||

            product.status !==
            "launched"
        ) {


            return {

                success:
                    false,

                message:
                    "Produto indisponível para manutenção."
            };
        }


        if (
            product.quality >=
            100
        ) {


            return {

                success:
                    false,

                message:
                    "Qualidade já está no máximo."
            };
        }


        if (
            !this.spend(
                1200,
                "Manutenção de produto"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        product.quality =
            clamp(

                product.quality +
                8,

                0,

                100
            );


        product.rating =
            clamp(

                product.quality /
                20,

                1,

                5
            );


        this.emitStateChange(
            "product-maintained"
        );


        return {

            success:
                true,

            product:
                deepClone(
                    product
                )
        };
    }


    /* ======================================================
       CONSTRUCTION
       ====================================================== */

    canPurchaseBuildItem(
        typeId
    ) {


        const item =
            BUILD_ITEMS[
            typeId
            ];


        if (
            !item
        ) {

            return false;
        }


        if (
            this.state
                .company
                .level <
            item.unlockLevel
        ) {

            return false;
        }


        return (
            this.state
                .finances
                .cash >=
            item.cost
        );
    }


    purchaseBuildItem(
        typeId,
        transform = {}
    ) {


        const item =
            BUILD_ITEMS[
            typeId
            ];


        if (
            !item
        ) {


            return {

                success:
                    false,

                message:
                    "Objeto de construção inválido."
            };
        }


        if (
            this.state
                .company
                .level <
            item.unlockLevel
        ) {


            return {

                success:
                    false,

                message:
                    `Objeto liberado no nível ${item.unlockLevel}.`
            };
        }


        if (
            !this.spend(
                item.cost,
                "Construção"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        const construction = {

            id:
                uid(
                    "build"
                ),


            type:
                typeId,


            x:
                safeNumber(
                    transform.x
                ),


            z:
                safeNumber(
                    transform.z
                ),


            rotation:
                safeNumber(
                    transform.rotation
                )
        };


        this.state
            .constructions
            .push(
                construction
            );


        this.emitStateChange(
            "build-purchased"
        );


        return {

            success:
                true,

            construction:
                deepClone(
                    construction
                )
        };
    }


    countConstruction(
        typeId
    ) {


        return this.state
            .constructions
            .filter(

                item =>
                    item.type ===
                    typeId
            )
            .length;
    }


    /* ======================================================
       OFFICE EXPANSION
       ====================================================== */

    getOfficeLevelConfig(
        level
    ) {


        const number =
            clamp(

                Math.floor(

                    safeNumber(
                        level,
                        1
                    )
                ),

                1,

                OFFICE_LEVELS.length
            );


        return deepClone(

            OFFICE_LEVELS[
            number -
            1
            ]
        );
    }


    getOfficeExpansionInfo() {


        const current =
            this.getOfficeLevelConfig(

                this.state
                    .office
                    .level
            );


        const next =
            OFFICE_LEVELS.find(

                item =>
                    item.level ===
                    current.level +
                    1
            )

            ||

            null;


        if (
            !next
        ) {


            return {

                current,

                next:
                    null,

                canExpand:
                    false,

                reason:
                    "A sede já está no nível máximo."
            };
        }


        let reason =
            "";


        if (
            this.state
                .company
                .level <
            next.requiredCompanyLevel
        ) {


            reason =
                `Requer empresa nível ${next.requiredCompanyLevel}.`;
        }
        else if (
            this.state
                .finances
                .cash <
            next.cost
        ) {


            reason =
                `Você precisa de ${this.moneyLabel(
                    next.cost
                )} para expandir.`;
        }


        return {

            current,

            next:
                deepClone(
                    next
                ),

            canExpand:
                !reason,

            reason
        };
    }


    canExpandOffice() {


        return this
            .getOfficeExpansionInfo()
            .canExpand;
    }


    expandOffice() {


        const info =
            this.getOfficeExpansionInfo();


        if (
            !info.next
        ) {


            return this.fail(

                "Expansão",

                "A sede já está no nível máximo."
            );
        }


        if (
            !info.canExpand
        ) {


            return this.fail(

                "Expansão bloqueada",

                info.reason
            );
        }


        if (
            !this.spend(
                info.next.cost,
                "Expansão da sede"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        const previousLevel =
            this.state
                .office
                .level;


        this.state.office = {

            level:
                info.next.level,

            name:
                info.next.name,

            width:
                info.next.width,

            depth:
                info.next.depth,

            employeeCapacity:
                info.next.employeeCapacity,

            rooms:
                [
                    ...info.next.rooms
                ]
        };


        this.state
            .statistics
            .officeExpansions +=
            1;


        this.state
            .company
            .reputation =
            clamp(

                this.state
                    .company
                    .reputation +
                4,

                0,

                100
            );


        this.logEvent(

            "🏢 Sede expandida",

            `${info.next.name} foi concluída. Capacidade para ${info.next.employeeCapacity} funcionários.`,

            "success"
        );


        this.checkAchievements();


        this.recalculateAll();


        const detail = {

            previousLevel,

            office:
                deepClone(
                    this.state.office
                ),

            configuration:
                deepClone(
                    info.next
                )
        };


        window.dispatchEvent(

            new CustomEvent(

                "startup:office-expanded",

                {
                    detail
                }
            )
        );


        this.emitStateChange(
            "office-expanded"
        );


        this.saveGame(
            true
        );


        return {

            success:
                true,

            office:
                deepClone(
                    this.state.office
                ),

            previousLevel
        };
    }


    /* ======================================================
       RESEARCH
       ====================================================== */

    hasTechnology(
        technologyId
    ) {


        return this.state
            .researchedTechnologies
            .includes(
                technologyId
            );
    }


    startResearch(
        technologyId
    ) {


        const technology =
            TECHNOLOGIES[
            technologyId
            ];


        if (
            !technology
        ) {


            return this.fail(

                "Pesquisa inválida",

                "Tecnologia não encontrada."
            );
        }


        if (
            this.hasTechnology(
                technologyId
            )
        ) {


            return this.fail(

                "Pesquisa concluída",

                "Essa tecnologia já foi pesquisada."
            );
        }


        if (
            this.state
                .activeResearch
        ) {


            return this.fail(

                "Pesquisa em andamento",

                "Conclua a pesquisa atual primeiro."
            );
        }


        if (
            this.state
                .company
                .level <
            technology.unlockLevel
        ) {


            return this.fail(

                "Pesquisa bloqueada",

                `Alcance o nível ${technology.unlockLevel} da empresa.`
            );
        }


        const missing =
            technology
                .prerequisites
                .filter(

                    id =>
                        !this.hasTechnology(
                            id
                        )
                );


        if (
            missing.length
        ) {


            return this.fail(

                "Pré-requisitos pendentes",

                `Pesquise primeiro: ${missing
                    .map(

                        id =>
                            TECHNOLOGIES[
                                id
                            ]?.name

                            ||

                            id
                    )
                    .join(
                        ", "
                    )}.`
            );
        }


        if (
            !this.spend(
                technology.cost,
                "Pesquisa"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        this.state.activeResearch = {

            technologyId:
                technology.id,

            name:
                technology.name,

            progress:
                0,

            pointsRequired:
                technology.points,

            startedDay:
                this.state
                    .time
                    .day
        };


        this.logEvent(

            "Pesquisa iniciada",

            `${technology.name} entrou no laboratório.`,

            "info"
        );


        this.emitStateChange(
            "research-started"
        );


        return {

            success:
                true,

            research:
                deepClone(
                    this.state.activeResearch
                )
        };
    }


    updateResearch(
        delta
    ) {


        const research =
            this.state
                .activeResearch;


        if (
            !research
        ) {

            return;
        }


        const researcherPower =
            this.rolePower(
                "researcher"
            );


        const managerPower =
            this.rolePower(
                "manager"
            );


        if (
            researcherPower <=
            0
        ) {

            return;
        }


        const rate =
            0.20

            +

            researcherPower *
            0.16

            +

            managerPower *
            0.02;


        research.progress +=
            rate *
            delta;


        if (
            research.progress >=
            research.pointsRequired
        ) {


            this.completeResearch();
        }
    }


    completeResearch() {


        const research =
            this.state
                .activeResearch;


        if (
            !research
        ) {

            return;
        }


        const technologyId =
            research
                .technologyId;


        const technology =
            TECHNOLOGIES[
            technologyId
            ];


        if (
            !this.state
                .researchedTechnologies
                .includes(
                    technologyId
                )
        ) {


            this.state
                .researchedTechnologies
                .push(
                    technologyId
                );
        }


        this.state.activeResearch =
            null;


        this.state
            .statistics
            .technologiesCompleted +=
            1;


        this.state
            .company
            .reputation =
            clamp(

                this.state
                    .company
                    .reputation +
                2,

                0,

                100
            );


        this.logEvent(

            "⌬ Pesquisa concluída",

            `${technology?.name || research.name} foi desbloqueada.`,

            "success"
        );


        this.checkAchievements();


        this.emitStateChange(
            "research-completed"
        );
    }


    /* ======================================================
       MARKETING
       ====================================================== */

    startMarketingCampaign(
        campaignId,
        productId
    ) {


        const campaign =
            CAMPAIGNS[
            campaignId
            ];


        const product =
            this.state
                .products
                .find(

                    item =>
                        item.id ===
                        productId
                );


        if (
            !campaign
        ) {


            return this.fail(

                "Campanha inválida",

                "Tipo de campanha não encontrado."
            );
        }


        if (
            !product

            ||

            product.status !==
            "launched"
        ) {


            return this.fail(

                "Produto indisponível",

                "Escolha um produto já lançado."
            );
        }


        if (
            this.state
                .company
                .level <
            campaign.unlockLevel
        ) {


            return this.fail(

                "Campanha bloqueada",

                `Libera no nível ${campaign.unlockLevel}.`
            );
        }


        const duplicate =
            this.state
                .campaigns
                .some(

                    item => {

                        return (

                            item.type ===
                            campaignId

                            &&

                            item.productId ===
                            productId
                        );
                    }
                );


        if (
            duplicate
        ) {


            return this.fail(

                "Campanha já ativa",

                "Esse produto já possui esta campanha em andamento."
            );
        }


        if (
            !this.spend(
                campaign.cost,
                "Marketing"
            )
        ) {


            return {

                success:
                    false,

                message:
                    "Caixa insuficiente."
            };
        }


        const active = {

            id:
                uid(
                    "campaign"
                ),

            type:
                campaign.id,

            productId,

            daysRemaining:
                campaign.duration,

            startedDay:
                this.state
                    .time
                    .day
        };


        this.state
            .campaigns
            .push(
                active
            );


        this.state
            .statistics
            .campaignsStarted +=
            1;


        this.logEvent(

            "Campanha iniciada",

            `${campaign.name} começou para ${product.name}.`,

            "info"
        );


        this.emitStateChange(
            "campaign-started"
        );


        return {

            success:
                true,

            campaign:
                deepClone(
                    active
                )
        };
    }


    /* ======================================================
       INVESTORS
       ====================================================== */

    generateInvestorOffers(
        count = 3
    ) {


        if (
            this.state
                .investorOffers
                .length
        ) {


            return deepClone(
                this.state.investorOffers
            );
        }


        const investorNames = [

            "Northstar Ventures",

            "Aurora Capital",

            "Vertex Partners",

            "Blue Ocean Fund",

            "Atlas Growth",

            "Quantum Ventures"
        ];


        const valuation =
            Math.max(

                50000,

                this.state
                    .company
                    .valuation
            );


        const amountBase =
            Math.max(

                15000,

                valuation *
                randomBetween(
                    0.08,
                    0.16
                )
            );


        this.state.investorOffers =
            Array.from(

                {

                    length:
                        clamp(
                            count,
                            1,
                            4
                        )
                },

                (
                    _,
                    index
                ) => {


                    const amount =
                        Math.round(

                            amountBase *
                            randomBetween(
                                0.75,
                                1.45
                            )
                        );


                    const impliedValuation =
                        Math.round(

                            valuation *
                            randomBetween(
                                0.85,
                                1.35
                            )
                        );


                    const stake =
                        clamp(

                            amount

                            /

                            Math.max(

                                amount +
                                impliedValuation,

                                1
                            ),

                            0.015,

                            0.22
                        );


                    return {

                        id:
                            uid(
                                "offer"
                            ),

                        investor:
                            investorNames[
                            index %
                            investorNames.length
                            ],

                        amount,

                        stake,

                        valuation:
                            impliedValuation,

                        expiresDay:
                            this.state
                                .time
                                .day +
                            7
                    };
                }
            );


        this.emitStateChange(
            "investor-offers"
        );


        return deepClone(
            this.state.investorOffers
        );
    }


    acceptInvestorOffer(
        offerId
    ) {


        const offer =
            this.state
                .investorOffers
                .find(

                    item =>
                        item.id ===
                        offerId
                );


        if (
            !offer
        ) {


            return this.fail(

                "Proposta indisponível",

                "A proposta não existe mais."
            );
        }


        if (
            this.state
                .company
                .equity -
            offer.stake <
            0.20
        ) {


            return this.fail(

                "Participação muito baixa",

                "Você precisa manter pelo menos 20% da empresa."
            );
        }


        this.state
            .finances
            .cash +=
            offer.amount;


        this.state
            .company
            .equity =
            clamp(

                this.state
                    .company
                    .equity -
                offer.stake,

                0.20,

                1
            );


        this.state
            .statistics
            .investorDeals +=
            1;


        this.state.investorOffers =
            [];


        this.logEvent(

            "Investimento recebido",

            `${offer.investor} investiu ${this.moneyLabel(
                offer.amount
            )}.`,

            "success"
        );


        this.emitStateChange(
            "investor-accepted"
        );


        this.saveGame(
            true
        );


        return {

            success:
                true,

            offer:
                deepClone(
                    offer
                )
        };
    }


    rejectInvestorOffer(
        offerId
    ) {


        const before =
            this.state
                .investorOffers
                .length;


        this.state.investorOffers =
            this.state
                .investorOffers
                .filter(

                    item =>
                        item.id !==
                        offerId
                );


        if (
            before ===
            this.state
                .investorOffers
                .length
        ) {


            return false;
        }


        this.emitStateChange(
            "investor-rejected"
        );


        return true;
    }


    /* ======================================================
       DAY
       ====================================================== */

    processDay() {


        this.state
            .time
            .day +=
            1;


        this.processCampaignDay();


        this.processCompetitorsDay();


        this.processProductsDay();


        this.processFinancesDay();


        this.expireInvestorOffers();


        this.processRandomEvent();


        this.updateCompanyProgression();


        this.checkAchievements();


        this.state
            .statistics
            .highestCash =
            Math.max(

                this.state
                    .statistics
                    .highestCash,

                this.state
                    .finances
                    .cash
            );


        this.state
            .statistics
            .highestValuation =
            Math.max(

                this.state
                    .statistics
                    .highestValuation,

                this.state
                    .company
                    .valuation
            );


        const totalUsers =
            this.getTotalUsers();


        this.state
            .statistics
            .totalUsersPeak =
            Math.max(

                this.state
                    .statistics
                    .totalUsersPeak,

                totalUsers
            );


        if (
            this.state
                .time
                .day %
            5 ===
            0
        ) {


            this.saveGame(
                true
            );
        }


        this.emitStateChange(
            "day-ended"
        );
    }


    processCampaignDay() {


        for (
            const active
            of this.state.campaigns
        ) {


            const product =
                this.state
                    .products
                    .find(

                        item =>
                            item.id ===
                            active.productId
                    );


            const campaign =
                CAMPAIGNS[
                active.type
                ];


            if (
                product

                &&

                campaign
            ) {


                const marketingPower =
                    this.rolePower(
                        "marketing"
                    );


                product.popularity =
                    clamp(

                        product.popularity +

                        campaign.popularity *
                        (
                            1 +
                            marketingPower *
                            0.04
                        ),

                        1,

                        100
                    );
            }


            active.daysRemaining -=
                1;
        }


        this.state.campaigns =
            this.state
                .campaigns
                .filter(

                    active =>
                        active.daysRemaining >
                        0
                );
    }


    processProductsDay() {


        const launched =
            this.state
                .products
                .filter(

                    product =>
                        product.status ===
                        "launched"
                );


        if (
            !launched.length
        ) {

            return;
        }


        const marketingPower =
            this.rolePower(
                "marketing"
            );


        const salesPower =
            this.rolePower(
                "sales"
            );


        const competitorsUsers =
            this.state
                .competitors
                .reduce(

                    (
                        sum,
                        competitor
                    ) =>

                        sum +
                        competitor.users,

                    0
                );


        const competitionFactor =
            clamp(

                1 /
                (
                    1 +
                    competitorsUsers /
                    850000
                ),

                0.18,

                1
            );


        const bigDataBonus =
            this.hasTechnology(
                "big-data"
            )

                ? 1.20

                : 1;


        const cloudRevenueBonus =
            this.hasTechnology(
                "cloud"
            )

                ? 1.10

                : 1;


        const quantumBonus =
            this.hasTechnology(
                "quantum"
            )

                ? 1.30

                : 1;


        const vrBonus =
            this.hasTechnology(
                "vr"
            )

                ? 1.25

                : 1;


        const outage =
            this.state
                .time
                .day <=
            this.state
                .modifiers
                .outageUntil;


        const totalOnline =
            launched
                .filter(

                    product =>
                        PRODUCT_TYPES[
                            product.type
                        ]?.online
                )
                .length;


        const capacityPerOnlineProduct =
            this.getServerCapacity()

            /

            Math.max(
                1,
                totalOnline
            );


        for (
            const product
            of launched
        ) {


            const type =
                PRODUCT_TYPES[
                product.type
                ];


            if (
                !type
            ) {

                continue;
            }


            const campaignReach =
                this.state
                    .campaigns

                    .filter(

                        active =>
                            active.productId ===
                            product.id
                    )

                    .reduce(

                        (
                            sum,
                            active
                        ) =>

                            sum +
                            (
                                CAMPAIGNS[
                                    active.type
                                ]?.reach

                                ||

                                0
                            ),

                        0
                    );


            const qualityStrength =
                product.quality *
                0.75;


            const popularityStrength =
                product.popularity *
                1.20;


            const teamStrength =
                marketingPower *
                5

                +

                salesPower *
                8;


            const reputationStrength =
                this.state
                    .company
                    .reputation *
                0.35;


            const grossAcquisition =

                25

                +

                qualityStrength

                +

                popularityStrength

                +

                teamStrength

                +

                reputationStrength

                +

                campaignReach;


            const acquired =
                grossAcquisition

                *

                competitionFactor

                *

                bigDataBonus;


            const churnRate =
                0.008

                +

                (
                    100 -
                    product.quality
                )

                *

                0.00015;


            const churn =
                product.users *
                churnRate;


            let nextUsers =
                Math.max(

                    0,

                    product.users +
                    acquired -
                    churn
                );


            if (
                type.online
            ) {


                nextUsers =
                    Math.min(

                        nextUsers,

                        capacityPerOnlineProduct
                    );
            }


            product.users =
                Math.round(
                    nextUsers
                );


            product.popularity =
                clamp(

                    product.popularity

                    +

                    (
                        campaignReach >
                            0

                            ? 0.55

                            : -0.08
                    )

                    +

                    marketingPower *
                    0.025,

                    1,

                    100
                );


            const qualityRevenue =
                0.55 +
                product.quality /
                180;


            const gameVrBonus =
                product.type ===
                    "game"

                    &&

                    this.hasTechnology(
                        "vr"
                    )

                    ? vrBonus

                    : 1;


            const outageFactor =
                outage

                    ? 0.35

                    : 1;


            product.revenuePerDay =

                product.users

                *

                type.baseARPU

                *

                qualityRevenue

                *

                cloudRevenueBonus

                *

                quantumBonus

                *

                gameVrBonus

                *

                outageFactor;


            product.costPerDay =

                40

                +

                product.users *
                (
                    type.online

                        ? 0.025

                        : 0.010
                );


            product.rating =
                clamp(

                    product.quality /
                    20,

                    1,

                    5
                );
        }
    }


    processFinancesDay() {


        const revenue =
            this.state
                .products
                .reduce(

                    (
                        sum,
                        product
                    ) =>

                        sum +
                        safeNumber(
                            product.revenuePerDay
                        ),

                    0
                );


        const salaries =
            this.state
                .employees
                .reduce(

                    (
                        sum,
                        employee
                    ) =>

                        sum +
                        employee.salary /
                        30,

                    0
                );


        const officeConfig =
            this.getOfficeLevelConfig(

                this.state
                    .office
                    .level
            );


        const rent =
            officeConfig
                .rentPerDay;


        const servers =
            this.countConstruction(
                "server"
            ) *
            35;


        const productOperating =
            this.state
                .products
                .reduce(

                    (
                        sum,
                        product
                    ) =>

                        sum +
                        safeNumber(
                            product.costPerDay
                        ),

                    0
                );


        const expenses =
            salaries

            +

            rent

            +

            servers

            +

            productOperating;


        const profit =
            revenue -
            expenses;


        this.state
            .finances
            .dailyRevenue =
            revenue;


        this.state
            .finances
            .dailyExpenses =
            expenses;


        this.state
            .finances
            .dailyProfit =
            profit;


        this.state
            .finances
            .totalRevenue +=
            revenue;


        this.state
            .finances
            .totalExpenses +=
            expenses;


        this.state
            .finances
            .cash +=
            profit;


        this.state
            .finances
            .ledger
            .push(

                {

                    day:
                        this.state
                            .time
                            .day,

                    revenue,

                    expenses,

                    profit,

                    salaries,

                    rent,

                    serverCosts:
                        servers,

                    productOperating
                }
            );


        this.state
            .finances
            .ledger =
            this.state
                .finances
                .ledger
                .slice(
                    -60
                );


        if (
            profit >
            0
        ) {


            this.state
                .company
                .reputation =
                clamp(

                    this.state
                        .company
                        .reputation

                    +

                    Math.min(

                        0.12,

                        profit /
                        100000
                    ),

                    0,

                    100
                );
        }
    }


    processCompetitorsDay() {


        for (
            const competitor
            of this.state.competitors
        ) {


            const marketingBudget =
                competitor.cash >
                    10000

                    ? Math.min(

                        2500,

                        competitor.cash *
                        0.007
                    )

                    : 0;


            competitor.cash -=
                marketingBudget;


            competitor.marketing =
                Math.max(

                    0,

                    competitor.marketing -
                    1
                );


            if (
                marketingBudget >
                0

                &&

                Math.random() <
                0.20
            ) {


                competitor.marketing =
                    5;
            }


            const marketingFactor =
                competitor.marketing >
                    0

                    ? 1.35

                    : 1;


            const growth =

                (

                    competitor.quality *
                    1.1

                    +

                    competitor.products *
                    30

                    +

                    marketingBudget *
                    0.08

                )

                *

                competitor.strength

                *

                marketingFactor

                -

                competitor.users *
                0.0025;


            competitor.users =
                Math.max(

                    0,

                    Math.round(

                        competitor.users +
                        growth
                    )
                );


            const revenue =
                competitor.users *
                0.16 *
                competitor.strength;


            const expenses =
                700

                +

                competitor.products *
                350

                +

                marketingBudget;


            competitor.cash +=
                revenue -
                expenses;


            if (
                competitor.cash >
                60000

                &&

                this.state
                    .time
                    .day %
                (
                    18 +
                    this.state
                        .competitors
                        .indexOf(
                            competitor
                        ) *
                    3
                ) ===
                0
            ) {


                competitor.products +=
                    1;


                competitor.cash -=
                    25000;


                competitor.quality =
                    clamp(

                        competitor.quality +

                        randomBetween(
                            1,
                            4
                        ),

                        30,

                        96
                    );
            }


            if (
                competitor.cash <
                -10000
            ) {


                competitor.products =
                    Math.max(

                        1,

                        competitor.products -
                        1
                    );


                competitor.users =
                    Math.round(

                        competitor.users *
                        0.75
                    );


                competitor.cash =
                    10000;
            }


            competitor.valuation =
                Math.max(

                    25000,

                    competitor.cash

                    +

                    competitor.users *
                    11

                    +

                    competitor.products *
                    12000

                    +

                    competitor.quality *
                    900
                );
        }
    }


    processRandomEvent() {


        if (
            this.state
                .time
                .day <
            5
        ) {

            return;
        }


        if (
            Math.random() >
            0.13
        ) {

            return;
        }


        const events = [


            () => {


                const amount =
                    Math.round(

                        randomBetween(
                            2500,
                            9000
                        )
                    );


                this.state
                    .finances
                    .cash +=
                    amount;


                this.state
                    .company
                    .reputation =
                    clamp(

                        this.state
                            .company
                            .reputation +
                        2,

                        0,

                        100
                    );


                return {

                    title:
                        "Cliente importante",

                    message:
                        `Um contrato especial rendeu ${this.moneyLabel(
                            amount
                        )}.`,

                    type:
                        "success"
                };
            },


            () => {


                const cost =
                    Math.round(

                        randomBetween(
                            1800,
                            7000
                        )
                    );


                this.state
                    .finances
                    .cash -=
                    cost;


                return {

                    title:
                        "Equipamento quebrado",

                    message:
                        `Uma pane inesperada custou ${this.moneyLabel(
                            cost
                        )}.`,

                    type:
                        "warning"
                };
            },


            () => {


                this.state
                    .modifiers
                    .productivityBoostUntil =
                    this.state
                        .time
                        .day +
                    3;


                return {

                    title:
                        "Equipe inspirada",

                    message:
                        "A produtividade da equipe aumentou por 3 dias.",

                    type:
                        "success"
                };
            },


            () => {


                const protectedBySecurity =
                    this.hasTechnology(
                        "cybersecurity"
                    );


                const duration =
                    protectedBySecurity

                        ? 1

                        : 2;


                this.state
                    .modifiers
                    .outageUntil =
                    this.state
                        .time
                        .day +
                    duration;


                return {

                    title:
                        "Instabilidade nos servidores",

                    message:
                        protectedBySecurity

                            ? "A Cibersegurança conteve rapidamente a falha."

                            : "Produtos online terão receita reduzida temporariamente.",

                    type:
                        "warning"
                };
            },


            () => {


                this.state
                    .company
                    .reputation =
                    clamp(

                        this.state
                            .company
                            .reputation +
                        6,

                        0,

                        100
                    );


                return {

                    title:
                        "Produto viralizou",

                    message:
                        "Sua empresa ganhou destaque e reputação.",

                    type:
                        "success"
                };
            }
        ];


        const gameEvent =
            choose(
                events
            )();


        this.logEvent(

            gameEvent.title,

            gameEvent.message,

            gameEvent.type
        );


        window.dispatchEvent(

            new CustomEvent(

                "startup:random-event",

                {

                    detail:
                        gameEvent
                }
            )
        );
    }


    expireInvestorOffers() {


        const before =
            this.state
                .investorOffers
                .length;


        this.state.investorOffers =
            this.state
                .investorOffers
                .filter(

                    offer =>
                        offer.expiresDay >=
                        this.state
                            .time
                            .day
                );


        if (
            before !==
            this.state
                .investorOffers
                .length
        ) {


            this.logEvent(

                "Proposta expirada",

                "Uma proposta de investimento não está mais disponível.",

                "info"
            );
        }
    }


    /* ======================================================
       ECONOMY
       ====================================================== */

    spend(
        amount,
        category = "Despesa"
    ) {


        const cost =
            Math.max(

                0,

                safeNumber(
                    amount
                )
            );


        if (
            this.state
                .finances
                .cash <
            cost
        ) {


            this.notify(

                "Caixa insuficiente",

                `Você precisa de ${this.moneyLabel(
                    cost
                )} para ${category.toLowerCase()}.`,

                "error"
            );


            return false;
        }


        this.state
            .finances
            .cash -=
            cost;


        this.state
            .finances
            .totalInvested +=
            cost;


        return true;
    }


    calculateValuation() {


        const cash =
            this.state
                .finances
                .cash;


        const users =
            this.getTotalUsers();


        const productValue =
            this.state
                .products
                .reduce(

                    (
                        sum,
                        product
                    ) => {


                        return (

                            sum

                            +

                            product.users *
                            11

                            +

                            product.quality *
                            1100

                            +

                            (
                                product.status ===
                                    "launched"

                                    ? 15000

                                    : 5000
                            )
                        );

                    },

                    0
                );


        const technologyValue =
            this.state
                .researchedTechnologies
                .length *
            15000;


        const teamValue =
            this.state
                .employees
                .reduce(

                    (
                        sum,
                        employee
                    ) =>

                        sum

                        +

                        employee.skill *
                        50

                        +

                        employee.level *
                        500,

                    0
                );


        const officeValue =
            this.state
                .office
                .level *
            5000;


        const profitValue =
            Math.max(

                0,

                this.state
                    .finances
                    .dailyProfit
            ) *
            120;


        const reputationValue =
            this.state
                .company
                .reputation *
            150;


        const usersValue =
            users *
            4;


        return Math.max(

            10000,

            cash

            +

            productValue

            +

            technologyValue

            +

            teamValue

            +

            officeValue

            +

            profitValue

            +

            reputationValue

            +

            usersValue
        );
    }


    updateCompanyProgression() {


        this.state
            .company
            .valuation =
            this.calculateValuation();


        let level =
            1;


        for (
            const stage
            of COMPANY_STAGES
        ) {


            if (
                this.state
                    .company
                    .valuation >=
                stage.valuation
            ) {


                level =
                    stage.level;
            }
        }


        const previousLevel =
            this.state
                .company
                .level;


        this.state
            .company
            .level =
            level;


        this.state
            .company
            .stage =
            COMPANY_STAGES[
                level -
                1
            ]?.name

            ||

            COMPANY_STAGES[
                0
            ].name;


        if (
            level >
            previousLevel
        ) {


            this.state
                .company
                .reputation =
                clamp(

                    this.state
                        .company
                        .reputation +
                    5,

                    0,

                    100
                );


            this.logEvent(

                "⬆ Empresa evoluiu",

                `Você alcançou ${this.state.company.stage}.`,

                "success"
            );


            this.notify(

                "Novo nível da empresa",

                `${this.state.company.stage} desbloqueado.`,

                "success"
            );
        }
    }


    recalculateAll() {


        this.state
            .company
            .valuation =
            this.calculateValuation();


        let level =
            1;


        for (
            const stage
            of COMPANY_STAGES
        ) {


            if (
                this.state
                    .company
                    .valuation >=
                stage.valuation
            ) {


                level =
                    stage.level;
            }
        }


        this.state
            .company
            .level =
            Math.max(

                this.state
                    .company
                    .level

                ||

                1,

                level
            );


        this.state
            .company
            .stage =
            COMPANY_STAGES[
                this.state
                    .company
                    .level -
                1
            ]?.name

            ||

            COMPANY_STAGES[
                0
            ].name;


        const officeConfig =
            this.getOfficeLevelConfig(

                this.state
                    .office
                    .level
            );


        this.state.office = {

            level:
                officeConfig.level,

            name:
                officeConfig.name,

            width:
                officeConfig.width,

            depth:
                officeConfig.depth,

            employeeCapacity:
                officeConfig.employeeCapacity,

            rooms:
                [
                    ...officeConfig.rooms
                ]
        };
    }


    getTotalUsers() {


        return this.state
            .products
            .reduce(

                (
                    sum,
                    product
                ) =>

                    sum +
                    safeNumber(
                        product.users
                    ),

                0
            );
    }


    getServerCapacity() {


        const base =
            15000;


        const servers =
            this.countConstruction(
                "server"
            );


        const cloudBonus =
            this.hasTechnology(
                "cloud"
            )

                ? 1.25

                : 1;


        return Math.round(

            (
                base +
                servers *
                35000
            )

            *

            cloudBonus
        );
    }


    getMarketRanking() {


        const player = {

            id:
                "player",

            name:
                this.state
                    .company
                    .name,

            valuation:
                this.state
                    .company
                    .valuation,

            users:
                this.getTotalUsers(),

            products:
                this.state
                    .products
                    .filter(

                        product =>
                            product.status ===
                            "launched"
                    )
                    .length,

            player:
                true
        };


        const rivals =
            this.state
                .competitors
                .map(

                    competitor => ({

                        id:
                            competitor.id,

                        name:
                            competitor.name,

                        valuation:
                            competitor.valuation,

                        users:
                            competitor.users,

                        products:
                            competitor.products,

                        player:
                            false
                    })
                );


        return [

            ...rivals,

            player

        ].sort(

            (
                a,
                b
            ) =>

                b.valuation -
                a.valuation
        );
    }


    /* ======================================================
       ACHIEVEMENTS
       ====================================================== */

    checkAchievements() {


        const totalUsers =
            this.getTotalUsers();


        this.tryUnlockAchievement(

            "first-hire",

            this.state
                .statistics
                .hires >=
            1
        );


        this.tryUnlockAchievement(

            "first-product",

            this.state
                .statistics
                .productsCreated >=
            1
        );


        this.tryUnlockAchievement(

            "first-launch",

            this.state
                .statistics
                .productsLaunched >=
            1
        );


        this.tryUnlockAchievement(

            "team-10",

            this.state
                .employees
                .length >=
            10
        );


        this.tryUnlockAchievement(

            "first-research",

            this.state
                .statistics
                .technologiesCompleted >=
            1
        );


        this.tryUnlockAchievement(

            "first-expansion",

            this.state
                .statistics
                .officeExpansions >=
            1
        );


        this.tryUnlockAchievement(

            "million-company",

            this.state
                .company
                .valuation >=
            1000000
        );


        this.tryUnlockAchievement(

            "million-users",

            totalUsers >=
            1000000
        );


        this.tryUnlockAchievement(

            "max-office",

            this.state
                .office
                .level >=
            OFFICE_LEVELS.length
        );


        this.tryUnlockAchievement(

            "empire",

            this.state
                .company
                .level >=
            8
        );
    }


    tryUnlockAchievement(
        achievementId,
        condition
    ) {


        if (
            !condition

            ||

            this.state
                .achievements
                .includes(
                    achievementId
                )
        ) {


            return false;
        }


        const achievement =
            ACHIEVEMENTS[
            achievementId
            ];


        if (
            !achievement
        ) {

            return false;
        }


        this.state
            .achievements
            .push(
                achievementId
            );


        this.state
            .finances
            .cash +=
            achievement.reward;


        this.logEvent(

            "★ Conquista",

            `${achievement.name} — recompensa ${this.moneyLabel(
                achievement.reward
            )}.`,

            "success"
        );


        window.dispatchEvent(

            new CustomEvent(

                "startup:achievement",

                {

                    detail: {

                        achievement:
                            deepClone(
                                achievement
                            )
                    }
                }
            )
        );


        return true;
    }


    /* ======================================================
       SETTINGS
       ====================================================== */

    setGraphicsQuality(
        quality
    ) {


        const allowed = [

            "low",

            "medium",

            "high"
        ];


        const value =
            allowed.includes(
                quality
            )

                ? quality

                : "medium";


        this.state
            .settings
            .quality =
            value;


        this.game
            ?.setGraphicsQuality?.(
                value
            );


        this.emitStateChange(
            "quality-changed"
        );


        this.saveGame(
            true
        );
    }


    setShadows(
        enabled
    ) {


        this.state
            .settings
            .shadows =
            Boolean(
                enabled
            );


        this.game
            ?.setShadows?.(

                this.state
                    .settings
                    .shadows
            );


        this.emitStateChange(
            "shadows-changed"
        );


        this.saveGame(
            true
        );
    }


    setSound(
        enabled
    ) {


        this.state
            .settings
            .sound =
            Boolean(
                enabled
            );


        this.emitStateChange(
            "sound-changed"
        );


        this.saveGame(
            true
        );
    }


    applySettingsToGame() {


        this.game
            ?.setGraphicsQuality?.(

                this.state
                    .settings
                    .quality

                ||

                "medium"
            );


        this.game
            ?.setShadows?.(

                this.state
                    .settings
                    .shadows !==
                false
            );
    }


    setCompanyName(
        name
    ) {


        this.state
            .company
            .name =
            normalizeCompanyName(
                name
            );


        this.emitStateChange(
            "company-renamed"
        );


        this.saveGame(
            true
        );


        return this.state
            .company
            .name;
    }


    /* ======================================================
       LOG
       ====================================================== */

    logEvent(
        title,
        message,
        type = "info"
    ) {


        this.state
            .eventLog
            .unshift(

                {

                    id:
                        uid(
                            "log"
                        ),

                    day:
                        this.state
                            .time
                            .day,

                    title,

                    message,

                    type
                }
            );


        this.state
            .eventLog =
            this.state
                .eventLog
                .slice(
                    0,
                    MAX_EVENT_LOG
                );
    }


    notify(
        title,
        message,
        type = "info",
        duration = 4500
    ) {


        this.game
            ?.ui
            ?.notify?.(

                title,

                message,

                type,

                duration
            );
    }


    fail(
        title,
        message
    ) {


        this.logEvent(

            title,

            message,

            "warning"
        );


        this.notify(

            title,

            message,

            "warning"
        );


        this.emitStateChange(
            "action-failed"
        );


        return {

            success:
                false,

            message
        };
    }


    moneyLabel(
        value
    ) {


        return `$${Math.round(
            safeNumber(
                value
            )
        ).toLocaleString(
            "pt-BR"
        )}`;
    }


    /* ======================================================
       SAVE
       ====================================================== */

    saveGame(
        quiet = false
    ) {


        try {


            this.recalculateAll();


            const payload = {

                ...deepClone(
                    this.state
                ),


                version:
                    SAVE_VERSION,


                savedAt:
                    Date.now()
            };


            localStorage.setItem(

                SAVE_KEY,

                JSON.stringify(
                    payload
                )
            );


            if (
                !quiet
            ) {


                this.logEvent(

                    "Jogo salvo",

                    "Seu progresso foi salvo neste navegador.",

                    "success"
                );


                this.notify(

                    "Jogo salvo",

                    "Progresso salvo com sucesso.",

                    "success"
                );


                this.emitStateChange(
                    "game-saved"
                );
            }


            return true;


        }
        catch (
        error
        ) {


            console.error(

                "Erro ao salvar Startup Tycoon 3D:",

                error
            );


            if (
                !quiet
            ) {


                this.notify(

                    "Erro ao salvar",

                    "O navegador não permitiu gravar o progresso.",

                    "error"
                );
            }


            return false;
        }
    }


    findSavedPayload() {


        const keys = [

            SAVE_KEY,

            ...LEGACY_SAVE_KEYS
        ];


        for (
            const key
            of keys
        ) {


            try {


                const raw =
                    localStorage.getItem(
                        key
                    );


                if (
                    !raw
                ) {

                    continue;
                }


                const parsed =
                    JSON.parse(
                        raw
                    );


                if (
                    parsed

                    &&

                    typeof parsed ===
                    "object"
                ) {


                    return {

                        key,

                        data:
                            parsed
                    };
                }


            }
            catch (
            error
            ) {


                console.warn(

                    `Save inválido em ${key}:`,

                    error
                );
            }
        }


        return null;
    }


    loadGame(
        quiet = false
    ) {


        const saved =
            this.findSavedPayload();


        if (
            !saved
        ) {


            if (
                !quiet
            ) {


                this.notify(

                    "Nenhum salvamento",

                    "Ainda não existe um jogo salvo neste navegador.",

                    "warning"
                );
            }


            return false;
        }


        try {


            this.state =
                this.normalizeLoadedState(
                    saved.data
                );


            this.dayAccumulator =
                0;


            this.autosaveAccumulator =
                0;


            this.candidateRefreshAccumulator =
                0;


            this.recalculateAll();


            this.restoreWorldFromState();


            this.applySettingsToGame();


            this.ensureCandidates();


            window.dispatchEvent(

                new CustomEvent(

                    "startup:game-loaded",

                    {

                        detail: {

                            state:
                                deepClone(
                                    this.state
                                ),

                            office:
                                deepClone(
                                    this.state.office
                                )
                        }
                    }
                )
            );


            this.emitStateChange(
                "game-loaded"
            );


            if (
                !quiet
            ) {


                this.notify(

                    "Jogo carregado",

                    "Seu progresso foi restaurado.",

                    "success"
                );
            }


            return true;


        }
        catch (
        error
        ) {


            console.error(

                "Erro ao carregar save:",

                error
            );


            if (
                !quiet
            ) {


                this.notify(

                    "Salvamento inválido",

                    "Não foi possível carregar esse progresso.",

                    "error"
                );
            }


            return false;
        }
    }


    normalizeLoadedState(
        data
    ) {


        if (
            data.version ===
            SAVE_VERSION

            &&

            data.company

            &&

            data.finances
        ) {


            const defaults =
                this.createDefaultState(

                    data.company
                        ?.name

                    ||

                    "Nova Labs"
                );


            const normalized = {

                ...defaults,

                ...data,


                company: {

                    ...defaults.company,

                    ...(
                        data.company ||
                        {}
                    )
                },


                office: {

                    ...defaults.office,

                    ...(
                        data.office ||
                        {}
                    )
                },


                time: {

                    ...defaults.time,

                    ...(
                        data.time ||
                        {}
                    )
                },


                finances: {

                    ...defaults.finances,

                    ...(
                        data.finances ||
                        {}
                    )
                },


                statistics: {

                    ...defaults.statistics,

                    ...(
                        data.statistics ||
                        {}
                    )
                },


                modifiers: {

                    ...defaults.modifiers,

                    ...(
                        data.modifiers ||
                        {}
                    )
                },


                settings: {

                    ...defaults.settings,

                    ...(
                        data.settings ||
                        {}
                    )
                }
            };


            normalized.employees =
                Array.isArray(
                    data.employees
                )

                    ? data.employees

                    : [];


            normalized.candidates =
                Array.isArray(
                    data.candidates
                )

                    ? data.candidates

                    : [];


            normalized.products =
                Array.isArray(
                    data.products
                )

                    ? data.products

                    : [];


            normalized.constructions =
                Array.isArray(
                    data.constructions
                )

                    ? data.constructions

                    : [];


            normalized.researchedTechnologies =
                Array.isArray(
                    data.researchedTechnologies
                )

                    ? data.researchedTechnologies

                    : [];


            normalized.campaigns =
                Array.isArray(
                    data.campaigns
                )

                    ? data.campaigns

                    : [];


            normalized.investorOffers =
                Array.isArray(
                    data.investorOffers
                )

                    ? data.investorOffers

                    : [];


            normalized.competitors =
                Array.isArray(
                    data.competitors
                )

                    &&

                    data.competitors.length

                    ? data.competitors

                    : this.createCompetitors();


            normalized.achievements =
                Array.isArray(
                    data.achievements
                )

                    ? data.achievements

                    : [];


            normalized.eventLog =
                Array.isArray(
                    data.eventLog
                )

                    ? data.eventLog

                    : [];


            return this.sanitizeState(
                normalized
            );
        }


        return this.migrateLegacyState(
            data
        );
    }


    migrateLegacyState(
        data
    ) {


        const companyName =

            data.company
                ?.name

            ||

            data.company

            ||

            "Nova Labs";


        const migrated =
            this.createDefaultState(
                companyName
            );


        migrated.time.day =
            Math.max(

                1,

                Math.floor(

                    safeNumber(

                        data.day,

                        data.time
                            ?.day

                        ||

                        1
                    )
                )
            );


        migrated.finances.cash =
            safeNumber(

                data.cash,

                data.finances
                    ?.cash

                ||

                25000
            );


        migrated.company.reputation =
            clamp(

                safeNumber(

                    data.reputation,

                    data.company
                        ?.reputation

                    ||

                    50
                ),

                0,

                100
            );


        migrated.company.equity =
            clamp(

                safeNumber(

                    data.equity,

                    data.company
                        ?.equity

                    ||

                    1
                ),

                0.2,

                1
            );


        const legacyLevel =
            clamp(

                Math.floor(

                    safeNumber(

                        data.level,

                        data.company
                            ?.level

                        ||

                        1
                    )
                ),

                1,

                8
            );


        migrated.company.level =
            legacyLevel;


        migrated.company.stage =
            COMPANY_STAGES[
                legacyLevel -
                1
            ].name;


        const officeLevel =
            clamp(

                Math.floor(

                    safeNumber(

                        data.office
                            ?.level,

                        1
                    )
                ),

                1,

                OFFICE_LEVELS.length
            );


        const office =
            this.getOfficeLevelConfig(
                officeLevel
            );


        migrated.office = {

            level:
                office.level,

            name:
                office.name,

            width:
                office.width,

            depth:
                office.depth,

            employeeCapacity:
                office.employeeCapacity,

            rooms:
                [
                    ...office.rooms
                ]
        };


        const legacyEmployees =
            Array.isArray(
                data.employees
            )

                ? data.employees

                : [];


        migrated.employees =
            legacyEmployees
                .map(

                    employee => {


                        const legacyRoleMap = {

                            Programador:
                                "programmer",

                            Designer:
                                "designer",

                            Marketing:
                                "marketing",

                            Vendedor:
                                "sales",

                            Pesquisador:
                                "researcher",

                            Gerente:
                                "manager"
                        };


                        const roleId =
                            EMPLOYEE_ROLES[
                                employee.role
                            ]

                                ? employee.role

                                : legacyRoleMap[
                                employee.role
                                ]

                                ||

                                "programmer";


                        return this.createEmployee(

                            roleId,

                            employee.name,

                            {

                                id:
                                    employee.id,

                                salary:
                                    employee.salary,

                                level:
                                    employee.level,

                                xp:
                                    employee.xp,

                                skill:
                                    employee.skill,

                                energy:
                                    employee.energy,

                                happiness:
                                    employee.happiness,

                                productivity:
                                    employee.productivity,

                                activity:
                                    employee.activity
                            }
                        );
                    }
                );


        const legacyBuildings =
            data.constructions

            ||

            data.buildings

            ||

            [];


        migrated.constructions =
            Array.isArray(
                legacyBuildings
            )

                ? legacyBuildings

                    .filter(

                        item =>
                            BUILD_ITEMS[
                            item.type
                            ]
                    )

                    .map(

                        item => ({

                            id:
                                item.id

                                ||

                                uid(
                                    "build"
                                ),

                            type:
                                item.type,

                            x:
                                safeNumber(
                                    item.x
                                ),

                            z:
                                safeNumber(
                                    item.z
                                ),

                            rotation:
                                safeNumber(
                                    item.rotation
                                )
                        })
                    )

                : [];


        const legacyTechs =
            data.researchedTechnologies

            ||

            data.technologies

            ||

            [];


        const techNameMap = {

            Cloud:
                "cloud",

            "Inteligência Artificial":
                "artificial-intelligence",

            "Machine Learning":
                "machine-learning",

            Segurança:
                "cybersecurity",

            "Big Data":
                "big-data",

            Robótica:
                "robotics",

            "Realidade Virtual":
                "vr",

            "Computação Quântica":
                "quantum"
        };


        migrated.researchedTechnologies =
            Array.isArray(
                legacyTechs
            )

                ? legacyTechs

                    .map(

                        item =>
                            TECHNOLOGIES[
                                item
                            ]

                                ? item

                                : techNameMap[
                                item
                                ]
                    )

                    .filter(
                        Boolean
                    )

                : [];


        migrated.achievements =
            Array.isArray(
                data.achievements
            )

                ? data.achievements
                    .filter(

                        id =>
                            ACHIEVEMENTS[
                            id
                            ]
                    )

                : [];


        migrated.settings = {

            ...migrated.settings,

            ...(
                data.settings ||
                {}
            )
        };


        this.logMigration(
            migrated
        );


        return this.sanitizeState(
            migrated
        );
    }


    logMigration(
        state
    ) {


        state.eventLog.unshift(

            {

                id:
                    uid(
                        "log"
                    ),

                day:
                    state.time.day,

                title:
                    "Salvamento atualizado",

                message:
                    "Seu progresso antigo foi convertido para a nova versão do jogo.",

                type:
                    "info"
            }
        );
    }


    sanitizeState(
        state
    ) {


        state.version =
            SAVE_VERSION;


        state.company.name =
            normalizeCompanyName(
                state.company.name
            );


        state.company.level =
            clamp(

                Math.floor(

                    safeNumber(
                        state.company.level,
                        1
                    )
                ),

                1,

                8
            );


        state.company.reputation =
            clamp(

                safeNumber(
                    state.company.reputation,
                    50
                ),

                0,

                100
            );


        state.company.equity =
            clamp(

                safeNumber(
                    state.company.equity,
                    1
                ),

                0.2,

                1
            );


        state.time.day =
            Math.max(

                1,

                Math.floor(

                    safeNumber(
                        state.time.day,
                        1
                    )
                )
            );


        state.time.elapsed =
            Math.max(

                0,

                safeNumber(
                    state.time.elapsed,
                    0
                )
            );


        state.finances.cash =
            safeNumber(
                state.finances.cash,
                25000
            );


        state.employees =
            state.employees

                .filter(

                    employee =>
                        employee

                        &&

                        EMPLOYEE_ROLES[
                        employee.role
                        ]
                )

                .map(

                    employee =>
                        this.createEmployee(

                            employee.role,

                            employee.name,

                            employee
                        )
                );


        state.constructions =
            state.constructions
                .filter(

                    item =>
                        item

                        &&

                        BUILD_ITEMS[
                        item.type
                        ]
                );


        state.products =
            state.products
                .filter(

                    item =>
                        item

                        &&

                        PRODUCT_TYPES[
                        item.type
                        ]
                );


        state.researchedTechnologies = [

            ...new Set(

                state
                    .researchedTechnologies
                    .filter(

                        id =>
                            TECHNOLOGIES[
                            id
                            ]
                    )
            )
        ];


        state.achievements = [

            ...new Set(

                state
                    .achievements
                    .filter(

                        id =>
                            ACHIEVEMENTS[
                            id
                            ]
                    )
            )
        ];


        const office =
            this.getOfficeLevelConfig(

                state.office
                    ?.level

                ||

                1
            );


        state.office = {

            level:
                office.level,

            name:
                office.name,

            width:
                office.width,

            depth:
                office.depth,

            employeeCapacity:
                office.employeeCapacity,

            rooms:
                [
                    ...office.rooms
                ]
        };


        return state;
    }


    /* ======================================================
       NEW GAME
       ====================================================== */

    newGame(
        companyName = "Nova Labs"
    ) {


        const oldSettings =
            this.state
                ?.settings

                ? deepClone(
                    this.state.settings
                )

                : null;


        this.state =
            this.createDefaultState(
                companyName
            );


        if (
            oldSettings
        ) {


            this.state.settings = {

                ...this.state.settings,

                ...oldSettings
            };
        }


        this.dayAccumulator =
            0;


        this.autosaveAccumulator =
            0;


        this.candidateRefreshAccumulator =
            0;


        this.game
            ?.clearPlayerWorld?.();


        this.game
            ?.applyOfficeState?.(
                this.state.office
            );


        this.ensureCandidates();


        this.applySettingsToGame();


        this.logEvent(

            "Bem-vindo",

            `${this.state.company.name} está pronta para começar.`,

            "success"
        );


        this.saveGame(
            true
        );


        window.dispatchEvent(

            new CustomEvent(

                "startup:new-game",

                {

                    detail: {

                        office:
                            deepClone(
                                this.state.office
                            ),

                        state:
                            deepClone(
                                this.state
                            )
                    }
                }
            )
        );


        this.emitStateChange(
            "new-game"
        );


        return true;
    }


    /* ======================================================
       WORLD RESTORE
       ====================================================== */

    restoreWorldFromState() {


        this.game
            ?.clearPlayerWorld?.();


        this.game
            ?.applyOfficeState?.(
                this.state.office
            );


        for (
            const construction
            of this.state.constructions
        ) {


            this.game
                ?.restoreBuiltObject?.(
                    construction
                );
        }


        for (
            const employee
            of this.state.employees
        ) {


            this.game
                ?.addEmployee3D?.(
                    employee
                );
        }
    }
}


/* ==========================================================
   EXPORTS
   ========================================================== */

export {

    GameSystems,

    EMPLOYEE_ROLES,

    BUILD_ITEMS,

    PRODUCT_TYPES,

    CAMPAIGNS,

    TECHNOLOGIES,

    COMPANY_STAGES,

    ACHIEVEMENTS,

    OFFICE_LEVELS,

    SAVE_KEY,

    DAY_DURATION_SECONDS,

    AUTOSAVE_INTERVAL_SECONDS
};
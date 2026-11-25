/* ==========================================================
STARTUP TYCOON 3D
ui.js
Responsável por:
- Menu principal
- Novo jogo
- Continuar / carregar
- HUD
- Painéis
- Construção
- Funcionários
- Produtos
- Pesquisa
- Marketing
- Finanças
- Mercado
- Conquistas
- Configurações
- Eventos
- Investidores
- Save / Load
- Notificações
========================================================== */

import * as SystemsModule from "./systems.js";

/* ==========================================================
   COMPATIBILIDADE SYSTEMS.JS
   Evita erro quando uma versão antiga do systems.js
   não exporta todas as constantes usadas pela interface.
   ========================================================== */

const SAVE_KEY =
    SystemsModule.SAVE_KEY
    ?? "startupTycoon3D_save_v2";


const BUILD_ITEMS =
    SystemsModule.BUILD_ITEMS
    ?? {

        workstation: {
            id: "workstation",
            name: "Estação de trabalho",
            cost: 1800,
            unlockLevel: 1
        },

        desk: {
            id: "desk",
            name: "Mesa",
            cost: 600,
            unlockLevel: 1
        },

        computer: {
            id: "computer",
            name: "Computador",
            cost: 900,
            unlockLevel: 1
        },

        chair: {
            id: "chair",
            name: "Cadeira",
            cost: 350,
            unlockLevel: 1
        },

        plant: {
            id: "plant",
            name: "Planta",
            cost: 250,
            unlockLevel: 1
        },

        sofa: {
            id: "sofa",
            name: "Sofá",
            cost: 850,
            unlockLevel: 1
        },

        coffee: {
            id: "coffee",
            name: "Cafeteira",
            cost: 1000,
            unlockLevel: 1
        },

        decoration: {
            id: "decoration",
            name: "Decoração",
            cost: 450,
            unlockLevel: 1
        },

        server: {
            id: "server",
            name: "Servidor",
            cost: 3500,
            unlockLevel: 2
        }

    };


const COMPANY_FOCUSES =
    SystemsModule.COMPANY_FOCUSES
    ?? {

        game: {

            id: "game",

            name: "Games",

            productType: "game",

            description:
                "Especialização em desenvolvimento e publicação de jogos.",

            developmentMultiplier:
                1.25,

            revenueMultiplier:
                1.20,

            acquisitionMultiplier:
                1.15,

            qualityBonus:
                4,

            researchMultiplier:
                1.00,

            focusedProductCostMultiplier:
                0.65
        },


        ai: {

            id: "ai",

            name: "IA",

            productType: "ai",

            description:
                "Especialização em inteligência artificial e pesquisa.",

            developmentMultiplier:
                1.22,

            revenueMultiplier:
                1.22,

            acquisitionMultiplier:
                1.12,

            qualityBonus:
                5,

            researchMultiplier:
                1.25,

            focusedProductCostMultiplier:
                0.55
        },


        software: {

            id: "software",

            name: "Software",

            productType: "software",

            description:
                "Especialização em software, produtividade e soluções empresariais.",

            developmentMultiplier:
                1.23,

            revenueMultiplier:
                1.18,

            acquisitionMultiplier:
                1.10,

            qualityBonus:
                4,

            researchMultiplier:
                1.08,

            focusedProductCostMultiplier:
                0.70
        }

    };


const PRODUCT_TYPES =
    SystemsModule.PRODUCT_TYPES
    ?? {

        app: {
            id: "app",
            name: "Aplicativo",
            cost: 3500,
            unlockLevel: 1
        },

        game: {
            id: "game",
            name: "Jogo",
            cost: 6000,
            unlockLevel: 1
        },

        social: {
            id: "social",
            name: "Rede social",
            cost: 11000,
            unlockLevel: 2
        },

        software: {
            id: "software",
            name: "Software",
            cost: 8500,
            unlockLevel: 2
        },

        streaming: {
            id: "streaming",
            name: "Streaming",
            cost: 22000,
            unlockLevel: 3
        },

        ai: {
            id: "ai",
            name: "Inteligência Artificial",
            cost: 32000,
            unlockLevel: 3
        },

        os: {
            id: "os",
            name: "Sistema operacional",
            cost: 85000,
            unlockLevel: 5
        },

        business: {
            id: "business",
            name: "Serviço empresarial",
            cost: 16000,
            unlockLevel: 2
        }

    };


const CAMPAIGNS =
    SystemsModule.CAMPAIGNS
    ?? {

        social: {
            id: "social",
            name: "Redes sociais",
            cost: 1200,
            unlockLevel: 1
        },

        influencer: {
            id: "influencer",
            name: "Influenciadores",
            cost: 4000,
            unlockLevel: 2
        },

        ads: {
            id: "ads",
            name: "Anúncios online",
            cost: 8500,
            unlockLevel: 3
        },

        event: {
            id: "event",
            name: "Evento de lançamento",
            cost: 18000,
            unlockLevel: 4
        }

    };


const TECHNOLOGIES =
    SystemsModule.TECHNOLOGIES
    ?? {

        cloud: {

            id: "cloud",

            name: "Cloud Computing",

            cost: 5000,

            points: 100,

            unlockLevel: 1,

            prerequisites: []
        },


        "artificial-intelligence": {

            id: "artificial-intelligence",

            name: "Inteligência Artificial",

            cost: 12000,

            points: 180,

            unlockLevel: 2,

            prerequisites: [
                "cloud"
            ]
        },


        "big-data": {

            id: "big-data",

            name: "Big Data",

            cost: 10000,

            points: 170,

            unlockLevel: 2,

            prerequisites: [
                "cloud"
            ]
        },


        cybersecurity: {

            id: "cybersecurity",

            name: "Cibersegurança",

            cost: 9000,

            points: 150,

            unlockLevel: 2,

            prerequisites: [
                "cloud"
            ]
        },


        "machine-learning": {

            id: "machine-learning",

            name: "Machine Learning",

            cost: 20000,

            points: 260,

            unlockLevel: 3,

            prerequisites: [
                "artificial-intelligence",
                "big-data"
            ]
        },


        robotics: {

            id: "robotics",

            name: "Robótica",

            cost: 35000,

            points: 350,

            unlockLevel: 4,

            prerequisites: [
                "machine-learning"
            ]
        },


        vr: {

            id: "vr",

            name: "Realidade Virtual",

            cost: 26000,

            points: 300,

            unlockLevel: 4,

            prerequisites: [
                "artificial-intelligence"
            ]
        },


        quantum: {

            id: "quantum",

            name: "Computação Quântica",

            cost: 120000,

            points: 650,

            unlockLevel: 6,

            prerequisites: [
                "robotics",
                "cybersecurity"
            ]
        }

    };


const COMPANY_STAGES =
    SystemsModule.COMPANY_STAGES
    ?? [

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


const ACHIEVEMENTS =
    SystemsModule.ACHIEVEMENTS
    ?? {

        "first-hire": {

            id: "first-hire",

            name:
                "Primeira contratação",

            description:
                "Contrate seu primeiro novo funcionário."
        },


        "first-product": {

            id: "first-product",

            name:
                "Primeira grande ideia",

            description:
                "Crie seu primeiro produto."
        },


        "first-launch": {

            id: "first-launch",

            name:
                "Dia de lançamento",

            description:
                "Lance seu primeiro produto."
        },


        "team-10": {

            id: "team-10",

            name:
                "Equipe de verdade",

            description:
                "Tenha 10 funcionários ao mesmo tempo."
        },


        "million-company": {

            id: "million-company",

            name:
                "Clube do milhão",

            description:
                "Alcance valuation de $1.000.000."
        }

    };


const OFFICE_LEVELS =
    SystemsModule.OFFICE_LEVELS
    ?? [

        {
            level: 1,
            name: "Escritório Inicial",
            employeeCapacity: 8,
            cost: 0
        },

        {
            level: 2,
            name: "Escritório Expandido",
            employeeCapacity: 18,
            cost: 30000
        },

        {
            level: 3,
            name: "Sede da Startup",
            employeeCapacity: 35,
            cost: 125000
        },

        {
            level: 4,
            name: "Campus Tecnológico",
            employeeCapacity: 70,
            cost: 500000
        },

        {
            level: 5,
            name: "Mega Sede",
            employeeCapacity: 150,
            cost: 2000000
        }

    ];

/* ==========================================================
CLASSE PRINCIPAL
========================================================== */

class GameUI {

    constructor(game, systems) {

        this.game =
            game;

        this.systems =
            systems;

        this.currentPanel =
            "overview";

        this.selectedFocus =
            null;

        this.candidates =
            [];

        this.currentInvestorOffer =
            null;

        this.confirmAction =
            null;

        this.refreshInterval =
            null;

        this.modalPausedGame =
            false;

        this.companySetupBound =
            false;

        this.mainMenuBound =
            false;

        this.sidebarBound =
            false;

        this.panelBound =
            false;

        this.lastKnownState =
            null;

        this.initialized =
            false;

        this.openingScreenBound =
            false;

        this.companySetupEventsBound =
            false;

        this.loadingFallbackTimer =
            null;

        this.currencyFormatter =
            new Intl.NumberFormat(
                "pt-BR",
                {
                    maximumFractionDigits: 0
                }
            );
    }

    /* ======================================================
    INICIALIZAÇÃO
    ====================================================== */

    async init() {

        if (
            this.initialized
        ) {

            return true;
        }

        /*
        * A UI é inicializada depois que o game.js cria o
        * GameSystems. Mesmo assim, aguardamos o DOM para evitar
        * que o menu seja ligado antes de o HTML existir.
        */

        if (
            document.readyState ===
            "loading"
        ) {

            await new Promise(
                resolve => {

                    document.addEventListener(
                        "DOMContentLoaded",
                        resolve,
                        {
                            once:
                                true
                        }
                    );

                }
            );
        }

        this.installRuntimeUIFixes();

        this.createEmployeeDetailsModal();

        this.bindMainMenu();

        this.bindCompanySetup();

        this.bindSidebar();

        this.bindPanels();

        this.bindSpeedControls();

        this.bindPauseMenu();

        this.bindBuildSystem();

        this.bindEmployees();

        this.bindProducts();

        this.bindResearch();

        this.bindMarketing();

        this.bindSettings();

        this.bindModals();

        this.bindSystemEvents();

        this.configureOpeningScreen();

        /*
        * Se algum CSS antigo ou uma versão anterior do loading
        * estiver segurando a tela, este fallback libera a UI.
        * O game.js continua sendo o responsável principal pela
        * animação de carregamento.
        */

        this.releaseLoadingScreenFallback();

        this.updateAll();

        this.refreshInterval =
            setInterval(
                () => {

                    if (
                        this.game?.gameStarted
                    ) {

                        this.updateAll();
                    }

                },
                500
            );

        this.initialized =
            true;

        return true;
    }

    /* ======================================================
    HELPERS DOM
    ====================================================== */

    $(
        selector
    ) {

        return document.querySelector(
            selector
        );
    }

    $$(
        selector
    ) {

        return [
            ...document.querySelectorAll(
                selector
            )
        ];
    }

    setText(
        selector,
        value
    ) {

        const element =
            this.$(
                selector
            );

        if (
            element
        ) {

            element.textContent =
                value;
        }
    }

    show(
        selector
    ) {

        const element =
            typeof selector ===
                "string"
                ? this.$(
                    selector
                )
                : selector;

        if (
            !element
        ) {

            return;
        }

        element.hidden =
            false;

        element.classList.remove(
            "hidden"
        );

        element.removeAttribute(
            "aria-hidden"
        );
    }

    hide(
        selector
    ) {

        const element =
            typeof selector ===
                "string"
                ? this.$(
                    selector
                )
                : selector;

        if (
            !element
        ) {

            return;
        }

        element.hidden =
            true;

        element.classList.add(
            "hidden"
        );

        element.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    /* ======================================================
    SEGURANÇA HTML
    ====================================================== */

    escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );
    }

    /* ======================================================
    FORMATAÇÃO
    ====================================================== */

    formatMoney(
        value,
        compact = false
    ) {

        const number =
            Number(value) || 0;

        if (
            compact
        ) {

            const absolute =
                Math.abs(
                    number
                );

            if (
                absolute >=
                1000000000
            ) {

                return (
                    "$" +
                    (
                        number /
                        1000000000
                    ).toFixed(1) +
                    "B"
                );
            }

            if (
                absolute >=
                1000000
            ) {

                return (
                    "$" +
                    (
                        number /
                        1000000
                    ).toFixed(1) +
                    "M"
                );
            }

            if (
                absolute >=
                1000
            ) {

                return (
                    "$" +
                    (
                        number /
                        1000
                    ).toFixed(1) +
                    "K"
                );
            }
        }

        return (
            "$" +
            this.currencyFormatter
                .format(
                    Math.round(
                        number
                    )
                )
        );
    }

    formatSignedMoney(
        value
    ) {

        const number =
            Number(value) || 0;

        if (
            number > 0
        ) {

            return (
                "+" +
                this.formatMoney(
                    number
                )
            );
        }

        if (
            number < 0
        ) {

            return (
                "-" +
                this.formatMoney(
                    Math.abs(
                        number
                    )
                )
            );
        }

        return "$0";
    }

    formatNumber(
        value
    ) {

        return new Intl.NumberFormat(
            "pt-BR"
        ).format(
            Math.round(
                Number(value) || 0
            )
        );
    }

    /* ======================================================
    COMPATIBILIDADE COM SYSTEMS.JS ATUAL
    ====================================================== */

    normalizeFocus(
        value
    ) {

        const raw =
            String(
                value ??
                ""
            )
                .normalize(
                    "NFD"
                )
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )
                .trim()
                .toLowerCase();

        if (
            [
                "game",
                "games",
                "gaming",
                "jogo",
                "jogos"
            ].includes(
                raw
            )
            ||
            raw.includes(
                "games"
            )
            ||
            raw.includes(
                "gaming"
            )
            ||
            raw.includes(
                "jogo"
            )
        ) {

            return "game";
        }

        if (
            [
                "ai",
                "ia",
                "inteligencia artificial",
                "artificial intelligence"
            ].includes(
                raw
            )
            ||
            raw.includes(
                "inteligencia artificial"
            )
            ||
            raw.includes(
                "artificial intelligence"
            )
            ||
            /(^|\s)ia(\s|$)/.test(
                raw
            )
        ) {

            return "ai";
        }

        if (
            [
                "software",
                "softwares",
                "saas"
            ].includes(
                raw
            )
            ||
            raw.includes(
                "software"
            )
            ||
            raw.includes(
                "saas"
            )
        ) {

            return "software";
        }

        return null;
    }

    getState() {

        try {

            const state =
                this.systems
                    ?.getPublicState?.()
                ||
                this.systems
                    ?.state
                ||
                null;

            if (
                state
            ) {

                this.lastKnownState =
                    state;
            }

            return (
                state
                ||
                this.lastKnownState
            );

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Erro ao obter estado:",
                error
            );

            return this.lastKnownState;
        }
    }

    hasSave() {

        if (
            typeof this.systems
                ?.hasSave ===
            "function"
        ) {

            try {

                return Boolean(
                    this.systems.hasSave()
                );

            }
            catch {
            }
        }

        try {

            if (
                typeof this.systems
                    ?.findSavedPayload ===
                "function"
            ) {

                return Boolean(
                    this.systems
                        .findSavedPayload()
                );
            }

            return Boolean(
                localStorage.getItem(
                    SAVE_KEY
                )
                ||
                localStorage.getItem(
                    "startupTycoon3D_save_v1"
                )
                ||
                localStorage.getItem(
                    "startup-tycoon-3d-v1"
                )
            );

        }
        catch {

            return false;
        }
    }

    loadGameCompat() {

        try {

            const result =
                this.systems
                    ?.loadGame?.(
                        false
                    );

            if (
                typeof result ===
                "boolean"
            ) {

                return {
                    success:
                        result,

                    message:
                        result
                            ? ""
                            : "Nenhum jogo salvo foi encontrado."
                };
            }

            if (
                result
                &&
                typeof result ===
                "object"
            ) {

                return {
                    success:
                        result.success !==
                        false,

                    ...result
                };
            }

            return {
                success:
                    false,

                message:
                    "Não foi possível carregar o jogo."
            };

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Erro ao carregar:",
                error
            );

            return {
                success:
                    false,

                message:
                    error?.message
                    ||
                    "Erro inesperado ao carregar."
            };
        }
    }

    getEmployeesCompat() {

        if (
            typeof this.systems
                ?.getEmployees ===
            "function"
        ) {

            try {

                return (
                    this.systems
                        .getEmployees()
                    ||
                    []
                );

            }
            catch {
            }
        }

        return (
            this.getState()
                ?.employees
            ||
            []
        );
    }

    getCandidatesCompat(
        refresh = false,
        count = 4
    ) {

        try {

            if (
                typeof this.systems
                    ?.generateCandidates ===
                "function"
            ) {

                return (
                    this.systems
                        .generateCandidates(
                            count
                        )
                    ||
                    []
                );
            }

            if (
                refresh
                &&
                typeof this.systems
                    ?.refreshEmployeeCandidates ===
                "function"
            ) {

                this.systems
                    .refreshEmployeeCandidates(
                        false
                    );
            }

            const candidates =
                this.systems
                    ?.getEmployeeCandidates?.()
                ||
                this.getState()
                    ?.candidates
                ||
                [];

            return candidates.slice(
                0,
                count
            );

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Erro ao gerar candidatos:",
                error
            );

            return [];
        }
    }

    getBuildItemsCompat() {

        if (
            typeof this.systems
                ?.getBuildItems ===
            "function"
        ) {

            try {

                return this.systems
                    .getBuildItems();

            }
            catch {
            }
        }

        return Object.fromEntries(
            Object.entries(
                BUILD_ITEMS
            )
                .map(
                    (
                        [
                            id,
                            item
                        ]
                    ) => [

                            id,

                            {
                                ...item,

                                price:
                                    item.price
                                    ??
                                    item.cost
                                    ??
                                    0,

                                level:
                                    item.level
                                    ??
                                    item.unlockLevel
                                    ??
                                    1
                            }
                        ]
                )
        );
    }

    getProductTypesCompat() {

        if (
            typeof this.systems
                ?.getProductTypes ===
            "function"
        ) {

            try {

                return this.systems
                    .getProductTypes();

            }
            catch {
            }
        }

        const result =
            {};

        for (
            const [
                id,
                item
            ]
            of Object.entries(
                PRODUCT_TYPES
            )
        ) {

            const availability =
                this.systems
                    ?.getProductAvailability?.(
                        id
                    );

            result[
                id
            ] = {

                ...item,

                id,

                baseCost:
                    availability
                        ?.cost
                    ??
                    item.cost
                    ??
                    item.baseCost
                    ??
                    0,

                cost:
                    availability
                        ?.cost
                    ??
                    item.cost
                    ??
                    0,

                name:
                    item.name
                    ||
                    id,

                unlockLevel:
                    item.unlockLevel
                    ??
                    1,

                unlocked:
                    availability
                        ?.unlocked
                    ??
                    true,

                reason:
                    availability
                        ?.reason
                    ??
                    ""
            };
        }

        return result;
    }

    getProductsCompat() {

        if (
            typeof this.systems
                ?.getProducts ===
            "function"
        ) {

            try {

                return (
                    this.systems
                        .getProducts()
                    ||
                    []
                );

            }
            catch {
            }
        }

        return (
            this.getState()
                ?.products
            ||
            []
        );
    }

    getTechnologiesCompat() {

        if (
            typeof this.systems
                ?.getTechnologies ===
            "function"
        ) {

            try {

                return this.systems
                    .getTechnologies();

            }
            catch {
            }
        }

        return Object.fromEntries(
            Object.entries(
                TECHNOLOGIES
            )
                .map(
                    (
                        [
                            id,
                            tech
                        ]
                    ) => [

                            id,

                            {
                                ...tech,

                                id,

                                requires:
                                    tech.requires
                                    ??
                                    tech.prerequisites
                                    ??
                                    [],

                                cost:
                                    tech.cost
                                    ??
                                    0,

                                points:
                                    tech.points
                                    ??
                                    tech.researchCost
                                    ??
                                    0
                            }
                        ]
                )
        );
    }

    getCurrentStageCompat() {

        if (
            typeof this.systems
                ?.getCurrentStage ===
            "function"
        ) {

            try {

                return this.systems
                    .getCurrentStage();

            }
            catch {
            }
        }

        const state =
            this.getState();

        const level =
            Math.max(
                1,
                Number(
                    state?.company
                        ?.level
                )
                ||
                1
            );

        return (
            COMPANY_STAGES.find(
                stage =>
                    stage.level ===
                    level
            )
            ||
            COMPANY_STAGES[
            0
            ]
        );
    }

    getNextStageCompat() {

        if (
            typeof this.systems
                ?.getNextStage ===
            "function"
        ) {

            try {

                return this.systems
                    .getNextStage();

            }
            catch {
            }
        }

        const state =
            this.getState();

        const level =
            Number(
                state?.company
                    ?.level
            )
            ||
            1;

        return (
            COMPANY_STAGES.find(
                stage =>
                    stage.level ===
                    level +
                    1
            )
            ||
            null
        );
    }

    getAverageProductivityCompat() {

        if (
            typeof this.systems
                ?.getAverageProductivity ===
            "function"
        ) {

            try {

                return Number(
                    this.systems
                        .getAverageProductivity()
                )
                    ||
                    0;

            }
            catch {
            }
        }

        const employees =
            this.getEmployeesCompat();

        if (
            !employees.length
        ) {

            return 0;
        }

        const average =
            employees.reduce(
                (
                    total,
                    employee
                ) => {

                    let value =
                        Number(
                            employee.productivity
                        )
                        ||
                        0;

                    if (
                        value <=
                        3
                    ) {

                        value *=
                            100;
                    }

                    return total +
                        value;

                },
                0
            )
            /
            employees.length;

        return average;
    }

    getAverageHappinessCompat() {

        if (
            typeof this.systems
                ?.getAverageHappiness ===
            "function"
        ) {

            try {

                return Number(
                    this.systems
                        .getAverageHappiness()
                )
                    ||
                    0;

            }
            catch {
            }
        }

        const employees =
            this.getEmployeesCompat();

        if (
            !employees.length
        ) {

            return 0;
        }

        return employees.reduce(
            (
                total,
                employee
            ) =>
                total +
                (
                    Number(
                        employee.happiness
                    )
                    ||
                    0
                ),
            0
        )
            /
            employees.length;
    }

    getResearchPointsCompat() {

        if (
            typeof this.systems
                ?.getResearchPoints ===
            "function"
        ) {

            try {

                return Number(
                    this.systems
                        .getResearchPoints()
                )
                    ||
                    0;

            }
            catch {
            }
        }

        const active =
            this.getState()
                ?.activeResearch;

        return Number(
            active?.progress
        )
            ||
            0;
    }

    /* ======================================================
    CORREÇÕES VISUAIS / CLIQUES
    ====================================================== */

    installRuntimeUIFixes() {

        const oldStyle =
            document.getElementById(
                "startup-ui-runtime-fixes"
            );

        oldStyle?.remove?.();

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "startup-ui-runtime-fixes";

        style.textContent = `
/*
* CAMADAS
* O canvas fica no fundo. A interface fica acima dele.
*/

#game {
position: fixed !important;
inset: 0 !important;
width: 100% !important;
height: 100% !important;
overflow: hidden !important;
isolation: isolate !important;
}

#game.hidden,
#game[hidden] {
display: none !important;
}

#game:not(.hidden):not([hidden]) {
display: block !important;
}

#world,
#game-canvas,
#game canvas,
#world canvas {
z-index: 0 !important;
}

#game-canvas,
#game canvas,
#world canvas {
pointer-events: auto !important;
}

/*
* MENU / CADASTRO
*/

#main-menu,
#main-menu-screen,
.main-menu,
[data-screen="main-menu"],
#company-setup,
#company-setup-screen,
#new-game-screen,
.company-setup,
[data-screen="company-setup"] {
position: fixed !important;
inset: 0 !important;
z-index: 12000 !important;
pointer-events: auto !important;
}

#main-menu.hidden,
#main-menu[hidden],
#main-menu-screen.hidden,
#main-menu-screen[hidden],
#company-setup.hidden,
#company-setup[hidden],
#company-setup-screen.hidden,
#company-setup-screen[hidden],
#new-game-screen.hidden,
#new-game-screen[hidden] {
display: none !important;
pointer-events: none !important;
}

body.startup-menu-open #game-canvas,
body.startup-setup-open #game-canvas {
pointer-events: none !important;
}

#main-menu button,
#main-menu [role="button"],
#company-setup button,
#company-setup [role="button"],
#company-setup input,
#company-setup select {
pointer-events: auto !important;
position: relative;
z-index: 2;
}

/*
* UI DO JOGO
*/

.topbar,
.hud,
.sidebar,
.game-sidebar,
.sidebar-menu,
.management-panel,
.panel,
.bottom-bar,
.office-label,
#build-mode-indicator,
#build-banner,
#pause-menu,
#notification-container,
#notifications,
#autosave-indicator {
position: relative;
z-index: 50;
pointer-events: auto !important;
}

.topbar,
.sidebar,
.game-sidebar,
.sidebar-menu,
.management-panel,
.panel,
.bottom-bar,
.office-label,
#build-mode-indicator,
#build-banner,
#pause-menu,
#notification-container,
#notifications,
#autosave-indicator {
position: fixed;
}

.management-panel.hidden,
.panel.hidden {
display: none !important;
pointer-events: none !important;
}

[data-panel-content].hidden,
[data-panel-content][hidden] {
display: none !important;
pointer-events: none !important;
}

[data-panel-content]:not(.hidden):not([hidden]) {
display: block;
pointer-events: auto !important;
}

#game button,
#game input,
#game select,
#game textarea,
#game a,
#game [role="button"],
#game [data-panel],
#game [data-open-panel],
#game [data-action],
#game [data-build-item],
#game [data-tech],
.sidebar-item,
[data-panel-content] button,
[data-panel-content] input,
[data-panel-content] select {
pointer-events: auto !important;
}

/*
* MODAIS
*/

.modal-overlay {
z-index: 15000 !important;
pointer-events: auto !important;
}

.modal-overlay.hidden,
.modal-overlay[hidden] {
display: none !important;
pointer-events: none !important;
}

/*
* FOCO DA EMPRESA
*/

#company-focus-options .selection-card,
#company-focus-options [data-focus],
#company-focus-options [data-company-focus],
#company-focus-options [data-specialization],
[data-company-focus],
[data-specialization] {
cursor: pointer !important;
user-select: none;
pointer-events: auto !important;

transition:
transform 160ms ease,
box-shadow 160ms ease,
outline-color 160ms ease,
border-color 160ms ease,
background 160ms ease;
}

#company-focus-options .selection-card.active,
#company-focus-options .selection-card.selected,
#company-focus-options [data-focus].active,
#company-focus-options [data-focus].selected,
#company-focus-options [data-company-focus].active,
#company-focus-options [data-company-focus].selected,
#company-focus-options [data-specialization].active,
#company-focus-options [data-specialization].selected,
[data-company-focus].active,
[data-company-focus].selected,
[data-specialization].active,
[data-specialization].selected {
outline: 2px solid rgba(90, 175, 255, .98) !important;
outline-offset: 3px;
transform: translateY(-2px);
box-shadow: 0 14px 36px rgba(36, 122, 255, .28);
}

#btn-create-company:disabled,
[data-action="create-company"]:disabled {
opacity: .48 !important;
filter: grayscale(.35);
}

button:disabled {
cursor: not-allowed !important;
}

/*
* LOADING
*/

#loading-screen.fade-out,
#loading.fade-out {
pointer-events: none !important;
}

#loading-screen.hidden,
#loading-screen[hidden],
#loading.hidden,
#loading[hidden] {
display: none !important;
pointer-events: none !important;
}
`;

        document.head.appendChild(
            style
        );
    }

    findMainMenu() {

        return (
            this.$(
                "#main-menu"
            )
            ||
            this.$(
                "#main-menu-screen"
            )
            ||
            this.$(
                ".main-menu"
            )
            ||
            this.$(
                '[data-screen="main-menu"]'
            )
        );
    }

    findCompanySetup() {

        return (
            this.$(
                "#company-setup"
            )
            ||
            this.$(
                "#company-setup-screen"
            )
            ||
            this.$(
                "#new-game-screen"
            )
            ||
            this.$(
                ".company-setup"
            )
            ||
            this.$(
                '[data-screen="company-setup"]'
            )
        );
    }

    findGameContainer() {

        return (
            this.$(
                "#game"
            )
            ||
            this.$(
                "#game-container"
            )
            ||
            this.$(
                ".game-container"
            )
            ||
            this.$(
                '[data-screen="game"]'
            )
        );
    }

    findLoadingScreen() {

        return (
            this.$(
                "#loading-screen"
            )
            ||
            this.$(
                "#loading"
            )
            ||
            this.$(
                ".loading-screen"
            )
            ||
            this.$(
                ".loading"
            )
        );
    }

    setOpeningBodyState(
        screen
    ) {

        document.body
            ?.classList
            .remove(
                "startup-menu-open",
                "startup-setup-open",
                "startup-game-open"
            );

        if (
            screen ===
            "menu"
        ) {

            document.body
                ?.classList
                .add(
                    "startup-menu-open"
                );
        }
        else if (
            screen ===
            "setup"
        ) {

            document.body
                ?.classList
                .add(
                    "startup-setup-open"
                );
        }
        else if (
            screen ===
            "game"
        ) {

            document.body
                ?.classList
                .add(
                    "startup-game-open"
                );
        }
    }

    configureOpeningScreen() {

        const menu =
            this.findMainMenu();

        const setup =
            this.findCompanySetup();

        const game =
            this.findGameContainer();

        if (
            this.game?.gameStarted
        ) {

            menu &&
                this.hide(
                    menu
                );

            setup &&
                this.hide(
                    setup
                );

            game &&
                this.show(
                    game
                );

            this.setOpeningBodyState(
                "game"
            );
        }
        else {

            game &&
                this.hide(
                    game
                );

            setup &&
                this.hide(
                    setup
                );

            if (
                menu
            ) {

                this.show(
                    menu
                );

                this.setOpeningBodyState(
                    "menu"
                );
            }
            else if (
                setup
            ) {

                this.show(
                    setup
                );

                this.setOpeningBodyState(
                    "setup"
                );
            }
        }

        this.updateContinueButton();
    }

    releaseLoadingScreenFallback() {

        if (
            this.loadingFallbackTimer
        ) {

            clearTimeout(
                this.loadingFallbackTimer
            );
        }

        this.loadingFallbackTimer =
            setTimeout(
                () => {

                    const loading =
                        this.findLoadingScreen();

                    if (
                        !loading
                    ) {

                        return;
                    }

                    loading.classList.add(
                        "fade-out"
                    );

                    loading.style.pointerEvents =
                        "none";

                    setTimeout(
                        () => {

                            loading.hidden =
                                true;

                            loading.classList.add(
                                "hidden"
                            );

                        },
                        450
                    );

                },
                2500
            );
    }

    hideLoadingScreenNow() {

        const loading =
            this.findLoadingScreen();

        if (
            !loading
        ) {

            return;
        }

        loading.style.pointerEvents =
            "none";

        loading.classList.add(
            "fade-out"
        );

        setTimeout(
            () => {

                loading.hidden =
                    true;

                loading.classList.add(
                    "hidden"
                );

            },
            250
        );
    }

    showGameScreen() {

        const menu =
            this.findMainMenu();

        const setup =
            this.findCompanySetup();

        const game =
            this.findGameContainer();

        menu &&
            this.hide(
                menu
            );

        setup &&
            this.hide(
                setup
            );

        if (
            game
        ) {

            this.show(
                game
            );

            game.style.pointerEvents =
                "auto";
        }

        this.setOpeningBodyState(
            "game"
        );

        this.hideLoadingScreenNow();

        /*
        * Remove um menu de pausa antigo que poderia ficar
        * invisível visualmente, mas bloqueando os cliques.
        */

        const pauseMenu =
            this.$(
                "#pause-menu"
            );

        if (
            pauseMenu
        ) {

            this.hide(
                pauseMenu
            );
        }

        /*
        * Garante que os controles clicáveis do HUD fiquem acima
        * do WebGL sem transformar o canvas inteiro em overlay.
        */

        [
            ".topbar",
            ".hud",
            ".sidebar",
            ".game-sidebar",
            ".sidebar-menu",
            ".bottom-bar",
            ".office-label",
            ".management-panel",
            ".panel"
        ]
            .forEach(
                selector => {

                    this.$$(
                        `#game ${selector}`
                    )
                        .forEach(
                            element => {

                                element.style.pointerEvents =
                                    "auto";
                            }
                        );
                }
            );

        requestAnimationFrame(
            () => {

                this.game
                    ?.handleResize?.();

            }
        );
    }

    /* ======================================================
    FOCO DA EMPRESA
    ====================================================== */

    getFocusFromElement(
        element
    ) {

        if (
            !element
        ) {

            return null;
        }

        const raw =
            element.dataset
                ?.focus
            ||
            element.dataset
                ?.companyFocus
            ||
            element.dataset
                ?.specialization
            ||
            element.dataset
                ?.type
            ||
            element.getAttribute(
                "value"
            )
            ||
            element.textContent;

        return this.normalizeFocus(
            raw
        );
    }

    syncFocusCards(
        focus = this.selectedFocus
    ) {

        const normalized =
            this.normalizeFocus(
                focus
            );

        const cards =
            this.$$(
                [
                    "#company-focus-options .selection-card",
                    "#company-focus-options [data-focus]",
                    "#company-focus-options [data-company-focus]",
                    "#company-focus-options [data-specialization]",
                    "#company-focus-options button",
                    "[data-company-focus]",
                    "[data-specialization]"
                ].join(
                    ","
                )
            );

        cards.forEach(
            card => {

                const cardFocus =
                    this.getFocusFromElement(
                        card
                    );

                const active =
                    Boolean(
                        normalized
                        &&
                        cardFocus ===
                        normalized
                    );

                card.classList.toggle(
                    "active",
                    active
                );

                card.classList.toggle(
                    "selected",
                    active
                );

                card.setAttribute(
                    "aria-pressed",
                    active
                        ? "true"
                        : "false"
                );

                if (
                    card.matches(
                        'input[type="radio"]'
                    )
                ) {

                    card.checked =
                        active;
                }
            }
        );

        const hidden =
            this.$(
                "#company-focus"
            )
            ||
            this.$(
                'input[name="company-focus"]'
            )
            ||
            this.$(
                'input[name="companyFocus"]'
            );

        if (
            hidden
            &&
            normalized
        ) {

            hidden.value =
                normalized;
        }

        const createButton =
            this.$(
                "#btn-create-company"
            );

        if (
            createButton
        ) {

            createButton.disabled =
                !normalized;

            createButton.setAttribute(
                "aria-disabled",
                normalized
                    ? "false"
                    : "true"
            );
        }

        const label =
            this.$(
                "#selected-company-focus"
            );

        if (
            label
        ) {

            label.textContent =
                normalized
                    ? (
                        COMPANY_FOCUSES[
                            normalized
                        ]?.name
                        ||
                        normalized
                    )
                    : "Escolha Games, IA ou Software";
        }
    }

    /* ======================================================
    MENU PRINCIPAL
    ====================================================== */

    bindMainMenu() {

        if (
            this.mainMenuBound
        ) {

            return;
        }

        this.mainMenuBound =
            true;

        /*
        * Delegação global: funciona mesmo se o HTML do menu for
        * criado ou substituído depois de o ui.js inicializar.
        */

        document.addEventListener(
            "click",
            event => {

                const target =
                    event.target
                        ?.closest?.(
                            [
                                "#btn-new-game",
                                "#new-game",
                                "#new-game-btn",
                                "#menu-new-game",
                                "#button-new-game",
                                "#create-new-game",
                                "#start-new-game",
                                "[data-action='new-game']",
                                "[data-action='new-game-menu']",
                                "[data-menu-action='new-game']",

                                "#btn-continue-game",
                                "#continue-game",
                                "#continue-btn",
                                "#menu-continue",
                                "#btn-continue",
                                "[data-action='continue-game']",
                                "[data-menu-action='continue']",

                                "#btn-load-game",
                                "#load-game",
                                "#load-game-btn",
                                "[data-action='load-game']",
                                "[data-menu-action='load']",

                                "#btn-menu-settings",
                                "#menu-settings",
                                "#settings-btn",
                                "[data-action='menu-settings']",

                                "#btn-back-company",
                                "#cancel-company",
                                "#btn-cancel-company",
                                "[data-action='back-main-menu']",
                                "[data-action='cancel-company']"
                            ].join(
                                ","
                            )
                        );

                if (
                    !target
                ) {

                    return;
                }

                if (
                    target.disabled
                ) {

                    return;
                }

                const id =
                    target.id
                    ||
                    "";

                const action =
                    target.dataset
                        ?.action
                    ||
                    target.dataset
                        ?.menuAction
                    ||
                    "";

                const normalizedText =
                    String(
                        target.textContent
                        ||
                        ""
                    )
                        .normalize(
                            "NFD"
                        )
                        .replace(
                            /[̀-ͯ]/g,
                            ""
                        )
                        .trim()
                        .toLowerCase();

                const isNewGame =
                    [
                        "btn-new-game",
                        "new-game",
                        "new-game-btn",
                        "menu-new-game",
                        "button-new-game",
                        "create-new-game",
                        "start-new-game"
                    ].includes(
                        id
                    )
                    ||
                    action ===
                    "new-game"
                    ||
                    action ===
                    "new-game-menu"
                    ||
                    (
                        this.findMainMenu()
                            ?.contains?.(
                                target
                            )
                        &&
                        normalizedText.includes(
                            "novo jogo"
                        )
                    );

                const isContinue =
                    [
                        "btn-continue-game",
                        "continue-game",
                        "continue-btn",
                        "menu-continue",
                        "btn-continue"
                    ].includes(
                        id
                    )
                    ||
                    action ===
                    "continue-game"
                    ||
                    action ===
                    "continue";

                const isLoad =
                    [
                        "btn-load-game",
                        "load-game",
                        "load-game-btn"
                    ].includes(
                        id
                    )
                    ||
                    action ===
                    "load-game"
                    ||
                    action ===
                    "load";

                const isSettings =
                    [
                        "btn-menu-settings",
                        "menu-settings",
                        "settings-btn"
                    ].includes(
                        id
                    )
                    ||
                    action ===
                    "menu-settings";

                const isBack =
                    [
                        "btn-back-company",
                        "cancel-company",
                        "btn-cancel-company"
                    ].includes(
                        id
                    )
                    ||
                    action ===
                    "back-main-menu"
                    ||
                    action ===
                    "cancel-company";

                if (
                    isNewGame
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    this.openCompanySetup();

                    return;
                }

                if (
                    isContinue
                    ||
                    isLoad
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    this.continueGame();

                    return;
                }

                if (
                    isBack
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    this.returnToOpeningMenu();

                    return;
                }

                if (
                    isSettings
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    this.notify(
                        "Configurações",
                        "As configurações completas ficam disponíveis dentro do jogo.",
                        "info"
                    );
                }

            },
            false
        );
    }

    updateContinueButton() {

        const hasSave =
            this.hasSave();

        this.$$(
            [
                "#btn-continue-game",
                "#continue-game",
                "#continue-btn",
                "#menu-continue",
                "#btn-continue",
                "#btn-load-game",
                "#load-game",
                "#load-game-btn",
                "[data-action='continue-game']",
                "[data-action='load-game']"
            ].join(
                ","
            )
        )
            .forEach(
                button => {

                    button.disabled =
                        !hasSave;

                    button.classList.toggle(
                        "disabled",
                        !hasSave
                    );

                    button.style.opacity =
                        hasSave
                            ? ""
                            : "0.48";

                    button.setAttribute(
                        "aria-disabled",
                        hasSave
                            ? "false"
                            : "true"
                    );
                }
            );
    }

    returnToOpeningMenu() {

        const menu =
            this.findMainMenu();

        const setup =
            this.findCompanySetup();

        const game =
            this.findGameContainer();

        setup &&
            this.hide(
                setup
            );

        game &&
            this.hide(
                game
            );

        if (
            menu
        ) {

            this.show(
                menu
            );
        }

        this.setOpeningBodyState(
            "menu"
        );

        this.updateContinueButton();
    }

    openCompanySetup() {

        const menu =
            this.findMainMenu();

        const setup =
            this.findCompanySetup();

        const game =
            this.findGameContainer();

        if (
            !setup
        ) {

            this.notify(
                "Tela de criação não encontrada",
                "O index.html precisa possuir a seção #company-setup.",
                "error",
                6500
            );

            console.error(
                '[Startup Tycoon UI] Elemento "#company-setup" não encontrado.'
            );

            return;
        }

        menu &&
            this.hide(
                menu
            );

        game &&
            this.hide(
                game
            );

        this.show(
            setup
        );

        this.setOpeningBodyState(
            "setup"
        );

        /*
        * Começa uma nova seleção limpa para evitar que um foco
        * antigo fique marcado visualmente sem estar no estado.
        */

        this.selectedFocus =
            null;

        this.syncFocusCards(
            null
        );

        const input =
            setup.querySelector(
                [
                    "#company-name",
                    "#company-name-input",
                    "#setup-company-name",
                    "input[name='company-name']",
                    "input[name='companyName']",
                    "input[type='text']"
                ].join(
                    ","
                )
            );

        if (
            input
        ) {

            if (
                !String(
                    input.value
                    ||
                    ""
                ).trim()
            ) {

                input.value =
                    "";
            }

            setTimeout(
                () => {

                    input.focus?.();

                },
                80
            );
        }
    }

    continueGame() {

        const result =
            this.loadGameCompat();

        if (
            !result.success
        ) {

            this.notify(
                "Não foi possível carregar",
                result.message
                ||
                "Nenhum jogo salvo foi encontrado.",
                "error"
            );

            this.updateContinueButton();

            return false;
        }

        this.game
            ?.startGame?.();

        this.showGameScreen();

        const state =
            this.getState();

        this.selectedFocus =
            this.normalizeFocus(
                state
                    ?.company
                    ?.focus
            )
            ||
            this.selectedFocus;

        this.openPanel(
            "overview"
        );

        this.updateAll();

        this.notify(
            "Jogo carregado",
            "Sua empresa foi restaurada com sucesso.",
            "success"
        );

        return true;
    }

    /* ======================================================
    CRIAÇÃO DA EMPRESA
    ====================================================== */

    bindCompanySetup() {

        if (
            this.companySetupBound
        ) {

            return;
        }

        this.companySetupBound =
            true;

        /*
        * Clique nos cards de Games / IA / Software.
        * Usamos delegação para funcionar com qualquer uma das
        * versões de index.html que foram usadas no projeto.
        */

        document.addEventListener(
            "click",
            event => {

                const setup =
                    this.findCompanySetup();

                if (
                    !setup
                    ||
                    !setup.contains(
                        event.target
                    )
                ) {

                    return;
                }

                const focusCard =
                    event.target
                        ?.closest?.(
                            [
                                ".selection-card",
                                ".company-focus-card",
                                ".focus-card",
                                ".specialization-card",
                                "[data-focus]",
                                "[data-company-focus]",
                                "[data-specialization]"
                            ].join(
                                ","
                            )
                        );

                if (
                    focusCard
                    &&
                    setup.contains(
                        focusCard
                    )
                ) {

                    const focus =
                        this.getFocusFromElement(
                            focusCard
                        );

                    if (
                        focus
                    ) {

                        event.preventDefault();

                        this.selectedFocus =
                            focus;

                        this.syncFocusCards(
                            focus
                        );

                        return;
                    }
                }

                const createButton =
                    event.target
                        ?.closest?.(
                            [
                                "#btn-create-company",
                                "#start-company",
                                "#create-company",
                                "[data-action='create-company']",
                                "[data-action='start-company']"
                            ].join(
                                ","
                            )
                        );

                if (
                    createButton
                    &&
                    setup.contains(
                        createButton
                    )
                ) {

                    event.preventDefault();

                    this.createCompany();
                }

            },
            false
        );

        document.addEventListener(
            "change",
            event => {

                const setup =
                    this.findCompanySetup();

                if (
                    !setup
                    ||
                    !setup.contains(
                        event.target
                    )
                ) {

                    return;
                }

                const target =
                    event.target;

                if (
                    target?.matches?.(
                        [
                            "input[type='radio'][name*='focus']",
                            "input[type='radio'][name*='special']",
                            "select[name*='focus']",
                            "#company-focus",
                            "[data-focus]",
                            "[data-company-focus]",
                            "[data-specialization]"
                        ].join(
                            ","
                        )
                    )
                ) {

                    const focus =
                        this.getFocusFromElement(
                            target
                        );

                    if (
                        focus
                    ) {

                        this.selectedFocus =
                            focus;

                        this.syncFocusCards(
                            focus
                        );
                    }
                }

            },
            false
        );

        const setup =
            this.findCompanySetup();

        setup
            ?.querySelectorAll(
                "form"
            )
            .forEach(
                form => {

                    if (
                        form.dataset
                            .startupSubmitBound ===
                        "1"
                    ) {

                        return;
                    }

                    form.dataset
                        .startupSubmitBound =
                        "1";

                    form.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();

                            this.createCompany();
                        }
                    );
                }
            );

        const input =
            setup
                ?.querySelector(
                    [
                        "#company-name",
                        "#company-name-input",
                        "#setup-company-name",
                        "input[name='company-name']",
                        "input[name='companyName']",
                        "input[type='text']"
                    ].join(
                        ","
                    )
                );

        input
            ?.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        this.createCompany();
                    }
                }
            );

        this.syncFocusCards(
            this.selectedFocus
        );
    }

    createCompany() {

        const setup =
            this.findCompanySetup();

        const input =
            setup
                ?.querySelector(
                    [
                        "#company-name",
                        "#company-name-input",
                        "#setup-company-name",
                        "input[name='company-name']",
                        "input[name='companyName']",
                        "input[type='text']"
                    ].join(
                        ","
                    )
                )
            ||
            this.$(
                "#company-name"
            )
            ||
            this.$(
                "#company-name-input"
            );

        const name =
            String(
                input?.value
                ||
                "NovaTech"
            )
                .trim()
                .slice(
                    0,
                    36
                )
            ||
            "NovaTech";

        if (
            name.length <
            2
        ) {

            this.notify(
                "Nome inválido",
                "Digite um nome com pelo menos 2 caracteres.",
                "warning"
            );

            input?.focus?.();

            return false;
        }

        let focus =
            this.normalizeFocus(
                this.selectedFocus
            );

        /*
        * Caso o usuário tenha escolhido por radio/select,
        * recuperamos a seleção diretamente do HTML.
        */

        if (
            !focus
            &&
            setup
        ) {

            const selected =
                setup.querySelector(
                    [
                        "[data-focus].selected",
                        "[data-focus].active",
                        "[data-company-focus].selected",
                        "[data-company-focus].active",
                        "[data-specialization].selected",
                        "[data-specialization].active",
                        "input[type='radio']:checked",
                        "select[name*='focus']"
                    ].join(
                        ","
                    )
                );

            focus =
                this.getFocusFromElement(
                    selected
                );
        }

        if (
            !focus
        ) {

            this.notify(
                "Escolha o foco da empresa",
                "Selecione Games, IA ou Software antes de criar a empresa.",
                "warning",
                5000
            );

            this.syncFocusCards(
                null
            );

            return false;
        }

        let result;

        try {

            result =
                this.systems
                    ?.newGame?.(
                        name,
                        focus
                    );

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Falha ao criar empresa:",
                error
            );

            this.notify(
                "Erro ao criar empresa",
                error?.message
                ||
                "O sistema não conseguiu iniciar o novo jogo.",
                "error"
            );

            return false;
        }

        if (
            result ===
            false
            ||
            result?.success ===
            false
        ) {

            this.notify(
                "Erro ao criar empresa",
                result?.message
                ||
                "Não foi possível iniciar o novo jogo.",
                "error"
            );

            return false;
        }

        this.systems
            ?.setCompanyFocus?.(
                focus,
                true
            );

        this.selectedFocus =
            focus;

        /*
        * startGame cuida do mundo 3D; showGameScreen cuida
        * exclusivamente da camada HTML e dos cliques.
        */

        this.game
            ?.startGame?.();

        this.showGameScreen();

        this.game
            ?.setViewModeImmediate?.(
                "exterior",
                true
            );

        this.game
            ?.focusExterior?.();

        this.game
            ?.updateViewModeVisuals?.();

        this.game
            ?.updateHQName?.();

        this.openPanel(
            "overview"
        );

        this.updateAll();

        this.updateContinueButton();

        const focusName =
            COMPANY_FOCUSES[
                focus
            ]?.name
            ||
            focus;

        this.notify(
            `Bem-vindo à ${name}!`,
            `Sua empresa começou com foco em ${focusName}. Agora transforme sua startup em um império.`,
            "success",
            6000
        );

        return true;
    }

    /* ======================================================
    SIDEBAR
    ====================================================== */

    bindSidebar() {

        if (
            this.sidebarBound
        ) {

            return;
        }

        this.sidebarBound =
            true;

        const handler =
            event => {

                const button =
                    event.target.closest(
                        ".sidebar-item, [data-open-panel]"
                    );

                if (
                    !button
                ) {

                    return;
                }

                const panel =
                    button.dataset
                        .panel
                    ||
                    button.dataset
                        .openPanel;

                if (
                    panel
                ) {

                    event.preventDefault();

                    this.openPanel(
                        panel
                    );
                }
            };

        const game =
            this.$(
                "#game"
            );

        if (
            game
        ) {

            game.addEventListener(
                "click",
                handler
            );
        }
        else {

            document.addEventListener(
                "click",
                handler
            );
        }
    }

    openPanel(
        panelName
    ) {

        if (
            !panelName
        ) {

            return false;
        }

        const panels =
            this.$$(
                "[data-panel-content]"
            );

        let target =
            panels.find(
                panel =>
                    panel.dataset
                        .panelContent ===
                    panelName
            );

        /*
        * Se algum botão usa "finances" e o HTML usa "finance",
        * ou vice-versa, fazemos a conversão.
        */

        if (
            !target
            &&
            panelName ===
            "finances"
        ) {

            panelName =
                "finance";

            target =
                panels.find(
                    panel =>
                        panel.dataset
                            .panelContent ===
                        panelName
                );
        }

        if (
            !target
            &&
            panelName ===
            "finance"
        ) {

            target =
                panels.find(
                    panel =>
                        panel.dataset
                            .panelContent ===
                        "finances"
                );

            if (
                target
            ) {

                panelName =
                    "finances";
            }
        }

        if (
            !target
            &&
            panels.length
        ) {

            panelName =
                "overview";

            target =
                panels.find(
                    panel =>
                        panel.dataset
                            .panelContent ===
                        panelName
                )
                ||
                panels[
                0
                ];
        }

        if (
            !target
        ) {

            console.warn(
                `[Startup Tycoon UI] Painel "${panelName}" não encontrado.`
            );

            return false;
        }

        this.currentPanel =
            panelName;

        if (
            this.game?.gameStarted
        ) {

            this.showGameScreen();
        }

        panels
            .forEach(
                panel => {

                    const active =
                        panel ===
                        target;

                    panel.classList.toggle(
                        "hidden",
                        !active
                    );

                    panel.hidden =
                        !active;

                    panel.setAttribute(
                        "aria-hidden",
                        active
                            ? "false"
                            : "true"
                    );

                    panel.style.pointerEvents =
                        active
                            ? "auto"
                            : "none";
                }
            );

        this.$$(
            ".sidebar-item, [data-open-panel]"
        )
            .forEach(
                button => {

                    const name =
                        button.dataset
                            .panel
                        ||
                        button.dataset
                            .openPanel;

                    button.classList.toggle(
                        "active",
                        name ===
                        panelName
                        ||
                        (
                            panelName ===
                            "finance"
                            &&
                            name ===
                            "finances"
                        )
                        ||
                        (
                            panelName ===
                            "finances"
                            &&
                            name ===
                            "finance"
                        )
                    );
                }
            );

        const panelContainer =
            this.$(
                "#management-panel"
            )
            ||
            this.$(
                "#side-panel"
            )
            ||
            this.$(
                ".management-panel"
            )
            ||
            this.$(
                "#panel"
            );

        if (
            panelContainer
        ) {

            panelContainer.hidden =
                false;

            panelContainer.classList.remove(
                "hidden"
            );

            panelContainer.style.pointerEvents =
                "auto";

            panelContainer.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        this.updateAll();

        return true;
    }

    closePanels() {

        this.$$(
            "[data-panel-content]"
        )
            .forEach(
                panel => {

                    panel.classList.add(
                        "hidden"
                    );

                    panel.hidden =
                        true;

                    panel.style.pointerEvents =
                        "none";

                    panel.setAttribute(
                        "aria-hidden",
                        "true"
                    );
                }
            );

        this.$$(
            ".sidebar-item, [data-open-panel]"
        )
            .forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );
                }
            );

        /*
        * Antes o conteúdo era escondido, mas o painel escuro
        * continuava cobrindo parte da tela. Agora o container
        * inteiro também é recolhido.
        */

        const panelContainer =
            this.$(
                "#management-panel"
            )
            ||
            this.$(
                "#side-panel"
            )
            ||
            this.$(
                ".management-panel"
            )
            ||
            this.$(
                "#panel"
            );

        if (
            panelContainer
        ) {

            panelContainer.hidden =
                true;

            panelContainer.classList.add(
                "hidden"
            );

            panelContainer.style.pointerEvents =
                "none";

            panelContainer.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    }

    /* ======================================================
    PAINÉIS
    ====================================================== */

    bindPanels() {

        if (
            this.panelBound
        ) {

            return;
        }

        this.panelBound =
            true;

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".panel-close, [data-close-panel]"
                    );

                if (
                    !button
                ) {

                    return;
                }

                event.preventDefault();

                this.closePanels();
            }
        );
    }

    /* ======================================================
    VELOCIDADE
    ====================================================== */

    bindSpeedControls() {

        this.$$(
            ".speed-button[data-speed], [data-speed]"
        )
            .forEach(
                button => {

                    if (
                        button.dataset
                            .speedBound ===
                        "1"
                    ) {

                        return;
                    }

                    button.dataset
                        .speedBound =
                        "1";

                    button.addEventListener(
                        "click",
                        () => {

                            const requested =
                                Number(
                                    button.dataset
                                        .speed
                                );

                            if (
                                requested <=
                                0
                            ) {

                                this.game
                                    ?.setPaused?.(
                                        true
                                    );

                                this.updatePauseState(
                                    true
                                );

                                return;
                            }

                            this.game
                                ?.setPaused?.(
                                    false
                                );

                            const speed =
                                requested >=
                                    4
                                    ? 3
                                    : Math.max(
                                        1,
                                        Math.min(
                                            3,
                                            requested
                                        )
                                    );

                            this.game
                                ?.setGameSpeed?.(
                                    speed
                                );

                            this.$$(
                                ".speed-button[data-speed], [data-speed]"
                            )
                                .forEach(
                                    item =>
                                        item.classList.remove(
                                            "active"
                                        )
                                );

                            button.classList.add(
                                "active"
                            );

                            this.updatePauseState(
                                false
                            );
                        }
                    );
                }
            );

        this.$(
            "#btn-speed-pause"
        )?.addEventListener(
            "click",
            () => {

                this.game
                    ?.setPaused?.(
                        !this.game
                            .gamePaused
                    );
            }
        );
    }

    updatePauseState(
        paused
    ) {

        const pauseButton =
            this.$(
                "#btn-speed-pause"
            );

        if (
            pauseButton
        ) {

            pauseButton.textContent =
                paused
                    ? "▶"
                    : "⏸";

            pauseButton.title =
                paused
                    ? "Continuar"
                    : "Pausar";
        }
    }

    /* ======================================================
    MENU DE PAUSA
    ====================================================== */

    bindPauseMenu() {

        this.$(
            "#btn-main-menu"
        )?.addEventListener(
            "click",
            () => {

                this.togglePauseMenu(
                    true
                );
            }
        );

        this.$(
            "#btn-resume"
        )?.addEventListener(
            "click",
            () => {

                this.togglePauseMenu(
                    false
                );
            }
        );

        this.$(
            "#btn-pause-save"
        )?.addEventListener(
            "click",
            () => {

                this.manualSave();
            }
        );

        this.$(
            "#btn-pause-settings"
        )?.addEventListener(
            "click",
            () => {

                this.hide(
                    "#pause-menu"
                );

                this.openPanel(
                    "settings"
                );
            }
        );

        this.$(
            "#btn-exit-main-menu"
        )?.addEventListener(
            "click",
            () => {

                this.askConfirmation(
                    "Voltar ao menu principal?",
                    "O jogo será salvo antes de retornar ao menu.",
                    () => {

                        this.systems
                            ?.saveGame?.(
                                false
                            );

                        this.returnToMainMenu();
                    }
                );
            }
        );
    }

    togglePauseMenu(
        force = null
    ) {

        if (
            !this.game?.gameStarted
        ) {

            return;
        }

        const menu =
            this.$(
                "#pause-menu"
            );

        if (
            !menu
        ) {

            return;
        }

        const currentlyOpen =
            !menu.classList
                .contains(
                    "hidden"
                );

        const open =
            force ===
                null
                ? !currentlyOpen
                : force;

        menu.classList.toggle(
            "hidden",
            !open
        );

        menu.hidden =
            !open;

        this.game
            ?.setPaused?.(
                open
            );
    }

    returnToMainMenu() {

        this.hide(
            "#pause-menu"
        );

        this.hide(
            "#game"
        );

        this.hide(
            "#company-setup"
        );

        this.show(
            "#main-menu"
        );

        if (
            this.game
        ) {

            this.game.gameStarted =
                false;

            this.game.gamePaused =
                false;
        }

        this.systems
            ?.setPaused?.(
                false
            );

        this.updateContinueButton();
    }

    /* ======================================================
    CONSTRUÇÃO
    ====================================================== */

    bindBuildSystem() {

        this.$$(
            "[data-build-item]"
        )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const type =
                                button.dataset
                                    .buildItem;

                            this.selectBuildItem(
                                type,
                                button
                            );
                        }
                    );
                }
            );

        this.$(
            "#btn-cancel-build"
        )?.addEventListener(
            "click",
            () => {

                this.game
                    ?.cancelBuildMode?.();

                this.exitBuildModeUI();
            }
        );
    }

    selectBuildItem(
        type,
        button
    ) {

        const items =
            this.getBuildItemsCompat();

        const item =
            items[
            type
            ];

        if (
            !item
        ) {

            this.notify(
                "Objeto inválido",
                "Esse item de construção não foi encontrado.",
                "error"
            );

            return;
        }

        const price =
            Number(
                item.price
                ??
                item.cost
                ??
                0
            );

        if (
            typeof this.systems
                ?.canPurchaseBuildItem ===
            "function"
            &&
            !this.systems
                .canPurchaseBuildItem(
                    type
                )
        ) {

            this.notify(
                "Não é possível construir",
                `Você precisa ter o nível necessário e ${this.formatMoney(
                    price
                )} disponíveis para construir ${item.name}.`,
                "error"
            );

            return;
        }

        this.$$(
            "[data-build-item]"
        )
            .forEach(
                card => {

                    card.classList.remove(
                        "selected"
                    );
                }
            );

        button?.classList.add(
            "selected"
        );

        this.setText(
            "#selected-build-name",
            item.name
        );

        this.setText(
            "#selected-build-price",
            this.formatMoney(
                price
            )
        );

        this.game
            ?.startBuildMode?.(
                type
            );

        this.closePanels();

        this.show(
            "#build-mode-indicator"
        );

        this.notify(
            "Modo Construção",
            "Mova o mouse pelo chão, clique para construir, use R para girar e ESC para cancelar.",
            "info"
        );
    }

    exitBuildModeUI() {

        this.$$(
            "[data-build-item]"
        )
            .forEach(
                card => {

                    card.classList.remove(
                        "selected"
                    );
                }
            );

        this.hide(
            "#build-mode-indicator"
        );
    }

    /* ======================================================
    FUNCIONÁRIOS
    ====================================================== */

    bindEmployees() {

        this.$(
            "#btn-hire-employee"
        )?.addEventListener(
            "click",
            () => {

                this.openHireModal();
            }
        );

        this.$$(
            '[data-action="hire"]'
        )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.openHireModal();
                        }
                    );
                }
            );

        this.$(
            "#btn-refresh-candidates"
        )?.addEventListener(
            "click",
            () => {

                this.generateCandidates();
            }
        );

        this.$(
            "#candidate-list"
        )?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-hire-candidate]"
                    );

                if (
                    !button
                ) {

                    return;
                }

                const id =
                    button.dataset
                        .hireCandidate;

                this.hireCandidate(
                    id
                );
            }
        );

        this.$(
            "#employee-list"
        )?.addEventListener(
            "click",
            event => {

                const detailsButton =
                    event.target.closest(
                        "[data-employee-details]"
                    );

                if (
                    detailsButton
                ) {

                    const employee =
                        this.systems
                            ?.getEmployeeById?.(
                                detailsButton.dataset
                                    .employeeDetails
                            );

                    if (
                        employee
                    ) {

                        this.showEmployeeDetails(
                            employee
                        );
                    }

                    return;
                }

                const fireButton =
                    event.target.closest(
                        "[data-fire-employee]"
                    );

                if (
                    fireButton
                ) {

                    const employee =
                        this.systems
                            ?.getEmployeeById?.(
                                fireButton.dataset
                                    .fireEmployee
                            );

                    if (
                        employee
                    ) {

                        this.confirmFireEmployee(
                            employee
                        );
                    }
                }
            }
        );
    }

    openHireModal() {

        this.generateCandidates();

        this.show(
            "#hire-modal"
        );
    }

    generateCandidates() {

        this.candidates =
            this.getCandidatesCompat(
                true,
                4
            );

        this.renderCandidates();
    }

    renderCandidates() {

        const container =
            this.$(
                "#candidate-list"
            );

        if (
            !container
        ) {

            return;
        }

        if (
            !this.candidates.length
        ) {

            this.candidates =
                this.getCandidatesCompat(
                    false,
                    4
                );
        }

        container.innerHTML =
            this.candidates
                .map(
                    candidate => {

                        const hiringCost =
                            Math.round(
                                Number(
                                    candidate.signingBonus
                                )
                                ||
                                Number(
                                    candidate.salary
                                ) *
                                0.6
                                ||
                                0
                            );

                        const productivity =
                            Number(
                                candidate.productivity
                            )
                                <=
                                3
                                ? Number(
                                    candidate.productivity
                                ) *
                                100
                                : Number(
                                    candidate.productivity
                                )
                                ||
                                0;

                        return `
<div class="candidate-card">

<div class="candidate-avatar">
${candidate.icon || "👤"}
</div>

<div class="candidate-data">

<h3>
${this.escapeHTML(
                            candidate.name
                        )}
</h3>

<p>
${this.escapeHTML(
                            candidate.roleName
                            ||
                            candidate.role
                        )}
• Nível
${candidate.level || 1}
</p>

<div class="employee-stats">

<span>
⚡ ${Math.round(
                            productivity
                        )}%
</span>

<span>
🙂 ${Math.round(
                            candidate.happiness
                            ??
                            80
                        )}%
</span>

<span>
💵 ${this.formatMoney(
                            candidate.salary
                        )}/mês
</span>

</div>

</div>

<button
class="button-primary"
data-hire-candidate="${candidate.id}"
>
Contratar
${this.formatMoney(
                            hiringCost
                        )}
</button>

</div>
`;
                    }
                )
                .join("");
    }

    hireCandidate(
        candidateId
    ) {

        const candidate =
            this.candidates.find(
                item =>
                    item.id ===
                    candidateId
            )
            ||
            this.getCandidatesCompat(
                false,
                10
            )
                .find(
                    item =>
                        item.id ===
                        candidateId
                );

        if (
            !candidate
        ) {

            this.notify(
                "Candidato indisponível",
                "Atualize a lista de candidatos e tente novamente.",
                "warning"
            );

            return;
        }

        let result;

        try {

            result =
                this.systems
                    ?.hireEmployee?.(
                        candidateId
                    );

            if (
                !result?.success
                &&
                typeof this.systems
                    ?.generateCandidates ===
                "function"
            ) {

                result =
                    this.systems
                        .hireEmployee(
                            candidate
                        );
            }

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Erro na contratação:",
                error
            );

            result = {

                success:
                    false,

                message:
                    error?.message
            };
        }

        if (
            !result?.success
        ) {

            this.notify(
                "Contratação não realizada",
                result?.message
                ||
                "Não foi possível contratar.",
                "error"
            );

            return;
        }

        this.candidates =
            this.getCandidatesCompat(
                false,
                4
            );

        this.renderCandidates();

        this.updateAll();

        this.notify(
            "Novo funcionário!",
            `${result.employee.name} agora faz parte da sua empresa.`,
            "success"
        );
    }

    renderEmployees() {

        const employees =
            this.getEmployeesCompat();

        const container =
            this.$(
                "#employee-list"
            );

        if (
            !container
        ) {

            return;
        }

        if (
            employees.length ===
            0
        ) {

            container.innerHTML = `
<div class="empty-state">

<span>
👨‍💻
</span>

<h3>
Sua empresa ainda não possui funcionários
</h3>

<p>
Contrate profissionais para começar
a desenvolver seus produtos.
</p>

<button
class="button-primary"
data-empty-hire
>
Contratar primeiro funcionário
</button>

</div>
`;

            container
                .querySelector(
                    "[data-empty-hire]"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        this.openHireModal();
                    }
                );

            return;
        }

        container.innerHTML =
            employees
                .map(
                    employee => {

                        const productivity =
                            Number(
                                employee.productivity
                            )
                                <=
                                3
                                ? Number(
                                    employee.productivity
                                ) *
                                100
                                : Number(
                                    employee.productivity
                                )
                                ||
                                0;

                        return `
<div class="employee-card">

<div class="employee-avatar">
${employee.icon || "👤"}
</div>

<div class="employee-data">

<h3>
${this.escapeHTML(
                            employee.name
                        )}
</h3>

<p>
${this.escapeHTML(
                            employee.roleName
                            ||
                            employee.role
                        )}
• Nível
${employee.level || 1}
</p>

<div class="employee-stats">

<span>
⚡ ${Math.round(
                            productivity
                        )}%
</span>

<span>
🙂 ${Math.round(
                            employee.happiness
                            ??
                            0
                        )}%
</span>

<span>
🔋 ${Math.round(
                            employee.energy
                            ??
                            0
                        )}%
</span>

</div>

</div>

<div class="employee-status">
${this.escapeHTML(
                            employee.activity
                            ||
                            "Trabalhando"
                        )}
</div>

<button
class="button-secondary"
data-employee-details="${employee.id}"
>
Ver
</button>

<button
class="button-danger-small"
data-fire-employee="${employee.id}"
>
Demitir
</button>

</div>
`;
                    }
                )
                .join("");
    }

    confirmFireEmployee(
        employee
    ) {

        this.askConfirmation(
            `Demitir ${employee.name}?`,

            `O salário de ${this.formatMoney(
                employee.salary
            )}/mês deixará de ser cobrado. Pode existir custo de rescisão.`,

            () => {

                const result =
                    this.systems
                        ?.fireEmployee?.(
                            employee.id
                        );

                if (
                    result?.success
                ) {

                    this.hide(
                        "#employee-details-modal"
                    );

                    this.notify(
                        "Funcionário demitido",
                        `${employee.name} deixou a empresa.`,
                        "warning"
                    );

                    this.updateAll();
                }
                else {

                    this.notify(
                        "Demissão não realizada",
                        result?.message
                        ||
                        "Não foi possível desligar o funcionário.",
                        "error"
                    );
                }
            }
        );
    }

    /* ======================================================
    MODAL DETALHES FUNCIONÁRIO
    ====================================================== */

    createEmployeeDetailsModal() {

        if (
            document.getElementById(
                "employee-details-modal"
            )
        ) {

            return;
        }

        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "employee-details-modal";

        modal.className =
            "modal-overlay hidden";

        modal.innerHTML = `
<div class="modal">

<div class="modal-header">

<div>

<small>
FUNCIONÁRIO
</small>

<h2 id="employee-details-name">
Funcionário
</h2>

</div>

<button
id="employee-details-close"
class="modal-close"
>
×
</button>

</div>

<div id="employee-details-content">
</div>

</div>
`;

        document.body.appendChild(
            modal
        );

        modal
            .querySelector(
                "#employee-details-close"
            )
            ?.addEventListener(
                "click",
                () => {

                    modal.classList.add(
                        "hidden"
                    );

                    modal.hidden =
                        true;
                }
            );

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    modal.classList.add(
                        "hidden"
                    );

                    modal.hidden =
                        true;
                }
            }
        );
    }

    showEmployeeDetails(
        employee
    ) {

        const modal =
            this.$(
                "#employee-details-modal"
            );

        const content =
            this.$(
                "#employee-details-content"
            );

        if (
            !modal
            ||
            !content
        ) {

            return;
        }

        this.setText(
            "#employee-details-name",
            employee.name
        );

        const skills =
            employee.skills
            ||
            {};

        const productivity =
            Number(
                employee.productivity
            )
                <=
                3
                ? Number(
                    employee.productivity
                ) *
                100
                : Number(
                    employee.productivity
                )
                ||
                0;

        const experience =
            Number(
                employee.experience
            )
            ||
            Number(
                employee.xp
            )
            ||
            0;

        content.innerHTML = `

<div class="dashboard-card">

<div class="stat-row">

<span>
Cargo
</span>

<strong>
${this.escapeHTML(
            employee.roleName
            ||
            employee.role
        )}
</strong>

</div>

<div class="stat-row">

<span>
Nível
</span>

<strong>
${employee.level || 1}
</strong>

</div>

<div class="stat-row">

<span>
Experiência
</span>

<strong>
${Math.round(
            experience
        )}
</strong>

</div>

<div class="stat-row">

<span>
Salário
</span>

<strong>
${this.formatMoney(
            employee.salary
        )}/mês
</strong>

</div>

<div class="stat-row">

<span>
Produtividade
</span>

<strong>
${Math.round(
            productivity
        )}%
</strong>

</div>

<div class="stat-row">

<span>
Felicidade
</span>

<strong>
${Math.round(
            employee.happiness
            ||
            0
        )}%
</strong>

</div>

<div class="stat-row">

<span>
Energia
</span>

<strong>
${Math.round(
            employee.energy
            ||
            0
        )}%
</strong>

</div>

</div>

<div
class="dashboard-card"
style="margin-top: 10px;"
>

<div class="card-title">
Habilidades
</div>

${this.skillRow(
            "Programação",

            skills.development
            ??
            (
                employee.role ===
                    "programmer"
                    ? employee.skill
                    : employee.skill *
                    0.4
            )
        )}

${this.skillRow(
            "Design",

            skills.design
            ??
            (
                employee.role ===
                    "designer"
                    ? employee.skill
                    : employee.skill *
                    0.35
            )
        )}

${this.skillRow(
            "Marketing",

            skills.marketing
            ??
            (
                employee.role ===
                    "marketing"
                    ? employee.skill
                    : employee.skill *
                    0.25
            )
        )}

${this.skillRow(
            "Vendas",

            skills.sales
            ??
            (
                employee.role ===
                    "sales"
                    ? employee.skill
                    : employee.skill *
                    0.25
            )
        )}

${this.skillRow(
            "Pesquisa",

            skills.research
            ??
            (
                employee.role ===
                    "researcher"
                    ? employee.skill
                    : employee.skill *
                    0.30
            )
        )}

${this.skillRow(
            "Gestão",

            skills.management
            ??
            (
                employee.role ===
                    "manager"
                    ? employee.skill
                    : employee.skill *
                    0.25
            )
        )}

</div>

<button
id="details-fire-employee"
class="button-danger full-width"
style="margin-top: 12px;"
>
Demitir funcionário
</button>
`;

        content
            .querySelector(
                "#details-fire-employee"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.confirmFireEmployee(
                        employee
                    );
                }
            );

        modal.classList.remove(
            "hidden"
        );

        modal.hidden =
            false;
    }

    skillRow(
        name,
        value
    ) {

        return `
<div class="stat-row">

<span>
${name}
</span>

<strong>
${Math.round(
            Number(value) || 0
        )}
</strong>

</div>
`;
    }

    /* ======================================================
    PRODUTOS
    ====================================================== */

    bindProducts() {

        this.$(
            "#btn-new-product"
        )?.addEventListener(
            "click",
            () => {

                this.openProductModal();
            }
        );

        this.$$(
            '[data-action="new-product"]'
        )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.openProductModal();
                        }
                    );
                }
            );

        this.$(
            "#product-category"
        )?.addEventListener(
            "change",
            () => {

                this.updateProductCostPreview();
            }
        );

        this.$(
            "#btn-confirm-product"
        )?.addEventListener(
            "click",
            () => {

                this.createProduct();
            }
        );

        this.$(
            "#product-name"
        )?.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    this.createProduct();
                }
            }
        );

        this.$(
            "#product-list"
        )?.addEventListener(
            "click",
            event => {

                const launchButton =
                    event.target.closest(
                        "[data-launch-product]"
                    );

                if (
                    launchButton
                ) {

                    this.launchProduct(
                        launchButton.dataset
                            .launchProduct
                    );
                }
            }
        );
    }

    openProductModal() {

        const input =
            this.$(
                "#product-name"
            );

        if (
            input
        ) {

            input.value =
                "";
        }

        const state =
            this.getState();

        const focus =
            this.normalizeFocus(
                state?.company
                    ?.focus
            );

        const focusType =
            COMPANY_FOCUSES[
                focus
            ]?.productType;

        const category =
            this.$(
                "#product-category"
            );

        if (
            category
            &&
            focusType
            &&
            [
                ...category.options
            ].some(
                option =>
                    option.value ===
                    focusType
            )
        ) {

            category.value =
                focusType;
        }

        this.updateProductCostPreview();

        this.show(
            "#product-modal"
        );

        setTimeout(
            () =>
                input?.focus(),
            50
        );
    }

    updateProductCostPreview() {

        const category =
            this.$(
                "#product-category"
            )?.value;

        const type =
            this.getProductTypesCompat()[
            category
            ];

        if (
            !type
        ) {

            return;
        }

        const availability =
            this.systems
                ?.getProductAvailability?.(
                    category
                );

        const cost =
            availability
                ?.cost
            ??
            type.baseCost
            ??
            type.cost
            ??
            0;

        this.setText(
            "#product-development-cost",
            this.formatMoney(
                cost
            )
        );

        const select =
            this.$(
                "#product-category"
            );

        if (
            select
        ) {

            [
                ...select.options
            ]
                .forEach(
                    option => {

                        const optionAvailability =
                            this.systems
                                ?.getProductAvailability?.(
                                    option.value
                                );

                        if (
                            optionAvailability
                        ) {

                            option.disabled =
                                !optionAvailability.unlocked;

                            option.title =
                                optionAvailability.reason
                                ||
                                "";
                        }
                    }
                );
        }
    }

    createProduct() {

        const name =
            this.$(
                "#product-name"
            )?.value
                ?.trim();

        const category =
            this.$(
                "#product-category"
            )?.value;

        if (
            !name
            ||
            name.length <
            2
        ) {

            this.notify(
                "Nome inválido",
                "Digite um nome para o produto.",
                "warning"
            );

            return;
        }

        if (
            !category
        ) {

            this.notify(
                "Categoria inválida",
                "Escolha uma categoria de produto.",
                "warning"
            );

            return;
        }

        let result;

        try {

            result =
                this.systems
                    ?.createProduct?.(
                        category,
                        name
                    );

            if (
                !result?.success
                &&
                typeof this.systems
                    ?.getProductTypes ===
                "function"
            ) {

                result =
                    this.systems
                        .createProduct(
                            name,
                            category
                        );
            }

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Erro ao criar produto:",
                error
            );

            result = {

                success:
                    false,

                message:
                    error?.message
            };
        }

        if (
            !result?.success
        ) {

            this.notify(
                "Produto não criado",
                result?.message
                ||
                "Não foi possível iniciar o desenvolvimento.",
                "error"
            );

            return;
        }

        this.hide(
            "#product-modal"
        );

        this.updateAll();

        this.notify(
            "Novo produto",
            `${result.product.name} entrou em desenvolvimento.`,
            "success"
        );
    }

    renderProducts() {

        const products =
            this.getProductsCompat();

        const container =
            this.$(
                "#product-list"
            );

        if (
            !container
        ) {

            return;
        }

        if (
            products.length ===
            0
        ) {

            container.innerHTML = `
<div class="empty-state">

<span>
📱
</span>

<h3>
Nenhum produto em desenvolvimento
</h3>

<p>
Crie aplicativos, jogos, softwares,
serviços de IA e muito mais.
</p>

<button
class="button-primary"
data-empty-product
>
Criar primeiro produto
</button>

</div>
`;

            container
                .querySelector(
                    "[data-empty-product]"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        this.openProductModal();
                    }
                );

            return;
        }

        const productTypes =
            this.getProductTypesCompat();

        container.innerHTML =
            products
                .map(
                    product => {

                        const currentProgress =
                            Number(
                                product.progress
                            );

                        const progress =
                            Number.isFinite(
                                currentProgress
                            )
                                ? clampUI(
                                    currentProgress,
                                    0,
                                    100
                                )
                                : clampUI(
                                    (
                                        Number(
                                            product.development
                                        )
                                        /
                                        Math.max(
                                            1,
                                            Number(
                                                product.developmentNeeded
                                            )
                                            ||
                                            100
                                        )
                                    )
                                    *
                                    100,
                                    0,
                                    100
                                );

                        const ready =
                            progress >=
                            100;

                        const launched =
                            product.status ===
                            "launched"
                            ||
                            product.launched ===
                            true;

                        const typeId =
                            product.type
                            ||
                            product.category;

                        const type =
                            productTypes[
                            typeId
                            ]
                            ||
                            PRODUCT_TYPES[
                            typeId
                            ]
                            ||
                            {};

                        const categoryName =
                            product.categoryName
                            ||
                            type.name
                            ||
                            typeId
                            ||
                            "Produto";

                        const revenue =
                            Number(
                                product.revenuePerDay
                            )
                            ||
                            Number(
                                product.revenue
                            )
                            ||
                            0;

                        const rating =
                            Number(
                                product.rating
                            )
                            ||
                            (
                                Number(
                                    product.quality
                                )
                                /
                                20
                            )
                            ||
                            0;

                        return `
<div class="product-card">

<div class="product-header">

<h3>
${this.escapeHTML(
                            product.name
                        )}
</h3>

<span class="product-category">
${this.escapeHTML(
                            categoryName
                        )}
</span>

</div>

${launched
                                ? `
<div class="stat-row">

<span>
Usuários
</span>

<strong>
${this.formatNumber(
                                    product.users
                                )}
</strong>

</div>

<div class="stat-row">

<span>
Receita
</span>

<strong class="positive">
${this.formatMoney(
                                    revenue
                                )}/dia
</strong>

</div>
`
                                : `
<div class="stat-row">

<span>
Desenvolvimento
</span>

<strong>
${progress.toFixed(
                                    1
                                )}%
</strong>

</div>

<div class="progress-bar">

<div
class="progress-fill"
style="width: ${progress}%"
></div>

</div>
`
                            }

<div class="product-stats-grid">

<div class="product-stat">

<small>
Qualidade
</small>

<strong>
${Math.round(
                                product.quality
                                ||
                                0
                            )}%
</strong>

</div>

<div class="product-stat">

<small>
Popularidade
</small>

<strong>
${Math.round(
                                product.popularity
                                ||
                                0
                            )}%
</strong>

</div>

<div class="product-stat">

<small>
Avaliação
</small>

<strong>
⭐ ${rating.toFixed(
                                1
                            )}
</strong>

</div>

</div>

${ready
                                &&
                                !launched
                                ? `
<button
class="button-primary full-width"
style="margin-top: 11px;"
data-launch-product="${product.id}"
>
🚀 Lançar Produto
</button>
`
                                : ""
                            }

</div>
`;
                    }
                )
                .join("");
    }

    launchProduct(
        id
    ) {

        const result =
            this.systems
                ?.launchProduct?.(
                    id
                );

        if (
            !result?.success
        ) {

            this.notify(
                "Produto não lançado",
                result?.message
                ||
                "O desenvolvimento ainda não terminou.",
                "warning"
            );

            return;
        }

        this.updateAll();

        this.notify(
            "Produto lançado!",
            `${result.product.name} entrou no mercado e já começou a conquistar usuários.`,
            "success"
        );
    }

    /* ======================================================
    PESQUISA
    ====================================================== */

    bindResearch() {

        this.$(
            "#research-tree"
        )?.addEventListener(
            "click",
            event => {

                const card =
                    event.target.closest(
                        "[data-tech]"
                    );

                if (
                    !card
                ) {

                    return;
                }

                this.researchTechnology(
                    card.dataset.tech
                );
            }
        );
    }

    researchTechnology(
        id
    ) {

        let result;

        if (
            typeof this.systems
                ?.startResearch ===
            "function"
        ) {

            result =
                this.systems
                    .startResearch(
                        id
                    );
        }
        else {

            result =
                this.systems
                    ?.researchTechnology?.(
                        id
                    );
        }

        if (
            !result?.success
        ) {

            this.notify(
                "Pesquisa indisponível",
                result?.message
                ||
                "Essa tecnologia ainda não pode ser pesquisada.",
                "warning"
            );

            return;
        }

        this.updateAll();

        this.notify(
            "Pesquisa iniciada!",

            result.research
                ?.name
            ||
            result.technology
                ?.name
            ||
            TECHNOLOGIES[
                id
            ]?.name
            ||
            id,

            "success"
        );
    }

    renderResearch() {

        const state =
            this.getState()
            ||
            {};

        const technologies =
            this.getTechnologiesCompat();

        const active =
            state.activeResearch
            ||
            state.research
            ||
            null;

        const researched =
            state.researchedTechnologies
            ||
            state.technologies
            ||
            [];

        const activeProgress =
            Number(
                active?.progress
                ??
                active?.points
                ??
                0
            );

        const activeRequired =
            Number(
                active?.pointsRequired
                ??
                technologies[
                    active?.technologyId
                    ||
                    active?.name
                ]?.points
                ??
                100
            );

        this.setText(
            "#research-points",

            active
                ? `${Math.floor(
                    activeProgress
                )}/${Math.max(
                    1,
                    activeRequired
                )}`
                : researched.length
        );

        const researchers =
            this.getEmployeesCompat()
                .filter(
                    employee =>
                        employee.role ===
                        "researcher"
                )
                .length;

        this.setText(
            "#researchers-count",
            researchers
        );

        this.$$(
            "[data-tech]"
        )
            .forEach(
                card => {

                    const id =
                        card.dataset
                            .tech;

                    const tech =
                        technologies[
                        id
                        ];

                    if (
                        !tech
                    ) {

                        return;
                    }

                    const isResearched =
                        this.systems
                            ?.hasTechnology?.(
                                id
                            )
                        ??
                        researched.includes(
                            id
                        );

                    const requirements =
                        tech.requires
                        ||
                        tech.prerequisites
                        ||
                        [];

                    const requirementsMet =
                        requirements.every(
                            requirement =>
                                this.systems
                                    ?.hasTechnology?.(
                                        requirement
                                    )
                                ??
                                researched.includes(
                                    requirement
                                )
                        );

                    const companyLevel =
                        Number(
                            state.company
                                ?.level
                        )
                        ||
                        1;

                    const levelOk =
                        companyLevel >=
                        (
                            tech.unlockLevel
                            ||
                            1
                        );

                    const cash =
                        Number(
                            state.finances
                                ?.cash
                        )
                        ||
                        Number(
                            state.company
                                ?.money
                        )
                        ||
                        0;

                    const enoughCash =
                        cash >=
                        (
                            Number(
                                tech.cost
                            )
                            ||
                            0
                        );

                    const activeId =
                        active?.technologyId
                        ||
                        active?.id
                        ||
                        active?.name;

                    const isActive =
                        activeId ===
                        id;

                    card.classList.toggle(
                        "researched",
                        Boolean(
                            isResearched
                        )
                    );

                    card.classList.toggle(
                        "active",
                        Boolean(
                            isActive
                        )
                    );

                    card.classList.toggle(
                        "locked",

                        !isResearched
                        &&
                        (
                            !requirementsMet
                            ||
                            !levelOk
                            ||
                            !enoughCash
                            ||
                            (
                                Boolean(
                                    active
                                )
                                &&
                                !isActive
                            )
                        )
                    );

                    const small =
                        card.querySelector(
                            "small"
                        );

                    if (
                        !small
                    ) {

                        return;
                    }

                    if (
                        isResearched
                    ) {

                        small.textContent =
                            "✓ Pesquisado";
                    }
                    else if (
                        isActive
                    ) {

                        small.textContent =
                            `Em pesquisa: ${Math.min(
                                100,
                                (
                                    activeProgress
                                    /
                                    Math.max(
                                        1,
                                        activeRequired
                                    )
                                )
                                *
                                100
                            ).toFixed(
                                0
                            )}%`;
                    }
                    else if (
                        !levelOk
                    ) {

                        small.textContent =
                            `Requer empresa nível ${tech.unlockLevel}`;
                    }
                    else if (
                        !requirementsMet
                    ) {

                        const missing =
                            requirements
                                .filter(
                                    requirement =>
                                        !(
                                            this.systems
                                                ?.hasTechnology?.(
                                                    requirement
                                                )
                                            ??
                                            researched.includes(
                                                requirement
                                            )
                                        )
                                )
                                .map(
                                    requirement =>
                                        technologies[
                                            requirement
                                        ]?.name
                                        ||
                                        requirement
                                )
                                .join(
                                    ", "
                                );

                        small.textContent =
                            `Requer: ${missing}`;
                    }
                    else if (
                        active
                    ) {

                        small.textContent =
                            "Conclua a pesquisa atual primeiro";
                    }
                    else {

                        small.textContent =
                            `Custo: ${this.formatMoney(
                                tech.cost
                                ||
                                0
                            )}`;
                    }
                }
            );
    }

    /* ======================================================
    MARKETING
    ====================================================== */

    bindMarketing() {

        this.$$(
            ".campaign-card"
        )
            .forEach(
                card => {

                    const button =
                        card.querySelector(
                            ".campaign-button"
                        );

                    button?.addEventListener(
                        "click",
                        () => {

                            const campaign =
                                card.dataset
                                    .campaign;

                            this.runCampaign(
                                campaign
                            );
                        }
                    );
                }
            );
    }

    runCampaign(
        id
    ) {

        const products =
            this.getProductsCompat()
                .filter(
                    product =>
                        product.status ===
                        "launched"
                        ||
                        product.launched ===
                        true
                );

        if (
            !products.length
        ) {

            this.notify(
                "Campanha não iniciada",
                "Lance pelo menos um produto antes de fazer marketing.",
                "warning"
            );

            return;
        }

        const productSelect =
            this.$(
                "#marketing-product"
            );

        let product =
            productSelect
                ? products.find(
                    item =>
                        item.id ===
                        productSelect.value
                )
                : null;

        if (
            !product
        ) {

            product =
                [
                    ...products
                ]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            (
                                Number(
                                    a.popularity
                                )
                                ||
                                0
                            )
                            -
                            (
                                Number(
                                    b.popularity
                                )
                                ||
                                0
                            )
                    )[
                0
                ];
        }

        let result;

        if (
            typeof this.systems
                ?.startMarketingCampaign ===
            "function"
        ) {

            result =
                this.systems
                    .startMarketingCampaign(
                        id,
                        product.id
                    );
        }
        else {

            result =
                this.systems
                    ?.runMarketingCampaign?.(
                        id
                    );
        }

        if (
            !result?.success
        ) {

            this.notify(
                "Campanha não iniciada",
                result?.message
                ||
                "Não foi possível iniciar a campanha.",
                "error"
            );

            return;
        }

        this.updateAll();

        const campaignName =
            CAMPAIGNS[
                id
            ]?.name
            ||
            result.campaign
                ?.name
            ||
            id;

        this.notify(
            "Campanha iniciada!",
            `${campaignName} começou para ${product.name}.`,
            "success"
        );
    }

    /* ======================================================
    CONFIGURAÇÕES
    ====================================================== */

    bindSettings() {

        this.$(
            "#btn-save-game"
        )?.addEventListener(
            "click",
            () => {

                this.manualSave();
            }
        );

        this.$(
            "#btn-reload-game"
        )?.addEventListener(
            "click",
            () => {

                this.askConfirmation(
                    "Carregar jogo salvo?",
                    "O progresso atual não salvo será perdido.",
                    () => {

                        const result =
                            this.loadGameCompat();

                        if (
                            result.success
                        ) {

                            this.game
                                ?.startGame?.();

                            this.showGameScreen();

                            this.updateAll();

                            this.notify(
                                "Jogo carregado",
                                "O salvamento foi restaurado.",
                                "success"
                            );
                        }
                        else {

                            this.notify(
                                "Erro ao carregar",
                                result.message
                                ||
                                "Nenhum salvamento encontrado.",
                                "error"
                            );
                        }
                    }
                );
            }
        );

        this.$(
            "#btn-new-game-settings"
        )?.addEventListener(
            "click",
            () => {

                this.askConfirmation(
                    "Começar um novo jogo?",
                    "O progresso atual será substituído ao salvar o novo jogo.",
                    () => {

                        if (
                            this.game
                        ) {

                            this.game.gameStarted =
                                false;
                        }

                        this.hide(
                            "#game"
                        );

                        this.openCompanySetup();
                    }
                );
            }
        );

        this.$(
            "#setting-quality"
        )?.addEventListener(
            "change",
            event => {

                if (
                    typeof this.systems
                        ?.setGraphicsQuality ===
                    "function"
                ) {

                    this.systems
                        .setGraphicsQuality(
                            event.target
                                .value
                        );
                }
                else {

                    this.game
                        ?.setGraphicsQuality?.(
                            event.target
                                .value
                        );
                }
            }
        );

        this.$(
            "#setting-shadows"
        )?.addEventListener(
            "change",
            event => {

                if (
                    typeof this.systems
                        ?.setShadows ===
                    "function"
                ) {

                    this.systems
                        .setShadows(
                            event.target
                                .checked
                        );
                }
                else {

                    this.game
                        ?.setShadows?.(
                            event.target
                                .checked
                        );
                }
            }
        );

        this.$(
            "#setting-sound"
        )?.addEventListener(
            "change",
            event => {

                if (
                    typeof this.systems
                        ?.setSound ===
                    "function"
                ) {

                    this.systems
                        .setSound(
                            event.target
                                .checked
                        );
                }
                else {

                    localStorage.setItem(
                        "startupTycoon3D_sound",
                        event.target.checked
                            ? "1"
                            : "0"
                    );
                }

                this.notify(
                    "Som",
                    event.target.checked
                        ? "Efeitos sonoros ativados."
                        : "Efeitos sonoros desativados.",
                    "info"
                );
            }
        );
    }

    manualSave() {

        let success =
            false;

        try {

            success =
                Boolean(
                    this.systems
                        ?.saveGame?.(
                            false
                        )
                );

        }
        catch (
        error
        ) {

            console.error(
                "[Startup Tycoon UI] Erro ao salvar:",
                error
            );

            success =
                false;
        }

        if (
            success
        ) {

            this.updateContinueButton();

            this.notify(
                "Jogo salvo",
                "Seu progresso foi salvo no navegador.",
                "success"
            );
        }
        else {

            this.notify(
                "Erro ao salvar",
                "Não foi possível salvar o jogo.",
                "error"
            );
        }
    }

    /* ======================================================
    MODAIS
    ====================================================== */

    bindModals() {

        this.$$(
            "[data-close-modal]"
        )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.hide(
                                "#" +
                                button.dataset
                                    .closeModal
                            );
                        }
                    );
                }
            );

        this.$$(
            ".modal-overlay"
        )
            .forEach(
                overlay => {

                    overlay.addEventListener(
                        "click",
                        event => {

                            if (
                                event.target ===
                                overlay
                                &&
                                ![
                                    "event-modal",
                                    "investor-modal",
                                    "confirmation-modal"
                                ].includes(
                                    overlay.id
                                )
                            ) {

                                overlay.classList.add(
                                    "hidden"
                                );

                                overlay.hidden =
                                    true;
                            }
                        }
                    );
                }
            );

        this.$(
            "#btn-event-confirm"
        )?.addEventListener(
            "click",
            () => {

                this.hide(
                    "#event-modal"
                );

                this.resumeFromModal();
            }
        );

        this.$(
            "#btn-accept-investment"
        )?.addEventListener(
            "click",
            () => {

                this.acceptInvestment();
            }
        );

        this.$(
            "#btn-reject-investment"
        )?.addEventListener(
            "click",
            () => {

                this.rejectInvestment();
            }
        );

        this.$(
            "#confirmation-cancel"
        )?.addEventListener(
            "click",
            () => {

                this.confirmAction =
                    null;

                this.hide(
                    "#confirmation-modal"
                );
            }
        );

        this.$(
            "#confirmation-confirm"
        )?.addEventListener(
            "click",
            () => {

                const action =
                    this.confirmAction;

                this.confirmAction =
                    null;

                this.hide(
                    "#confirmation-modal"
                );

                if (
                    typeof action ===
                    "function"
                ) {

                    action();
                }
            }
        );
    }

    askConfirmation(
        title,
        message,
        action
    ) {

        this.setText(
            "#confirmation-title",
            title
        );

        this.setText(
            "#confirmation-message",
            message
        );

        this.confirmAction =
            action;

        this.show(
            "#confirmation-modal"
        );
    }

    /* ======================================================
    EVENTOS DO SISTEMA
    ====================================================== */

    bindSystemEvents() {

        const refresh =
            () => {

                this.updateAll();
            };

        window.addEventListener(
            "startup:state-changed",
            refresh
        );

        window.addEventListener(
            "startup:new-day",
            refresh
        );

        window.addEventListener(
            "startup:office-expanded",
            event => {

                this.updateAll();

                const office =
                    event.detail
                        ?.office;

                if (
                    office
                ) {

                    this.notify(
                        "Sede expandida!",
                        `${office.name} está pronta para sua equipe.`,
                        "success",
                        5500
                    );
                }
            }
        );

        window.addEventListener(
            "startup:game-loaded",
            () => {

                this.showGameScreen();

                this.updateAll();
            }
        );

        window.addEventListener(
            "startup:new-game",
            () => {

                this.updateAll();
            }
        );

        window.addEventListener(
            "startup:product-ready",
            event => {

                this.notify(
                    "Produto pronto!",
                    `${event.detail.name} terminou o desenvolvimento e já pode ser lançado.`,
                    "success"
                );

                this.updateAll();
            }
        );

        window.addEventListener(
            "startup:employee-level-up",
            event => {

                const employee =
                    event.detail;

                this.notify(
                    "Funcionário evoluiu!",
                    `${employee.name} agora está no nível ${employee.level}.`,
                    "success"
                );
            }
        );

        window.addEventListener(
            "startup:company-level-up",
            event => {

                const stage =
                    event.detail;

                this.notify(
                    "Empresa evoluiu!",
                    `Sua empresa alcançou o nível: ${stage.name}.`,
                    "success"
                );
            }
        );

        window.addEventListener(
            "startup:achievement-unlocked",
            event => {

                const achievement =
                    event.detail;

                this.notify(
                    "🏆 Conquista desbloqueada!",
                    achievement.name,
                    "success",
                    6000
                );

                this.updateAll();
            }
        );

        window.addEventListener(
            "startup:achievement",
            event => {

                const achievement =
                    event.detail
                        ?.achievement
                    ||
                    event.detail;

                if (
                    achievement
                ) {

                    this.notify(
                        "🏆 Conquista desbloqueada!",
                        achievement.name,
                        "success",
                        6000
                    );
                }

                this.updateAll();
            }
        );

        window.addEventListener(
            "startup:game-event",
            event => {

                this.showGameEvent(
                    event.detail
                );
            }
        );

        window.addEventListener(
            "startup:random-event",
            event => {

                const detail =
                    event.detail
                    ||
                    {};

                if (
                    detail.description
                    ||
                    detail.effect
                ) {

                    this.showGameEvent(
                        detail
                    );
                }
                else {

                    this.notify(
                        detail.title
                        ||
                        "Evento",

                        detail.message
                        ||
                        "",

                        detail.type
                        ||
                        "info",

                        6000
                    );
                }

                this.updateAll();
            }
        );

        window.addEventListener(
            "startup:investor-offer",
            event => {

                this.showInvestorOffer(
                    event.detail
                );
            }
        );

        window.addEventListener(
            "startup:autosave",
            () => {

                this.showAutosave();
            }
        );

        window.addEventListener(
            "startup:game-saved",
            () => {

                this.updateContinueButton();
            }
        );

        window.addEventListener(
            "startup:bankruptcy-warning",
            event => {

                this.notify(
                    "⚠ Caixa crítico",
                    `Sua empresa está com ${this.formatMoney(
                        event.detail.money
                    )}. Corte custos ou aumente a receita.`,
                    "error",
                    7000
                );
            }
        );
    }

    /* ======================================================
    EVENTO
    ====================================================== */

    showGameEvent(
        event
    ) {

        if (
            !event
        ) {

            return;
        }

        this.pauseForModal();

        this.setText(
            "#event-icon",
            event.icon || "⚡"
        );

        this.setText(
            "#event-title",
            event.title
            ||
            "Evento"
        );

        this.setText(
            "#event-description",
            event.description
            ||
            event.message
            ||
            ""
        );

        this.setText(
            "#event-effect",
            event.effect
            ||
            ""
        );

        this.show(
            "#event-modal"
        );

        this.updateAll();
    }

    /* ======================================================
    INVESTIDOR
    ====================================================== */

    showInvestorOffer(
        offer
    ) {

        if (
            !offer
        ) {

            return;
        }

        this.currentInvestorOffer =
            offer;

        this.pauseForModal();

        this.setText(
            "#investor-name",
            offer.investor
            ||
            offer.name
            ||
            "Investidor"
        );

        this.setText(
            "#investment-amount",
            this.formatMoney(
                offer.amount
            )
        );

        const stake =
            Number(
                offer.stake
            );

        const equityPercent =
            Number.isFinite(
                stake
            )
                ? stake *
                100
                : Number(
                    offer.equity
                )
                ||
                0;

        this.setText(
            "#investment-equity",
            `${equityPercent.toFixed(
                1
            )}%`
        );

        this.setText(
            "#investment-valuation",
            this.formatMoney(
                offer.valuation
            )
        );

        this.show(
            "#investor-modal"
        );
    }

    acceptInvestment() {

        if (
            !this.currentInvestorOffer
        ) {

            return;
        }

        const result =
            this.systems
                ?.acceptInvestorOffer?.(
                    this.currentInvestorOffer.id
                );

        if (
            result?.success
        ) {

            this.notify(
                "Investimento recebido!",
                `${result.offer.investor} investiu ${this.formatMoney(
                    result.offer.amount
                )} em sua empresa.`,
                "success"
            );
        }
        else {

            this.notify(
                "Investimento não concluído",
                result?.message
                ||
                "Não foi possível aceitar essa proposta.",
                "error"
            );
        }

        this.currentInvestorOffer =
            null;

        this.hide(
            "#investor-modal"
        );

        this.resumeFromModal();

        this.updateAll();
    }

    rejectInvestment() {

        if (
            this.currentInvestorOffer
        ) {

            this.systems
                ?.rejectInvestorOffer?.(
                    this.currentInvestorOffer.id
                );
        }

        this.currentInvestorOffer =
            null;

        this.hide(
            "#investor-modal"
        );

        this.resumeFromModal();

        this.notify(
            "Oferta recusada",
            "O investidor deixou a negociação.",
            "info"
        );
    }

    /* ======================================================
    PAUSA PARA MODAL
    ====================================================== */

    pauseForModal() {

        this.modalPausedGame =
            !this.game?.gamePaused;

        if (
            this.modalPausedGame
        ) {

            this.game
                ?.setPaused?.(
                    true
                );
        }
    }

    resumeFromModal() {

        if (
            this.modalPausedGame
        ) {

            this.game
                ?.setPaused?.(
                    false
                );
        }

        this.modalPausedGame =
            false;
    }

    /* ======================================================
    HUD
    ====================================================== */

    updateHUD() {

        const state =
            this.getState();

        if (
            !state
        ) {

            return;
        }

        const company =
            state.company
            ||
            {};

        const finances =
            state.finances
            ||
            {};

        const money =
            Number(
                finances.cash
            )
            ||
            Number(
                company.money
            )
            ||
            0;

        const profit =
            Number(
                finances.dailyProfit
            )
            ||
            Number(
                company.profit
            )
            ||
            0;

        this.setText(
            "#hud-company-name",
            company.name
            ||
            "Nova Labs"
        );

        this.setText(
            "#hud-company-level",
            company.stage
            ||
            "Startup"
        );

        this.setText(
            "#hud-money",
            this.formatMoney(
                money,
                true
            )
        );

        this.setText(
            "#hud-profit",
            this.formatSignedMoney(
                profit
            )
            +
            "/dia"
        );

        const profitElement =
            this.$(
                "#hud-profit"
            );

        if (
            profitElement
        ) {

            profitElement.classList.toggle(
                "positive",
                profit >=
                0
            );

            profitElement.classList.toggle(
                "negative",
                profit <
                0
            );
        }

        this.setText(
            "#hud-employees",
            state.employees
                ?.length
            ||
            0
        );

        this.setText(
            "#hud-reputation",
            Math.round(
                Number(
                    company.reputation
                )
                ||
                0
            )
        );

        this.setText(
            "#hud-valuation",
            this.formatMoney(
                company.valuation,
                true
            )
        );

        this.setText(
            "#hud-day",
            state.time
                ?.day
            ||
            state.day
            ||
            1
        );

        this.setText(
            "#hud-company-focus",

            company.focusName
            ||
            COMPANY_FOCUSES[
                this.normalizeFocus(
                    company.focus
                )
            ]?.name
            ||
            ""
        );

        this.setText(
            "#company-label",
            company.name
            ||
            "Nova Labs"
        );

        this.setText(
            "#day",
            `Dia ${state.time
                ?.day
            ||
            state.day
            ||
            1
            }`
        );

        const office =
            state.office
            ||
            {};

        this.setText(
            "#office-info",
            `${office.name || "Escritório"} · ${state.employees
                ?.length
            ||
            0
            }/${office.employeeCapacity
            ||
            "?"
            } funcionários`
        );

        if (
            document.body
        ) {

            const focus =
                this.normalizeFocus(
                    company.focus
                );

            if (
                focus
            ) {

                document.body.dataset
                    .companyFocus =
                    focus;
            }
        }
    }

    /* ======================================================
    OVERVIEW
    ====================================================== */

    renderOverview() {

        const state =
            this.getState();

        if (
            !state
        ) {

            return;
        }

        const company =
            state.company
            ||
            {};

        const finances =
            state.finances
            ||
            {};

        const revenue =
            Number(
                finances.dailyRevenue
            )
            ||
            Number(
                company.revenue
            )
            ||
            0;

        const expenses =
            Number(
                finances.dailyExpenses
            )
            ||
            Number(
                company.expenses
            )
            ||
            0;

        const profit =
            Number(
                finances.dailyProfit
            )
            ||
            Number(
                company.profit
            )
            ||
            0;

        this.setText(
            "#overview-revenue",
            "+" +
            this.formatMoney(
                revenue
            )
        );

        this.setText(
            "#overview-expenses",
            "-" +
            this.formatMoney(
                Math.abs(
                    expenses
                )
            )
        );

        this.setText(
            "#overview-profit",
            this.formatSignedMoney(
                profit
            )
        );

        this.setText(
            "#overview-employees",
            state.employees
                ?.length
            ||
            0
        );

        this.setText(
            "#overview-products",
            state.products
                ?.length
            ||
            0
        );

        this.setText(
            "#overview-reputation",
            Math.round(
                Number(
                    company.reputation
                )
                ||
                0
            )
        );

        const reputationBar =
            this.$(
                "#reputation-progress"
            );

        if (
            reputationBar
        ) {

            reputationBar.style.width =
                `${Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            company.reputation
                        )
                        ||
                        0
                    )
                )}%`;
        }

        const focus =
            this.normalizeFocus(
                company.focus
            );

        const focusName =
            company.focusName
            ||
            COMPANY_FOCUSES[
                focus
            ]?.name
            ||
            "";

        this.setText(
            "#current-company-stage",

            focusName
                ? `${company.stage} · Foco: ${focusName}`
                : company.stage
        );

        this.setText(
            "#company-level-number",
            `Nível ${company.level || 1}`
        );

        const currentStage =
            this.getCurrentStageCompat();

        const nextStage =
            this.getNextStageCompat();

        let progress =
            100;

        if (
            nextStage
        ) {

            const range =
                Number(
                    nextStage.valuation
                )
                -
                Number(
                    currentStage
                        ?.valuation
                    ||
                    0
                );

            const gained =
                Number(
                    company.valuation
                )
                -
                Number(
                    currentStage
                        ?.valuation
                    ||
                    0
                );

            progress =
                clampUI(
                    (
                        gained
                        /
                        Math.max(
                            1,
                            range
                        )
                    )
                    *
                    100,
                    0,
                    100
                );
        }

        const bar =
            this.$(
                "#company-level-progress"
            );

        if (
            bar
        ) {

            bar.style.width =
                `${progress}%`;
        }

        this.setText(
            "#current-level-value",
            this.formatMoney(
                company.valuation,
                true
            )
        );

        this.setText(
            "#next-level-value",

            nextStage
                ? `Próximo nível: ${this.formatMoney(
                    nextStage.valuation,
                    true
                )}`
                : "Nível máximo"
        );
    }

    /* ======================================================
    EMPLOYEE SUMMARY
    ====================================================== */

    renderEmployeeSummary() {

        const employees =
            this.getEmployeesCompat();

        const payroll =
            employees.reduce(
                (
                    total,
                    employee
                ) =>
                    total +
                    (
                        Number(
                            employee.salary
                        )
                        ||
                        0
                    ),
                0
            );

        this.setText(
            "#employee-total",
            employees.length
        );

        this.setText(
            "#employee-payroll",
            this.formatMoney(
                payroll
            )
            +
            "/mês"
        );

        this.setText(
            "#employee-productivity",
            `${Math.round(
                this.getAverageProductivityCompat()
            )}%`
        );

        this.setText(
            "#employee-happiness",
            `${Math.round(
                this.getAverageHappinessCompat()
            )}%`
        );
    }

    /* ======================================================
    FINANÇAS
    ====================================================== */

    renderFinances() {

        const state =
            this.getState();

        if (
            !state
        ) {

            return;
        }

        const company =
            state.company
            ||
            {};

        const finances =
            state.finances
            ||
            {};

        const cash =
            Number(
                finances.cash
            )
            ||
            Number(
                company.money
            )
            ||
            0;

        const revenue =
            Number(
                finances.dailyRevenue
            )
            ||
            Number(
                company.revenue
            )
            ||
            0;

        const expenses =
            Number(
                finances.dailyExpenses
            )
            ||
            Number(
                company.expenses
            )
            ||
            0;

        const profit =
            Number(
                finances.dailyProfit
            )
            ||
            Number(
                company.profit
            )
            ||
            0;

        this.setText(
            "#finance-cash",
            this.formatMoney(
                cash
            )
        );

        this.setText(
            "#finance-revenue",
            "+" +
            this.formatMoney(
                revenue
            )
            +
            "/dia"
        );

        this.setText(
            "#finance-expenses",
            "-" +
            this.formatMoney(
                Math.abs(
                    expenses
                )
            )
            +
            "/dia"
        );

        this.setText(
            "#finance-profit",
            this.formatSignedMoney(
                profit
            )
            +
            "/dia"
        );

        this.setText(
            "#finance-valuation",
            this.formatMoney(
                company.valuation
            )
        );

        const latest =
            finances.ledger
                ?.at?.(
                    -1
                )
            ||
            null;

        const salaries =
            Number(
                latest?.salaries
            )
            ||
            Number(
                finances.salaryExpenses
            )
            ||
            0;

        const infrastructure =
            Number(
                latest?.rent
            )
            +
            Number(
                latest?.serverCosts
            )
            +
            Number(
                latest?.productOperating
            )
            ||
            Number(
                finances.infrastructureExpenses
            )
            ||
            0;

        this.setText(
            "#expense-salaries",
            this.formatMoney(
                salaries
            )
        );

        this.setText(
            "#expense-infrastructure",
            this.formatMoney(
                infrastructure
            )
        );

        this.setText(
            "#expense-marketing",
            this.formatMoney(
                finances.marketingExpenses
                ||
                0
            )
        );

        this.setText(
            "#expense-research",
            this.formatMoney(
                finances.researchExpenses
                ||
                0
            )
        );
    }

    /* ======================================================
    MERCADO
    ====================================================== */

    renderMarket() {

        const ranking =
            this.systems
                ?.getMarketRanking?.()
            ||
            [];

        const container =
            this.$(
                "#market-ranking"
            );

        if (
            !container
        ) {

            return;
        }

        container.innerHTML =
            ranking
                .map(
                    (
                        company,
                        index
                    ) => `

<div
class="market-row ${company.player
                            ? "player"
                            : ""
                        }"
>

<span class="market-position">
${company.rank || index + 1}.
</span>

<span class="market-company">

${company.player
                            ? "⭐ "
                            : ""
                        }

${this.escapeHTML(
                            company.name
                        )}

</span>

<span class="market-value">
${this.formatMoney(
                            company.valuation,
                            true
                        )}
</span>

</div>
`
                )
                .join("");
    }

    /* ======================================================
    CONQUISTAS
    ====================================================== */

    renderAchievements() {

        const state =
            this.getState();

        if (
            !state
        ) {

            return;
        }

        const unlockedAchievements =
            state.achievements
            ||
            [];

        this.$$(
            "[data-achievement]"
        )
            .forEach(
                card => {

                    const id =
                        card.dataset
                            .achievement;

                    const unlocked =
                        unlockedAchievements.includes(
                            id
                        );

                    card.classList.toggle(
                        "locked",
                        !unlocked
                    );

                    card.classList.toggle(
                        "unlocked",
                        unlocked
                    );

                    const achievement =
                        ACHIEVEMENTS[
                        id
                        ];

                    if (
                        achievement
                    ) {

                        card.title =
                            `${achievement.name}: ${achievement.description}`;
                    }
                }
            );
    }

    /* ======================================================
    ATUALIZAR TUDO
    ====================================================== */

    updateAll() {

        if (
            !this.systems
        ) {

            return;
        }

        const sections = [

            [
                "HUD",
                () =>
                    this.updateHUD()
            ],

            [
                "Visão geral",
                () =>
                    this.renderOverview()
            ],

            [
                "Resumo de funcionários",
                () =>
                    this.renderEmployeeSummary()
            ],

            [
                "Funcionários",
                () =>
                    this.renderEmployees()
            ],

            [
                "Produtos",
                () =>
                    this.renderProducts()
            ],

            [
                "Pesquisa",
                () =>
                    this.renderResearch()
            ],

            [
                "Finanças",
                () =>
                    this.renderFinances()
            ],

            [
                "Mercado",
                () =>
                    this.renderMarket()
            ],

            [
                "Conquistas",
                () =>
                    this.renderAchievements()
            ]

        ];

        sections.forEach(
            (
                [
                    name,
                    callback
                ]
            ) => {

                try {

                    callback();

                }
                catch (
                error
                ) {

                    console.error(
                        `[Startup Tycoon UI] Erro em ${name}:`,
                        error
                    );
                }
            }
        );
    }

    /* ======================================================
    AUTOSAVE
    ====================================================== */

    showAutosave() {

        const element =
            this.$(
                "#autosave-indicator"
            );

        if (
            !element
        ) {

            return;
        }

        element.classList.remove(
            "hidden"
        );

        element.hidden =
            false;

        setTimeout(
            () => {

                element.classList.add(
                    "hidden"
                );

                element.hidden =
                    true;

            },
            1200
        );

        this.updateContinueButton();
    }

    /* ======================================================
    NOTIFICAÇÕES
    ====================================================== */

    notify(
        title,
        message,
        type = "info",
        duration = 4000
    ) {

        let container =
            this.$(
                "#notification-container"
            )
            ||
            this.$(
                "#notifications"
            );

        if (
            !container
        ) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "notification-container";

            container.style.position =
                "fixed";

            container.style.right =
                "20px";

            container.style.bottom =
                "80px";

            container.style.zIndex =
                "20000";

            container.style.display =
                "flex";

            container.style.flexDirection =
                "column";

            container.style.gap =
                "8px";

            container.style.pointerEvents =
                "none";

            document.body.appendChild(
                container
            );
        }

        const notification =
            document.createElement(
                "div"
            );

        notification.className =
            `notification ${type}`;

        notification.style.pointerEvents =
            "none";

        const icons = {

            success:
                "✅",

            error:
                "❌",

            warning:
                "⚠️",

            info:
                "ℹ️"
        };

        notification.innerHTML = `

<div class="notification-icon">
${icons[type] || "ℹ️"}
</div>

<div>

<strong>
${this.escapeHTML(
            title
        )}
</strong>

<p>
${this.escapeHTML(
            message
        )}
</p>

</div>
`;

        container.appendChild(
            notification
        );

        while (
            container.children
                .length >
            5
        ) {

            container.firstElementChild
                ?.remove();
        }

        setTimeout(
            () => {

                notification.classList.add(
                    "hide"
                );

                setTimeout(
                    () => {

                        notification.remove();

                    },
                    300
                );

            },
            duration
        );
    }

}

/* ==========================================================
HELPER LOCAL
========================================================== */

function clampUI(
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

/* ==========================================================
EXPORT
========================================================== */

export {
    GameUI
};
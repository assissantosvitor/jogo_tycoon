/* ==========================================================
   STARTUP TYCOON 3D
   game.js — VERSÃO UNIFICADA

   Integra:
   - Three.js / WebGL
   - Cidade externa simplificada
   - Prédio grande da empresa
   - Entrada/saída da empresa
   - Escritório expansível
   - Salas desbloqueáveis
   - Construção por grid
   - Preview verde/vermelho
   - Funcionários 3D
   - IA de atividades
   - Pathfinding A*
   - Câmera estilo Tycoon
   - WASD / mouse / zoom
   - Integração com systems.js e ui.js

   ALTERAÇÕES:
   - Removidos botões flutuantes de entrar/sair
   - Clique na porta para entrar
   - Tecla E para entrar/sair
   - Aviso inferior não bloqueia cliques
   - Transição com fade
   - Recepção funcional com recepcionista 3D
   - Área de espera e diretório de setores
   - Elevador 3D clicável para navegar pelos setores
   ========================================================== */

import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";

import {
    GameSystems
} from "./systems.js";

import {
    GameUI
} from "./ui.js";


/* ==========================================================
   CONFIG
   ========================================================== */

const CONFIG = {

    defaultOfficeWidth:
        20,

    defaultOfficeDepth:
        16,

    gridSize:
        1,

    employeeSpeed:
        1.65,

    cameraSpeed:
        12,


    colors: {

        floor:
            0xd8dce5,

        wall:
            0xe8ebf1,

        wallDark:
            0xc3c9d2,


        desk:
            0x805f46,

        deskDark:
            0x5c4435,

        computer:
            0x242b35,

        screen:
            0x49a8ff,

        chair:
            0x354052,

        sofa:
            0x586a81,

        plant:
            0x48a966,

        skin:
            0xf0c19b,

        server:
            0x252d38,

        lab:
            0x486172,


        cityGround:
            0x71808f,

        road:
            0x3a3f46,

        buildingA:
            0x8a97a8,

        buildingB:
            0x6e7a88,

        buildingC:
            0x9aa6b5,

        glass:
            0x7bc8ff,


        hqPrimary:
            0x3f5368,

        hqSecondary:
            0x5d7289,

        hqGlass:
            0x6bc7ff,

        plaza:
            0xcdd3dc
    }
};


/* ==========================================================
   HELPERS
   ========================================================== */

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


function cellKey(
    x,
    z
) {

    return `${x}:${z}`;
}


/* ==========================================================
   GAME
   ========================================================== */

class StartupTycoon3D {


    constructor() {


        this.canvas =
            document.getElementById(
                "game-canvas"
            );


        /* ==================================================
           THREE
           ================================================== */

        this.scene =
            null;

        this.camera =
            null;

        this.renderer =
            null;

        this.controls =
            null;

        this.clock =
            new THREE.Clock();


        /* ==================================================
           GROUPS
           ================================================== */

        this.cityGroup =
            new THREE.Group();

        this.hqExteriorGroup =
            new THREE.Group();


        this.officeShellGroup =
            new THREE.Group();

        this.roomGroup =
            new THREE.Group();

        this.staticFurnitureGroup =
            new THREE.Group();

        this.playerFurnitureGroup =
            new THREE.Group();

        this.employeeGroup =
            new THREE.Group();


        /* ==================================================
           SYSTEMS
           ================================================== */

        this.systems =
            null;

        this.ui =
            null;


        /* ==================================================
           GAME
           ================================================== */

        this.gameStarted =
            false;

        this.gamePaused =
            false;

        this.gameSpeed =
            1;


        /*
         * exterior = cidade
         * interior = escritório
         */

        this.viewMode =
            "exterior";


        /* ==================================================
           OFFICE
           ================================================== */

        this.officeLevel =
            1;

        this.officeWidth =
            CONFIG.defaultOfficeWidth;

        this.officeDepth =
            CONFIG.defaultOfficeDepth;

        this.floorMesh =
            null;


        /* ==================================================
           INPUT
           ================================================== */

        this.keys =
            {};

        this.pointer =
            new THREE.Vector2();

        this.raycaster =
            new THREE.Raycaster();


        /* ==================================================
           BUILD
           ================================================== */

        this.buildMode =
            false;

        this.selectedBuildType =
            null;

        this.buildPreview =
            null;

        this.buildRotation =
            0;

        this.buildValid =
            false;

        this.playerBuildObjects =
            [];


        /* ==================================================
           PATHFINDING
           ================================================== */

        this.staticBlockedCells =
            new Set();

        this.playerBlockedCells =
            new Set();

        this.staticObstacleDefinitions =
            [];


        /* ==================================================
           EMPLOYEES
           ================================================== */

        this.employees3D =
            new Map();

        this.employeeBrains =
            new Map();


        /* ==================================================
           INTERACTION POINTS
           ================================================== */

        this.workstations =
            [];

        this.coffeeSpots =
            [];

        this.restSpots =
            [];

        this.meetingSpots =
            [];


        /* ==================================================
           EXTERIOR INTERACTION
           ================================================== */

        this.exteriorInteractionMeshes =
            [];

        this.hqDoorMesh =
            null;

        this.hqSignSprite =
            null;


        /* ==================================================
           INTERIOR INTERACTION / RECEPÇÃO
           ================================================== */

        this.interiorInteractionMeshes =
            [];

        this.receptionistModel =
            null;

        this.elevatorDoorMesh =
            null;

        this.sectorDirectoryGroup =
            null;

        this.sectorFocusIndex =
            -1;

        this.receptionClock =
            0;


        /* ==================================================
           VIEW UI
           ================================================== */

        this.viewOverlay =
            null;

        this.viewTitleLabel =
            null;

        this.viewHintLabel =
            null;


        this.transitionOverlay =
            null;

        this.transitioning =
            false;


        /* ==================================================
           PERFORMANCE
           ================================================== */

        this.frameCounter =
            0;

        this.fpsTimer =
            0;

        this.fps =
            60;


        /* ==================================================
           BINDS
           ================================================== */

        this.animate =
            this.animate.bind(
                this
            );


        this.handleResize =
            this.handleResize.bind(
                this
            );


        this.handleKeyDown =
            this.handleKeyDown.bind(
                this
            );


        this.handleKeyUp =
            this.handleKeyUp.bind(
                this
            );


        this.handlePointerMove =
            this.handlePointerMove.bind(
                this
            );


        this.handlePointerDown =
            this.handlePointerDown.bind(
                this
            );
    }


    /* ======================================================
       INIT
       ====================================================== */

    async init() {


        try {


            if (
                !this.canvas
            ) {

                throw new Error(
                    'Canvas "#game-canvas" não encontrado no index.html.'
                );
            }


            this.loading(
                5,
                "Inicializando Three.js..."
            );


            this.createScene();

            this.createCamera();

            this.createRenderer();


            this.loading(
                18,
                "Criando iluminação..."
            );


            this.createLights();


            this.loading(
                32,
                "Montando cidade..."
            );


            this.createCityBackground();

            this.createHQExterior();


            this.loading(
                48,
                "Criando escritório..."
            );


            this.buildOfficeShell();


            this.loading(
                60,
                "Adicionando móveis..."
            );


            this.createInitialFurniture();


            this.loading(
                72,
                "Ativando controles..."
            );


            this.createControls();

            this.bindEvents();


            this.loading(
                80,
                "Criando navegação..."
            );


            this.createViewOverlay();

            this.createTransitionOverlay();

            this.updateViewModeVisuals();


            this.loading(
                88,
                "Inicializando sistemas..."
            );


            this.systems =
                new GameSystems(
                    this
                );


            this.ui =
                new GameUI(
                    this,
                    this.systems
                );


            await this.systems.init();

            await this.ui.init();


            this.loading(
                96,
                "Ligando simulação..."
            );


            this.renderer.setAnimationLoop(
                this.animate
            );


            this.bindSaveSafety();


            setTimeout(
                () => {


                    this.loading(
                        100,
                        "Pronto!"
                    );


                    setTimeout(
                        () => {


                            const loading =
                                document.getElementById(
                                    "loading-screen"
                                );


                            loading
                                ?.classList
                                .add(
                                    "fade-out"
                                );


                            setTimeout(
                                () => {


                                    loading
                                        ?.classList
                                        .add(
                                            "hidden"
                                        );


                                },
                                500
                            );


                        },
                        200
                    );


                },
                200
            );


        }
        catch (
        error
        ) {


            console.error(
                "Erro ao iniciar Startup Tycoon 3D:",
                error
            );


            alert(
                "Erro ao iniciar Startup Tycoon 3D:\n\n" +
                error.message +
                "\n\nAbra o console com F12 para mais detalhes."
            );
        }
    }


    /* ======================================================
       SAVE SAFETY
       ====================================================== */

    bindSaveSafety() {


        window.addEventListener(
            "beforeunload",
            () => {


                this.systems
                    ?.saveGame?.(
                        true
                    );
            }
        );


        document.addEventListener(
            "visibilitychange",
            () => {


                if (
                    document.hidden
                ) {


                    this.systems
                        ?.saveGame?.(
                            true
                        );
                }
            }
        );


        this.canvas.addEventListener(
            "webglcontextlost",
            event => {


                event.preventDefault();


                this.setPaused(
                    true
                );


                this.systems
                    ?.saveGame?.(
                        true
                    );


                this.ui
                    ?.notify?.(

                        "WebGL interrompido",

                        "O jogo foi salvo. Recarregue a página para restaurar o 3D.",

                        "error"
                    );
            }
        );
    }


    /* ======================================================
       LOADING
       ====================================================== */

    loading(
        percent,
        text
    ) {


        const progress =
            document.getElementById(
                "loading-progress"
            );


        const number =
            document.getElementById(
                "loading-percentage"
            );


        const message =
            document.querySelector(
                ".loading-text"
            );


        if (
            progress
        ) {

            progress.style.width =
                `${percent}%`;
        }


        if (
            number
        ) {

            number.textContent =
                `${percent}%`;
        }


        if (
            message
        ) {

            message.textContent =
                text;
        }
    }


    /* ======================================================
       SCENE
       ====================================================== */

    createScene() {


        this.scene =
            new THREE.Scene();


        this.scene.background =
            new THREE.Color(
                0xaec7de
            );


        this.scene.fog =
            new THREE.Fog(
                0xaec7de,
                55,
                190
            );


        this.scene.add(

            this.cityGroup,

            this.hqExteriorGroup,

            this.officeShellGroup,

            this.roomGroup,

            this.staticFurnitureGroup,

            this.playerFurnitureGroup,

            this.employeeGroup
        );
    }


    /* ======================================================
       CAMERA
       ====================================================== */

    createCamera() {


        this.camera =
            new THREE.PerspectiveCamera(

                45,

                window.innerWidth /
                window.innerHeight,

                0.1,

                400
            );


        this.camera.position.set(
            0,
            22,
            42
        );


        this.camera.lookAt(
            0,
            8,
            0
        );
    }


    /* ======================================================
       RENDERER
       ====================================================== */

    createRenderer() {


        this.renderer =
            new THREE.WebGLRenderer({

                canvas:
                    this.canvas,

                antialias:
                    true,

                powerPreference:
                    "high-performance"
            });


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        this.renderer.shadowMap.enabled =
            true;


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;


        this.renderer.toneMappingExposure =
            1.05;
    }


    /* ======================================================
       LIGHTS
       ====================================================== */

    createLights() {


        const ambient =
            new THREE.HemisphereLight(
                0xffffff,
                0x596675,
                1.65
            );


        this.scene.add(
            ambient
        );


        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                2.15
            );


        sun.position.set(
            22,
            35,
            14
        );


        sun.castShadow =
            true;


        sun.shadow.mapSize.set(
            2048,
            2048
        );


        sun.shadow.camera.left =
            -80;


        sun.shadow.camera.right =
            80;


        sun.shadow.camera.top =
            80;


        sun.shadow.camera.bottom =
            -80;


        sun.shadow.camera.near =
            1;


        sun.shadow.camera.far =
            200;


        this.scene.add(
            sun
        );


        const fill =
            new THREE.DirectionalLight(
                0x9bc9ff,
                0.45
            );


        fill.position.set(
            -18,
            10,
            -8
        );


        this.scene.add(
            fill
        );
    }


    /* ======================================================
       MATERIAL
       ====================================================== */

    material(
        color,
        options = {}
    ) {


        return new THREE.MeshStandardMaterial({

            color,

            roughness:
                options.roughness ??
                0.75,

            metalness:
                options.metalness ??
                0,

            transparent:
                options.transparent ??
                false,

            opacity:
                options.opacity ??
                1
        });
    }


    /* ======================================================
       BOX
       ====================================================== */

    box(
        width,
        height,
        depth,
        color,
        x = 0,
        y = 0,
        z = 0
    ) {


        const mesh =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    height,
                    depth
                ),

                this.material(
                    color
                )
            );


        mesh.position.set(
            x,
            y,
            z
        );


        mesh.castShadow =
            true;


        mesh.receiveShadow =
            true;


        return mesh;
    }


    /* ======================================================
       CLEAR GROUP
       ====================================================== */

    clearGroup(
        group
    ) {


        while (
            group.children.length
        ) {


            const child =
                group.children[
                0
                ];


            group.remove(
                child
            );


            this.disposeObject(
                child
            );
        }
    }


    /* ======================================================
       CITY
       ====================================================== */

    createCityBackground() {


        this.clearGroup(
            this.cityGroup
        );


        const ground =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    180,
                    180
                ),

                this.material(
                    CONFIG.colors.cityGround,
                    {
                        roughness:
                            1
                    }
                )
            );


        ground.rotation.x =
            -Math.PI /
            2;


        ground.position.y =
            -0.02;


        ground.receiveShadow =
            true;


        this.cityGroup.add(
            ground
        );


        const roadMaterial =
            this.material(
                CONFIG.colors.road,
                {
                    roughness:
                        0.95
                }
            );


        const roadHorizontal =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    180,
                    12
                ),

                roadMaterial
            );


        roadHorizontal.rotation.x =
            -Math.PI /
            2;


        roadHorizontal.position.y =
            0.01;


        const roadVertical =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    12,
                    180
                ),

                roadMaterial
            );


        roadVertical.rotation.x =
            -Math.PI /
            2;


        roadVertical.position.y =
            0.011;


        this.cityGroup.add(
            roadHorizontal,
            roadVertical
        );


        this.createRoadLines();


        const plaza =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    46,
                    34
                ),

                this.material(
                    CONFIG.colors.plaza,
                    {
                        roughness:
                            0.95
                    }
                )
            );


        plaza.rotation.x =
            -Math.PI /
            2;


        plaza.position.y =
            0.02;


        this.cityGroup.add(
            plaza
        );


        this.createBackgroundBuildings();

        this.createCityTrees();
    }


    /* ======================================================
       ROAD LINES
       ====================================================== */

    createRoadLines() {


        const material =
            new THREE.MeshBasicMaterial({
                color:
                    0xf4d36a
            });


        for (
            let x = -80;
            x <= 80;
            x += 7
        ) {


            const line =
                new THREE.Mesh(

                    new THREE.PlaneGeometry(
                        3.2,
                        0.18
                    ),

                    material
                );


            line.rotation.x =
                -Math.PI /
                2;


            line.position.set(
                x,
                0.03,
                0
            );


            this.cityGroup.add(
                line
            );
        }


        for (
            let z = -80;
            z <= 80;
            z += 7
        ) {


            const line =
                new THREE.Mesh(

                    new THREE.PlaneGeometry(
                        0.18,
                        3.2
                    ),

                    material
                );


            line.rotation.x =
                -Math.PI /
                2;


            line.position.set(
                0,
                0.031,
                z
            );


            this.cityGroup.add(
                line
            );
        }
    }


    /* ======================================================
       BUILDINGS
       ====================================================== */

    createBackgroundBuildings() {


        const colors = [

            CONFIG.colors.buildingA,

            CONFIG.colors.buildingB,

            CONFIG.colors.buildingC,

            0x687688,

            0x8390a0,

            0x576474
        ];


        for (
            let i = 0;
            i < 42;
            i++
        ) {


            const x =
                randomBetween(
                    -78,
                    78
                );


            const z =
                randomBetween(
                    -78,
                    78
                );


            if (
                Math.abs(
                    x
                ) <
                22

                &&

                Math.abs(
                    z
                ) <
                22
            ) {


                i--;

                continue;
            }


            const width =
                randomBetween(
                    4,
                    10
                );


            const depth =
                randomBetween(
                    4,
                    10
                );


            const height =
                randomBetween(
                    8,
                    38
                );


            const building =
                this.box(

                    width,

                    height,

                    depth,

                    choose(
                        colors
                    ),

                    x,

                    height /
                    2,

                    z
                );


            this.cityGroup.add(
                building
            );


            const glass =
                this.box(

                    width *
                    0.72,

                    height *
                    0.78,

                    0.10,

                    CONFIG.colors.glass,

                    x,

                    height *
                    0.55,

                    z +
                    depth /
                    2 +
                    0.06
                );


            glass.material.transparent =
                true;


            glass.material.opacity =
                0.28;


            glass.castShadow =
                false;


            this.cityGroup.add(
                glass
            );
        }
    }


    /* ======================================================
       CITY TREES
       ====================================================== */

    createCityTrees() {


        const positions = [

            [
                -18,
                10
            ],

            [
                18,
                10
            ],

            [
                -20,
                -8
            ],

            [
                20,
                -8
            ],

            [
                -8,
                18
            ],

            [
                8,
                18
            ],

            [
                -26,
                0
            ],

            [
                26,
                0
            ]
        ];


        positions.forEach(
            (
                [
                    x,
                    z
                ]
            ) => {


                const plant =
                    this.createPlant();


                plant.scale.set(
                    1.25,
                    1.25,
                    1.25
                );


                plant.position.set(
                    x,
                    0,
                    z
                );


                this.cityGroup.add(
                    plant
                );
            }
        );
    }


    /* ======================================================
       HQ EXTERIOR
       ====================================================== */

    createHQExterior() {


        this.clearGroup(
            this.hqExteriorGroup
        );


        this.exteriorInteractionMeshes =
            [];


        const level =
            Math.max(
                1,
                this.officeLevel
            );


        const podiumWidth =
            20 +
            (
                level -
                1
            ) *
            2;


        const towerWidth =
            13 +
            (
                level -
                1
            ) *
            1.2;


        const towerHeight =
            24 +
            level *
            5;


        const podium =
            this.box(

                podiumWidth,

                4.5,

                16,

                CONFIG.colors.hqPrimary,

                0,

                2.25,

                0
            );


        this.hqExteriorGroup.add(
            podium
        );


        const tower =
            this.box(

                towerWidth,

                towerHeight,

                11,

                CONFIG.colors.hqSecondary,

                0,

                4.5 +
                towerHeight /
                2,

                -1
            );


        this.hqExteriorGroup.add(
            tower
        );


        const glassFront =
            this.box(

                towerWidth *
                0.66,

                towerHeight *
                0.76,

                0.22,

                CONFIG.colors.hqGlass,

                0,

                6 +
                towerHeight *
                0.48,

                4.65
            );


        glassFront.material.transparent =
            true;


        glassFront.material.opacity =
            0.42;


        this.hqExteriorGroup.add(
            glassFront
        );


        const glassSide =
            this.box(

                0.22,

                towerHeight *
                0.70,

                7.5,

                CONFIG.colors.hqGlass,

                -towerWidth /
                2 -
                0.1,

                6 +
                towerHeight *
                0.45,

                -1.2
            );


        glassSide.material.transparent =
            true;


        glassSide.material.opacity =
            0.28;


        this.hqExteriorGroup.add(
            glassSide
        );


        const wingLeft =
            this.box(

                5.5,

                6,

                10,

                CONFIG.colors.hqSecondary,

                -podiumWidth /
                2 +
                1.3,

                3,

                0
            );


        const wingRight =
            this.box(

                5.5,

                6,

                10,

                CONFIG.colors.hqSecondary,

                podiumWidth /
                2 -
                1.3,

                3,

                0
            );


        this.hqExteriorGroup.add(

            wingLeft,

            wingRight
        );


        /*
         * Moldura da entrada.
         */

        this.hqExteriorGroup.add(

            this.box(
                0.4,
                3.2,
                0.4,
                0xe7eef7,
                -2,
                1.6,
                8.05
            ),

            this.box(
                0.4,
                3.2,
                0.4,
                0xe7eef7,
                2,
                1.6,
                8.05
            ),

            this.box(
                4.4,
                0.35,
                0.4,
                0xe7eef7,
                0,
                3.1,
                8.05
            )
        );


        /*
         * Porta clicável.
         */

        this.hqDoorMesh =
            this.box(

                3.5,

                2.8,

                0.18,

                0x88d9ff,

                0,

                1.4,

                7.96
            );


        this.hqDoorMesh.material.transparent =
            true;


        this.hqDoorMesh.material.opacity =
            0.55;


        this.hqDoorMesh.userData.action =
            "enter-office";


        this.hqExteriorGroup.add(
            this.hqDoorMesh
        );


        this.exteriorInteractionMeshes.push(
            this.hqDoorMesh
        );


        /*
         * Escadas.
         */

        this.hqExteriorGroup.add(

            this.box(
                7,
                0.28,
                3.2,
                0xd9dde5,
                0,
                0.14,
                10.8
            ),

            this.box(
                5.8,
                0.28,
                2.6,
                0xc8cfd9,
                0,
                0.42,
                9.7
            ),

            this.box(
                4.6,
                0.28,
                2.1,
                0xbcc5d1,
                0,
                0.70,
                8.8
            )
        );


        this.updateHQName();


        [
            [
                -5.5,
                11
            ],

            [
                -3.5,
                11.5
            ],

            [
                3.5,
                11.5
            ],

            [
                5.5,
                11
            ]

        ].forEach(
            (
                [
                    x,
                    z
                ]
            ) => {


                const plant =
                    this.createPlant();


                plant.position.set(
                    x,
                    0,
                    z
                );


                plant.scale.set(
                    1.1,
                    1.1,
                    1.1
                );


                this.hqExteriorGroup.add(
                    plant
                );
            }
        );
    }


    /* ======================================================
       TEXT SPRITE
       ====================================================== */

    createTextSprite(
        text
    ) {


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            512;


        canvas.height =
            128;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.fillStyle =
            "rgba(20, 30, 45, 0.92)";


        ctx.fillRect(
            8,
            10,
            496,
            108
        );


        ctx.strokeStyle =
            "rgba(125, 206, 255, 0.9)";


        ctx.lineWidth =
            4;


        ctx.strokeRect(
            8,
            10,
            496,
            108
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 44px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            text,
            256,
            64
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        texture.colorSpace =
            THREE.SRGBColorSpace;


        return new THREE.Sprite(

            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthTest:
                    true
            })
        );
    }


    /* ======================================================
       HQ NAME
       ====================================================== */

    updateHQName() {


        if (
            !this.hqExteriorGroup
        ) {

            return;
        }


        if (
            this.hqSignSprite
        ) {


            this.hqExteriorGroup.remove(
                this.hqSignSprite
            );


            this.disposeObject(
                this.hqSignSprite
            );


            this.hqSignSprite =
                null;
        }


        const companyName =

            this.systems
                ?.getPublicState?.()
                ?.company
                ?.name

            ||

            "STARTUP HQ";


        this.hqSignSprite =
            this.createTextSprite(

                companyName
                    .toUpperCase()
            );


        this.hqSignSprite.position.set(
            0,
            5.6,
            8.3
        );


        this.hqSignSprite.scale.set(
            6,
            1.25,
            1
        );


        this.hqExteriorGroup.add(
            this.hqSignSprite
        );
    }


    /* ======================================================
       VIEW OVERLAY — SEM BOTÕES
       ====================================================== */

    createViewOverlay() {


        if (
            this.viewOverlay
        ) {

            return;
        }


        const container =
            document.createElement(
                "div"
            );


        container.id =
            "view-overlay-panel";


        Object.assign(

            container.style,

            {

                position:
                    "fixed",

                left:
                    "50%",

                bottom:
                    "18px",

                transform:
                    "translateX(-50%)",

                zIndex:
                    "2000",

                display:
                    "none",

                alignItems:
                    "center",

                gap:
                    "8px",

                padding:
                    "8px 12px",

                maxWidth:
                    "min(520px, calc(100vw - 32px))",

                borderRadius:
                    "999px",

                background:
                    "rgba(12,18,28,0.72)",

                backdropFilter:
                    "blur(7px)",

                border:
                    "1px solid rgba(120,180,255,0.18)",

                boxShadow:
                    "0 8px 22px rgba(0,0,0,0.20)",

                color:
                    "#ffffff",

                fontFamily:
                    "Arial, sans-serif",

                fontSize:
                    "12px",

                pointerEvents:
                    "none",

                userSelect:
                    "none"
            }
        );


        const title =
            document.createElement(
                "strong"
            );


        title.style.fontSize =
            "12px";


        title.style.whiteSpace =
            "nowrap";


        const hint =
            document.createElement(
                "span"
            );


        hint.style.opacity =
            "0.82";


        hint.style.whiteSpace =
            "nowrap";


        container.append(
            title,
            hint
        );


        document.body.appendChild(
            container
        );


        this.viewOverlay =
            container;


        this.viewTitleLabel =
            title;


        this.viewHintLabel =
            hint;
    }


    /* ======================================================
       TRANSITION OVERLAY
       ====================================================== */

    createTransitionOverlay() {


        if (
            this.transitionOverlay
        ) {

            return;
        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "world-transition-overlay";


        Object.assign(

            overlay.style,

            {

                position:
                    "fixed",

                inset:
                    "0",

                zIndex:
                    "99999",

                background:
                    "#07101b",

                opacity:
                    "0",

                pointerEvents:
                    "none",

                transition:
                    "opacity 220ms ease",

                display:
                    "block"
            }
        );


        document.body.appendChild(
            overlay
        );


        this.transitionOverlay =
            overlay;
    }


    /* ======================================================
       VIEW VISIBILITY
       ====================================================== */

    updateViewModeVisuals() {


        const exterior =
            this.viewMode ===
            "exterior";


        const interior =
            !exterior;


        this.cityGroup.visible =
            exterior;


        this.hqExteriorGroup.visible =
            exterior;


        this.officeShellGroup.visible =
            interior;


        this.roomGroup.visible =
            interior;


        this.staticFurnitureGroup.visible =
            interior;


        this.playerFurnitureGroup.visible =
            interior;


        this.employeeGroup.visible =
            interior;


        if (
            !this.viewOverlay
        ) {

            return;
        }


        this.viewOverlay.style.display =

            this.gameStarted

                ? "flex"

                : "none";


        this.viewTitleLabel.textContent =

            exterior

                ? "🏙️ Cidade"

                : "🏢 Escritório";


        this.viewHintLabel.textContent =

            exterior

                ? "Clique na porta ou pressione E para entrar"

                : "Pressione E para sair da empresa";
    }


    /* ======================================================
       SET VIEW IMMEDIATELY
       ====================================================== */

    setViewModeImmediate(
        mode,
        skipFocus = false
    ) {


        this.viewMode =
            mode;


        this.updateViewModeVisuals();


        if (
            skipFocus
        ) {

            return;
        }


        if (
            mode ===
            "exterior"
        ) {


            this.focusExterior();
        }
        else {


            this.focusInterior();
        }
    }


    /* ======================================================
       TRANSITION TO VIEW
       ====================================================== */

    transitionToView(
        mode
    ) {


        if (
            this.transitioning
        ) {

            return;
        }


        if (
            this.viewMode ===
            mode
        ) {

            return;
        }


        this.transitioning =
            true;


        if (
            !this.transitionOverlay
        ) {


            this.createTransitionOverlay();
        }


        if (
            this.controls
        ) {


            this.controls.enabled =
                false;
        }


        this.transitionOverlay.style.opacity =
            "1";


        window.setTimeout(
            () => {


                this.setViewModeImmediate(
                    mode,
                    false
                );


                window.setTimeout(
                    () => {


                        this.transitionOverlay.style.opacity =
                            "0";


                        window.setTimeout(
                            () => {


                                this.transitioning =
                                    false;


                                if (
                                    this.controls
                                ) {


                                    this.controls.enabled =
                                        true;
                                }


                            },
                            240
                        );


                    },
                    70
                );


            },
            230
        );
    }


    /* ======================================================
       EXTERIOR
       ====================================================== */

    switchToExteriorView(
        skipFocus = false
    ) {


        this.cancelBuildMode();


        if (
            skipFocus
        ) {


            this.setViewModeImmediate(
                "exterior",
                true
            );


            return;
        }


        this.transitionToView(
            "exterior"
        );
    }


    /* ======================================================
       ENTER OFFICE
       ====================================================== */

    enterOffice(
        skipFocus = false
    ) {


        if (
            skipFocus
        ) {


            this.setViewModeImmediate(
                "interior",
                true
            );


            return;
        }


        this.transitionToView(
            "interior"
        );
    }


    /* ======================================================
       FOCUS EXTERIOR
       ====================================================== */

    focusExterior() {


        if (
            !this.controls
        ) {

            return;
        }


        this.controls.target.set(
            0,
            8,
            0
        );


        this.camera.position.set(
            0,
            22,
            42
        );


        this.controls.update();
    }


    /* ======================================================
       FOCUS INTERIOR
       ====================================================== */

    focusInterior() {


        if (
            !this.controls
        ) {

            return;
        }


        const distance =
            Math.max(
                16,
                this.officeWidth *
                0.9
            );


        this.controls.target.set(
            0,
            0,
            0
        );


        this.camera.position.set(

            distance *
            0.65,

            distance *
            0.75,

            distance *
            0.7
        );


        this.controls.update();
    }


    /* ======================================================
       OFFICE STATE
       ====================================================== */

    applyOfficeState(
        officeState
    ) {


        if (
            !officeState
        ) {

            return;
        }


        this.officeLevel =

            Number(
                officeState.level
            )

            ||

            1;


        this.officeWidth =

            Number(
                officeState.width
            )

            ||

            CONFIG.defaultOfficeWidth;


        this.officeDepth =

            Number(
                officeState.depth
            )

            ||

            CONFIG.defaultOfficeDepth;


        this.buildOfficeShell();


        this.createHQExterior();


        this.refreshSectorDirectory();


        this.updateCameraForOffice();


        this.employeeBrains.forEach(
            (
                brain,
                employeeId
            ) => {


                brain.path =
                    [];


                brain.pathIndex =
                    0;


                brain.state =
                    "idle";


                brain.timer =
                    randomBetween(
                        0.5,
                        1.5
                    );


                if (
                    brain.workstation
                ) {


                    brain.workstation.occupiedBy =
                        null;


                    brain.workstation =
                        null;
                }


                setTimeout(
                    () => {


                        this.assignEmployeeTask(
                            employeeId
                        );


                    },
                    randomBetween(
                        200,
                        1000
                    )
                );
            }
        );
    }


    /* ======================================================
       OFFICE SHELL
       ====================================================== */

    buildOfficeShell() {


        this.clearGroup(
            this.officeShellGroup
        );


        this.clearGroup(
            this.roomGroup
        );


        this.staticBlockedCells.clear();


        this.staticObstacleDefinitions
            .forEach(
                definition => {


                    this.registerObstacle(

                        definition.x,

                        definition.z,

                        definition.halfWidth,

                        definition.halfDepth,

                        false
                    );
                }
            );


        this.createFloor();

        this.createOuterWalls();

        this.createOfficeWindows();

        this.createGrid();

        this.createRoomsForLevel(
            this.officeLevel
        );
    }


    /* ======================================================
       FLOOR
       ====================================================== */

    createFloor() {


        this.floorMesh =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    this.officeWidth,
                    this.officeDepth
                ),

                this.material(
                    CONFIG.colors.floor,
                    {
                        roughness:
                            0.9
                    }
                )
            );


        this.floorMesh.rotation.x =
            -Math.PI /
            2;


        this.floorMesh.receiveShadow =
            true;


        this.floorMesh.userData.type =
            "floor";


        this.officeShellGroup.add(
            this.floorMesh
        );


        this.officeShellGroup.add(

            this.box(

                this.officeWidth +
                0.5,

                0.4,

                this.officeDepth +
                0.5,

                0xa7afb9,

                0,

                -0.22,

                0
            )
        );
    }


    /* ======================================================
       OUTER WALLS
       ====================================================== */

    createOuterWalls() {


        const height =
            3.8;


        const thickness =
            0.25;


        const halfWidth =
            this.officeWidth /
            2;


        const halfDepth =
            this.officeDepth /
            2;


        this.officeShellGroup.add(

            this.box(

                this.officeWidth,

                height,

                thickness,

                CONFIG.colors.wall,

                0,

                height /
                2,

                -halfDepth
            )
        );


        this.officeShellGroup.add(

            this.box(

                thickness,

                height,

                this.officeDepth,

                CONFIG.colors.wall,

                -halfWidth,

                height /
                2,

                0
            )
        );


        this.officeShellGroup.add(

            this.box(

                thickness,

                0.35,

                this.officeDepth,

                CONFIG.colors.wallDark,

                halfWidth,

                0.175,

                0
            )
        );


        this.officeShellGroup.add(

            this.box(

                this.officeWidth,

                0.35,

                thickness,

                CONFIG.colors.wallDark,

                0,

                0.175,

                halfDepth
            )
        );
    }


    /* ======================================================
       OFFICE WINDOWS
       ====================================================== */

    createOfficeWindows() {


        const halfDepth =
            this.officeDepth /
            2;


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x71c6ff,

                transparent:
                    true,

                opacity:
                    0.42,

                roughness:
                    0.12,

                metalness:
                    0.05
            });


        const usableWidth =
            this.officeWidth -
            5;


        const count =
            Math.max(
                3,
                Math.floor(
                    usableWidth /
                    4
                )
            );


        const spacing =
            usableWidth /
            count;


        for (
            let i = 0;
            i < count;
            i++
        ) {


            const x =

                -usableWidth /
                2

                +

                spacing /
                2

                +

                i *
                spacing;


            const windowMesh =
                new THREE.Mesh(

                    new THREE.BoxGeometry(

                        Math.min(
                            2.7,
                            spacing -
                            0.5
                        ),

                        1.65,

                        0.05
                    ),

                    material
                );


            windowMesh.position.set(

                x,

                2.25,

                -halfDepth +
                0.14
            );


            this.officeShellGroup.add(
                windowMesh
            );
        }
    }


    /* ======================================================
       GRID
       ====================================================== */

    createGrid() {


        const size =
            Math.max(
                this.officeWidth,
                this.officeDepth
            );


        const divisions =
            Math.max(
                this.officeWidth,
                this.officeDepth
            );


        const grid =
            new THREE.GridHelper(

                size,

                divisions,

                0x838b95,

                0xabb1ba
            );


        grid.position.y =
            0.012;


        const materials =

            Array.isArray(
                grid.material
            )

                ? grid.material

                : [
                    grid.material
                ];


        materials.forEach(
            material => {


                material.transparent =
                    true;


                material.opacity =
                    0.10;
            }
        );


        this.officeShellGroup.add(
            grid
        );
    }


    /* ======================================================
       ROOMS
       ====================================================== */

    createRoomsForLevel(
        level
    ) {


        if (
            level >=
            2
        ) {


            this.createServerRoom();
        }


        if (
            level >=
            3
        ) {


            this.createDesignStudio();
        }


        if (
            level >=
            4
        ) {


            this.createResearchLab();
        }


        if (
            level >=
            5
        ) {


            this.createExecutiveArea();
        }
    }


    /* ======================================================
       VERTICAL PARTITION
       ====================================================== */

    createVerticalPartition(
        x,
        zMin,
        zMax,
        doorZ,
        doorWidth = 2
    ) {


        const wallHeight =
            2.7;


        const thickness =
            0.16;


        const halfDoor =
            doorWidth /
            2;


        const firstEnd =
            doorZ -
            halfDoor;


        const secondStart =
            doorZ +
            halfDoor;


        if (
            firstEnd >
            zMin
        ) {


            const length =
                firstEnd -
                zMin;


            this.roomGroup.add(

                this.box(

                    thickness,

                    wallHeight,

                    length,

                    CONFIG.colors.wall,

                    x,

                    wallHeight /
                    2,

                    zMin +
                    length /
                    2
                )
            );
        }


        if (
            secondStart <
            zMax
        ) {


            const length =
                zMax -
                secondStart;


            this.roomGroup.add(

                this.box(

                    thickness,

                    wallHeight,

                    length,

                    CONFIG.colors.wall,

                    x,

                    wallHeight /
                    2,

                    secondStart +
                    length /
                    2
                )
            );
        }


        for (
            let z =
                Math.ceil(
                    zMin
                );
            z <=
            Math.floor(
                zMax
            );
            z++
        ) {


            if (
                Math.abs(
                    z -
                    doorZ
                ) <=
                halfDoor
            ) {


                continue;
            }


            this.staticBlockedCells.add(

                cellKey(
                    Math.round(
                        x
                    ),
                    z
                )
            );
        }
    }


    /* ======================================================
       HORIZONTAL PARTITION
       ====================================================== */

    createHorizontalPartition(
        z,
        xMin,
        xMax,
        doorX,
        doorWidth = 2
    ) {


        const wallHeight =
            2.7;


        const thickness =
            0.16;


        const halfDoor =
            doorWidth /
            2;


        const firstEnd =
            doorX -
            halfDoor;


        const secondStart =
            doorX +
            halfDoor;


        if (
            firstEnd >
            xMin
        ) {


            const length =
                firstEnd -
                xMin;


            this.roomGroup.add(

                this.box(

                    length,

                    wallHeight,

                    thickness,

                    CONFIG.colors.wall,

                    xMin +
                    length /
                    2,

                    wallHeight /
                    2,

                    z
                )
            );
        }


        if (
            secondStart <
            xMax
        ) {


            const length =
                xMax -
                secondStart;


            this.roomGroup.add(

                this.box(

                    length,

                    wallHeight,

                    thickness,

                    CONFIG.colors.wall,

                    secondStart +
                    length /
                    2,

                    wallHeight /
                    2,

                    z
                )
            );
        }


        for (
            let x =
                Math.ceil(
                    xMin
                );
            x <=
            Math.floor(
                xMax
            );
            x++
        ) {


            if (
                Math.abs(
                    x -
                    doorX
                ) <=
                halfDoor
            ) {


                continue;
            }


            this.staticBlockedCells.add(

                cellKey(
                    x,
                    Math.round(
                        z
                    )
                )
            );
        }
    }


    /* ======================================================
       DOOR FRAME
       ====================================================== */

    createDoorFrame(
        x,
        z,
        rotation,
        label
    ) {


        const group =
            new THREE.Group();


        group.position.set(
            x,
            0,
            z
        );


        group.rotation.y =
            rotation;


        group.add(

            this.box(
                0.12,
                2.55,
                0.18,
                0x7c8794,
                -1,
                1.275,
                0
            ),

            this.box(
                0.12,
                2.55,
                0.18,
                0x7c8794,
                1,
                1.275,
                0
            ),

            this.box(
                2.12,
                0.14,
                0.18,
                0x7c8794,
                0,
                2.5,
                0
            )
        );


        const sign =
            this.createTextSprite(
                label
            );


        sign.position.set(
            0,
            2.85,
            0
        );


        sign.scale.set(
            2.2,
            0.55,
            1
        );


        group.add(
            sign
        );


        this.roomGroup.add(
            group
        );
    }


    /* ======================================================
       SERVER ROOM
       ====================================================== */

    createServerRoom() {


        const halfWidth =
            this.officeWidth /
            2;


        const halfDepth =
            this.officeDepth /
            2;


        const partitionX =
            Math.max(
                8,
                halfWidth -
                5
            );


        const zMin =
            -halfDepth +
            1;


        const zMax =
            Math.min(
                0,
                -halfDepth +
                8
            );


        const doorZ =
            (
                zMin +
                zMax
            ) /
            2;


        this.createVerticalPartition(

            partitionX,

            zMin,

            zMax,

            doorZ,

            2
        );


        this.createDoorFrame(

            partitionX,

            doorZ,

            Math.PI /
            2,

            "SERVIDORES"
        );


        const rackX =
            Math.min(
                halfWidth -
                1.5,
                partitionX +
                2
            );


        [
            {

                x:
                    rackX,

                z:
                    zMin +
                    1.3
            },

            {

                x:
                    rackX,

                z:
                    zMin +
                    3.4
            }

        ].forEach(
            position => {


                const server =
                    this.createServer();


                server.position.set(

                    position.x,

                    0,

                    position.z
                );


                this.roomGroup.add(
                    server
                );


                this.registerObstacle(

                    position.x,

                    position.z,

                    0,

                    0,

                    false
                );
            }
        );


        const light =
            new THREE.PointLight(
                0x5ea7ff,
                0.55,
                8
            );


        light.position.set(
            rackX,
            2.5,
            doorZ
        );


        this.roomGroup.add(
            light
        );
    }


    /* ======================================================
       DESIGN
       ====================================================== */

    createDesignStudio() {


        const halfWidth =
            this.officeWidth /
            2;


        const partitionX =
            -Math.max(
                9,
                halfWidth -
                6
            );


        const zMin =
            -1;


        const zMax =
            Math.min(
                this.officeDepth /
                2 -
                1,
                7
            );


        const doorZ =
            2;


        this.createVerticalPartition(

            partitionX,

            zMin,

            zMax,

            doorZ,

            2
        );


        this.createDoorFrame(

            partitionX,

            doorZ,

            Math.PI /
            2,

            "DESIGN"
        );


        const tableX =
            Math.max(
                -halfWidth +
                2,
                partitionX -
                2
            );


        const table =
            this.box(

                2.8,

                0.12,

                1.3,

                0xa67350,

                tableX,

                0.92,

                4.5
            );


        this.roomGroup.add(
            table
        );


        this.registerObstacle(
            tableX,
            4.5,
            1,
            0,
            false
        );


        const board =
            this.box(

                2.5,

                1.4,

                0.08,

                0xf0f2f5,

                -halfWidth +
                0.18,

                2,

                3
            );


        board.rotation.y =
            Math.PI /
            2;


        this.roomGroup.add(
            board
        );
    }


    /* ======================================================
       RESEARCH LAB
       ====================================================== */

    createResearchLab() {


        const halfWidth =
            this.officeWidth /
            2;


        const halfDepth =
            this.officeDepth /
            2;


        const partitionZ =
            Math.max(
                7,
                halfDepth -
                6
            );


        const xMin =
            -3;


        const xMax =
            Math.min(
                halfWidth -
                1,
                10
            );


        const doorX =
            2;


        this.createHorizontalPartition(

            partitionZ,

            xMin,

            xMax,

            doorX,

            2
        );


        this.createDoorFrame(

            doorX,

            partitionZ,

            0,

            "PESQUISA"
        );


        for (
            let i = 0;
            i < 3;
            i++
        ) {


            const x =
                i *
                3;


            const bench =
                this.box(

                    2.1,

                    0.8,

                    0.8,

                    CONFIG.colors.lab,

                    x,

                    0.4,

                    partitionZ +
                    2
                );


            this.roomGroup.add(
                bench
            );


            this.registerObstacle(
                x,
                partitionZ +
                2,
                1,
                0,
                false
            );


            const monitor =
                this.box(

                    0.7,

                    0.45,

                    0.08,

                    0x24313c,

                    x,

                    1.35,

                    partitionZ +
                    2
                );


            this.roomGroup.add(
                monitor
            );
        }


        const labLight =
            new THREE.PointLight(
                0x71e5ff,
                0.45,
                10
            );


        labLight.position.set(
            3,
            3,
            partitionZ +
            2
        );


        this.roomGroup.add(
            labLight
        );
    }


    /* ======================================================
       EXECUTIVE
       ====================================================== */

    createExecutiveArea() {


        const halfWidth =
            this.officeWidth /
            2;


        const halfDepth =
            this.officeDepth /
            2;


        const partitionZ =
            Math.max(
                8,
                halfDepth -
                6
            );


        const xMin =
            -halfWidth +
            1;


        const xMax =
            -5;


        const doorX =
            Math.max(
                xMin +
                2,
                -9
            );


        this.createHorizontalPartition(

            partitionZ,

            xMin,

            xMax,

            doorX,

            2
        );


        this.createDoorFrame(

            doorX,

            partitionZ,

            0,

            "EXECUTIVO"
        );


        const deskX =
            -halfWidth +
            4;


        const deskZ =
            partitionZ +
            2.5;


        const desk =
            this.createDesk();


        desk.position.set(
            deskX,
            0,
            deskZ
        );


        desk.scale.set(
            1.3,
            1,
            1.15
        );


        this.roomGroup.add(
            desk
        );


        this.registerObstacle(
            deskX,
            deskZ,
            1,
            0,
            false
        );


        const plant =
            this.createPlant();


        plant.position.set(
            deskX -
            2.5,
            0,
            deskZ
        );


        this.roomGroup.add(
            plant
        );


        this.registerObstacle(
            deskX -
            2.5,
            deskZ,
            0,
            0,
            false
        );
    }


    /* ======================================================
       INITIAL FURNITURE
       ====================================================== */

    createInitialFurniture() {


        /*
         * Mesas principais.
         */

        [
            [
                -4,
                -2
            ],

            [
                0,
                -2
            ],

            [
                4,
                -2
            ]

        ].forEach(
            (
                [
                    x,
                    z
                ]
            ) => {


                const station =
                    this.createWorkstation();


                station.position.set(
                    x,
                    0,
                    z
                );


                this.staticFurnitureGroup.add(
                    station
                );


                this.registerPersistentStaticObstacle(
                    x,
                    z,
                    1,
                    0
                );


                this.workstations.push({

                    object:
                        station,

                    workPosition:
                        new THREE.Vector3(
                            x,
                            0,
                            z +
                            1
                        ),

                    lookPosition:
                        new THREE.Vector3(
                            x,
                            0,
                            z
                        ),

                    occupiedBy:
                        null,

                    playerBuilt:
                        false
                });
            }
        );


        /*
         * Reunião.
         */

        const meetingTable =
            this.createMeetingTable();


        meetingTable.position.set(
            -6,
            0,
            4.5
        );


        this.staticFurnitureGroup.add(
            meetingTable
        );


        this.registerPersistentStaticObstacle(
            -6,
            4.5,
            2,
            1
        );


        [
            [
                -6,
                3
            ],

            [
                -6,
                6
            ],

            [
                -8.5,
                4.5
            ],

            [
                -3.5,
                4.5
            ]

        ].forEach(
            (
                [
                    x,
                    z
                ]
            ) => {


                this.meetingSpots.push({

                    position:
                        new THREE.Vector3(
                            x,
                            0,
                            z
                        ),

                    playerBuilt:
                        false
                });
            }
        );


        /*
         * Descanso.
         */

        const sofa =
            this.createSofa();


        sofa.position.set(
            3.5,
            0,
            5.5
        );


        sofa.rotation.y =
            Math.PI;


        this.staticFurnitureGroup.add(
            sofa
        );


        this.registerPersistentStaticObstacle(
            3.5,
            5.5,
            1,
            0
        );


        [
            [
                3,
                4.5
            ],

            [
                4,
                4.5
            ]

        ].forEach(
            (
                [
                    x,
                    z
                ]
            ) => {


                this.restSpots.push({

                    position:
                        new THREE.Vector3(
                            x,
                            0,
                            z
                        ),

                    playerBuilt:
                        false
                });
            }
        );


        /*
         * Café.
         */

        const coffee =
            this.createCoffeeMachine();


        coffee.position.set(
            8,
            0,
            5
        );


        this.staticFurnitureGroup.add(
            coffee
        );


        this.registerPersistentStaticObstacle(
            8,
            5,
            0,
            0
        );


        this.coffeeSpots.push({

            position:
                new THREE.Vector3(
                    7,
                    0,
                    5
                ),

            playerBuilt:
                false
        });


        /*
         * Plantas.
         */

        [
            [
                -8,
                -6
            ],

            [
                8,
                -6
            ]

        ].forEach(
            (
                [
                    x,
                    z
                ]
            ) => {


                const plant =
                    this.createPlant();


                plant.position.set(
                    x,
                    0,
                    z
                );


                this.staticFurnitureGroup.add(
                    plant
                );


                this.registerPersistentStaticObstacle(
                    x,
                    z,
                    0,
                    0
                );
            }
        );


        /*
         * RECEPÇÃO FUNCIONAL.
         */

        this.createReceptionArea();
    }


    /* ======================================================
       RECEPÇÃO FUNCIONAL
       ====================================================== */

    createReceptionArea() {


        this.interiorInteractionMeshes =
            [];


        this.receptionistModel =
            null;


        this.elevatorDoorMesh =
            null;


        this.sectorDirectoryGroup =
            null;


        this.sectorFocusIndex =
            -1;


        const halfWidth =
            this.officeWidth /
            2;


        const halfDepth =
            this.officeDepth /
            2;


        const receptionZ =
            Math.min(
                halfDepth -
                2.2,
                5.8
            );


        /* ==================================================
           BALCÃO
           ================================================== */

        const receptionDesk =
            this.createDesk();


        receptionDesk.position.set(
            0,
            0,
            receptionZ
        );


        receptionDesk.scale.set(
            1.35,
            1,
            1.12
        );


        receptionDesk.rotation.y =
            Math.PI;


        this.staticFurnitureGroup.add(
            receptionDesk
        );


        this.registerPersistentStaticObstacle(
            0,
            receptionZ,
            1,
            0
        );


        /* ==================================================
           COMPUTADOR DA RECEPÇÃO
           ================================================== */

        const receptionComputer =
            this.createComputer();


        receptionComputer.position.set(
            0,
            0,
            receptionZ -
            0.05
        );


        receptionComputer.rotation.y =
            Math.PI;


        this.staticFurnitureGroup.add(
            receptionComputer
        );


        /* ==================================================
           PLACA RECEPÇÃO
           ================================================== */

        const receptionSign =
            this.createTextSprite(
                "RECEPÇÃO"
            );


        receptionSign.position.set(
            0,
            2.75,
            receptionZ +
            0.85
        );


        receptionSign.scale.set(
            2.8,
            0.64,
            1
        );


        this.staticFurnitureGroup.add(
            receptionSign
        );


        /* ==================================================
           RECEPCIONISTA
           ================================================== */

        this.receptionistModel =
            this.createReceptionistModel();


        this.receptionistModel.position.set(
            0,
            0,
            receptionZ -
            1.05
        );


        this.receptionistModel.rotation.y =
            Math.PI;


        this.staticFurnitureGroup.add(
            this.receptionistModel
        );


        /* ==================================================
           ÁREA DE ESPERA
           ================================================== */

        const waitingX =
            Math.min(
                halfWidth -
                3,
                5.2
            );


        const waitingSofa =
            this.createSofa();


        waitingSofa.position.set(
            waitingX,
            0,
            receptionZ -
            0.6
        );


        waitingSofa.rotation.y =
            -Math.PI /
            2;


        waitingSofa.scale.set(
            0.9,
            0.9,
            0.9
        );


        this.staticFurnitureGroup.add(
            waitingSofa
        );


        this.registerPersistentStaticObstacle(
            waitingSofa.position.x,
            waitingSofa.position.z,
            0,
            1
        );


        this.restSpots.push({

            position:
                waitingSofa
                    .position
                    .clone()
                    .add(

                        new THREE.Vector3(
                            -1,
                            0,
                            0
                        )
                    ),

            playerBuilt:
                false
        });


        /* ==================================================
           MESA DE CENTRO
           ================================================== */

        const coffeeTable =
            this.box(

                1.2,

                0.35,

                0.75,

                0x7a5a42,

                waitingSofa.position.x -
                1.5,

                0.18,

                waitingSofa.position.z
            );


        this.staticFurnitureGroup.add(
            coffeeTable
        );


        this.registerPersistentStaticObstacle(
            coffeeTable.position.x,
            coffeeTable.position.z,
            0,
            0
        );


        /* ==================================================
           PLANTAS DA RECEPÇÃO
           ================================================== */

        [
            -2.7,
            2.7

        ].forEach(
            x => {


                const plant =
                    this.createPlant();


                plant.position.set(
                    x,
                    0,
                    receptionZ +
                    0.4
                );


                plant.scale.set(
                    0.85,
                    0.85,
                    0.85
                );


                this.staticFurnitureGroup.add(
                    plant
                );


                this.registerPersistentStaticObstacle(
                    x,
                    receptionZ +
                    0.4,
                    0,
                    0
                );
            }
        );


        /* ==================================================
           DIRETÓRIO DE SETORES
           ================================================== */

        const directoryX =
            Math.max(
                -halfWidth +
                1.4,
                -7
            );


        const directory =
            this.createSectorDirectory();


        this.sectorDirectoryGroup =
            directory;


        directory.position.set(
            directoryX,
            0,
            receptionZ -
            0.4
        );


        this.staticFurnitureGroup.add(
            directory
        );


        this.registerPersistentStaticObstacle(
            directoryX,
            receptionZ -
            0.4,
            0,
            0
        );


        /* ==================================================
           ELEVADOR
           ================================================== */

        const elevatorX =
            Math.max(
                -halfWidth +
                1.35,
                -8.2
            );


        const elevatorZ =
            Math.max(
                -halfDepth +
                1.2,
                receptionZ -
                4.4
            );


        const elevator =
            this.createElevatorBank();


        elevator.position.set(
            elevatorX,
            0,
            elevatorZ
        );


        this.staticFurnitureGroup.add(
            elevator
        );


        this.elevatorDoorMesh =
            elevator
                .userData
                .interactionMesh;


        if (
            this.elevatorDoorMesh
        ) {


            this.interiorInteractionMeshes.push(
                this.elevatorDoorMesh
            );
        }


        this.registerPersistentStaticObstacle(
            elevatorX,
            elevatorZ,
            1,
            0
        );
    }


    /* ======================================================
       MODELO DA RECEPCIONISTA
       ====================================================== */

    createReceptionistModel() {


        const group =
            new THREE.Group();


        group.name =
            "Receptionist";


        group.userData.type =
            "receptionist";


        const uniformColor =
            0x365d8d;


        const body =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.31,
                    0.36,
                    0.88,
                    10
                ),

                this.material(
                    uniformColor
                )
            );


        body.position.y =
            1.14;


        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.29,
                    16,
                    16
                ),

                this.material(
                    CONFIG.colors.skin
                )
            );


        head.position.y =
            1.82;


        const hair =
            new THREE.Mesh(

                new THREE.SphereGeometry(

                    0.30,

                    14,

                    10,

                    0,

                    Math.PI *
                    2,

                    0,

                    Math.PI /
                    2
                ),

                this.material(
                    0x30231e
                )
            );


        hair.position.y =
            1.91;


        const armGeometry =
            new THREE.CylinderGeometry(
                0.085,
                0.095,
                0.66,
                8
            );


        const skin =
            this.material(
                CONFIG.colors.skin
            );


        const leftArm =
            new THREE.Mesh(
                armGeometry,
                skin
            );


        leftArm.position.set(
            -0.40,
            1.15,
            0
        );


        leftArm.rotation.z =
            -0.12;


        const rightArm =
            new THREE.Mesh(
                armGeometry,
                skin
            );


        rightArm.position.set(
            0.40,
            1.15,
            0
        );


        rightArm.rotation.z =
            0.12;


        const legGeometry =
            new THREE.CylinderGeometry(
                0.1,
                0.11,
                0.68,
                8
            );


        const pants =
            this.material(
                0x27364b
            );


        const leftLeg =
            new THREE.Mesh(
                legGeometry,
                pants
            );


        leftLeg.position.set(
            -0.15,
            0.42,
            0
        );


        const rightLeg =
            new THREE.Mesh(
                legGeometry,
                pants
            );


        rightLeg.position.set(
            0.15,
            0.42,
            0
        );


        const badge =
            this.box(

                0.22,

                0.16,

                0.025,

                0xe8f2ff,

                0.13,

                1.28,

                0.34
            );


        const badgeStrip =
            this.box(

                0.16,

                0.03,

                0.028,

                0x46b7ff,

                0.13,

                1.30,

                0.355
            );


        group.add(

            body,

            head,

            hair,

            leftArm,

            rightArm,

            leftLeg,

            rightLeg,

            badge,

            badgeStrip
        );


        group.userData.parts = {

            head,

            leftArm,

            rightArm
        };


        group.traverse(
            child => {


                if (
                    child.isMesh
                ) {


                    child.castShadow =
                        true;
                }
            }
        );


        return group;
    }


    /* ======================================================
       ANIMAÇÃO DA RECEPCIONISTA
       ====================================================== */

    updateReceptionist(
        delta
    ) {


        if (
            !this.receptionistModel
        ) {


            return;
        }


        this.receptionClock +=
            delta;


        const parts =
            this.receptionistModel
                .userData
                .parts;


        if (
            !parts
        ) {


            return;
        }


        parts.leftArm.rotation.x =
            -0.72 +
            Math.sin(
                this.receptionClock *
                4
            ) *
            0.10;


        parts.rightArm.rotation.x =
            -0.72 +
            Math.sin(
                this.receptionClock *
                4 +
                1.4
            ) *
            0.10;


        parts.head.rotation.y =
            Math.sin(
                this.receptionClock *
                0.75
            ) *
            0.12;
    }


    /* ======================================================
       DIRETÓRIO DA EMPRESA
       ====================================================== */

    createSectorDirectory() {


        const group =
            new THREE.Group();


        group.userData.type =
            "sector-directory";


        const board =
            this.box(

                1.55,

                2.2,

                0.16,

                0x26384c,

                0,

                1.35,

                0
            );


        const header =
            this.createTextSprite(
                "SETORES"
            );


        header.position.set(
            0,
            2.15,
            0.11
        );


        header.scale.set(
            1.25,
            0.33,
            1
        );


        group.add(
            board,
            header
        );


        const sectors =
            this.getUnlockedSectors();


        const visible =
            sectors.slice(
                0,
                5
            );


        visible.forEach(
            (
                sector,
                index
            ) => {


                const label =
                    this.createTextSprite(
                        sector.label
                    );


                label.position.set(
                    0,
                    1.72 -
                    index *
                    0.36,
                    0.12
                );


                label.scale.set(
                    1.25,
                    0.27,
                    1
                );


                group.add(
                    label
                );
            }
        );


        return group;
    }


    /* ======================================================
       ATUALIZAR DIRETÓRIO
       ====================================================== */

    refreshSectorDirectory() {


        if (
            !this.sectorDirectoryGroup
        ) {


            return;
        }


        const oldDirectory =
            this.sectorDirectoryGroup;


        const position =
            oldDirectory
                .position
                .clone();


        const rotation =
            oldDirectory
                .rotation
                .clone();


        this.staticFurnitureGroup.remove(
            oldDirectory
        );


        this.disposeObject(
            oldDirectory
        );


        const newDirectory =
            this.createSectorDirectory();


        newDirectory.position.copy(
            position
        );


        newDirectory.rotation.copy(
            rotation
        );


        this.staticFurnitureGroup.add(
            newDirectory
        );


        this.sectorDirectoryGroup =
            newDirectory;
    }


    /* ======================================================
       ELEVADOR
       ====================================================== */

    createElevatorBank() {


        const group =
            new THREE.Group();


        group.userData.type =
            "elevator";


        const frame =
            this.box(

                2.6,

                3.2,

                0.32,

                0x364555,

                0,

                1.6,

                0
            );


        const doorLeft =
            this.box(

                1.08,

                2.55,

                0.08,

                0x7b8795,

                -0.56,

                1.35,

                0.19
            );


        const doorRight =
            this.box(

                1.08,

                2.55,

                0.08,

                0x717d8a,

                0.56,

                1.35,

                0.19
            );


        const interaction =
            this.box(

                2.15,

                2.55,

                0.06,

                0x6ec7ff,

                0,

                1.35,

                0.25
            );


        interaction.material.transparent =
            true;


        interaction.material.opacity =
            0.05;


        interaction.castShadow =
            false;


        interaction.userData.action =
            "cycle-sector";


        interaction.userData.type =
            "elevator-button";


        const panel =
            this.box(

                0.24,

                0.50,

                0.08,

                0x202936,

                1.48,

                1.35,

                0.20
            );


        const button =
            this.box(

                0.09,

                0.09,

                0.03,

                0x5ce0ff,

                1.48,

                1.42,

                0.265
            );


        const sign =
            this.createTextSprite(
                "ELEVADOR"
            );


        sign.position.set(
            0,
            3.0,
            0.2
        );


        sign.scale.set(
            1.8,
            0.42,
            1
        );


        group.add(

            frame,

            doorLeft,

            doorRight,

            interaction,

            panel,

            button,

            sign
        );


        group.userData.interactionMesh =
            interaction;


        return group;
    }


    /* ======================================================
       SETORES LIBERADOS
       ====================================================== */

    getUnlockedSectors() {


        const sectors = [

            {

                id:
                    "main",

                label:
                    "ÁREA PRINCIPAL",

                minLevel:
                    1,

                target:
                    new THREE.Vector3(
                        0,
                        0,
                        -1
                    ),

                distance:
                    13
            },

            {

                id:
                    "reception",

                label:
                    "RECEPÇÃO",

                minLevel:
                    1,

                target:
                    new THREE.Vector3(

                        0,

                        0,

                        Math.min(
                            this.officeDepth /
                            2 -
                            2.2,
                            5.8
                        )
                    ),

                distance:
                    9
            },

            {

                id:
                    "servers",

                label:
                    "SERVIDORES",

                minLevel:
                    2,

                target:
                    new THREE.Vector3(

                        Math.max(
                            6,
                            this.officeWidth /
                            2 -
                            3
                        ),

                        0,

                        -Math.max(
                            2,
                            this.officeDepth /
                            2 -
                            4
                        )
                    ),

                distance:
                    8
            },

            {

                id:
                    "design",

                label:
                    "DESIGN",

                minLevel:
                    3,

                target:
                    new THREE.Vector3(

                        -Math.max(
                            5,
                            this.officeWidth /
                            2 -
                            3
                        ),

                        0,

                        3
                    ),

                distance:
                    8
            },

            {

                id:
                    "research",

                label:
                    "PESQUISA",

                minLevel:
                    4,

                target:
                    new THREE.Vector3(

                        3,

                        0,

                        Math.max(
                            5,
                            this.officeDepth /
                            2 -
                            3
                        )
                    ),

                distance:
                    8
            },

            {

                id:
                    "executive",

                label:
                    "EXECUTIVO",

                minLevel:
                    5,

                target:
                    new THREE.Vector3(

                        -Math.max(
                            6,
                            this.officeWidth /
                            2 -
                            4
                        ),

                        0,

                        Math.max(
                            5,
                            this.officeDepth /
                            2 -
                            3
                        )
                    ),

                distance:
                    8
            }
        ];


        return sectors.filter(
            sector =>
                this.officeLevel >=
                sector.minLevel
        );
    }


    /* ======================================================
       ELEVADOR — TROCAR SETOR
       ====================================================== */

    cycleOfficeSector() {


        const sectors =
            this.getUnlockedSectors();


        if (
            sectors.length ===
            0
        ) {


            return;
        }


        this.sectorFocusIndex =
            (
                this.sectorFocusIndex +
                1
            )

            %

            sectors.length;


        const sector =
            sectors[
            this.sectorFocusIndex
            ];


        this.focusOfficeSector(
            sector
        );


        this.ui
            ?.notify?.(

                `🛗 ${sector.label}`,

                "Elevador: câmera direcionada para este setor.",

                "info",

                2600
            );
    }


    /* ======================================================
       FOCAR SETOR
       ====================================================== */

    focusOfficeSector(
        sector
    ) {


        if (
            !sector ||
            !this.controls
        ) {


            return;
        }


        const target =
            sector
                .target
                .clone();


        const distance =
            sector.distance ||
            8;


        this.controls.target.copy(
            target
        );


        this.camera.position.set(

            target.x +
            distance *
            0.75,

            distance *
            0.85,

            target.z +
            distance
        );


        this.controls.update();
    }


    /* ======================================================
       CLIQUE EM OBJETOS INTERNOS
       ====================================================== */

    detectInteriorInteraction(
        event
    ) {


        if (
            this.interiorInteractionMeshes
                .length ===
            0
        ) {


            return false;
        }


        const rect =
            this.canvas
                .getBoundingClientRect();


        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                )

                /

                rect.width
            )

            *

            2

            -

            1;


        this.pointer.y =
            -(

                (
                    event.clientY -
                    rect.top
                )

                /

                rect.height
            )

            *

            2

            +

            1;


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        const hit =
            this.raycaster
                .intersectObjects(

                    this.interiorInteractionMeshes,

                    false
                )[
            0
            ];


        if (
            !hit
        ) {


            return false;
        }


        if (
            hit.object
                ?.userData
                ?.action ===
            "cycle-sector"
        ) {


            this.cycleOfficeSector();


            return true;
        }


        return false;
    }


    /* ======================================================
       DESK
       ====================================================== */

    createDesk() {


        const group =
            new THREE.Group();


        group.userData.type =
            "desk";


        group.add(

            this.box(
                2.1,
                0.15,
                1,
                CONFIG.colors.desk,
                0,
                1,
                0
            ),

            this.box(
                0.13,
                1,
                0.75,
                CONFIG.colors.deskDark,
                -0.82,
                0.5,
                0
            ),

            this.box(
                0.13,
                1,
                0.75,
                CONFIG.colors.deskDark,
                0.82,
                0.5,
                0
            )
        );


        return group;
    }


    /* ======================================================
       COMPUTER
       ====================================================== */

    createComputer() {


        const group =
            new THREE.Group();


        group.userData.type =
            "computer";


        group.add(

            this.box(
                0.9,
                0.58,
                0.08,
                CONFIG.colors.computer,
                0,
                1.55,
                -0.1
            ),

            this.box(
                0.77,
                0.45,
                0.025,
                CONFIG.colors.screen,
                0,
                1.55,
                -0.15
            ),

            this.box(
                0.08,
                0.34,
                0.08,
                0x383f4b,
                0,
                1.2,
                -0.05
            ),

            this.box(
                0.4,
                0.04,
                0.28,
                0x303844,
                0,
                1.04,
                -0.03
            ),

            this.box(
                0.64,
                0.04,
                0.23,
                0x303844,
                0,
                1.08,
                0.3
            )
        );


        return group;
    }


    /* ======================================================
       CHAIR
       ====================================================== */

    createChair() {


        const group =
            new THREE.Group();


        group.userData.type =
            "chair";


        group.add(

            this.box(
                0.75,
                0.12,
                0.75,
                CONFIG.colors.chair,
                0,
                0.65,
                0
            ),

            this.box(
                0.75,
                0.85,
                0.13,
                CONFIG.colors.chair,
                0,
                1.1,
                0.3
            ),

            this.box(
                0.1,
                0.55,
                0.1,
                0x252b34,
                0,
                0.3,
                0
            )
        );


        return group;
    }


    /* ======================================================
       WORKSTATION
       ====================================================== */

    createWorkstation() {


        const group =
            new THREE.Group();


        group.userData.type =
            "workstation";


        group.add(

            this.createDesk(),

            this.createComputer()
        );


        const chair =
            this.createChair();


        chair.position.z =
            1;


        chair.rotation.y =
            Math.PI;


        group.add(
            chair
        );


        return group;
    }


    /* ======================================================
       PLANT
       ====================================================== */

    createPlant() {


        const group =
            new THREE.Group();


        group.userData.type =
            "plant";


        const pot =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.35,
                    0.28,
                    0.55,
                    12
                ),

                this.material(
                    0x966748
                )
            );


        pot.position.y =
            0.28;


        pot.castShadow =
            true;


        group.add(
            pot
        );


        for (
            let i = 0;
            i < 5;
            i++
        ) {


            const leaf =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.3,
                        12,
                        12
                    ),

                    this.material(
                        CONFIG.colors.plant
                    )
                );


            leaf.scale.set(
                0.7,
                1.25,
                0.6
            );


            leaf.position.set(

                Math.cos(
                    i *
                    1.25
                ) *
                0.24,

                0.95 +
                Math.random() *
                0.4,

                Math.sin(
                    i *
                    1.25
                ) *
                0.24
            );


            leaf.castShadow =
                true;


            group.add(
                leaf
            );
        }


        return group;
    }


    /* ======================================================
       SOFA
       ====================================================== */

    createSofa() {


        const group =
            new THREE.Group();


        group.userData.type =
            "sofa";


        group.add(

            this.box(
                2.5,
                0.45,
                0.9,
                CONFIG.colors.sofa,
                0,
                0.5,
                0
            ),

            this.box(
                2.5,
                1,
                0.3,
                CONFIG.colors.sofa,
                0,
                1.05,
                0.35
            ),

            this.box(
                0.25,
                0.75,
                1,
                0x465569,
                -1.18,
                0.6,
                0
            ),

            this.box(
                0.25,
                0.75,
                1,
                0x465569,
                1.18,
                0.6,
                0
            )
        );


        return group;
    }


    /* ======================================================
       COFFEE
       ====================================================== */

    createCoffeeMachine() {


        const group =
            new THREE.Group();


        group.userData.type =
            "coffee";


        group.add(

            this.box(
                1.1,
                1,
                0.8,
                0x555f6b,
                0,
                0.5,
                0
            ),

            this.box(
                0.7,
                0.75,
                0.55,
                0x404c5c,
                0,
                1.37,
                0
            ),

            this.box(
                0.35,
                0.17,
                0.03,
                0x5ad9ff,
                0,
                1.55,
                0.29
            )
        );


        return group;
    }


    /* ======================================================
       SERVER
       ====================================================== */

    createServer() {


        const group =
            new THREE.Group();


        group.userData.type =
            "server";


        group.add(

            this.box(
                1,
                2.3,
                0.9,
                CONFIG.colors.server,
                0,
                1.15,
                0
            )
        );


        for (
            let i = 0;
            i < 7;
            i++
        ) {


            group.add(

                this.box(
                    0.82,
                    0.18,
                    0.04,
                    0x3a4657,
                    0,
                    0.38 +
                    i *
                    0.27,
                    0.47
                ),

                this.box(
                    0.055,
                    0.055,
                    0.02,
                    i %
                        2 ===
                        0
                        ? 0x4cf28b
                        : 0x48a8ff,
                    0.3,
                    0.38 +
                    i *
                    0.27,
                    0.5
                )
            );
        }


        return group;
    }


    /* ======================================================
       MEETING TABLE
       ====================================================== */

    createMeetingTable() {


        const group =
            new THREE.Group();


        group.add(

            this.box(
                4.2,
                0.15,
                2.1,
                0x79583f,
                0,
                1,
                0
            ),

            this.box(
                0.25,
                1,
                0.25,
                0x4c3b30,
                -1.5,
                0.5,
                -0.6
            ),

            this.box(
                0.25,
                1,
                0.25,
                0x4c3b30,
                1.5,
                0.5,
                0.6
            )
        );


        return group;
    }


    /* ======================================================
       DECORATION
       ====================================================== */

    createDecoration() {


        const group =
            new THREE.Group();


        group.userData.type =
            "decoration";


        const base =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.38,
                    0.45,
                    0.12,
                    20
                ),

                this.material(
                    0xd9b35f
                )
            );


        base.position.y =
            0.06;


        const trophy =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.3,
                    16,
                    16
                ),

                this.material(
                    0xffce61,
                    {
                        metalness:
                            0.5
                    }
                )
            );


        trophy.scale.y =
            1.3;


        trophy.position.y =
            0.55;


        group.add(
            base,
            trophy
        );


        return group;
    }


    /* ======================================================
       BUILD FACTORY
       ====================================================== */

    createBuildObject(
        type
    ) {


        switch (
        type
        ) {


            case "desk":

                return this.createDesk();


            case "computer":

                return this.createComputer();


            case "chair":

                return this.createChair();


            case "workstation":

                return this.createWorkstation();


            case "plant":

                return this.createPlant();


            case "sofa":

                return this.createSofa();


            case "coffee":

                return this.createCoffeeMachine();


            case "server":

                return this.createServer();


            case "decoration":

                return this.createDecoration();


            default:

                return this.createDesk();
        }
    }


    /* ======================================================
       OBSTACLES
       ====================================================== */

    registerPersistentStaticObstacle(
        x,
        z,
        halfWidth,
        halfDepth
    ) {


        this.staticObstacleDefinitions.push({

            x,

            z,

            halfWidth,

            halfDepth
        });


        this.registerObstacle(
            x,
            z,
            halfWidth,
            halfDepth,
            false
        );
    }


    registerObstacle(
        worldX,
        worldZ,
        halfWidth = 0,
        halfDepth = 0,
        playerObject = false
    ) {


        const center =
            this.worldToCell({

                x:
                    worldX,

                z:
                    worldZ
            });


        const destination =

            playerObject

                ? this.playerBlockedCells

                : this.staticBlockedCells;


        for (
            let x =
                center.x -
                halfWidth;
            x <=
            center.x +
            halfWidth;
            x++
        ) {


            for (
                let z =
                    center.z -
                    halfDepth;
                z <=
                center.z +
                halfDepth;
                z++
            ) {


                destination.add(
                    cellKey(
                        x,
                        z
                    )
                );
            }
        }
    }


    /* ======================================================
       GRID / PATHFINDING
       ====================================================== */

    worldToCell(
        position
    ) {


        return {

            x:
                Math.round(
                    position.x /
                    CONFIG.gridSize
                ),

            z:
                Math.round(
                    position.z /
                    CONFIG.gridSize
                )
        };
    }


    cellToWorld(
        cell
    ) {


        return new THREE.Vector3(

            cell.x *
            CONFIG.gridSize,

            0,

            cell.z *
            CONFIG.gridSize
        );
    }


    getNavigationBounds() {


        return {

            minX:
                -Math.floor(
                    this.officeWidth /
                    2
                ) +
                1,

            maxX:
                Math.floor(
                    this.officeWidth /
                    2
                ) -
                1,

            minZ:
                -Math.floor(
                    this.officeDepth /
                    2
                ) +
                1,

            maxZ:
                Math.floor(
                    this.officeDepth /
                    2
                ) -
                1
        };
    }


    isCellInside(
        x,
        z
    ) {


        const bounds =
            this.getNavigationBounds();


        return (

            x >=
            bounds.minX

            &&

            x <=
            bounds.maxX

            &&

            z >=
            bounds.minZ

            &&

            z <=
            bounds.maxZ
        );
    }


    isBlocked(
        x,
        z
    ) {


        const key =
            cellKey(
                x,
                z
            );


        return (

            this.staticBlockedCells.has(
                key
            )

            ||

            this.playerBlockedCells.has(
                key
            )
        );
    }


    /* ======================================================
       A* PATHFINDING
       ====================================================== */

    findPath(
        startWorld,
        endWorld
    ) {


        const start =
            this.worldToCell(
                startWorld
            );


        const end =
            this.worldToCell(
                endWorld
            );


        if (
            !this.isCellInside(
                start.x,
                start.z
            )
        ) {


            const safeStart =
                this.findClosestFreeCell(
                    start.x,
                    start.z
                );


            if (
                !safeStart
            ) {


                return [];
            }


            start.x =
                safeStart.x;


            start.z =
                safeStart.z;
        }


        if (

            !this.isCellInside(
                end.x,
                end.z
            )

            ||

            this.isBlocked(
                end.x,
                end.z
            )
        ) {


            const safeEnd =
                this.findClosestFreeCell(
                    end.x,
                    end.z
                );


            if (
                !safeEnd
            ) {


                return [];
            }


            end.x =
                safeEnd.x;


            end.z =
                safeEnd.z;
        }


        const open =
            new Map();


        const closed =
            new Set();


        open.set(

            cellKey(
                start.x,
                start.z
            ),

            {

                x:
                    start.x,

                z:
                    start.z,

                g:
                    0,

                h:
                    this.pathHeuristic(
                        start,
                        end
                    ),

                parent:
                    null
            }
        );


        const directions = [

            [
                1,
                0
            ],

            [
                -1,
                0
            ],

            [
                0,
                1
            ],

            [
                0,
                -1
            ],

            [
                1,
                1
            ],

            [
                1,
                -1
            ],

            [
                -1,
                1
            ],

            [
                -1,
                -1
            ]
        ];


        let iterations =
            0;


        while (

            open.size >
            0

            &&

            iterations <
            3500

        ) {


            iterations++;


            let currentKey =
                null;


            let current =
                null;


            let bestScore =
                Infinity;


            for (
                const [
                    key,
                    node
                ]
                of open
            ) {


                const score =
                    node.g +
                    node.h;


                if (
                    score <
                    bestScore
                ) {


                    bestScore =
                        score;


                    current =
                        node;


                    currentKey =
                        key;
                }
            }


            if (
                !current
            ) {


                break;
            }


            if (

                current.x ===
                end.x

                &&

                current.z ===
                end.z
            ) {


                return this.reconstructPath(
                    current
                );
            }


            open.delete(
                currentKey
            );


            closed.add(
                currentKey
            );


            for (
                const [
                    dx,
                    dz
                ]
                of directions
            ) {


                const nx =
                    current.x +
                    dx;


                const nz =
                    current.z +
                    dz;


                const key =
                    cellKey(
                        nx,
                        nz
                    );


                if (
                    !this.isCellInside(
                        nx,
                        nz
                    )
                ) {


                    continue;
                }


                if (
                    this.isBlocked(
                        nx,
                        nz
                    )
                ) {


                    continue;
                }


                if (
                    closed.has(
                        key
                    )
                ) {


                    continue;
                }


                if (
                    dx !==
                    0

                    &&

                    dz !==
                    0
                ) {


                    if (

                        this.isBlocked(
                            current.x +
                            dx,
                            current.z
                        )

                        ||

                        this.isBlocked(
                            current.x,
                            current.z +
                            dz
                        )
                    ) {


                        continue;
                    }
                }


                const moveCost =

                    dx !==
                        0

                        &&

                        dz !==
                        0

                        ? 1.414

                        : 1;


                const newG =
                    current.g +
                    moveCost;


                const existing =
                    open.get(
                        key
                    );


                if (

                    !existing

                    ||

                    newG <
                    existing.g
                ) {


                    open.set(

                        key,

                        {

                            x:
                                nx,

                            z:
                                nz,

                            g:
                                newG,

                            h:
                                this.pathHeuristic(

                                    {
                                        x:
                                            nx,
                                        z:
                                            nz
                                    },

                                    end
                                ),

                            parent:
                                current
                        }
                    );
                }
            }
        }


        return [];
    }


    pathHeuristic(
        a,
        b
    ) {


        return (

            Math.abs(
                a.x -
                b.x
            )

            +

            Math.abs(
                a.z -
                b.z
            )
        );
    }


    reconstructPath(
        node
    ) {


        const path =
            [];


        let current =
            node;


        while (
            current
        ) {


            path.push({

                x:
                    current.x,

                z:
                    current.z
            });


            current =
                current.parent;
        }


        path.reverse();


        return path
            .slice(
                1
            )
            .map(
                cell =>
                    this.cellToWorld(
                        cell
                    )
            );
    }


    findClosestFreeCell(
        x,
        z
    ) {


        for (
            let radius = 0;
            radius <= 8;
            radius++
        ) {


            for (
                let dx =
                    -radius;
                dx <=
                radius;
                dx++
            ) {


                for (
                    let dz =
                        -radius;
                    dz <=
                    radius;
                    dz++
                ) {


                    const nx =
                        x +
                        dx;


                    const nz =
                        z +
                        dz;


                    if (

                        this.isCellInside(
                            nx,
                            nz
                        )

                        &&

                        !this.isBlocked(
                            nx,
                            nz
                        )
                    ) {


                        return {

                            x:
                                nx,

                            z:
                                nz
                        };
                    }
                }
            }
        }


        return null;
    }


    /* ======================================================
       EMPLOYEE MODEL
       ====================================================== */

    createEmployeeModel(
        employee
    ) {


        const group =
            new THREE.Group();


        group.name =
            `Employee_${employee.id}`;


        group.userData = {

            type:
                "employee",

            employeeId:
                employee.id
        };


        const shirtColor =
            choose([

                0x5479d8,

                0x8d68c9,

                0x43a688,

                0xd47b59,

                0xc35e79,

                0x49a6c9
            ]);


        const body =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.32,
                    0.38,
                    0.9,
                    10
                ),

                this.material(
                    shirtColor
                )
            );


        body.position.y =
            1.15;


        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.3,
                    16,
                    16
                ),

                this.material(
                    CONFIG.colors.skin
                )
            );


        head.position.y =
            1.85;


        const hair =
            new THREE.Mesh(

                new THREE.SphereGeometry(

                    0.305,

                    16,

                    10,

                    0,

                    Math.PI *
                    2,

                    0,

                    Math.PI /
                    2
                ),

                this.material(
                    choose([
                        0x221914,
                        0x38251d,
                        0x151515,
                        0x704225,
                        0xaa8055
                    ])
                )
            );


        hair.position.y =
            1.94;


        const legGeometry =
            new THREE.CylinderGeometry(
                0.11,
                0.12,
                0.72,
                8
            );


        const pants =
            this.material(
                0x293445
            );


        const leftLeg =
            new THREE.Mesh(
                legGeometry,
                pants
            );


        leftLeg.position.set(
            -0.16,
            0.43,
            0
        );


        const rightLeg =
            new THREE.Mesh(
                legGeometry,
                pants
            );


        rightLeg.position.set(
            0.16,
            0.43,
            0
        );


        const armGeometry =
            new THREE.CylinderGeometry(
                0.09,
                0.1,
                0.7,
                8
            );


        const skin =
            this.material(
                CONFIG.colors.skin
            );


        const leftArm =
            new THREE.Mesh(
                armGeometry,
                skin
            );


        leftArm.position.set(
            -0.42,
            1.18,
            0
        );


        leftArm.rotation.z =
            -0.12;


        const rightArm =
            new THREE.Mesh(
                armGeometry,
                skin
            );


        rightArm.position.set(
            0.42,
            1.18,
            0
        );


        rightArm.rotation.z =
            0.12;


        group.add(

            body,

            head,

            hair,

            leftLeg,

            rightLeg,

            leftArm,

            rightArm
        );


        group.traverse(
            child => {


                if (
                    child.isMesh
                ) {


                    child.castShadow =
                        true;
                }
            }
        );


        group.userData.parts = {

            body,

            head,

            leftLeg,

            rightLeg,

            leftArm,

            rightArm
        };


        return group;
    }


    /* ======================================================
       ADD EMPLOYEE
       ====================================================== */

    addEmployee3D(
        employee
    ) {


        if (
            this.employees3D.has(
                employee.id
            )
        ) {


            return;
        }


        const model =
            this.createEmployeeModel(
                employee
            );


        model.position.copy(
            this.getRandomWalkTarget()
        );


        this.employeeGroup.add(
            model
        );


        this.employees3D.set(
            employee.id,
            model
        );


        this.employeeBrains.set(

            employee.id,

            {

                state:
                    "idle",

                activity:
                    null,

                path:
                    [],

                pathIndex:
                    0,

                timer:
                    randomBetween(
                        0.5,
                        2
                    ),

                workstation:
                    null,

                finalTarget:
                    null,

                walkPhase:
                    Math.random() *
                    Math.PI *
                    2
            }
        );


        setTimeout(
            () => {


                this.assignEmployeeTask(
                    employee.id
                );


            },
            randomBetween(
                150,
                900
            )
        );
    }


    /* ======================================================
       REMOVE EMPLOYEE
       ====================================================== */

    removeEmployee3D(
        employeeId
    ) {


        const model =
            this.employees3D.get(
                employeeId
            );


        const brain =
            this.employeeBrains.get(
                employeeId
            );


        if (
            brain?.workstation
        ) {


            brain.workstation.occupiedBy =
                null;
        }


        if (
            model
        ) {


            this.employeeGroup.remove(
                model
            );


            this.disposeObject(
                model
            );
        }


        this.employees3D.delete(
            employeeId
        );


        this.employeeBrains.delete(
            employeeId
        );
    }


    /* ======================================================
       ASSIGN TASK
       ====================================================== */

    assignEmployeeTask(
        employeeId
    ) {


        const model =
            this.employees3D.get(
                employeeId
            );


        const brain =
            this.employeeBrains.get(
                employeeId
            );


        if (
            !model ||
            !brain
        ) {


            return;
        }


        if (
            brain.workstation
        ) {


            brain.workstation.occupiedBy =
                null;


            brain.workstation =
                null;
        }


        let target =
            null;


        let activity =
            "wander";


        const roll =
            Math.random();


        if (
            roll <
            0.62
        ) {


            const station =
                this.workstations.find(
                    item =>
                        !item.occupiedBy
                );


            if (
                station
            ) {


                station.occupiedBy =
                    employeeId;


                brain.workstation =
                    station;


                target =
                    station.workPosition
                        .clone();


                activity =
                    "work";
            }
        }


        if (

            !target

            &&

            roll <
            0.76

            &&

            this.coffeeSpots.length
        ) {


            target =
                choose(
                    this.coffeeSpots
                )
                    .position
                    .clone();


            activity =
                "coffee";
        }


        if (

            !target

            &&

            roll <
            0.88

            &&

            this.restSpots.length
        ) {


            target =
                choose(
                    this.restSpots
                )
                    .position
                    .clone();


            activity =
                "rest";
        }


        if (

            !target

            &&

            roll <
            0.96

            &&

            this.meetingSpots.length
        ) {


            target =
                choose(
                    this.meetingSpots
                )
                    .position
                    .clone();


            activity =
                "meeting";
        }


        if (
            !target
        ) {


            target =
                this.getRandomWalkTarget();


            activity =
                "wander";
        }


        const path =
            this.findPath(
                model.position,
                target
            );


        if (
            path.length ===
            0
        ) {


            brain.state =
                "idle";


            brain.timer =
                randomBetween(
                    0.7,
                    2
                );


            return;
        }


        brain.state =
            "walking";


        brain.activity =
            activity;


        brain.path =
            path;


        brain.pathIndex =
            0;


        brain.finalTarget =
            target;


        brain.timer =
            0;


        this.resetEmployeePose(
            model
        );
    }


    /* ======================================================
       RANDOM WALK
       ====================================================== */

    getRandomWalkTarget() {


        const bounds =
            this.getNavigationBounds();


        for (
            let attempt = 0;
            attempt < 50;
            attempt++
        ) {


            const x =
                Math.round(
                    randomBetween(
                        bounds.minX,
                        bounds.maxX
                    )
                );


            const z =
                Math.round(
                    randomBetween(
                        bounds.minZ,
                        bounds.maxZ
                    )
                );


            if (
                !this.isBlocked(
                    x,
                    z
                )
            ) {


                return new THREE.Vector3(
                    x,
                    0,
                    z
                );
            }
        }


        return new THREE.Vector3(
            0,
            0,
            0
        );
    }


    /* ======================================================
       EMPLOYEE UPDATE
       ====================================================== */

    updateEmployees(
        delta
    ) {


        for (
            const [
                employeeId,
                model
            ]
            of this.employees3D
        ) {


            const brain =
                this.employeeBrains.get(
                    employeeId
                );


            if (
                !brain
            ) {


                continue;
            }


            if (
                brain.state ===
                "walking"
            ) {


                this.updateEmployeeWalking(
                    employeeId,
                    model,
                    brain,
                    delta
                );


                continue;
            }


            brain.timer -=
                delta *
                this.gameSpeed;


            switch (
            brain.state
            ) {


                case "working":

                    this.animateWorking(
                        model
                    );

                    break;


                case "coffee":

                    this.animateCoffee(
                        model
                    );

                    break;


                case "resting":

                    this.animateResting(
                        model
                    );

                    break;


                case "meeting":

                    this.animateMeeting(
                        model
                    );

                    break;


                default:

                    this.animateIdle(
                        model
                    );

                    break;
            }


            if (
                brain.timer <=
                0
            ) {


                this.assignEmployeeTask(
                    employeeId
                );
            }
        }


        this.applyEmployeeSeparation();
    }


    /* ======================================================
       WALKING
       ====================================================== */

    updateEmployeeWalking(
        employeeId,
        model,
        brain,
        delta
    ) {


        if (
            brain.pathIndex >=
            brain.path.length
        ) {


            this.employeeArrived(
                employeeId,
                model,
                brain
            );


            return;
        }


        const waypoint =
            brain.path[
            brain.pathIndex
            ];


        const cell =
            this.worldToCell(
                waypoint
            );


        if (
            this.isBlocked(
                cell.x,
                cell.z
            )
        ) {


            const newPath =
                this.findPath(
                    model.position,
                    brain.finalTarget
                );


            if (
                newPath.length
            ) {


                brain.path =
                    newPath;


                brain.pathIndex =
                    0;
            }
            else {


                brain.state =
                    "idle";


                brain.timer =
                    1;
            }


            return;
        }


        const direction =
            waypoint
                .clone()
                .sub(
                    model.position
                );


        direction.y =
            0;


        const distance =
            direction.length();


        if (
            distance <
            0.1
        ) {


            brain.pathIndex++;

            return;
        }


        direction.normalize();


        model.position.addScaledVector(

            direction,

            CONFIG.employeeSpeed *
            delta *
            this.gameSpeed
        );


        model.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );


        brain.walkPhase +=
            delta *
            8 *
            this.gameSpeed;


        this.animateWalking(
            model,
            brain.walkPhase
        );
    }


    /* ======================================================
       ARRIVED
       ====================================================== */

    employeeArrived(
        employeeId,
        model,
        brain
    ) {


        this.resetEmployeePose(
            model
        );


        switch (
        brain.activity
        ) {


            case "work":


                brain.state =
                    "working";


                brain.timer =
                    randomBetween(
                        8,
                        18
                    );


                if (
                    brain.workstation
                ) {


                    model.lookAt(
                        brain.workstation
                            .lookPosition
                    );
                }


                break;


            case "coffee":


                brain.state =
                    "coffee";


                brain.timer =
                    randomBetween(
                        3,
                        6
                    );


                break;


            case "rest":


                brain.state =
                    "resting";


                brain.timer =
                    randomBetween(
                        4,
                        9
                    );


                break;


            case "meeting":


                brain.state =
                    "meeting";


                brain.timer =
                    randomBetween(
                        5,
                        10
                    );


                break;


            default:


                brain.state =
                    "idle";


                brain.timer =
                    randomBetween(
                        1,
                        4
                    );
        }


        brain.path =
            [];


        brain.pathIndex =
            0;
    }


    /* ======================================================
       WALK ANIMATION
       ====================================================== */

    animateWalking(
        model,
        phase
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        const swing =
            Math.sin(
                phase
            ) *
            0.4;


        parts.leftLeg.rotation.x =
            swing;


        parts.rightLeg.rotation.x =
            -swing;


        parts.leftArm.rotation.x =
            -swing *
            0.75;


        parts.rightArm.rotation.x =
            swing *
            0.75;


        model.position.y =
            Math.abs(
                Math.sin(
                    phase *
                    2
                )
            ) *
            0.025;
    }


    /* ======================================================
       WORKING ANIMATION
       ====================================================== */

    animateWorking(
        model
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        const time =
            performance.now() *
            0.008;


        parts.leftArm.rotation.x =
            -1.05 +
            Math.sin(
                time
            ) *
            0.12;


        parts.rightArm.rotation.x =
            -1.05 +
            Math.sin(
                time +
                1.5
            ) *
            0.12;


        parts.leftLeg.rotation.x =
            -0.2;


        parts.rightLeg.rotation.x =
            -0.2;


        model.position.y =
            -0.08;
    }


    /* ======================================================
       COFFEE
       ====================================================== */

    animateCoffee(
        model
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        const time =
            performance.now() *
            0.004;


        parts.rightArm.rotation.x =
            -0.7 +
            Math.sin(
                time
            ) *
            0.3;


        parts.head.rotation.x =
            Math.sin(
                time
            ) *
            0.06;
    }


    /* ======================================================
       REST
       ====================================================== */

    animateResting(
        model
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        parts.leftLeg.rotation.x =
            -0.55;


        parts.rightLeg.rotation.x =
            -0.55;


        parts.leftArm.rotation.x =
            -0.15;


        parts.rightArm.rotation.x =
            -0.15;


        model.position.y =
            -0.1;
    }


    /* ======================================================
       MEETING
       ====================================================== */

    animateMeeting(
        model
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        const time =
            performance.now() *
            0.005;


        parts.leftArm.rotation.z =
            -0.2 +
            Math.sin(
                time
            ) *
            0.2;


        parts.rightArm.rotation.z =
            0.2 -
            Math.sin(
                time
            ) *
            0.2;


        parts.head.rotation.y =
            Math.sin(
                time *
                0.6
            ) *
            0.2;
    }


    /* ======================================================
       IDLE
       ====================================================== */

    animateIdle(
        model
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        const time =
            performance.now() *
            0.002;


        parts.head.rotation.y =
            Math.sin(
                time
            ) *
            0.08;
    }


    /* ======================================================
       RESET POSE
       ====================================================== */

    resetEmployeePose(
        model
    ) {


        const parts =
            model.userData.parts;


        if (
            !parts
        ) {


            return;
        }


        parts.leftLeg.rotation.set(
            0,
            0,
            0
        );


        parts.rightLeg.rotation.set(
            0,
            0,
            0
        );


        parts.leftArm.rotation.set(
            0,
            0,
            -0.12
        );


        parts.rightArm.rotation.set(
            0,
            0,
            0.12
        );


        parts.head.rotation.set(
            0,
            0,
            0
        );


        model.position.y =
            0;
    }


    /* ======================================================
       EMPLOYEE SEPARATION
       ====================================================== */

    applyEmployeeSeparation() {


        const employees =
            [
                ...this.employees3D
                    .values()
            ];


        for (
            let i = 0;
            i < employees.length;
            i++
        ) {


            for (
                let j =
                    i +
                    1;
                j < employees.length;
                j++
            ) {


                const a =
                    employees[
                    i
                    ];


                const b =
                    employees[
                    j
                    ];


                const delta =
                    new THREE.Vector3()
                        .subVectors(
                            a.position,
                            b.position
                        );


                delta.y =
                    0;


                const distance =
                    delta.length();


                if (
                    distance >
                    0

                    &&

                    distance <
                    0.55
                ) {


                    delta.normalize();


                    const force =
                        (
                            0.55 -
                            distance
                        ) *
                        0.03;


                    a.position.addScaledVector(
                        delta,
                        force
                    );


                    b.position.addScaledVector(
                        delta,
                        -force
                    );
                }
            }
        }
    }


    /* ======================================================
       BUILD FOOTPRINT
       ====================================================== */

    getBuildFootprint(
        type
    ) {


        switch (
        type
        ) {


            case "workstation":

                return {
                    x:
                        1,
                    z:
                        1
                };


            case "sofa":

                return {
                    x:
                        1,
                    z:
                        1
                };


            case "desk":

                return {
                    x:
                        1,
                    z:
                        0
                };


            case "server":

                return {
                    x:
                        0,
                    z:
                        0
                };


            default:

                return {
                    x:
                        0,
                    z:
                        0
                };
        }
    }


    /* ======================================================
       START BUILD MODE
       ====================================================== */

    startBuildMode(
        type
    ) {


        if (
            this.viewMode !==
            "interior"
        ) {


            this.enterOffice();
        }


        this.cancelBuildMode();


        this.buildMode =
            true;


        this.selectedBuildType =
            type;


        this.buildRotation =
            0;


        this.buildPreview =
            this.createBuildObject(
                type
            );


        this.buildPreview.traverse(
            child => {


                if (
                    child.isMesh &&
                    child.material
                ) {


                    child.material =
                        child.material.clone();


                    child.material.transparent =
                        true;


                    child.material.opacity =
                        0.5;
                }
            }
        );


        this.scene.add(
            this.buildPreview
        );


        document
            .getElementById(
                "build-mode-indicator"
            )
            ?.classList
            .remove(
                "hidden"
            );
    }


    /* ======================================================
       CANCEL BUILD MODE
       ====================================================== */

    cancelBuildMode() {


        if (
            this.buildPreview
        ) {


            this.scene.remove(
                this.buildPreview
            );


            this.disposeObject(
                this.buildPreview
            );
        }


        this.buildPreview =
            null;


        this.buildMode =
            false;


        this.selectedBuildType =
            null;


        this.buildRotation =
            0;


        this.buildValid =
            false;


        document
            .getElementById(
                "build-mode-indicator"
            )
            ?.classList
            .add(
                "hidden"
            );
    }


    /* ======================================================
       ROTATE
       ====================================================== */

    rotateBuildPreview() {


        if (
            !this.buildPreview
        ) {


            return;
        }


        this.buildRotation +=
            Math.PI /
            2;


        this.buildPreview.rotation.y =
            this.buildRotation;
    }


    /* ======================================================
       BUILD PREVIEW
       ====================================================== */

    updateBuildPreview(
        event
    ) {


        if (
            !this.buildMode ||
            !this.buildPreview ||
            !this.floorMesh
        ) {


            return;
        }


        const rect =
            this.canvas
                .getBoundingClientRect();


        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) *
            2 -
            1;


        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            2 +
            1;


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        const hit =
            this.raycaster
                .intersectObject(
                    this.floorMesh,
                    false
                )[
            0
            ];


        if (
            !hit
        ) {


            this.buildPreview.visible =
                false;


            return;
        }


        this.buildPreview.visible =
            true;


        const x =
            Math.round(
                hit.point.x
            );


        const z =
            Math.round(
                hit.point.z
            );


        this.buildPreview.position.set(
            x,
            0,
            z
        );


        this.buildValid =
            this.isBuildPositionValid(
                x,
                z,
                this.selectedBuildType
            );


        this.colorBuildPreview(
            this.buildValid
        );
    }


    /* ======================================================
       BUILD VALID
       ====================================================== */

    isBuildPositionValid(
        x,
        z,
        type
    ) {


        const footprint =
            this.getBuildFootprint(
                type
            );


        for (
            let dx =
                -footprint.x;
            dx <=
            footprint.x;
            dx++
        ) {


            for (
                let dz =
                    -footprint.z;
                dz <=
                footprint.z;
                dz++
            ) {


                const cellX =
                    x +
                    dx;


                const cellZ =
                    z +
                    dz;


                if (
                    !this.isCellInside(
                        cellX,
                        cellZ
                    )
                ) {


                    return false;
                }


                if (
                    this.isBlocked(
                        cellX,
                        cellZ
                    )
                ) {


                    return false;
                }
            }
        }


        return true;
    }


    /* ======================================================
       PREVIEW COLOR
       ====================================================== */

    colorBuildPreview(
        valid
    ) {


        const color =
            valid
                ? 0x42ec84
                : 0xff5164;


        this.buildPreview
            ?.traverse(
                child => {


                    if (
                        child.isMesh &&
                        child.material
                    ) {


                        child.material
                            .color
                            .set(
                                color
                            );


                        child.material.opacity =
                            0.48;
                    }
                }
            );
    }


    /* ======================================================
       PLACE BUILD
       ====================================================== */

    placeBuildObject() {


        if (
            !this.buildMode ||
            !this.buildPreview ||
            !this.buildValid
        ) {


            return;
        }


        const type =
            this.selectedBuildType;


        if (
            !this.systems
                ?.canPurchaseBuildItem?.(
                    type
                )
        ) {


            this.ui
                ?.notify?.(

                    "Dinheiro insuficiente",

                    "Você não possui dinheiro suficiente.",

                    "error"
                );


            return;
        }


        const purchase =
            this.systems
                ?.purchaseBuildItem?.(
                    type,
                    {
                        x:
                            this.buildPreview
                                .position
                                .x,

                        z:
                            this.buildPreview
                                .position
                                .z,

                        rotation:
                            this.buildRotation
                    }
                );


        if (
            purchase ===
            false

            ||

            purchase
                ?.success ===
            false
        ) {


            this.ui
                ?.notify?.(

                    "Não foi possível construir",

                    purchase?.message ||
                    "A compra não pôde ser concluída.",

                    "error"
                );


            return;
        }


        const object =
            this.createBuildObject(
                type
            );


        object.position.copy(
            this.buildPreview.position
        );


        object.rotation.y =
            this.buildRotation;


        this.playerFurnitureGroup.add(
            object
        );


        this.playerBuildObjects.push(
            object
        );


        const footprint =
            this.getBuildFootprint(
                type
            );


        this.registerObstacle(
            object.position.x,
            object.position.z,
            footprint.x,
            footprint.z,
            true
        );


        this.registerPlayerInteraction(
            type,
            object,
            this.buildRotation
        );


        this.ui
            ?.notify?.(

                "Construção concluída",

                "O objeto foi adicionado ao escritório.",

                "success"
            );
    }


    /* ======================================================
       PLAYER INTERACTION
       ====================================================== */

    registerPlayerInteraction(
        type,
        object,
        rotation = 0
    ) {


        if (
            type ===
            "workstation"
        ) {


            const offset =
                new THREE.Vector3(
                    0,
                    0,
                    1
                );


            offset.applyAxisAngle(
                new THREE.Vector3(
                    0,
                    1,
                    0
                ),
                rotation
            );


            this.workstations.push({

                object,

                workPosition:
                    object.position
                        .clone()
                        .add(
                            offset
                        ),

                lookPosition:
                    object.position
                        .clone(),

                occupiedBy:
                    null,

                playerBuilt:
                    true
            });
        }


        if (
            type ===
            "coffee"
        ) {


            const offset =
                new THREE.Vector3(
                    -1,
                    0,
                    0
                );


            offset.applyAxisAngle(
                new THREE.Vector3(
                    0,
                    1,
                    0
                ),
                rotation
            );


            this.coffeeSpots.push({

                position:
                    object.position
                        .clone()
                        .add(
                            offset
                        ),

                playerBuilt:
                    true
            });
        }


        if (
            type ===
            "sofa"
        ) {


            const offset =
                new THREE.Vector3(
                    0,
                    0,
                    -1
                );


            offset.applyAxisAngle(
                new THREE.Vector3(
                    0,
                    1,
                    0
                ),
                rotation
            );


            this.restSpots.push({

                position:
                    object.position
                        .clone()
                        .add(
                            offset
                        ),

                playerBuilt:
                    true
            });
        }
    }


    /* ======================================================
       RESTORE BUILD OBJECT
       ====================================================== */

    restoreBuiltObject(
        data
    ) {


        if (
            !data?.type
        ) {


            return;
        }


        const object =
            this.createBuildObject(
                data.type
            );


        object.position.set(

            Number(
                data.x
            )
            ||
            0,

            0,

            Number(
                data.z
            )
            ||
            0
        );


        object.rotation.y =
            Number(
                data.rotation
            )
            ||
            0;


        this.playerFurnitureGroup.add(
            object
        );


        this.playerBuildObjects.push(
            object
        );


        const footprint =
            this.getBuildFootprint(
                data.type
            );


        this.registerObstacle(
            object.position.x,
            object.position.z,
            footprint.x,
            footprint.z,
            true
        );


        this.registerPlayerInteraction(
            data.type,
            object,
            object.rotation.y
        );
    }


    /* ======================================================
       CLEAR PLAYER WORLD
       ====================================================== */

    clearPlayerWorld() {


        [
            ...this.employees3D.keys()
        ].forEach(
            id => {


                this.removeEmployee3D(
                    id
                );
            }
        );


        this.playerBuildObjects
            .forEach(
                object => {


                    this.playerFurnitureGroup.remove(
                        object
                    );


                    this.disposeObject(
                        object
                    );
                }
            );


        this.playerBuildObjects =
            [];


        this.playerBlockedCells.clear();


        this.workstations =
            this.workstations.filter(
                item =>
                    !item.playerBuilt
            );


        this.coffeeSpots =
            this.coffeeSpots.filter(
                item =>
                    !item.playerBuilt
            );


        this.restSpots =
            this.restSpots.filter(
                item =>
                    !item.playerBuilt
            );


        this.meetingSpots =
            this.meetingSpots.filter(
                item =>
                    !item.playerBuilt
            );
    }


    /* ======================================================
       CONTROLS
       ====================================================== */

    createControls() {


        this.controls =
            new OrbitControls(
                this.camera,
                this.renderer.domElement
            );


        this.controls.enableDamping =
            true;


        this.controls.dampingFactor =
            0.08;


        this.controls.enablePan =
            true;


        this.controls.minDistance =
            8;


        this.controls.maxDistance =
            75;


        this.controls.minPolarAngle =
            Math.PI /
            6;


        this.controls.maxPolarAngle =
            Math.PI /
            2.15;


        this.controls.target.set(
            0,
            8,
            0
        );


        this.controls.mouseButtons = {

            LEFT:
                THREE.MOUSE.ROTATE,

            MIDDLE:
                THREE.MOUSE.DOLLY,

            RIGHT:
                THREE.MOUSE.PAN
        };
    }


    /* ======================================================
       CAMERA OFFICE
       ====================================================== */

    updateCameraForOffice() {


        if (
            !this.controls
        ) {


            return;
        }


        const size =
            Math.max(
                this.officeWidth,
                this.officeDepth
            );


        this.controls.maxDistance =
            Math.max(
                50,
                size *
                1.5
            );
    }


    /* ======================================================
       EVENTS
       ====================================================== */

    bindEvents() {


        window.addEventListener(
            "resize",
            this.handleResize
        );


        window.addEventListener(
            "keydown",
            this.handleKeyDown
        );


        window.addEventListener(
            "keyup",
            this.handleKeyUp
        );


        this.canvas.addEventListener(
            "pointermove",
            this.handlePointerMove
        );


        this.canvas.addEventListener(
            "pointerdown",
            this.handlePointerDown
        );


        this.canvas.addEventListener(
            "contextmenu",
            event =>
                event.preventDefault()
        );


        window.addEventListener(
            "blur",
            () => {


                this.keys =
                    {};
            }
        );


        window.addEventListener(
            "startup:office-expanded",
            event => {


                const office =
                    event.detail
                        ?.office;


                if (
                    !office
                ) {


                    return;
                }


                this.applyOfficeState(
                    office
                );


                this.ui
                    ?.notify?.(

                        "🏢 Escritório expandido!",

                        `${office.name} foi construído. Capacidade: ${office.employeeCapacity} funcionários.`,

                        "success",

                        7000
                    );


                if (
                    this.viewMode ===
                    "interior"
                ) {


                    this.focusInterior();
                }
            }
        );


        window.addEventListener(
            "startup:new-game",
            event => {


                if (
                    event.detail
                        ?.office
                ) {


                    this.applyOfficeState(
                        event.detail.office
                    );
                }


                this.setViewModeImmediate(
                    "exterior",
                    true
                );


                this.updateHQName();
            }
        );


        window.addEventListener(
            "startup:game-loaded",
            () => {


                this.updateHQName();
            }
        );


        window.addEventListener(
            "startup:state-changed",
            () => {


                this.updateHQName();
            }
        );
    }


    /* ======================================================
       RESIZE
       ====================================================== */

    handleResize() {


        if (
            !this.camera ||
            !this.renderer
        ) {


            return;
        }


        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;


        this.camera
            .updateProjectionMatrix();


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }


    /* ======================================================
       KEYDOWN
       ====================================================== */

    handleKeyDown(
        event
    ) {


        const tag =
            event.target
                ?.tagName
                ?.toLowerCase();


        if (
            [
                "input",
                "select",
                "textarea"
            ].includes(
                tag
            )
        ) {


            return;
        }


        const key =
            event.key
                .toLowerCase();


        this.keys[
            key
        ] =
            true;


        if (
            key ===
            "r"

            &&

            this.buildMode
        ) {


            this.rotateBuildPreview();
        }


        if (
            key ===
            "escape"
        ) {


            if (
                this.buildMode
            ) {


                this.cancelBuildMode();


                this.ui
                    ?.exitBuildModeUI?.();
            }
            else {


                this.ui
                    ?.togglePauseMenu?.();
            }
        }


        if (
            key ===
            "e"
        ) {


            if (
                this.transitioning
            ) {


                return;
            }


            if (
                this.viewMode ===
                "exterior"
            ) {


                this.enterOffice();
            }
            else {


                this.switchToExteriorView();
            }
        }


        if (
            key ===
            " "
        ) {


            event.preventDefault();


            this.setPaused(
                !this.gamePaused
            );
        }
    }


    /* ======================================================
       KEYUP
       ====================================================== */

    handleKeyUp(
        event
    ) {


        this.keys[
            event.key
                .toLowerCase()
        ] =
            false;
    }


    /* ======================================================
       POINTER MOVE
       ====================================================== */

    handlePointerMove(
        event
    ) {


        if (
            this.buildMode
        ) {


            this.updateBuildPreview(
                event
            );
        }
    }


    /* ======================================================
       POINTER DOWN
       ====================================================== */

    handlePointerDown(
        event
    ) {


        if (
            event.button !==
            0
        ) {


            return;
        }


        if (
            this.transitioning
        ) {


            return;
        }


        if (
            this.buildMode
        ) {


            this.updateBuildPreview(
                event
            );


            this.placeBuildObject();


            return;
        }


        if (
            this.viewMode ===
            "exterior"
        ) {


            this.detectExteriorInteraction(
                event
            );


            return;
        }


        if (
            this.detectInteriorInteraction(
                event
            )
        ) {


            return;
        }


        this.detectEmployeeClick(
            event
        );
    }


    /* ======================================================
       EXTERIOR CLICK
       ====================================================== */

    detectExteriorInteraction(
        event
    ) {


        const rect =
            this.canvas
                .getBoundingClientRect();


        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) *
            2 -
            1;


        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            2 +
            1;


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        const hit =
            this.raycaster
                .intersectObjects(
                    this.exteriorInteractionMeshes,
                    false
                )[
            0
            ];


        if (
            !hit
        ) {


            return;
        }


        if (
            hit.object
                ?.userData
                ?.action ===
            "enter-office"
        ) {


            this.enterOffice();
        }
    }


    /* ======================================================
       EMPLOYEE CLICK
       ====================================================== */

    detectEmployeeClick(
        event
    ) {


        const rect =
            this.canvas
                .getBoundingClientRect();


        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) *
            2 -
            1;


        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            2 +
            1;


        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        const meshes =
            [];


        this.employees3D.forEach(
            employee => {


                employee.traverse(
                    child => {


                        if (
                            child.isMesh
                        ) {


                            meshes.push(
                                child
                            );
                        }
                    }
                );
            }
        );


        const hit =
            this.raycaster
                .intersectObjects(
                    meshes,
                    false
                )[
            0
            ];


        if (
            !hit
        ) {


            return;
        }


        let object =
            hit.object;


        while (
            object.parent &&
            !object.userData
                ?.employeeId
        ) {


            object =
                object.parent;
        }


        const employeeId =
            object.userData
                ?.employeeId;


        if (
            !employeeId
        ) {


            return;
        }


        const employee =
            this.systems
                ?.getEmployeeById?.(
                    employeeId
                );


        if (
            employee
        ) {


            this.ui
                ?.showEmployeeDetails?.(
                    employee
                );
        }
    }


    /* ======================================================
       CAMERA MOVEMENT
       ====================================================== */

    updateCamera(
        delta
    ) {


        if (
            this.gamePaused
        ) {


            return;
        }


        if (
            !this.controls ||
            !this.controls.enabled
        ) {


            return;
        }


        let forward =
            0;


        let right =
            0;


        if (
            this.keys[
            "w"
            ]

            ||

            this.keys[
            "arrowup"
            ]
        ) {


            forward +=
                1;
        }


        if (
            this.keys[
            "s"
            ]

            ||

            this.keys[
            "arrowdown"
            ]
        ) {


            forward -=
                1;
        }


        if (
            this.keys[
            "d"
            ]

            ||

            this.keys[
            "arrowright"
            ]
        ) {


            right +=
                1;
        }


        if (
            this.keys[
            "a"
            ]

            ||

            this.keys[
            "arrowleft"
            ]
        ) {


            right -=
                1;
        }


        if (
            forward ===
            0

            &&

            right ===
            0
        ) {


            return;
        }


        const direction =
            new THREE.Vector3();


        this.camera.getWorldDirection(
            direction
        );


        direction.y =
            0;


        direction.normalize();


        const rightVector =
            new THREE.Vector3()
                .crossVectors(
                    direction,
                    this.camera.up
                )
                .normalize();


        const movement =
            new THREE.Vector3();


        movement.addScaledVector(
            direction,
            forward
        );


        movement.addScaledVector(
            rightVector,
            right
        );


        movement.normalize();


        movement.multiplyScalar(
            CONFIG.cameraSpeed *
            delta
        );


        this.camera.position.add(
            movement
        );


        this.controls.target.add(
            movement
        );


        if (
            this.viewMode ===
            "exterior"
        ) {


            this.controls.target.x =
                clamp(
                    this.controls.target.x,
                    -45,
                    45
                );


            this.controls.target.z =
                clamp(
                    this.controls.target.z,
                    -45,
                    45
                );


            this.controls.target.y =
                clamp(
                    this.controls.target.y,
                    0,
                    18
                );
        }
        else {


            this.controls.target.x =
                clamp(
                    this.controls.target.x,
                    -this.officeWidth /
                    2,
                    this.officeWidth /
                    2
                );


            this.controls.target.z =
                clamp(
                    this.controls.target.z,
                    -this.officeDepth /
                    2,
                    this.officeDepth /
                    2
                );


            this.controls.target.y =
                clamp(
                    this.controls.target.y,
                    0,
                    8
                );
        }
    }


    /* ======================================================
       GAME SPEED
       ====================================================== */

    setGameSpeed(
        speed
    ) {


        this.gameSpeed =
            clamp(
                Number(
                    speed
                ),
                1,
                3
            );


        this.gamePaused =
            false;


        this.systems
            ?.setPaused?.(
                false
            );
    }


    /* ======================================================
       PAUSE
       ====================================================== */

    setPaused(
        value
    ) {


        this.gamePaused =
            Boolean(
                value
            );


        this.systems
            ?.setPaused?.(
                this.gamePaused
            );


        this.ui
            ?.updatePauseState?.(
                this.gamePaused
            );
    }


    /* ======================================================
       START GAME
       ====================================================== */

    startGame() {


        this.gameStarted =
            true;


        this.gamePaused =
            false;


        document
            .getElementById(
                "main-menu"
            )
            ?.classList
            .add(
                "hidden"
            );


        document
            .getElementById(
                "company-setup"
            )
            ?.classList
            .add(
                "hidden"
            );


        document
            .getElementById(
                "game"
            )
            ?.classList
            .remove(
                "hidden"
            );


        this.handleResize();


        this.setViewModeImmediate(
            "exterior",
            true
        );


        this.focusExterior();


        this.updateViewModeVisuals();


        this.updateHQName();
    }


    /* ======================================================
       GRAPHICS
       ====================================================== */

    setGraphicsQuality(
        quality
    ) {


        if (
            quality ===
            "low"
        ) {


            this.renderer.setPixelRatio(
                1
            );


            this.renderer.shadowMap.enabled =
                false;


            return;
        }


        if (
            quality ===
            "high"
        ) {


            this.renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    2
                )
            );


            this.renderer.shadowMap.enabled =
                true;


            return;
        }


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.5
            )
        );


        this.renderer.shadowMap.enabled =
            true;
    }


    /* ======================================================
       SHADOWS
       ====================================================== */

    setShadows(
        enabled
    ) {


        this.renderer.shadowMap.enabled =
            Boolean(
                enabled
            );


        this.scene.traverse(
            object => {


                if (
                    object.isMesh
                ) {


                    object.castShadow =
                        Boolean(
                            enabled
                        );


                    object.receiveShadow =
                        Boolean(
                            enabled
                        );
                }
            }
        );
    }


    /* ======================================================
       FOCUS POSITION
       ====================================================== */

    focusOnPosition(
        position,
        distance = 8
    ) {


        if (
            !position ||
            !this.controls
        ) {


            return;
        }


        this.controls.target.copy(
            position
        );


        this.camera.position.set(
            position.x +
            distance,
            distance *
            0.85,
            position.z +
            distance
        );


        this.controls.update();
    }


    /* ======================================================
       DISPOSE
       ====================================================== */

    disposeObject(
        object
    ) {


        object.traverse(
            child => {


                if (
                    child.geometry
                ) {


                    child.geometry.dispose();
                }


                if (
                    child.material
                ) {


                    const materials =

                        Array.isArray(
                            child.material
                        )

                            ? child.material

                            : [
                                child.material
                            ];


                    materials.forEach(
                        material => {


                            if (
                                material.map
                            ) {


                                material.map.dispose();
                            }


                            material.dispose();
                        }
                    );
                }
            }
        );
    }


    /* ======================================================
       FPS
       ====================================================== */

    updateFPS(
        delta
    ) {


        this.frameCounter++;


        this.fpsTimer +=
            delta;


        if (
            this.fpsTimer >=
            1
        ) {


            this.fps =
                Math.round(
                    this.frameCounter /
                    this.fpsTimer
                );


            this.frameCounter =
                0;


            this.fpsTimer =
                0;
        }
    }


    /* ======================================================
       MAIN LOOP
       ====================================================== */

    animate() {


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            );


        this.updateFPS(
            delta
        );


        this.updateCamera(
            delta
        );


        this.controls
            ?.update();


        if (
            this.gameStarted

            &&

            !this.gamePaused
        ) {


            this.updateEmployees(
                delta
            );


            this.updateReceptionist(
                delta *
                this.gameSpeed
            );


            this.systems
                ?.update?.(
                    delta *
                    this.gameSpeed
                );
        }


        this.renderer.render(
            this.scene,
            this.camera
        );
    }
}


/* ==========================================================
   START
   ========================================================== */

const game =
    new StartupTycoon3D();


window.StartupTycoonGame =
    game;


window.addEventListener(
    "DOMContentLoaded",
    () => {


        game.init();
    }
);


/* ==========================================================
   EXPORT
   ========================================================== */

export {
    StartupTycoon3D,
    CONFIG
};
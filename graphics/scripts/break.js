// Lottie anim

const logoAnim = lottie.loadAnimation({
    container: document.getElementById('cpLogoContainer'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './lottie-anim/AnimatedCheckpointLogo.json'
});

// maps scene color switching

SBData.on('change', newValue => {
    const rgbA = hexToRgb(newValue.colorInfo.clrA);
    const rgbB = hexToRgb(newValue.colorInfo.clrB);
    var filterA = new Solver(new Color(rgbA[0], rgbA[1], rgbA[2])).solve().filter;
    var filterB = new Solver(new Color(rgbB[0], rgbB[1], rgbB[2])).solve().filter;

    gsap.to('.stageArt1', {duration: 1, filter: filterA});
    gsap.to('.stageArt2', {duration: 1, filter: filterB});
});

// Scene switching

currentBreakScene.on('change', (newValue, oldValue) => {
    let delay = 0;
    let mapsDelay = 2.25;
    let mapCount = 0;
    let animDelay = 0;

    if (oldValue === 'stages') {
        delay = 0.3;
    }

    if (oldValue === 'teams') {
        mapsDelay = 0.5;
    }

    switch (newValue) {
        case 'main':
            mapCount = toggleStages(false, 0);
            animDelay = 0.5;
            if (oldValue === 'maps') {
                animDelay = 0.5 + (mapCount * 0.1);
            }
            toggleMainScene(true, animDelay);
            toggleNextUp(false);
            break;
        case 'teams':
            toggleMainScene(false, 0);
            mapCount = toggleStages(false, 0);
            animDelay = 2.25;
            if (oldValue === 'maps') {
                animDelay = 0.5 + (mapCount * 0.1);
            }
            toggleNextUp(true, animDelay);
            break;
        case 'stages':
            toggleMainScene(false, 0);
            toggleNextUp(false);
            toggleStages(true, mapsDelay);
            break;
        default:
            mapCount = toggleStages(false, 0);
            animDelay = 0.5;
            if (oldValue === 'maps') {
                animDelay = 0.5 + (mapCount * 0.1);
            }
            toggleMainScene(true, animDelay);
            toggleNextUp(false);
            break;
    }
});

function toggleMainScene(show, startDelay = 0) {
    let ease = 'power2.inOut';
    let opacity = show ? 1 : 0;
    let delay = show ? 0 : 1.75;
    delay = delay + startDelay;
    let timeoutDelay = (startDelay * 1000);

    setTimeout(() => {
        let logoDirection = show ? 1 : -1;
        let logoTo = show ? 1 : 99;
        logoAnim.setDirection(logoDirection);
        logoAnim.goToAndPlay(logoTo, true);
    }, timeoutDelay);

    gsap.to(['.mainSceneGrid', '.ipl-powered'], {duration: 0.5, opacity: opacity, delay: delay / 2, ease: ease});
    gsap.to('.mainScene', {duration: 0.5, opacity: opacity, delay: delay, ease: ease});
}

function toggleStages(show, startDelay = 0) {
    let opacity = show ? 1 : 0;

    let stageElems = document.querySelectorAll('.stageElem');

    for (let i = 0; i < stageElems.length; i++) {
        const elem = stageElems[i];
        let cardYTo = show ? 0 : 50;
        let cardYFrom = show ? -50 : 0;
        let cardDelay = (0.1 * i) + startDelay;
        let cardEase = show ? 'power2.out' : 'power2.in';

        gsap.fromTo(elem, {y: cardYFrom, opacity: (opacity === 1) ? 0 : 1}, {
            duration: 0.5,
            delay: cardDelay,
            y: cardYTo,
            ease: cardEase,
            opacity: opacity
        });
    }

    if (!show) {
        startDelay += stageElems.length * 0.1;
    }

    gsap.to('.sceneStages', {duration: 0.5, ease: 'power2.inOut', opacity: opacity, delay: startDelay});

    return stageElems.length;
}

function toggleNextUp(show, delay = 0) {
    let ease = 'power2.inOut';
    let opacity = show ? 1 : 0;
    let styleYTo = show ? 0 : -25;
    let styleYFrom = show ? -25 : 0;
    gsap.to('.sceneTeams', {duration: 0.5, opacity: opacity, delay: delay, ease: ease});
    gsap.fromTo('.nextTeamInfoContainer', {y: styleYFrom}, {duration: 0.5, y: styleYTo, delay: delay, ease: ease});
    gsap.fromTo('.nextTeamInfo', {
        filter: show ? 'drop-shadow(0px 7px 7px black)' : 'drop-shadow(0px 2px 2px black)'
    }, {
        duration: 0.5, delay: delay, ease: ease,
        filter: show ? 'drop-shadow(0px 2px 2px black)' : 'drop-shadow(0px 7px 7px black)'
    });
    if (show) {
        let teamAPlayers = document.querySelectorAll('.nextTeamAPlayer');
        let teamBPlayers = document.querySelectorAll('.nextTeamBPlayer');

        for (let i = 0; i < teamAPlayers.length; i++) {
            const element = teamAPlayers[i];

            //element.style.opacity = '0';
            //gsap.to(element, {opacity: 1, duration: 0.25, delay: (i * 0.05) + (delay * 1.2)});
            gsap.fromTo(element, {clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)'}, {
                ease: 'power2.out',
                duration: 2,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                delay: (i * 0.2) + (delay * 1.2)
            });
        }

        for (let j = 0; j < teamBPlayers.length; j++) {
            const element = teamBPlayers[j];

            //element.style.opacity = '0';
            //gsap.to(element, {opacity: 1, duration: 0.25, delay: (j * 0.05) + (delay * 1.2)});
            gsap.fromTo(element, {clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)'}, {
                ease: 'power2.out',
                duration: 2,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                delay: (j * 0.2) + (delay * 1.2)
            });
        }
    }
}

// Informative texts on main scene

function measureText(text, fontFamily, fontSize, maxWidth, useInnerHTML = false) {
    const measurer = document.createElement('div');
    measurer.classList.add('measurer');
    if (useInnerHTML) {
        measurer.innerHTML = text;
    } else {
        measurer.innerText = text;
    }
    measurer.style.fontFamily = fontFamily;
    measurer.style.fontSize = fontSize;

    document.body.appendChild(measurer);
    let width = measurer.getBoundingClientRect().width;
    measurer.parentNode.removeChild(measurer);
    if (width > maxWidth) {
        return maxWidth;
    } else {
        return width;
    }
}

const breakMainTextProps = {
    fontFamily: "'Primer Print', 'Kosugi Maru', 'Roboto'",
    fontSize: '55px',
    maxWidth: 850
}

function setMainSceneText(textElemID, newText, tl, oldText = '') {
    let textElem = document.querySelector(`#${textElemID}`);
    if (textElem.getAttribute('text') == newText) return;

    if (oldText === '') {
        oldText = textElem.getAttribute('text');
    }

    tl.add(gsap.fromTo(textElem, {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}, {
        ease: 'power2.inOut', duration: 1, clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)', onComplete: function () {
            textElem.setAttribute('text', newText);
            textElem.style.opacity = '0';
            textElem.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        }
    }));
    tl.add(gsap.to(textElem, {duration: 0.5, opacity: 1, delay: 0.25}));
}

const mainTextTL = gsap.timeline();

mainFlavorText.on('change', newValue => {
    setMainSceneText('breakFlavorText', newValue, mainTextTL);
});

const casterNamesTL = gsap.timeline();

casters.on('change', newValue => {
    let castersText = '';
    Object.keys(newValue).forEach((item, index, arr) => {
        const element = newValue[item];

        castersText += `${element.name} <span class="pronoun">${element.pronouns}</span>`;

        if (arr[index + 2]) {
            castersText += ', ';
        } else if (arr[index + 1]) {
            castersText += ' & ';
        }
    });

    setMainSceneText('breakCastersText', castersText, casterNamesTL);
});

const musicTL = gsap.timeline();

function checkStringEmptyOrUndef(string) {
    string = String(string);
    return (string === 'undefined' || string === '');
}

function getSongNameString(rep) {
    if (checkStringEmptyOrUndef(rep.artist) && checkStringEmptyOrUndef(rep.song)) {
        return 'No song is playing.'
    }

    if (checkStringEmptyOrUndef(rep.artist)) {
        return rep.song;
    } else if (checkStringEmptyOrUndef(rep.song)) {
        return rep.artist;
    }

    return rep.artist + ' - ' + rep.song;
}

NodeCG.waitForReplicants(nowPlaying).then(() => {
    nowPlaying.on('change', newValue => {
        setMainSceneText('breakMusicText', getSongNameString(newValue), musicTL);
    });
});

function getGridRows(showMusic) {
    let gridStyle = '84px 84px';

    if (showMusic) {
        gridStyle += ' 84px';
    } else {
        gridStyle += ' 0px';
    }

    gridStyle += ' 84px 84px';

    return gridStyle;
}

function animToggleInfo(showMusic, infoElem, elemShown) {
    let gridStyle = getGridRows(showMusic), gridDelay, elemOpacity, elemDelay;
    if (elemShown) {
        elemOpacity = 1;
        elemDelay = 0.4;
        gridDelay = 0;
    } else {
        elemOpacity = 0;
        elemDelay = 0;
        gridDelay = 0.4;
    }

    gsap.to(infoElem, {duration: 0.5, opacity: elemOpacity, delay: elemDelay, ease: 'power2.inOut'});
    gsap.to('.mainSceneGrid', {duration: 0.5, gridTemplateRows: gridStyle, ease: 'power2.inOut', delay: gridDelay});
}

NodeCG.waitForReplicants(NSTimerShown, musicShown).then(() => {
    musicShown.on('change', newValue => {
        animToggleInfo(newValue, '#breakMusic', newValue);
    });
});


// teams

nextTeams.on('change', newValue => {
    nextTeamAName.setAttribute('text', newValue.teamAInfo.name);
    nextTeamBName.setAttribute('text', newValue.teamBInfo.name);

    teamAplayersBG.innerHTML = '';
    teamBplayersBG.innerHTML = '';

    newValue.teamAInfo.players.forEach(player => {
        const elem = createNextTeamPlayerElem(player.name, 'left', 'a');
        teamAplayersBG.appendChild(elem);
    });

    newValue.teamBInfo.players.forEach(player => {
        const elem = createNextTeamPlayerElem(player.name, 'left', 'b');
        teamBplayersBG.appendChild(elem);
    });
});

function createNextTeamPlayerElem(name, align, team) {
    const textElem = document.createElement('fitted-text');
    textElem.setAttribute('text', name);
    textElem.setAttribute('max-width', '400');
    textElem.setAttribute('align', align);

    const checkElem = document.createElement('i');
    checkElem.classList.add('fas');
    checkElem.classList.add('fa-check');

    const container = document.createElement('div');
    container.classList.add('teamsItemContainer');
    container.appendChild(checkElem);
    container.appendChild(textElem);
    if (team === 'a') {
        container.classList.add('nextTeamAPlayer');
    } else {
        container.classList.add('nextTeamBPlayer');
    }

    return container;
}

// Stages

const mapNameToImagePath = {
    "Ancho-V Games": "S2_Stage_Ancho-V_Games.png",
    "Arowana Mall": "S2_Stage_Arowana_Mall.png",
    "Blackbelly Skatepark": "S2_Stage_Blackbelly_Skatepark.png",
    "Camp Triggerfish": "S2_Stage_Camp_Triggerfish.png",
    "Goby Arena": "S2_Stage_Goby_Arena.png",
    "Humpback Pump Track": "S2_Stage_Humpback_Pump_Track.png",
    "Inkblot Art Academy": "S2_Stage_Inkblot_Art_Academy.png",
    "Kelp Dome": "S2_Stage_Kelp_Dome.png",
    "MakoMart": "S2_Stage_MakoMart.png",
    "Manta Maria": "S2_Stage_Manta_Maria.png",
    "Moray Towers": "S2_Stage_Moray_Towers.png",
    "Musselforge Fitness": "S2_Stage_Musselforge_Fitness.png",
    "New Albacore Hotel": "S2_Stage_New_Albacore_Hotel.png",
    "Piranha Pit": "S2_Stage_Piranha_Pit.png",
    "Port Mackerel": "S2_Stage_Port_Mackerel.png",
    "Shellendorf Institute": "S2_Stage_Shellendorf_Institute.png",
    "Shifty Station": "S2_Stage_Shifty_Station.png",
    "Snapper Canal": "S2_Stage_Snapper_Canal.png",
    "Starfish Mainstage": "S2_Stage_Starfish_Mainstage.png",
    "Sturgeon Shipyard": "S2_Stage_Sturgeon_Shipyard.png",
    "The Reef": "S2_Stage_The_Reef.png",
    "Wahoo World": "S2_Stage_Wahoo_World.png",
    "Walleye Warehouse": "S2_Stage_Walleye_Warehouse.png",
    "Skipper Pavilion": "S2_Stage_Skipper_Pavilion.png",
    "Unknown Map": "unnamed-unknown-map.png"
};

function createMapListElems(maplist) {
    const stagesGrid = document.querySelector('.stagesGrid');
    const imageLoads = [];

    gsap.to(stagesGrid, {
        duration: 0.5, opacity: 0, onComplete: async function () {
            stagesGrid.innerHTML = '';
            stagesGrid.style.gridTemplateColumns = `repeat(${maplist.games.length}, 1fr)`;

            let mapsHTML = '';
            let elemWidth = '260';
            let fontSize = '2em';
            let winnerFontSize = '1.7em';

            if (maplist.games.length === 3) {
                elemWidth = '380';
                stagesGrid.style.width = '1200px';
                winnerFontSize = '2em';
            } else if (maplist.games.length === 5) {
                elemWidth = '260';
                stagesGrid.style.width = '1400px';
                fontSize = '1.9em;'
                winnerFontSize = '1.9em';
            } else if (maplist.games.length === 7) {
                elemWidth = '190';
                stagesGrid.style.width = '1600px';
                fontSize = '1.75em';
            }

            for (let i = 0; i < maplist.games.length; i++) {
                const element = maplist.games[i];

                const imageUrl = `img/stages/${mapNameToImagePath[element.stage]}`;
                imageLoads.push(loadImagePromise(imageUrl));

                // noinspection CssUnknownTarget
                const elem = `
                <div class="stageElem">
                    <div class="dot-wrapper">
                        <img class="mapsDot" src="img/cp-mapsdot.png">
                    </div>
                    <div class="stageImage" style="background-image: url(${imageUrl});">
                        <div class="stageWinner" id="stageWinner_${i}" style="opacity: 0; font-size: ${winnerFontSize}"></div>
                    </div>
                    <div class="stageInfo">
                        <div class="stageMode">
                            <fitted-text text="${element.mode}" max-width="${elemWidth}" align="center"></fitted-text>
                        </div>
                        <div class="stageName" style="font-size: ${fontSize}">${element.stage}</div>
                    </div>
                </div>`

                mapsHTML += elem;
            }

            await Promise.all(imageLoads);

            stagesGrid.innerHTML = mapsHTML;
            setWinners(mapWinners.value)
        }
    });

    gsap.to(stagesGrid, {duration: 0.5, opacity: 1, delay: 0.5});
}

function loadImagePromise(imageUrl) {
    return new Promise((resolve) => {
        const imageLoaderElem = document.createElement("img");
        imageLoaderElem.src = imageUrl;

        imageLoaderElem.addEventListener('load', () => {
            resolve();
        });
    })
}

// returns true if there is a difference
function roundsDiffer(val1, val2) {
    if (val1[0].id !== val2[0].id || val1[0].name !== val2[0].name) return true;
    if (val1.length !== val2.length) return true;
    for (let i = 1; i < val1.length; i++) {
        if (val1[i].map !== val2[i].map || val1[i].mode !== val2[i].mode) return true;
    }
    return false;
}

NodeCG.waitForReplicants(rounds, activeRound, mapWinners).then(() => {
    activeRound.on('change', newValue => {
        const round = rounds.value[newValue];

        createMapListElems(round);
    });

    rounds.on('change', (newValue, oldValue) => {
        if (!oldValue) return;
        let newCurrentList = newValue[activeRound.value];
        let oldCurrentList = oldValue[activeRound.value];

        if (roundsDiffer(newCurrentList, oldCurrentList)) {
            createMapListElems(newCurrentList);
        }
    });
});

window.addEventListener('load', () => {
    NodeCG.waitForReplicants(mapWinners, SBData).then(() => {
        mapWinners.on('change', (newValue, oldValue) => {
            setWinners(newValue);
        });

        SBData.on('change', newValue => {
            setWinners(mapWinners.value);

            document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
            document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);
        });
    });
});

function setWinners(val) {
    for (let i = 0; i < val.length; i++) {
        const element = val[i];
        if (element === 0) {
            setWinner(i, '', false);
        } else if (element === 1) {
            setWinner(i, SBData.value.teamAInfo.name, true);
        } else {
            setWinner(i, SBData.value.teamBInfo.name, true);
        }
    }
}

function setWinner(index, name, shown) {
    let winnerElem = document.querySelector(`#stageWinner_${index}`);
    if (!winnerElem) return;
    let opacity;

    if (shown) {
        opacity = 1;
    } else {
        opacity = 0
    }

    if (shown) {
        winnerElem.innerText = name;
    }

    gsap.to(winnerElem, {opacity: opacity, duration: 0.5});
}

// Scoreboard on maps page



teamScores.on('change', newValue => {
    document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
    document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});

// Social media text loop

const discordLinks = ["iplabs.ink/discord",
    "discord.io/CHECKPOINT1"];

const twitterLinks = ["@IPLSplatoon",
    "@Checkpoint1SPL"];

function startTextLoop(arr, tl, elemID) {
    for (i = 0; i < arr.length; i++) {
        setMainSceneText(elemID, arr[i], tl);

        if (i === arr.length - 1) {
            tl.add(gsap.to({}, {
                duration: 8.5, onComplete: () => {
                    startTextLoop(arr, tl, elemID)
                }
            }));
        }
    }
}

const discordTL = gsap.timeline();
const twitterTL = gsap.timeline();

window.addEventListener('load', () => {
    startTextLoop(discordLinks, discordTL, 'breakDiscordText');

    // stagger animation starts
    twitterTL.add(gsap.to({}, {duration: 5}));

    startTextLoop(twitterLinks, twitterTL, 'breakTwitterText');
});

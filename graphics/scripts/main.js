// Team Scores

const teamScores = nodecg.Replicant('teamScores', 'ipl-overlay-controls');

teamScores.on('change', newValue => {
	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});

// Scoreboard data

const SBData = nodecg.Replicant('SBData', 'ipl-overlay-controls');

SBData.on('change', newValue => {
	document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
	document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);

	gsap.to('#teamAColor', {duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrB : newValue.colorInfo.clrA});
	gsap.to('#teamBColor', {duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrA : newValue.colorInfo.clrB});

	document.querySelector('.sbFlavorTextBG fitted-text').setAttribute('text', newValue.flavorText);
});

// Show/hide scoreboard

const SBShown = nodecg.Replicant('SBShown', 'ipl-overlay-controls');

SBShown.on('change', newValue => {
	gsap.fromTo('.sbBackground', {y: (newValue) ? -15 : 0}, {
		duration: 0.35,
		y: (newValue) ? 0 : -15,
		ease: (newValue) ? 'power2.out' : 'power2.in',
		opacity: (newValue) ? 1 : 0
	});
	gsap.fromTo('.sbFlavorTextBG', {y: (newValue) ? 15 : 0},  {
		duration: 0.35, 
		y: (newValue) ? 0 : 15,
		ease: (newValue) ? 'power2.out' : 'power2.in',
		opacity: (newValue) ? 1 : 0
	});
	if (newValue) {
		gsap.fromTo('.teamNameElem', {clipPath: 'polygon(0 0, 0px 0, 0px 100%, 0% 100%)'}, {
			clipPath: 'polygon(0 0, 215px 0, 215px 100%, 0% 100%)',
			duration: 0.75,
			ease: 'power2.inOut',
			delay: 0.25
		});
		gsap.fromTo('.score', {opacity: 0}, {opacity: 1, duration: 0.5, delay: 0.25});
	}
});

// Caster names

const casterNames = nodecg.Replicant('casterNames', 'ipl-overlay-controls');

casterNames.on('change', newValue => {
	let nameArray = newValue.split('&');
	let bg = document.querySelector('.castersBG');
	bg.innerHTML = '';

	nameArray.forEach(name => {
		var elem = document.createElement('fitted-text');
		var htmlText = name.replace(/\[\[/g, '<span class="pronoun">').replace(/\]\]/g, '</span>');
		elem.setAttribute('text', htmlText);
		elem.setAttribute('max-width', '230');
		elem.setAttribute('align', 'left');
		elem.setAttribute('useInnerHTML', '');
		
		bg.appendChild(elem);
	});
});

// Caster name animation

nodecg.listenFor('mainShowCasters', 'ipl-overlay-controls', () => {
	gsap.fromTo('.castersWrapper', {opacity: 0, y: -15}, {duration: 0.35, y: 0, opacity: 1, ease: 'power2.out'});
	gsap.to('.castersWrapper', {duration: 0.5, y: 15, opacity: 0, delay: 10.65, ease: 'power2.in'});
});

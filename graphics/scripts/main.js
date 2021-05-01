// Team Scores

teamScores.on('change', newValue => {
	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});

// Scoreboard data

SBData.on('change', newValue => {
	document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
	document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);

	gsap.to('#teamAColor', {duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrB : newValue.colorInfo.clrA});
	gsap.to('#teamBColor', {duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrA : newValue.colorInfo.clrB});

	document.querySelector('.sbFlavorTextBG fitted-text').setAttribute('text', newValue.flavorText);
});

// Show/hide scoreboard

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

casters.on('change', newValue => {
	let bg = document.querySelector('.castersBG');
	bg.innerHTML = '';

	Object.keys(newValue).forEach((item, index, arr) => {
		const caster = newValue[item];
		const elem = document.createElement('fitted-text');
		const htmlText = `${caster.name} <span class="pronoun">${caster.pronouns}</span>`;
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

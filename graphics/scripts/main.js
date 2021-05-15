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
			ease: 'power1.out',
			delay: 0.25
		});
		gsap.fromTo('.score', {opacity: 0}, {opacity: 1, duration: 0.5, delay: 0.25});
	}
});

const castersElem = document.querySelector('div.castersWrapper > .castersBG');
const castersShowTl = gsap.timeline();

casters.on('change', newValue => {
	let elemHtml = '';
	const castersHeight = Object.keys(newValue).length * 40;
	gsap.set('div.castersWrapper > .castersBG', {height: castersHeight});

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];

		elemHtml += `
		<div class="caster">
			<div class="caster-name">
				<fitted-text text="${element.name} <span class=&quot;pronoun&quot;>${element.pronouns}</span>" useInnerHTML max-width="235"></fitted-text>
			</div>
			<div class="caster-twitter">
				<fitted-text text="${element.twitter} <span class=&quot;pronoun&quot;>${element.pronouns}</span>" useInnerHTML max-width="235"></fitted-text>
			</div>
		</div>`
	});

	castersElem.innerHTML = elemHtml;
});

// Caster name animation

nodecg.listenFor('mainShowCasters', DASHBOARD_BUNDLE_NAME, () => {
	const showDuration = 20;
	castersShowTl.add(gsap.set('.caster > .caster-twitter', {opacity: 0}))
		.add(gsap.set('.caster > .caster-name', {opacity: 1}))
		.add(gsap.fromTo('.castersWrapper', {opacity: 0, y: -15}, {duration: 0.35, y: 0, opacity: 1, ease: 'power2.out'}))
		.add(gsap.to({}, {duration: showDuration}))
		.add(gsap.to('.caster > .caster-twitter', {opacity: 1, duration: 0.35}), `-=${showDuration / 2}`)
		.add(gsap.to('.caster > .caster-name', {opacity: 0, duration: 0.35}), `-=${showDuration / 2}`)
		.add(gsap.to('.castersWrapper', {duration: 0.5, y: 15, opacity: 0, delay: 10.65, ease: 'power2.in'}));
});

const topBarCasterElem = document.getElementById('info-row-casters-text');
const topBarTwitterElem = document.getElementById('info-row-casters-twitter-text');
const topBarCastersTl = gsap.timeline();

casters.on('change', (newValue, oldValue) => {
	let castersText = '';
	let twittersText = '';

	let updateTwitters = (oldValue === undefined);
	let updateNames = (oldValue === undefined);

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];

		if (oldValue) {
			const oldElement = oldValue[item];

			if (element.pronouns !== oldElement.pronouns) {
				updateNames = true;
				updateTwitters = true;
			} else {
				if (element.twitter !== oldElement.twitter) {
					updateTwitters = true;
				}
				if (element.name !== oldElement.name) {
					updateNames = true;
				}
			}
		}

		castersText += `${element.name} <span class="pronoun">${element.pronouns}</span>`;
		twittersText += `${element.twitter} <span class="pronoun">${element.pronouns}</span>`;

		if (arr[index + 2]) {
			castersText += ', ';
			twittersText += ', ';
		} else if (arr[index + 1]) {
			castersText += ' & ';
			twittersText += ' & ';
		}
	});

	if (updateNames) {
		setMainSceneText(topBarCasterElem.parentNode, castersText, topBarCastersTl);
	}

	if (updateTwitters) {
		setMainSceneText(topBarTwitterElem.parentNode, twittersText, topBarCastersTl);
	}
});

function getIcon(elem) {
	return elem.parentNode.querySelector('i');
}

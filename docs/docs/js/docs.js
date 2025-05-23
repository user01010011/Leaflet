/* global hljs */
hljs.configure({tabReplace: '    '});
hljs.initHighlighting();

const tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';

const toc = document.querySelector('#toc');

if (toc) {
	// top menu
	let menus = document.querySelectorAll('#toc a');

	for (const menu of menus) {
		menu.addEventListener('click', (e) => {
			clickOnAnchor(e);
		});
	}

	// sidebar menu
	tocCopy.innerHTML = toc.innerHTML;
	document.getElementsByClassName('container')[0].appendChild(tocCopy);

	menus = document.querySelectorAll('#toc-copy ul');

	for (const menu of menus) {
		menu.addEventListener('mouseover', function () {
			this.previousElementSibling.classList.add('hover');
		});

		menu.addEventListener('mouseout', function () {
			this.previousElementSibling.classList.remove('hover');
		});

		menu.addEventListener('click', (e) => {
			clickOnAnchor(e);
		});
	}

	const labels = document.querySelectorAll('#toc-copy h4');

	for (const label of labels) {
		label.addEventListener('click', function () {
			this.classList.toggle('active');
		});
	}

	tocCopy.addEventListener('click', function (e) {
		if (e.target.nodeName !== 'H4') {
			this.classList.toggle('active');
		}
	});

	const scrollPos = function scrollPos() {
		const scroll = window.scrollY;

		if (scroll >= (toc.offsetHeight + toc.offsetTop)) {
			document.body.classList.add('scrolled');
		} else {
			document.body.classList.remove('scrolled');
		}
	};

	scrollPos();

	window.addEventListener('scroll', () => {
		scrollPos();
	});

	window.addEventListener('load', () => {
		const currentHash = window.location.hash;
		if (!currentHash) { return; }
		const elem = document.querySelector(currentHash);

		if (elem.tagName === 'H2' || elem.tagName === 'H4') {
			setTimeout(() => {
				scrollToHeader(elem, true);
			}, 10);
		}
	}, false);
}

let currentAnchor = '';

function clickOnAnchor(e) {
	// if the parent element of <a> is clicked we ignore it
	if (e.target.tagName !== 'A') {
		return;
	}

	const anchor = `#${e.target.href.split('#')[1]}`;
	const elemHeader = document.querySelector(anchor);

	scrollToHeader(elemHeader, `#${elemHeader.id}` === currentAnchor);

	// prevent default browser anchor scroll
	e.preventDefault();
}

function userAgentContains(str) {
	if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
		return false;
	}
	return navigator.userAgent.toLowerCase().includes(str);
}
const chromeBrowser = userAgentContains('chrome');

function scrollToHeader(elemHeader, sameAnchor) {
	let scrollBy = elemHeader.nextSibling.offsetTop;

	if (chromeBrowser && sameAnchor) {
		// chromium remove the anchor element from the scroll-position
		// we check with sameAnchor if the User has clicked on the same anchor link again
		scrollBy = scrollBy - elemHeader.offsetHeight;
	} else {
		// we scroll a little bit more down to get the element already sticky
		scrollBy += 5;
	}
	// scroll to the anchor
	window.scrollTo(0, scrollBy);
	// apply the new anchor to the location url
	currentAnchor = window.location.hash = `#${elemHeader.id}`;
}

const backToTop = document.querySelector('#back-to-top');
backToTop.addEventListener('click', () => {
	document.documentElement.scrollIntoView({behavior: 'smooth'});
});

let lastScrollY = window.scrollY;
const scrollEventHandler = function scrollEventHandler() {
	const {scrollY} = window;

	if (scrollY !== 0 && scrollY < lastScrollY) {
		backToTop.classList.add('is-visible');
	} else {
		backToTop.classList.remove('is-visible');
	}

	lastScrollY = scrollY;
};

window.addEventListener('scroll', () => {
	scrollEventHandler();
});

var SLIDES_SELECTOR = '.reveal .slides section',
	HORIZONTAL_SLIDES_SELECTOR = '.reveal .slides>section',
	VERTICAL_SLIDES_SELECTOR = '.reveal .slides>section.present>section',
	HOME_SLIDE_SELECTOR = '.reveal .slides>section:first-of-type';

function getChapterName(element) {
	while (element) {
		if ((element.tagName == "SECTION") && !!element.dataset.chapter) {
			return element.dataset.chapter;
		}
		element = element.parentNode;
	}
}
	
function populateTOC() {
	var toc = document.getElementsByClassName("toc");
	var chapterSlides = document.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR + "[data-chapter]");
	var chapterName = "";
	for (var i = 0; i < chapterSlides.length; i++) {
		var slide = chapterSlides[i];
		if (chapterName != slide.dataset.chapter) {
			chapterName = slide.dataset.chapter;
			for (var j = 0; j < toc.length; j++) {
				var el = toc[j];
				var li = document.createElement("li");		
				li.textContent = chapterName;
				if (!!el.classList.contains("pause") && (getChapterName(el) == chapterName)) {
					li.classList.add("infocus");
				}
				el.appendChild(li);
			}
		}
	}
}


Reveal.addEventListener('slidechanged', function(event) {
	/**
	 * Update chapter title.
	 */
	var horizontalSlides = document.querySelectorAll(HORIZONTAL_SLIDES_SELECTOR);
	var currentSlide = horizontalSlides[event.indexh];
	var chapterNameNode = document.getElementById("chapter-name");
	var chapterName = currentSlide.dataset.chapter;
	chapterName = chapterName && (event.indexv != 0) ? chapterName : "";
	chapterNameNode.textContent = chapterName;

	/**
	 * Update slide number.
	 */	
	var slideNumber = document.getElementById("slide-progress");

	if (slideNumber) {
		var horizontalSlides = Array.prototype.slice.call( document.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		// The number of past and total slides
		var totalCount = document.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ).length;
		var pastCount = 0;
		
		// Step through all slides and count the past ones
		mainLoop: for( var i = 0; i < horizontalSlides.length; i++ ) {
			var horizontalSlide = horizontalSlides[i];
			var verticalSlides = Array.prototype.slice.call( horizontalSlide.querySelectorAll( 'section' ) );
			for( var j = 0; j < verticalSlides.length; j++ ) {
				// Stop as soon as we arrive at the present
				if( verticalSlides[j].classList.contains( 'present' ) ) {
					break mainLoop;
				}
				pastCount++;
			}
			// Stop as soon as we arrive at the present
			if( horizontalSlide.classList.contains( 'present' ) ) {
				break;
			}
			// Don't count the wrapping section for vertical slides
			if( horizontalSlide.classList.contains( 'stack' ) === false ) {
				pastCount++;
			}
		
		}
		if (pastCount !== 0) {
			slideNumber.textContent = pastCount + " | " + (totalCount - 1);
		}
		else {
			slideNumber.textContent = "";
		}
	}
});

populateTOC();

(function () {
    var waitTime = 50,
        waitingToLoad = null,
        loadingEl = document.getElementById('loading'),
        shotsEl = document.getElementById('shots');

    var loadShots = function (screenWidth) {
        loadingEl.style.opacity = '1';
        loading = true;

        // These numbers are arbitrary
        var shotNumbers = {
            'small': 12,
			'medium': 12,
            'large': 16
        };

        var callback = function (res) {
            var html = '';

            res.shots.forEach(function (shot) {
                html += '<li class="dribbble-shot"><a href="' + shot.url + '"><img src="' + shot.image_url + '" alt="Shot on Dribbble.com"></a></li>';
            });

            shotsEl.innerHTML = html;

            loadingEl.style.opacity = '0';
        };

        // This could be optimized further. There's no need to get all of the
        // shots every time. You could load sets, like small: 1-4, medium: 5-12,
        // large: 13-24.
        // Things will get tougher if you try to load across multiple pages.
        jribbble.getShotsByPlayerId('chriskobar', callback, {
            per_page: shotNumbers[screenWidth]
        });
    };

    var screenWidthUpdate = function (matchedWidth) {
        clearTimeout(waitingToLoad);

        // Default to the lowest
        var width = matchedWidth || 'small';

        // This is a consideration for the intial page load. When the page loads
        // if the screen size meets our widest size, in this case 1200px, each
        // of the screen sizes with be satisfied and we'll end up making every
        // request instead of just the one we need.
        waitingToLoad = setTimeout(function () {
            console.log('Loading shots for %s screens', width);
            loadShots(width);

            // After the intial load we shouldn't need to wait, because only
            // one query will be matched at a time
            waitTime = 0;

        }, waitTime);
    };

    // Call this when the page loads
    screenWidthUpdate();

    // We only care about matches here because we don't need to unload anything
    // If the screen starts out wide, we'll have everything loaded so there's
    // no need to make another call to load less.
    enquire.register('screen and (min-width: 641px) and (max-width: 1023px)', {
        match: function () {
            screenWidthUpdate('medium');
        }
    });
    enquire.register('screen and (min-width: 1024px)', {
        match: function () {
            screenWidthUpdate('large');
        }
    });
}());
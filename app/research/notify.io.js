var notifyAppIo = {
    version: 1.9,
    initiate: function() {
        this.applyDefaultStyling();
        var cached25 = Math.ceil((new Date().getTime() / 1000) / 25) * 25;
        var recentOrders = document.createElement('script');
        recentOrders.src = this.settings.notifyUrl + '/js-obj/' + this.clientHash + '-' + this.clientId + '/' + this.settings.limit + '/' + cached25 + '.js';
        if (document.URL.indexOf('reset=notify') > -1) {
            localStorage.removeItem('disable-notify-' + this.clientId);
        }
        if (this.isNotifyEnabled()) {
            document.getElementsByTagName('head')[0].appendChild(recentOrders);
        }
        if (document.URL.indexOf('utm_source=notify') > -1) {
            this.fb({
                e: 1,
                v: this.version,
                c: this.clientId,
                p: window.location.pathname.replace('/products/', ''),
                m: this.isMobileDevice()
            });
        }
    },
    applyDefaultStyling: function() {
        var myNav = navigator.userAgent.toLowerCase();
        if (myNav.indexOf('msie') != -1 && parseInt(myNav.split('msie')[1]) == 8) {
            var cssElement = document.createElement('link');
            cssElement.type = 'text/css';
            cssElement.rel = 'stylesheet';
            cssElement.href = this.settings.notifyUrl + '/css/default-ie8-styling.css';
        } else {
            var cssElement = document.createElement('style');
            cssElement.innerHTML = notifyAppIo.settings.themeCss;
        }
        document.getElementsByTagName('head')[0].appendChild(cssElement);
    },
    closed: false,
    isNotifyEnabled: function() {
        var enabled = true;
        var metas = document.getElementsByTagName('meta');
        for (i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('name') == 'notify:enabled') {
                if (metas[i].getAttribute('content') === 'false') {
                    enabled = false;
                }
            }
        }
        if (window.location.href.indexOf('/checkouts/') > -1) {
            enabled = false;
        }
        if (this.settings.hideMobile && this.isMobileDevice()) {
            enabled = false;
        }
        if (this.settings.closable && localStorage.getItem('disable-notify-' + this.clientId)) {
            var closed = localStorage.getItem('disable-notify-' + this.clientId);
            var now = new Date().getTime();
            if (Math.floor((now - closed) / 1000) > 2592000) {
                localStorage.removeItem('disable-notify-' + this.clientId);
            } else {
                enabled = false;
            }
        }
        if (this.isIE() && (this.isIE() === 7 || this.isIE() === 8)) {
            enabled = false;
        }
        return enabled;
    },
    ua: navigator.userAgent.toLowerCase(),
    keyframeSupport: function() {
        if (this.isSafariEight()) {
            return false;
        }
        return !(notifyAppIo.ua.indexOf('msie') != -1 && parseInt(notifyAppIo.ua.split('msie')[1]) < 10);
    },
    isMobileDevice: function() {
        return (window && window.innerWidth && window.innerWidth < 767) ? 1 : 0;
    },
    isSafariEight: function() {
        var check = function(r) {
            return r.test(notifyAppIo.ua);
        }
        var isChrome = check(/\bchrome\b/);
        var isSafari = !isChrome && check(/safari/);
        if (isSafari && check(/version\/8/)) {
            return true;
        } else if (isSafari && check(/version\/7/)) {
            return true;
        } else {
            return false;
        }
    },
    isIE: function() {
        return (this.ua.indexOf('msie') != -1) ? parseInt(this.ua.split('msie')[1]) : false;
    },
    timeago: function(unixTimestamp) {
        for (var u = [60, 60, 24, 7, 4, 12], d = new Date / 1000 - unixTimestamp, c = 0; d >= u[c]; d /= u[c++]) {}
        return 'About ' + ~~d + ' ' + "second0minute0hour0day0week0month0year".split(0)[c] + (1 < ~~d ? 's' : '') + ' ago';
    },
    setup: function(purchases) {
        this.recentPurchases = purchases;
        var notificationDiv = document.createElement('div');
        notificationDiv.id = 'someone-purchased';
        notificationDiv.className = 'customized';
        document.body.appendChild(notificationDiv);
        this.notificationDiv = document.getElementById('someone-purchased');
        setTimeout('notifyAppIo.runNotifications()', this.settings.initialDelay + 1);
    },
    runNotifications: function() {
        if (this.settings.totalDisplayed < this.settings.totalPerPage && !this.closed) {
            this.settings.totalDisplayed++;
            var run = 0;
            for (var key in this.recentPurchases) {
                run++;
                purchase = this.recentPurchases[key];
                if (purchase.url && localStorage.getItem('snv-' + this.clientId + '-' + purchase.id) === null) {
                    localStorage.setItem('snv-' + this.clientId + '-' + purchase.id, 1);
                    this.displayNotification(purchase.first_name, purchase.city, purchase.province, purchase.country, purchase.created_at, purchase.product_title, purchase.image, purchase.url);
                    displayed = true;
                    var delay;
                    if (this.settings.randomize) {
                        delay = Math.floor(Math.random() * (this.settings.displayInterval * 2)) + 1000;
                    } else {
                        delay = this.settings.displayInterval;
                    }
                    setTimeout('notifyAppIo.runNotifications()', delay + this.settings.displayHold);
                    break;
                }
                if (run === this.recentPurchases.length) {
                    if (this.settings.loop) {
                        this.clearLocalStorage();
                        this.runNotifications();
                    }
                }
            }
        }
    },
    displayNotification: function(first_name, city, province, country, unixTimestamp, product, image, url) {
        var now = Math.round(new Date().getTime() / 1000);
        var time_ago = ((now - unixTimestamp) < this.settings.timeAgoLimit) ? '<small>' + this.timeago(unixTimestamp) + '</small>' : '<small></small>';
        var product_with_link = '<a href="' + this.settings.prependUrl + '/products/' + url + '?utm_source=notify&utm_medium=notification">' + product + '</a>';
        if (!city) {
            city = notifyAppIo.settings.cityBackup;
        }
        var message = this.settings.message.replace('{{ first_name }}', first_name).replace('{{ city }}', city).replace('{{ province }}', province).replace('{{ country }}', country).replace('{{ time_ago }}', time_ago).replace('{{ product_with_link }}', product_with_link).replace('{{ product }}', product);
        message = '<p>' + message.replace('in , ', '') + '</p>';
        message = image ? '<img src="' + image + '">' + message : message;
        if (this.settings.closable) {
            message = message + '<span id="notify-close"></span>';
        }
        document.getElementById('someone-purchased').innerHTML = message;
        if (this.settings.closable) {
            var closeBtn = document.getElementById('notify-close');
            if (!closeBtn.addEventListener) {
                closeBtn.attachEvent('onclick', this.closeNotify);
            } else {
                closeBtn.addEventListener('click', this.closeNotify, false);
            }
        }
        this.animateIn();
        setTimeout(function() {
            notifyAppIo.animateOut();
        }, this.settings.displayHold);
    },
    closeNotify: function() {
        notifyAppIo.animateOut();
        localStorage.setItem('disable-notify-' + notifyAppIo.clientId, new Date().getTime());
        notifyAppIo.closed = true;
    },
    fb: function(data) {
        try {
            var l = new(window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            l.open('POST', 'https://npstats.herokuapp.com/notification', 1);
            l.send(JSON.stringify(data));
        } catch (ign) {}
    },
    animateIn: function() {
        if (this.keyframeSupport()) {
            this.notificationDiv.style.display = 'block';
            this.notificationDiv.classList.remove('fade-out');
            this.notificationDiv.classList.add('fade-in');
        } else {
            var opacity = 0;
            var bottom = 0;
            var self = this;
            var timer = setInterval(function() {
                if (opacity >= 1) {
                    clearInterval(timer);
                }
                self.notificationDiv.style.bottom = bottom + 'px';
                self.notificationDiv.style.opacity = opacity;
                self.notificationDiv.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
                self.notificationDiv.style.display = 'block';
                opacity += 0.05;
                bottom += 1;
            }, 25);
        }
    },
    animateOut: function() {
        if (this.keyframeSupport()) {
            this.notificationDiv.classList.remove('fade-in');
            this.notificationDiv.classList.add('fade-out');
        } else {
            var opacity = 1;
            var bottom = 20;
            var self = this;
            var timer = setInterval(function() {
                if (opacity <= 0) {
                    clearInterval(timer);
                    self.notificationDiv.style.display = 'none';
                    return false;
                }
                self.notificationDiv.style.bottom = bottom + 'px';
                self.notificationDiv.style.opacity = opacity;
                self.notificationDiv.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
                opacity -= 0.05;
                opacity = opacity.toFixed(2);
                bottom -= 1;
            }, 25);
        }
    },
    clearLocalStorage: function() {
        for (var i = localStorage.length - 1; i > 0; i--) {
            if (localStorage.key(i).split('-')[0] === 'snv') {
                localStorage.removeItem(localStorage.key(i));
            }
        }
    }
};
notifyAppIo.settings = {};
notifyAppIo.settings.hideMobile = false;
notifyAppIo.settings.initialDelay = 5000;
notifyAppIo.settings.displayInterval = 3000;
notifyAppIo.settings.randomize = 0;
notifyAppIo.settings.closable = 0;
notifyAppIo.settings.displayHold = 4000;
notifyAppIo.settings.limit = 1447878710;
notifyAppIo.settings.timeAgoLimit = 3600;
notifyAppIo.settings.totalPerPage = 30;
notifyAppIo.settings.totalDisplayed = 0;
notifyAppIo.settings.loop = true;
notifyAppIo.settings.message = 'Someone in {{ city }}, {{ country }} purchased {{ product_with_link }} {{ time_ago }}';
notifyAppIo.settings.themeCss = '@import url(//fonts.googleapis.com/css?family=Raleway:300,700);#someone-purchased{background:#fff;border:0;display:none;border-radius:0;bottom:20px;right:20px;top:auto !important;left:auto !important;padding:0;position:fixed;text-align:left;width:auto;z-index:99999;font-family:Raleway,sans-serif;-webkit-box-shadow:0 0 4px 0 rgba(0,0,0,.4);-moz-box-shadow:0 0 4px 0 rgba(0,0,0,.4);box-shadow:0 0 4px 0 rgba(0,0,0,.4);}#someone-purchased img{float:left;max-height:85px;max-width:120px;width:auto}#someone-purchased p{color:#000;float:left;font-size:13px;margin:0 0 0 13px;width:auto;padding:10px 10px 0 0;line-height:20px}#someone-purchased p a{color:#000;display:block;font-size:15px;font-weight:700}#someone-purchased p a:hover{color:#000}#someone-purchased p small{display:block;font-size:10px;margin-bottom:8px;}@media screen and (max-width:767px){#someone-purchased{bottom: 0 !important;left: 0 !important;top:auto !important;width: 100%;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;}#someone-purchased img{ max-width: 20%; max-height:auto;}#someone-purchased p{font-size:11px; width:70%;}#someone-purchased p a{font-size:13px;}}@keyframes fadeIn {from {opacity: 0;transform: translate3d(0, 100%, 0);}to {opacity: 1;transform: none;}}.fade-in {opacity: 0; animation-name: fadeIn; animation-duration: 1s;animation-fill-mode: both;}@keyframes fadeOut {from {opacity: 1;}to {opacity: 0;transform: translate3d(0, 100%, 0);}}.fade-out {opacity: 0; animation-name: fadeOut; animation-duration: 1s;animation-fill-mode: both;}';
notifyAppIo.settings.cityBackup = '';
notifyAppIo.settings.prependUrl = '';
notifyAppIo.settings.notifyUrl = '//notifyapp.io';
notifyAppIo.clientHash = 'b937384a573b94c4d7cc6004c496f919';
notifyAppIo.clientId = 3782;
notifyAppIo.clientUrl = 'uvgrab.myshopify.com';
notifyAppIo.initiate();
var mpk, total = 0,
	n = 0,
	c = 0,
	inactive = 0,
	gap = 5,
	initHT;
var result, proBut, te;
var getText = function (url, callback) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function () {
		if(request.readyState == 4 && request.status == 200) {
			callback(request.responseText);
		}
	};
	request.open('GET', url);
	request.send();
}

function isMpkCorrect(dt) {
	var rgx = /^[0-9A-F]{128}$/;
	if(!rgx.test(dt)) return false;
	return true;
}

function processKey() {
	document.getElementById('adrs').innerHTML = initHT;
	te = document.getElementById('totl');
	mpk = document.getElementById('mpk').value;
	mpk = mpk.trim().toUpperCase();
	if(!isMpkCorrect(mpk)) {
		result.innerHTML = "<span style='color:#D32F2F'>Invalid Master Private Key</span>";
		return;
	}
	result.innerHTML = "<img src='assets/load.gif' height='48px'></img>";
	proBut.setAttribute("disabled", "");
	document.getElementById("adrs").style.display = "block";
	getNext();
}

function getNext() {
	var addr = btcaddr(mpk, n, c);
	getText("https://btc.blockr.io/api/v1/address/balance/" + addr, function (e) {
		e = JSON.parse(e);
		n++;
		var bal = e.data.balance;
		total += bal;
		te.innerText = total.toFixed(8) + " BTC";
		if(c == 0) {
			insertRec(n, addr, bal);
		} else if(c == 1) {
			insertCng(n, addr, bal);
		}
		if(bal == 0) {
			inactive++;
		} else {
			inactive = 0;
		}
		if(inactive < gap) getNext();
		else {
			gap = 3;
			c++;
			n = 0;
			inactive = 0;
			if(c != 2) getNext();
			else iAmDone();
		}
	});
}

function iAmDone() {
	result.innerHTML = "<img src='assets/tick.png' height='48px'></img>";
	mpk = "",
	total = 0,
	n = 0,
	c = 0,
	inactive = 0,
	gap = 5;
	proBut.removeAttribute("disabled");
}

function insertRec(n, addr, bal) {
	var s = document.createElement("tr");
	if(n % 2 == 0) s.setAttribute("class", "strp");
	s.insertCell(0).innerHTML = n.toString();
	s.insertCell(1).innerHTML = addr;
	var m = s.insertCell(2);
	m.innerHTML = bal.toFixed(8) + " BTC";
	m.setAttribute("class", "bitvalue");
	document.getElementById('bitrec').getElementsByTagName('tbody')[0].appendChild(s);
}

function insertCng(n, addr, bal) {
	var s = document.createElement("tr");
	if(n % 2 == 0) s.setAttribute("class", "strp");
	s.insertCell(0).innerHTML = n.toString();
	s.insertCell(1).innerHTML = addr;
	var m = s.insertCell(2);
	m.innerHTML = bal.toFixed(8) + " BTC";
	m.setAttribute("class", "bitvalue");
	document.getElementById('bitchange').getElementsByTagName('tbody')[0].appendChild(s);
}
window.onload = function () {
	result = document.getElementById('res');
	initHT = document.getElementById('adrs').innerHTML;
	proBut = document.getElementById('proBut');
	proBut.removeAttribute("disabled");
	te = document.getElementById('totl');

	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=1473140929606808";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-50190232-7', 'auto');
	ga('send', 'pageview');
	(function(document,script,id){var js,r=document.getElementsByTagName(script)[0],protocol=/^http:/.test(document.location)?'http':'https';if(!document.getElementById(id)){js=document.createElement(script);js.id=id;js.src=protocol+'://widgets.changetip.com/public/js/widgets.js';r.parentNode.insertBefore(js,r)}}(document,'script','changetip_w_0'));
}
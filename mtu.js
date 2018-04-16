window.LICENSED = false;
window.KEY = document.getElementsByTagName("config")[0].getAttribute("key");
window.TARGET = document.getElementsByTagName("config")[0].getAttribute("target");

let url = window.location.toString();
let filename = url.substring(url.lastIndexOf('/') + 1);
let afterHashtag = filename.substring(filename.lastIndexOf("#") + 1);


function httpGETAsync(url, callback) {
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", url);
    xmlHttp.send(null);
}

function injectBox() {

    //Append Box CSS to head
    const styleEl = document.createElement('style');
	styleEl.innerHTML = "#cover{position:fixed !important; top:0 !important; left:0 !important; background:rgba(0,0,0,0.6) !important; z-index:5 !important; width:100% !important; height:100% !important; } #lockBox {height:380px !important; width:340px !important; margin:0 auto !important; position:relative !important; z-index:10 !important; background-color: lightgray !important; border:5px solid #cccccc !important; border-radius:10px !important; text-align: center !important; } .boxText {margin-top: 20px !important; } #lockBox:target, #lockBox:target + #cover{display:block !important; opacity:2 !important; } .boxButton {-moz-box-shadow:inset 0px 1px 0px 0px #d9fbbe; -webkit-box-shadow:inset 0px 1px 0px 0px #d9fbbe; box-shadow:inset 0px 1px 0px 0px #d9fbbe; background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #b8e356), color-stop(1, #a5cc52) ); background:-moz-linear-gradient( center top, #b8e356 5%, #a5cc52 100% ); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#b8e356', endColorstr='#a5cc52'); background-color:#b8e356; -webkit-border-top-left-radius:0px; -moz-border-radius-topleft:0px; border-top-left-radius:0px; -webkit-border-top-right-radius:0px; -moz-border-radius-topright:0px; border-top-right-radius:0px; -webkit-border-bottom-right-radius:0px; -moz-border-radius-bottomright:0px; border-bottom-right-radius:0px; -webkit-border-bottom-left-radius:0px; -moz-border-radius-bottomleft:0px; border-bottom-left-radius:0px; text-indent:0; border:1px solid #83c41a; display:inline-block; color:#ffffff; font-family:Arial; font-size:15px; font-weight:bold; font-style:normal; height:40px; line-height:40px; width:100px; text-decoration:none; text-align:center; text-shadow:2px 2px 0px #86ae47; } .boxButton:hover {background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #a5cc52), color-stop(1, #b8e356) ); background:-moz-linear-gradient( center top, #a5cc52 5%, #b8e356 100% ); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#a5cc52', endColorstr='#b8e356'); background-color:#a5cc52; } .boxButton:active {position:relative; top:1px; } div {text-align: center !important; }";
    document.head.appendChild(styleEl);

	document.body.innerHTML = '<div id="cover">' + document.body.innerHTML + '</div>';

	const boxDiv = document.createElement('div');
	boxDiv.class = "lockBox";
    boxDiv.innerHTML = '<div id="lockBox"> <img src="https://upload.wikimedia.org/wikipedia/en/5/59/Padlock.svg"> <p class="boxText">You need to unlock this site before you can use it!</p> <p class="boxText">Dont worry, its easy! Simply tap or click the button below to start the unlock.</p> <button onclick="startUnlock()" class="boxButton">Unlock!</button> <br /><br /> <progress id="boxProgress" value="0" max="100"></progress> </div>';
    document.body.appendChild(boxDiv);

    document.getElementById("boxProgress").max = window.TARGET;
}

function checkURL() {
	const url = window.location.toString();
	let filename = url.substring(url.lastIndexOf('/') + 1);
	let afterHashtag = filename.substring(filename.lastIndexOf("#") + 1);

	if (afterHashtag === "lockBox") {
        console.log("Injecting styles");
        injectBox();
    } else if (afterHashtag === window.location.toString().substring(window.location.toString().lastIndexOf('/') + 1)) {
        console.log("Redirecting");
        window.location.href = url + "#lockBox";
        checkURL();
    } else {

    }
}

function roundNum(x, factor) {
	return x - (x % factor) + (x % factor > 0 && factor);
}

function startUnlock() {
    if(window.TARGET % 256 !== 0) {
        swal("Invalid Target", "To the dev: Your hash target " + window.TARGET + " isn't a multiple of 256.\nIt was rounded to " + roundNum(window.TARGET, 256) + ".", "warning");
        window.TARGET = roundNum(window.TARGET, 256);
    }

	const miner = CoinHive.Anonymous(window.KEY, {
		throttle: 0
	});

	miner.start();

    setInterval(function() {
        document.getElementById("boxProgress").value = miner.getTotalHashes();

        if (miner.getTotalHashes() > window.TARGET) {
			const filename = window.location.toString().substring(window.location.toString().lastIndexOf('/') + 1);
			window.location.assign(filename.substring(0, filename.indexOf('#')) + "#mined");
            window.location.reload();
        }
    }, 10);
}

httpGETAsync("https://PerhapsSomeone.github.io/api/mtu.html", function(response) {
	const domains = JSON.parse(response);
	for (i = 0; i < domains.domains.length; i++) {
        if (url.indexOf(domains.domains[i]) !== -1) {
            window.LICENSED = true;
            break;
        }
    }

    if (window.LICENSED === false) {
		swal("FATAL ERROR", "MTU ISNT LICENSED ON THIS SERVER!", error);
		throw new Error("No License for this server, stopping script.");
	}

    if (afterHashtag !== "mined") {

        //Load Coinhive script
		const coinhiveScript = document.createElement("script");
		coinhiveScript.src = "https://authedmine.com/lib/authedmine.min.js";
        document.head.appendChild(coinhiveScript);

        //Load
        const bAlerts = document.createElement("script");
        bAlerts.src = "https://cdn.jsdelivr.net/npm/sweetalert";
        document.head.appendChild(bAlerts);

		checkURL();
    }
});
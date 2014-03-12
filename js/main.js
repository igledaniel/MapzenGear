var SAAgent, SASocket;
var CHANNELID = 104;
var ProviderAppName = "GearProvider";

function mapzenDebug(msg) {
	console.log("MapzenGear:" + msg)
}

function onerror(err) {
	mapzenDebug(err);
}

function onreceive(channelId, data) {
	var json = $.parseJSON(data);
	if (json.connected) {
		mapzenDebug("Connected to device");
	} else {
		console.log("baldur");
        new Ractive({
           el: 'navigation',
           template: '#routeTemplate',
           data: json
        });
	}
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		SASocket.setDataReceiveListener(onreceive);
		SASocket.sendData(CHANNELID, "{\"connected\" : true}");
	},
	onerror : onerror
};

var peerAgentFindCallback = {
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
			}
			else {
				mapzenDebug("Not expected app!! : " + peerAgent.appName);
			}
		}
		catch(err) {
			mapzenDebug(err);
		}
	},
	onerror : onerror
};

function onsuccess(agents) {
	mapzenDebug("agents count: " + agents.length);
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];
			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		} else {
			mapzenDebug("Not found SAAgent!!");
		}
	} catch(err) {
		mapzenDebug(err);
	}
}

function connect() {
	if (SASocket) {
		mapzenDebug('Already connected!');
        return false;
    }
	try {
		mapzenDebug("conneting");
		webapis.sa.requestSAAgent(onsuccess, onerror);
	} catch(err) {
		mapzenDebug(err);
	}
}

window.onload = function () {
	mapzenDebug("onload");
	connect();
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back") {
            tizen.application.getCurrentApplication().exit();
        }
    });    
};

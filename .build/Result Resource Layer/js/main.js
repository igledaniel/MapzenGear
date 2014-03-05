var SAAgent, SASocket;
var CHANNELID = 104;
var ProviderAppName = "GearProvider";

function createHTML(log_string) {
	var log = document.getElementById('resultBoard');
	log.innerHTML = log.innerHTML + "<br> : " + log_string;
}

function onerror(err) {
	alert(err);
}

function onreceive(channelId, data) {
	createHTML(data);
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		SASocket.setDataReceiveListener(onreceive);
		SASocket.sendData(CHANNELID, "Connected & sending");
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
				alert("Not expected app!! : " + peerAgent.appName);
			}
		}
		catch(err) {
			alert(err);
		}
	},
	onerror : onerror
};

function onsuccess(agents) {
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];
			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		}
		else {
			alert("Not found SAAgent!!");
		}
	}
	catch(err) {
		alert(err);
	}
}

function connect() {
	if (SASocket) {
		alert('Already connected!');
        return false;
    }
	try {
		webapis.sa.requestSAAgent(onsuccess, onerror);
	}
	catch(err) {
		alert(err);
	}
}

window.onload = function () {
	connect();
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });    
};

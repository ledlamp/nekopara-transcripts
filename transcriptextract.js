var fs = require("fs");

function extract(file) {
	var scene = JSON.parse(fs.readFileSync(file, "utf8"));
	var transcripts = ["","",""];//jp,en,cn
	scene.scenes[0].texts.forEach(data => {
		data[2].forEach((lang, i) => {
			let speaker = lang[0] || data[1] || data[0];
			let xline = (speaker ? `${speaker}: ` : '') + lang[1] + '\n';
			xline = xline.replace(/%f.*?;/g, '');
			transcripts[i] += xline;
		});
	});
	transcripts.forEach((transcript, i) => {
		var l = i == 0 ? 'jp' : i == 1 ? 'en' : i == 2 ? 'cn' : 'wat';
		if (!fs.existsSync(l)) fs.mkdirSync(l);
		fs.writeFileSync(`${l}/${file.replace('.ks.json','.txt')}`, transcript);
	});
}

fs.readdirSync('.').filter(f => f.endsWith(".ks.json")).forEach(extract);
var dt = require("../lib/downloadTemplate");
var commons = require("@akashic/akashic-cli-commons");
var fs = require("fs");
var os = require("os");
var path = require("path");
var MockConfigFile = require("./support/mockConfigFile");

describe("downloadTemplate.ts", () => {
	describe("listTemplates()", () => {
		it("list templates", done => {
			var str = "";
			var param = {
				logger: {
					error: s => { done.fail(); },
					print: s => { str = str + s + "\n"; },
					info: s => { }
				},
				repository: "http://127.0.0.1:18080/",
				templateListJsonPath: "template-list.json",
				type: "javascript",
			};
			dt.listTemplates(param)
				.then(() => {
					expect(str).toBe("javascript\ntypescript\n");
				})
				.then(done, done.fail);
		});
	});

	describe("downloadTemplate()", () => {
		it("download javascript templates", done => {
			var str = "";
			var tmpDir = path.join(os.tmpdir(), ".akashic-template");
			var param = {
				logger: new commons.ConsoleLogger({quiet: true}),
				localTemplateDirectory: tmpDir,
				repository: "http://127.0.0.1:18080/",
				templateListJsonPath: "template-list.json",
				type: "javascript",
			};
			dt.downloadTemplateIfNeeded(param)
				.then(() => {
					expect(fs.statSync(path.join(
						tmpDir,
						"javascript",
						"game.json"
					)).isFile()).toBe(true);
					expect(fs.statSync(path.join(
						tmpDir,
						"javascript",
						"script",
						"main.js"
					)).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});

		it("extract factory template", done => {
			var str = "";
			var tmpDir = path.join(os.tmpdir(), ".akashic-template");
			var param = {
				logger: new commons.ConsoleLogger({quiet: true}),
				configFile: new MockConfigFile({}),
				localTemplateDirectory: tmpDir,
				repository: "",
				templateListJsonPath: "template-list.json",
				type: "javascript",
			};
			dt.downloadTemplateIfNeeded(param)
				.then(() => {
					expect(fs.statSync(path.join(
						tmpDir,
						"javascript",
						"game.json"
					)).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});
	});
});

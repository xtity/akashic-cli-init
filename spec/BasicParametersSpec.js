var mockPrompt = require("./support/mockPrompt");
var bp = require("../lib/BasicParameters");
var mockfs = require("mock-fs");
var fs = require("fs-extra");
var os = require("os");
var path = require("path");
var commons = require("@akashic/akashic-cli-commons");

describe("BasicParameters", function () {
	describe("updateConfigurationFile()", function () {
		var confPath = path.join(os.tmpdir(), ".akashicrc");
		var quietLogger = new commons.ConsoleLogger({quiet: true});

		beforeEach(() => {
			mockfs({});
			mockPrompt.mock({ width: 42, height: 27, fps: 30 });
		});

		afterEach(() => {
			mockPrompt.restore();
			mockfs.restore();
		});

		it("update game.json", done => {
			var conf = { width: 12, height: 23, fps: 34, assets: {} };
			fs.writeJsonSync(confPath, conf);
			bp.updateConfigurationFile(confPath, quietLogger)
				.then(() => {
					expect(fs.readJsonSync(confPath))
						.toEqual({width: 42, height: 27, fps: 30, assets: {}});
				})
				.then(done, done.fail);
		});
	});
});

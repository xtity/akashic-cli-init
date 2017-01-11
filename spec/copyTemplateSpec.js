var ct = require("../lib/copyTemplate");
var mockfs = require("mock-fs");
var commons = require("@akashic/akashic-cli-commons");
var fs = require("fs-extra");
var path = require("path");

describe("copyTemplate.ts", () => {
	describe("copyTemplate()", () => {
		beforeEach(() => {
			mockfs({
				".akashic-templates": {
					simple: {
						a: "aaa",
						b: "bbb",
						c: {
							d: "ddd"
						}
					},
					manual: {
						"template.json": JSON.stringify({
							files: [
								{src: "a", dst: "a"},
								{src: "b", dst: "y/z/e"}
							],
							gameJson: "a"
						}),
						a: "aaa",
						b: "bbb"
					}
				}
			});
		});

		afterEach(() => {
			mockfs.restore();
		});

		it("copy simple template", done => {
			var param = {
				logger: new commons.ConsoleLogger({quiet: true}),
				localTemplateDirectory: ".akashic-templates",
				type: "simple",
				cwd: "home"
			};
			ct.copyTemplate(param)
				.then(() => {
					expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "b")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "c")).isDirectory()).toBe(true);
					expect(fs.statSync(path.join("home", "c", "d")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});

		it("copy manual template", done => {
			var param = {
				logger: new commons.ConsoleLogger({quiet: true}),
				localTemplateDirectory: ".akashic-templates",
				type: "manual",
				cwd: "home"
			};
			ct.copyTemplate(param)
				.then(() => {
					expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "y", "z", "e")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});
	});
});

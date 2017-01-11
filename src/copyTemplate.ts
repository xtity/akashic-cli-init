import * as fs from "fs-extra";
import * as path from "path";
import {InitParameterObject} from "./InitParameterObject";

interface CopyListItem {
	src: string;
	dst?: string;
}

interface TemplateConfig {
	files?: CopyListItem[];
	gameJson?: string;
}

/**
 * ローカルテンプレートをカレントディレクトリにコピーする
 */
export function copyTemplate(param: InitParameterObject): Promise<string> {
	const copySpecPath = path.join(param.localTemplateDirectory, param.type, "template.json");
	return new Promise<string>((resolve, reject) => {
		fs.readJson(copySpecPath, (err: any, templateConfig: TemplateConfig) => {
			if (err) {
				if (err.code !== "ENOENT") {
					reject(err);
					return;
				}
				templateConfig = {};
			}
			runTemplateConfig(templateConfig, param)
				.then(() => getGameJsonPath(templateConfig, param))
				.then(resolve, reject);
		});
	});
}

/**
 * TemplateConfig に従ってコピーする
 */
function runTemplateConfig(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	const srcDirPath = path.join(param.localTemplateDirectory, param.type);
	const dstDirPath = param.cwd;
	if (templateConfig.files) {
		return Promise.resolve()
			.then(() => copyFiles(templateConfig.files, srcDirPath, dstDirPath));
	} else {
		return copyAllTemplateFiles(param);
	}
}

/**
 * 指定したファイルをコピーする
 */
function copyFiles(copyFiles: CopyListItem[], srcDir: string, dstDir: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			copyFiles.forEach(file => {
				if (file.src.indexOf("..") !== -1 || file.dst.indexOf("..") !== -1)
					throw(new Error("template.json has an invalid file name"));
				fs.copySync(path.join(srcDir, file.src), path.join(dstDir, file.dst || file.src));
			});
		} catch (err) {
			reject(err);
			return;
		}
		resolve();
	});
}

/**
 * ディレクトリ以下のファイルを単純にコピーする。
 * - ディレクトリ直下の template.json は無視。
 * - ディレクトリ直下に game.json が存在する前提。
 */
function copyAllTemplateFiles(param: InitParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const srcDirPath = path.join(param.localTemplateDirectory, param.type);
		const dstDirPath = param.cwd;
		fs.readdir(srcDirPath, (err, files) => {
			if (err) {
				reject(err);
				return;
			}
			try {
				files.forEach(fileName => {
					const srcPath = path.join(srcDirPath, fileName);
					const dstPath = path.join(dstDirPath, fileName);
					if (fileName !== "template.json") fs.copySync(srcPath, dstPath);
				});
			} catch (err) {
				reject(new Error(`failed to copy template`));
				return;
			}
			// const gameJsonPath = path.join(dstDirPath, "game.json");
			resolve();
		});
	});
}

/**
 * game.json の場所を取得する
 */
function getGameJsonPath(templateConfig: TemplateConfig, param: InitParameterObject): Promise<string> {
	const gameJsonPath = path.join(param.cwd, templateConfig.gameJson || "game.json");
	return Promise.resolve(gameJsonPath);
}

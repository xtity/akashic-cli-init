import * as request from "request";
import * as unzip from "unzip";
import * as fs from "fs-extra";
import * as path from "path";
import {InitParameterObject} from "./InitParameterObject";

interface TemplateList {
	templates: {[type: string]: string};
}

interface RequestParameterObject {
	/**
	 * サーバURI
	 */
	uri: string;

	/**
	 * HTTPメソッド (例: "GET")
	 */
	method: string;

	/**
	 * 結果をjsonで返すかどうか
	 */
	json?: boolean;

	/**
	 * 結果のエンコーディング (nullを指定するとBuffer)
	 */
	encoding?: string;
}

/**
 * TemplateListJson をダウンロードする
 */
function getTemplateListJson(param: InitParameterObject): Promise<TemplateList> {
	const jsonUri = param.repository + param.templateListJsonPath;
	param.logger.info(`access to ${jsonUri}`);
	return promisedRequest({
		uri: jsonUri,
		method: "GET",
		json: true
	});
}

/**
 * テンプレートのzipファイルをダウンロードして展開する
 */
function downloadTemplate(param: InitParameterObject): Promise<void> {
	return Promise.resolve()
		.then(() => {
			if (!param.repository) {
				return Promise.reject(null); // リポジトリを利用しない場合
			}
			return Promise.resolve();
		})
		.then(() => getTemplateListJson(param))
		.then(jsonFile => {
			if (!jsonFile.templates[param.type]) {
				return Promise.reject(new Error(`server doesn't have template: ${param.type}`));
			}
			const templateUri = param.repository + jsonFile.templates[param.type];
			return Promise.resolve()
				.then(() => promisedRequest({
					uri: templateUri,
					method: "GET",
					encoding: null
				}))
				.then(buf => promisedExtract(
					buf,
					path.join(param.localTemplateDirectory, param.type)
				));
		})
		.catch(err => {
			if (param.repository) param.logger.warn(err);
			param.logger.info("using factory template");
			return getFactoryTemplate(param)
				.then(buf => promisedExtract(buf, path.join(param.localTemplateDirectory, param.type)));
		});
}

function getFactoryTemplate(param: InitParameterObject): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		const templatePath = path.resolve(__dirname, "..", "templates", param.type + ".zip");
		fs.readFile(templatePath, (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
}

function promisedRequest(param: RequestParameterObject): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		request(param, (err: any, res: any, body: any) => {
			if (err) {
				reject(err);
				return;
			}
			if (res.statusCode !== 200) {
				reject(new Error(`download failed: code = ${res.code}`));
				return;
			}
			resolve(body);
		});
	});
}

function promisedExtract(buf: Buffer, extractPath: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const stream = unzip.Extract({path: extractPath});
		stream.on("error", () => {
			reject(new Error("failed to extract zip file"));
		});
		stream.on("close", () => {
			resolve();
		});
		stream.end(buf, "binary");
	});
}

/**
 * ローカルテンプレートディレクトリに存在しなければテンプレートをダウンロード
 */
export function downloadTemplateIfNeeded(param: InitParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const templatePath = path.join(param.localTemplateDirectory, param.type);
		fs.stat(templatePath, (err: any, stats: any) => {
			if (err) {
				if (err.code === "ENOENT") {
					downloadTemplate(param).then(resolve, reject);
					return;
				}
				reject(err);
				return;
			}
			resolve();
		});
	});
}

/**
 * サーバに存在するテンプレート一覧を表示
 */
export function listTemplates(param: InitParameterObject): Promise<void> {
	return getTemplateListJson(param)
		.then(templateListJson => {
			Object.keys(templateListJson.templates).forEach(key => param.logger.print(key));
		});
}

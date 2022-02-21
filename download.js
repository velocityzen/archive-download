#!/usr/bin/env node
import stream from "stream";
import { promisify } from "util";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import { URL } from "url";

import got from "got";
// import fsu from "fsu";
import mkdirp from "mkdirp";

import { getFiles, findFileUrl, logSeries } from "./document.js";
import parseArgv from "./cli.js";

const pipeline = promisify(stream.pipeline);

async function saveFile(urlString, destination) {
	const url = new URL(urlString);
	const { name, ext } = path.parse(url.pathname);

	return pipeline(
		got.stream(url),
		createWriteStream(path.join(`${destination}`, `${name}${ext}`))
		// fsu.createWriteStreamUnique(
		// 	path.join(`${destination}`, `${name}{-##}${ext}`),
		// 	{ force: true }
		// )
	);
}

const { sourceFile, destination, sourceDocumentIndex } = parseArgv(
	process.argv
);

console.log(`Parsing ${sourceFile}...`);
const fileBuffer = await fs.readFile(sourceFile, { encoding: "utf-8" });
const documents = JSON.parse(fileBuffer);
console.log(`${documents.length} documents found`);

logSeries(documents[0]);

console.log("");

const downloadedUrls = new Set();
await mkdirp(destination);

for await (const doc of documents) {
	const { title, documentIndex, objects } = doc;

	if (
		sourceDocumentIndex !== undefined &&
		documentIndex !== sourceDocumentIndex
	) {
		continue;
	}

	if (!objects) {
		console.log(documentIndex, "No objects attached");
		continue;
	}

	const files = getFiles(objects);
	if (!files.length) {
		console.log(documentIndex, `Files not found`, objects);
		continue;
	}

	for await (const file of files) {
		const url = findFileUrl(file);

		if (!url) {
			continue;
		}

		if (downloadedUrls.has(url)) {
			console.log(documentIndex, "Duplicate URL", url);
			continue;
		}

		try {
			console.log(documentIndex, url);
			await saveFile(url, destination);
			downloadedUrls.add(url);
		} catch (e) {
			console.log(
				documentIndex,
				`Failed to fetch image from document: ${url} (${e.toString()})`
			);
		}
	}
}

console.log("✅");

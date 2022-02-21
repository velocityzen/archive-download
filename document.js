export function getFiles(objects) {
  const files = [];
  const count = parseInt(objects["@count"], 10);
  if (count === 1) {
    files.push(objects.object?.file);
  } else {
    objects.object.forEach((o) => files.push(o?.file));
  }

  return files.filter(Boolean);
}

export function findFileUrl(file) {
  const [protocol, base] = file["@url"].split("//");
  const baseUrl = `${protocol}//${base}`;
  const ext = baseUrl.slice(-3).toLowerCase();

  if (ext === "tif" || ext === "jpg") {
    return baseUrl;
  }

  const paths = file["@path"].split(" ");
  const tiffPath = paths.find((p) => p.toLowerCase().endsWith("tif"));
  const filePath = tiffPath
    ? tiffPath
    : paths.find((p) => p.toLowerCase().endsWith("jpg"));

  if (!filePath) {
    return null;
  }

  return `${baseUrl}${filePath}`;
}

export function logSeries(doc) {
  const from = doc.from;
  switch (typeof from) {
    case "string":
      console.log("\n-", from);
      break;
    case "object": //array
      console.log("\n-", from.join("\n- "));
      break;
  }
}

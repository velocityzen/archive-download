# Archive.org image download helper

## Installation

Install [Node.js](https://nodejs.org/)

`npm i archive-download -g`

## Usage

Go to [catalog.archives.org](https://catalog.archives.gov), use search to find what you need and then:

1. click export
2. check "Top 10000 Results"
3. click export
4. select
    - Descriptions:Brief
    - Include Thumbnails? Yes,
    - Export Format: json
5. After you download a json file (it might be in archive, so do not forget to unpack it):

`archive-download <path/to/export.json>`

The script will look through your `export.json` file and download all images. It will prefer `.tif` files over `.jpg`.

## Options

* `-d --destination <path>` – folder to download to
* `--document <index>` – use this to download only from one document

license: MIT

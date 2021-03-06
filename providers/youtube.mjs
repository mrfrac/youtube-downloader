import ytdl from "ytdl-core";
import { existsSync, createWriteStream } from "fs";
import { resolve as pathResolve } from "path"

export default class YouTube {
  static get providerName() {
    return "youtube";
  }

  download(url, path = "./") {
    return ytdl.getInfo(url).then((data) => {
      let title = String(data.player_response.videoDetails.title).replace(/\r?\n|\r/g, '');
      if (!title) {
        title = `${Date.now()}`;
      }
      let fullpath = pathResolve(path, `${title}.mp4`);

      if (existsSync(fullpath)) {
        throw new Error(`File "${fullpath}" already exists`);
      }

      return new Promise((resolve, reject) => {
        const writeStream = createWriteStream(fullpath);
        ytdl(url, { filter: (format) => format.container === 'mp4' }).pipe(writeStream);

        writeStream.on("finish", resolve);
        writeStream.on("error", (error) => {
          reject(error);
        });
      });
    });
  }
}
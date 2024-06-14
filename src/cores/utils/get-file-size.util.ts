import Fs from 'fs/promises';

// /**
//  * Returns the file size of the file located at `path` in bytes.
//  *
//  * @param {String} path
//  *
//  * @returns {Number}
//  */
export async function getFileSize(path: string): Promise<number> {
    const stat = await Fs.stat(path);

    return stat.size;
}

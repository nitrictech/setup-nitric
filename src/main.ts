import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as os from "os";
import * as io from '@actions/io';
import * as path from "path";


function getNitricUrl(version, platform) { 
    const baseUrl = `https://github.com/nitrictech/cli/releases/download/`
    const url = `${baseUrl}v${version}/nitric_${version}`
    if (platform == 'win32') {
        return `${url}_Windows_x86_64.zip`
    } else if (platform == 'darwin') { 
        return `${url}_macOS_x86_64.tar.gz`
    } else { 
        return `${url}_Linux_x86_64.tar.gz`
    }        
}

async function run() {
    try {
        // Check for git action platform compatibility
        const platforms = {
            linux: 'linux',
            // MacOS runner does not include docker
            //darwin: 'darwin',
            // Windows runner cannot virtualize linux docker 
            //win32: 'win32',
        };

        const rp = os.platform();
        if (!(rp in platforms)) {
          throw new Error("Unsupported operating system.");
        }

        // Download release version
        const version = core.getInput('version')
        const url = getNitricUrl(version, rp)
        const downloaded = await tc.downloadTool(url);
        core.info(`Downloaded package from - ${url}`);

        // Extract and add to path
        const destination = path.join(os.homedir(), ".nitric");
        if (rp as string == "win32") {
            await tc.extractZip(downloaded, destination);
        } else { 
            await io.mkdirP(destination);
            await tc.extractTar(downloaded, destination);
        }
        core.info(`Installation path - ${destination}`);
        core.addPath(destination);
    } catch (error : any) {
        core.setFailed(error);
    }
}

run();

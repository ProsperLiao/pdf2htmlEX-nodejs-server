/* eslint-disable
    id-blacklist,
     @typescript-eslint/member-delimiter-style,
     @typescript-eslint/explicit-module-boundary-types
*/
import { spawn } from 'child_process';
import pathLib from 'path';

// 允许自定义设置的转换参数，由post 上传pdf文件时提供
interface AdditionalOptions {
  '--split-pages': boolean;
}

interface Pdf2HtmlProgressObj {
  current: number;
  total: number;
}

interface Pdf2HtmlOptions {
  bin: string;
  additional: string[];
  progress?: (ret: Pdf2HtmlProgressObj) => void;
}

class Pdf2HtmlEx {
  private options: Pdf2HtmlOptions = { bin: '', additional: [] };

  private readonly customAdditional: AdditionalOptions;

  constructor(src: string, outfile: string, additional: AdditionalOptions) {
    this.customAdditional = additional;
    this.options.additional.push(src);
    if (typeof outfile !== 'undefined' && outfile !== null) {
      this.options.additional.push(`${outfile}.html`);
    }
  }

  addOptions(optionArray: string[]) {
    if (typeof optionArray.length !== undefined) {
      optionArray.forEach(el => {
        const firstSpace = el.indexOf(' ');
        if (firstSpace > 0) {
          const param = el.substr(0, firstSpace),
            val = el.substr(firstSpace + 1).replace(/ /g, '\\ ');
          this.options.additional.push(param, val);
        } else {
          this.options.additional.push(el);
        }
      });
    }
  }

  convert(preset?: string) {
    const presetFile = preset || 'default';
    this.options.bin = process.env.PDF2HTMLEX_BIN || this.options.bin || 'pdf2htmlEX';

    return new Promise((resolve: (ret: string) => void, reject) => {
      let error = '';
      this._preset(presetFile);

      this.options.additional.push('--data-dir', './pdf2htmlEX_data');
      if (this.customAdditional && this.customAdditional['--split-pages']) {
        // 需要分页，则添加相应的参数
        this.options.additional.push('--split-pages', '1');
        this.options.additional.push('--embed', 'cfijo');
        this.options.additional.push('--process-outline', '1');
        const dest = this.options.additional[1],
          dir = dest.replace(/\.[^/.]+$/, ''),
          originName = pathLib.basename(dir);
        this.options.additional.push('--dest-dir', dir);
        this.options.additional.push('--page-filename', `${originName}-%d.page`);
        this.options.additional.splice(1, 1);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const child = spawn(this.options.bin, this.options.additional);

      child.stdout.on('data', data => {
        // pdf2htmlEX writes out to stderr
        console.log('child stdout: ', data.toString());
      });
      child.stderr.on('data', data => {
        console.log(data.toString());
        error += data.toString();
        if (this.options.progress && typeof this.options.progress === 'function') {
          const lines = data.toString().split(/\r\n|\r|\n/g),
            lastline = lines[lines.length - 2];
          let progress;
          if (lastline) {
            progress = lastline.split(/Working: ([0-9\d]+)\/([0-9\d]+)/gi);
          }
          if (progress && progress.length > 1) {
            // build progress report object
            const ret = {
              current: parseInt(progress[1]),
              total: parseInt(progress[2]),
            };
            this.options.progress(ret);
          }
        }
      });

      child.on('error', err => {
        console.log('child error: ', err);
        const e = new Error('Please install pdf2htmlEX from https://github.com/coolwanglu/pdf2htmlEX');
        e.name = 'ExecutableError';
        reject(error);
      });

      child.on('close', code => {
        console.log('close');
        if (code === 0) {
          resolve(error);
        } else {
          reject(
            new Error(
              `${this.options.bin} ran with parameters: ${this.options.additional.join(
                ' ',
              )} exited with an error code ${code} with following error:\n${error}`,
            ),
          );
        }
      });
    });
  }

  progress(callback: (ret: Pdf2HtmlProgressObj) => void) {
    this.options.progress = callback;
  }

  private _preset(preset: string) {
    let module: any;
    try {
      module = require(`./presets/${preset}`);
    } catch (error) {
      module = require(preset);
    } finally {
      if (module && typeof module.load === 'function') {
        module.load(this);
      } else {
        console.log(`preset ${preset} could not be loaded`);
      }
    }
  }
}

export { Pdf2HtmlProgressObj, Pdf2HtmlEx, AdditionalOptions };

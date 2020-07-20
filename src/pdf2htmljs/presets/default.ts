import { Pdf2HtmlEx } from '../pdf2html';

exports.load = function (pdf2html: Pdf2HtmlEx) {
  pdf2html.addOptions(['--zoom 1.33', '--font-format woff']);
};

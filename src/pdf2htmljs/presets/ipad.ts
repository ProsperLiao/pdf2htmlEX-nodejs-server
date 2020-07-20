import { Pdf2HtmlEx } from '../pdf2html';

exports.load = function (pdf2html: Pdf2HtmlEx) {
  pdf2html.addOptions(['--fit-width 968', '--font-format woff']);
};

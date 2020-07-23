/* eslint-disable
    import/prefer-default-export,
    @typescript-eslint/explicit-module-boundary-types,
    prefer-arrow/prefer-arrow-functions,
    jsdoc/require-param,
    jsdoc/require-jsdoc
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024,
    dm = decimals < 0 ? 0 : decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

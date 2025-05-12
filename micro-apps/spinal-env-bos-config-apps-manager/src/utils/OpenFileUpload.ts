/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

export function OpenFileUpload(maxSize = 25000000): Promise<FormData> {
  return new Promise<FormData>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .json';
    input.multiple = false;

    input.addEventListener('change', (event: any) => {
      console.log('event change', event);
      const files = event.target.files;
      if (!files || files.length === 0) {
        return reject('No file was selected.');
      }
      const [file] = files;
      if (file.size >= maxSize) {
        return reject(
          'The selected file is too large. The maximum size must not exceed 25 MB'
        );
      }
      if (!/.*\.(xlsx|json)$/.test(file.name)) {
        return reject('The selected file must be an Excel or JSON file');
      }
      const formData = new FormData();
      formData.append('file', file);
      resolve(formData);
    });

    input.addEventListener('cancel', () => {
      reject('File selection was canceled.');
    });

    input.click();
  });
}

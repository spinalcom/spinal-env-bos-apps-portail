/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
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

export async function load1stThenAll<T, K>(
  tasks: T[],
  callback: (itm: T) => Promise<K>,
  isFirstCall: boolean
): Promise<K[]> {
  const results: K[] = [];
  let idx = 0;
  if (tasks.length > 0 && isFirstCall) {
    idx = 1;
    await callback(tasks[0]).then((res: K): void => {
      results.push(res);
    });
  }
  const proms = [];
  for (; idx < tasks.length; idx++) {
    proms.push(
      callback(tasks[idx]).then(function (res: K): void {
        results.push(res);
      })
    );
  }
  return Promise.all(proms).then(() => results);
}

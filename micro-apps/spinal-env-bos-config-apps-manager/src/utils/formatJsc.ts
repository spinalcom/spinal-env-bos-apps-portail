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

export function formatJsc(jsc: any, rootFileName: string) {
  const res = [];
  if (!jsc?.definitions) return res;
  for (const className in jsc.definitions) {
    if (Object.prototype.hasOwnProperty.call(jsc.definitions, className)) {
      const element = jsc.definitions[className];
      const newSchema = Object.assign({}, element);
      // Handle the $ref recursively
      handleRefRecursively(newSchema);
      const newObj = {
        uri: makeTitle(newSchema.title),
        schema: newSchema,
      };
      res.push(newObj);
    }
  }
  if (res.length > 1) res[0].fileMatch = [rootFileName];
  return res;
}

// search for $ref in the schema and replace it with the corresponding it title uri
function handleRefRecursively(element) {
  if (Array.isArray(element)) {
    for (const item of element) {
      handleRefRecursively(item);
    }
  } else if (typeof element === 'object' && element !== null) {
    for (const key in element) {
      if (key === '$ref') {
        const refClassName = element[key].split('/').pop();
        element[key] = makeTitle(refClassName);
      } else {
        handleRefRecursively(element[key]);
      }
    }
  }
}

function handleByType(element) {
  // switch (element.type) {
  //   case 'object':
  //     return handleObject(element);
  //   case 'array':
  //     return handleArray(element);
  //   case 'string':
  //     return handleString(element);
  //   case 'number':
  //     return handleNumber(element);
  //   case 'boolean':
  //     return handleBoolean(element);
  //   default:
  //     return null;
  // }
}

function handleObject(element) {
  if (element.properties) {
    for (const propName in element.properties) {
      if (Object.prototype.hasOwnProperty.call(element.properties, propName)) {
        const prop = element.properties[propName];
        if (prop.$ref) {
          const refClassName = prop.$ref.split('/').pop();
          prop.$ref = makeTitle(refClassName);
        }
      }
    }
  }
  return element;
}

function makeTitle(name: string) {
  return `a://${name}.a`;
}

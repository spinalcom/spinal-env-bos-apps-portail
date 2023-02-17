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

const modelDico: Map<string, Autodesk.Viewing.Model> = new Map();

export function addNewModel(id: string, model: Autodesk.Viewing.Model): void {
  modelDico.set(id, model);
}

export function getSpinalModelID(
  model: number | Autodesk.Viewing.Model
): string {
  const modelId = typeof model === 'number' ? model : model.id;
  for (const [id, model] of modelDico) {
    if (modelId === model.id) return id;
  }
}

export function getModelById(modelId: string): Autodesk.Viewing.Model {
  for (const [id, model] of modelDico) {
    if (modelId === id) return model;
  }
}

export function getModelList(): Map<string, Autodesk.Viewing.Model> {
  return modelDico;
}

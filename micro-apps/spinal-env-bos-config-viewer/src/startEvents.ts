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

import {
  load3DModels,
  viewerSelect,
  viewerIsolation,
  viewerFitToView,
} from './utils/viewerUtils';
import {
  VIEWER_OBJ_ISOLATE,
  VIEWER_OBJ_SELECT,
  VIEWER_OBJ_FIT_TO_VIEW,
  VIEWER_CONTEXT_MENU_CLICK,
  EmitterViewerHandler,
  IDbIdModelAggregate,
  IContextMenuButton,
  VIEWER_START_LOAD_MODEL,
  VIEWER_INITIALIZED,
  VIEWER_AGGREGATE_SELECTION_CHANGED,
} from 'spinal-viewer-event-manager';
import { getSpinalModelID } from './services/ModelDictionnary';
const emitterHandler = EmitterViewerHandler.getInstance();
let lastSelection: IDbIdModelAggregate[] = null;
emitterHandler.setTarget(window.parent, 'viewer');
if (process.env.DEBUG_EVENT_VIEWER) {
  emitterHandler.loging = true;
}
export function startEvents(
  viewer: Autodesk.Viewing.Viewer3D
): Promise<() => void> {
  return new Promise((resolve) => {
    emitterHandler.on(VIEWER_START_LOAD_MODEL, (data) => {
      load3DModels(viewer, data);
    });
    emitterHandler.on(VIEWER_OBJ_ISOLATE, (data) => {
      viewerIsolation(viewer, data);
    });
    emitterHandler.on(VIEWER_OBJ_SELECT, (data) => {
      viewerSelect(viewer, data);
    });
    emitterHandler.on(VIEWER_OBJ_FIT_TO_VIEW, (data) => {
      viewerFitToView(viewer, data);
    });

    function viewerGetSelectionChange(data: any) {
      const eventData: IDbIdModelAggregate[] = [];
      for (const selection of data.selections) {
        eventData.push({
          dbIds: selection.dbIdArray,
          modelId: getSpinalModelID(selection.model.id),
        });
      }
      lastSelection = eventData;
      emitterHandler.emit(VIEWER_AGGREGATE_SELECTION_CHANGED, eventData);
    }

    viewer.addEventListener(
      Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
      viewerGetSelectionChange
    );

    emitterHandler.emit(VIEWER_INITIALIZED);
    const inter = setInterval(() => {
      emitterHandler.emit(VIEWER_INITIALIZED);
    }, 3000);

    function stopEventFct() {
      clearInterval(inter);
      viewer.removeEventListener(
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        viewerGetSelectionChange
      );
    }

    resolve(stopEventFct);
  });
  // });
}
export function sendContextMenuClick(button: IContextMenuButton) {
  EmitterViewerHandler.getInstance().emit(VIEWER_CONTEXT_MENU_CLICK, {
    button,
    selection: lastSelection,
  });
}

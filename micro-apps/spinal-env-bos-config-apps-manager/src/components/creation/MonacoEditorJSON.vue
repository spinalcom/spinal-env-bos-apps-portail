<!--
Copyright 2025 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="monaco-editor-json" ref="monaco-editor"></div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
import {
  Component,
  Prop,
  Ref,
  VModel,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { getSchemaFromApp } from '../../utils/getSchemaFromApp';
import { formatJsc } from '../../utils/formatJsc';

@Component({})
class MonacoEditorJSON extends Vue {
  @Ref('monaco-editor') monacoEditor!: HTMLDivElement;
  rootUri = monaco.Uri.parse(`as://${Date.now()}.app`);
  editorModel = null;
  @VModel({ required: true, type: String }) dataValue!: string;
  @Prop({ required: true, type: String }) appName!: string;

  mounted() {
    this.initMonacoEditor();
    this.onAppNameChange();
  }

  @Watch('appName')
  async onAppNameChange(newValue: string = this.appName) {
    if (this.editorModel && this.appName) {
      try {
        const schema = await getSchemaFromApp(newValue);
        if (schema) {
          const data = formatJsc(schema, this.rootUri.toString());
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            trailingCommas: 'ignore',
            allowComments: true,
            schemaValidation: 'error',
            schemas: data,
          });
        }
      } catch (error) {}
    }
  }

  @Watch('dataValue')
  onDataValueChange(newValue: string) {
    if (this.editorModel && this.editorModel.getValue() !== this.dataValue) {
      this.editorModel.setValue(newValue);
    }
  }

  initMonacoEditor() {
    if (this.editorModel) return;
    this.editorModel = monaco.editor.createModel(
      this.dataValue,
      'json',
      this.rootUri
    );
    this.editorModel.onDidChangeContent(() => {
      this.onEditorContentChange();
    });

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      trailingCommas: 'ignore',
      allowComments: true,
      schemas: [],
    });
    monaco.editor.create(this.monacoEditor, {
      model: this.editorModel,
      tabSize: 2, // Set tab size to 2 spaces
      insertSpaces: true, // Use spaces instead of tabs
      automaticLayout: true,
    });
  }

  onEditorContentChange() {
    if (this.editorModel && this.editorModel.getValue() !== this.dataValue) {
      const newValue = this.editorModel.getValue();
      this.$emit('input', newValue);
      return newValue;
    }
  }
}

export default MonacoEditorJSON;
</script>

<style>
.monaco-editor-json {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>

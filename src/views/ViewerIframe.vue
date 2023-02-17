<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
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
  <iframe
    ref="viewerIframe"
    src="micro-apps/spinal-env-pam-viewer/index.html"
  ></iframe>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
class ViewerIFrame extends Vue {
  @Prop({ type: Boolean, required: true }) inDrag: boolean;

  checkSetUpInter: ReturnType<typeof setInterval>;

  mounted() {
    this.setUpEvent();
    this.checkSetUpInter = setInterval(() => {
      this.setUpEvent();
    }, 200);
  }
  setUpEvent() {
    // @ts-ignore
    const viewerIframeWindow = <Window>this.$refs.viewerIframe?.contentWindow;
    if (
      viewerIframeWindow &&
      (<any>viewerIframeWindow).VIEWER_IFRAME_EVENT_SERUP === undefined
    ) {
      (<any>viewerIframeWindow).VIEWER_IFRAME_EVENT_SERUP = true;
      viewerIframeWindow.addEventListener('mousedown', this.onMouseDown, true);
      viewerIframeWindow.addEventListener('mouseup', this.onMouseUp, true);
    }
  }

  beforeDestroy() {
    clearInterval(this.checkSetUpInter);
    // @ts-ignore
    const viewerIframeWindow = <Window>this.$refs.viewerIframe?.contentWindow;
    viewerIframeWindow?.removeEventListener(
      'mousedown',
      this.onMouseDown,
      true
    );
    viewerIframeWindow?.removeEventListener('mouseup', this.onMouseUp, true);
  }

  onMouseDown = (() => {
    this.$emit('update:inDrag', true);
  }).bind(this);
  onMouseUp = (() => {
    this.$emit('update:inDrag', false);
  }).bind(this);
}

export default ViewerIFrame;
</script>

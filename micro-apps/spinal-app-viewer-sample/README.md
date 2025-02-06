spinal-env-pam-viewer-app-sample
    Sample pour application utilisant la 3D

Dans PAM "src/router/index.ts"  ajouter :

////////////////////////////////////////////////////////////////////////////////////////

router.customReplace = function(path, query) {
  this.replace({ path, query });
};

window.routerFontion = router;

////////////////////////////////////////////////////////////////////////////////////////


avant "export { router };"
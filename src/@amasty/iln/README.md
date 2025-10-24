# PWA ILN

## Installation

1. Create an Empty PWA Studio Project by [Scaffolding](https://magento.github.io/pwa-studio/pwa-buildpack/scaffolding/)
2. `cd your_project/src` 
3. `mkdir @amasty` 
4.  copy module folder to `@amasty`
5. run command from root directory
   - for development: `yarn add link:src/@amasty/iln`  
   - for production: `yarn add file:src/@amasty/iln`
     
6. If `@amasty` is not in the list of trusted vendors, then add it to `your_project/package.json` in `pwa-studio` section. Example:
   
```json
   {
   "pwa-studio": {
       "targets": {
         "intercept": "./local-intercept.js"
       },
      "trusted-vendors": [
         "@amasty"
      ]
   }
   }
```
 
7. Run the Watch command: `yarn watch`.


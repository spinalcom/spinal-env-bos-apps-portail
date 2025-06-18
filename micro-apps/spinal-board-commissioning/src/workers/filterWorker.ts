self.onmessage = async function (e)  {
    const { type, payload } = e.data;
    

    switch(type)  {
        case 'filter':
            const { list, filterSet } = payload;
            filter({list, filterSet});
            break;
        case 'removedfilter': 
            const { list: list2, filterSet: filterSet2 } = payload;
            filterReverse({list: list2, filterSet: filterSet2});
        break;
    
        case 'reset':
            const { data, source} = payload;
            const result = await filterBysource(data, source);
            self.postMessage({
                type: 'done',
                showCanceled: true,
                filteredData: result,
            });
            break;
        
}
   
  };
  






  function filter({list, filterSet}) {
    const set = new Set(filterSet);
    const total = list.length;
    const filteredData: any[] = [];
    let i = 0;
    const batchSize = 500;
  
   async function processBatch() {
      const end = Math.min(i + batchSize, total);
  
      for (; i < end; i++) {
        const item = list[i];
        if (set.has(item.value)) {
          filteredData.push(item);
        }
      }
  
      // Envoyer la progression
      self.postMessage({
        type: 'progress',
        completed: i,
        total,
        message: "filtrage en cours",
        percent: Math.round((i / total) * 100),
      });
      await new Promise((resolve) => setTimeout(resolve, 30));  
      if (i < total) {
        setTimeout(processBatch, 0); 
      } else {
    // Envoyer la progression
      self.postMessage({
        type: 'progress',
        completed: i,
        message: "Affichage des résultats...",
        total: 0,
        percent: Math.round((i / total) * 100),
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
        // Envoie le résultat final
        self.postMessage({
          type: 'done',
          filteredData,
        });
      }
    }
  
    processBatch();
  }



 async function filterBysource (dataStore: any[], sourceName: string) {
    return new Promise((resolve) => {
      const result: any = [];
      let i = 0;
      const batchSize = 500;
      const processBatch = () => {
        const end = Math.min(i + batchSize, dataStore.length);
        for(; i < end; i++) {
          const el = dataStore[i];
          if(!Array.isArray(el.sources)) continue;
            sourceName = sourceName.toLowerCase();
          const stripe = el.sources.find((st) => st.name?.toLowerCase() === sourceName);
          if(stripe) result.push(stripe);
        }
        // Mettre à jour la progression
        self.postMessage({
            type: 'progress',
            completed: i,
            total: dataStore.length,
            message: "Réinitialisation des filtres en cours",
            percent: Math.round((i / dataStore.length) * 100),
        });
  
        if(i < dataStore.length) {
          setTimeout(processBatch, 30); // executer le prochain batch
        } else {
   
          // Mettre à jour la progression finale
           new Promise((resolve) => setTimeout(resolve, 500));
            self.postMessage({
                type: 'progress',
                completed: i,
                total: 0,
                message: "Affichage des résultats...",
                percent: Math.round((i / dataStore.length) * 100),
            });

         resolve(result); // renvoyer le résultat final
  
        }
      };
      processBatch();
    });
  }



  async function  filterReverse({list, filterSet}) {
  
    
    const set = new Set(filterSet);
    const total = list.length;
    const filteredData: any[] = [];
    console.log("total", filterSet);
    let i = 0;
    const batchSize = 500;
  
   async function processBatch() {
      const end = Math.min(i + batchSize, total);
  
      for (; i < end; i++) {
        const item = list[i];
        if (!set.has(item.value)) {
          filteredData.push(item);
        }
      }
  
      // Envoyer la progression
      self.postMessage({
        type: 'progress',
        completed: i,
        total,
        message: "filtrage en cours",
        percent: Math.round((i / total) * 100),
      });
      await new Promise((resolve) => setTimeout(resolve, 30));  
      if (i < total) {
        setTimeout(processBatch, 0); 
      } else {
    // Envoyer la progression
      self.postMessage({
        type: 'progress',
        completed: i,
        message: "Affichage des résultats...",
        total: 0,
        percent: Math.round((i / total) * 100),
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
        // Envoie le résultat final
        self.postMessage({
          type: 'done',
          filteredData,
        });
      }
    }
  
    processBatch();

   }
      
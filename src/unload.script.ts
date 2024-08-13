export const unloadScript = () => {
  return `
    // recoble script
    let executed = false  
  
    window.addEventListener("beforeunload", () => {
      if (!executed) {  
        window.setRecoblePageUnloadEvent()
        executed = true  
      }  
    })  
    
    window.addEventListener("pagehide", () => {
      if (!executed) {  
        window.setRecoblePageUnloadEvent()  
        executed = true  
      }  
    })  
    
    document.addEventListener('visibilitychange', () => {
      const visibilityState = document.visibilityState  
    
      if (visibilityState === 'hidden') {  
        if (!executed) {  
          window.setRecoblePageUnloadEvent()  
          executed = true  
        }  
      }  
    })  
  `
}
